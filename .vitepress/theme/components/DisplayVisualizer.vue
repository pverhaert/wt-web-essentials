<template>
  <div class="display-visualizer">
    <div class="dv-header">
      <div class="dv-header-title">
        <svg class="dv-title-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
        <span class="dv-label">Display &amp; Documentstroom Visualizer</span>
      </div>
      <span class="dv-badge">Interactieve simulator</span>
    </div>

    <div class="dv-body">
      <!-- 1. DISPLAY KEUZEKNOPPEN (ORANJE GEACCENTUEERD) -->
      <div class="dv-control-section">
        <div class="dv-section-heading-row">
          <span class="dv-target-indicator-dot"></span>
          <label class="dv-section-title">Stap 1: Wijzig de CSS van het oranje testelement (Doelwit B)</label>
        </div>
        <div class="dv-modes-grid">
          <button
            v-for="mode in displayModes"
            :key="mode.id"
            type="button"
            class="dv-mode-card"
            :class="{ 'is-active': activeMode === mode.id }"
            @click="activeMode = mode.id"
          >
            <div class="dv-mode-code"><code>{{ mode.code }}</code></div>
            <div class="dv-mode-summary">{{ mode.summary }}</div>
          </button>
        </div>
      </div>

      <!-- 2. UITLEGKAART: WAT GEBEURT ER NU JUIST? -->
      <div class="dv-explanation-card" :class="activeModeInfo.type">
        <div class="dv-explanation-header">
          <span class="dv-pill">{{ activeModeInfo.badge }}</span>
          <h4 class="dv-explanation-title">{{ activeModeInfo.title }}</h4>
        </div>
        <div class="dv-explanation-points">
          <div class="dv-point">
            <span class="dv-point-label">Wat gebeurt er met het oranje element?</span>
            <span class="dv-point-desc">{{ activeModeInfo.elementEffect }}</span>
          </div>
          <div class="dv-point">
            <span class="dv-point-label">Wat gebeurt er met de omringende tekst en buren (A en C)?</span>
            <span class="dv-point-desc">{{ activeModeInfo.neighborEffect }}</span>
          </div>
          <div class="dv-point">
            <span class="dv-point-label">Gehoorzaamt het aan afmetingen?</span>
            <span class="dv-point-desc">
              <strong :class="activeModeInfo.sizingClass">{{ activeModeInfo.sizingEffect }}</strong>
            </span>
          </div>
        </div>
      </div>

      <!-- 3. BEDIENINGSELEMENTEN (SLIDERS EN OPTIES VOOR HET ORANJE ELEMENT) -->
      <div class="dv-tweaks-panel">
        <div class="dv-tweaks-header">
          <span class="dv-section-title">Stap 2: Eigenschappen van het oranje element finetunen</span>
        </div>

        <div class="dv-tweaks-grid">
          <!-- Width slider -->
          <div class="dv-tweak-item" :class="{ 'is-disabled': activeMode === 'inline' || activeMode === 'none' }">
            <div class="dv-tweak-top">
              <label>Breedte (<code>width</code>):</label>
              <span class="dv-tweak-val">
                <template v-if="activeMode === 'inline'"><span class="dv-ignored">genegeerd</span></template>
                <template v-else-if="activeMode === 'none'">0px</template>
                <template v-else>{{ activeWidth }}px</template>
              </span>
            </div>
            <input
              type="range"
              min="120"
              max="280"
              step="10"
              v-model.number="activeWidth"
              class="dv-range"
              :disabled="activeMode === 'inline' || activeMode === 'none'"
            />
            <span class="dv-tweak-hint">
              {{ activeMode === 'inline' ? '⚠️ Inline negeert width: breedte volgt altijd de tekst.' : 'Stelt de breedte van het oranje element in.' }}
            </span>
          </div>

          <!-- Height slider -->
          <div class="dv-tweak-item" :class="{ 'is-disabled': activeMode === 'inline' || activeMode === 'none' }">
            <div class="dv-tweak-top">
              <label>Hoogte (<code>height</code>):</label>
              <span class="dv-tweak-val">
                <template v-if="activeMode === 'inline'"><span class="dv-ignored">genegeerd</span></template>
                <template v-else-if="activeMode === 'none'">0px</template>
                <template v-else>{{ activeHeight }}px</template>
              </span>
            </div>
            <input
              type="range"
              min="35"
              max="85"
              step="5"
              v-model.number="activeHeight"
              class="dv-range"
              :disabled="activeMode === 'inline' || activeMode === 'none'"
            />
            <span class="dv-tweak-hint">
              {{ activeMode === 'inline' ? '⚠️ Inline negeert height: hoogte volgt regelhoogte.' : 'Stelt de hoogte van het oranje element in.' }}
            </span>
          </div>

          <!-- vertical-align -->
          <div class="dv-tweak-item" :class="{ 'is-disabled': activeMode !== 'inline-block' }">
            <div class="dv-tweak-top">
              <label><code>vertical-align</code>:</label>
              <span class="dv-tweak-val">{{ activeMode === 'inline-block' ? activeVerticalAlign : 'nvt' }}</span>
            </div>
            <div class="dv-btn-pills">
              <button
                v-for="va in ['baseline', 'top', 'middle', 'bottom']"
                :key="va"
                type="button"
                class="dv-pill-btn"
                :class="{ 'is-active': activeVerticalAlign === va && activeMode === 'inline-block' }"
                :disabled="activeMode !== 'inline-block'"
                @click="activeVerticalAlign = va"
              >
                {{ va }}
              </button>
            </div>
            <span class="dv-tweak-hint">
              {{ activeMode === 'inline-block' ? 'Lijnt het oranje blok uit t.o.v. de tekstlijn.' : 'Werkt enkel bij inline-block en inline.' }}
            </span>
          </div>

          <!-- Buitenruimte (margin) -->
          <div class="dv-tweak-item" :class="{ 'is-disabled': activeMode === 'none' }">
            <div class="dv-tweak-top">
              <label>Buitenruimte (<code>margin</code>):</label>
              <span class="dv-tweak-val">{{ activeMargin }}px</span>
            </div>
            <div class="dv-btn-pills">
              <button
                v-for="m in [0, 10, 20]"
                :key="m"
                type="button"
                class="dv-pill-btn"
                :class="{ 'is-active': activeMargin === m }"
                :disabled="activeMode === 'none'"
                @click="activeMargin = m"
              >
                {{ m }}px
              </button>
            </div>
            <span class="dv-tweak-hint">
              {{ activeMode === 'inline' ? '⚠️ Bij inline werken enkel margin-left en right!' : 'Ruimte rondom het oranje element.' }}
            </span>
          </div>
        </div>
      </div>

      <!-- 4. LIVE CANVAS: DOCUMENTSTROOM IN ACTIE -->
      <div class="dv-canvas-card">
        <div class="dv-canvas-topbar">
          <div class="dv-canvas-title">
            <span>Visuele documentstroom in de browser</span>
            <span class="dv-canvas-current-tag">{{ activeModeCodeString }}</span>
          </div>
          <!-- Legende -->
          <div class="dv-canvas-legend">
            <span class="dv-legend-item">
              <span class="dv-legend-color dv-legend-ref"></span>
              <span>Referentie-elementen A &amp; C (standaard inline-block ter vergelijking)</span>
            </span>
            <span class="dv-legend-item">
              <span class="dv-legend-color dv-legend-orange"></span>
              <span>Het actieve testelement (Doelwit B)</span>
            </span>
          </div>
        </div>

        <div class="dv-stage-box">
          <p class="dv-stage-paragraph">
            Voorafgaande tekst in een gewone alinea. Hier begint een zin met drie opeenvolgende elementen:
            <span class="dv-badge-lead">
              <span class="dv-badge-name">Vak A</span>
              <span class="dv-badge-sub">inline-block</span>
            </span>
            staat vooraan op de regel. Direct daarna volgt het oranje element dat je hierboven aanstuurt:

            <!-- HET ORANJE TESTELEMENT (DOELWIT B) -->
            <template v-if="activeMode === 'none'">
              <!-- display: none: er wordt niets gerenderd in de flow -->
            </template>

            <template v-else-if="activeMode === 'visibility-hidden'">
              <span
                class="dv-target-element is-hidden-ghost"
                :style="targetGhostStyles"
                title="Dit element heeft visibility: hidden. Het is onzichtbaar maar de fysieke ruimte blijft exact behouden."
              >
                <span class="dv-ghost-inner">
                  [Onzichtbaar: {{ activeWidth }}px &times; {{ activeHeight }}px blijft open]
                </span>
              </span>
            </template>

            <template v-else-if="activeMode === 'inline'">
              <span
                class="dv-target-element is-inline-target"
                :style="targetInlineStyles"
              >
                Doelwit B (display: inline)
              </span>
            </template>

            <template v-else-if="activeMode === 'block'">
              <span
                class="dv-target-element is-block-target"
                :style="targetBlockStyles"
              >
                <span class="dv-target-heading">Doelwit B (display: block)</span>
                <span class="dv-target-subtext">Breekt de regel af en neemt een eigen horizontale strook in</span>
              </span>
            </template>

            <template v-else-if="activeMode === 'inline-block'">
              <span
                class="dv-target-element is-inline-block-target"
                :style="targetInlineBlockStyles"
              >
                <span class="dv-target-heading">Doelwit B</span>
                <span class="dv-target-subtext">inline-block ({{ activeWidth }}&times;{{ activeHeight }}px)</span>
              </span>
            </template>

            en direct daarna sluit
            <span class="dv-badge-trail">
              <span class="dv-badge-name">Vak C</span>
              <span class="dv-badge-sub">inline-block</span>
            </span>
            aan. Dit is de tekst die volgt om te demonstreren hoe de alinea naadloos doorloopt na het laatste element.
          </p>
        </div>
      </div>

      <!-- 5. GEGENEREERDE CSS CODE -->
      <div class="dv-code-box">
        <div class="dv-code-header">
          <span class="dv-code-title">Gegenereerde CSS voor het oranje element:</span>
          <button type="button" class="dv-copy-btn" @click="copyCss">
            {{ copied ? 'Gekopieerd!' : 'Kopieer CSS' }}
          </button>
        </div>
        <pre><code>{{ generatedCssCode }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface DisplayMode {
  id: 'inline' | 'inline-block' | 'block' | 'none' | 'visibility-hidden'
  code: string
  summary: string
}

const displayModes: DisplayMode[] = [
  {
    id: 'inline',
    code: 'display: inline',
    summary: 'Vloeit mee in de tekstregel zoals een woord of hyperlink'
  },
  {
    id: 'inline-block',
    code: 'display: inline-block',
    summary: 'Vloeit mee op de regel, maar gehoorzaamt aan breedte en hoogte'
  },
  {
    id: 'block',
    code: 'display: block',
    summary: 'Start op een eigen nieuwe regel en duwt de rest omlaag'
  },
  {
    id: 'none',
    code: 'display: none',
    summary: 'Element verdwijnt volledig; buren A en C sluiten het gat'
  },
  {
    id: 'visibility-hidden',
    code: 'visibility: hidden',
    summary: 'Onzichtbaar, maar laat een lege open ruimte achter'
  }
]

const activeMode = ref<'inline' | 'inline-block' | 'block' | 'none' | 'visibility-hidden'>('inline-block')
const activeWidth = ref<number>(200)
const activeHeight = ref<number>(55)
const activeVerticalAlign = ref<string>('middle')
const activeMargin = ref<number>(10)
const copied = ref<boolean>(false)

const activeModeCodeString = computed(() => {
  if (activeMode.value === 'visibility-hidden') return 'visibility: hidden;'
  return `display: ${activeMode.value};`
})

const activeModeInfo = computed(() => {
  switch (activeMode.value) {
    case 'inline':
      return {
        type: 'mode-inline-info',
        badge: 'Tekststroom',
        title: 'display: inline — Het oranje element gedraagt zich als platte tekst',
        elementEffect: 'Het oranje element vloeit gewoon mee tussen de woorden van de zin, net zoals een <span> of <a> dat doet.',
        neighborEffect: 'Vak A en Vak C blijven op dezelfde regel en sluiten direct links en rechts aan zonder nieuwe regels te forceren.',
        sizingEffect: 'GENEGEERD: width en height werken NIET op inline-elementen. Ook verticale marges duwen de regel niet weg.',
        sizingClass: 'text-warn'
      }
    case 'inline-block':
      return {
        type: 'mode-inlineblock-info',
        badge: 'Combinatie',
        title: 'display: inline-block — Het beste van twee werelden',
        elementEffect: 'Aan de buitenkant vloeit het oranje element mee op de regel, maar intern bezit het de kracht van een volwaardig blok.',
        neighborEffect: 'Vak A en Vak C blijven op dezelfde regel (zolang er plaats is), maar worden netjes opzij geduwd door de breedte en marges.',
        sizingEffect: 'VOLLEDIG ONDERSTEUND: width, height, padding, alle marges en vertical-align werken zoals ingesteld.',
        sizingClass: 'text-success'
      }
    case 'block':
      return {
        type: 'mode-block-info',
        badge: 'Eigen regel',
        title: 'display: block — Dwingt een eigen regel af',
        elementEffect: 'Het oranje element breekt de regel af, start op een eigen nieuwe regel en neemt een horizontale strook in.',
        neighborEffect: 'Vak A blijft op de bovenste regel; het oranje blok zakt naar regel 2; Vak C en de rest van de tekst zakken naar regel 3.',
        sizingEffect: 'VOLLEDIG ONDERSTEUND: width, height, padding en alle marges worden gerespecteerd.',
        sizingClass: 'text-success'
      }
    case 'none':
      return {
        type: 'mode-none-info',
        badge: 'Volledig weg',
        title: 'display: none — Uit de documentstroom verwijderd',
        elementEffect: 'Het oranje element wordt visueel en fysiek gewist uit de pagina. De afmetingen worden 0 × 0 pixels.',
        neighborEffect: 'Vak A en Vak C schuiven direct naadloos tegen elkaar aan alsof het oranje blok nooit in de HTML heeft bestaan.',
        sizingEffect: 'GEEN RUIMTE: neemt 0 pixels in beslag en veroorzaakt geen enkele witruimte.',
        sizingClass: 'text-neutral'
      }
    case 'visibility-hidden':
      return {
        type: 'mode-visibility-info',
        badge: 'Blinde vlek',
        title: 'visibility: hidden — Onzichtbaar met behoud van afmetingen',
        elementEffect: 'Het oranje element wordt 100% transparant gemaakt, maar blijft exact even breed en hoog.',
        neighborEffect: 'Vak A en Vak C schuiven NIET op. Er blijft een leeg gapend gat (blinde vlek) over van de ingestelde breedte en hoogte.',
        sizingEffect: 'RUIMTE BEHOUDEN: behoudt zijn exacte breedte, hoogte en marges in de pagina-indeling.',
        sizingClass: 'text-neutral'
      }
    default:
      return {
        type: '',
        badge: '',
        title: '',
        elementEffect: '',
        neighborEffect: '',
        sizingEffect: '',
        sizingClass: ''
      }
  }
})

// Stijlen voor de verschillende modi
const targetInlineStyles = computed(() => {
  return {
    marginLeft: `${activeMargin.value}px`,
    marginRight: `${activeMargin.value}px`,
  }
})

const targetInlineBlockStyles = computed(() => {
  return {
    width: `${activeWidth.value}px`,
    height: `${activeHeight.value}px`,
    verticalAlign: activeVerticalAlign.value,
    margin: `${activeMargin.value}px`,
  }
})

const targetBlockStyles = computed(() => {
  return {
    width: `${activeWidth.value}px`,
    height: `${activeHeight.value}px`,
    margin: `${activeMargin.value}px 0`,
  }
})

const targetGhostStyles = computed(() => {
  return {
    width: `${activeWidth.value}px`,
    height: `${activeHeight.value}px`,
    verticalAlign: activeVerticalAlign.value,
    margin: `${activeMargin.value}px`,
  }
})

const generatedCssCode = computed(() => {
  if (activeMode.value === 'none') {
    return `.oranje-doelwit {\n  display: none;\n  /* Element neemt 0x0px in beslag; buurelementen Vak A en C sluiten direct aan */\n}`
  }
  if (activeMode.value === 'visibility-hidden') {
    return `.oranje-doelwit {\n  display: inline-block;\n  visibility: hidden;\n  width: ${activeWidth.value}px;\n  height: ${activeHeight.value}px;\n  vertical-align: ${activeVerticalAlign.value};\n  margin: ${activeMargin.value}px;\n  /* Element is onzichtbaar, maar behoudt zijn fysieke plek van ${activeWidth.value}x${activeHeight.value}px */\n}`
  }
  if (activeMode.value === 'inline') {
    return `.oranje-doelwit {\n  display: inline;\n  /* Let op: width en height worden genegeerd door de browser op inline elementen! */\n  /* Enkel margin-left en margin-right werken: */\n  margin-left: ${activeMargin.value}px;\n  margin-right: ${activeMargin.value}px;\n}`
  }
  if (activeMode.value === 'block') {
    return `.oranje-doelwit {\n  display: block;\n  width: ${activeWidth.value}px;\n  height: ${activeHeight.value}px;\n  margin-top: ${activeMargin.value}px;\n  margin-bottom: ${activeMargin.value}px;\n  /* Start op een eigen regel en duwt Vak C en de tekst omlaag */\n}`
  }
  return `.oranje-doelwit {\n  display: inline-block;\n  width: ${activeWidth.value}px;\n  height: ${activeHeight.value}px;\n  vertical-align: ${activeVerticalAlign.value};\n  margin: ${activeMargin.value}px;\n  /* Vloeit mee op de regel en behoudt toch zijn eigen afmetingen */\n}`
})

const copyCss = async () => {
  try {
    await navigator.clipboard.writeText(generatedCssCode.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    // Fallback
  }
}
</script>

<style scoped>
.display-visualizer {
  margin: 2rem 0;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.dv-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.4rem;
  background-color: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
}

.dv-header-title {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-weight: 700;
  font-size: 1rem;
  color: var(--vp-c-text-1);
}

.dv-title-icon {
  color: #e87722;
}

.dv-badge {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  background-color: rgba(232, 119, 34, 0.12);
  color: #e87722;
}

.dv-body {
  padding: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

/* Sectietitels */
.dv-section-heading-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.6rem;
}

.dv-target-indicator-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #e87722;
  box-shadow: 0 0 8px rgba(232, 119, 34, 0.6);
}

.dv-section-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

/* 1. Modes grid: oranje actieve styling ipv blauw */
.dv-control-section {
  display: flex;
  flex-direction: column;
}

.dv-modes-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.6rem;
}

