---
title: Flexbox
---

# Flexbox

Het positioneren van elementen op een webpagina was vroeger vaak een frustrerende puzzel van floats, inline-blocks en berekende marges. Met de komst van <dfn title="Flexible Box Layout: een ééndimensionaal CSS-layoutmodel voor het verdelen en uitlijnen van elementen in rijen of kolommen">Flexbox</dfn> (Flexible Box Layout) beschikt CSS over een krachtig layoutmodel dat speciaal ontworpen is om elementen flexibel te ordenen, uit te lijnen en overgebleven ruimte gelijkmatig te verdelen. In dit hoofdstuk leer je hoe je met Flexbox moderne navigatiebalken, kaartenroosters en perfect gecentreerde componenten bouwt zonder ingewikkelde hacks.

::: tip Oefenen in de interactieve speeltuin
Flexbox begrijp je het snelst door er visueel mee te experimenteren. Gebruik tijdens het doornemen van dit hoofdstuk ook de interactieve webapp:
[Thomas More Flexbox Playground](https://itf-flexbox-playground.netlify.app/)
Daar kan je alle container- en item-eigenschappen live met schakelaars uittesten.
:::

## Leerdoelen

Na dit hoofdstuk kan je:

- Het fundamentele onderscheid uitleggen tussen een flex-container en flex-items
- De werking van de hoofdas (*main axis*) en de dwarsas (*cross axis*) beschrijven
- Flex-items langs de hoofdas verdelen met `justify-content`
- Flex-items langs de dwarsas uitlijnen met `align-items` en `align-self`
- De richting van de layout omdraaien naar kolommen met `flex-direction`
- Ruimte tussen elementen instellen met de eigenschap `gap`
- Meerregelige lay-outs opbouwen met `flex-wrap`
- De groei en krimp van flex-items regelen met `flex-grow`, `flex-shrink` en `flex-basis` (en de shorthand `flex`)

## Het mentale model: Containers, Items en Assen

Om Flexbox te beheersen, moet je twee basisconcepten goed voor ogen houden:
1. De hiërarchie tussen **ouder** en **directe kinderen**
2. De twee loodrecht op elkaar staande **assen**

### Ouder (Flex Container) vs. Directe kinderen (Flex Items)

Flexbox treedt pas in werking zodra je op een element de declaratie `display: flex` plaatst. Dit element noemen we de <dfn title="Het ouderelement waarop display: flex is geactiveerd">flex-container</dfn>.

Alle **directe kinderen** van deze container worden automatisch <dfn title="De directe onderliggende elementen van een flex-container die meedoen in de flexibele layout">flex-items</dfn>. 

```html
<nav class="navigatie"> <!-- Flex-container -->
  <a href="#home">Home</a> <!-- Flex-item -->
  <a href="#cursus">Cursus</a> <!-- Flex-item -->
  <div> <!-- Flex-item -->
    <span>Contact</span> <!-- GEEN flex-item (kleinkind) -->
  </div>
</nav>
```

::: warning Let op: alleen directe kinderen
Elementen die dieper genest zijn (zoals de `<span>` in het voorbeeld hierboven) zijn kleinkinderen en worden **niet** beïnvloed door de `display: flex` van de buitenste container. Wil je de inhoud van die `<div>` ook flexibel indelen, dan maak je van die `<div>` zelf ook een flex-container door er eveneens `display: flex` aan toe te kennen (geneste flexboxen).
:::

### De Hoofdas (*Main Axis*) en de Dwarsas (*Cross Axis*)

Flexbox is een **ééndimensionaal** layoutmodel: het rangschikt elementen steeds langs één primaire lijn tegelijk.

- **De Hoofdas (*Main Axis*)**: Dit is de richting waarin de flex-items achter elkaar worden geplaatst. Standaard loopt deze horizontaal van links naar rechts.
- **De Dwarsas (*Cross Axis*)**: Dit is de as die loodrecht op de hoofdas staat. Bij de standaardinstelling loopt deze verticaal van boven naar beneden.

Het belangrijkste inzicht van Flexbox is: **de eigenschappen die je gebruikt, zijn gekoppeld aan de assen, niet aan de fysieke richtingen links, rechts, boven of onder!**

- `justify-content` regelt **altijd** de uitlijning langs de **hoofdas**.
- `align-items` regelt **altijd** de uitlijning langs de **dwarsas**.

Wanneer je straks de richting van de hoofdas aanpast naar verticaal (met `flex-direction: column`), draaien de rollen van horizontaal en verticaal dus mee om!

Met de onderstaande interactieve visualizer ontdek je live hoe de assen en de items meedraaien wanneer je een andere `flex-direction` kiest:

<FlexAxisViewer />

## Eigenschappen voor de Flex-container

De meeste flexibele opmaak regelen we via stijlregels op het ouderelement (de container).

### 1. `display: flex`

Zodra je `display: flex` toekent aan een element:
- Worden alle directe kinderen meteen naast elkaar geplaatst in een horizontale rij (in plaats van onder elkaar).
- Nemen de items standaard enkel de breedte van hun eigen inhoud in.
- Worden alle items op de dwarsas standaard even hoog gemaakt als het hoogste item (door `align-items: stretch`).

Er bestaat ook `display: inline-flex`. Het verschil is identiek aan het verschil tussen `block` en `inline-block`: een gewone `flex`-container neemt de volle breedte van de pagina in, terwijl een `inline-flex`-container zich gedraagt als een inline-element en alleen de benodigde breedte opeist.

### 2. De richting bepalen: `flex-direction`

Met `flex-direction` bepaal je wat de hoofdas is en in welke richting de items stromen:

- `row` (standaard): items staan horizontaal van links naar rechts.
- `row-reverse`: items staan horizontaal van rechts naar links.
- `column`: de hoofdas wordt verticaal; items staan onder elkaar van boven naar beneden.
- `column-reverse`: items staan verticaal onder elkaar van beneden naar boven.

::: tip Wat gebeurt er bij `flex-direction: column`?
Bij `flex-direction: column` wordt de hoofdas **verticaal** en de dwarsas **horizontaal**. Dat betekent dat `justify-content` vanaf dat moment de *verticale* verdeling stuurt, en `align-items` de *horizontale* uitlijning!
:::

### 3. Verdelen langs de hoofdas: `justify-content`

Wanneer de items samen minder ruimte innemen dan de container breed is, ontstaat er overgebleven witruimte. Met `justify-content` bepaal je hoe die ruimte langs de **hoofdas** wordt verdeeld:

- `flex-start` (standaard): items staan tegen het begin van de hoofdas aangedrukt.
- `center`: alle items staan gebundeld in het midden van de as.
- `flex-end`: items staan tegen het einde van de as aangedrukt.
- `space-between`: het eerste item staat helemaal vooraan, het laatste helemaal achteraan, en de resterende witruimte wordt gelijkmatig tussen de items verdeeld.
- `space-around`: elk item krijgt links en rechts evenveel witruimte (hierdoor is de ruimte aan de buitenranden half zo breed als de tussenruimte tussen twee items).
- `space-evenly`: de witruimte vóór, tussen en na alle items is exact even groot.

```css
.navigatie {
  display: flex;
  justify-content: space-between;
}
```

### 4. Tussenruimte instellen: `gap`

Vroeger moesten webontwikkelaars marges instellen op elk kind-element en dan met `:last-child` of negatieve marges corrigeren om geen overbodige witruimte aan de buitenkanten te krijgen. In moderne CSS gebruiken we daarvoor simpelweg de eigenschap `gap`:

- `gap: 1rem;`: stelt zowel horizontaal als verticaal een tussenruimte in van `1rem`.
- `row-gap: 1.5rem;`: tussenruimte tussen verschillende rijen.
- `column-gap: 1rem;`: tussenruimte tussen kolommen.

`gap` plaatst de ruimte **uitsluitend tussen** de items, nooit aan de buitenranden van de container.

### 5. Uitlijnen langs de dwarsas: `align-items`

Met `align-items` bepaal je hoe de items ten opzichte van elkaar worden uitgelijnd op de **dwarsas** (loodrecht op de hoofdas):

- `stretch` (standaard): items worden opgerekt zodat ze over de volledige hoogte van de container lopen (of breedte bij kolommen).
- `center`: items worden netjes gecentreerd op de dwarsas.
- `flex-start`: items lijnen uit tegen het begin van de dwarsas (bijvoorbeeld bovenaan).
- `flex-end`: items lijnen uit tegen het einde van de dwarsas (bijvoorbeeld onderaan).
- `baseline`: items worden uitgelijnd op de basislijn van hun tekstregels, handig wanneer items verschillende lettergroottes hebben.

In het onderstaande interactieve lab kan je alle waarden van `justify-content`, `align-items` en `gap` rechtstreeks combineren en live inspecteren:

<FlexAlignmentLab />

### Praktijkvoorbeeld 1: Navigatiebalk en perfect centreren

In het onderstaande voorbeeld zie je twee klassieke toepassingen:
1. Een navigatiebalk met een logo links en menuknoppen rechts dankzij `justify-content: space-between`.
2. Een banner waarin tekst zowel horizontaal als verticaal exact in het midden staat dankzij `justify-content: center` en `align-items: center`.

```html
<header class="site-header">
  <div class="logo">Thomas More</div>
  <nav class="hoofdmenu">
    <a href="#opleiding">Opleiding</a>
    <a href="#campussen">Campussen</a>
    <a href="#contact">Contact</a>
  </nav>
</header>
```

```css
.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.banner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}
```

<CodeSandbox
  title="Klassieke navigatiebalk en perfect centreren"
  height="460px"
  initialTab="split"
  activeCodeTab="css"
  highlightHtml="11,13,21"
  highlightCss="24-26,40-41,52-54"
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flexbox Basis</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <!-- Navigatiebalk met space-between -->
  <header class="hoofdbalk">
    <div class="merk">IT Factory Geel</div>
    <nav class="nav-links">
      <a href="#nieuws">Nieuws</a>
      <a href="#projecten">Projecten</a>
      <a href="#opleiding">Opleiding</a>
    </nav>
  </header>

  <!-- Banner met perfecte horizontale en verticale centrering -->
  <section class="held-sectie">
    <div class="gecentreerde-kaart">
      <h1>Welkom bij Web Essentials</h1>
      <p>Perfect gecentreerd in twee regels CSS.</p>
    </div>
  </section>
</body>
</html>'
  css='/* Universele resetter */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --oranje: #e87722;
  --donker: #1f2937;
  --licht: #f3f4f6;
  --wit: #ffffff;
}

