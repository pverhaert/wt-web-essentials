import { ref } from 'vue'

// Gedeelde reactieve staat: beschikbaar in elke component die deze composable importeert
const hasSummary = ref(false)
const summaryHtml = ref('')
const isModalOpen = ref(false)

export function usePageSummary() {
  /**
   * Registreert de HTML-inhoud van een <PageSummary>-component.
   * Wordt aangeroepen vanuit PageSummary.vue zodra die gemount is.
   */
  function registerSummary(html: string) {
    summaryHtml.value = html
    hasSummary.value = true
  }

  /**
   * Verwijdert de geregistreerde samenvatting.
   * Wordt aangeroepen vanuit PageSummary.vue zodra die unmount (paginawissel).
   */
  function unregisterSummary() {
    hasSummary.value = false
    summaryHtml.value = ''
    isModalOpen.value = false
  }

  function openModal() {
    isModalOpen.value = true
  }

  function closeModal() {
    isModalOpen.value = false
  }

  function toggleModal() {
    isModalOpen.value = !isModalOpen.value
  }

  return {
    hasSummary,
    summaryHtml,
    isModalOpen,
    registerSummary,
    unregisterSummary,
    openModal,
    closeModal,
    toggleModal,
  }
}
