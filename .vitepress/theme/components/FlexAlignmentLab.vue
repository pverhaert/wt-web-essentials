<template>
  <div class="flex-alignment-lab">
    <div class="fal-header">
      <div class="fav-header-title">
        <svg class="fav-title-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="21" y1="6" x2="3" y2="6" />
          <line x1="21" y1="12" x2="9" y2="12" />
          <line x1="21" y1="18" x2="7" y2="18" />
        </svg>
        <span class="fav-label">Flexbox Alignment Lab</span>
      </div>
      <span class="fav-badge">Uitlijning &amp; Ruimteverdeling</span>
    </div>

    <div class="fal-body">
      <!-- 1. BEDIENINGSPANEEL (JUSTIFY-CONTENT, ALIGN-ITEMS & GAP) -->
      <div class="fal-controls-grid">
        <!-- Justify-content (Hoofdas) -->
        <div class="fal-control-group">
          <div class="fal-group-title">
            <span class="fal-axis-indicator main"></span>
            <code>justify-content</code> (langs hoofdas):
          </div>
          <div class="fal-button-chips">
            <button
              v-for="val in justifyValues"
              :key="val"
              type="button"
              class="fal-chip"
              :class="{ 'is-active': activeJustify === val }"
              @click="activeJustify = val"
            >
              {{ val }}
            </button>
          </div>
          <div class="fal-hint-text">{{ currentJustifyDesc }}</div>
        </div>

        <!-- Align-items (Dwarsas) -->
        <div class="fal-control-group">
          <div class="fal-group-title">
            <span class="fal-axis-indicator cross"></span>
            <code>align-items</code> (langs dwarsas):
          </div>
          <div class="fal-button-chips">
            <button
              v-for="val in alignValues"
              :key="val"
              type="button"
              class="fal-chip"
              :class="{ 'is-active': activeAlign === val }"
              @click="activeAlign = val"
            >
              {{ val }}
            </button>
          </div>
          <div class="fal-hint-text">{{ currentAlignDesc }}</div>
        </div>
      </div>

      <!-- Tussenruimte (Gap) Slider & Richting toggle -->
      <div class="fal-secondary-bar">
        <div class="fal-gap-slider-wrap">
          <label for="fal-gap-range" class="fal-slider-label">
            <code>gap</code>: <strong>{{ gapValue }}px</strong>
          </label>
          <input
            id="fal-gap-range"
            v-model.number="gapValue"
            type="range"
            min="0"
            max="40"
            step="4"
            class="fal-slider"
          />
        </div>

        <div class="fal-toggle-direction">
          <label class="fal-slider-label">Richting:</label>
          <button
            type="button"
            class="fal-dir-toggle-btn"
            @click="isColumn = !isColumn"
          >
            {{ isColumn ? 'Verticaal (column)' : 'Horizontaal (row)' }}
          </button>
        </div>
      </div>

      <!-- 2. HET LIVE PREVIEW SPEELVELD -->
      <div class="fal-stage-wrap">
        <div class="fal-stage" :style="stageStyle">
          <!-- Item 1 (Normale hoogte) -->
          <div class="fal-item item-1">
            <div class="fal-item-head">Item 1</div>
            <div class="fal-item-content">Kort</div>
          </div>

          <!-- Item 2 (Groter / hogere content om stretch & baseline goed te tonen) -->
          <div class="fal-item item-2">
            <div class="fal-item-head">Item 2</div>
            <div class="fal-item-content">
              Grotere<br />tekstinhoud
            </div>
          </div>

          <!-- Item 3 (Middelgroot) -->
          <div class="fal-item item-3">
            <div class="fal-item-head">Item 3</div>
            <div class="fal-item-content">Basis</div>
          </div>
        </div>
      </div>

      <!-- 3. LIVE GEGENEREERDE CODE MET COPY BUTTON -->
      <div class="fal-code-card">
        <div class="fal-code-header">
          <span class="fal-code-label">Gegenereerde CSS</span>
          <button type="button" class="fal-copy-btn" @click="copyCss">
            <svg v-if="!copied" class="fal-copy-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            <svg v-else class="fal-copy-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{{ copied ? 'Gekopieerd!' : 'Kopieer CSS' }}</span>
          </button>
        </div>
        <pre class="fal-code-pre"><code>{{ generatedCss }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const justifyValues = [
  'flex-start',
  'center',
  'flex-end',
  'space-between',
  'space-around',
  'space-evenly',
]

const alignValues = [
  'stretch',
  'center',
  'flex-start',
  'flex-end',
  'baseline',
]

// Standaardwaarden conform browser-standaard
const activeJustify = ref('flex-start')
const activeAlign = ref('stretch')
const gapValue = ref(0)
const isColumn = ref(false)
const copied = ref(false)

const generatedCss = computed(() => {
  const lines = ['.container {', '  display: flex;']

  if (isColumn.value) {
    lines.push('  flex-direction: column;')
  } else {
    lines.push('  /* flex-direction: row; (standaardwaarde) */')
  }

  if (activeJustify.value === 'flex-start') {
    lines.push('  /* justify-content: flex-start; (standaardwaarde: items beginnen vooraan) */')
  } else {
    lines.push(`  justify-content: ${activeJustify.value};`)
  }

  if (activeAlign.value === 'stretch') {
    lines.push('  /* align-items: stretch; (standaardwaarde: items vullen de hoogte) */')
  } else {
    lines.push(`  align-items: ${activeAlign.value};`)
  }

  if (gapValue.value === 0) {
    lines.push('  /* gap: 0px; (standaardwaarde: geen tussenruimte) */')
  } else {
    lines.push(`  gap: ${gapValue.value}px;`)
  }

  lines.push('}')
  return lines.join('\n')
})

async function copyCss() {
  const cleanCode = `.container {
  display: flex;
  flex-direction: ${isColumn.value ? 'column' : 'row'};
  justify-content: ${activeJustify.value};
  align-items: ${activeAlign.value};
  gap: ${gapValue.value}px;
}`

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(cleanCode)
    } else {
      const ta = document.createElement('textarea')
      ta.value = cleanCode
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }

    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Kopiëren mislukt:', err)
  }
}

