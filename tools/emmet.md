---
title: Emmet
---

# Emmet

Tijdens het bouwen van websites wil je je creatieve denkproces zo min mogelijk laten onderbreken door repetitief typewerk. Het handmatig uitschrijven van tientallen openende en sluitende tags, aanhalingstekens en stijldeclaraties kost veel tijd en vergroot de kans op tikfouten. 

<dfn title="Een ingebouwde toolkit voor webontwikkelaars waarmee je beknopte, CSS-achtige afkortingen direct omzet in volwaardige HTML- of CSS-code via een sneltoets">Emmet</dfn> is een onmisbare toolkit voor ontwikkelaars die standaard is geïntegreerd in professionele code-editors zoals PhpStorm en Visual Studio Code. Ook alle interactieve sandboxes in deze cursus ondersteunen Emmet. Met enkele slimme toetsaanslagen genereer je in een fractie van een seconde complete HTML-bomen en CSS-declaraties.

## Leerdoelen

Na dit hoofdstuk kan je:

- Uitleggen hoe Emmet werkt en afkortingen expanderen met de `Tab`-toets in PhpStorm
- Een compleet <abbr title="HyperText Markup Language: de standaard opmaaktaal voor webpagina's">HTML5</abbr>-basisskelet genereren met het uitroepteken `!` of `html:5`
- Elementen met klassen, id's en willekeurige attributen versneld uitschrijven
- Geneste en opeenvolgende HTML-structuren opbouwen met de operatoren `>`, `+` en `^`
- Meervoudige elementen herhalen en automatisch nummeren met `*` en de dollar-teller `$`
- Vaste inhoudstekst direct tussen tags injecteren met accolades `{...}`
- De meest gebruikte CSS-afkortingen in PhpStorm toepassen voor snelle styling
- De officiële Emmet Cheat Sheet raadplegen en toepassen als referentiebron

## Hoe werkt Emmet?

Het basisprincipe van Emmet is verbluffend eenvoudig: je typt een compacte, wiskundig aandoende afkorting (die sterk lijkt op een <abbr title="Cascading Style Sheets: de stijlen- en opmaaktaal voor het web">CSS</abbr>-selector) en drukt meteen daarna op de **`Tab`**-toets. PhpStorm ontleedt de afkorting en vervangt deze op je scherm door de volledige, correct ingesprongen code.

Typ bijvoorbeeld in een HTML-bestand:

```text
p
```

Druk aansluitend op `Tab`. PhpStorm tovert dit direct om naar:

```html
<p></p>
```

::: tip Geen spaties gebruiken
Emmet herkent een afkorting alleen als er **geen spaties** in staan. Zodra je een spatie typt tussen de tekens, beschouwt de editor de invoer als gewone tekst en zal de `Tab`-toets niet expanderen. Typ dus altijd `nav>ul>li*3` en niet `nav > ul > li * 3`.
:::

## Het HTML5-basisskelet in één tel

Wanneer je een nieuw, leeg HTML-bestand aanmaakt, hoef je de verplichte doctype, meta-tags en paginastructuur nooit handmatig uit het hoofd in te typen.

Typ op een blanco regel:

```text
!
```

Druk op `Tab`. Emmet genereert onmiddellijk het officiële basisskelet:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>

</body>
</html>
```

::: warning Vergeet het taalattribuut niet
Standaard genereert Emmet vaak `lang="en"`. Pas dit in je documenten voor deze cursus altijd meteen aan naar `lang="nl"` voor een correcte Nederlandstalige webpagina.
:::

## HTML-tags, Klassen en ID's

Emmet leunt sterk op de syntaxis van CSS-selectoren. Je gebruikt een punt (`.`) voor een klasse en een hekje (`#`) voor een id:

### 1. Element met een klasse (`.`)
Typ de tag gevolgd door de gewenste klassenaam:

```text
p.inleiding
```

Resultaat na `Tab`:

```html
<p class="inleiding"></p>
```

### 2. De standaard div-aanname
Omdat het `<div>`-element in webontwikkeling zo vaak als container dienstdoet, mag je de tagnaam `div` weglaten als je begint met een klasse of id:

```text
.kaart
```

Resultaat na `Tab`:

```html
<div class="kaart"></div>
```

### 3. Meerdere klassen combineren
Je plakt meerdere klassen achter elkaar met opeenvolgende punten:

```text
button.knop.knop-primair
```

Resultaat na `Tab`:

```html
<button class="knop knop-primair"></button>
```

### 4. Een uniek id (`#`)
Typ het hekje gevolgd door het id:

```text
header#hoofdbanner
```

Resultaat na `Tab`:

```html
<header id="hoofdbanner"></header>
```

## Hiërarchie: Nesten, Broers en Zussen