@media (max-width: 900px) {
  .dv-modes-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 600px) {
  .dv-modes-grid {
    grid-template-columns: 1fr;
  }
}

.dv-mode-card {
  padding: 0.75rem 0.85rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  cursor: pointer;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  transition: all 0.2s ease;
}

.dv-mode-card:hover {
  border-color: #e87722;
  transform: translateY(-1px);
}

/* ACTIEVE KNOP: ORANJE THEMA DIE EXACT OVEREENKOMT MET HET ORANJE BLOK */
.dv-mode-card.is-active {
  background-color: #e87722;
  border-color: #e87722;
  box-shadow: 0 4px 14px rgba(232, 119, 34, 0.35);
}

.dv-mode-code code {
  font-size: 0.84rem;
  font-weight: 700;
  color: #e87722;
  background: transparent;
  padding: 0;
}

.dv-mode-card.is-active .dv-mode-code code {
  color: #ffffff;
}

.dv-mode-summary {
  font-size: 0.74rem;
  line-height: 1.35;
  color: var(--vp-c-text-2);
}

.dv-mode-card.is-active .dv-mode-summary {
  color: #fff3ea;
}

/* 2. Uitlegkaart */
.dv-explanation-card {
  border-radius: 8px;
  padding: 1.1rem 1.3rem;
  background-color: var(--vp-c-bg);
  border-left: 4px solid #e87722;
  border-top: 1px solid var(--vp-c-divider);
  border-right: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.dv-explanation-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.dv-pill {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.15rem 0.55rem;
  border-radius: 4px;
  background-color: #e87722;
  color: #ffffff;
}

.dv-explanation-title {
  margin: 0;
  font-size: 0.98rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.dv-explanation-points {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.1rem;
}

@media (max-width: 800px) {
  .dv-explanation-points {
    grid-template-columns: 1fr;
    gap: 0.65rem;
  }
}

.dv-point {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.84rem;
  line-height: 1.4;
}

.dv-point-label {
  font-weight: 700;
  color: var(--vp-c-text-1);
  font-size: 0.8rem;
}

.dv-point-desc {
  color: var(--vp-c-text-2);
}

.text-warn {
  color: #b45309;
}
:root.dark .text-warn {
  color: #fbbf24;
}

.text-success {
  color: #15803d;
}
:root.dark .text-success {
  color: #4ade80;
}

.text-neutral {
  color: #475569;
}
:root.dark .text-neutral {
  color: #94a3b8;
}

/* 3. Tweaks panel */
.dv-tweaks-panel {
  background-color: var(--vp-c-bg);
  padding: 1.1rem 1.25rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.dv-tweaks-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

@media (max-width: 960px) {
  .dv-tweaks-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 540px) {
  .dv-tweaks-grid {
    grid-template-columns: 1fr;
  }
}

.dv-tweak-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.dv-tweak-item.is-disabled {
  opacity: 0.45;
}

.dv-tweak-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.82rem;
  font-weight: 600;
}

.dv-tweak-val {
  font-family: monospace;
  font-weight: 700;
}

.dv-ignored {
  color: #b45309;
  font-style: italic;
  font-weight: normal;
  font-size: 0.75rem;
}
:root.dark .dv-ignored {
  color: #fbbf24;
}

.dv-range {
  width: 100%;
  accent-color: #e87722;
  cursor: pointer;
}

.dv-tweak-hint {
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  line-height: 1.35;
}

.dv-btn-pills {
  display: flex;
  gap: 0.35rem;
}

.dv-pill-btn {
  flex: 1;
  padding: 0.25rem 0.45rem;
  font-size: 0.75rem;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.15s ease;
}

.dv-pill-btn:hover:not(:disabled) {
  border-color: #e87722;
}

.dv-pill-btn.is-active {
  background-color: #e87722;
  border-color: #e87722;
  color: #ffffff;
  font-weight: 600;
}

/* 4. Canvas Stage & Legende */
.dv-canvas-card {
  background-color: var(--vp-c-bg);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  padding: 1.25rem;
}

.dv-canvas-topbar {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 0.85rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.dv-canvas-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
}

.dv-canvas-current-tag {
  font-family: monospace;
  font-size: 0.8rem;
  color: #e87722;
  background-color: rgba(232, 119, 34, 0.1);
  padding: 0.1rem 0.45rem;
  border-radius: 4px;
}

.dv-canvas-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  font-size: 0.76rem;
  color: var(--vp-c-text-2);
}

.dv-legend-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.dv-legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  display: inline-block;
}

