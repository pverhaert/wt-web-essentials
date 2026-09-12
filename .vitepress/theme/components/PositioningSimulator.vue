<template>
  <div class="pos-simulator">
    <!-- Header -->
    <div class="pos-header">
      <div class="pos-header-title">
        <svg class="pos-title-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
        <span class="pos-label">Positioning Simulator</span>
      </div>
      <span class="pos-badge">Interactieve demonstratie</span>
    </div>

    <div class="pos-body">
      <!-- 1. MODUS TABS -->
      <div class="pos-tabs" role="tablist" aria-label="Positioneringstechnieken">
        <button
          v-for="mode in modes"
          :key="mode.id"
          type="button"
          role="tab"
          :aria-selected="activeMode === mode.id"
          class="pos-tab"
          :class="{ 'is-active': activeMode === mode.id }"
          @click="activeMode = mode.id"
        >
          <code>position: {{ mode.id }}</code>
          <span class="pos-tab-desc">{{ mode.label }}</span>
        </button>
      </div>

      <!-- 2. UITLEGKAART -->
      <div class="pos-explanation-card">
        <div class="pos-explanation-header">
          <span class="pos-tag">{{ currentModeInfo.badge }}</span>
          <h4 class="pos-explanation-title">{{ currentModeInfo.title }}</h4>
        </div>
        <p class="pos-explanation-text">{{ currentModeInfo.description }}</p>
        <div class="pos-explanation-details">
          <div class="pos-detail-item">
            <span class="pos-detail-label">Documentstroom:</span>
            <span class="pos-detail-value" :class="currentModeInfo.flowPreserved ? 'text-ok' : 'text-warn'">
              {{ currentModeInfo.flowText }}
            </span>
          </div>
          <div class="pos-detail-item">
            <span class="pos-detail-label">Referentiepunt:</span>
            <span class="pos-detail-value">{{ currentModeInfo.referencePoint }}</span>
          </div>
          <div class="pos-detail-item">
            <span class="pos-detail-label">Typisch praktijkgebruik:</span>
            <span class="pos-detail-value"><em>{{ currentModeInfo.usage }}</em></span>
          </div>
        </div>
      </div>

      <!-- 3. HOOFDWERKBLAD (2 KOLOMMEN: BEDIENING & PREVIEW LINKS, CODE RECHTS) -->
      <div class="pos-workspace-grid">
        <!-- LINKER KOLOM: BEDIENING EN LIVE WEERGAVE -->
        <div class="pos-left-col">
          <!-- BEDIENING VOOR RELATIVE -->
          <div v-if="activeMode === 'relative'" class="pos-controls-panel">
            <div class="pos-control-toggle-row">
              <label class="pos-toggle-label">
                <input type="checkbox" v-model="relActive" class="pos-checkbox" />
                <span class="pos-toggle-text">
                  <strong>Activeer <code>position: relative</code></strong>
                  <span class="pos-sub">Vink uit om het standaardgedrag (<code>static</code>) te zien</span>
                </span>
              </label>
            </div>

            <div class="pos-sliders-grid" :class="{ 'is-disabled': !relActive }">
              <div class="pos-slider-group">
                <div class="pos-slider-header">
                  <label for="rel-top">Verschuiving <code>top</code>:</label>
                  <span class="pos-slider-val">{{ relTop }}px</span>
                </div>
                <input
                  id="rel-top"
                  type="range"
                  min="-30"
                  max="60"
                  step="5"
                  v-model.number="relTop"
                  :disabled="!relActive"
                  class="pos-range"
                />
              </div>

              <div class="pos-slider-group">
                <div class="pos-slider-header">
                  <label for="rel-left">Verschuiving <code>left</code>:</label>
                  <span class="pos-slider-val">{{ relLeft }}px</span>
                </div>
                <input
                  id="rel-left"
                  type="range"
                  min="-40"
                  max="80"
                  step="5"
                  v-model.number="relLeft"
                  :disabled="!relActive"
                  class="pos-range"
                />
              </div>
            </div>
            <button type="button" class="pos-reset-btn" @click="resetRelative" :disabled="!relActive">
              Herstel offsets naar 0px
            </button>
          </div>

          <!-- BEDIENING VOOR ABSOLUTE -->
          <div v-else-if="activeMode === 'absolute'" class="pos-controls-panel">
            <div class="pos-control-toggle-row">
              <label class="pos-toggle-label">
                <input type="checkbox" v-model="absActive" class="pos-checkbox" />
                <span class="pos-toggle-text">
                  <strong>Activeer <code>position: absolute</code> op Doelwit</strong>
                  <span class="pos-sub">Verlaat de documentstroom: broer 3 schuift direct omhoog!</span>
                </span>
              </label>
            </div>

            <div class="pos-context-toggle-row">
              <span class="pos-context-label">Positioneringscontext van de ouder (<code>.ouder</code>):</span>
              <div class="pos-btn-group">
                <button
                  type="button"
                  class="pos-group-btn"
                  :class="{ 'is-active': absParentRelative }"
                  @click="absParentRelative = true"
                >
                  <code>position: relative</code> (Aanbevolen)
                </button>
                <button
                  type="button"
                  class="pos-group-btn"
                  :class="{ 'is-active': !absParentRelative }"
                  @click="absParentRelative = false"
                >
                  <code>position: static</code> (Geen context)
                </button>
              </div>
              <div class="pos-context-info-note" :class="absParentRelative ? 'note-ok' : 'note-warn'">
                <span v-if="absParentRelative">
                  De coördinaten worden berekend ten opzichte van de <strong>binnenrand van <code>.ouder</code></strong>.
                </span>
                <span v-else>
                  Geen gepositioneerde voorouder! Coördinaten richten zich op het <strong>buitenste browservenster (body)</strong>.
                </span>
              </div>
            </div>

            <div class="pos-sliders-grid" :class="{ 'is-disabled': !absActive }">
              <div class="pos-slider-group">
                <div class="pos-slider-header">
                  <label for="abs-top">Positie <code>top</code>:</label>
                  <span class="pos-slider-val">{{ absTop }}px</span>
                </div>
                <input
                  id="abs-top"
                  type="range"
                  min="0"
                  max="120"
                  step="5"
                  v-model.number="absTop"
                  :disabled="!absActive"
                  class="pos-range"
                />
              </div>

              <div class="pos-slider-group">
                <div class="pos-slider-header">
                  <label for="abs-left">Positie <code>left</code>:</label>
                  <span class="pos-slider-val">{{ absLeft }}px</span>
                </div>
                <input
                  id="abs-left"
                  type="range"
                  min="0"
                  max="160"
                  step="5"
                  v-model.number="absLeft"
                  :disabled="!absActive"
                  class="pos-range"
                />
              </div>
            </div>
          </div>

          <!-- BEDIENING VOOR FIXED -->
          <div v-else-if="activeMode === 'fixed'" class="pos-controls-panel">
            <div class="pos-control-toggle-row">
              <label class="pos-toggle-label">
                <input type="checkbox" v-model="fixActive" class="pos-checkbox" />
                <span class="pos-toggle-text">
                  <strong>Activeer <code>position: fixed</code> op zwevende knop</strong>
                  <span class="pos-sub">Blijft rotsvast op het scherm staan tijdens het scrollen</span>
                </span>
              </label>
            </div>

            <div class="pos-presets-row" :class="{ 'is-disabled': !fixActive }">
              <span class="pos-context-label">Kies vaste positie in het venster:</span>
              <div class="pos-btn-group">
                <button
                  type="button"
                  class="pos-group-btn"
                  :class="{ 'is-active': fixPositionPreset === 'bottom-right' }"
                  :disabled="!fixActive"
                  @click="fixPositionPreset = 'bottom-right'"
                >
                  Rechtsonder (Back to top)
                </button>
                <button
                  type="button"
                  class="pos-group-btn"
                  :class="{ 'is-active': fixPositionPreset === 'top-bar' }"
                  :disabled="!fixActive"
                  @click="fixPositionPreset = 'top-bar'"
                >
                  Bovenaan (Vaste balk)
                </button>
              </div>
            </div>
          </div>

          <!-- BEDIENING VOOR STICKY -->
          <div v-else-if="activeMode === 'sticky'" class="pos-controls-panel">
            <div class="pos-control-toggle-row">
              <label class="pos-toggle-label">
                <input type="checkbox" v-model="stickyActive" class="pos-checkbox" />
                <span class="pos-toggle-text">
                  <strong>Activeer <code>position: sticky</code> op tussenkop</strong>
                  <span class="pos-sub">Scrolt eerst normaal mee en blijft dan bovenaan kleven</span>
                </span>
              </label>
            </div>

            <div class="pos-slider-group" :class="{ 'is-disabled': !stickyActive }">
              <div class="pos-slider-header">
                <label for="sticky-top">Grenswaarde <code>top</code>:</label>
                <span class="pos-slider-val">{{ stickyTop }}px</span>
              </div>
              <input
                id="sticky-top"
                type="range"
                min="0"
                max="40"
                step="5"
                v-model.number="stickyTop"
                :disabled="!stickyActive"
                class="pos-range"
              />
            </div>
          </div>

          <!-- BEDIENING VOOR Z-INDEX -->
          <div v-else-if="activeMode === 'z-index'" class="pos-controls-panel">
            <p class="pos-panel-intro">
              Onderstaande 3 kaarten hebben <code>position: absolute</code> en overlappen elkaar. Pas de <code>z-index</code> aan om te bepalen welke kaart bovenop ligt:
            </p>
            <div class="pos-zindex-controls">
              <div class="pos-z-item item-blue">
                <div class="pos-z-label">
                  <span class="pos-color-badge blue"></span>
                  <strong>Kaart A (Blauw)</strong>
                </div>
                <div class="pos-z-input-wrap">
                  <label for="z-blue">z-index:</label>
                  <input
                    id="z-blue"
                    type="number"
                    v-model.number="zCardA"
                    class="pos-number-input"
                    min="-2"
                    max="10"
                  />
                </div>
              </div>

              <div class="pos-z-item item-orange">
                <div class="pos-z-label">
                  <span class="pos-color-badge orange"></span>
                  <strong>Kaart B (Oranje)</strong>
                </div>
                <div class="pos-z-input-wrap">
                  <label for="z-orange">z-index:</label>
                  <input
                    id="z-orange"
                    type="number"
                    v-model.number="zCardB"
                    class="pos-number-input"
                    min="-2"
                    max="10"
                  />
                </div>
              </div>

              <div class="pos-z-item item-green">
                <div class="pos-z-label">
                  <span class="pos-color-badge green"></span>
                  <strong>Kaart C (Donker)</strong>
                </div>
                <div class="pos-z-input-wrap">
                  <label for="z-green">z-index:</label>
                  <input
                    id="z-green"
                    type="number"
                    v-model.number="zCardC"
                    class="pos-number-input"
                    min="-2"
                    max="10"
                  />
                </div>
              </div>
            </div>
            <button type="button" class="pos-reset-btn" @click="resetZIndex">
              Herstel standaard z-index (1, 2, 3)
            </button>
          </div>

          <!-- LIVE WEERGAVE STAGE -->
          <div class="pos-stage-wrapper">
            <div class="pos-stage-header">
              <span class="pos-stage-title">Visuele weergave in de browser</span>
              <span v-if="activeMode === 'relative'" class="pos-stage-legend">
                <span class="legend-ghost"></span> Oorspronkelijke plek
              </span>
              <span v-else-if="activeMode === 'fixed' || activeMode === 'sticky'" class="pos-scroll-hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
                Scrol in het venster om het effect te zien
              </span>
            </div>

            <!-- PREVIEW: RELATIVE -->
            <div v-if="activeMode === 'relative'" class="pos-stage pos-stage-flow">
              <div class="pos-flow-box box-static-1">
                <strong>1. Broerelement 1</strong>
                <span class="box-sub"><code>position: static</code></span>
              </div>

              <!-- RELATIEVE WRAPPER (BEHOUDT EXACT DE HOOGTE EN BREEDTE IN DE STROOM) -->
              <div class="pos-relative-slot">
                <!-- GHOST KADER (EXACT SAMENVALLEND MET DE OORSPRONKELIJKE PLEK) -->
                <div v-if="relActive && (relTop !== 0 || relLeft !== 0)" class="pos-ghost-box">
                  <span class="ghost-text">Oorspronkelijke plek blijft 100% open!</span>
                </div>

                <!-- HET RELATIVE ELEMENT -->
                <div
                  class="pos-flow-box box-target"
                  :style="relativeTargetStyle"
                >
                  <strong>2. Doelwit (Verplaatst)</strong>
                  <span class="box-sub">
                    {{ relActive ? `top: ${relTop}px; left: ${relLeft}px;` : 'position: static;' }}
                  </span>
                </div>
              </div>

              <div class="pos-flow-box box-static-2">
                <strong>3. Broerelement 3</strong>
                <span class="box-sub"><code>position: static</code> (blijft netjes op zijn plek!)</span>
              </div>
            </div>

            <!-- PREVIEW: ABSOLUTE -->
            <div
              v-else-if="activeMode === 'absolute'"
              class="pos-stage pos-stage-abs-container"
              :class="{ 'has-viewport-context': !absParentRelative }"
            >
              <div
                class="pos-parent-box"
                :class="{ 'is-relative': absParentRelative }"
              >
                <div class="pos-parent-badge">
                  <code>.ouder</code>: {{ absParentRelative ? 'position: relative;' : 'position: static;' }}
                </div>

                <div class="pos-flow-box box-static-1">
                  <strong>1. Broerelement 1</strong>
                </div>

                <!-- DOELWIT (ABSOLUTE) -->
                <div
                  class="pos-flow-box box-target box-target-abs"
                  :class="{ 'is-absolute': absActive }"
                  :style="absoluteTargetStyle"
                >
                  <strong>2. Doelwit</strong>
                  <span class="box-sub">
                    {{ absActive ? `top: ${absTop}px; left: ${absLeft}px;` : 'position: static;' }}
                  </span>
                </div>

                <div class="pos-flow-box box-static-2" :class="{ 'has-snapped-up': absActive }">
                  <strong>3. Broerelement 3</strong>
                  <span v-if="absActive" class="box-notice">Schuift direct omhoog in de documentstroom!</span>
                </div>
              </div>
            </div>

            <!-- PREVIEW: FIXED -->
            <div v-else-if="activeMode === 'fixed'" class="pos-stage pos-stage-fixed-viewport">
              <div class="pos-mini-browser-bar">
                <span class="pos-browser-dot dot-red"></span>
                <span class="pos-browser-dot dot-yellow"></span>
                <span class="pos-browser-dot dot-green"></span>
                <span class="pos-browser-url">https://jouw-website.be/nieuws</span>
              </div>

              <!-- VIEWPORT VENSTER SCHERM -->
              <div class="pos-viewport-screen">
                <!-- VASTE BOVENBALK (ALS PRESET TOP-BAR IS) -->
                <div
                  v-if="fixActive && fixPositionPreset === 'top-bar'"
                  class="pos-fixed-bar"
                >
                  <strong>Vaste navigatiebalk (<code>position: fixed; top: 0;</code>)</strong>
                </div>

                <!-- SCROLLBARE PAGINA -->
                <div
                  class="pos-scroll-area"
                  :class="{ 'has-fixed-top-bar': fixActive && fixPositionPreset === 'top-bar' }"
                >
                  <div class="pos-page-content">
                    <h4>Webontwikkeling aan Thomas More Geel</h4>
                    <p>
                      De studenten van de IT Factory leren professionele webpagina's structureren en stileren. Met CSS-positionering heb je de volledige controle over de exacte weergave van interface-elementen.
                    </p>
                    <p>
                      Scroll rustig door dit venster. Let op hoe de normale alinea's onderaan wegglijden, terwijl gefixeerde elementen exact op dezelfde coördinaten van het venster vergrendeld blijven!
                    </p>
                    <p>
                      Dit is de ideale techniek voor zwevende contactknoppen, 'terug naar boven'-knoppen, cookiebalken of navigatiebalken die altijd binnen handbereik moeten blijven.
                    </p>
                    <p>
                      Een element met <code>position: fixed</code> laat bovendien geen leeg gat achter in de pagina; de overige inhoud vult de vrijgekomen ruimte direct op.
                    </p>
                  </div>
                </div>

                <!-- ZWEVENDE ACTIEKNOP RECHTSONDER -->
                <div
                  v-if="fixActive && fixPositionPreset === 'bottom-right'"
                  class="pos-fixed-floating-btn"
                  title="position: fixed; bottom: 15px; right: 15px;"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                  <span>Top</span>
                </div>
              </div>
            </div>

            <!-- PREVIEW: STICKY -->
            <div v-else-if="activeMode === 'sticky'" class="pos-stage pos-stage-sticky-viewport">
              <div class="pos-mini-browser-bar">
                <span class="pos-browser-dot dot-red"></span>
                <span class="pos-browser-dot dot-yellow"></span>
                <span class="pos-browser-dot dot-green"></span>
                <span class="pos-browser-url">https://jouw-website.be/cursus/css</span>
              </div>

              <!-- SCROLLBARE PAGINA (ZONDER PADDING-TOP ZODAT TOP:0 STRAK AANSLUIT) -->
              <div class="pos-scroll-area pos-sticky-scroll-area">
                <div class="pos-sticky-intro">
                  <h4>Inleiding tot de Cascade</h4>
                  <p>
                    Hierboven staat gewone tekst. Scrol naar beneden om te zien hoe de onderstaande oranje navigatiebalk eerst normaal meebeweegt in de stroom...
                  </p>
                </div>

                <!-- STICKY ELEMENT -->
                <div
                  class="pos-sticky-bar"
                  :class="{ 'is-sticky-enabled': stickyActive }"
                  :style="stickyActive ? { position: 'sticky', top: `${stickyTop}px` } : { position: 'static' }"
                >
                  <div class="pos-sticky-inner">
                    <strong>Klevende menubalk</strong>
                    <code>position: {{ stickyActive ? 'sticky' : 'static' }}; top: {{ stickyTop }}px;</code>
                  </div>
                </div>

                <div class="pos-sticky-body">
                  <p>
                    Zodra de balk de ingestelde drempelwaarde (<code>top: {{ stickyTop }}px</code>) raakt, "kleeft" hij tegen de bovenrand van het scrollvenster!
                  </p>
                  <p>
                    De tekst van de volgende secties scrolt netjes onder de klevende balk door. Pas wanneer de oudercontainer helemaal uit beeld scrolt, verdwijnt ook de sticky balk.
                  </p>
                  <p>
                    Dit combineert het beste van twee werelden: een natuurlijke plek op de pagina die pas verandert in een vaste balk wanneer de gebruiker naar beneden scrolt.
                  </p>
                  <p>
                    Ideaal voor hoofdstuktitels in lange documenten, productfilters in webshops of tabelkoppen (<code>th</code>) in grote gegevenstabellen.
                  </p>
                </div>
              </div>
            </div>

            <!-- PREVIEW: Z-INDEX -->
            <div v-else-if="activeMode === 'z-index'" class="pos-stage pos-stage-zindex">
              <div class="pos-z-arena">
                <!-- KAART A -->
                <div
                  class="pos-card-layer card-a"
                  :style="{ zIndex: zCardA }"
                >
                  <div class="card-header">
                    <span class="pos-color-badge blue"></span>
                    <strong>Kaart A</strong>
                  </div>
                  <div class="card-code">z-index: {{ zCardA }};</div>
                </div>

                <!-- KAART B -->
                <div
                  class="pos-card-layer card-b"
                  :style="{ zIndex: zCardB }"
                >
                  <div class="card-header">
                    <span class="pos-color-badge orange"></span>
                    <strong>Kaart B</strong>
                  </div>
                  <div class="card-code">z-index: {{ zCardB }};</div>
                </div>

                <!-- KAART C -->
                <div
                  class="pos-card-layer card-c"
                  :style="{ zIndex: zCardC }"
                >
                  <div class="card-header">
                    <span class="pos-color-badge green"></span>
                    <strong>Kaart C</strong>
                  </div>
                  <div class="card-code">z-index: {{ zCardC }};</div>
                </div>
              </div>
              <div class="pos-z-note">
                Hoger getal = ligt vóór lagere getallen. Bij gelijke <code>z-index</code> wint het element dat later in de HTML-broncode staat.
              </div>
            </div>
          </div>
        </div>

        <!-- RECHTER KOLOM: GEGENEREERDE CODE -->
        <div class="pos-right-col">
          <div class="pos-code-panel">
            <div class="pos-code-header">
              <span class="pos-code-label">Gegenereerde CSS</span>
              <button type="button" class="pos-copy-btn" @click="copyCode">
                {{ copied ? 'Gekopieerd!' : 'Kopieer CSS' }}
              </button>
            </div>
            <pre class="pos-pre"><code>{{ generatedCss }}</code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

