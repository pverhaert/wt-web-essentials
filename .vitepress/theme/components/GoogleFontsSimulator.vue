<template>
  <div class="font-simulator">
    <div class="sim-header">
      <div class="sim-header-title">
        <svg class="sim-title-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="4 7 4 4 20 4 20 7" />
          <line x1="9" y1="20" x2="15" y2="20" />
          <line x1="12" y1="4" x2="12" y2="20" />
        </svg>
        <span class="sim-label">Simulator: Webfonts &amp; Tekstopmaak</span>
      </div>
      <div class="sim-header-badges">
        <span v-if="selectedFontObj.isGoogle" class="sim-badge sim-badge-api">Google Fonts CSS2 API</span>
        <span v-else class="sim-badge sim-badge-sys">Systeem font stack</span>
        <button type="button" class="sim-reset-btn" @click="resetDefaults" title="Standaardwaarden herstellen">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          <span>Herstel</span>
        </button>
      </div>
    </div>

    <!-- Live Preview Venster -->
    <div class="sim-preview-wrap">
      <div class="sim-preview-bar">
        <span class="sim-preview-dot dot-red"></span>
        <span class="sim-preview-dot dot-yellow"></span>
        <span class="sim-preview-dot dot-green"></span>
        <span class="sim-preview-url">preview: Thomas More Campus Geel - {{ selectedFontObj.name }}</span>
      </div>

      <div class="sim-stage">
        <h1 class="sim-rendered-h1" :style="h1Style">
          {{ h1Text }}
        </h1>
        <p class="sim-rendered-p" :style="pStyle">
          {{ pText }}
        </p>
      </div>
    </div>

    <!-- Keuzebalk: Lettertypekeuze & Doel-selector (H1 / P) -->
    <div class="sim-tabs-bar">
      <!-- Keuzelijst lettertype -->
      <div class="sim-font-selector-wrap">
        <label class="sim-selector-label" for="sim-font-select">Actief lettertype:</label>
        <div class="sim-select-custom">
          <select id="sim-font-select" v-model="selectedFontKey" class="sim-font-select">
            <optgroup label="Google Fonts v2 (CSS2 API)">
              <option value="inter">Inter (Variable Font 100..900 + Optical Sizing)</option>
              <option value="roboto">Roboto (Variable Font 100..900)</option>
              <option value="poppins">Poppins (100 tot 900 gewichten)</option>
            </optgroup>
            <optgroup label="Standaard systeemlettertypen">
              <option value="verdana">Verdana, Geneva, sans-serif</option>
              <option value="arial">Arial, Helvetica, sans-serif</option>
              <option value="georgia">Georgia, 'Times New Roman', serif</option>
              <option value="trebuchet">Trebuchet MS, sans-serif</option>
              <option value="consolas">Consolas, 'Courier New', monospace</option>
            </optgroup>
          </select>
        </div>
      </div>

      <!-- Doel-selector: Wisselen tussen H1 en P -->
      <div class="sim-tabs-right">
        <span class="sim-tabs-caption">Pas stijlen aan voor:</span>
        <div class="sim-tabs-nav" role="tablist">
          <button
            type="button"
            role="tab"
            :aria-selected="activeTarget === 'h1'"
            class="sim-tab-btn"
            :class="{ 'is-active': activeTarget === 'h1' }"
            @click="activeTarget = 'h1'"
          >
            <code>&lt;h1&gt;</code> Kop
          </button>
          <button
            type="button"
            role="tab"
            :aria-selected="activeTarget === 'p'"
            class="sim-tab-btn"
            :class="{ 'is-active': activeTarget === 'p' }"
            @click="activeTarget = 'p'"
          >
            <code>&lt;p&gt;</code> Paragraaf
          </button>
        </div>
      </div>
    </div>

    <!-- Informatieve meldingen over font-variant en font-size -->
    <div class="sim-notices-bar">
      <!-- Melding over small-caps bij Google Fonts -->
      <div v-if="selectedFontObj.isGoogle && currentSettings.fontVariant === 'small-caps'" class="sim-notice-pill notice-warning">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>
          <strong>Let op bij small-caps:</strong> Google Fonts levert geoptimaliseerde webfont-bestanden waarin de zeldzame OpenType-tabel voor kleinkapitalen (<code>smcp</code>) is weggelaten om bestandsgrootte te besparen. Bij standaard systeemlettertypen (zoals Georgia of Verdana) werkt <code>small-caps</code> wél direct via de browser.
        </span>
      </div>

      <!-- Melding over font-size & x-hoogte bij systeemlettertypen -->
      <div v-if="!selectedFontObj.isGoogle" class="sim-notice-pill notice-info">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span>
          <strong>Opmerking over font-size en x-hoogte:</strong> Zelfs bij exact dezelfde <code>font-size</code> ogen systeemfonts heel anders. Verdana heeft bijvoorbeeld een zeer grote x-hoogte en brede letters waardoor het merkbaar groter oogt dan Arial of Times New Roman. Ook ondersteunen systeemlettertypen vaak enkel 400 (normaal) en 700 (vet).
        </span>
      </div>
    </div>

    <!-- Bedieningspaneel: Besturingselementen voor geselecteerde tag -->
    <div class="sim-controls-panel">
      <!-- Controls voor H1 -->
      <div v-show="activeTarget === 'h1'" class="sim-controls-grid">
        <!-- font-weight (Traploos variabel) -->
        <div class="sim-control-card control-wide">
          <div class="control-label-row">
            <label class="control-name" for="h1-weight">
              <code>font-weight</code>:
              <span class="control-val">{{ h1Settings.fontWeight }}</span>
              <span class="control-tag">{{ getWeightName(h1Settings.fontWeight) }}</span>
            </label>
            <span class="control-hint">Traploze variabele slider (100 - 900)</span>
          </div>
          <input
            id="h1-weight"
            type="range"
            v-model.number="h1Settings.fontWeight"
            min="100"
            max="900"
            step="10"
            class="sim-slider"
          />
          <div class="slider-ticks">
            <span @click="h1Settings.fontWeight = 300">300 (Light)</span>
            <span @click="h1Settings.fontWeight = 400">400 (Normal)</span>
            <span @click="h1Settings.fontWeight = 600">600 (Semi-Bold)</span>
            <span @click="h1Settings.fontWeight = 700">700 (Bold)</span>
            <span @click="h1Settings.fontWeight = 900">900 (Black)</span>
          </div>
        </div>

        <!-- font-size (rem) -->
        <div class="sim-control-card">
          <div class="control-label-row">
            <label class="control-name" for="h1-size">
              <code>font-size</code>:
              <span class="control-val">{{ h1Settings.fontSize }}rem</span>
              <span class="control-subval">({{ Math.round(h1Settings.fontSize * 16) }}px)</span>
            </label>
          </div>
          <input
            id="h1-size"
            type="range"
            v-model.number="h1Settings.fontSize"
            min="1.25"
            max="3.5"
            step="0.125"
            class="sim-slider"
          />
        </div>

        <!-- line-height -->
        <div class="sim-control-card">
          <div class="control-label-row">
            <label class="control-name" for="h1-lh">
              <code>line-height</code>:
              <span class="control-val">{{ h1Settings.lineHeight }}</span>
            </label>
          </div>
          <input
            id="h1-lh"
            type="range"
            v-model.number="h1Settings.lineHeight"
            min="1.0"
            max="1.8"
            step="0.05"
            class="sim-slider"
          />
        </div>

        <!-- font-style & font-variant -->
        <div class="sim-control-card">
          <span class="control-name">Stijl en Variant</span>
          <div class="sim-btn-group">
            <button
              type="button"
              class="sim-toggle-btn"
              :class="{ 'is-active': h1Settings.fontStyle === 'italic' }"
              @click="h1Settings.fontStyle = h1Settings.fontStyle === 'italic' ? 'normal' : 'italic'"
            >
              <em>font-style: italic</em>
            </button>
            <button
              type="button"
              class="sim-toggle-btn"
              :class="{ 'is-active': h1Settings.fontVariant === 'small-caps' }"
              @click="h1Settings.fontVariant = h1Settings.fontVariant === 'small-caps' ? 'normal' : 'small-caps'"
            >
              <span style="font-variant: small-caps;">font-variant: small-caps</span>
            </button>
          </div>
        </div>

        <!-- text-align -->
        <div class="sim-control-card">
          <span class="control-name"><code>text-align</code></span>
          <div class="sim-btn-group">
            <button
              v-for="align in (['left', 'center', 'right'] as const)"
              :key="align"
              type="button"
              class="sim-toggle-btn"
              :class="{ 'is-active': h1Settings.textAlign === align }"
              @click="h1Settings.textAlign = align"
            >
              {{ align }}
            </button>
          </div>
        </div>

        <!-- text-transform -->
        <div class="sim-control-card">
          <span class="control-name"><code>text-transform</code></span>
          <div class="sim-btn-group">
            <button
              v-for="trans in (['none', 'uppercase', 'capitalize', 'lowercase'] as const)"
              :key="trans"
              type="button"
              class="sim-toggle-btn"
              :class="{ 'is-active': h1Settings.textTransform === trans }"
              @click="h1Settings.textTransform = trans"
            >
              {{ trans }}
            </button>
          </div>
        </div>

        <!-- text-decoration -->
        <div class="sim-control-card">
          <span class="control-name"><code>text-decoration</code></span>
          <div class="sim-btn-group">
            <button
              v-for="dec in (['none', 'underline', 'line-through'] as const)"
              :key="dec"
              type="button"
              class="sim-toggle-btn"
              :class="{ 'is-active': h1Settings.textDecoration === dec }"
              @click="h1Settings.textDecoration = dec"
            >
              {{ dec }}
            </button>
          </div>
        </div>

        <!-- text-shadow schakelaar -->
        <div class="sim-control-card">
          <div class="control-label-row">
            <span class="control-name"><code>text-shadow</code></span>
            <label class="sim-switch">
              <input type="checkbox" v-model="h1Settings.hasShadow" />
              <span class="switch-slider"></span>
            </label>
          </div>
          <p class="control-desc">
            {{ h1Settings.hasShadow ? '2px 2px 4px rgba(0, 0, 0, 0.25)' : 'Geen schaduw (standaard)' }}
          </p>
        </div>

        <!-- font-optical-sizing (v2 specifiek, enkel bij Inter) -->
        <div v-if="selectedFontKey === 'inter'" class="sim-control-card">
          <div class="control-label-row">
            <span class="control-name"><code>font-optical-sizing</code></span>
            <label class="sim-switch">
              <input type="checkbox" v-model="h1Settings.opticalSizing" />
              <span class="switch-slider"></span>
            </label>
          </div>
          <p class="control-desc">
            {{ h1Settings.opticalSizing ? 'auto (browser past lettervormen optimaal aan)' : 'none (uitgeschakeld)' }}
          </p>
        </div>
      </div>

      <!-- Controls voor P -->
      <div v-show="activeTarget === 'p'" class="sim-controls-grid">
        <!-- font-weight (Traploos variabel) -->
        <div class="sim-control-card control-wide">
          <div class="control-label-row">
            <label class="control-name" for="p-weight">
              <code>font-weight</code>:
              <span class="control-val">{{ pSettings.fontWeight }}</span>
              <span class="control-tag">{{ getWeightName(pSettings.fontWeight) }}</span>
            </label>
            <span class="control-hint">Traploze variabele slider (100 - 900)</span>
          </div>
          <input
            id="p-weight"
            type="range"
            v-model.number="pSettings.fontWeight"
            min="100"
            max="900"
            step="10"
            class="sim-slider"
          />
          <div class="slider-ticks">
            <span @click="pSettings.fontWeight = 300">300 (Light)</span>
            <span @click="pSettings.fontWeight = 400">400 (Normal)</span>
            <span @click="pSettings.fontWeight = 500">500 (Medium)</span>
            <span @click="pSettings.fontWeight = 600">600 (Semi-Bold)</span>
            <span @click="pSettings.fontWeight = 700">700 (Bold)</span>
          </div>
        </div>

        <!-- font-size (rem) -->
        <div class="sim-control-card">
          <div class="control-label-row">
            <label class="control-name" for="p-size">
              <code>font-size</code>:
              <span class="control-val">{{ pSettings.fontSize }}rem</span>
              <span class="control-subval">({{ Math.round(pSettings.fontSize * 16) }}px)</span>
            </label>
          </div>
          <input
            id="p-size"
            type="range"
            v-model.number="pSettings.fontSize"
            min="0.8"
            max="1.5"
            step="0.05"
            class="sim-slider"
          />
        </div>

        <!-- line-height -->
        <div class="sim-control-card">
          <div class="control-label-row">
            <label class="control-name" for="p-lh">
              <code>line-height</code>:
              <span class="control-val">{{ pSettings.lineHeight }}</span>
            </label>
          </div>
          <input
            id="p-lh"
            type="range"
            v-model.number="pSettings.lineHeight"
            min="1.1"
            max="2.2"
            step="0.05"
            class="sim-slider"
          />
        </div>

        <!-- font-style & font-variant -->
        <div class="sim-control-card">
          <span class="control-name">Stijl en Variant</span>
          <div class="sim-btn-group">
            <button
              type="button"
              class="sim-toggle-btn"
              :class="{ 'is-active': pSettings.fontStyle === 'italic' }"
              @click="pSettings.fontStyle = pSettings.fontStyle === 'italic' ? 'normal' : 'italic'"
            >
              <em>font-style: italic</em>
            </button>
            <button
              type="button"
              class="sim-toggle-btn"
              :class="{ 'is-active': pSettings.fontVariant === 'small-caps' }"
              @click="pSettings.fontVariant = pSettings.fontVariant === 'small-caps' ? 'normal' : 'small-caps'"
            >
              <span style="font-variant: small-caps;">font-variant: small-caps</span>
            </button>
          </div>
        </div>

        <!-- text-align -->
        <div class="sim-control-card">
          <span class="control-name"><code>text-align</code></span>
          <div class="sim-btn-group">
            <button
              v-for="align in (['left', 'center', 'right', 'justify'] as const)"
              :key="align"
              type="button"
              class="sim-toggle-btn"
              :class="{ 'is-active': pSettings.textAlign === align }"
              @click="pSettings.textAlign = align"
            >
              {{ align }}
            </button>
          </div>
        </div>

        <!-- text-transform -->
        <div class="sim-control-card">
          <span class="control-name"><code>text-transform</code></span>
          <div class="sim-btn-group">
            <button
              v-for="trans in (['none', 'uppercase', 'capitalize', 'lowercase'] as const)"
              :key="trans"
              type="button"
              class="sim-toggle-btn"
              :class="{ 'is-active': pSettings.textTransform === trans }"
              @click="pSettings.textTransform = trans"
            >
              {{ trans }}
            </button>
          </div>
        </div>

        <!-- text-decoration -->
        <div class="sim-control-card">
          <span class="control-name"><code>text-decoration</code></span>
          <div class="sim-btn-group">
            <button
              v-for="dec in (['none', 'underline', 'line-through'] as const)"
              :key="dec"
              type="button"
              class="sim-toggle-btn"
              :class="{ 'is-active': pSettings.textDecoration === dec }"
              @click="pSettings.textDecoration = dec"
            >
              {{ dec }}
            </button>
          </div>
        </div>

        <!-- font-optical-sizing (v2 specifiek, enkel bij Inter) -->
        <div v-if="selectedFontKey === 'inter'" class="sim-control-card">
          <div class="control-label-row">
            <span class="control-name"><code>font-optical-sizing</code></span>
            <label class="sim-switch">
              <input type="checkbox" v-model="pSettings.opticalSizing" />
              <span class="switch-slider"></span>
            </label>
          </div>
          <p class="control-desc">
            {{ pSettings.opticalSizing ? 'auto (actief)' : 'none (inactief)' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Dynamische CSS Code Weergave -->
    <div class="sim-code-panel">
      <div class="sim-code-header">
        <div class="sim-code-title">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          <span>Gegenereerde CSS (alleen behandelde typografie-eigenschappen)</span>
        </div>
        <button
          type="button"
          class="sim-copy-btn"
          :class="{ 'is-copied': copied }"
          @click="copyCss"
        >
          <svg v-if="!copied" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{{ copied ? 'Gekopieerd!' : 'Kopieer CSS' }}</span>
        </button>
      </div>

      <pre class="sim-code-block"><code>{{ generatedCss }}</code></pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'

/* -------------------------------------------------------
   Lettertype Definities
------------------------------------------------------- */
interface FontDef {
  key: string
  name: string
  cssFamily: string
  isGoogle: boolean
}

const FONT_OPTIONS: Record<string, FontDef> = {
  inter: {
    key: 'inter',
    name: 'Inter',
    cssFamily: "'Inter', sans-serif",
    isGoogle: true,
  },
  roboto: {
    key: 'roboto',
    name: 'Roboto',
    cssFamily: "'Roboto', sans-serif",
    isGoogle: true,
  },
  poppins: {
    key: 'poppins',
    name: 'Poppins',
    cssFamily: "'Poppins', sans-serif",
    isGoogle: true,
  },
  verdana: {
    key: 'verdana',
    name: 'Verdana',
    cssFamily: 'Verdana, Geneva, sans-serif',
    isGoogle: false,
  },
  arial: {
    key: 'arial',
    name: 'Arial',
    cssFamily: 'Arial, Helvetica, sans-serif',
    isGoogle: false,
  },
  georgia: {
    key: 'georgia',
    name: 'Georgia',
    cssFamily: "Georgia, 'Times New Roman', serif",
    isGoogle: false,
  },
  trebuchet: {
    key: 'trebuchet',
    name: 'Trebuchet MS',
    cssFamily: "'Trebuchet MS', 'Lucida Sans Unicode', sans-serif",
    isGoogle: false,
  },
  consolas: {
    key: 'consolas',
    name: 'Consolas',
    cssFamily: "Consolas, 'Courier New', monospace",
    isGoogle: false,
  },
}

const selectedFontKey = ref<string>('inter')
const selectedFontObj = computed(() => FONT_OPTIONS[selectedFontKey.value] || FONT_OPTIONS.inter)

/* -------------------------------------------------------
   Google Fonts v2 Font Loader (Inter, Roboto & Poppins)
------------------------------------------------------- */
const GOOGLE_FONTS_URL = 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap'

onMounted(() => {
  const fontId = 'google-fonts-simulator-v2'
  if (!document.getElementById(fontId)) {
    const link = document.createElement('link')
    link.id = fontId
    link.rel = 'stylesheet'
    link.href = GOOGLE_FONTS_URL
    document.head.appendChild(link)
  }
})

/* -------------------------------------------------------
   Toestand & Instellingen
------------------------------------------------------- */
const activeTarget = ref<'h1' | 'p'>('h1')
const copied = ref(false)

const h1Text = ref('Thomas More Campus Geel')
const pText = ref('Welkom bij de opleiding Toegepaste Informatica in de IT Factory. Vergelijk het effect van variabele Google Fonts met klassieke systeemlettertypen. Merk op hoe lettergrootte, x-hoogte en stijl per lettertypefamilie verschillen!')

interface TextSettings {
  fontWeight: number
  fontSize: number
  lineHeight: number
  fontStyle: 'normal' | 'italic'
  fontVariant: 'normal' | 'small-caps'
  textAlign: 'left' | 'center' | 'right' | 'justify'
  textTransform: 'none' | 'uppercase' | 'capitalize' | 'lowercase'
  textDecoration: 'none' | 'underline' | 'line-through'
  hasShadow?: boolean
  opticalSizing: boolean
}

const defaultH1Settings: TextSettings = {
  fontWeight: 700,
  fontSize: 2.0,
  lineHeight: 1.25,
  fontStyle: 'normal',
  fontVariant: 'normal',
  textAlign: 'left',
  textTransform: 'none',
  textDecoration: 'none',
  hasShadow: false,
  opticalSizing: true,
}

const defaultPSettings: TextSettings = {
  fontWeight: 400,
  fontSize: 1.0,
  lineHeight: 1.6,
  fontStyle: 'normal',
  fontVariant: 'normal',
  textAlign: 'left',
  textTransform: 'none',
  textDecoration: 'none',
  opticalSizing: true,
}

const h1Settings = reactive<TextSettings>({ ...defaultH1Settings })
const pSettings = reactive<TextSettings>({ ...defaultPSettings })

const currentSettings = computed(() => (activeTarget.value === 'h1' ? h1Settings : pSettings))

function resetDefaults() {
  selectedFontKey.value = 'inter'
  Object.assign(h1Settings, defaultH1Settings)
  Object.assign(pSettings, defaultPSettings)
  activeTarget.value = 'h1'
}

/* -------------------------------------------------------
   Hulpfuncties
------------------------------------------------------- */
function getWeightName(weight: number): string {
  if (weight <= 150) return 'Thin (100)'
  if (weight <= 250) return 'Extra-Light (200)'
  if (weight <= 350) return 'Light (300)'
  if (weight <= 450) return 'Normal / Regular (400)'
  if (weight <= 550) return 'Medium (500)'
  if (weight <= 650) return 'Semi-Bold (600)'
  if (weight <= 750) return 'Bold (700)'
  if (weight <= 850) return 'Extra-Bold (800)'
  return 'Black (900)'
}

/* -------------------------------------------------------
   Stijlen voor preview
------------------------------------------------------- */
const h1Style = computed(() => ({
  fontFamily: selectedFontObj.value.cssFamily,
  fontWeight: h1Settings.fontWeight,
  fontSize: `${h1Settings.fontSize}rem`,
  lineHeight: h1Settings.lineHeight,
  fontStyle: h1Settings.fontStyle,
  fontVariant: h1Settings.fontVariant,
  textAlign: h1Settings.textAlign,
  textTransform: h1Settings.textTransform,
  textDecoration: h1Settings.textDecoration,
  textShadow: h1Settings.hasShadow ? '2px 2px 4px rgba(0, 0, 0, 0.25)' : 'none',
  fontOpticalSizing: (selectedFontKey.value === 'inter' && h1Settings.opticalSizing) ? 'auto' : 'none',
}))

const pStyle = computed(() => ({
  fontFamily: selectedFontObj.value.cssFamily,
  fontWeight: pSettings.fontWeight,
  fontSize: `${pSettings.fontSize}rem`,
  lineHeight: pSettings.lineHeight,
  fontStyle: pSettings.fontStyle,
  fontVariant: pSettings.fontVariant,
  textAlign: pSettings.textAlign,
  textTransform: pSettings.textTransform,
  textDecoration: pSettings.textDecoration,
  fontOpticalSizing: (selectedFontKey.value === 'inter' && pSettings.opticalSizing) ? 'auto' : 'none',
}))

/* -------------------------------------------------------
   Dynamische CSS Code Generatie
   (bevat enkel bekende eigenschappen uit lettertypen & webfonts)
------------------------------------------------------- */
const generatedCss = computed(() => {
  const lines: string[] = []

  if (selectedFontObj.value.isGoogle) {
    lines.push(`/* 1. Google Fonts CSS2 API inladen */`)
    lines.push(`@import url('${GOOGLE_FONTS_URL}');`)
    lines.push(``)
  } else {
    lines.push(`/* 1. Standaard systeemlettertypen (geen @import nodig) */`)
    lines.push(``)
  }

  lines.push(`/* 2. Styling voor de h1-kop */`)
  lines.push(`h1 {`)
  lines.push(`  font-family: ${selectedFontObj.value.cssFamily};`)
  lines.push(`  font-weight: ${h1Settings.fontWeight};`)
  lines.push(`  font-size: ${h1Settings.fontSize}rem;`)
  lines.push(`  line-height: ${h1Settings.lineHeight};`)

  if (h1Settings.fontStyle !== 'normal') {
    lines.push(`  font-style: ${h1Settings.fontStyle};`)
  }
  if (h1Settings.fontVariant !== 'normal') {
    lines.push(`  font-variant: ${h1Settings.fontVariant};`)
  }
  if (h1Settings.textAlign !== 'left') {
    lines.push(`  text-align: ${h1Settings.textAlign};`)
  }
  if (h1Settings.textTransform !== 'none') {
    lines.push(`  text-transform: ${h1Settings.textTransform};`)
  }
  if (h1Settings.textDecoration !== 'none') {
    lines.push(`  text-decoration: ${h1Settings.textDecoration};`)
  }
  if (h1Settings.hasShadow) {
    lines.push(`  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);`)
  }
  if (selectedFontKey.value === 'inter') {
    if (!h1Settings.opticalSizing) {
      lines.push(`  font-optical-sizing: none;`)
    } else {
      lines.push(`  font-optical-sizing: auto;`)
    }
  }

  lines.push(`}`)
  lines.push(``)
  lines.push(`/* 3. Styling voor de paragraaf */`)
  lines.push(`p {`)
  lines.push(`  font-family: ${selectedFontObj.value.cssFamily};`)
  lines.push(`  font-weight: ${pSettings.fontWeight};`)
  lines.push(`  font-size: ${pSettings.fontSize}rem;`)
  lines.push(`  line-height: ${pSettings.lineHeight};`)

  if (pSettings.fontStyle !== 'normal') {
    lines.push(`  font-style: ${pSettings.fontStyle};`)
  }
  if (pSettings.fontVariant !== 'normal') {
    lines.push(`  font-variant: ${pSettings.fontVariant};`)
  }
  if (pSettings.textAlign !== 'left') {
    lines.push(`  text-align: ${pSettings.textAlign};`)
  }
  if (pSettings.textTransform !== 'none') {
    lines.push(`  text-transform: ${pSettings.textTransform};`)
  }
  if (pSettings.textDecoration !== 'none') {
    lines.push(`  text-decoration: ${pSettings.textDecoration};`)
  }
  if (selectedFontKey.value === 'inter') {
    if (!pSettings.opticalSizing) {
      lines.push(`  font-optical-sizing: none;`)
    } else {
      lines.push(`  font-optical-sizing: auto;`)
    }
  }

  lines.push(`}`)

  return lines.join('\n')
})

function copyCss() {
  navigator.clipboard.writeText(generatedCss.value)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<style scoped>
.font-simulator {
  margin: 2rem 0;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

/* Header */
.sim-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding: 12px 18px;
  background: var(--vp-c-bg-mute);
  border-bottom: 1px solid var(--vp-c-divider);
}

.sim-header-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
}

.sim-title-icon {
  color: #e87722;
}

.sim-header-badges {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sim-badge-api {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 3px 8px;
  border-radius: 6px;
  background: rgba(232, 119, 34, 0.12);
  color: #e87722;
  border: 1px solid rgba(232, 119, 34, 0.3);
}

.sim-reset-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 6px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
  cursor: pointer;
  transition: all 0.2s ease;
}

.sim-reset-btn:hover {
  color: #e87722;
  border-color: #e87722;
}

/* Preview Stage */
.sim-preview-wrap {
  background: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
}

.sim-preview-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: var(--vp-c-bg-mute);
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.sim-preview-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot-red { background-color: #ef4444; }
.dot-yellow { background-color: #f59e0b; }
.dot-green { background-color: #10b981; }

.sim-preview-url {
  margin-left: 8px;
  font-family: var(--vp-font-family-mono);
  opacity: 0.75;
}

.sim-stage {
  padding: 2.2rem 2rem;
  min-height: 200px;
  color: var(--vp-c-text-1);
}

.sim-rendered-h1 {
  color: #1e2d5a;
  margin: 0 0 1rem 0;
  transition: all 0.15s ease-out;
  border: none !important;
  padding: 0 !important;
}

:root.dark .sim-rendered-h1 {
  color: #93c5fd;
}

.sim-rendered-p {
  color: var(--vp-c-text-2);
  margin: 0;
  transition: all 0.15s ease-out;
}

/* Tabs Bar */
.sim-tabs-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px 18px;
  background: var(--vp-c-bg-mute);
  border-bottom: 1px solid var(--vp-c-divider);
}

.sim-tabs-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.sim-tabs-caption {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.sim-tabs-nav {
  display: flex;
  background: var(--vp-c-bg);
  padding: 3px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  gap: 2px;
}

.sim-tab-btn {
  padding: 5px 14px;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s ease;
}

.sim-tab-btn code {
  font-size: 0.85em;
}

.sim-tab-btn.is-active {
  background: #e87722;
  color: #ffffff;
  box-shadow: 0 2px 6px rgba(232, 119, 34, 0.3);
}

.sim-tab-btn.is-active code {
  color: #ffffff;
}

.sim-badge-sys {
  background: rgba(2, 132, 199, 0.12);
  color: #0284c7;
  border: 1px solid rgba(2, 132, 199, 0.3);
}

.sim-font-selector-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.sim-selector-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.sim-select-custom {
  position: relative;
}

.sim-font-select {
  padding: 6px 14px;
  font-size: 0.86rem;
  font-weight: 600;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  cursor: pointer;
  outline: none;
  transition: border-color 0.2s;
}

.sim-font-select:hover,
.sim-font-select:focus {
  border-color: #e87722;
}

.sim-tabs-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

/* Notices Bar */
.sim-notices-bar {
  padding: 12px 18px 0 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sim-notice-pill {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.8rem;
  line-height: 1.45;
  padding: 8px 12px;
  border-radius: 8px;
}

.notice-warning {
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #b45309;
}

:root.dark .notice-warning {
  color: #fcd34d;
  background: rgba(245, 158, 11, 0.16);
}

.notice-info {
  background: rgba(2, 132, 199, 0.1);
  border: 1px solid rgba(2, 132, 199, 0.25);
  color: #0369a1;
}

:root.dark .notice-info {
  color: #7dd3fc;
  background: rgba(2, 132, 199, 0.16);
}

/* Controls Panel */
.sim-controls-panel {
  padding: 18px;
  background: var(--vp-c-bg-soft);
}

.sim-controls-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 14px;
}

.control-wide {
  grid-column: 1 / -1;
}

.sim-control-card {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.control-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.control-val {
  color: #e87722;
  font-family: var(--vp-font-family-mono);
  font-weight: 700;
  margin-left: 4px;
}

.control-subval {
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
  margin-left: 4px;
}

.control-tag {
  font-size: 0.72rem;
  font-weight: 600;
  background: rgba(232, 119, 34, 0.12);
  color: #e87722;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 6px;
}

.control-hint {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.control-desc {
  font-size: 0.76rem;
  color: var(--vp-c-text-3);
  margin: 0;
}

/* Sliders */
.sim-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background: var(--vp-c-divider);
  border-radius: 4px;
  outline: none;
  cursor: pointer;
}

.sim-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #e87722;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(232, 119, 34, 0.4);
  transition: transform 0.1s ease;
}

.sim-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}

.sim-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #e87722;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(232, 119, 34, 0.4);
}

.slider-ticks {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
  padding-top: 4px;
}

.slider-ticks span {
  cursor: pointer;
  transition: color 0.15s;
}

.slider-ticks span:hover {
  color: #e87722;
}

/* Button groups */
.sim-btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.sim-toggle-btn {
  font-size: 0.78rem;
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-mute);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.15s ease;
}

.sim-toggle-btn:hover {
  border-color: #e87722;
  color: #e87722;
}

.sim-toggle-btn.is-active {
  background: #e87722;
  color: #ffffff;
  border-color: #e87722;
  font-weight: 600;
}

/* Switches */
.sim-switch {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 20px;
}

.sim-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--vp-c-divider);
  transition: .3s;
  border-radius: 20px;
}

