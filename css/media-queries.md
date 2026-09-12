---
title: Media Queries
---

# Media Queries

Vroeger ontwierpen webdesigners websites voor één vast computerscherm. Wie dezelfde pagina bezocht op een smartphone, moest voortdurend inzoomen en horizontaal schuiven om tekst te kunnen lezen. Met de opkomst van mobiele telefoons, tablets, laptops en ultrabrede monitoren werd die aanpak onhoudbaar. <dfn title="Een webdesignmethode waarbij de layout en opmaak van een website zich automatisch aanpassen aan de schermgrootte en resolutie van het apparaat">Responsief webdesign</dfn> zorgt ervoor dat één enkele website er optimaal uitziet en prettig werkt op elk type beeldscherm. In dit hoofdstuk ontdek je hoe je met <dfn title="Een CSS-techniek waarmee je stijlregels enkel activeert wanneer het beeldscherm of apparaat aan bepaalde voorwaarden voldoet">media queries</dfn> specifieke stijlregels toepast op basis van de beschikbare schermruimte, en hoe je één overzichtelijk CSS-bestand opbouwt volgens het moderne mobile-first principe.

## Leerdoelen

Na dit hoofdstuk kan je:

- Uitleggen wat responsief webdesign inhoudt en waarom de viewport-metatag onmisbaar is
- Het onderscheid en de voordelen van de mobile-first benadering (`min-width`) tegenover desktop-first (`max-width`) toelichten
- Media queries opstellen met de `@media`-regel en logische breekpunten (*breakpoints*)
- Een stylesheet structureren met één centraal CSS-bestand voor mobiel, tablet en laptop
- Praktische layoutwijzigingen doorvoeren zoals het omschakelen van flexbox-richtingen bij breekpunten
- Een afdrukstijl definiëren via `@media print` om pagina's netjes en inktbesparend af te drukken

## De basis: de viewport-metatag

Vooraleer media queries betrouwbaar kunnen werken op mobiele apparaten, moet de browser weten hoe hij de afmetingen van het scherm moet interpreteren. Zonder duidelijke instructie simuleren mobiele browsers een breed computerscherm (vaak 980 pixels) en zoomen ze de pagina vervolgens piepklein uit om alles in het schermpje te proppen.

Daarom bevat elk volwaardig HTML5-document in het `<head>`-gedeelte altijd de <dfn title="Een HTML-metatag die de afmetingen en schaling van het zichtbare schermgebied instelt voor mobiele browsers">viewport-metatag</dfn>:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

Deze regel geeft de browser twee cruciale opdrachten:
1. `width=device-width`: stel de breedte van de viewport gelijk aan de fysieke breedte van het toestel in CSS-pixels.
2. `initial-scale=1.0`: start op een zoomniveau van 100% zonder kunstmatige verkleining.

Zodra deze tag aanwezig is, berekent de browser de werkelijke schermbreedte correct en kunnen je CSS-mediaqueries direct in actie schieten.

## De syntaxis van een Media Query

Een media query in CSS begint altijd met de sleutelterm `@media`. Tussen ronde haakjes plaats je vervolgens een voorwaarde (de *media feature*), gevolgd door een blok met CSS-regels tussen accolades:

```css
@media (min-width: 768px) {
  /* Deze stijlregels worden enkel toegepast */
  /* zodra het venster minstens 768 pixels breed is */
  body {
    background-color: #f8f9fa;
  }
}
```

De drempelwaarde waarbij een media query actief wordt (in dit voorbeeld `768px`), noemen we een <dfn title="De schermbreedte waarop een media query in werking treedt en de layout van de pagina verandert">breekpunt</dfn> (*breakpoint*).

Zolang het browservenster smaller is dan 768 pixels, negeert de browser de inhoud van dit blok volledig. Zodra de gebruiker het venster vergroot tot 768 pixels of meer, worden de stijlregels binnen het blok geëvalueerd en toegevoegd aan de stijlen van de pagina.

## Mobile-First: De industriestandaard

Er zijn twee manieren om over verschillende schermformaten na te denken: **mobile-first** en **desktop-first**.

### Wat is Mobile-First?

