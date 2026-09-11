<template>
  <div class="valign-lab">
    <div class="vl-header">
      <div class="vl-header-title">
        <svg class="vl-title-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="21" y1="6" x2="3" y2="6" />
          <line x1="21" y1="12" x2="9" y2="12" />
          <line x1="21" y1="18" x2="7" y2="18" />
        </svg>
        <span class="vl-label">Vertical-align Lab: Kaarten uitlijnen</span>
      </div>
      <span class="vl-badge">Lay-out simulator</span>
    </div>

    <div class="vl-body">
      <!-- Besturing bovenaan -->
      <div class="vl-controls">
        <div class="vl-control-item">
          <label class="vl-label">1. Kies de waarde voor <code>vertical-align</code>:</label>
          <div class="vl-btn-group">
            <button
              v-for="opt in alignmentOptions"
              :key="opt.val"
              type="button"
              class="vl-btn"
              :class="{ 'is-active': selectedAlign === opt.val }"
              @click="selectedAlign = opt.val"
            >
              <code>vertical-align: {{ opt.val }};</code>
            </button>
          </div>
        </div>

        <div class="vl-control-item vl-toggle-col">
          <label class="vl-label">2. Simuleer ongelijke tekstinhoud:</label>
          <button
            type="button"
            class="vl-toggle-btn"
            :class="{ 'is-active': hasExtraText }"
            @click="hasExtraText = !hasExtraText"
          >
            {{ hasExtraText ? 'Verwijder extra tekst uit Kaart 2' : 'Voeg extra tekst toe aan Kaart 2' }}
          </button>
        </div>
      </div>

      <!-- Didactische toelichting banner -->
      <div class="vl-feedback-card" :class="currentAlignInfo.theme">
        <div class="vl-feedback-header">
          <span class="vl-pill">{{ currentAlignInfo.tag }}</span>
          <h4 class="vl-feedback-title">{{ currentAlignInfo.title }}</h4>
        </div>
        <p class="vl-feedback-desc">{{ currentAlignInfo.description }}</p>
        <div class="vl-feedback-tip">
          <strong>Waarom gebeurt dit?</strong> {{ currentAlignInfo.reason }}
        </div>
      </div>

      <!-- Live weergave van de 3 kaarten -->
      <div class="vl-canvas-card">
        <div class="vl-canvas-header">
          <span>Live weergave: 3 kaarten met <code>display: inline-block;</code></span>
          <span class="vl-active-tag">vertical-align: {{ selectedAlign }};</span>
        </div>

        <div class="vl-canvas-stage">
          <!-- Hulplijnen -->
          <div class="vl-guideline vl-guideline-top" v-if="selectedAlign === 'top'" title="Uitlijnhulplijn bovenaan">
            <span class="vl-line-badge">Bovenlijn (top)</span>
          </div>
          <div class="vl-guideline vl-guideline-middle" v-if="selectedAlign === 'middle'" title="Centrale as">
            <span class="vl-line-badge">Middenlijn (middle)</span>
          </div>
          <div class="vl-guideline vl-guideline-baseline" v-if="selectedAlign === 'baseline'" title="Tekst basislijn">
            <span class="vl-line-badge">Standaard tekstbasislijn (baseline)</span>
          </div>

          <!-- Kaart 1 -->
          <div class="vl-card" :style="{ verticalAlign: selectedAlign }">
            <div class="vl-card-header">
              <span class="vl-card-badge">Fase 1</span>
              <h5>Graduaat Programmeren</h5>
            </div>
            <p class="vl-card-text">
              Korte introductie: fundamenten van C#, HTML5, CSS3 en moderne databases op Campus Geel.
            </p>
            <div class="vl-card-footer">
              <span class="vl-link-btn">Meer info</span>
            </div>
          </div>

          <!-- Kaart 2 (Met wisselende tekstlengte) -->
          <div class="vl-card vl-card-accent" :style="{ verticalAlign: selectedAlign }">
            <div class="vl-card-header">
              <span class="vl-card-badge vl-badge-orange">Fase 2 &amp; 3</span>
              <h5>Toegepaste Informatica</h5>
            </div>
            <p class="vl-card-text">
              Volledige bacheloropleiding gericht op software engineering en cloud architecture.
              <template v-if="hasExtraText">
                <span class="vl-extra-highlight">
                  Hier staat nu een extra lange toelichting over IoT, containerization, microservices en de afstudeerstage in het werkveld.
                </span>
              </template>
            </p>
            <div class="vl-card-footer">
              <span class="vl-link-btn vl-btn-orange">Meer info</span>
            </div>
          </div>

          <!-- Kaart 3 -->
          <div class="vl-card" :style="{ verticalAlign: selectedAlign }">
            <div class="vl-card-header">
              <span class="vl-card-badge">Fase 1</span>
              <h5>Systeem- &amp; Netwerkbeheer</h5>
            </div>
            <p class="vl-card-text">
              Focus op Linux servers, Cisco routing, cybersecurity en cloud infrastructure.
            </p>
            <div class="vl-card-footer">
              <span class="vl-link-btn">Meer info</span>
            </div>
          </div>
        </div>
      </div>

      <!-- CSS Snippet -->
      <div class="vl-code-box">
        <div class="vl-code-top">
          <span class="vl-code-title">CSS voor de kaarten:</span>
          <button type="button" class="vl-copy-btn" @click="copyCss">
            {{ copied ? 'Gekopieerd!' : 'Kopieer CSS' }}
          </button>
        </div>
        <pre><code>{{ generatedCss }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface AlignOption {
  val: 'baseline' | 'top' | 'middle' | 'bottom'
}

const alignmentOptions: AlignOption[] = [
  { val: 'baseline' },
  { val: 'top' },
  { val: 'middle' },
  { val: 'bottom' }
]

const selectedAlign = ref<'baseline' | 'top' | 'middle' | 'bottom'>('top')
const hasExtraText = ref<boolean>(true)
const copied = ref<boolean>(false)

const currentAlignInfo = computed(() => {
  switch (selectedAlign.value) {
    case 'baseline':
      return {
        tag: 'Standaard browsergedrag (Valkuil!)',
        title: 'vertical-align: baseline — Ongelijke kaarten verspringen lelijk',
        description: 'De browser lijnt de allerlaatste tekstregel van elke kaart uit op één denkbeeldige horizontale lijn.',
        reason: 'Omdat Kaart 2 meer tekst bevat en hoger is, zakt Kaart 2 naar beneden ten opzichte van Kaart 1 en Kaart 3 om zijn laatste tekstregel gelijk te leggen. Hierdoor sluiten de bovenkanten van de kaarten niet meer op elkaar aan.',
        theme: 'theme-warning'
      }
    case 'top':
      return {
        tag: 'Aanbevolen gouden regel!',
        title: 'vertical-align: top — Strakke, gelijke bovenkanten',
        description: 'Alle kaarten worden strak uitgelijnd tegen het plafond van de regel.',
        reason: 'Ongeacht hoeveel tekst er in Kaart 2 staat of hoe hoog de kaarten individueel worden, beginnen alle titels en kaders netjes op exact dezelfde hoogte. Dit is dé industriestandaard voor kaartenroosters met inline-block.',
        theme: 'theme-success'
      }
    case 'middle':
      return {
        tag: 'Gecentreerd',
        title: 'vertical-align: middle — Uitgelijnd op de centrale as',
        description: 'De kaarten worden verticaal gecentreerd ten opzichte van de hoogste kaart op de regel.',
        reason: 'Kaart 1 en Kaart 3 zweven nu in het midden ten opzichte van Kaart 2. Dit is erg fraai wanneer je een klein icoontje of knopje naast een tekstblok wilt centreren.',
        theme: 'theme-info'
      }
    case 'bottom':
      return {
        tag: 'Onderkant uitgelijnd',
        title: 'vertical-align: bottom — Uitgelijnd tegen de onderkant',
        description: 'Alle kaarten rusten met hun bodem op dezelfde ondergrens.',
        reason: 'Kaart 1 en Kaart 3 worden naar beneden getrokken zodat hun onderranden gelijk vallen met Kaart 2.',
        theme: 'theme-neutral'
      }
  }
})

const generatedCss = computed(() => {
  return `/* De gouden regel voor kaarten naast elkaar met inline-block: */
.opleiding-kaart {
  display: inline-block;
  vertical-align: ${selectedAlign.value}; /* ${selectedAlign.value === 'top' ? 'Voorkomt verspringing bij ongelijke teksthoogtes!' : ''} */
  width: 31%;
  margin-right: 1.5%;
  margin-bottom: 1rem;
}`
})

const copyCss = async () => {
  try {
    await navigator.clipboard.writeText(generatedCss.value)
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
.valign-lab {
  margin: 2rem 0;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.vl-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.4rem;
  background-color: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
}

.vl-header-title {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-weight: 700;
  font-size: 1rem;
  color: var(--vp-c-text-1);
}

.vl-title-icon {
  color: #1e2d5a;
}
:root.dark .vl-title-icon {
  color: #e87722;
}

.vl-badge {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  background-color: rgba(30, 45, 90, 0.1);
  color: #1e2d5a;
}
:root.dark .vl-badge {
  background-color: rgba(232, 119, 34, 0.15);
  color: #e87722;
}

.vl-body {
  padding: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* 1. Controls */
.vl-controls {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1.5rem;
  background-color: var(--vp-c-bg);
  padding: 1.1rem 1.3rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

@media (max-width: 768px) {
  .vl-controls {
    grid-template-columns: 1fr;
  }
}

.vl-control-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.vl-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.vl-btn-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.vl-btn {
  padding: 0.4rem 0.75rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
}

.vl-btn:hover {
  border-color: #e87722;
  color: #e87722;
}

.vl-btn.is-active {
  background-color: #1e2d5a;
  border-color: #1e2d5a;
  color: #ffffff;
  font-weight: 700;
}
:root.dark .vl-btn.is-active {
  background-color: #e87722;
  border-color: #e87722;
}

.vl-toggle-btn {
  padding: 0.5rem 0.9rem;
  border-radius: 6px;
  border: 1px solid #e87722;
  background-color: rgba(232, 119, 34, 0.08);
  color: #e87722;
  font-weight: 600;
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.vl-toggle-btn:hover {
  background-color: #e87722;
  color: #ffffff;
}

.vl-toggle-btn.is-active {
  background-color: #e87722;
  color: #ffffff;
}

/* 2. Feedback banner */
.vl-feedback-card {
  padding: 1.1rem 1.3rem;
  border-radius: 8px;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-left: 4px solid #1e2d5a;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.vl-feedback-card.theme-warning {
  border-left-color: #d97706;
  background-color: rgba(245, 158, 11, 0.06);
}

.vl-feedback-card.theme-success {
  border-left-color: #16a34a;
  background-color: rgba(34, 197, 94, 0.06);
}

.vl-feedback-header {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.vl-pill {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  background-color: #1e2d5a;
  color: #ffffff;
}

.theme-warning .vl-pill {
  background-color: #d97706;
}

.theme-success .vl-pill {
  background-color: #16a34a;
}

.vl-feedback-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.vl-feedback-desc {
  font-size: 0.86rem;
  line-height: 1.45;
  color: var(--vp-c-text-1);
  margin: 0;
}

.vl-feedback-tip {
  font-size: 0.8rem;
  line-height: 1.4;
  color: var(--vp-c-text-2);
  border-top: 1px dashed var(--vp-c-divider);
  padding-top: 0.5rem;
}

/* 3. Live Canvas */
.vl-canvas-card {
  background-color: var(--vp-c-bg);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  padding: 1.25rem;
}

.vl-canvas-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--vp-c-text-2);
  margin-bottom: 0.85rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.vl-active-tag {
  font-family: monospace;
  color: #e87722;
  background-color: rgba(232, 119, 34, 0.1);
  padding: 0.1rem 0.45rem;
  border-radius: 4px;
}

.vl-canvas-stage {
  background-color: #f8fafc;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  padding: 1.5rem 1rem;
  position: relative;
  min-height: 240px;
}
:root.dark .vl-canvas-stage {
  background-color: #0f172a;
  border-color: #334155;
}

/* Hulplijnen */
.vl-guideline {
  position: absolute;
  left: 0;
  right: 0;
  border-bottom: 1px dashed #ef4444;
  z-index: 5;
  pointer-events: none;
}

.vl-guideline-top {
  top: 1.5rem;
}

.vl-guideline-middle {
  top: 50%;
}

.vl-guideline-baseline {
  bottom: 2.2rem;
}

.vl-line-badge {
  position: absolute;
  right: 1rem;
  top: -16px;
  font-size: 0.68rem;
  font-weight: 700;
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.15);
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
}

/* Kaarten */
.vl-card {
  display: inline-block;
  width: 31%;
  margin-right: 2%;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  transition: vertical-align 0.25s ease;
}
:root.dark .vl-card {
  background-color: #1e293b;
  border-color: #334155;
}

.vl-card:last-child {
  margin-right: 0;
}

@media (max-width: 700px) {
  .vl-card {
    width: 100%;
    margin-right: 0;
    margin-bottom: 1rem;
  }
}

.vl-card-accent {
  border-color: #e87722;
  box-shadow: 0 4px 14px rgba(232, 119, 34, 0.15);
}

.vl-card-header h5 {
  margin: 0.4rem 0 0.5rem 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.vl-card-badge {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  background-color: rgba(30, 45, 90, 0.1);
  color: #1e2d5a;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}
:root.dark .vl-card-badge {
  background-color: rgba(255, 255, 255, 0.1);
  color: #93c5fd;
}

.vl-badge-orange {
  background-color: rgba(232, 119, 34, 0.15);
  color: #e87722;
}

.vl-card-text {
  font-size: 0.8rem;
  line-height: 1.45;
  color: var(--vp-c-text-2);
  margin: 0 0 0.75rem 0;
}

.vl-extra-highlight {
  display: inline;
  background-color: #fef08a;
  color: #854d0e;
  padding: 0.1rem 0.2rem;
  border-radius: 2px;
}
:root.dark .vl-extra-highlight {
  background-color: rgba(250, 204, 21, 0.2);
  color: #fde047;
}

.vl-card-footer {
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 0.5rem;
}

.vl-link-btn {
  display: inline-block;
  font-size: 0.76rem;
  font-weight: 700;
  color: #1e2d5a;
}
:root.dark .vl-link-btn {
  color: #93c5fd;
}

.vl-btn-orange {
  color: #e87722 !important;
}

/* 4. Code box */
.vl-code-box {
  border-radius: 8px;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
}

.vl-code-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 0.78rem;
  border-bottom: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
}

.vl-code-title {
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.vl-copy-btn {
  font-size: 0.75rem;
  padding: 0.25rem 0.65rem;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
}

.vl-copy-btn:hover {
  border-color: #e87722;
  color: #e87722;
}

.vl-code-box pre {
  margin: 0;
  padding: 0.85rem 1.1rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}
</style>
