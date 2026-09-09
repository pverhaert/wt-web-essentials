<template>
  <ClientOnly>
    <Transition name="pwa-toast">
      <aside
        v-if="show"
        class="pwa-toast"
        role="alert"
        aria-live="polite"
        @mouseenter="pauseTimer"
        @mouseleave="resumeTimer"
      >
        <div class="pwa-toast-icon">
          <!-- Download / Refresh succes icoon -->
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </div>

        <div class="pwa-toast-content">
          <div class="pwa-toast-title">Nieuwe versie beschikbaar</div>
          <p class="pwa-toast-desc">
            De recentste cursusinhoud is op de achtergrond gedownload en klaar voor gebruik.
          </p>
          <div class="pwa-toast-actions">
            <button
              type="button"
              class="pwa-btn-reload"
              @click="reloadPage"
            >
              Nu vernieuwen
            </button>
            <button
              type="button"
              class="pwa-btn-dismiss"
              @click="dismiss"
            >
              Sluiten
            </button>
          </div>
        </div>

        <button
          type="button"
          class="pwa-toast-close"
          title="Melding sluiten"
          aria-label="Sluiten"
          @click="dismiss"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </aside>
    </Transition>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const show = ref(false)
let timer: ReturnType<typeof setTimeout> | null = null

const startAutoDismiss = () => {
  if (timer) clearTimeout(timer)
  // Sluit automatisch na 12 seconden indien niet aangeklikt
  timer = setTimeout(() => {
    show.value = false
  }, 12000)
}

const pauseTimer = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

const resumeTimer = () => {
  if (show.value) {
    startAutoDismiss()
  }
}

const reloadPage = () => {
  if (typeof window !== 'undefined') {
    window.location.reload()
  }
}

const dismiss = () => {
  show.value = false
  if (timer) clearTimeout(timer)
}

onMounted(() => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

  // Controleer of er al een actieve controller was (bestaande bezoeker)
  const hadPreviousController = !!navigator.serviceWorker.controller

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // Enkel tonen wanneer een bestaande bezoeker een vernieuwde Service Worker ontvangt
    if (hadPreviousController) {
      show.value = true
      startAutoDismiss()
    }
  })

  // Registreer de Service Worker in productie
  if (import.meta.env.PROD) {
    const register = () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch((err) => {
        console.warn('PWA Service Worker registratie mislukt:', err)
      })
    }

    if (document.readyState === 'complete') {
      register()
    } else {
      window.addEventListener('load', register)
    }
  }
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
})
</script>

<style>
.pwa-toast {
  position: fixed;
  left: 24px;
  bottom: 24px;
  z-index: 100;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  max-width: 380px;
  padding: 16px;
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-left: 4px solid var(--vp-c-brand-1);
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16), 0 2px 6px rgba(0, 0, 0, 0.08);
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-base);
}

.pwa-toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  margin-top: 2px;
}

.pwa-toast-content {
  flex-grow: 1;
}

.pwa-toast-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 4px;
  line-height: 1.3;
}

.pwa-toast-desc {
  margin: 0 0 12px 0;
  font-size: 12.5px;
  line-height: 1.45;
  color: var(--vp-c-text-2);
}

.pwa-toast-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pwa-btn-reload {
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  background-color: var(--vp-c-brand-1);
  color: #ffffff;
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.pwa-btn-reload:hover {
  background-color: var(--vp-c-brand-2);
  transform: translateY(-1px);
}

.pwa-btn-reload:active {
  transform: translateY(0);
}

.pwa-btn-dismiss {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background-color: transparent;
  color: var(--vp-c-text-2);
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pwa-btn-dismiss:hover {
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
}

.pwa-toast-close {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: var(--vp-c-text-3);
  cursor: pointer;
  border-radius: 4px;
  padding: 0;
  transition: color 0.2s, background-color 0.2s;
}

.pwa-toast-close:hover {
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-alt);
}

/* Animaties bij verschijnen en verdwijnen */
.pwa-toast-enter-active,
.pwa-toast-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.pwa-toast-enter-from {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}

.pwa-toast-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.96);
}

/* Responsief op mobiele toestellen */
@media (max-width: 640px) {
  .pwa-toast {
    left: 12px;
    right: 12px;
    bottom: 12px;
    max-width: none;
  }
}
</style>
