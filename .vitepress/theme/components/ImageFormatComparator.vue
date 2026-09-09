<template>
  <div class="comparator-card">
    <!-- Header van de tool -->
    <div class="comparator-header">
      <div class="comparator-title-area">
        <span class="comparator-badge">Interactieve Tool</span>
        <h3 class="comparator-title">Afbeeldingsvergelijker: WebP, JPEG &amp; PNG</h3>
        <p class="comparator-subtitle">
          Test hoe compressie, schaling en bestandsformaten de visuele kwaliteit en bestandsgrootte (kB) beïnvloeden.
        </p>
      </div>

      <div class="comparator-actions">
        <!-- Vergrootglas knop (zichtbaar als afbeelding geschaald is) -->
        <button
          v-if="isImageScaledDown"
          type="button"
          class="comp-btn"
          :class="isLoupeActive ? 'comp-btn-active' : 'comp-btn-secondary'"
          :title="isLoupeActive ? 'Vergrootglas uitschakelen' : 'Vergrootglas inschakelen (schaal 1:1)'"
          @click="isLoupeActive = !isLoupeActive"
        >
          <svg class="comp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </svg>
          <span>Vergrootglas 1:1</span>
          <span class="status-indicator" :class="{ 'on': isLoupeActive }"></span>
        </button>

        <input
          ref="fileInputRef"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          class="visually-hidden"
          @change="handleFileUpload"
        />
        <button
          type="button"
          class="comp-btn comp-btn-secondary"
          title="Upload een eigen afbeelding van je computer"
          @click="triggerUpload"
        >
          <svg class="comp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>Upload afbeelding</span>
        </button>

        <button
          v-if="isCustomImage"
          type="button"
          class="comp-btn comp-btn-ghost"
          title="Herstel naar de standaard voorbeeldfoto"
          @click="resetToDefaultImage"
        >
          <svg class="comp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          <span>Voorbeeldfoto</span>
        </button>
      </div>
    </div>

    <!-- Bedieningspaneel (Controls) -->
    <div class="comparator-controls">
      <!-- 1. Formaat switcher -->
      <div class="control-group">
        <label class="control-label">
          <span>Formaat</span>
          <span class="control-hint">Kies het gewenste webformaat</span>
        </label>
        <div class="format-toggle" role="radiogroup" aria-label="Afbeeldingsformaat">
          <button
            type="button"
            class="toggle-btn"
            :class="{ active: selectedFormat === 'webp' }"
            @click="selectedFormat = 'webp'"
          >
            WebP
            <span class="format-badge">Aanbevolen</span>
          </button>
          <button
            type="button"
            class="toggle-btn"
            :class="{ active: selectedFormat === 'jpeg' }"
            @click="selectedFormat = 'jpeg'"
          >
            JPEG
          </button>
          <button
            type="button"
            class="toggle-btn"
            :class="{ active: selectedFormat === 'png' }"
            @click="selectedFormat = 'png'"
          >
            PNG
          </button>
        </div>
      </div>

      <!-- 2. Kwaliteit / Compressieslider (WebP & JPEG) -->
      <div class="control-group">
        <div class="control-label-row">
          <label class="control-label" for="quality-slider">
            <span>Kwaliteit (compressie)</span>
          </label>
          <span v-if="selectedFormat !== 'png'" class="control-value">{{ quality }}%</span>
          <span v-else class="control-value-disabled">Lossless</span>
        </div>

        <input
          id="quality-slider"
          v-model.number="quality"
          type="range"
          min="1"
          max="100"
          step="1"
          class="comp-range"
          :disabled="selectedFormat === 'png'"
        />

        <div class="control-subtext">
          <span v-if="selectedFormat !== 'png'">
            Lager = kleiner bestand, maar meer compressie-artefacten.
          </span>
          <span v-else class="text-muted">
            PNG gebruikt altijd verliesloze (lossless) compressie. De kwaliteitsfactor is daarom niet instelbaar.
          </span>
        </div>
      </div>

      <!-- 3. Schaal / Resizing slider -->
      <div class="control-group">
        <div class="control-label-row">
          <label class="control-label" for="scale-slider">
            <span>Afbeelding schalen</span>
          </label>
          <span class="control-value">{{ scale }}% ({{ targetWidth }} &times; {{ targetHeight }} px)</span>
        </div>

        <input
          id="scale-slider"
          v-model.number="scale"
          type="range"
          min="10"
          max="100"
          step="5"
          class="comp-range"
        />

        <div class="control-subtext">
          Origineel: {{ originalWidth }} &times; {{ originalHeight }} pixels
        </div>
      </div>
    </div>

    <!-- Splitscreen Vergelijker (Before/After Slider) -->
    <div
      ref="containerRef"
      class="preview-container"
      :class="{ 'is-dragging': isDragging, 'is-loading': isProcessing }"
      @mousedown="startDrag"
      @touchstart.passive="startDragTouch"
      @mousemove="handleMouseMove"
      @mouseleave="handleMouseLeave"
      @click="handleClickOnPreview"
    >
      <!-- Achtergrond met dambordpatroon voor transparantie -->
      <div class="checkerboard-bg"></div>

      <!-- Rechter laag: Geoptimaliseerd beeld (onderste laag) -->
      <div class="image-layer optimized-layer">
        <img
          v-if="optimizedUrl"
          ref="optImageRef"
          :src="optimizedUrl"
          alt="Geoptimaliseerde versie"
          class="comp-image no-zoom"
          draggable="false"
          @load="updateRenderedDimensions"
        />
        <div class="image-tag tag-right">
          <span>Geoptimaliseerd: {{ selectedFormat.toUpperCase() }}</span>
          <span v-if="selectedFormat !== 'png'">({{ quality }}%)</span>
        </div>
      </div>

      <!-- Linker laag: Origineel beeld (bovenste laag met clip-path) -->
      <div
        class="image-layer original-layer"
        :style="{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }"
      >
        <img
          v-if="originalUrl"
          ref="origImageRef"
          :src="originalUrl"
          alt="Originele afbeelding"
          class="comp-image no-zoom"
          draggable="false"
          @load="updateRenderedDimensions"
        />
        <div class="image-tag tag-left">
          <span>Origineel ({{ originalFormatName }})</span>
        </div>
      </div>

      <!-- De interactieve scheidingslijn en handgreep -->
      <div
        class="slider-divider"
        :style="{ left: `${sliderPosition}%` }"
      >
        <div class="slider-handle" title="Sleep naar links of rechts om te vergelijken">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>

      <!-- VERGROOTGLAS (Schaal 1:1 Zoom Loupe) -->
      <div
        v-if="isLoupeActive && isImageScaledDown && isMouseOverImage && !isDragging"
        class="zoom-loupe"
        :style="{
          left: `${loupePosition.x}px`,
          top: `${loupePosition.y}px`
        }"
      >
        <!-- Rechter helft / onderlaag van de loep: Geoptimaliseerd 1:1 beeld -->
        <div
          class="loupe-view loupe-optimized"
          :style="optLoupeBackgroundStyle"
        ></div>

        <!-- Linker helft van de loep: Origineel 1:1 beeld (met clip-path conform de scheidingslijn) -->
        <div
          class="loupe-view loupe-original"
          :style="{
            ...origLoupeBackgroundStyle,
            clipPath: loupeClipPath
          }"
        ></div>

        <!-- Scheidingslijn binnen het vergrootglas als de loep over de scheidingsbalk zweeft -->
        <div
          v-if="loupeDividerVisible"
          class="loupe-internal-divider"
          :style="{ left: `${loupeDividerX}px` }"
        ></div>

        <!-- Dradenkruis in het centrum van de lens -->
        <div class="loupe-crosshair"></div>

        <!-- Badge op de rand van de lens -->
        <div class="loupe-badge">
          <span>1:1 pixelzoom</span>
        </div>
      </div>

      <!-- Laadindicator tijdens herberekening -->
      <div v-if="isProcessing" class="loading-overlay">
        <div class="spinner"></div>
      </div>
    </div>

    <!-- Instructiebalkje onder vergelijker met schaalindicator -->
    <div class="slider-help">
      <div class="help-content">
        <svg class="help-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span>
          Sleep de witte balk om te vergelijken.
          <template v-if="isImageScaledDown">
            De afbeelding is verkleind weergegeven ({{ previewDisplayPercent }}% van ware grootte).
            <span class="loupe-hint-text">
              {{ isLoupeActive ? 'Beweeg over de foto voor 1:1 pixelzoom.' : 'Schakel het vergrootglas in voor 1:1 pixelzoom.' }}
            </span>
          </template>
        </span>
      </div>

      <div v-if="isImageScaledDown" class="help-scale-badge">
        Preview: {{ previewDisplayPercent }}% &rarr; Vergrootglas: 100% (1:1)
      </div>
    </div>

    <!-- Statistieken en Webrichtlijnen Beoordeling -->
    <div class="metrics-panel">
      <!-- Origineel vs Geoptimaliseerd -->
      <div class="metrics-grid">
        <!-- Origineel kaartje -->
        <div class="metric-card">
          <div class="metric-card-header">
            <span class="metric-role">Origineel</span>
            <span class="metric-format">{{ originalFormatName }}</span>
          </div>
          <div class="metric-size">{{ formatFileSize(originalSize) }}</div>
          <div class="metric-dimensions">{{ originalWidth }} &times; {{ originalHeight }} pixels</div>
        </div>

        <!-- Pijl & Verschil badge -->
        <div class="metric-difference">
          <div
            class="difference-badge"
            :class="{
              'is-savings': savingsPercent > 0,
              'is-larger': savingsPercent < 0,
              'is-neutral': savingsPercent === 0
            }"
          >
            <span v-if="savingsPercent > 0">&darr; -{{ savingsPercent }}%</span>
            <span v-else-if="savingsPercent < 0">&uarr; +{{ Math.abs(savingsPercent) }}%</span>
            <span v-else>0%</span>
          </div>
          <div class="difference-label">
            {{ savingsPercent >= 0 ? 'kleiner' : 'groter' }}
          </div>
        </div>

        <!-- Geoptimaliseerd kaartje -->
        <div class="metric-card is-highlighted">
          <div class="metric-card-header">
            <span class="metric-role">Geoptimaliseerd</span>
            <span class="metric-format">{{ selectedFormat.toUpperCase() }}</span>
          </div>
          <div class="metric-size text-brand">{{ formatFileSize(optimizedSize) }}</div>
          <div class="metric-dimensions">{{ targetWidth }} &times; {{ targetHeight }} pixels</div>
        </div>
      </div>

      <!-- Beoordeling webgeschiktheid conform richtlijnen voor bestandsgrootte -->
      <div class="web-guideline-status" :class="`status-${webSuitability.level}`">
        <div class="guideline-icon-wrapper">
          <!-- Succes icoon -->
          <svg v-if="webSuitability.level === 'excellent' || webSuitability.level === 'good'" class="guideline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <!-- Info / Hero icoon -->
          <svg v-else-if="webSuitability.level === 'banner'" class="guideline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <!-- Waarschuwing icoon -->
          <svg v-else class="guideline-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>

        <div class="guideline-text">
          <div class="guideline-title">
            <strong>{{ webSuitability.title }}</strong>
            <span class="guideline-size-tag">{{ formatFileSize(optimizedSize) }}</span>
          </div>
          <div class="guideline-desc">{{ webSuitability.message }}</div>
        </div>
      </div>

      <!-- Downloadknop -->
      <div class="download-section">
        <button
          type="button"
          class="comp-btn comp-btn-primary download-btn"
          :disabled="!optimizedUrl || isProcessing"
          @click="downloadOptimizedImage"
        >
          <svg class="comp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Download geoptimaliseerde afbeelding ({{ selectedFormat.toUpperCase() }})</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

