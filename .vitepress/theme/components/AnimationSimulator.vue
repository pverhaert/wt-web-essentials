<script setup lang="ts">
import { ref, computed } from 'vue'

type KeyframePreset = 'verschuif' | 'pulseer' | 'stuiter' | 'draai'
type TimingFunc = 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'
type Direction = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse'
type FillMode = 'none' | 'forwards' | 'backwards' | 'both'

const isPlaying = ref<boolean>(true)
const selectedPreset = ref<KeyframePreset>('verschuif')
const duration = ref<number>(2.0)
const timingFunction = ref<TimingFunc>('ease')
const delay = ref<number>(0)
const iterationCount = ref<string>('infinite')
const direction = ref<Direction>('normal')
const fillMode = ref<FillMode>('none')
const animRunKey = ref<number>(0)

const presets = [
  { id: 'verschuif', name: 'Verschuiven', desc: 'Horizontaal glijden met kleurwissel' },
  { id: 'pulseer', name: 'Pulseren', desc: 'Schalen en gloed' },
  { id: 'stuiter', name: 'Stuiteren', desc: 'Verticale bounce met compressie' },
  { id: 'draai', name: 'Draaien', desc: '360 graden continue rotatie' },
]

function restartAnimation() {
  animRunKey.value++
  isPlaying.value = true
}

function setPreset(p: KeyframePreset) {
  selectedPreset.value = p
  restartAnimation()
}

function setDirection(d: Direction) {
  direction.value = d
  restartAnimation()
}

function setIteration(cnt: string) {
  iterationCount.value = cnt
  restartAnimation()
}

function togglePlay() {
  isPlaying.value = !isPlaying.value
}

function resetAll() {
  selectedPreset.value = 'verschuif'
  duration.value = 2.0
  timingFunction.value = 'ease'
  delay.value = 0
  iterationCount.value = 'infinite'
  direction.value = 'normal'
  fillMode.value = 'none'
  isPlaying.value = true
  animRunKey.value++
}

// Berekende shorthand CSS
const shorthandCss = computed(() => {
  let parts = [
    selectedPreset.value,
    `${duration.value}s`,
    timingFunction.value
  ]
  if (delay.value > 0) parts.push(`${delay.value}s`)
  if (iterationCount.value !== '1') parts.push(iterationCount.value)
  if (direction.value !== 'normal') parts.push(direction.value)
  if (fillMode.value !== 'none') parts.push(fillMode.value)
  return parts.join(' ')
})

// Element CSS (Klasse en animatie-instellingen)
const generatedElementCss = computed(() => {
  let css = `.element {\n`
  css += `  animation-name: ${selectedPreset.value};\n`
  css += `  animation-duration: ${duration.value}s;\n`

  if (timingFunction.value === 'ease') {
    css += `  /* animation-timing-function: ease; (standaardwaarde) */\n`
  } else {
    css += `  animation-timing-function: ${timingFunction.value};\n`
  }

  if (delay.value === 0) {
    css += `  /* animation-delay: 0s; (standaardwaarde) */\n`
  } else {
    css += `  animation-delay: ${delay.value}s;\n`
  }

  if (iterationCount.value === '1') {
    css += `  /* animation-iteration-count: 1; (standaardwaarde) */\n`
  } else {
    css += `  animation-iteration-count: ${iterationCount.value};\n`
  }

  if (direction.value === 'normal') {
    css += `  /* animation-direction: normal; (standaardwaarde) */\n`
  } else {
    css += `  animation-direction: ${direction.value};\n`
  }

  if (fillMode.value === 'none') {
    css += `  /* animation-fill-mode: none; (standaardwaarde) */\n`
  } else {
    css += `  animation-fill-mode: ${fillMode.value};\n`
  }

  css += `\n  /* Of compact als shorthand: */\n`
  css += `  animation: ${shorthandCss.value};\n`
  css += `}`
  return css
})

