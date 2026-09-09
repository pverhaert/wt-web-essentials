<template>
  <div class="favicon-gen-card">
    <!-- Header -->
    <div class="favicon-gen-header">
      <div class="favicon-gen-title-area">
        <span class="favicon-gen-badge">Interactieve Tool</span>
        <h3 class="favicon-gen-title">{{ title || 'Favicon Generator (.ico)' }}</h3>
        <p class="favicon-gen-subtitle">
          {{ description || 'Upload een vierkante afbeelding en zet ze direct om naar een volwaardig, multi-resolutie favicon.ico bestand voor jouw website.' }}
        </p>
      </div>
    </div>

    <!-- Upload & Dropzone -->
    <div class="favicon-gen-body">
      <div
        class="favicon-dropzone"
        :class="{ 'is-dragging': isDragging, 'has-file': !!sourceImageSrc }"
        @dragover.prevent="onDragOver"
        @dragleave.prevent="onDragLeave"
        @drop.prevent="onDrop"
        @click="triggerFileInput"
      >
        <input
          ref="fileInputRef"
          type="file"
          accept="image/png,image/jpeg,image/svg+xml,image/webp,image/gif"
          class="visually-hidden"
          @change="onFileSelected"
        />

        <div class="dropzone-content">
          <div class="dropzone-icon-wrap">
            <svg class="dropzone-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>

          <div class="dropzone-text">
            <span class="dropzone-main-text">Klik om een afbeelding te kiezen of sleep hierheen</span>
            <span class="dropzone-sub-text">Ondersteunt PNG, JPG, WebP en SVG (vierkante verhouding 1:1 aanbevolen)</span>
          </div>

          <div class="dropzone-actions" @click.stop>
            <button
              type="button"
              class="gen-btn gen-btn-secondary gen-btn-sm"
              @click="triggerFileInput"
            >
              Bestand kiezen
            </button>
            <button
              type="button"
              class="gen-btn gen-btn-ghost gen-btn-sm"
              title="Laad het Thomas More voorbeeldicoon"
              @click="loadSampleImage"
            >
              Gebruik voorbeeld
            </button>
          </div>
        </div>
      </div>

      <!-- Info over verhouding -->
      <div v-if="sourceMetadata" class="image-meta-bar" :class="{ 'is-square': sourceMetadata.isSquare }">
        <div class="meta-indicator">
          <svg v-if="sourceMetadata.isSquare" class="meta-icon success" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <svg v-else class="meta-icon warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <div class="meta-text">
          <span class="meta-title">
            Origineel: {{ sourceMetadata.width }} &times; {{ sourceMetadata.height }} pixels
            <template v-if="sourceMetadata.isSquare">(perfect vierkant)</template>
            <template v-else>(rechthoekig)</template>
          </span>
          <span class="meta-desc">
            <template v-if="sourceMetadata.isSquare">
              Ideale verhouding voor een favicon. Alle details blijven perfect behouden.
            </template>
            <template v-else>
              De afbeelding wordt automatisch vanuit het midden vierkant bijgesneden zonder vervorming.
            </template>
          </span>
        </div>
      </div>

      <!-- Previews Sectie -->
      <div v-if="isReady" class="favicon-preview-section">
        <h4 class="section-title">1. Live preview in browsertabblad</h4>

        <!-- Tabblad simulatie -->
        <div class="browser-mockup">
          <div class="browser-header">
            <div class="browser-window-controls">
              <span class="win-dot close"></span>
              <span class="win-dot minimize"></span>
              <span class="win-dot maximize"></span>
            </div>

            <!-- Tabblad balk -->
            <div class="browser-tabs-bar">
              <div class="browser-tab" :class="{ 'dark-tab': isDarkTabPreview }">
                <img v-if="preview16DataUrl" :src="preview16DataUrl" alt="Favicon preview" class="tab-favicon" />
                <span class="tab-title">Mijn Eerste Website</span>
                <span class="tab-close">&times;</span>
              </div>
            </div>

            <!-- Thema toggle voor tabblad -->
            <div class="tab-theme-toggle">
              <button
                type="button"
                class="tab-theme-btn"
                :class="{ 'is-active': !isDarkTabPreview }"
                title="Toon licht browsertabblad"
                @click="isDarkTabPreview = false"
              >
                Licht
              </button>
              <button
                type="button"
                class="tab-theme-btn"
                :class="{ 'is-active': isDarkTabPreview }"
                title="Toon donker browsertabblad"
                @click="isDarkTabPreview = true"
              >
                Donker
              </button>
            </div>
          </div>
          <div class="browser-address-bar">
            <span class="address-lock">&#128274;</span>
            <span class="address-url">https://mijn-project.netlify.app</span>
          </div>
        </div>

        <!-- Formaten Grid -->
        <h4 class="section-title mt-4">2. Gegenereerde resoluties in het .ico-bestand</h4>
        <div class="sizes-grid">
          <!-- 16x16 -->
          <div class="size-card">
            <div class="size-card-header">
              <span class="size-badge">16 &times; 16 px</span>
              <span class="size-role">Browsertabblad</span>
            </div>
            <div class="size-canvas-box">
              <img v-if="preview16DataUrl" :src="preview16DataUrl" alt="16x16 preview" class="preview-img size-16" />
            </div>
            <span class="size-zoom-label">Schaal 1:1</span>
          </div>

          <!-- 32x32 -->
          <div class="size-card">
            <div class="size-card-header">
              <span class="size-badge">32 &times; 32 px</span>
              <span class="size-role">Retinascherm &amp; Bladwijzer</span>
            </div>
            <div class="size-canvas-box">
              <img v-if="preview32DataUrl" :src="preview32DataUrl" alt="32x32 preview" class="preview-img size-32" />
            </div>
            <span class="size-zoom-label">Schaal 1:1</span>
          </div>

          <!-- 48x48 -->
          <div class="size-card">
            <div class="size-card-header">
              <span class="size-badge">48 &times; 48 px</span>
              <span class="size-role">Snelkoppeling &amp; Taakbalk</span>
            </div>
            <div class="size-canvas-box">
              <img v-if="preview48DataUrl" :src="preview48DataUrl" alt="48x48 preview" class="preview-img size-48" />
            </div>
            <span class="size-zoom-label">Schaal 1:1</span>
          </div>
        </div>

        <!-- Download & Actieknoppen -->
        <div class="favicon-download-box">
          <div class="download-info">
            <span class="download-title">Klaar om te gebruiken</span>
            <span class="download-subtitle">Het .ico-bestand bevat alle 3 de resoluties (16, 32 en 48 px) gebundeld met 32-bits transparantie.</span>
          </div>

          <div class="download-buttons">
            <button
              type="button"
              class="gen-btn gen-btn-primary gen-btn-lg"
              :disabled="isGenerating"
              @click="downloadIco"
            >
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download favicon.ico</span>
            </button>

            <button
              type="button"
              class="gen-btn gen-btn-secondary"
              title="Download ook een losse PNG van 32x32 pixels"
              @click="downloadPng32"
            >
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download PNG (32&times;32)</span>
            </button>
          </div>
        </div>

        <!-- HTML Code Snippet -->
        <div class="code-snippet-box">
          <div class="snippet-header">
            <span class="snippet-title">Plaats deze HTML in het &lt;head&gt;-element van je pagina:</span>
            <button
              type="button"
              class="copy-btn"
              :class="{ 'is-copied': isCopied }"
              @click="copyHtmlCode"
            >
              <svg v-if="!isCopied" class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <svg v-else class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{{ isCopied ? 'Gekopieerd!' : 'Kopieer code' }}</span>
            </button>
          </div>
          <pre class="snippet-pre"><code>&lt;!-- Plaats favicon.ico in de hoofdmap van je website (pas de href aan afhankelijk van de map waarin jouw HTML-pagina staat) --&gt;
