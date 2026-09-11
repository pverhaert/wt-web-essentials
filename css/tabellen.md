---
title: Tabellen
---

# Tabellen

In het HTML-hoofdstuk over tabellen heb je ontdekt hoe je tweedimensionale gegevens semantisch correct structureert met `<table>`, `<caption>`, `<thead>`, `<tbody>`, `<tfoot>`, `<tr>`, `<th>` en `<td>`. Zonder stijlen toont een browser een tabel echter als een sobere lijst cellen zonder duidelijke scheiding of hiërarchie, waardoor getallen en kolommen moeilijk te scannen zijn.

Met <abbr title="Cascading Style Sheets: de stijlen- en opmaaktaal voor webpagina's">CSS</abbr> transformeer je deze kale gegevensstructuur tot een aantrekkelijk, overzichtelijk en professioneel dashboard of overzichtsrooster. In dit hoofdstuk leer je hoe je tabelranden naadloos samensmelt, de tabeltitel visueel positioneert, cellen ademruimte geeft, en rijen automatisch afwisselend kleurt (<dfn title="Het afwisselend kleuren van even en oneven rijen in een tabel om de horizontale leesbaarheid te vergroten">zebra-striping</dfn>) met krachtige pseudo-klassen.

## Leerdoelen

Na dit hoofdstuk kan je:

- Het verschil uitleggen tussen samengevouwen en gescheiden tabelranden en dit instellen met `border-collapse`
- De tussenruimte tussen cellen aanpassen met `border-spacing`
- De verticale positie van het tabelbijschrift (`<caption>`) bepalen met `caption-side`
- De zichtbaarheid van lege cellen beheren met `empty-cells`
- Cellen professioneel opmaken met `padding`, randen en passende horizontale (`text-align`) en verticale (`vertical-align`) uitlijning
- Rijen en kolommen geautomatiseerd stijlen zonder extra klassen met behulp van `:nth-child()`, `:first-child` en `:last-child`
- Zebra-striping en interactieve rij-markering (`:hover`) toepassen voor optimale leesbaarheid van datatabellen
- Het verschil verklaren tussen `table-layout: auto` en `table-layout: fixed`
- Kolommen doelgericht stijlen via `<colgroup>` en `<col>` en de geldige CSS-eigenschappen hiervoor benoemen
- Een datatabel responsief maken op mobiele apparaten met een horizontaal scrollbare wrapper
- Sneller tabeleigenschappen schrijven in PhpStorm met behulp van Emmet-afkortingen

## Randen beheren: `border-collapse` en `border-spacing`

Wanneer je in CSS een rand toekent aan zowel de tabel als aan de individuele cellen, hanteert de browser standaard het **gescheiden randenmodel** (`separate`). Hierbij krijgt elke cel zijn eigen afzonderlijke randkader, met een kleine tussenruimte ertussen:

```css
table, th, td {
  border: 1px solid #1e2d5a;
}
```

Dit leidt standaard tot een ongewenst dubbel randeffect rond elke cel. Om dit op te lossen gebruik je de specifieke tabeleigenschap `border-collapse`.

### Randen samenvoegen: `border-collapse`

Met de eigenschap <dfn title="CSS-eigenschap die bepaalt of tabel- en celranden samensmelten tot één gedeelde rand of gescheiden blijven">border-collapse</dfn> bepaal je of aangrenzende celranden samensmelten tot één enkele rand of los van elkaar blijven staan:

- **`collapse`**: Aangrenzende randen smelten samen tot één gemeenschappelijke randlijn. Dit is veruit de meest gebruikte en aanbevolen instelling voor moderne, strakke datatabellen.
- **`separate` (standaard)**: Elke cel behoudt zijn eigen individuele omranding, gescheiden door een witruimte.

```css
table {
  border-collapse: collapse;
}
```

### Tussenruimte bij gescheiden randen: `border-spacing`

Kies je bewust voor het model met gescheiden randen (`border-collapse: separate`), dan kan je de tussenruimte tussen de cellen nauwkeurig instellen met de eigenschap `border-spacing`.

Je kan één waarde opgeven (voor zowel horizontale als verticale tussenruimte) of twee waarden (horizontaal en verticaal):

```css
table {
  border-collapse: separate;
  border-spacing: 0.5rem 0.25rem; /* 0.5rem horizontaal, 0.25rem verticaal */
}
```

::: warning border-spacing werkt enkel bij separate
De eigenschap `border-spacing` heeft **geen enkel effect** wanneer `border-collapse: collapse;` actief is. Zodra randen zijn samengevouwen, bestaat er immers geen tussenruimte meer tussen de cellen.
:::

