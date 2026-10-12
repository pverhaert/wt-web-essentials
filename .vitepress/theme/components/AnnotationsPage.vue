<template>
    <div class="annotations-page">
        <!-- Header row: Title on the left, 3 buttons aligned to the right -->
        <div class="annotations-page__header">
            <h1 class="annotations-page__title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
                Mijn markeringen
            </h1>

            <div class="annotations-page__actions">
                <button class="ann-btn ann-btn--primary" @click="doExport" :disabled="annotations.length === 0">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Exporteer JSON
                </button>

                <label class="ann-btn ann-btn--secondary">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    Importeer JSON
                    <input type="file" accept=".json,application/json" @change="doImport" class="ann-file-input" />
                </label>

                <button
                    v-if="annotations.length > 0"
                    class="ann-btn ann-btn--danger"
                    @click="promptClearAll"
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14H6L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4h6v2"/>
                    </svg>
                    Alles wissen
                </button>
            </div>
        </div>

        <!-- Import feedback -->
        <Transition name="ann-fade">
            <div v-if="importMsg" class="ann-import-msg" :class="{ 'ann-import-msg--error': importError }">
                {{ importMsg }}
            </div>
        </Transition>

        <!-- Empty state -->
        <div v-if="annotations.length === 0" class="annotations-page__empty">
            <p>Je hebt nog geen markeringen.</p>
            <p>Selecteer tekst op een willekeurige cursuspagina om te beginnen.</p>
        </div>

        <!-- Grouped by route -->
        <div v-else>
            <!-- Subheader: Count and Collapse/Expand all toggle -->
            <div class="annotations-page__subheader">
                <p class="annotations-page__count">
                    {{ annotations.length }} markering{{ annotations.length === 1 ? '' : 'en' }}
                    op {{ groupedAnnotations.length }} pagina{{ groupedAnnotations.length === 1 ? '' : '\'s' }}
                </p>

                <button
                    v-if="groupedAnnotations.length > 1"
                    class="annotations-page__toggle-all-btn"
                    @click="toggleAllCollapse"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <g v-if="allCollapsed">
                            <polyline points="7 13 12 18 17 13"/>
                            <polyline points="7 6 12 11 17 6"/>
                        </g>
                        <g v-else>
                            <polyline points="7 11 12 6 17 11"/>
                            <polyline points="7 18 12 13 17 18"/>
                        </g>
                    </svg>
                    {{ allCollapsed ? 'Klap alle pagina\'s uit' : 'Klap alle pagina\'s in' }}
                </button>
            </div>

            <!-- Page Groups (Collapsible) -->
            <div
                v-for="group in groupedAnnotations"
                :key="group.route"
                class="annotations-group"
            >
                <!-- Group Header / Toggle Bar -->
                <div
                    class="annotations-group__header"
                    @click="toggleCollapse(group.route)"
                    role="button"
                    :aria-expanded="!isCollapsed(group.route)"
                    tabindex="0"
                    @keydown.enter="toggleCollapse(group.route)"
                    @keydown.space.prevent="toggleCollapse(group.route)"
                >
                    <div class="annotations-group__title-wrapper">
                        <span
                            class="annotations-group__chevron"
                            :class="{ 'annotations-group__chevron--collapsed': isCollapsed(group.route) }"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                                <polyline points="6 9 12 15 18 9"/>
                            </svg>
                        </span>
                        <span class="annotations-group__title-text">
                            {{ group.route }}
                        </span>
                        <span class="annotations-group__badge">
                            {{ group.items.length }}
                        </span>
                    </div>

                    <a
                        :href="group.route"
                        class="annotations-group__page-link"
                        title="Open deze cursuspagina"
                        @click.stop
                    >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                        </svg>
                        Naar pagina
                    </a>
                </div>

                <!-- Group Content: Highlight cards for this page -->
                <Transition name="ann-collapse">
                    <div v-show="!isCollapsed(group.route)" class="annotations-group__content">
                        <div
                            v-for="ann in group.items"
                            :key="ann.id"
                            class="annotation-card"
                        >
                            <blockquote
                                class="annotation-card__quote"
                                :style="{ borderLeftColor: ANNOTATION_COLORS[ann.color || 'yellow'] }"
                            >
                                "{{ ann.selector.exact }}"
                            </blockquote>

                            <!-- Edit / view comment -->
                            <div v-if="editingId !== ann.id">
                                <p v-if="ann.comment" class="annotation-card__comment">{{ ann.comment }}</p>
                                <p v-else class="annotation-card__no-comment">Geen notitie toegevoegd</p>
                            </div>
                            <div v-else class="annotation-card__edit">
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
                                    @click="changeColor(ann.id, name)"
                                ></button>
                            </div>

                            <div class="annotation-card__meta">
                                <time>{{ formatDate(ann.createdAt) }}</time>
                                <div class="annotation-card__actions">
                                    <a :href="`${group.route}#annotation-${ann.id}`" class="annotation-item__btn annotation-item__btn--jump" title="Naar sectie">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M15 3h6v6"/>
                                            <path d="M10 14L21 3"/>
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                                        </svg>
                                        Naar sectie
                                    </a>
                                    <button class="annotation-item__btn" title="Bewerken" @click="startEdit(ann)">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                        </svg>
                                        Bewerken
                                    </button>
                                    <button class="annotation-item__btn annotation-item__btn--delete" title="Verwijderen" @click="promptDeleteSingle(ann)">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="3 6 5 6 21 6"/>
                                            <path d="M19 6l-1 14H6L5 6"/>
                                            <path d="M10 11v6M14 11v6"/>
                                            <path d="M9 6V4h6v2"/>
                                        </svg>
                                        Verwijderen
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>

        <!-- ─── Modal 1: Custom Single Highlight Delete Confirmation ─── -->
        <Teleport to="body">
            <Transition name="ann-modal-fade">
                <div
                    v-if="singleDeleteTarget"
                    class="ann-modal-overlay"
                    @click.self="cancelSingleDelete"
                >
                    <div class="ann-modal ann-modal--confirm">
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
                            <button class="ann-modal__close" @click="cancelSingleDelete" aria-label="Sluiten">
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
                            :style="{ borderLeftColor: ANNOTATION_COLORS[singleDeleteTarget.color || 'yellow'] }"
                        >
                            "{{ singleDeleteTarget.selector?.exact }}"
                        </blockquote>

                        <p v-if="singleDeleteTarget.comment" class="ann-modal__note-preview">
                            <strong>Notitie:</strong> {{ singleDeleteTarget.comment }}
                        </p>

                        <div class="ann-modal__footer">
                            <button class="ann-modal__btn ann-modal__btn--cancel" @click="cancelSingleDelete">
                                Annuleren
                            </button>
                            <button class="ann-modal__btn ann-modal__btn--delete-confirm" @click="executeSingleDelete">
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

        <!-- ─── Modal 2: Double Custom Confirmation for Clear All ─── -->
        <Teleport to="body">
            <Transition name="ann-modal-fade">
                <div
                    v-if="clearAllStep > 0"
                    class="ann-modal-overlay"
                    @click.self="cancelClearAll"
                >
                    <div class="ann-modal ann-modal--confirm">
                        <!-- Step 1: First Warning -->
                        <template v-if="clearAllStep === 1">
                            <div class="ann-modal__header">
                                <div class="ann-modal__header-left">
                                    <span class="ann-modal__step-badge">Stap 1 van 2</span>
                                    <h3 class="ann-modal__title ann-modal__title--warning">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                                            <line x1="12" y1="9" x2="12" y2="13"/>
                                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                                        </svg>
                                        Alle markeringen wissen?
                                    </h3>
                                </div>
                                <button class="ann-modal__close" @click="cancelClearAll" aria-label="Sluiten">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                    </svg>
                                </button>
                            </div>

                            <p class="ann-modal__description">
                                Je staat op het punt om <strong>{{ annotations.length }} markering{{ annotations.length === 1 ? '' : 'en' }}</strong> over alle cursuspagina's heen te verwijderen.
                            </p>

                            <div class="ann-modal__warning-box">
                                Al je persoonlijke notities en gekleurde markeringen worden uit deze browser verwijderd.
                            </div>

                            <div class="ann-modal__footer">
                                <button class="ann-modal__btn ann-modal__btn--cancel" @click="cancelClearAll">
                                    Annuleren
                                </button>
                                <button class="ann-modal__btn ann-modal__btn--warning-continue" @click="clearAllStep = 2">
                                    Doorgaan naar bevestiging →
                                </button>
                            </div>
                        </template>

                        <!-- Step 2: Final Warning -->
                        <template v-else-if="clearAllStep === 2">
                            <div class="ann-modal__header">
                                <div class="ann-modal__header-left">
                                    <span class="ann-modal__step-badge ann-modal__step-badge--danger">Stap 2 van 2 — Definitieve waarschuwing</span>
                                    <h3 class="ann-modal__title ann-modal__title--danger">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                            <polyline points="3 6 5 6 21 6"/>
                                            <path d="M19 6l-1 14H6L5 6"/>
                                            <path d="M10 11v6M14 11v6"/>
                                            <path d="M9 6V4h6v2"/>
                                        </svg>
                                        Alles definitief verwijderen?
                                    </h3>
                                </div>
                                <button class="ann-modal__close" @click="cancelClearAll" aria-label="Sluiten">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                    </svg>
                                </button>
                            </div>

                            <div class="ann-modal__danger-banner">
                                <strong>⚠️ Onomkeerbare actie!</strong>
                                <p>Deze bewerking kan niet ongedaan worden gemaakt. Na verwijdering zijn alle {{ annotations.length }} markeringen en notities definitief verdwenen.</p>
                            </div>

                            <div class="ann-modal__footer">
                                <button class="ann-modal__btn ann-modal__btn--cancel" @click="cancelClearAll">
                                    Behoud mijn markeringen
                                </button>
                                <button class="ann-modal__btn ann-modal__btn--delete-confirm" @click="executeClearAll">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="3 6 5 6 21 6"/>
                                        <path d="M19 6l-1 14H6L5 6"/>
                                    </svg>
                                    Ja, alles definitief verwijderen
                                </button>
                            </div>
                        </template>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <!-- ─── Modal 3: Import JSON (Merge vs Replace) ─── -->
        <Teleport to="body">
            <Transition name="ann-modal-fade">
                <div
                    v-if="pendingImport"
                    class="ann-modal-overlay"
                    @click.self="cancelImport"
                >
                    <div class="ann-modal ann-modal--import" @click.stop>
                        <div class="ann-modal__header">
                            <h3 class="ann-modal__title">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="17 8 12 3 7 8"/>
                                    <line x1="12" y1="3" x2="12" y2="15"/>
                                </svg>
                                Markeringen importeren
                            </h3>
                            <button class="ann-modal__close" @click="cancelImport" aria-label="Sluiten">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                </svg>
                            </button>
                        </div>

                        <p class="ann-modal__description">
                            Het bestand bevat <strong>{{ pendingImport.incoming.length }}</strong> markering{{ pendingImport.incoming.length === 1 ? '' : 'en' }}.
                            Je hebt momenteel <strong>{{ annotations.length }}</strong> markering{{ annotations.length === 1 ? '' : 'en' }} opgeslagen.
                        </p>

                        <div class="ann-import-options">
                            <button
                                class="ann-import-option-card"
                                @click="executeImport('merge')"
                            >
                                <div class="ann-import-option-card__icon ann-import-option-card__icon--merge">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="18" cy="18" r="3"/>
                                        <circle cx="6" cy="6" r="3"/>
                                        <path d="M6 9v12M18 9a9 9 0 0 0-9 9"/>
                                    </svg>
                                </div>
                                <div class="ann-import-option-card__text">
                                    <strong>Samenvoegen met huidige markeringen</strong>
                                    <span>Behoud je bestaande markeringen en voeg de markeringen uit het bestand toe.</span>
                                </div>
                            </button>

                            <button
                                class="ann-import-option-card ann-import-option-card--replace"
                                @click="executeImport('replace')"
                            >
                                <div class="ann-import-option-card__icon ann-import-option-card__icon--replace">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <polyline points="1 4 1 10 7 10"/>
                                        <polyline points="23 20 23 14 17 14"/>
                                        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
                                    </svg>
                                </div>
                                <div class="ann-import-option-card__text">
                                    <strong>Alle markeringen vervangen</strong>
                                    <span>Verwijder je huidige markeringen en vervang ze volledig door het geïmporteerde bestand.</span>
                                </div>
                            </button>
                        </div>

                        <div class="ann-modal__footer">
                            <button class="ann-modal__btn ann-modal__btn--cancel" @click="cancelImport">
                                Annuleren
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAnnotations, ANNOTATION_COLORS, ANNOTATION_COLOR_NAMES } from '../composables/useAnnotations.js'

