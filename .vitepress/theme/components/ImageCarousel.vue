<template>
  <div
    class="image-carousel"
    tabindex="0"
    role="region"
    aria-roledescription="carousel"
    :aria-label="title || 'Afbeeldingen galerij'"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @keydown="handleKeyDown"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <!-- Verborgen slots-container om VNodes uit het default slot te kunnen inspecteren -->
    <div ref="hiddenSlotRef" style="display: none;" class="no-zoom">
      <slot />
    </div>

    <!-- Titelbalk (indien titel meegegeven) -->
    <div v-if="title" class="carousel-header">
      <span class="carousel-title">{{ title }}</span>
      <span class="carousel-counter" aria-live="polite">
        {{ currentIndex + 1 }} / {{ totalSlides }}
      </span>
    </div>

    <!-- Hoofdweergave (Main Stage) -->
    <div class="carousel-stage" :style="{ aspectRatio: aspectRatio }">
      <!-- Badge teller indien geen header -->
      <span v-if="!title && totalSlides > 1" class="carousel-badge">
        {{ currentIndex + 1 }} / {{ totalSlides }}
      </span>

      <!-- Autoplay pauzeer/hervat knop (indien auto actief) -->
      <button
        v-if="auto && totalSlides > 1"
        type="button"
        class="carousel-play-btn"
        :title="isPlaying ? 'Automatisch afspelen pauzeren' : 'Automatisch afspelen starten'"
        :aria-label="isPlaying ? 'Pauzeren' : 'Afspelen'"
        @click.stop="togglePlay"
      >
        <!-- Pauze icoon -->
        <svg v-if="isPlaying" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
        <!-- Play icoon -->
        <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      </button>

      <!-- Actieve afbeelding -->
      <div v-if="currentSlide" class="carousel-slide-wrapper">
        <Transition name="carousel-fade" mode="out-in">
          <div :key="currentIndex" class="carousel-slide">
            <img
              :src="currentSlide.src"
              :alt="currentSlide.alt || currentSlide.title || `Afbeelding ${currentIndex + 1}`"
              class="carousel-img no-zoom"
              loading="lazy"
            />
          </div>
        </Transition>
      </div>

      <!-- Vorige knop -->
      <button
        v-if="nav && totalSlides > 1"
        type="button"
        class="carousel-nav-btn carousel-nav-prev"
        :disabled="!loop && currentIndex === 0"
        title="Vorige afbeelding"
        aria-label="Vorige afbeelding"
        @click="prev"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <!-- Volgende knop -->
      <button
        v-if="nav && totalSlides > 1"
        type="button"
        class="carousel-nav-btn carousel-nav-next"
        :disabled="!loop && currentIndex === totalSlides - 1"
        title="Volgende afbeelding"
        aria-label="Volgende afbeelding"
        @click="next"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <!-- Ondertitel / bijschrift -->
      <div v-if="currentSlide && (currentSlide.alt || currentSlide.caption)" class="carousel-caption">
        {{ currentSlide.caption || currentSlide.alt }}
      </div>
    </div>

    <!-- Bolletjes indicatoren (dots) -->
    <div v-if="dots && totalSlides > 1" class="carousel-dots" role="tablist">
      <button
        v-for="(_, idx) in slides"
        :key="idx"
        type="button"
        role="tab"
        class="carousel-dot"
        :class="{ 'is-active': idx === currentIndex }"
        :aria-selected="idx === currentIndex"
        :aria-label="`Ga naar afbeelding ${idx + 1}`"
        @click="goTo(idx)"
      />
    </div>

    <!-- Thumbnails balk (indien thumbnails prop true is) -->
    <div v-if="thumbnails && totalSlides > 1" class="carousel-thumbnails" role="tablist">
      <button
        v-for="(slide, idx) in slides"
        :key="idx"
        type="button"
        role="tab"
        class="carousel-thumb"
        :class="{ 'is-active': idx === currentIndex }"
        :aria-selected="idx === currentIndex"
        :aria-label="`Selecteer afbeelding ${idx + 1}`"
        @click="goTo(idx)"
      >
        <img :src="slide.src" :alt="slide.alt || `Thumbnail ${idx + 1}`" class="carousel-thumb-img no-zoom" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, useSlots, nextTick, type VNode } from 'vue'

interface SlideItem {
  src: string
  alt?: string
  caption?: string
  title?: string
}

