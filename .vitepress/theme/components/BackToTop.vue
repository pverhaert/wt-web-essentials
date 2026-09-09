<template>
  <Transition name="fade">
    <button
      v-if="visible"
      class="back-to-top"
      type="button"
      aria-label="Terug naar boven"
      title="Terug naar boven"
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
.back-to-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 99;
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
  .back-to-top {
    display: none !important;
  }
}
</style>