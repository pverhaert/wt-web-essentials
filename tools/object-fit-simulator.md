---
title: Object-fit Simulator
---

# Object-fit & Object-position Simulator

Met deze interactieve simulator ontdek je live hoe de CSS-eigenschappen `object-fit` en `object-position` bepalen hoe een afbeelding of video zich gedraagt binnen een vast kader (zoals een nieuwskaart, hero-banner of profielfoto).

::: info Onderdeel van de CSS Afbeeldingen module
Deze tool sluit rechtstreeks aan bij de theorie uit het hoofdstuk [CSS Afbeeldingen & Achtergronden](/css/afbeeldingen).
:::

## Interactieve Simulator

Kies hieronder een waarde voor `object-fit` (`cover`, `contain`, `fill`, `none` of `scale-down`), experimenteer met verschillende kaders (breedbeeld, vierkant of staand) en verplaats de uitsnede via het 3&times;3 positierooster:

<ObjectFitSimulator />

## Belangrijkste inzichten over `object-fit`

Bij het ontwerpen van moderne webpagina's voorkom je dankzij `object-fit` dat afbeeldingen lelijk uitrekken of samengedrukt worden:

### 1. `object-fit: cover` (De industriestandaard voor kaarten)
In moderne webontwikkeling is `object-fit: cover` de meest gebruikte optie. De afbeelding vult het volledige kader zonder ooit haar beeldverhouding te verliezen. Eventuele overtollige zijkanten of bovenkanten worden netjes bijgesneden.

### 2. `object-fit: contain` (Voor logo's en schema's)
Moet elk detail van een afbeelding zichtbaar blijven (zoals een partnerlogo of een technisch diagram)? Gebruik dan `contain`. De afbeelding schaalt zodat ze volledig in het kader past, al kunnen er aan de randen lege balken ontstaan.

### 3. De uitsnede sturen met `object-position`
Standaard snijdt de browser een foto bij vanuit het exacte midden (`center center`). Bevindt het belangrijkste onderwerp (zoals een gezicht) zich echter bovenaan de foto? Dan richt je de uitsnede met `object-position: top center;` precies op de juiste plek.
