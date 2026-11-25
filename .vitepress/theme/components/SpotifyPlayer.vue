<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { Headphones, Video, ExternalLink, Clock } from '@lucide/vue'

interface Props {
  url?: string
  type?: 'audio' | 'video'
  title?: string
  description?: string
}

const props = withDefaults(defineProps<Props>(), {
  url: '',
  type: 'audio',
  title: '',
  description: '',
})

const { isDark } = useData()

const parsedSpotify = computed(() => {
  if (!props.url) return null
  const match = props.url
    .trim()
    .match(/open\.spotify\.com\/(?:embed\/)?(episode|show|track|playlist)\/([a-zA-Z0-9]+)/)
  if (!match) return null
  return {
    kind: match[1],
    id: match[2],
  }
})

const embedUrl = computed(() => {
  if (!parsedSpotify.value) return ''
  const { kind, id } = parsedSpotify.value
  const videoSuffix = props.type === 'video' && kind === 'episode' ? '/video' : ''
  const themeParam = isDark.value ? '&theme=0' : ''
  return `https://open.spotify.com/embed/${kind}/${id}${videoSuffix}?utm_source=generator${themeParam}`
})

const externalUrl = computed(() => {
  if (!parsedSpotify.value) return ''
  const { kind, id } = parsedSpotify.value
  return `https://open.spotify.com/${kind}/${id}`
})

const displayTitle = computed(() => {
  if (props.title) return props.title
  return props.type === 'video' ? 'Video-podcast' : 'Audio-podcast'
})
</script>

<template>
  <div class="spotify-card" :class="`is-${type}`">
    <div class="spotify-card__header">
      <div class="spotify-card__title-group">
        <span class="spotify-card__icon" aria-hidden="true">
          <Video v-if="type === 'video'" :size="18" />
          <Headphones v-else :size="18" />
        </span>
        <div>
          <div class="spotify-card__title">{{ displayTitle }}</div>
          <p v-if="description" class="spotify-card__description">{{ description }}</p>
        </div>
      </div>

      <a
        v-if="externalUrl"
        :href="externalUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="spotify-card__external"
      >
        <span>Openen in Spotify</span>
        <ExternalLink :size="14" aria-hidden="true" />
      </a>
    </div>

    <div v-if="embedUrl" class="spotify-card__player" :class="{ 'is-video': type === 'video' }">
      <iframe
        :src="embedUrl"
        :title="displayTitle"
        frameborder="0"
        allowfullscreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>

    <div v-else class="spotify-card__placeholder">
      <Clock :size="20" aria-hidden="true" />
      <span>Deze {{ type === 'video' ? 'video-podcast' : 'audio-podcast' }} is binnenkort beschikbaar.</span>
    </div>
  </div>
</template>

<style scoped>
.spotify-card {
  margin: 1.25rem 0 1.75rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}

.spotify-card__header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.spotify-card__title-group {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  min-width: 0;
}

.spotify-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 8px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.spotify-card__title {
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.3;
  color: var(--vp-c-text-1);
}

.spotify-card__description {
  margin: 0.15rem 0 0;
  font-size: 0.85rem;
  line-height: 1.4;
  color: var(--vp-c-text-2);
}

.spotify-card__external {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.7rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.8rem;
  font-weight: 500;
  text-decoration: none;
  transition: border-color 0.2s ease, color 0.2s ease;
}

.spotify-card__external:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.spotify-card__player {
  padding: 0.85rem 1rem 1rem;
}

.spotify-card__player iframe {
  display: block;
  width: 100%;
  height: 152px;
  border: 0;
  border-radius: 12px;
}

.spotify-card__player.is-video iframe {
  height: auto;
  aspect-ratio: 16 / 9;
  min-height: 280px;
}

.spotify-card__placeholder {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 1.5rem 1rem;
  color: var(--vp-c-text-2);
  font-size: 0.92rem;
}
</style>
