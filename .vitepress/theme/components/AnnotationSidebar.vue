<template>
    <!-- Toggle button fixed at bottom-right with custom tooltip -->
    <div
        v-if="!isAnnotationsPage"
        class="annotation-fab-container"
        :style="{ bottom: fabBottom }"
    >
        <button
            ref="fabEl"
            class="annotation-fab"
            :class="{ 'annotation-fab--active': open }"
            @click="open = !open"
            :aria-label="open ? 'Sluit markeringen' : 'Toon markeringen'"
        >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            <span v-if="pageAnnotations.length" class="annotation-fab__badge">{{ pageAnnotations.length }}</span>
        </button>

        <!-- Custom zwevende tooltip links van de knop -->
        <div class="annotation-fab-tooltip" role="tooltip">
            {{ open ? 'Sluit markeringen' : 'Toon markeringen' }}
        </div>
    </div>

    <!-- Sidebar panel -->
    <Transition name="annotation-sidebar">
        <aside v-if="open" ref="sidebarEl" class="annotation-sidebar">
            <div class="annotation-sidebar__header">
                <h2 class="annotation-sidebar__title">Mijn markeringen</h2>
                <button class="annotation-sidebar__close" @click="open = false" aria-label="Sluiten">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>

            <div class="annotation-sidebar__body">
                <div v-if="pageAnnotations.length === 0" class="annotation-sidebar__empty">
                    <p>Geen markeringen op deze pagina.</p>
                    <p class="annotation-sidebar__hint">Selecteer tekst om te beginnen met markeren.</p>
                </div>

                <ul v-else class="annotation-sidebar__list">
                    <li
                        v-for="ann in pageAnnotations"
                        :key="ann.id"
                        class="annotation-item"
                        @mouseenter="highlightItem(ann.id)"
                        @mouseleave="unhighlightItem(ann.id)"
                    >
                        <!-- Clickable quote to jump to section -->
                        <blockquote
                            class="annotation-item__quote"
                            :style="{ borderLeftColor: ANNOTATION_COLORS[ann.color || 'yellow'] }"
                            title="Klik om naar deze sectie te gaan"
                            @click="jumpTo(ann)"
                        >
                            "{{ ann.selector.exact }}"
                        </blockquote>

                        <!-- Comment view / edit toggle -->
                        <div v-if="editingId !== ann.id">
                            <p v-if="ann.comment" class="annotation-item__comment">{{ ann.comment }}</p>
                            <p v-else class="annotation-item__no-comment">Geen notitie toegevoegd</p>
                        </div>
                        <div v-else class="annotation-item__edit">
                            <textarea
                                v-model="editComment"
                                class="annotation-dialog__textarea"
                                rows="2"
                                placeholder="Voeg een notitie toe..."
                            ></textarea>
                            <div class="annotation-item__edit-actions">
                                <button class="annotation-dialog__btn annotation-dialog__btn--cancel" @click="cancelEdit">
                                    Annuleren
                                </button>
                                <button class="annotation-dialog__btn annotation-dialog__btn--save" @click="saveEdit(ann.id)">
                                    Opslaan
                                </button>
                            </div>
                        </div>

                        <!-- Color picker dots -->
                        <div class="annotation-item__colors">
                            <button
                                v-for="(hex, name) in ANNOTATION_COLORS"
                                :key="name"
                                class="annotation-item__color-dot"
                                :class="{ 'annotation-item__color-dot--active': (ann.color || 'yellow') === name }"
                                :style="{ background: hex }"
                                :title="ANNOTATION_COLOR_NAMES[name] || name"
                                @click.stop="changeColor(ann.id, name)"
                            ></button>
                        </div>

                        <!-- Action buttons -->
                        <div class="annotation-item__actions">
                            <button
                                class="annotation-item__btn annotation-item__btn--jump"
                                title="Ga naar deze sectie op de pagina"
                                @click="jumpTo(ann)"
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M15 3h6v6"/>
                                    <path d="M10 14L21 3"/>
                                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                </svg>
                                Ga naar
                            </button>
                            <button class="annotation-item__btn" title="Notitie bewerken" @click="startEdit(ann)">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                                Bewerken
                            </button>
                            <button class="annotation-item__btn annotation-item__btn--delete" title="Markering verwijderen" @click="promptDelete(ann)">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6l-1 14H6L5 6"/>
                                    <path d="M10 11v6M14 11v6"/>
                                    <path d="M9 6V4h6v2"/>
                                </svg>
                                Verwijderen
                            </button>
                        </div>

                        <time class="annotation-item__date">{{ formatDate(ann.createdAt) }}</time>
                    </li>
                </ul>
            </div>

            <div class="annotation-sidebar__footer">
                <a href="/annotations" class="annotation-sidebar__link">Bekijk alle markeringen →</a>
            </div>
        </aside>
    </Transition>

    <!-- Custom Single Highlight Delete Confirmation Modal -->
    <Teleport to="body">
        <Transition name="ann-modal-fade">
            <div
                v-if="deleteTarget"
                class="ann-modal-overlay"
                @click.self="cancelDelete"
            >
                <div class="ann-modal ann-modal--confirm" @click.stop>
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
                        <button class="ann-modal__close" @click="cancelDelete" aria-label="Sluiten">
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
                        :style="{ borderLeftColor: ANNOTATION_COLORS[deleteTarget.color || 'yellow'] }"
                    >
                        "{{ deleteTarget.selector?.exact }}"
                    </blockquote>

                    <p v-if="deleteTarget.comment" class="ann-modal__note-preview">
                        <strong>Notitie:</strong> {{ deleteTarget.comment }}
                    </p>

                    <div class="ann-modal__footer">
                        <button class="ann-modal__btn ann-modal__btn--cancel" @click="cancelDelete">
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
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'
import { useAnnotations, ANNOTATION_COLORS, ANNOTATION_COLOR_NAMES } from '../composables/useAnnotations.js'
import { usePageSummary } from '../composables/usePageSummary'

