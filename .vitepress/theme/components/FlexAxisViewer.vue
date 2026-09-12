<template>
  <div class="flex-axis-viewer">
    <div class="fav-header">
      <div class="fav-header-title">
        <svg class="fav-title-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M7 12h10" />
          <path d="m13 8 4 4-4 4" />
        </svg>
        <span class="fav-label">Flexbox Assen &amp; Richting Visualizer</span>
      </div>
      <span class="fav-badge">Interactief mentaal model</span>
    </div>

    <div class="fav-body">
      <!-- 1. KEUZEKNOPPEN FLEX-DIRECTION -->
      <div class="fav-controls">
        <label class="fav-control-label">Kies de richting van de flex-container (<code>flex-direction</code>):</label>
        <div class="fav-direction-btns">
          <button
            v-for="dir in directions"
            :key="dir.id"
            type="button"
            class="fav-dir-btn"
            :class="{ 'is-active': activeDir === dir.id }"
            @click="activeDir = dir.id"
          >
            <code>flex-direction: {{ dir.id }}</code>
            <span class="fav-btn-sub">{{ dir.label }}</span>
          </button>
        </div>
      </div>

      <!-- 2. UITLEGKAART OVER DE ACTIEVE ASSEN -->
      <div class="fav-explanation-card" :class="'theme-' + activeDir">
        <div class="fav-explanation-header">
          <span class="fav-pill">{{ currentDirInfo.badge }}</span>
          <h4 class="fav-explanation-title">{{ currentDirInfo.title }}</h4>
        </div>
        <div class="fav-axis-summary-grid">
          <div class="fav-axis-box fav-axis-main">
            <div class="fav-axis-tag main-tag">
              <span class="fav-tag-dot"></span>
              HOOFDAS (Main Axis)
            </div>
            <div class="fav-axis-desc">
              <strong>Richting:</strong> {{ currentDirInfo.mainDirection }}
            </div>
            <div class="fav-axis-property">
              Wordt bestuurd door: <code>justify-content</code>
            </div>
          </div>

          <div class="fav-axis-box fav-axis-cross">
            <div class="fav-axis-tag cross-tag">
              <span class="fav-tag-dot"></span>
              DWARSAS (Cross Axis)
            </div>
            <div class="fav-axis-desc">
              <strong>Richting:</strong> {{ currentDirInfo.crossDirection }}
            </div>
            <div class="fav-axis-property">
              Wordt bestuurd door: <code>align-items</code> &amp; <code>align-self</code>
            </div>
          </div>
        </div>

        <div class="fav-crucial-takeaway">
          <strong>Belangrijk inzicht:</strong> {{ currentDirInfo.takeaway }}
        </div>
      </div>

      <!-- 3. HET VISUELE PREVIEWVELD MET VECTOR-ASSEN -->
      <div class="fav-stage-wrap">
        <div class="fav-stage-caption">
          <span class="fav-container-tag">.flex-container (display: flex; flex-direction: {{ activeDir }};)</span>
        </div>

        <div class="fav-stage" :style="stageStyle">
          <!-- Visuele Hoofdas Vector -->
          <div class="fav-vector-axis fav-vector-main" :class="activeDir">
            <div class="fav-vector-line">
              <div class="fav-vector-arrow"></div>
            </div>
            <span class="fav-vector-label">
              HOOFDAS &bull; <code>justify-content</code>
            </span>
          </div>

          <!-- Visuele Dwarsas Vector -->
          <div class="fav-vector-axis fav-vector-cross" :class="activeDir">
            <div class="fav-vector-line">
              <div class="fav-vector-arrow"></div>
            </div>
            <span class="fav-vector-label">
              DWARSAS &bull; <code>align-items</code>
            </span>
          </div>

          <!-- De Flex Items -->
          <div class="fav-items-group" :style="itemsGroupStyle">
            <div v-for="n in 3" :key="n" class="fav-item">
              <span class="fav-item-badge">Item {{ n }}</span>
              <span class="fav-item-sub">kind-element</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. LIVE CODE SNIPPET -->
      <div class="fav-code-card">
        <div class="fav-code-header">
          <span>Gegenereerde CSS voor de container</span>
        </div>
        <pre class="fav-code-pre"><code>.container {
  display: flex;
  flex-direction: {{ activeDir }};
  /* Gebruik justify-content voor de {{ isColumn ? 'verticale' : 'horizontale' }} verdeling (hoofdas) */
  /* Gebruik align-items voor de {{ isColumn ? 'horizontale' : 'verticale' }} uitlijning (dwarsas) */
}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

type Direction = 'row' | 'row-reverse' | 'column' | 'column-reverse'

const activeDir = ref<Direction>('row')

const directions = [
  { id: 'row', label: 'Horizontaal (standaard: links naar rechts)' },
  { id: 'row-reverse', label: 'Horizontaal omgedraaid (rechts naar links)' },
  { id: 'column', label: 'Verticaal (boven naar beneden)' },
  { id: 'column-reverse', label: 'Verticaal omgedraaid (beneden naar boven)' },
]

