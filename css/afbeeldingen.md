---
title: Afbeeldingen & Achtergronden
---

# Afbeeldingen en Achtergronden

Afbeeldingen brengen een webpagina tot leven: ze verhelderen complexe concepten, geven sfeer aan een interface en versterken de huisstijl van een organisatie. Waar je in HTML met het `<img>`-element de inhoudelijke structuur neerzet, bepaal je met CSS hoe afbeeldingen zich aanpassen aan verschillende schermformaten, hoe ze netjes worden bijgesneden en hoe sfeervolle achtergronden en kleurverlopen worden weergegeven. In dit hoofdstuk leer je hoe je afbeeldingen responsief styled, hoe je vervorming voorkomt met `object-fit`, hoe je krachtige CSS-achtergronden opzet en hoe je tekst gecontroleerd rond een afbeelding laat vloeien.

## Leerdoelen

Na dit hoofdstuk kan je:

- Uitleggen hoe CSS-stijlregels voor afmetingen voorrang hebben op de HTML-attributen `width` en `height`
- Een afbeelding responsief maken met behulp van de formule `max-width: 100%` en `height: auto`
- Vaste beeldverhoudingen bewaken met behulp van de moderne CSS-eigenschap `aspect-ratio`
- Met `object-fit` (`cover`, `contain`) en `object-position` voorkomen dat afbeeldingen binnen een vast kader uitrekken of vervormen
- Het fundamentele verschil toelichten tussen een inhoudelijke HTML-afbeelding (`<img>`) en een decoratieve CSS-achtergrond (`background-image`)
- Achtergrondafbeeldingen instellen via CSS en correct schalen met `background-size: cover` en `background-size: contain`
- De herhaling (`background-repeat`) en uitlijning (`background-position`) van achtergrondafbeeldingen beheren
- Een lineair en radiaal kleurverloop opbouwen met `linear-gradient()` en `radial-gradient()`
- Tekst gecontroleerd rond een afbeelding laten vloeien met `float: left` of `float: right`, en de containerhoogte herstellen met een clearfix (`display: flow-root`)
- Emmet-sneltoetsen in PhpStorm toepassen voor afbeeldingen en achtergronden (zoals `ff:v`, `bgc`, `bgi` en `bgs:c`)

## Afbeeldingen dimensioneren met CSS

In het hoofdstuk [HTML5: Afbeeldingen](/html/afbeeldingen) heb je geleerd dat je aan elk `<img>`-element de HTML-attributen `width` en `height` meegeeft (bijvoorbeeld `width="800" height="500"`). Deze HTML-attributen geven de intrinsieke beeldverhouding door aan de browser, zodat er al vóór het laden van de afbeelding exacte witruimte op de pagina wordt gereserveerd. Dit voorkomt vervelende lay-outverschuivingen (<abbr title="Cumulative Layout Shift: een maatstaf voor visuele stabiliteit tijdens het laden van een webpagina">CLS</abbr>).

Zodra je echter CSS toepast, overschrijven de CSS-regels altijd de HTML-attributen:

```css
/* CSS overschrijft de HTML-attributen width en height */
img {
  width: 400px;
}
```

Als je in CSS enkel de breedte (`width`) aanpast en de hoogte niet specificeert, berekent de browser de hoogte automatisch op basis van de oorspronkelijke beeldverhouding.

### De gouden regel voor responsieve afbeeldingen

Op een modern web surfen bezoekers op schermen die variëren van kleine smartphones (360px breed) tot gigantische 4K-monitoren. Geef je een afbeelding een vaste breedte in pixels (zoals `width: 700px;`), dan barst ze op een smartphone genadeloos uit haar omringende container en ontstaat er een lelijke horizontale schuifbalk.

Om afbeeldingen naadloos te laten meeschalen met elk scherm, gebruik je de universele **responsieve afbeeldingsformule**:

```css
img {
  max-width: 100%;
  height: auto;
}
```

Hoe werkt deze formule?
- **`max-width: 100%`**: De afbeelding mag maximaal 100% van de breedte van haar omringende container innemen. Is de container smaller dan de ware resolutie van de foto? Dan krimpt de foto automatisch mee. Is de container breder? Dan wordt de foto **nooit** groter dan haar oorspronkelijke resolutie, waardoor kwaliteitsverlies en korreligheid voorkomen worden.
- **`height: auto`**: De browser berekent de hoogte evenredig mee met de veranderende breedte. De foto behoudt daardoor altijd haar natuurlijke beeldverhouding en wordt nooit samengedrukt.

### Vaste beeldverhoudingen bewaken met `aspect-ratio`

