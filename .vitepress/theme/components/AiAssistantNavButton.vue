<template>
  <ClientOnly>
    <Teleport v-if="isMounted" to=".VPNavBarSearch">
      <div class="ai-nav-btn-container">
        <button
          type="button"
          class="ai-nav-btn"
          :class="{ 'is-active': isDrawerOpen, 'needs-setup': !hasApiKey }"
          :aria-label="hasApiKey ? 'Open AI Cursusassistent' : 'Stel AI Cursusassistent in'"
          aria-keyshortcuts="Control+I"
          @click="handleClick"
        >
          <!-- Robot / Sparkle icoon -->
          <span class="ai-nav-icon">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10a9.96 9.96 0 0 1-4.66-1.15L2 22l1.15-5.34A9.96 9.96 0 0 1 2 12 10 10 0 0 1 12 2z" />
              <path d="m9 10 2 2 4-4" />
            </svg>
          </span>

          <!-- Label tekst -->
          <span class="ai-nav-label">AI Tutor</span>

          <!-- Sneltoets indicatie (Ctrl I / ⌘ I) -->
          <span class="ai-nav-keys" aria-hidden="true">
            <kbd class="ai-nav-key">{{ isMac ? '⌘' : 'Ctrl' }}</kbd>
            <kbd class="ai-nav-key">I</kbd>
          </span>

          <!-- Waarschuwingsbadge indien nog niet ingesteld -->
          <span v-if="!hasApiKey" class="ai-nav-badge">!</span>
        </button>

        <!-- Mooi gevormde custom tooltip (vervangt het lelijke standaard browser-title kader) -->
        <div class="ai-nav-tooltip" role="tooltip">
          <span v-if="!hasApiKey">Instellen vereist &bull; Klik om te activeren</span>
          <span v-else-if="isDrawerOpen">Sluit AI Assistent ({{ isMac ? '⌘I' : 'Ctrl+I' }})</span>
          <span v-else>Stel een vraag aan de AI Cursusassistent ({{ isMac ? '⌘I' : 'Ctrl+I' }})</span>
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vitepress'
import { useAiTutor } from '../composables/useAiTutor'

const isMounted = ref(false)
const isMac = ref(false)
const router = useRouter()
const { hasApiKey, isDrawerOpen, toggleDrawer, init } = useAiTutor()

const handleClick = () => {
  if (!hasApiKey.value) {
    router.go('/tools/ai-assistent')
  } else {
    toggleDrawer()
  }
}

onMounted(() => {
  init()
  isMac.value = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform)

  // Wacht een tick zodat de VitePress DOM structuur (.VPNavBarSearch) zeker beschikbaar is
  if (typeof document !== 'undefined' && document.querySelector('.VPNavBarSearch')) {
    isMounted.value = true
  } else {
    setTimeout(() => {
      isMounted.value = true
    }, 50)
  }

  // Luister naar sneltoets Ctrl+I (of Cmd+I op macOS)
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
      e.preventDefault()
      handleClick()
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
})
</script>

<style scoped>
.ai-nav-btn-container {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.ai-nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 38px;
  margin-left: 10px;
  padding: 0 10px 0 12px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-brand-1);
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  user-select: none;
  flex-shrink: 0;
}

.ai-nav-btn:hover {
  background-color: var(--vp-c-brand-1);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(232, 119, 34, 0.25);
  transform: translateY(-1px);
}

.ai-nav-btn.is-active {
  background-color: var(--vp-c-brand-1);
  color: #ffffff;
  box-shadow: 0 0 0 2px var(--vp-c-bg), 0 0 0 4px var(--vp-c-brand-1);
}

.ai-nav-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.ai-nav-btn:hover .ai-nav-icon {
  transform: scale(1.1);
}

.ai-nav-label {
  letter-spacing: 0.01em;
}

/* Sneltoets-label vergelijkbaar met Ctrl K van de zoekbalk */
.ai-nav-keys {
  display: flex;
  align-items: center;
  margin-left: 4px;
}

.ai-nav-key {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  min-width: 18px;
  padding: 0 5px;
  font-family: var(--vp-font-family-base);
  font-size: 11px;
  font-weight: 500;
  border: 1px solid rgba(232, 119, 34, 0.35);
  background-color: rgba(232, 119, 34, 0.08);
  color: var(--vp-c-brand-1);
  transition: all 0.2s ease;
}

.ai-nav-key:first-child {
  border-right: none;
  border-radius: 4px 0 0 4px;
}

.ai-nav-key:last-child {
  border-radius: 0 4px 4px 0;
}

.ai-nav-btn:hover .ai-nav-key,
.ai-nav-btn.is-active .ai-nav-key {
  border-color: rgba(255, 255, 255, 0.35);
  background-color: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

/* Badge indien nog instelling vereist */
.ai-nav-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background-color: #ef4444;
  color: #ffffff;
  font-size: 10px;
  font-weight: 700;
  margin-left: 1px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  animation: pulse-badge 2s infinite;
}

@keyframes pulse-badge {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.85;
  }
}

/* Mooi gevormde zwevende tooltip */
.ai-nav-tooltip {
  position: absolute;
  top: calc(100% + 9px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);
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

/* Pijltje aan de bovenkant van de tooltip */
.ai-nav-tooltip::before {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-bottom-color: var(--vp-c-divider);
}

.ai-nav-tooltip::after {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-bottom-color: var(--vp-c-bg-elv);
}

.ai-nav-btn-container:hover .ai-nav-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
  transition-delay: 0.2s;
}

/* Responsief gedrag op kleinere schermen */
@media (max-width: 860px) {
  .ai-nav-keys {
    display: none;
  }
}

@media (max-width: 767px) {
  .ai-nav-btn {
    height: 34px;
    padding: 0 8px;
    margin-left: 6px;
    gap: 4px;
  }

  .ai-nav-label {
    display: none;
  }
}
</style>
