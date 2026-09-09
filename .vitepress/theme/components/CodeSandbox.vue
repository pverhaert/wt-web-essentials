<template>
  <div class="sandbox-container">
    <!-- Titel boven het voorbeeld -->
    <div v-if="title" class="sandbox-title-bar">
      <span class="sandbox-title-icon" aria-hidden="true">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      </span>
      <span class="sandbox-title-text">{{ title }}</span>
    </div>

    <div class="sandbox-wrapper">
      <!-- Toolbar met tabs en actieknoppen -->
      <div class="sandbox-header">
        <div class="sandbox-header-left">
          <!-- Weergaveknoppen (alleen bij directe html code) -->
          <div v-if="hasDirectCode" class="sandbox-tabs">
            <button
              type="button"
              class="sandbox-tab-btn"
              :class="{ active: activeTab === 'preview' }"
              @click="activeTab = 'preview'"
            >
              Resultaat
            </button>
            <button
              type="button"
              class="sandbox-tab-btn"
              :class="{ active: activeTab === 'code' }"
              @click="activeTab = 'code'"
            >
              Code
            </button>
            <button
              type="button"
              class="sandbox-tab-btn"
              :class="{ active: activeTab === 'split' }"
              @click="activeTab = 'split'"
            >
              Gesplitst
            </button>
          </div>
        </div>

        <div class="sandbox-header-right">
          <!-- Resetknop -->
          <button
            v-if="hasDirectCode"
            type="button"
            class="sandbox-action-btn"
            :disabled="!isModified"
            title="Herstel de oorspronkelijke code"
            @click="resetCode"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 4px;">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            Reset
          </button>

          <!-- Openen in nieuw tabblad link/knop -->
          <a
            v-if="!hasDirectCode"
            :href="src"
            target="_blank"
            rel="noopener noreferrer"
            class="sandbox-external-link"
          >
            Openen in nieuw tabblad
          </a>
          <button
            v-else
            type="button"
            class="sandbox-action-btn"
            title="Open de volledige sandbox in een nieuw tabblad"
            @click="openInNewTab"
          >
            Openen in nieuw tabblad
          </button>
        </div>
      </div>

      <!-- Inhoud als externe src iframe -->
      <iframe
        v-if="!hasDirectCode"
        :src="src"
        :height="height"
        class="sandbox-iframe"
        sandbox="allow-scripts allow-same-origin allow-forms"
        loading="lazy"
        :title="title || 'Live codevoorbeeld'"
      />

      <!-- Inhoud als directe code (preview / CodeMirror editor / split) -->
      <div
        v-else
        ref="bodyEl"
        class="sandbox-body"
        :class="['view-' + activeTab, { 'is-resizing': isResizing }]"
        :style="{ height: height }"
      >
        <!-- Code editor paneel met CodeMirror 6 -->
        <div
          v-show="activeTab === 'code' || activeTab === 'split'"
          class="sandbox-code-pane"
          :style="activeTab === 'split' ? { width: splitWidth + '%' } : {}"
        >
          <!-- Pane label of taaltabs -->
          <div v-if="showLanguageTabs" class="sandbox-lang-header">
            <div class="sandbox-lang-tabs">
              <button
                type="button"
                class="sandbox-lang-tab-btn"
                :class="{ active: activeCodeLanguage === 'html' }"
                @click="switchCodeLanguage('html')"
              >
                HTML
              </button>
              <button
                v-if="hasCss"
                type="button"
                class="sandbox-lang-tab-btn"
                :class="{ active: activeCodeLanguage === 'css' }"
                @click="switchCodeLanguage('css')"
              >
                CSS
              </button>
              <button
                v-if="hasJs"
                type="button"
                class="sandbox-lang-tab-btn"
                :class="{ active: activeCodeLanguage === 'js' }"
                @click="switchCodeLanguage('js')"
              >
                JS
              </button>
            </div>
            <span class="sandbox-lang-badge">{{ activeCodeLanguage.toUpperCase() }}</span>
          </div>
          <div v-else class="sandbox-pane-label">HTML (met syntax highlighting & completion)</div>
          <div ref="editorEl" class="sandbox-editor-container" />
        </div>

        <!-- Sleepbare scheidingsbalk (alleen zichtbaar bij split view) -->
        <div
          v-show="activeTab === 'split'"
          class="sandbox-resizer"
          @mousedown="startResize"
          @touchstart.prevent="startTouchResize"
          @dblclick="splitWidth = 50"
          title="Sleep om vensterbreedte aan te passen (dubbelklik voor 50/50)"
        >
          <div class="sandbox-resizer-line"></div>
        </div>

        <!-- Live preview iframe paneel -->
        <div
          v-show="activeTab === 'preview' || activeTab === 'split'"
          class="sandbox-preview-pane"
        >
          <div class="sandbox-pane-label">Resultaat in browser</div>
          <iframe
            :srcdoc="previewSrcdoc"
            class="sandbox-preview-iframe"
            sandbox="allow-scripts allow-modals allow-forms allow-popups"
            :title="title || 'Resultaat van de code'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { EditorView, basicSetup } from 'codemirror'
