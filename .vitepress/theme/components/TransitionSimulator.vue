<script setup lang="ts">
import { ref, computed } from 'vue'

type TimingFunction = 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'
type TargetProperty = 'transform' | 'background-color' | 'opacity' | 'width' | 'all'

const targetProp = ref<TargetProperty>('transform')
const duration = ref<number>(0.6)
const timingFunc = ref<TimingFunction>('ease')
const delay = ref<number>(0)
const isTriggered = ref<boolean>(false)

const timingOptions: { id: TimingFunction; label: string; desc: string }[] = [
  { id: 'ease', label: 'ease', desc: 'Snel midden, vertraagt einde (standaard)' },
  { id: 'linear', label: 'linear', desc: 'Constante snelheid' },
  { id: 'ease-in', label: 'ease-in', desc: 'Trage start, versnelt naar einde' },
  { id: 'ease-out', label: 'ease-out', desc: 'Snelle start, remt rustig af' },
  { id: 'ease-in-out', label: 'ease-in-out', desc: 'Trage start en trage rem' },
]

function selectProperty(prop: TargetProperty) {
  targetProp.value = prop
  isTriggered.value = false
}

function toggleTrigger() {
  isTriggered.value = !isTriggered.value
}

function resetAll() {
  isTriggered.value = false
  targetProp.value = 'transform'
  duration.value = 0.6
  timingFunc.value = 'ease'
  delay.value = 0
}

// Berekende CSS transition string
const computedTransition = computed(() => {
  return `${targetProp.value} ${duration.value}s ${timingFunc.value} ${delay.value}s`
})

// Is timing default (ease)?
const isDefaultTiming = computed(() => timingFunc.value === 'ease')
// Is delay default (0s)?
const isDefaultDelay = computed(() => delay.value === 0)
// Is property default (all)?
const isDefaultProp = computed(() => targetProp.value === 'all')

// Losse eigenschappen
const generatedFullCss = computed(() => {
  let css = `.element {\n`
  if (isDefaultProp.value) {
    css += `  /* transition-property: all; (standaardwaarde) */\n`
  } else {
    css += `  transition-property: ${targetProp.value};\n`
  }

  css += `  transition-duration: ${duration.value}s;\n`

  if (isDefaultTiming.value) {
    css += `  /* transition-timing-function: ease; (standaardwaarde) */\n`
  } else {
    css += `  transition-timing-function: ${timingFunc.value};\n`
  }

  if (isDefaultDelay.value) {
    css += `  /* transition-delay: 0s; (standaardwaarde) */\n`
  } else {
    css += `  transition-delay: ${delay.value}s;\n`
  }
  css += `}`
  return css
})

// Shorthand CSS
const generatedShorthandCss = computed(() => {
  let css = `.element {\n`
  css += `  /* Samengestelde shorthand notatie */\n`
  css += `  transition: ${targetProp.value} ${duration.value}s`
  if (!isDefaultTiming.value || !isDefaultDelay.value) {
    css += ` ${timingFunc.value}`
  }
  if (!isDefaultDelay.value) {
    css += ` ${delay.value}s`
  }
  css += `;\n}`
  return css
})