Bij <dfn title="Een ontwerpaanpak waarbij de basisopmaak voor smalle mobiele schermen eerst wordt geschreven, waarna stapsgewijs stijlen voor bredere schermen worden toegevoegd met min-width">mobile-first</dfn> ontwerp en schrijf je de CSS-stijlen in deze volgorde:
1. **Bovenaan je CSS-bestand:** alle stijlen voor de smalste schermen (smartphones). Deze regels staan gewoon los in het bestand, zonder enige media query.
2. **Daaronder:** een media query met `min-width` voor tablets. Hierin voeg je enkel de aanpassingen en extra kolommen toe die vanaf die breedte nodig zijn.
3. **Nog lager:** een media query met `min-width` voor laptops en desktops met verdere verfijningen.

```css
/* 1. Mobiele basisstijl (geldt voor elk scherm) */
.kolom {
  width: 100%;
}
/* 2. Tablet en breder */
@media (min-width: 768px) {
  .kolom {
    width: 50%;
  }
}
/* 3. Laptop en breder */
@media (min-width: 992px) {
  .kolom {
    width: 33.333%;
  }
}
```

### Waarom wordt Desktop-First afgeraden?

Bij een desktop-first benadering begin je omgekeerd: je ontwerpt eerst de complexe, meerlagige desktopweergave en gebruikt vervolgens `@media (max-width: ...)` om zaken terug te verkleinen of te verbergen op mobiel.

Hoewel `max-width` technisch bestaat en werkt, raden professionele webontwikkelaars desktop-first sterk af om duidelijke redenen:
- **Veel meer overschrijvingen:** je moet eigenschappen die je voor desktop instelde (zoals vaste breedtes, marges of zwevende kolommen) op mobiel weer moeizaam ongedaan maken (`width: auto`, `margin: 0`).
- **Prestaties:** mobiele apparaten hebben vaak een tragere internetverbinding. Bij mobile-first laadt een smartphone direct de lichtste basisopmaak zonder overbodige stijlen te moeten terugdraaien.
- **Logische opbouw:** het is mentaal veel overzichtelijker om van eenvoudig (één kolom) naar complex (meerdere kolommen) te groeien dan omgekeerd.

::: tip Samengevat
Gebruik in je stylesheets altijd `min-width`. Daarmee vertrek je vanaf de mobiele basis en bouw je stapsgewijs op naarmate er meer schermruimte beschikbaar komt.
:::

## Live demonstratie van breekpunten

In het onderstaande interactieve voorbeeld zie je hoe de achtergrondkleur en de informatieve tekst automatisch verspringen naarmate de beschikbare breedte toeneemt. Versleep de scheidingsbalk in de sandbox om het venster breder of smaller te maken:

```html
<div class="status-kaart">
  <h1>Schermformaat testen</h1>
  <p class="toelichting">Versleep het venster om de breekpunten te zien schakelen.</p>
  <div class="badge">Huidige weergave</div>
</div>
```

```css
/* Universele resetter */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
/* 1. Mobiele basisstijl (smartphone) */
body {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  color: #212529;
  background-color: #fff3cd;
  padding: 1.5rem;
}
.status-kaart {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  border: 2px solid #ffeeba;
}
.badge {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: #856404;
  color: #ffffff;
  font-weight: bold;
}
.badge::after {
  content: " Mobiel (< 768px)";
}
/* 2. Tablet breekpunt */
@media (min-width: 768px) {
  body {
    background-color: #d4edda;
  }
  .status-kaart {
    border-color: #c3e6cb;
  }
  .badge {
    background-color: #155724;
  }
  .badge::after {
    content: " Tablet (>= 768px)";
  }
}
/* 3. Laptop breekpunt */
@media (min-width: 992px) {
  body {
    background-color: #cce5ff;
  }
  .status-kaart {
    border-color: #b8daff;
  }
  .badge {
    background-color: #004085;
  }
  .badge::after {
    content: " Laptop / Desktop (>= 992px)";
  }
}
```

