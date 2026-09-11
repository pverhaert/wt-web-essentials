<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

interface TooltipState {
  visible: boolean
  title: string
  definition: string
  top: number
  left: number
  arrowLeft: number
  isAbove: boolean
}

const tooltipRef = ref<HTMLElement | null>(null)
const state = ref<TooltipState>({
  visible: false,
  title: '',
  definition: '',
  top: 0,
  left: 0,
  arrowLeft: 0,
  isAbove: true,
})

let currentTrigger: HTMLElement | null = null
let hideTimer: any = null
let isTouch = false

function showTooltip(el: HTMLElement) {
  clearTimeout(hideTimer)
  currentTrigger = el

  // Haal definitie en term op
  // Sla eventuele native title tijdelijk op in data-term-def om browser tooltips te voorkomen
  if (el.hasAttribute('title') && el.getAttribute('title')) {
    el.setAttribute('data-term-def', el.getAttribute('title') || '')
    el.removeAttribute('title')
  }

  const def = el.getAttribute('data-term-def') || el.getAttribute('data-definition') || ''
  if (!def) return

  const term = el.getAttribute('data-term') || el.textContent?.trim() || ''

  state.value.title = term
  state.value.definition = def
  state.value.visible = true

  nextTick(() => {
    updatePosition(el)
  })
}

function updatePosition(el: HTMLElement) {
  if (!tooltipRef.value) return

  const rect = el.getBoundingClientRect()
  const tooltipRect = tooltipRef.value.getBoundingClientRect()
  const margin = 12
  const arrowHeight = 8

  // Bepaal of tooltip boven of onder het element past
  const spaceAbove = rect.top
  const spaceBelow = window.innerHeight - rect.bottom
  const isAbove = spaceAbove >= tooltipRect.height + arrowHeight + margin || spaceAbove > spaceBelow

  // Verticale positie
  let top = isAbove
    ? rect.top - tooltipRect.height - arrowHeight
    : rect.bottom + arrowHeight

  // Horizontale positie (gecentreerd t.o.v. trigger)
  let left = rect.left + rect.width / 2 - tooltipRect.width / 2

  // Voorkom dat tooltip buiten het scherm valt
  if (left < margin) {
    left = margin
  } else if (left + tooltipRect.width > window.innerWidth - margin) {
    left = window.innerWidth - margin - tooltipRect.width
  }

  // Pijlpositie relatief tot tooltip
  const triggerCenter = rect.left + rect.width / 2
  const arrowLeft = Math.max(16, Math.min(tooltipRect.width - 16, triggerCenter - left))

  state.value.top = top
  state.value.left = left
  state.value.arrowLeft = arrowLeft
  state.value.isAbove = isAbove
}

function scheduleHide() {
  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    state.value.visible = false
    currentTrigger = null
  }, 120)
}

function cancelHide() {
  clearTimeout(hideTimer)
}

function onDocumentMouseOver(e: MouseEvent) {
  if (isTouch) return
  const target = (e.target as HTMLElement)?.closest?.('abbr, dfn, .keyterm, keyterm') as HTMLElement | null
  if (target && (target.hasAttribute('title') || target.hasAttribute('data-term-def') || target.hasAttribute('data-definition'))) {
    showTooltip(target)
  }
}

function onDocumentMouseOut(e: MouseEvent) {
  if (isTouch) return
  const target = (e.target as HTMLElement)?.closest?.('abbr, dfn, .keyterm, keyterm') as HTMLElement | null
  if (target && target === currentTrigger) {
    scheduleHide()
  }
}

function onDocumentFocusIn(e: FocusEvent) {
  const target = (e.target as HTMLElement)?.closest?.('abbr, dfn, .keyterm, keyterm') as HTMLElement | null
  if (target && (target.hasAttribute('title') || target.hasAttribute('data-term-def') || target.hasAttribute('data-definition'))) {
    showTooltip(target)
  }
}

function onDocumentFocusOut(e: FocusEvent) {
  const target = (e.target as HTMLElement)?.closest?.('abbr, dfn, .keyterm, keyterm') as HTMLElement | null
  if (target && target === currentTrigger) {
    scheduleHide()
  }
}