body {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  color: var(--donker);
  background-color: var(--licht);
  padding: 1.5rem;
}

/* Navigatiebalk met flexbox */
.hoofdbalk {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--wit);
  padding: 1rem 1.5rem;
  border-radius: 6px;
  border-bottom: 3px solid var(--oranje);
}

.merk {
  font-weight: bold;
  font-size: 1.2rem;
  color: var(--oranje);
}

.nav-links {
  display: flex;
  gap: 1.25rem;
}

.nav-links a {
  text-decoration: none;
  color: var(--donker);
  font-weight: 500;
}

/* Gecentreerde held-sectie */
.held-sectie {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 240px;
  background-color: var(--wit);
  margin-top: 1.5rem;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.gecentreerde-kaart {
  text-align: center;
  padding: 1rem;
}

.gecentreerde-kaart h1 {
  font-size: 1.5rem;
  color: var(--donker);
  margin-bottom: 0.5rem;
}

.gecentreerde-kaart p {
  color: #6b7280;
  font-size: 1rem;
}'
  js=''
/>

### 6. Meerregelige rijen: `flex-wrap`

Standaard probeert een flex-container alle items koste wat het kost op één enkele regel te proppen (`flex-wrap: nowrap`). Als er onvoldoende ruimte is, krimpen de items in of steken ze zelfs buiten de container.

Met de eigenschap `flex-wrap` geef je items toestemming om naar een volgende regel over te stappen zodra de regel vol is:

- `nowrap` (standaard): alles blijft op één regel staan.
- `wrap`: items die niet meer passen, springen automatisch naar een nieuwe regel eronder.
- `wrap-reverse`: overtollige items springen naar een nieuwe regel erboven.

In combinatie met `gap` en een basisbreedte op de items is `flex-wrap: wrap` ideaal om zonder complexe berekeningen een flexibel kaartenraster te creëren.

### 7. Meerdere rijen uitlijnen: `align-content`

Wanneer `flex-wrap: wrap` actief is en er **meerdere regels** ontstaan, ontstaat er mogelijk overgebleven ruimte langs de dwarsas tussen die regels onderling. Met `align-content` bepaal je hoe die rijen verdeeld worden:

- `stretch` (standaard): de rijen verdelen zich gelijkmatig en rekken uit om de hoogte op te vullen.
- `flex-start`: alle rijen staan bovenaan tegen elkaar aangedrukt.
- `flex-end`: alle rijen staan onderaan tegen elkaar aangedrukt.
- `center`: alle rijen staan gegroepeerd in het midden van de container.
- `space-between`: de eerste rij kleeft aan de bovenkant, de laatste aan de onderkant, en de witruimte zit ertussen.
- `space-around`: gelijkmatige ruimte rondom elke rij.

::: warning `align-items` vs. `align-content`
Verwar deze twee niet met elkaar:
- `align-items` bepaalt hoe de items **binnen hun eigen regel** uitgelijnd worden op de dwarsas.
- `align-content` heeft alleen effect als er **meerdere regels** zijn (`flex-wrap: wrap`) en bepaalt hoe die *rijen als geheel* verdeeld worden over de container.
:::

## Eigenschappen voor de Flex-items

Naast container-eigenschappen biedt Flexbox krachtige eigenschappen die je rechtstreeks op individuele kinderen (de flex-items) plaatst om hun gedrag specifiek aan te sturen.

### 1. Meegroeien: `flex-grow`

Met `flex-grow` geef je aan hoeveel van de eventueel resterende witruimte een item mag opeisen:

- De standaardwaarde is `0` (een item groeit niet mee; het behoudt zijn oorspronkelijke afmeting).
- Geef je een item `flex-grow: 1`, dan pakt het alle beschikbare vrije ruimte in de container.
- Geef je item A `flex-grow: 1` en item B `flex-grow: 2`, dan krijgt item B tweemaal zoveel van de *overgebleven witruimte* toebedeeld als item A.

### 2. Inkrimpen bij ruimtegebrek: `flex-shrink`

Wat gebeurt er als de container te smal wordt voor alle items tezamen? Met `flex-shrink` bepaal je welke items als eerste mogen krimpen:

- De standaardwaarde is `1` (alle items krimpen gelijkmatig mee om overflow te voorkomen).
- Stel je `flex-shrink: 0` in, dan weigert dat specifieke item te krimpen, ongeacht hoe smal het venster wordt (handig voor bijvoorbeeld een logo of een vaste avatar-afbeelding die nooit vervormd mag raken).

### 3. De basisgrootte: `flex-basis`

`flex-basis` definieert de ideale begin-afmeting van een item langs de hoofdas vóórdat eventuele vrije ruimte wordt verdeeld (`flex-grow`) of krimp optreedt (`flex-shrink`).

- De standaardwaarde is `auto` (het item kijkt naar zijn eigen content of naar een expliciete `width` of `height`).
- Je kan hier elke geldige lengte-eenheid opgeven, zoals `250px`, `20rem` of `30%`.

### 4. De shorthand `flex`

In professionele CSS schrijf je zelden `flex-grow`, `flex-shrink` en `flex-basis` apart uit. In plaats daarvan gebruik je de handige shorthand `flex`:

```css
.item {
  /* flex: <flex-grow> <flex-shrink> <flex-basis> */
  flex: 1 1 200px;
}
```

De meest voorkomende waarden in de praktijk:
- `flex: 1;` (kort voor `1 1 0%`): alle items worden exact even breed en vullen samen de hele breedte van de container.
- `flex: auto;` (kort voor `1 1 auto`): items groeien en krimpen mee op basis van de omvang van hun inhoud.
- `flex: 0 0 150px;`: het item houdt een vaste breedte van 150 pixels: het groeit niet mee en krimpt nooit in.

Met de onderstaande interactieve visualizer ontdek je hoe items zich gedragen wanneer je de breedte van de container dynamisch verandert:

<FlexGrowShrinkVisualizer />

### 5. Individuele afwijking: `align-self`

Met `align-self` kan een afzonderlijk flex-item de algemene `align-items` van de container overschrijven voor zichzelf:

- Mogelijke waarden: `auto` (volgt de container), `flex-start`, `flex-end`, `center`, `baseline`, `stretch`.

### 6. Volgorde aanpassen: `order`

Standaard worden elementen weergegeven in de volgorde waarin ze in de HTML-code staan (`order: 0`). Met `order: 1` of `order: -1` kan je een item visueel naar voren of naar achteren verplaatsen zonder de broncode van je HTML aan te passen.

::: warning Toegankelijkheid bij `order`
Gebruik `order` met mate. Het verandert alleen de visuele presentatie op het scherm, maar niet de navigatievolgorde voor schermlezers of studenten die met de `Tab`-toets navigeren. Als de visuele volgorde afwijkt van de DOM-structuur, kan dit verwarrend zijn voor bezoekers met een functiebeperking.
:::

### Praktijkvoorbeeld 2: Responsief kaartenrooster met `flex-wrap` en `gap`

In dit voorbeeld zie je hoe een groep infokaarten automatisch netjes naar een tweede rij springt zodra er te weinig ruimte is. Dankzij `flex: 1 1 220px` zijn de kaarten flexibel: ze nemen minstens 220 pixels in, maar delen de resterende ruimte op elke rij netjes onder elkaar.

```css
.kaarten-groep {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.kaart {
  flex: 1 1 220px;
}
```

<CodeSandbox
  title="Responsief kaartenrooster met flex-wrap en gap"
  height="480px"
  initialTab="split"
  activeCodeTab="css"
  highlightHtml="11-12,16,20,24"
  highlightCss="29-31,36"
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responsieve kaarten</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <h2>Opleidingsmodules</h2>
  <div class="kaarten-overzicht">
    <article class="module-kaart">
      <h3>Web Essentials</h3>
      <p>Leer semantische HTML5 en moderne CSS3-layouts bouwen van nul af aan.</p>
    </article>
    <article class="module-kaart">
      <h3>Programming 1</h3>
      <p>Bouw sterke basiskennis op in logica, datastructuren en algoritmes.</p>
    </article>
    <article class="module-kaart">
      <h3>Database Basics</h3>
      <p>Ontwerp relationele databanken en leer gegevens opvragen met SQL.</p>
    </article>
    <article class="module-kaart">
      <h3>IT Organisaties</h3>
      <p>Begrijp hoe IT-afdelingen functioneren binnen moderne ondernemingen.</p>
    </article>
  </div>
</body>
</html>'
  css='/* Universele resetter */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --oranje: #e87722;
  --blauw: #005691;
  --grijs-licht: #f8fafc;
  --tekst: #334155;
}