type Mode = 'relative' | 'absolute' | 'fixed' | 'sticky' | 'z-index'

const activeMode = ref<Mode>('relative')
const copied = ref<boolean>(false)

// 1. RELATIVE STATE
const relActive = ref<boolean>(true)
const relTop = ref<number>(20)
const relLeft = ref<number>(30)

function resetRelative() {
  relTop.value = 0
  relLeft.value = 0
}

const relativeTargetStyle = computed(() => {
  if (!relActive.value) {
    return { position: 'static' as const }
  }
  return {
    position: 'relative' as const,
    top: `${relTop.value}px`,
    left: `${relLeft.value}px`,
    zIndex: 2,
  }
})

// 2. ABSOLUTE STATE
const absActive = ref<boolean>(true)
const absParentRelative = ref<boolean>(true)
const absTop = ref<number>(15)
const absLeft = ref<number>(20)

const absoluteTargetStyle = computed(() => {
  if (!absActive.value) {
    return { position: 'static' as const }
  }
  return {
    position: 'absolute' as const,
    top: `${absTop.value}px`,
    left: `${absLeft.value}px`,
    zIndex: 3,
  }
})

// 3. FIXED STATE
const fixActive = ref<boolean>(true)
const fixPositionPreset = ref<'bottom-right' | 'top-bar'>('bottom-right')