Wil je dat een afbeeldingskader of een `<figure>` altijd een vaste verhouding behoudt (zoals 16:9 voor video's of banners, of 1:1 voor vierkante profielfoto's)? Dan gebruik je de moderne CSS-eigenschap <dfn title="CSS-eigenschap waarmee je de verhouding tussen breedte en hoogte van een element vastlegt">aspect-ratio</dfn>:

```css
.videokaart {
  width: 100%;
  aspect-ratio: 16 / 9;
}

.profielfoto {
  width: 120px;
  aspect-ratio: 1 / 1;
}
```

Dankzij `aspect-ratio` hoef je niet langer zelf met ingewikkelde padding-trucs te rekenen; de browser bewaakt automatisch de juiste hoogte op basis van de actuele breedte.

## Afbeeldingen passend maken met `object-fit`

Wanneer je een raster van kaarten, een teampagina of een galerij bouwt, wil je vaak dat alle afbeeldingen exact dezelfde breedte én hoogte hebben (bijvoorbeeld `width: 100%; height: 240px;`). 

Als de geüploade foto's niet exact dezelfde verhouding hebben, ontstaat er zonder ingrijpen een groot probleem: de browser rekt foto's uit of drukt ze plat om ze in het kader te forceren (`fill`). Dit oogt uiterst onprofessioneel.

Met de eigenschap <dfn title="CSS-eigenschap die bepaalt hoe de inhoud van een vervangend element (zoals img of video) binnen zijn eigen afmetingen wordt geschaald">object-fit</dfn> bepaal je hoe de inhoud van een `<img>` zich aanpast aan de opgegeven afmetingen:

| Waarde | Werking | Beeldverhouding behouden? | Snijdt afbeelding bij? | Typische toepassing |
|---|---|---|---|---|
| `fill` | Rekt de afbeelding uit om het kader exact te vullen (standaardgedrag). | Nee (vervorming) | Nee | Vermijden bij foto's |
| `cover` | Vult het kader volledig; behoudt verhouding; snijdt overtollige randen af. | **Ja** | **Ja** | Nieuwskaarten, teampagina's, banners |
| `contain` | Toont de volledige foto; behoudt verhouding; laat eventueel lege balken. | **Ja** | Nee | Partnerlogo's, schema's, grafieken |
| `none` | Negeert de containergrootte en toont de foto op oorspronkelijke resolutie. | **Ja** | **Ja** | Exacte pixel-uitsnedes |
| `scale-down` | Kiest automatisch de kleinste weergave van `none` of `contain`. | **Ja** | Nee | Pictogrammen in flexibele kaders |

```css
/* Dé standaard voor uniforme afbeeldingskaarten */
.kaart img {
  width: 100%;
  height: 220px;
  object-fit: cover;
}
```

### De uitsnede sturen met `object-position`

Wanneer je `object-fit: cover` gebruikt, snijdt de browser overtollige delen van de afbeelding automatisch af. Standaard centreert de browser de uitsnede (`object-position: center center`). 

Als het belangrijkste onderwerp van de foto (zoals het gezicht van een docent of een belangrijk detail) zich echter bovenaan bevindt, kan het gebeuren dat dit gedeelte buiten beeld valt. Met <dfn title="CSS-eigenschap die de uitlijning van de inhoud van een afbeelding binnen haar kader bepaalt">object-position</dfn> verschuif je het focuspunt van de uitsnede:

```css
.docent-portret img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  object-position: top center; /* Focus op het gezicht bovenaan */
}
```

Je kan waarden opgeven met trefwoorden (`top`, `bottom`, `left`, `right`, `center`) of met percentages (bijvoorbeeld `object-position: 50% 20%;`).

## Interactieve Simulator: `object-fit` & `object-position`

In de onderstaande interactieve simulator experimenteer je live met de verschillende waarden van `object-fit`, wissel je tussen kaderformaten en verplaats je de uitsnede via het positierooster:

<ObjectFitSimulator />


## Codevoorbeeld: Responsieve afbeeldingskaarten met `object-fit`

In de onderstaande CodeSandbox zie je hoe je met een consistente container en `object-fit: cover` een strakke rij nieuwsberichten voor Thomas More Campus Geel presenteert, zonder dat verschillende fotoformaten de lay-out verstoren:

<CodeSandbox
  title="Afbeeldingskaarten met object-fit"
  height="480px"
  initialTab="split"
  activeCodeTab="css"
  highlightHtml=""
  highlightCss="35-37"
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Campus Geel Nieuws</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <div class="nieuws-grid">
    <article class="kaart">
      <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80" alt="Studenten overleggen in de agora van Campus Geel">
      <div class="kaart-inhoud">
        <h2 class="kaart-titel">Welkom op Campus Geel</h2>
        <p class="kaart-tekst">De introductiedagen voor eerstejaarsstudenten starten volgende week in de centrale hal.</p>
      </div>
    </article>
    <article class="kaart">
      <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80" alt="Studenten programmeren in het computerlokaal">
      <div class="kaart-inhoud">
        <h2 class="kaart-titel">IT Factory Hackathon</h2>
        <p class="kaart-tekst">Schrijf je in met je team en bouw gedurende 24 uur aan innovatieve webtoepassingen.</p>
      </div>
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
/* Algemene paginastijl */
body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #212529;
  background-color: #f8fafc;
  padding: 2rem;
  line-height: 1.6;
}
/* Kaartcontainer */
.nieuws-grid {
  max-width: 680px;
  margin: 0 auto;
}
.kaart {
  display: inline-block;
  vertical-align: top;
  width: 320px;
  margin: 0.5rem;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}
/* Vaste hoogte met cover voorkomt vervorming */
.kaart img {
  display: block;
  width: 100%;
  height: 180px;
  object-fit: cover;
  object-position: center;
}
.kaart-inhoud {
  padding: 1.25rem;
}
.kaart-titel {
  font-size: 1.15rem;
  color: #1e2d5a;
  margin-bottom: 0.5rem;
}
.kaart-tekst {
  font-size: 0.9rem;
  color: #64748b;
}'
  js=''
/>

## Achtergrondafbeeldingen in CSS: `background-image`

Niet elke afbeelding op een website hoort thuis in de HTML-code. Er is een cruciaal semantisch verschil tussen inhoudelijke en decoratieve afbeeldingen:

- **Inhoudelijke afbeeldingen (`<img>` in HTML):** Bevatten essentiële informatie die de bezoeker moet zien of begrijpen (zoals een infographic, een portret van een spreker of een diagram). Ze hebben altijd een beschrijvend `alt`-attribuut nodig voor schermlezers.
- **Decoratieve afbeeldingen (`background-image` in CSS):** Dienen puur ter verfraaiing van de lay-out (zoals patronen, sfeervolle achtergrondfoto's in een hero-sectie of decoratieve kleurvlakken). Als deze afbeeldingen niet laden of wegvallen, mist de bezoeker geen inhoudelijke context. Schermlezers negeren CSS-achtergronden volledig.

Om een achtergrondafbeelding toe te kennen aan een element, gebruik je de eigenschap <dfn title="CSS-eigenschap waarmee je een of meerdere achtergrondafbeeldingen toekent aan een HTML-element">background-image</dfn> in combinatie met de functie `url()`:

```css
.banner {
  background-image: url("campus-banner.webp");
}
```

::: warning Relatieve paden vertrekken vanuit het CSS-bestand!
Let goed op bij relatieve paden in CSS: een bestandspad in `url(...)` wordt door de browser altijd geïnterpreteerd **ten opzichte van de locatie van het CSS-bestand**, en **niet** ten opzichte van het HTML-bestand!

Staat je CSS-bestand in een submap `css/stijl.css` en staan je afbeeldingen in de submap `images/`, dan moet je eerst een map omhoog met `../`:
```css
/* Vanuit css/stijl.css naar de map images/ */
.banner {
  background-image: url("../images/campus-banner.webp");
}
```
:::

### Zorg altijd voor een veilige achtergrondkleur

Stel bij het gebruik van een achtergrondafbeelding **altijd** eerst een dekkende achtergrondkleur in met `background-color`. Kies een kleur die dicht aansluit bij de hoofdtint van de afbeelding:

```css
.hero {
  background-color: #1e2d5a; /* Donkerblauw als veilige terugval */
  background-image: url("../images/hero-campus.webp");
  color: #ffffff; /* Witte tekst */
}
```

Mocht de achtergrondfoto vertraging oplopen door een trage internetverbinding of niet gevonden worden door een verbroken link, dan zorgt de achtergrondkleur ervoor dat witte tekst altijd perfect leesbaar blijft tegen de donkere ondergrond.

### Herhaling beheren: `background-repeat`

Standaard herhaalt een achtergrondafbeelding zich in CSS eindeloos over zowel de horizontale als de verticale as (`repeat`), net zoals behangpapier op een muur. 

Voor een grote foto in een header wil je deze herhaling bijna altijd uitschakelen met <dfn title="CSS-eigenschap die bepaalt of en hoe een achtergrondafbeelding wordt herhaald">background-repeat</dfn>:

```css
.hero {
  background-repeat: no-repeat;
}
```

Mogelijke waarden voor `background-repeat`:
- `no-repeat`: De afbeelding wordt slechts eenmaal getoond.
- `repeat`: De afbeelding herhaalt zich zowel horizontaal als verticaal (standaardwaarde).
- `repeat-x`: De afbeelding herhaalt zich uitsluitend horizontaal (handig voor doorlopende balken).
- `repeat-y`: De afbeelding herhaalt zich uitsluitend verticaal.

### Plaatsing bepalen: `background-position`

Met de eigenschap <dfn title="CSS-eigenschap die de startpositie van een achtergrondafbeelding binnen haar element bepaalt">background-position</dfn> bepaal je waar de afbeelding binnen het element wordt geplaatst:

```css
.hero {
  background-position: center center; /* Gecentreerd in het vlak */
}
```

Je specificeert de positie met twee waarden: de **horizontale positie** (links naar rechts) gevolgd door de **verticale positie** (boven naar onder):
- Met trefwoorden: `left top`, `center top`, `right top`, `center center`, `center bottom`, enzovoort. Geef je slechts één trefwoord op (zoals `center`), dan maakt de browser van de tweede waarde automatisch ook `center`.
- Met percentages: `0% 0%` (linksboven), `50% 50%` (midden) of `100% 100%` (rechtsonder).
- Met exacte eenheden: `20px 40px` of `1rem 2rem`.

## Achtergronden schalen: `background-size`

Standaard toont CSS een achtergrondafbeelding in haar oorspronkelijke resolutie (`auto`). Op een groot computerscherm kan een foto daardoor te klein zijn, terwijl ze op een smartphone veel te groot is.

Met de eigenschap <dfn title="CSS-eigenschap waarmee je de afmetingen en schaling van een achtergrondafbeelding instelt">background-size</dfn> beheer je hoe de achtergrond zich aanpast aan de afmetingen van het element:

### 1. `background-size: cover` (De gouden standaard voor hero-secties)

Met `cover` schaalt de browser de afbeelding proportioneel mee zodat het element **volledig bedekt** is. Zelfs als het browservenster van formaat verandert, blijft het hele vlak gevuld zonder dat er zwarte balken ontstaan. Overtollige randen die buiten het element vallen, worden netjes afgesneden:

```css
.hero-banner {
  background-size: cover;
  background-position: center;
}
```

### 2. `background-size: contain`

Met `contain` schaalt de browser de afbeelding zodanig dat ze **volledig zichtbaar** blijft binnen het element. Als de verhouding van de afbeelding afwijkt van het element, blijven er aan de boven-/onderkant of aan de zijkanten onbedekte zones over waarin de `background-color` zichtbaar wordt.

### Het parallax-effect met `background-attachment`

Met de eigenschap `background-attachment` bepaal je of de achtergrondafbeelding meescrolt met de rest van de pagina of vastgepind blijft aan het browservenster:

- `scroll`: De achtergrond scrolt natuurlijk mee met de inhoud (standaardwaarde).
- `fixed`: De achtergrondafbeelding blijft roerloos op haar plek staan terwijl de inhoud van de webpagina eroverheen glijdt. Dit creëert een populair en subtiel diepte-effect (parallax):

```css
.parallax-sectie {
  background-image: url("campus-gebouw.webp");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
```

### De verkorte notatie (Shorthand): `background`

In plaats van vijf afzonderlijke declaraties te schrijven, kan je alle achtergrondeigenschappen bundelen in de samengestelde eigenschap <dfn title="Verkorte CSS-eigenschap waarmee je alle afzonderlijke achtergrondstijlen in één regel definieert">background</dfn>:

```css
/* Uitgeschreven notatie: */
.banner {
  background-color: #1e2d5a;
  background-image: url("campus.webp");
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
}

/* Identieke verkorte notatie (shorthand): */
.banner {
  background: #1e2d5a url("campus.webp") center / cover no-repeat;
}
```

::: danger Let op de verplichte schuine streep bij `background-size`!
In de verkorte `background`-notatie mag je `background-size` **uitsluitend** noteren direct na `background-position`, gescheiden door een schuine streep: `positie / grootte`. Schrijf je de schuine streep niet of wissel je de volgorde om, dan verklaart de browser de volledige stijlregel ongeldig!
:::

## Kleurverlopen als achtergrond (CSS Gradients)

In CSS hoef je niet per se een zwaar afbeeldingsbestand in te laden om mooie kleurovergangen te maken. Met CSS Gradients genereert de browser vloeiende kleurverlopen die vederlicht zijn voor het netwerk en oneindig scherp schalen op elk scherm.

Technisch gezien behandelt de browser een kleurverloop als een afbeelding. Je stelt verlopen daarom altijd in via `background-image` (of via de verkorte eigenschap `background`).

### 1. Lineair verloop: `linear-gradient()`

Een lineair verloop vloeit in een rechte lijn van de ene kleur over in de andere.

De basisvorm:
```css
/* Van boven naar beneden: verloopt van donkerblauw naar oranje */
.verloop-balk {
  background-image: linear-gradient(#1e2d5a, #e87722);
}
```

#### Richting bepalen
Je kan de richting sturen met trefwoorden voorafgegaan door `to` of met een exacte hoek in graden (`deg`):

```css
/* Naar rechts */
background-image: linear-gradient(to right, #1e2d5a, #e87722);

/* Diagonaal naar de rechterbovenhoek */
background-image: linear-gradient(to top right, #1e2d5a, #e87722);

/* Onder een specifieke hoek van 135 graden */
background-image: linear-gradient(135deg, #1e2d5a, #e87722);
```

#### Meerdere kleurhalten (color stops)
Je bent niet beperkt tot twee kleuren; je kan zoveel overgangskleuren en procentuele posities toevoegen als je wenst:

```css
/* Verloop met drie kleuren en procentuele kleurhalten */
background-image: linear-gradient(to right, #1e2d5a 0%, #2563eb 50%, #e87722 100%);
```

### 2. Radiaal verloop: `radial-gradient()`

Bij een radiaal verloop start de eerste kleur in een centraal punt en straalt ze cirkelvormig of ellipsvormig naar buiten uit:

```css
/* Cirkelvormig verloop vanuit het centrum */
.gloed {
  background-image: radial-gradient(circle, #e87722, #1e2d5a);
}
```

### Praktijktoepassing: Tekst leesbaar maken met een donkere overlay

Een veelvoorkomende uitdaging bij hero-banners is dat foto's zowel lichte als donkere zones bevatten. Als je daar witte tekst over plaatst, is de tekst op de lichte stukken van de foto onleesbaar.

In CSS kan je **meerdere achtergrondlagen** over elkaar heen leggen door ze simpelweg te scheiden met een komma. De laag die je als eerste noemt, ligt bovenop! Door een half-transparante zwarte of donkerblauwe `linear-gradient` over de foto te draperen, zorg je voor een professioneel contrast en perfect leesbare letters:

```css
.hero-banner {
  /* Eerst de donkere semi-transparante gradient, daaronder de foto */
  background-image: 
    linear-gradient(rgba(30, 45, 90, 0.75), rgba(15, 23, 42, 0.85)),
    url("campus-hero.webp");
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  color: #ffffff;
}
```

## Interactieve Simulator: Background & Hero Banner

Met de onderstaande simulator ontdek je direct het effect van `background-size: cover` versus `contain`, test je verschillende ankerposities en zie je hoe een donkere gradiëntoverlay witte tekst helder en leesbaar maakt:

<BackgroundHeroSimulator />

## Tekstomloop met `float` en `clear`

In vroege versies van CSS werd de eigenschap `float` vaak oneigenlijk gebruikt om complete lay-outs en kolommen te bouwen. Dat leidde regelmatig tot ingewikkelde bugs en onvoorspelbaar gedrag.

::: danger Gebruik float nooit voor pagina-layouts!
In moderne webontwikkeling gebruik je voor kolommen en pagina-structuren **nooit** meer float. Daarvoor gebruik je flexibele, moderne standaarden zoals **Flexbox** en **CSS Grid** (die we in de volgende hoofdstukken behandelen).

De eigenschap `float` heeft vandaag nog maar één enkel, specifiek doel: **tekst elegant laten omvloeien rond een afbeelding binnen een artikel of alinea**, net zoals in een papieren krant of tijdschrift.
:::

Met de eigenschap <dfn title="CSS-eigenschap waarmee een element uit de normale documentstroom wordt gelicht en tegen de linker- of rechterrand van zijn container wordt geplaatst, waarbij omringende tekst eromheen vloeit">float</dfn> licht je een element uit de normale stroom en schuif je het tegen de linker- of rechterrand van zijn ouder aan:

- `float: left`: De afbeelding schuift naar uiterst links; de tekst vloeit er langs de rechterkant omheen.
- `float: right`: De afbeelding schuift naar uiterst rechts; de tekst vloeit er langs de linkerkant omheen.
- `float: none`: Het standaardgedrag (geen tekstomloop).

```css
/* Afbeelding zweeft links, tekst vloeit rechts */
.artikel-afbeelding {
  float: left;
  margin-right: 1.5rem;
  margin-bottom: 1rem;
}
```

Merk op dat we altijd royale buitenruimte (`margin`) toevoegen aan de zijden waar de tekst langs de afbeelding stroomt. Zonder deze marges zouden de letters letterlijk tegen de rand van de foto botsen.

### Tekstomloop stoppen met `clear`

Wil je na een aantal alinea's voorkomen dat een volgende titel of sectie nog langer om de zwevende afbeelding heen vloeit? Met de eigenschap <dfn title="CSS-eigenschap die aangeeft aan welke zijden van een element geen zwevende (floating) elementen mogen staan">clear</dfn> dwing je een element om pas te beginnen **onder** de zwevende afbeelding:

```css
/* Deze kop start pas onder eventuele zwevende afbeeldingen */
h2.volgende-sectie {
  clear: both;
}
```

Mogelijke waarden voor `clear`:
- `left`: Geen zwevende elementen toegestaan aan de linkerkant.
- `right`: Geen zwevende elementen toegestaan aan de rechterkant.
- `both`: Geen zwevende elementen toegestaan aan weerszijden (start onder alle zwevende elementen).

### Het probleem van de inzakkende container (Clearfix)

Wanneer een afbeelding zweeft (`float`), telt haar hoogte standaard niet meer mee voor de hoogte van het bovenliggende element. Bevat een `<article>` of `<div>` enkel een zwevende afbeelding en een kort tekstje, dan 'zakt de container in elkaar' tot een dunne streep. De afbeelding steekt dan lelijk aan de onderkant uit de rand of achtergrond van de container.

Om dit op te lossen, moet je de container instrueren om haar zwevende kinderen weer netjes te omvatten (een zogenaamde <dfn title="Een techniek of stijlmethode om ervoor te zorgen dat een container automatisch zijn zwevende elementen omsluit">clearfix</dfn>).

In modern webdesign doe je dit heel eenvoudig en schoon met de eigenschap `display: flow-root`:

```css
/* De moderne, elegante clearfix */
.artikel-container {
  display: flow-root;
  background-color: #ffffff;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}
```

Dankzij `display: flow-root` maakt de browser een nieuwe interne opmaakcontext (<abbr title="Block Formatting Context: een geïsoleerd opmaakgebied waarin blokelementen worden berekend">BFC</abbr>) aan, waardoor de container altijd automatisch meegroeit met de volledige hoogte van de zwevende afbeelding.

## Live voorbeeld: Tekstomloop en clearfix

In het onderstaande interactieve voorbeeld zie je een artikel over Campus Geel waarin een afbeelding netjes links zweeft, voorzien is van marges en waarin de container dankzij `display: flow-root` haar volledige hoogte behoudt:

<CodeSandbox
  title="Tekstomloop met float en display: flow-root"
  height="480px"
  initialTab="split"
  activeCodeTab="css"
  highlightHtml=""
  highlightCss="17,27,30-32"
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thomas More Campus Geel</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <article class="artikel">
    <h1 class="artikel-titel">Innovatie in de Kempen</h1>
    <img src="https://images.unsplash.com/photo-1562774053-701939374585?w=500&auto=format&fit=crop&q=80" alt="Groene buitenomgeving van Thomas More Campus Geel" class="artikel-foto">
    <p class="artikel-tekst">
      Thomas More Campus Geel biedt een inspirerende leeromgeving waar theorie en praktijk elkaar continu ontmoeten. Studenten werken in moderne labo&#39;s aan uitdagende projecten voor echte bedrijven en organisaties uit de regio.
    </p>
    <p class="artikel-tekst">
      Dankzij de groene campusomgeving en de kleinschalige groepen geniet je van een persoonlijke begeleiding door ervaren docenten uit het werkveld.
    </p>
  </article>
</body>
</html>'
  css='/* Universele resetter */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
/* Algemene paginastijl */
body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #212529;
  background-color: #f1f5f9;
  padding: 2rem;
  line-height: 1.6;
}
/* Artikelcontainer met flow-root voorkomt inzakkende container */
.artikel {
  display: flow-root;
  max-width: 650px;
  margin: 0 auto;
  background-color: #ffffff;
  padding: 1.75rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
}
/* Zwevende afbeelding */
.artikel-foto {
  float: left;
  width: 220px;
  height: 150px;
  object-fit: cover;
  margin-right: 1.25rem;
  margin-bottom: 0.75rem;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}