.switch-slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .3s;
  border-radius: 50%;
}

input:checked + .switch-slider {
  background-color: #e87722;
}

input:checked + .switch-slider:before {
  transform: translateX(18px);
}

/* CSS Code Panel */
.sim-code-panel {
  background: #1e1e1e;
  border-top: 1px solid var(--vp-c-divider);
}

.sim-code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #252526;
  border-bottom: 1px solid #333333;
  color: #d4d4d4;
  font-size: 0.8rem;
}

.sim-code-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.sim-copy-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 4px;
  background: #333333;
  color: #e0e0e0;
  border: 1px solid #444444;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sim-copy-btn:hover {
  background: #444444;
  color: #ffffff;
}

.sim-copy-btn.is-copied {
  background: #059669;
  border-color: #059669;
  color: #ffffff;
}

.sim-code-block {
  margin: 0;
  padding: 16px;
  background: #1e1e1e;
  color: #9cdcfe;
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  line-height: 1.5;
  overflow-x: auto;
  white-space: pre;
}

.sim-code-block code {
  color: inherit;
  background: transparent !important;
  padding: 0 !important;
}

@media (max-width: 720px) {
  .sim-stage {
    padding: 1.5rem 1rem;
  }
  .sim-tabs-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .sim-font-selector-wrap,
  .sim-tabs-right {
    justify-content: space-between;
    width: 100%;
  }
}
</style>
