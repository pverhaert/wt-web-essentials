---
title: Lettertypen
---

# Lettertypen en Tekstopmaak

Typografie is een van de belangrijkste onderdelen van webdesign: meer dan 90 procent van alle informatie op het internet bestaat uit tekst. Met CSS heb je volledige controle over hoe letters, woorden en alinea's worden weergegeven op het scherm van de bezoeker. In dit hoofdstuk leer je hoe je met standaard systeemlettertypen werkt, welke maateenheden je gebruikt voor schaalbare tekst en hoe je teksteigenschappen combineert voor een rustige, professionele leeservaring.

## Leerdoelen

Na dit hoofdstuk kan je:

- Het verschil tussen schreefloze (*sans-serif*) en geschreefde (*serif*) lettertypen toelichten en een correcte font-stack met generieke terugvalfamilie opstellen
- Het verschil uitleggen tussen absolute maateenheden (`px`) en relatieve maateenheden (`rem`), en beargumenteren waarom `rem` de voorkeur geniet
- Lettertype-eigenschappen toepassen om lettergrootte, gewicht, stijl en variant in te stellen
- Teksteigenschappen toepassen om regelhoogte, tekstuitlijning, hoofdlettergebruik, tekstonderlijning en schaduwen te regelen
- Rekening houden met toegankelijkheid (WCAG) bij het opmaken van tekst en hyperlinks
- Emmet-sneltoetsen in PhpStorm gebruiken om typografische CSS-stijlen snel te coderen

::: info Externe lettertypen en iconen
Wil je een uniek lettertype gebruiken dat niet standaard op de computer van de bezoeker staat (zoals Google Fonts of een eigen lettertypebestand), of wil je pictogrammen toevoegen? Dit leer je in het volgende hoofdstuk: [Webfonts en Iconen](./webfonts).
:::

## Lettertypefamilies: `font-family`

Elk stuk tekst op een webpagina heeft een lettertype. Welk lettertype de browser toont, hangt af van de eigenschap `font-family`.

Niet elke computer, tablet of smartphone beschikt over exact dezelfde collectie geïnstalleerde lettertypen. Zo staat het lettertype *Segoe UI* standaard op Windows, terwijl macOS en iOS de voorkeur geven aan *San Francisco* of *Helvetica Neue*.

Om te voorkomen dat tekst terugvalt op een willekeurig lelijk lettertype wanneer jouw eerste keuze niet aanwezig is, geef je in CSS een reeks van voorkeuren op: een **font-stack** (lettertypestapel).

```css
body {
  font-family: Arial, Helvetica, sans-serif;
}
```

De browser leest deze lijst van links naar rechts:

1. Eerst controleert de browser of **Arial** op het apparaat van de bezoeker staat. Is dat het geval, dan wordt Arial gebruikt.
2. Is Arial niet gevonden? Dan zoekt de browser naar het alternatief **Helvetica**.
3. Zijn beide lettertypen niet aanwezig? Dan valt de browser terug op de generieke lettertypefamilie **sans-serif**.

### Belangrijke regels voor `font-family`

- **Aanhalingstekens bij meerdelige namen:** Bevat de naam van een lettertype een of meer spaties (zoals `"Times New Roman"` of `"Trebuchet MS"`), dan moet je die naam tussen aanhalingstekens plaatsen. Voor namen uit één woord (zoals `Arial` of `Verdana`) zijn aanhalingstekens niet nodig.
- **Eindig altijd met een generieke familie:** De allerlaatste waarde in een `font-family` declaratie moet altijd een van de vijf standaard generieke families van het W3C zijn. Zo garandeer je dat de browser altijd een passend lettertype kiest.

### De 5 generieke lettertypefamilies

Het W3C definieert vijf generieke lettertypefamilies die elke webbrowser ter wereld herkent:

