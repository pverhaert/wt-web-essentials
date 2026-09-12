---
title: Lijsten
---

# Lijsten

In het HTML-hoofdstuk over lijsten heb je geleerd hoe je ongeordende lijsten (`<ul>`), geordende lijsten (`<ol>`) en beschrijvingslijsten (`<dl>`) semantisch correct opbouwt. Je ontdekte ook dat een lijst binnen een `<nav>`-element de vaste basis vormt voor vrijwel elk websitemenu.

Standaard voorziet de browser lijsten van ingebouwde stijlen: zwarte bolletjes (*bullets*), Arabische cijfers en een automatische linker binnenruimte van ongeveer `2.5rem` (40px). Met CSS kan je deze standaardopmaak volledig naar je hand zetten: van andere geometrische symbolen of Romeinse cijfers tot eigen afbeeldingsicoontjes, aangepaste kleuren met `::marker` of een volledige stijlreset voor navigatiebalken. Lees meer in de [MDN documentatie over lijsten en list-style](https://developer.mozilla.org/en-US/docs/Learn/CSS/Styling_text/Styling_lists).

## Leerdoelen

Na dit hoofdstuk kan je:

- De standaard opsommingstekens en nummeringen aanpassen met de eigenschap `list-style-type`
- Het visuele verschil tussen `list-style-position: outside` en `inside` uitleggen en toepassen
- Een eigen afbeelding of pictogram instellen als opsommingsteken met `list-style-image`
- De verkorte notatie (shorthand) `list-style` correct gebruiken
- Opsommingstekens en cijfers afzonderlijk stijlen en kleuren met het `::marker` pseudo-element
- Een lijst volledig ontdoen van lijststijlen (resetten) als voorbereiding op navigatiemenu's
- Sneller coderen met Emmet-sneltoetsen in PhpStorm

## Opsommingstekens wijzigen: `list-style-type`

Met de eigenschap `list-style-type` bepaal je welk symbool, cijferstelsel of teken er vóór elk lijstitem (`<li>`) verschijnt.

Je kan `list-style-type` toekennen aan het bovenliggende element (`<ul>` of `<ol>`). Omdat lijststijlen automatisch worden overgeërfd door de onderliggende `<li>`-elementen, krijgen alle items meteen hetzelfde teken.

```css
ul {
  list-style-type: square;
}

ol {
  list-style-type: upper-roman;
}
```

### Veelgebruikte waarden voor ongeordende lijsten (`<ul>`)

| Waarde | Voorbeeldweergave | Beschrijving |
|---|---|---|
| `disc` | • Item | Standaard gevuld rond bolletje |
| `circle` | ○ Item | Open cirkel met witte binnenkant |
| `square` | ■ Item | Gevuld zwart vierkantje |
| `none` | Item | Geen enkel opsommingsteken |

::: tip Geen markeringen: `list-style-type: none`
De instelling `list-style-type: none` is veruit de belangrijkste en meest gebruikte waarde in moderne webontwikkeling. Je gebruikt dit telkens wanneer een lijst de basis vormt voor een navigatiemenu, een knoppenrij of een lijst met kaarten.
:::

### Veelgebruikte waarden voor geordende lijsten (`<ol>`)

| Waarde | Nummering | Toepassing |
|---|---|---|
| `decimal` | 1, 2, 3, ... | Standaard westerse cijfers |
| `decimal-leading-zero` | 01, 02, 03, ... | Cijfers met een voorloopnul (strakke indexlijsten) |
| `lower-alpha` | a, b, c, ... | Kleine letters |
| `upper-alpha` | A, B, C, ... | Hoofdletters (bv. meerkeuzevragen) |
| `lower-roman` | i, ii, iii, ... | Kleine Romeinse cijfers |
| `upper-roman` | I, II, III, ... | Grote Romeinse cijfers (bv. hoofdstukindelingen) |

### Eigen tekens als opsommingsteken (String literals)

In moderne CSS kan je aan `list-style-type` ook een willekeurige tekst of een Unicode-symbool tussen aanhalingstekens meegeven:

```css
ul.checklist {
  list-style-type: "✓ ";
}

ul.stappen {
  list-style-type: "👉 ";
}
```

## Positie van de markering: `list-style-position`

Standaard plaatst de browser het opsommingsteken links **buiten** de tekstkolom van het lijstitem. Met de eigenschap `list-style-position` bepaal je of de markering buiten of binnen het tekstblok valt:

- **`outside` (standaard)**: De markering hangt links buiten de eigenlijke inhoud. Als een lijstitem over meerdere regels loopt, lijnen alle regels tekst netjes verticaal onder elkaar uit.
- **`inside`**: De markering wordt beschouwd als het allereerste teken binnen de eerste tekstregel. Als de tekst naar een tweede regel doorloopt, springt die tweede regel terug naar links, recht onder het opsommingsteken.

```css
ul.binnen {
  list-style-position: inside;
}
```

In de onderstaande sandbox zie je het verschil tussen `outside` en `inside` direct visueel gedemonstreerd dankzij de gekleurde kaders rondom de lijstitems:

<CodeSandbox
  title="List style types en positionering"
  height="480px"
  initialTab="split"
  activeCodeTab="css"
  highlightHtml=""
  highlightCss="34-35,39-40"
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lijststijlen en Positie</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <h3>1. list-style-position: outside (standaard)</h3>
  <ul class="buiten">
    <li>Het vierkantje bevindt zich links buiten de achtergrond van het lijstitem.</li>
    <li>Als een tekst langer is en doorloopt naar een tweede regel, blijft de tekst netjes ingesprongen staan naast de marker.</li>
  </ul>

  <h3>2. list-style-position: inside</h3>
  <ul class="binnen">
    <li>De open cirkel bevindt zich nu binnen de achtergrond en de rand van het lijstitem.</li>
    <li>Als de tekst afbreekt, loopt de tweede regel direct onder het opsommingsteken door.</li>
  </ul>
</body>
</html>'
  css='/* Universele resetter */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
/* Basisinstellingen */
body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.5;
  padding: 1.5rem;
  background-color: #ffffff;
  color: #222222;
}
/* Titel */
h3 {
  margin-bottom: 0.5rem;
  color: #1e2d5a;
}
/* Algemene lijststijl met binnenruimte */
ul {
  padding-left: 2rem;
  margin-bottom: 2rem;
}
/* Lijstitems met rand en achtergrond om de positie te tonen */
li {
  background-color: #f1f5f9;
  border: 1px solid #cbd5e1;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.5rem;
}
/* 1. Outside: marker hangt buiten het grijze kader */
ul.buiten {
  list-style-type: square;
  list-style-position: outside;
}
/* 2. Inside: marker zit binnen het grijze kader */
ul.binnen {
  list-style-type: circle;
  list-style-position: inside;
}'
  js=''