### Lege cellen verbergen: `empty-cells`

In een tabel met gescheiden randen (`border-collapse: separate`) kan je met de eigenschap `empty-cells` bepalen of cellen zonder inhoud toch een rand en achtergrond moeten tonen:

- **`show` (standaard)**: De browser tekent de randen en achtergrond van lege cellen gewoon alsof er tekst in staat.
- **`hide`**: Cellen zonder inhoud (of met alleen witruimte) worden volledig transparant getoond, zonder randen.

```css
table {
  border-collapse: separate;
  empty-cells: hide;
}
```

### Codevoorbeeld: Samengevouwen versus gescheiden randen

In het onderstaande voorbeeld zie je direct het visuele verschil tussen het moderne samengevouwen randenmodel (`collapse`) en het traditionele gescheiden model met `border-spacing`.

<CodeSandbox
  title="Voorbeeld: border-collapse en border-spacing"
  activeCodeTab="css"
  height="480px"
  highlightHtml=""
  highlightCss="17,31-32"
  highlightJs=""
  css='/* Universele resetter */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
/* Basisinrichting pagina */
body {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  color: #212529;
  padding: 1rem;
}
/* Samengevouwen randen (meest gebruikt) */
.tabel-samengevouwen {
  width: 100%;
  margin-bottom: 2rem;
  border-collapse: collapse;
}
.tabel-samengevouwen th,
.tabel-samengevouwen td {
  border: 1px solid #1e2d5a;
  padding: 0.6rem 0.8rem;
}
.tabel-samengevouwen th {
  background-color: #1e2d5a;
  color: #ffffff;
}
/* Gescheiden randen met tussenruimte */
.tabel-gescheiden {
  width: 100%;
  border-collapse: separate;
  border-spacing: 6px;
}
.tabel-gescheiden th,
.tabel-gescheiden td {
  border: 1px solid #e87722;
  padding: 0.6rem 0.8rem;
}
.tabel-gescheiden th {
  background-color: #e87722;
  color: #ffffff;
}
caption {
  font-weight: bold;
  margin-bottom: 0.5rem;
}'
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tabelranden vergelijken</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <table class="tabel-samengevouwen">
    <caption>Tabel 1: border-collapse: collapse (samengevoegd)</caption>
    <thead>
      <tr>
        <th scope="col">Opleiding</th>
        <th scope="col">Campus</th>
        <th scope="col">Traject</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Graduaat Programmeren</td>
        <td>Thomas More Geel</td>
        <td>Dagdagonderwijs</td>
      </tr>
      <tr>
        <td>Toegepaste Informatica</td>
        <td>Thomas More Geel</td>
        <td>Bachelor 3 jaar</td>
      </tr>
    </tbody>
  </table>

  <table class="tabel-gescheiden">
    <caption>Tabel 2: border-collapse: separate met border-spacing: 6px</caption>
    <thead>
      <tr>
        <th scope="col">Opleiding</th>
        <th scope="col">Campus</th>
        <th scope="col">Traject</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Graduaat Programmeren</td>
        <td>Thomas More Geel</td>
        <td>Dagdagonderwijs</td>
      </tr>
      <tr>
        <td>Toegepaste Informatica</td>
        <td>Thomas More Geel</td>
        <td>Bachelor 3 jaar</td>
      </tr>
    </tbody>
  </table>
</body>
</html>'
/>

## Positie van het bijschrift: `caption-side`

In het HTML-hoofdstuk heb je geleerd dat het `<caption>`-element **altijd direct na de openingstag `<table>`** moet worden geplaatst om semantisch geldig te zijn volgens de W3C-validator.

Standaard rendert de browser het bijschrift visueel bovenaan de tabel. Wil je de titel of een bronvermelding liever onder de tabel tonen? Pas dan nooit de volgorde in de HTML-code aan, maar gebruik de CSS-eigenschap `caption-side`:

- **`top` (standaard)**: Plaatst het bijschrift direct boven de tabel.
- **`bottom`**: Plaatst het bijschrift direct onder de tabel.

```css
caption {
  caption-side: bottom;
  text-align: right;
  font-size: 0.85rem;
  color: #6c757d;
  padding-top: 0.5rem;
}
```

::: tip Handig voor bronvermeldingen en toelichtingen
De waarde `caption-side: bottom;` is ideaal wanneer je `<caption>` gebruikt om een disclaimer, datum van bijwerking of bronvermelding weer te geven, zoals: *Bron: Studentenadministratie Thomas More Campus Geel, academiejaar 2026-2027*.
:::

