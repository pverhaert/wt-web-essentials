<template>
  <!-- Zwevende knop: alleen zichtbaar als de huidige pagina een <PageSummary> heeft -->
  <Transition name="ps-fade">
    <div v-if="hasSummary" class="ps-fab-container">
      <button
        class="ps-fab"
        type="button"
        :aria-label="isModalOpen ? 'Samenvatting sluiten' : 'Samenvatting & tips openen'"
        :aria-expanded="isModalOpen"
        @click="toggleModal"
      >
        <!-- Boek-icoon (gesloten) -->
        <svg
          v-if="!isModalOpen"
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
        <!-- Sluiten-icoon (X) -->
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <!-- Custom zwevende tooltip -->
      <div class="ps-fab-tooltip" role="tooltip">
        {{ isModalOpen ? 'Samenvatting sluiten' : 'Samenvatting & tips openen' }}
      </div>
    </div>
  </Transition>

  <!-- Backdrop + modal -->
  <Teleport to="body">
    <Transition name="ps-modal">
      <div
        v-if="isModalOpen && hasSummary"
        class="ps-backdrop"
        @click.self="closeModal"
        @keydown.esc="closeModal"
      >
        <div
          class="ps-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Samenvatting & tips"
        >
          <!-- Modal header -->
          <div class="ps-modal__header">
            <div class="ps-modal__title">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              Samenvatting & tips
              <span v-if="isAiMode" class="ps-modal__ai-badge">AI-versie</span>
            </div>
            <div class="ps-modal__actions">
              <!-- Download als Markdown knop -->
              <div class="ps-action-btn-container">
                <button
                  class="ps-modal__btn ps-modal__download-btn"
                  :class="{ 'is-downloaded': isDownloaded }"
                  type="button"
                  aria-label="Download samenvatting als Markdown"
                  @click="downloadAsMarkdown"
                >
                  <!-- Vinkje icoon indien gedownload -->
                  <svg
                    v-if="isDownloaded"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <!-- Download-icoon -->
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </button>
                <!-- Custom zwevende tooltip -->
                <div class="ps-action-tooltip" role="tooltip">
                  {{ isDownloaded ? 'Gedownload!' : 'Download samenvatting als Markdown' }}
                </div>
              </div>

              <!-- Kopiëren als Markdown knop met custom tooltip -->
              <div class="ps-action-btn-container">
                <button
                  class="ps-modal__btn ps-modal__copy-btn"
                  :class="{ 'is-copied': isCopied }"
                  type="button"
                  aria-label="Kopieer samenvatting als Markdown"
                  @click="copyAsMarkdown"
                >
                  <!-- Vinkje icoon indien gekopieerd -->
                  <svg
                    v-if="isCopied"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <!-- Kopiëren icoon -->
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                </button>

                <!-- Custom zwevende tooltip -->
                <div class="ps-action-tooltip" role="tooltip">
                  {{ isCopied ? 'Gekopieerd naar klembord!' : 'Kopieer samenvatting als Markdown' }}
                </div>
              </div>

              <!-- Sluitknop met custom tooltip -->
              <div class="ps-action-btn-container">
                <button
                  class="ps-modal__btn ps-modal__close"
                  type="button"
                  aria-label="Samenvatting sluiten"
                  @click="closeModal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                <!-- Custom zwevende tooltip -->
                <div class="ps-action-tooltip" role="tooltip">
                  Sluiten (Esc)
                </div>
              </div>
            </div>
          </div>

          <!-- Modal body: scrollbaar -->
          <div class="ps-modal__body">
            <!-- AI-waarschuwingsbalk (alleen zichtbaar in AI-modus) -->
            <div v-if="isAiMode" class="ps-ai-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <div class="ps-ai-warning__text">
                <strong>Tijdelijke AI-versie.</strong>
                Deze samenvatting is on-demand gegenereerd en wordt niet opgeslagen.
                Gebruik de download- of kopieerknop om de Markdown lokaal op te slaan.
                Aanpassingen zijn jouw eigen verantwoordelijkheid.
              </div>
              <button class="ps-ai-warning__back" type="button" @click="backToOriginal">
                Terug naar origineel
              </button>
            </div>

            <!-- Handgeschreven samenvatting (standaard) -->
            <div v-if="!isAiMode" v-html="summaryHtml" />

            <!-- AI-gegenereerde samenvatting -->
            <div v-if="isAiMode" class="ps-ai-content" @click="handleAiContentClick" v-html="aiGeneratedHtml" />

            <!-- AI-personalisatie-paneel (altijd onderaan, ook in AI-modus) -->
            <div class="ps-ai-panel">
              <div class="ps-ai-panel__divider">
                <span>Personaliseer met AI</span>
              </div>

              <!-- Geen API-sleutel: hint tonen -->
              <div v-if="!hasApiKey" class="ps-ai-panel__no-key">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>
                  Configureer de
                  <a href="/tools/ai-assistent" @click="closeModal">AI Tutor</a>
                  om deze functie te gebruiken.
                </span>
              </div>

              <!-- API-sleutel aanwezig: personalisatie-UI -->
              <template v-else>
                <!-- Suggestie-chips -->
                <div class="ps-ai-chips" role="group" aria-label="Aanpassingsopties">
                  <button
                    v-for="chip in CHIPS"
                    :key="chip.id"
                    type="button"
                    class="ps-ai-chip"
                    :class="{ 'is-selected': selectedChips.includes(chip.id) }"
                    :aria-pressed="selectedChips.includes(chip.id)"
                    @click="toggleChip(chip.id)"
                  >
                    {{ chip.label }}
                  </button>
                </div>

                <!-- Vrij tekstveld -->
                <textarea
                  v-model="customInstruction"
                  class="ps-ai-textarea"
                  rows="2"
                  placeholder="Bijv.: voeg een vergelijking toe tussen margin en padding, of leg flex-items uit met een tabeloverzicht..."
                  aria-label="Eigen aanpassingsinstructies"
                />

                <!-- Genereer-knop + foutmelding -->
                <div class="ps-ai-panel__actions">
                  <button
                    type="button"
                    class="ps-ai-generate-btn"
                    :disabled="!canGenerate || aiIsLoading"
                    @click="generateAiSummary"
                  >
                    <!-- Laad-spinner -->
                    <svg
                      v-if="aiIsLoading"
                      class="ps-ai-spinner"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    <!-- Spark-icoon -->
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    {{ aiIsLoading ? 'Genereren...' : 'Genereer persoonlijke versie' }}
                  </button>
                </div>

                <!-- Foutmelding -->
                <div v-if="aiError" class="ps-ai-error">
                  {{ aiError }}
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useData } from 'vitepress'
import { marked } from 'marked'
import { GoogleGenAI } from '@google/genai'
import { usePageSummary } from '../composables/usePageSummary'
import { useAiTutor } from '../composables/useAiTutor'
import { htmlToMarkdown } from '../utils/htmlToMarkdown'

