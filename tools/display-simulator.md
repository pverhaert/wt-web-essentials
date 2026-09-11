---
title: Display Simulator
---

# Display & Documentstroom Simulator

Met deze interactieve tool experimenteer je live met het fundamentele weergavetype (`display`) van HTML-elementen en onderzoek je de werking van de normale documentstroom in moderne browsers.

::: info Onderdeel van de lay-out modules
Deze tool sluit rechtstreeks aan bij de theorie uit het hoofdstuk [CSS Display](/css/display).
:::

## Interactieve Simulator

Kies hieronder een weergavetype (`inline`, `inline-block`, `block`, `none` of `visibility: hidden`), pas breedte, hoogte, marges en de verticale uitlijning aan, en observeer direct hoe de omliggende tekst en referentievakken reageren:

<DisplayVisualizer />

## Belangrijkste inzichten over de documentstroom

Bij het experimenteren met deze simulator vallen de volgende vuistregels op:

### 1. Waarom `inline` geen afmetingen accepteert
Een element met `display: inline` (zoals `<span>`, `<a>` of `<strong>`) vloeit mee met de tekst. De browser berekent de afmetingen puur op basis van de letters zelf. Eigenschappen zoals `width`, `height`, `margin-top` en `margin-bottom` worden door de browser simpelweg genegeerd.

### 2. De kracht van `inline-block`
`display: inline-block` combineert het beste van twee werelden: aan de buitenkant vloeit het mee op de regel zoals tekst (waardoor elementen netjes naast elkaar kunnen staan), maar aan de binnenkant gehoorzaamt het aan alle regels van het CSS boxmodel (`width`, `height`, `padding` en alle marges).

### 3. Het verschil tussen `display: none` en `visibility: hidden`
- **`display: none`**: Het element wordt volledig uit de lay-out en de documentstroom verwijderd. De afmetingen worden 0 × 0 pixels en buurelementen schuiven direct naadloos tegen elkaar aan.
- **`visibility: hidden`**: Het element wordt onzichtbaar, maar behoudt zijn exacte breedte, hoogte en marges. Er ontstaat een lege "blinde vlek" in de lay-out.
