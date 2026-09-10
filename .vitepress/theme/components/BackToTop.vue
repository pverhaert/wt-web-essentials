<template>
  <Transition name="fade">
    <div v-if="visible" class="back-to-top-container">
      <button
        class="back-to-top"
        type="button"
        aria-label="Terug naar boven"
        @click="scrollToTop"
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
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>

      <!-- Custom tooltip -->
      <div class="back-to-top-tooltip" role="tooltip">
        Terug naar boven
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
 
const visible = ref(false)
const SCROLL_THRESHOLD = 250

function handleScroll() {
  if (typeof window !== 'undefined') {
    visible.value = window.scrollY > SCROLL_THRESHOLD
  }
}

function scrollToTop() {
  if (typeof window !== 'undefined') {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.back-to-top-container {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-to-top {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-elv);
  color: var(--tm-orange, #e87722);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.16);
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
}

.back-to-top:hover {
  background-color: var(--tm-orange, #e87722);
  color: #ffffff;
  border-color: var(--tm-orange, #e87722);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(232, 119, 34, 0.35);
}

.back-to-top:active {
  transform: translateY(0) scale(0.95);
}

/* Custom zwevende tooltip links van de knop */
.back-to-top-tooltip {
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
.back-to-top-tooltip::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  border: 5px solid transparent;
  border-left-color: var(--vp-c-divider);
}

.back-to-top-tooltip::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  border: 4px solid transparent;
  border-left-color: var(--vp-c-bg-elv);
}

.back-to-top-container:hover .back-to-top-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(-50%) translateX(0);
  transition-delay: 0.15s;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media print {
  .back-to-top-container {
    display: none !important;
  }
}
</style>