const { hasSummary, summaryHtml, isModalOpen, closeModal, toggleModal } = usePageSummary()
const { hasApiKey, apiKey, selectedModel } = useAiTutor()
const route = useRoute()
const { page } = useData()

// Helper om HTML-tekens in codeblokken veilig te escapen
const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Configureer marked voor codeblok weergave met live sandbox-knop en copy-knop
marked.setOptions({
  gfm: true,
  breaks: true,
})

marked.use({
  renderer: {
    code(token: { text: string; lang?: string }) {
      const lang = (token.lang || '').trim().toLowerCase()
      const escaped = escapeHtml(token.text)
      const langLabel = lang ? `<span class="ps-code-lang">${lang}</span>` : '<span class="ps-code-lang">code</span>'
      const isHtmlOrCss = lang === 'html' || lang === 'css' || lang === 'htm'
      const sandboxBtn = isHtmlOrCss
        ? `<button type="button" class="ps-code-btn ps-open-sandbox-btn" title="Open in interactieve Fullscreen Sandbox" aria-label="Open in Sandbox">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
            <span>Sandbox</span>
          </button>`
        : ''

      return `<div class="ps-code-block-wrapper" data-lang="${lang}">
  <div class="ps-code-block-header">
    <div class="ps-code-block-header-left">
      ${langLabel}
    </div>
    <div class="ps-code-block-header-right">
      ${sandboxBtn}
      <button type="button" class="ps-code-btn ps-copy-code-btn" title="Kopieer code naar klembord" aria-label="Kopieer code">
        <svg class="ps-copy-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <svg class="ps-check-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span class="ps-copy-btn-text">Kopiëren</span>
      </button>
    </div>
  </div>
  <pre><code class="${lang ? `language-${lang}` : ''}">${escaped}</code></pre>
</div>`
    },
  },
})

