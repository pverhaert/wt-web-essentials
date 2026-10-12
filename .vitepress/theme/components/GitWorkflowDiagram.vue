<template>
  <div class="git-workflow-container" aria-label="Git Workflow Diagram: overgang van bestanden tussen Werkmap, Staging Area, Lokale Repository en GitHub">
    <div class="git-workflow-grid">
      <!-- Zone 1: Jouw computer (Lokaal) -->
      <div class="git-zone git-zone-local">
        <div class="git-zone-header">
          <svg class="zone-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="14" x="2" y="3" rx="2"/>
            <line x1="8" x2="16" y1="21" y2="21"/>
            <line x1="12" x2="12" y1="17" y2="21"/>
          </svg>
          <span>Jouw Computer (Lokaal)</span>
        </div>

        <div class="git-stages-row">
          <!-- Stap 1: Werkmap -->
          <div class="git-stage-card stage-working">
            <div class="stage-badge">Stap 1</div>
            <div class="stage-title">Werkmap</div>
            <div class="stage-sub">Working Directory</div>
            <p class="stage-desc">Bestanden die je aanmaakt of bewerkt in PhpStorm.</p>
            <div class="stage-indicator red-tag">Nieuw / Gewijzigd</div>
          </div>

          <!-- Pijl 1: git add -->
          <div class="git-transition">
            <div class="command-pill forward">
              <code>git add</code>
            </div>
            <div class="arrow-line right">
              <svg class="arrow-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="9 6 15 12 9 18"></polyline>
              </svg>
            </div>
          </div>

          <!-- Stap 2: Staging Area -->
          <div class="git-stage-card stage-staging">
            <div class="stage-badge">Stap 2</div>
            <div class="stage-title">Staging Area</div>
            <div class="stage-sub">Het Laadperron</div>
            <p class="stage-desc">Geselecteerde bestanden die klaarstaan voor de commit.</p>
            <div class="stage-indicator green-tag">Klaargezet</div>
          </div>

          <!-- Pijl 2: git commit -->
          <div class="git-transition">
            <div class="command-pill forward">
              <code>git commit</code>
            </div>
            <div class="arrow-line right">
              <svg class="arrow-svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="9 6 15 12 9 18"></polyline>
              </svg>
            </div>
          </div>

          <!-- Stap 3: Lokale Repository -->
          <div class="git-stage-card stage-local-repo">
            <div class="stage-badge">Stap 3</div>
            <div class="stage-title">Lokaal Archief</div>
            <div class="stage-sub">Lokale Repository (.git)</div>
            <p class="stage-desc">Definitieve momentopnames veilig bewaard op je schijf.</p>
            <div class="stage-indicator blue-tag">Vastgelegd</div>
          </div>
        </div>
      </div>

      <!-- Tussenpijl: git push naar de Cloud -->
      <div class="git-zone-connector">
        <div class="command-pill push-pill">
          <code>git push</code>
        </div>
        <div class="connector-arrow right">
          <svg class="arrow-svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="9 6 15 12 9 18"></polyline>
          </svg>
        </div>
      </div>

      <!-- Zone 2: Cloud (Remote) -->
      <div class="git-zone git-zone-remote">
        <div class="git-zone-header">
          <svg class="zone-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
          </svg>
          <span>Cloud (Remote)</span>
        </div>

        <div class="git-stages-row">
          <!-- Stap 4: GitHub -->
          <div class="git-stage-card stage-remote">
            <div class="stage-badge">Stap 4</div>
            <div class="stage-title">GitHub</div>
            <div class="stage-sub">Remote Repository</div>
            <p class="stage-desc">Centrale opslag in de cloud voor evaluatie en samenwerking.</p>
            <div class="stage-indicator orange-tag">Gepubliceerd</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Terugkerende acties: Pull & Clone -->
    <div class="git-return-row">
      <div class="return-action">
        <div class="return-pill">
          <code>git pull</code>
        </div>
        <span class="return-text">Haalt nieuwste wijzigingen van GitHub op naar jouw werkmap</span>
      </div>
      <div class="return-action">
        <div class="return-pill">
          <code>git clone</code>
        </div>
        <span class="return-text">Downloadt een bestaand GitHub-project eenmalig naar een nieuwe map</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Stateless presentational component for Git Workflow