## Cellen vormgeven en uitlijnen

Een tabel waarin alle tekst dicht op elkaar gepropt staat of willekeurig is uitgelijnd, leest erg vermoeiend. Twee basisregels maken een wereld van verschil: geef cellen voldoende binnenruimte (`padding`) en lijn gegevens logisch uit.

### Binnenruimte toevoegen met `padding`

Standaard hebben tabelcellen (`<th>` en `<td>`) nauwelijks binnenruimte. Voeg altijd royale `padding` toe aan de cellen zodat de inhoud niet tegen de randen plakt:

```css
th, td {
  padding: 0.75rem 1rem;
}
```

::: warning Marges werken niet op tabelcellen
De CSS-eigenschap `margin` heeft **geen effect** op `<th>`-, `<td>`- of `<tr>`-elementen. Binnenruimte en afstand tot de randen regel je bij tabellen uitsluitend via `padding` op de cellen zelf en eventueel `border-spacing` op het `<table>`-element.
:::

### Horizontale uitlijning met `text-align`

Voor een professioneel resultaat hanteer je vaste conventies voor tekst- en getaluitlijning:

- **Standaardtekst:** Lijn gewone tekst (zoals namen, omschrijvingen en steden) altijd **links** uit (`text-align: left;`).
- **Numerieke data en bedragen:** Lijn getallen, prijzen, percentages en data altijd **rechts** uit (`text-align: right;`). Hierdoor vallen de cijfers, decimalen en komma's netjes loodrecht onder elkaar, wat vergelijken en optellen eenvoudig maakt.
- **Codes en statuslabels:** Korte codes (zoals postcodes, studentennummers of vinkjes) ogen vaak het rustigst wanneer ze worden **gecentreerd** (`text-align: center;`).

```css
/* Kopcellen en tekst links */
th, td {
  text-align: left;
}

/* Numerieke gegevens rechts uitlijnen */
.cijfer,
td:last-child {
  text-align: right;
}
```

### Verticale uitlijning met `vertical-align`

Binnen een tabelcel kan je de inhoud verticaal positioneren met de eigenschap `vertical-align`. Dit is vooral nuttig wanneer cellen in dezelfde rij verschillende hoogtes hebben, of wanneer je werkt met samengevoegde rijen via `rowspan`:

- **`top`**: Lijnt de inhoud uit tegen de bovenkant van de cel.
- **`middle` (standaard)**: Centreert de inhoud verticaal binnen de cel.
- **`bottom`**: Lijnt de inhoud uit tegen de onderkant van de cel.

```css
td {
  vertical-align: top;
}
```

## Geavanceerde selectoren voor tabellay-out

In een grote tabel wil je niet elke afzonderlijke rij of kolom van een eigen klasse voorzien (`class="even"`, `class="oneven"`). Dat maakt de HTML-code onnodig zwaar en foutgevoelig. Met behulp van CSS pseudo-klassen zoals `:nth-child()` styleer je rijen en kolommen volledig geautomatiseerd.

### Zebra-striping met `:nth-child(even)` en `:nth-child(odd)`

<dfn title="Het afwisselend kleuren van even en oneven rijen in een tabel om de horizontale leesbaarheid te vergroten">Zebra-striping</dfn> verhoogt de leesbaarheid van brede datatabellen aanzienlijk. Het menselijk oog volgt hierdoor moeiteloos een lange rij van links naar rechts zonder per ongeluk naar de boven- of onderliggende rij te verspringen.

Gebruik hiervoor de pseudo-klasse `:nth-child()` op de rijen binnen `<tbody>`:

```css
/* Geef elke even rij in de tabelromp een subtiele achtergrondkleur */
tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}

/* Of geef elke oneven rij een tint */
tbody tr:nth-child(odd) {
  background-color: #ffffff;
}
```

::: tip Selecteer specifiek binnen tbody
Schrijf bij voorkeur altijd `tbody tr:nth-child(...)` en niet zomaar `tr:nth-child(...)`. Hiermee voorkom je dat de rijen in `<thead>` of `<tfoot>` ongewenst meegenomen worden in de telling van even en oneven rijen.
:::

### Interactieve rij-markering met `:hover`

Om de gebruiker visuele feedback te geven bij het scannen van complexe tabellen, kan je de rij waar de muisaanwijzer zich boven bevindt subtiel laten oplichten met de pseudo-klasse `:hover`:

```css
tbody tr:hover {
  background-color: #e9ecef;
}
```

### Kolommen en cellen doelgericht selecteren

