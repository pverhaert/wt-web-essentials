<script setup lang="ts">
import { ref, computed } from 'vue'

const perspective = ref<number>(1000)
const rotateX = ref<number>(0)
const rotateY = ref<number>(0)
const rotateZ = ref<number>(0)
const translateZ = ref<number>(0)
const preserve3d = ref<boolean>(true)
const backfaceVisible = ref<boolean>(false)
const isSpinning = ref<boolean>(false)

function resetAll() {
  perspective.value = 1000
  rotateX.value = 0
  rotateY.value = 0
  rotateZ.value = 0
  translateZ.value = 0
  preserve3d.value = true
  backfaceVisible.value = false
  isSpinning.value = false
}

function setCardFlip() {
  rotateX.value = 0
  rotateY.value = 180
  rotateZ.value = 0
  translateZ.value = 0
  backfaceVisible.value = false
}

function setIsometric() {
  rotateX.value = 45
  rotateY.value = 0
  rotateZ.value = -45
  perspective.value = 1200
}

const computedTransform = computed(() => {
  const parts: string[] = []
  if (rotateX.value !== 0) parts.push(`rotateX(${rotateX.value}deg)`)
  if (rotateY.value !== 0) parts.push(`rotateY(${rotateY.value}deg)`)
  if (rotateZ.value !== 0) parts.push(`rotateZ(${rotateZ.value}deg)`)
  if (translateZ.value !== 0) parts.push(`translateZ(${translateZ.value}px)`)
  return parts.length > 0 ? parts.join(' ') : 'none'
})

// 1. Scène CSS (perspectief)
const generatedSceneCss = computed(() => {
  let css = `.scene {\n`
  css += `  width: 240px;\n`
  css += `  height: 310px;\n`
  css += `  /* Virtuele camera-afstand (oogpunt) */\n`
  css += `  perspective: ${perspective.value}px;\n`
  css += `}`
  return css
})

// 2. 3D Element CSS
const generatedElementCss = computed(() => {
  let css = `.card {\n`
  if (preserve3d.value) {
    css += `  transform-style: preserve-3d;\n`
  } else {
    css += `  /* transform-style: flat; (standaard) */\n`
  }
  css += `  transform: ${computedTransform.value};\n`
  css += `}\n\n`
  css += `/* Beide kaartvlakken */\n`
  css += `.card-face {\n`
  if (backfaceVisible.value) {
    css += `  /* backface-visibility: visible; (standaard) */\n`
  } else {
    css += `  backface-visibility: hidden;\n`
  }
  css += `}\n`
  css += `.card-back {\n`
  css += `  transform: rotateY(180deg);\n`
  css += `}`
  return css
})

const generatedCssCode = computed(() => {
  return `${generatedSceneCss.value}\n\n${generatedElementCss.value}`
})

const copied = ref(false)
function copyCode() {
  if (navigator?.clipboard) {
    navigator.clipboard.writeText(generatedCssCode.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1800)
  }
}
</script>

