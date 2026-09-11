---
title: Tabel Simulator
---

# Tabelranden & Lay-out Simulator

Met deze interactieve tool experimenteer je live met alle specifieke CSS-tabeleigenschappen: `border-collapse`, `border-spacing`, `empty-cells`, `caption-side` en het lay-outalgoritme `table-layout`.

::: info Onderdeel van de tabelmodules
Deze tool sluit rechtstreeks aan bij de theorie en oefeningen uit het hoofdstuk [CSS Tabellen](/css/tabellen).
:::

## Interactieve Simulator

Gebruik de onderstaande schakelaars en schuifknoppen om de verschillende tabeleigenschappen te combineren. Test vooral de knop *"Voeg lange tekst toe aan kolom 2"* en wissel tussen `table-layout: auto` en `table-layout: fixed`:

<TableWorkbench />

## Belangrijkste inzichten bij CSS tabellen

### 1. Samengevouwen versus gescheiden randen
- **`border-collapse: collapse` (aanbevolen):** Aangrenzende randen van cellen en tabel smelten samen tot één strakke randlijn. Dit is de standaard voor vrijwel elke moderne datatabel.
- **`border-collapse: separate` (standaard browsergedrag):** Elke cel behoudt een eigen afzonderlijk kader. Pas hier kan je `border-spacing` gebruiken om tussenruimte tussen de cellen te creëren.

### 2. De positie van de caption
Verplaats de `<caption>`-tag nooit in jouw HTML-code (daar hoort het semantisch altijd direct na de openingstag `<table>`). Wil je de tabeltitel of een bronvermelding onder de tabel tonen, gebruik dan `caption-side: bottom;` in CSS.

### 3. Automatische versus vaste tabelbreedte (`table-layout`)
- **`table-layout: auto` (standaard):** De browser moet eerst alle tekst in alle rijen en kolommen scannen om te berekenen hoe breed elke kolom wordt. Een kolom met lange tekst rekt automatisch breed uit en duwt andere kolommen krap bijeen.
- **`table-layout: fixed`:** De kolombreedtes liggen vast op basis van de eerste rij cellen. Resterende ruimte wordt strikt gelijkmatig verdeeld, ongeacht hoeveel tekst er in de afzonderlijke cellen staat. Ideaal voor lesroosters en weekplanningen!