| Generieke familie | Kenmerken | Gebruik | Voorbeelden van fonts |
|---|---|---|---|
| `sans-serif` | Letters **zonder schreef** (zonder dwarsstreepjes aan de uiteinden). Strak, modern en zeer duidelijk leesbaar op beeldschermen. | Lopende tekst, alinea''s, artikels en gebruikersinterfaces. | Arial, Helvetica, Verdana, Tahoma, Trebuchet MS |
| `serif` | Letters **met schreef** (decoratieve voetjes of dwarsstreepjes). Klassiek, formeel en elegant. | Titels, boeken, krantenartikels en formele publicaties. | Times New Roman, Georgia, Garamond |
| `monospace` | Elk teken (letter, cijfer of spatie) heeft **exact dezelfde breedte**. | Broncode, programmeertalen en tabellen met getallen. | Courier New, Consolas, Monaco |
| `cursive` | Letters die ogen als een handgeschreven schrift of kalligrafie. | Citaten, uitnodigingen en informele uithangborden. | Comic Sans MS, Brush Script MT |
| `fantasy` | Vrij vormgegeven, speelse of decoratieve lettertypen. | Speelse titels of posters (wordt zelden gebruikt in professionele sites). | Impact, Papyrus |

```css
/* Voorbeelden van betrouwbare font stacks */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
}

h1, h2 {
  font-family: Georgia, "Times New Roman", serif;
}

code, pre {
  font-family: Consolas, "Courier New", monospace;
}
```

::: tip Schreefloos leest prettiger op schermen
Voor grote stukken tekst op beeldschermen (zoals alinea''s en artikels) kies je bij voorkeur een schreefloos lettertype (`sans-serif`). Schreefloze letters behouden hun scherpte en helderheid veel beter op lagere beeldschermresoluties dan geschreefde letters.
:::

## Maateenheden voor lettergrootte: `font-size`

Met de eigenschap `font-size` bepaal je de lettergrootte van een element.

In CSS bestaan tientallen maateenheden, maar voor moderne webontwikkeling zijn er twee van cruciaal belang: **`px`** (pixels) en **`rem`** (root em).

### 1. Pixels (`px`): absolute eenheid

Een pixel is een vast meetpunt op het beeldscherm. Als je instelt:

```css
p {
  font-size: 16px;
}
```

Dan heeft de tekst altijd een hoogte van exact 16 pixels.

- **Voordeel:** Eenvoudig te begrijpen en direct voorspelbaar.
- **Nadeel:** Pixels zijn rigide en houden geen rekening met de voorkeuren van de bezoeker. Bezoekers met een verminderd gezichtsvermogen stellen in hun browser vaak een grotere standaardlettergrootte in (bijvoorbeeld 20px in plaats van 16px). Hard gecodeerde pixelwaardes overschrijven deze gebruikersinstelling vaak, wat slecht is voor de **toegankelijkheid**.

### 2. Rem (`rem`): relatieve en moderne eenheid

De eenheid **`rem`** staat voor *root em*. Een `rem` is een relatieve eenheid die berekend wordt op basis van de lettergrootte van het hoofdelement van de pagina (het `<html>`-element).

Standaard hanteert elke webbrowser een basislettergrootte van **16px** op het root-element.

- `1rem` = 1 × 16px = 16px
- `1.25rem` = 1.25 × 16px = 20px
- `1.5rem` = 1.5 × 16px = 24px
- `2rem` = 2 × 16px = 32px
- `0.875rem` = 0.875 × 16px = 14px

```css
html {
  font-size: 16px; /* Dit is de standaard browserwaarde */
}

h1 {
  font-size: 2.5rem; /* 2.5 x 16px = 40px */
}

h2 {
  font-size: 1.75rem; /* 1.75 x 16px = 28px */
}

p {
  font-size: 1rem; /* 1 x 16px = 16px */
}

small {
  font-size: 0.875rem; /* 0.875 x 16px = 14px */
}
```

Als een slechtziende bezoeker zijn browser instelt op een standaardgrootte van 20px, schaalt jouw hele website automatisch en proportioneel mee (`1rem` wordt 20px, `h1` wordt 50px).

::: tip De gouden regel voor typografie
Gebruik voor typografie (`font-size`, `line-height`) altijd de eenheid **`rem`**. Zo blijft je website toegankelijk voor iedereen.
:::

