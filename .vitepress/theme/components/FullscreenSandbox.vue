<template>
  <div class="fs-sandbox-page" :class="{ 'is-dark': isDark }">
    <!-- Header balk -->
    <header class="fs-header">
      <div class="fs-header-left">
        <a href="/" class="fs-brand" title="Terug naar de Web Essentials cursus">
          <img src="/logo.svg" alt="Thomas More logo" class="fs-logo" />
          <span class="fs-brand-name">Web Essentials</span>
        </a>
        <div class="fs-divider-vertical" aria-hidden="true"></div>
        <div class="fs-title-wrapper">
          <span class="fs-title-badge">Sandbox</span>
          <h1 class="fs-title-text">{{ currentTitle }}</h1>
        </div>
      </div>

      <div class="fs-header-center">
        <!-- Weergaveknoppen -->
        <div class="fs-tabs" role="tablist" aria-label="Weergavemodus">
          <button
            type="button"
            role="tab"
            class="fs-tab-btn"
            :class="{ active: activeTab === 'preview' }"
            :aria-selected="activeTab === 'preview'"
            @click="activeTab = 'preview'"
          >
            Resultaat
          </button>
          <button
            type="button"
            role="tab"
            class="fs-tab-btn"
            :class="{ active: activeTab === 'code' }"
            :aria-selected="activeTab === 'code'"
            @click="activeTab = 'code'"
          >
            Code
          </button>
          <button
            type="button"
            role="tab"
            class="fs-tab-btn"
            :class="{ active: activeTab === 'split' }"
            :aria-selected="activeTab === 'split'"
            @click="activeTab = 'split'"
          >
            Gesplitst
          </button>
        </div>
      </div>

      <div class="fs-header-right">
        <!-- Reset knop -->
        <button
          type="button"
          class="fs-btn fs-btn-outline"
          :disabled="!isModified"
          title="Herstel de oorspronkelijke code"
          @click="resetCode"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="1 4 1 10 7 10" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
          Reset
        </button>

        <!-- Kopiëren knop -->
        <button
          type="button"
          class="fs-btn fs-btn-outline"
          title="Kopieer alle code naar klembord"
          @click="copyCode"
        >
          <svg v-if="!isCopied" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {{ isCopied ? 'Gekopieerd!' : 'Kopiëren' }}
        </button>

        <!-- Download HTML bestand knop -->
        <button
          type="button"
          class="fs-btn fs-btn-primary"
          title="Download deze code als een .html bestand"
          @click="downloadHtml"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download .html
        </button>

        <!-- Donker / Licht thema wissel -->
        <button
          type="button"
          class="fs-icon-btn"
          :title="isDark ? 'Schakel over naar lichte modus' : 'Schakel over naar donkere modus'"
          @click="toggleTheme"
        >
          <svg v-if="isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Hoofdinhoud (editor en/of preview) -->
    <main
      class="fs-main"
      :class="[
        'view-' + activeTab,
        {
          'is-resizing': isResizing,
          'is-row-resizing': isRowResizing !== null
        }
      ]"
    >
      <!-- Code paneel (verticaal gestapelde editors voor HTML, CSS en JS) -->
      <section
        v-show="activeTab === 'code' || activeTab === 'split'"
        ref="codePaneEl"
        class="fs-pane fs-code-pane"
        :style="activeTab === 'split' ? { width: splitWidth + '%' } : {}"
      >
        <!-- HTML Editor Deelvenster -->
        <div
          class="fs-subpane fs-html-subpane"
          :style="{ height: htmlHeightStyle }"
        >
          <div class="fs-subpane-header">
            <div class="fs-subpane-title">
              <span class="fs-lang-badge fs-badge-html">HTML</span>
              <span class="fs-subpane-name">HTML5 Document</span>
            </div>
            <div class="fs-subpane-actions">
              <button
                type="button"
                class="fs-subpane-btn fs-panel-toggle"
                :class="{ 'is-active': hasCss }"
                :title="hasCss ? 'CSS-paneel verbergen' : 'CSS-paneel toevoegen'"
                @click="toggleCssPanel"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path v-if="!hasCss" d="M12 5v14M5 12h14" />
                  <polyline v-else points="20 6 9 17 4 12" />
                </svg>
                CSS
              </button>
              <button
                type="button"
                class="fs-subpane-btn fs-panel-toggle"
                :class="{ 'is-active': hasJs }"
                :title="hasJs ? 'JavaScript-paneel verbergen' : 'JavaScript-paneel toevoegen'"
                @click="toggleJsPanel"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path v-if="!hasJs" d="M12 5v14M5 12h14" />
                  <polyline v-else points="20 6 9 17 4 12" />
                </svg>
                JS
              </button>
              <button
                type="button"
                class="fs-subpane-btn"
                title="Kopieer HTML-code"
                @click="copySubCode('html')"
              >
                <svg v-if="subCopied !== 'html'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {{ subCopied === 'html' ? 'Gekopieerd!' : 'Kopieer' }}
              </button>
            </div>
          </div>
          <div ref="htmlEditorEl" class="fs-subeditor-wrapper"></div>
        </div>

        <!-- Horizontale scheidingsbalk 1 (tussen HTML en CSS of JS) -->
        <div
          v-if="hasCss || hasJs"
          class="fs-row-resizer"
          :class="{ 'is-resizing': isRowResizing === 1 }"
          @mousedown="startRowResize(1, $event)"
          @touchstart.prevent="startRowTouchResize(1, $event)"
          @dblclick="resetRowHeights"
          title="Sleep om hoogte aan te passen (dubbelklik voor gelijke verdeling)"
        >
          <div class="fs-row-resizer-line"></div>
        </div>

        <!-- CSS Editor Deelvenster -->
        <div
          v-if="hasCss"
          class="fs-subpane fs-css-subpane"
          :style="{ height: cssHeightStyle }"
        >
          <div class="fs-subpane-header">
            <div class="fs-subpane-title">
              <span class="fs-lang-badge fs-badge-css">CSS</span>
              <span class="fs-subpane-name">CSS3 Stijlblad</span>
            </div>
            <div class="fs-subpane-actions">
              <button
                type="button"
                class="fs-subpane-btn"
                title="Kopieer CSS-code"
                @click="copySubCode('css')"
              >
                <svg v-if="subCopied !== 'css'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {{ subCopied === 'css' ? 'Gekopieerd!' : 'Kopieer' }}
              </button>
              <button
                type="button"
                class="fs-subpane-btn fs-subpane-close-btn"
                title="CSS-paneel verbergen"
                @click="toggleCssPanel"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Sluiten
              </button>
            </div>
          </div>
          <div ref="cssEditorEl" class="fs-subeditor-wrapper"></div>
        </div>

        <!-- Horizontale scheidingsbalk 2 (tussen CSS en JS) -->
        <div
          v-if="hasCss && hasJs"
          class="fs-row-resizer"
          :class="{ 'is-resizing': isRowResizing === 2 }"
          @mousedown="startRowResize(2, $event)"
          @touchstart.prevent="startRowTouchResize(2, $event)"
          @dblclick="resetRowHeights"
          title="Sleep om hoogte aan te passen (dubbelklik voor gelijke verdeling)"
        >
          <div class="fs-row-resizer-line"></div>
        </div>

        <!-- JS Editor Deelvenster -->
        <div
          v-if="hasJs"
          class="fs-subpane fs-js-subpane"
          :style="{ height: jsHeightStyle }"
        >
          <div class="fs-subpane-header">
            <div class="fs-subpane-title">
              <span class="fs-lang-badge fs-badge-js">JS</span>
              <span class="fs-subpane-name">JavaScript</span>
            </div>
            <div class="fs-subpane-actions">
              <button
                type="button"
                class="fs-subpane-btn"
                title="Kopieer JavaScript-code"
                @click="copySubCode('js')"
              >
                <svg v-if="subCopied !== 'js'" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {{ subCopied === 'js' ? 'Gekopieerd!' : 'Kopieer' }}
              </button>
              <button
                type="button"
                class="fs-subpane-btn fs-subpane-close-btn"
                title="JavaScript-paneel verbergen"
                @click="toggleJsPanel"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                Sluiten
              </button>
            </div>
          </div>
          <div ref="jsEditorEl" class="fs-subeditor-wrapper"></div>
        </div>
      </section>

      <!-- Sleepbare verticale splitter balk tussen code en preview (alleen zichtbaar bij split view) -->
      <div
        v-show="activeTab === 'split'"
        class="fs-resizer"
        @mousedown="startResize"
        @touchstart.prevent="startTouchResize"
        @dblclick="splitWidth = 50"
        title="Sleep om vensterbreedte aan te passen (dubbelklik voor 50/50)"
      >
        <div class="fs-resizer-line"></div>
      </div>

      <!-- Preview paneel -->
      <section
        v-show="activeTab === 'preview' || activeTab === 'split'"
        class="fs-pane fs-preview-pane"
        :style="activeTab === 'split' ? { width: (100 - splitWidth) + '%' } : {}"
      >
        <div class="fs-pane-header">
          <span class="fs-pane-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" />
            </svg>
            Resultaat in browser
          </span>
          <span class="fs-pane-hint">Live weergave</span>
        </div>
        <iframe
          :key="iframeKey"
          :srcdoc="previewSrcdoc"
          class="fs-preview-iframe"
          sandbox="allow-scripts allow-modals allow-forms allow-popups"
          title="Live preview van de code"
        ></iframe>
      </section>
    </main>

    <!-- Statusbalk onderaan -->
    <footer class="fs-statusbar">
      <div class="fs-statusbar-left">
        <span class="fs-status-item">{{ activeCodeLanguage.toUpperCase() }}</span>
        <span class="fs-status-item">Regel {{ cursorLine }}, Kolom {{ cursorCol }}</span>
        <span class="fs-status-item">{{ activeLanguageChars }} tekens (Totaal: {{ totalCharCount }})</span>
      </div>
      <div class="fs-statusbar-right">
        <span class="fs-status-item">Thomas More Campus Geel - IT Factory</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { EditorView, basicSetup } from 'codemirror'
