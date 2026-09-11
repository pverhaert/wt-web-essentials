<template>
  <div class="button-builder">
    <div class="bb-header">
      <div class="bb-header-title">
        <svg class="bb-title-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="6" width="18" height="12" rx="3" />
          <path d="m9 12 2 2 4-4" />
        </svg>
        <span class="bb-label">Stap-voor-stap: Van hyperlink naar actieknop</span>
      </div>
      <span class="bb-badge">Didactische simulator</span>
    </div>

    <div class="bb-body">
      <!-- Stap-voor-stap navigatiebalk -->
      <div class="bb-steps-nav">
        <button
          v-for="(step, idx) in steps"
          :key="step.id"
          type="button"
          class="bb-step-btn"
          :class="{
            'is-active': currentStep === idx,
            'is-completed': currentStep > idx
          }"
          @click="currentStep = idx"
        >
          <span class="bb-step-number">{{ idx + 1 }}</span>
          <span class="bb-step-text">
            <strong>{{ step.tabTitle }}</strong>
            <span class="bb-step-sub">{{ step.tabSub }}</span>
          </span>
        </button>
      </div>

      <!-- Inhoudelijke uitleg bij de huidige stap -->
      <div class="bb-explainer-card" :class="currentStepData.theme">
        <div class="bb-explainer-top">
          <span class="bb-tag">{{ currentStepData.tag }}</span>
          <h4 class="bb-explainer-title">{{ currentStepData.title }}</h4>
        </div>
        <div class="bb-explainer-body">
          <p class="bb-explainer-main">{{ currentStepData.description }}</p>

          <div class="bb-explainer-details">
            <div class="bb-detail-col">
              <span class="bb-detail-label">Wat zie je gebeuren?</span>
              <span class="bb-detail-value">{{ currentStepData.visualEffect }}</span>
            </div>
            <div class="bb-detail-col">
              <span class="bb-detail-label">Het onderliggende mechanisme:</span>
              <span class="bb-detail-value">{{ currentStepData.whyEffect }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Live preview van de link tussen tekst -->
      <div class="bb-preview-card">
        <div class="bb-preview-header">
          <span>Live Documentweergave (tussen twee alinea's):</span>
          <span class="bb-preview-mode">Huidige weergave: <code>{{ currentStepData.displayCode }}</code></span>
        </div>

        <div class="bb-preview-canvas">
          <p class="bb-p bb-p-top">
            Alinea 1: Welkom op Thomas More Campus Geel. Onze opleiding IT Factory bereidt je voor op een boeiende toekomst in softwareontwikkeling, web en cloud systems.
          </p>

          <div class="bb-target-wrapper">
            <span class="bb-helper-line" v-if="currentStep === 2" title="Oorspronkelijke tekstbasislijn">
              <span class="bb-helper-tag">Oorspronkelijke tekstlijn</span>
            </span>

            <a
              href="javascript:void(0)"
              class="bb-target-link"
              :class="`step-${currentStep}`"
              :style="linkStyles"
              @click.prevent
            >
              Inschrijven voor 2026-2027 &rarr;
            </a>
          </div>

          <p class="bb-p bb-p-bottom">
            Alinea 2: Bekijk het studieprogramma, maak kennis met onze lectoren en ontdek welke projecten je tijdens de modules zult realiseren.
          </p>
        </div>
      </div>

      <!-- Gegenereerde CSS Code -->
      <div class="bb-code-card">
        <div class="bb-code-top">
          <span class="bb-code-title">Bijbehorende CSS-code:</span>
          <div class="bb-nav-btns">
            <button
              type="button"
              class="bb-btn-nav"
              :disabled="currentStep === 0"
              @click="currentStep--"
            >
              &larr; Vorige stap
            </button>
            <button
              type="button"
              class="bb-btn-nav"
              :disabled="currentStep === steps.length - 1"
              @click="currentStep++"
            >
              Volgende stap &rarr;
            </button>
            <button type="button" class="bb-btn-copy" @click="copyCss">
              {{ copied ? 'Gekopieerd!' : 'Kopieer CSS' }}
            </button>
          </div>
        </div>
        <pre><code>{{ currentStepData.cssCode }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Step {
  id: string
  tabTitle: string
  tabSub: string
  tag: string
  title: string
  description: string
  visualEffect: string
  whyEffect: string
  theme: string
  displayCode: string
  cssCode: string
}

const steps: Step[] = [
  {
    id: 'step1',
    tabTitle: 'Stap 1: Standaard link',
    tabSub: 'display: inline',
    tag: 'Beginpunt',
    title: 'De ongerepte hyperlink (Standaard browserstijl)',
    description: 'Standaard is een <a>-tag een zuiver inline-element. De link vloeit mee met de tekst, heeft een blauwe kleur en een onderlijning.',
    visualEffect: 'De link neemt exact de breedte en hoogte van zijn eigen letters in.',
    whyEffect: 'Omdat een <a> standaard inline is, kan je de link nog niet als een knop behandelen. Enkel het smalle tekstje zelf is met de muis of vinger aan te klikken.',
    theme: 'theme-neutral',
    displayCode: 'display: inline (standaard)',
    cssCode: `/* Standaard HTML hyperlink */
a.knop {
  color: #1e2d5a;
  text-decoration: underline;
}`
  },
  {
    id: 'step2',
    tabTitle: 'Stap 2: Kleur & tekststijl',
    tabSub: 'Achtergrond & afronding',
    tag: 'Eerste styling',
    title: 'Achtergrondkleur, tekstkleur en border-radius toevoegen',
    description: 'We halen de onderlijning weg met text-decoration: none en voegen een oranje Thomas More-achtergrondkleur, witte letters en afgeronde hoeken toe.',
    visualEffect: 'Het ziet er al een beetje uit als een knopje, maar het oranje vlak plakt nog heel strak en krap tegen de letters aan.',
    whyEffect: 'Zonder padding heeft een element geen binnenruimte. Voor een comfortabele knop moet de bezoeker wat ademruimte rondom de letters hebben.',
    theme: 'theme-info',
    displayCode: 'display: inline',
    cssCode: `a.knop {
  color: #ffffff;
  background-color: #e87722;
  text-decoration: none;
  font-weight: 600;
  border-radius: 6px;
}`
  },
  {
    id: 'step3',
    tabTitle: 'Stap 3: Het padding-probleem',
    tabSub: 'Overlap met buurtekst!',
    tag: 'Typische beginnersvalkuil',
    title: 'Padding toevoegen zónder display: inline-block (Het gevaar!)',
    description: 'Je voegt een royale binnenruimte toe (padding: 0.8rem 1.4rem). Maar kijk goed naar wat er gebeurt met de zinnen erboven en eronder!',
    visualEffect: '⚠️ De oranje achtergrond van de knop overlapt lelijk met de bovenstaande tekst en duwt de volgende alinea NIET weg!',
    whyEffect: 'OPGELET: Op een standaard inline-element werkt verticale padding wel visueel, maar de browser berekent er GEEN extra hoogte voor in de tekststroom. De regels schuiven dus niet op, met een rommelige overlap tot gevolg.',
    theme: 'theme-warning',
    displayCode: 'display: inline (met padding)',
    cssCode: `a.knop {
  color: #ffffff;
  background-color: #e87722;
  text-decoration: none;
  font-weight: 600;
  border-radius: 6px;

  /* Let op het probleem: */
  padding: 0.8rem 1.4rem; /* Verticale padding overlapt met regel erboven! */
  margin-top: 1.5rem;    /* Heeft GEEN effect op inline! */
}`
  },
  {
    id: 'step4',
    tabTitle: 'Stap 4: De oplossing',
    tabSub: 'display: inline-block',
    tag: 'Het aha-moment',
    title: 'De magische oplossing: display: inline-block toevoegen',
    description: 'We veranderen het weergavetype naar display: inline-block. Nu beschouwt de browser de link intern als een volwaardig blok.',
    visualEffect: '✅ De knop duwt de bovenliggende én onderliggende tekst perfect weg! Er is geen enkele overlap meer, en de ingestelde marges werken nu vlekkeloos.',
    whyEffect: 'Dankzij inline-block vloeit het element nog steeds mee op de pagina, maar respecteert het boxmodel nu 100% de hoogte, verticale padding en marges. De knop is nu professioneel en overal makkelijk aanklikbaar!',
    theme: 'theme-success',
    displayCode: 'display: inline-block',
    cssCode: `a.knop {
  /* De sleutel tot een professionele knop: */
  display: inline-block;

  color: #ffffff;
  background-color: #e87722;
  text-decoration: none;
  font-weight: 600;
  border-radius: 6px;
  padding: 0.8rem 1.4rem;
  margin: 0.75rem 0; /* Werkt nu perfect aan alle 4 de zijden! */
  box-shadow: 0 3px 10px rgba(232, 119, 34, 0.3);
}`
  }
]

const currentStep = ref<number>(0)
const copied = ref<boolean>(false)

const currentStepData = computed(() => steps[currentStep.value])

const linkStyles = computed(() => {
  switch (currentStep.value) {
    case 0:
      return {
        display: 'inline',
        color: '#1e2d5a',
        textDecoration: 'underline',
        fontWeight: 'normal',
      }
    case 1:
      return {
        display: 'inline',
        color: '#ffffff',
        backgroundColor: '#e87722',
        textDecoration: 'none',
        fontWeight: '600',
        borderRadius: '6px',
        padding: '0 4px',
      }
    case 2:
      return {
        display: 'inline',
        color: '#ffffff',
        backgroundColor: '#e87722',
        textDecoration: 'none',
        fontWeight: '600',
        borderRadius: '6px',
        padding: '0.8rem 1.4rem',
        marginTop: '20px',
      }
    case 3:
      return {
        display: 'inline-block',
        color: '#ffffff',
        backgroundColor: '#e87722',
        textDecoration: 'none',
        fontWeight: '600',
        borderRadius: '6px',
        padding: '0.8rem 1.4rem',
        margin: '0.8rem 0',
        boxShadow: '0 3px 10px rgba(232, 119, 34, 0.3)',
      }
    default:
      return {}
  }
})

const copyCss = async () => {
  try {
    await navigator.clipboard.writeText(currentStepData.value.cssCode)
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
.button-builder {
  margin: 2rem 0;
  border-radius: 12px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.bb-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.4rem;
  background-color: var(--vp-c-bg);
  border-bottom: 1px solid var(--vp-c-divider);
}

.bb-header-title {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-weight: 700;
  font-size: 1rem;
  color: var(--vp-c-text-1);
}

.bb-title-icon {
  color: #e87722;
}

.bb-badge {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  background-color: rgba(232, 119, 34, 0.12);
  color: #e87722;
}

.bb-body {
  padding: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* 1. Stappen navigatie */
.bb-steps-nav {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .bb-steps-nav {
    grid-template-columns: 1fr 1fr;
  }
}

.bb-step-btn {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem 0.85rem;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}

.bb-step-btn:hover {
  border-color: #e87722;
  transform: translateY(-1px);
}

.bb-step-btn.is-active {
  background-color: #e87722;
  border-color: #e87722;
  box-shadow: 0 4px 12px rgba(232, 119, 34, 0.3);
}

.bb-step-number {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.bb-step-btn.is-active .bb-step-number {
  background-color: #ffffff;
  color: #e87722;
}

.bb-step-text {
  display: flex;
  flex-direction: column;
}

.bb-step-text strong {
  font-size: 0.8rem;
  color: var(--vp-c-text-1);
}

.bb-step-btn.is-active .bb-step-text strong {
  color: #ffffff;
}

.bb-step-sub {
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
  font-family: monospace;
}

.bb-step-btn.is-active .bb-step-sub {
  color: #fff1e5;
}

/* 2. Explainer card */
.bb-explainer-card {
  padding: 1.1rem 1.3rem;
  border-radius: 8px;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-left: 4px solid #1e2d5a;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.bb-explainer-card.theme-warning {
  border-left-color: #d97706;
  background-color: rgba(245, 158, 11, 0.05);
}

.bb-explainer-card.theme-success {
  border-left-color: #16a34a;
  background-color: rgba(34, 197, 94, 0.05);
}

.bb-explainer-top {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.bb-tag {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  background-color: #1e2d5a;
  color: #ffffff;
}

.theme-warning .bb-tag {
  background-color: #d97706;
}

.theme-success .bb-tag {
  background-color: #16a34a;
}

.bb-explainer-title {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.bb-explainer-main {
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--vp-c-text-1);
  margin: 0;
}

.bb-explainer-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 0.4rem;
  padding-top: 0.65rem;
  border-top: 1px dashed var(--vp-c-divider);
}

@media (max-width: 680px) {
  .bb-explainer-details {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
}

.bb-detail-col {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.82rem;
}

.bb-detail-label {
  font-weight: 700;
  color: var(--vp-c-text-2);
  font-size: 0.76rem;
}

.bb-detail-value {
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

/* 3. Live Preview */
.bb-preview-card {
  background-color: var(--vp-c-bg);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  padding: 1.25rem;
}

.bb-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--vp-c-text-2);
  margin-bottom: 0.75rem;
  padding-bottom: 0.45rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.bb-preview-mode code {
  color: #e87722;
  background-color: rgba(232, 119, 34, 0.1);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}

.bb-preview-canvas {
  background-color: #ffffff;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  padding: 1.5rem;
  position: relative;
}
:root.dark .bb-preview-canvas {
  background-color: #0f172a;
  border-color: #334155;
}

.bb-p {
  font-size: 0.92rem;
  line-height: 1.6;
  color: #475569;
  margin: 0;
}
:root.dark .bb-p {
  color: #94a3b8;
}

.bb-p-top {
  margin-bottom: 0.4rem;
}

.bb-p-bottom {
  margin-top: 0.4rem;
}

.bb-target-wrapper {
  position: relative;
  display: block;
}

.bb-target-link {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  font-size: 0.92rem;
}

.bb-helper-line {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  border-bottom: 1px dashed #ef4444;
  pointer-events: none;
  z-index: 10;
}

.bb-helper-tag {
  position: absolute;
  right: 0;
  top: -18px;
  font-size: 0.68rem;
  color: #ef4444;
  font-weight: 700;
  background: rgba(239, 68, 68, 0.1);
  padding: 0.1rem 0.35rem;
  border-radius: 3px;
}

/* 4. Code card */
.bb-code-card {
  border-radius: 8px;
  background-color: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
}

.bb-code-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.78rem;
  border-bottom: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg);
}

.bb-code-title {
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.bb-nav-btns {
  display: flex;
  gap: 0.4rem;
}

.bb-btn-nav,
.bb-btn-copy {
  font-size: 0.75rem;
  padding: 0.25rem 0.65rem;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  cursor: pointer;
}

.bb-btn-nav:hover:not(:disabled),
.bb-btn-copy:hover {
  border-color: #e87722;
  color: #e87722;
}

.bb-btn-nav:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.bb-code-card pre {
  margin: 0;
  padding: 0.85rem 1.1rem;
  font-family: var(--vp-font-family-mono);
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--vp-c-text-1);
}
</style>