## Letterdikte: `font-weight`

Met `font-weight` bepaal je de dikte (het gewicht) van de letters.

Je kan de dikte instellen met trefwoorden of met numerieke waarden:

```css
/* Met trefwoorden */
p {
  font-weight: normal; /* Standaardtekst (gelijk aan 400) */
}

strong, h1 {
  font-weight: bold; /* Vette tekst (gelijk aan 700) */
}

/* Met numerieke waarden (100 tot 900) */
h2 {
  font-weight: 600; /* Halfvet (semi-bold) */
}
```

| Waarde | Betekenis | Omschrijving |
|---|---|---|
| `normal` of `400` | Normaal gewicht | Standaard voor alinea''s en lopende tekst |
| `bold` of `700` | Vet | Standaard voor koppen (`<h1>`-`<h6>`) en `<strong>` |
| `lighter` of `300` | Licht / dun | Subtiele tekst |
| `bolder` of `900` | Extra zwaar / zwart | Uitgesproken titels |

::: info Numerieke gewichten bij systeemlettertypen
Niet elk systeemlettertype heeft alle 9 numerieke gewichten aan boord. Als een specifiek gewicht (zoals 600) niet beschikbaar is, kiest de browser automatisch het dichtstbijzijnde beschikbare gewicht (vaak 400 of 700).
:::

## Cursief en variant: `font-style` en `font-variant`

### `font-style`

Met `font-style` geef je aan of tekst schuingedrukt (cursief) moet worden weergegeven:

```css
p.citaat {
  font-style: italic; /* Cursieve tekst */
}

em {
  font-style: normal; /* Herstelt cursieve tekst weer naar rechtop */
}
```

- `normal`: de normale, rechtopstaande tekst (standaard).
- `italic`: de cursieve versie van het lettertype.

### `font-variant`

Met `font-variant` kan je tekst weergeven in **kleinkapitalen** (*small caps*). Kleine letters worden dan getoond als hoofdletters, maar met de hoogte van een kleine letter:

```css
h3 {
  font-variant: small-caps;
}
```

- `normal`: standaard weergave.
- `small-caps`: kleine letters worden getoond als verkleinde hoofdletters.

## Regelhoogte: `line-height`

De eigenschap `line-height` bepaalt de verticale afstand tussen opeenvolgende tekstregels binnen een alinea.

Een goed gekozen regelhoogte is essentieel voor comfortabel lezen. Staat tekst te dicht op elkaar, dan raken de ogen van de lezer vermoeid en slaat men regels over. Staat tekst te ver uit elkaar, dan verliezen alinea''s hun samenhang.

```css
/* GOED: regelhoogte als getal zonder eenheid */
p {
  line-height: 1.6;
}

/* MINDER FLEXIBEL: vaste eenheden */
p {
  line-height: 26px;
  line-height: 1.6rem;
}
```

### Waarom een getal zonder eenheid de beste keuze is

Geef `line-height` altijd op als een **vermenigvuldigingsfactor zonder eenheid** (zoals `1.5` of `1.6`).

De browser berekent de werkelijke regelhoogte dan als: `font-size` × `line-height`.

- Heeft een alinea een lettergrootte van `1rem` (16px) en `line-height: 1.6`, dan is de regelhoogte 16 × 1.6 = 25.6px.
- Erft een kop `<h1>` met `font-size: 2.5rem` (40px) deze factor over, dan berekent de browser automatisch 40 × 1.6 = 64px.
- Had je een vaste waarde zoals `24px` ingesteld, dan zouden de regels van de grote `<h1>`-kop dwars door elkaar heen lopen.

::: tip Richtlijnen voor regelhoogte
- **Lopende tekst (alinea''s):** kies een waarde tussen **`1.5` en `1.7`** voor een rustige leeservaring.
- **Koppen en titels:** kies een compactere waarde tussen **`1.1` en `1.3`**, omdat grote letters anders te veel witruimte tussen de regels creëren.
:::