body {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  color: var(--tekst);
  background-color: var(--grijs-licht);
  padding: 1.5rem;
}

h2 {
  color: var(--blauw);
  margin-bottom: 1.25rem;
}

/* Flexbox container met wrap en gap */
.kaarten-overzicht {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
}

/* Flex items met flex-basis en groei */
.module-kaart {
  flex: 1 1 220px;
  background-color: #ffffff;
  padding: 1.25rem;
  border-radius: 8px;
  border-top: 4px solid var(--oranje);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.module-kaart h3 {
  color: var(--tekst);
  font-size: 1.15rem;
  margin-bottom: 0.5rem;
}

.module-kaart p {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #64748b;
}'
  js=''
/>

### Praktijkvoorbeeld 3: Flexibele contentverdeling met `flex-grow` en `align-self`

In dit voorbeeld bouwen we een herkenbare layout met een hoofdinhoud en een zijbalk. De hoofdinhoud krijgt `flex: 2` (groeit twee keer zo snel), terwijl de zijbalk `flex: 1` krijgt. Bovendien gebruikt de knop in de zijbalk `align-self: flex-start` zodat hij niet ongewenst uitgerekt wordt over de volle breedte.

```html
<main class="hoofd-layout">
  <article class="artikel-deel">
    <h2>Belang van Semantiek</h2>
    <p>Semantische elementen geven structuur en betekenis aan je code.</p>
  </article>
  <aside class="zijbalk">
    <h3>Snelle links</h3>
    <button class="actie-knop">Meer info</button>
  </aside>
</main>
```

```css
.hoofd-layout {
  display: flex;
  gap: 1.5rem;
}

.artikel-deel {
  flex: 2 1 300px;
}

.zijbalk {
  flex: 1 1 180px;
  display: flex;
  flex-direction: column;
}

.actie-knop {
  align-self: flex-start;
}
```

<CodeSandbox
  title="Contentverdeling en align-self"
  height="450px"
  initialTab="split"
  activeCodeTab="css"
  highlightHtml="10-11,17,21"
  highlightCss="24-25,30,49-52,70"
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Flexibel Dashboard</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <div class="layout-container">
    <article class="hoofd-artikel">
      <h2>Campus Geel Lab Informatie</h2>
      <p>In de computerlokalen van Thomas More Campus Geel beschikken studenten over krachtige werkstations met dual-monitors en snelle netwerkverbindingen.</p>
      <p>Web Essentials lessen vinden plaats in een hybride werkvorm met theorie en directe praktijkoefeningen in de browser.</p>
    </article>

    <aside class="zijpaneel">
      <h3>Praktische Info</h3>
      <p>Lokaal: 2440 Geel</p>
      <p>Begeleiding: Patrick Verhaert</p>
      <a href="#rooster" class="rooster-knop">Bekijk lesrooster</a>
    </aside>
  </div>
</body>
</html>'
  css='/* Universele resetter */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --oranje: #e87722;
  --donker: #1e293b;
  --licht: #f1f5f9;
  --wit: #ffffff;
}