import { html, autoCloseTags } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { javascript } from '@codemirror/lang-javascript'
import { autocompletion, closeBrackets } from '@codemirror/autocomplete'
import { oneDark } from '@codemirror/theme-one-dark'
import { Compartment } from '@codemirror/state'
import { keymap } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'
import { createEmmetKeymap, abbreviationTracker } from '../composables/useEmmet'

const props = withDefaults(
  defineProps<{
    src?: string
    html?: string
    css?: string
    js?: string
    javascript?: string
    title?: string
    height?: string
    initialTab?: 'preview' | 'code' | 'split'
    activeCodeTab?: 'html' | 'css' | 'js'
  }>(),
  {
    src: '',
    html: '',
    css: '',
    js: '',
    javascript: '',
    title: '',
    height: '420px',
    initialTab: 'split',
    activeCodeTab: undefined,
  }
)

const cleanCode = (raw: string): string => {
  if (!raw) return ''
  return raw
    .replace(/<pre[^>]*><code[^>]*>/gi, '')
    .replace(/<\/code><\/pre>/gi, '')
    .replace(/(src|href)=&quot;<(https?:\/\/[^>]+)>&quot;/gi, '$1=&quot;$2&quot;')
    .replace(/(src|href)="<(https?:\/\/[^>]+)>"/gi, '$1="$2"')
    .replace(/(src|href)='<(https?:\/\/[^>]+)>'/gi, '$1=\'$2\'')
}

// CSS heeft nooit <p> of </p> — veilig om alle markdown-geïnjecteerde paragraaf-tags te verwijderen.
// VitePress injecteert <p>...</p> bij lege regels binnen component-attributen.
// <p>  → \n  (herstel de lege regel)
// </p> → ''  (afsluiter is al meegenomen door de openingstag)
const cleanCssCode = (raw: string): string => {
  if (!raw) return ''
  return cleanCode(raw)
    .replace(/<p>/g, '\n')
    .replace(/<\/p>/g, '')
}

// HTML-code: verwijder alleen de duidelijke markdown-artefacten.
// 1. Leidende </p>: spillover van een lege regel in een vorige prop (bijv. css='' met lege regel,
//    waarna de </p> aan het begin van html='' belandt).
// 2. <p> onmiddellijk vóór een HTML-tag (<): markdown opende een paragraaf bij de lege regel,
//    maar de eigenlijke inhoud is een HTML-tag, geen tekst.
// 3. </p> onmiddellijk vóór een HTML-tag: bijpassende sluiter van het bovenstaande geval.
// Echte <p>tekst</p> combinaties (zonder direct aangrenzende tags) blijven intact.
const cleanHtmlCode = (raw: string): string => {
  if (!raw) return ''
  return cleanCode(raw)
    .replace(/^<\/p>\s*/g, '')
    .replace(/<p>(\s*<)/g, '\n$1')
    .replace(/<\/p>(\s*<)/g, '\n$1')
}

const initialSourceHtml = computed(() => cleanHtmlCode(props.html || ''))
const initialSourceCss  = computed(() => cleanCssCode(props.css || ''))
const initialSourceJs   = computed(() => cleanCode(props.js || props.javascript || ''))

const hasCss = computed(() => Boolean(props.css !== undefined && props.css !== null && props.css.trim().length > 0))
const hasJs = computed(() => Boolean(
  (props.js !== undefined && props.js !== null && props.js.trim().length > 0) ||
  (props.javascript !== undefined && props.javascript !== null && props.javascript.trim().length > 0)
))
const showLanguageTabs = computed(() => hasCss.value || hasJs.value)

