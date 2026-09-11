---
title: Display
---

# Display

Elk element op een webpagina heeft een standaardgedrag dat bepaalt hoe het zich gedraagt ten opzichte van de omringende tekst en elementen. Sommige elementen, zoals alinea's en koppen, beginnen altijd op een nieuwe regel en nemen de volledige breedte in beslag. Andere elementen, zoals hyperlinks en vetgedrukte woorden, vloeien naadloos mee tussen de gewone zinnen.

Met de CSS-eigenschap <dfn title="De centrale CSS-eigenschap die het weergavetype van een element en zijn gedrag in de documentstroom bepaalt">display</dfn> heb je de volledige controle over dit weergavetype. Je kan een inline-element omtoveren tot een robuust blokelement, meerdere blokken netjes naast elkaar plaatsen met `inline-block`, of elementen volledig onzichtbaar maken. In dit hoofdstuk ontdek je hoe de documentstroom werkt en hoe je met de display-eigenschap de bouwstenen van je webpagina vormgeeft.

## Leerdoelen

Na dit hoofdstuk kan je:

- Het fundamentele verschil in gedrag uitleggen tussen blokelementen en inline-elementen in de documentstroom
- Beschrijven waarom `width`, `height` en verticale marges niet werken op standaard inline-elementen
- Het weergavetype van een element aanpassen met de eigenschap `display` (`block`, `inline`, `inline-block` en `none`)
- Hyperlinks en andere inline-elementen omvormen tot volwaardige knoppen met `display: inline-block`
- De verticale uitlijning van inline-block elementen sturen met behulp van de eigenschap `vertical-align`
- Het verschil in lay-outeffect uitleggen tussen `display: none` en `visibility: hidden`
- Sneller coderen met Emmet-sneltoetsen voor display- en zichtbaarheidswaarden in PhpStorm

## De natuurlijke documentstroom: Blok versus Inline

Wanneer een browser een HTML-document inlaadt zonder enige CSS-stijl, plaatst hij de elementen volgens een vast patroon: de <dfn title="De natuurlijke volgorde en wijze waarop de browser HTML-elementen op het scherm positioneert voordat er CSS-lay-outregels op worden toegepast">documentstroom (normal flow)</dfn>.