const generatedCssCode = computed(() => {
  return `${generatedFullCss.value}\n\n${generatedShorthandCss.value}`
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
  <div class="trs-sim">
    <!-- Header -->
    <div class="trs-sim-header">
      <div class="trs-sim-title">
        <svg class="trs-sim-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
        <span class="trs-sim-name">Transition Simulator</span>
      </div>
      <button type="button" class="trs-btn-reset" @click="resetAll">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        Herstel beginstand
      </button>
    </div>

    <!-- Main Grid -->
    <div class="trs-main-grid">
      <!-- LINKER KOLOM: Visuele Scène -->
      <div class="trs-stage-panel">
        <div class="trs-stage-header">
          <span class="trs-badge-live">Live Vergelijking</span>
          <button
            type="button"
            class="trs-btn-trigger"
            :class="{ 'is-active': isTriggered }"
            @click="toggleTrigger"
          >
            <span class="trs-trigger-dot"></span>
            {{ isTriggered ? 'Toestand: AAN (klik voor UIT)' : 'Toestand: UIT (klik voor AAN)' }}
          </button>
        </div>

        <div class="trs-canvas">
          <!-- Baan 1: ZONDER transitie (referentie) -->
          <div class="trs-track-wrap">
            <div class="trs-track-label">
              <span class="trs-badge-ref">Zonder transitie</span>
              <span class="trs-track-hint">Springt direct in 0 seconden</span>
            </div>
            <div class="trs-track">
              <!-- Ghost start -->
              <div class="trs-ghost-start"></div>
              <!-- Het element -->
              <div
                class="trs-box trs-box-no-transition"
                :class="[
                  `prop-${targetProp}`,
                  { 'is-active': isTriggered }
                ]"
              >
                <span>Direct</span>
              </div>
            </div>
          </div>

          <!-- Baan 2: MET transitie -->
          <div class="trs-track-wrap">
            <div class="trs-track-label">
              <span class="trs-badge-active">Met CSS transitie</span>
              <span class="trs-track-hint">{{ duration }}s &bull; {{ timingFunc }}<template v-if="delay > 0"> &bull; delay: {{ delay }}s</template></span>
            </div>
            <div class="trs-track">
              <!-- Ghost start -->
              <div class="trs-ghost-start"></div>
              <!-- Het element met transitie -->
              <div
                class="trs-box trs-box-transitioned"
                :class="[
                  `prop-${targetProp}`,
                  { 'is-active': isTriggered }
                ]"
                :style="{
                  transition: computedTransition
                }"
              >
                <span>Vloeiend</span>
              </div>
            </div>
          </div>

          <div class="trs-instruction-bar">
            <span>Tip: Klik op de toestand-knop of wijzig de sliders om het effect direct te herstarten.</span>
          </div>
        </div>
      </div>

      <!-- RECHTER KOLOM: Besturing & Code -->
      <div class="trs-ctrl-panel">
        <!-- 1. Eigenschap Keuze -->
        <div class="trs-section">
          <div class="trs-section-title">Eigenschap: <code>transition-property</code></div>
          <div class="trs-prop-buttons">
            <button
              v-for="p in (['transform', 'background-color', 'opacity', 'width', 'all'] as TargetProperty[])"
              :key="p"
              type="button"
              class="trs-prop-btn"
              :class="{ 'is-active': targetProp === p }"
              @click="selectProperty(p)"
            >
              <code>{{ p }}</code>
            </button>
          </div>
        </div>

        <!-- 2. Duur & Vertraging -->
        <div class="trs-section">
          <div class="trs-section-title">Timing & Parameters</div>

          <div class="trs-control-row">
            <div class="trs-control-header">
              <label for="trs-dur">Duur (<code>transition-duration</code>):</label>
              <span class="trs-val">{{ duration }}s</span>
            </div>
            <input
              id="trs-dur"
              type="range"
              min="0.1"
              max="2.5"
              step="0.1"
              v-model.number="duration"
              class="trs-slider"
            />
          </div>

          <div class="trs-control-row">
            <div class="trs-control-header">
              <label for="trs-del">Startvertraging (<code>transition-delay</code>):</label>
              <span class="trs-val" :class="{ 'is-muted': isDefaultDelay }">
                {{ delay }}s <template v-if="isDefaultDelay">(geen)</template>
              </span>
            </div>
            <input
              id="trs-del"
              type="range"
              min="0"
              max="1.5"
              step="0.1"
              v-model.number="delay"
              class="trs-slider"
            />
          </div>
        </div>

        <!-- 3. Timing Functie -->
        <div class="trs-section">
          <div class="trs-section-title">Verloop: <code>transition-timing-function</code></div>
          <div class="trs-timing-grid">
            <button
              v-for="t in timingOptions"
              :key="t.id"
              type="button"
              class="trs-timing-btn"
              :class="{ 'is-active': timingFunc === t.id }"
              :title="t.desc"
              @click="timingFunc = t.id"
            >
              <code>{{ t.label }}</code>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. CSS Code Box over de VOLLE BREEDTE (2 kolommen) -->
    <div class="trs-code-section">
      <div class="trs-code-header">
        <span class="trs-code-title">Gegenereerde CSS Code</span>
        <button type="button" class="trs-copy-btn" @click="copyCode">
          {{ copied ? 'Gekopieerd!' : 'Kopieer alle CSS' }}
        </button>
      </div>
      <div class="trs-code-columns">
        <div class="trs-code-col">
          <div class="trs-code-col-title">Losse Eigenschappen (met defaults)</div>
          <pre class="trs-code-block"><code>{{ generatedFullCss }}</code></pre>
        </div>
        <div class="trs-code-col">
          <div class="trs-code-col-title">Shorthand Eigenschap (<code>transition</code>)</div>
          <pre class="trs-code-block"><code>{{ generatedShorthandCss }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.trs-sim {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
  margin: 1.5rem 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.trs-sim-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.trs-sim-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
}

.trs-sim-icon {
  color: #e87722;
}

.trs-btn-reset {
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

.trs-btn-reset:hover {
  color: #e87722;
  border-color: #e87722;
}

.trs-main-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  min-height: 470px;
}

@media (max-width: 860px) {
  .trs-main-grid {
    grid-template-columns: 1fr;
  }
}

/* Linker Kolom: Scène */
.trs-stage-panel {
  display: flex;
  flex-direction: column;
  background: var(--vp-c-bg);
  border-right: 1px solid var(--vp-c-divider);
  padding: 0.75rem 1rem 1rem;
}

@media (max-width: 860px) {
  .trs-stage-panel {
    border-right: none;
    border-bottom: 1px solid var(--vp-c-divider);
  }
}

.trs-stage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.trs-badge-live {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
  color: #0284c7;
  background: rgba(2, 132, 199, 0.1);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.trs-btn-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.85rem;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 6px;
  border: 1px solid #0284c7;
  background: #0284c7;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.trs-btn-trigger:hover {
  opacity: 0.9;
}

.trs-btn-trigger.is-active {
  background: #e87722;
  border-color: #e87722;
}

.trs-trigger-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ffffff;
}