const hasDirectCode = computed(() => Boolean(
  (initialSourceHtml.value && initialSourceHtml.value.trim().length > 0) ||
  (initialSourceCss.value && initialSourceCss.value.trim().length > 0) ||
  (initialSourceJs.value && initialSourceJs.value.trim().length > 0)
))

const activeCodeLanguage = ref<'html' | 'css' | 'js'>(
  props.activeCodeTab || (hasCss.value && !initialSourceHtml.value.trim() ? 'css' : 'html')
)

const currentHtml = ref(initialSourceHtml.value)
const currentCss = ref(initialSourceCss.value)
const currentJs = ref(initialSourceJs.value)

const activeTab = ref<'preview' | 'code' | 'split'>(props.initialTab || 'split')
const editorEl = ref<HTMLElement | null>(null)
const bodyEl = ref<HTMLElement | null>(null)
const splitWidth = ref(50)
const isResizing = ref(false)

const startResize = (e: MouseEvent) => {
  e.preventDefault()
  isResizing.value = true
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}

const handleResize = (e: MouseEvent) => {
  if (!isResizing.value || !bodyEl.value) return
  const rect = bodyEl.value.getBoundingClientRect()
  if (rect.width <= 0) return
  const offsetX = e.clientX - rect.left
  const newWidth = (offsetX / rect.width) * 100
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
  if (!isResizing.value || !bodyEl.value || !e.touches[0]) return
  const rect = bodyEl.value.getBoundingClientRect()
  if (rect.width <= 0) return
  const offsetX = e.touches[0].clientX - rect.left
  const newWidth = (offsetX / rect.width) * 100
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

let editorView: EditorView | null = null
const themeCompartment = new Compartment()
const languageCompartment = new Compartment()
let observer: MutationObserver | null = null

const getLanguageExtension = (lang: 'html' | 'css' | 'js') => {
  if (lang === 'css') {
    return css()
  }
  if (lang === 'js') {
    return javascript()
  }
  return [html({ autoCloseTags: true }), autoCloseTags]
}

const getActiveCode = () => {
  if (activeCodeLanguage.value === 'css') return currentCss.value
  if (activeCodeLanguage.value === 'js') return currentJs.value
  return currentHtml.value
}

const switchCodeLanguage = (lang: 'html' | 'css' | 'js') => {
  if (activeCodeLanguage.value === lang) return
  activeCodeLanguage.value = lang
  if (editorView) {
    const code = getActiveCode()
    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: code,
      },
      effects: languageCompartment.reconfigure(getLanguageExtension(lang)),
    })
  }
}

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
  const htmlContent = currentHtml.value || ''
  const cssContent = currentCss.value ? currentCss.value.trim() : ''
  const jsContent = currentJs.value ? currentJs.value.trim() : ''

  if (!htmlContent && !cssContent && !jsContent) return ''

  const isFullDoc = /<html[^>]*>/i.test(htmlContent) || /<!DOCTYPE html>/i.test(htmlContent)

  if (!isFullDoc && (cssContent || jsContent)) {
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

const initEditor = () => {
  if (!editorEl.value || editorView) return

  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')

  editorView = new EditorView({
    doc: getActiveCode(),
    extensions: [
      basicSetup,
      languageCompartment.of(getLanguageExtension(activeCodeLanguage.value)),
      closeBrackets(),
      autocompletion({
        activateOnTyping: true,
        maxRenderedOptions: 30,
        defaultKeymap: true,
      }),
      createEmmetKeymap(() => activeCodeLanguage.value),
      abbreviationTracker(),
      themeCompartment.of(isDark ? oneDark : []),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const val = update.state.doc.toString()
          if (activeCodeLanguage.value === 'css') {
            currentCss.value = val
          } else if (activeCodeLanguage.value === 'js') {
            currentJs.value = val
          } else {
            currentHtml.value = val
          }
        }
      }),
      EditorView.theme({
        '&': {
          height: '100%',
          fontSize: '13px',
        },
        '.cm-scroller': {
          overflow: 'auto',
          fontFamily: 'var(--vp-font-family-mono, Consolas, Monaco, monospace)',
          lineHeight: '1.5',
        },
        '.cm-gutters': {
          borderRight: '1px solid var(--vp-c-divider)',
          backgroundColor: 'transparent',
          color: '#8b949e',
        },
        '.cm-activeLine': {
          backgroundColor: 'rgba(232, 119, 34, 0.08)',
        },
        '.cm-activeLineGutter': {
          backgroundColor: 'rgba(232, 119, 34, 0.15)',
          color: 'var(--tm-orange, #e87722)',
          fontWeight: 'bold',
        },
        '.cm-tooltip-autocomplete': {
          border: '1px solid var(--vp-c-divider)',
          backgroundColor: 'var(--vp-c-bg, #ffffff)',
          borderRadius: '6px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
          fontSize: '13px',
          zIndex: '999',
        },
        '.cm-tooltip-autocomplete > ul > li': {
          padding: '3px 8px',
          lineHeight: '1.4',
        },
        '.cm-tooltip-autocomplete > ul > li[aria-selected]': {
          backgroundColor: 'var(--tm-orange, #e87722) !important',
          color: '#ffffff !important',
        },
        '.cm-completionLabel': {
          fontFamily: 'var(--vp-font-family-mono, monospace)',
        },
        '.cm-completionDetail': {
          fontStyle: 'italic',
          color: '#8b949e',
          marginLeft: '8px',
        },
      }),
    ],
    parent: editorEl.value,
  })
}

