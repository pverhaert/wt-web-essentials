---
title: Transition Simulator
---

# Transition Simulator

Met deze interactieve simulator ontdek je hoe de vier componenten van een <abbr title="Cascading Style Sheets: de stijlen- en opmaaktaal voor het web">CSS</abbr>-transitie (`transition-property`, `transition-duration`, `transition-timing-function` en `transition-delay`) samenwerken om toestandswissels (zoals bij `:hover` of een actieve klasse) vloeiend te laten verlopen.

::: info Onderdeel van de animatie modules
Deze tool sluit rechtstreeks aan bij de theorie en oefeningen uit het hoofdstuk [CSS Transities](/css/transities).
:::

## Interactieve Simulator

Kies hieronder een CSS-eigenschap, pas de duur, de timingfunctie en de startvertraging aan, en klik op de toestand-knop om het directe verschil tussen een element zónder en mét transitie te ervaren:

<TransitionSimulator />

## Belangrijkste inzichten over Transities

Bij het ontwerpen van micro-interacties en gebruikersinterfaces zijn dit de vuistregels:

### 1. Wat kan er animeren?
Transities werken uitsluitend op eigenschappen met meetbare tussenwaarden (numerieke waarden, lengtes in `px`/`rem`, percentages en kleurwaarden). Eigenschappen met abrupte toestanden, zoals `display: none` naar `display: block`, kunnen niet vloeiend worden overbrugd.

### 2. De invloed van de timingfunctie
- **`ease` (standaard):** Start rustig, versnelt snel in het midden en remt zacht af. Dit voelt natuurlijk aan voor de meeste UI-elementen.
- **`linear`:** Een mechanische, constante snelheid. Handig voor timers, maar voelt vaak stroef aan voor knoppen.
- **`ease-out`:** Begint met topsnelheid en remt zacht af. Ideaal voor binnenkomende elementen zoals pop-ups en meldingen.

### 3. De shorthand-volgorde
Bij de samengestelde eigenschap `transition` is de volgorde van de twee tijdswaarden strikt: de **eerste** tijd is altijd de duur (`duration`), de **tweede** tijd is altijd de optionele startvertraging (`delay`).
