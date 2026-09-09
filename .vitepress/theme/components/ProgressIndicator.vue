<template>
  <div v-if="showIndicator" class="progress-indicator">
    <span class="progress-label">Voortgang: {{ completedCount }} / {{ totalPages }}</span>
    <div class="progress-bar">
      <div class="progress-bar-fill" :style="{ width: progressPercent + '%' }" />
    </div>
    <span class="progress-percent">{{ progressPercent }}%</span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vitepress'

/**
 * ProgressIndicator component
 *
 * Slaat voortgang op in localStorage per sectie.
 * Gebruik in de index pagina van een sectie:
 *   <ProgressIndicator section="html" :total="8" />
 *
 * Props:
 *   section - Sectienaam (html, css, tools)
 *   total   - Totaal aantal pagina's in de sectie
 */
const props = withDefaults(defineProps<{
  section: string
  total: number
}>(), {
  total: 0,
})

const route = useRoute()
const visitedPages = ref<Set<string>>(new Set())

const storageKey = computed(() => `we_progress_${props.section}`)

const totalPages = computed(() => props.total)

const completedCount = computed(() => visitedPages.value.size)

const progressPercent = computed(() =>
  totalPages.value > 0
    ? Math.round((completedCount.value / totalPages.value) * 100)
    : 0
)

const showIndicator = computed(() => totalPages.value > 0)

const loadProgress = () => {
  if (typeof localStorage === 'undefined') return
  try {
    const stored = localStorage.getItem(storageKey.value)
    if (stored) {
      visitedPages.value = new Set(JSON.parse(stored))
    }
  } catch {
    // localStorage niet beschikbaar (SSR)
  }
}

const markCurrentPageVisited = () => {
  if (typeof localStorage === 'undefined') return
  try {
    visitedPages.value.add(route.path)
    localStorage.setItem(
      storageKey.value,
      JSON.stringify([...visitedPages.value])
    )
  } catch {
    // localStorage niet beschikbaar (SSR)
  }
}

onMounted(() => {
  loadProgress()
  markCurrentPageVisited()
})
</script>
