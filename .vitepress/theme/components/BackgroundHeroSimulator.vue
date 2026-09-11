<template>
  <div class="bg-simulator">
    <div class="bg-header">
      <div class="bg-header-title">
        <svg class="bg-title-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
        <span class="bg-label">Background &amp; Hero Banner Simulator</span>
      </div>
      <span class="bg-badge">Interactieve demonstratie</span>
    </div>

    <div class="bg-body">
      <!-- 1. BEDIENINGSPANEEL -->
      <div class="bg-controls-grid">
        <!-- background-size -->
        <div class="bg-control-box">
          <label class="bg-control-label">1. <code>background-size</code></label>
          <div class="bg-btn-row">
            <button
              v-for="s in sizeOptions"
              :key="s.value"
              type="button"
              class="bg-btn"
              :class="{ 'is-active': activeSize === s.value }"
              @click="activeSize = s.value"
            >
              <code>{{ s.value }}</code>
              <span class="bg-btn-sub">{{ s.label }}</span>
            </button>
          </div>
        </div>

        <!-- background-position -->
        <div class="bg-control-box">
          <label class="bg-control-label">2. <code>background-position</code></label>
          <div class="bg-pos-grid">
            <button
              v-for="p in posOptions"
              :key="p.value"
              type="button"
              class="bg-pos-cell"
              :class="{ 'is-active': activePos === p.value }"
              @click="activePos = p.value"
              :title="p.value"
            >
              {{ p.short }}
            </button>
          </div>
          <div class="bg-current-pos">Huidig: <code>{{ activePos }}</code></div>
        </div>

        <!-- background-repeat -->
        <div class="bg-control-box">
          <label class="bg-control-label">3. <code>background-repeat</code></label>
          <div class="bg-btn-row">
            <button
              v-for="r in repeatOptions"
              :key="r.value"
              type="button"
              class="bg-btn"
              :class="{ 'is-active': activeRepeat === r.value }"
              @click="activeRepeat = r.value"
            >
              <code>{{ r.value }}</code>
            </button>
          </div>
        </div>

        <!-- Donkere gradient overlay & Schermbreedte -->
        <div class="bg-control-box">
          <label class="bg-control-label">4. Hero Extra's &amp; Testbreedte</label>
          <div class="bg-toggle-row">
            <label class="bg-toggle-label">
              <input type="checkbox" v-model="hasOverlay" class="bg-checkbox" />
              <span>Donkere gradient overlay (voor tekstcontrast)</span>
            </label>
          </div>

          <div class="bg-viewport-selector">
            <span class="bg-vp-label">Schermformaat container:</span>
            <div class="bg-vp-buttons">
              <button
                v-for="vp in viewportOptions"
                :key="vp.id"
                type="button"
                class="bg-vp-btn"
                :class="{ 'is-active': activeViewport === vp.id }"
                @click="activeViewport = vp.id"
              >
                {{ vp.name }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. UITLEGKAART -->
      <div class="bg-explanation-card">
        <div class="bg-exp-header">
          <span class="bg-exp-badge">{{ currentSizeInfo.badge }}</span>
          <h4 class="bg-exp-title">Wat doet <code>background-size: {{ activeSize }}</code>?</h4>
        </div>
        <p class="bg-exp-text">{{ currentSizeInfo.text }}</p>
        <div class="bg-exp-tip" v-if="activeSize === 'cover'">
          <strong>Gouden praktijkcombinatie:</strong> <code>background-size: cover; background-position: center;</code> garandeert dat de banner altijd naadloos gevuld is en het middelpunt van de foto netjes gecentreerd blijft.
        </div>
        <div class="bg-exp-tip" v-else-if="activeSize === 'contain'">
          <strong>Opgelet:</strong> Omdat de volledige afbeelding binnen de banner moet passen, zie je bij een langwerpige container links en rechts of boven en onder herhaling of de achtergrondkleur verschijnen.
        </div>
      </div>

      <!-- 3. INTERACTIEVE HERO BANNER PREVIEW -->
      <div class="bg-preview-wrapper">
        <div class="bg-preview-meta">
          <span>Live Hero Banner Weergave</span>
          <span>Breedte: {{ currentViewportWidth }}</span>
        </div>

        <div class="bg-preview-scroll-area">
          <div
            class="bg-hero-banner"
            :style="{
              maxWidth: currentViewportWidth,
              backgroundImage: bannerBackgroundImage,
              backgroundSize: activeSize,
              backgroundPosition: activePos,
              backgroundRepeat: activeRepeat,
            }"
          >
            <div class="bg-hero-content">
              <span class="bg-hero-tag">Thomas More Campus Geel</span>
              <h1 class="bg-hero-title">Graduaat Digitale Vormgeving &amp; Web</h1>
              <p class="bg-hero-desc">
                Ontdek hoe achtergrondafbeeldingen en gradiënten een webpagina een professionele uitstraling geven.
              </p>
              <div class="bg-hero-actions">
                <a href="#code" class="bg-hero-btn primary">Start je opleiding</a>
                <a href="#code" class="bg-hero-btn secondary">Bekijk campus</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. GEGENEREERDE CODE -->
      <div class="bg-code-panel">
        <div class="bg-code-header">
          <span class="bg-code-label">Gegenereerde CSS</span>
          <button type="button" class="bg-copy-btn" @click="copyCss">
            {{ copied ? 'Gekopieerd!' : 'Kopieer CSS' }}
          </button>
        </div>
        <div class="bg-code-body">
          <div class="bg-code-col">
            <span class="bg-col-title">Uitgeschreven eigenschappen:</span>
            <pre class="bg-pre"><code>{{ generatedDetailedCss }}</code></pre>
          </div>
          <div class="bg-code-col">
            <span class="bg-col-title">Krachtige Shorthand notatie:</span>
            <pre class="bg-pre"><code>{{ generatedShorthandCss }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const activeSize = ref<'cover' | 'contain' | 'auto'>('cover')
const activePos = ref<string>('center center')
const activeRepeat = ref<'no-repeat' | 'repeat' | 'repeat-x'>('no-repeat')
const hasOverlay = ref<boolean>(true)
const activeViewport = ref<'full' | 'tablet' | 'mobile'>('full')
const copied = ref<boolean>(false)

const imgUrl = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80'

const sizeOptions = [
  { value: 'cover', label: 'Vult banner volledig, snijdt af' },
  { value: 'contain', label: 'Toont hele foto, behoudt verhouding' },
  { value: 'auto', label: 'Ware grootte' },
] as const

const posOptions = [
  { value: 'top left', short: '↖ TL' },
  { value: 'top center', short: '↑ Top' },
  { value: 'top right', short: '↗ TR' },
  { value: 'center left', short: '← Left' },
  { value: 'center center', short: '• Center' },
  { value: 'center right', short: '→ Right' },
  { value: 'bottom left', short: '↙ BL' },
  { value: 'bottom center', short: '↓ Bottom' },
  { value: 'bottom right', short: '↘ BR' },
]

const repeatOptions = [
  { value: 'no-repeat' },
  { value: 'repeat' },
  { value: 'repeat-x' },
] as const

const viewportOptions = [
  { id: 'full', name: 'Desktop (100%)' },
  { id: 'tablet', name: 'Tablet (640px)' },
  { id: 'mobile', name: 'Mobiel (380px)' },
] as const

const currentViewportWidth = computed(() => {
  switch (activeViewport.value) {
    case 'mobile':
      return '380px'
    case 'tablet':
      return '640px'
    case 'full':
    default:
      return '100%'
  }
})

const bannerBackgroundImage = computed(() => {
  if (hasOverlay.value) {
    return `linear-gradient(rgba(30, 45, 90, 0.75), rgba(15, 23, 42, 0.85)), url('${imgUrl}')`
  }
  return `url('${imgUrl}')`
})

const sizeInfoMap: Record<string, { badge: string; text: string }> = {
  cover: {
    badge: 'Standaardkeuze voor banners & hero-secties',
    text: 'De achtergrondafbeelding schaalt proportioneel mee zodat het hele vlak van de banner altijd volledig bedekt is, ongeacht het schermformaat. Overtollige zijkanten worden subtiel bijgesneden.',
  },
  contain: {
    badge: 'Behoudt alle beeldelementen',
    text: 'De afbeelding schaalt zo dat ze integraal en volledig binnen het element zichtbaar is. Als de banner breder of hoger is dan de foto, ontstaan er onbedekte zones.',
  },
  auto: {
    badge: 'Oorspronkelijke resolutie',
    text: 'De browser toont de afbeelding in haar oorspronkelijke pixelgrootte. Bij een kleine afbeelding zal deze zich herhalen (tenzij no-repeat is ingesteld).',
  },
}

const currentSizeInfo = computed(() => sizeInfoMap[activeSize.value])

const generatedDetailedCss = computed(() => {
  if (hasOverlay.value) {
    return `.hero-banner {
  background-color: #1e2d5a;
  background-image: 
    linear-gradient(rgba(30, 45, 90, 0.75), rgba(15, 23, 42, 0.85)),
    url('hero-campus.webp');
  background-position: ${activePos.value};
  background-size: ${activeSize.value};
  background-repeat: ${activeRepeat.value};
}`
  }
  return `.hero-banner {
  background-color: #1e2d5a;
  background-image: url('hero-campus.webp');
  background-position: ${activePos.value};
  background-size: ${activeSize.value};
  background-repeat: ${activeRepeat.value};
}`
})

const generatedShorthandCss = computed(() => {
  if (hasOverlay.value) {
    return `.hero-banner {
  /* Let op: achtergrondgrootte volgt NA de positie met een schuine streep */
  background: 
    linear-gradient(rgba(30, 45, 90, 0.75), rgba(15, 23, 42, 0.85)),
    url('hero-campus.webp') ${activePos.value} / ${activeSize.value} ${activeRepeat.value} #1e2d5a;
}`
  }
  return `.hero-banner {
  /* Shorthand: positie / grootte herhaling achtergrondkleur */
  background: url('hero-campus.webp') ${activePos.value} / ${activeSize.value} ${activeRepeat.value} #1e2d5a;
}`
})

async function copyCss() {
  try {
    await navigator.clipboard.writeText(generatedShorthandCss.value)
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
.bg-simulator {
  margin: 2rem 0;
  border: 1px solid var(--vp-c-divider, #e2e8f0);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft, #f8fafc);
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.bg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1.25rem;
  background-color: var(--vp-c-bg, #ffffff);
  border-bottom: 1px solid var(--vp-c-divider, #e2e8f0);
}

.bg-header-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  color: #1e2d5a;
}

.dark .bg-header-title {
  color: #93c5fd;
}

.bg-title-icon {
  color: #e87722;
}

.bg-badge {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: rgba(232, 119, 34, 0.12);
  color: #e87722;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
}

.bg-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.bg-controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.bg-control-box {
  background-color: var(--vp-c-bg, #ffffff);
  border: 1px solid var(--vp-c-divider, #e2e8f0);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.bg-control-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--vp-c-text-1, #1e293b);
}

.bg-btn-row {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.bg-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.45rem 0.75rem;
  border: 1px solid var(--vp-c-divider, #cbd5e1);
  border-radius: 6px;
  background-color: var(--vp-c-bg, #ffffff);
  cursor: pointer;
  transition: all 0.15s ease;
}

.bg-btn code {
  font-weight: 700;
  color: #1e2d5a;
  background: transparent;
  padding: 0;
  font-size: 0.85rem;
}

.dark .bg-btn code {
  color: #93c5fd;
}

.bg-btn-sub {
  font-size: 0.7rem;
  color: var(--vp-c-text-2, #64748b);
}

.bg-btn:hover {
  border-color: #e87722;
}

.bg-btn.is-active {
  background-color: #e87722;
  border-color: #d4641a;
  color: #ffffff;
}

.bg-btn.is-active code,
.bg-btn.is-active .bg-btn-sub {
  color: #ffffff;
}

.bg-pos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.35rem;
}

.bg-pos-cell {
  padding: 0.4rem 0.3rem;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid var(--vp-c-divider, #cbd5e1);
  border-radius: 4px;
  background-color: var(--vp-c-bg, #ffffff);
  cursor: pointer;
  text-align: center;
  transition: all 0.15s ease;
}

.bg-pos-cell:hover {
  border-color: #e87722;
}

.bg-pos-cell.is-active {
  background-color: #e87722;
  border-color: #e87722;
  color: #ffffff;
}

.bg-current-pos {
  font-size: 0.78rem;
  color: var(--vp-c-text-2, #64748b);
}

.bg-current-pos code {
  color: #e87722;
  font-weight: 700;
}

.bg-toggle-row {
  display: flex;
  align-items: center;
}

.bg-toggle-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.825rem;
  font-weight: 600;
  cursor: pointer;
  color: var(--vp-c-text-1, #334155);
}

.bg-checkbox {
  width: 16px;
  height: 16px;
  accent-color: #e87722;
  cursor: pointer;
}

.bg-viewport-selector {
  margin-top: 0.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.bg-vp-label {
  font-size: 0.75rem;
  color: var(--vp-c-text-2, #64748b);
  font-weight: 600;
}

.bg-vp-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.bg-vp-btn {
  padding: 0.3rem 0.6rem;
  font-size: 0.75rem;
  border: 1px solid var(--vp-c-divider, #cbd5e1);
  border-radius: 4px;
  background-color: var(--vp-c-bg, #ffffff);
  cursor: pointer;
}

.bg-vp-btn.is-active {
  background-color: #1e2d5a;
  border-color: #1e2d5a;
  color: #ffffff;
}

.dark .bg-vp-btn.is-active {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.bg-explanation-card {
  background-color: var(--vp-c-bg, #ffffff);
  border: 1px solid var(--vp-c-divider, #e2e8f0);
  border-left: 4px solid #1e2d5a;
  border-radius: 8px;
  padding: 1rem 1.25rem;
}

.dark .bg-explanation-card {
  border-left-color: #60a5fa;
}

.bg-exp-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.4rem;
}

.bg-exp-badge {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  background-color: rgba(30, 45, 90, 0.1);
  color: #1e2d5a;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.dark .bg-exp-badge {
  background-color: rgba(96, 165, 250, 0.15);
  color: #93c5fd;
}

.bg-exp-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
}

.bg-exp-text {
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  line-height: 1.5;
}

.bg-exp-tip {
  font-size: 0.825rem;
  color: var(--vp-c-text-2, #64748b);
  background-color: var(--vp-c-bg-soft, #f8fafc);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border-left: 3px solid #e87722;
}

.bg-preview-wrapper {
  background-color: var(--vp-c-bg, #ffffff);
  border: 1px solid var(--vp-c-divider, #e2e8f0);
  border-radius: 10px;
  overflow: hidden;
}

.bg-preview-meta {
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

.bg-preview-scroll-area {
  padding: 1.5rem;
  background: repeating-conic-gradient(#f1f5f9 0% 25%, #ffffff 0% 50%) 50% / 20px 20px;
  display: flex;
  justify-content: center;
  overflow-x: auto;
}

.dark .bg-preview-scroll-area {
  background: repeating-conic-gradient(#1e293b 0% 25%, #0f172a 0% 50%) 50% / 20px 20px;
}

.bg-hero-banner {
  width: 100%;
  min-height: 280px;
  background-color: #1e2d5a;
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 2rem 2.5rem;
  color: #ffffff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  transition: max-width 0.3s ease, background-position 0.2s ease;
}

.bg-hero-content {
  max-width: 540px;
}

.bg-hero-tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: #e87722;
  color: #ffffff;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  margin-bottom: 0.75rem;
}

.bg-hero-title {
  margin: 0 0 0.75rem 0;
  font-size: 1.75rem;
  font-weight: 800;
  line-height: 1.25;
  color: #ffffff;
}

.bg-hero-desc {
  margin: 0 0 1.25rem 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: #e2e8f0;
}

.bg-hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.bg-hero-btn {
  display: inline-block;
  padding: 0.55rem 1.1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.15s ease;
}

.bg-hero-btn.primary {
  background-color: #e87722;
  color: #ffffff;
}

.bg-hero-btn.primary:hover {
  background-color: #d4641a;
}

.bg-hero-btn.secondary {
  background-color: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(4px);
}

.bg-hero-btn.secondary:hover {
  background-color: rgba(255, 255, 255, 0.25);
}

.bg-code-panel {
  background-color: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
}

.bg-code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #2d2d2d;
  border-bottom: 1px solid #3d3d3d;
}

.bg-code-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
}

.bg-copy-btn {
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

.bg-copy-btn:hover {
  background-color: #d4641a;
}

.bg-code-body {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1px;
  background-color: #3d3d3d;
}

.bg-code-col {
  background-color: #1e1e1e;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
}

.bg-col-title {
  font-size: 0.72rem;
  font-weight: 700;
  color: #e87722;
  margin-bottom: 0.4rem;
  text-transform: uppercase;
}

.bg-pre {
  margin: 0;
  padding: 0;
  background-color: transparent;
  color: #e2e8f0;
  font-family: Consolas, 'Courier New', monospace;
  font-size: 0.8rem;
  line-height: 1.45;
  overflow-x: auto;
}
</style>