Omdat HTML-tabellen horizontaal per rij worden opgebouwd (`<tr>`), selecteer je een specifieke kolom door dezelfde celpositie binnen elke rij aan te spreken:

| Selector | Wat wordt geselecteerd? | Typische toepassing |
|---|---|---|
| `tbody tr:first-child` | De allereerste gegevensrij in `<tbody>` | Extra dikke bovenrand |
| `tbody tr:last-child` | De allerlaatste gegevensrij in `<tbody>` | Afronding onderaan |
| `td:first-child`, `th:first-child` | De allereerste cel in elke rij (eerste kolom) | Belangrijke sleutelkolom vetgedrukt maken |
| `td:last-child`, `th:last-child` | De laatste cel in elke rij (laatste kolom) | Totalen of actieknoppen rechts uitlijnen |
| `td:nth-child(2)` | De tweede gegevenscel in elke rij (tweede kolom) | Kolombreedte of uitlijning instellen |

```css
/* Eerste kolom (productnaam) extra benadrukken */
tbody td:first-child {
  font-weight: 600;
  color: #1e2d5a;
}

/* Laatste kolom (prijzen) rechts uitlijnen */
th:last-child,
td:last-child {
  text-align: right;
}
```

### Codevoorbeeld: Professionele tabel met zebra-striping en hover

In het onderstaande voorbeeld zie je hoe `thead`, `tbody`, `tfoot`, zebra-striping en een `:hover`-effect samenkomen in een overzichtelijke campusstatistiek.

```html
<table class="campus-statistiek">
  <caption>Inschrijvingen IT Factory - Thomas More Campus Geel</caption>
  <thead>
    <tr>
      <th scope="col">Opleiding</th>
      <th scope="col">Fase 1</th>
      <th scope="col">Fase 2</th>
      <th scope="col">Fase 3</th>
      <th scope="col">Totaal</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Graduaat Programmeren</td>
      <td>95</td>
      <td>70</td>
      <td>-</td>
      <td>165</td>
    </tr>
    <tr>
      <td>Graduaat Systeem- en Netwerkbeheer</td>
      <td>80</td>
      <td>58</td>
      <td>-</td>
      <td>138</td>
    </tr>
    <tr>
      <td>Toegepaste Informatica (Applicatieontwikkeling)</td>
      <td>110</td>
      <td>85</td>
      <td>72</td>
      <td>267</td>
    </tr>
    <tr>
      <td>Toegepaste Informatica (Cloud Infrastructure)</td>
      <td>65</td>
      <td>50</td>
      <td>44</td>
      <td>159</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Totaal studenten</th>
      <td>350</td>
      <td>263</td>
      <td>116</td>
      <td>729</td>
    </tr>
  </tfoot>
</table>
```

<CodeSandbox
  title="Voorbeeld: Professionele datatabel met zebra-striping en hover"
  activeCodeTab="css"
  height="520px"
  highlightHtml=""
  highlightCss="41-44,50-60"
  highlightJs=""
  css='/* Universele resetter */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
/* Pagina lettertype en achtergrond */
body {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  color: #2b2d42;
  padding: 1.5rem;
}
/* Tabel basisopmaak */
.campus-statistiek {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}
/* Titel van de tabel */
.campus-statistiek caption {
  font-size: 1.1rem;
  font-weight: bold;
  text-align: left;
  margin-bottom: 0.75rem;
  color: #1e2d5a;
}
/* Cellen opmaken */
.campus-statistiek th,
.campus-statistiek td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #dee2e6;
}
/* Koprij stijlen */
.campus-statistiek thead th {
  background-color: #1e2d5a;
  color: #ffffff;
  font-weight: 600;
  text-align: right;
}
/* Eerste kolom altijd links uitlijnen */
.campus-statistiek th:first-child,
.campus-statistiek td:first-child {
  text-align: left;
}
/* Cijferkolommen standaard rechts */
.campus-statistiek tbody td {
  text-align: right;
}
/* Eerste kolom in gegevensrijen accentueren */
.campus-statistiek tbody td:first-child {
  font-weight: 500;
}
/* Zebra-striping op even rijen */
.campus-statistiek tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}
/* Interactief hover effect */
.campus-statistiek tbody tr:hover {
  background-color: #e8f0fe;
}
/* Voettekst styling */
.campus-statistiek tfoot th,
.campus-statistiek tfoot td {
  font-weight: bold;
  background-color: #edf2f7;
  border-top: 2px solid #1e2d5a;
  text-align: right;
}'
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inschrijvingen IT Factory</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <table class="campus-statistiek">
    <caption>Inschrijvingen IT Factory - Thomas More Campus Geel</caption>
    <thead>
      <tr>
        <th scope="col">Opleiding</th>
        <th scope="col">Fase 1</th>
        <th scope="col">Fase 2</th>
        <th scope="col">Fase 3</th>
        <th scope="col">Totaal</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Graduaat Programmeren</td>
        <td>95</td>
        <td>70</td>
        <td>-</td>
        <td>165</td>
      </tr>
      <tr>
        <td>Graduaat Systeem- en Netwerkbeheer</td>
        <td>80</td>
        <td>58</td>
        <td>-</td>
        <td>138</td>
      </tr>
      <tr>
        <td>Toegepaste Informatica (Applicatieontwikkeling)</td>
        <td>110</td>
        <td>85</td>
        <td>72</td>
        <td>267</td>
      </tr>
      <tr>
        <td>Toegepaste Informatica (Cloud Infrastructure)</td>
        <td>65</td>
        <td>50</td>
        <td>44</td>
        <td>159</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <th scope="row">Totaal studenten</th>
        <td>350</td>
        <td>263</td>
        <td>116</td>
        <td>729</td>
      </tr>
    </tfoot>
  </table>