const isColumn = computed(() => activeDir.value.includes('column'))

const currentDirInfo = computed(() => {
  switch (activeDir.value) {
    case 'row':
      return {
        badge: 'Standaard richting',
        title: 'Horizontale rij van links naar rechts',
        mainDirection: 'Horizontaal (van links naar rechts →)',
        crossDirection: 'Verticaal (van boven naar beneden ↓)',
        takeaway: 'Omdat de hoofdas horizontaal loopt, stuurt justify-content de horizontale verdeling en align-items de verticale hoogte-uitlijning.',
      }
    case 'row-reverse':
      return {
        badge: 'Omgekeerde rij',
        title: 'Horizontale rij van rechts naar links',
        mainDirection: 'Horizontaal (van rechts naar links ←)',
        crossDirection: 'Verticaal (van boven naar beneden ↓)',
        takeaway: 'Item 1 begint nu uiterst rechts! justify-content: flex-start lijnt de items dus rechts uit.',
      }
    case 'column':
      return {
        badge: 'Gekantelde assen',
        title: 'Verticale kolom van boven naar beneden',
        mainDirection: 'Verticaal (van boven naar beneden ↓)',
        crossDirection: 'Horizontaal (van links naar rechts →)',
        takeaway: 'DE ROLLEN ZIJN OMGEWISSELD! justify-content stuurt nu de verticale hoogteverdeling, terwijl align-items de items horizontaal centreert of uitlijnt.',
      }
    case 'column-reverse':
      return {
        badge: 'Gekanteld & Omgekeerd',
        title: 'Verticale kolom van beneden naar boven',
        mainDirection: 'Verticaal (van beneden naar boven ↑)',
        crossDirection: 'Horizontaal (van links naar rechts →)',
        takeaway: 'Item 1 start onderaan de container. Ook hier is justify-content de verticale as en align-items de horizontale as.',
      }
  }
})

const stageStyle = computed(() => ({
  minHeight: isColumn.value ? '280px' : '220px',
}))

const itemsGroupStyle = computed(() => ({
  flexDirection: activeDir.value,
}))
</script>

<style scoped>
.flex-axis-viewer {
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  margin: 1.75rem 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.fav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1a2846;
  color: #ffffff;
  padding: 0.85rem 1.25rem;
}

.fav-header-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.fav-title-icon {
  color: #e87722;
}

.fav-label {
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.02em;
}

.fav-badge {
  background-color: rgba(232, 119, 34, 0.25);
  border: 1px solid rgba(232, 119, 34, 0.6);
  color: #ff9d54;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  text-transform: uppercase;
}

.fav-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* 1. Knoppen */
.fav-controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.fav-control-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.fav-direction-btns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.6rem;
}

.fav-dir-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.65rem 0.85rem;
  border: 1.5px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}

.fav-dir-btn code {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  background: transparent;
  padding: 0;
}

.fav-btn-sub {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  margin-top: 0.2rem;
}

.fav-dir-btn:hover {
  border-color: #e87722;
  background-color: rgba(232, 119, 34, 0.05);
}

.fav-dir-btn.is-active {
  border-color: #e87722;
  background-color: rgba(232, 119, 34, 0.12);
  box-shadow: 0 0 0 2px rgba(232, 119, 34, 0.2);
}

.fav-dir-btn.is-active code {
  color: #e87722;
}

/* 2. Uitlegkaart */
.fav-explanation-card {
  background-color: var(--vp-c-bg-soft);
  border-left: 4px solid #e87722;
  border-radius: 6px;
  padding: 1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.fav-explanation-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.fav-pill {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  background-color: #e87722;
  color: #ffffff;
  text-transform: uppercase;
}

.fav-explanation-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.fav-axis-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.85rem;
}

.fav-axis-box {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-elv);
}

.fav-axis-main {
  border-left: 3px solid #dc2626;
}

.fav-axis-cross {
  border-left: 3px solid #2563eb;
}

.fav-axis-tag {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  margin-bottom: 0.35rem;
}

.main-tag {
  color: #dc2626;
}

.cross-tag {
  color: #2563eb;
}

.fav-tag-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: currentColor;
}

.fav-axis-desc {
  font-size: 0.85rem;
  color: var(--vp-c-text-1);
  margin-bottom: 0.35rem;
}

