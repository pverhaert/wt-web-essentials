<template>
  <div class="caniuse-container">
    <div class="caniuse-header">
      <span class="caniuse-title">
        <svg class="caniuse-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        Browserondersteuning: <code>{{ feature }}</code>
      </span>
      <a
        :href="caniuseUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="caniuse-link"
        title="Bekijk actuele data op Can I use..."
      >
        <span>Can I use</span>
        <svg class="caniuse-external-icon" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
      </a>
    </div>

    <div class="caniuse-body">
      <a :href="caniuseUrl" target="_blank" rel="noopener noreferrer" class="caniuse-img-link">
        <img
          v-show="!hasError"
          :src="imageUrl"
          :alt="altText"
          :title="altText"
          loading="lazy"
          class="caniuse-img no-zoom"
          @error="handleError"
        />
      </a>
      <div v-if="hasError" class="caniuse-fallback">
        <p>Kon de actuele compatibiliteitstabel niet rechtstreeks inladen.</p>
        <a :href="caniuseUrl" target="_blank" rel="noopener noreferrer" class="caniuse-fallback-link">
          Bekijk <code>{{ feature }}</code> direct op Can I use &rarr;
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    feature: string
    title?: string
    format?: 'png' | 'webp' | 'jpg'
  }>(),
  {
    title: '',
    format: 'png',
  }
)

const hasError = ref(false)

const caniuseUrl = computed(() => {
  return `https://caniuse.com/${props.feature}`
})

const imageUrl = computed(() => {
  return `https://caniuse.bitsofco.de/image/${props.feature}.${props.format}`
})

const altText = computed(() => {
  return props.title || `Browserondersteuning voor ${props.feature} via Can I use`
})

const handleError = () => {
  hasError.value = true
}
</script>

<style scoped>
.caniuse-container {
  margin: 1.5rem 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.caniuse-container:hover {
  border-color: var(--vp-c-brand-1, #e87722);
}

.caniuse-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 1rem;
  background-color: var(--vp-c-bg-alt);
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 0.85rem;
}

.caniuse-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.caniuse-title code {
  font-size: 0.85rem;
  padding: 0.15rem 0.35rem;
  border-radius: 4px;
}

.caniuse-icon {
  color: var(--vp-c-brand-1, #e87722);
  flex-shrink: 0;
}

.caniuse-link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  color: var(--vp-c-brand-1, #e87722);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.8rem;
  transition: opacity 0.2s;
}

.caniuse-link:hover {
  text-decoration: underline;
  opacity: 0.85;
}

.caniuse-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--vp-c-bg);
}

.caniuse-img-link {
  display: block;
  width: 100%;
  max-width: 800px;
  text-align: center;
  transition: transform 0.15s ease;
}

.caniuse-img-link:hover {
  transform: scale(1.005);
}

.caniuse-img {
  display: block;
  width: 100%;
  height: auto;
  max-width: 800px;
  margin: 0 auto;
  border-radius: 4px;
}

.caniuse-fallback {
  text-align: center;
  padding: 1rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.caniuse-fallback-link {
  display: inline-block;
  margin-top: 0.5rem;
  color: var(--vp-c-brand-1, #e87722);
  font-weight: 600;
  text-decoration: none;
}

.caniuse-fallback-link:hover {
  text-decoration: underline;
}
</style>