const props = withDefaults(
  defineProps<{
    images?: Array<string | SlideItem>
    auto?: boolean
    interval?: number
    thumbnails?: boolean
    nav?: boolean
    dots?: boolean
    loop?: boolean
    aspectRatio?: string
    title?: string
  }>(),
  {
    images: () => [],
    auto: false,
    interval: 5000,
    thumbnails: true,
    nav: true,
    dots: true,
    loop: true,
    aspectRatio: '16/10',
    title: '',
  }
)

const slots = useSlots()
const hiddenSlotRef = ref<HTMLElement | null>(null)
const extractedSlides = ref<SlideItem[]>([])
const currentIndex = ref(0)
const isPlaying = ref(props.auto)
let autoplayTimer: ReturnType<typeof setInterval> | null = null

// Hulpfunctie om VNodes recursief te inspecteren op img-tags
const extractFromVNodes = (vnodes: VNode[]): SlideItem[] => {
  const items: SlideItem[] = []
  for (const vnode of vnodes) {
    if (!vnode) continue
    if (vnode.type === 'img' && vnode.props?.src) {
      items.push({
        src: vnode.props.src,
        alt: vnode.props.alt || '',
        caption: vnode.props.alt || '',
        title: vnode.props.title || '',
      })
    } else if (Array.isArray(vnode.children)) {
      items.push(...extractFromVNodes(vnode.children as VNode[]))
    }
  }
  return items
}

// Haal ook eventuele <img> elementen op uit de verborgen DOM container
const updateExtractedSlides = () => {
  if (props.images && props.images.length > 0) return

  // 1. Probeer eerst via Vue VNodes
  if (slots.default) {
    const fromSlots = extractFromVNodes(slots.default())
    if (fromSlots.length > 0) {
      extractedSlides.value = fromSlots
      return
    }
  }

  // 2. Fallback via DOM inspectie
  if (hiddenSlotRef.value) {
    const imgs = hiddenSlotRef.value.querySelectorAll('img')
    if (imgs.length > 0) {
      extractedSlides.value = Array.from(imgs).map((img) => ({
        src: img.getAttribute('src') || '',
        alt: img.getAttribute('alt') || '',
        caption: img.getAttribute('alt') || '',
        title: img.getAttribute('title') || '',
      }))
    }
  }
}

// Bepaal de definitieve lijst van slides (props.images heeft voorrang indien meegegeven)
const slides = computed<SlideItem[]>(() => {
  if (props.images && props.images.length > 0) {
    return props.images.map((item) => {
      if (typeof item === 'string') {
        return { src: item, alt: '', caption: '' }
      }
      return item
    })
  }
  return extractedSlides.value
})

const totalSlides = computed(() => slides.value.length)

const currentSlide = computed<SlideItem | null>(() => {
  if (totalSlides.value === 0) return null
  return slides.value[currentIndex.value] || slides.value[0]
})

// Navigatie functies
const next = () => {
  if (totalSlides.value <= 1) return
  if (currentIndex.value < totalSlides.value - 1) {
    currentIndex.value++
  } else if (props.loop) {
    currentIndex.value = 0
  }
}

const prev = () => {
  if (totalSlides.value <= 1) return
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else if (props.loop) {
    currentIndex.value = totalSlides.value - 1
  }
}

const goTo = (index: number) => {
  if (index >= 0 && index < totalSlides.value) {
    currentIndex.value = index
  }
}

// Autoplay logica
const startAutoplay = () => {
  stopAutoplay()
  if (props.auto && isPlaying.value && totalSlides.value > 1) {
    autoplayTimer = setInterval(() => {
      next()
    }, props.interval)
  }
}

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    startAutoplay()
  } else {
    stopAutoplay()
  }
}

const handleMouseEnter = () => {
  if (props.auto && isPlaying.value) {
    stopAutoplay()
  }
}

const handleMouseLeave = () => {
  if (props.auto && isPlaying.value) {
    startAutoplay()
  }
}

// Toetsenbordnavigatie
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight') {
    e.preventDefault()
    next()
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault()
    prev()
  }
}

// Touch swipe logica voor mobiel
let touchStartX = 0
const handleTouchStart = (e: TouchEvent) => {
  if (e.touches.length > 0) {
    touchStartX = e.touches[0].clientX
  }
}

const handleTouchEnd = (e: TouchEvent) => {
  if (e.changedTouches.length > 0) {
    const diff = touchStartX - e.changedTouches[0].clientX
    if (diff > 45) {
      next()
    } else if (diff < -45) {
      prev()
    }
  }
}