const {
    annotations,
    updateAnnotation,
    updateAnnotationColor,
    deleteAnnotation,
    exportAnnotations,
    parseImportFile,
    applyImportedAnnotations,
    importAnnotations,
} = useAnnotations()

// ─── Grouping ──────────────────────────────────────────────────────────────

const groupedAnnotations = computed(() => {
    const map = {}
    annotations.value.forEach(ann => {
        if (!map[ann.route]) map[ann.route] = { route: ann.route, items: [] }
        map[ann.route].items.push(ann)
    })
    return Object.values(map)
        .sort((a, b) => a.route.localeCompare(b.route))
        .map(g => ({ ...g, items: g.items.sort((a, b) => a.createdAt.localeCompare(b.createdAt)) }))
})

// ─── Collapsible Sections per Page ─────────────────────────────────────────

const collapsedRoutes = ref(new Set())

function toggleCollapse(route) {
    const next = new Set(collapsedRoutes.value)
    if (next.has(route)) {
        next.delete(route)
    } else {
        next.add(route)
    }
    collapsedRoutes.value = next
}

function isCollapsed(route) {
    return collapsedRoutes.value.has(route)
}

const allCollapsed = computed(() => {
    if (groupedAnnotations.value.length === 0) return false
    return groupedAnnotations.value.every(g => collapsedRoutes.value.has(g.route))
})