</body>
</html>'
/>

## Tabelbreedte en lay-outalgoritme: `table-layout`

Standaard berekent een browser de breedte van elke kolom op basis van de inhoud van **alle** cellen in die kolom. Dit standaardgedrag heet het automatische tabellay-outalgoritme.

Met de CSS-eigenschap <dfn title="CSS-eigenschap die bepaalt hoe de browser kolombreedtes berekent: flexibel op basis van alle celinhoud (auto) of strikt op basis van de eerste rij en tabelbreedte (fixed)">table-layout</dfn> kan je kiezen tussen twee berekeningswijzen:

### 1. `table-layout: auto` (standaard)

- De browser moet eerst de volledige tabel downloaden en alle tekst inspecteren voordat hij kan bepalen hoe breed elke kolom wordt.
- Kolommen met lange woorden of zinnen worden automatisch breder gemaakt, terwijl kolommen met korte getallen smal blijven.
- Bij zeer grote tabellen kan dit een lichte vertraging veroorzaken bij het opbouwen van de pagina.

### 2. `table-layout: fixed`

- De browser kijkt uitsluitend naar de breedte van de tabel zelf en naar de breedtes die zijn ingesteld op de **eerste rij cellen** (of via `<col>`).
- De browser verdeelt de resterende ruimte gelijkmatig over de overige kolommen, zonder de rest van de tabel af te wachten. De tabel rendert hierdoor merkbaar sneller.
- Kolombreedtes liggen muurvast: tekst die te breed is breekt af naar een volgende regel of loopt over.

```css
table {
  width: 100%;
  table-layout: fixed;
}

/* Geef de eerste kolom een vaste breedte; de rest verdeelt de overblijvende ruimte */
th:first-child {
  width: 35%;
}
```

::: tip Aanrader bij roosters en planningen
Gebruik `table-layout: fixed;` bij lesroosters, weekplanners of tabellen met gelijke kolommen (zoals maandag t/m vrijdag). Hierdoor zijn alle dagen gegarandeerd exact even breed, ongeacht hoeveel tekst er in een specifiek lesuur staat.
:::

### Zelf experimenteren met tabeleigenschappen

Met de onderstaande interactieve simulator kan je direct ontdekken hoe `border-collapse`, `border-spacing`, `empty-cells`, `caption-side` en `table-layout` samenwerken. Schakel vooral eens tussen `auto` en `fixed` nadat je lange tekst toevoegt:

<TableWorkbench />

## Kolommen stijlen met `<colgroup>` en `<col>`

In het hoofdstuk over HTML-tabellen heb je geleerd dat je kolommen semantisch kan groeperen met behulp van `<colgroup>` en `<col>`. We gaven daar al aan dat de visuele kracht van deze elementen pas echt tot uiting komt zodra je er CSS aan koppelt.

Wanneer je een volledige kolom een achtergrondkleur of breedte wil geven, hoef je dankzij `<colgroup>` niet aan elke individuele `<td>` in die kolom een klasse toe te voegen.

### Slechts vier CSS-eigenschappen toegelaten op `<col>`

Omdat kolommen in HTML geen fysieke containers zijn waar cellen in 'wonen' (de cellen zitten immers in rijen `<tr>`), gelden er volgens de officiële CSS-standaard strenge beperkingen. Je kan op `<col>` en `<colgroup>` **uitsluitend de volgende vier CSS-eigenschappen** toepassen:

1. **`background-color` (en achtergrondeigenschappen):** Om een kolom een eigen achtergrondkleur te geven.
2. **`width`:** Om de breedte van de kolom vast te leggen (bijvoorbeeld `width: 120px;` of `width: 25%;`).
3. **`border`:** Randen rond de kolom, maar dit werkt **enkel** wanneer `border-collapse: collapse;` op de tabel actief is.
4. **`visibility`:** Om een kolom te verbergen met `visibility: collapse;` (waardoor de kolom wegvalt zonder de tabelstructuur te breken).

::: warning Eigenschappen zoals font en text-align werken niet op col
Eigenschappen zoals `color`, `font-weight`, `text-align` en `padding` hebben **geen enkel effect** op `<col>` of `<colgroup>`. De inhoud van de cel erft deze eigenschappen over van de rij (`<tr>`), niet van de kolom. Wil je tekst in een kolom vetgedrukt maken of rechts uitlijnen, gebruik dan de pseudo-klasse `:nth-child()` op de cellen zelf (bijvoorbeeld `td:nth-child(3) { text-align: right; }`).
:::

### Codevoorbeeld: Kolommen accentueren via `<col>`

In het onderstaande voorbeeld voorzien we de kolom met de totaalscore van een opvallende accentkleur via een klasse op het `<col>`-element:

<CodeSandbox
  title="Voorbeeld: Kolommen stijlen met colgroup en col"
  activeCodeTab="css"
  height="440px"
  highlightCss="17-19,21-24"
  css='/* Universele resetter */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  color: #212529;
  padding: 1.5rem;
}
table {
  width: 100%;
  border-collapse: collapse;
}
/* Kolomstijlen via col en colgroup */
.kolom-accent {
  background-color: #fff3cd;
}
.kolom-belangrijk {
  background-color: #fce8e6;
  border-left: 2px solid #e87722;
}
caption {
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-align: left;
}
th, td {
  padding: 0.6rem 1rem;
  border: 1px solid #dee2e6;
}
thead th {
  background-color: #1e2d5a;
  color: #ffffff;
}
td:last-child {
  font-weight: bold;
}'
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kolommen stijlen met colgroup</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <table>
    <caption>Examenresultaten - Thomas More Campus Geel</caption>
    <colgroup>
      <col>
      <col class="kolom-accent">
      <col class="kolom-belangrijk">
    </colgroup>
    <thead>
      <tr>
        <th scope="col">Student</th>
        <th scope="col">Web Essentials</th>
        <th scope="col">Totaalscore</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>r0123456</td>
        <td>15 / 20</td>
        <td>75%</td>
      </tr>
      <tr>
        <td>r0654321</td>
        <td>17 / 20</td>
        <td>85%</td>
      </tr>
    </tbody>
  </table>
</body>
</html>'
/>

## Responsieve tabellen op mobiele toestellen

Een van de grootste uitdagingen bij tabellen op het web is hun stugge tweedimensionale karakter. Op een breed computerscherm oogt een tabel met zes kolommen prachtig, maar op een smartphone met een schermbreedte van 375 pixels past zo'n tabel fysiek niet in het scherm.

Als je niets onderneemt, forceert een brede tabel de volledige pagina om horizontaal breder te worden, waardoor bezoekers onhandig over de hele website heen en weer moeten swipen.

### De beste oplossing: een horizontaal scrollbare wrapper

De meest elegante, universele en gebruiksvriendelijke oplossing is de tabel in te sluiten in een omhullend container-element (`<div class="tabel-container">`) en daarop horizontale overloop toe te staan:

```html
<div class="tabel-container">
  <table>
    <!-- inhoud van de tabel -->
  </table>
</div>
```

In je CSS voeg je de volgende stijl toe:

```css
.tabel-container {
  width: 100%;
  overflow-x: auto;
}
```

Dankzij `overflow-x: auto;` blijft de rest van je pagina netjes passend op het telefoonscherm, terwijl de bezoeker binnen de tabel zelf soepel horizontaal kan vegen om alle kolommen te inspecteren.

## Tabeleigenschappen schrijven met Emmet in PhpStorm

In PhpStorm kan je CSS-eigenschappen voor tabellen razendsnel uitschrijven met Emmet-afkortingen. Typ de code in een `<style>`-tag of een `.css`-bestand en druk direct op `Tab`:

