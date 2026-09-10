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
      <span class="cc-badge">Live Notaties &amp; Invoer</span>
    </div>

    <div class="cc-body">
      <!-- Bovenste rij: Kleurstaal, native picker en alfakiezer -->
      <div class="cc-controls-row">
        <!-- Kleurstaal met native picker trigger -->
        <label class="cc-preview-card" title="Klik om een kleur te kiezen via de kiezer">
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
                :title="preset.name + ' (' + preset.hex + ')'"
                @click="applyPreset(preset.hex)"
              >
                <span class="cc-preset-dot" :style="{ backgroundColor: preset.hex }"></span>
                <span class="cc-preset-name">{{ preset.name }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Hint voor studenten over invulbaarheid -->
      <div class="cc-input-hint">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span>Tip: Alle onderstaande velden zijn direct bewerkbaar. Typ of plak een waarde in een willekeurig formaat om de omzetter bij te werken.</span>
      </div>

      <!-- Overzichtstabel met alle CSS-kleurnotaties in één oogopslag -->
      <div class="cc-formats-grid">
        <div
          v-for="format in formatRows"
          :key="format.id"
          class="cc-format-card"
          :class="{ 'has-error': inputErrors[format.id] }"
        >
          <div class="cc-format-header">
            <span class="cc-format-badge">{{ format.label }}</span>
            <span v-if="format.sublabel" class="cc-format-sublabel">{{ format.sublabel }}</span>
          </div>
          <div class="cc-format-code-row">
            <input
              type="text"
              class="cc-format-input"
              :class="{ 'is-invalid': inputErrors[format.id] }"
              :value="rawInputs[format.id] !== undefined ? rawInputs[format.id] : format.value"
              :placeholder="format.placeholder"
              :aria-label="format.label"
              spellcheck="false"
              @input="onFieldInput(format.id, ($event.target as HTMLInputElement).value)"
              @focus="onFieldFocus(format.id)"
              @blur="onFieldBlur(format.id)"
              @keydown.enter="($event.target as HTMLInputElement).blur()"
            />
            <button
              type="button"
              class="cc-copy-btn"
              :class="{ 'is-copied': copiedKey === format.id, 'is-disabled': !format.value }"
              :disabled="!format.value"
              :title="!format.value ? 'Geen waarde beschikbaar om te kopiëren' : copiedKey === format.id ? 'Gekopieerd!' : 'Kopieer naar klembord'"
              @click="format.value ? copyValue(format.value, format.id) : null"
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
          <div v-if="inputErrors[format.id]" class="cc-format-error-msg">
            {{ inputErrors[format.id] }}
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
          <span class="cc-contrast-title">WCAG Toegankelijkheid & Contrastcontrole (WCAG 2.1)</span>
        </div>
        <div class="cc-contrast-grid">
          <!-- Eerste contrastkaart (standaard wit) -->
          <div class="cc-contrast-box cc-contrast-box-white">
            <div class="cc-sample-text-wrap" :style="{ backgroundColor: bgWhite }">
              <span class="cc-sample-large" :style="{ color: currentRgbaCss }">Grote koptekst</span>
              <span class="cc-sample-normal" :style="{ color: currentRgbaCss }">Aa Normale leestekst (16px)</span>
            </div>
            <div class="cc-contrast-metrics">
              <div class="cc-contrast-label-wrap">
                <label class="cc-bg-picker-label" title="Klik om de achtergrondkleur te wijzigen">
                  <input
                    type="color"
                    v-model="bgWhite"
                    class="cc-bg-native-picker"
                    aria-label="Kies achtergrondkleur voor voorbeeld 1"
                  />
                  <span class="cc-bg-swatch" :style="{ backgroundColor: bgWhite }"></span>
                </label>
                <span class="cc-contrast-label">Achtergrond ({{ bgWhite.toLowerCase() }}):</span>
              </div>
              <span class="cc-contrast-ratio">{{ contrastWhite.ratio.toFixed(2) }}:1</span>
            </div>
            <div class="cc-contrast-eval-rows">
              <div class="cc-eval-row">
                <span class="cc-eval-label">Normale leestekst:</span>
                <span
                  class="cc-status-pill"
                  :class="contrastWhite.passNormalAA ? 'is-pass' : 'is-fail'"
                >
                  {{ contrastWhite.passNormalAA ? 'Voldoet (AA ≥ 4.5:1)' : 'Onvoldoende (< 4.5:1)' }}
                </span>
              </div>
              <div class="cc-eval-row">
                <span class="cc-eval-label">Grote tekst / knoppen:</span>
                <span
                  class="cc-status-pill"
                  :class="contrastWhite.passLargeAA ? 'is-pass' : 'is-fail'"
                >
                  {{ contrastWhite.passLargeAA ? 'Voldoet (AA ≥ 3.0:1)' : 'Onvoldoende (< 3.0:1)' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Tweede contrastkaart (standaard donkerblauw) -->
          <div class="cc-contrast-box cc-contrast-box-dark">
            <div class="cc-sample-text-wrap" :style="{ backgroundColor: bgDark }">
              <span class="cc-sample-large" :style="{ color: currentRgbaCss }">Grote koptekst</span>
              <span class="cc-sample-normal" :style="{ color: currentRgbaCss }">Aa Normale leestekst (16px)</span>
            </div>
            <div class="cc-contrast-metrics">
              <div class="cc-contrast-label-wrap">
                <label class="cc-bg-picker-label" title="Klik om de achtergrondkleur te wijzigen">
                  <input
                    type="color"
                    v-model="bgDark"
                    class="cc-bg-native-picker"
                    aria-label="Kies achtergrondkleur voor voorbeeld 2"
                  />
                  <span class="cc-bg-swatch" :style="{ backgroundColor: bgDark }"></span>
                </label>
                <span class="cc-contrast-label">Achtergrond ({{ bgDark.toLowerCase() }}):</span>
              </div>
              <span class="cc-contrast-ratio">{{ contrastDark.ratio.toFixed(2) }}:1</span>
            </div>
            <div class="cc-contrast-eval-rows">
              <div class="cc-eval-row">
                <span class="cc-eval-label">Normale leestekst:</span>
                <span
                  class="cc-status-pill"
                  :class="contrastDark.passNormalAA ? 'is-pass' : 'is-fail'"
                >
                  {{ contrastDark.passNormalAA ? 'Voldoet (AA ≥ 4.5:1)' : 'Onvoldoende (< 4.5:1)' }}
                </span>
              </div>
              <div class="cc-eval-row">
                <span class="cc-eval-label">Grote tekst / knoppen:</span>
                <span
                  class="cc-status-pill"
                  :class="contrastDark.passLargeAA ? 'is-pass' : 'is-fail'"
                >
                  {{ contrastDark.passLargeAA ? 'Voldoet (AA ≥ 3.0:1)' : 'Onvoldoende (< 3.0:1)' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Uitleg bij onvoldoende contrast -->
        <div v-if="!contrastWhite.passNormalAA && contrastWhite.passLargeAA" class="cc-contrast-guidance">
          <p class="cc-guidance-text">
            <strong>Let op:</strong> Een contrastverhouding tussen 3.0:1 en 4.5:1 voldoet volgens WCAG AA enkel voor grote tekst (vanaf 24px of 18.5px vetgedrukt) of grafische interface-elementen, maar is onvoldoende voor gewone leestekst.
          </p>
        </div>
        <div v-else-if="!contrastWhite.passLargeAA" class="cc-contrast-guidance is-alert">
          <p class="cc-guidance-text">
            <strong>Let op:</strong> Dit contrast is lager dan 3.0:1 en voldoet op een witte achtergrond niet aan de WCAG AA norm voor tekst. Kies een donkerdere variant voor voldoende leesbaarheid.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

const props = defineProps<{
  title?: string
  initialHex?: string
  initialAlpha?: number
}>()

const hexValue = ref(props.initialHex || '#EC6639')
const alphaValue = ref(props.initialAlpha !== undefined ? props.initialAlpha : 1)
const copiedKey = ref<string | null>(null)

// Achtergrondkleuren voor de twee WCAG-contrastvoorbeelden
const bgWhite = ref('#ffffff')
const bgDark = ref('#1e2d5a')

// Bewaar tijdelijke invoerwaarden en eventuele foutmeldingen per veld
const rawInputs = reactive<Record<string, string | undefined>>({})
const inputErrors = reactive<Record<string, string | null>>({})

// Thomas More & web standaardkleuren
const presets = [
  { name: 'TM Oranje', hex: '#EC6639' },
  { name: 'TM Donkerblauw', hex: '#1e2d5a' },
  { name: 'Leisteen', hex: '#64748b' },
  { name: 'Smaragdgroen', hex: '#10b981' },
  { name: 'Robijnrood', hex: '#ef4444' },
  { name: 'Goudgeel', hex: '#f59e0b' },
  { name: 'Helderwit', hex: '#ffffff' },
  { name: 'Diepzwart', hex: '#0f172a' },
]

const applyPreset = (hex: string) => {
  hexValue.value = hex
  clearAllErrors()
}

// 148 W3C CSS kleurnamen mapping
const namedColorsToHex: Record<string, string> = {
  "aliceblue": "#f0f8ff",
  "antiquewhite": "#faebd7",
  "aqua": "#00ffff",
  "aquamarine": "#7fffd4",
  "azure": "#f0ffff",
  "beige": "#f5f5dc",
  "bisque": "#ffe4c4",
  "black": "#000000",
  "blanchedalmond": "#ffebcd",
  "blue": "#0000ff",
  "blueviolet": "#8a2be2",
  "brown": "#a52a2a",
  "burlywood": "#deb887",
  "cadetblue": "#5f9ea0",
  "chartreuse": "#7fff00",
  "chocolate": "#d2691e",
  "coral": "#ff7f50",
  "cornflowerblue": "#6495ed",
  "cornsilk": "#fff8dc",
  "crimson": "#dc143c",
  "cyan": "#00ffff",
  "darkblue": "#00008b",
  "darkcyan": "#008b8b",
  "darkgoldenrod": "#b8860b",
  "darkgray": "#a9a9a9",
  "darkgreen": "#006400",
  "darkgrey": "#a9a9a9",
  "darkkhaki": "#bdb76b",
  "darkmagenta": "#8b008b",
  "darkolivegreen": "#556b2f",
  "darkorange": "#ff8c00",
  "darkorchid": "#9932cc",
  "darkred": "#8b0000",
  "darksalmon": "#e9967a",
  "darkseagreen": "#8fbc8f",
  "darkslateblue": "#483d8b",
  "darkslategray": "#2f4f4f",
  "darkslategrey": "#2f4f4f",
  "darkturquoise": "#00ced1",
  "darkviolet": "#9400d3",
  "deeppink": "#ff1493",
  "deepskyblue": "#00bfff",
  "dimgray": "#696969",
  "dimgrey": "#696969",
  "dodgerblue": "#1e90ff",
  "firebrick": "#b22222",
  "floralwhite": "#fffaf0",
  "forestgreen": "#228b22",
  "fuchsia": "#ff00ff",
  "gainsboro": "#dcdcdc",
  "ghostwhite": "#f8f8ff",
  "gold": "#ffd700",
  "goldenrod": "#daa520",
  "gray": "#808080",
  "green": "#008000",
  "greenyellow": "#adff2f",
  "grey": "#808080",
  "honeydew": "#f0fff0",
  "hotpink": "#ff69b4",
  "indianred": "#cd5c5c",
  "indigo": "#4b0082",
  "ivory": "#fffff0",
  "khaki": "#f0e68c",
  "lavender": "#e6e6fa",
  "lavenderblush": "#fff0f5",
  "lawngreen": "#7cfc00",
  "lemonchiffon": "#fffacd",
  "lightblue": "#add8e6",
  "lightcoral": "#f08080",
  "lightcyan": "#e0ffff",
  "lightgoldenrodyellow": "#fafad2",
  "lightgray": "#d3d3d3",
  "lightgreen": "#90ee90",
  "lightgrey": "#d3d3d3",
  "lightpink": "#ffb6c1",
  "lightsalmon": "#ffa07a",
  "lightseagreen": "#20b2aa",
  "lightskyblue": "#87cefa",
  "lightslategray": "#778899",
  "lightslategrey": "#778899",
  "lightsteelblue": "#b0c4de",
  "lightyellow": "#ffffe0",
  "lime": "#00ff00",
  "limegreen": "#32cd32",
  "linen": "#faf0e6",
  "magenta": "#ff00ff",
  "maroon": "#800000",
  "mediumaquamarine": "#66cdaa",
  "mediumblue": "#0000cd",
  "mediumorchid": "#ba55d3",
  "mediumpurple": "#9370db",
  "mediumseagreen": "#3cb371",
  "mediumslateblue": "#7b68ee",
  "mediumspringgreen": "#00fa9a",
  "mediumturquoise": "#48d1cc",
  "mediumvioletred": "#c71585",
  "midnightblue": "#191970",
  "mintcream": "#f5fffa",
  "mistyrose": "#ffe4e1",
  "moccasin": "#ffe4b5",
  "navajowhite": "#ffdead",
  "navy": "#000080",
  "oldlace": "#fdf5e6",
  "olive": "#808000",
  "olivedrab": "#6b8e23",
  "orange": "#ffa500",
  "orangered": "#ff4500",
  "orchid": "#da70d6",
  "palegoldenrod": "#eee8aa",
  "palegreen": "#98fb98",
  "paleturquoise": "#afeeee",
  "palevioletred": "#db7093",
  "papayawhip": "#ffefd5",
  "peachpuff": "#ffdab9",
  "peru": "#cd853f",
  "pink": "#ffc0cb",
  "plum": "#dda0dd",
  "powderblue": "#b0e0e6",
  "purple": "#800080",
  "rebeccapurple": "#663399",
  "red": "#ff0000",
  "rosybrown": "#bc8f8f",
  "royalblue": "#4169e1",
  "saddlebrown": "#8b4513",
  "salmon": "#fa8072",
  "sandybrown": "#f4a460",
  "seagreen": "#2e8b57",
  "seashell": "#fff5ee",
  "sienna": "#a0522d",
  "silver": "#c0c0c0",
  "skyblue": "#87ceeb",
  "slateblue": "#6a5acd",
  "slategray": "#708090",
  "slategrey": "#708090",
  "snow": "#fffafa",
  "springgreen": "#00ff7f",
  "steelblue": "#4682b4",
  "tan": "#d2b48c",
  "teal": "#008080",
  "thistle": "#d8bfd8",
  "tomato": "#ff6347",
  "turquoise": "#40e0d0",
  "violet": "#ee82ee",
  "wheat": "#f5deb3",
  "white": "#ffffff",
  "whitesmoke": "#f5f5f5",
  "yellow": "#ffff00",
  "yellowgreen": "#9acd32"
}

// Reverse lookup van Hex naar CSS kleurnaam
const hexToNamedColors: Record<string, string> = {
  "#f0f8ff": "aliceblue",
  "#faebd7": "antiquewhite",
  "#00ffff": "aqua / cyan",
  "#7fffd4": "aquamarine",
  "#f0ffff": "azure",
  "#f5f5dc": "beige",
  "#ffe4c4": "bisque",
  "#000000": "black",
  "#ffebcd": "blanchedalmond",
  "#0000ff": "blue",
  "#8a2be2": "blueviolet",
  "#a52a2a": "brown",
  "#deb887": "burlywood",
  "#5f9ea0": "cadetblue",
  "#7fff00": "chartreuse",
  "#d2691e": "chocolate",
  "#ff7f50": "coral",
  "#6495ed": "cornflowerblue",
  "#fff8dc": "cornsilk",
  "#dc143c": "crimson",
  "#00008b": "darkblue",
  "#008b8b": "darkcyan",
  "#b8860b": "darkgoldenrod",
  "#a9a9a9": "darkgray / darkgrey",
  "#006400": "darkgreen",
  "#bdb76b": "darkkhaki",
  "#8b008b": "darkmagenta",
  "#556b2f": "darkolivegreen",
  "#ff8c00": "darkorange",
  "#9932cc": "darkorchid",
  "#8b0000": "darkred",
  "#e9967a": "darksalmon",
  "#8fbc8f": "darkseagreen",
  "#483d8b": "darkslateblue",
  "#2f4f4f": "darkslategray / darkslategrey",
  "#00ced1": "darkturquoise",
  "#9400d3": "darkviolet",
  "#ff1493": "deeppink",
  "#00bfff": "deepskyblue",
  "#696969": "dimgray / dimgrey",
  "#1e90ff": "dodgerblue",
  "#b22222": "firebrick",
  "#fffaf0": "floralwhite",
  "#228b22": "forestgreen",
  "#ff00ff": "fuchsia / magenta",
  "#dcdcdc": "gainsboro",
  "#f8f8ff": "ghostwhite",
  "#ffd700": "gold",
  "#daa520": "goldenrod",
  "#808080": "gray / grey",
  "#008000": "green",
  "#adff2f": "greenyellow",
  "#f0fff0": "honeydew",
  "#ff69b4": "hotpink",
  "#cd5c5c": "indianred",
  "#4b0082": "indigo",
  "#fffff0": "ivory",
  "#f0e68c": "khaki",
  "#e6e6fa": "lavender",
  "#fff0f5": "lavenderblush",
  "#7cfc00": "lawngreen",
  "#fffacd": "lemonchiffon",
  "#add8e6": "lightblue",
  "#f08080": "lightcoral",
  "#e0ffff": "lightcyan",
  "#fafad2": "lightgoldenrodyellow",
  "#d3d3d3": "lightgray / lightgrey",
  "#90ee90": "lightgreen",
  "#ffb6c1": "lightpink",
  "#ffa07a": "lightsalmon",
  "#20b2aa": "lightseagreen",
  "#87cefa": "lightskyblue",
  "#778899": "lightslategray / lightslategrey",
  "#b0c4de": "lightsteelblue",
  "#ffffe0": "lightyellow",
  "#00ff00": "lime",
  "#32cd32": "limegreen",
  "#faf0e6": "linen",
  "#800000": "maroon",
  "#66cdaa": "mediumaquamarine",
  "#0000cd": "mediumblue",
  "#ba55d3": "mediumorchid",
  "#9370db": "mediumpurple",
  "#3cb371": "mediumseagreen",
  "#7b68ee": "mediumslateblue",
  "#00fa9a": "mediumspringgreen",
  "#48d1cc": "mediumturquoise",
  "#c71585": "mediumvioletred",
  "#191970": "midnightblue",
  "#f5fffa": "mintcream",
  "#ffe4e1": "mistyrose",
  "#ffe4b5": "moccasin",
  "#ffdead": "navajowhite",
  "#000080": "navy",
  "#fdf5e6": "oldlace",
  "#808000": "olive",
  "#6b8e23": "olivedrab",
  "#ffa500": "orange",
  "#ff4500": "orangered",
  "#da70d6": "orchid",
  "#eee8aa": "palegoldenrod",
  "#98fb98": "palegreen",
  "#afeeee": "paleturquoise",
  "#db7093": "palevioletred",
  "#ffefd5": "papayawhip",
  "#ffdab9": "peachpuff",
  "#cd853f": "peru",
  "#ffc0cb": "pink",
  "#dda0dd": "plum",
  "#b0e0e6": "powderblue",
  "#800080": "purple",
  "#663399": "rebeccapurple",
  "#ff0000": "red",
  "#bc8f8f": "rosybrown",
  "#4169e1": "royalblue",
  "#8b4513": "saddlebrown",
  "#fa8072": "salmon",
  "#f4a460": "sandybrown",
  "#2e8b57": "seagreen",
  "#fff5ee": "seashell",
  "#a0522d": "sienna",
  "#c0c0c0": "silver",
  "#87ceeb": "skyblue",
  "#6a5acd": "slateblue",
  "#708090": "slategray / slategrey",
  "#fffafa": "snow",
  "#00ff7f": "springgreen",
  "#4682b4": "steelblue",
  "#d2b48c": "tan",
  "#008080": "teal",
  "#d8bfd8": "thistle",
  "#ff6347": "tomato",
  "#40e0d0": "turquoise",
  "#ee82ee": "violet",
  "#f5deb3": "wheat",
  "#ffffff": "white",
  "#f5f5f5": "whitesmoke",
  "#ffff00": "yellow",
  "#9acd32": "yellowgreen",
  "#ec6639": "Thomas More oranje (geen CSS-naam)",
  "#1e2d5a": "Thomas More blauw (geen CSS-naam)"
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

// Zoek de benoemde CSS kleur op
const cssColorName = computed(() => {
  const cleanHex = hexValue.value.toLowerCase()
  if (hexToNamedColors[cleanHex]) return hexToNamedColors[cleanHex]
  return ''
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
  const oklch = oklchValues.value
  const a = alphaValue.value
  const aPct = Math.round(a * 100)

  return [
    {
      id: 'hex',
      label: 'HEX (6 of 8 tekens)',
      sublabel: a < 1 ? 'met 2 alfa-tekens' : 'klassiek',
      value: a < 1 ? hex8Value.value : hexValue.value.toUpperCase(),
      placeholder: '#EC6639 of #EC6639ff',
    },
    {
      id: 'rgb-classic',
      label: a < 1 ? 'RGBA (klassiek)' : 'RGB (klassiek)',
      sublabel: 'komma-gescheiden',
      value: a < 1 ? `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})` : `rgb(${r}, ${g}, ${b})`,
      placeholder: 'rgb(236, 102, 57) of rgba(...)',
    },
    {
      id: 'rgb-modern',
      label: 'RGB (modern Level 4)',
      sublabel: 'spatiesyntax met /',
      value: a < 1 ? `rgb(${r} ${g} ${b} / ${aPct}%)` : `rgb(${r} ${g} ${b})`,
      placeholder: 'rgb(236 102 57) of rgb(236 102 57 / 80%)',
    },
    {
      id: 'hsl',
      label: 'HSL (kleurtoon & verzadiging)',
      sublabel: 'intuïtief aanpasbaar',
      value: a < 1 ? `hsl(${h} ${s}% ${l}% / ${aPct}%)` : `hsl(${h}, ${s}%, ${l}%)`,
      placeholder: 'hsl(15, 82%, 57%) of hsl(15 82% 57%)',
    },
    {
      id: 'oklch',
      label: 'OKLCH (modern & perceptueel)',
      sublabel: 'uniforme helderheid',
      value: a < 1 ? `oklch(${oklch.l}% ${oklch.c} ${oklch.h}deg / ${aPct}%)` : `oklch(${oklch.l}% ${oklch.c} ${oklch.h}deg)`,
      placeholder: 'oklch(65% 0.17 48deg)',
    },
    {
      id: 'name',
      label: 'Benoemde CSS-kleur',
      sublabel: 'standaard webkleurnaam',
      value: cssColorName.value,
      placeholder: cssColorName.value ? 'bv. tomato, bisque, coral...' : 'Geen directe CSS-naam',
    },
  ]
})

// Hulpfunctie: parseer alfa-waarde (kan '0.5' of '50%' zijn)
const parseAlphaString = (alphaStr: string): number => {
  const trimmed = alphaStr.trim()
  if (trimmed.endsWith('%')) {
    const p = parseFloat(trimmed.slice(0, -1))
    return Math.max(0, Math.min(1, p / 100))
  }
  const v = parseFloat(trimmed)
  return isNaN(v) ? 1 : Math.max(0, Math.min(1, v))
}

// Hulpfunctie: HSL naar RGB omzetten
const hslToRgb = (h: number, s: number, l: number) => {
  h = ((h % 360) + 360) % 360
  s = Math.max(0, Math.min(100, s)) / 100
  l = Math.max(0, Math.min(100, l)) / 100

  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r_ = 0, g_ = 0, b_ = 0

  if (0 <= h && h < 60) {
    r_ = c; g_ = x; b_ = 0
  } else if (60 <= h && h < 120) {
    r_ = x; g_ = c; b_ = 0
  } else if (120 <= h && h < 180) {
    r_ = 0; g_ = c; b_ = x
  } else if (180 <= h && h < 240) {
    r_ = 0; g_ = x; b_ = c
  } else if (240 <= h && h < 300) {
    r_ = x; g_ = 0; b_ = c
  } else if (300 <= h && h < 360) {
    r_ = c; g_ = 0; b_ = x
  }

  return {
    r: Math.round((r_ + m) * 255),
    g: Math.round((g_ + m) * 255),
    b: Math.round((b_ + m) * 255)
  }
}


// Hulpfunctie: RGB naar 6-karakter hex (#rrggbb)
const rgbToHex = (r: number, g: number, b: number) => {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0')
  return '#' + toHex(r) + toHex(g) + toHex(b)
}

// Kleurinvoer parser die verschillende formats herkent
const parseColorInput = (formatId: string, val: string): { hex: string; alpha?: number } | null => {
  const str = val.trim()
  if (!str) return null

  // 1. HEX formaat
  const hexMatch = str.match(/^#?([0-9a-fA-F]{3,8})$/)
  if (hexMatch) {
    const raw = hexMatch[1]
    if (raw.length === 3) {
      const full = raw.split('').map((c) => c + c).join('')
      return { hex: '#' + full.toLowerCase() }
    } else if (raw.length === 4) {
      const full = raw.slice(0, 3).split('').map((c) => c + c).join('')
      const aHex = raw[3] + raw[3]
      const a = parseInt(aHex, 16) / 255
      return { hex: '#' + full.toLowerCase(), alpha: a }
    } else if (raw.length === 6) {
      return { hex: '#' + raw.toLowerCase() }
    } else if (raw.length === 8) {
      const base = raw.substring(0, 6)
      const aHex = raw.substring(6, 8)
      const a = parseInt(aHex, 16) / 255
      return { hex: '#' + base.toLowerCase(), alpha: a }
    }
  }

  // 2. RGB / RGBA formaat (komma- of spatiesyntax)
  const rgbFuncMatch = str.match(/^rgba?\((.*)\)$/i)
  if (rgbFuncMatch) {
    const inner = rgbFuncMatch[1].trim()
    let parts: string[] = []
    let alphaPart: string | null = null

    if (inner.includes('/')) {
      const [left, right] = inner.split('/')
      alphaPart = right.trim()
      parts = left.trim().split(/\s+|,/).filter(Boolean)
    } else if (inner.includes(',')) {
      parts = inner.split(',').map((p) => p.trim())
      if (parts.length >= 4) {
        alphaPart = parts[3]
      }
    } else {
      parts = inner.split(/\s+/).filter(Boolean)
    }

    if (parts.length >= 3) {
      const r = parseFloat(parts[0])
      const g = parseFloat(parts[1])
      const b = parseFloat(parts[2])
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        const hex = rgbToHex(r, g, b)
        let a = alphaValue.value
        if (alphaPart !== null) {
          a = parseAlphaString(alphaPart)
        }
        return { hex, alpha: alphaPart !== null ? a : undefined }
      }
    }
  }

  // 3. HSL / HSLA formaat (komma- of spatiesyntax)
  const hslFuncMatch = str.match(/^hsla?\((.*)\)$/i)
  if (hslFuncMatch) {
    const inner = hslFuncMatch[1].trim()
    let parts: string[] = []
    let alphaPart: string | null = null

    if (inner.includes('/')) {
      const [left, right] = inner.split('/')
      alphaPart = right.trim()
      parts = left.trim().split(/\s+|,/).filter(Boolean)
    } else if (inner.includes(',')) {
      parts = inner.split(',').map((p) => p.trim())
      if (parts.length >= 4) alphaPart = parts[3]
    } else {
      parts = inner.split(/\s+/).filter(Boolean)
    }

    if (parts.length >= 3) {
      const h = parseFloat(parts[0].replace(/deg$/, ''))
      const s = parseFloat(parts[1].replace(/%$/, ''))
      const l = parseFloat(parts[2].replace(/%$/, ''))
      if (!isNaN(h) && !isNaN(s) && !isNaN(l)) {
        const rgb = hslToRgb(h, s, l)
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b)
        let a = alphaValue.value
        if (alphaPart !== null) a = parseAlphaString(alphaPart)
        return { hex, alpha: alphaPart !== null ? a : undefined }
      }
    }
  }


  // 5. Benoemde W3C kleurnaam (zoals bisque, tomato, steelblue)
  const cleanName = str.toLowerCase().replace(/[^a-z]/g, '')
  if (namedColorsToHex[cleanName]) {
    return { hex: namedColorsToHex[cleanName] }
  }

  // 6. Thomas More aliassen
  if (cleanName.includes('oranje') || cleanName.includes('thomasmore')) {
    return { hex: '#EC6639' }
  }
  if (cleanName.includes('marine') || cleanName.includes('blauw')) {
    return { hex: '#1e2d5a' }
  }

  return null
}

const onFieldInput = (formatId: string, val: string) => {
  rawInputs[formatId] = val
  const parsed = parseColorInput(formatId, val)
  if (parsed) {
    inputErrors[formatId] = null
    hexValue.value = parsed.hex
    if (parsed.alpha !== undefined) {
      alphaValue.value = Number(parsed.alpha.toFixed(2))
    }
  } else {
    // Alleen fout tonen als de gebruiker niet leeg is
    if (val.trim().length > 0) {
      inputErrors[formatId] = 'Ongeldige syntax voor deze notatie'
    } else {
      inputErrors[formatId] = null
    }
  }
}

const onFieldFocus = (formatId: string) => {
  // Als het veld gefocust wordt, initialiseer rawInputs als het nog niet gezet was
  const currentFormat = formatRows.value.find((f) => f.id === formatId)
  if (currentFormat && rawInputs[formatId] === undefined) {
    rawInputs[formatId] = currentFormat.value
  }
}

const onFieldBlur = (formatId: string) => {
  // Reset rawInputs zodat de berekende nette waarde terug getoond wordt
  rawInputs[formatId] = undefined
  inputErrors[formatId] = null
}

const clearAllErrors = () => {
  for (const k in rawInputs) rawInputs[k] = undefined
  for (const k in inputErrors) inputErrors[k] = null
}

// WCAG Luminantie en contrastberekening
const calculateLuminance = (r255: number, g255: number, b255: number) => {
  const a = [r255, g255, b255].map((v) => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

// Hulpfunctie: parseer hex naar numerieke RGB waarden
const hexToRgbValues = (hexStr: string) => {
  let hex = hexStr.replace(/^#/, '')
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('')
  }
  const r = parseInt(hex.substring(0, 2), 16) || 0
  const g = parseInt(hex.substring(2, 4), 16) || 0
  const b = parseInt(hex.substring(4, 6), 16) || 0
  return { r, g, b }
}

const contrastWhite = computed(() => {
  const { r, g, b } = rgbChannels.value
  const bg = hexToRgbValues(bgWhite.value)
  const blendedR = Math.round(r * alphaValue.value + bg.r * (1 - alphaValue.value))
  const blendedG = Math.round(g * alphaValue.value + bg.g * (1 - alphaValue.value))
  const blendedB = Math.round(b * alphaValue.value + bg.b * (1 - alphaValue.value))

  const lumColor = calculateLuminance(blendedR, blendedG, blendedB)
  const lumBg = calculateLuminance(bg.r, bg.g, bg.b)
  const ratio = (Math.max(lumColor, lumBg) + 0.05) / (Math.min(lumColor, lumBg) + 0.05)
  return {
    ratio,
    passNormalAA: ratio >= 4.5,
    passLargeAA: ratio >= 3.0,
    passAAA: ratio >= 7.0,
  }
})

const contrastDark = computed(() => {
  const { r, g, b } = rgbChannels.value
  const bg = hexToRgbValues(bgDark.value)
  const blendedR = Math.round(r * alphaValue.value + bg.r * (1 - alphaValue.value))
  const blendedG = Math.round(g * alphaValue.value + bg.g * (1 - alphaValue.value))
  const blendedB = Math.round(b * alphaValue.value + bg.b * (1 - alphaValue.value))

  const lumColor = calculateLuminance(blendedR, blendedG, blendedB)
  const lumBg = calculateLuminance(bg.r, bg.g, bg.b)
  const ratio = (Math.max(lumColor, lumBg) + 0.05) / (Math.min(lumColor, lumBg) + 0.05)
  return {
    ratio,
    passNormalAA: ratio >= 4.5,
    passLargeAA: ratio >= 3.0,
    passAAA: ratio >= 7.0,
  }
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
  border-radius: 20px;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.cc-body {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cc-controls-row {
  display: flex;
  gap: 18px;
  align-items: stretch;
}

.cc-preview-card {
  position: relative;
  width: 140px;
  min-height: 100px;
  border-radius: 10px;
  border: 2px solid var(--vp-c-divider);
  overflow: hidden;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.2s ease, border-color 0.2s ease;
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
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.cc-range-input {
  width: 100%;
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

.cc-input-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg-alt);
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px dashed var(--vp-c-divider);
}

.cc-input-hint svg {
  color: var(--vp-c-brand-1);
  flex-shrink: 0;
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

.cc-format-card.has-error {
  border-color: #ef4444;
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

.cc-format-input {
  font-family: var(--vp-font-family-mono);
  font-size: 0.82rem;
  color: var(--vp-c-brand-1);
  background-color: var(--vp-c-bg-elv);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  word-break: break-all;
  flex-grow: 1;
  min-width: 0;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.cc-format-input:focus {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
  color: var(--vp-c-text-1);
}

.cc-format-input.is-invalid {
  border-color: #ef4444;
  background-color: rgba(239, 68, 68, 0.05);
}

.cc-format-error-msg {
  font-size: 0.68rem;
  color: #ef4444;
  margin-top: -2px;
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

.cc-copy-btn.is-disabled {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
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

.cc-sample-text-wrap {
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: center;
  border-bottom: 1px solid var(--vp-c-divider);
}

.cc-sample-large {
  font-size: 1.12rem;
  font-weight: 700;
  line-height: 1.3;
}

.cc-sample-normal {
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 1.3;
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

.cc-contrast-label-wrap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.cc-bg-picker-label {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.cc-bg-native-picker {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  pointer-events: none;
}

.cc-bg-swatch {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 5px;
  border: 1.5px solid var(--vp-c-divider);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.cc-bg-picker-label:hover .cc-bg-swatch {
  transform: scale(1.15);
  border-color: var(--vp-c-brand-1);
}

.cc-contrast-eval-rows {
  padding: 6px 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  background-color: var(--vp-c-bg-elv);
  border-top: 1px dashed var(--vp-c-divider);
}

.cc-eval-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 0.75rem;
}

.cc-eval-label {
  color: var(--vp-c-text-2);
}

.cc-contrast-guidance {
  margin-top: 4px;
  padding: 12px 14px;
  border-radius: 8px;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.cc-contrast-guidance.is-alert {
  border-left: 4px solid #ef4444;
}

.cc-guidance-text {
  margin: 0;
  font-size: 0.8rem;
  line-height: 1.45;
  color: var(--vp-c-text-2);
}

.cc-guidance-text strong {
  color: var(--vp-c-text-1);
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