body {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  color: var(--donker);
  background-color: var(--licht);
  padding: 1.5rem;
}

/* Flex container voor twee kolommen */
.layout-container {
  display: flex;
  gap: 1.5rem;
}

/* Hoofdgedeelte eist 2 aandelen van de vrije ruimte op */
.hoofd-artikel {
  flex: 2 1 280px;
  background-color: var(--wit);
  padding: 1.5rem;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
}

.hoofd-artikel h2 {
  color: var(--oranje);
  margin-bottom: 0.75rem;
}

.hoofd-artikel p {
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

/* Zijpaneel eist 1 aandeel op en is zelf een verticale flexbox */
.zijpaneel {
  flex: 1 1 180px;
  gap: 0.75rem;
  display: flex;
  flex-direction: column;
  background-color: #e2e8f0;
  padding: 1.5rem;
  border-radius: 6px;
}

.zijpaneel h3 {
  font-size: 1.1rem;
  border-bottom: 2px solid #94a3b8;
  padding-bottom: 0.25rem;
}

.zijpaneel p {
  font-size: 0.95rem;
}

/* Knop met afwijkende align-self om niet over de volle breedte op te rekken */
.rooster-knop {
  align-self: flex-start;
  margin-top: auto;
  background-color: var(--oranje);
  color: var(--wit);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: bold;
}'
  js=''
/>

<PageSummary>

### Syntaxis in een oogopslag

| Wat | Hoe | Voorbeeld |
|---|---|---|
| Flexbox activeren | `display: flex;` | `.container { display: flex; }` |
| Richting hoofdas | `flex-direction: row \| column;` | `.container { flex-direction: column; }` |
| Uitlijnen op hoofdas | `justify-content: flex-start \| center \| space-between;` | `.nav { justify-content: space-between; }` |
| Uitlijnen op dwarsas | `align-items: stretch \| center \| flex-start;` | `.rij { align-items: center; }` |
| Tussenruimte | `gap: <lengte>;` | `.groep { gap: 1.5rem; }` |
| Meerregelig maken | `flex-wrap: wrap \| nowrap;` | `.rooster { flex-wrap: wrap; }` |
| Groei & krimp shorthand | `flex: <grow> <shrink> <basis>;` | `.kaart { flex: 1 1 200px; }` |
| Individuele uitlijning | `align-self: center \| flex-start;` | `.knop { align-self: flex-end; }` |

### Regels en afspraken

- **Activeer op de ouder:** `display: flex` plaats je altijd op het ouderelement, nooit op de items zelf.
- **Enkel directe kinderen:** Flexbox werkt automatisch enkel op de directe kinderen; dieper geneste elementen (kleinkinderen) doen niet mee tenzij je ze zelf ook `display: flex` geeft.
- **Hoofdas vs. Dwarsas:** `justify-content` werkt altijd op de hoofdas; `align-items` werkt altijd op de dwarsas.
- **Gebruik `gap` voor marges:** Gebruik de moderne eigenschap `gap` in plaats van handmatige marges op items.
- **Gebruik de `flex`-shorthand:** Schrijf bij voorkeur `flex: 1` of `flex: 1 1 200px` in plaats van losse `flex-grow` en `flex-shrink` declaraties.

### Veelgemaakte fouten

- Vergeten dat `justify-content` meedraait bij `flex-direction: column`: bij een kolom stuurt `justify-content` de verticale positie en niet de horizontale.
- Flex-eigenschappen (zoals `justify-content`) toekennen aan een element waarvan de ouder geen `display: flex` heeft.
- Vergeten `flex-wrap: wrap` in te stellen bij een meerkoloms kaartenraster, waardoor elementen op één regel geplet worden of buiten het venster lopen.
- `align-items` verwarren met `align-content`: `align-items` werkt op individuele items binnen elke regel, terwijl `align-content` de rijen als geheel verdeelt wanneer er meerdere regels zijn.

### Tips voor beginners

- Open de browser DevTools (`F12`): wanneer je een element met `display: flex` inspecteert, toont de browser een paars `flex`-labeltje en een interactieve stijlhulp waarmee je live eigenschappen kan aanklikken.
- Experimenteer uitgebreid in de [Thomas More Flexbox Playground](https://itf-flexbox-playground.netlify.app/) om direct visueel aan te voelen hoe de verschillende waarden met elkaar interageren.
- Onthoud de magische formule voor perfect horizontaal en verticaal centreren: `display: flex; justify-content: center; align-items: center;`.

</PageSummary>

## Oefeningen

### Oefening 1: Een Thomas More headerbalk bouwen (Basis)

Bouw een moderne websiteheader voor Thomas More Campus Geel met een flex-container:
1. Maak een `<header>` met daarin een logo-blok aan de linkerkant en een `<nav>` met vier hyperlinks aan de rechterkant.
2. Maak van de `<header>` een flex-container en zorg dat het logo uiterst links en de navigatie uiterst rechts staat met `justify-content: space-between`.
3. Lijn beide onderdelen verticaal netjes in het midden uit met `align-items: center`.
4. Maak van de `<nav>` zelf ook een flexbox met een tussenruimte van `1.5rem` tussen de menu-links via de eigenschap `gap`.

### Oefening 2: Een responsief teamoverzicht met `flex-wrap` (Gemiddeld)

Bouw een responsief docentenoverzicht voor de afdeling IT Factory:
1. Maak een container `<div class="team-raster">` met daarin minstens 4 `<article class="docent-kaart">`-elementen. Elk kaartje bevat een naam, een vakgebied en een korte beschrijving.
2. Schakel `display: flex` en `flex-wrap: wrap` in op de container met een `gap: 1.25rem`.
3. Geef elk docentenkaartje de stijlregel `flex: 1 1 240px;` zodat de kaarten meegroeien op een breed scherm, maar automatisch naar twee of meerdere rijen springen zodra het scherm smaller wordt.
4. Controleer in de browser DevTools of alle kaarten op dezelfde rij automatisch even hoog worden door de standaardwaarde van `align-items: stretch`.

### Oefening 3: Productkaart met onderaan vastgepinde actieknop (Verdieping)

Een veelvoorkomend probleem bij kaarten met verschillende hoeveelheden tekst is dat de actieknoppen onderaan niet op dezelfde hoogte staan:
1. Bouw drie productkaarten naast elkaar in een flex-rij met `gap: 1.5rem`.
2. Maak van elke productkaart zélf ook een flex-container met `flex-direction: column`.
3. Plaats in elke kaart een titel, een alinea tekst (geef één kaart een hele korte en een andere een hele lange alinea), en een bestelknop (`<a class="bestel-knop">`).
4. Gebruik op de bestelknop de stijlregel `margin-top: auto;` (of test `align-self: flex-start` in combinatie met `flex-grow` op de tekstalinea). Merk op hoe Flexbox met `margin-top: auto` in een verticale container de knop automatisch strak tegen de onderkant van de kaart plakt, ongeacht de hoeveelheid tekst erboven!