| Doel | Emmet-afkorting | Resultaat in CSS |
|---|---|---|
| Samengevouwen randen | `bdcl:c` + `Tab` | `border-collapse: collapse;` |
| Gescheiden randen | `bdcl:s` + `Tab` | `border-collapse: separate;` |
| Tussenruimte randen | `bds` + `Tab` | `border-spacing: ;` |
| Bijschrift onderaan | `cps:b` + `Tab` | `caption-side: bottom;` |
| Bijschrift bovenaan | `cps:t` + `Tab` | `caption-side: top;` |
| Vaste tabellay-out | `tbl:f` + `Tab` | `table-layout: fixed;` |
| Verticale uitlijning midden | `va:m` + `Tab` | `vertical-align: middle;` |
| Verticale uitlijning boven | `va:t` + `Tab` | `vertical-align: top;` |

<PageSummary>

### Syntaxis in een oogopslag

| Eigenschap | Mogelijke waarden | Voorbeeld |
|---|---|---|
| `border-collapse` | `collapse`, `separate` | `border-collapse: collapse;` |
| `border-spacing` | lengte (bv. `4px`, `0.5rem 1rem`) | `border-spacing: 8px;` |
| `caption-side` | `top`, `bottom` | `caption-side: bottom;` |
| `empty-cells` | `show`, `hide` | `empty-cells: hide;` |
| `table-layout` | `auto`, `fixed` | `table-layout: fixed;` |
| `text-align` | `left`, `right`, `center` | `text-align: right;` |
| `vertical-align` | `top`, `middle`, `bottom` | `vertical-align: top;` |
| `tbody tr:nth-child(even)` | geldige CSS-regels | `background-color: #f8f9fa;` |
| `tbody tr:hover` | geldige CSS-regels | `background-color: #e8f0fe;` |

### Regels en afspraken

- **Voeg randen altijd samen met `border-collapse: collapse`:** Dit voorkomt lelijke dubbele celranden en vormt de standaard voor vrijwel alle moderne datatabellen.
- **Verplaats `<caption>` nooit in HTML:** Wil je het bijschrift onder de tabel tonen, behoud dan de semantische plaatsing direct na `<table>` en gebruik uitsluitend `caption-side: bottom;` in CSS.
- **Gebruik `padding` voor celruimte:** Marges (`margin`) werken niet op `<th>`, `<td>` of `<tr>`. Binnenruimte realiseer je altijd met `padding` op de cellen.
- **Lijn getallen rechts uit:** Lijn gewone tekst links uit (`text-align: left;`), maar zet numerieke waarden, bedragen en totalen consequent rechts (`text-align: right;`) voor optimale verticale vergelijkbaarheid.
- **Selecteer binnen `tbody`:** Gebruik `tbody tr:nth-child(even)` voor zebra-striping zodat kolomkoppen in `<thead>` niet per ongeluk meekleuren.
- **Beperk CSS op `<col>` en `<colgroup>`:** Gebruik `<col>` uitsluitend voor `background-color`, `width`, `border` (bij `collapse`) en `visibility`. Typografische eigenschappen zoals `color` of `text-align` werken niet op `<col>` en horen thuis op de cellen zelf.

### Veelgemaakte fouten

- Vergeten om `border-collapse: collapse;` in te stellen, waardoor er onbedoeld dubbele randen rond elke tabelcel ontstaan.
- `border-spacing` proberen te gebruiken terwijl `border-collapse: collapse;` actief is (werkt enkel bij `border-collapse: separate;`).
- Marges (`margin`) proberen in te stellen op `<td>` of `<th>` in plaats van `padding`.
- De `<caption>`-tag in HTML onder de tabel zetten om hem visueel onderaan te krijgen (dit is ongeldige HTML; gebruik `caption-side: bottom`).
- Eigenschappen zoals `color` of `text-align` toekennen aan een `<col>`-element en verbaasd zijn dat de tekstkleur of uitlijning van de cellen niet wijzigt.
- Geen `overflow-x: auto` voorzien rond brede tabellen, waardoor de mobiele weergave breekt.

### Tips voor beginners

- Gebruik Emmet in PhpStorm: typ `bdcl:c` en druk op `Tab` voor `border-collapse: collapse;`, en `cps:b` voor `caption-side: bottom;`.
- Voeg altijd een subtiele `tbody tr:hover` toe aan grote tabellen om het scannen van rijen voor de gebruiker aangenamer te maken.
- Open de browser DevTools (`F12`) en inspecteer de berekende kolombreedtes bij het schakelen tussen `table-layout: auto` en `table-layout: fixed`.

</PageSummary>

## Oefeningen

### Oefening 1: Drankenkaart van de campuscafetaria

In deze oefening vorm je een eenvoudige HTML-tabel om tot een verzorgde menukaart.

