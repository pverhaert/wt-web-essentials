<template>
  <div class="home-storybook-section">
    <div class="storybook-card">
      <div class="storybook-accent-bar"></div>
      <div class="storybook-inner">
        <div class="storybook-badge-row">
          <span class="storybook-badge">
            <svg class="storybook-sparkle-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/>
            </svg>
            AI Bewustwording
          </span>
          <span class="storybook-tag">Eye-opener voor studenten</span>
        </div>

        <h2 class="storybook-title">Wat als ... ChatGPT "Ons moe" was</h2>

        <p class="storybook-description">
          Een humoristische en herkenbare eye-opener om je wakker te schudden: vertrouw niet blindelings op artificiële intelligentie! AI is een handig hulpmiddel, maar laat nooit zomaar klakkeloos code genereren die je zelf niet begrijpt of niet kunt verdedigen.
        </p>

        <div class="storybook-action-row">
          <a
            :href="url"
            target="_blank"
            rel="noopener noreferrer"
            class="storybook-btn"
          >
            <span>Open het Storybook</span>
            <svg class="storybook-arrow-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </a>
          <span class="storybook-hint">Opent in Google Gemini</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const url = 'https://gemini.google.com/share/4008a69876ba?skid=47bd349d-ee9f-4f82-9d4d-e8ec8f80aa8c'
</script>

<style scoped>
.home-storybook-section {
  max-width: 1152px;
  margin: 2.5rem auto 1.5rem auto;
  padding: 0 24px;
}

.storybook-card {
  position: relative;
  background: linear-gradient(135deg, rgba(30, 45, 90, 0.04) 0%, rgba(236, 102, 57, 0.07) 100%);
  border: 1px solid var(--vp-c-divider, #e2e8f0);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.dark .storybook-card {
  background: linear-gradient(135deg, rgba(30, 45, 90, 0.35) 0%, rgba(236, 102, 57, 0.15) 100%);
  border-color: rgba(255, 255, 255, 0.08);
}

.storybook-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(236, 102, 57, 0.12);
  border-color: rgba(236, 102, 57, 0.4);
}

.storybook-accent-bar {
  height: 4px;
  width: 100%;
  background: linear-gradient(90deg, #1e2d5a 0%, #ec6639 100%);
}

.storybook-inner {
  padding: 1.75rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.storybook-badge-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.storybook-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background-color: rgba(236, 102, 57, 0.12);
  color: #ec6639;
  padding: 0.25rem 0.65rem;
  border-radius: 20px;
}

.dark .storybook-badge {
  color: #f09040;
  background-color: rgba(240, 144, 64, 0.18);
}

.storybook-sparkle-icon {
  color: #ec6639;
}

.dark .storybook-sparkle-icon {
  color: #f09040;
}

.storybook-tag {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-text-2, #64748b);
}

.storybook-title {
  margin: 0;
  font-size: 1.45rem;
  font-weight: 800;
  line-height: 1.3;
  color: #1e2d5a;
  border: none;
  padding: 0;
}

.dark .storybook-title {
  color: #93c5fd;
}

.storybook-description {
  margin: 0;
  font-size: 0.98rem;
  line-height: 1.6;
  color: var(--vp-c-text-1, #334155);
  max-width: 820px;
}

.storybook-action-row {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.storybook-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background-color: #ec6639;
  color: #ffffff !important;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  text-decoration: none !important;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(236, 102, 57, 0.25);
}

.storybook-btn:hover {
  background-color: #d05a32;
  transform: translateX(1px);
  box-shadow: 0 4px 14px rgba(236, 102, 57, 0.35);
}

.storybook-arrow-icon {
  transition: transform 0.2s ease;
}

.storybook-btn:hover .storybook-arrow-icon {
  transform: translate(2px, -2px);
}

.storybook-hint {
  font-size: 0.8rem;
  color: var(--vp-c-text-3, #94a3b8);
  font-style: italic;
}

@media (max-width: 640px) {
  .storybook-inner {
    padding: 1.25rem 1.25rem;
  }
  .storybook-title {
    font-size: 1.25rem;
  }
  .storybook-description {
    font-size: 0.9rem;
  }
}
</style>
