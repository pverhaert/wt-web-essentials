---
title: 3D Transform Simulator
---

# 3D Transform Simulator

Met deze interactieve simulator breng je diepte in je ontwerpen en ontdek je hoe de virtuele 3D-camera (<dfn title="De afstand tussen de denkbeeldige camera van de kijker en het computerscherm">`perspective`</dfn>), de Z-as (`translateZ`) en driedimensionale rotaties (`rotateX`, `rotateY`, `rotateZ`) tot leven komen in de browser.

::: info Onderdeel van de lay-out en stijlen modules
Deze tool sluit rechtstreeks aan bij de theorie en oefeningen uit het hoofdstuk [CSS 3D Transformaties](/css/3d-transformaties).
:::

## Interactieve Simulator

Experimenteer met de afstand van de virtuele camera, kantel het element over de verschillende assen en ontdek met de schakelaars het belang van `transform-style: preserve-3d` en `backface-visibility`:

<Transform3dSimulator />

## Belangrijkste inzichten over 3D Transformaties

Bij het bouwen van driedimensionale elementen zijn dit de sleutelconcepten:

### 1. Zonder `perspective` is er geen diepte
Wanneer je een element kantelt met `rotateX(45deg)` zonder dat er een perspectiefwaarde is gedefinieerd, ziet het element er simpelweg platgedrukt uit. Pas wanneer de oudercontainer een `perspective` (bijvoorbeeld `800px`) krijgt, berekent de browser het natuurlijke verdwijnpunt en ontstaat er een overtuigend dieptegevoel.

### 2. Kinderen in 3D: `preserve-3d`
Standaard worden alle kindelementen door de browser samengedrukt tot een plat tweedimensionaal vlak op de ouder (`transform-style: flat`). Wil je dat een badge of knop loskomt op de Z-as, dan móét de roterende ouder `transform-style: preserve-3d` bezitten.

### 3. De achterkant verbergen met `backface-visibility`
Bij het ontwerpen van 3D Flip Cards draai je de kaart 180 graden om haar as. Door `backface-visibility: hidden` in te stellen, wordt een vlak automatisch transparant zodra het van de toeschouwer is weggedraaid, waardoor de juiste zijde naadloos tevoorschijn komt.
