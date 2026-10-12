<template>
    <Teleport to="body">
        <Transition name="ann-modal-fade">
            <div
                v-if="isOpen"
                class="ann-modal-overlay"
                @click.self="close"
            >
                <div class="ann-modal" :class="{ 'ann-modal--confirm': confirmingDelete }" @click.stop>
                    <!-- Normal Edit Mode -->
                    <template v-if="!confirmingDelete">
                        <!-- Header -->
                        <div class="ann-modal__header">
                            <h3 class="ann-modal__title">
                                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                                </svg>
                                Markering bewerken
                            </h3>
                            <button class="ann-modal__close" @click="close" aria-label="Sluiten">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        </div>

                        <!-- Highlighted text (read-only) with dynamic color border -->
                        <blockquote
                            class="ann-modal__quote"
                            :style="{ borderLeftColor: ANNOTATION_COLORS[currentColor] || '#ffe066' }"
                        >
                            "{{ annotation?.selector?.exact }}"
                        </blockquote>

                        <!-- Color -->
                        <div class="ann-modal__section">
                            <label class="ann-modal__label">Kleur</label>
                            <div class="ann-modal__colors">
                                <button
                                    v-for="(hex, name) in ANNOTATION_COLORS"
                                    :key="name"
                                    class="ann-modal__color-btn"
                                    :class="{ 'ann-modal__color-btn--active': currentColor === name }"
                                    :style="{ background: hex }"
                                    :title="ANNOTATION_COLOR_NAMES[name] || name"
                                    @click="changeColor(name)"
                                ></button>
                            </div>
                        </div>

                        <!-- Note -->
                        <div class="ann-modal__section">
                            <label class="ann-modal__label" for="ann-note-input">Notitie</label>
                            <textarea
                                id="ann-note-input"
                                ref="noteTextarea"
                                v-model="editComment"
                                class="ann-modal__textarea"
                                placeholder="Voeg een notitie toe... (optioneel)"
                                rows="4"
                                @keydown.ctrl.enter="save"
                                @keydown.meta.enter="save"
                            ></textarea>
                            <p class="ann-modal__hint">Ctrl + Enter om op te slaan</p>
                        </div>

                        <!-- Footer -->
                        <div class="ann-modal__footer">
                            <button class="ann-modal__btn ann-modal__btn--delete" @click="confirmingDelete = true">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6l-1 14H6L5 6"/>
                                    <path d="M10 11v6M14 11v6"/>
                                    <path d="M9 6V4h6v2"/>
                                </svg>
                                Markering verwijderen
                            </button>
                            <div class="ann-modal__footer-right">
                                <button class="ann-modal__btn ann-modal__btn--cancel" @click="close">Annuleren</button>
                                <button class="ann-modal__btn ann-modal__btn--save" @click="save">Opslaan</button>
                            </div>
                        </div>
                    </template>

                    <!-- Delete Confirmation Mode -->
                    <template v-else>
                        <div class="ann-modal__header">
                            <h3 class="ann-modal__title ann-modal__title--danger">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6l-1 14H6L5 6"/>
                                    <path d="M10 11v6M14 11v6"/>
                                    <path d="M9 6V4h6v2"/>
                                </svg>
                                Markering verwijderen?
                            </h3>
                            <button class="ann-modal__close" @click="confirmingDelete = false" aria-label="Sluiten">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        </div>

                        <p class="ann-modal__description">
                            Weet je zeker dat je deze markering wilt verwijderen? Dit kan niet ongedaan worden gemaakt.
                        </p>

                        <blockquote
                            class="ann-modal__quote"
                            :style="{ borderLeftColor: ANNOTATION_COLORS[currentColor] || '#ffe066' }"
                        >
                            "{{ annotation?.selector?.exact }}"
                        </blockquote>

                        <p v-if="editComment || annotation?.comment" class="ann-modal__note-preview">
                            <strong>Notitie:</strong> {{ editComment || annotation?.comment }}
                        </p>

                        <div class="ann-modal__footer">
                            <button class="ann-modal__btn ann-modal__btn--cancel" @click="confirmingDelete = false">
                                Annuleren
                            </button>
                            <button class="ann-modal__btn ann-modal__btn--delete-confirm" @click="executeDelete">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6l-1 14H6L5 6"/>
                                </svg>
                                Markering verwijderen
                            </button>
                        </div>
                    </template>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useAnnotations, ANNOTATION_COLORS, ANNOTATION_COLOR_NAMES } from '../composables/useAnnotations.js'

const {
    getAnnotationById,
    getAnnotationIdAtPoint,
    updateAnnotation,
    updateAnnotationColor,
    deleteAnnotation,
    applyHighlights,
} = useAnnotations()

// ─── State ─────────────────────────────────────────────────────────────────
const isOpen           = ref(false)
const activeId         = ref(null)
const editComment      = ref('')
const noteTextarea     = ref(null)
const confirmingDelete = ref(false)

const annotation = computed(() => activeId.value ? getAnnotationById(activeId.value) : null)
const currentColor = computed(() => annotation.value?.color || 'yellow')

// ─── Open / Close ──────────────────────────────────────────────────────────

function openModal(id) {
    const ann = getAnnotationById(id)
    if (!ann) return
    activeId.value         = id
    editComment.value      = ann.comment || ''
    confirmingDelete.value = false
    isOpen.value           = true
    nextTick(() => noteTextarea.value?.focus())
}

function close() {
    isOpen.value           = false
    activeId.value         = null
    confirmingDelete.value = false
}

// ─── Actions ───────────────────────────────────────────────────────────────

function changeColor(name) {
    if (!activeId.value) return
    updateAnnotationColor(activeId.value, name)
}

function save() {
    if (!activeId.value) return
    updateAnnotation(activeId.value, editComment.value)
    close()
}

function executeDelete() {
    if (!activeId.value) return
    deleteAnnotation(activeId.value)
    close()
}

// ─── Click detection ───────────────────────────────────────────────────────

function onDocumentClick(e) {
    // Don't intercept link clicks (safe-guard for synthetic events too)
    if (e.target && typeof e.target.closest === 'function' && e.target.closest('a')) return

    const id = getAnnotationIdAtPoint(e.clientX, e.clientY)
    if (id) {
        e.preventDefault()
        e.stopPropagation()
        openModal(id)
    }
}

// ─── Keyboard: Escape to close ─────────────────────────────────────────────

function onKeydown(e) {
    if (e.key === 'Escape' && isOpen.value) {
        if (confirmingDelete.value) {
            confirmingDelete.value = false
        } else {
            close()
        }
    }
}

// ─── Lifecycle ─────────────────────────────────────────────────────────────

onMounted(() => {
    document.addEventListener('click', onDocumentClick)
    document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
    document.removeEventListener('click', onDocumentClick)
    document.removeEventListener('keydown', onKeydown)
})
</script>
