---
title: Positioning Simulator
---

# Positioning Simulator

Met deze interactieve simulator verken je live de verschillende positioneringstechnieken in <abbr title="Cascading Style Sheets: de stijlen- en opmaaktaal voor het web">CSS</abbr> (`static`, `relative`, `absolute`, `fixed` en `sticky`). Je ontdekt precies hoe de normale documentstroom reageert, welk referentie-element de browser kiest en welk effect de coördinaten `top`, `bottom`, `left`, `right` en `z-index` hebben.

::: info Onderdeel van de lay-out modules
Deze tool sluit rechtstreeks aan bij de theorie en oefeningen uit het hoofdstuk [CSS Positionering](/css/positionering).
:::

## Interactieve Simulator

Kies hieronder een positioneringswaarde, versleep of wijzig de afstandscoördinaten, experimenteer met `z-index` en scroll door het previewvenster om het gedrag van `fixed` en `sticky` elementen direct in actie te zien:

<PositioningSimulator />

## Belangrijkste inzichten over Positionering

Bij het bouwen van complexe interfaces zijn dit de belangrijkste basisregels om te onthouden:

### 1. `position: static` (De standaard)
Elk HTML-element is standaard statisch gepositioneerd. Het volgt strikt de normale documentstroom en negeert eigenschappen zoals `top`, `left` en `z-index`.

### 2. `position: relative` (Verschoven maar met behoud van plaats)
Een relatief gepositioneerd element behoudt zijn oorspronkelijke plek in de documentstroom. De omliggende elementen merken niet dat het element visueel verschoven wordt. Bovendien vormt een element met `position: relative` het ideale referentiekader voor absoluut gepositioneerde kind-elementen.

### 3. `position: absolute` (Volledig los van de documentstroom)
Een absoluut element verlaat de documentstroom volledig: buurelementen sluiten direct aan alsof het element niet bestaat. Het element positioneert zich ten opzichte van de dichtstbijzijnde ouder met een andere positionering dan `static`. Vindt de browser geen gepositioneerde ouder, dan dient de `<html>`-viewport als anker.

### 4. `position: fixed` vs. `position: sticky`
- **`position: fixed`**: Kleeft roerloos vast aan het browservenster (de viewport). Zelfs wanneer de bezoeker door een lange pagina scrolt, blijft een fixed navigatiebalk of help-knop op exact dezelfde plaats staan.
- **`position: sticky`**: Een hybride vorm. Het element scrolt eerst gewoon mee met de inhoud tot het de ingestelde drempelwaarde (zoals `top: 0`) bereikt. Vanaf dat moment blijft het kleven aan het scherm zolang de oudercontainer in beeld is.