<template>
  <div class="tr3-sim">
    <!-- Header -->
    <div class="tr3-sim-header">
      <div class="tr3-sim-title">
        <svg class="tr3-sim-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
          <polyline points="7.5 19.79 7.5 14.6 3 12" />
          <polyline points="21 12 16.5 14.6 16.5 19.79" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
        <span class="tr3-sim-name">3D Transform & Perspective Simulator</span>
      </div>
      <button type="button" class="tr3-btn-reset" @click="resetAll">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        Herstel beginstand
      </button>
    </div>

    <!-- Quick Presets -->
    <div class="tr3-tabs">
      <button type="button" class="tr3-tab" @click="resetAll">Kaart in 3D-ruststand</button>
      <button type="button" class="tr3-tab" @click="setCardFlip">180&deg; Flip Card (achterkant)</button>
      <button type="button" class="tr3-tab" @click="setIsometric">Isometrisch perspectief</button>
    </div>

    <!-- Main Grid -->
    <div class="tr3-main-grid">
      <!-- LINKER KOLOM: 3D Scène -->
      <div class="tr3-stage-panel">
        <div class="tr3-stage-header">
          <span class="tr3-badge-live">3D Viewport</span>
          <span class="tr3-stage-hint">
            <span class="tr3-legend-ghost"></span> Ruststand (Z:0) &bull;
            perspective: <strong>{{ perspective }}px</strong>
          </span>
        </div>

        <div
          class="tr3-canvas-wrap"
          :style="{ perspective: `${perspective}px` }"
        >
          <!-- 3D Vloerrooster -->
          <div class="tr3-floor"></div>

          <!-- Ghost Container (oorspronkelijke positie) -->
          <div class="tr3-ghost-box">
            <span>basis (0, 0, 0)</span>
          </div>

          <!-- Het 3D Object -->
          <div
            class="tr3-card"
            :class="{ 'is-spinning': isSpinning }"
            :style="{
              transform: computedTransform,
              transformStyle: preserve3d ? 'preserve-3d' : 'flat'
            }"
          >
            <!-- Voorkant van de kaart -->
            <div
              class="tr3-card-face tr3-card-front"
              :style="{ backfaceVisibility: backfaceVisible ? 'visible' : 'hidden' }"
            >
              <div class="tr3-card-img-wrap">
                <img
                  src="https://picsum.photos/id/110/300/200"
                  alt="Zonsondergang in het veld door Kenneth Thewissen"
                  class="tr3-card-img"
                  loading="lazy"
                />
                <span class="tr3-badge-photo">#110</span>
              </div>
              <div class="tr3-card-front-info">
                <h4 class="tr3-card-title">Kenneth Thewissen</h4>
                <p class="tr3-card-sub">Landschapsfotografie</p>
              </div>
            </div>

            <!-- Achterkant van de kaart -->
            <div
              class="tr3-card-face tr3-card-back"
              :style="{ backfaceVisibility: backfaceVisible ? 'visible' : 'hidden' }"
            >
              <div class="tr3-back-content">
                <span class="tr3-back-tag">Over deze foto</span>
                <h4 class="tr3-back-title">Zonsondergang in het veld</h4>
                <p class="tr3-back-desc">
                  Warm goudgeel avondlicht over een open weiland met een bomenrij aan de horizon.
                </p>
                <div class="tr3-back-meta">
                  <div class="tr3-meta-row">
                    <span class="tr3-meta-label">Fotograaf:</span>
                    <strong class="tr3-meta-val">Kenneth Thewissen</strong>
                  </div>
                  <div class="tr3-meta-row">
                    <span class="tr3-meta-label">Bron:</span>
                    <span class="tr3-meta-val">Picsum Photos #110</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- RECHTER KOLOM: Besturing & Code -->
      <div class="tr3-ctrl-panel">
        <!-- 1. Perspectief -->
        <div class="tr3-section">
          <div class="tr3-section-title">Virtuele Camera: <code>perspective</code></div>
          <div class="tr3-control-row">
            <div class="tr3-control-header">
              <label for="tr3-persp">Afstand kijker tot scherm:</label>
              <span class="tr3-val">{{ perspective }}px</span>
            </div>
            <input
              id="tr3-persp"
              type="range"
              min="300"
              max="1600"
              step="50"
              v-model.number="perspective"
              class="tr3-slider"
            />
          </div>
        </div>

        <!-- 2. 3D Rotatie en Diepte -->
        <div class="tr3-section">
          <div class="tr3-section-title">3D Transformaties</div>

          <div class="tr3-control-row">
            <div class="tr3-control-header">
              <label for="tr3-rx">Rotatie X (kantelen):</label>
              <span class="tr3-val">{{ rotateX }}deg</span>
            </div>
            <input
              id="tr3-rx"
              type="range"
              min="-180"
              max="180"
              step="5"
              v-model.number="rotateX"
              class="tr3-slider"
            />
          </div>

          <div class="tr3-control-row">
            <div class="tr3-control-header">
              <label for="tr3-ry">Rotatie Y (draaien):</label>
              <span class="tr3-val">{{ rotateY }}deg</span>
            </div>
            <input
              id="tr3-ry"
              type="range"
              min="-180"
              max="180"
              step="5"
              v-model.number="rotateY"
              class="tr3-slider"
            />
          </div>

          <div class="tr3-control-row">
            <div class="tr3-control-header">
              <label for="tr3-rz">Rotatie Z (wiebelen):</label>
              <span class="tr3-val">{{ rotateZ }}deg</span>
            </div>
            <input
              id="tr3-rz"
              type="range"
              min="-180"
              max="180"
              step="5"
              v-model.number="rotateZ"
              class="tr3-slider"
            />
          </div>

          <div class="tr3-control-row">
            <div class="tr3-control-header">
              <label for="tr3-tz">Diepte Z-as (<code>translateZ</code>):</label>
              <span class="tr3-val">{{ translateZ }}px</span>
            </div>
            <input
              id="tr3-tz"
              type="range"
              min="-150"
              max="150"
              step="10"
              v-model.number="translateZ"
              class="tr3-slider"
            />
          </div>
        </div>

        <!-- 3. 3D Context & Backface -->
        <div class="tr3-section">
          <div class="tr3-section-title">3D Renderopties</div>
          <div class="tr3-toggles-grid">
            <label class="tr3-toggle-item">
              <input type="checkbox" v-model="preserve3d" class="tr3-checkbox" />
              <span><code>preserve-3d</code> (kinderen in 3D)</span>
            </label>
            <label class="tr3-toggle-item">
              <input type="checkbox" v-model="backfaceVisible" class="tr3-checkbox" />
              <span><code>backface-visibility: visible</code> (standaard)</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. CSS Code Box over de VOLLE BREEDTE (2 kolommen) -->
    <div class="tr3-code-section">
      <div class="tr3-code-header">
        <span class="tr3-code-title">Gegenereerde CSS Code</span>
        <button type="button" class="tr3-copy-btn" @click="copyCode">
          {{ copied ? 'Gekopieerd!' : 'Kopieer alle CSS' }}
        </button>
      </div>
      <div class="tr3-code-columns">
        <div class="tr3-code-col">
          <div class="tr3-code-col-title">1. Ouder-container (<code>.scene</code> met perspectief)</div>
          <pre class="tr3-code-block"><code>{{ generatedSceneCss }}</code></pre>
        </div>
        <div class="tr3-code-col">
          <div class="tr3-code-col-title">2. 3D Kaart & Vlakken (<code>.card</code> en <code>.card-face</code>)</div>
          <pre class="tr3-code-block"><code>{{ generatedElementCss }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tr3-sim {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
  margin: 1.5rem 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.tr3-sim-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.tr3-sim-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
}

.tr3-sim-icon {
  color: #0284c7;
}

.tr3-btn-reset {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.65rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.15s ease;
}

.tr3-btn-reset:hover {
  color: #e87722;
  border-color: #e87722;
}

.tr3-tabs {
  display: flex;
  gap: 0.35rem;
  padding: 0.4rem 1rem;
  background: var(--vp-c-bg-alt);
  border-bottom: 1px solid var(--vp-c-divider);
  overflow-x: auto;
}

.tr3-tab {
  padding: 0.25rem 0.6rem;
  font-size: 0.75rem;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.tr3-tab:hover {
  color: #0284c7;
  border-color: #0284c7;
}

.tr3-main-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  min-height: 500px;
}

@media (max-width: 860px) {
  .tr3-main-grid {
    grid-template-columns: 1fr;
  }
}

/* Linker Kolom: Scène */
.tr3-stage-panel {
  display: flex;
  flex-direction: column;
  background: #0b1120;
  border-right: 1px solid var(--vp-c-divider);
  padding: 0.75rem 1rem 1rem;
}

@media (max-width: 860px) {
  .tr3-stage-panel {
    border-right: none;
    border-bottom: 1px solid var(--vp-c-divider);
  }
}

.tr3-stage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.tr3-badge-live {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.15);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.tr3-stage-hint {
  font-size: 0.72rem;
  color: #94a3b8;
}

.tr3-legend-ghost {
  display: inline-block;
  width: 10px;
  height: 10px;
  border: 1px dashed #64748b;
  border-radius: 2px;
}

.tr3-canvas-wrap {
  flex: 1;
  position: relative;
  min-height: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* 3D Vloer */
.tr3-floor {
  position: absolute;
  width: 320px;
  height: 320px;
  bottom: -40px;
  background: 
    linear-gradient(to right, rgba(56, 189, 248, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(56, 189, 248, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  transform: rotateX(75deg);
  border-radius: 12px;
  pointer-events: none;
}

/* Ghost start */
.tr3-ghost-box {
  position: absolute;
  width: 240px;
  height: 310px;
  border: 1.5px dashed rgba(148, 163, 184, 0.35);
  border-radius: 14px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 0.5rem;
  color: rgba(148, 163, 184, 0.5);
  font-size: 0.68rem;
  font-family: var(--vp-font-family-mono);
  pointer-events: none;
}

/* 3D Kaart */
.tr3-card {
  width: 240px;
  height: 310px;
  position: relative;
  transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  user-select: none;
}

.tr3-card-face {
  position: absolute;
  inset: 0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
  border: 1px solid #1e293b;
}

/* Voorkant */
.tr3-card-front {
  background: #0f172a;
  color: #f8fafc;
  display: flex;
  flex-direction: column;
  border-color: #1e293b;
}

.tr3-card-img-wrap {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #0f172a;
  border-radius: 13px 13px 0 0;
}

.tr3-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 13px 13px 0 0;
}

.tr3-badge-photo {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  background: rgba(15, 23, 42, 0.75);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.4);
  backdrop-filter: blur(4px);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  font-family: var(--vp-font-family-mono);
}

.tr3-card-front-info {
  padding: 0.85rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
}

.tr3-card-title {
  font-size: 1rem;
  font-weight: 700;
  margin: 0;
  color: #ffffff;
  letter-spacing: -0.01em;
}

.tr3-card-sub {
  font-size: 0.72rem;
  color: #94a3b8;
  margin: 0.2rem 0 0;
}

/* Achterkant */
.tr3-card-back {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border: 1px solid #ea580c;
  color: #ffffff;
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
}

.tr3-back-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  text-align: left;
}

.tr3-back-tag {
  align-self: flex-start;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: rgba(232, 119, 34, 0.18);
  color: #fb923c;
  border: 1px solid rgba(232, 119, 34, 0.4);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.tr3-back-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0.4rem 0 0.25rem;
}

.tr3-back-desc {
  font-size: 0.78rem;
  line-height: 1.45;
  color: #cbd5e1;
  margin: 0;
}

.tr3-back-meta {
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(148, 163, 184, 0.2);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tr3-meta-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
}

.tr3-meta-label {
  color: #94a3b8;
}

.tr3-meta-val {
  color: #f8fafc;
}

/* Rechter Kolom */
.tr3-ctrl-panel {
  display: flex;
  flex-direction: column;
  padding: 0.75rem 1rem 1rem;
  background: var(--vp-c-bg-soft);
  gap: 0.7rem;
  overflow-y: auto;
}

.tr3-section {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 0.65rem;
}

.tr3-section-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.45rem;
}

.tr3-section-title code {
  font-size: 0.75rem;
  color: #0284c7;
}

.tr3-control-row {
  margin-bottom: 0.4rem;
}

.tr3-control-row:last-child {
  margin-bottom: 0;
}

.tr3-control-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  margin-bottom: 0.2rem;
  color: var(--vp-c-text-2);
}