onMounted(() => {
  if (hasDirectCode.value) {
    nextTick(() => {
      initEditor()
    })

    if (typeof document !== 'undefined') {
      observer = new MutationObserver(() => {
        if (!editorView) return
        const isDark = document.documentElement.classList.contains('dark')
        editorView.dispatch({
          effects: themeCompartment.reconfigure(isDark ? oneDark : []),
        })
      })
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      })
    }
  }
})

onBeforeUnmount(() => {
  if (editorView) {
    editorView.destroy()
    editorView = null
  }
  if (observer) {
    observer.disconnect()
    observer = null
  }
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchmove', handleTouchResize)
  document.removeEventListener('touchend', stopTouchResize)
  document.removeEventListener('touchcancel', stopTouchResize)
})

watch(initialSourceHtml, (newVal) => {
  currentHtml.value = newVal
  if (activeCodeLanguage.value === 'html' && editorView && editorView.state.doc.toString() !== newVal) {
    editorView.dispatch({
      changes: { from: 0, to: editorView.state.doc.length, insert: newVal },
    })
  }
})

watch(initialSourceCss, (newVal) => {
  currentCss.value = newVal
  if (activeCodeLanguage.value === 'css' && editorView && editorView.state.doc.toString() !== newVal) {
    editorView.dispatch({
      changes: { from: 0, to: editorView.state.doc.length, insert: newVal },
    })
  }
})

watch(initialSourceJs, (newVal) => {
  currentJs.value = newVal
  if (activeCodeLanguage.value === 'js' && editorView && editorView.state.doc.toString() !== newVal) {
    editorView.dispatch({
      changes: { from: 0, to: editorView.state.doc.length, insert: newVal },
    })
  }
})

const isModified = computed(() =>
  currentHtml.value !== initialSourceHtml.value ||
  currentCss.value !== initialSourceCss.value ||
  currentJs.value !== initialSourceJs.value
)

const resetCode = () => {
  currentHtml.value = initialSourceHtml.value
  currentCss.value = initialSourceCss.value
  currentJs.value = initialSourceJs.value
  if (editorView) {
    const code = getActiveCode()
    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: code,
      },
    })
  }
}

const openInNewTab = () => {
  if (!currentHtml.value && !currentCss.value && !currentJs.value) return
  const id = 'sb_' + Math.random().toString(36).substring(2, 9)
  const data = {
    title: props.title || 'Live codevoorbeeld',
    code: currentHtml.value,
    initialCode: initialSourceHtml.value,
    css: currentCss.value,
    initialCss: initialSourceCss.value,
    js: currentJs.value,
    initialJs: initialSourceJs.value,
    activeCodeTab: activeCodeLanguage.value,
  }
  try {
    localStorage.setItem(id, JSON.stringify(data))
  } catch (e) {
    console.warn('LocalStorage niet beschikbaar:', e)
  }
  const win = window.open('/sandbox.html?id=' + id, '_blank')
  if (win) {
    win.focus()
  }
}
</script>

<style scoped>
.sandbox-container {
  margin: 1.5rem 0;
}

.sandbox-title-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.45rem;
  padding: 0 0.15rem;
  font-size: 0.925rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.sandbox-title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--tm-orange, #e87722);
}

.sandbox-title-text {
  letter-spacing: -0.01em;
}