import { html, autoCloseTags } from '@codemirror/lang-html'
import { css as langCss } from '@codemirror/lang-css'
import { javascript as langJs } from '@codemirror/lang-javascript'
import { autocompletion, closeBrackets } from '@codemirror/autocomplete'
import { oneDark } from '@codemirror/theme-one-dark'
import { Compartment } from '@codemirror/state'
import { keymap } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'

const defaultHtml = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mijn Eerste Pagina</title>
</head>
<body>
  <h1>Welkom bij Web Essentials</h1>
  <p>Pas deze HTML-code aan en bekijk rechts meteen het resultaat.</p>
</body>
</html>`

const currentTitle = ref('Web Essentials Code Sandbox')
const currentCode = ref(defaultHtml)
const initialCode = ref(defaultHtml)
const currentCss = ref('')
const initialCss = ref('')
const currentJs = ref('')
const initialJs = ref('')

const activeCodeLanguage = ref<'html' | 'css' | 'js'>('html')
const activeTab = ref<'preview' | 'code' | 'split'>('split')
const splitWidth = ref(50)

// Hoogtepercentages voor gestapelde rijen
const htmlHeightPercent = ref(50)
const cssHeightPercent = ref(50)
const jsHeightPercent = ref(25)

const isCopied = ref(false)
const subCopied = ref<'html' | 'css' | 'js' | null>(null)
const isDark = ref(false)
const cursorLine = ref(1)
const cursorCol = ref(1)

const codePaneEl = ref<HTMLElement | null>(null)
const htmlEditorEl = ref<HTMLElement | null>(null)
const cssEditorEl = ref<HTMLElement | null>(null)
const jsEditorEl = ref<HTMLElement | null>(null)

let htmlEditorView: EditorView | null = null
let cssEditorView: EditorView | null = null
let jsEditorView: EditorView | null = null

const htmlThemeCompartment = new Compartment()
const cssThemeCompartment = new Compartment()
const jsThemeCompartment = new Compartment()

const isResizing = ref(false)
const isRowResizing = ref<null | 1 | 2>(null)

const iframeKey = ref(0)
let debounceTimer: any = null

const showCssPanel = ref(false)
const showJsPanel = ref(false)

const hasCss = computed(() => showCssPanel.value)
const hasJs = computed(() => showJsPanel.value)

const toggleCssPanel = () => {
  showCssPanel.value = !showCssPanel.value
  resetRowHeights()
  if (showCssPanel.value) {
    nextTick(() => {
      if (cssEditorEl.value && !cssEditorView) {
        cssEditorView = createEditorInstance(
          cssEditorEl.value,
          currentCss.value,
          'css',
          cssThemeCompartment,
          (val) => { currentCss.value = val }
        )
      }
      activeCodeLanguage.value = 'css'
    })
  } else {
    if (cssEditorView) {
      cssEditorView.destroy()
      cssEditorView = null
    }
    if (activeCodeLanguage.value === 'css') {
      activeCodeLanguage.value = 'html'
    }
  }
}

const toggleJsPanel = () => {
  showJsPanel.value = !showJsPanel.value
  resetRowHeights()
  if (showJsPanel.value) {
    nextTick(() => {
      if (jsEditorEl.value && !jsEditorView) {
        jsEditorView = createEditorInstance(
          jsEditorEl.value,
          currentJs.value,
          'js',
          jsThemeCompartment,
          (val) => { currentJs.value = val }
        )
      }
      activeCodeLanguage.value = 'js'
    })
  } else {
    if (jsEditorView) {
      jsEditorView.destroy()
      jsEditorView = null
    }
    if (activeCodeLanguage.value === 'js') {
      activeCodeLanguage.value = 'html'
    }
  }
}

// Berekende hoogtestijlen met aftrek van resizer-balken (8px per resizer)
const htmlHeightStyle = computed(() => {
  if (!hasCss.value && !hasJs.value) return '100%'
  if (hasCss.value && hasJs.value) return `calc(${htmlHeightPercent.value}% - 5.33px)`
  return `calc(${htmlHeightPercent.value}% - 4px)`
})

const cssHeightStyle = computed(() => {
  if (!hasCss.value) return '0%'
  if (hasCss.value && hasJs.value) return `calc(${cssHeightPercent.value}% - 5.33px)`
  return `calc(${cssHeightPercent.value}% - 4px)`
})

const jsHeightStyle = computed(() => {
  if (!hasJs.value) return '0%'
  if (hasCss.value && hasJs.value) return `calc(${jsHeightPercent.value}% - 5.33px)`
  return `calc(${jsHeightPercent.value}% - 4px)`
})

const resetRowHeights = () => {
  if (hasCss.value && hasJs.value) {
    htmlHeightPercent.value = 38
    cssHeightPercent.value = 38
    jsHeightPercent.value = 24
  } else if (hasCss.value || hasJs.value) {
    htmlHeightPercent.value = 50
    cssHeightPercent.value = 50
    jsHeightPercent.value = 50
  } else {
    htmlHeightPercent.value = 100
  }
}

const cleanHtml = (raw: string): string => {
  if (!raw) return ''
  return raw
    .replace(/<pre[^>]*><code[^>]*>/gi, '')
    .replace(/<\/code><\/pre>/gi, '')
    .replace(/(src|href)=&quot;<(https?:\/\/[^>]+)>&quot;/gi, '$1=&quot;$2&quot;')
    .replace(/(src|href)="<(https?:\/\/[^>]+)>"/gi, '$1="$2"')
    .replace(/(src|href)='<(https?:\/\/[^>]+)>'/gi, '$1=\'$2\'')
}

const activeLanguageChars = computed(() => {
  if (activeCodeLanguage.value === 'css') return currentCss.value.length
  if (activeCodeLanguage.value === 'js') return currentJs.value.length
  return currentCode.value.length
})

const totalCharCount = computed(() => currentCode.value.length + currentCss.value.length + currentJs.value.length)

const isModified = computed(() =>
  currentCode.value !== initialCode.value ||
  currentCss.value !== initialCss.value ||
  currentJs.value !== initialJs.value
)

const ANCHOR_INTERCEPT_SCRIPT = `<script>
document.addEventListener('click', function(e) {
  var a = e.target.closest('a[href^="#"]');
  if (a) {
    e.preventDefault();
    var hash = a.getAttribute('href');
    if (!hash || hash === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    var targetId = hash.slice(1);
    var targetEl = document.getElementById(targetId) || document.getElementsByName(targetId)[0];
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    } else if (targetId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
});
<` + `/script>`

const previewSrcdoc = computed(() => {
  const htmlContent = currentCode.value || ''
  const cssContent = currentCss.value || ''
  const jsContent = currentJs.value || ''

  if (!htmlContent && !cssContent && !jsContent) return ''

  const isFullDoc = /<!DOCTYPE html>|<html/i.test(htmlContent)

  if (!isFullDoc) {
    return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${cssContent ? `<style>\n${cssContent}\n</style>` : ''}
</head>
<body>
${htmlContent}
${jsContent ? `<script>\n${jsContent}\n<` + `/script>` : ''}
${ANCHOR_INTERCEPT_SCRIPT}
</body>
</html>`
  }

  let result = htmlContent

  if (cssContent) {
    const styleTag = `<style>\n${cssContent}\n</style>`
    if (/<\/head>/i.test(result)) {
      result = result.replace(/<\/head>/i, `${styleTag}\n</head>`)
    } else if (/<body[^>]*>/i.test(result)) {
      result = result.replace(/<body[^>]*>/i, `$& \n${styleTag}`)
    } else {
      result = `${styleTag}\n${result}`
    }
  }

  if (jsContent) {
    const scriptTag = `<script>\n${jsContent}\n<` + `/script>`
    if (/<\/body>/i.test(result)) {
      result = result.replace(/<\/body>/i, `${scriptTag}\n</body>`)
    } else {
      result = `${result}\n${scriptTag}`
    }
  }

  if (/<\/body>/i.test(result)) {
    return result.replace(/<\/body>/i, `${ANCHOR_INTERCEPT_SCRIPT}\n</body>`)
  }
  return `${result}\n${ANCHOR_INTERCEPT_SCRIPT}`
})