// =========================================
// Suggestie-chips definitie
// =========================================
const CHIPS = [
  { id: 'simplify', label: 'Vereenvoudig', prompt: 'Vereenvoudig de taal: gebruik kortere zinnen en eenvoudigere woorden, geschikt voor absolute beginners.' },
  { id: 'examples', label: 'Meer voorbeelden', prompt: 'Voeg bij elk concept een extra concreet, werkend codevoorbeeld toe. Als een voorbeeld zowel HTML als CSS vereist (of styling toont), plaats dit dan ALTIJD samen in één enkel ```html codeblok met een <style>...</style> blok in de <head> en minstens één element in de <body>. Splits HTML en CSS NOOIT op in losse blokken, zodat ze in de interactieve sandbox samenwerken.' },
  { id: 'extended', label: 'Uitgebreidere uitleg', prompt: 'Geef bij elk onderdeel een beknopte extra uitleg (1-2 zinnen) zodat de context duidelijker is.' },
  { id: 'mnemonics', label: 'Ezelsbruggetjes', prompt: 'Voeg bij moeilijke of verwarrende concepten een geheugensteuntje of ezelsbruggetje toe. Plaats ELK ezelsbruggetje of geheugensteuntje altijd op een EIGEN, NIEUWE REGEL als een markdown-citaatblok met het vetgedrukte label aan het begin, exact zoals dit formaat:\n> **Ezelsbruggetje:** [jouw geheugensteuntje hier]\n(Plaats dit NOOIT inline in een lopende zin of als onderdeel van een gewone opsomming).' },
]

// =========================================
// State: copy / download
// =========================================
const isCopied = ref(false)
const isDownloaded = ref(false)
let copyTimeout: ReturnType<typeof setTimeout> | null = null
let downloadTimeout: ReturnType<typeof setTimeout> | null = null

// =========================================
// State: AI-personalisatie
// =========================================
const isAiMode = ref(false)
const aiGeneratedHtml = ref('')
const aiGeneratedMarkdown = ref('')
const aiIsLoading = ref(false)
const aiError = ref<string | null>(null)
const selectedChips = ref<string[]>([])
const customInstruction = ref('')

// =========================================
// Computed: huidige Markdown-inhoud (origineel of AI)
// =========================================
const currentMarkdown = computed(() => {
  const pageTitle = page.value?.title || document.querySelector('h1')?.textContent?.trim() || 'Samenvatting'
  const body = isAiMode.value
    ? aiGeneratedMarkdown.value
    : htmlToMarkdown(summaryHtml.value)
  return `# Samenvatting: ${pageTitle}\n\n${body}\n`
})

const canGenerate = computed(() => {
  return selectedChips.value.length > 0 || customInstruction.value.trim().length > 0
})

// =========================================
// Download als .md-bestand
// =========================================
function downloadAsMarkdown() {
  const pageTitle = page.value?.title || document.querySelector('h1')?.textContent?.trim() || 'samenvatting'
  const slug = pageTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  const filename = `samenvatting-${slug}.md`

  const blob = new Blob([currentMarkdown.value], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  isDownloaded.value = true
  if (downloadTimeout) clearTimeout(downloadTimeout)
  downloadTimeout = setTimeout(() => {
    isDownloaded.value = false
  }, 2200)
}

// =========================================
// Kopieer als Markdown
// =========================================
async function copyAsMarkdown() {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(currentMarkdown.value)
    } else {
      const ta = document.createElement('textarea')
      ta.value = currentMarkdown.value
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }

    isCopied.value = true
    if (copyTimeout) clearTimeout(copyTimeout)
    copyTimeout = setTimeout(() => {
      isCopied.value = false
    }, 2200)
  } catch (err) {
    console.error('Kopiëren van samenvatting mislukt:', err)
  }
}

// =========================================
// AI: chip-selectie toggling
// =========================================
function toggleChip(id: string) {
  const idx = selectedChips.value.indexOf(id)
  if (idx === -1) {
    selectedChips.value.push(id)
  } else {
    selectedChips.value.splice(idx, 1)
  }
}

