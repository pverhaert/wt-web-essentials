<template>
  <div class="ai-assistant-root" :class="{ 'is-resizing': isResizing }">
    <!-- Slide-over Chat Drawer & Backdrop (geopend via AiAssistantNavButton in de navigatiebalk) -->
    <Transition name="drawer">
      <div v-if="isOpen" class="ai-drawer-backdrop" @click="handleBackdropClick">
        <aside
          class="ai-drawer"
          :style="{ width: drawerWidth + 'px' }"
          @click.stop
        >
          <!-- Sleepbare linker scheidingsbalk -->
          <div
            class="ai-drawer-resizer"
            :class="{ 'is-resizing': isResizing }"
            title="Sleep om de breedte aan te passen (dubbelklik voor standaardbreedte)"
            @mousedown="startResize"
            @touchstart.prevent="startTouchResize"
            @dblclick="resetWidth"
          >
            <div class="ai-drawer-resizer-line"></div>
          </div>

          <!-- Header -->
          <header class="ai-drawer-header">
            <div class="ai-drawer-header-left">
              <div class="ai-drawer-avatar">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                  <rect x="4" y="8" width="16" height="12" rx="2" />
                  <circle cx="9" cy="13" r="1" />
                  <circle cx="15" cy="13" r="1" />
                  <path d="M10 17h4" />
                </svg>
              </div>
              <div class="ai-drawer-title-box">
                <div class="ai-drawer-title-row">
                  <h2 class="ai-drawer-title">Web Essentials Tutor</h2>
                  <span v-if="studentName" class="ai-student-pill" :title="'Aangemeld als ' + studentName">
                    {{ studentName }}
                  </span>
                </div>
                <div class="ai-drawer-subtitle">
                  {{ activeModelDisplayName }}
                </div>
              </div>
            </div>

            <div class="ai-drawer-header-actions">
              <!-- Chat exporteren als Markdown knop -->
              <button
                v-if="messages.length > 0 && !isShowingSettings"
                type="button"
                class="ai-icon-btn"
                title="Volledig gesprek exporteren als Markdown (.md)"
                aria-label="Chat exporteren als Markdown"
                @click="handleExportMarkdown"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>

              <!-- Chat wissen knop -->
              <button
                v-if="messages.length > 0 && !isShowingSettings"
                type="button"
                class="ai-icon-btn"
                title="Gespreksgeschiedenis wissen"
                aria-label="Gespreksgeschiedenis wissen"
                @click="handleClearChat"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>

              <!-- Instellingen wisselknop -->
              <button
                type="button"
                class="ai-icon-btn"
                :class="{ active: isShowingSettings }"
                :title="isShowingSettings ? 'Terug naar chat' : 'Instellingen openen'"
                aria-label="Instellingen"
                @click="isShowingSettings = !isShowingSettings"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>

              <!-- Sluitknop -->
              <button
                type="button"
                class="ai-icon-btn"
                title="Sluit assistent"
                aria-label="Sluit assistent"
                @click="isOpen = false"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </header>

          <!-- Context Banner: Huidige lespagina -->
          <div class="ai-context-banner">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <span class="ai-context-text">
              Onderwerp: <strong>{{ currentPageTitle }}</strong>
            </span>
          </div>

          <!-- Modus: Instellingenpaneel -->
          <div v-if="isShowingSettings" class="ai-settings-view">
            <h3 class="ai-settings-title">Voorkeuren & Instellingen</h3>

            <!-- Studentennaam wijzigen -->
            <div class="ai-setting-item">
              <label class="ai-setting-label" for="drawer-name">Jouw voornaam:</label>
              <div class="ai-setting-input-row">
                <input
                  id="drawer-name"
                  v-model="nameInput"
                  type="text"
                  class="ai-setting-input"
                  placeholder="Bijv. Patrick"
                  @keydown.enter="handleSaveName"
                />
                <button type="button" class="ai-setting-btn" @click="handleSaveName">
                  Opslaan
                </button>
                <button
                  v-if="studentName"
                  type="button"
                  class="ai-setting-btn-danger-outline"
                  title="Naam wissen"
                  @click="handleClearName"
                >
                  Wissen
                </button>
              </div>
            </div>

            <!-- Model selectie (enkel Gemini Flash en Pro) -->
            <div class="ai-setting-item">
              <div class="ai-setting-label-row">
                <label class="ai-setting-label" for="drawer-model">Gemini Model:</label>
                <button
                  type="button"
                  class="ai-link-btn"
                  title="Haal de nieuwste lijst van modellen op"
                  @click="fetchModels"
                >
                  Verversen
                </button>
              </div>
              <select id="drawer-model" v-model="selectedModelProxy" class="ai-setting-select">
                <option v-for="m in availableModels" :key="m.id" :value="m.id">
                  {{ m.name }}
                </option>
              </select>
              <p class="ai-setting-hint-text">
                Kies bij voorkeur <strong>Gemini 2.5 Flash</strong> voor snelle, nauwkeurige en didactisch afgestemde antwoorden.
              </p>
            </div>

            <!-- API-sleutel beheer -->
            <div class="ai-setting-item">
              <label class="ai-setting-label">API-sleutel:</label>
              <div class="ai-key-box">
                <span class="ai-key-code">{{ maskedApiKey }}</span>
                <button
                  type="button"
                  class="ai-btn-text-danger"
                  @click="handleClearKey"
                >
                  Sleutel wissen
                </button>
              </div>
            </div>

            <!-- Chatgeschiedenis wissen -->
            <div class="ai-setting-item ai-setting-item-border">
              <button
                type="button"
                class="ai-btn-clear-chat"
                :disabled="messages.length === 0"
                @click="handleClearChat"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Gespreksgeschiedenis wissen
              </button>
            </div>

            <div class="ai-settings-footer">
              <button
                type="button"
                class="ai-btn-primary-full"
                @click="isShowingSettings = false"
              >
                Klaar en terug naar chat
              </button>
            </div>
          </div>

          <!-- Modus: Chatberichten lijst -->
          <div v-else ref="messagesContainer" class="ai-messages-container">
            <!-- Welkomstbericht als er nog geen berichten zijn -->
            <div v-if="messages.length === 0" class="ai-welcome-box">
              <div class="ai-welcome-badge">Persoonlijke Tutor</div>
              <h3 class="ai-welcome-title">
                {{ studentName ? `Dag ${studentName}!` : 'Hallo!' }}
              </h3>
              <p class="ai-welcome-text">
                Ik ben jouw virtuele AI-tutor voor <strong>Web Essentials</strong>. Heb je een vraag over <em>{{ currentPageTitle }}</em> of wil je hulp bij het oplossen van een fout in jouw code? Stel gerust jouw vraag!
              </p>

              <!-- Suggestievragen (Quick prompts) -->
              <div class="ai-suggestions-list">
                <span class="ai-suggestions-heading">Suggesties voor dit hoofdstuk:</span>
                <button
                  type="button"
                  class="ai-suggestion-chip"
                  @click="usePrompt(`Wat zijn de belangrijkste vuistregels en tags op de pagina '${currentPageTitle}'?`)"
                >
                  Leg de belangrijkste kernpunten uit
                </button>
                <button
                  type="button"
                  class="ai-suggestion-chip"
                  @click="usePrompt(`Kan je me een korte oefenvraag stellen om te testen of ik het onderwerp '${currentPageTitle}' goed begrijp?`)"
                >
                  Stel me een testvraag over dit onderwerp
                </button>
                <button
                  type="button"
                  class="ai-suggestion-chip"
                  @click="usePrompt(`Wat zijn veelgemaakte fouten van studenten bij '${currentPageTitle}'?`)"
                >
                  Wat zijn veelgemaakte beginnersfouten?
                </button>
              </div>
            </div>

            <!-- Berichtenlijst -->
            <div
              v-for="msg in messages"
              :key="msg.id"
              class="ai-message-row"
              :class="['msg-' + msg.role]"
            >
              <!-- Avatar bij antwoorden van de tutor -->
              <div v-if="msg.role === 'model'" class="ai-msg-avatar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                  <rect x="4" y="8" width="16" height="12" rx="2" />
                  <circle cx="9" cy="13" r="1" />
                  <circle cx="15" cy="13" r="1" />
                </svg>
              </div>

              <div class="ai-message-bubble">
                <!-- Berichtinhoud met volwaardige Markdown-rendering via marked -->
                <div class="ai-message-content" v-html="renderMarkdown(msg.content)" @click="handleContentClick"></div>

                <!-- Actiebalk onderaan antwoord van de tutor -->
                <div v-if="msg.role === 'model'" class="ai-msg-actions">
                  <button
                    type="button"
                    class="ai-msg-action-btn"
                    :class="{ 'is-copied': copiedMessageId === msg.id }"
                    :title="copiedMessageId === msg.id ? 'Gekopieerd naar klembord!' : 'Kopieer antwoord naar klembord'"
                    aria-label="Kopieer antwoord"
                    @click="copyMessage(msg)"
                  >
                    <!-- Klembord icoon -->
                    <svg v-if="copiedMessageId !== msg.id" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <!-- Vinkje icoon bij succesvol kopiëren -->
                    <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="ai-check-icon">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span class="ai-msg-action-text">{{ copiedMessageId === msg.id ? 'Gekopieerd!' : 'Kopiëren' }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Typende indicator -->
            <div v-if="isLoading" class="ai-message-row msg-model">
              <div class="ai-msg-avatar">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                  <rect x="4" y="8" width="16" height="12" rx="2" />
                </svg>
              </div>
              <div class="ai-message-bubble ai-typing-bubble">
                <span class="ai-dot"></span>
                <span class="ai-dot"></span>
                <span class="ai-dot"></span>
              </div>
            </div>

            <!-- Foutmelding met Opnieuw proberen actieknop -->
            <div v-if="errorMessage" class="ai-error-alert">
              <div class="ai-error-main">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ai-error-icon">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div class="ai-error-text">{{ errorMessage }}</div>
              </div>
              <div class="ai-error-actions">
                <button
                  type="button"
                  class="ai-retry-btn"
                  :disabled="isLoading"
                  @click="handleRetry"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="1 4 1 10 7 10" />
                    <polyline points="23 20 23 14 17 14" />
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                  </svg>
                  Opnieuw proberen
                </button>
              </div>
            </div>
          </div>

          <!-- Chat Invoergebied -->
          <footer v-if="!isShowingSettings" class="ai-drawer-footer">
            <div class="ai-input-bar-controls">
              <span class="ai-model-mini-name">{{ selectedModel }}</span>
              <span class="ai-input-hint-text">Enter om te verzenden, Shift+Enter voor nieuwe regel</span>
            </div>

            <form class="ai-input-form" @submit.prevent="handleSend">
              <textarea
                ref="textareaEl"
                v-model="inputText"
                class="ai-chat-textarea"
                rows="1"
                placeholder="Stel je vraag over Web Essentials..."
                @keydown.enter.exact.prevent="handleSend"
                @input="handleTextareaInput"
              ></textarea>
              <button
                type="submit"
                class="ai-send-btn"
                :disabled="!inputText.trim() || isLoading"
                title="Verzend bericht (Enter)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </footer>
        </aside>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useRouter, useRoute, useData } from 'vitepress'
