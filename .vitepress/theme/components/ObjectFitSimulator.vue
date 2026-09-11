<template>
  <div class="of-simulator">
    <div class="of-header">
      <div class="of-header-title">
        <svg class="of-title-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        <span class="of-label">Object-fit &amp; Object-position Simulator</span>
      </div>
      <span class="of-badge">Interactieve demonstratie</span>
    </div>

    <div class="of-body">
      <!-- 1. BEDIENINGSPANEEL -->
      <div class="of-controls">
        <!-- Keuze voor object-fit -->
        <div class="of-control-group">
          <label class="of-group-label">1. Kies de waarde voor <code>object-fit</code>:</label>
          <div class="of-button-grid">
            <button
              v-for="fit in fitOptions"
              :key="fit.value"
              type="button"
              class="of-btn"
              :class="{ 'is-active': activeFit === fit.value }"
              @click="activeFit = fit.value"
            >
              <code>{{ fit.value }}</code>
              <span class="of-btn-desc">{{ fit.label }}</span>
            </button>
          </div>
        </div>

        <!-- Keuze voor container aspect ratio / formaat -->
        <div class="of-control-group">
          <label class="of-group-label">2. Afmetingen van de afbeeldingskader (ouder/kaart):</label>
          <div class="of-pill-group">
            <button
              v-for="ratio in ratioOptions"
              :key="ratio.id"
              type="button"
              class="of-pill"
              :class="{ 'is-active': activeRatio === ratio.id }"
              @click="activeRatio = ratio.id"
            >
              {{ ratio.name }} ({{ ratio.dims }})
            </button>
          </div>
        </div>

        <!-- 3x3 Positierooster voor object-position -->
        <div class="of-control-group" :class="{ 'is-disabled': activeFit === 'fill' }">
          <div class="of-group-label-row">
            <label class="of-group-label">3. Kies uitsnede met <code>object-position</code>:</label>
            <span v-if="activeFit === 'fill'" class="of-disabled-note">(geen effect bij fill)</span>
          </div>
          <div class="of-pos-grid">
            <button
              v-for="pos in positionOptions"
              :key="pos.value"
              type="button"
              class="of-pos-btn"
              :class="{ 'is-active': activePos === pos.value }"
              :disabled="activeFit === 'fill'"
              @click="activePos = pos.value"
              :title="pos.value"
            >
              <span class="of-pos-dot"></span>
              <span class="of-pos-label">{{ pos.shortLabel }}</span>
            </button>
          </div>
          <div class="of-pos-current">
            Geselecteerde positie: <code>object-position: {{ activePos }};</code>
          </div>
        </div>

        <!-- 4. GHOST EFFECT SCHAKELAAR -->
        <div class="of-control-group">
          <div class="of-ghost-toggle-row">
            <label class="of-ghost-toggle">
              <input type="checkbox" v-model="showGhost" class="of-checkbox" />
              <span class="of-ghost-label">
                <strong>Toon afgeknipte zones (Ghost effect)</strong>
                <span class="of-ghost-sub">Maakt zichtbaar welke delen van de afbeelding buiten het kader vallen of afgesneden worden</span>
              </span>
            </label>
          </div>
        </div>
      </div>

      <!-- 2. UITLEGKAART -->
      <div class="of-explanation-card">
        <div class="of-explanation-header">
          <span class="of-tag">{{ currentFitInfo.badge }}</span>
          <h4 class="of-explanation-title">Hoe werkt <code>object-fit: {{ activeFit }}</code>?</h4>
        </div>
        <p class="of-explanation-text">{{ currentFitInfo.description }}</p>
        <div class="of-explanation-details">
          <div class="of-detail-item">
            <span class="of-detail-label">Beeldverhouding behouden?</span>
            <span class="of-detail-value" :class="currentFitInfo.aspectPreserved ? 'text-ok' : 'text-warn'">
              {{ currentFitInfo.aspectPreserved ? 'Ja, afbeelding vervormt nooit' : 'Nee, afbeelding wordt uitgerekt/samengedrukt!' }}
            </span>
          </div>
          <div class="of-detail-item">
            <span class="of-detail-label">Volledig kader opgevuld?</span>
            <span class="of-detail-value">
              {{ currentFitInfo.fillsContainer ? 'Ja, geen lege ruimtes (eventueel bijgesneden)' : 'Nee, er kunnen lege balken ontstaan' }}
            </span>
          </div>
          <div class="of-detail-item">
            <span class="of-detail-label">Typisch praktijkgebruik:</span>
            <span class="of-detail-value"><em>{{ currentFitInfo.usage }}</em></span>
          </div>
        </div>
      </div>

      <!-- 3. LIVE WEERGAVE MET GHOST EFFECT -->
      <div class="of-preview-stage">
        <div class="of-stage-header">
          <span class="of-stage-title">Visueel resultaat in browser</span>
          <div class="of-stage-legend">
            <span class="of-legend-item"><span class="of-legend-box cadre"></span> Kader</span>
            <span v-if="showGhost" class="of-legend-item"><span class="of-legend-box ghost"></span> Afgeknipt (Ghost)</span>
          </div>
        </div>

        <div class="of-stage-content">
          <div
            class="of-stage-wrapper"
            :style="{
              width: currentRatioDimensions.w + 'px',
              height: currentRatioDimensions.h + 'px'
            }"
          >
            <!-- GHOST LAAG: toont de volledige afbeelding op ware geschaalde positie buiten het kader -->
            <div
              v-if="showGhost && hasClippedAreas"
              class="of-ghost-layer"
              :style="ghostLayerStyle"
            >
              <img
                :src="sampleImgUrl"
                alt="Ghost weergave van volledige afbeelding"
                class="of-ghost-img"
              />
              <span class="of-ghost-badge">Afgeknipt deel</span>
            </div>

            <!-- ECHTE BROWSER KADER (OVERFLOW CLIP) -->
            <div
              class="of-target-frame"
              :class="{ 'has-ghost-active': showGhost && hasClippedAreas }"
            >
              <img
                :src="sampleImgUrl"
                alt="Noorderlicht over berglandschap"
                class="of-target-img"
                :style="{
                  objectFit: activeFit,
                  objectPosition: activePos
                }"
              />
              <div class="of-frame-badge">
                Zichtbaar kader ({{ currentRatioDimensions.w }} &times; {{ currentRatioDimensions.h }})
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. GEGENEREERDE CODE -->
      <div class="of-code-panel">
        <div class="of-code-header">
          <span class="of-code-label">Gegenereerde CSS</span>
          <button type="button" class="of-copy-btn" @click="copyCode">
            {{ copied ? 'Gekopieerd!' : 'Kopieer CSS' }}
          </button>
        </div>
        <pre class="of-pre"><code>{{ generatedCss }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activeFit = ref<'cover' | 'contain' | 'fill' | 'none' | 'scale-down'>('cover')
const activeRatio = ref<'wide' | 'square' | 'portrait'>('wide')
const activePos = ref<string>('center center')
const showGhost = ref<boolean>(true)
const copied = ref<boolean>(false)

// Sample foto: 800 x 533 pixels (verhouding 3:2 oftewel 1.5)
const sampleImgUrl = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80'
const naturalW = 800
const naturalH = 533
const naturalAspect = naturalW / naturalH // ~1.5009

const fitOptions = [
  { value: 'cover', label: 'Vult kader, behoudt verhouding, snijdt bij' },
  { value: 'contain', label: 'Toont alles, behoudt verhouding, balken' },
  { value: 'fill', label: 'Vervormt (rekt uit om exact te passen)' },
  { value: 'none', label: 'Behoudt originele ware resolutie' },
  { value: 'scale-down', label: 'Kleinste van none of contain' },
] as const

const ratioOptions = [
  { id: 'wide', name: 'Breedbeeld', dims: '380 × 200' },
  { id: 'square', name: 'Vierkant', dims: '260 × 260' },
  { id: 'portrait', name: 'Staand / Portret', dims: '220 × 300' },
] as const

const positionOptions = [
  { value: 'top left', shortLabel: '↖ Top Left' },
  { value: 'top center', shortLabel: '↑ Top' },
  { value: 'top right', shortLabel: '↗ Top Right' },
  { value: 'center left', shortLabel: '← Left' },
  { value: 'center center', shortLabel: '• Center' },
  { value: 'center right', shortLabel: '→ Right' },
  { value: 'bottom left', shortLabel: '↙ Bottom Left' },
  { value: 'bottom center', shortLabel: '↓ Bottom' },
  { value: 'bottom right', shortLabel: '↘ Bottom Right' },
]

const currentRatioDimensions = computed(() => {
  switch (activeRatio.value) {
    case 'square':
      return { w: 260, h: 260 }
    case 'portrait':
      return { w: 220, h: 300 }
    case 'wide':
    default:
      return { w: 380, h: 200 }
  }
})

// Bepalen of er bij de huidige modus effectief delen worden afgeknipt
const hasClippedAreas = computed(() => {
  if (activeFit.value === 'fill' || activeFit.value === 'contain') {
    return false
  }
  return true
})

// Bereken exacte rendering-positie en dimensie van de geschaalde foto voor de ghost laag
const ghostLayerStyle = computed(() => {
  const frameW = currentRatioDimensions.value.w
  const frameH = currentRatioDimensions.value.h
  const frameAspect = frameW / frameH

  let renderedW = frameW
  let renderedH = frameH

  const fit = activeFit.value

  if (fit === 'cover') {
    if (frameAspect > naturalAspect) {
      // Kader is breder dan foto -> breedte vult frame, hoogte steekt uit
      renderedW = frameW
      renderedH = frameW / naturalAspect
    } else {
      // Kader is smaller dan foto -> hoogte vult frame, breedte steekt uit
      renderedH = frameH
      renderedW = frameH * naturalAspect
    }
  } else if (fit === 'none') {
    renderedW = naturalW
    renderedH = naturalH
  } else if (fit === 'scale-down') {
    const containW = frameAspect > naturalAspect ? frameH * naturalAspect : frameW
    const containH = frameAspect > naturalAspect ? frameH : frameW / naturalAspect
    if (naturalW < containW && naturalH < containH) {
      renderedW = naturalW
      renderedH = naturalH
    } else {
      renderedW = containW
      renderedH = containH
    }
  }

  // Parse object-position
  const posParts = activePos.value.split(' ')
  let posXFrac = 0.5
  let posYFrac = 0.5

  if (posParts.includes('left')) posXFrac = 0
  else if (posParts.includes('right')) posXFrac = 1
  else if (posParts.includes('center')) posXFrac = 0.5

  if (posParts.includes('top')) posYFrac = 0
  else if (posParts.includes('bottom')) posYFrac = 1
  else if (posParts.includes('center')) posYFrac = 0.5

  // Bereken offset t.o.v. top-left van frame
  const left = (frameW - renderedW) * posXFrac
  const top = (frameH - renderedH) * posYFrac

  return {
    width: `${Math.round(renderedW)}px`,
    height: `${Math.round(renderedH)}px`,
    left: `${Math.round(left)}px`,
    top: `${Math.round(top)}px`,
  }
})

const fitInfoMap: Record<string, {
  badge: string
  description: string
  aspectPreserved: boolean
  fillsContainer: boolean
  usage: string
}> = {
  cover: {
    badge: 'Meest gebruikt (Aanbevolen)',
    description: 'De afbeelding wordt proportioneel geschaald zodat het kader volledig bedekt is. Overtollige delen buiten het kader worden afgesneden (zie het ghost-effect). Er treedt nooit vervorming op.',
    aspectPreserved: true,
    fillsContainer: true,
    usage: 'Nieuwskaarten, teampagina profielfoto’s, productoverzichten en hero-secties.',
  },
  contain: {
    badge: 'Volledige weergave',
    description: 'De volledige foto wordt getoond binnen het kader zonder bijsnijden. Als de beeldverhouding verschilt van het kader, ontstaan er lege ruimtes aan de randen.',
    aspectPreserved: true,
    fillsContainer: false,
    usage: 'Logo’s van partners, technische diagrammen en grafieken waar elk detail zichtbaar moet blijven.',
  },
  fill: {
    badge: 'Standaard browsergedrag (Vervormend)',
    description: 'De browser rekt de afbeelding in de breedte en hoogte uit om het kader exact op te vullen, ongeacht de oorspronkelijke verhouding. Er wordt niets afgeknipt, maar de foto wordt vervormd.',
    aspectPreserved: false,
    fillsContainer: true,
    usage: 'Zelden wenselijk bij foto’s; vermijd dit voor professioneel webdesign.',
  },
  none: {
    badge: 'Geen schaling',
    description: 'De afbeelding negeert de grootte van het kader en behoudt haar oorspronkelijke pixelgrootte. Is de foto 800px breed, dan zie je enkel een uitsnede van 800px rond de gekozen positie.',
    aspectPreserved: true,
    fillsContainer: false,
    usage: 'Specifieke grafische uitsnedes of pictogrammen op exacte pixelgrootte.',
  },
  'scale-down': {
    badge: 'Automatisch verkleinen',
    description: 'De browser kiest automatisch tussen none en contain, afhankelijk van welke optie resulteert in de kleinste weergave van het beeld.',
    aspectPreserved: true,
    fillsContainer: false,
    usage: 'Dynamische mediaweergave waarbij kleine iconen niet onnodig worden opgerekt.',
  },
}

const currentFitInfo = computed(() => {
  return fitInfoMap[activeFit.value]
})

const generatedCss = computed(() => {
  return `.afbeelding-kader {
  width: ${currentRatioDimensions.value.w}px;
  height: ${currentRatioDimensions.value.h}px;
  overflow: hidden; /* Houdt uitsnede strak */
}

.afbeelding-kader img {
  width: 100%;
  height: 100%;
  object-fit: ${activeFit.value};
  object-position: ${activePos.value};
}`
})

async function copyCode() {
  try {
    await navigator.clipboard.writeText(generatedCss.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Kopiëren mislukt', err)
  }
}
</script>

<style scoped>
.of-simulator {
  margin: 2rem 0;
  border: 1px solid var(--vp-c-divider, #e2e8f0);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft, #f8fafc);
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.of-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1.25rem;
  background-color: var(--vp-c-bg, #ffffff);
  border-bottom: 1px solid var(--vp-c-divider, #e2e8f0);
}

.of-header-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  color: #1e2d5a;
}

.dark .of-header-title {
  color: #93c5fd;
}

.of-title-icon {
  color: #e87722;
}

.of-badge {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: rgba(232, 119, 34, 0.12);
  color: #e87722;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
}

.of-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.of-controls {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background-color: var(--vp-c-bg, #ffffff);
  border: 1px solid var(--vp-c-divider, #e2e8f0);
  padding: 1.1rem;
  border-radius: 10px;
}

.of-group-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--vp-c-text-1, #1e293b);
  display: block;
  margin-bottom: 0.5rem;
}

.of-group-label-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.of-group-label-row .of-group-label {
  margin-bottom: 0;
}

.of-disabled-note {
  font-size: 0.8rem;
  color: var(--vp-c-text-3, #94a3b8);
  font-style: italic;
}

.of-button-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 0.5rem;
}

.of-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.6rem 0.5rem;
  border: 1px solid var(--vp-c-divider, #cbd5e1);
  border-radius: 8px;
  background-color: var(--vp-c-bg, #ffffff);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.of-btn code {
  font-weight: 700;
  color: #1e2d5a;
  background: transparent;
  padding: 0;
  font-size: 0.85rem;
}

.dark .of-btn code {
  color: #93c5fd;
}

.of-btn-desc {
  font-size: 0.72rem;
  color: var(--vp-c-text-2, #64748b);
  margin-top: 0.25rem;
  line-height: 1.2;
}

.of-btn:hover {
  border-color: #e87722;
  background-color: rgba(232, 119, 34, 0.04);
}

.of-btn.is-active {
  background-color: #e87722;
  border-color: #d4641a;
  color: #ffffff;
}

.of-btn.is-active code,
.of-btn.is-active .of-btn-desc {
  color: #ffffff;
}

.of-pill-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.of-pill {
  padding: 0.45rem 0.9rem;
  border-radius: 20px;
  border: 1px solid var(--vp-c-divider, #cbd5e1);
  background-color: var(--vp-c-bg, #ffffff);
  font-size: 0.825rem;
  font-weight: 600;
  color: var(--vp-c-text-1, #334155);
  cursor: pointer;
  transition: all 0.15s ease;
}

.of-pill:hover {
  border-color: #1e2d5a;
}

.of-pill.is-active {
  background-color: #1e2d5a;
  border-color: #1e2d5a;
  color: #ffffff;
}

.dark .of-pill.is-active {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.of-pos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.35rem;
  max-width: 380px;
}

.of-pos-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.45rem 0.5rem;
  font-size: 0.75rem;
  border: 1px solid var(--vp-c-divider, #cbd5e1);
  border-radius: 6px;
  background-color: var(--vp-c-bg, #ffffff);
  cursor: pointer;
  transition: all 0.15s ease;
}

.of-pos-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #cbd5e1;
}

.of-pos-btn:hover:not(:disabled) {
  border-color: #e87722;
}

.of-pos-btn.is-active {
  background-color: #e87722;
  border-color: #e87722;
  color: #ffffff;
  font-weight: 700;
}

.of-pos-btn.is-active .of-pos-dot {
  background-color: #ffffff;
}

.of-pos-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.of-pos-current {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-2, #64748b);
}

.of-pos-current code {
  color: #e87722;
  font-weight: 700;
}

/* Ghost Toggle */
.of-ghost-toggle-row {
  background-color: var(--vp-c-bg-soft, #f8fafc);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px dashed var(--vp-c-divider, #cbd5e1);
}

.of-ghost-toggle {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
}

.of-checkbox {
  margin-top: 0.2rem;
  width: 18px;
  height: 18px;
  accent-color: #e87722;
  cursor: pointer;
}

.of-ghost-label {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-1, #1e293b);
}

.of-ghost-sub {
  font-size: 0.78rem;
  color: var(--vp-c-text-2, #64748b);
}

.of-explanation-card {
  background-color: var(--vp-c-bg, #ffffff);
  border: 1px solid var(--vp-c-divider, #e2e8f0);
  border-left: 4px solid #e87722;
  border-radius: 8px;
  padding: 1rem 1.25rem;
}

.of-explanation-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.5rem;
}

.of-tag {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  background-color: rgba(232, 119, 34, 0.15);
  color: #e87722;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.of-explanation-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--vp-c-text-1, #1e293b);
}

.of-explanation-text {
  margin: 0 0 0.85rem 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--vp-c-text-1, #334155);
}

.of-explanation-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.6rem;
  background-color: var(--vp-c-bg-soft, #f8fafc);
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider, #e2e8f0);
}

.of-detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.of-detail-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-text-2, #64748b);
}

.of-detail-value {
  font-size: 0.825rem;
  font-weight: 600;
}

.text-ok {
  color: #16a34a;
}

.text-warn {
  color: #dc2626;
}

.of-preview-stage {
  background-color: var(--vp-c-bg, #ffffff);
  border: 1px solid var(--vp-c-divider, #e2e8f0);
  border-radius: 10px;
  overflow: hidden;
}

.of-stage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 1rem;
  background-color: var(--vp-c-bg-soft, #f8fafc);
  border-bottom: 1px solid var(--vp-c-divider, #e2e8f0);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-text-2, #64748b);
}

.of-stage-legend {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  font-size: 0.75rem;
}

.of-legend-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.of-legend-box {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.of-legend-box.cadre {
  border: 2px solid #1e2d5a;
  background-color: #ffffff;
}

.dark .of-legend-box.cadre {
  border-color: #60a5fa;
}

.of-legend-box.ghost {
  border: 1px dashed #e87722;
  background-color: rgba(232, 119, 34, 0.2);
}

.of-stage-content {
  padding: 3rem 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background: repeating-conic-gradient(#f1f5f9 0% 25%, #ffffff 0% 50%) 50% / 20px 20px;
  min-height: 380px;
  overflow: hidden;
}

.dark .of-stage-content {
  background: repeating-conic-gradient(#1e293b 0% 25%, #0f172a 0% 50%) 50% / 20px 20px;
}

.of-stage-wrapper {
  position: relative;
  transition: width 0.3s ease, height 0.3s ease;
}

/* Echte kader */
.of-target-frame {
  position: relative;
  width: 100%;
  height: 100%;
  border: 3px solid #1e2d5a;
  background-color: #000000;
  border-radius: 6px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  z-index: 2;
  transition: all 0.3s ease;
}

.dark .of-target-frame {
  border-color: #60a5fa;
}

.of-target-img {
  display: block;
  width: 100%;
  height: 100%;
  transition: object-position 0.2s ease;
}

.of-frame-badge {
  position: absolute;
  bottom: 6px;
  right: 6px;
  background-color: rgba(0, 0, 0, 0.75);
  color: #ffffff;
  font-size: 0.68rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  pointer-events: none;
}

/* Ghost laag (buiten het kader) */
.of-ghost-layer {
  position: absolute;
  pointer-events: none;
  z-index: 1;
  border: 2px dashed #e87722;
  border-radius: 6px;
  overflow: visible;
  transition: all 0.25s ease;
  box-shadow: 0 0 20px rgba(232, 119, 34, 0.15);
}

.of-ghost-img {
  width: 100%;
  height: 100%;
  display: block;
  opacity: 0.32;
  filter: grayscale(40%) contrast(1.1);
}

.of-ghost-badge {
  position: absolute;
  top: -24px;
  left: 0;
  background-color: #e87722;
  color: #ffffff;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.of-code-panel {
  background-color: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
}

.of-code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #2d2d2d;
  border-bottom: 1px solid #3d3d3d;
}

.of-code-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
}

.of-copy-btn {
  background-color: #e87722;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.of-copy-btn:hover {
  background-color: #d4641a;
}

.of-pre {
  margin: 0;
  padding: 1rem;
  background-color: transparent;
  color: #e2e8f0;
  font-family: Consolas, 'Courier New', monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  overflow-x: auto;
}

@media (max-width: 640px) {
  .of-stage-wrapper {
    transform: scale(0.85);
  }
}
</style>
