<script setup lang="ts">
import { ref, computed } from 'vue'

type TransformMode = 'rotate' | 'translate' | 'scale' | 'skew' | 'combined'

const activeMode = ref<TransformMode>('rotate')

// Waarden
const rotateDeg = ref<number>(30)
const translateX = ref<number>(0)
const translateY = ref<number>(0)
const scaleX = ref<number>(1)
const scaleY = ref<number>(1)
const scaleLinked = ref<boolean>(true)
const skewXDeg = ref<number>(0)
const skewYDeg = ref<number>(0)

// Transform Origin (in %)
const originX = ref<number>(50)
const originY = ref<number>(50)

// Anker presets
const originPresets = [
  { label: 'TL', x: 0, y: 0, title: 'top left (0% 0%)' },
  { label: 'TC', x: 50, y: 0, title: 'top center (50% 0%)' },
  { label: 'TR', x: 100, y: 0, title: 'top right (100% 0%)' },
  { label: 'CL', x: 0, y: 50, title: 'center left (0% 50%)' },
  { label: 'C', x: 50, y: 50, title: 'center (50% 50%)' },
  { label: 'CR', x: 100, y: 50, title: 'center right (100% 50%)' },
  { label: 'BL', x: 0, y: 100, title: 'bottom left (0% 100%)' },
  { label: 'BC', x: 50, y: 100, title: 'bottom center (50% 100%)' },
  { label: 'BR', x: 100, y: 100, title: 'bottom right (100% 100%)' },
]

function setPreset(x: number, y: number) {
  originX.value = x
  originY.value = y
}

function onScaleXChange(val: number) {
  scaleX.value = val
  if (scaleLinked.value) {
    scaleY.value = val
  }
}

function onScaleYChange(val: number) {
  scaleY.value = val
  if (scaleLinked.value) {
    scaleX.value = val
  }
}

function resetAll() {
  rotateDeg.value = 0
  translateX.value = 0
  translateY.value = 0
  scaleX.value = 1
  scaleY.value = 1
  skewXDeg.value = 0
  skewYDeg.value = 0
  originX.value = 50
  originY.value = 50
}

function setQuickMode(mode: TransformMode) {
  activeMode.value = mode
  if (mode === 'rotate' && rotateDeg.value === 0) {
    rotateDeg.value = 30
  } else if (mode === 'translate' && translateX.value === 0 && translateY.value === 0) {
    translateX.value = 40
    translateY.value = -20
  } else if (mode === 'scale' && scaleX.value === 1 && scaleY.value === 1) {
    scaleX.value = 1.3
    scaleY.value = 1.3
  } else if (mode === 'skew' && skewXDeg.value === 0 && skewYDeg.value === 0) {
    skewXDeg.value = 15
  }
}

// Berekende CSS transform string voor element
const activeTransformCss = computed(() => {
  const parts: string[] = []

  if (activeMode.value === 'rotate') {
    if (rotateDeg.value !== 0) parts.push(`rotate(${rotateDeg.value}deg)`)
  } else if (activeMode.value === 'translate') {
    if (translateX.value !== 0 || translateY.value !== 0) {
      parts.push(`translate(${translateX.value}px, ${translateY.value}px)`)
    }
  } else if (activeMode.value === 'scale') {
    if (scaleX.value !== 1 || scaleY.value !== 1) {
      if (scaleX.value === scaleY.value) {
        parts.push(`scale(${scaleX.value})`)
      } else {
        parts.push(`scale(${scaleX.value}, ${scaleY.value})`)
      }
    }
  } else if (activeMode.value === 'skew') {
    if (skewXDeg.value !== 0 && skewYDeg.value !== 0) {
      parts.push(`skew(${skewXDeg.value}deg, ${skewYDeg.value}deg)`)
    } else if (skewXDeg.value !== 0) {
      parts.push(`skewX(${skewXDeg.value}deg)`)
    } else if (skewYDeg.value !== 0) {
      parts.push(`skewY(${skewYDeg.value}deg)`)
    }
  } else if (activeMode.value === 'combined') {
    if (translateX.value !== 0 || translateY.value !== 0) {
      parts.push(`translate(${translateX.value}px, ${translateY.value}px)`)
    }
    if (rotateDeg.value !== 0) parts.push(`rotate(${rotateDeg.value}deg)`)
    if (scaleX.value !== 1 || scaleY.value !== 1) {
      if (scaleX.value === scaleY.value) {
        parts.push(`scale(${scaleX.value})`)
      } else {
        parts.push(`scale(${scaleX.value}, ${scaleY.value})`)
      }
    }
    if (skewXDeg.value !== 0) parts.push(`skewX(${skewXDeg.value}deg)`)
    if (skewYDeg.value !== 0) parts.push(`skewY(${skewYDeg.value}deg)`)
  }

  return parts.length > 0 ? parts.join(' ') : 'none'
})