In deze stroom kent HTML standaard twee grote categorieën elementen (zoals je in het HTML-hoofdstuk [Basistags](/html/basistags#blokelementen-en-inline-elementen) al kort hebt gezien):

1. Blokelementen <dfn title="Een HTML-element dat standaard op een nieuwe regel begint en de volledige beschikbare breedte van zijn ouder inneemt">(block-level elements)</dfn>
2. Inline-elementen <dfn title="Een HTML-element dat meevloeit in de lopende tekstregel en enkel de breedte inneemt die nodig is voor zijn inhoud">(inline elements)</dfn>

### Blokelementen (`display: block`)

Typische voorbeelden van blokelementen zijn `<div>`, `<p>`, `<h1>` tot en met `<h6>`, `<ul>`, `<ol>`, `<li>`, `<header>`, `<main>`, `<section>`, `<article>`, `<aside>` en `<footer>`.

Kenmerken van een blokelement:
- Begint **altijd op een nieuwe regel** in de browser.
- Neemt standaard **100% van de beschikbare breedte** van zijn bovenliggende element in, zelfs als de tekst maar een paar woorden lang is.
- Volgt het **volledige CSS Box Model**: je kan zowel de breedte (`width`), hoogte (`height`), binnenruimte (`padding`) als buitenruimte (`margin`) aan alle vier de zijden nauwkeurig instellen.

### Inline-elementen (`display: inline`)

Typische voorbeelden van inline-elementen zijn `<span>`, `<a>`, `<strong>`, `<em>`, `<abbr>`, `<dfn>`, `<code>` en `<mark>`.

Kenmerken van een inline-element:
- Begint **niet op een nieuwe regel**, maar vloeit netjes mee tussen de omringende woorden op dezelfde regel.
- Neemt **enkel de breedte in die nodig is** voor zijn eigen inhoud.
- **Negeert `width` en `height`**: je kan een `<span>` of `<a>` geen vaste breedte of hoogte geven met CSS; de browser negeert deze waarden simpelweg.
- **Beperkt boxmodel-gedrag bij marges en padding**:
  - Horizontale `padding` en `margin` (links en rechts) werken perfect en creëren afstand tot de buren op dezelfde regel.
  - Verticale `padding` en `margin` (boven en onder) duwen de boven- of onderliggende tekstregels **niet** weg. De achtergrondkleur van de padding kan daardoor overlappen met de tekst op de vorige of volgende regel.

::: info De uitzondering: het `<img>`-element
Een afbeelding (`<img>`) is een speciaal soort inline-element, namelijk een *vervangend element (replaced element)*. Hoewel een afbeelding standaard tussen tekstregels mee vloeit zoals een inline-element, kan je er wél rechtstreeks een `width`, `height`, verticale `margin` en verticale `padding` op instellen.
:::

### Vergelijking van het boxmodel per weergavetype

| Eigenschap | `display: block` | `display: inline` | `display: inline-block` |
|---|---|---|---|
| Begint op nieuwe regel? | **Ja** | Nee | Nee |
| Neemt volledige breedte in? | **Ja** (100%) | Nee (inhoud) | Nee (inhoud) |
| Reageert op `width` en `height`? | **Ja** | **Nee** (genegeerd) | **Ja** |
| Horizontale `margin` & `padding`? | **Ja** | **Ja** | **Ja** |
| Verticale `margin` & `padding`? | **Ja** | Visueel wel, maar duwt regels niet weg | **Ja** (duwt omliggende elementen netjes weg) |

### Codevoorbeeld: Blok versus Inline visualiseren

In de onderstaande sandbox zie je het verschil tussen alinea's (blok) en spans/links (inline). Merk op hoe de ingestelde `width` en `height` op de inline `span` en link volledig genegeerd worden door de browser.

```html
<!-- Blokelementen: starten op een nieuwe regel en nemen de volle breedte -->
<div class="vak-blok">
  <h2>Blokelement (h2)</h2>
  <p>Dit is een alinea. Alineas zijn blokelementen en vullen automatisch de hele breedte.</p>
</div>

<!-- Inline-elementen: vloeien mee in de regel -->
<p class="tekst-met-inline">
  In deze tekst staat een <span class="inline-accent">span met vaste breedte</span> en een
  <a href="#" class="inline-link">hyperlink</a> die gewoon meevloeien op dezelfde regel.
</p>
```

<CodeSandbox
  title="Voorbeeld: Blok versus Inline"
  activeCodeTab="css"
  height="460px"
  css='/* Universele resetter */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
/* Algemene paginastijl */
body {
  font-family: system-ui, sans-serif;
  color: #212529;
  padding: 1.5rem;
  line-height: 1.6;
}
/* Blokelementen */
.vak-blok {
  background-color: #f1f5f9;
  border: 2px solid #1e2d5a;
  padding: 1rem;
  margin-bottom: 1.5rem;
}
.vak-blok h2 {
  color: #1e2d5a;
  margin-bottom: 0.5rem;
}
/* Inline elementen demonstreren */
.tekst-met-inline {
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  padding: 1rem;
}
/* Breedte en hoogte worden genegeerd op inline spans! */
.inline-accent {
  background-color: #fde68a;
  color: #92400e;
  padding: 0.2rem 0.5rem;
  width: 250px; /* Heeft GEEN effect op inline */
  height: 80px; /* Heeft GEEN effect op inline */
  font-weight: 600;
}
.inline-link {
  color: #e87722;
  font-weight: 600;
  width: 200px; /* Heeft GEEN effect op inline */
}'
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blok versus Inline</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <div class="vak-blok">
    <h2>Blokelement (h2)</h2>
    <p>Dit is een alinea. Alineas zijn blokelementen en vullen automatisch de hele breedte van hun ouder.</p>
  </div>

  <p class="tekst-met-inline">
    In deze alinea bevindt zich een <span class="inline-accent">span met stijlen</span> en een
    <a href="#" class="inline-link">hyperlink</a>. Merk op hoe beide elementen netjes meevloeien met de omringende tekst en hun opgegeven breedte van 250px negeren.
  </p>
</body>
</html>'
/>

## Het weergavetype wijzigen: `display: block` en `display: inline`

Met de eigenschap `display` kan je het standaardgedrag van elk willekeurig HTML-element omdraaien:

```css
/* Maak van een inline hyperlink een blokelement */
a.blok-knop {
  display: block;
}

/* Laat lijstitems horizontaal naast elkaar meevloeien */
li.inline-item {
  display: inline;
}
```

### Praktijktoepassing: Hyperlinks als brede knoppen (`display: block`)

Standaard is bij een hyperlink (`<a>`) enkel het stukje tekst zelf aanklikbaar. Geef je de link `display: block;`, dan rekt de link uit over de volle breedte van zijn omringende container. Dit is bijzonder handig voor mobiele menu's en knoppenlijsten, waar een bezoeker met zijn duim op het hele vlak moet kunnen tikken:

```css
.zijbalk a {
  display: block;
  padding: 0.75rem 1rem;
  background-color: #1e2d5a;
  color: #ffffff;
  text-decoration: none;
  margin-bottom: 0.5rem;
  border-radius: 4px;
}
```

## Het beste van twee werelden: `display: inline-block`

Wat doe je als je meerdere knoppen of kaarten **horizontaal naast elkaar** wil plaatsen, maar wél een vaste breedte, hoogte, royale binnenruimte en bovenmarge nodig hebt?

- `display: block` werkt niet, want dat dwingt elk element naar een nieuwe regel.
- `display: inline` werkt ook niet, want dat negeert de breedte, hoogte en verticale tussenruimte.

Hier biedt <dfn title="CSS-weergavetype waarbij een element meevloeit op de regel zoals tekst, maar intern alle eigenschappen van een volwaardig blokelement bezit (zoals width, height en verticale marges)">inline-block</dfn> de oplossing:

- **Aan de buitenkant** gedraagt het element zich als **inline**: het begint niet op een nieuwe regel en vloeit netjes naast zijn buren.
- **Aan de binnenkant** gedraagt het element zich als een **blok**: het gehoorzaamt aan `width`, `height`, `margin` en `padding` aan alle vier de zijden.

```css
.knop {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  background-color: #e87722;
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  border-radius: 4px;
}
```

### Stapsgewijze demonstratie: Een knop transformeren

Doorloop onderstaande 4 stappen om te ontdekken waarom een knop zónder `display: inline-block` de omliggende tekst overlapt, en hoe `inline-block` dit direct oplost:

<ButtonBuilder />

### Verticale uitlijning met `vertical-align`

Wanneer je meerdere `inline-block` elementen naast elkaar plaatst die verschillende hoogtes hebben (of verschillende hoeveelheden tekst bevatten), lijnt de browser de elementen standaard uit op de **basislijn van de tekst** (`baseline`). Dit kan leiden tot een verspringend en slordig effect.

Met de eigenschap `vertical-align` bepaal je hoe de blokken ten opzichte van elkaar uitlijnen:

- **`vertical-align: top;`**: Lijnt alle elementen strak uit langs de bovenkant (aanbevolen voor kaarten en kolommen).
- **`vertical-align: middle;`**: Centreert de elementen verticaal ten opzichte van elkaar (ideaal voor een icoon naast een stukje tekst).
- **`vertical-align: bottom;`**: Lijnt elementen uit langs de onderkant.

```css
.kaart {
  display: inline-block;
  vertical-align: top;
  width: 14rem;
}
```

### Zelf experimenteren met uitlijning van kaarten

In het onderstaande lab zie je wat er gebeurt als Kaart 2 meer tekst bevat dan de buren. Schakel tussen `baseline` (standaard browsergedrag) en `top` (de oplossing) om de werking van `vertical-align` te doorgronden:

<VerticalAlignLab />

::: tip Let op de witruimte-kloof bij inline-block
Omdat `inline-block` elementen worden behandeld als tekstkarakters, telt elke spatie, tab of nieuwe regel in je HTML-code tussen twee elementen mee als een visuele spatie van ongeveer 4 pixels. Schrik dus niet als er een heel klein wit kiertje tussen twee aansluitende knoppen zit. Dit is volkomen normaal browsergedrag voor tekst.
:::

### Codevoorbeeld: Professionele knoppenbalk met `inline-block`

In het onderstaande voorbeeld transformeren we gewone ankerlinks (`<a>`) naar een aantrekkelijke knoppenrij met `display: inline-block`, `padding`, een hover-effect en `vertical-align`.

```html
<nav class="campus-acties">
  <a href="#" class="knop knop-primair">Inschrijven voor campus Geel</a>
  <a href="#" class="knop knop-secundair">Infodag bezoeken</a>
  <a href="#" class="knop knop-subtiel">Contact opnemen</a>
</nav>
```

<CodeSandbox
  title="Voorbeeld: Knoppenbalk met inline-block"
  activeCodeTab="css"
  highlightCss="27-31"
  height="440px"
  css='/* Universele resetter */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
/* Pagina lettertype */
body {
  font-family: system-ui, sans-serif;
  color: #2b2d42;
  padding: 2rem;
  background-color: #f8fafc;
}
.knoppen-container {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}
.knoppen-container h2 {
  font-size: 1.25rem;
  color: #1e2d5a;
  margin-bottom: 1rem;
}
/* De basisklasse voor alle knoppen */
.knop {
  display: inline-block;
  vertical-align: middle;
  padding: 0.75rem 1.5rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 6px;
}
/* Primaire oranje knop */
.knop-primair {
  background-color: #e87722;
  color: #ffffff;
  border: 2px solid #e87722;
}
.knop-primair:hover {
  background-color: #cf6517;
  border-color: #cf6517;
}
/* Secundaire blauwe knop */
.knop-secundair {
  background-color: #1e2d5a;
  color: #ffffff;
  border: 2px solid #1e2d5a;
}
.knop-secundair:hover {
  background-color: #141f3e;
  border-color: #141f3e;
}
/* Subtiele omlijnde knop */
.knop-omlijnd {
  background-color: transparent;
  color: #1e2d5a;
  border: 2px solid #cbd5e1;
}
.knop-omlijnd:hover {
  border-color: #1e2d5a;
  background-color: #f1f5f9;
}'
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Knoppenbalk met inline-block</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <div class="knoppen-container">
    <h2>IT Factory - Thomas More Campus Geel</h2>
    <nav>
      <a href="#" class="knop knop-primair">Inschrijven voor 2026-2027</a>
      <a href="#" class="knop knop-secundair">Infodag bezoeken</a>
      <a href="#" class="knop knop-omlijnd">Brochure downloaden</a>
    </nav>
  </div>
</body>
</html>'
/>

## Elementen verbergen: `display: none` versus `visibility: hidden`

In moderne websites wil je soms bepaalde onderdelen voor de gebruiker verbergen, zoals een pop-upmenu dat pas opent na een klik, of een waarschuwingsbericht dat gesloten kan worden.

CSS biedt hiervoor twee verschillende eigenschappen die beginners vaak door elkaar halen: `display: none` en `visibility: hidden`.

### 1. `display: none` (Element verdwijnt volledig)

Wanneer je een element voorziet van <dfn title="CSS-declaratie die een element volledig verwijdert uit de zichtbare weergave en de documentstroom, zodat het geen ruimte meer inneemt">display: none</dfn>:
- Wordt het element **volledig uit de visuele documentstroom gehaald**.
- Het element neemt **geen enkele fysieke ruimte** meer in op het scherm (breedte en hoogte worden nul).
- De omringende elementen schuiven direct dicht en nemen de vrijgekomen plaats in, precies alsof het element nooit in de HTML-code heeft gestaan.

```css
.melding-gesloten {
  display: none;
}
```

### 2. `visibility: hidden` (Element wordt onzichtbaar maar laat een gat achter)

Wanneer je een element instelt op <dfn title="CSS-declaratie die een element onzichtbaar maakt voor het oog, terwijl het zijn exacte fysieke afmetingen en plek in de lay-out behoudt">visibility: hidden</dfn>:
- Wordt het element transparant en onzichtbaar voor de bezoeker.
- Het element **behoudt zijn exacte afmetingen, marges en positie**.
- Er ontstaat een **blinde vlek (een leeg gat)** op de pagina op de plek waar het element stond.

```css
.plaatsvervanger {
  visibility: hidden;
}
```

| Eigenschap | Zichtbaar voor het oog? | Neemt nog ruimte in op het scherm? | Wat gebeurt er met de buren? |
|---|---|---|---|
| `display: none;` | **Nee** | **Nee** (0 × 0 px) | Schuiven direct op en vullen het gat op |
| `visibility: hidden;` | **Nee** | **Ja** (oorspronkelijke breedte/hoogte) | Blijven exact op hun plaats staan |

### Codevoorbeeld: Het verschil tussen `display: none` en `visibility: hidden`

In het onderstaande voorbeeld staan drie identieke informatieblokken. Blok 2 is verborgen via `display: none` (waardoor blok 3 direct aansluit). Blok 5 is verborgen via `visibility: hidden` (waardoor er een lege ruimte overblijft).

```html
<div class="rij">
  <div class="vak">Vak 1</div>
  <div class="vak vak-display-none">Vak 2 (display: none)</div>
  <div class="vak">Vak 3 (sluit direct aan)</div>
</div>
```

<CodeSandbox
  title="Voorbeeld: display: none versus visibility: hidden"
  activeCodeTab="css"
  highlightCss="38-40,42-44"
  height="480px"
  css='/* Universele resetter */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
/* Paginastijl */
body {
  font-family: system-ui, sans-serif;
  color: #212529;
  padding: 1.5rem;
}
h2 {
  font-size: 1.1rem;
  color: #1e2d5a;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}
.rij {
  background-color: #f1f5f9;
  padding: 1rem;
  border-radius: 6px;
  border: 1px dashed #94a3b8;
  margin-bottom: 1.5rem;
}
.vak {
  display: inline-block;
  width: 140px;
  height: 80px;
  padding: 0.75rem;
  background-color: #1e2d5a;
  color: #ffffff;
  font-weight: 600;
  border-radius: 4px;
  vertical-align: top;
}
/* display: none haalt het element volledig weg */
.verberg-display {
  display: none;
}
/* visibility: hidden maakt onzichtbaar maar behoudt het vak */
.verberg-visibility {
  visibility: hidden;
}'
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>display: none vs visibility: hidden</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <h2>Situatie 1: display: none (Vak 2 verdwijnt, Vak 3 schuift op)</h2>
  <div class="rij">
    <div class="vak">Vak 1</div>
    <div class="vak verberg-display">Vak 2 (display: none)</div>
    <div class="vak">Vak 3</div>
  </div>

  <h2>Situatie 2: visibility: hidden (Vak 5 is onzichtbaar, maar behoudt zijn plek)</h2>
  <div class="rij">
    <div class="vak">Vak 4</div>
    <div class="vak verberg-visibility">Vak 5 (visibility: hidden)</div>
    <div class="vak">Vak 6</div>
  </div>
</body>
</html>'
/>

### Zelf experimenteren met de display-simulator

Gebruik de onderstaande interactieve simulator om het gedrag van `inline`, `inline-block`, `block`, `none` en `visibility: hidden` direct in de praktijk te testen en te zien hoe buurelementen reageren op breedte, hoogte en marges:

<DisplayVisualizer />

## Vooruitblik: Moderne lay-outmodules

De waarden `block`, `inline` en `inline-block` vormen al sinds de begindagen van CSS de basis voor tekst- en documentopmaak. Om complexe paginalay-outs (zoals navigatiebalken die gelijkmatig verdelen of kolommenroosters die soepel meeschalen) veel intuïtiever te maken, zijn er in CSS moderne display-waarden bijgekomen:

- **`display: flex`**: Activeert de Flexbox-lay-outmodule (behandeld in het hoofdstuk [Flexbox](/css/flexbox)). Hiermee verdeel je elementen op één as (horizontaal of verticaal) met ongekende flexibiliteit.
- **`display: grid`**: Activeert het tweedimensionale CSS Grid-systeem voor geavanceerde rijen- en kolommenroosters (wordt niet in deze basiscursus behandeld).

De klassieke waarden die je in dit hoofdstuk hebt geleerd blijven echter de onmisbare basis voor elk individueel element op een webpagina.

## Sneller werken met Emmet in PhpStorm

In PhpStorm typ je display- en zichtbaarheidseigenschappen in een oogwenk met behulp van Emmet. Typ de afkorting in je stylesheet en druk direct op `Tab`:

| Doel | Emmet-afkorting | Resultaat in CSS |
|---|---|---|
| Blokelement | `d:b` + `Tab` | `display: block;` |
| Inline element | `d:i` + `Tab` | `display: inline;` |
| Inline-block | `d:ib` + `Tab` | `display: inline-block;` |
| Volledig verbergen | `d:n` + `Tab` | `display: none;` |
| Onzichtbaar met behoud van ruimte | `v:h` + `Tab` | `visibility: hidden;` |
| Zichtbaar maken | `v:v` + `Tab` | `visibility: visible;` |

<PageSummary>

### Syntaxis in een oogopslag

| Waarde | Gedrag | Breedte / Hoogte | Toepassing |
|---|---|---|---|
| `display: block` | Begint op nieuwe regel, vult 100% breedte | Instelbaar | Titels, alinea's, containers, brede mobiele knoppen |
| `display: inline` | Vloeit mee in tekstregel, neemt inhoudsbreedte | Niet instelbaar (genegeerd) | Woorden in zinnen, markeringen, platte hyperlinks |
| `display: inline-block` | Vloeit mee in tekstregel, maar gedraagt zich intern als blok | Volledig instelbaar | Knoppen, badges, kaarten naast elkaar |
| `display: none` | Verdwijnt volledig uit de documentstroom | Geen ruimte (0 × 0 px) | Sluitbare meldingen, verborgen mobiele menu's |
| `visibility: hidden` | Wordt onzichtbaar, maar behoudt zijn fysieke plek | Behoudt afmetingen | Onzichtbare plaatsvervangers, spellen/animaties |

### Regels en afspraken

- **Inline negeert afmetingen:** Probeer nooit `width` of `height` in te stellen op een zuiver `display: inline` element. Heb je vaste afmetingen nodig, verander de weergave dan naar `display: inline-block` of `display: block`.
- **Verticale marges op inline werken niet:** Verticale marges (`margin-top` en `margin-bottom`) hebben geen effect op inline-elementen. Gebruik `inline-block` als je afstand boven en onder de knop of het label wil afdwingen.
- **Lijn inline-blocks uit:** Plaats je meerdere `inline-block` elementen van ongelijke hoogte naast elkaar, stel dan altijd `vertical-align: top;` of `middle` in om verspringing te vermijden.
- **Kies de juiste verbergmethode:** Gebruik `display: none` wanneer de omringende pagina netjes moet dichttrekken. Gebruik enkel `visibility: hidden` als de witruimte expliciet bewaard moet blijven.

### Veelgemaakte fouten

- Een hyperlink (`<a>`) proberen een breedte of bovenmarge te geven zonder eerst `display: inline-block` of `display: block` toe te voegen.
- `display: none` en `visibility: hidden` verwarren: verwachten dat `display: none` een witruimte openlaat, of verbaasd zijn dat `visibility: hidden` een leeg gat achterlaat.
- Vergeten `vertical-align: top;` in te stellen op kaarten met `display: inline-block`, waardoor de kaarten vreemd naar onderen zakken zodra er een regel tekst meer in staat.

### Tips voor beginners

- Gebruik Emmet in PhpStorm: typ `d:ib` + `Tab` voor `display: inline-block;` en `d:n` + `Tab` voor `display: none;`.
- Inspecteer het berekende display-type in de browser DevTools (`F12` -> tabblad **Computed**) om te zien welk weergavetype de browser standaard toekent aan een HTML-tag.

</PageSummary>

## Oefeningen

### Oefening 1: Campus actieknoppen met `inline-block`

In deze oefening transformeer je gewone ankerlinks naar een fraaie rij actieknoppen voor Thomas More Campus Geel.

Maak in PhpStorm een nieuw bestand aan met de naam `knoppen.html` met bijbehorende `stijl.css`.

1. Maak de volledige HTML5-basisstructuur op met als paginatitel `Opleidingen IT Factory`.
2. Plaats een hoofdtitel `<h1>`: `Graduaat Programmeren - Campus Geel`.
3. Voeg een alinea toe met een korte toelichting over de opleiding.
4. Plaats daaronder drie hyperlinks (`<a>`) in een `<nav>`-element:
   - *Brochure downloaden* (klasse `knop knop-primair`)
   - *Lesprogramma bekijken* (klasse `knop knop-secundair`)
   - *Campus bezoeken* (klasse `knop knop-tertiair`)
5. Breng de volgende CSS-stijlen aan:
   - Start met de universele resetter (`* { box-sizing: border-box; margin: 0; padding: 0; }`).
   - Geef de klasse `.knop` het weergavetype `display: inline-block;` met een binnenruimte van `0.7rem 1.4rem`, een schreefloos lettertype, afgeronde hoeken (`border-radius: 6px`) en geen onderlijning (`text-decoration: none`).
   - Geef de primaire knop een oranje achtergrond (`#e87722`) met witte tekst.
   - Geef de secundaire knop een donkerblauwe achtergrond (`#1e2d5a`) met witte tekst.
   - Geef de tertiaire knop een transparante achtergrond met een blauwe rand (`2px solid #1e2d5a`) en blauwe tekst.
   - Voeg voor elke knop een passende `:hover`-toestand toe waarbij de kleur subtiel verdiept.
6. Open de pagina in je browser en controleer dat de knoppen netjes naast elkaar staan en reageren op muisbewegingen.

### Oefening 2: Notificatiebalk met `display: none` versus `visibility: hidden`

In deze oefening onderzoek je proefondervindelijk het visuele verschil tussen beide manieren van verbergen.

Maak een bestand `meldingen.html` aan in PhpStorm.

1. Bouw de HTML5-basisstructuur op met de paginatitel `Campus Mededelingen`.
2. Maak een container met drie mededelingskaarten onder elkaar:
   - Kaart 1: *Welkom op Campus Geel* (groene rand).
   - Kaart 2: *Onderhoud leslokalen op zaterdag* (oranje rand).
   - Kaart 3: *Examenroosters beschikbaar* (blauwe rand).
3. Geef alle kaarten een padding van `1rem`, een marge onderaan van `1rem`, en een lichte achtergrondkleur.
4. Test nu in je stylesheet het verschil:
   - Ken aan Kaart 2 de regel `visibility: hidden;` toe. Bekijk het resultaat in de browser: wat gebeurt er met de positie van Kaart 3?
   - Vervang `visibility: hidden;` op Kaart 2 vervolgens door `display: none;`. Bekijk opnieuw het resultaat: hoe reageert Kaart 3 nu?
5. Noteer voor jezelf in een kort CSS-commentaarblokje waarom `display: none` in vrijwel alle websites de voorkeur geniet om gesloten meldingen op te ruimen.

### Oefening 3: Drie opleidingskaarten naast elkaar

Maak in PhpStorm een bestand aan met de naam `opleidingen-grid.html`.

1. Bouw de HTML5-pagina op met een overkoepelende container van maximaal `60rem` breed die horizontaal gecentreerd is met `margin: 2rem auto;`.
2. Plaats drie `<div>`-elementen met de klasse `.opleiding-kaart` direct na elkaar in de container:
   - Kaart 1: *Graduaat Programmeren* (korte introductie van 2 zinnen).
   - Kaart 2: *Graduaat Systeembeheer* (een langere introductie van 5 zinnen over netwerken, cloud en security).
   - Kaart 3: *Toegepaste Informatica* (een middellange introductie van 3 zinnen).
3. Voeg onderaan elke kaart een actieknop "Meer info" toe (`<a class="knop">`).
4. Pas de volgende CSS toe:
   - Geef `.opleiding-kaart` de eigenschap `display: inline-block;`.
   - Geef elke kaart een vaste breedte van `30%`, een binnenruimte van `1.2rem`, een rand van `1px solid #cbd5e1`, en een achtergrondkleur `#ffffff`.
   - Voeg `vertical-align: top;` toe aan de kaarten.
5. Bekijk het resultaat in Google Chrome. Verwijder tijdelijk de regel `vertical-align: top;` en observeer hoe Kaart 2 door zijn langere inhoud de andere twee kaarten naar beneden duwt. Herstel daarna direct `vertical-align: top;` om te zien hoe de bovenkanten weer strak op één lijn komen.