watch(previewSrcdoc, () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    iframeKey.value++
  }, 100)
})

const createEditorInstance = (
  container: HTMLElement,
  docText: string,
  lang: 'html' | 'css' | 'js',
  themeComp: Compartment,
  onDocChange: (val: string) => void
) => {
  let langExt
  if (lang === 'css') {
    langExt = langCss()
  } else if (lang === 'js') {
    langExt = langJs()
  } else {
    langExt = [html({ autoCloseTags: true }), autoCloseTags]
  }

  return new EditorView({
    doc: docText,
    extensions: [
      basicSetup,
      langExt,
      closeBrackets(),
      autocompletion({
        activateOnTyping: true,
        maxRenderedOptions: 30,
        defaultKeymap: true,
      }),
      keymap.of([indentWithTab]),
      themeComp.of(isDark.value ? oneDark : []),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const val = update.state.doc.toString()
          onDocChange(val)
        }
        if (update.selectionSet) {
          activeCodeLanguage.value = lang
          const pos = update.state.selection.main.head
          const line = update.state.doc.lineAt(pos)
          cursorLine.value = line.number
          cursorCol.value = pos - line.from + 1
        }
      }),
      EditorView.theme({
        '&': {
          height: '100%',
          fontSize: '14px',
        },
        '.cm-scroller': {
          overflow: 'auto',
          fontFamily: 'var(--vp-font-family-mono, Consolas, Monaco, monospace)',
          lineHeight: '1.6',
        },
        '.cm-gutters': {
          borderRight: '1px solid var(--vp-c-divider, #e2e8f0)',
          backgroundColor: 'transparent',
          color: '#8b949e',
        },
        '.cm-activeLine': {
          backgroundColor: 'rgba(232, 119, 34, 0.08)',
        },
        '.cm-activeLineGutter': {
          backgroundColor: 'rgba(232, 119, 34, 0.15)',
          color: '#e87722',
          fontWeight: 'bold',
        },
        '.cm-tooltip-autocomplete': {
          border: '1px solid #cbd5e1',
          backgroundColor: '#ffffff',
          borderRadius: '6px',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
          fontSize: '13px',
          zIndex: '999',
        },
        '.cm-tooltip-autocomplete > ul > li': {
          padding: '4px 10px',
        },
        '.cm-tooltip-autocomplete > ul > li[aria-selected]': {
          backgroundColor: '#e87722 !important',
          color: '#ffffff !important',
        },
      }),
    ],
    parent: container,
  })
}