<CodeSandbox
  title="Breekpunten demonstratie met achtergrondkleur"
  height="420px"
  initialTab="split"
  activeCodeTab="css"
  highlightHtml=""
  highlightCss="32-34,36,51"
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Breekpunten Demonstratie</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <div class="status-kaart">
    <h1>Schermformaat testen</h1>
    <p class="toelichting">Versleep de scheidingsbalk om de breekpunten te zien schakelen.</p>
    <div class="badge">Actief breekpunt:</div>
  </div>
</body>
</html>'
  css='/* Universele resetter */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
/* 1. Mobiele basisstijl (smartphone) */
body {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  color: #212529;
  background-color: #fff3cd;
  padding: 1.5rem;
}
.status-kaart {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  border: 2px solid #ffeeba;
}
.toelichting {
  margin-top: 0.5rem;
}
.badge {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: #856404;
  color: #ffffff;
  font-weight: bold;
}
.badge::after {
  content: " Mobiel (< 768px)";
}
/* 2. Tablet breekpunt */
@media (min-width: 768px) {
  body {
    background-color: #d4edda;
  }
  .status-kaart {
    border-color: #c3e6cb;
  }
  .badge {
    background-color: #155724;
  }
  .badge::after {
    content: " Tablet (>= 768px)";
  }
}
/* 3. Laptop breekpunt */
@media (min-width: 992px) {
  body {
    background-color: #cce5ff;
  }
  .status-kaart {
    border-color: #b8daff;
  }
  .badge {
    background-color: #004085;
  }
  .badge::after {
    content: " Laptop / Desktop (>= 992px)";
  }
}'
  js=''
/>

## Eén CSS-bestand structureren: breekpunten in de praktijk

In plaats van verschillende CSS-bestanden te koppelen in je HTML, bundelen we alle stijlen en media queries overzichtelijk in **één enkel CSS-bestand**. Dit vermindert het aantal netwerkverzoeken en houdt alle gerelateerde stijlen netjes gecentraliseerd.

### Gangbare breekpunten

Schermen bestaan in duizenden verschillende formaten. Probeer daarom nooit voor elk individueel smartphonemerk een apart breekpunt te maken. We kiezen enkele strategische richtwaarden die overeenkomen met veelgebruikte apparaatcategorieën:

| Breekpunt | Apparaatcategorie | Typisch gedrag |
|---|---|---|
| *(geen query)* | Smartphone (< 768px) | Alles onder elkaar in 1 kolom, schermvullende knoppen |
| `min-width: 768px` | Tablet (iPad, tablets staand) | 2 kolommen, compacte horizontale navigatie |
| `min-width: 992px` | Laptop / Desktop | 3 of 4 kolommen, ruime navigatiebalk |
| `min-width: 1200px` | Grote desktopmonitoren | Maximale breedte begrenzen met `max-width` en centreren |

### De vaste sjabloonstructuur van je stylesheet

Houd in elk project steeds deze logische volgorde aan in je CSS-bestand:

```css
/* ==========================================================================
   1. UNIVERSELE RESET & BASISVORMGEVING
   ========================================================================== */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  color: #212529;
  line-height: 1.6;
}

/* ==========================================================================
   2. MOBIELE STIJLEN (STANDAARD: SMARTPHONE)
   ========================================================================== */
.container {
  width: 100%;
  padding: 1rem;
}

.navigatie {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rooster {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ==========================================================================
   3. TABLET (MIN-WIDTH: 768PX)
   ========================================================================== */
@media (min-width: 768px) {
  .navigatie {
    flex-direction: row;
  }

  .rooster {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .kaart {
    flex: 0 0 calc(50% - 0.5rem);
  }
}

/* ==========================================================================
   4. LAPTOP / DESKTOP (MIN-WIDTH: 992PX)
   ========================================================================== */
@media (min-width: 992px) {
  .container {
    max-width: 1140px;
    margin: 0 auto;
  }

  .kaart {
    flex: 0 0 calc(33.333% - 0.667rem);
  }
}

/* ==========================================================================
   5. PRINTSTIJLEN (VOOR AFDRUKKEN OP PAPIER)
   ========================================================================== */
@media print {
  /* Stijlen specifiek voor de printer */
}
```

## Praktisch voorbeeld: Responsieve navigatie en kaartenrooster