.trs-canvas {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  justify-content: center;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1.25rem;
}

.trs-track-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.trs-track-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.78rem;
}

.trs-badge-ref {
  font-weight: 600;
  color: #64748b;
}

.trs-badge-active {
  font-weight: 600;
  color: #0284c7;
}

.trs-track-hint {
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}

.trs-track {
  position: relative;
  height: 68px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  display: flex;
  align-items: center;
  padding: 6px;
}

.trs-ghost-start {
  position: absolute;
  left: 6px;
  width: 120px;
  height: 54px;
  border: 2px dashed #cbd5e1;
  border-radius: 6px;
  pointer-events: none;
}

/* Lopers */
.trs-box {
  width: 120px;
  height: 54px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffffff;
  z-index: 2;
  user-select: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.trs-box-no-transition {
  background: #64748b;
}

.trs-box-transitioned {
  background: #0284c7;
}

/* Toestanden per geanimeerde eigenschap */
.prop-transform.is-active {
  transform: translateX(200px);
}

.prop-background-color.is-active {
  background-color: #e87722 !important;
}

.prop-opacity.is-active {
  opacity: 0.15;
}

.prop-width.is-active {
  width: 260px;
}

.prop-all.is-active {
  transform: translateX(180px);
  background-color: #e87722 !important;
  opacity: 0.85;
}

.trs-instruction-bar {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  text-align: center;
}

/* Rechter Kolom: Besturing */
.trs-ctrl-panel {
  display: flex;
  flex-direction: column;
  padding: 0.75rem 1rem 1rem;
  background: var(--vp-c-bg-soft);
  gap: 0.75rem;
  overflow-y: auto;
}

.trs-section {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 0.7rem;
}

.trs-section-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.45rem;
}

.trs-section-title code {
  font-size: 0.75rem;
  color: #e87722;
}

.trs-prop-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.trs-prop-btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.15s ease;
}

.trs-prop-btn:hover {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.trs-prop-btn.is-active {
  background: #e87722;
  color: #ffffff;
  border-color: #e87722;
}

.trs-prop-btn code {
  color: inherit;
  background: transparent;
  padding: 0;
}

.trs-control-row {
  margin-bottom: 0.45rem;
}

.trs-control-row:last-child {
  margin-bottom: 0;
}

.trs-control-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  margin-bottom: 0.2rem;
  color: var(--vp-c-text-2);
}

.trs-control-header code {
  font-size: 0.72rem;
}

.trs-val {
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: #e87722;
}

.trs-val.is-muted {
  color: var(--vp-c-text-3);
  font-weight: normal;
}

.trs-slider {
  width: 100%;
  accent-color: #e87722;
  cursor: pointer;
  margin: 0;
}

/* Timing Functies Grid */
.trs-timing-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.3rem;
}

.trs-timing-btn {
  padding: 0.3rem 0.4rem;
  font-size: 0.72rem;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  text-align: center;
  transition: all 0.15s ease;
}

.trs-timing-btn:hover {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.trs-timing-btn.is-active {
  background: #0284c7;
  color: #ffffff;
  border-color: #0284c7;
}

.trs-timing-btn code {
  color: inherit;
  background: transparent;
}

/* CSS Code Box over de volle breedte onderaan */
.trs-code-section {
  background: #1e1e1e;
  border-top: 1px solid var(--vp-c-divider);
  overflow: hidden;
}

.trs-code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.45rem 1rem;
  background: #252526;
  border-bottom: 1px solid #333333;
}

.trs-code-title {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9cdcfe;
}

.trs-copy-btn {
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  background: #333333;
  color: #cccccc;
  border: 1px solid #444444;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.trs-copy-btn:hover {
  background: #444444;
  color: #ffffff;
}

/* Twee kolommen naast elkaar */
.trs-code-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

@media (max-width: 768px) {
  .trs-code-columns {
    grid-template-columns: 1fr;
  }
}

.trs-code-col {
  display: flex;
  flex-direction: column;
  border-right: 1px solid #2d2d2d;
}

.trs-code-col:last-child {
  border-right: none;
}

.trs-code-col-title {
  padding: 0.35rem 0.85rem;
  font-size: 0.68rem;
  font-weight: 600;
  color: #858585;
  background: #181818;
  border-bottom: 1px solid #282828;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.trs-code-col-title code {
  color: #e87722;
  font-size: 0.7rem;
  background: transparent;
}

.trs-code-block {
  margin: 0;
  padding: 0.75rem 1rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.78rem;
  line-height: 1.45;
  color: #d4d4d4;
  overflow-x: auto;
  white-space: pre;
}

.trs-code-block code {
  color: inherit;
  background: transparent;
  padding: 0;
}
</style>