/>

## Eigen afbeeldingen als opsommingsteken: `list-style-image`

Wil je een eigen logo, icoontje of pijltje gebruiken als opsommingsteken? Dan kan je via `list-style-image` een afbeeldingsbestand inladen met de `url()`-functie:

```css
ul {
  /* Terugvalwaarde voor het geval de afbeelding niet laadt */
  list-style-type: square;
  /* Eigen icoontje */
  list-style-image: url("images/vinkje.png");
}
```

::: warning Beperkingen van `list-style-image`
De eigenschap `list-style-image` biedt geen mogelijkheid om de afmetingen van de afbeelding bij te sturen. Is jouw PNG of SVG 64 bij 64 pixels groot, dan zal het opsommingsteken ook effectief 64px groot getoond worden. Zorg er daarom voor dat de afbeelding vooraf exact op het gewenste formaat is opgeslagen (bijvoorbeeld 16 bij 16 pixels), of gebruik het moderne `::marker` pseudo-element.
:::

## Korte notatie: `list-style` (Shorthand)

Met de verkorte eigenschap `list-style` kan je type, positie en afbeelding in één enkele declaratie combineren:

```css
/* type en positie gecombineerd */
ul {
  list-style: square inside;
}

/* Alle lijststijlen in één keer uitschakelen */
ul.navigatie {
  list-style: none;
}
```

De volgorde van de waarden binnen de shorthand maakt niet uit.

## Kleur en formaat aanpassen: het `::marker` pseudo-element

Traditioneel kregen het bolletje en de tekst van een `<li>` altijd exact dezelfde tekstkleur. Wilde je een oranje bolletje met donkerblauwe tekst, dan moest je ingewikkelde omwegen gebruiken.

Met het moderne CSS **`::marker` pseudo-element** selecteer je rechtstreeks het opsommingsteken of het nummer van het lijstitem. Hierdoor kan je de kleur, de lettergrootte en de stijl van de markering onafhankelijk van de tekst aanpassen:

```css
/* De tekst van het lijstitem is donkerblauw */
li {
  color: #1e2d5a;
  font-family: Verdana, Geneva, sans-serif;
  margin-bottom: 0.5rem;
}

/* Het opsommingsteken (bolletje of cijfer) wordt warm oranje en vet */
li::marker {
  color: #EC6639;
  font-size: 1.2rem;
  font-weight: bold;
}
```

Binnen `::marker` kan je onder meer `color`, `font-size`, `font-weight`, `font-family` en `content` aanpassen.

In de onderstaande sandbox combineren we `::marker` met CSS-variabelen voor een professionele checklist van **Thomas More Campus Geel**:

<CodeSandbox
  title="Opsommingstekens stijlen met ::marker"
  height="460px"
  initialTab="split"
  activeCodeTab="css"
  highlightHtml=""
  highlightCss="10,43-45"
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Marker Styling Demo</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <div class="checklist-container">
    <h3>Thomas More Campus Geel</h3>
    <ol>
      <li>Activeer je studentenaccount en paswoord</li>
      <li>Verken het lessenrooster in het studentenportaal</li>
      <li>Installeer PhpStorm en Git op je laptop</li>
      <li>Start met de cursus Web Essentials</li>
    </ol>
  </div>
</body>
</html>'
  css='/* Universele resetter */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
/* Centrale variabelen */
:root {
  --tm-blauw: #1e2d5a;
  --tm-oranje: #EC6639;
  --succes-groen: #10b981;
}
/* Basisinstellingen */
body {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.5;
  padding: 1.5rem;
  background-color: #f8fafc;
  color: #222222;
}
/* Kaartkader */
.checklist-container {
  max-width: 26rem;
  background-color: #ffffff;
  border: 2px solid var(--tm-blauw);
  border-radius: 0.5rem;
  padding: 1.5rem;
}
/* Titel */
h3 {
  color: var(--tm-blauw);
  margin-bottom: 1rem;
}
/* Lijstopmaak */
ol {
  padding-left: 1.5rem;
}
/* Afzonderlijke lijstitems */
li {
  margin-bottom: 0.75rem;
  color: #333333;
}
/* Nummering stijlen in Thomas More oranje */
ol li::marker {
  color: var(--tm-oranje);
  font-weight: bold;
  font-size: 1.1rem;
}'
  js=''
/>

## De Lijst-Reset voor Navigatiemenu's

In HTML5 heb je geleerd dat het semantisch aanbevolen is om websitenavigatie te structureren als een ongeordende lijst:

```html
<nav>
  <ul class="hoofdmenu">
    <li><a href="index.html">Start</a></li>
    <li><a href="opleidingen.html">Opleidingen</a></li>
    <li><a href="contact.html">Contact</a></li>
  </ul>
</nav>
```

Om van die standaard verticale lijst met bolletjes een strakke menubalk te maken, moet je de lijst eerst **resetten**:

```css
ul.hoofdmenu {
  list-style: none; /* 1. Verwijdert de bolletjes */
  margin: 0;        /* 2. Verwijdert de standaard buitenmarge */
  padding: 0;       /* 3. Verwijdert de 40px linker binnenruimte */
}
```

Met deze drie regels code heb je een volledig neutrale lijst zonder opsommingstekens of inspringingen. In latere hoofdstukken (zoals Display en Flexbox) leer je hoe je de menu-items vervolgens moeiteloos horizontaal naast elkaar plaatst.

## Sneller werken met Emmet in PhpStorm

In PhpStorm genereer je CSS-lijsteigenschappen razendsnel via Emmet:

| Emmet-instructie | Toets | Resulterende CSS-code |
|---|---|---|
| `lis` | `Tab` | `list-style: ;` |
| `list:n` | `Tab` | `list-style: none;` |
| `list:s` | `Tab` | `list-style-type: square;` |
| `list:d` | `Tab` | `list-style-type: decimal;` |
| `lisp:i` | `Tab` | `list-style-position: inside;` |
| `lisp:o` | `Tab` | `list-style-position: outside;` |
| `lisi` | `Tab` | `list-style-image: url();` |

<PageSummary>

### Syntaxis in een oogopslag