// =========================================
// AI: genereer gepersonaliseerde samenvatting
// =========================================
async function generateAiSummary() {
  if (!canGenerate.value || aiIsLoading.value || !apiKey.value) return

  aiIsLoading.value = true
  aiError.value = null

  try {
    // Vertrek van de huidige versie: als er al een AI-versie actief is, bouwen we daarop verder
    const baseMarkdown = isAiMode.value && aiGeneratedMarkdown.value.trim()
      ? aiGeneratedMarkdown.value
      : htmlToMarkdown(summaryHtml.value)
    const pageTitle = page.value?.title || 'samenvatting'

    // Stel aanpassingsinstructies samen
    const chipInstructions = selectedChips.value
      .map(id => CHIPS.find(c => c.id === id)?.prompt)
      .filter(Boolean)
      .join('\n')
    const instructions = [chipInstructions, customInstruction.value.trim()]
      .filter(Boolean)
      .join('\n')

    const prompt = `Je bent een hulpzame assistent voor het vak 'Web Essentials' aan Thomas More Hogeschool (Campus Geel).
Herschrijf de volgende Markdown-samenvatting over het onderwerp "${pageTitle}" op basis van de aanpassingsinstructies hieronder.
Behoud dezelfde basisstructuur (### koppen, tabellen, lijsten), maar pas de inhoud aan volgens de gevraagde instructies.
Als er codevoorbeelden gevraagd worden (via de chips of wanneer de gebruiker in het tekstveld vraagt naar 'voorbeeld', 'code', 'oefening', etc.):
- Combineer HTML en CSS ALTIJD in één enkel \`\`\`html codeblok.
- Plaats alle benodigde CSS in een <style>...</style> blok binnen de <head> en de HTML-elementen in de <body>.
- Splits HTML en CSS NOOIT op in afzonderlijke codeblokken, zodat de student het voorbeeld meteen als één complete, interactieve live sandbox kan openen en testen.
Als er ezelsbruggetjes of geheugensteuntjes gevraagd worden, plaats ELK ezelsbruggetje of geheugensteuntje ALTIJD op een eigen, nieuwe regel als een markdown-citaatblok, exact zoals:
> **Ezelsbruggetje:** [jouw geheugensteuntje hier]
Plaats een ezelsbruggetje NOOIT inline in een alinea of als gewoon lijstitem.
Geef ALLEEN de aangepaste Markdown-samenvatting terug, zonder extra uitleg, introductie of omkadering.

=== Huidige samenvatting ===
${baseMarkdown}

=== Aanpassingsinstructies ===
${instructions}`

    const ai = new GoogleGenAI({ apiKey: apiKey.value })
    const response = await ai.models.generateContent({
      model: selectedModel.value || 'gemini-2.5-flash',
      contents: prompt,
    })

    const rawMarkdown = response.text || ''
    if (!rawMarkdown.trim()) {
      throw new Error('Geen geldige Markdown ontvangen van de AI.')
    }

    aiGeneratedMarkdown.value = rawMarkdown
    let html = marked.parse(rawMarkdown) as string
    // Transformeer blockquotes of paragrafen met Ezelsbruggetje / Geheugensteuntje naar een gemarkeerd ps-mnemonic blok
    html = html.replace(
      /<blockquote>(\s*<p>\s*<strong>(?:Ezelsbruggetje|Geheugensteuntje|Mnemonic):?<\/strong>[\s\S]*?<\/p>\s*)<\/blockquote>/gi,
      '<div class="ps-mnemonic"><div class="ps-mnemonic__content">$1</div></div>'
    )
    aiGeneratedHtml.value = html
    isAiMode.value = true

    // Deselecteer alle gekozen chips en maak het tekstveld leeg na succesvolle generatie
    selectedChips.value = []
    customInstruction.value = ''
  } catch (err: any) {
    console.error('Fout bij AI-generatie:', err)
    const raw = err?.message || 'Onbekende fout.'
    if (raw.includes('API_KEY_INVALID') || raw.includes('403') || raw.includes('401')) {
      aiError.value = 'De API-sleutel lijkt ongeldig. Controleer je instellingen bij de AI Tutor.'
    } else if (raw.includes('RESOURCE_EXHAUSTED') || raw.includes('429')) {
      aiError.value = 'Het API-quotum is tijdelijk bereikt. Probeer het later opnieuw of kies een ander model.'
    } else {
      aiError.value = `Generatie mislukt: ${raw}`
    }
  } finally {
    aiIsLoading.value = false
  }
}

// =========================================
// AI: terug naar originele samenvatting
// =========================================
function backToOriginal() {
  isAiMode.value = false
  aiGeneratedHtml.value = ''
  aiGeneratedMarkdown.value = ''
  aiError.value = null
}