// Keyframe declaratie
const generatedKeyframesCss = computed(() => {
  if (selectedPreset.value === 'verschuif') {
    return `@keyframes verschuif {\n  0% {\n    transform: translateX(0);\n    background-color: #0284c7;\n  }\n  100% {\n    transform: translateX(160px);\n    background-color: #e87722;\n  }\n}`
  } else if (selectedPreset.value === 'pulseer') {
    return `@keyframes pulseer {\n  0%, 100% {\n    transform: scale(1);\n    box-shadow: 0 0 0 0 rgba(2, 132, 199, 0.4);\n  }\n  50% {\n    transform: scale(1.25);\n    box-shadow: 0 0 0 12px rgba(232, 119, 34, 0);\n  }\n}`
  } else if (selectedPreset.value === 'stuiter') {
    return `@keyframes stuiter {\n  0%, 100% {\n    transform: translateY(0);\n  }\n  50% {\n    transform: translateY(-50px);\n  }\n}`
  } else if (selectedPreset.value === 'draai') {
    return `@keyframes draai {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}`
  }
  return ''
})

const generatedCssCode = computed(() => {
  return `${generatedElementCss.value}\n\n${generatedKeyframesCss.value}`
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
  <div class="ani-sim">
    <!-- Header -->
    <div class="ani-sim-header">
      <div class="ani-sim-title">
        <svg class="ani-sim-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
        <span class="ani-sim-name">Animation & Keyframes Simulator</span>
      </div>
      <button type="button" class="ani-btn-reset" @click="resetAll">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        Herstel beginstand
      </button>
    </div>

    <!-- Main Grid -->
    <div class="ani-main-grid">
      <!-- LINKER KOLOM: Speelveld -->
      <div class="ani-stage-panel">
        <div class="ani-stage-header">
          <div class="ani-stage-controls">
            <button
              type="button"
              class="ani-play-btn"
              :class="{ 'is-paused': !isPlaying }"
              @click="togglePlay"
            >
              {{ isPlaying ? 'Pauzeer' : 'Hervat' }}
            </button>
            <button type="button" class="ani-restart-btn" @click="restartAnimation">
              Herstart cyclus
            </button>
          </div>
          <span class="ani-badge-info">{{ selectedPreset }} &bull; {{ iterationCount }}</span>
        </div>

        <div class="ani-canvas">
          <!-- Start Ghost Marker -->
          <div class="ani-ghost-start" title="Beginpositie (0%)"></div>

          <!-- Geanimeerd Element -->
          <div
            :key="animRunKey"
            class="ani-box"
            :class="`anim-${selectedPreset}`"
            :style="{
              animationDuration: `${duration}s`,
              animationTimingFunction: timingFunction,
              animationDelay: `${delay}s`,
              animationIterationCount: iterationCount,
              animationDirection: direction,
              animationFillMode: fillMode,
              animationPlayState: isPlaying ? 'running' : 'paused'
            }"
          >
            <span class="ani-box-label">@keyframe</span>
          </div>

          <!-- Einde Ghost Marker (voor verschuif) -->
          <div v-if="selectedPreset === 'verschuif'" class="ani-ghost-end" title="Eindpositie (100%)"></div>
        </div>

        <div class="ani-stage-footer">
          <span class="ani-legend-item"><span class="ani-legend-ghost"></span> Startpositie (0%)</span>
          <span class="ani-legend-item" v-if="selectedPreset === 'verschuif'"><span class="ani-legend-ghost-end"></span> Finishpositie (100%)</span>
          <span class="ani-play-status">Status: <strong>{{ isPlaying ? 'Actief' : 'Gepauzeerd' }}</strong></span>
        </div>
      </div>

      <!-- RECHTER KOLOM: Besturing & Code -->
      <div class="ani-ctrl-panel">
        <!-- 1. Presets -->
        <div class="ani-section">
          <div class="ani-section-title">Keyframe Patroon (<code>@keyframes</code>)</div>
          <div class="ani-preset-grid">
            <button
              v-for="p in presets"
              :key="p.id"
              type="button"
              class="ani-preset-btn"
              :class="{ 'is-active': selectedPreset === p.id }"
              @click="setPreset(p.id as KeyframePreset)"
            >
              {{ p.name }}
            </button>
          </div>
        </div>

        <!-- 2. Timing & Herhaling -->
        <div class="ani-section">
          <div class="ani-section-title">Animatie Eigenschappen</div>

          <div class="ani-control-row">
            <div class="ani-control-header">
              <label for="ani-dur">Duur (<code>animation-duration</code>):</label>
              <span class="ani-val">{{ duration }}s</span>
            </div>
            <input
              id="ani-dur"
              type="range"
              min="0.5"
              max="5"
              step="0.25"
              v-model.number="duration"
              class="ani-slider"
            />
          </div>

          <div class="ani-control-row">
            <div class="ani-control-header">
              <label for="ani-del">Startvertraging (<code>animation-delay</code>):</label>
              <span class="ani-val" :class="{ 'is-muted': delay === 0 }">{{ delay }}s</span>
            </div>
            <input
              id="ani-del"
              type="range"
              min="0"
              max="2"
              step="0.25"
              v-model.number="delay"
              class="ani-slider"
            />
          </div>

          <!-- Iteration Count -->
          <div class="ani-control-row">
            <div class="ani-control-header">
              <label>Herhalingen (<code>iteration-count</code>):</label>
              <span class="ani-val">{{ iterationCount }}</span>
            </div>
            <div class="ani-btn-group">
              <button
                v-for="cnt in ['1', '2', '3', 'infinite']"
                :key="cnt"
                type="button"
                class="ani-opt-btn"
                :class="{ 'is-active': iterationCount === cnt }"
                @click="setIteration(cnt)"
              >
                {{ cnt }}
              </button>
            </div>
          </div>

          <!-- Direction -->
          <div class="ani-control-row">
            <div class="ani-control-header">
              <label>Richting (<code>animation-direction</code>):</label>
              <span class="ani-val">{{ direction }}</span>
            </div>
            <div class="ani-btn-group">
              <button
                v-for="d in (['normal', 'reverse', 'alternate', 'alternate-reverse'] as Direction[])"
                :key="d"
                type="button"
                class="ani-opt-btn"
                :class="{ 'is-active': direction === d }"
                @click="setDirection(d)"
              >
                {{ d }}
              </button>
            </div>
            <div v-if="direction === 'alternate' || direction === 'alternate-reverse'" class="ani-direction-hint">
              <template v-if="direction === 'alternate'">
                <strong>alternate:</strong> Start voorwaarts (0% &rarr; 100%), keert daarna om (100% &rarr; 0%).
              </template>
              <template v-else>
                <strong>alternate-reverse:</strong> Start direct achterwaarts (100% &rarr; 0%), keert daarna om (0% &rarr; 100%).
              </template>
            </div>
          </div>

          <!-- Fill Mode -->
          <div class="ani-control-row">
            <div class="ani-control-header">
              <label>Fill-mode (<code>animation-fill-mode</code>):</label>
              <span class="ani-val">{{ fillMode }}</span>
            </div>
            <div class="ani-btn-group">
              <button
                v-for="f in (['none', 'forwards', 'backwards', 'both'] as FillMode[])"
                :key="f"
                type="button"
                class="ani-opt-btn"
                :class="{ 'is-active': fillMode === f }"
                @click="fillMode = f"
              >
                {{ f }}
              </button>
            </div>
            <!-- Tip over infinite vs fill-mode -->
            <div v-if="iterationCount === 'infinite' && fillMode !== 'none'" class="ani-hint-box">
              <span class="ani-hint-icon">&#9432;</span>
              <span>Tip: <code>{{ fillMode }}</code> bepaalt de toestand <em>na afloop</em> van de animatie. Kies bij <code>iteration-count</code> bijvoorbeeld <strong>1</strong> of <strong>2</strong> om de finishstand direct te zien!</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. CSS Code Box over de VOLLE BREEDTE (Optie B: Twee kolommen) -->
    <div class="ani-code-section">
      <div class="ani-code-header">
        <span class="ani-code-title">Gegenereerde CSS Code</span>
        <button type="button" class="ani-copy-btn" @click="copyCode">
          {{ copied ? 'Gekopieerd!' : 'Kopieer alle CSS' }}
        </button>
      </div>
      <div class="ani-code-columns">
        <div class="ani-code-col">
          <div class="ani-code-col-title">Klasse &amp; Animatie-eigenschappen</div>
          <pre class="ani-code-block"><code>{{ generatedElementCss }}</code></pre>
        </div>
        <div class="ani-code-col">
          <div class="ani-code-col-title">Keyframe Tijdlijn (<code>@keyframes</code>)</div>
          <pre class="ani-code-block"><code>{{ generatedKeyframesCss }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ani-sim {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
  margin: 1.5rem 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.ani-sim-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.ani-sim-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
}

.ani-sim-icon {
  color: #0284c7;
}

.ani-btn-reset {
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

.ani-btn-reset:hover {
  color: #e87722;
  border-color: #e87722;
}

.ani-main-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  min-height: 480px;
}

@media (max-width: 900px) {
  .ani-main-grid {
    grid-template-columns: 1fr;
  }
}

/* Linker Kolom */
.ani-stage-panel {
  display: flex;
  flex-direction: column;
  background: var(--vp-c-bg);
  border-right: 1px solid var(--vp-c-divider);
  padding: 0.75rem 1rem 1rem;
}

@media (max-width: 900px) {
  .ani-stage-panel {
    border-right: none;
    border-bottom: 1px solid var(--vp-c-divider);
  }
}

.ani-stage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.ani-stage-controls {
  display: flex;
  gap: 0.4rem;
}

.ani-play-btn, .ani-restart-btn {
  padding: 0.35rem 0.7rem;
  font-size: 0.78rem;
  font-weight: 600;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  cursor: pointer;
  transition: all 0.15s ease;
}

.ani-play-btn {
  background: #0284c7;
  color: #ffffff;
  border-color: #0284c7;
}

.ani-play-btn.is-paused {
  background: #e87722;
  border-color: #e87722;
}

.ani-restart-btn {
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}

.ani-restart-btn:hover {
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
}

.ani-badge-info {
  font-size: 0.75rem;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-2);
}

.ani-canvas {
  flex: 1;
  position: relative;
  min-height: 280px;
  background: 
    linear-gradient(to right, rgba(148, 163, 184, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
  background-size: 20px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Ghosts */
.ani-ghost-start {
  position: absolute;
  left: calc(50% - 140px);
  width: 120px;
  height: 54px;
  border: 2px dashed #94a3b8;
  border-radius: 6px;
  pointer-events: none;
}

.ani-ghost-end {
  position: absolute;
  left: calc(50% + 20px);
  width: 120px;
  height: 54px;
  border: 2px dashed #0284c7;
  border-radius: 6px;
  pointer-events: none;
  opacity: 0.5;
}

/* Geanimeerd element (groter, zoals transition simulator) */
.ani-box {
  position: absolute;
  left: calc(50% - 140px);
  width: 120px;
  height: 54px;
  background: #0284c7;
  color: #ffffff;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
  user-select: none;
  z-index: 2;
}

.anim-verschuif {
  animation-name: verschuif;
}

.anim-pulseer {
  animation-name: pulseer;
}

.anim-stuiter {
  animation-name: stuiter;
}

.anim-draai {
  animation-name: draai;
}

/* Keyframe animaties gedefinieerd in CSS */
@keyframes verschuif {
  0% {
    transform: translateX(0);
    background-color: #0284c7;
  }
  100% {
    transform: translateX(160px);
    background-color: #e87722;
  }
}

@keyframes pulseer {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(2, 132, 199, 0.5);
  }
  50% {
    transform: scale(1.3);
    background-color: #e87722;
    box-shadow: 0 0 0 14px rgba(232, 119, 34, 0);
  }
}

@keyframes stuiter {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-60px);
    background-color: #e87722;
  }
}

@keyframes draai {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.ani-stage-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  font-size: 0.72rem;
  color: var(--vp-c-text-2);
  flex-wrap: wrap;
  gap: 0.5rem;
}

.ani-legend-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.ani-legend-ghost {
  display: inline-block;
  width: 12px;
  height: 8px;
  border: 1.5px dashed #94a3b8;
  border-radius: 2px;
}

.ani-legend-ghost-end {
  display: inline-block;
  width: 12px;
  height: 8px;
  border: 1.5px dashed #0284c7;
  border-radius: 2px;
}

/* Rechter Kolom */
.ani-ctrl-panel {
  display: flex;
  flex-direction: column;
  padding: 0.75rem 1rem 1rem;
  background: var(--vp-c-bg-soft);
  gap: 0.75rem;
  overflow-y: auto;
}

.ani-section {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 0.7rem;
}

.ani-section-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.45rem;
}