::: info Line-height Spel
Wil je zelf ontdekken welke regelafstand jij het mooiste vindt? Speel het interactieve [Line-height Spel](../tools/line-height-spel) en elimineer de blokken die je het minst aanspreken tot er één winnaar overblijft.
:::

## De verkorte eigenschap: `font`

Met de verkorte eigenschap (shorthand) `font` kan je meerdere lettertype-eigenschappen in één enkele regel bundelen:

```css
/* Syntaxis:
   font: font-style font-variant font-weight font-size/line-height font-family; */

p {
  font: italic normal bold 1rem/1.6 Arial, sans-serif;
}
```

### Verplichte volgorde en vereisten bij `font`

- Zowel **`font-size`** als **`font-family`** zijn **verplicht**. Ontbreekt een van beide, dan negeert de browser de complete stijlregel.
- De optionele `line-height` schrijf je altijd direct achter de `font-size`, gescheiden door een schuine streep: `1rem/1.6`.
- De volgorde van de eigenschappen ligt vast. Eigenschappen die je weglaat, worden automatisch gereset naar hun beginwaarde (`normal`).

In de praktijk schrijven webontwikkelaars eigenschappen als `font-family`, `font-size` en `line-height` meestal los van elkaar, omdat dit veel overzichtelijker is en minder snel tot fouten leidt.

---

## Live voorbeeld: Lettertypen en regelhoogte

In het onderstaande interactieve voorbeeld zie je het verschil tussen verschillende lettertypefamilies, het effect van `rem`-schaling en hoe belangrijk een aangename `line-height` is.

<CodeSandbox
  title="Lettertypen, schaling en regelhoogte"
  height="450px"
  highlightHtml=""
  highlightCss=""
  highlightJs=""
  activeCodeTab="css"
  css="body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #1e2d5a;
  background-color: #f8fafc;
  padding: 20px;
}
h1 {
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  color: #e87722;
  margin-bottom: 0.5rem;
}
.intro {
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.5;
  color: #334155;
}

p {
  font-size: 1rem;
  line-height: 1.6;
  color: #475569;
}
.code-voorbeeld {
  font-family: Consolas, 'Courier New', monospace;
  background-color: #e2e8f0;
  padding: 2px 6px;
  border-radius: 4px;
}"
  html="<!DOCTYPE html>
<html lang=&quot;nl&quot;>
<head>
  <meta charset=&quot;UTF-8&quot;>
  <title>Typografie voorbeeld</title>
  <link rel=&quot;stylesheet&quot; href=&quot;stijl.css&quot;>
</head>
<body>
  <h1>Thomas More Campus Geel</h1>
  <p class=&quot;intro&quot;>Welkom bij de opleiding Toegepaste Informatica in de IT Factory.</p>
  <p>In deze module leer je hoe je professionele en toegankelijke typografie ontwerpt. Door het combineren van een betrouwbare font stack met relatieve eenheden zoals <span class=&quot;code-voorbeeld&quot;>rem</span> blijft jouw website vlot leesbaar op elk denkbaar beeldscherm.</p>
</body>
</html>"
/>

---

## Tekstuitlijning: `text-align`

Met `text-align` bepaal je de horizontale uitlijning van tekst binnen een blokelement:

```css
h1 {
  text-align: center; /* Tekst centreren */
}

.prijs {
  text-align: right; /* Tekst rechts uitlijnen */
}
```

| Waarde | Effect | Toepassing |
|---|---|---|
| `left` | Lijn tekst links uit (standaard in westerse talen) | Alinea''s, artikels, lijsten |
| `center` | Centreert elke regel in het midden van het element | Titels, banners, badges |
| `right` | Lijn tekst rechts uit | Financiële tabellen, datums, handtekeningen |
| `justify` | Vult regels uit over de volle breedte door spaties te rekken | Boeken en krantenkolommen |

::: warning Vermijd `text-align: justify` op het web
In drukwerk (zoals kranten) wordt uitvullen veel gebruikt, maar daar worden woorden automatisch afgebroken met koppeltekens. Op het web breekt een browser woorden standaard niet af, waardoor er grote, onregelmatige openingen ("witte rivieren") tussen woorden ontstaan. Dit bemoeilijkt het lezen ernstig, vooral voor personen met dyslexie.
:::

