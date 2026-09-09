import { ref } from 'vue'

export type DialogType = 'danger' | 'warning' | 'info'

export interface DialogOptions {
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: DialogType
  showCancel?: boolean
}

const isOpen = ref(false)
const dialogOptions = ref<DialogOptions>({
  title: '',
  message: '',
  confirmText: 'Bevestigen',
  cancelText: 'Annuleren',
  type: 'danger',
  showCancel: true,
})

let resolvePromise: ((value: boolean) => void) | null = null

export function useDialog() {
  const confirm = (options: DialogOptions): Promise<boolean> => {
    dialogOptions.value = {
      confirmText: 'Bevestigen',
      cancelText: 'Annuleren',
      type: 'danger',
      showCancel: true,
      ...options,
    }
    isOpen.value = true

    return new Promise((resolve) => {
      resolvePromise = resolve
    })
  }

  const alert = (options: Omit<DialogOptions, 'showCancel'>): Promise<boolean> => {
    return confirm({
      ...options,
      showCancel: false,
      confirmText: options.confirmText || 'Begrepen',
      type: options.type || 'info',
    })
  }

  const handleConfirm = () => {
    isOpen.value = false
    if (resolvePromise) {
      resolvePromise(true)
      resolvePromise = null
    }
  }

  const handleCancel = () => {
    isOpen.value = false
    if (resolvePromise) {
      resolvePromise(false)
      resolvePromise = null
    }
  }

  return {
    isOpen,
    dialogOptions,
    confirm,
    alert,
    handleConfirm,
    handleCancel,
  }
}