// =========================================
// AI: klikacties binnen gegenereerde content (Sandbox & Copy)
// =========================================
async function handleAiContentClick(e: MouseEvent) {
  const target = e.target as HTMLElement | null
  if (!target) return

  // 1. Klik op "Sandbox"-knop
  const sandboxBtn = target.closest('.ps-open-sandbox-btn') as HTMLButtonElement | null
  if (sandboxBtn) {
    const wrapper = sandboxBtn.closest('.ps-code-block-wrapper')
    const lang = (wrapper?.getAttribute('data-lang') || 'html').toLowerCase()
    const codeEl = wrapper?.querySelector('pre code') || wrapper?.querySelector('pre')
    const code = codeEl?.textContent || ''

    const id = 'sb_' + Math.random().toString(36).substring(2, 9)
    const isCss = lang === 'css'

    let extractedHtml = code
    let extractedCss = isCss ? code : ''

    // Als het een HTML-blok is dat een <style>...</style> tag bevat, ontleden we HTML en CSS voor de sandbox tabs
    if (!isCss && /<style[^>]*>([\s\S]*?)<\/style>/i.test(code)) {
      const styleMatch = code.match(/<style[^>]*>([\s\S]*?)<\/style>/i)
      if (styleMatch) {
        extractedCss = styleMatch[1].trim()
        // Verwijder het style blok uit de HTML broncode in de editor, zodat studenten in het HTML-tabblad zuivere HTML zien
        // en in het CSS-tabblad de styling (terwijl de sandbox ze combineert)
        extractedHtml = code.replace(/<style[^>]*>[\s\S]*?<\/style>\s*/i, '').trim()
      }
    }

    const data = {
      title: (page.value?.title || 'Web Essentials') + ' - AI Voorbeeld',
      code: isCss
        ? '<!DOCTYPE html>\n<html lang="nl">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Voorbeeld</title>\n  <link rel="stylesheet" href="stijl.css">\n</head>\n<body>\n  <h1>Voorbeeld</h1>\n  <p>Pas de CSS aan om het resultaat te zien.</p>\n</body>\n</html>'
        : extractedHtml,
      initialCode: isCss ? '' : extractedHtml,
      css: extractedCss,
      initialCss: extractedCss,
      js: '',
      initialJs: '',
      activeCodeTab: isCss ? 'css' : 'html',
      height: '450px',
    }

    try {
      localStorage.setItem(id, JSON.stringify(data))
    } catch (err) {
      console.warn('Kon sandbox niet opslaan in localStorage:', err)
    }

    const win = window.open('/sandbox.html?id=' + id, '_blank')
    if (win) win.focus()
    return
  }

  // 2. Klik op "Kopiëren"-knop van een codeblok
  const copyBtn = target.closest('.ps-copy-code-btn') as HTMLButtonElement | null
  if (copyBtn) {
    const wrapper = copyBtn.closest('.ps-code-block-wrapper')
    const codeEl = wrapper?.querySelector('pre code') || wrapper?.querySelector('pre')
    const codeText = codeEl?.textContent || ''

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(codeText)
      } else {
        const ta = document.createElement('textarea')
        ta.value = codeText
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }

      copyBtn.classList.add('is-copied')
      const textSpan = copyBtn.querySelector('.ps-copy-btn-text')
      if (textSpan) textSpan.textContent = 'Gekopieerd!'

      setTimeout(() => {
        copyBtn.classList.remove('is-copied')
        if (textSpan) textSpan.textContent = 'Kopiëren'
      }, 2000)
    } catch (err) {
      console.error('Kopiëren van code mislukt:', err)
    }
  }
}

// =========================================
// Reset bij paginawissel (SPA-navigatie)
// =========================================
watch(() => route.path, () => {
  closeModal()
  isCopied.value = false
  isDownloaded.value = false
  isAiMode.value = false
  aiGeneratedHtml.value = ''
  aiGeneratedMarkdown.value = ''
  aiError.value = null
  selectedChips.value = []
  customInstruction.value = ''
})

// Reset AI-staat ook bij sluiten van de modal
watch(isModalOpen, (open) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = open ? 'hidden' : ''
  }
})

// =========================================
// Sluit modal met Escape-toets
// =========================================
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isModalOpen.value) {
    closeModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* =============================================
   ZWEVENDE KNOP (FAB = Floating Action Button)
   Gepositioneerd net boven de BackToTop-knop
   BackToTop: right 24px, bottom 24px, hoogte 44px
   Deze knop: right 24px, bottom 80px (= 24 + 44 + 12 gap)
   ============================================= */
.ps-fab-container {
  position: fixed;
  right: 24px;
  bottom: 80px;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ps-fab {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background-color: var(--tm-orange, #ec6639);
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(236, 102, 57, 0.45);
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
  outline: none;
}

.ps-fab:hover {
  background-color: var(--vp-c-brand-2, #d05a32);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(236, 102, 57, 0.55);
}

.ps-fab:active {
  transform: translateY(0) scale(0.95);
}

/* Custom zwevende tooltip links van de knop */
.ps-fab-tooltip {
  position: absolute;
  right: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%) translateX(4px);
  padding: 6px 11px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
  white-space: nowrap;
  background-color: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              visibility 0.2s;
  z-index: 100;
}

/* Pijltje aan de rechterkant van de tooltip wijzend naar de knop */
.ps-fab-tooltip::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  border: 5px solid transparent;
  border-left-color: var(--vp-c-divider);
}

.ps-fab-tooltip::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  border: 4px solid transparent;
  border-left-color: var(--vp-c-bg-elv);
}

.ps-fab-container:hover .ps-fab-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(0);
  transition-delay: 0.15s;
}