onMounted(() => {
  updateExtractedSlides()
  nextTick(() => {
    updateExtractedSlides()
    if (props.auto) {
      startAutoplay()
    }
  })
})

onBeforeUnmount(() => {
  stopAutoplay()
})
</script>

<style>
.image-carousel {
  margin: 24px 0;
  border-radius: 12px;
  overflow: hidden;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.image-carousel:focus-visible {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

/* Header boven de carousel */
.carousel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background-color: var(--vp-c-bg-elv);
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.carousel-counter {
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

/* Hoofdpodium */
.carousel-stage {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--tm-light-blue, #eef4fa);
  overflow: hidden;
}

.carousel-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  padding: 3px 9px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  background-color: rgba(30, 45, 90, 0.75);
  color: #ffffff;
  backdrop-filter: blur(4px);
  user-select: none;
}

.carousel-play-btn {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background-color: rgba(30, 45, 90, 0.75);
  color: #ffffff;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: background-color 0.2s, transform 0.1s;
}

.carousel-play-btn:hover {
  background-color: var(--vp-c-brand-1);
  transform: scale(1.08);
}

/* Slide weergave */
.carousel-slide-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-slide {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.carousel-img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  user-select: none;
  cursor: default !important;
  transition: transform 0.3s ease;
}

/* Navigatie pijlen */
.carousel-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(30, 45, 90, 0.12);
  background-color: rgba(255, 255, 255, 0.92);
  color: var(--tm-dark-blue, #1e2d5a);
  cursor: pointer;
  backdrop-filter: blur(8px);
  box-shadow: 0 3px 10px rgba(30, 45, 90, 0.12);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: 0.92;
}

.carousel-nav-prev {
  left: 14px;
}

.carousel-nav-next {
  right: 14px;
}

.carousel-nav-btn:hover:not(:disabled) {
  opacity: 1;
  background-color: var(--vp-c-brand-1);
  color: #ffffff;
  border-color: var(--vp-c-brand-1);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 4px 14px rgba(232, 119, 34, 0.4);
}

.carousel-nav-btn:disabled {
  opacity: 0.25;
  cursor: not-allowed;
}

.dark .carousel-nav-btn {
  background-color: rgba(30, 45, 90, 0.85);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
}

.dark .carousel-nav-btn:hover:not(:disabled) {
  background-color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #ffffff;
}

/* Ondertitel / Caption */
.carousel-caption {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 8;
  padding: 6px 16px;
  max-width: 85%;
  border-radius: 20px;
  background-color: rgba(30, 45, 90, 0.85);
  color: #ffffff;
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  backdrop-filter: blur(6px);
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(30, 45, 90, 0.25);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Dot indicatoren */
.carousel-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: var(--vp-c-bg-elv);
  border-top: 1px solid var(--vp-c-divider);
}

.carousel-dot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  border: none;
  background-color: var(--vp-c-divider);
  cursor: pointer;
  padding: 0;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.carousel-dot:hover {
  background-color: var(--vp-c-brand-soft);
}

.carousel-dot.is-active {
  width: 22px;
  background-color: var(--vp-c-brand-1);
}

/* Thumbnails balk */
.carousel-thumbnails {
  display: flex;
  align-items: center;
  justify-content: center;
  justify-content: safe center;
  gap: 8px;
  padding: 12px 16px;
  background-color: var(--vp-c-bg-elv);
  border-top: 1px solid var(--vp-c-divider);
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: thin;
}

.carousel-thumb {
  position: relative;
  flex-shrink: 0;
  width: 72px;
  height: 48px;
  border-radius: 6px;
  border: 2px solid transparent;
  background-color: var(--tm-light-blue, #eef4fa);
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  opacity: 0.65;
  transition: all 0.2s ease;
}

.carousel-thumb:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.carousel-thumb.is-active {
  opacity: 1;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
  transform: translateY(-2px);
}

.carousel-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Slide overgangsanimatie */
.carousel-fade-enter-active,
.carousel-fade-leave-active {
  transition: opacity 0.25s ease;
}

.carousel-fade-enter-from,
.carousel-fade-leave-to {
  opacity: 0;
}

/* Responsief */
@media (max-width: 640px) {
  .carousel-nav-btn {
    width: 32px;
    height: 32px;
  }
  .carousel-nav-prev {
    left: 8px;
  }
  .carousel-nav-next {
    right: 8px;
  }
  .carousel-thumb {
    width: 54px;
    height: 36px;
  }
}
</style>