.artikel-titel {
  color: #1e2d5a;
  font-size: 1.35rem;
  margin-bottom: 0.75rem;
}
.artikel-tekst {
  font-size: 0.95rem;
  color: #334155;
  margin-bottom: 0.75rem;
}'
  js=''
/>

## Handige Emmet-sneltoetsen in PhpStorm

Typ in PhpStorm (of in de interactieve CodeSandbox van deze cursus) binnen een CSS-declaratieblok de onderstaande afkorting en druk op `Tab`:

::: tip Ook in de CodeSandbox
Alle onderstaande afkortingen werken zowel in PhpStorm als in de inline en fullscreen CodeSandbox van deze cursus.
:::

| Emmet-code | Druk op `Tab` | Gegenereerde CSS-code |
|---|---|---|
| `ff:v` | `Tab` | `font-family: Verdana, Geneva, sans-serif;` |
| `mw100%` | `Tab` | `max-width: 100%;` |
| `h:a` | `Tab` | `height: auto;` |
| `objf:c` | `Tab` | `object-fit: cover;` |
| `objf:ct` | `Tab` | `object-fit: contain;` |
| `objp:c` | `Tab` | `object-position: center;` |
| `bgi` | `Tab` | `background-image: url();` |
| `bgr:n` | `Tab` | `background-repeat: no-repeat;` |
| `bgp:c` | `Tab` | `background-position: center;` |
| `bgs:c` | `Tab` | `background-size: cover;` |
| `bgs:ct` | `Tab` | `background-size: contain;` |
| `bga:f` | `Tab` | `background-attachment: fixed;` |
| `fl:l` | `Tab` | `float: left;` |
| `fl:r` | `Tab` | `float: right;` |
| `cl:b` | `Tab` | `clear: both;` |
| `d:fr` | `Tab` | `display: flow-root;` |