/* =============================================
   BACKDROP
   ============================================= */
.ps-backdrop {
  position: fixed;
  inset: 0;
  z-index: 200;
  background-color: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 3vw, 2rem);
}

/* =============================================
   MODAL VENSTER
   ============================================= */
.ps-modal {
  position: relative;
  width: 100%;
  max-width: 860px;
  max-height: calc(100vh - clamp(2rem, 6vh, 4rem));
  display: flex;
  flex-direction: column;
  background-color: var(--vp-c-bg);
  border: 1.5px solid var(--tm-orange, #ec6639);
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

/* =============================================
   MODAL HEADER
   ============================================= */
.ps-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.25rem;
  background-color: var(--tm-orange, #ec6639);
  flex-shrink: 0;
}

.ps-modal__title {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.01em;
}

.ps-modal__ai-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  background-color: rgba(255, 255, 255, 0.25);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.ps-modal__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ps-action-btn-container {
  position: relative;
  display: flex;
  align-items: center;
}

.ps-modal__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;
  outline: none;
}

.ps-modal__btn:hover {
  background-color: rgba(255, 255, 255, 0.35);
  transform: translateY(-1px);
}

.ps-modal__btn:active {
  transform: translateY(0) scale(0.95);
}

.ps-modal__copy-btn.is-copied,
.ps-modal__download-btn.is-downloaded {
  background-color: #10b981;
  color: #ffffff;
}

/* Custom zwevende tooltip onder/boven de headerknoppen */
.ps-action-tooltip {
  position: absolute;
  top: calc(100% + 9px);
  right: 0;
  padding: 6px 11px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
  white-space: nowrap;
  background-color: var(--vp-c-bg-elv);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transform: translateY(4px);
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              visibility 0.2s;
  z-index: 100;
}

/* Pijltje aan de bovenkant van de tooltip wijzend naar de header knop */
.ps-action-tooltip::before {
  content: '';
  position: absolute;
  bottom: 100%;
  right: 11px;
  border: 5px solid transparent;
  border-bottom-color: var(--vp-c-divider);
}

.ps-action-tooltip::after {
  content: '';
  position: absolute;
  bottom: 100%;
  right: 12px;
  border: 4px solid transparent;
  border-bottom-color: var(--vp-c-bg-elv);
}

.ps-action-btn-container:hover .ps-action-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  transition-delay: 0.15s;
}

/* =============================================
   MODAL BODY — eigen scrollbar
   ============================================= */
.ps-modal__body {
  overflow-y: auto;
  padding: 1.5rem 1.75rem 1rem;
  flex: 1;
  min-height: 0;
}

/* Scrollbar styling (Webkit) */
.ps-modal__body::-webkit-scrollbar {
  width: 6px;
}
.ps-modal__body::-webkit-scrollbar-track {
  background: transparent;
}
.ps-modal__body::-webkit-scrollbar-thumb {
  background-color: rgba(236, 102, 57, 0.35);
  border-radius: 3px;
}
.ps-modal__body::-webkit-scrollbar-thumb:hover {
  background-color: rgba(236, 102, 57, 0.6);
}

/* =============================================
   AI-WAARSCHUWINGSBALK
   ============================================= */
.ps-ai-warning {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 0.75rem 1rem;
  margin-bottom: 1.25rem;
  border-radius: 8px;
  background-color: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.4);
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
  line-height: 1.55;
  flex-wrap: wrap;
}

.ps-ai-warning svg {
  flex-shrink: 0;
  margin-top: 2px;
  color: #d97706;
}

.ps-ai-warning__text {
  flex: 1;
  min-width: 0;
}

.ps-ai-warning__text strong {
  color: #b45309;
  display: block;
  margin-bottom: 2px;
}

.ps-ai-warning__back {
  flex-shrink: 0;
  align-self: center;
  padding: 4px 12px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  white-space: nowrap;
}

.ps-ai-warning__back:hover {
  background-color: var(--vp-c-bg-elv);
}

/* =============================================
   INHOUD STIJLEN (via v-html, scoped werkt niet
   → gebruik :deep() of voeg toe aan style.css)
   ============================================= */