// 4. STICKY STATE
const stickyActive = ref<boolean>(true)
const stickyTop = ref<number>(0)

// 5. Z-INDEX STATE
const zCardA = ref<number>(1)
const zCardB = ref<number>(2)
const zCardC = ref<number>(3)

function resetZIndex() {
  zCardA.value = 1
  zCardB.value = 2
  zCardC.value = 3
}

// MODES MET BESCHRIJVINGEN
const modes = [
  { id: 'relative', label: 'Verschuiven met behoud van plek' },
  { id: 'absolute', label: 'Uit stroom, context bepalen' },
  { id: 'fixed', label: 'Vast in het browservenster' },
  { id: 'sticky', label: 'Kleven bij het doorscrollen' },
  { id: 'z-index', label: 'Stapelvolgorde van lagen' },
] as const

const modeDetails: Record<Mode, {
  badge: string
  title: string
  description: string
  flowPreserved: boolean
  flowText: string
  referencePoint: string
  usage: string
}> = {
  relative: {
    badge: 'Plek blijft gereserveerd',
    title: 'Hoe werkt position: relative?',
    description: 'Het element verschuift ten opzichte van zijn eigen oorspronkelijke positie. Cruciaal: de oorspronkelijke plek in de documentstroom blijft 100% openstaan. Broerelementen schuiven dus NIET op.',
    flowPreserved: true,
    flowText: 'Ja, de ruimte blijft openstaan',
    referencePoint: 'De oorspronkelijke statische positie van het element zelf',
    usage: 'Subtiele visuele correcties, maar vooral als referentiekader (ouder) voor absolute kinderen!',
  },
  absolute: {
    badge: 'Verlaat de documentstroom',
    title: 'Hoe werkt position: absolute?',
    description: 'Het element wordt volledig uit de normale stroom gelicht. Andere elementen doen alsof het doelwit niet bestaat en nemen zijn plek in. Het element positioneert zich ten opzichte van de dichtstbijzijnde voorouder met position: relative/absolute/fixed.',
    flowPreserved: false,
    flowText: 'Nee, broerelementen nemen de plek in!',
    referencePoint: 'De dichtstbijzijnde gepositioneerde ouder (of het hele browservenster bij static)',
    usage: 'Badges op productkaarten, sluitknoppen op modale vensters, overlays op foto’s.',
  },
  fixed: {
    badge: 'Vast aan het scherm',
    title: 'Hoe werkt position: fixed?',
    description: 'Het element wordt uit de stroom gelicht en verankerd aan het scherm (de viewport). Zelfs wanneer de bezoeker naar beneden scrolt, blijft het element onbeweeglijk op exact dezelfde schermcoördinaten staan.',
    flowPreserved: false,
    flowText: 'Nee, verlaat de documentstroom',
    referencePoint: 'Het zichtbare browservenster (de viewport)',
    usage: 'Vaste navigatiebalken, ‘Terug naar boven’-knoppen, cookie-toestemmingsbalken.',
  },
  sticky: {
    badge: 'Hybride: scrollt mee & kleeft',
    title: 'Hoe werkt position: sticky?',
    description: 'Het element gedraagt zich als een normaal statisch element totdat de pagina zo ver gescrold is dat de drempelwaarde (bijv. top: 0) bereikt wordt. Vanaf dat moment kleeft het element vast tegen de rand zolang zijn oudercontainer in beeld is.',
    flowPreserved: true,
    flowText: 'Ja, behoudt zijn normale plek tot het kleeft',
    referencePoint: 'Normale stroom, daarna de viewportrand binnen zijn ouder',
    usage: 'Koppen van lange artikels, sticky navigatiemenu’s, alfabetische lijstheaders.',
  },
  'z-index': {
    badge: '3D Stapelvolgorde',
    title: 'Hoe werkt z-index?',
    description: 'Bepaalt welke overlappende laag bovenop ligt langs de virtuele z-as (diepte). Let op: z-index werkt ENKEL op gepositioneerde elementen (relative, absolute, fixed of sticky) en heeft geen effect op standaard static elementen!',
    flowPreserved: true,
    flowText: 'Afhankelijk van de gekozen positionering',
    referencePoint: 'De stapelcontext (stacking context) van de voorouder',
    usage: 'Modals vóór achtergrond leggen, badges bovenop foto’s, dropdown-menu’s boven tekst.',
  },
}

