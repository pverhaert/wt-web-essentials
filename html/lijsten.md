---
title: Lijsten
---

# Lijsten

Lijsten kom je op vrijwel elke webpagina tegen: van ingrediënten en genummerde stappenplannen tot hoofdnavigatiemenu's en begrippenlijsten. In HTML gebruik je lijsten om items semantisch te groeperen, zodat browsers, zoekmachines en schermlezers de samenhang direct begrijpen. In dit hoofdstuk leer je ongeordende, geordende en beschrijvingslijsten vlot en valide opbouwen.

## Leerdoelen

Na dit hoofdstuk kan je:

- Ongeordende lijsten aanmaken met de elementen `<ul>` en `<li>`
- Geordende lijsten aanmaken met `<ol>` en nummeringsattributen zoals `type`, `start` en `reversed` toepassen
- De nummering van een specifiek lijstitem bepalen met het `value`-attribuut
- Geneste lijsten valide en semantisch correct opbouwen volgens de HTML5-standaard
- Beschrijvingslijsten opzetten met `<dl>`, `<dt>` en `<dd>` voor termen en toelichtingen
- De juiste lijstsoort selecteren op basis van de betekenis van de inhoud
- Lijststructuren snel genereren met Emmet-sneltoetsen in PhpStorm

---

## Waarom lijsten gebruiken?

In plaats van losse alinea's (`<p>`) onder elkaar te zetten met een handmatig streepje of cijfer, gebruik je in HTML altijd de specifieke lijst-elementen. Dat biedt grote voordelen:

1. **Semantiek en structuur:** De browser herkent de inhoud als een samenhangende opsomming.
2. **Toegankelijkheid:** Schermlezers voor slechtzienden kondigen een lijst netjes aan (bijvoorbeeld: "Lijst van 4 items"). De gebruiker kan ook gemakkelijk van item naar item springen.
3. **Opmaakvrijheid in CSS:** Door een lijst semantisch te coderen, kan je die later via CSS eenvoudig omvormen tot een horizontaal navigatiemenu, een raster met knoppen of een strakke tijdlijn.

::: warning Geen lijsten voor inspringing
Gebruik een lijst nooit puur om tekst visueel te laten inspringen op de pagina. Gebruik lijsten alleen wanneer de inhoud daadwerkelijk een opsomming of verzameling van items voorstelt. Visuele inspringing regel je later uitsluitend via CSS.
:::

---

## Ongeordende lijsten (`<ul>`)

Een **ongeordende lijst** gebruik je wanneer de volgorde van de items niet van cruciaal belang is. De betekenis van de inhoud verandert niet wanneer je de items van plaats wisselt (zoals bij een boodschappenlijstje of een overzicht van troeven van een opleiding).

Je bouwt een ongeordende lijst op met twee elementen:

- **`<ul>`** (*Unordered List*): Dit element markeert het begin en einde van de lijst. Het is een blok-element.
- **`<li>`** (*List Item*): Elk afzonderlijk item binnen de lijst plaats je tussen `<li>` en `</li>`.

```html
<ul>
  <li>HTML5</li>
  <li>CSS3</li>
  <li>JavaScript</li>
</ul>
```

Browsers tonen een ongeordende lijst standaard met zwarte bolletjes (zogenaamde *bullets*) en laten de lijst iets inspringen.

::: danger Alleen `<li>` als direct kind
Binnen een `<ul>` of `<ol>` mogen alleen `<li>`-elementen als directe kinderen voorkomen. Je mag dus nooit een `<p>`, `<h2>` of losse tekst rechtstreeks binnen een `<ul>` plaatsen zonder dat deze in een `<li>` zit.
:::

### Lijsten als basis voor navigatie

In moderne webontwikkeling vormt een ongeordende lijst binnen een `<nav>`-element de standaardbasis voor hoofdnavigatiemenu's:

```html
<nav aria-label="Hoofdmenu">
  <ul>
    <li><a href="index.html">Startpagina</a></li>
    <li><a href="opleidingen.html">Opleidingen</a></li>
    <li><a href="contact.html">Contact</a></li>
  </ul>
</nav>
```

In het onderdeel over CSS leer je later hoe je de standaard opsommingstekens verwijdert en de lijstitems horizontaal naast elkaar zet om een professionele navigatiebalk te maken.

---

## Geordende lijsten (`<ol>`)

Een **geordende lijst** gebruik je wanneer de volgorde van de items wél van wezenlijk belang is. Denk aan een stappenplan, een recept, de uitslag van een wedstrijd of een top tien.

Je maakt een geordende lijst met:

- **`<ol>`** (*Ordered List*): Dit element markeert de geordende lijst.
- **`<li>`** (*List Item*): Elk genummerd item in de lijst.

```html
<ol>
  <li>Open PhpStorm</li>
  <li>Maak een nieuw HTML-bestand aan</li>
  <li>Bekijk het resultaat in de browser</li>
</ol>
```

Browsers nummeren de items standaard automatisch met Arabische cijfers (`1.`, `2.`, `3.`). Als je later een item tussenvoegt of verwijdert, past de browser de nummering van alle volgende items automatisch aan.

### Attributen van `<ol>`

Het `<ol>`-element beschikt over handige attributen om de nummering naar wens bij te sturen:

| Attribuut | Type | Beschrijving | Mogelijke waarden |
|---|---|---|---|
| `type` | Optioneel | Bepaalt het soort nummeringsteken | `1` (standaard cijfers), `a` (kleine letters), `A` (hoofdletters), `i` (kleine Romeinse cijfers), `I` (grote Romeinse cijfers) |
| `start` | Optioneel | Bepaalt het startgetal van de telling | Een geheel getal (bijvoorbeeld `start="5"` begint bij 5) |
| `reversed` | Optioneel (boolean) | Telt af in omgekeerde volgorde | Attribuut zonder waarde (bijvoorbeeld `<ol reversed>`) |

::: tip Nummering wijzigen: HTML of CSS?
Het `type`-attribuut mag je in HTML gebruiken wanneer het type nummering semantisch betekenisvol is (zoals "Bijlage A, B, C" of "Deel I, II, III"). Voor louter decoratieve wijzigingen van de opsommingstekens gebruiken we later de CSS-eigenschap `list-style-type`.
:::

### Het `value`-attribuut op `<li>`

Soms wil je de nummering van één specifiek item in een geordende lijst handmatig overschrijven. Daarvoor gebruik je het **`value`**-attribuut rechtstreeks op het desbetreffende `<li>`-element. De daaropvolgende items tellen automatisch verder vanaf die nieuwe waarde:

```html
<ol>
  <li>Eerste item (1)</li>
  <li>Tweede item (2)</li>
  <li value="10">Onderbroken item (10)</li>
  <li>Volgend item telt verder (11)</li>
</ol>
```

### Live voorbeeld: Ongeordende en geordende lijsten

In onderstaand interactief voorbeeld zie je zowel een ongeordende lijst als verschillende geordende lijsten aan het werk. Pas gerust de attributen aan om het effect te testen.

<CodeSandbox
  title="Basislijsten: ul en ol met attributen"
  highlightHtml=""
  highlightCss=""
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Basislijsten in HTML</title>
</head>
<body>

  <h1>Lijsten in actie</h1>

  <h2>Ongeordende lijst: Benodigdheden</h2>
  <ul>
    <li>Laptop met PhpStorm</li>
    <li>Browser (Google Chrome of Firefox)</li>
    <li>Goede dosis leergierigheid</li>
  </ul>

  <h2>Geordende lijst: Stappenplan (standaard)</h2>
  <ol>
    <li>Download het startproject</li>
    <li>Open de map in PhpStorm</li>
    <li>Bewerk het bestand index.html</li>
  </ol>

  <h2>Geordende lijst: Romeinse nummering vanaf stap 3</h2>
  <ol type="I" start="3">
    <li>Hoofdstuk drie: Hyperlinks</li>
    <li>Hoofdstuk vier: Lijsten</li>
    <li>Hoofdstuk vijf: Tabellen</li>
  </ol>

  <h2>Geordende lijst: Aftellen met reversed</h2>
  <ol reversed>
    <li>Lancering van de webapplicatie</li>
    <li>Laatste controle van de HTML-validatie</li>
    <li>Uitvoeren van de laatste tests</li>
  </ol>

</body>
</html>'
  height="420px"
/>

---

## Geneste lijsten (Lijsten in lijsten)

Je kan lijsten gemakkelijk binnen elkaar nesten om een hiërarchische structuur weer te geven, zoals een inhoudsopgave met subhoofdstukken of een categorielijst.

### De gouden regel voor geneste lijsten

Het nesten van lijsten is een van de meest gemaakte fouten bij beginnende webontwikkelaars. Onthoud daarom deze vaste regel:

::: danger De gouden regel
Een sublijst moet **altijd binnen een `<li>`** van de bovenliggende lijst geplaatst worden. Een `<ul>` of `<ol>` mag nooit zomaar tussen twee `<li>`-tags zweven.
:::