.tr3-val {
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: #0284c7;
}

.tr3-slider {
  width: 100%;
  accent-color: #0284c7;
  cursor: pointer;
  margin: 0;
}

.tr3-toggles-grid {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.tr3-toggle-item {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  cursor: pointer;
}

.tr3-checkbox {
  accent-color: #0284c7;
  cursor: pointer;
}

/* CSS Code Box over de volle breedte onderaan */
.tr3-code-section {
  background: #1e1e1e;
  border-top: 1px solid var(--vp-c-divider);
  overflow: hidden;
}

.tr3-code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.45rem 1rem;
  background: #252526;
  border-bottom: 1px solid #333333;
}

.tr3-code-title {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9cdcfe;
}

.tr3-copy-btn {
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  background: #333333;
  color: #cccccc;
  border: 1px solid #444444;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.tr3-copy-btn:hover {
  background: #444444;
  color: #ffffff;
}

/* Twee kolommen naast elkaar */
.tr3-code-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

@media (max-width: 768px) {
  .tr3-code-columns {
    grid-template-columns: 1fr;
  }
}

.tr3-code-col {
  display: flex;
  flex-direction: column;
  border-right: 1px solid #2d2d2d;
}

.tr3-code-col:last-child {
  border-right: none;
}

.tr3-code-col-title {
  padding: 0.35rem 0.85rem;
  font-size: 0.68rem;
  font-weight: 600;
  color: #858585;
  background: #181818;
  border-bottom: 1px solid #282828;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.tr3-code-col-title code {
  color: #e87722;
  font-size: 0.7rem;
  background: transparent;
}

.tr3-code-block {
  margin: 0;
  padding: 0.75rem 1rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.78rem;
  line-height: 1.45;
  color: #d4d4d4;
  overflow-x: auto;
  white-space: pre;
}

.tr3-code-block code {
  color: inherit;
  background: transparent;
  padding: 0;
}
</style>