const currentJustifyDesc = computed(() => {
  switch (activeJustify.value) {
    case 'flex-start': return 'Items staan tegen het begin van de hoofdas aangedrukt.'
    case 'center': return 'Items staan samen in het exacte midden van de as gebundeld.'
    case 'flex-end': return 'Items staan tegen het einde van de as aangedrukt.'
    case 'space-between': return 'Eerste item vooraan, laatste achteraan, overige witruimte ertussen verdeeld.'
    case 'space-around': return 'Elk item krijgt links en rechts evenveel ruimte (buitenranden zijn half zo breed).'
    case 'space-evenly': return 'Alle ruimtes vóór, tussen en na de items zijn exact even groot.'
    default: return ''
  }
})

const currentAlignDesc = computed(() => {
  switch (activeAlign.value) {
    case 'stretch': return 'Items rekken uit om de volledige dwarsas-hoogte op te vullen (standaard).'
    case 'center': return 'Items staan netjes gecentreerd op de dwarsas.'
    case 'flex-start': return 'Items lijnen uit tegen het begin van de dwarsas (bovenaan bij een rij).'
    case 'flex-end': return 'Items lijnen uit tegen het einde van de dwarsas (onderaan bij een rij).'
    case 'baseline': return 'Items lijnen uit op de basislijn van de eerste regel tekst.'
    default: return ''
  }
})

const stageStyle = computed(() => ({
  flexDirection: (isColumn.value ? 'column' : 'row') as any,
  justifyContent: activeJustify.value,
  alignItems: activeAlign.value,
  gap: `${gapValue.value}px`,
  minHeight: isColumn.value ? '340px' : '200px',
}))
</script>

<style scoped>
.flex-alignment-lab {
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  margin: 1.75rem 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.fal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1a2846;
  color: #ffffff;
  padding: 0.85rem 1.25rem;
}

.fal-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.fal-controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
}

.fal-control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.fal-group-title {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.fal-group-title code {
  font-size: 0.85rem;
  color: #e87722;
  background-color: var(--vp-c-bg-soft);
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
}

.fal-axis-indicator {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.fal-axis-indicator.main {
  background-color: #dc2626;
}

.fal-axis-indicator.cross {
  background-color: #2563eb;
}

.fal-button-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.fal-chip {
  padding: 0.35rem 0.65rem;
  font-size: 0.8rem;
  font-family: monospace;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.15s ease;
}

.fal-chip:hover {
  border-color: #e87722;
  color: var(--vp-c-text-1);
}

.fal-chip.is-active {
  background-color: #e87722;
  border-color: #e87722;
  color: #ffffff;
  font-weight: 600;
}

.fal-hint-text {
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
  min-height: 1.2rem;
  font-style: italic;
}

/* Secondaire balk (gap slider & toggle) */
.fal-secondary-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.fal-gap-slider-wrap {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.fal-slider-label {
  font-size: 0.85rem;
  color: var(--vp-c-text-1);
}

.fal-slider {
  accent-color: #e87722;
  cursor: pointer;
}

.fal-toggle-direction {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.fal-dir-toggle-btn {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  background-color: var(--vp-c-bg-elv);
  border: 1.5px solid #005691;
  color: #005691;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.fal-dir-toggle-btn:hover {
  background-color: #005691;
  color: #ffffff;
}

/* Stage */
.fal-stage-wrap {
  border: 2px dashed #94a3b8;
  border-radius: 8px;
  background-color: #f8fafc;
  padding: 1.25rem;
}

.fal-stage {
  display: flex;
  background-color: #ffffff;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  padding: 1rem;
  transition: all 0.25s ease;
}

/* Flex items in stage */
.fal-item {
  background-color: #fffaf5;
  border: 2px solid #e87722;
  border-radius: 6px;
  padding: 0.65rem 0.95rem;
  color: #1e293b;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.25s ease;
}

.fal-item-head {
  font-weight: 700;
  font-size: 0.85rem;
  color: #e87722;
}

.fal-item-content {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 0.2rem;
}

.item-2 .fal-item-content {
  font-size: 0.92rem;
  font-weight: 500;
  color: #334155;
}

/* Code Snippet */
.fal-code-card {
  background-color: #1a202c;
  border-radius: 6px;
  overflow: hidden;
}

.fal-code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #2d3748;
  border-bottom: 1px solid #4a5568;
}

.fal-code-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #a0aec0;
}

.fal-copy-btn {
  display: flex;
  align-items: center;
  gap: 0.35rem;
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

.fal-copy-btn:hover {
  background-color: #cf6317;
}

.fal-copy-icon {
  flex-shrink: 0;
}

.fal-code-pre {
  margin: 0;
  padding: 0.85rem 1rem;
  color: #e2e8f0;
  font-family: monospace;
  font-size: 0.85rem;
  line-height: 1.5;
}
</style>