Het krachtigste samenspel van media queries ontstaat in combinatie met **Flexbox**:
- Op een **smartphone** staat de navigatie verticaal onder elkaar (`flex-direction: column`) en vult elke kaart de volle breedte.
- Vanaf **tabletformaat (`768px`)** schakelt de navigatie om naar een horizontale balk (`flex-direction: row`) en komen de kaarten paarsgewijs naast elkaar te staan.
- Vanaf **laptopformaat (`992px`)** vormen de kaarten een strak rooster van drie kolommen en wordt de breedte van de hoofdcontainer netjes gecentreerd.

```html
<div class="hoofd-container">
  <header class="kop">
    <div class="logo">IT Factory</div>
    <nav class="hoofd-nav">
      <a href="#home">Home</a>
      <a href="#opleidingen">Opleidingen</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>
  <main class="kaarten-rooster">
    <article class="kaart">
      <h2>Web Essentials</h2>
      <p>Leer HTML5 en CSS3 vanaf de basis.</p>
    </article>
    <article class="kaart">
      <h2>Programmeren</h2>
      <p>Ontwikkel logisch inzicht en algoritmes.</p>
    </article>
    <article class="kaart">
      <h2>Databases</h2>
      <p>Ontwerp en beheer relationele datastructuren.</p>
    </article>
  </main>
</div>
```

```css
/* Universele resetter */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
/* Basisstijlen mobiel */
body {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  color: #212529;
  background-color: #f4f6f8;
  padding: 1rem;
}
.hoofd-container {
  width: 100%;
}
.kop {
  background-color: #1e2d5a;
  color: #ffffff;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
}
.logo {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
}
.hoofd-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.hoofd-nav a {
  color: #ffffff;
  text-decoration: none;
  background-color: #2a3d75;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
}
.kaarten-rooster {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.kaart {
  background-color: #ffffff;
  border: 1px solid #dcdfe3;
  border-radius: 6px;
  padding: 1.25rem;
}
.kaart h2 {
  color: #ec6639;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}
/* Tablet breekpunt (>= 768px) */
@media (min-width: 768px) {
  .kop {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .logo {
    margin-bottom: 0;
  }
  .hoofd-nav {
    flex-direction: row;
  }
  .kaarten-rooster {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .kaart {
    flex: 0 0 calc(50% - 0.5rem);
  }
}
/* Laptop breekpunt (>= 992px) */
@media (min-width: 992px) {
  .hoofd-container {
    max-width: 1000px;
    margin: 0 auto;
  }
  .kaart {
    flex: 0 0 calc(33.333% - 0.667rem);
  }
}
```

<CodeSandbox
  title="Responsieve layout met navigatie en kaartenrooster"
  height="500px"
  initialTab="split"
  activeCodeTab="css"
  highlightHtml=""
  highlightCss="50-70,72-81"
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responsieve Layout</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <div class="hoofd-container">
    <header class="kop">
      <div class="logo">IT Factory</div>
      <nav class="hoofd-nav">
        <a href="#home">Home</a>
        <a href="#opleidingen">Opleidingen</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
    <main class="kaarten-rooster">
      <article class="kaart">
        <h2>Web Essentials</h2>
        <p>Leer HTML5 en CSS3 vanaf de basis.</p>
      </article>
      <article class="kaart">
        <h2>Programmeren</h2>
        <p>Ontwikkel logisch inzicht en algoritmes.</p>
      </article>
      <article class="kaart">
        <h2>Databases</h2>
        <p>Ontwerp en beheer relationele datastructuren.</p>
      </article>
    </main>
  </div>
</body>
</html>'
  css='/* Universele resetter */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