.dv-legend-ref {
  background-color: #1e2d5a;
}

.dv-legend-orange {
  background-color: #e87722;
}

.dv-stage-box {
  background-color: #ffffff;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  padding: 1.5rem;
  min-height: 180px;
}
:root.dark .dv-stage-box {
  background-color: #0f172a;
  border-color: #334155;
}

.dv-stage-paragraph {
  font-size: 0.95rem;
  line-height: 2.2;
  color: #334155;
  margin: 0;
}
:root.dark .dv-stage-paragraph {
  color: #cbd5e1;
}

/* Buurelementen (Vak A en Vak C) - Duidelijk gemarkeerd als vergelijking */
.dv-badge-lead,
.dv-badge-trail {
  display: inline-block;
  padding: 0.35rem 0.65rem;
  background-color: #1e2d5a;
  color: #ffffff;
  border-radius: 6px;
  vertical-align: middle;
  line-height: 1.2;
  box-shadow: 0 2px 6px rgba(30, 45, 90, 0.2);
  text-align: center;
}

.dv-badge-name {
  display: block;
  font-weight: 700;
  font-size: 0.8rem;
}

.dv-badge-sub {
  display: block;
  font-size: 0.65rem;
  opacity: 0.8;
  font-family: monospace;
}

/* Doel element varianten (Altijd Oranje) */
.dv-target-element {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
}