// Vaste instellingen
const DEFAULT_IMAGE_URL = '/sample-photo.jpg'
const LOUPE_SIZE = 190 // Diameter van de vergrootglaslens in pixels

// Element referenties
const fileInputRef = ref<HTMLInputElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const origImageRef = ref<HTMLImageElement | null>(null)
const optImageRef = ref<HTMLImageElement | null>(null)

// Afbeeldingseigenschappen
const isCustomImage = ref(false)
const originalUrl = ref<string>('')
const originalSize = ref<number>(0)
const originalWidth = ref<number>(1200)
const originalHeight = ref<number>(800)
const originalFormatName = ref<string>('JPEG')
const currentFileName = ref<string>('campus-geel')

// Instellingen bediening
const selectedFormat = ref<'webp' | 'jpeg' | 'png'>('webp')
const quality = ref<number>(80)
const scale = ref<number>(100)

// Geoptimaliseerde resultaten
const optimizedUrl = ref<string>('')
const optimizedSize = ref<number>(0)
const isProcessing = ref<boolean>(false)

// Splitscreen slider positie in % (0 - 100)
const sliderPosition = ref<number>(50)
const isDragging = ref<boolean>(false)

// VERGROOTGLAS (1:1 Zoom Loupe)
const isLoupeActive = ref<boolean>(true)
const isMouseOverImage = ref<boolean>(false)
const mousePos = ref<{ x: number; y: number }>({ x: 0, y: 0 })
const normalizedImgPos = ref<{ u: number; v: number }>({ u: 0.5, v: 0.5 })