<PageSummary>

### Syntaxis in een oogopslag

| Wat | Hoe | Voorbeeld |
|---|---|---|
| Responsieve afbeelding | `max-width: 100%; height: auto;` | `img { max-width: 100%; height: auto; }` |
| Beeldkader vullen | `object-fit: cover \| contain;` | `object-fit: cover;` |
| Uitsnede richten | `object-position: x y;` | `object-position: top center;` |
| Achtergrondafbeelding | `background-image: url('pad');` | `background-image: url('../img/foto.webp');` |
| Achtergrond herhalen | `background-repeat: no-repeat \| repeat;` | `background-repeat: no-repeat;` |
| Achtergrond uitlijnen | `background-position: x y;` | `background-position: center center;` |
| Achtergrond schalen | `background-size: cover \| contain;` | `background-size: cover;` |
| Verkorte notatie | `background: kleur url(...) pos / size rep;` | `background: #1e2d5a url('bg.webp') center / cover no-repeat;` |
| Lineair kleurverloop | `linear-gradient(richting, kleur1, kleur2);` | `linear-gradient(135deg, #1e2d5a, #e87722);` |
| Tekstomloop | `float: left \| right;` | `float: left; margin-right: 1rem;` |
| Omsluiting herstellen | `display: flow-root;` | `.container { display: flow-root; }` |

