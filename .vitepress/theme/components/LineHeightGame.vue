<template>
  <div class="lh-game" :class="{ 'game-over': winner !== null }">

    <!-- Intro instructie (enkel zichtbaar bij start) -->
    <transition name="fade">
      <div v-if="!started" class="lh-intro">
        <p class="lh-intro-text">
          Elk tekstblok hieronder heeft een andere <code>line-height</code>.<br>
          Klik op de blokken die je <strong>het minst mooi</strong> vindt totdat er nog één overblijft.
        </p>
        <button class="lh-start-btn" @click="start">Start het spel</button>
      </div>
    </transition>

    <!-- Spelgebied -->
    <transition name="fade">
      <div v-if="started && winner === null" class="lh-meta">
        <span class="lh-counter">{{ remaining }} blok{{ remaining !== 1 ? 'ken' : '' }} over</span>
        <button class="lh-reset-btn" @click="reset" title="Herstart het spel">Herstart</button>
      </div>
    </transition>

    <div v-if="started" class="lh-grid" :class="`cols-${gridCols}`">
      <transition-group name="block" tag="div" class="lh-grid-inner">
        <div
          v-for="block in visibleBlocks"
          :key="block.id"
          class="lh-block"
          :class="{ 'is-winner': winner !== null && block.id === winner.id }"
          :style="{ '--lh': block.value }"
          @click="eliminate(block)"
          role="button"
          :aria-label="`Blok met line-height ${block.value} — klik om te verwijderen`"
        >
          <div class="lh-block-inner">
            <p class="lh-text">{{ sampleText }}</p>
            <p class="lh-text">{{ sampleText2 }}</p>
          </div>
          <div class="lh-badge" :class="{ 'badge-winner': winner !== null }">
            <span v-if="winner === null">Klik om te verwijderen</span>
            <span v-else>line-height: <strong>{{ block.value }}</strong></span>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- Winnaarsscherm -->
    <transition name="winner-reveal">
      <div v-if="winner !== null" class="lh-winner-screen">
        <div class="lh-winner-card">
          <div class="lh-winner-icon">&#127942;</div>
          <h3 class="lh-winner-title">Jouw ideale regelafstand</h3>
          <div class="lh-winner-value">
            <code>line-height: {{ winner.value }}</code>
            <span v-if="winner.label" class="lh-winner-label">{{ winner.label }}</span>
          </div>
          <p class="lh-winner-note">
            Professionele typografen raden een regelafstand aan tussen
            <strong>1.4</strong> en <strong>1.6</strong> voor lopende tekst.
            De gulden snede geeft <strong>1.618</strong>, wat erg dicht bij <strong>1.5</strong> ligt.
          </p>
          <button class="lh-start-btn" @click="reset">Opnieuw spelen</button>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'

/* -------------------------------------------------------
   Configuratie: line-height waarden en labels
------------------------------------------------------- */
interface Block {
  id: number
  value: string
  label?: string
}

const ALL_BLOCKS: Block[] = [
  { id: 1,  value: '1',     label: 'geen regelafstand' },
  { id: 2,  value: '1.1' },
  { id: 3,  value: '1.2' },
  { id: 4,  value: '1.3' },
  { id: 5,  value: '1.4' },
  { id: 6,  value: '1.5',   label: 'veelgebruikte standaard' },
  { id: 7,  value: '1.618', label: 'gulden snede (Fibonacci)' },
  { id: 8,  value: '1.7' },
  { id: 9,  value: '1.8' },
  { id: 10, value: '2',     label: 'dubbele regelafstand' },
  { id: 11, value: '2.5' },
  { id: 12, value: '3',     label: 'erg ruim' },
]

const sampleText = 'Thomas More Hogeschool bevindt zich op Campus Geel, aan de Kleinhoefstraat 4. De opleiding ICT biedt een brede basis in webontwikkeling, netwerken en softwareontwikkeling.'
const sampleText2 = 'HTML en CSS vormen de basis van elke webpagina. Met de juiste regelafstand (line-height) wordt tekst leesbaarder en professioneler.'

/* -------------------------------------------------------
   State
------------------------------------------------------- */
const started  = ref(false)
const blocks   = ref<Block[]>([])
const winner   = ref<Block | null>(null)

const visibleBlocks = computed(() => blocks.value)
const remaining     = computed(() => blocks.value.length)