&lt;link rel="icon" href="favicon.ico" sizes="any"&gt;
&lt;link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png"&gt;</code></pre>
          <p class="snippet-note">
            <strong>Let op:</strong> Het pad (de <code>href</code>) moet op elke pagina natuurlijk worden aangepast afhankelijk van de positie van die pagina in jouw site (bijvoorbeeld <code>../favicon.ico</code> als een pagina zich in een submap bevindt).
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps<{
  title?: string
  description?: string
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const isReady = ref(false)
const isGenerating = ref(false)
const isDarkTabPreview = ref(false)
const isCopied = ref(false)

const sourceImageSrc = ref<string>('')
const sourceMetadata = ref<{ width: number; height: number; isSquare: boolean } | null>(null)

const preview16DataUrl = ref<string>('')
const preview32DataUrl = ref<string>('')
const preview48DataUrl = ref<string>('')

// Sla de gegenereerde Blob buffers op
let generatedPngBlobs: { size: number; blob: Blob; buffer: ArrayBuffer }[] = []

function triggerFileInput() {
  fileInputRef.value?.click()
}

function onDragOver() {
  isDragging.value = true
}

function onDragLeave() {
  isDragging.value = false
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

function onFileSelected(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    processFile(target.files[0])
  }
}

function processFile(file: File) {
  const reader = new FileReader()
  reader.onload = (event) => {
    const src = event.target?.result as string
    loadImageAndGenerate(src)
  }
  reader.readAsDataURL(file)
}

function loadImageAndGenerate(src: string) {
  sourceImageSrc.value = src
  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.onload = async () => {
    sourceMetadata.value = {
      width: img.width,
      height: img.height,
      isSquare: img.width === img.height
    }

    await generateResolutions(img)
    isReady.value = true
  }
  img.src = src
}

async function generateResolutions(img: HTMLImageElement) {
  isGenerating.value = true
  generatedPngBlobs = []

  const sizes = [16, 32, 48]
  const minDim = Math.min(img.width, img.height)
  const sx = (img.width - minDim) / 2
  const sy = (img.height - minDim) / 2

  for (const size of sizes) {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')

    if (ctx) {
      ctx.clearRect(0, 0, size, size)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      // Teken vierkant gecentreerd
      ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size)

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((b) => resolve(b), 'image/png')
      })

      if (blob) {
        const buffer = await blob.arrayBuffer()
        generatedPngBlobs.push({ size, blob, buffer })

        const dataUrl = canvas.toDataURL('image/png')
        if (size === 16) preview16DataUrl.value = dataUrl
        if (size === 32) preview32DataUrl.value = dataUrl
        if (size === 48) preview48DataUrl.value = dataUrl
      }
    }
  }

  isGenerating.value = false
}