.ani-section-title code {
  font-size: 0.75rem;
  color: #0284c7;
}

.ani-preset-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.35rem;
}

.ani-preset-btn {
  padding: 0.35rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  text-align: center;
  transition: all 0.15s ease;
}

.ani-preset-btn:hover {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.ani-preset-btn.is-active {
  background: #0284c7;
  color: #ffffff;
  border-color: #0284c7;
  font-weight: 600;
}

.ani-control-row {
  margin-bottom: 0.45rem;
}

.ani-control-row:last-child {
  margin-bottom: 0;
}

.ani-control-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  margin-bottom: 0.2rem;
  color: var(--vp-c-text-2);
}

.ani-control-header code {
  font-size: 0.72rem;
}

.ani-val {
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: #0284c7;
}

.ani-slider {
  width: 100%;
  accent-color: #0284c7;
  cursor: pointer;
  margin: 0;
}

.ani-btn-group {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.ani-opt-btn {
  padding: 0.2rem 0.45rem;
  font-size: 0.7rem;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-family: var(--vp-font-family-mono);
  transition: all 0.15s ease;
}

.ani-opt-btn:hover {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.ani-opt-btn.is-active {
  background: #e87722;
  color: #ffffff;
  border-color: #e87722;
  font-weight: 600;
}

/* Direction hint */
.ani-direction-hint {
  margin-top: 0.35rem;
  font-size: 0.72rem;
  line-height: 1.35;
  color: #0284c7;
  background: rgba(2, 132, 199, 0.08);
  border: 1px solid rgba(2, 132, 199, 0.2);
  border-radius: 4px;
  padding: 0.35rem 0.55rem;
}

/* Hint Box voor fill-mode en infinite */
.ani-hint-box {
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  margin-top: 0.5rem;
  padding: 0.45rem 0.6rem;
  background: rgba(232, 119, 34, 0.1);
  border: 1px solid rgba(232, 119, 34, 0.3);
  border-radius: 6px;
  font-size: 0.72rem;
  line-height: 1.35;
  color: var(--vp-c-text-1);
}

.ani-hint-icon {
  color: #e87722;
  font-weight: bold;
  font-size: 0.85rem;
  line-height: 1;
}

/* Code Box over de volle breedte onderaan */
.ani-code-section {
  background: #1e1e1e;
  border-top: 1px solid var(--vp-c-divider);
  overflow: hidden;
}

.ani-code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.45rem 1rem;
  background: #252526;
  border-bottom: 1px solid #333333;
}

.ani-code-title {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9cdcfe;
}

.ani-copy-btn {
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  background: #333333;
  color: #cccccc;
  border: 1px solid #444444;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.ani-copy-btn:hover {
  background: #444444;
  color: #ffffff;
}

/* Twee kolommen naast elkaar */
.ani-code-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  divide-x: 1px solid #333333;
}

@media (max-width: 768px) {
  .ani-code-columns {
    grid-template-columns: 1fr;
  }
}

.ani-code-col {
  display: flex;
  flex-direction: column;
  border-right: 1px solid #2d2d2d;
}

.ani-code-col:last-child {
  border-right: none;
}

.ani-code-col-title {
  padding: 0.35rem 0.85rem;
  font-size: 0.68rem;
  font-weight: 600;
  color: #858585;
  background: #181818;
  border-bottom: 1px solid #282828;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.ani-code-col-title code {
  color: #e87722;
  font-size: 0.7rem;
  background: transparent;
}

.ani-code-block {
  margin: 0;
  padding: 0.75rem 1rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.78rem;
  line-height: 1.45;
  color: #d4d4d4;
  overflow-x: auto;
  white-space: pre;
}

.ani-code-block code {
  color: inherit;
  background: transparent;
  padding: 0;
}
</style>