/* Basisstijlen mobiel */
body {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  color: #212529;
  background-color: #f4f6f8;
  padding: 1rem;
}
.hoofd-container {
  width: 100%;
}
.kop {
  background-color: #1e2d5a;
  color: #ffffff;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
}
.logo {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 0.75rem;
}
.hoofd-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.hoofd-nav a {
  color: #ffffff;
  text-decoration: none;
  background-color: #2a3d75;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
}
.kaarten-rooster {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.kaart {
  background-color: #ffffff;
  border: 1px solid #dcdfe3;
  border-radius: 6px;
  padding: 1.25rem;
}
.kaart h2 {
  color: #ec6639;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}
/* Tablet breekpunt (>= 768px) */
@media (min-width: 768px) {
  .kop {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .logo {
    margin-bottom: 0;
  }
  .hoofd-nav {
    flex-direction: row;
  }
  .kaarten-rooster {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .kaart {
    flex: 0 0 calc(50% - 0.5rem);
  }
}
/* Laptop breekpunt (>= 992px) */
@media (min-width: 992px) {
  .hoofd-container {
    max-width: 1000px;
    margin: 0 auto;
  }
  .kaart {
    flex: 0 0 calc(33.333% - 0.667rem);
  }
}'
  js=''
/>

## Afdrukstijlen met `@media print`

Webpagina's worden niet alleen bekeken op beeldschermen, maar worden soms ook afgedrukt op papier of opgeslagen als <abbr title="Portable Document Format: een bestandsformaat voor documentuitwisseling">PDF</abbr> (bijvoorbeeld een samenvatting, factuur of treinticket).

Op papier heb je geen navigatiebalken, knoppen, donkere achtergronden of interactieve menu's nodig; die verspillen enkel kostbare printerinkt. Met de mediatype `@media print` definieer je stijlen die **uitsluitend gelden wanneer de pagina wordt afgedrukt**.

### Richtlijnen voor een goede printstijl

- **Verberg niet-relevante onderdelen:** geef elementen zoals de navigatie (`nav`), zoekbalken, advertenties en footers de declaratie `display: none;`.
- **Bespaar inkt:** zet de achtergrondkleur van `body` op wit (`background: #ffffff;`) en de tekstkleur op diepzwart (`color: #000000;`).
- **Verwijder schaduwen en decoratieve randen:** vermijd zware `box-shadow` effecten.
- **Toon URL's van links (optioneel):** bij hyperlinks kan je de URL achter de tekst laten afdrukken via de pseudo-element `:after` met `content: " (" attr(href) ")"`.

```css
@media print {
  /* 1. Verberg navigatie en interactieve knoppen */
  .hoofd-nav,
  .actie-knop,
  footer {
    display: none;
  }

  /* 2. Zwarte tekst op zuiver witte achtergrond */
  body {
    background-color: #ffffff;
    color: #000000;
    font-size: 12pt;
    padding: 0;
  }

  /* 3. Verwijder kaders en schaduwen van kaarten */
  .kaart {
    border: none;
    padding: 0;
    margin-bottom: 1.5rem;
  }
}
```

::: tip Hoe test je printstijlen in je browser?
Je hoeft geen fysieke printer aan te sluiten om je printopmaak te controleren. Druk simpelweg op `Ctrl + P` (of `Cmd + P` op macOS) om het afdrukvoorbeeld van je browser te openen. In de DevTools van Chrome of Edge kan je via het menu **Rendering** ook de optie **Emulate CSS media type: print** aanzetten om de afdrukweergave rechtstreeks in je browsertabblad te inspecteren.
:::

<PageSummary>

### Syntaxis in een oogopslag

| Doel | Syntaxis | Toepassing |
|---|---|---|
| Viewport instellen | `<meta name="viewport" content="width=device-width, initial-scale=1.0">` | In het `<head>`-gedeelte van elk HTML-bestand |
| Media query op schermbreedte | `@media (min-width: 768px) { ... }` | Activeert regels vanaf een vensterbreedte van 768px |
| Meerdere voorwaarden | `@media (min-width: 768px) and (max-width: 991px) { ... }` | Activeert enkel binnen een specifiek breedtebereik |
| Afdrukstijl voor printers | `@media print { ... }` | Stijlregels uitsluitend voor afdrukken of PDF-export |

### Regels en naamgeving

- **Plaats altijd de viewport-metatag:** zonder deze tag schalen mobiele browsers de pagina kunstmatig en werken media queries niet betrouwbaar.
- **Werk consequent Mobile-First:** schrijf eerst de basisstijlen voor mobiel buiten media queries, en gebruik daarna uitsluitend `min-width` om stapsgewijs uit te breiden.
- **Houd alles in één CSS-bestand:** bundel mobiele stijlen, tablet-breekpunten, desktop-breekpunten en printstijlen overzichtelijk in dezelfde stylesheet.
- **Ontwerp voor inhoud, niet voor toestelmerken:** kies generieke breekpunten (`768px`, `992px`, `1200px`) en breek waar de inhoud dat vereist, niet op de exacte afmeting van één specifieke telefoon.

### Veelgemaakte fouten

- **De viewport-metatag vergeten:** de pagina toont dan op smartphones als een onleesbaar miniatuur van de desktopversie.
- **`min-width` en `max-width` door elkaar gebruiken:** dit leidt tot tegenstrijdige regels en onvoorspelbare overschrijvingen in de cascade.
- **Stijlen dupliceren in media queries:** herhaal in een media query enkel de eigenschappen die daadwerkelijk veranderen (bijvoorbeeld alleen `flex-direction: row;`), niet de kleuren of lettertypes die al in de mobiele basisstijl staan.
- **Te veel breekpunten definiëren:** breekpunten toevoegen om de 50 pixels maakt een stylesheet onnodig complex en moeilijk te onderhouden.

### Tips voor beginners

- **Gebruik de Responsive Mode in de DevTools:** open de DevTools met `F12` en klik op het apparaat-icoon (`Ctrl + Shift + M`) om vlot van smartphone naar tablet en desktop te schakelen.
- **Start met een enkele kolom:** ontwerp je HTML en mobiele CSS eerst alsof er alleen smartphones bestaan; elementen naast elkaar zetten via Flexbox voeg je pas toe in de media query.

</PageSummary>

## Oefeningen

### Oefening 1: Responsief profieloverzicht

Bouw een eenvoudige profielpagina voor een student van Thomas More Campus Geel (Kleinhoefstraat 4, 2440 Geel):

1. Maak een HTML-bestand met een geldige viewport-metatag en een gekoppeld CSS-bestand `stijl.css`.
2. Plaats in de `<body>` een header met de naam van de student en een navigatiebalk met drie links (*Profiel*, *Vakken*, *Contact*).
3. Schrijf mobiele basisstijlen: de navigatielinks staan netjes onder elkaar en hebben een achtergrondkleur met wat padding.
4. Voeg een media query toe voor tablets en laptops (`min-width: 768px`):
   - Schakel de navigatiebalk om naar een horizontale rij met `display: flex` en `flex-direction: row`.
   - Zorg voor een tussenruimte van `1rem` tussen de knoppen met `gap`.

### Oefening 2: Responsief opleidingsrooster (1 naar 2 naar 3 kolommen)

Maak een overzichtspagina voor vakken van de opleiding IT Factory:

1. Voorzie een container met daarin minstens vier `<article class="vak-kaart">`-elementen.
2. Schrijf de mobiele basisopmaak:
   - De container toont alle kaarten onder elkaar (`display: flex; flex-direction: column; gap: 1rem;`).
   - Elke kaart vult de volledige breedte (`100%`).
3. Voeg een breekpunt toe voor tablets (`min-width: 768px`):
   - De container mag overvloeien naar meerdere regels (`flex-wrap: wrap`).
   - Elke kaart neemt de helft van de rij in minus de tussenruimte (`flex: 0 0 calc(50% - 0.5rem)`).
4. Voeg een breekpunt toe voor desktops (`min-width: 992px`):
   - Elke kaart neemt voortaan een derde van de rij in (`flex: 0 0 calc(33.333% - 0.667rem)`).
   - De hoofdcontainer krijgt een maximale breedte van `1140px` en staat horizontaal gecentreerd met `margin: 0 auto`.

### Oefening 3: Printvriendelijk artikel

Breid het resultaat van Oefening 2 uit met een printmediasquery:

1. Voeg onderaan je CSS-bestand een `@media print`-blok toe.
2. Verberg de navigatiebalk volledig met `display: none;`.
3. Zorg dat de achtergrond van de pagina zuiver wit is en dat alle teksten in het zwart worden weergegeven.
4. Verwijder de randen en achtergrondkleuren van de kaarten, zodat er geen overtollige inkt verbruikt wordt.
5. Test je resultaat door in de browser op `Ctrl + P` te drukken en het afdrukvoorbeeld te inspecteren.