Bekijk het verschil tussen de foute en de correcte manier:

**Fout (invalide HTML):**
```html
<!-- FOUT: de sublijst staat los tussen twee <li> tags in! -->
<ul>
  <li>België</li>
  <ul>
    <li>Antwerpen</li>
    <li>Geel</li>
  </ul>
  <li>Nederland</li>
</ul>
```

**Goed (valide HTML):**
```html
<!-- GOED: de sublijst bevindt zich volledig binnen het <li>-element van België -->
<ul>
  <li>
    België
    <ul>
      <li>Antwerpen</li>
      <li>Geel</li>
    </ul>
  </li>
  <li>Nederland</li>
</ul>
```

Je kan verschillende lijsttypes naar hartenlust combineren. Zo kan je binnen een geordende lijst (`<ol>`) probleemloos een ongeordende lijst (`<ul>`) nesten, zolang je de structuur binnen het `<li>`-element bewaart.

### Live voorbeeld: Geneste lijsten

In onderstaand voorbeeld zie je een opleidingenoverzicht van Thomas More Campus Geel met een combinatie van geordende en ongeordende sublijsten.

<CodeSandbox
  title="Geneste lijststructuur"
  highlightHtml=""
  highlightCss=""
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Opleidingenoverzicht</title>
</head>
<body>

  <h1>Thomas More Campus Geel</h1>
  <h2>Studieaanbod Technologie en ICT</h2>

  <ol>
    <li>
      Graduaat Programmeren
      <ul>
        <li>Web Essentials (HTML en CSS)</li>
        <li>Programming Fundamentals</li>
        <li>Databases en SQL</li>
      </ul>
    </li>
    <li>
      Graduaat Systeem- en Netwerkbeheer
      <ul>
        <li>Hardware en Besturingssystemen</li>
        <li>Netwerkarchitectuur</li>
        <li>Cloud Infrastructure</li>
      </ul>
    </li>
    <li>
      Bachelor Toegepaste Informatica
      <ul>
        <li>Application Development</li>
        <li>Artificial Intelligence</li>
      </ul>
    </li>
  </ol>

</body>
</html>'
  height="420px"
/>

---

## Beschrijvingslijsten (`<dl>`)

Een **beschrijvingslijst** (in het Engels *Description List*, vroeger ook bekend als *Definition List*) gebruik je om paren van termen en toelichtingen te groeperen.

Denk aan:
- Een begrippenlijst of woordenboek (term en definitie)
- Technische specificaties van een product (eigenschap en waarde)
- Metadata van een artikel (auteur, publicatiedatum, leestijd)
- Een overzicht van veelgestelde vragen (vraag en antwoord)

Een beschrijvingslijst bestaat uit drie samenwerkende elementen:

- **`<dl>`** (*Description List*): De omhullende lijstcontainer.
- **`<dt>`** (*Description Term*): De term, eigenschap of het begrip.
- **`<dd>`** (*Description Details*): De bijbehorende uitleg, waarde of beschrijving.

```html
<dl>
  <dt>HTML5</dt>
  <dd>De standaard opmaaktaal voor het structureren van webpagina's.</dd>

  <dt>CSS3</dt>
  <dd>De stijlbladtaal waarmee je de vormgeving en lay-out van HTML bepaalt.</dd>
</dl>
```

Browsers tonen de term (`<dt>`) standaard op een eigen regel en laten de bijbehorende beschrijving (`<dd>`) automatisch een stukje inspringen.

### Flexibiliteit van beschrijvingslijsten

Een beschrijvingslijst is bijzonder flexibel in zijn opzet:

1. **Eén term met meerdere beschrijvingen:**  
   Wanneer een begrip meerdere betekenissen heeft of meerdere waarden bevat:
   ```html
   <dl>
     <dt>Campus Geel</dt>
     <dd>Onderwijscampus van Thomas More Hogeschool aan de Kleinhoefstraat 4.</dd>
     <dd>Thuisbasis van de IT Factory en technologie-opleidingen.</dd>
   </dl>
   ```

2. **Meerdere termen met één beschrijving:**  
   Handig voor synoniemen die dezelfde definitie delen:
   ```html
   <dl>
     <dt>Sneltoets</dt>
     <dt>Shortcut</dt>
     <dd>Een toetscombinatie waarmee je een actie sneller uitvoert in software.</dd>
   </dl>
   ```