## Hoofdlettergebruik: `text-transform`

Met `text-transform` wijzig je het hoofdlettergebruik van tekst zonder de originele HTML-code aan te passen:

```css
.knop {
  text-transform: uppercase; /* ALLES IN HOOFDLETTERS */
}

.auteur {
  text-transform: capitalize; /* Elk Woord Begint Met Een Hoofdletter */
}
```

- `none`: geen transformatie; de tekst wordt getoond exact zoals getypt in HTML (standaard).
- `uppercase`: transformeert alle letters naar hoofdletters (`HOOFDLETTERS`).
- `lowercase`: transformeert alle letters naar kleine letters (`kleine letters`).
- `capitalize`: maakt de eerste letter van elk woord een hoofdletter (`Elk Woord Begint Met Hoofdletter`).

::: tip Schrijf semantische HTML
Als een navigatieknop in hoofdletters moet verschijnen, typ je in HTML gewone tekst (`<a href="#">Contact</a>`) en pas je `text-transform: uppercase;` toe in CSS. Zo blijft de tekst natuurlijk voor schermlezers en zoekmachines.
:::

## Tekstdecoratie en hyperlinks: `text-decoration`

Met `text-decoration` voeg je lijnen toe aan tekst, of verwijder je juist bestaande lijnen:

```css
/* Onderlijning verwijderen van hyperlinks */
a {
  text-decoration: none;
}

/* Belangrijke mededeling onderlijnen */
.opvallend {
  text-decoration: underline;
}

/* Oude prijs doorstrepen */
.oude-prijs {
  text-decoration: line-through;
}
```

Je kan moderne browsers ook extra details meegeven over de lijnstijl en -kleur:

```css
a:hover {
  text-decoration: underline dotted #e87722; /* Gestippelde oranje lijn */
}
```

### Toegankelijkheid (WCAG) bij hyperlinks

Browsers onderlijnen hyperlinks standaard met een blauwe lijn. Veel ontwerpers zetten meteen `text-decoration: none;` op alle links om de lijn weg te halen.

Volgens de internationale richtlijnen voor webtoegankelijkheid (**WCAG 2.1**) moet je hier echter heel voorzichtig mee zijn:

1. **Herkenbaarheid:** Als een link binnen een lopende alinea niet onderlijnd is, zien bezoekers (en zeker kleurenblinde gebruikers) vaak niet dat het om een klikbare link gaat.
2. **Kleurcontrast:** Verwijder je de onderlijning in lopende tekst, dan moet de kleur van de link een contrastverhouding van minstens **3:1** hebben ten opzichte van de omringende tekst.
3. **Interactie:** Zorg altijd voor een duidelijke visuele verandering wanneer de bezoeker met de muis over de link beweegt (`:hover`) of met het toetsenbord naar de link navigeert (`:focus`), zoals het opnieuw tonen van een onderlijning.

```css
/* Goede praktijk voor hyperlinks in tekst */
p a {
  color: #0284c7;
  text-decoration: underline;
}

p a:hover,
p a:focus {
  color: #0369a1;
  text-decoration-thickness: 2px;
}
```

## Tekstschaduw: `text-shadow`

Met `text-shadow` voeg je een schaduweffect toe achter letters. Dit kan diepte creëren of de leesbaarheid van een titel op een foto verbeteren.

### Syntaxis van `text-shadow`

```css
selector {
  text-shadow: [horizontale-verschuiving] [verticale-verschuiving] [vervaging] [kleur];
}
```

```css
h1 {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
}
```

- **Horizontale verschuiving (hoff):** verplicht. Positieve waarden schuiven de schaduw naar rechts, negatieve naar links.
- **Verticale verschuiving (voff):** verplicht. Positieve waarden schuiven de schaduw omlaag, negatieve omhoog.
- **Vervaging (blur radius):** optioneel (standaard `0`). Een hogere waarde maakt de schaduw zachter en waziger.
- **Kleur:** optioneel maar aanbevolen.