import { marked } from 'marked'
import { useAiTutor } from '../composables/useAiTutor'
import { useDialog } from '../composables/useDialog'

// Helper om HTML-tekens in codeblokken veilig te escapen
const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Configureer marked voor veilige en nette GFM weergave met codeblok header & copy knop
marked.setOptions({
  gfm: true,
  breaks: true,
})

marked.use({
  renderer: {
    code(token: { text: string; lang?: string }) {
      const lang = (token.lang || '').trim().toLowerCase()
      const escaped = escapeHtml(token.text)
      const langLabel = lang ? `<span class="ai-code-lang">${lang}</span>` : '<span class="ai-code-lang">code</span>'
      return `<div class="ai-code-block-wrapper">
  <div class="ai-code-block-header">
    ${langLabel}
    <button type="button" class="ai-copy-code-btn" title="Kopieer code naar klembord" aria-label="Kopieer code">
      <svg class="ai-copy-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      <svg class="ai-check-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      <span class="ai-copy-btn-text">Kopiëren</span>
    </button>
  </div>
  <pre><code class="${lang ? `language-${lang}` : ''}">${escaped}</code></pre>
</div>`
    },
  },
})

const router = useRouter()
const route = useRoute()
const { page } = useData()

const {
  hasApiKey,
  maskedApiKey,
  studentName,
  selectedModel,
  availableModels,
  messages,
  isLoading,
  errorMessage,
  isDrawerOpen,
  init,
  clearApiKey,
  saveStudentName,
  clearStudentName,
  saveSelectedModel,
  fetchModels,
  sendMessage,
  retryLastMessage,
  clearChat,
} = useAiTutor()

