<template>
  <div class="table-workbench">
    <div class="tw-header">
      <div class="tw-header-title">
        <svg class="tw-title-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18" />
          <path d="M3 15h18" />
          <path d="M12 3v18" />
        </svg>
        <span class="tw-label">Tabelranden &amp; Lay-out Simulator</span>
      </div>
      <span class="tw-badge">Interactief experiment</span>
    </div>

    <div class="tw-body">
      <!-- Besturingspaneel -->
      <div class="tw-controls">
        <div class="tw-controls-grid">
          <!-- border-collapse -->
          <div class="tw-control-item">
            <label class="tw-label-title">1. <code>border-collapse</code>:</label>
            <div class="tw-btn-group">
              <button
                type="button"
                class="tw-btn"
                :class="{ 'is-active': borderCollapse === 'collapse' }"
                @click="borderCollapse = 'collapse'"
              >
                collapse
              </button>
              <button
                type="button"
                class="tw-btn"
                :class="{ 'is-active': borderCollapse === 'separate' }"
                @click="borderCollapse = 'separate'"
              >
                separate
              </button>
            </div>
            <span class="tw-hint">
              {{ borderCollapse === 'collapse' ? 'Aangrenzende randen smelten samen.' : 'Elke cel behoudt een eigen rand.' }}
            </span>
          </div>

          <!-- border-spacing (enkel bij separate) -->
          <div class="tw-control-item" :class="{ 'is-disabled': borderCollapse === 'collapse' }">
            <div class="tw-slider-header">
              <label class="tw-label-title">2. <code>border-spacing</code>:</label>
              <span class="tw-val">{{ borderSpacing }}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="2"
              v-model.number="borderSpacing"
              class="tw-range"
              :disabled="borderCollapse === 'collapse'"
            />
            <span class="tw-hint">
              {{ borderCollapse === 'collapse' ? '⚠️ Uitgeschakeld: werkt enkel bij separate' : 'Tussenruimte tussen de losse celkaders.' }}
            </span>
          </div>

          <!-- empty-cells (enkel bij separate) -->
          <div class="tw-control-item" :class="{ 'is-disabled': borderCollapse === 'collapse' }">
            <label class="tw-label-title">3. <code>empty-cells</code>:</label>
            <div class="tw-btn-group">
              <button
                type="button"
                class="tw-btn"
                :class="{ 'is-active': emptyCells === 'show' }"
                :disabled="borderCollapse === 'collapse'"
                @click="emptyCells = 'show'"
              >
                show
              </button>
              <button
                type="button"
                class="tw-btn"
                :class="{ 'is-active': emptyCells === 'hide' }"
                :disabled="borderCollapse === 'collapse'"
                @click="emptyCells = 'hide'"
              >
                hide
              </button>
            </div>
            <span class="tw-hint">
              {{ borderCollapse === 'collapse' ? '⚠️ Uitgeschakeld bij collapse' : (emptyCells === 'hide' ? 'Lege cel toont geen rand en achtergrond.' : 'Lege cel toont gewoon rand.') }}
            </span>
          </div>

          <!-- caption-side -->
          <div class="tw-control-item">
            <label class="tw-label-title">4. <code>caption-side</code>:</label>
            <div class="tw-btn-group">
              <button
                type="button"
                class="tw-btn"
                :class="{ 'is-active': captionSide === 'top' }"
                @click="captionSide = 'top'"
              >
                top
              </button>
              <button
                type="button"
                class="tw-btn"
                :class="{ 'is-active': captionSide === 'bottom' }"
                @click="captionSide = 'bottom'"
              >
                bottom
              </button>
            </div>
            <span class="tw-hint">
              Verplaatst titel visueel naar boven- of onderkant.
            </span>
          </div>

          <!-- table-layout -->
          <div class="tw-control-item">
            <label class="tw-label-title">5. <code>table-layout</code>:</label>
            <div class="tw-btn-group">
              <button
                type="button"
                class="tw-btn"
                :class="{ 'is-active': tableLayout === 'auto' }"
                @click="tableLayout = 'auto'"
              >
                auto
              </button>
              <button
                type="button"
                class="tw-btn"
                :class="{ 'is-active': tableLayout === 'fixed' }"
                @click="tableLayout = 'fixed'"
              >
                fixed
              </button>
            </div>
            <span class="tw-hint">
              {{ tableLayout === 'auto' ? 'Kolombreedtes schalen mee met de celinhoud.' : 'Kolommen verdelen de ruimte strikt gelijkmatig.' }}
            </span>
          </div>

          <!-- Testoptie: lange tekst toevoegen -->
          <div class="tw-control-item tw-action-box">
            <label class="tw-label-title">6. Inhoud simuleren:</label>
            <button
              type="button"
              class="tw-toggle-text-btn"
              :class="{ 'is-on': hasLongText }"
              @click="hasLongText = !hasLongText"
            >
              {{ hasLongText ? 'Verwijder lange tekst' : 'Voeg lange tekst toe aan kolom 2' }}
            </button>
            <span class="tw-hint">
              Schakel tussen auto en fixed om het verschil te zien!
            </span>
          </div>
        </div>
      </div>

      <!-- Live Tabel Voorbeeld -->
      <div class="tw-preview-stage">
        <div class="tw-preview-header">
          <span>Live Tabel Preview:</span>
          <span class="tw-preview-status">
            {{ tableLayout === 'fixed' ? 'Vaste kolombreedte actief' : 'Flexibele kolombreedte actief' }}
          </span>
        </div>

        <div class="tw-table-wrapper">
          <table class="tw-table" :style="tableStyles">
            <caption :style="{ captionSide }">
              Overzicht Examenplanning - Thomas More Campus Geel
            </caption>
            <thead>
              <tr>
                <th scope="col" style="width: 25%;">Vak</th>
                <th scope="col" style="width: 50%;">Omschrijving &amp; Opmerkingen</th>
                <th scope="col" style="width: 25%;">Lokaal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Web Essentials</td>
                <td>
                  <template v-if="hasLongText">
                    Dit is een zeer uitgebreide toelichting over het praktijkexamen HTML5 en CSS3 met CodeSandbox en responsieve tabellen.
                  </template>
                  <template v-else>
                    Theorie en praktijk
                  </template>
                </td>
                <td>Lokaal 1.04</td>
              </tr>
              <tr>
                <td>Database Basics</td>
                <td>SQL queries en datamodellering</td>
                <!-- Lege cel om empty-cells te demonstreren -->
                <td class="tw-empty-cell"></td>
              </tr>
              <tr>
                <td>Programming 1</td>
                <td>C# console applicaties</td>
                <td>Lokaal 2.12</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Gegenereerde CSS -->
      <div class="tw-code-box">
        <div class="tw-code-header">
          <span>Gegenereerde CSS:</span>
          <button type="button" class="tw-copy-btn" @click="copyCss">
            {{ copied ? 'Gekopieerd!' : 'Kopieer CSS' }}
          </button>
        </div>
        <pre><code>{{ generatedCssCode }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const borderCollapse = ref<'collapse' | 'separate'>('collapse')
const borderSpacing = ref<number>(8)
const emptyCells = ref<'show' | 'hide'>('show')
const captionSide = ref<'top' | 'bottom'>('top')
const tableLayout = ref<'auto' | 'fixed'>('auto')
const hasLongText = ref<boolean>(false)
const copied = ref<boolean>(false)

const tableStyles = computed(() => {
  return {
    borderCollapse: borderCollapse.value,
    borderSpacing: borderCollapse.value === 'separate' ? `${borderSpacing.value}px` : undefined,
    emptyCells: emptyCells.value,
    tableLayout: tableLayout.value,
  }
})

const generatedCssCode = computed(() => {
  let css = `table {\n  width: 100%;\n  border-collapse: ${borderCollapse.value};\n`
  if (borderCollapse.value === 'separate') {
    css += `  border-spacing: ${borderSpacing.value}px;\n`
    if (emptyCells.value === 'hide') {
      css += `  empty-cells: hide;\n`
    }
  }
  css += `  table-layout: ${tableLayout.value};\n}\n\n`
  css += `caption {\n  caption-side: ${captionSide.value};\n  text-align: left;\n  font-weight: bold;\n}`
  return css
})

const copyCss = async () => {
  try {
    await navigator.clipboard.writeText(generatedCssCode.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    // Fallback
  }
}
</script>

<style scoped>
.table-workbench {
  margin: 1.75rem 0;
  border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.tw-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.25rem;
  background-color: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
}

.tw-header-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
}

.tw-title-icon {
  color: #1e2d5a;
}
:root.dark .tw-title-icon {
  color: #e87722;
}

.tw-badge {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  background-color: rgba(30, 45, 90, 0.1);
  color: #1e2d5a;
}
:root.dark .tw-badge {
  background-color: rgba(232, 119, 34, 0.15);
  color: #e87722;
}

.tw-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Controls grid */
.tw-controls {
  background-color: var(--vp-c-bg);
  padding: 1rem 1.25rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.tw-controls-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem 1.25rem;
}

@media (max-width: 820px) {
  .tw-controls-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 580px) {
  .tw-controls-grid {
    grid-template-columns: 1fr;
  }
}

.tw-control-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.tw-control-item.is-disabled {
  opacity: 0.45;
}

.tw-label-title {
  font-size: 0.84rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.tw-btn-group {
  display: flex;
  gap: 0.35rem;
}

.tw-btn {
  flex: 1;
  padding: 0.35rem 0.6rem;
  border-radius: 5px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.tw-btn:hover:not(:disabled) {
  border-color: #1e2d5a;
  color: #1e2d5a;
}
:root.dark .tw-btn:hover:not(:disabled) {
  border-color: #e87722;
  color: #e87722;
}

.tw-btn.is-active {
  background-color: #1e2d5a;
  border-color: #1e2d5a;
  color: #ffffff;
  font-weight: 600;
}
:root.dark .tw-btn.is-active {
  background-color: #e87722;
  border-color: #e87722;
}

.tw-slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tw-val {
  font-family: monospace;
  font-weight: 700;
  font-size: 0.8rem;
  color: var(--vp-c-text-1);
}

.tw-range {
  accent-color: #1e2d5a;
  cursor: pointer;
}
:root.dark .tw-range {
  accent-color: #e87722;
}

.tw-hint {
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  line-height: 1.35;
}

/* Action box */
.tw-action-box {
  background-color: var(--vp-c-bg-soft);
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px dashed var(--vp-c-divider);
}

.tw-toggle-text-btn {
  padding: 0.4rem 0.6rem;
  border-radius: 5px;
  border: 1px solid #1e2d5a;
  background-color: #ffffff;
  color: #1e2d5a;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
:root.dark .tw-toggle-text-btn {
  border-color: #e87722;
  background-color: var(--vp-c-bg);
  color: #e87722;
}

.tw-toggle-text-btn.is-on {
  background-color: #1e2d5a;
  color: #ffffff;
}
:root.dark .tw-toggle-text-btn.is-on {
  background-color: #e87722;
  color: #ffffff;
}

/* Preview stage */
.tw-preview-stage {
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1.25rem;
}

.tw-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.85rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 700;
  color: var(--vp-c-text-3);
}

.tw-preview-status {
  color: #e87722;
}

.tw-table-wrapper {
  overflow-x: auto;
  background-color: #ffffff;
  border: 1px dashed #cbd5e1;
  border-radius: 6px;
  padding: 1rem;
}
:root.dark .tw-table-wrapper {
  background-color: #0f172a;
  border-color: #334155;
}

.tw-table {
  width: 100%;
  font-size: 0.88rem;
  transition: border-spacing 0.2s ease;
}

.tw-table caption {
  font-weight: 700;
  color: #1e2d5a;
  padding: 0.5rem 0;
  font-size: 0.95rem;
  text-align: left;
}
:root.dark .tw-table caption {
  color: #e87722;
}

.tw-table th,
.tw-table td {
  border: 1px solid #dee2e6;
  padding: 0.6rem 0.85rem;
  text-align: left;
  transition: all 0.2s ease;
}
:root.dark .tw-table th,
:root.dark .tw-table td {
  border-color: #334155;
}

.tw-table th {
  background-color: #1e2d5a;
  color: #ffffff;
  font-weight: 600;
}
:root.dark .tw-table th {
  background-color: #1e293b;
  color: #f8fafc;
}

.tw-table td {
  background-color: #f8fafc;
  color: #1e293b;
}
:root.dark .tw-table td {
  background-color: #1e293b;
  color: #cbd5e1;
}

.tw-empty-cell {
  background-color: #fff1f2 !important;
}
:root.dark .tw-empty-cell {
  background-color: #4c1d24 !important;
}

/* Code box */
.tw-code-box {
  border-radius: 8px;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
}

.tw-code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.45rem 0.85rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  border-bottom: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
}

.tw-copy-btn {
  font-size: 0.75rem;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
}

.tw-copy-btn:hover {
  border-color: #1e2d5a;
  color: #1e2d5a;
}
:root.dark .tw-copy-btn:hover {
  border-color: #e87722;
  color: #e87722;
}

.tw-code-box pre {
  margin: 0;
  padding: 0.75rem 1rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}
</style>
