---
title: Basistags
---

# Basistags

In het vorige hoofdstuk heb je gezien hoe het basisskelet van een HTML-document is opgebouwd. In dit hoofdstuk bekijken we de elementen waarmee je de eigenlijke inhoud in de `<body>` vormgeeft en van betekenis voorziet: van koppen en alinea's tot semantische structuurbouwstenen.

## Leerdoelen

Na dit hoofdstuk kan je:

- De meest gebruikte inhoudstags van HTML5 toepassen (`<h1>` tot en met `<h6>`, `<p>`, `<hr>`, `<br>`, `<strong>`, `<em>`, `<code>`, `<pre>`)
- Het fundamentele verschil uitleggen tussen blokelementen en inline-elementen
- De rol en functie beschrijven van de neutrale containers `<div>` en `<span>`
- Een logische en toegankelijke koppenhiërarchie opbouwen
- Semantische structuurelementen gebruiken (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`)
- Commentaar toevoegen aan je code en handige sneltoetsen in PhpStorm benutten

## Commentaar in HTML

Tijdens het programmeren wil je regelmatig toelichting achterlaten voor jezelf of voor medestudenten. Ook kan het handig zijn om een stuk code tijdelijk uit te schakelen zonder het meteen te wissen. Daarvoor gebruik je **commentaar**.

Commentaar begint met `<!--` en eindigt met `-->`:

```html
<!-- Dit is een enkele regel commentaar -->

<!--
  Dit is commentaar
  dat zich uitstrekt
  over meerdere regels
-->
```

De browser negeert alles wat tussen deze markeringen staat. Het is dus niet zichtbaar op de uiteindelijke webpagina.

::: tip Sneltoets in PhpStorm
Plaats je cursor op een regel (of selecteer meerdere regels) en druk op `Ctrl` + `/` (Windows) of `Cmd` + `/` (macOS). PhpStorm plaatst automatisch de commentaartags rond je selectie. Druk je nogmaals op de sneltoets, dan wordt het commentaar weer verwijderd.
:::

## Blokelementen en inline-elementen

HTML-elementen worden opgesplitst in twee belangrijke hoofdcategorieën: <dfn title="Een HTML-element dat standaard op een nieuwe regel begint en de volledige breedte van zijn ouder inneemt">blokelementen</dfn> (block-level elements) en <dfn title="Een HTML-element dat in de lopende tekststroom blijft en uitsluitend de breedte van zijn eigen inhoud inneemt">inline-elementen</dfn> (inline elements).

### Blokelementen (block-level)

- Beginnen standaard altijd op een **nieuwe regel**.
- Nemen standaard de **volledige breedte** van het beschikbare scherm in beslag.
- Mogen andere blokelementen en inline-elementen bevatten.
- Voorbeelden: `<h1>` tot en met `<h6>`, `<p>`, `<hr>`, `<header>`, `<main>`, `<footer>`, `<div>`.

### Inline-elementen (inline)

- Beginnen **niet** op een nieuwe regel, maar blijven netjes in de lopende tekststroom.
- Nemen enkel de breedte in die strikt nodig is voor hun inhoud.
- Staan meestal binnenin een blokelement (zoals een alinea).
- Mogen in de regel geen blokelementen bevatten.
- Voorbeelden: `<strong>`, `<em>`, `<br>`, `<code>`, `<span>`.

### De neutrale containers: `<div>` en `<span>`

Naast elementen met een specifieke betekenis (zoals alinea's en koppen) kent HTML twee algemene, neutrale containers:

- **`<div>` (division):** Een neutraal **blokelement**. Het heeft van zichzelf geen enkele visuele stijl of betekenis, maar dient om een groep elementen samen te bundelen.
- **`<span>`:** Een neutraal **inline-element**. Het heeft eveneens geen eigen betekenis, maar dient om een specifiek stukje tekst binnen een zin te omvatten.

::: info Belangrijke opmerking over `<div>` en `<span>`
Omdat `<div>` en `<span>` geen semantische betekenis hebben, gebruik je ze in HTML5 pas wanneer er geen geschikte semantische tag (zoals `<article>`, `<nav>` of `<strong>`) voorhanden is. Ze worden vooral gebruikt als kapstok om stijlen toe te passen met <abbr title="Cascading Style Sheets: de stijlen- en opmaaktaal voor websites">CSS</abbr> of interactie toe te voegen met JavaScript. In het [CSS-gedeelte van deze cursus](/css/) komen `<div>` en `<span>` veel uitgebreider aan bod om vormgeving toe te kennen.
:::

## Koppen: `<h1>` tot en met `<h6>`

HTML kent zes niveaus van koppen, genummerd van `<h1>` (de belangrijkste kop) tot en met `<h6>` (het diepste onderniveau).

```html
<h1>Hoofdtitel van het document (niveau 1)</h1>
<h2>Tussentitel (niveau 2)</h2>
<h3>Deeltitel (niveau 3)</h3>
<h4>Subtitel (niveau 4)</h4>
<h5>Laag niveau (niveau 5)</h5>
<h6>Laagste niveau (niveau 6)</h6>
```

<CodeSandbox
  title="Voorbeeld: Koppen h1 tot en met h6"
  highlightHtml=""
  highlightCss=""
  highlightJs=""
  html="<h1>Hoofdtitel van het document (niveau 1)</h1>
<h2>Tussentitel (niveau 2)</h2>
<h3>Deeltitel (niveau 3)</h3>
<h4>Subtitel (niveau 4)</h4>
<h5>Laag niveau (niveau 5)</h5>
<h6>Laagste niveau (niveau 6)</h6>"
  height="320px"
/>

### Regels voor een goede koppenhiërarchie

Koppen dienen om je document een duidelijke structuur te geven. Schermlezers voor slechtzienden en zoekmachines gebruiken deze structuur om een inhoudsopgave van je pagina samen te stellen.

Houd je daarom aan deze richtlijnen:

1. **Maximaal een `<h1>` per pagina:** De `<h1>` beschrijft het hoofdonderwerp van de volledige pagina.
2. **Sla geen niveaus over:** Ga van een `<h1>` altijd eerst naar een `<h2>`. Gebruik pas een `<h3>` als onderdeel van die `<h2>`. Spring nooit rechtstreeks van `<h1>` naar `<h3>`.
3. **Gebruik koppen niet voor lay-out:** Maak een tekst niet `<h1>` louter omdat je wilt dat het woord groter of vetter wordt weergegeven. Voor visuele aanpassingen gebruik je straks CSS.
4. **Beperk je in de praktijk:** In het overgrote deel van de websites heb je enkel `<h1>`, `<h2>`, `<h3>` en af en toe `<h4>` nodig. De tags `<h5>` en `<h6>` voegen zelden iets toe aan de leesbaarheid.

::: tip Emmet in PhpStorm
Typ in PhpStorm `h1{Mijn titel}` en druk op de `Tab`-toets. PhpStorm zet dit meteen om naar `<h1>Mijn titel</h1>`.
:::

## Alinea's: `<p>`

Voor gewone lopende tekst gebruik je het `<p>`-element (paragraph of alinea).

```html
<p>
  Web Essentials is een basiscursus waarin je de fundamenten leert van moderne
  webontwikkeling. Je leert schrijven volgens officiële webstandaarden.
</p>
```

<CodeSandbox
  title="Voorbeeld: Alinea's en blokelementen"
  highlightHtml=""
  highlightCss=""
  highlightJs=""
  html="<h1>Web Essentials</h1>
<p>Dit is de eerste alinea. Een alinea is een blokelement en begint altijd op een nieuwe regel.</p>
<p>Dit is de tweede alinea. De browser voorziet automatisch standaard witruimte tussen de alinea's.</p>"
  height="280px"
/>

Een `<p>` is een blokelement. De browser plaatst automatisch een standaard witruimte (marge) boven en onder elke alinea, zodat alinea's duidelijk van elkaar gescheiden zijn.

::: tip Dummytekst genereren met Lorem Ipsum
Moet je een lay-out testen maar heb je nog geen definitieve tekst? Typ in PhpStorm `p*2>lorem` en druk op `Tab`. PhpStorm genereert meteen twee alinea's met Latijnse voorbeeldtekst (Lorem Ipsum).
:::

## Onderbrekingen: `<hr>` en `<br>`

Zowel `<hr>` als `<br>` zijn **lege elementen** (void elements). Ze hebben geen sluitende tag en bevatten geen tekstinhoud.

### Thematische scheiding: `<hr>`

Het `<hr>`-element (horizontal rule) markeert een **thematische overgang** tussen onderwerpen op een pagina. De browser toont dit standaard als een dunne horizontale lijn over de breedte van de pagina:

```html
<p>Hier eindigt het verslag van het eerste projectdeel.</p>
<hr>
<p>Hier begint het verslag van het tweede projectdeel.</p>
```

### Regelafbreking: `<br>`

Met `<br>` (break) forceer je een regeleinde binnen de lopende tekst, zonder een nieuwe alinea te starten:

```html
<p>
  Thomas More Campus Geel<br>
  Kleinhoefstraat 4<br>
  2440 Geel
</p>
```

<CodeSandbox
  title="Voorbeeld: Onderbrekingen met hr en br"
  highlightHtml=""
  highlightCss=""
  highlightJs=""
  html="<h3>Contactgegevens</h3>
<p>
  Thomas More Campus Geel<br>
  Kleinhoefstraat 4<br>
  2440 Geel
</p>
<hr>
<p>De lijn hierboven is een thematische scheiding (hr). De regeleindes in het adres zijn gemaakt met br.</p>"
  height="320px"
/>

::: danger Gebruik `<br>` nooit voor witruimte
Een veelgemaakte beginnersfout is om meerdere keren `<br><br><br>` na elkaar te typen om extra witruimte te maken tussen elementen. Dit is ten strengste verboden volgens de webstandaarden. Witruimte hoort thuis in CSS via marges en binnenruimtes (`margin` en `padding`). Gebruik `<br>` uitsluitend op plaatsen waar de afbreking deel uitmaakt van de inhoud zelf, zoals bij een postadres of in een gedicht.
:::

## Tekstnadruk: `<strong>` en `<em>`

Wanneer je bepaalde woorden in een zin extra wilt benadrukken, gebruik je `<strong>` of `<em>`. Dit zijn beide inline-elementen.

```html
<p>
  Je moet je inschrijving voltooien <strong>voor 1 oktober</strong>.
</p>
<p>
  Ik zei dat <em>jij</em> het bestand moest opslaan, niet je buurman.
</p>
```

<CodeSandbox
  title="Voorbeeld: Tekstnadruk met strong en em"
  highlightHtml=""
  highlightCss=""
  highlightJs=""
  html="<p>
  Je moet je inschrijving voltooien <strong>voor 1 oktober</strong>.
</p>
<p>
  Ik zei dat <em>jij</em> het bestand moest opslaan, niet je buurman.
</p>"
  height="260px"
/>

- **`<strong>` (belangrijk):** Geeft aan dat een woord of zinsdeel van groot belang of dringend is. De browser toont dit standaard in vette letters. Voorleessoftware leest deze tekst met een nadrukkelijkere, luidere toon voor.
- **`<em>` (klemtoon):** Staat voor *emphasis* en legt klemtoon op een woord, waardoor de betekenis van de zin subtiel verandert. De browser toont dit standaard cursief (schuingedrukt). Voorleessoftware last een lichte pauze in en verandert van intonatie.

::: warning Geen `<b>` of `<i>` voor semantiek
In oudere HTML-cursussen zag je vroeger vaak `<b>` (bold) en `<i>` (italic). Die tags bepalen louter het visuele uiterlijk en hebben geen semantische betekenis voor zoekmachines of schermlezers. In modern webdesign kies je voor `<strong>` en `<em>` wanneer de betekenis centraal staat.
:::

## Computercode en vooropgemaakte tekst: `<code>` en `<pre>`

Als webontwikkelaar wil je op een webpagina regelmatig stukjes code, commando's of computertaal tonen. Daarvoor gebruik je de tags `<code>` en `<pre>`.

### Inline code: `<code>`

Het `<code>`-element is een **inline-element**. Je gebruikt het om een kort stukje code, een bestandsnaam, een HTML-tag of een terminalcommando binnen een lopende zin aan te duiden:

```html
<p>
  Typ het commando <code>npm run dev</code> om de ontwikkelserver op te starten.
</p>
```

De browser toont de inhoud van een `<code>`-tag standaard in een **monospace-lettertype** (waarbij elk teken, zoals de letter 'i' en de letter 'm', exact evenveel breedte inneemt).

### Vooropgemaakte tekst: `<pre>`

Normaal gesproken voegt een browser meerdere opeenvolgende spaties of enters in je HTML-code samen tot een enkele spatie. Het `<pre>`-element (preformatted text) is een **blokelement** dat dit gedrag uitschakelt:

- De browser behoudt **exact** alle spaties, tabs en regeleindes zoals je ze in de broncode typt.
- De tekst wordt eveneens weergegeven in een monospace-lettertype.

### Meerdere regels code tonen: `<pre><code>`

Wanneer je een compleet codeblok van meerdere regels op je website wilt tonen, combineer je beide tags. Je plaatst het `<code>`-element dan binnenin het `<pre>`-element:

```html
<pre><code>function begroet(naam) {
  console.log("Welkom bij Web Essentials, " + naam);
}</code></pre>
```

<CodeSandbox
  title="Voorbeeld: Computercode met code en pre"
  highlightHtml=""
  highlightCss=""
  highlightJs=""
  html="<p>
  Gebruik de tag <code>&amp;lt;h1&amp;gt;</code> voor de hoofdtitel van je pagina.
</p>
<pre><code>&amp;lt;header&amp;gt;
  &amp;lt;h1&amp;gt;Thomas More IT Factory&amp;lt;/h1&amp;gt;
&amp;lt;/header&amp;gt;</code></pre>"
  height="300px"
/>

::: tip Speciale tekens in codeblokken
Wanneer je letterlijk een HTML-tag zoals `<h1>` binnen een `<code>`-element op het scherm wilt tonen, moet je de punthaken typen als speciale tekens: `&lt;` voor `<` en `&gt;` voor `>`. Anders denkt de browser dat het om een echte HTML-tag gaat. Dit komt uitgebreid aan bod in het hoofdstuk [Speciale Tekens](/html/speciale-tekens).
:::

## Semantische HTML5-structuurtags

In plaats van een webpagina willekeurig vol te zetten met algemene blokken, biedt HTML5 betekenisvolle <dfn title="HTML-elementen met een specifieke betekenis en functie (zoals header, nav, main, article) die de rol van de inhoud verduidelijken">semantische structuurtags</dfn>. Deze elementen vertellen aan zoekmachines en ondersteunende software precies welk doel een bepaald gedeelte van je pagina heeft. Raadpleeg voor het volledige overzicht de officiële documentatie op [MDN Web Docs](https://developer.mozilla.org/nl/docs/Web/HTML/Element).

| Tag | Beschrijving | Typisch gebruik |
|---|---|---|
| `<header>` | Inleidende informatie van een pagina of artikel | Bevat vaak een logo, hoofdtitel of datum |
| `<nav>` | Navigatieblok | Bevat een lijst met hyperlinks naar andere pagina's |
| `<main>` | De unieke hoofdinhoud van het document | Mag slechts eenmaal per pagina voorkomen |
| `<article>` | Een zelfstandig stuk inhoud dat losstaand gelezen kan worden | Nieuwsbericht, blogpost of productfiche |
| `<section>` | Een thematisch onderdeel van een pagina of artikel | Hoofdstuk of sectie met een eigen tussentitel |
| `<aside>` | Aanvullende informatie los van de hoofdtekst | Zijbalk, gerelateerde links of een citaat |
| `<footer>` | De afsluiting van een pagina of artikel | Auteursrechten, contactgegevens of colofon |

::: tip Controleer je structuur met Semantiscope
Met de Chrome-extensie **Semantiscope** kan je in een klik zien of je pagina een zuivere koppenhiërarchie heeft en of je koppen netjes binnen de juiste semantische containers (`<main>`, `<article>`, `<header>`) geplaatst zijn. Zie het hoofdstuk [Handige Extensions](/tools/extensions) voor de installatie.
:::

## Codevoorbeelden

### Een semantisch opgebouwde pagina

Hieronder zie je een voorbeeld waarin koppen, alinea's, tekstnadruk en semantische structuurtags samenkomen:

```html
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IT Factory Nieuws</title>
</head>
<body>

  <!-- Bovenkant van de pagina -->
  <header>
    <h1>Thomas More IT Factory</h1>
    <p>Nieuws en updates uit onze ICT-opleidingen</p>
  </header>

  <!-- Navigatiemenu -->
  <nav>
    <h2>Navigatie</h2>
    <!-- Hyperlinks worden behandeld in het volgende hoofdstuk -->
  </nav>

  <!-- Hoofdinhoud van deze pagina -->
  <main>
    <article>
      <header>
        <h2>Start van het academiejaar</h2>
        <p>Gepubliceerd op 15 september door de opleidingscoördinator</p>
      </header>

      <section>
        <h3>Welkom aan alle eerstejaars</h3>
        <p>
          Vandaag verwelkomen we honderden nieuwe studenten in de opleiding
          Toegepaste Informatica. Het academiejaar belooft <strong>uitdagend</strong>
          en boeiend te worden.
        </p>
        <p>
          Vergeet niet om je laptopconfiguratie <em>voor de eerste les</em> na te kijken.
        </p>
      </section>

      <hr>

      <section>
        <h3>Locatie en contact</h3>
        <p>
          Thomas More Campus Geel<br>
          Kleinhoefstraat 4<br>
          2440 Geel
        </p>
      </section>
    </article>

    <!-- Zijbalk met extra info -->
    <aside>
      <h3>Wist je dat?</h3>
      <p>De IT Factory meer dan 1000 actieve studenten telt verspreid over verschillende campussen.</p>
    </aside>
  </main>

  <!-- Voettekst -->
  <footer>
    <p>&copy; Thomas More Hogeschool - IT Factory</p>
  </footer>

</body>
</html>
```

### Live codevoorbeeld

Probeer de onderstaande code zelf uit. Pas een kop aan, voeg een alinea of benadrukking toe, en bekijk direct het resultaat:

<CodeSandbox
  title="Basistags en semantische structuur"
  highlightHtml=""
  highlightCss=""
  highlightJs=""
  html="<!DOCTYPE html>
<html lang=&quot;nl&quot;>
<head>
  <meta charset=&quot;UTF-8&quot;>
  <meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot;>
  <title>IT Factory Nieuws</title>
</head>
<body>
  <header>
    <h1>Thomas More IT Factory</h1>
    <p>Nieuws en updates uit onze ICT-opleidingen</p>
  </header>
  <main>
    <article>
      <h2>Start van het academiejaar</h2>
      <p>
        Vandaag verwelkomen we alle nieuwe studenten. Het wordt een
        <strong>intensief</strong> maar bijzonder boeiend semester.
      </p>
      <p>
        Zorg dat je PhpStorm en Git <em>voor maandag</em> hebt geïnstalleerd.
      </p>
      <hr>
      <h3>Campus Geel</h3>
      <p>
        Kleinhoefstraat 4<br>
        2440 Geel
      </p>
    </article>
    <aside>
      <h3>Mededeling</h3>
      <p>Vergeet je studentenkaart niet af te halen aan het studentensecretariaat.</p>
    </aside>
  </main>
  <footer>
    <p>&copy; Thomas More - IT Factory</p>
  </footer>
</body>
</html>"
  height="460px"
/>

<PageSummary>

### Syntaxis in een oogopslag

| Tag / Element | Categorie | Functie en betekenis |
|---|---|---|
| `<h1>` t/m `<h6>` | Blok | Koppenhiërarchie (max. 1x `<h1>` per pagina) |
| `<p>` | Blok | Alinea voor gewone lopende tekst |
| `<hr>` | Blok (void) | Thematische overgang tussen onderwerpen |
| `<br>` | Inline (void) | Gedwongen regeleinde (postadres of gedicht) |
| `<strong>` | Inline | Inhoudelijk belangrijk of dringend (standaard vet) |
| `<em>` | Inline | Klemtoon / nadruk (standaard cursief) |
| `<code>` | Inline | Inline computercode of tagnaam (monospace) |
| `<pre>` | Blok | Vooropgemaakte tekst (behoudt spaties en enters) |
| `<div>` | Blok | Neutrale container zonder betekenis |
| `<span>` | Inline | Neutraal inline-element zonder betekenis |
| Semantische tags | Blok | `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>` |

### Regels en afspraken

- **Koppenhiërarchie:** Sla nooit niveaus over in je titels (ga van `<h1>` altijd naar `<h2>`, en pas van `<h2>` naar `<h3>`). Gebruik `<h1>` tot en met `<h6>` nooit louter voor visuele lettergrootte (daarvoor dient CSS).
- **Blok versus Inline:**
  - *Blokelementen* (zoals `<p>`, `<h1>`, `<header>`) beginnen altijd op een nieuwe regel en nemen de volle breedte in.
  - *Inline-elementen* (zoals `<strong>`, `<em>`, `<code>`) blijven netjes in de lopende zin staan.
- **`<main>` is uniek:** Het `<main>`-element mag slechts **één keer** per pagina voorkomen en bevat de unieke hoofdinhoud van het document.
- **Semantiek boven uiterlijk:** Gebruik `<strong>` en `<em>` in plaats van de verouderde `<b>` en `<i>`. De eerste twee geven betekenis door aan zoekmachines en schermlezers.
- **Gebruik van containers:** Gebruik `<div>` en `<span>` enkel als kapstok voor styling wanneer er geen geschikt semantisch element voorhanden is.

### Veelgemaakte fouten

- Meerdere keren achter elkaar `<br><br><br>` typen om witruimte te forceren: dit is strikt verboden volgens de webstandaarden; witruimte regel je met CSS marges en padding.
- Meerdere `<h1>`-tags gebruiken op één pagina: beperk je tot precies één hoofdtitel per pagina.
- Een blokelement (zoals een `<p>` of `<div>`) nesten binnenin een inline-element.
- Vergeten om speciale tekens zoals `<` en `>` binnen een `<code>`-tag te escapen als `&lt;` en `&gt;`.

### Tips voor beginners

- Emmet-tip in PhpStorm: typ `h1{Mijn titel}` en druk op `Tab` om direct `<h1>Mijn titel</h1>` te genereren.
- Moet je alinea's testen zonder definitieve tekst? Typ `p*3>lorem` en druk op `Tab` voor drie alinea's Lorem Ipsum dummytekst.
- Installeer de Chrome-extensie **Semantiscope** om de koppenhiërarchie en semantische structuur van je pagina visueel te controleren.

</PageSummary>

## Oefeningen

### Oefening 1: Een blogartikel semantisch opbouwen

Bouw zelf een webpagina voor een blogbericht over je favoriete technologie of hobby.

1. Maak in PhpStorm een nieuw bestand aan met de naam `blog.html`.
2. Genereer het HTML5-basisskelet en stel de taal in op Nederlands (`lang="nl"`).
3. Geef de pagina een passende titel in de `<title>`.
4. Bouw de pagina op met de juiste semantische elementen:
   - Een `<header>` met een `<h1>` (de naam van je blog) en een korte introtekst in een `<p>`.
   - Een `<main>` met daarin een `<article>`.
   - Binnen het `<article>` plaats je een `<h2>` (de titel van je bericht), gevolgd door minstens twee `<section>`-elementen met elk een eigen `<h3>` en enkele alinea's tekst.
   - Gebruik minstens eenmaal `<strong>` en eenmaal `<em>` op een betekenisvolle plek in je zinnen.
   - Voeg een `<footer>` toe met een copyrightvermelding.
5. Open het bestand in Google Chrome en controleer de koppenstructuur met de Chrome-extensie **Semantiscope**.

### Oefening 2: Foutzoeken in structuur en semantiek

Bekijk het onderstaande HTML-fragment. Er zitten vijf structurele of semantische fouten in.

```html
<body>
  <h3>Welkom op mijn site</h3>
  <br><br><br>
  <p>Hieronder vind je de belangrijkste informatie.</p>
  <h1>Over mezelf</h1>
  <b>Dit is heel belangrijke informatie die je moet weten!</b>
  <p>Ik woon in: <p>Kerkstraat 12</p> <p>2800 Mechelen</p></p>
</body>
```

**Opdracht:**
1. Kopieer de code naar een testbestand in PhpStorm.
2. Noteer welke vijf fouten erin staan en leg uit waarom het fout is.
3. Herschrijf de code tot een geldige, semantisch correcte HTML-opbouw.
4. Controleer je verbeterde versie met de Chrome-extensie **Validify**.

### Oefening 3: Een contact- en openingsurenfiche opmaken

Maak een bestand met de naam `contact.html` voor een fictieve broodjeszaak of studentencafé.

1. Plaats een `<h1>` met de naam van de zaak in een `<header>`.
2. Maak in de `<main>` een sectie met contactgegevens. Gebruik het adres met correcte `<br>`-afbrekingen.
3. Plaats een `<hr>` als scheiding tussen het adres en de openingsuren.
4. Maak een tweede sectie voor de openingsuren. Geef aan welke dag de zaak **gesloten** is met het `<strong>`-element.
5. Valideer je pagina via **Validify** in Google Chrome om te zien of je nul fouten en nul waarschuwingen behaalt.
