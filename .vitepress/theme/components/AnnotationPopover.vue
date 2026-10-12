<template>
    <!-- Simple, non-interactive tooltip — pointer-events: none -->
    <Teleport to="body">
        <Transition name="ann-tooltip">
            <div
                v-if="activeId && annotation?.comment"
                class="ann-tooltip"
                :style="tooltipStyle"
            >
                <span class="ann-tooltip__text">{{ annotation.comment }}</span>
                <span class="ann-tooltip__hint">Klik om te bewerken</span>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useAnnotations, ANNOTATION_COLORS } from '../composables/useAnnotations.js'

const { getAnnotationById, getAnnotationIdAtPoint, getHighlightRange } = useAnnotations()

const activeId = ref(null)
const anchorPos = ref({ x: 0, y: 0 })
let hideTimer = null
let moveThrottle = null

const annotation = computed(() => activeId.value ? getAnnotationById(activeId.value) : null)

// ─── Positioning — centered above the highlight rect ───────────────────────

function capturePosition(id, fallbackX, fallbackY) {
    const range = getHighlightRange(id)
    if (range) {
        try {
            const rect = range.getBoundingClientRect()
            anchorPos.value = { x: rect.left + rect.width / 2, y: rect.top }
            return
        } catch {}
    }
    anchorPos.value = { x: fallbackX, y: fallbackY }
}

const tooltipStyle = computed(() => ({
    position: 'fixed',
    left: `${anchorPos.value.x}px`,
    top: `${anchorPos.value.y - 8}px`,
    transform: 'translate(-50%, -100%)',
    zIndex: 1050,
    pointerEvents: 'none',
}))

// ─── Hover detection ───────────────────────────────────────────────────────

function onMousemove(e) {
    if (moveThrottle) return
    moveThrottle = requestAnimationFrame(() => {
        moveThrottle = null

        const contentEl = document.querySelector('.vp-doc') || document.querySelector('main')
        if (!contentEl) return

        const cr = contentEl.getBoundingClientRect()
        const inContent = e.clientX >= cr.left && e.clientX <= cr.right &&
                          e.clientY >= cr.top  && e.clientY <= cr.bottom

        if (!inContent) {
            scheduleHide()
            return
        }

        const id = getAnnotationIdAtPoint(e.clientX, e.clientY)
        if (id) {
            clearHideTimer()
            // Update cursor to signal the text is clickable
            contentEl.style.cursor = 'pointer'

            if (id !== activeId.value) {
                capturePosition(id, e.clientX, e.clientY)
                activeId.value = id
            }
        } else {
            contentEl.style.cursor = ''
            scheduleHide()
        }
    })
}

function scheduleHide() {
    if (hideTimer) return
    hideTimer = setTimeout(() => {
        activeId.value = null
        hideTimer = null
    }, 150)
}

function clearHideTimer() {
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = null }
}

onMounted(() => document.addEventListener('mousemove', onMousemove))
onUnmounted(() => {
    document.removeEventListener('mousemove', onMousemove)
    clearHideTimer()
    if (moveThrottle) cancelAnimationFrame(moveThrottle)
})
</script>
