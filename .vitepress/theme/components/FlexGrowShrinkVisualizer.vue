<template>
  <div class="flex-grow-shrink-visualizer">
    <div class="fgs-header">
      <div class="fav-header-title">
        <svg class="fav-title-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 3 21 3 21 9" />
          <polyline points="9 21 3 21 3 15" />
          <line x1="21" y1="3" x2="14" y2="10" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
        <span class="fav-label">Flex Grow &amp; Shrink Visualizer</span>
      </div>
      <span class="fav-badge">Groei, Krimp &amp; Ruimteverdeling</span>
    </div>

    <div class="fgs-body">
      <!-- 1. CONTAINER BREEDTE SCHUIFREGELAAR -->
      <div class="fgs-slider-box">
        <div class="fgs-slider-header">
          <label for="fgs-container-width" class="fgs-slider-title">
            Breedte van de flex-container: <strong>{{ containerWidth }}px</strong>
          </label>
          <span class="fgs-slider-hint">Sleep om te zien hoe items groeien bij overschot of krimpen bij tekort!</span>
        </div>
        <input
          id="fgs-container-width"
          v-model.number="containerWidth"
          type="range"
          min="320"
          max="680"
          step="10"
          class="fgs-width-slider"
        />
      </div>

      <!-- 2. HET VISUELE SPEELVELD (DE CONTAINER DIE IN BREEDTE VERANDERT) -->
      <div class="fgs-stage-outer">
        <div class="fgs-container" :style="{ width: `${containerWidth}px` }">
          <!-- Item A: flex-grow: 1 -->
          <div class="fgs-item item-a" :style="{ flex: `${growA} 1 100px` }">
            <div class="fgs-item-name">Item A</div>
            <div class="fgs-item-rule"><code>flex: {{ growA }} 1 100px</code></div>
            <div class="fgs-item-metric">basis: 100px</div>
          </div>

          <!-- Item B: flex-grow: 2 (of instelbaar) -->
          <div class="fgs-item item-b" :style="{ flex: `${growB} 1 100px` }">
            <div class="fgs-item-name">Item B</div>
            <div class="fgs-item-rule"><code>flex: {{ growB }} 1 100px</code></div>
            <div class="fgs-item-metric">basis: 100px</div>
          </div>

          <!-- Item C: flex: 0 0 120px (Vaste breedte) -->
          <div class="fgs-item item-c" :style="{ flex: fixedC ? '0 0 120px' : '1 1 100px' }">
            <div class="fgs-item-name">Item C</div>
            <div class="fgs-item-rule">
              <code>{{ fixedC ? 'flex: 0 0 120px' : 'flex: 1 1 100px' }}</code>
            </div>
            <div class="fgs-item-metric">{{ fixedC ? 'Vast (geen groei)' : 'basis: 100px' }}</div>
          </div>
        </div>
      </div>

      <!-- 3. CONFIGURATIE VOOR DE STUDENT OM VERHOUDINGEN AAN TE PASSEN -->
      <div class="fgs-controls-row">
        <div class="fgs-control-item">
          <span class="fgs-item-dot dot-a"></span>
          <label>Groei Item A (<code>flex-grow</code>):</label>
          <select v-model.number="growA" class="fgs-select">
            <option :value="0">0 (groeit niet)</option>
            <option :value="1">1 (1 aandeel)</option>
            <option :value="2">2 (2 aandelen)</option>
          </select>
        </div>

        <div class="fgs-control-item">
          <span class="fgs-item-dot dot-b"></span>
          <label>Groei Item B (<code>flex-grow</code>):</label>
          <select v-model.number="growB" class="fgs-select">
            <option :value="0">0 (groeit niet)</option>
            <option :value="1">1 (1 aandeel)</option>
            <option :value="2">2 (2x sneller!)</option>
            <option :value="3">3 (3x sneller!)</option>
          </select>
        </div>

        <div class="fgs-control-item">
          <span class="fgs-item-dot dot-c"></span>
          <label>Gedrag Item C:</label>
          <button
            type="button"
            class="fgs-toggle-btn"
            :class="{ 'is-fixed': fixedC }"
            @click="fixedC = !fixedC"
          >
            {{ fixedC ? 'Vast: flex: 0 0 120px' : 'Flexibel: flex: 1' }}
          </button>
        </div>
      </div>

      <!-- 4. UITLEG & LIVE BEREKENING -->
      <div class="fgs-info-box">
        <strong>Wat zie je gebeuren?</strong>
        <p>
          Wanneer de container breder wordt dan de basisgroottes samen (320px), ontstaat er <em>overgebleven witruimte</em>. 
          Item B krijgt met <code>flex-grow: {{ growB }}</code> exact 
          {{ growB > growA ? 'dubbel zoveel van die extra ruimte als Item A' : 'evenveel ruimte als Item A' }}.
          {{ fixedC ? 'Item C heeft flex-grow: 0 en blijft dus onveranderd exact 120 pixels breed.' : 'Item C deelt ook mee in de overgebleven ruimte.' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const containerWidth = ref(540)
const growA = ref(1)
const growB = ref(2)
const fixedC = ref(true)
</script>

<style scoped>
.flex-grow-shrink-visualizer {
  background-color: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  margin: 1.75rem 0;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}

.fgs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1a2846;
  color: #ffffff;
  padding: 0.85rem 1.25rem;
}

.fgs-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* Slider Box */
.fgs-slider-box {
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 0.85rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.fgs-slider-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.fgs-slider-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.fgs-slider-hint {
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
}

.fgs-width-slider {
  width: 100%;
  accent-color: #e87722;
  cursor: pointer;
}

/* Stage */
.fgs-stage-outer {
  background-color: #f1f5f9;
  border: 2px dashed #94a3b8;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  justify-content: center;
  overflow-x: auto;
}

.fgs-container {
  display: flex;
  gap: 10px;
  background-color: #ffffff;
  border: 2px solid #005691;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: width 0.15s ease-out;
}

/* Items */
.fgs-item {
  border-radius: 6px;
  padding: 0.85rem 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;
  overflow: hidden;
}

.item-a {
  background-color: #eff6ff;
  border: 2px solid #3b82f6;
}

.item-b {
  background-color: #fff7ed;
  border: 2px solid #e87722;
}

.item-c {
  background-color: #f0fdf4;
  border: 2px solid #16a34a;
}

.fgs-item-name {
  font-weight: 800;
  font-size: 0.95rem;
  color: #1e293b;
}

.fgs-item-rule code {
  font-size: 0.75rem;
  color: inherit;
  background: transparent;
  padding: 0;
  white-space: nowrap;
}

.fgs-item-metric {
  font-size: 0.72rem;
  color: #64748b;
  margin-top: 0.25rem;
  white-space: nowrap;
}

/* Controls row */
.fgs-controls-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.85rem;
}

.fgs-control-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.fgs-item-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-bottom: 2px;
}

.dot-a { background-color: #3b82f6; }
.dot-b { background-color: #e87722; }
.dot-c { background-color: #16a34a; }

.fgs-select {
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-size: 0.82rem;
  cursor: pointer;
}

.fgs-toggle-btn {
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  border: 1.5px solid #16a34a;
  background-color: var(--vp-c-bg-soft);
  color: #16a34a;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.fgs-toggle-btn.is-fixed {
  background-color: #16a34a;
  color: #ffffff;
}

/* Info Box */
.fgs-info-box {
  background-color: var(--vp-c-bg-soft);
  border-left: 3px solid #005691;
  border-radius: 6px;
  padding: 0.85rem 1rem;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}

.fgs-info-box strong {
  color: #005691;
  display: block;
  margin-bottom: 0.25rem;
}

.fgs-info-box p {
  margin: 0;
  color: var(--vp-c-text-2);
}
</style>