/* A. Inline mode */
.dv-target-element.is-inline-target {
  display: inline;
  background-color: #e87722;
  color: #ffffff;
  padding: 0.35rem 0.75rem;
  font-weight: 700;
  font-size: 0.88rem;
  border-radius: 4px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}

/* B. Inline-block mode */
.dv-target-element.is-inline-block-target {
  display: inline-block;
  background-color: #e87722;
  color: #ffffff;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  box-shadow: 0 4px 12px rgba(232, 119, 34, 0.35);
  text-align: center;
}

/* C. Block mode */
.dv-target-element.is-block-target {
  display: block;
  background-color: #e87722;
  color: #ffffff;
  border-radius: 6px;
  padding: 0.65rem 1rem;
  box-shadow: 0 4px 12px rgba(232, 119, 34, 0.35);
  text-align: center;
}

.dv-target-heading {
  display: block;
  font-weight: 700;
  font-size: 0.88rem;
  line-height: 1.2;
}

.dv-target-subtext {
  display: block;
  font-size: 0.72rem;
  opacity: 0.95;
  margin-top: 0.2rem;
  line-height: 1.2;
}

/* D. Visibility hidden ghost */
.dv-target-element.is-hidden-ghost {
  display: inline-block;
  border: 2px dashed #e87722;
  background-color: rgba(232, 119, 34, 0.06);
  color: #e87722;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0.4rem;
}

.dv-ghost-inner {
  font-size: 0.74rem;
  font-weight: 600;
  line-height: 1.2;
}

/* 5. Code box */
.dv-code-box {
  border-radius: 8px;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
}

.dv-code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 0.78rem;
  border-bottom: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
}

.dv-code-title {
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.dv-copy-btn {
  font-size: 0.75rem;
  padding: 0.25rem 0.65rem;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
}

.dv-copy-btn:hover {
  border-color: #e87722;
  color: #e87722;
}

.dv-code-box pre {
  margin: 0;
  padding: 0.85rem 1.1rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.82rem;
  line-height: 1.55;
  color: var(--vp-c-text-1);
}
</style>