::: tip Maak schaduwen subtiel
Gebruik voor moderne ontwerpen altijd een deels transparante kleur (zoals `rgba(0, 0, 0, 0.2)` of `rgba(30, 45, 90, 0.15)`). Felle, dekkende schaduwen (zoals knalrood of gitzwart zonder vervaging) ogen gedateerd en maken tekst lastig leesbaar.
:::

---

## Live voorbeeld: Tekstopmaak, knoppen en schaduwen

In dit voorbeeld combineren we `text-transform`, `text-decoration`, `text-shadow` en toegankelijke links tot een aantrekkelijk geheel:

<CodeSandbox
  title="Tekstopmaak, links en schaduw"
  height="460px"
  highlightHtml=""
  highlightCss=""
  highlightJs=""
  activeCodeTab="css"
  css="body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
  background-color: #f1f5f9;
  padding: 24px;
}

.kaart {
  background-color: #ffffff;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  max-width: 500px;
}

h2 {
  font-size: 1.5rem;
  color: #1e2d5a;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 1px 1px 2px rgba(30, 45, 90, 0.2);
  margin-top: 0;
}

p {
  line-height: 1.6;
  color: #334155;
}

p a {
  color: #0284c7;
  text-decoration: underline;
  font-weight: 600;
}

p a:hover {
  color: #0369a1;
}

.knop {
  display: inline-block;
  background-color: #e87722;
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
}

.knop:hover {
  background-color: #d4641a;
}"
  html="<!DOCTYPE html>
<html lang=&quot;nl&quot;>
<head>
  <meta charset=&quot;UTF-8&quot;>
  <title>Kaart voorbeeld</title>
  <link rel=&quot;stylesheet&quot; href=&quot;stijl.css&quot;>
</head>
<body>
  <div class=&quot;kaart&quot;>
    <h2>Informatiedag</h2>
    <p>Bezoek onze campus en ontdek de opleidingen van de IT Factory. Raadpleeg het volledige programma op de <a href=&quot;https://thomasmore.be&quot; target=&quot;_blank&quot;>website van Thomas More</a>.</p>
    <a href=&quot;#&quot; class=&quot;knop&quot;>Schrijf je in</a>
  </div>
</body>
</html>"
/>

---

## Handige Emmet-sneltoetsen in PhpStorm

Typ in PhpStorm (of in de interactieve CodeSandbox van deze cursus) binnen een CSS-declaratieblok de onderstaande afkorting en druk op `Tab`:

::: tip Ook in de CodeSandbox
Alle onderstaande afkortingen (zoals `ff:v`, `fv:sc` en `tal`) werken zowel in PhpStorm als in de inline en fullscreen CodeSandbox van deze cursus.
:::

| Emmet-code | Druk op `Tab` | Gegenereerde CSS-code |
|---|---|---|
| `ff:v` | `Tab` | `font-family: Verdana, Geneva, sans-serif;` |
| `ff:ss` | `Tab` | `font-family: sans-serif;` |
| `ff:s` | `Tab` | `font-family: serif;` |
| `ff:m` | `Tab` | `font-family: monospace;` |
| `fz1.25rem` | `Tab` | `font-size: 1.25rem;` |
| `fwb` | `Tab` | `font-weight: bold;` |
| `fwn` | `Tab` | `font-weight: normal;` |
| `fsi` | `Tab` | `font-style: italic;` |
| `fv:sc` | `Tab` | `font-variant: small-caps;` |
| `lh1.6` | `Tab` | `line-height: 1.6;` |
| `tal` | `Tab` | `text-align: left;` |
| `tac` | `Tab` | `text-align: center;` |
| `tar` | `Tab` | `text-align: right;` |
| `ttu` | `Tab` | `text-transform: uppercase;` |
| `ttl` | `Tab` | `text-transform: lowercase;` |
| `ttc` | `Tab` | `text-transform: capitalize;` |
| `tdu` | `Tab` | `text-decoration: underline;` |
| `tdn` | `Tab` | `text-decoration: none;` |
| `tsh` | `Tab` | `text-shadow: hoff voff blur #000;` |

