<template>
  <div class="not-found-wrapper">
    <div class="not-found-card">
      <div class="not-found-icon-wrap">
        <svg class="not-found-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <p class="not-found-code">404</p>
      <h1 class="not-found-title">Pagina niet gevonden</h1>
      <p class="not-found-message">
        Oeps! De opgevraagde pagina bestaat niet, is verplaatst of de link bevat een typfout.
      </p>

      <div class="not-found-actions">
        <a href="/" class="action-btn action-primary">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>Naar startpagina</span>
        </a>
        <a href="/html/" class="action-btn action-secondary">HTML5 Cursus</a>
        <a href="/css/" class="action-btn action-secondary">CSS3 Cursus</a>
        <a href="/tools/phpstorm" class="action-btn action-secondary">Tools &amp; Setup</a>
      </div>

      <div class="not-found-footer">
        <span>Web Essentials</span>
        <span class="sep">&bull;</span>
        <span>Thomas More Hogeschool</span>
        <span class="sep">&bull;</span>
        <span>IT Factory Geel</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Custom 404 weergave voor Web Essentials (Thomas More)
</script>

<style scoped>
.not-found-wrapper {
  padding: 64px 24px 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - var(--vp-nav-height) - var(--vp-footer-height, 80px));
}

@media (min-width: 768px) {
  .not-found-wrapper {
    padding: 96px 32px 140px;
  }
}

.not-found-card {
  max-width: 580px;
  width: 100%;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 48px 32px;
  text-align: center;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.04);
}

.not-found-icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background-color: var(--vp-c-brand-soft, rgba(232, 119, 34, 0.14));
  color: var(--vp-c-brand-1, #e87722);
  margin-bottom: 20px;
}

.not-found-icon {
  width: 28px;
  height: 28px;
}

.not-found-code {
  font-size: 4.5rem;
  font-weight: 900;
  line-height: 1;
  color: var(--vp-c-brand-1, #e87722);
  margin: 0 0 12px 0;
  letter-spacing: -0.04em;
}

.not-found-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 12px 0;
}

.not-found-message {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0 0 32px 0;
}

.not-found-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 28px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.action-primary {
  background-color: var(--vp-c-brand-1, #e87722);
  color: #ffffff !important;
  border: 1px solid var(--vp-c-brand-1, #e87722);
}

.action-primary:hover {
  background-color: var(--vp-c-brand-2, #d4641a);
  border-color: var(--vp-c-brand-2, #d4641a);
  transform: translateY(-1px);
}

.action-secondary {
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
}

.action-secondary:hover {
  border-color: var(--vp-c-brand-1, #e87722);
  color: var(--vp-c-brand-1, #e87722);
  transform: translateY(-1px);
}

.not-found-footer {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.not-found-footer .sep {
  opacity: 0.5;
}
</style>