function toggleAllCollapse() {
    if (allCollapsed.value) {
        collapsedRoutes.value = new Set()
    } else {
        collapsedRoutes.value = new Set(groupedAnnotations.value.map(g => g.route))
    }
}

// ─── Edit ──────────────────────────────────────────────────────────────────

const editingId = ref(null)
const editComment = ref('')

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

function changeColor(id, colorName) {
    updateAnnotationColor(id, colorName)
}

// ─── Single Item Delete Confirmation Modal ─────────────────────────────────

const singleDeleteTarget = ref(null)

function promptDeleteSingle(ann) {
    singleDeleteTarget.value = ann
}

function cancelSingleDelete() {
    singleDeleteTarget.value = null
}

function executeSingleDelete() {
    if (singleDeleteTarget.value) {
        deleteAnnotation(singleDeleteTarget.value.id)
        singleDeleteTarget.value = null
    }
}

// ─── Double Confirmation for Clear All ─────────────────────────────────────

const clearAllStep = ref(0) // 0 = closed, 1 = first warning, 2 = final warning

function promptClearAll() {
    clearAllStep.value = 1
}

function cancelClearAll() {
    clearAllStep.value = 0
}

function executeClearAll() {
    const allIds = annotations.value.map(a => a.id)
    allIds.forEach(id => deleteAnnotation(id))
    clearAllStep.value = 0
}