.fav-axis-property {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.fav-axis-property code {
  font-size: 0.8rem;
  color: var(--vp-c-text-1);
  background-color: var(--vp-c-bg-soft);
  padding: 0.1rem 0.3rem;
  border-radius: 4px;
}

.fav-crucial-takeaway {
  background-color: rgba(232, 119, 34, 0.08);
  border: 1px dashed #e87722;
  border-radius: 6px;
  padding: 0.65rem 0.85rem;
  font-size: 0.85rem;
  line-height: 1.45;
  color: var(--vp-c-text-1);
}

/* 3. Stage Wrap */
.fav-stage-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.fav-stage-caption {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fav-container-tag {
  font-size: 0.78rem;
  font-family: monospace;
  color: var(--vp-c-text-2);
  background-color: var(--vp-c-bg-soft);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.fav-stage {
  position: relative;
  border: 2px dashed #005691;
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: min-height 0.3s ease;
}

/* Dynamische vector-assen */
.fav-vector-axis {
  position: absolute;
  pointer-events: none;
  display: flex;
  align-items: center;
  z-index: 1;
  transition: all 0.3s ease;
}

/* Hoofdas Posities */
.fav-vector-main {
  color: #dc2626;
}

.fav-vector-main.row {
  top: 10px;
  left: 14px;
  right: 14px;
  flex-direction: row;
}

.fav-vector-main.row .fav-vector-line {
  height: 2px;
  background-color: #dc2626;
  flex: 1;
  position: relative;
}

.fav-vector-main.row .fav-vector-arrow {
  position: absolute;
  right: 0;
  top: -4px;
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 8px solid #dc2626;
}

.fav-vector-main.row-reverse {
  top: 10px;
  left: 14px;
  right: 14px;
  flex-direction: row-reverse;
}

.fav-vector-main.row-reverse .fav-vector-line {
  height: 2px;
  background-color: #dc2626;
  flex: 1;
  position: relative;
}

.fav-vector-main.row-reverse .fav-vector-arrow {
  position: absolute;
  left: 0;
  top: -4px;
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-right: 8px solid #dc2626;
}

.fav-vector-main.column {
  top: 12px;
  bottom: 12px;
  left: 12px;
  flex-direction: column;
}

.fav-vector-main.column .fav-vector-line {
  width: 2px;
  background-color: #dc2626;
  flex: 1;
  position: relative;
}

.fav-vector-main.column .fav-vector-arrow {
  position: absolute;
  bottom: 0;
  left: -4px;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 8px solid #dc2626;
}

.fav-vector-main.column-reverse {
  top: 12px;
  bottom: 12px;
  left: 12px;
  flex-direction: column-reverse;
}

.fav-vector-main.column-reverse .fav-vector-line {
  width: 2px;
  background-color: #dc2626;
  flex: 1;
  position: relative;
}

.fav-vector-main.column-reverse .fav-vector-arrow {
  position: absolute;
  top: 0;
  left: -4px;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 8px solid #dc2626;
}

/* Dwarsas Posities */
.fav-vector-cross {
  color: #2563eb;
}

.fav-vector-cross.row,
.fav-vector-cross.row-reverse {
  top: 12px;
  bottom: 12px;
  right: 12px;
  flex-direction: column;
}

.fav-vector-cross.row .fav-vector-line,
.fav-vector-cross.row-reverse .fav-vector-line {
  width: 2px;
  background-color: #2563eb;
  flex: 1;
  position: relative;
}

.fav-vector-cross.row .fav-vector-arrow,
.fav-vector-cross.row-reverse .fav-vector-arrow {
  position: absolute;
  bottom: 0;
  left: -4px;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 8px solid #2563eb;
}

.fav-vector-cross.column,
.fav-vector-cross.column-reverse {
  bottom: 8px;
  left: 14px;
  right: 14px;
  flex-direction: row;
}

.fav-vector-cross.column .fav-vector-line,
.fav-vector-cross.column-reverse .fav-vector-line {
  height: 2px;
  background-color: #2563eb;
  flex: 1;
  position: relative;
}

.fav-vector-cross.column .fav-vector-arrow,
.fav-vector-cross.column-reverse .fav-vector-arrow {
  position: absolute;
  right: 0;
  top: -4px;
  width: 0;
  height: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 8px solid #2563eb;
}

.fav-vector-label {
  font-size: 0.72rem;
  font-weight: 800;
  background-color: var(--vp-c-bg-elv);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}

.fav-vector-label code {
  font-size: 0.72rem;
  color: inherit;
}

/* Items container */
.fav-items-group {
  display: flex;
  gap: 1rem;
  z-index: 2;
  transition: all 0.3s ease;
}

.fav-item {
  background-color: #ffffff;
  border: 2px solid #e87722;
  border-radius: 8px;
  padding: 0.85rem 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 90px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
  transition: all 0.25s ease;
}

.fav-item-badge {
  font-weight: 800;
  color: #1f2937;
  font-size: 0.95rem;
}

.fav-item-sub {
  font-size: 0.72rem;
  color: #6b7280;
}

/* 4. Code Pre */
.fav-code-card {
  background-color: #1a202c;
  border-radius: 6px;
  overflow: hidden;
}

.fav-code-header {
  background-color: #2d3748;
  color: #cbd5e0;
  padding: 0.45rem 0.85rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.fav-code-pre {
  margin: 0;
  padding: 0.85rem;
  color: #e2e8f0;
  font-family: monospace;
  font-size: 0.85rem;
  line-height: 1.5;
}
</style>