/**
 * Bouwt een volwaardig Windows .ico-bestand op met de 3 PNG-streams
 */
function buildIcoBuffer(): Blob | null {
  if (generatedPngBlobs.length === 0) return null

  const count = generatedPngBlobs.length
  const headerSize = 6
  const dirEntrySize = 16
  let totalSize = headerSize + count * dirEntrySize

  for (const item of generatedPngBlobs) {
    totalSize += item.buffer.byteLength
  }

  const icoBuffer = new ArrayBuffer(totalSize)
  const view = new DataView(icoBuffer)

  // 1. ICONDIR Header (6 bytes)
  view.setUint16(0, 0, true) // idReserved: moet 0 zijn
  view.setUint16(2, 1, true) // idType: 1 = ICO
  view.setUint16(4, count, true) // idCount: aantal afbeeldingen

  // 2. ICONDIRENTRY (16 bytes per afbeelding)
  let currentOffset = headerSize + count * dirEntrySize
  for (let i = 0; i < count; i++) {
    const entryPos = headerSize + i * dirEntrySize
    const { size, buffer: imgBuf } = generatedPngBlobs[i]

    view.setUint8(entryPos + 0, size >= 256 ? 0 : size) // bWidth
    view.setUint8(entryPos + 1, size >= 256 ? 0 : size) // bHeight
    view.setUint8(entryPos + 2, 0) // bColorCount (0 voor >= 8bpp)
    view.setUint8(entryPos + 3, 0) // bReserved
    view.setUint16(entryPos + 4, 1, true) // wPlanes
    view.setUint16(entryPos + 6, 32, true) // wBitCount (32-bit kleur)
    view.setUint32(entryPos + 8, imgBuf.byteLength, true) // dwBytesInRes
    view.setUint32(entryPos + 12, currentOffset, true) // dwImageOffset

    // Kopieer PNG binaire data op de berekende offset
    new Uint8Array(icoBuffer).set(new Uint8Array(imgBuf), currentOffset)
    currentOffset += imgBuf.byteLength
  }

  return new Blob([icoBuffer], { type: 'image/x-icon' })
}

