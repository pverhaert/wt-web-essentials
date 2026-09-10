<template>
  <div class="mini-color-picker">
    <div class="mcp-header">
      <div class="mcp-header-title">
        <svg class="mcp-title-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z" />
        </svg>
        <span class="mcp-label">{{ title || 'Interactieve HEX Kleurenkiezer' }}</span>
      </div>
      <span class="mcp-badge">Probeer uit</span>
    </div>

    <div class="mcp-body">
      <!-- Kleurenpalet (swatches) -->
      <div class="mcp-palette-section">
        <span class="mcp-section-caption">Kies een voorbeeldkleur:</span>
        <div class="mcp-palette-grid">
          <button
            v-for="color in presetColors"
            :key="color.hex"
            type="button"
            class="mcp-swatch"
            :class="{ 'is-active': selectedHex.toLowerCase() === color.hex.toLowerCase() }"
            :style="{ backgroundColor: color.hex }"
            :title="`${color.name} (${color.hex})`"
            @click="selectPreset(color.hex)"
          >
            <svg
              v-if="selectedHex.toLowerCase() === color.hex.toLowerCase()"
              class="mcp-check-icon"
              :class="{ 'is-light-bg': isLight(color.hex) }"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Live preview en HEX weergave -->
      <div class="mcp-display-card">
        <!-- Kleurenvak met native picker trigger -->
        <label class="mcp-color-preview-wrap" title="Klik om een willekeurige eigen kleur te kiezen">
          <input
            type="color"
            v-model="selectedHex"
            class="mcp-native-input"
            aria-label="Kies een eigen kleur via het kleurenwiel"
          />
          <div
            class="mcp-color-preview"
            :style="{ backgroundColor: selectedHex }"
          >
            <span class="mcp-picker-hint" :class="{ 'is-light-bg': isLight(selectedHex) }">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <span>Aanpassen</span>
            </span>
          </div>
        </label>

        <!-- HEX data en uitsplitsing -->
        <div class="mcp-details">
          <div class="mcp-hex-row">
            <span class="mcp-hex-label">HEX-code:</span>
            <div class="mcp-hex-value-box">
              <code class="mcp-hex-code">{{ selectedHex.toUpperCase() }}</code>
              <button
                type="button"
                class="mcp-copy-btn"
                :class="{ 'is-copied': copied }"
                :title="copied ? 'Gekopieerd!' : 'Kopieer HEX-code'"
                @click="copyHex"
              >
                <svg v-if="!copied" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{{ copied ? 'Gekopieerd!' : 'Kopiëren' }}</span>
              </button>
            </div>
          </div>

          <!-- Visuele ontleding # RR GG BB -->
          <div class="mcp-rgb-breakdown">
            <div class="mcp-channel mcp-channel-r">
              <span class="mcp-channel-tag">Rood (RR)</span>
              <span class="mcp-channel-hex">{{ redHex }}</span>
              <span class="mcp-channel-dec">{{ redDec }} / 255</span>
            </div>
            <div class="mcp-channel mcp-channel-g">
              <span class="mcp-channel-tag">Groen (GG)</span>
              <span class="mcp-channel-hex">{{ greenHex }}</span>
              <span class="mcp-channel-dec">{{ greenDec }} / 255</span>
            </div>
            <div class="mcp-channel mcp-channel-b">
              <span class="mcp-channel-tag">Blauw (BB)</span>
              <span class="mcp-channel-hex">{{ blueHex }}</span>
              <span class="mcp-channel-dec">{{ blueDec }} / 255</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(
  defineProps<{
    initialHex?: string
    title?: string
  }>(),
  {
    initialHex: '#EC6639',
    title: '',
  }
)

const selectedHex = ref(props.initialHex)
const copied = ref(false)

const presetColors = [
  { name: 'Thomas More Oranje', hex: '#EC6639' },
  { name: 'Thomas More Donkerblauw', hex: '#00283c' },
  { name: 'Zomers Geel', hex: '#f59e0b' },
  { name: 'Smaragdgroen', hex: '#10b981' },
  { name: 'Hemelsblauw', hex: '#0ea5e9' },
  { name: 'Dieprood', hex: '#ef4444' },
  { name: 'Paars', hex: '#8b5cf6' },
  { name: 'Zwart', hex: '#000000' },
  { name: 'Middengrijs', hex: '#64748b' },
  { name: 'Wit', hex: '#ffffff' },
]

const selectPreset = (hex: string) => {
  selectedHex.value = hex
}

