<template>
  <div class="color-converter">
    <div class="cc-header">
      <div class="cc-header-title">
        <svg class="cc-title-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z" />
        </svg>
        <span class="cc-label">{{ title || 'Interactieve CSS Kleurenomzetter' }}</span>
      </div>
      <span class="cc-badge">Live Notaties</span>
    </div>

    <div class="cc-body">
      <!-- Bovenste rij: Kleurstaal, native picker en alfakiezer -->
      <div class="cc-controls-row">
        <!-- Kleurstaal met native picker trigger -->
        <label class="cc-preview-card" title="Klik om een kleur te kiezen">
          <input
            type="color"
            v-model="hexValue"
            class="cc-native-color"
            aria-label="Kies een kleur"
          />
          <div class="cc-checker-bg">
            <div
              class="cc-color-fill"
              :style="{ backgroundColor: currentRgbaCss }"
            ></div>
          </div>
          <div class="cc-preview-overlay" :class="{ 'is-light': isLightColor }">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span>Kleur kiezen</span>
          </div>
        </label>

        <!-- Schuifregelaars en instellingen -->
        <div class="cc-sliders-panel">
          <div class="cc-slider-group">
            <div class="cc-slider-label-row">
              <span class="cc-slider-title">Transparantie (Alfa / Dekking)</span>
              <span class="cc-slider-val">{{ Math.round(alphaValue * 100) }}% ({{ alphaValue.toFixed(2) }})</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              v-model.number="alphaValue"
              class="cc-range-input"
              aria-label="Transparantie regelaar"
            />
          </div>

          <!-- Snelle voorbeeldkleuren (Thomas More & web basis) -->
          <div class="cc-presets-wrap">
            <span class="cc-presets-title">Voorbeeldkleuren:</span>
            <div class="cc-presets-list">
              <button
                v-for="preset in presets"
                :key="preset.hex"
                type="button"
                class="cc-preset-chip"
                :class="{ 'is-active': hexValue.toLowerCase() === preset.hex.toLowerCase() }"
                :title="`${preset.name} (${preset.hex})`"
                @click="applyPreset(preset.hex)"
              >
                <span class="cc-preset-dot" :style="{ backgroundColor: preset.hex }"></span>
                <span class="cc-preset-name">{{ preset.name }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Overzichtstabel met alle CSS-kleurnotaties in één oogopslag -->
      <div class="cc-formats-grid">
        <div
          v-for="format in formatRows"
          :key="format.id"
          class="cc-format-card"
        >
          <div class="cc-format-header">
            <span class="cc-format-badge">{{ format.label }}</span>
            <span v-if="format.sublabel" class="cc-format-sublabel">{{ format.sublabel }}</span>
          </div>
          <div class="cc-format-code-row">
            <code class="cc-format-code">{{ format.value }}</code>
            <button
              type="button"
              class="cc-copy-btn"
              :class="{ 'is-copied': copiedKey === format.id }"
              :title="copiedKey === format.id ? 'Gekopieerd!' : 'Kopieer naar klembord'"
              @click="copyValue(format.value, format.id)"
            >
              <svg v-if="copiedKey !== format.id" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>{{ copiedKey === format.id ? 'Gekopieerd' : 'Kopiëren' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- WCAG Contrastcontrole vak -->
      <div class="cc-contrast-card">
        <div class="cc-contrast-header">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a10 10 0 0 1 0 20z" fill="currentColor" />
          </svg>
          <span class="cc-contrast-title">WCAG Contrastverhouding (Leesbaarheid)</span>
        </div>
        <div class="cc-contrast-grid">
          <!-- Op witte achtergrond -->
          <div class="cc-contrast-box cc-contrast-box-white">
            <div class="cc-sample-text" :style="{ color: currentRgbaCss, backgroundColor: '#ffffff' }">
              Aa Voorbeeldtekst
            </div>
            <div class="cc-contrast-metrics">
              <span class="cc-contrast-label">Op wit (#fff):</span>
              <span class="cc-contrast-ratio">{{ contrastWhite.ratio.toFixed(2) }}:1</span>
              <span
                class="cc-status-pill"
                :class="contrastWhite.passAA ? 'is-pass' : 'is-fail'"
              >
                {{ contrastWhite.passAA ? 'Voldoet (AA)' : 'Onvoldoende (< 4.5:1)' }}
              </span>
            </div>
          </div>

          <!-- Op donkerblauwe/zwarte achtergrond -->
          <div class="cc-contrast-box cc-contrast-box-dark">
            <div class="cc-sample-text" :style="{ color: currentRgbaCss, backgroundColor: '#1e2d5a' }">
              Aa Voorbeeldtekst
            </div>
            <div class="cc-contrast-metrics">
              <span class="cc-contrast-label">Op Thomas More blauw (#1e2d5a):</span>
              <span class="cc-contrast-ratio">{{ contrastDark.ratio.toFixed(2) }}:1</span>
              <span
                class="cc-status-pill"
                :class="contrastDark.passAA ? 'is-pass' : 'is-fail'"
              >
                {{ contrastDark.passAA ? 'Voldoet (AA)' : 'Onvoldoende (< 4.5:1)' }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  title?: string
  initialHex?: string
  initialAlpha?: number
}>()

const hexValue = ref(props.initialHex || '#e87722')
const alphaValue = ref(props.initialAlpha !== undefined ? props.initialAlpha : 1)
const copiedKey = ref<string | null>(null)

// Thomas More & web standaardkleuren
const presets = [
  { name: 'TM Oranje', hex: '#e87722' },
  { name: 'TM Marineblauw', hex: '#1e2d5a' },
  { name: 'Leisteen', hex: '#64748b' },
  { name: 'Smaragdgroen', hex: '#10b981' },
  { name: 'Robijnrood', hex: '#ef4444' },
  { name: 'Goudgeel', hex: '#f59e0b' },
  { name: 'Helderwit', hex: '#ffffff' },
  { name: 'Diepzwart', hex: '#0f172a' },
]

const applyPreset = (hex: string) => {
  hexValue.value = hex
}

// Bereken RGB-kanalen uit HEX
const rgbChannels = computed(() => {
  let hex = hexValue.value.replace(/^#/, '')
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('')
  }
  const r = parseInt(hex.substring(0, 2), 16) || 0
  const g = parseInt(hex.substring(2, 4), 16) || 0
  const b = parseInt(hex.substring(4, 6), 16) || 0
  return { r, g, b }
})

// CSS string voor live achtergrondweergave
const currentRgbaCss = computed(() => {
  const { r, g, b } = rgbChannels.value
  return `rgba(${r}, ${g}, ${b}, ${alphaValue.value})`
})

// Bepaal of de kleur licht is (voor contrast op overlays)
const isLightColor = computed(() => {
  const { r, g, b } = rgbChannels.value
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 140
})

// Bereken HSL
const hslValues = computed(() => {
  const r = rgbChannels.value.r / 255
  const g = rgbChannels.value.g / 255
  const b = rgbChannels.value.b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h = Math.round(h * 60)
  }

  return {
    h,
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
})

// Bereken HWB
const hwbValues = computed(() => {
  const { h } = hslValues.value
  const r = rgbChannels.value.r / 255
  const g = rgbChannels.value.g / 255
  const b = rgbChannels.value.b / 255

  const w = Math.round(Math.min(r, g, b) * 100)
  const blk = Math.round((1 - Math.max(r, g, b)) * 100)

  return { h, w, b: blk }
})

// Bereken OKLCH
const oklchValues = computed(() => {
  const { r: r255, g: g255, b: b255 } = rgbChannels.value
  const toLinear = (c: number) => {
    const v = c / 255
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  }

  const rLin = toLinear(r255)
  const gLin = toLinear(g255)
  const bLin = toLinear(b255)

  const lLin = 0.4122214708 * rLin + 0.5363325363 * gLin + 0.0514459929 * bLin
  const mLin = 0.2119034982 * rLin + 0.6806995451 * gLin + 0.1073969566 * bLin
  const sLin = 0.0883024619 * rLin + 0.2817188376 * gLin + 0.6299787005 * bLin

  const l_ = Math.cbrt(lLin)
  const m_ = Math.cbrt(mLin)
  const s_ = Math.cbrt(sLin)

  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
  const b = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_

  const C = Math.sqrt(a * a + b * b)
  let H = (Math.atan2(b, a) * 180) / Math.PI
  if (H < 0) H += 360

  return {
    l: Math.round(L * 100),
    c: Number(C.toFixed(3)),
    h: Math.round(H),
  }
})

// CSS benoemde kleuren opzoeken (exact of benaderend)
const namedColorsMap: Record<string, string> = {
  '#000000': 'black',
  '#ffffff': 'white',
  '#ff0000': 'red',
  '#00ff00': 'lime',
  '#0000ff': 'blue',
  '#ffff00': 'yellow',
  '#00ffff': 'cyan / aqua',
  '#ff00ff': 'magenta / fuchsia',
  '#808080': 'gray',
  '#800000': 'maroon',
  '#008000': 'green',
  '#000080': 'navy',
  '#808000': 'olive',
  '#800080': 'purple',
  '#008080': 'teal',
  '#ffa500': 'orange',
  '#e87722': 'Thomas More oranje (geen CSS-naam)',
  '#1e2d5a': 'Thomas More blauw (geen CSS-naam)',
  '#ff6347': 'tomato',
  '#dc143c': 'crimson',
  '#4682b4': 'steelblue',
  '#708090': 'slategray',
  '#f0f8ff': 'aliceblue',
  '#faebd7': 'antiquewhite',
  '#f5f5f5': 'whitesmoke',
}

const cssColorName = computed(() => {
  const cleanHex = hexValue.value.toLowerCase()
  if (namedColorsMap[cleanHex]) return namedColorsMap[cleanHex]
  return 'Geen directe CSS-naam (gebruik HEX/RGB/HSL)'
})

// 8-cijferige HEX met alfa
const hex8Value = computed(() => {
  const base = hexValue.value.toUpperCase()
  const alphaHex = Math.round(alphaValue.value * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase()
  return `${base}${alphaHex}`
})

// Alle geformatteerde rijen voor de interface
const formatRows = computed(() => {
  const { r, g, b } = rgbChannels.value
  const { h, s, l } = hslValues.value
  const { w, b: blk } = hwbValues.value
  const oklch = oklchValues.value
  const a = alphaValue.value
  const aPct = Math.round(a * 100)

  return [
    {
      id: 'hex',
      label: 'HEX (6 of 8 tekens)',
      sublabel: a < 1 ? 'met 2 alfa-tekens' : 'klassiek',
      value: a < 1 ? hex8Value.value : hexValue.value.toUpperCase(),
    },
    {
      id: 'rgb-classic',
      label: a < 1 ? 'RGBA (klassiek)' : 'RGB (klassiek)',
      sublabel: 'komma-gescheiden',
      value: a < 1 ? `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})` : `rgb(${r}, ${g}, ${b})`,
    },
    {
      id: 'rgb-modern',
      label: 'RGB (modern Level 4)',
      sublabel: 'spatiesyntax met /',
      value: a < 1 ? `rgb(${r} ${g} ${b} / ${aPct}%)` : `rgb(${r} ${g} ${b})`,
    },
    {
      id: 'hsl',
      label: 'HSL (kleurtoon & verzadiging)',
      sublabel: 'intuïtief aanpasbaar',
      value: a < 1 ? `hsl(${h} ${s}% ${l}% / ${aPct}%)` : `hsl(${h}, ${s}%, ${l}%)`,
    },
    {
      id: 'oklch',
      label: 'OKLCH (modern & perceptueel)',
      sublabel: 'uniforme helderheid',
      value: a < 1 ? `oklch(${oklch.l}% ${oklch.c} ${oklch.h}deg / ${aPct}%)` : `oklch(${oklch.l}% ${oklch.c} ${oklch.h}deg)`,
    },
    {
      id: 'hwb',
      label: 'HWB (Hue, Whiteness, Blackness)',
      sublabel: 'kleurtoon + wit/zwart',
      value: a < 1 ? `hwb(${h} ${w}% ${blk}% / ${aPct}%)` : `hwb(${h} ${w}% ${blk}%)`,
    },
    {
      id: 'name',
      label: 'Benoemde CSS-kleur',
      sublabel: 'standaard webkleurnaam',
      value: cssColorName.value,
    },
  ]
})

// WCAG Luminantie en contrastberekening
const calculateLuminance = (r255: number, g255: number, b255: number) => {
  const a = [r255, g255, b255].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

const contrastWhite = computed(() => {
  const { r, g, b } = rgbChannels.value
  const blendedR = Math.round(r * alphaValue.value + 255 * (1 - alphaValue.value))
  const blendedG = Math.round(g * alphaValue.value + 255 * (1 - alphaValue.value))
  const blendedB = Math.round(b * alphaValue.value + 255 * (1 - alphaValue.value))

  const lumColor = calculateLuminance(blendedR, blendedG, blendedB)
  const lumWhite = 1.0
  const ratio = (Math.max(lumColor, lumWhite) + 0.05) / (Math.min(lumColor, lumWhite) + 0.05)
  return { ratio, passAA: ratio >= 4.5 }
})

const contrastDark = computed(() => {
  const { r, g, b } = rgbChannels.value
  const bgR = 30
  const bgG = 45
  const bgB = 90
  const blendedR = Math.round(r * alphaValue.value + bgR * (1 - alphaValue.value))
  const blendedG = Math.round(g * alphaValue.value + bgG * (1 - alphaValue.value))
  const blendedB = Math.round(b * alphaValue.value + bgB * (1 - alphaValue.value))

  const lumColor = calculateLuminance(blendedR, blendedG, blendedB)
  const lumDark = calculateLuminance(bgR, bgG, bgB)
  const ratio = (Math.max(lumColor, lumDark) + 0.05) / (Math.min(lumColor, lumDark) + 0.05)
  return { ratio, passAA: ratio >= 4.5 }
})

const copyValue = async (text: string, key: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copiedKey.value = key
    setTimeout(() => {
      if (copiedKey.value === key) copiedKey.value = null
    }, 1800)
  } catch {
    // Fallback voor browsers zonder klembord-API
  }
}
</script>

<style scoped>
.color-converter {
  margin: 24px 0;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-elv);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  font-family: var(--vp-font-family-base);
}

.cc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background-color: var(--vp-c-bg-alt);
  border-bottom: 1px solid var(--vp-c-divider);
}

.cc-header-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.cc-title-icon {
  color: var(--vp-c-brand-1);
}

.cc-badge {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 9999px;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.cc-body {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.cc-controls-row {
  display: flex;
  gap: 18px;
  align-items: stretch;
}

.cc-preview-card {
  position: relative;
  width: 140px;
  min-height: 120px;
  border-radius: 10px;
  border: 2px solid var(--vp-c-divider);
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
  transition: transform 0.15s ease, border-color 0.2s ease;
}

.cc-preview-card:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
}

.cc-native-color {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.cc-checker-bg {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(45deg, #e2e8f0 25%, transparent 25%),
    linear-gradient(-45deg, #e2e8f0 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #e2e8f0 75%),
    linear-gradient(-45deg, transparent 75%, #e2e8f0 75%);
  background-size: 16px 16px;
  background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
}

.cc-color-fill {
  width: 100%;
  height: 100%;
  transition: background-color 0.1s ease;
}

.cc-preview-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background-color: rgba(0, 0, 0, 0.25);
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.cc-preview-card:hover .cc-preview-overlay {
  opacity: 1;
}

.cc-preview-overlay.is-light {
  background-color: rgba(255, 255, 255, 0.35);
  color: #1e293b;
}

.cc-sliders-panel {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
}

.cc-slider-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cc-slider-label-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.82rem;
}

.cc-slider-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.cc-slider-val {
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.cc-range-input {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--vp-c-divider);
  outline: none;
  accent-color: var(--vp-c-brand-1);
  cursor: pointer;
}

.cc-presets-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cc-presets-title {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.cc-presets-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.cc-preset-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
}

.cc-preset-chip:hover {
  background-color: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.cc-preset-chip.is-active {
  border-color: var(--vp-c-brand-1);
  background-color: var(--vp-c-brand-soft);
  font-weight: 600;
}

.cc-preset-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.15);
}

.cc-formats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 10px;
}

.cc-format-card {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-alt);
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: border-color 0.15s ease;
}

.cc-format-card:hover {
  border-color: var(--vp-c-brand-1);
}

.cc-format-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cc-format-badge {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.cc-format-sublabel {
  font-size: 0.68rem;
  color: var(--vp-c-text-2);
}

.cc-format-code-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.cc-format-code {
  font-family: var(--vp-font-family-mono);
  font-size: 0.82rem;
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg-elv);
  padding: 3px 6px;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  word-break: break-all;
  flex-grow: 1;
}

.cc-copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 5px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-elv);
  color: var(--vp-c-text-2);
  font-size: 0.72rem;
  font-weight: 500;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.cc-copy-btn:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg);
}

.cc-copy-btn.is-copied {
  background-color: var(--vp-c-brand-1);
  color: #ffffff;
  border-color: var(--vp-c-brand-1);
}

.cc-contrast-card {
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-alt);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cc-contrast-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.cc-contrast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 10px;
}

.cc-contrast-box {
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
}

.cc-sample-text {
  padding: 12px 14px;
  font-size: 0.95rem;
  font-weight: 600;
  text-align: center;
  border-bottom: 1px solid var(--vp-c-divider);
}

.cc-contrast-metrics {
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  background-color: var(--vp-c-bg-elv);
  font-size: 0.75rem;
}

.cc-contrast-label {
  color: var(--vp-c-text-2);
}

.cc-contrast-ratio {
  font-family: var(--vp-font-family-mono);
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.cc-status-pill {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.68rem;
  font-weight: 600;
}

.cc-status-pill.is-pass {
  background-color: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.cc-status-pill.is-fail {
  background-color: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

@media (max-width: 640px) {
  .cc-controls-row {
    flex-direction: column;
  }
  .cc-preview-card {
    width: 100%;
    min-height: 80px;
  }
}
</style>