function downloadIco() {
  const icoBlob = buildIcoBuffer()
  if (!icoBlob) return
  downloadBlob(icoBlob, 'favicon.ico')
}

function downloadPng32() {
  const png32 = generatedPngBlobs.find((p) => p.size === 32)
  if (png32) {
    downloadBlob(png32.blob, 'favicon-32x32.png')
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function copyHtmlCode() {
  const code = `<link rel="icon" href="favicon.ico" sizes="any">\n<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">`
  navigator.clipboard.writeText(code).then(() => {
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2500)
  })
}

function loadSampleImage() {
  // Standaard Thomas More stijl SVG logo
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="128" height="128">
    <rect width="128" height="128" rx="28" fill="#1E2D5A"/>
    <path d="M44 38 L22 64 L44 90" stroke="#E87722" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M84 38 L106 64 L84 90" stroke="#E87722" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <line x1="74" y1="36" x2="54" y2="92" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round"/>
  </svg>`
  const blob = new Blob([svg], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  loadImageAndGenerate(url)
}

onMounted(() => {
  // Laad automatisch het Thomas More voorbeeld zodat de tool direct operationeel is
  loadSampleImage()
})
</script>

<style scoped>
.favicon-gen-card {
  margin: 28px 0;
  border-radius: 12px;
  overflow: hidden;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.favicon-gen-header {
  padding: 18px 24px 16px;
  background-color: var(--vp-c-bg-elv);
  border-bottom: 1px solid var(--vp-c-divider);
}

.favicon-gen-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  margin-bottom: 8px;
}

.favicon-gen-title {
  margin: 0 0 6px !important;
  padding: 0 !important;
  font-size: 18px !important;
  font-weight: 700 !important;
  color: var(--vp-c-text-1) !important;
  border: none !important;
}

.favicon-gen-subtitle {
  margin: 0 !important;
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.favicon-gen-body {
  padding: 24px;
}

/* Dropzone */
.favicon-dropzone {
  border: 2px dashed var(--vp-c-divider);
  border-radius: 10px;
  padding: 28px 20px;
  text-align: center;
  background-color: var(--vp-c-bg-elv);
  cursor: pointer;
  transition: all 0.2s ease;
}

.favicon-dropzone:hover,
.favicon-dropzone.is-dragging {
  border-color: var(--vp-c-brand-1);
  background-color: var(--tm-light-blue, #e8f3fc);
}

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.dropzone-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.dropzone-icon {
  width: 24px;
  height: 24px;
}

.dropzone-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dropzone-main-text {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.dropzone-sub-text {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.dropzone-actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}

/* Metadata balk */
.image-meta-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding: 10px 16px;
  border-radius: 8px;
  background-color: rgba(2, 132, 199, 0.08);
  border: 1px solid rgba(2, 132, 199, 0.2);
}

.image-meta-bar.is-square {
  background-color: rgba(5, 150, 105, 0.08);
  border-color: rgba(5, 150, 105, 0.25);
}

.meta-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.meta-icon.success {
  color: #059669;
}

.meta-icon.warning {
  color: #0284c7;
}

.meta-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.meta-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.meta-desc {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

/* Previews */
.favicon-preview-section {
  margin-top: 24px;
}

.section-title {
  margin: 0 0 12px !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  color: var(--vp-c-text-1) !important;
  border: none !important;
}

.mt-4 {
  margin-top: 24px !important;
}

/* Browser Mockup */
.browser-mockup {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-elv);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.browser-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px 0;
  background-color: #e4e7eb;
  border-bottom: 1px solid #d1d5db;
}

.dark .browser-header {
  background-color: #1e2533;
  border-bottom-color: #2e384d;
}

.browser-window-controls {
  display: flex;
  gap: 6px;
  padding-bottom: 8px;
}

.win-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.win-dot.close { background-color: #ef4444; }
.win-dot.minimize { background-color: #f59e0b; }
.win-dot.maximize { background-color: #10b981; }

.browser-tabs-bar {
  flex: 1;
  display: flex;
}

.browser-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 16px 8px;
  border-radius: 8px 8px 0 0;
  background-color: #ffffff;
  color: #1f2937;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.05);
}

.browser-tab.dark-tab {
  background-color: #0f172a;
  color: #f1f5f9;
}

.tab-favicon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.tab-title {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tab-close {
  font-size: 15px;
  opacity: 0.6;
  margin-left: 6px;
}

.tab-theme-toggle {
  display: flex;
  gap: 4px;
  padding-bottom: 8px;
}

.tab-theme-btn {
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s ease;
}

.dark .tab-theme-btn {
  background-color: #2a3449;
  border-color: #3b4760;
  color: #94a3b8;
}

.tab-theme-btn.is-active {
  background-color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #ffffff;
}

.browser-address-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background-color: #f8fafc;
  font-size: 12px;
  color: #64748b;
}

.dark .browser-address-bar {
  background-color: #141a24;
  color: #94a3b8;
}

.address-lock {
  font-size: 11px;
}

.address-url {
  font-family: monospace;
}

/* Grid formaten */
.sizes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-top: 12px;
}

.size-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border-radius: 10px;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  text-align: center;
}

.size-card-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 14px;
}

.size-badge {
  font-size: 13px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.size-role {
  font-size: 11px;
  color: var(--vp-c-text-2);
}

.size-canvas-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 8px;
  background-color: var(--tm-light-blue, #e8f3fc);
  border: 1px solid var(--vp-c-divider);
  margin-bottom: 10px;
}

.preview-img {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
}

.size-16 {
  width: 16px;
  height: 16px;
}

.size-32 {
  width: 32px;
  height: 32px;
}

.size-48 {
  width: 48px;
  height: 48px;
}

.size-zoom-label {
  font-size: 11px;
  color: var(--vp-c-text-3);
}

/* Download Box */
.favicon-download-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 24px;
  padding: 18px 20px;
  border-radius: 10px;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
}

.download-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.download-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.download-subtitle {
  font-size: 13px;
  color: var(--vp-c-text-2);
  max-width: 480px;
}

.download-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* Algemene Knoppen */
.gen-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.gen-btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.gen-btn-lg {
  padding: 10px 20px;
  font-size: 14px;
}

.gen-btn-primary {
  background-color: var(--vp-c-brand-1);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(232, 119, 34, 0.3);
}

.gen-btn-primary:hover:not(:disabled) {
  background-color: var(--vp-c-brand-2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(232, 119, 34, 0.4);
}

.gen-btn-secondary {
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.gen-btn-secondary:hover {
  background-color: var(--vp-c-bg-elv);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.gen-btn-ghost {
  background: transparent;
  color: var(--vp-c-text-2);
  border: 1px solid transparent;
}

.gen-btn-ghost:hover {
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-brand-soft);
}

.btn-icon {
  width: 16px;
  height: 16px;
}

/* Code Snippet Box */
.code-snippet-box {
  margin-top: 20px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-elv);
}

.snippet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  background-color: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.snippet-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-elv);
  color: var(--vp-c-text-2);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.copy-btn:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.copy-btn.is-copied {
  color: #059669;
  border-color: #059669;
  background-color: rgba(5, 150, 105, 0.1);
}

.copy-icon {
  width: 13px;
  height: 13px;
}

.snippet-pre {
  margin: 0 !important;
  padding: 12px 16px !important;
  font-size: 12px !important;
  line-height: 1.6 !important;
  font-family: var(--vp-font-family-mono);
  background-color: var(--vp-c-bg-elv) !important;
  overflow-x: auto;
}

.snippet-note {
  margin: 0 !important;
  padding: 10px 16px !important;
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg-soft);
  border-top: 1px solid var(--vp-c-divider);
}

.snippet-note code {
  font-size: 0.78rem;
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
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

@media (max-width: 640px) {
  .favicon-gen-body {
    padding: 16px;
  }
  .favicon-download-box {
    flex-direction: column;
    align-items: stretch;
  }
  .download-buttons {
    flex-direction: column;
  }
  .gen-btn {
    justify-content: center;
  }
}
</style>