const initAllEditors = () => {
  if (htmlEditorEl.value && !htmlEditorView) {
    htmlEditorView = createEditorInstance(
      htmlEditorEl.value,
      currentCode.value,
      'html',
      htmlThemeCompartment,
      (val) => { currentCode.value = val }
    )
  }

  if (hasCss.value && cssEditorEl.value && !cssEditorView) {
    cssEditorView = createEditorInstance(
      cssEditorEl.value,
      currentCss.value,
      'css',
      cssThemeCompartment,
      (val) => { currentCss.value = val }
    )
  }

  if (hasJs.value && jsEditorEl.value && !jsEditorView) {
    jsEditorView = createEditorInstance(
      jsEditorEl.value,
      currentJs.value,
      'js',
      jsThemeCompartment,
      (val) => { currentJs.value = val }
    )
  }
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (typeof document !== 'undefined') {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  const theme = isDark.value ? oneDark : []
  if (htmlEditorView) htmlEditorView.dispatch({ effects: htmlThemeCompartment.reconfigure(theme) })
  if (cssEditorView) cssEditorView.dispatch({ effects: cssThemeCompartment.reconfigure(theme) })
  if (jsEditorView) jsEditorView.dispatch({ effects: jsThemeCompartment.reconfigure(theme) })
}

const resetCode = () => {
  currentCode.value = initialCode.value
  currentCss.value = initialCss.value
  currentJs.value = initialJs.value

  if (htmlEditorView) {
    htmlEditorView.dispatch({
      changes: { from: 0, to: htmlEditorView.state.doc.length, insert: currentCode.value },
    })
  }
  if (cssEditorView) {
    cssEditorView.dispatch({
      changes: { from: 0, to: cssEditorView.state.doc.length, insert: currentCss.value },
    })
  }
  if (jsEditorView) {
    jsEditorView.dispatch({
      changes: { from: 0, to: jsEditorView.state.doc.length, insert: currentJs.value },
    })
  }
}

const copyCode = async () => {
  try {
    let textToCopy = currentCode.value
    if (currentCss.value || currentJs.value) {
      textToCopy = previewSrcdoc.value.replace(ANCHOR_INTERCEPT_SCRIPT, '')
    }
    await navigator.clipboard.writeText(textToCopy)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Kopiëren mislukt:', err)
  }
}

const copySubCode = async (lang: 'html' | 'css' | 'js') => {
  try {
    const text = lang === 'html' ? currentCode.value : lang === 'css' ? currentCss.value : currentJs.value
    await navigator.clipboard.writeText(text)
    subCopied.value = lang
    setTimeout(() => {
      if (subCopied.value === lang) subCopied.value = null
    }, 2000)
  } catch (err) {
    console.error('Kopiëren van deeltaal mislukt:', err)
  }
}

const downloadHtml = () => {
  let fileContent = currentCode.value
  if (currentCss.value || currentJs.value) {
    fileContent = previewSrcdoc.value.replace(ANCHOR_INTERCEPT_SCRIPT, '')
  }
  const blob = new Blob([fileContent], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const filename = currentTitle.value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'web-essentials-oefening'
  a.href = url
  a.download = filename + '.html'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Verticale scheiding tussen code en preview
const startResize = (e: MouseEvent) => {
  e.preventDefault()
  isResizing.value = true
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}

const handleResize = (e: MouseEvent) => {
  if (!isResizing.value) return
  const totalWidth = window.innerWidth
  const newWidth = (e.clientX / totalWidth) * 100
  if (newWidth >= 15 && newWidth <= 85) {
    splitWidth.value = Math.round(newWidth * 10) / 10
  }
}

const stopResize = () => {
  if (!isResizing.value) return
  isResizing.value = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
}

const startTouchResize = () => {
  isResizing.value = true
  document.addEventListener('touchmove', handleTouchResize, { passive: false })
  document.addEventListener('touchend', stopTouchResize)
  document.addEventListener('touchcancel', stopTouchResize)
}

const handleTouchResize = (e: TouchEvent) => {
  if (!isResizing.value || !e.touches[0]) return
  const totalWidth = window.innerWidth
  const newWidth = (e.touches[0].clientX / totalWidth) * 100
  if (newWidth >= 15 && newWidth <= 85) {
    splitWidth.value = Math.round(newWidth * 10) / 10
  }
}

const stopTouchResize = () => {
  if (!isResizing.value) return
  isResizing.value = false
  document.removeEventListener('touchmove', handleTouchResize)
  document.removeEventListener('touchend', stopTouchResize)
  document.removeEventListener('touchcancel', stopTouchResize)
}

// Horizontale scheiding tussen de gestapelde codevensters
const startRowResize = (dividerIndex: 1 | 2, e: MouseEvent) => {
  e.preventDefault()
  isRowResizing.value = dividerIndex
  document.addEventListener('mousemove', handleRowResize)
  document.addEventListener('mouseup', stopRowResize)
}

const startRowTouchResize = (dividerIndex: 1 | 2, e: TouchEvent) => {
  isRowResizing.value = dividerIndex
  document.addEventListener('touchmove', handleRowTouchResize, { passive: false })
  document.addEventListener('touchend', stopRowTouchResize)
  document.addEventListener('touchcancel', stopRowTouchResize)
}

const handleRowResize = (e: MouseEvent | { clientY: number }) => {
  if (!isRowResizing.value || !codePaneEl.value) return
  const rect = codePaneEl.value.getBoundingClientRect()
  const totalH = rect.height
  if (totalH <= 0) return

  const offsetY = e.clientY - rect.top
  const percentY = (offsetY / totalH) * 100

  // Scheidingslijn 1 (tussen HTML en CSS of JS)
  if (isRowResizing.value === 1) {
    if (hasCss.value && hasJs.value) {
      // 3 vensters actief: houd JS-hoogte vast en pas HTML en CSS aan
      const maxHtml = 100 - jsHeightPercent.value - 12
      const clamped = Math.max(12, Math.min(maxHtml, percentY))
      htmlHeightPercent.value = Math.round(clamped * 10) / 10
      cssHeightPercent.value = Math.round((100 - htmlHeightPercent.value - jsHeightPercent.value) * 10) / 10
    } else {
      // 2 vensters actief
      const clamped = Math.max(12, Math.min(88, percentY))
      htmlHeightPercent.value = Math.round(clamped * 10) / 10
      if (hasCss.value) {
        cssHeightPercent.value = Math.round((100 - htmlHeightPercent.value) * 10) / 10
      } else {
        jsHeightPercent.value = Math.round((100 - htmlHeightPercent.value) * 10) / 10
      }
    }
  }
  // Scheidingslijn 2 (tussen CSS en JS)
  else if (isRowResizing.value === 2) {
    // 3 vensters actief: houd HTML-hoogte vast en pas CSS en JS aan
    const minDivider = htmlHeightPercent.value + 12
    const maxDivider = 88
    const clamped = Math.max(minDivider, Math.min(maxDivider, percentY))
    cssHeightPercent.value = Math.round((clamped - htmlHeightPercent.value) * 10) / 10
    jsHeightPercent.value = Math.round((100 - htmlHeightPercent.value - cssHeightPercent.value) * 10) / 10
  }
}

const handleRowTouchResize = (e: TouchEvent) => {
  if (!isRowResizing.value || !e.touches[0]) return
  handleRowResize({ clientY: e.touches[0].clientY })
}

const stopRowResize = () => {
  if (!isRowResizing.value) return
  isRowResizing.value = null
  document.removeEventListener('mousemove', handleRowResize)
  document.removeEventListener('mouseup', stopRowResize)
}

const stopRowTouchResize = () => {
  if (!isRowResizing.value) return
  isRowResizing.value = null
  document.removeEventListener('touchmove', handleRowTouchResize)
  document.removeEventListener('touchend', stopRowTouchResize)
  document.removeEventListener('touchcancel', stopRowTouchResize)
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    isDark.value = document.documentElement.classList.contains('dark')

    // Lees data uit localStorage via URL param
    const params = new URLSearchParams(window.location.search)
    const id = params.get('id')
    if (id) {
      try {
        const raw = localStorage.getItem(id)
        if (raw) {
          const parsed = JSON.parse(raw)
          if (parsed.title) currentTitle.value = parsed.title
          if (parsed.code) currentCode.value = cleanHtml(parsed.code)
          if (parsed.initialCode) initialCode.value = cleanHtml(parsed.initialCode)
          else if (parsed.code) initialCode.value = cleanHtml(parsed.code)
          if (parsed.css) currentCss.value = parsed.css
          if (parsed.initialCss) initialCss.value = parsed.initialCss
          else if (parsed.css) initialCss.value = parsed.css
          if (parsed.js) currentJs.value = parsed.js
          if (parsed.initialJs) initialJs.value = parsed.initialJs
          else if (parsed.js) initialJs.value = parsed.js
          if (parsed.activeCodeTab && ['html', 'css', 'js'].includes(parsed.activeCodeTab)) {
            activeCodeLanguage.value = parsed.activeCodeTab
          }
        }
      } catch (err) {
        console.warn('Kon sandbox-gegevens niet laden:', err)
      }
    }

    if (currentCss.value || initialCss.value) {
      showCssPanel.value = true
    }
    if (currentJs.value || initialJs.value) {
      showJsPanel.value = true
    }
  }

  // Initiële hoogtes instellen op basis van aanwezige talen
  resetRowHeights()

  nextTick(() => {
    initAllEditors()
  })
})

onBeforeUnmount(() => {
  if (htmlEditorView) {
    htmlEditorView.destroy()
    htmlEditorView = null
  }
  if (cssEditorView) {
    cssEditorView.destroy()
    cssEditorView = null
  }
  if (jsEditorView) {
    jsEditorView.destroy()
    jsEditorView = null
  }

  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchmove', handleTouchResize)
  document.removeEventListener('touchend', stopTouchResize)
  document.removeEventListener('touchcancel', stopTouchResize)

  document.removeEventListener('mousemove', handleRowResize)
  document.removeEventListener('mouseup', stopRowResize)
  document.removeEventListener('touchmove', handleRowTouchResize)
  document.removeEventListener('touchend', stopRowTouchResize)
  document.removeEventListener('touchcancel', stopRowTouchResize)
})
</script>

<style scoped>
.fs-sandbox-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #f8fafc;
  color: #0f172a;
  font-family: var(--vp-font-family-base, system-ui, -apple-system, sans-serif);
}