Maak in PhpStorm een nieuw bestand aan met de naam `cafetaria-dranken.html` met bijbehorende `stijl.css`.

1. Maak de volledige HTML5-basisstructuur aan met de paginatitel `Campuscafetaria Thomas More Geel`.
2. Plaats een tabel met de volgende gegevens:
   - Een `<caption>` met de tekst: *Prijslijst warme en koude dranken - Campus Geel*.
   - Een `<thead>` met kolomtitels: *Drank*, *Categorie* en *Prijs*.
   - Een `<tbody>` met minstens vijf rijen dranken (bijv. Koffie, Muntthee, Plat water, Bruiswater, Vers fruitsap).
3. Breng de volgende CSS-stijlen aan in `stijl.css`:
   - Pas de universele resetter (`* { box-sizing: border-box; margin: 0; padding: 0; }`) toe.
   - Stel een verzorgd schreefloos lettertype in op `body` met een zachte achtergrondkleur.
   - Geef de tabel een breedte van `100%` (met een `max-width` van `40rem`) en centreer deze op het scherm met `margin: 2rem auto;`.
   - Zorg dat alle randen samensmelten met `border-collapse: collapse;`.
   - Geef de cellen een `padding` van `0.6rem 1rem` en een subtiele onderrand (`1px solid #dee2e6`).
   - Geef de koptitels (`<thead>`) een donkerblauwe achtergrond (`#1e2d5a`) met witte tekst.
   - Lijn de dranken en categorieën links uit, maar lijn de prijzen rechts uit.
   - Verplaats het bijschrift naar de onderkant van de tabel met `caption-side: bottom;`, lijn het rechts uit en geef het een gedempte grijze kleur.

### Oefening 2: Puntenoverzicht met zebra-striping en hover-effect

In deze oefening maak je een datatabel overzichtelijk met behulp van geavanceerde selectoren en visuele feedback.

Maak een bestand `resultaten.html` aan in PhpStorm.

1. Bouw een semantische tabel op voor een module met 4 kolommen: *Student*, *Opdracht 1 (20%)*, *Opdracht 2 (30%)* en *Examen (50%)*.
2. Vul de `<tbody>` met minstens zes rijen fictieve studenten en hun behaalde punten.
3. Voeg een `<tfoot>` toe met het vakgemiddelde per kolom.
4. Schrijf de nodige CSS:
   - Voeg randen samen met `border-collapse: collapse;`.
   - Voorzie elke even rij in de tabelromp (`tbody tr:nth-child(even)`) van een lichtgrijze achtergrondkleur (`#f8f9fa`) om zebra-striping te creëren.
   - Zorg dat wanneer de muis over een rij in de romp beweegt (`tbody tr:hover`), de rij oplicht in een zachte oranje of blauwe tint (bv. `#fff3cd` of `#e8f0fe`).
   - Lijn alle cijferkolommen consequent rechts uit.
   - Maak de kolom met studentennamen extra duidelijk door `tbody td:first-child` vetgedrukt (`font-weight: 600`) te maken.
   - Geef de samenvattingsrij in `<tfoot>` een duidelijke bovenrand van `2px solid #1e2d5a` en een afwijkende achtergrondkleur.

### Oefening 3: Responsief lesrooster met vaste kolombreedtes

Maak een bestand `lesrooster.html` aan.

1. Maak een lesrooster voor de studenten van Thomas More Campus Geel met 6 kolommen: *Lesblok*, *Maandag*, *Dinsdag*, *Woensdag*, *Donderdag* en *Vrijdag*.
2. Voorzie vier tijdsblokken (bv. *08.30 - 10.30*, *10.45 - 12.45*, *13.30 - 15.30*, *15.45 - 17.45*).
3. Voeg verschillende vakken in, waarbij sommige vakken meerdere uren innemen met `rowspan` (bijvoorbeeld een projectnamiddag van 4 uur).
4. Pas in CSS de eigenschap `table-layout: fixed;` toe op de tabel, zodat alle weekdagen exact dezelfde breedte krijgen.
5. Zorg dat de inhoud van de cellen netjes bovenin uitlijnt met `vertical-align: top;`.
6. Plaats de tabel binnen een `<div class="tabel-wrapper">` en maak de tabel responsief met `overflow-x: auto;`.
7. Test het resultaat in Google Chrome: open de DevTools (`F12`), activeer de apparaatsimulatie (Ctrl+Shift+M) en verklein het scherm naar iPhone-formaat. Controleer of de tabel binnen zijn container horizontaal kan scrollen zonder dat de webpagina breekt.