// Splits HEX op in R, G, B kanalen
const cleanHex = computed(() => {
  let h = selectedHex.value.replace('#', '')
  if (h.length === 3) {
    h = h.split('').map((c) => c + c).join('')
  }
  return h.padEnd(6, '0').slice(0, 6)
})

const redHex = computed(() => cleanHex.value.slice(0, 2).toUpperCase())
const greenHex = computed(() => cleanHex.value.slice(2, 4).toUpperCase())
const blueHex = computed(() => cleanHex.value.slice(4, 6).toUpperCase())

const redDec = computed(() => parseInt(redHex.value, 16) || 0)
const greenDec = computed(() => parseInt(greenHex.value, 16) || 0)
const blueDec = computed(() => parseInt(blueHex.value, 16) || 0)

// Bepaal of de achtergrond licht is voor contrast van iconen/tekst
const isLight = (hex: string) => {
  let h = hex.replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const r = parseInt(h.slice(0, 2), 16) || 0
  const g = parseInt(h.slice(2, 4), 16) || 0
  const b = parseInt(h.slice(4, 6), 16) || 0
  // Relatieve luminantie formule (WCAG)
  const yiq = (r * 299 + g * 587 + b * 114) / 1000
  return yiq >= 150
}

const copyHex = async () => {
  try {
    await navigator.clipboard.writeText(selectedHex.value.toUpperCase())
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Kopiëren mislukt:', err)
  }
}
</script>

<style scoped>
.mini-color-picker {
  margin: 1.5rem 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background-color: var(--vp-c-bg-soft);
  overflow: hidden;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.04);
}

.mcp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.1rem;
  background-color: var(--vp-c-bg-alt);
  border-bottom: 1px solid var(--vp-c-divider);
}

.mcp-header-title {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
}

.mcp-title-icon {
  color: var(--vp-c-brand-1, #e87722);
}

.mcp-badge {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background-color: var(--vp-c-brand-soft, rgba(232, 119, 34, 0.14));
  color: var(--vp-c-brand-1, #e87722);
}

.mcp-body {
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.mcp-palette-section {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.mcp-section-caption {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.mcp-palette-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.mcp-swatch {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 2px solid var(--vp-c-divider);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease;
  padding: 0;
  outline: none;
}

.mcp-swatch:hover {
  transform: translateY(-2px) scale(1.08);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.mcp-swatch.is-active {
  border-color: var(--vp-c-brand-1, #e87722);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft, rgba(232, 119, 34, 0.3));
  transform: scale(1.08);
}

.mcp-check-icon {
  width: 18px;
  height: 18px;
  color: #ffffff;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
}

.mcp-check-icon.is-light-bg {
  color: #1e293b;
  filter: drop-shadow(0 1px 1px rgba(255, 255, 255, 0.8));
}

.mcp-display-card {
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: 1.25rem;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1rem;
  align-items: center;
}

@media (max-width: 640px) {
  .mcp-display-card {
    grid-template-columns: 1fr;
  }
}

.mcp-color-preview-wrap {
  position: relative;
  cursor: pointer;
  display: block;
  width: 100%;
  height: 100px;
}

.mcp-native-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.mcp-color-preview {
  width: 100%;
  height: 100%;
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0.45rem;
  transition: background-color 0.2s ease;
}

.mcp-picker-hint {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.2rem 0.45rem;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.55);
  color: #ffffff;
  pointer-events: none;
}

.mcp-picker-hint.is-light-bg {
  background-color: rgba(255, 255, 255, 0.85);
  color: #0f172a;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

.mcp-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.mcp-hex-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.mcp-hex-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.mcp-hex-value-box {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.mcp-hex-code {
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-brand-1, #e87722);
}

.mcp-copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.15s ease;
}

.mcp-copy-btn:hover {
  border-color: var(--vp-c-brand-1, #e87722);
  color: var(--vp-c-brand-1, #e87722);
}

.mcp-copy-btn.is-copied {
  background-color: #ecfdf5;
  border-color: #10b981;
  color: #059669;
}

.mcp-rgb-breakdown {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.mcp-channel {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.45rem;
  border-radius: 6px;
  background-color: var(--vp-c-bg-alt);
  border-left: 3px solid var(--vp-c-divider);
}

.mcp-channel-r {
  border-left-color: #ef4444;
}

.mcp-channel-g {
  border-left-color: #10b981;
}

.mcp-channel-b {
  border-left-color: #3b82f6;
}

.mcp-channel-tag {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.mcp-channel-hex {
  font-family: var(--vp-font-family-mono);
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.mcp-channel-dec {
  font-size: 0.68rem;
  color: var(--vp-c-text-3);
}
</style>