3. **Groeperen met een `<div>`:**  
   In moderne HTML5 is het toegestaan om een `<dt>` en zijn bijbehorende `<dd>` samen in een `<div>` te wikkelen binnen de `<dl>`. Dit verandert niets aan de semantiek, maar maakt het later in CSS heel eenvoudig om elk term-beschrijvingspaar van een rand, achtergrondkleur of flexbox-lay-out te voorzien:
   ```html
   <dl>
     <div>
       <dt>Locatie</dt>
       <dd>Kleinhoefstraat 4, 2440 Geel</dd>
     </div>
     <div>
       <dt>Telefoon</dt>
       <dd>014 56 23 10</dd>
     </div>
   </dl>
   ```

### Live voorbeeld: Beschrijvingslijst voor specificaties

Bekijk in dit voorbeeld hoe je een technische specificatiefiche voor een laptop opbouwt met behulp van `<dl>`, `<dt>` en `<dd>`.

<CodeSandbox
  title="Beschrijvingslijst met specificaties"
  highlightHtml=""
  highlightCss=""
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Specificaties Studielaptop</title>
</head>
<body>

  <h1>Aanbevolen Laptop: IT Factory</h1>
  <p>Hieronder vind je de minimale hardwarevereisten voor studenten:</p>

  <dl>
    <div>
      <dt>Processor</dt>
      <dd>Intel Core i7 of AMD Ryzen 7 (minimaal 6 cores)</dd>
    </div>
    <div>
      <dt>Werkgeheugen (RAM)</dt>
      <dd>Minimaal 16 GB, 32 GB aanbevolen voor virtualisatie</dd>
    </div>
    <div>
      <dt>Opslagruimte</dt>
      <dd>512 GB NVMe SSD</dd>
      <dd>1 TB aanbevolen voor het bijhouden van lokale labo-omgevingen</dd>
    </div>
    <div>
      <dt>Besturingssysteem</dt>
      <dt>OS</dt>
      <dd>Windows 11 Pro of macOS met Apple Silicon</dd>
    </div>
  </dl>

</body>
</html>'
  height="420px"
/>

---

## Keuzehulp: Welk lijsttype kies je wanneer?

Twijfel je welke lijst geschikt is voor jouw inhoud? Gebruik dit eenvoudige beslissingsschema:

```
Vraag jezelf af: Wat voor soort gegevens wil ik weergeven?

├── Is de volgorde van de items cruciaal voor het begrip?
│   ├── JA  ──> Gebruik <ol> (bijv. stappenplan, recept, top 10)
│   └── NEE ──> Ga naar de volgende vraag
│
└── Bestaat elk item uit een naam, term of sleutel met een bijhorende waarde?
    ├── JA  ──> Gebruik <dl> (bijv. specificaties, begrippen, FAQ)
    └── NEE ──> Gebruik <ul> (bijv. eigenschappen, navigatielinks, ingrediënten)
```

---

## Snel coderen met Emmet in PhpStorm

In PhpStorm hoef je lijststructuren niet handmatig tag voor tag in te tikken. Met de ingebouwde hulpprogrammatuur **Emmet** genereer je volledige lijsten in een fractie van een seconde.

Typ de afkorting en druk meteen op de `Tab`-toets:

| Emmet-afkorting | Resultaat na het drukken op `Tab` |
|---|---|
| `ul>li*4` | Een ongeordende lijst met 4 lege lijstitems |
| `ol>li*3{Stap $}` | Een geordende lijst met `Stap 1`, `Stap 2` en `Stap 3` |
| `ul>li*3>a` | Een lijst met 3 lijstitems die elk een hyperlink bevatten |
| `ol>li*3>lorem5` | Een genummerde lijst van 3 items, elk gevuld met 5 woorden opvultekst |
| `ul>li*2>ol>li*2` | Een kant-en-klare geneste lijststructuur |
| `dl>(dt{Term $}+dd{Uitleg $})*3` | Een beschrijvingslijst met 3 paren van termen en uitleg |

::: tip Het dollarteken `$` in Emmet
Het dollarteken `$` in een Emmet-instructie fungeert als een teller. Emmet vervangt `$` automatisch door `1`, `2`, `3`, enzovoort. Gebruik je `$$`, dan vult Emmet getallen in met voorloopnullen (`01`, `02`, `03`).
:::

---

## Veelgemaakte fouten

Let bij het schrijven van lijsten goed op de volgende valkuilen:

::: warning Fout 1: Losse elementen in `<ul>` of `<ol>`
Plaats nooit andere elementen dan `<li>` rechtstreeks in een `<ul>` of `<ol>`. Een kopje zoals `<h3>` hoort vóór de lijst te staan, niet erin.
:::