| Wat | Hoe | Voorbeeld |
|---|---|---|
| Opsommingsteken / type | `list-style-type: waarde;` | `list-style-type: square;` |
| Positie van het teken | `list-style-position: outside \| inside;` | `list-style-position: inside;` |
| Afbeelding als teken | `list-style-image: url('pad');` | `list-style-image: url('./icoon.svg');` |
| Verkorte notatie | `list-style: type position image;` | `list-style: square inside;` |
| Tekens afzonderlijk stijlen | `li::marker { eigenschap: waarde; }` | `li::marker { color: #e87722; }` |
| Lijst-reset (menu's) | `list-style: none; margin: 0; padding: 0;` | Voor navigatie en knoppenrijen |

### Regels en afspraken

- **Overerving:** Pas `list-style-type` bij voorkeur toe op de `<ul>` of `<ol>`. De onderliggende `<li>`-elementen nemen deze stijl automatisch over.
- **Outside versus Inside:**
  - `outside` (standaard): het bolletje of nummer hangt buiten de tekstkolom. Bij meerdere regels lijnt de tweede regel netjes uit onder het eerste woord.
  - `inside`: het teken staat binnen het tekstelement en schuift mee met een achtergrondkleur of kader.
- **De Navigatie-Reset:** Een lijst die als navigatiemenu fungeert heeft drie resetregels nodig: `list-style: none;`, `margin: 0;` en `padding: 0;`. De browser voorziet namelijk standaard circa 40px linkerpadding.
- **`::marker` beperkingen:** Met de `::marker` pseudo-selector kan je enkel tekstgerelateerde eigenschappen stylen: `color`, `font-size`, `font-family` en `content`.

### Veelgemaakte fouten

- Enkel `list-style: none` instellen op een menulijst en vergeten `padding: 0` toe te voegen, waardoor de navigatie ongewenst 40px naar rechts ingesprongen blijft staan.
- `list-style-image` gebruiken met te grote bitmapafbeeldingen (CSS biedt geen eigenschap om de afmetingen van `list-style-image` direct te schalen).
- Vergeten dat een `<ol>` standaard Arabische cijfers (`decimal`) toont en een `<ul>` zwarte bollen (`disc`).
- Marges of padding proberen in te stellen op `::marker` (deze eigenschappen worden niet ondersteund op markers).

### Tips voor beginners

- Wil je een uniek emoji- of symboolteken zonder afbeelding? Gebruik `list-style-type: "👉 ";` of `li::marker { content: "✓ "; }`.
- Gebruik in PhpStorm de snelle Emmet-afkorting `list:n` + `Tab` om in een fractie van een seconde `list-style: none;` te genereren.
- Inspecteer in Google Chrome DevTools (`F12`) de `<ul>` of `<ol>`: in het tabblad **Styles** zie je direct de standaard `padding-inline-start: 40px` van de browser oplichten.

</PageSummary>

## Oefeningen


### Oefening 1: Romeins stappenplan met aangepaste positie

Maak een geordend stappenplan voor een practicum in het computerlokaal van **Thomas More Campus Geel**:

1. Maak een `<ol>` met vier stappen.
2. Stel de nummering in op grote Romeinse cijfers (`upper-roman`).
3. Stel `list-style-position: inside` in.
4. Geef elk lijstitem een lichte achtergrondkleur (`#f8fafc`), een rand van `1px solid #cbd5e1`, een afronding van `0.35rem` en een padding van `0.75rem`.
5. Stel vast hoe het Romeinse cijfer zich netjes binnen het gekleurde vlak bevindt.

### Oefening 2: Kleurrijke checklist met `::marker`

Bouw een takenlijst voor een project:

1. Maak een ongeordende lijst `<ul>` met minstens drie taken.
2. Declareer in `:root` de variabelen `--tm-blauw: #1e2d5a;` en `--tm-oranje: #EC6639;`.
3. Geef de lijstitems de kleur `var(--tm-blauw)` en een regelhoogte van `1.6`.
4. Gebruik de pseudo-selector `li::marker` om de opsommingstekens warm oranje (`var(--tm-oranje)`) te kleuren en iets groter te maken (`font-size: 1.25rem`).
5. Pas `list-style-type` aan naar vierkantjes (`square`) of een eigen vinkje (`"✓ "`).

### Oefening 3: De navigatielijst-reset

Zet de kale basis op voor een navigatiemenu:

1. Plaats een `<nav>` met daarin een `<ul>` en vier hyperlinks.
2. Verwijder de opsommingstekens met `list-style: none;`.
3. Verwijder zowel de `margin` als de `padding` van de `<ul>` zodat de lijst niet meer inspringt.
4. Geef de `nav` een donkerblauwe achtergrond `#1e2d5a` en een padding van `0.75rem 1rem`.
5. Geef de hyperlinks binnen de lijst een witte tekstkleur (`#ffffff`) en verwijder de onderstreping met `text-decoration: none`.