const gridCols = computed(() => {
  const n = remaining.value
  if (n <= 1) return 1
  if (n <= 2) return 2
  if (n <= 4) return 2
  if (n <= 6) return 3
  return 3
})

/* -------------------------------------------------------
   Spellogica
------------------------------------------------------- */
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function start() {
  blocks.value = shuffle(ALL_BLOCKS)
  winner.value = null
  started.value = true
}

function eliminate(block: Block) {
  if (winner.value !== null) return
  blocks.value = blocks.value.filter(b => b.id !== block.id)
  if (blocks.value.length === 1) {
    winner.value = blocks.value[0]
    launchConfetti()
  }
}

function reset() {
  winner.value = null
  started.value = false
  blocks.value = []
  stopConfetti()
}

/* -------------------------------------------------------
   Confetti (eenvoudige canvas-gebaseerde implementatie)
------------------------------------------------------- */
let confettiCanvas: HTMLCanvasElement | null = null
let confettiCtx: CanvasRenderingContext2D | null = null
let confettiRaf = 0
let particles: Particle[] = []

interface Particle {
  x: number; y: number
  vx: number; vy: number
  color: string
  size: number
  rotation: number
  rotSpeed: number
  alpha: number
}

function launchConfetti() {
  if (typeof window === 'undefined') return

  confettiCanvas = document.createElement('canvas')
  confettiCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;'
  confettiCanvas.width = window.innerWidth
  confettiCanvas.height = window.innerHeight
  document.body.appendChild(confettiCanvas)
  confettiCtx = confettiCanvas.getContext('2d')!

  const colors = ['#e87722', '#1e2d5a', '#e8f3fc', '#f8c471', '#2ecc71', '#3498db', '#e74c3c']
  particles = Array.from({ length: 120 }, () => ({
    x: Math.random() * confettiCanvas!.width,
    y: -20,
    vx: (Math.random() - 0.5) * 4,
    vy: Math.random() * 3 + 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 8 + 4,
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 6,
    alpha: 1,
  }))

  animateConfetti()

  // Stop na 3.5 seconden
  setTimeout(stopConfetti, 3500)
}

function animateConfetti() {
  if (!confettiCtx || !confettiCanvas) return
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height)

  particles = particles.filter(p => p.alpha > 0.02)
  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    p.rotation += p.rotSpeed
    if (p.y > confettiCanvas.height * 0.7) p.alpha -= 0.018
    confettiCtx.save()
    confettiCtx.globalAlpha = p.alpha
    confettiCtx.translate(p.x, p.y)
    confettiCtx.rotate((p.rotation * Math.PI) / 180)
    confettiCtx.fillStyle = p.color
    confettiCtx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
    confettiCtx.restore()
  }

  if (particles.length > 0) {
    confettiRaf = requestAnimationFrame(animateConfetti)
  } else {
    stopConfetti()
  }
}

function stopConfetti() {
  cancelAnimationFrame(confettiRaf)
  if (confettiCanvas) {
    confettiCanvas.remove()
    confettiCanvas = null
    confettiCtx = null
  }
  particles = []
}

onUnmounted(stopConfetti)
</script>

<style scoped>
/* ============================================================
   Container
============================================================ */
.lh-game {
  margin: 2rem 0;
  font-family: inherit;
}