Met hiërarchische operatoren bouw je in één enkele regel een complete boomstructuur:

### 1. Kindelement: de groter-dan-pijl (`>`)
Met de `>`-operator nest je een element dieper binnen zijn ouder:

```text
article>h2
```

Resultaat na `Tab`:

```html
<article>
  <h2></h2>
</article>
```

### 2. Broer of zus: het plusteken (`+`)
Met het `+`-teken plaats je twee elementen op exact hetzelfde niveau, direct na elkaar:

```text
h2+p
```

Resultaat na `Tab`:

```html
<h2></h2>
<p></p>
```

### 3. Een niveau omhoog: het dakje (`^`)
Wanneer je diep genest bent, wil je soms terugkeren naar een hoger niveau in de boomstructuur. Met het dakje (`^`) klim je één stapje omhoog:

```text
div.container>p.tekst^footer
```

Resultaat na `Tab`:

```html
<div class="container">
  <p class="tekst"></p>
</div>
<footer></footer>
```

### 4. Groeperen met ronde haakjes `(...)`
Complexe pagina-onderdelen hou je overzichtelijk door logische blokken tussen ronde haakjes te plaatsen:

```text
header>(nav>ul>li>a)+div.profiel
```

Resultaat na `Tab`:

```html
<header>
  <nav>
    <ul>
      <li><a href=""></a></li>
    </ul>
  </nav>
  <div class="profiel"></div>
</header>
```

## Vermenigvuldigen, Doornummeren en Inhoud

Bij lijsten, navigatiemenu's en productroosters moet je vaak dezelfde structuur meermaals herhalen. Emmet automatiseert dit moeiteloos:

### 1. Vermenigvuldigen met het sterretje (`*`)
Voeg `*` toe gevolgd door een getal om een onderdeel meermaals te dupliceren:

```text
ul>li*3
```

Resultaat na `Tab`:

```html
<ul>
  <li></li>
  <li></li>
  <li></li>
</ul>
```

### 2. Automatisch doornummeren met de dollar (`$`)
Wil je oplopende nummers in klassenamen of id's? Gebruik het `$`-teken als teller (1, 2, 3...):

```text
ul>li.item-$*3
```

Resultaat na `Tab`:

```html
<ul>
  <li class="item-1"></li>
  <li class="item-2"></li>
  <li class="item-3"></li>
</ul>
```

### 3. Vaste tekst toevoegen met accolades `{...}`
Tekst die tussen de openende en sluitende tag moet staan, plaats je tussen accolades:

```text
a{Lees meer}
```

Resultaat na `Tab`:

```html
<a href="">Lees meer</a>
```

Je kan tellers en tekst moeiteloos combineren:

```text
ul>li{Stap $}*3
```

Resultaat na `Tab`:

```html
<ul>
  <li>Stap 1</li>
  <li>Stap 2</li>
  <li>Stap 3</li>
</ul>
```

### 4. Aangepaste attributen met rechte haken `[...]`
Tags zoals `<a>` en `<img>` krijgen standaard al hun belangrijkste attribuut mee. Wil je extra attributen specificeren, zoals `target="_blank"`, `alt` of `data-*` attributen? Plaats ze tussen rechte haken:

```text
img[src="foto.webp" alt="Campus Geel"]
```

Resultaat na `Tab`:

```html
<img src="foto.webp" alt="Campus Geel">
```

### 5. Dummytekst genereren met `lorem`
Tijdens het ontwerpen van een layout heb je vaak tijdelijke opvultekst (*placeholder text*) nodig om te zien hoe een paragraaf of lijst eruitziet. Emmet heeft een ingebouwde Lorem Ipsum-generator:

Typ `lorem` of `dummy` binnen een tag:

```text
p>lorem
```

Resultaat na `Tab`:

```html
<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias animi autem corporis cumque delectus doloribus ea eius eos eum fugit hic ipsa magni maiores minima nemo, nisi quasi, quo vel?</p>
```

Wil je een specifiek aantal woorden genereren? Voeg dan meteen het gewenste aantal woorden toe aan `lorem`. Dit is bijzonder handig voor compacte menu's of lijstjes:

```text
ul>li*5>lorem2
```

Resultaat na `Tab`:

```html
<ul>
  <li>Lorem ipsum.</li>
  <li>Dolor sit.</li>
  <li>Amet consectetur.</li>
  <li>Adipisicing elit.</li>
  <li>Alias animi.</li>
</ul>
```

## Emmet voor CSS in PhpStorm

Emmet beperkt zich niet tot HTML. Ook tijdens het schrijven van CSS-bestanden herkent PhpStorm de afkortingen en vult deze automatisch aan. Dit bespaart honderden toetsaanslagen per stylesheet.

In CSS typ je gewoon de afkorting binnen een selectieblok en druk je op `Tab` of `Enter`.