const isOpen = isDrawerOpen
const isShowingSettings = ref(false)
const inputText = ref('')
const nameInput = ref('')
const textareaEl = ref<HTMLTextAreaElement | null>(null)
const messagesContainer = ref<HTMLElement | null>(null)

// Aanpasbare vensterbreedte
const DEFAULT_WIDTH = 480
const MIN_WIDTH = 340
const drawerWidth = ref(DEFAULT_WIDTH)
const isResizing = ref(false)

const currentPageTitle = computed(() => {
  return page.value?.title || 'Web Essentials'
})

const activeModelDisplayName = computed(() => {
  const found = availableModels.value.find((m) => m.id === selectedModel.value)
  return found ? found.name.split(' (')[0] : selectedModel.value
})

const selectedModelProxy = computed({
  get: () => selectedModel.value,
  set: (val: string) => saveSelectedModel(val),
})

onMounted(() => {
  init()
  nameInput.value = studentName.value

  if (typeof window !== 'undefined') {
    const savedW = localStorage.getItem('we_ai_drawer_width')
    if (savedW) {
      const num = parseInt(savedW, 10)
      if (!isNaN(num) && num >= MIN_WIDTH) {
        drawerWidth.value = Math.min(num, window.innerWidth - 30)
      }
    }
  }
})