function onDocumentClick(e: MouseEvent) {
  const target = (e.target as HTMLElement)?.closest?.('abbr, dfn, .keyterm, keyterm') as HTMLElement | null
  if (target && (target.hasAttribute('title') || target.hasAttribute('data-term-def') || target.hasAttribute('data-definition'))) {
    if (state.value.visible && currentTrigger === target) {
      state.value.visible = false
      currentTrigger = null
    } else {
      showTooltip(target)
    }
  } else if (tooltipRef.value && !tooltipRef.value.contains(e.target as Node)) {
    state.value.visible = false
    currentTrigger = null
  }
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && state.value.visible) {
    state.value.visible = false
    currentTrigger = null
  }
}

function setupTerms() {
  if (typeof document === 'undefined') return
  const terms = document.querySelectorAll<HTMLElement>('abbr[title], dfn[title], keyterm, .keyterm')
  terms.forEach((el) => {
    // Sla title op in data-term-def en verwijder title om native gele OS-tooltip te blokkeren
    if (el.hasAttribute('title')) {
      const titleVal = el.getAttribute('title') || ''
      el.setAttribute('data-term-def', titleVal)
      el.removeAttribute('title')
    }
    // Zorg voor keyboard focusbaarheid
    if (!el.hasAttribute('tabindex')) {
      el.setAttribute('tabindex', '0')
    }
    el.setAttribute('role', 'button')
    el.setAttribute('aria-haspopup', 'true')
  })
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    document.addEventListener('mouseover', onDocumentMouseOver)
    document.addEventListener('mouseout', onDocumentMouseOut)
    document.addEventListener('focusin', onDocumentFocusIn)
    document.addEventListener('focusout', onDocumentFocusOut)
    document.addEventListener('click', onDocumentClick)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('scroll', () => {
      if (state.value.visible && currentTrigger) {
        updatePosition(currentTrigger)
      }
    }, { passive: true })
    window.addEventListener('resize', () => {
      if (state.value.visible && currentTrigger) {
        updatePosition(currentTrigger)
      }
    }, { passive: true })

    setupTerms()
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    document.removeEventListener('mouseover', onDocumentMouseOver)
    document.removeEventListener('mouseout', onDocumentMouseOut)
    document.removeEventListener('focusin', onDocumentFocusIn)
    document.removeEventListener('focusout', onDocumentFocusOut)
    document.removeEventListener('click', onDocumentClick)
    window.removeEventListener('keydown', onKeyDown)
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="term-tooltip-fade">
      <div
        v-if="state.visible"
        ref="tooltipRef"
        class="term-tooltip-card"
        :class="{ 'is-above': state.isAbove, 'is-below': !state.isAbove }"
        :style="{
          top: `${state.top}px`,
          left: `${state.left}px`,
          '--arrow-left': `${state.arrowLeft}px`,
        }"
        role="tooltip"
        @mouseenter="cancelHide"
        @mouseleave="scheduleHide"
      >
        <div class="term-tooltip-arrow" />
        <div class="term-tooltip-header">
          {{ state.title }}
        </div>
        <div class="term-tooltip-divider" />
        <div class="term-tooltip-body">
          {{ state.definition }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.term-tooltip-card {
  position: fixed;
  z-index: 10000;
  width: max-content;
  max-width: 320px;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  pointer-events: auto;
  font-family: var(--vp-font-family-base);
  animation: tooltip-in 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

.term-tooltip-header {
  font-size: 13px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  line-height: 1.2;
}

.term-tooltip-divider {
  height: 1px;
  background-color: var(--vp-c-divider);
  margin: 6px 0 8px 0;
  width: 100%;
}

.term-tooltip-body {
  font-size: 13px;
  line-height: 1.5;
  color: var(--vp-c-text-1);
  word-break: normal;
  overflow-wrap: break-word;
}

/* Arrow indicator */
.term-tooltip-arrow {
  position: absolute;
  width: 10px;
  height: 10px;
  background-color: var(--vp-c-bg);
  transform: translateX(-50%) rotate(45deg);
  pointer-events: none;
}

.term-tooltip-card.is-above .term-tooltip-arrow {
  bottom: -6px;
  left: var(--arrow-left, 50%);
  border-right: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
}

.term-tooltip-card.is-below .term-tooltip-arrow {
  top: -6px;
  left: var(--arrow-left, 50%);
  border-left: 1px solid var(--vp-c-divider);
  border-top: 1px solid var(--vp-c-divider);
}

/* Transitions */
.term-tooltip-fade-enter-active,
.term-tooltip-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.term-tooltip-fade-enter-from,
.term-tooltip-fade-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

@keyframes tooltip-in {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 480px) {
  .term-tooltip-card {
    max-width: calc(100vw - 32px);
  }
}
</style>