::: warning Fout 2: Verkeerd geneste sublijsten
Plaats een sublijst nooit tussen twee sluit- en openingstags `</li><li>` in. De sublijst hoort vóór het sluitende `</li>`-element van het desbetreffende item te staan.
:::

::: warning Fout 3: Een `<ol>` gebruiken en zelf nummers typen
Typ in een `<ol>` nooit zelf cijfers in de tekst (zoals `<li>1. Eerste stap</li>`). De browser voorziet de nummering automatisch. Doe je dit toch, dan krijgt de bezoeker een dubbele nummering te zien (`1. 1. Eerste stap`).
:::

---

## Oefeningen

Oefen de leerstof van dit hoofdstuk in PhpStorm aan de hand van onderstaande opdrachten. Maak voor elke oefening een nieuw HTML-bestand aan.

### Oefening 1: Recept voor Campus Geel Pannenkoeken

Maak een bestand aan met de naam `recept.html`.

1. Maak een hoofdtitel (`<h1>`) met de tekst "Recept: Kempense Pannenkoeken".
2. Voeg een inleidende alinea toe waarin je kort uitlegt dat dit het favoriete tussendoortje is van studenten op Thomas More Campus Geel.
3. Maak een tussentitel (`<h2>`) "Ingrediënten".
4. Maak een **ongeordende lijst** (`<ul>`) met de volgende ingrediënten:
   - 250 g bloem
   - 500 ml halfvolle melk
   - 3 verse eieren
   - 1 zakje vanillesuiker
   - Een snuifje zout
   - Boter om in te bakken
5. Maak een tussentitel (`<h2>`) "Bereidingswijze".
6. Maak een **geordende lijst** (`<ol>`) met de bereidingsstappen in de juiste volgorde:
   - Doe de bloem in een grote mengkom en maak een kuiltje in het midden.
   - Breek de eieren in het kuiltje en voeg de vanillesuiker en het zout toe.
   - Giet geleidelijk de melk erbij terwijl je met een garde klopt tot een glad beslag zonder klonters.
   - Laat het beslag 15 minuten rusten op kamertemperatuur.
   - Verhit een klontje boter in een koekenpan op een matig vuur.
   - Giet een pollepel beslag in de pan en bak de pannenkoek goudbruin aan beide zijden.
7. Bekijk het resultaat in de browser en controleer of de bereidingsstappen automatisch genummerd zijn van 1 tot 6.

### Oefening 2: Geneste campusgids

Maak een bestand aan met de naam `campusgids.html`.

1. Maak een hoofdtitel (`<h1>`) "Wegwijzer Thomas More Campus Geel".
2. Maak een inleidende alinea met het campusadres: Kleinhoefstraat 4, 2440 Geel.
3. Bouw een **geneste lijst** op met drie hoofdblokken van de campus:
   - Blok A (Hoofdgebouw)
     - Onthaal en studentensecretariaat
     - Campusrestaurant
     - Agora en stille studieruimte
   - Blok B (Technologie en IT Factory)
     - Netwerklabo's
     - Software Development studio's
     - Elektronica- en technologielab
   - Blok C (Sport en ontspanning)
     - Sporthal
     - Studentencafetaria
4. Zorg ervoor dat de hoofdgebouwen genummerd worden met een `<ol>` en dat de specifieke lokalen daarbinnen opgesomd worden met een ongeordende lijst (`<ul>`).
5. **Belangrijk:** Let er nauwgezet op dat elke sublijst zich netjes *binnen* het bijbehorende `<li>`-element bevindt.

### Oefening 3: Begrippenlijst Webdevelopment

Maak een bestand aan met de naam `begrippen.html`.

1. Maak een hoofdtitel (`<h1>`) "Begrippenlijst Web Essentials".
2. Bouw een **beschrijvingslijst** (`<dl>`) met minstens vier technische begrippen:
   - **HTML:** HyperText Markup Language, de standaardstructuurtaal voor documenten op het web.
   - **Element:** Een onderdeel van een webpagina dat bestaat uit een starttag, eventuele attributen, inhoud en een eindtag.
   - **Attribuut:** Extra informatie of configuratie die je meegeeft aan een HTML-element in de openingstag.
   - **Semantiek:** Het toekennen van de juiste betekenis aan de inhoud via de gepaste HTML-tags, los van hoe het er visueel uitziet.
3. Voeg aan één van de begrippen een tweede toelichting (`<dd>`) toe.
4. Wikkel elk begrippenpaar optioneel in een `<div>` om de HTML5-groepering in de praktijk toe te passen.
5. Valideer je document via de W3C Validator om te controleren of je HTML volledig foutloos is.