---

## Oefeningen

Oefen de theorie in door de onderstaande praktische opdrachten uit te voeren in PhpStorm. Maak voor elke oefening een nieuw HTML- en CSS-bestand aan.

### Oefening 1: Typografische schaal voor een nieuwsbericht

Maak een webpagina met een nieuwsbericht voor Thomas More Campus Geel.

**Instructies:**
1. Maak een HTML-bestand `nieuws.html` met een hoofding `<h1>`, een subtitel `<h2>`, een publicatiedatum `<p class="datum">` en twee alinea's met tekst.
2. Maak een extern stijlblad `stijl.css` aan en koppel dit aan je HTML-bestand.
3. Pas de volgende typografische regels toe:
   - Stel voor de `body` een schreefloze font-stack in: `-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif`.
   - Geef de `body` een basislettergrootte van `1rem` en een regelhoogte van `1.6`.
   - Geef de `<h1>` een lettergrootte van `2.25rem`, een regelhoogte van `1.2`, een gewicht van `700` en een donkerblauwe kleur `#1e2d5a`.
   - Geef de `<h2>` een lettergrootte van `1.5rem`, cursieve stijl (`font-style: italic`), een gewicht van `600` en de oranje merkkleur `#e87722`.
   - Geef de publicatiedatum een kleinere lettergrootte `0.875rem`, kleinkapitalen (`font-variant: small-caps`) en een grijze kleur `#64748b`.
4. Open de pagina in Google Chrome en controleer met DevTools (`F12`) of alle berekende groottes kloppen.

### Oefening 2: Toegankelijke navigatiebalk en links

Bouw een compacte navigatiebalk met toegankelijke links en knoppen.

**Instructies:**
1. Maak een navigatiebalk `<nav>` met vier links: `Home`, `Opleidingen`, `Campus Geel`, en `Contact`.
2. Schrijf de links in HTML met gewone kleine letters en beginhoofdletters.
3. Vorm de links in CSS om:
   - Verwijder de standaard onderlijning met `text-decoration: none;`.
   - Zet de tekst om naar hoofdletters met `text-transform: uppercase;`.
   - Stel het gewicht in op `600` (halfvet) en de lettergrootte op `0.875rem`.
   - Voeg een ruime tussenafstand toe tussen de letters met `letter-spacing: 1px;`.
4. Zorg voor duidelijke `:hover` en `:focus` toestanden:
   - Wanneer de gebruiker over een link beweegt of er via de Tab-toets op focust, krijgt de link een oranje kleur `#e87722` en verschijnt er een onderlijning van 2 pixels dik (`text-decoration: underline;`).
5. Voeg aan de vierde link (`Contact`) de klasse `.knop` toe, geef deze een oranje achtergrondkleur en witte tekst, en zorg dat de tekst gecentreerd staat.

### Oefening 3: Quote met stijlvolle typografie en schaduw

Ontwerp een opvallende quote-banner voor een brochure van de IT Factory.

**Instructies:**
1. Maak een `<div class="quote-kaart">` met daarin een citaat (`<blockquote>`) en de naam van de auteur (`<cite>`).
2. Voorbeeldtekst:
   - Citaat: *"De enige manier om geweldig werk te leveren, is door te houden van wat je doet."*
   - Auteur: *Steve Jobs*
3. Geef het citaat een klassiek geschreefd lettertype (`font-family: Georgia, "Times New Roman", serif;`).
4. Stel de lettergrootte in op `1.5rem`, de stijl op `italic` en centreer de tekst (`text-align: center;`).
5. Voeg aan de titel van de kaart een subtiele tekstschaduw toe: een verschuiving van 1px horizontaal, 2px verticaal, een vervaging van 4px en een deels transparante zwarte tint `rgba(0, 0, 0, 0.15)`.
6. Zorg dat de auteur onder het citaat in schreefloze kleinkapitalen verschijnt (`font-variant: small-caps;`).