// Berekende origin string
const activeOriginCss = computed(() => {
  return `${originX.value}% ${originY.value}%`
})

// Is origin default (50% 50%)?
const isDefaultOrigin = computed(() => {
  return originX.value === 50 && originY.value === 50
})

// Is transform default (none)?
const isDefaultTransform = computed(() => {
  return activeTransformCss.value === 'none'
})

// Code weergave voor CSS vakje
const generatedCssCode = computed(() => {
  let css = `.element {\n`
  
  // Transform-origin regel
  if (isDefaultOrigin.value) {
    css += `  /* transform-origin: 50% 50%; (standaardwaarde) */\n`
  } else {
    css += `  transform-origin: ${activeOriginCss.value};\n`
  }

  // Transform regel
  if (isDefaultTransform.value) {
    css += `  /* transform: none; (standaardwaarde) */\n`
  } else {
    css += `  transform: ${activeTransformCss.value};\n`
  }

  css += `}`
  return css
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
  <div class="trf-sim">
    <!-- Header -->
    <div class="trf-sim-header">
      <div class="trf-sim-title">
        <svg class="trf-sim-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
        <span class="trf-sim-name">2D Transform & Origin Simulator</span>
      </div>
      <button type="button" class="trf-btn-reset" @click="resetAll">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        Herstel beginstand
      </button>
    </div>

    <!-- Modus Tabs -->
    <div class="trf-tabs" role="tablist">
      <button
        type="button"
        class="trf-tab"
        :class="{ 'is-active': activeMode === 'rotate' }"
        @click="setQuickMode('rotate')"
      >
        rotate()
      </button>
      <button
        type="button"
        class="trf-tab"
        :class="{ 'is-active': activeMode === 'translate' }"
        @click="setQuickMode('translate')"
      >
        translate()
      </button>
      <button
        type="button"
        class="trf-tab"
        :class="{ 'is-active': activeMode === 'scale' }"
        @click="setQuickMode('scale')"
      >
        scale()
      </button>
      <button
        type="button"
        class="trf-tab"
        :class="{ 'is-active': activeMode === 'skew' }"
        @click="setQuickMode('skew')"
      >
        skew()
      </button>
      <button
        type="button"
        class="trf-tab"
        :class="{ 'is-active': activeMode === 'combined' }"
        @click="setQuickMode('combined')"
      >
        Gecombineerd
      </button>
    </div>

    <!-- Main Grid: Scène (links) en Besturing + Code (rechts) -->
    <div class="trf-main-grid">
      <!-- LINKER KOLOM: Visuele Scène -->
      <div class="trf-stage-panel">
        <div class="trf-stage-header">
          <span class="trf-badge-live">Live Speelveld</span>
          <span class="trf-stage-hint">
            <span class="trf-legend-ghost"></span> Oorspronkelijke positie (ghost)
            <span class="trf-legend-pivot"></span> Rotatiepunt
          </span>
        </div>

        <div class="trf-canvas-wrap">
          <!-- Assenkruis -->
          <div class="trf-axis-x"></div>
          <div class="trf-axis-y"></div>

          <!-- Ghost Container (oorspronkelijke plek in stroom) -->
          <div class="trf-box-ghost">
            <span class="trf-ghost-label">origineel</span>
            <!-- Visueel ankerpunt op het origineel -->
            <div
              class="trf-pivot-marker is-ghost-pivot"
              :style="{ left: `${originX}%`, top: `${originY}%` }"
              :title="`Oorspronkelijk ankerpunt: ${originX}% ${originY}%`"
            ></div>
          </div>

          <!-- Getransformeerd Element -->
          <div
            class="trf-box-active"
            :style="{
              transform: activeTransformCss,
              transformOrigin: activeOriginCss
            }"
          >
            <div class="trf-box-content">
              <span class="trf-box-tag">HTML</span>
              <strong class="trf-box-title">&lt;div&gt;</strong>
              <span class="trf-box-sub">2D Transform</span>
            </div>

            <!-- Meedraaiend ankerpunt op het element -->
            <div
              class="trf-pivot-marker is-active-pivot"
              :style="{ left: `${originX}%`, top: `${originY}%` }"
              :title="`Actief rotatiepunt: ${originX}% ${originY}%`"
            >
              <div class="trf-pivot-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- RECHTER KOLOM: Sliders, Presets en CSS preview -->
      <div class="trf-ctrl-panel">
        <!-- 1. Transformatie Sliders -->
        <div class="trf-section">
          <div class="trf-section-title">Transformatie parameters</div>

          <!-- Rotate Controls -->
          <div v-if="activeMode === 'rotate' || activeMode === 'combined'" class="trf-control-row">
            <div class="trf-control-header">
              <label for="slider-rot">Rotatiehoek (<code>rotate</code>):</label>
              <span class="trf-val">{{ rotateDeg }}deg</span>
            </div>
            <input
              id="slider-rot"
              type="range"
              min="-180"
              max="180"
              step="5"
              v-model.number="rotateDeg"
              class="trf-slider"
            />
          </div>

          <!-- Translate Controls -->
          <div v-if="activeMode === 'translate' || activeMode === 'combined'" class="trf-control-group">
            <div class="trf-control-row">
              <div class="trf-control-header">
                <label for="slider-tx">Verschuiving X (<code>translateX</code>):</label>
                <span class="trf-val">{{ translateX }}px</span>
              </div>
              <input
                id="slider-tx"
                type="range"
                min="-120"
                max="120"
                step="5"
                v-model.number="translateX"
                class="trf-slider"
              />
            </div>
            <div class="trf-control-row">
              <div class="trf-control-header">
                <label for="slider-ty">Verschuiving Y (<code>translateY</code>):</label>
                <span class="trf-val">{{ translateY }}px</span>
              </div>
              <input
                id="slider-ty"
                type="range"
                min="-80"
                max="80"
                step="5"
                v-model.number="translateY"
                class="trf-slider"
              />
            </div>
          </div>

          <!-- Scale Controls -->
          <div v-if="activeMode === 'scale' || activeMode === 'combined'" class="trf-control-group">
            <div class="trf-control-row">
              <div class="trf-control-header">
                <label for="slider-sx">Schaal X (<code>scaleX</code>):</label>
                <span class="trf-val">{{ scaleX }}</span>
              </div>
              <input
                id="slider-sx"
                type="range"
                min="0.2"
                max="1.8"
                step="0.05"
                :value="scaleX"
                @input="onScaleXChange(parseFloat(($event.target as HTMLInputElement).value))"
                class="trf-slider"
              />
            </div>
            <div v-if="!scaleLinked" class="trf-control-row">
              <div class="trf-control-header">
                <label for="slider-sy">Schaal Y (<code>scaleY</code>):</label>
                <span class="trf-val">{{ scaleY }}</span>
              </div>
              <input
                id="slider-sy"
                type="range"
                min="0.2"
                max="1.8"
                step="0.05"
                :value="scaleY"
                @input="onScaleYChange(parseFloat(($event.target as HTMLInputElement).value))"
                class="trf-slider"
              />
            </div>
            <label class="trf-check-label">
              <input type="checkbox" v-model="scaleLinked" class="trf-checkbox" />
              <span>Gelijke verhouding (X en Y koppelen)</span>
            </label>
          </div>

          <!-- Skew Controls -->
          <div v-if="activeMode === 'skew' || activeMode === 'combined'" class="trf-control-group">
            <div class="trf-control-row">
              <div class="trf-control-header">
                <label for="slider-skx">Schuintrekken X (<code>skewX</code>):</label>
                <span class="trf-val">{{ skewXDeg }}deg</span>
              </div>
              <input
                id="slider-skx"
                type="range"
                min="-45"
                max="45"
                step="5"
                v-model.number="skewXDeg"
                class="trf-slider"
              />
            </div>
            <div class="trf-control-row">
              <div class="trf-control-header">
                <label for="slider-sky">Schuintrekken Y (<code>skewY</code>):</label>
                <span class="trf-val">{{ skewYDeg }}deg</span>
              </div>
              <input
                id="slider-sky"
                type="range"
                min="-45"
                max="45"
                step="5"
                v-model.number="skewYDeg"
                class="trf-slider"
              />
            </div>
          </div>
        </div>

        <!-- 2. Transform Origin Controls -->
        <div class="trf-section">
          <div class="trf-section-header-wrap">
            <div class="trf-section-title">
              Rotatiepunt: <code>transform-origin</code>
            </div>
            <span class="trf-val" :class="{ 'is-muted': isDefaultOrigin }">
              {{ originX }}% {{ originY }}%
              <template v-if="isDefaultOrigin">(default)</template>
            </span>
          </div>

          <!-- 9 Preset Matrix Knoppen -->
          <div class="trf-origin-grid">
            <button
              v-for="p in originPresets"
              :key="p.label"
              type="button"
              class="trf-grid-btn"
              :class="{ 'is-active': originX === p.x && originY === p.y }"
              :title="p.title"
              @click="setPreset(p.x, p.y)"
            >
              {{ p.label }}
            </button>
          </div>

          <!-- Origin X & Y Sliders -->
          <div class="trf-origin-sliders">
            <div class="trf-control-row">
              <div class="trf-control-header">
                <label for="slider-ox">Horizontaal (X):</label>
                <span class="trf-val">{{ originX }}%</span>
              </div>
              <input
                id="slider-ox"
                type="range"
                min="0"
                max="100"
                step="5"
                v-model.number="originX"
                class="trf-slider"
              />
            </div>
            <div class="trf-control-row">
              <div class="trf-control-header">
                <label for="slider-oy">Verticaal (Y):</label>
                <span class="trf-val">{{ originY }}%</span>
              </div>
              <input
                id="slider-oy"
                type="range"
                min="0"
                max="100"
                step="5"
                v-model.number="originY"
                class="trf-slider"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. CSS Code Box over de VOLLE BREEDTE -->
    <div class="trf-code-section">
      <div class="trf-code-header">
        <span class="trf-code-title">Gegenereerde CSS Code</span>
        <button type="button" class="trf-copy-btn" @click="copyCode">
          {{ copied ? 'Gekopieerd!' : 'Kopieer CSS' }}
        </button>
      </div>
      <pre class="trf-code-block"><code>{{ generatedCssCode }}</code></pre>
    </div>
  </div>
</template>

<style scoped>
.trf-sim {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  overflow: hidden;
  margin: 1.5rem 0;
  font-family: inherit;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

/* Header */
.trf-sim-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.trf-sim-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
}

.trf-sim-icon {
  color: #0284c7;
}

.trf-btn-reset {
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

.trf-btn-reset:hover {
  color: #e87722;
  border-color: #e87722;
}

/* Tabs */
.trf-tabs {
  display: flex;
  overflow-x: auto;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  background: var(--vp-c-bg-alt);
  border-bottom: 1px solid var(--vp-c-divider);
}

.trf-tab {
  padding: 0.35rem 0.8rem;
  font-size: 0.82rem;
  font-weight: 600;
  border-radius: 6px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-family: var(--vp-font-family-mono);
  transition: all 0.15s ease;
  white-space: nowrap;
}

.trf-tab:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}

.trf-tab.is-active {
  color: #0284c7;
  background: var(--vp-c-bg);
  border-color: var(--vp-c-divider);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* Main Grid */
.trf-main-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 0;
  min-height: 480px;
}

@media (max-width: 860px) {
  .trf-main-grid {
    grid-template-columns: 1fr;
  }
}

/* Linker Kolom: Scène */
.trf-stage-panel {
  display: flex;
  flex-direction: column;
  background: var(--vp-c-bg);
  border-right: 1px solid var(--vp-c-divider);
  padding: 0.75rem 1rem 1rem;
}

@media (max-width: 860px) {
  .trf-stage-panel {
    border-right: none;
    border-bottom: 1px solid var(--vp-c-divider);
  }
}

.trf-stage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.trf-badge-live {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
  color: #0284c7;
  background: rgba(2, 132, 199, 0.1);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.trf-stage-hint {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
}

.trf-legend-ghost {
  display: inline-block;
  width: 14px;
  height: 10px;
  border: 1.5px dashed #94a3b8;
  border-radius: 2px;
}

.trf-legend-pivot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e87722;
  border: 1.5px solid #ffffff;
  box-shadow: 0 0 0 1px #e87722;
}

.trf-canvas-wrap {
  flex: 1;
  position: relative;
  min-height: 380px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: 
    linear-gradient(to right, rgba(148, 163, 184, 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(148, 163, 184, 0.08) 1px, transparent 1px);
  background-size: 20px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

/* Assen */
.trf-axis-x {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(148, 163, 184, 0.25);
  pointer-events: none;
}

.trf-axis-y {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgba(148, 163, 184, 0.25);
  pointer-events: none;
}

/* Ghost box */
.trf-box-ghost {
  position: absolute;
  width: 150px;
  height: 95px;
  border: 2px dashed #94a3b8;
  border-radius: 8px;
  background: rgba(148, 163, 184, 0.06);
  pointer-events: none;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 0.4rem;
}

.trf-ghost-label {
  font-size: 0.65rem;
  font-family: var(--vp-font-family-mono);
  color: #94a3b8;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* Getransformeerd element */
.trf-box-active {
  position: absolute;
  width: 150px;
  height: 95px;
  border-radius: 8px;
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  color: #ffffff;
  box-shadow: 0 8px 24px rgba(2, 132, 199, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), transform-origin 0.2s ease;
  user-select: none;
  z-index: 2;
}

.trf-box-content {
  text-align: center;
  pointer-events: none;
}

.trf-box-tag {
  display: inline-block;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
  margin-bottom: 0.2rem;
}

.trf-box-title {
  display: block;
  font-size: 1.1rem;
  font-family: var(--vp-font-family-mono);
}

.trf-box-sub {
  display: block;
  font-size: 0.7rem;
  opacity: 0.85;
}

/* Rotatiepunt marker */
.trf-pivot-marker {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 5;
}

.trf-pivot-marker.is-ghost-pivot {
  border: 1.5px dashed #94a3b8;
  background: rgba(255, 255, 255, 0.6);
}

.trf-pivot-marker.is-active-pivot {
  background: #e87722;
  border: 2px solid #ffffff;
  box-shadow: 0 0 0 1.5px #e87722, 0 2px 6px rgba(0, 0, 0, 0.3);
}

.trf-pivot-pulse {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1.5px solid #e87722;
  opacity: 0.5;
  animation: pulse-ring 1.8s infinite cubic-bezier(0.215, 0.61, 0.355, 1);
}

@keyframes pulse-ring {
  0% {
    transform: scale(0.7);
    opacity: 0.8;
  }
  100% {
    transform: scale(2.2);
    opacity: 0;
  }
}

/* Rechter Kolom: Besturing & Code */
.trf-ctrl-panel {
  display: flex;
  flex-direction: column;
  padding: 0.75rem 1rem 1rem;
  background: var(--vp-c-bg-soft);
  gap: 0.85rem;
  overflow-y: auto;
}

.trf-section {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 0.75rem;
}

.trf-section-header-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.trf-section-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.trf-section-title code {
  font-size: 0.78rem;
  color: #0284c7;
}

.trf-control-row {
  margin-bottom: 0.5rem;
}

.trf-control-row:last-child {
  margin-bottom: 0;
}

.trf-control-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.78rem;
  margin-bottom: 0.25rem;
  color: var(--vp-c-text-2);
}

.trf-control-header code {
  font-size: 0.75rem;
}

.trf-val {
  font-family: var(--vp-font-family-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: #0284c7;
}

.trf-val.is-muted {
  color: var(--vp-c-text-3);
  font-weight: normal;
}

.trf-slider {
  width: 100%;
  accent-color: #0284c7;
  cursor: pointer;
  margin: 0;
}

.trf-check-label {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  margin-top: 0.4rem;
  cursor: pointer;
}

.trf-checkbox {
  accent-color: #0284c7;
  cursor: pointer;
}

/* 9 Origin Matrix Buttons */
.trf-origin-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.25rem;
  margin-bottom: 0.6rem;
}

.trf-grid-btn {
  padding: 0.35rem 0;
  font-size: 0.72rem;
  font-weight: 700;
  font-family: var(--vp-font-family-mono);
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.trf-grid-btn:hover {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.trf-grid-btn.is-active {
  background: #e87722;
  color: #ffffff;
  border-color: #e87722;
}

.trf-origin-sliders {
  padding-top: 0.35rem;
  border-top: 1px dashed var(--vp-c-divider);
}

/* CSS Code Box over de volle breedte onderaan */
.trf-code-section {
  background: #1e1e1e;
  border-top: 1px solid var(--vp-c-divider);
  overflow: hidden;
}

.trf-code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.45rem 1rem;
  background: #252526;
  border-bottom: 1px solid #333333;
}

.trf-code-title {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #9cdcfe;
}

.trf-copy-btn {
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  background: #333333;
  color: #cccccc;
  border: 1px solid #444444;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.trf-copy-btn:hover {
  background: #444444;
  color: #ffffff;
}

.trf-code-block {
  margin: 0;
  padding: 0.75rem 1rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.78rem;
  line-height: 1.45;
  color: #d4d4d4;
  overflow-x: auto;
  white-space: pre;
}

.trf-code-block code {
  color: inherit;
  background: transparent;
  padding: 0;
}
</style>