.fs-sandbox-page.is-dark {
  background-color: #0f172a;
  color: #f1f5f9;
}

/* Header */
.fs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 1rem;
  background-color: #1e2d5a;
  color: #ffffff;
  flex-shrink: 0;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  z-index: 20;
}

.fs-header-left,
.fs-header-center,
.fs-header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.fs-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.95rem;
  flex-shrink: 0;
}

.fs-brand:hover {
  color: #e87722;
}

.fs-logo {
  width: 24px;
  height: 24px;
}

.fs-divider-vertical {
  width: 1px;
  height: 20px;
  background-color: rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

.fs-title-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.fs-title-badge {
  background-color: rgba(232, 119, 34, 0.25);
  color: #f39c12;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  border: 1px solid rgba(232, 119, 34, 0.4);
  flex-shrink: 0;
}

.fs-title-text {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #e2e8f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Tabs */
.fs-tabs {
  display: flex;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 3px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.fs-tab-btn {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #cbd5e1;
  background: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.fs-tab-btn:hover {
  color: #ffffff;
}

.fs-tab-btn.active {
  background-color: #e87722;
  color: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Knoppen in header */
.fs-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 1px solid transparent;
}

.fs-btn-outline {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.25);
}

.fs-btn-outline:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

.fs-btn-outline:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.fs-btn-primary {
  background-color: #e87722;
  color: #ffffff;
}

.fs-btn-primary:hover {
  background-color: #d06616;
}

.fs-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.15s ease;
}

.fs-icon-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Hoofdgedeelte */
.fs-main {
  display: flex;
  flex: 1;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.fs-pane {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.fs-code-pane {
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
}

.is-dark .fs-code-pane {
  background-color: #1e1e1e;
}

/* Gestapelde deelvensters binnen code-paneel */
.fs-subpane {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  position: relative;
  min-height: 0;
}

.fs-subpane-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.3rem 0.75rem;
  background-color: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.75rem;
  font-weight: 600;
  color: #475569;
  user-select: none;
  flex-shrink: 0;
  height: 28px;
  box-sizing: border-box;
}

.is-dark .fs-subpane-header {
  background-color: #1e293b;
  border-bottom-color: #334155;
  color: #94a3b8;
}

.fs-subpane-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.fs-subpane-name {
  font-size: 0.75rem;
  font-weight: 600;
  color: #334155;
}

.is-dark .fs-subpane-name {
  color: #e2e8f0;
}

.fs-lang-badge {
  font-family: var(--vp-font-family-mono, Consolas, Monaco, monospace);
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.2;
}

.fs-badge-html {
  background-color: #e45649;
  color: #ffffff;
}

.fs-badge-css {
  background-color: #0284c7;
  color: #ffffff;
}

.fs-badge-js {
  background-color: #d97706;
  color: #ffffff;
}

.fs-subpane-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.15rem 0.45rem;
  font-size: 0.7rem;
  font-weight: 500;
  color: #64748b;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.fs-subpane-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #0f172a;
  border-color: #cbd5e1;
}

.is-dark .fs-subpane-btn {
  color: #94a3b8;
}

.is-dark .fs-subpane-btn:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  border-color: #475569;
}

.fs-panel-toggle {
  border: 1px dashed #cbd5e1;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
}

.fs-panel-toggle:hover {
  border-style: solid;
  border-color: #e87722;
  color: #e87722;
  background-color: rgba(232, 119, 34, 0.08);
}

.fs-panel-toggle.is-active {
  border-style: solid;
  border-color: rgba(2, 132, 199, 0.35);
  background-color: rgba(2, 132, 199, 0.1);
  color: #0284c7;
}

.is-dark .fs-panel-toggle {
  border-color: #475569;
  color: #94a3b8;
}

.is-dark .fs-panel-toggle:hover {
  border-color: #e87722;
  color: #e87722;
  background-color: rgba(232, 119, 34, 0.15);
}

.is-dark .fs-panel-toggle.is-active {
  border-color: rgba(56, 189, 248, 0.4);
  background-color: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
}

.fs-subpane-close-btn:hover {
  color: #ef4444 !important;
  border-color: rgba(239, 68, 68, 0.3) !important;
  background-color: rgba(239, 68, 68, 0.08) !important;
}

.is-dark .fs-subpane-close-btn:hover {
  color: #f87171 !important;
  border-color: rgba(248, 113, 113, 0.3) !important;
  background-color: rgba(248, 113, 113, 0.15) !important;
}

.fs-subeditor-wrapper {
  flex: 1;
  width: 100%;
  height: calc(100% - 28px);
  min-height: 0;
  overflow: hidden;
}

/* Horizontale resizers tussen codevensters */
.fs-row-resizer {
  height: 8px;
  width: 100%;
  cursor: row-resize;
  background-color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: background-color 0.15s ease;
  user-select: none;
  flex-shrink: 0;
  z-index: 10;
}

.is-dark .fs-row-resizer {
  background-color: #334155;
}

.fs-row-resizer:hover,
.fs-row-resizer.is-resizing {
  background-color: #e87722;
}

.fs-row-resizer-line {
  width: 32px;
  height: 2px;
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: 1px;
}

.is-dark .fs-row-resizer-line {
  background-color: rgba(255, 255, 255, 0.35);
}

/* Preview paneel */
.fs-preview-pane {
  background-color: #ffffff;
}

.fs-pane-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.35rem 0.85rem;
  background-color: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
  font-size: 0.75rem;
  font-weight: 600;
  color: #475569;
  user-select: none;
  height: 28px;
  box-sizing: border-box;
}