/* ============================================================
   Intro scherm
============================================================ */
.lh-intro {
  text-align: center;
  padding: 2.5rem 1.5rem;
  background: var(--tm-light-blue, #e8f3fc);
  border-radius: 16px;
  border: 2px dashed var(--tm-dark-blue, #1e2d5a);
}

.dark .lh-intro {
  border-color: rgba(232, 119, 34, 0.4);
}

.lh-intro-text {
  font-size: 1.05rem;
  color: var(--vp-c-text-1);
  margin-bottom: 1.5rem;
  line-height: 1.7;
}

/* ============================================================
   Meta-balk (teller + reset)
============================================================ */
.lh-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.lh-counter {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--tm-dark-blue, #1e2d5a);
  background: var(--tm-light-blue, #e8f3fc);
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
}

.dark .lh-counter {
  color: var(--vp-c-brand-1);
}

.lh-reset-btn {
  font-size: 0.85rem;
  padding: 0.3rem 0.9rem;
  border-radius: 20px;
  border: 1.5px solid var(--tm-dark-blue, #1e2d5a);
  background: transparent;
  color: var(--tm-dark-blue, #1e2d5a);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.lh-reset-btn:hover {
  background: var(--tm-dark-blue, #1e2d5a);
  color: #fff;
}

.dark .lh-reset-btn {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.dark .lh-reset-btn:hover {
  background: var(--vp-c-brand-1);
  color: #fff;
}

/* ============================================================
   Knop
============================================================ */
.lh-start-btn {
  display: inline-block;
  padding: 0.65rem 1.8rem;
  background: var(--tm-dark-blue, #1e2d5a);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
}

.lh-start-btn:hover {
  background: var(--tm-orange, #e87722);
  transform: translateY(-2px);
}

/* ============================================================
   Grid
============================================================ */
.lh-grid {
  container-type: inline-size;
}

.lh-grid-inner {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, 1fr);
}

.lh-grid.cols-1 .lh-grid-inner { grid-template-columns: 1fr; max-width: 640px; margin: 0 auto; }
.lh-grid.cols-2 .lh-grid-inner { grid-template-columns: repeat(2, 1fr); }
.lh-grid.cols-3 .lh-grid-inner { grid-template-columns: repeat(3, 1fr); }

@container (max-width: 640px) {
  .lh-grid-inner { grid-template-columns: 1fr !important; }
}

/* ============================================================
   Blok
============================================================ */
.lh-block {
  position: relative;
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.1rem 1.1rem 2.8rem;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
  user-select: none;
  overflow: hidden;
}

.lh-block:hover {
  border-color: #e74c3c;
  box-shadow: 0 4px 20px rgba(231, 76, 60, 0.18);
  transform: translateY(-3px);
  background: rgba(231, 76, 60, 0.04);
}

.lh-block.is-winner {
  border-color: var(--tm-orange, #e87722);
  box-shadow: 0 6px 32px rgba(232, 119, 34, 0.3);
  cursor: default;
  background: var(--tm-light-blue, #e8f3fc);
}

.dark .lh-block.is-winner {
  background: #141d33;
}

.lh-block-inner {
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
}

.lh-block-inner p {
  margin: 0 0 0.6em;
  line-height: var(--lh) !important;
}

.lh-block-inner p:last-child {
  margin-bottom: 0;
}

/* ============================================================
   Badge onderaan elk blok
============================================================ */
.lh-badge {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.4rem 0.8rem;
  background: rgba(231, 76, 60, 0.85);
  color: #fff;
  font-size: 0.75rem;
  text-align: center;
  transition: background 0.2s;
}

.lh-block:not(:hover) .lh-badge {
  background: rgba(30, 45, 90, 0.55);
}

.lh-badge.badge-winner {
  background: var(--tm-orange, #e87722);
  font-size: 0.85rem;
}

/* ============================================================
   Winnaarsscherm
============================================================ */
.lh-winner-screen {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.lh-winner-card {
  background: var(--vp-c-bg-soft);
  border: 2px solid var(--tm-orange, #e87722);
  border-radius: 16px;
  padding: 2rem 2.5rem;
  text-align: center;
  max-width: 520px;
  box-shadow: 0 8px 32px rgba(232, 119, 34, 0.2);
}

.lh-winner-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.lh-winner-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--tm-dark-blue, #1e2d5a);
  margin: 0 0 1rem;
}

.dark .lh-winner-title {
  color: var(--vp-c-brand-1);
}

.lh-winner-value {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 1.2rem;
}

.lh-winner-value code {
  font-size: 1.5rem;
  background: var(--tm-light-blue, #e8f3fc);
  color: var(--tm-dark-blue, #1e2d5a);
  padding: 0.4rem 1rem;
  border-radius: 8px;
}

.dark .lh-winner-value code {
  background: #141d33;
  color: var(--vp-c-brand-1);
}

.lh-winner-label {
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  font-style: italic;
}

.lh-winner-note {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

/* ============================================================
   Transities
============================================================ */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Block list transitions */
.block-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.block-leave-to {
  opacity: 0;
  transform: scale(0.85);
}
.block-move {
  transition: transform 0.45s ease;
}

/* Winner reveal */
.winner-reveal-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.winner-reveal-enter-from {
  opacity: 0;
  transform: scale(0.7) translateY(30px);
}
</style>
