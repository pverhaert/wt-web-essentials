<template>
  <Transition name="modal-fade">
    <div
      v-if="isOpen"
      class="tm-dialog-backdrop"
      role="dialog"
      aria-modal="true"
      :aria-label="dialogOptions.title"
      @click="handleCancel"
      @keydown.esc="handleCancel"
    >
      <div
        class="tm-dialog-card"
        :class="['type-' + (dialogOptions.type || 'danger')]"
        @click.stop
      >
        <div class="tm-dialog-header">
          <!-- Icon indicator -->
          <div class="tm-dialog-icon-wrapper">
            <!-- Danger icon -->
            <svg
              v-if="dialogOptions.type === 'danger'"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>

            <!-- Warning icon -->
            <svg
              v-else-if="dialogOptions.type === 'warning'"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>

            <!-- Info / Brand icon -->
            <svg
              v-else
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>

          <div class="tm-dialog-title-box">
            <h3 class="tm-dialog-title">{{ dialogOptions.title }}</h3>
            <p class="tm-dialog-message">{{ dialogOptions.message }}</p>
          </div>
        </div>

        <div class="tm-dialog-actions">
          <button
            v-if="dialogOptions.showCancel !== false"
            ref="cancelBtnRef"
            type="button"
            class="tm-dialog-btn tm-dialog-btn-cancel"
            @click="handleCancel"
          >
            {{ dialogOptions.cancelText || 'Annuleren' }}
          </button>
          <button
            ref="confirmBtnRef"
            type="button"
            class="tm-dialog-btn tm-dialog-btn-confirm"
            :class="['btn-' + (dialogOptions.type || 'danger')]"
            @click="handleConfirm"
          >
            {{ dialogOptions.confirmText || 'Bevestigen' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { useDialog } from '../composables/useDialog'

const { isOpen, dialogOptions, handleConfirm, handleCancel } = useDialog()

const cancelBtnRef = ref<HTMLButtonElement | null>(null)
const confirmBtnRef = ref<HTMLButtonElement | null>(null)

const handleKeydown = (e: KeyboardEvent) => {
  if (isOpen.value && e.key === 'Escape') {
    handleCancel()
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeydown)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
})

watch(isOpen, (newVal) => {
  if (newVal) {
    nextTick(() => {
      if (dialogOptions.value.showCancel !== false && cancelBtnRef.value) {
        cancelBtnRef.value.focus()
      } else if (confirmBtnRef.value) {
        confirmBtnRef.value.focus()
      }
    })
  }
})
</script>

<style scoped>
.tm-dialog-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
}

.tm-dialog-card {
  width: 100%;
  max-width: 440px;
  background-color: var(--vp-c-bg, #ffffff);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.15);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  color: var(--vp-c-text-1);
  transform-origin: center center;
}

.tm-dialog-header {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.tm-dialog-icon-wrapper {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.type-danger .tm-dialog-icon-wrapper {
  background-color: #fee2e2;
  color: #dc2626;
}

.dark .type-danger .tm-dialog-icon-wrapper {
  background-color: rgba(220, 38, 38, 0.2);
  color: #f87171;
}

.type-warning .tm-dialog-icon-wrapper {
  background-color: #fef3c7;
  color: #d97706;
}

.dark .type-warning .tm-dialog-icon-wrapper {
  background-color: rgba(217, 119, 6, 0.2);
  color: #fbbf24;
}

.type-info .tm-dialog-icon-wrapper {
  background-color: rgba(232, 119, 34, 0.12);
  color: var(--tm-orange, #e87722);
}

.tm-dialog-title-box {
  flex: 1;
  min-width: 0;
}

.tm-dialog-title {
  margin: 0 0 0.4rem;
  font-size: 1.08rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  line-height: 1.35;
}

.tm-dialog-message {
  margin: 0;
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}

.tm-dialog-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.65rem;
}

.tm-dialog-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.55rem 1.1rem;
  border-radius: 6px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  line-height: 1;
}

.tm-dialog-btn-cancel {
  background: transparent;
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.tm-dialog-btn-cancel:hover {
  background-color: var(--vp-c-bg-mute);
  border-color: var(--vp-c-text-3);
}

.btn-danger {
  background-color: #dc2626;
  color: #ffffff;
  border: 1px solid transparent;
}

.btn-danger:hover {
  background-color: #b91c1c;
  box-shadow: 0 2px 6px rgba(220, 38, 38, 0.35);
}

.btn-warning {
  background-color: #d97706;
  color: #ffffff;
  border: 1px solid transparent;
}

.btn-warning:hover {
  background-color: #b45309;
}

.btn-info {
  background-color: var(--tm-orange, #e87722);
  color: #ffffff;
  border: 1px solid transparent;
}

.btn-info:hover {
  background-color: #d06517;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-active .tm-dialog-card,
.modal-fade-leave-active .tm-dialog-card {
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .tm-dialog-card,
.modal-fade-leave-to .tm-dialog-card {
  transform: scale(0.94);
  opacity: 0;
}
</style>