.ps-modal__body :deep(h3),
.ps-modal__body :deep(h4) {
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--tm-orange-text, #ec6639);
  margin-top: 1.5rem;
  margin-bottom: 0.6rem;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.ps-modal__body :deep(h3:first-child),
.ps-modal__body :deep(h4:first-child) {
  margin-top: 0;
}

.ps-modal__body :deep(p) {
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
  margin-bottom: 0.6rem;
}

.ps-modal__body :deep(ul),
.ps-modal__body :deep(ol) {
  font-size: 0.9rem;
  line-height: 1.7;
  padding-left: 1.75rem;
  margin-bottom: 0.75rem;
  color: var(--vp-c-text-1);
}

.ps-modal__body :deep(ul) {
  list-style-type: disc;
}

.ps-modal__body :deep(ol) {
  list-style-type: decimal;
}

.ps-modal__body :deep(li) {
  margin-bottom: 0.3rem;
}

.ps-modal__body :deep(li strong),
.ps-modal__body :deep(p strong) {
  color: var(--vp-c-text-1);
  font-weight: 600;
}

/* Tabel */
.ps-modal__body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

.ps-modal__body :deep(th) {
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-weight: 600;
  text-align: left;
  padding: 0.5rem 0.8rem;
  border: 1px solid var(--vp-c-divider);
}

.ps-modal__body :deep(td) {
  padding: 0.45rem 0.8rem;
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  vertical-align: top;
}

.ps-modal__body :deep(tr:nth-child(even) td) {
  background-color: var(--vp-c-bg-soft);
}

/* Inline code */
.ps-modal__body :deep(code) {
  font-size: 0.82rem;
  padding: 0.12em 0.38em;
  border-radius: 4px;
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-mono);
  white-space: nowrap;
}

/* =============================================
   EZELSBRUGGETJES / GEHEUGENSTEUNTJES
   Opvallend kader met eigen kleur op nieuwe regel
   ============================================= */
.ps-modal__body :deep(.ps-mnemonic),
.ps-modal__body :deep(blockquote) {
  display: block;
  margin: 0.9rem 0;
  padding: 0.75rem 1rem 0.75rem 1.1rem;
  border-radius: 0 8px 8px 0;
  border-left: 4px solid #6366f1;
  background-color: rgba(99, 102, 241, 0.08);
  box-shadow: 0 1px 3px rgba(99, 102, 241, 0.06);
}

:global(.dark) .ps-modal__body :deep(.ps-mnemonic),
:global(.dark) .ps-modal__body :deep(blockquote) {
  border-left-color: #818cf8;
  background-color: rgba(129, 140, 248, 0.12);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.ps-modal__body :deep(.ps-mnemonic p),
.ps-modal__body :deep(blockquote p) {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--vp-c-text-1);
}

.ps-modal__body :deep(.ps-mnemonic strong:first-child),
.ps-modal__body :deep(blockquote strong:first-child) {
  color: #4f46e5;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-right: 0.35rem;
}

:global(.dark) .ps-modal__body :deep(.ps-mnemonic strong:first-child),
:global(.dark) .ps-modal__body :deep(blockquote strong:first-child) {
  color: #a5b4fc;
}

/* =============================================
   AI-CONTENT (gegenereerde versie)
   Gebruikt dezelfde :deep()-stijlen als boven
   ============================================= */
.ps-ai-content :deep(h1),
.ps-ai-content :deep(h2) {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
}