// Rendered bounds van de afbeelding binnen de container (rekening houdend met object-fit: contain)
const renderedBounds = ref<{ x: number; y: number; width: number; height: number }>({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
})

let loadedImageElement: HTMLImageElement | null = null
let debounceTimer: ReturnType<typeof setTimeout> | null = null

// Doelafmetingen voor geoptimaliseerd bestand
const targetWidth = computed(() => {
  return Math.max(1, Math.round((originalWidth.value * scale.value) / 100))
})

const targetHeight = computed(() => {
  return Math.max(1, Math.round((originalHeight.value * scale.value) / 100))
})

// Controleert of de afbeelding op het scherm verkleind wordt weergegeven
const isImageScaledDown = computed(() => {
  if (!renderedBounds.value.width || !renderedBounds.value.height) return true
  return (
    renderedBounds.value.width < originalWidth.value ||
    renderedBounds.value.height < originalHeight.value
  )
})

// Percentage waarop de preview getoond wordt ten opzichte van de originele resolutie
const previewDisplayPercent = computed(() => {
  if (!originalWidth.value || !renderedBounds.value.width) return 100
  const p = Math.round((renderedBounds.value.width / originalWidth.value) * 100)
  return Math.min(100, Math.max(1, p))
})

// Besparingspercentage
const savingsPercent = computed(() => {
  if (!originalSize.value || !optimizedSize.value) return 0
  const ratio = 1 - (optimizedSize.value / originalSize.value)
  return Math.round(ratio * 100)
})