.sandbox-wrapper {
  margin: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.sandbox-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.45rem 0.85rem;
  background-color: var(--tm-dark-blue, #1e2d5a);
  color: #fff;
  font-size: 0.8rem;
  font-family: var(--vp-font-family-mono);
}

.sandbox-header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sandbox-header-right {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.sandbox-tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  padding: 2px;
}

.sandbox-tab-btn {
  padding: 0.2rem 0.6rem;
  font-size: 0.75rem;
  color: #d0d8e8;
  background: transparent;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.sandbox-tab-btn:hover {
  color: #ffffff;
}

.sandbox-tab-btn.active {
  background: var(--tm-orange, #e87722);
  color: #ffffff;
  font-weight: 600;
}

.sandbox-action-btn,
.sandbox-external-link {
  font-size: 0.75rem;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 4px;
  padding: 0.25rem 0.65rem;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.sandbox-action-btn:hover,
.sandbox-external-link:hover {
  background: var(--tm-orange, #e87722);
  border-color: var(--tm-orange, #e87722);
  color: #ffffff;
}

.sandbox-action-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
}

.sandbox-body {
  display: flex;
  background: #ffffff;
  width: 100%;
  border-top: 1px solid var(--vp-c-divider);
  overflow: hidden;
}

.dark .sandbox-body {
  background: #1e1e1e;
}

.sandbox-body.view-split .sandbox-code-pane {
  flex-shrink: 0;
}

.sandbox-body.view-split .sandbox-preview-pane {
  flex: 1;
  min-width: 0;
}

.sandbox-body.view-code .sandbox-code-pane {
  width: 100%;
}

.sandbox-body.view-preview .sandbox-preview-pane {
  width: 100%;
}

/* Sleepbare scheidingsbalk */
.sandbox-resizer {
  width: 8px;
  cursor: col-resize;
  background-color: var(--vp-c-divider);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: background-color 0.15s ease;
  user-select: none;
  flex-shrink: 0;
  z-index: 5;
}

.sandbox-resizer:hover,
.sandbox-resizer:active {
  background-color: var(--tm-orange, #e87722);
}

.sandbox-resizer-line {
  width: 2px;
  height: 24px;
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: 1px;
}

.dark .sandbox-resizer-line {
  background-color: rgba(255, 255, 255, 0.35);
}

.sandbox-body.is-resizing {
  user-select: none;
  cursor: col-resize;
}

.sandbox-body.is-resizing iframe {
  pointer-events: none;
}

.sandbox-code-pane,
.sandbox-preview-pane {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.sandbox-pane-label {
  padding: 0.35rem 0.75rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: #f1f4f8;
  color: #556070;
  border-bottom: 1px solid var(--vp-c-divider);
  font-family: var(--vp-font-family-mono, monospace);
  user-select: none;
}

.dark .sandbox-pane-label {
  background: #161b22;
  color: #8b949e;
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.sandbox-lang-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0.6rem;
  background: #f1f4f8;
  border-bottom: 1px solid var(--vp-c-divider);
  user-select: none;
}

.dark .sandbox-lang-header {
  background: #161b22;
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.sandbox-lang-tabs {
  display: flex;
  gap: 4px;
  background: rgba(0, 0, 0, 0.05);
  padding: 2px;
  border-radius: 4px;
}

.dark .sandbox-lang-tabs {
  background: rgba(255, 255, 255, 0.06);
}

.sandbox-lang-tab-btn {
  padding: 0.15rem 0.6rem;
  font-size: 0.7rem;
  font-family: var(--vp-font-family-mono, monospace);
  font-weight: 600;
  color: var(--vp-c-text-2);
  background: transparent;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.sandbox-lang-tab-btn:hover {
  color: var(--vp-c-text-1);
}

.sandbox-lang-tab-btn.active {
  background: var(--tm-orange, #e87722);
  color: #ffffff;
}

.sandbox-lang-badge {
  font-size: 0.65rem;
  font-family: var(--vp-font-family-mono, monospace);
  color: var(--vp-c-text-3);
  letter-spacing: 0.05em;
  padding: 0.1rem 0.4rem;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 3px;
}

.dark .sandbox-lang-badge {
  background: rgba(255, 255, 255, 0.05);
  color: var(--vp-c-text-3);
}

.sandbox-editor-container {
  flex: 1;
  width: 100%;
  min-height: 0;
  overflow: hidden;
  text-align: left;
}

.sandbox-preview-iframe {
  flex: 1;
  width: 100%;
  height: 100%;
  border: none;
  background: #ffffff;
}
</style>
