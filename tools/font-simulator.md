---
title: Font Simulator
---

# Font Simulator: Webfonts & Typografie

Met deze interactieve tool experimenteer je live met typografie voor het web. Vergelijk moderne variabele Google Fonts v2 (*Inter*, *Roboto*, *Poppins*) met beproefde systeemlettertypen (*Verdana*, *Arial*, *Georgia*, *Trebuchet MS*, *Consolas*) en zie direct hoe verschillende CSS-eigenschappen de weergave en leesbaarheid beïnvloeden.

::: info Onderdeel van de typografie modules
Deze simulator sluit naadloos aan bij de leerstof uit de hoofdstukken [Lettertypen en Tekstopmaak](/css/lettertypen) en [Webfonts en Iconen](/css/webfonts).
:::

## Interactieve Simulator

Gebruik de onderstaande besturingselementen om het lettertype, de dikte (`font-weight`), de lettergrootte (`font-size`), de regelhoogte (`line-height`), uitlijning en transformaties dynamisch aan te passen. Wissel tussen de hoofdtitel (`<h1>`) en de alinea (`<p>`) en kopieer de gegenereerde CSS met één klik naar jouw eigen stylesheet.

<GoogleFontsSimulator />

## Belangrijke typografische inzichten

Bij het experimenteren met deze tool vallen enkele essentiële concepten op die elke webontwikkelaar moet beheersen:

### 1. Variabele lettertypen vs. Systeemlettertypen
- **Google Fonts v2 (Variable Fonts):** Bij lettertypen zoals *Inter* en *Roboto* zijn alle gewichten samengebracht in één compact bestand. Je kan de `font-weight` slider traploos instellen op tussenliggende waarden (zoals `450` of `550`).
- **Systeemlettertypen:** Klassieke systeemfonts hebben doorgaans enkel vaste bestanden voor normaal (`400`) en vet (`700`). Tussenliggende getallen worden door de browser automatisch naar het dichtstbijzijnde beschikbare gewicht afgerond.

### 2. Verschil in x-hoogte en schijnbare grootte
Zelfs wanneer twee lettertypen exact dezelfde `font-size` hebben (bijvoorbeeld `1rem` of 16px), oogt *Verdana* merkbaar groter en breder dan *Times New Roman* of *Arial*. Dit komt door de **x-hoogte** (de hoogte van de kleine letter 'x' ten opzichte van de hoofdletters). Houd hier rekening mee wanneer je een lettertypestapel (*font stack*) samenstelt.

### 3. OpenType-features en kleinkapitalen (`small-caps`)
- De eigenschap `font-variant: small-caps` toont kleine letters als verkleinde hoofdletters.
- Bij klassieke systeemlettertypen (zoals *Georgia*) ondersteunt de browser dit direct.
- Bij webfonts via Google Fonts is de specifieke OpenType-tabel voor kleinkapitalen (`smcp`) meestal weggelaten om het downloadbestand zo klein mogelijk te houden. De browser voert bij afwezige tekens geen kunstmatige vervorming uit op webfonts.