// Webgeschiktheid conform de cursusrichtlijnen
const webSuitability = computed(() => {
  const kb = optimizedSize.value / 1024

  if (kb <= 50) {
    return {
      level: 'excellent',
      title: 'Uitstekend geschikt voor het web',
      message: 'Zeer lichte bestandsgrootte. Ideaal voor artikels, mobiele gebruikers en snelle laadtijden.',
    }
  } else if (kb <= 80) {
    return {
      level: 'good',
      title: 'Ideaal voor gewone foto\'s',
      message: 'Voldoet perfect aan de richtlijn voor gewone foto\'s in artikels (maximaal 50 tot 80 kB).',
    }
  } else if (kb <= 150) {
    return {
      level: 'banner',
      title: 'Geschikt voor grote hero-banners',
      message: 'Binnen de limiet voor paginabanners en herofoto\'s (maximaal 100 tot 150 kB). Voor gewone artikels kan je de schaal of compressie nog wat bijstellen.',
    }
  } else {
    return {
      level: 'warning',
      title: 'Te zwaar voor een standaard webpagina',
      message: 'Dit bestand overschrijdt de aanbevolen richtlijn van 150 kB. Verlaag de schaal (%) of kies WebP met een iets lagere kwaliteit om vertraging te vermijden.',
    }
  }
})

// Positie van de loep (gecentreerd op de muiscursor)
const loupePosition = computed(() => {
  return {
    x: mousePos.value.x,
    y: mousePos.value.y,
  }
})

// Positie van de scheidingslijn binnen de loep
const loupeDividerX = computed(() => {
  if (!containerRef.value) return LOUPE_SIZE / 2
  const rect = containerRef.value.getBoundingClientRect()
  const dividerScreenX = (sliderPosition.value / 100) * rect.width
  const loupeLeft = mousePos.value.x - LOUPE_SIZE / 2
  return Math.round(dividerScreenX - loupeLeft)
})

const loupeDividerVisible = computed(() => {
  return loupeDividerX.value > 0 && loupeDividerX.value < LOUPE_SIZE
})

const loupeClipPath = computed(() => {
  const x = loupeDividerX.value
  if (x <= 0) return 'polygon(0 0, 0 0, 0 100%, 0 100%)' // Helemaal geoptimaliseerd
  if (x >= LOUPE_SIZE) return 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' // Helemaal origineel
  return `polygon(0 0, ${x}px 0, ${x}px 100%, 0 100%)`
})

// 1:1 Achtergrondstijl voor Origineel
const origLoupeBackgroundStyle = computed(() => {
  const W = originalWidth.value
  const H = originalHeight.value
  const px = normalizedImgPos.value.u * W
  const py = normalizedImgPos.value.v * H
  const posX = -px + LOUPE_SIZE / 2
  const posY = -py + LOUPE_SIZE / 2

  return {
    backgroundImage: `url(${originalUrl.value})`,
    backgroundSize: `${W}px ${H}px`,
    backgroundPosition: `${posX}px ${posY}px`,
  }
})