.is-dark .fs-pane-header {
  background-color: #1e293b;
  border-bottom-color: #334155;
  color: #94a3b8;
}

.fs-pane-title {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #0f172a;
}

.is-dark .fs-pane-title {
  color: #f1f5f9;
}

.fs-pane-hint {
  font-size: 0.7rem;
  font-weight: normal;
  color: #64748b;
}

.is-dark .fs-pane-hint {
  color: #94a3b8;
}

.fs-preview-iframe {
  flex: 1;
  width: 100%;
  height: calc(100% - 28px);
  border: none;
  background-color: #ffffff;
}

/* Verticale resizer tussen code en preview */
.fs-resizer {
  width: 8px;
  cursor: col-resize;
  background-color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: background-color 0.15s ease;
  user-select: none;
  z-index: 10;
}

.is-dark .fs-resizer {
  background-color: #334155;
}

.fs-resizer:hover,
.fs-resizer:active {
  background-color: #e87722;
}

.fs-resizer-line {
  width: 2px;
  height: 24px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 1px;
}

.is-dark .fs-resizer-line {
  background-color: rgba(255, 255, 255, 0.3);
}

.fs-main.is-resizing {
  user-select: none;
  cursor: col-resize;
}

.fs-main.is-resizing iframe,
.fs-main.is-row-resizing iframe {
  pointer-events: none;
}

.fs-main.is-row-resizing {
  user-select: none;
  cursor: row-resize;
}

/* Statusbalk */
.fs-statusbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 1rem;
  background-color: #f1f5f9;
  border-top: 1px solid #e2e8f0;
  font-size: 0.72rem;
  color: #64748b;
  flex-shrink: 0;
  user-select: none;
}

.is-dark .fs-statusbar {
  background-color: #0f172a;
  border-top-color: #1e293b;
  color: #94a3b8;
}

.fs-statusbar-left,
.fs-statusbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.fs-status-item {
  font-family: var(--vp-font-family-mono, Consolas, Monaco, monospace);
}

/* Weergavemodi */
.fs-main.view-code .fs-code-pane {
  width: 100% !important;
}

.fs-main.view-preview .fs-preview-pane {
  width: 100% !important;
}
</style>