const currentModeInfo = computed(() => {
  return modeDetails[activeMode.value]
})

// DYNAMISCH GEGENEREERDE CSS CODE
const generatedCss = computed(() => {
  switch (activeMode.value) {
    case 'relative':
      if (!relActive.value) {
        return `/* Standaard documentstroom */
.doelwit {
  position: static;
}`
      }
      return `/* Relatieve verschuiving */
.doelwit {
  position: relative;
  top: ${relTop.value}px;
  left: ${relLeft.value}px;
}

/* Let op: broerelementen blijven
   op hun plek staan omdat de
   ruimte gereserveerd blijft! */`

    case 'absolute':
      if (!absActive.value) {
        return `/* Standaard stroom */
.ouder {
  position: ${absParentRelative.value ? 'relative' : 'static'};
}

.doelwit {
  position: static;
}`
      }
      if (absParentRelative.value) {
        return `/* De gouden combinatie */
.ouder {
  position: relative; /* Positioneringscontext */
}

.doelwit {
  position: absolute;
  top: ${absTop.value}px;
  left: ${absLeft.value}px;
}

/* Broer 3 schuift direct omhoog
   omdat .doelwit uit de stroom is! */`
      } else {
        return `/* WAARSCHUWING: Geen context! */
.ouder {
  position: static; /* Biedt GEEN kader */
}

.doelwit {
  position: absolute;
  top: ${absTop.value}px;
  left: ${absLeft.value}px;
}

/* Doelwit richt zich nu op <body>
   in plaats van op .ouder! */`
      }

    case 'fixed':
      if (!fixActive.value) {
        return `/* Geen vaste positionering */
.zwevende-knop {
  position: static;
}`
      }
      if (fixPositionPreset.value === 'top-bar') {
        return `/* Vaste navigatiebalk bovenaan */
.vaste-balk {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000; /* Blijft overal bovenop */
}`
      }
      return `/* Zwevende knop rechtsonder */
.terug-naar-boven {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
}`

    case 'sticky':
      if (!stickyActive.value) {
        return `/* Normale statische kop */
.kopbalk {
  position: static;
}`
      }
      return `/* Klevende kopbalk */
.kopbalk {
  position: sticky;
  top: ${stickyTop.value}px; /* Drempelwaarde */
  z-index: 10;
}

/* Scrolt mee tot top: ${stickyTop.value}px
   en blijft dan vaststaan! */`

    case 'z-index':
      return `/* Stapelvolgorde bepalen */
.kaart-a {
  position: absolute;
  z-index: ${zCardA.value}; /* Blauw */
}

.kaart-b {
  position: absolute;
  z-index: ${zCardB.value}; /* Oranje */
}

.kaart-c {
  position: absolute;
  z-index: ${zCardC.value}; /* Donker */
}

/* Hoogste z-index ligt bovenop! */`

    default:
      return ''
  }
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
.pos-simulator {
  margin: 2rem 0;
  border: 1px solid var(--vp-c-divider, #e2e8f0);
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft, #f8fafc);
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.pos-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1.25rem;
  background-color: var(--vp-c-bg, #ffffff);
  border-bottom: 1px solid var(--vp-c-divider, #e2e8f0);
}

.pos-header-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  color: #1e2d5a;
}

.dark .pos-header-title {
  color: #93c5fd;
}

.pos-title-icon {
  color: #e87722;
}

.pos-badge {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: rgba(232, 119, 34, 0.12);
  color: #e87722;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
}

.pos-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* 1. MODUS TABS */
.pos-tabs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 0.5rem;
}

.pos-tab {
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

.pos-tab code {
  font-weight: 700;
  color: #1e2d5a;
  background: transparent;
  padding: 0;
  font-size: 0.85rem;
}

.dark .pos-tab code {
  color: #93c5fd;
}

.pos-tab-desc {
  font-size: 0.72rem;
  color: var(--vp-c-text-2, #64748b);
  margin-top: 0.25rem;
  line-height: 1.2;
}

.pos-tab:hover {
  border-color: #e87722;
  background-color: rgba(232, 119, 34, 0.04);
}

.pos-tab.is-active {
  background-color: #e87722;
  border-color: #d4641a;
  color: #ffffff;
}

.pos-tab.is-active code,
.pos-tab.is-active .pos-tab-desc {
  color: #ffffff;
}

/* 2. UITLEGKAART */
.pos-explanation-card {
  background-color: var(--vp-c-bg, #ffffff);
  border: 1px solid var(--vp-c-divider, #e2e8f0);
  border-left: 4px solid #e87722;
  border-radius: 8px;
  padding: 1rem 1.25rem;
}

.pos-explanation-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.5rem;
}

.pos-tag {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  background-color: rgba(30, 45, 90, 0.08);
  color: #1e2d5a;
}

.dark .pos-tag {
  background-color: rgba(147, 197, 253, 0.15);
  color: #93c5fd;
}

.pos-explanation-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--vp-c-text-1, #1e293b);
}

.pos-explanation-text {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--vp-c-text-2, #475569);
}

.pos-explanation-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
  padding-top: 0.6rem;
  border-top: 1px dashed var(--vp-c-divider, #e2e8f0);
}

.pos-detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.pos-detail-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--vp-c-text-3, #94a3b8);
}

.pos-detail-value {
  font-size: 0.825rem;
  color: var(--vp-c-text-1, #1e293b);
}

.text-ok {
  color: #059669;
  font-weight: 600;
}

.text-warn {
  color: #d97706;
  font-weight: 600;
}

/* 3. WORKSPACE GRID (LINKS CONTROLS + PREVIEW, RECHTS CODE) */
.pos-workspace-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 1.25rem;
  align-items: stretch;
}

.pos-left-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pos-right-col {
  display: flex;
  flex-direction: column;
}

/* BEDIENINGSPANEEL */
.pos-controls-panel {
  background-color: var(--vp-c-bg, #ffffff);
  border: 1px solid var(--vp-c-divider, #e2e8f0);
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.pos-control-toggle-row {
  background-color: var(--vp-c-bg-soft, #f8fafc);
  padding: 0.65rem 0.85rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider, #e2e8f0);
}

.pos-toggle-label {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  cursor: pointer;
}

.pos-checkbox {
  margin-top: 0.2rem;
  width: 17px;
  height: 17px;
  accent-color: #e87722;
  cursor: pointer;
}

.pos-toggle-text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-1, #1e293b);
}

.pos-sub {
  font-size: 0.75rem;
  color: var(--vp-c-text-2, #64748b);
}

.pos-sliders-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.85rem;
  transition: opacity 0.2s ease;
}

.pos-sliders-grid.is-disabled,
.pos-slider-group.is-disabled,
.pos-presets-row.is-disabled {
  opacity: 0.4;
  pointer-events: none;
}

.pos-slider-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.pos-slider-header {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-1, #1e293b);
}

.pos-slider-header label {
  font-weight: 600;
}

.pos-slider-val {
  font-weight: 700;
  color: #e87722;
}

.pos-range {
  width: 100%;
  accent-color: #e87722;
  cursor: pointer;
}

.pos-reset-btn {
  align-self: flex-start;
  font-size: 0.75rem;
  font-weight: 600;
  color: #1e2d5a;
  background: none;
  border: 1px solid var(--vp-c-divider, #cbd5e1);
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.dark .pos-reset-btn {
  color: #93c5fd;
}

.pos-reset-btn:hover:not(:disabled) {
  border-color: #e87722;
  color: #e87722;
}

/* CONTEXT KNOPPEN */
.pos-context-toggle-row,
.pos-presets-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pos-context-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-text-1, #1e293b);
}

.pos-btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.pos-group-btn {
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider, #cbd5e1);
  background-color: var(--vp-c-bg, #ffffff);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--vp-c-text-1, #334155);
  cursor: pointer;
  transition: all 0.15s ease;
}

.pos-group-btn:hover:not(:disabled) {
  border-color: #1e2d5a;
}

.pos-group-btn.is-active {
  background-color: #1e2d5a;
  border-color: #1e2d5a;
  color: #ffffff;
}

.pos-group-btn.is-active code {
  color: #ffffff;
}

.dark .pos-group-btn.is-active {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.pos-context-info-note {
  font-size: 0.78rem;
  padding: 0.45rem 0.65rem;
  border-radius: 4px;
}

.note-ok {
  background-color: rgba(5, 150, 105, 0.08);
  border-left: 3px solid #059669;
  color: #065f46;
}

.dark .note-ok {
  background-color: rgba(5, 150, 105, 0.2);
  color: #6ee7b7;
}

.note-warn {
  background-color: rgba(217, 119, 6, 0.08);
  border-left: 3px solid #d97706;
  color: #92400e;
}

.dark .note-warn {
  background-color: rgba(217, 119, 6, 0.2);
  color: #fcd34d;
}

/* Z-INDEX BEDIENING */
.pos-panel-intro {
  margin: 0;
  font-size: 0.8rem;
  color: var(--vp-c-text-2, #475569);
  line-height: 1.4;
}

.pos-zindex-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.6rem;
}

.pos-z-item {
  border: 1px solid var(--vp-c-divider, #cbd5e1);
  padding: 0.6rem;
  border-radius: 6px;
  background-color: var(--vp-c-bg-soft, #f8fafc);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.pos-z-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
}

.pos-color-badge {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.pos-color-badge.blue {
  background-color: #2563eb;
}

.pos-color-badge.orange {
  background-color: #e87722;
}

.pos-color-badge.green {
  background-color: #059669;
}

.pos-z-input-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.78rem;
}

.pos-number-input {
  width: 55px;
  padding: 0.2rem 0.4rem;
  border: 1px solid var(--vp-c-divider, #cbd5e1);
  border-radius: 4px;
  background-color: var(--vp-c-bg, #ffffff);
  font-size: 0.85rem;
  font-weight: 700;
  text-align: center;
  color: var(--vp-c-text-1, #1e293b);
}

/* STAGE WEERGAVE */
.pos-stage-wrapper {
  background-color: var(--vp-c-bg, #ffffff);
  border: 1px solid var(--vp-c-divider, #e2e8f0);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.pos-stage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.85rem;
  background-color: var(--vp-c-bg-soft, #f8fafc);
  border-bottom: 1px solid var(--vp-c-divider, #e2e8f0);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--vp-c-text-2, #64748b);
}

.pos-stage-legend {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-weight: 600;
  color: #e87722;
}

.legend-ghost {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px dashed #e87722;
  border-radius: 3px;
}

.pos-scroll-hint {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: #059669;
  font-weight: 600;
}

.pos-stage {
  padding: 1.25rem;
  position: relative;
  min-height: 240px;
}

/* FLOW BOXES (VOOR RELATIVE & ABSOLUTE) */
.pos-stage-flow {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
}

.pos-flow-box {
  padding: 0.85rem 1rem;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  background-color: #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.85rem;
  color: #1e293b;
  transition: box-shadow 0.2s ease;
}

.dark .pos-flow-box {
  background-color: #1e293b;
  border-color: #334155;
  color: #f8fafc;
}

.box-sub {
  font-size: 0.75rem;
  color: #64748b;
}

.dark .box-sub {
  color: #94a3b8;
}

.box-target {
  background-color: rgba(232, 119, 34, 0.12);
  border: 2px solid #e87722;
  color: #b45309;
  box-shadow: 0 4px 12px rgba(232, 119, 34, 0.15);
}

.dark .box-target {
  background-color: rgba(232, 119, 34, 0.2);
  border-color: #f97316;
  color: #fdba74;
}

.pos-relative-slot {
  position: relative;
  width: 100%;
}

.pos-ghost-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 2px dashed #e87722;
  border-radius: 6px;
  background-color: rgba(232, 119, 34, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1;
}

.ghost-text {
  font-size: 0.75rem;
  font-weight: 700;
  color: #e87722;
  background-color: var(--vp-c-bg, #ffffff);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

/* ABSOLUTE PREVIEW */
.pos-stage-abs-container {
  position: relative;
  background-color: #f8fafc;
  border: 2px dashed #94a3b8;
  border-radius: 6px;
  margin: 0.5rem;
  padding: 1.5rem 1rem;
}

.dark .pos-stage-abs-container {
  background-color: #0f172a;
  border-color: #475569;
}

.pos-stage-abs-container.has-viewport-context {
  border-color: #ef4444;
}

.pos-parent-box {
  border: 2px solid #1e2d5a;
  border-radius: 6px;
  padding: 1rem;
  position: relative;
  background-color: var(--vp-c-bg, #ffffff);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 200px;
}

.dark .pos-parent-box {
  border-color: #60a5fa;
}

.pos-parent-box.is-relative {
  border-color: #059669;
}

.pos-parent-badge {
  position: absolute;
  top: -12px;
  left: 12px;
  background-color: #1e2d5a;
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.1rem 0.5rem;
  border-radius: 4px;
}

.pos-parent-box.is-relative .pos-parent-badge {
  background-color: #059669;
}

.box-target-abs.is-absolute {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  width: auto;
  min-width: 170px;
}

.has-snapped-up {
  border-color: #059669;
  background-color: rgba(5, 150, 105, 0.05);
}

.box-notice {
  font-size: 0.72rem;
  color: #059669;
  font-weight: 700;
}

/* FIXED EN STICKY MINI BROWSERS */
.pos-stage-fixed-viewport,
.pos-stage-sticky-viewport {
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 260px;
  overflow: hidden;
  position: relative;
}

.pos-mini-browser-bar {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.75rem;
  background-color: #e2e8f0;
  border-bottom: 1px solid #cbd5e1;
}

.dark .pos-mini-browser-bar {
  background-color: #1e293b;
  border-color: #334155;
}

.pos-browser-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.dot-red { background-color: #ef4444; }
.dot-yellow { background-color: #f59e0b; }
.dot-green { background-color: #10b981; }

.pos-browser-url {
  font-size: 0.7rem;
  color: #64748b;
  margin-left: 0.5rem;
  font-family: monospace;
}

.dark .pos-browser-url {
  color: #94a3b8;
}

.pos-viewport-screen {
  position: relative;
  flex: 1;
  overflow: hidden;
  height: 220px;
}

.pos-scroll-area {
  height: 100%;
  overflow-y: auto;
  position: relative;
  padding: 1rem;
  background-color: var(--vp-c-bg, #ffffff);
}

.pos-scroll-area.has-fixed-top-bar {
  padding-top: 48px;
}

.pos-fixed-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: #1e2d5a;
  color: #ffffff;
  padding: 0.6rem 0.85rem;
  font-size: 0.75rem;
  z-index: 20;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.pos-fixed-floating-btn {
  position: absolute;
  bottom: 15px;
  right: 15px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #e87722;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(232, 119, 34, 0.35);
  cursor: pointer;
  z-index: 30;
}

/* STICKY SCROLL AREA & BALK */
.pos-sticky-scroll-area {
  padding: 0;
}

.pos-sticky-intro {
  padding: 1rem 1rem 0.5rem 1rem;
}

.pos-sticky-bar {
  background-color: #e87722;
  color: #ffffff;
  padding: 0.6rem 1rem;
  margin: 0;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  width: 100%;
}

.pos-sticky-body {
  padding: 0.75rem 1rem 2rem 1rem;
}

.pos-page-content h4,
.pos-sticky-intro h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
  color: #1e2d5a;
}

.dark .pos-page-content h4,
.dark .pos-sticky-intro h4 {
  color: #93c5fd;
}

.pos-page-content p,
.pos-sticky-intro p,
.pos-sticky-body p {
  font-size: 0.8rem;
  line-height: 1.45;
  color: var(--vp-c-text-2, #475569);
  margin: 0 0 0.6rem 0;
}

.pos-sticky-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.78rem;
}

.pos-sticky-inner code {
  color: #ffffff;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}

/* Z-INDEX ARENA */
.pos-stage-zindex {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 260px;
}

.pos-z-arena {
  position: relative;
  width: 280px;
  height: 190px;
}

.pos-card-layer {
  position: absolute;
  width: 170px;
  height: 100px;
  border-radius: 8px;
  padding: 0.75rem;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.pos-card-layer:hover {
  transform: scale(1.03);
}

.card-a {
  top: 10px;
  left: 10px;
  background: linear-gradient(135deg, #1d4ed8, #3b82f6);
  border: 1px solid #60a5fa;
}

.card-b {
  top: 45px;
  left: 55px;
  background: linear-gradient(135deg, #c2410c, #ea580c);
  border: 1px solid #fb923c;
}

.card-c {
  top: 80px;
  left: 100px;
  background: linear-gradient(135deg, #065f46, #059669);
  border: 1px solid #34d399;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
}

.card-code {
  font-family: monospace;
  font-size: 0.8rem;
  font-weight: 700;
  background: rgba(0, 0, 0, 0.25);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  align-self: flex-start;
}

.pos-z-note {
  margin-top: 1rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-2, #64748b);
  text-align: center;
}

/* CODE PANEEL (RECHTER KOLOM) */
.pos-code-panel {
  background-color: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.pos-code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #2d2d2d;
  border-bottom: 1px solid #3d3d3d;
}

.pos-code-label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
}

.pos-copy-btn {
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

.pos-copy-btn:hover {
  background-color: #d4641a;
}

.pos-pre {
  margin: 0;
  padding: 1rem;
  background-color: transparent;
  color: #e2e8f0;
  font-family: Consolas, 'Courier New', monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  overflow-x: auto;
  flex: 1;
}

/* RESPONSIVE */
@media (max-width: 860px) {
  .pos-workspace-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .pos-sliders-grid {
    grid-template-columns: 1fr;
  }
}
</style>
