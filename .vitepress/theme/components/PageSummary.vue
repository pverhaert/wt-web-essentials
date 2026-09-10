<template>
  <!-- Verborgen houder: de slot-inhoud wordt door Vue gerenderd maar niet getoond in de pagina.
       Op mount lezen we de innerHTML uit en registreren die bij de composable (modal). -->
  <div ref="contentEl" class="page-summary-content-holder" aria-hidden="true">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import { usePageSummary } from '../composables/usePageSummary'

const { registerSummary, unregisterSummary } = usePageSummary()
const route = useRoute()
const contentEl = ref<HTMLElement | null>(null)

function register() {
  nextTick(() => {
    if (contentEl.value) {
      registerSummary(contentEl.value.innerHTML)
    }
  })
}

onMounted(() => {
  register()
})

onUnmounted(() => {
  unregisterSummary()
})

// Bij SPA-navigatie: de component unmount automatisch als de nieuwe pagina
// geen <PageSummary> heeft. Maar voor zekerheid ook op route-verandering reageren.
watch(() => route.path, () => {
  unregisterSummary()
})
</script>

<style scoped>
/* De slot-inhoud is volledig verborgen op de pagina: alleen de modal toont hem */
.page-summary-content-holder {
  display: none !important;
}
</style>