const route = useRoute()
const { hasSummary } = usePageSummary()
const {
    annotations,
    updateAnnotation,
    updateAnnotationColor,
    deleteAnnotation,
    applyHighlights,
    scrollToAnnotation,
} = useAnnotations()

const open = ref(false)
const editingId = ref(null)
const editComment = ref('')
const deleteTarget = ref(null)

// Annotations for the current page
const pageAnnotations = computed(() =>
    annotations.value.filter(a => a.route === route.path)
)

const isAnnotationsPage = computed(() =>
    route.path === '/annotations' || route.path === '/annotations.html'
)

// Dynamische hoogte: boven samenvatting (136px) of direct boven BackToTop (80px)
const fabBottom = computed(() =>
    hasSummary.value ? '136px' : '80px'
)

// Re-apply highlights when sidebar opens or route changes
watch(open, (val) => {
    if (val) applyHighlights(route.path)
})

function changeColor(id, colorName) {
    updateAnnotationColor(id, colorName)
}

function jumpTo(ann) {
    scrollToAnnotation(ann.id)
}

function startEdit(ann) {
    editingId.value = ann.id
    editComment.value = ann.comment || ''
}

function cancelEdit() {
    editingId.value = null
    editComment.value = ''
}

function saveEdit(id) {
    updateAnnotation(id, editComment.value)
    cancelEdit()
}

function promptDelete(ann) {
    deleteTarget.value = ann
}

function cancelDelete() {
    deleteTarget.value = null
}

function executeDelete() {
    if (deleteTarget.value) {
        deleteAnnotation(deleteTarget.value.id)
        deleteTarget.value = null
    }
}

function highlightItem(id) {
    document.querySelectorAll(`[data-annotation-id="${id}"]`).forEach(el => {
        el.classList.add('vp-annotation-mark--hover')
    })
}

function unhighlightItem(id) {
    document.querySelectorAll(`[data-annotation-id="${id}"]`).forEach(el => {
        el.classList.remove('vp-annotation-mark--hover')
    })
}

function formatDate(iso) {
    return new Date(iso).toLocaleDateString('nl-BE', {
        day: '2-digit', month: 'short', year: 'numeric'
    })
}

// ─── Click outside / Escape to close ───────────────────────────────────────

const sidebarEl = ref(null)
const fabEl = ref(null)

function handleClickOutside(e) {
    if (!open.value) return
    if (deleteTarget.value) return // Don't close sidebar if delete confirmation modal is open
    if (sidebarEl.value && sidebarEl.value.contains(e.target)) return
    if (fabEl.value && fabEl.value.contains(e.target)) return
    open.value = false
}

function handleKeydown(e) {
    if (e.key === 'Escape') {
        if (deleteTarget.value) {
            cancelDelete()
            return
        }
        if (open.value) {
            open.value = false
        }
    }
}

onMounted(() => {
    document.addEventListener('pointerdown', handleClickOutside)
    document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    document.removeEventListener('pointerdown', handleClickOutside)
    document.removeEventListener('keydown', handleKeydown)
})
</script>