onBeforeUnmount(() => {
  if (copyTimeout) clearTimeout(copyTimeout)
  if (typeof document !== 'undefined') {
    document.removeEventListener('mousemove', handleResize)
    document.removeEventListener('mouseup', stopResize)
    document.removeEventListener('touchmove', handleTouchResize)
    document.removeEventListener('touchend', stopTouchResize)
    document.removeEventListener('touchcancel', stopTouchResize)
  }
})

const startResize = (e: MouseEvent) => {
  e.preventDefault()
  isResizing.value = true
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
}

const handleResize = (e: MouseEvent) => {
  if (!isResizing.value) return
  const maxW = Math.min(window.innerWidth - 30, 1150)
  const newW = window.innerWidth - e.clientX
  if (newW >= MIN_WIDTH && newW <= maxW) {
    drawerWidth.value = Math.round(newW)
  }
}

const stopResize = () => {
  if (!isResizing.value) return
  isResizing.value = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  if (typeof window !== 'undefined') {
    localStorage.setItem('we_ai_drawer_width', String(drawerWidth.value))
  }
}

const startTouchResize = () => {
  isResizing.value = true
  document.addEventListener('touchmove', handleTouchResize, { passive: false })
  document.addEventListener('touchend', stopTouchResize)
  document.addEventListener('touchcancel', stopTouchResize)
}

const handleTouchResize = (e: TouchEvent) => {
  if (!isResizing.value || !e.touches[0]) return
  const maxW = Math.min(window.innerWidth - 10, 1150)
  const newW = window.innerWidth - e.touches[0].clientX
  if (newW >= MIN_WIDTH && newW <= maxW) {
    drawerWidth.value = Math.round(newW)
  }
}

const stopTouchResize = () => {
  if (!isResizing.value) return
  isResizing.value = false
  document.removeEventListener('touchmove', handleTouchResize)
  document.removeEventListener('touchend', stopTouchResize)
  document.removeEventListener('touchcancel', stopTouchResize)
  if (typeof window !== 'undefined') {
    localStorage.setItem('we_ai_drawer_width', String(drawerWidth.value))
  }
}

const resetWidth = () => {
  drawerWidth.value = DEFAULT_WIDTH
  if (typeof window !== 'undefined') {
    localStorage.setItem('we_ai_drawer_width', String(DEFAULT_WIDTH))
  }
}

const handleButtonClick = () => {
  if (!hasApiKey.value) {
    router.go('/tools/ai-assistent')
  } else {
    isOpen.value = !isOpen.value
    if (isOpen.value) {
      nameInput.value = studentName.value
      scrollToBottom()
      nextTick(() => {
        textareaEl.value?.focus()
      })
    }
  }
}

const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    isOpen.value = false
  }
}

const handleSaveName = () => {
  saveStudentName(nameInput.value)
}

const handleClearName = () => {
  clearStudentName()
  nameInput.value = ''
}

const { confirm } = useDialog()

const handleClearKey = async () => {
  const confirmed = await confirm({
    title: 'API-sleutel wissen',
    message: 'Weet je zeker dat je jouw opgeslagen API-sleutel wilt wissen? Je moet daarna opnieuw een sleutel invoeren om de AI-assistent te kunnen gebruiken.',
    confirmText: 'Sleutel wissen',
    cancelText: 'Annuleren',
    type: 'danger',
  })
  if (confirmed) {
    clearApiKey()
    isOpen.value = false
    router.go('/tools/ai-assistent')
  }
}

const handleClearChat = async () => {
  const confirmed = await confirm({
    title: 'Gespreksgeschiedenis wissen',
    message: 'Weet je zeker dat je alle berichten uit deze sessie wilt wissen? Deze actie kan niet ongedaan worden gemaakt.',
    confirmText: 'Geschiedenis wissen',
    cancelText: 'Annuleren',
    type: 'danger',
  })
  if (confirmed) {
    clearChat()
  }
}

// Bericht kopiëren naar klembord
const copiedMessageId = ref<string | null>(null)
let copyTimeout: ReturnType<typeof setTimeout> | null = null

const copyMessage = async (msg: { id: string; content: string }) => {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(msg.content)
    } else {
      const ta = document.createElement('textarea')
      ta.value = msg.content
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    copiedMessageId.value = msg.id
    if (copyTimeout) clearTimeout(copyTimeout)
    copyTimeout = setTimeout(() => {
      copiedMessageId.value = null
    }, 2000)
  } catch (err) {
    console.error('Kopiëren mislukt:', err)
  }
}