</script>

<style scoped>
.git-workflow-container {
  margin: 1.75rem 0;
  padding: 1.5rem;
  background-color: var(--vp-c-bg-soft, #f8fafc);
  border: 1px solid var(--vp-c-divider, #e2e8f0);
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.git-workflow-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  align-items: stretch;
}

@media (min-width: 960px) {
  .git-workflow-grid {
    flex-direction: row;
    align-items: center;
  }
}

.git-zone {
  background-color: var(--vp-c-bg, #ffffff);
  border: 1px solid var(--vp-c-border, #e5e7eb);
  border-radius: 10px;
  padding: 1rem;
}

.git-zone-local {
  flex: 3;
  border-left: 4px solid #3b82f6;
}

.git-zone-remote {
  flex: 1.1;
  border-left: 4px solid #ec6639;
}

.git-zone-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--vp-c-text-2, #64748b);
  margin-bottom: 0.85rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px dashed var(--vp-c-divider, #e2e8f0);
}

.zone-icon {
  color: var(--vp-c-brand-1, #ec6639);
}

.git-stages-row {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .git-stages-row {
    flex-direction: row;
    align-items: stretch;
  }
}

.git-stage-card {
  flex: 1;
  background-color: var(--vp-c-bg-alt, #f8fafc);
  border: 1px solid var(--vp-c-divider, #e2e8f0);
  border-radius: 8px;
  padding: 0.85rem;
  display: flex;
  flex-direction: column;
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.git-stage-card:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1, #ec6639);
}

.stage-badge {
  display: inline-block;
  align-self: flex-start;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--vp-c-text-3, #94a3b8);
  margin-bottom: 0.25rem;
}

.stage-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--vp-c-text-1, #1e293b);
  line-height: 1.25;
}

.stage-sub {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-text-2, #64748b);
  margin-bottom: 0.5rem;
}

.stage-desc {
  font-size: 0.8rem;
  line-height: 1.35;
  color: var(--vp-c-text-2, #475569);
  margin: 0 0 0.75rem 0;
  flex-grow: 1;
}

.stage-indicator {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  text-align: center;
  align-self: flex-start;
}

.red-tag {
  background-color: rgba(239, 68, 68, 0.12);
  color: #dc2626;
}

.green-tag {
  background-color: rgba(34, 197, 94, 0.12);
  color: #16a34a;
}

.blue-tag {
  background-color: rgba(59, 130, 246, 0.12);
  color: #2563eb;
}

.orange-tag {
  background-color: rgba(236, 102, 57, 0.12);
  color: #ec6639;
}

/* Connectors & Transitions */
.git-transition {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.25rem;
}

.git-zone-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.5rem;
}

.command-pill {
  background-color: var(--vp-c-bg, #ffffff);
  border: 1px solid var(--vp-c-divider, #cbd5e1);
  border-radius: 6px;
  padding: 0.2rem 0.55rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.command-pill code {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--vp-c-brand-1, #ec6639);
  background: transparent;
  padding: 0;
}

.push-pill {
  border-color: #ec6639;
  background-color: rgba(236, 102, 57, 0.08);
}

.arrow-line, .connector-arrow {
  color: var(--vp-c-text-3, #94a3b8);
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 639px) {
  .arrow-svg {
    transform: rotate(90deg);
  }
}

@media (min-width: 640px) and (max-width: 959px) {
  .connector-arrow .arrow-svg {
    transform: rotate(90deg);
  }
}

/* Return actions row */
.git-return-row {
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px dashed var(--vp-c-divider, #e2e8f0);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .git-return-row {
    flex-direction: row;
    justify-content: space-between;
  }
}

.return-action {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.return-pill {
  background-color: var(--vp-c-bg, #ffffff);
  border: 1px solid var(--vp-c-divider, #cbd5e1);
  border-radius: 6px;
  padding: 0.15rem 0.5rem;
}

.return-pill code {
  font-size: 0.78rem;
  font-weight: 700;
  color: #2563eb;
  background: transparent;
  padding: 0;
}

.return-text {
  font-size: 0.8rem;
  color: var(--vp-c-text-2, #64748b);
}
</style>