### 1. Afmetingen en het Box Model
- `w200` &rarr; `width: 200px;`
- `w100p` &rarr; `width: 100%;` (de `p` staat voor procent)
- `h50` &rarr; `height: 50px;`
- `m10` &rarr; `margin: 10px;`
- `m0-auto` &rarr; `margin: 0 auto;`
- `p15` &rarr; `padding: 15px;`
- `p10-20` &rarr; `padding: 10px 20px;`
- `bxz` &rarr; `box-sizing: border-box;`

### 2. Typografie en Kleuren
- `c#0284c7` &rarr; `color: #0284c7;`
- `bgc#f8fafc` &rarr; `background-color: #f8fafc;`
- `fz18` &rarr; `font-size: 18px;`
- `fwb` &rarr; `font-weight: bold;`
- `tac` &rarr; `text-align: center;`
- `lh1.5` &rarr; `line-height: 1.5;`

### 3. Display, Flexbox en Positionering
- `db` &rarr; `display: block;`
- `dib` &rarr; `display: inline-block;`
- `df` &rarr; `display: flex;`
- `jcc` &rarr; `justify-content: center;`
- `aic` &rarr; `align-items: center;`
- `pos:r` &rarr; `position: relative;`
- `pos:a` &rarr; `position: absolute;`
- `t0` &rarr; `top: 0;`
- `z10` &rarr; `z-index: 10;`

## Live Voorbeeld: Een complete component in één regel

Bekijk in de onderstaande interactieve CodeSandbox hoe een complete navigatiebalk en een artikelkaart zijn opgebouwd. Beide structuren werden in PhpStorm met elk slechts één compacte Emmet-instructie gegenereerd:

- Navigatiebalk: `nav.hoofdnav>ul.menu>li.menu-item*3>a{Link $}`
- Artikelkaart: `article.kaart>h3{Titel $}+p{Inhoud van kaart $}+a.knop{Lees meer}`

<CodeSandbox
  title="Emmet in Actie: Van afkorting naar volwaardige component"
  height="450px"
  initialTab="split"
  activeCodeTab="html"
  highlightHtml="13-17, 20-25"
  highlightCss="18, 30, 35, 41"
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Emmet Demo</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <!-- Gegenereerd met: nav.hoofdnav>ul.menu>li.menu-item*3>a{Link $} -->
  <nav class="hoofdnav">
    <ul class="menu">
      <li class="menu-item"><a href="#">Link 1</a></li>
      <li class="menu-item"><a href="#">Link 2</a></li>
      <li class="menu-item"><a href="#">Link 3</a></li>
    </ul>
  </nav>

  <!-- Gegenereerd met: article.kaart>h3{Titel $}+p{Inhoud van kaart $}+a.knop{Lees meer} -->
  <main class="grid">
    <article class="kaart">
      <h3>Titel 1</h3>
      <p>Inhoud van de eerste infokaart, gegenereerd via een snelle Emmet-formule.</p>
      <a href="#" class="knop">Lees meer</a>
    </article>
  </main>
</body>
</html>'
  css='/* Universele resetter */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
/* CSS variabelen */
:root {
  --kleur-primair: #0284c7;
  --kleur-accent: #e87722;
  --kleur-achtergrond: #f8fafc;
  --kleur-tekst: #1e293b;
  --kleur-wit: #ffffff;
}
/* Paginastijl */
body {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  background-color: var(--kleur-achtergrond);
  color: var(--kleur-tekst);
  padding: 1.5rem;
}
.hoofdnav {
  background-color: var(--kleur-primair);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}
.menu {
  list-style: none;
  display: flex;
  gap: 1rem;
}
.menu a {
  color: var(--kleur-wit);
  text-decoration: none;
  font-weight: bold;
}
.kaart {
  background-color: var(--kleur-wit);
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
  max-width: 360px;
}
.kaart h3 {
  margin-bottom: 0.5rem;
  color: var(--kleur-primair);
}
.kaart p {
  margin-bottom: 1rem;
  line-height: 1.5;
}
.knop {
  display: inline-block;
  background-color: var(--kleur-accent);
  color: var(--kleur-wit);
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
}'
  js=''
/>

## De Officiële Emmet Cheat Sheet

Emmet ondersteunt nog honderden andere afkortingen en combinaties. Heb je tijdens het programmeren nood aan een specifieke tag of complexe CSS-eigenschap? Raadpleeg dan altijd de officiële documentatie:

::: info Naslagwerk
Raadpleeg het complete overzicht van alle ondersteunde operatoren, HTML-tags en CSS-eigenschappen op de officiële [Emmet Documentation Cheat Sheet](https://docs.emmet.io/cheat-sheet/).
:::

<PageSummary>

### Syntaxis in een oogopslag

| Operator of Afkorting | Betekenis & Doel | Concreet Voorbeeld | Resultaat na Tab |
|---|---|---|---|
| `!` of `html:5` | Volledig HTML5-skelet | `!` | `<!DOCTYPE html><html lang="en">...` |
| `.` | Klasse toevoegen | `p.inleiding` | `<p class="inleiding"></p>` |
| `#` | Uniek ID toevoegen | `div#header` | `<div id="header"></div>` |
| `>` | Kindelement (nesten) | `ul>li` | `<ul><li></li></ul>` |
| `+` | Broer/zus (naast elkaar) | `h1+p` | `<h1></h1><p></p>` |
| `^` | Niveau omhoog klimmen | `div>p^footer` | `<div><p></p></div><footer></footer>` |
| `*` | Vermenigvuldigen (herhalen) | `li*3` | Drie `<li>` elementen |
| `$` | Teller (automatisch nummeren) | `li.item-$*2` | `<li class="item-1"></li><li class="item-2"></li>` |
| `{...}` | Inhoudstekst injecteren | `a{Klik hier}` | `<a href="">Klik hier</a>` |
| `lorem` | Dummytekst genereren | `p>lorem` | Paragraaf met Lorem Ipsum |
| `loremN` | N woorden dummytekst | `ul>li*5>lorem2` | 5 lijstitems met elk 2 woorden |
| `[...]` | Aangepaste attributen | `a[target="_blank"]` | `<a href="" target="_blank"></a>` |
| `m10-20` *(CSS)* | Marges instellen | `m10-20` | `margin: 10px 20px;` |
| `df` *(CSS)* | Flexbox activeren | `df` | `display: flex;` |

### Veelgemaakte fouten

- **Spaties invoegen in de afkorting:** Een afkorting zoals `nav > ul` breekt de Emmet-verwerker; schrijf altijd alles aaneengesloten (`nav>ul`).
- **Vergeten op `Tab` te drukken:** Emmet expandeert niet vanzelf als je op spatie of Enter drukt (afhankelijk van je editorinstellingen). Gebruik consequent de `Tab`-toets.
- **De cursor verplaatsen vóór expansie:** Als je een afkorting typt en eerst ergens anders in het bestand klikt, verliest PhpStorm de actieve afkorting.
- **Het taalattribuut laten staan op Engels:** Emmet genereert standaard `lang="en"`. Pas dit bij Nederlandstalige opdrachten aan naar `lang="nl"`.

### Tips voor beginners

- **Bouw stap voor stap op:** Begin met eenvoudige combinaties zoals `ul>li*4` en `.kaart`. Breid pas uit naar complexere formules zodra je de basisoperatoren vlot beheerst.
- **Benut CSS-afkortingen:** Typ in stylesheets nooit meer voluit `text-align: center;` of `background-color`. Gewoon `tac` of `bgc` gevolgd door `Tab` werkt veel sneller.
- **Houd de cheat sheet bij de hand:** Bookmark de [Emmet Cheat Sheet](https://docs.emmet.io/cheat-sheet/) in je browser tijdens het maken van labs en projecten.

</PageSummary>

## Oefeningen

Oefen je Emmet-vaardigheden rechtstreeks in PhpStorm. Maak een nieuw oefenbestand aan en genereer de gevraagde structuren telkens met **één enkele Emmet-regel**:

### Oefening 1: Navigatiemenu
Genereer een `<nav>` met de klasse `hoofdmenu`. Binnen deze navigatie bevindt zich een ongeordende lijst (`<ul>`) met vier lijstitems (`<li>`). Elk lijstitem bevat een hyperlink met de tekst `Pagina 1`, `Pagina 2`, `Pagina 3` en `Pagina 4`.
*(Tip: combineer `>`, `*`, `{...}` en `$`).*

### Oefening 2: Productkaart met attributen
Genereer een `<article>` met de klasse `product`. Binnen dit artikel staan:
1. Een afbeelding (`<img>`) met als bron `telefoon.webp` en alt-tekst `Smartphone`
2. Een tweede niveau kop (`<h2>`) met de tekst `Smartphone Pro`
3. Een paragraaf met de klasse `prijs` en de tekst `Prijs: € 599`
4. Een knop (`<button>`) met de klasse `bestel-knop` en tekst `In winkelmand`
*(Tip: gebruik de operatoren `>`, `+` en `[...]`).*

### Oefening 3: Snelle CSS-stijlen
Typ in een CSS-bestand in PhpStorm de snelste Emmet-afkortingen voor de volgende vijf declaraties en controleer of ze correct expanderen met `Tab`:
1. `display: flex;`
2. `justify-content: center;`
3. `margin: 0 auto;`
4. `font-size: 20px;`
5. `box-sizing: border-box;`