// 1:1 Achtergrondstijl voor Geoptimaliseerd
const optLoupeBackgroundStyle = computed(() => {
  const W = targetWidth.value
  const H = targetHeight.value
  const px = normalizedImgPos.value.u * W
  const py = normalizedImgPos.value.v * H
  const posX = -px + LOUPE_SIZE / 2
  const posY = -py + LOUPE_SIZE / 2

  return {
    backgroundImage: `url(${optimizedUrl.value || originalUrl.value})`,
    backgroundSize: `${W}px ${H}px`,
    backgroundPosition: `${posX}px ${posY}px`,
  }
})

function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 kB'
  const kb = bytes / 1024
  if (kb < 1000) {
    return `${kb.toFixed(1)} kB`
  }
  const mb = kb / 1024
  return `${mb.toFixed(2)} MB`
}

// Berekent de exacte afmetingen van de afbeelding binnen de container (object-fit: contain)
function updateRenderedDimensions() {
  if (!containerRef.value || !originalWidth.value || !originalHeight.value) return

  const containerRect = containerRef.value.getBoundingClientRect()
  const cW = containerRect.width
  const cH = containerRect.height

  const imgRatio = originalWidth.value / originalHeight.value
  const containerRatio = cW / cH

  let rW = 0
  let rH = 0
  let rX = 0
  let rY = 0

  if (imgRatio > containerRatio) {
    // Afbeelding is breder dan de container verhouding
    rW = cW
    rH = cW / imgRatio
    rX = 0
    rY = (cH - rH) / 2
  } else {
    // Afbeelding is hoger dan de container verhouding
    rH = cH
    rW = cH * imgRatio
    rX = (cW - rW) / 2
    rY = 0
  }

  renderedBounds.value = {
    x: rX,
    y: rY,
    width: rW,
    height: rH,
  }
}

// Muisbeweging over de preview registreren voor het vergrootglas
function handleMouseMove(event: MouseEvent) {
  if (!containerRef.value) return

  const rect = containerRef.value.getBoundingClientRect()
  const mouseX = event.clientX - rect.left
  const mouseY = event.clientY - rect.top

  mousePos.value = { x: mouseX, y: mouseY }

  // Controleer of de muis binnen de effectieve afbeelding staat
  const b = renderedBounds.value
  if (
    mouseX >= b.x &&
    mouseX <= b.x + b.width &&
    mouseY >= b.y &&
    mouseY <= b.y + b.height
  ) {
    isMouseOverImage.value = true
    const u = (mouseX - b.x) / b.width
    const v = (mouseY - b.y) / b.height
    normalizedImgPos.value = {
      u: Math.max(0, Math.min(1, u)),
      v: Math.max(0, Math.min(1, v)),
    }
  } else {
    isMouseOverImage.value = false
  }
}

function handleMouseLeave() {
  isMouseOverImage.value = false
}

// Afbeelding laden
function loadImageFromUrl(url: string, sizeEstimate?: number, formatName: string = 'JPEG') {
  if (typeof window === 'undefined') return

  isProcessing.value = true
  const img = new Image()

  img.onload = () => {
    loadedImageElement = img
    originalWidth.value = img.naturalWidth || img.width
    originalHeight.value = img.naturalHeight || img.height
    originalUrl.value = url
    originalFormatName.value = formatName

    updateRenderedDimensions()

    if (sizeEstimate) {
      originalSize.value = sizeEstimate
      scheduleOptimization()
    } else {
      fetch(url)
        .then((res) => res.blob())
        .then((blob) => {
          originalSize.value = blob.size
          scheduleOptimization()
        })
        .catch(() => {
          originalSize.value = 128 * 1024
          scheduleOptimization()
        })
    }
  }

  img.onerror = () => {
    isProcessing.value = false
  }

  img.src = url
}

// Optimalisatie via HTML5 Canvas
function runOptimization() {
  if (!loadedImageElement || typeof window === 'undefined') {
    isProcessing.value = false
    return
  }

  const w = targetWidth.value
  const h = targetHeight.value

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    isProcessing.value = false
    return
  }

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(loadedImageElement, 0, 0, w, h)

  let mimeType = 'image/webp'
  if (selectedFormat.value === 'jpeg') mimeType = 'image/jpeg'
  if (selectedFormat.value === 'png') mimeType = 'image/png'

  const q = selectedFormat.value === 'png' ? 1.0 : quality.value / 100

  canvas.toBlob(
    (blob) => {
      if (!blob) {
        isProcessing.value = false
        return
      }

      if (optimizedUrl.value && optimizedUrl.value.startsWith('blob:')) {
        URL.revokeObjectURL(optimizedUrl.value)
      }

      optimizedUrl.value = URL.createObjectURL(blob)
      optimizedSize.value = blob.size
      isProcessing.value = false
    },
    mimeType,
    q
  )
}

