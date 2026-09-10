<template>
  <div class="ai-setup-card">
    <div class="ai-setup-header">
      <div class="ai-setup-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      </div>
      <div>
        <h3 class="ai-setup-title">AI Cursusassistent Instellingen</h3>
        <p class="ai-setup-subtitle">Beheer jouw persoonlijke Gemini API-sleutel en voorkeuren</p>
      </div>
    </div>

    <!-- 1. Studentennaam -->
    <div class="ai-setup-section">
      <label class="ai-label" for="student-name-input">
        Jouw voornaam <span class="ai-label-opt">(optioneel, voor een persoonlijke aanspreking)</span>
      </label>
      <div class="ai-input-group">
        <input
          id="student-name-input"
          v-model="nameInput"
          type="text"
          class="ai-input"
          placeholder="Bijv. Patrick"
          @keydown.enter="handleSaveName"
        />
        <button
          type="button"
          class="ai-btn ai-btn-secondary"
          @click="handleSaveName"
        >
          {{ studentName ? 'Bijwerken' : 'Opslaan' }}
        </button>
        <button
          v-if="studentName"
          type="button"
          class="ai-btn ai-btn-danger-outline"
          title="Naam wissen"
          @click="handleClearName"
        >
          Wissen
        </button>
      </div>
      <p v-if="nameSavedFeedback" class="ai-feedback-success">
        Naam succesvol opgeslagen! De tutor spreekt je nu aan als {{ studentName }}.
      </p>
    </div>

    <!-- 2. API-sleutel -->
    <div class="ai-setup-section">
      <label class="ai-label" for="api-key-input">
        Google Gemini API-sleutel
      </label>

      <!-- Als er al een sleutel is opgeslagen -->
      <div v-if="hasApiKey && !isEditingKey" class="ai-key-status-card">
        <div class="ai-key-status-left">
          <div class="ai-badge-success">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            API-sleutel actief
          </div>
          <span class="ai-key-masked">{{ maskedApiKey }}</span>
        </div>
        <div class="ai-key-status-actions">
          <button
            type="button"
            class="ai-btn ai-btn-outline"
            @click="isEditingKey = true"
          >
            Wijzigen
          </button>
          <button
            type="button"
            class="ai-btn ai-btn-danger"
            @click="handleClearApiKey"
          >
            Sleutel wissen
          </button>
        </div>
      </div>

      <!-- Invoerveld voor nieuwe of gewijzigde sleutel -->
      <div v-else>
        <div class="ai-input-group">
          <div class="ai-input-wrapper">
            <input
              id="api-key-input"
              v-model="keyInput"
              :type="showKey ? 'text' : 'password'"
              class="ai-input"
              placeholder="Plak hier je AIzaSy... sleutel"
              autocomplete="off"
              spellcheck="false"
            />
            <button
              type="button"
              class="ai-input-toggle-btn"
              :title="showKey ? 'Verberg sleutel' : 'Toon sleutel'"
              @click="showKey = !showKey"
            >
              {{ showKey ? 'Verberg' : 'Toon' }}
            </button>
          </div>
          <button
            type="button"
            class="ai-btn ai-btn-primary"
            :disabled="!keyInput.trim() || isTesting"
            @click="handleSaveAndTestKey"
          >
            <span v-if="isTesting">Controleren...</span>
            <span v-else>Opslaan & Verifiëren</span>
          </button>
          <button
            v-if="hasApiKey && isEditingKey"
            type="button"
            class="ai-btn ai-btn-secondary"
            @click="isEditingKey = false"
          >
            Annuleren
          </button>
        </div>

        <div class="ai-help-link-wrapper">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="page2"
            rel="noopener noreferrer"
            class="ai-link-external"
          >
            <span>Nog geen sleutel? Maak gratis een API-sleutel aan op Google AI Studio</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </div>

      <!-- Feedbackberichten voor sleutel -->
      <p v-if="keyFeedbackError" class="ai-feedback-error">
        {{ keyFeedbackError }}
      </p>
      <p v-if="keyFeedbackSuccess" class="ai-feedback-success">
        {{ keyFeedbackSuccess }}
      </p>
    </div>

    <!-- 3. Modelkeuze (dynamisch opgehaald) -->
    <div v-if="hasApiKey" class="ai-setup-section">
      <div class="ai-section-title-row">
        <label class="ai-label" for="model-select">
          Gekozen Gemini model
        </label>
        <button
          type="button"
          class="ai-refresh-btn"
          title="Ververs actuele modellenlijst via Google AI Studio"
          @click="handleRefreshModels"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          Actuele modellen ophalen
        </button>
      </div>

      <select
        id="model-select"
        v-model="selectedModelProxy"
        class="ai-select"
      >
        <option
          v-for="model in availableModels"
          :key="model.id"
          :value="model.id"
        >
          {{ model.name }}
        </option>
      </select>
      <p class="ai-hint">
        Standaard bevelen we <strong>Gemini 2.5 Flash</strong> aan voor snelle, nauwkeurige en didactisch heldere antwoorden.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAiTutor } from '../composables/useAiTutor'
import { useDialog } from '../composables/useDialog'

const {
  hasApiKey,
  maskedApiKey,
  studentName,
  selectedModel,
  availableModels,
  init,
  saveApiKey,
  clearApiKey,
  saveStudentName,
  clearStudentName,
  saveSelectedModel,
  testApiKey,
  fetchModels,
} = useAiTutor()

const nameInput = ref('')
const keyInput = ref('')
const showKey = ref(false)
const isEditingKey = ref(false)
const isTesting = ref(false)
const keyFeedbackError = ref<string | null>(null)
const keyFeedbackSuccess = ref<string | null>(null)
const nameSavedFeedback = ref(false)