// ─── Escape Key Handler for Modals ─────────────────────────────────────────

function handleKeydown(e) {
    if (e.key === 'Escape') {
        if (pendingImport.value) cancelImport()
        if (singleDeleteTarget.value) cancelSingleDelete()
        if (clearAllStep.value > 0) cancelClearAll()
    }
}

onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
})

// ─── Export / Import ───────────────────────────────────────────────────────

function doExport() {
    exportAnnotations()
}

const importMsg = ref('')
const importError = ref(false)
const pendingImport = ref(null)

async function doImport(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
        const { incoming } = await parseImportFile(file)
        if (incoming.length === 0) {
            importMsg.value = 'Het geselecteerde bestand bevat geen markeringen.'
            importError.value = true
            setTimeout(() => { importMsg.value = '' }, 4000)
            e.target.value = ''
            return
        }

        if (annotations.value.length === 0) {
            // Niets om mee samen te voegen, direct importeren
            const res = applyImportedAnnotations(incoming, 'replace')
            importMsg.value = `${res.count} markering${res.count === 1 ? '' : 'en'} geïmporteerd.`
            importError.value = false
            setTimeout(() => { importMsg.value = '' }, 4000)
        } else {
            // Open modal om Samenvoegen vs Vervangen te kiezen
            pendingImport.value = {
                file,
                incoming,
            }
        }
    } catch {
        importMsg.value = 'Ongeldig bestand. Controleer of het een geldig JSON-exportbestand is.'
        importError.value = true
        setTimeout(() => { importMsg.value = '' }, 4000)
    }
    e.target.value = ''
}

function cancelImport() {
    pendingImport.value = null
}

function executeImport(mode) {
    if (!pendingImport.value) return
    const res = applyImportedAnnotations(pendingImport.value.incoming, mode)
    if (mode === 'replace') {
        importMsg.value = `Alle markeringen vervangen door ${res.count} geïmporteerde markering${res.count === 1 ? '' : 'en'}.`
    } else {
        const parts = []
        if (res.added > 0) parts.push(`${res.added} nieuw(e)`)
        if (res.updated > 0) parts.push(`${res.updated} bijgewerkt(e)`)
        importMsg.value = `Succesvol samengevoegd: ${parts.join(' en ')} markering${res.count === 1 ? '' : 'en'}.`
    }
    importError.value = false
    setTimeout(() => { importMsg.value = '' }, 4000)
    pendingImport.value = null
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatDate(iso) {
    return new Date(iso).toLocaleDateString('nl-BE', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
}
</script>