function scheduleOptimization() {
  isProcessing.value = true
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    runOptimization()
  }, 100)
}

watch([selectedFormat, quality, scale], () => {
  scheduleOptimization()
})

function triggerUpload() {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]
  const ext = file.name.split('.').pop()?.toUpperCase() || 'BESTAND'
  currentFileName.value = file.name.replace(/\.[^/.]+$/, '')

  const objectUrl = URL.createObjectURL(file)
  isCustomImage.value = true
  loadImageFromUrl(objectUrl, file.size, ext)
}

function resetToDefaultImage() {
  isCustomImage.value = false
  currentFileName.value = 'campus-geel'
  loadImageFromUrl(DEFAULT_IMAGE_URL, 127895, 'JPEG')
}

function downloadOptimizedImage() {
  if (!optimizedUrl.value || typeof window === 'undefined') return

  const ext = selectedFormat.value === 'jpeg' ? 'jpg' : selectedFormat.value
  const filename = `${currentFileName.value}-geoptimaliseerd-${targetWidth.value}x${targetHeight.value}.${ext}`

  const link = document.createElement('a')
  link.href = optimizedUrl.value
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Drag interactie voor de scheidingsbalk
function updateSliderPosition(clientX: number) {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  const x = clientX - rect.left
  let percent = (x / rect.width) * 100
  if (percent < 0) percent = 0
  if (percent > 100) percent = 100
  sliderPosition.value = Math.round(percent)
}

function startDrag(event: MouseEvent) {
  // Alleen starten als er geklikt wordt op de scheidingsbalk of handgreep, of wanneer het vergrootglas uit staat
  const target = event.target as HTMLElement
  if (target.closest('.slider-divider') || target.closest('.slider-handle') || !isLoupeActive.value) {
    isDragging.value = true
    updateSliderPosition(event.clientX)

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.value) return
      updateSliderPosition(e.clientX)
    }

    const onMouseUp = () => {
      isDragging.value = false
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }
}

function startDragTouch(event: TouchEvent) {
  isDragging.value = true
  if (event.touches.length > 0) {
    updateSliderPosition(event.touches[0].clientX)
  }

  const onTouchMove = (e: TouchEvent) => {
    if (!isDragging.value || e.touches.length === 0) return
    updateSliderPosition(e.touches[0].clientX)
  }

  const onTouchEnd = () => {
    isDragging.value = false
    window.removeEventListener('touchmove', onTouchMove)
    window.removeEventListener('touchend', onTouchEnd)
  }

  window.addEventListener('touchmove', onTouchMove, { passive: true })
  window.addEventListener('touchend', onTouchEnd)
}

function handleClickOnPreview(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (target.closest('.slider-handle')) return
  updateSliderPosition(event.clientX)
}

// Resize listener om bounds actueel te houden
function onWindowResize() {
  updateRenderedDimensions()
}

onMounted(() => {
  resetToDefaultImage()
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', onWindowResize)
  }
})

onUnmounted(() => {
  if (debounceTimer) clearTimeout(debounceTimer)
  if (optimizedUrl.value && optimizedUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(optimizedUrl.value)
  }
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', onWindowResize)
  }
})
</script>

<style scoped>
.comparator-card {
  margin: 2rem 0;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

/* Header */
.comparator-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
}

.comparator-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #fff;
  background-color: var(--tm-orange, #e87722);
  padding: 0.15rem 0.55rem;
  border-radius: 4px;
  margin-bottom: 0.35rem;
}

.comparator-title {
  margin: 0 !important;
  padding: 0 !important;
  font-size: 1.25rem !important;
  font-weight: 700 !important;
  color: var(--vp-c-text-1) !important;
  border: none !important;
}

.comparator-subtitle {
  margin: 0.25rem 0 0 !important;
  font-size: 0.875rem !important;
  color: var(--vp-c-text-2) !important;
}

.comparator-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

/* Knoppen algemeen */
.comp-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.85rem;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  user-select: none;
}

.comp-btn-secondary {
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-divider);
}