// Volledig gesprek exporteren als Markdown-bestand (.md)
const handleExportMarkdown = () => {
  if (messages.value.length === 0) return

  const pad = (n: number) => String(n).padStart(2, '0')
  const now = new Date()
  const dateFormatted = now.toLocaleDateString('nl-BE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  const fileDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`
  const author = studentName.value ? studentName.value : 'Student'

  let md = `# Web Essentials - AI Tutor Gesprek\n\n`
  md += `- **Datum:** ${dateFormatted}\n`
  md += `- **Student:** ${author}\n`
  md += `- **Onderwerp:** ${currentPageTitle.value}\n`
  md += `- **Model:** ${selectedModel.value}\n\n`
  md += `---\n\n`

  for (const msg of messages.value) {
    if (msg.role === 'user') {
      md += `### ${author}:\n\n${msg.content}\n\n`
    } else {
      md += `### Web Essentials Tutor:\n\n${msg.content}\n\n`
    }
    md += `---\n\n`
  }

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `web-essentials-chat_${fileDate}.md`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const usePrompt = (text: string) => {
  inputText.value = text
  handleSend()
}

const handleTextareaInput = () => {
  if (!textareaEl.value) return
  textareaEl.value.style.height = 'auto'
  textareaEl.value.style.height = Math.min(textareaEl.value.scrollHeight, 140) + 'px'
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

watch(isOpen, (newVal) => {
  if (newVal) {
    nameInput.value = studentName.value
    scrollToBottom()
    nextTick(() => {
      textareaEl.value?.focus()
    })
  }
})

const handleSend = async () => {
  const text = inputText.value.trim()
  if (!text || isLoading.value) return

  inputText.value = ''
  if (textareaEl.value) {
    textareaEl.value.style.height = 'auto'
  }

  scrollToBottom()

  const success = await sendMessage(text, {
    title: currentPageTitle.value,
    path: route.path,
  })

  scrollToBottom()

  if (success) {
    nextTick(() => {
      textareaEl.value?.focus()
    })
  }
}

const handleRetry = async () => {
  if (isLoading.value) return
  const success = await retryLastMessage({
    title: currentPageTitle.value,
    path: route.path,
  })
  scrollToBottom()
  if (success) {
    nextTick(() => {
      textareaEl.value?.focus()
    })
  }
}

watch(
  () => messages.value.length,
  () => {
    scrollToBottom()
  }
)

/**
 * Converteer Markdown naar semantische HTML met marked
 */
const renderMarkdown = (raw: string): string => {
  if (!raw) return ''
  try {
    return marked.parse(raw) as string
  } catch (err) {
    console.warn('Fout bij renderen van markdown:', err)
    return raw
  }
}

/**
 * Afhandeling van klikacties binnen gerenderde markdown (kopieerknop van codeblokken)
 */
const handleContentClick = async (e: MouseEvent) => {
  const target = e.target as HTMLElement | null
  const btn = target?.closest('.ai-copy-code-btn') as HTMLButtonElement | null
  if (!btn) return

  const wrapper = btn.closest('.ai-code-block-wrapper')
  const codeEl = wrapper?.querySelector('pre code') || wrapper?.querySelector('pre')
  if (!codeEl) return

  const codeText = codeEl.textContent || ''
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

    btn.classList.add('is-copied')
    const textSpan = btn.querySelector('.ai-copy-btn-text')
    if (textSpan) textSpan.textContent = 'Gekopieerd!'

    setTimeout(() => {
      btn.classList.remove('is-copied')
      if (textSpan) textSpan.textContent = 'Kopiëren'
    }, 2000)
  } catch (err) {
    console.error('Kopiëren van code mislukt:', err)
  }
}
</script>

<style scoped>
.ai-assistant-root {
  font-family: var(--vp-font-family-base, sans-serif);
}

.ai-assistant-root.is-resizing {
  user-select: none;
}

/* Zwevende ronde actieknop */
.ai-floating-btn {
  position: fixed;
  right: 24px;
  bottom: 80px;
  z-index: 98;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.9rem 0.5rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid rgba(232, 119, 34, 0.4);
  background-color: var(--tm-dark-blue, #1e2d5a);
  color: #ffffff;
  box-shadow: 0 4px 18px rgba(30, 45, 90, 0.35);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  user-select: none;
}

.ai-floating-btn:hover {
  background-color: var(--tm-orange, #e87722);
  border-color: var(--tm-orange, #e87722);
  transform: translateY(-2px);
  box-shadow: 0 6px 22px rgba(232, 119, 34, 0.45);
}

.ai-floating-btn.is-active {
  background-color: var(--tm-orange, #e87722);
  border-color: var(--tm-orange, #e87722);
}

.ai-btn-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-floating-label {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.ai-floating-badge {
  position: absolute;
  top: -3px;
  right: -3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #ef4444;
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ffffff;
}

/* Backdrop */
.ai-drawer-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  z-index: 100;
  display: flex;
  justify-content: flex-end;
  backdrop-filter: blur(2px);
}

/* Drawer Paneel */
.ai-drawer {
  height: 100vh;
  max-width: 95vw;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

/* Sleepbare linker rand */
.ai-drawer-resizer {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 10px;
  cursor: col-resize;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  transition: background-color 0.15s ease;
  user-select: none;
}

.ai-drawer-resizer:hover,
.ai-drawer-resizer.is-resizing {
  background-color: rgba(232, 119, 34, 0.15);
}

.ai-drawer-resizer-line {
  width: 3px;
  height: 38px;
  border-radius: 2px;
  background-color: var(--vp-c-divider);
  transition: background-color 0.15s ease, height 0.15s ease;
}

.ai-drawer-resizer:hover .ai-drawer-resizer-line,
.ai-drawer-resizer.is-resizing .ai-drawer-resizer-line {
  background-color: var(--tm-orange, #e87722);
  height: 52px;
}

/* Header */
.ai-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem 0.85rem 1.25rem;
  background-color: var(--tm-dark-blue, #1e2d5a);
  color: #ffffff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.ai-drawer-header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.ai-drawer-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background-color: var(--tm-orange, #e87722);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ai-drawer-title-box {
  min-width: 0;
}

.ai-drawer-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ai-drawer-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
}

.ai-student-pill {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.1rem 0.45rem;
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  border-radius: 9999px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.ai-drawer-subtitle {
  font-size: 0.72rem;
  color: #cbd5e1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ai-drawer-header-actions {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-shrink: 0;
}

.ai-icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: transparent;
  color: #cbd5e1;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.ai-icon-btn:hover {
  background-color: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.ai-icon-btn.active {
  background-color: var(--tm-orange, #e87722);
  color: #ffffff;
}

/* Context Banner */
.ai-context-banner {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 1rem 0.4rem 1.25rem;
  background-color: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  flex-shrink: 0;
}

.ai-context-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ai-context-text strong {
  color: var(--tm-orange, #e87722);
}

/* Berichtenlijst */
.ai-messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1.15rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ai-welcome-box {
  padding: 1.25rem;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-align: left;
}

.ai-welcome-badge {
  display: inline-block;
  padding: 0.15rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: rgba(232, 119, 34, 0.15);
  color: var(--tm-orange, #e87722);
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.ai-welcome-title {
  margin: 0 0 0.4rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.ai-welcome-text {
  margin: 0 0 1rem;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}

.ai-suggestions-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.ai-suggestions-heading {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-text-3);
  margin-bottom: 0.15rem;
}

.ai-suggestion-chip {
  text-align: left;
  padding: 0.45rem 0.75rem;
  font-size: 0.8rem;
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.ai-suggestion-chip:hover {
  border-color: var(--tm-orange, #e87722);
  color: var(--tm-orange, #e87722);
  background-color: rgba(232, 119, 34, 0.04);
}

/* Berichten */
.ai-message-row {
  display: flex;
  gap: 0.6rem;
  width: 100%;
}

.ai-message-row.msg-user {
  justify-content: flex-end;
}

.ai-message-row.msg-model {
  justify-content: flex-start;
}

.ai-msg-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: var(--tm-orange, #e87722);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.ai-message-bubble {
  max-width: 90%;
  padding: 0.75rem 0.95rem;
  border-radius: 10px;
  font-size: 0.875rem;
  line-height: 1.55;
}

.msg-user .ai-message-bubble {
  background-color: var(--tm-orange, #e87722);
  color: #ffffff;
  border-bottom-right-radius: 2px;
}

.msg-model .ai-message-bubble {
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  border-bottom-left-radius: 2px;
}

/* Markdown Typografie in Berichtinhoud */
.ai-message-content {
  word-break: break-word;
}

.ai-message-content :deep(h1),
.ai-message-content :deep(h2),
.ai-message-content :deep(h3),
.ai-message-content :deep(h4) {
  margin: 0.75rem 0 0.35rem;
  font-weight: 700;
  line-height: 1.35;
  color: var(--vp-c-text-1);
}

.ai-message-content :deep(h1) { font-size: 1.1rem; }
.ai-message-content :deep(h2) { font-size: 1.02rem; }
.ai-message-content :deep(h3) { font-size: 0.95rem; color: var(--tm-orange, #e87722); }
.ai-message-content :deep(h4) { font-size: 0.88rem; }

.ai-message-content :deep(p) {
  margin: 0.45rem 0;
}

.ai-message-content :deep(p:first-child) {
  margin-top: 0;
}

.ai-message-content :deep(p:last-child) {
  margin-bottom: 0;
}

.ai-message-content :deep(ul),
.ai-message-content :deep(ol) {
  margin: 0.45rem 0;
  padding-left: 1.35rem;
}

.ai-message-content :deep(li) {
  margin: 0.25rem 0;
  line-height: 1.5;
}

.ai-message-content :deep(strong) {
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.msg-user .ai-message-content :deep(strong) {
  color: #ffffff;
}

.ai-message-content :deep(code) {
  padding: 0.15rem 0.4rem;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.82rem;
  background-color: rgba(0, 0, 0, 0.07);
  border-radius: 4px;
  color: var(--tm-orange, #e87722);
}

.dark .ai-message-content :deep(code) {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fb923c;
}

.msg-user .ai-message-content :deep(code) {
  background-color: rgba(255, 255, 255, 0.25);
  color: #ffffff;
}

/* Codeblok container in AI-antwoorden */
.ai-message-content :deep(.ai-code-block-wrapper) {
  margin: 0.75rem 0;
  border-radius: 8px;
  background-color: var(--vp-code-block-bg, #f6f8fa);
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.dark .ai-message-content :deep(.ai-code-block-wrapper) {
  background-color: var(--vp-code-block-bg, #1e2024);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: none;
}

.ai-message-content :deep(.ai-code-block-header) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.35rem 0.75rem;
  background-color: rgba(0, 0, 0, 0.035);
  border-bottom: 1px solid var(--vp-c-divider);
  user-select: none;
}

.dark .ai-message-content :deep(.ai-code-block-header) {
  background-color: rgba(255, 255, 255, 0.035);
  border-bottom-color: rgba(255, 255, 255, 0.08);
}

.ai-message-content :deep(.ai-code-lang) {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ai-message-content :deep(.ai-copy-code-btn) {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.5rem;
  font-size: 0.72rem;
  font-weight: 500;
  font-family: inherit;
  color: var(--vp-c-text-2);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
  line-height: 1;
}

.ai-message-content :deep(.ai-copy-code-btn:hover) {
  background-color: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-divider);
}

.ai-message-content :deep(.ai-copy-code-btn.is-copied) {
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.25);
}

.ai-message-content :deep(.ai-copy-code-btn .ai-check-icon) {
  display: none;
  color: #10b981;
}

.ai-message-content :deep(.ai-copy-code-btn.is-copied .ai-copy-icon) {
  display: none;
}

.ai-message-content :deep(.ai-copy-code-btn.is-copied .ai-check-icon) {
  display: inline-block;
}

.ai-message-content :deep(pre) {
  margin: 0;
  padding: 0.8rem 1rem;
  overflow-x: auto;
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.83rem;
  line-height: 1.5;
  background: transparent !important;
  color: var(--vp-c-text-1, #24292f);
  border: none;
  border-radius: 0;
}

.dark .ai-message-content :deep(pre) {
  color: #e2e8f0;
}

.ai-message-content :deep(pre code) {
  padding: 0;
  background: transparent !important;
  color: inherit !important;
  font-size: inherit;
  border: none;
}

.ai-message-content :deep(blockquote) {
  margin: 0.5rem 0;
  padding: 0.35rem 0.75rem;
  border-left: 3px solid var(--tm-orange, #e87722);
  background-color: rgba(232, 119, 34, 0.06);
  border-radius: 0 4px 4px 0;
  color: var(--vp-c-text-2);
}

/* Actiebalk onderaan tutorantwoord */
.ai-msg-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 0.6rem;
  padding-top: 0.45rem;
  border-top: 1px solid var(--vp-c-divider);
}

.ai-msg-action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem 0.55rem;
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
  line-height: 1;
}

.ai-msg-action-btn:hover {
  background-color: var(--vp-c-bg-mute);
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-divider);
}

.ai-msg-action-btn.is-copied {
  color: #10b981;
  background-color: rgba(16, 185, 129, 0.08);
  border-color: rgba(16, 185, 129, 0.25);
}

.ai-check-icon {
  color: #10b981;
}

.ai-msg-action-text {
  user-select: none;
}

/* Typende indicator bubbel */
.ai-typing-bubble {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0.65rem 0.9rem;
}

.ai-dot {
  width: 6px;
  height: 6px;
  background-color: var(--vp-c-text-3);
  border-radius: 50%;
  animation: ai-pulse 1.4s infinite ease-in-out;
}

.ai-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.ai-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes ai-pulse {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.ai-error-alert {
  padding: 0.75rem 0.9rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  font-size: 0.82rem;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.dark .ai-error-alert {
  background-color: rgba(220, 38, 38, 0.12);
  border-color: rgba(220, 38, 38, 0.28);
  color: #fca5a5;
}

.ai-error-main {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  line-height: 1.45;
}

.ai-error-icon {
  flex-shrink: 0;
  margin-top: 2px;
  color: #dc2626;
}

.dark .ai-error-icon {
  color: #f87171;
}

.ai-error-text {
  flex: 1;
}

.ai-error-actions {
  display: flex;
  justify-content: flex-end;
}

.ai-retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.75rem;
  background-color: #dc2626;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.ai-retry-btn:hover:not(:disabled) {
  background-color: #b91c1c;
  box-shadow: 0 1px 4px rgba(220, 38, 38, 0.3);
}

.ai-retry-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.dark .ai-retry-btn {
  background-color: #ef4444;
}

.dark .ai-retry-btn:hover:not(:disabled) {
  background-color: #dc2626;
}

/* Footer / Inputbar */
.ai-drawer-footer {
  padding: 0.65rem 1rem;
  border-top: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  flex-shrink: 0;
}

.ai-input-bar-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.45rem;
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
}

.ai-model-mini-name {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.72rem;
  color: var(--vp-c-text-2);
}

.ai-input-hint-text {
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
}

.ai-input-form {
  display: flex;
  align-items: flex-end;
  gap: 0.45rem;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 0.35rem 0.5rem;
}

.ai-input-form:focus-within {
  border-color: var(--tm-orange, #e87722);
  box-shadow: 0 0 0 2px rgba(232, 119, 34, 0.15);
}

.ai-chat-textarea {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.875rem;
  color: var(--vp-c-text-1);
  resize: none;
  max-height: 140px;
  padding: 0.25rem;
  line-height: 1.4;
  font-family: inherit;
}

.ai-send-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background-color: var(--tm-orange, #e87722);
  color: #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.15s ease;
}

.ai-send-btn:hover:not(:disabled) {
  background-color: #d06517;
}

.ai-send-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

/* Instellingen weergave in drawer */
.ai-settings-view {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
}

.ai-settings-title {
  margin: 0 0 1.25rem;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.ai-setting-item {
  margin-bottom: 1.15rem;
}

.ai-setting-item-border {
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

.ai-setting-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.35rem;
}

.ai-setting-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.35rem;
}

.ai-setting-input-row {
  display: flex;
  gap: 0.4rem;
}

.ai-setting-input {
  flex: 1;
  padding: 0.4rem 0.65rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  outline: none;
}

.ai-setting-input:focus {
  border-color: var(--tm-orange, #e87722);
}

.ai-setting-btn {
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  background-color: var(--tm-orange, #e87722);
  color: #ffffff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.ai-setting-btn-danger-outline {
  padding: 0.4rem 0.65rem;
  font-size: 0.8rem;
  background: transparent;
  border: 1px solid #fca5a5;
  color: #dc2626;
  border-radius: 6px;
  cursor: pointer;
}

.ai-link-btn {
  font-size: 0.72rem;
  color: var(--tm-orange, #e87722);
  background: transparent;
  border: none;
  cursor: pointer;
}

.ai-link-btn:hover {
  text-decoration: underline;
}

.ai-setting-select {
  width: 100%;
  padding: 0.45rem 0.65rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  outline: none;
  cursor: pointer;
}

.ai-setting-hint-text {
  margin: 0.35rem 0 0;
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
  line-height: 1.4;
}

.ai-key-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
}

.ai-key-code {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.ai-btn-text-danger {
  font-size: 0.75rem;
  color: #dc2626;
  background: transparent;
  border: none;
  cursor: pointer;
}

.ai-btn-text-danger:hover {
  text-decoration: underline;
}

.ai-btn-clear-chat {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.75rem;
  font-size: 0.8rem;
  color: #dc2626;
  background: transparent;
  border: 1px solid #fca5a5;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.ai-btn-clear-chat:hover:not(:disabled) {
  background-color: #fef2f2;
}

.ai-btn-clear-chat:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.ai-settings-footer {
  margin-top: 1.5rem;
}

.ai-btn-primary-full {
  width: 100%;
  padding: 0.55rem;
  font-size: 0.85rem;
  font-weight: 600;
  background-color: var(--tm-orange, #e87722);
  color: #ffffff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.ai-btn-primary-full:hover {
  background-color: #d06517;
}

/* Transities */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.25s ease;
}

.drawer-enter-active .ai-drawer,
.drawer-leave-active .ai-drawer {
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .ai-drawer,
.drawer-leave-to .ai-drawer {
  transform: translateX(100%);
}

@media (max-width: 640px) {
  .ai-drawer {
    width: 100vw !important;
    max-width: 100vw;
  }

  .ai-drawer-resizer {
    display: none;
  }

  .ai-floating-btn {
    right: 16px;
    bottom: 74px;
    padding: 0.5rem;
  }

  .ai-floating-label {
    display: none;
  }
}

@media print {
  .ai-assistant-root {
    display: none !important;
  }
}
</style>
