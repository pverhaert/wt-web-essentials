---
title: Animation Simulator
---

# Animation Simulator

Met deze interactieve simulator ontleed je de werking van <abbr title="Cascading Style Sheets: de stijlen- en opmaaktaal voor het web">CSS</abbr>-animaties en `@keyframes`. Experimenteer met de speelrichting, herhalingsaantallen en de cruciale `animation-fill-mode` om precies te zien wat er vóór, tijdens en na afloop van een animatiecyclus met een element gebeurt.

::: info Onderdeel van de animatie modules
Deze tool sluit rechtstreeks aan bij de theorie en oefeningen uit het hoofdstuk [CSS Animaties](/css/animaties).
:::

## Interactieve Simulator

Kies hieronder een keyframe-patroon, configureer de duur, herhaling, richting en fill-mode, en speel met de pauzeer- en herstartknoppen om het gedrag nauwkeurig te bestuderen:

<AnimationSimulator />

## Belangrijkste inzichten over Animaties

Bij het bouwen van complexe keyframe-animaties zijn dit de voornaamste vuistregels:

### 1. Transities versus Animaties
Waar een transitie altijd een externe aanleiding vereist (zoals een muisovergang via `:hover` of een klassewissel in JavaScript) en enkel van A naar B beweegt, start een CSS-animatie desgewenst direct uit zichzelf en kan ze oneindig tussen tientallen tussenstappen (`0%` tot `100%`) blijven pendelen.

### 2. Het effect van `animation-fill-mode`
- **`none` (standaard):** Het element toont zijn eigen stijlen vóór de delay en springt na afloop direct terug naar zijn oorspronkelijke ruststand.
- **`forwards`:** Het element behoudt na afloop van de animatie permanent de stijlen van het laatste sleutelframe (`100%`).
- **`backwards`:** Het element neemt reeds tijdens de wachttijd (`delay`) onmiddellijk de stijlen van het eerste sleutelframe (`0%`) aan.
- **`both`:** Combineert beide technieken: het element start direct op `0%` én blijft na afloop staan op `100%`.

### 3. Richting en oneindigheid
Door `animation-direction: alternate` te combineren met `animation-iteration-count: infinite` keert de animatie aan het eindpunt soepel om in plaats van abrupt terug naar de start te springen. Dit levert vloeiende pulsen, radarbewegingen en ademende UI-knoppen op.