/* Codeblokken met Sandbox- en Copy-acties in AI-inhoud */
.ps-modal__body :deep(.ps-code-block-wrapper) {
  margin: 0.85rem 0;
  border-radius: 8px;
  background-color: var(--vp-code-block-bg, #f6f8fa);
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

:global(.dark) .ps-modal__body :deep(.ps-code-block-wrapper) {
  background-color: var(--vp-code-block-bg, #1e2024);
  border-color: rgba(255, 255, 255, 0.1);
}

.ps-modal__body :deep(.ps-code-block-header) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.4rem 0.75rem;
  background-color: rgba(0, 0, 0, 0.035);
  border-bottom: 1px solid var(--vp-c-divider);
  user-select: none;
}

:global(.dark) .ps-modal__body :deep(.ps-code-block-header) {
  background-color: rgba(255, 255, 255, 0.035);
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.ps-modal__body :deep(.ps-code-lang) {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ps-modal__body :deep(.ps-code-block-header-right) {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.ps-modal__body :deep(.ps-code-btn) {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.55rem;
  font-size: 0.72rem;
  font-weight: 500;
  font-family: inherit;
  color: var(--vp-c-text-2);
  background: transparent;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
  line-height: 1;
}

.ps-modal__body :deep(.ps-code-btn:hover) {
  background-color: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
}

.ps-modal__body :deep(.ps-open-sandbox-btn) {
  color: var(--tm-orange, #ec6639);
  border-color: rgba(236, 102, 57, 0.35);
  background-color: rgba(236, 102, 57, 0.06);
}

.ps-modal__body :deep(.ps-open-sandbox-btn:hover) {
  background-color: var(--tm-orange, #ec6639);
  border-color: var(--tm-orange, #ec6639);
  color: #ffffff;
}

.ps-modal__body :deep(.ps-copy-code-btn.is-copied) {
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.25);
}

.ps-modal__body :deep(.ps-copy-code-btn .ps-check-icon) {
  display: none;
  color: #10b981;
}

.ps-modal__body :deep(.ps-copy-code-btn.is-copied .ps-copy-icon) {
  display: none;
}

.ps-modal__body :deep(.ps-copy-code-btn.is-copied .ps-check-icon) {
  display: inline-block;
}

.ps-modal__body :deep(pre) {
  margin: 0;
  padding: 0.85rem 1rem;
  overflow-x: auto;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.83rem;
  line-height: 1.55;
  background: transparent !important;
  color: var(--vp-c-text-1);
}

.ps-modal__body :deep(pre code) {
  padding: 0;
  background: transparent !important;
  color: inherit !important;
  font-size: inherit;
  border: none;
  white-space: pre;
}

/* =============================================
   AI-PERSONALISATIE-PANEEL
   ============================================= */
.ps-ai-panel {
  margin-top: 1.5rem;
  padding-top: 0;
}

.ps-ai-panel__divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: var(--vp-c-text-3);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.ps-ai-panel__divider::before,
.ps-ai-panel__divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: var(--vp-c-divider);
}

/* Geen API-sleutel: hint */
.ps-ai-panel__no-key {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.9rem;
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  font-size: 0.84rem;
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
}

.ps-ai-panel__no-key svg {
  flex-shrink: 0;
  color: var(--vp-c-text-3);
}

.ps-ai-panel__no-key a {
  color: var(--tm-orange, #ec6639);
  text-decoration: none;
  font-weight: 500;
}

.ps-ai-panel__no-key a:hover {
  text-decoration: underline;
}

/* Suggestie-chips */
.ps-ai-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 0.75rem;
}

.ps-ai-chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  line-height: 1.4;
}

.ps-ai-chip:hover {
  border-color: var(--tm-orange, #ec6639);
  color: var(--tm-orange, #ec6639);
}

.ps-ai-chip.is-selected {
  background-color: rgba(236, 102, 57, 0.1);
  border-color: var(--tm-orange, #ec6639);
  color: var(--tm-orange, #ec6639);
  font-weight: 600;
}

/* Vrij tekstveld */
.ps-ai-textarea {
  width: 100%;
  padding: 0.6rem 0.85rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
  line-height: 1.55;
  font-family: var(--vp-font-family-base);
  resize: vertical;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
  margin-bottom: 0.75rem;
}

.ps-ai-textarea:focus {
  border-color: var(--tm-orange, #ec6639);
}

.ps-ai-textarea::placeholder {
  color: var(--vp-c-text-3);
}

/* Genereer-knop + acties */
.ps-ai-panel__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.ps-ai-generate-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 1.1rem;
  border-radius: 8px;
  border: none;
  background-color: var(--tm-orange, #ec6639);
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.15s ease;
  outline: none;
}

.ps-ai-generate-btn:hover:not(:disabled) {
  background-color: var(--vp-c-brand-2, #d05a32);
  transform: translateY(-1px);
}

.ps-ai-generate-btn:active:not(:disabled) {
  transform: translateY(0) scale(0.97);
}

.ps-ai-generate-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* Laad-spinner animatie */
.ps-ai-spinner {
  animation: ps-spin 0.8s linear infinite;
}

@keyframes ps-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* Foutmelding */
.ps-ai-error {
  padding: 0.6rem 0.9rem;
  border-radius: 8px;
  background-color: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #dc2626;
  font-size: 0.84rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
}

/* =============================================
   ANIMATIES
   ============================================= */

/* Zwevende knop */
.ps-fade-enter-active,
.ps-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.ps-fade-enter-from,
.ps-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Modal + backdrop */
.ps-modal-enter-active {
  transition: opacity 0.22s ease;
}
.ps-modal-leave-active {
  transition: opacity 0.18s ease;
}
.ps-modal-enter-from,
.ps-modal-leave-to {
  opacity: 0;
}
.ps-modal-enter-active .ps-modal,
.ps-modal-leave-active .ps-modal {
  transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.ps-modal-enter-from .ps-modal {
  transform: scale(0.95) translateY(8px);
}
.ps-modal-leave-to .ps-modal {
  transform: scale(0.97) translateY(4px);
}

/* =============================================
   PRINT
   ============================================= */
@media print {
  .ps-fab-container {
    display: none !important;
  }
}
</style>