### Regels en afspraken

- **CSS overschrijft HTML:** Geef in HTML altijd `width` en `height` mee voor de aspect ratio, maar stuur het responsieve gedrag in CSS altijd met `max-width: 100%` en `height: auto`.
- **Voorkom vervorming:** Combineer vaste hoogtes op afbeeldingen altijd met `object-fit: cover` om samengedrukte foto's te vermijden.
- **Relatieve paden vanuit CSS:** Bedenk dat het pad in `url(...)` altijd relatief is ten opzichte van het stijlblad zelf, niet ten opzichte van het HTML-bestand.
- **Altijd een achtergrondkleur:** Stel bij een `background-image` altijd een bijpassende `background-color` in zodat tekst leesbaar blijft als het bestand traag laadt.
- **Schuine streep in background shorthand:** Schrijf in de samengestelde `background`-regel de grootte altijd direct achter de positie met een schuine streep (`center / cover`).
- **Geen float voor lay-outs:** Gebruik `float` uitsluitend voor typografische tekstomloop rond beelden, nooit om webpagina-kolommen te structureren.

### Veelgemaakte fouten

- Vaste pixelbreedtes instellen op afbeeldingen waardoor mobiele pagina's horizontaal gaan scrollen.
- `width` en `height` tegelijk forceren op een `<img>` zonder `object-fit: cover`, wat resulteert in lelijk uitgerekte gezichten en objecten.
- Vergeten om `../` te gebruiken in de CSS `url()` wanneer het stijlblad in een aparte submap staat.
- Witte tekst plaatsen op een lichte achtergrondfoto zonder een half-transparante donkere `linear-gradient` overlay toe te voegen.
- `float` toepassen zonder marges, waardoor tekst direct tegen de afbeelding aankleeft.
- Vergeten om `display: flow-root` toe te passen op de omringende container van een zwevend element, waardoor de container inklapt.