.comp-btn-secondary:hover {
  background-color: var(--vp-c-default-soft);
  border-color: var(--tm-orange, #e87722);
  color: var(--tm-orange, #e87722);
}

.comp-btn-active {
  background-color: rgba(232, 119, 34, 0.15);
  color: var(--tm-orange, #e87722);
  border-color: var(--tm-orange, #e87722);
  font-weight: 700;
}

.comp-btn-active:hover {
  background-color: rgba(232, 119, 34, 0.22);
}

.status-indicator {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: var(--vp-c-divider);
}

.status-indicator.on {
  background-color: #10b981;
  box-shadow: 0 0 6px #10b981;
}

.comp-btn-ghost {
  background-color: transparent;
  color: var(--vp-c-text-2);
  border-color: transparent;
}

.comp-btn-ghost:hover {
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
}

.comp-btn-primary {
  background-color: var(--tm-orange, #e87722);
  color: #ffffff;
  border-color: var(--tm-orange, #e87722);
}

.comp-btn-primary:hover:not(:disabled) {
  background-color: var(--vp-c-brand-2, #d4641a);
  border-color: var(--vp-c-brand-2, #d4641a);
}

.comp-btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.comp-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* Controls Grid */
.comparator-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
  background-color: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.control-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.control-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.control-hint {
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--vp-c-text-3);
}

.control-value {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--tm-orange, #e87722);
  font-family: var(--vp-font-family-mono);
}

.control-value-disabled {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  font-style: italic;
}

.control-subtext {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  min-height: 1.1rem;
}

.text-muted {
  color: var(--vp-c-text-3);
}

/* Formaat knoppenbalk */
.format-toggle {
  display: flex;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 3px;
  gap: 4px;
}

.toggle-btn {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.45rem 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn:hover:not(.active) {
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg);
}

.toggle-btn.active {
  background-color: var(--tm-orange, #e87722);
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(232, 119, 34, 0.3);
}

.format-badge {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  background-color: rgba(255, 255, 255, 0.25);
  padding: 0.05rem 0.3rem;
  border-radius: 3px;
}

/* Sliders */
.comp-range {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--vp-c-divider);
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
}

.comp-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--tm-orange, #e87722);
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
  transition: transform 0.1s ease;
}

.comp-range::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}

.comp-range:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Splitscreen Container */
.preview-container {
  position: relative;
  width: 100%;
  height: 460px;
  background-color: #161616;
  overflow: hidden;
  user-select: none;
  cursor: default;
}

@media (max-width: 640px) {
  .preview-container {
    height: 320px;
  }
}

.checkerboard-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(45deg, #222222 25%, transparent 25%),
    linear-gradient(-45deg, #222222 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #222222 75%),
    linear-gradient(-45deg, transparent 75%, #222222 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0;
  opacity: 0.35;
}

.image-layer {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.comp-image {
  max-width: 100% !important;
  max-height: 100% !important;
  width: 100%;
  height: 100%;
  object-fit: contain;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  border-radius: 0 !important;
  pointer-events: none !important;
}

/* Labels op de afbeelding */
.image-tag {
  position: absolute;
  top: 1rem;
  padding: 0.3rem 0.65rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  border-radius: 6px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.tag-left {
  left: 1rem;
  background-color: rgba(30, 45, 90, 0.85);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.tag-right {
  right: 1rem;
  background-color: rgba(232, 119, 34, 0.9);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Scheidingslijn en handgreep */
.slider-divider {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #ffffff;
  transform: translateX(-50%);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.7);
  cursor: col-resize;
  z-index: 10;
}

.slider-handle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 38px;
  height: 38px;
  background-color: #ffffff;
  color: #1a1a1a;
  border: 2px solid var(--tm-orange, #e87722);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  cursor: col-resize;
  transition: transform 0.15s ease;
}

.slider-handle:hover {
  transform: translate(-50%, -50%) scale(1.1);
}

.is-dragging .slider-handle {
  transform: translate(-50%, -50%) scale(1.15);
  background-color: var(--tm-orange, #e87722);
  color: #ffffff;
}

/* VERGROOTGLAS (1:1 Zoom Loupe) */
.zoom-loupe {
  position: absolute;
  width: 190px;
  height: 190px;
  border-radius: 50%;
  border: 3px solid #ffffff;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 20;
  background-color: #000000;
}

.loupe-view {
  position: absolute;
  inset: 0;
  background-repeat: no-repeat;
  image-rendering: auto;
}

/* Interne scheidingslijn binnen de loep */
.loupe-internal-divider {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: #ffffff;
  transform: translateX(-50%);
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.8);
}

/* Dradenkruis in het centrum van de loep */
.loupe-crosshair {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 18px;
  height: 18px;
}

.loupe-crosshair::before,
.loupe-crosshair::after {
  content: '';
  position: absolute;
  background-color: rgba(255, 255, 255, 0.75);
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
}

.loupe-crosshair::before {
  top: 8px;
  left: 0;
  width: 18px;
  height: 2px;
}

.loupe-crosshair::after {
  top: 0;
  left: 8px;
  width: 2px;
  height: 18px;
}

/* Badge op de loep */
.loupe-badge {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.15rem 0.5rem;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background-color: rgba(0, 0, 0, 0.75);
  color: #ffffff;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Spinner overlay */
.loading-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Hulpbalk */
.slider-help {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  background-color: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.help-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.help-icon {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  color: var(--vp-c-brand-1, #e87722);
}

.loupe-hint-text {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.help-scale-badge {
  font-size: 0.75rem;
  font-weight: 600;
  font-family: var(--vp-font-family-mono);
  padding: 0.15rem 0.5rem;
  background-color: var(--vp-c-bg-alt);
  border-radius: 4px;
  color: var(--vp-c-text-2);
}

/* Statistieken Paneel */
.metrics-panel {
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background-color: var(--vp-c-bg);
}

.metrics-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
}

@media (max-width: 640px) {
  .metrics-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}

.metric-card {
  padding: 1rem 1.25rem;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.metric-card.is-highlighted {
  border-color: rgba(232, 119, 34, 0.4);
  background-color: rgba(232, 119, 34, 0.05);
}

.metric-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.metric-role {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-2);
}

.metric-format {
  font-size: 0.75rem;
  font-weight: 700;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
  padding: 0.1rem 0.4rem;
  background-color: var(--vp-c-bg-alt);
  border-radius: 4px;
}

.metric-size {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  line-height: 1.2;
}

.text-brand {
  color: var(--tm-orange, #e87722) !important;
}

.metric-dimensions {
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
}

/* Verschil badge */
.metric-difference {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.difference-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  font-size: 1.1rem;
  font-weight: 800;
  border-radius: 20px;
  font-family: var(--vp-font-family-mono);
}

.difference-badge.is-savings {
  background-color: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.difference-badge.is-larger {
  background-color: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.difference-badge.is-neutral {
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
}

.difference-label {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--vp-c-text-2);
}

/* Webrichtlijnen Beoordeling */
.web-guideline-status {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 0.9rem 1.1rem;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.guideline-icon-wrapper {
  margin-top: 0.15rem;
}

.guideline-icon {
  width: 20px;
  height: 20px;
}

.guideline-text {
  flex: 1;
}

.guideline-title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
}

.guideline-size-tag {
  font-size: 0.75rem;
  font-weight: 700;
  font-family: var(--vp-font-family-mono);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}

.guideline-desc {
  margin-top: 0.2rem;
  font-size: 0.825rem;
  line-height: 1.4;
  color: var(--vp-c-text-2);
}

/* Statussen */
.status-excellent,
.status-good {
  background-color: rgba(16, 185, 129, 0.08);
  border-color: rgba(16, 185, 129, 0.3);
}

.status-excellent .guideline-icon,
.status-good .guideline-icon {
  color: #10b981;
}

.status-excellent .guideline-size-tag,
.status-good .guideline-size-tag {
  background-color: rgba(16, 185, 129, 0.2);
  color: #059669;
}

.status-banner {
  background-color: rgba(59, 130, 246, 0.08);
  border-color: rgba(59, 130, 246, 0.3);
}

.status-banner .guideline-icon {
  color: #3b82f6;
}

.status-banner .guideline-size-tag {
  background-color: rgba(59, 130, 246, 0.2);
  color: #2563eb;
}

.status-warning {
  background-color: rgba(239, 68, 68, 0.08);
  border-color: rgba(239, 68, 68, 0.3);
}

.status-warning .guideline-icon {
  color: #ef4444;
}

.status-warning .guideline-size-tag {
  background-color: rgba(239, 68, 68, 0.2);
  color: #dc2626;
}

/* Download knop */
.download-section {
  display: flex;
  justify-content: flex-end;
}

.download-btn {
  width: 100%;
  justify-content: center;
  padding: 0.75rem 1.25rem;
  font-size: 0.95rem;
}

@media (min-width: 640px) {
  .download-btn {
    width: auto;
  }
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
