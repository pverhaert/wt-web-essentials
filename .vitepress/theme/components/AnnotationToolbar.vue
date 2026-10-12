<template>
    <!-- Floating toolbar shown when user has text selected -->
    <Teleport to="body">
        <Transition name="annotation-toolbar">
            <div
                v-if="visible"
                ref="toolbarEl"
                class="annotation-toolbar"
                :style="{ top: position.y + 'px', left: position.x + 'px' }"
                @mousedown.prevent
            >
                <button
                    class="annotation-btn annotation-btn--highlight"
                    title="Geselecteerde tekst markeren"
                    @click="handleHighlight"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                    </svg>
                    Markeren
                </button>
            </div>
        </Transition>
    </Teleport>

    <!-- Add Highlight Modal -->
    <Teleport to="body">
        <Transition name="ann-modal-fade">
            <div
                v-if="showDialog"
                class="ann-modal-overlay"
                @click.self="cancelDialog"
            >
                <div class="ann-modal" @click.stop>
                    <!-- Header -->
                    <div class="ann-modal__header">
                        <h3 class="ann-modal__title">
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                            </svg>
                            Markering toevoegen
                        </h3>
                        <button class="ann-modal__close" @click="cancelDialog" aria-label="Sluiten">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </div>

                    <!-- Highlighted text (read-only) with dynamic color border -->
                    <blockquote
                        class="ann-modal__quote"
                        :style="{ borderLeftColor: ANNOTATION_COLORS[selectedColor] || '#ffe066' }"
                    >
                        "{{ pendingExact }}"
                    </blockquote>

                    <!-- Color -->
                    <div class="ann-modal__section">
                        <label class="ann-modal__label">Kleur</label>
                        <div class="ann-modal__colors">
                            <button
                                v-for="(hex, name) in ANNOTATION_COLORS"
                                :key="name"
                                class="ann-modal__color-btn"
                                :class="{ 'ann-modal__color-btn--active': selectedColor === name }"
                                :style="{ background: hex }"
                                :title="ANNOTATION_COLOR_NAMES[name] || name"
                                @click="selectedColor = name"
                            ></button>
                        </div>
                    </div>

                    <!-- Note -->
                    <div class="ann-modal__section">
                        <label class="ann-modal__label" for="ann-add-note-input">Notitie</label>
                        <textarea
                            id="ann-add-note-input"
                            ref="noteTextarea"
                            v-model="pendingComment"
                            class="ann-modal__textarea"
                            placeholder="Voeg een notitie toe... (optioneel)"
                            rows="4"
                            @keydown.ctrl.enter="saveAnnotation"
                            @keydown.meta.enter="saveAnnotation"
                        ></textarea>
                        <p class="ann-modal__hint">Ctrl + Enter om op te slaan</p>
                    </div>

                    <!-- Footer -->
                    <div class="ann-modal__footer" style="justify-content: flex-end;">
                        <div class="ann-modal__footer-right">
                            <button class="ann-modal__btn ann-modal__btn--cancel" @click="cancelDialog">Annuleren</button>
                            <button class="ann-modal__btn ann-modal__btn--save" @click="saveAnnotation">Opslaan</button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'
import { useAnnotations, ANNOTATION_COLORS, ANNOTATION_COLOR_NAMES } from '../composables/useAnnotations.js'

const route = useRoute()
const { addAnnotation, applyHighlights } = useAnnotations()

// ─── Toolbar state ─────────────────────────────────────────────────────────
const visible = ref(false)
const position = ref({ x: 0, y: 0 })
const toolbarEl = ref(null)

// ─── Dialog state ──────────────────────────────────────────────────────────
const showDialog = ref(false)
const pendingComment = ref('')
const pendingExact = ref('')
const selectedColor = ref('yellow')
const noteTextarea = ref(null)

/**
 * We store a CLONED Range (not the live Selection).
 * The Selection is cleared the moment the dialog textarea receives focus,
 * so we must capture the range before opening the dialog.
 */
let pendingRange = null

// ─── Selection listener ────────────────────────────────────────────────────

function onSelectionChange() {
    const selection = window.getSelection()

    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        if (!showDialog.value) visible.value = false
        return
    }

    // Only show inside the main doc content area
    const range = selection.getRangeAt(0)
    const contentEl = document.querySelector('.vp-doc') || document.querySelector('main')
    if (!contentEl || !contentEl.contains(range.commonAncestorContainer)) {
        visible.value = false
        return
    }

    // Position toolbar above the selection
    const rect = range.getBoundingClientRect()
    position.value = {
        x: Math.max(8, rect.left + rect.width / 2 - 56 + window.scrollX),
        y: rect.top + window.scrollY - 48,
    }

    visible.value = true
}

function onMousedown(e) {
    if (toolbarEl.value && !toolbarEl.value.contains(e.target)) {
        if (!showDialog.value) {
            visible.value = false
        }
    }
}

// ─── Actions ───────────────────────────────────────────────────────────────

function handleHighlight() {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) return

    const exact = selection.toString().trim()
    if (!exact) return

    // ⚠️  Clone the range NOW, before the dialog opens and steals focus,
    //     which would clear the browser's selection.
    try {
        pendingRange = selection.getRangeAt(0).cloneRange()
    } catch {
        return
    }

    pendingExact.value = exact
    pendingComment.value = ''
    selectedColor.value = 'yellow'
    visible.value = false
    showDialog.value = true
    nextTick(() => noteTextarea.value?.focus())
}

function saveAnnotation() {
    if (!pendingRange || !pendingExact.value) {
        showDialog.value = false
        return
    }

    const result = addAnnotation(
        route.path,
        pendingRange,
        pendingExact.value,
        pendingComment.value,
        selectedColor.value
    )

    if (result) {
        // Apply highlights immediately after saving
        applyHighlights(route.path)
    }

    pendingRange = null
    showDialog.value = false
    window.getSelection()?.removeAllRanges()
}

function cancelDialog() {
    pendingRange = null
    showDialog.value = false
    window.getSelection()?.removeAllRanges()
}

function onKeydown(e) {
    if (e.key === 'Escape' && showDialog.value) {
        cancelDialog()
    }
}

// ─── Lifecycle ─────────────────────────────────────────────────────────────

onMounted(() => {
    document.addEventListener('selectionchange', onSelectionChange)
    document.addEventListener('mousedown', onMousedown)
    document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
    document.removeEventListener('selectionchange', onSelectionChange)
    document.removeEventListener('mousedown', onMousedown)
    document.removeEventListener('keydown', onKeydown)
})
</script>