const selectedModelProxy = computed({
  get: () => selectedModel.value,
  set: (val: string) => saveSelectedModel(val),
})

onMounted(() => {
  init()
  nameInput.value = studentName.value
})

const handleSaveName = () => {
  saveStudentName(nameInput.value)
  nameSavedFeedback.value = true
  setTimeout(() => {
    nameSavedFeedback.value = false
  }, 3000)
}

const handleClearName = () => {
  clearStudentName()
  nameInput.value = ''
}

const handleSaveAndTestKey = async () => {
  const key = keyInput.value.trim()
  if (!key) return

  isTesting.value = true
  keyFeedbackError.value = null
  keyFeedbackSuccess.value = null

  const result = await testApiKey(key)
  isTesting.value = false

  if (result.success) {
    await saveApiKey(key)
    keyInput.value = ''
    isEditingKey.value = false
    keyFeedbackSuccess.value = 'API-sleutel succesvol geverifieerd en opgeslagen!'
    setTimeout(() => {
      keyFeedbackSuccess.value = null
    }, 4000)
  } else {
    keyFeedbackError.value = result.message
  }
}

const { confirm } = useDialog()

const handleClearApiKey = async () => {
  const confirmed = await confirm({
    title: 'API-sleutel wissen',
    message: 'Weet je zeker dat je jouw opgeslagen API-sleutel wilt wissen? De sleutel wordt onmiddellijk verwijderd uit de lokale opslag van jouw browser.',
    confirmText: 'Sleutel wissen',
    cancelText: 'Annuleren',
    type: 'danger',
  })
  if (confirmed) {
    clearApiKey()
    keyInput.value = ''
    isEditingKey.value = false
    keyFeedbackSuccess.value = null
    keyFeedbackError.value = null
  }
}

const handleRefreshModels = async () => {
  await fetchModels()
}
</script>

<style scoped>
.ai-setup-card {
  margin: 1.5rem 0;
  padding: 1.5rem;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

.ai-setup-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.ai-setup-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background-color: var(--tm-orange, #e87722);
  color: #ffffff;
  flex-shrink: 0;
}

.ai-setup-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.ai-setup-subtitle {
  margin: 0.2rem 0 0;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.ai-setup-section {
  margin-bottom: 1.25rem;
}

.ai-setup-section:last-child {
  margin-bottom: 0;
}

.ai-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 0.4rem;
}

.ai-label-opt {
  font-weight: 400;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.ai-input-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.ai-input-wrapper {
  position: relative;
  flex: 1;
}

.ai-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.ai-input:focus {
  border-color: var(--tm-orange, #e87722);
  box-shadow: 0 0 0 3px rgba(232, 119, 34, 0.15);
}

.ai-input-toggle-btn {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  padding: 0.2rem 0.4rem;
  color: var(--vp-c-text-2);
  background: transparent;
  border: none;
  cursor: pointer;
}

.ai-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid transparent;
  white-space: nowrap;
  transition: all 0.15s ease;
}

.ai-btn-primary {
  background-color: var(--tm-orange, #e87722);
  color: #ffffff;
}

.ai-btn-primary:hover:not(:disabled) {
  background-color: #d06517;
}

.ai-btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ai-btn-secondary {
  background-color: var(--vp-c-bg);
  border-color: var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.ai-btn-secondary:hover {
  border-color: var(--tm-orange, #e87722);
  color: var(--tm-orange, #e87722);
}

.ai-btn-outline {
  background: transparent;
  border-color: var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.ai-btn-outline:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-text-2);
}

.ai-btn-danger {
  background-color: #dc2626;
  color: #ffffff;
}

.ai-btn-danger:hover {
  background-color: #b91c1c;
}

.ai-btn-danger-outline {
  background: transparent;
  border-color: #fca5a5;
  color: #dc2626;
}

.ai-btn-danger-outline:hover {
  background-color: #fef2f2;
}

.ai-key-status-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  gap: 1rem;
  flex-wrap: wrap;
}

.ai-key-status-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.ai-badge-success {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.6rem;
  background-color: #dcfce7;
  color: #166534;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 4px;
}

.dark .ai-badge-success {
  background-color: rgba(22, 101, 52, 0.3);
  color: #86efac;
}

.ai-key-masked {
  font-family: var(--vp-font-family-mono, monospace);
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.ai-key-status-actions {
  display: flex;
  gap: 0.5rem;
}

.ai-help-link-wrapper {
  margin-top: 0.5rem;
}

.ai-link-external {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: var(--tm-orange, #e87722);
  text-decoration: none;
}

.ai-link-external:hover {
  text-decoration: underline;
}

.ai-feedback-error {
  margin: 0.5rem 0 0;
  font-size: 0.85rem;
  color: #dc2626;
}

.ai-feedback-success {
  margin: 0.5rem 0 0;
  font-size: 0.85rem;
  color: #16a34a;
}

.ai-section-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.4rem;
}

.ai-refresh-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: var(--tm-orange, #e87722);
  background: transparent;
  border: none;
  cursor: pointer;
}

.ai-refresh-btn:hover {
  text-decoration: underline;
}

.ai-select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  outline: none;
  cursor: pointer;
}

.ai-select:focus {
  border-color: var(--tm-orange, #e87722);
}

.ai-hint {
  margin: 0.4rem 0 0;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.ai-toggle-label {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
}

.ai-toggle-checkbox {
  margin-top: 0.25rem;
  width: 16px;
  height: 16px;
  accent-color: var(--tm-orange, #e87722);
  cursor: pointer;
}

.ai-toggle-content {
  display: flex;
  flex-direction: column;
}

.ai-toggle-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.ai-toggle-desc {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}
</style>
