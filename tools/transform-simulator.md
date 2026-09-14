---
title: 2D Transform Simulator
---

# 2D Transform Simulator

Met deze interactieve simulator experimenteer je live met de belangrijkste 2D-transformaties in <abbr title="Cascading Style Sheets: de stijlen- en opmaaktaal voor het web">CSS</abbr> (`rotate()`, `translate()`, `scale()`, `skew()` en combinaties). Je ziet direct welk effect het verleggen van het rotatiepunt (<dfn title="Het ankerpunt waaromheen een element roteert, schaalt of vervormt">`transform-origin`</dfn>) heeft op de uiteindelijke beweging en vorm van het element.

::: info Onderdeel van de lay-out en stijlen modules
Deze tool sluit rechtstreeks aan bij de theorie en oefeningen uit het hoofdstuk [CSS 2D Transformaties](/css/2d-transformaties).
:::

## Interactieve Simulator

Kies hieronder een transformatiemethode, versleep de sliders of selecteer een ankerpunt in het 9-puntsraster. De gestreepte ghost-container toont continu de oorspronkelijke plek in de documentstroom, terwijl de oranje stip het actieve draaipunt aanduidt:

<Transform2dSimulator />

## Belangrijkste inzichten over 2D Transformaties

Bij het toepassen van transformaties in moderne interfaces zijn dit de belangrijkste basisprincipes:

### 1. Behoud van de normale documentstroom
Een getransformeerd element verplaatst of roteert zuiver visueel via de grafische kaart van de computer (GPU). Omliggende elementen schuiven niet op: de oorspronkelijke plek in het raster blijft onaangeroerd (zoals weergegeven door het gestreepte ghost-kader).

### 2. De rol van `transform-origin`
Standaard staat het draaipunt exact in het midden van het element (`50% 50%`). Door dit ankerpunt te verleggen naar bijvoorbeeld `top left` (`0% 0%`) of `bottom center` (`50% 100%`) kantelt of schaalt het element vanuit die specifieke rand of hoek in plaats van rond zijn eigen zwaartepunt.

### 3. Gecombineerde transformaties en volgorde
Wanneer je meerdere functies combineert in één `transform`-declaratie, scheid je ze altijd met een spatie (nooit met een komma). Let op de volgorde: `rotate()` vóór `translate()` draait immers ook de richting van de assen mee.
