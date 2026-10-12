<template>
    <!-- This component has no visible UI of its own.
         It re-applies highlights after each route change, HMR update, or DOM content change,
         and scrolls to the target highlight when the URL contains an #annotation-<id> hash. -->
</template>

<script setup>
import { watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useData } from 'vitepress'
import { useAnnotations } from '../composables/useAnnotations.js'

const route = useRoute()
const { page } = useData()
const { applyHighlights, scrollToAnnotation } = useAnnotations()

let observer = null
let debounceTimer = null
let isApplying = false

function checkAndScrollToHash() {
    if (typeof window === 'undefined') return
    const hash = window.location.hash
    if (!hash || !hash.startsWith('#annotation-')) return

    const id = hash.slice('#annotation-'.length)
    if (!id) return

    let attempts = 0
    const tryScroll = () => {
        const success = scrollToAnnotation(id)
        if (!success && attempts < 12) {
            attempts++
            setTimeout(tryScroll, 100)
        }
    }
    setTimeout(tryScroll, 120)
}

/**
 * Re-apply highlights after navigation or DOM content updates.
 * Debounced to batch rapid DOM mutations or HMR updates.
 */
function applyWithDelay(path) {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
        let attempts = 0
        const tryApply = () => {
            const contentEl = document.querySelector('.vp-doc')
            if (contentEl || attempts > 6) {
                isApplying = true
                try {
                    applyHighlights(path || route.path)
                    checkAndScrollToHash()
                } finally {
                    setTimeout(() => {
                        isApplying = false
                    }, 60)
                }
            } else {
                attempts++
                setTimeout(tryApply, 80)
            }
        }
        tryApply()
    }, 120)
}

function setupObserver() {
    if (typeof window === 'undefined') return
    const target = document.querySelector('.VPContent') || document.querySelector('#VPContent') || document.querySelector('main') || document.body
    if (!target) return

    observer = new MutationObserver((mutations) => {
        if (isApplying) return

        // Skip mutations from our own UI (tooltips, modales, marks, pulse overlays)
        const isSelfMutation = mutations.every(m => {
            const target = m.target
            if (target && target.classList) {
                if (target.classList.contains('vp-annotation-mark') ||
                    target.classList.contains('vp-annotation-jump-pulse') ||
                    target.className?.toString?.().includes('ann-') ||
                    target.className?.toString?.().includes('annotation-')) {
                    return true
                }
            }
            return false
        })

        if (isSelfMutation) return

        applyWithDelay(route.path)
    })

    observer.observe(target, {
        childList: true,
        subtree: true,
    })
}

onMounted(() => {
    applyWithDelay(route.path)
    setupObserver()
    window.addEventListener('hashchange', checkAndScrollToHash)

    // Vite HMR: automatically re-apply highlights when markdown files are edited during dev
    if (import.meta.hot) {
        import.meta.hot.on('vite:afterUpdate', () => {
            applyWithDelay(route.path)
        })
    }
})

onUnmounted(() => {
    if (observer) {
        observer.disconnect()
        observer = null
    }
    if (debounceTimer) clearTimeout(debounceTimer)
    window.removeEventListener('hashchange', checkAndScrollToHash)
})

watch(() => [route.path, route.hash], () => {
    applyWithDelay(route.path)
})

watch(() => page.value, () => {
    applyWithDelay(route.path)
}, { deep: true })
</script>