### Tips voor beginners

- Inspecteer achtergronden in Chrome DevTools: klik op het kleurbolletje naast een gradient om interactief de overgangen en hoeken aan te passen.
- Gebruik de Emmet-sneltoets `bgs:c` gevolgd door `Tab` om direct `background-size: cover;` te genereren.
- Maak een donkere overlay met `rgba(0, 0, 0, 0.6)` om elke willekeurige foto direct geschikt te maken als achtergrond voor witte tekst.
- Test je webpagina altijd op een smalle schermbreedte (via de apparaatbalk in DevTools: `Ctrl+Shift+M` of `Cmd+Shift+M`) om te verifiëren of afbeeldingen netjes inkrimpen.

</PageSummary>

## Oefeningen

Oefen de theorie in door de onderstaande praktische opdrachten uit te voeren in PhpStorm. Maak voor elke oefening een nieuw HTML- en CSS-bestand aan.

### Oefening 1: Responsieve teamkaarten met `object-fit`

Maak een overzichtspagina met docenten van de opleiding Digitale Vormgeving & Web op Thomas More Campus Geel.

**Instructies:**
1. Maak een bestand `team.html` en koppel het aan `team.css`.
2. Maak een container met daarin twee docentenkaarten (`<article class="docent-kaart">`).
3. Plaats in elke kaart een foto (`<img>`), een naam (`<h2>`) en het vakgebied (`<p>`). Gebruik twee foto's met een verschillende oorspronkelijke verhouding (bijvoorbeeld een liggende en een staande foto).
4. Pas in CSS de universele resetter toe (`* { box-sizing: border-box; margin: 0; padding: 0; }`).
5. Stel voor de `body` het lettertype in met `ff:v` (`font-family: Verdana, Geneva, sans-serif;`).
6. Geef elke kaart een breedte van `280px`, een witte achtergrond, een rand en afgeronde hoeken. Plaats de kaarten netjes naast elkaar met `display: inline-block; vertical-align: top; margin: 1rem;`.
7. Zorg ervoor dat alle foto's een breedte van `100%` en een vaste hoogte van `200px` krijgen. Voorkom elke vorm van vervorming met `object-fit: cover` en centreer de uitsnede met `object-position: top center`.

### Oefening 2: Hero-banner met donkere gradient en contrast

Bouw een aantrekkelijke welkomstbanner voor de opendeurdag van Thomas More Campus Geel.

**Instructies:**
1. Maak een bestand `banner.html` en koppel het aan `banner.css`.
2. Maak een sectie `<header class="hero-sectie">` met daarin een subtitel `<span class="badge">`, een hoofdtitel `<h1>`, een introtekst `<p>` en een knop `<a href="#" class="knop">`.
3. Pas in `banner.css` de universele resetter toe.
4. Geef de `.hero-sectie`:
   - Een donkerblauwe terugvalkleur `#1e2d5a`.
   - Een achtergrondafbeelding gecombineerd met een donkere `linear-gradient` (bijvoorbeeld van `rgba(30, 45, 90, 0.8)` naar `rgba(15, 23, 42, 0.9)`).
   - Volledige vlakdekking met `background-size: cover` en centrering met `background-position: center`.
   - Geen herhaling met `background-repeat: no-repeat`.
   - Voldoende binnenruimte (`padding: 4rem 2rem;`) en witte tekstkleur.
5. Maak de knop op met `display: inline-block`, een oranje achtergrond `#e87722`, witte tekst, vette letters en afgeronde hoeken.

### Oefening 3: Nieuwsartikel met typografische tekstomloop en clearfix

Maak een nieuwsartikel waarin een foto van Campus Geel naadloos in de tekst is geïntegreerd.

**Instructies:**
1. Maak een bestand `artikel.html` en koppel het aan `artikel.css`.
2. Maak een container `<article class="nieuwsbericht">` met een titel `<h1>`, een afbeelding `<img>` en minstens twee lange alinea's tekst.
3. Laat de afbeelding naar links zweven met `float: left`.
4. Geef de afbeelding een vaste breedte van `240px`, een hoogte van `160px`, `object-fit: cover`, en voorzie voldoende witruimte aan de rechterkant en onderkant (`margin-right: 1.5rem; margin-bottom: 1rem;`).
5. Zorg ervoor dat de `.nieuwsbericht`-container haar zwevende inhoud netjes omsluit door de moderne clearfix `display: flow-root;` toe te passen.
6. Geef de container een lichtgrijze achtergrond `#f8fafc`, een rand van `1px solid #e2e8f0` en een binnenruimte van `2rem`. Controleer in je browser dat de container niet inzakt!
