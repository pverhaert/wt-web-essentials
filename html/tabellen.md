---
title: Tabellen
---

# Tabellen

## Leerdoelen

Na dit hoofdstuk kan je:

- Uitleggen wanneer je een tabel wel en niet mag gebruiken op een webpagina
- Een eenvoudige datatabel opbouwen met `<table>`, `<tr>`, `<th>` en `<td>`
- Een beschrijvende tabeltitel toevoegen met `<caption>`
- De toegankelijkheid voor schermlezers waarborgen met het `scope`-attribuut op `<th>`
- Cellen horizontaal en verticaal samenvoegen met `colspan` en `rowspan`
- Een grote tabel semantisch opdelen met `<thead>`, `<tbody>` en `<tfoot>`
- Kolommen semantisch groeperen met `<colgroup>` en `<col>`
- Snel tabellen genereren in PhpStorm met behulp van Emmet-afkortingen

Soms wil je gegevens op een overzichtelijke manier presenteren in rijen en kolommen. Denk aan een lesrooster, sportuitslagen, de specificaties van een smartphone of de tarieven van een abonnement. In HTML gebruik je hiervoor tabellen. In dit hoofdstuk leer je hoe je tabellen semantisch correct, toegankelijk en overzichtelijk structureert.

## Waarvoor dienen tabellen (en waarvoor niet)?

Een tabel in HTML is uitsluitend bedoeld voor **tweedimensionale gegevens** (gegevens die een logische relatie hebben tot een specifieke rij en kolom tegelijk).

::: danger Gebruik tabellen nooit voor lay-out
In de begintijd van het web (de jaren 90) bestonden moderne CSS-technieken zoals Flexbox en CSS Grid nog niet. Webontwikkelaars gebruikten toen onzichtbare tabellen om navigatiebalken, zijbalken en teksten naast elkaar op het scherm te dwingen.

Dit is vandaag de dag ten strengste verboden:

- **Slecht voor toegankelijkheid:** Schermlezers voor slechtziende gebruikers proberen de tabel te ontleden als gegevens. Een pagina-indeling via tabellen klinkt voor hen als een onbegrijpelijke brij van rijen en cellen.
- **Niet responsief:** Tabellen zijn van nature breed en passen zich erg moeilijk aan smartphoneschermen aan.
- **Verkeerde semantiek:** HTML dient voor de betekenis en de structuur van de inhoud, terwijl CSS de visuele lay-out bepaalt.

Kort samengevat: gebruik tabellen enkel wanneer de gegevens logisch gezien in een spreadsheet (zoals Excel) zouden passen.
:::

::: tip Tabellen vormgeven met CSS
Standaard toont een webbrowser een HTML-tabel zonder duidelijke randen of achtergrondkleuren. De visuele opmaak (randen samenvoegen via `border-collapse`, opvulling met `padding`, wisselende rijkleuren) leer je in de cursus CSS bij het hoofdstuk [CSS3 Tabellen](/css/tabellen). In dit hoofdstuk focussen we zuiver op de HTML-structuur, al zie je in de interactieve sandboxes ter illustratie al enkele basisstijlen zodat de rijen en kolommen duidelijk herkenbaar zijn.
:::

## De basisstructuur van een tabel

Een basistabel bestaat uit vier kernelementen:

- **`<table>`:** Het omsluitende element waarin de volledige tabel zich bevindt.
- **`<caption>`:** De titel of korte beschrijving van de tabel. Als je een `<caption>` gebruikt, moet deze altijd direct als eerste element na de openingstag `<table>` staan.
- **`<tr>` (table row):** Definieert een horizontale rij cellen.
- **`<th>` (table header):** Definieert een koptitelcel (kolom- of rijtitel). De browser toont de inhoud van een `<th>` standaard vetgedrukt en gecentreerd.
- **`<td>` (table data):** Definieert een normale gegevenscel.

::: tip Positie van de caption in HTML en CSS
In de HTML-code moet het `<caption>`-element **altijd het allereerste kindelement** zijn, direct na de openingstag `<table>` en nog vóór eventuele `<colgroup>`-, `<thead>`- of `<tr>`-tags. Een `<caption>` op een andere plaats in de tabel zetten leidt gegarandeerd tot een foutmelding in de W3C-validator.

Standaard toont de browser de `<caption>` visueel gecentreerd bovenaan de tabel. Wil je een titel of bronvermelding liever onderaan de tabel tonen? Verplaats de `<caption>`-tag dan nooit in je HTML-code, maar pas dit in CSS aan met de eigenschap `caption-side: bottom;`.
:::

Elke tabel wordt rij voor rij opgebouwd, van links naar rechts en van boven naar beneden:

```html
<table>
  <caption>Prijslijst Dranken</caption>
  <tr>
    <th scope="col">Drank</th>
    <th scope="col">Inhoud</th>
    <th scope="col">Prijs</th>
  </tr>
  <tr>
    <td>Koffie</td>
    <td>20 cl</td>
    <td>€ 2,20</td>
  </tr>
  <tr>
    <td>Plat water</td>
    <td>33 cl</td>
    <td>€ 1,80</td>
  </tr>
</table>
```

### Toegankelijkheid met het `scope`-attribuut

Voor een ziende bezoeker is het meteen duidelijk welke koppen bij welke kolommen horen. Voor iemand die een schermlezer gebruikt, is dat minder vanzelfsprekend.

Door het attribuut `scope` toe te voegen aan een `<th>`-element, geef je expliciet aan waar de kop betrekking op heeft:

- **`scope="col"`:** Geeft aan dat deze cel de hoofding is voor de onderliggende **kolom**.
- **`scope="row"`:** Geeft aan dat deze cel de hoofding is voor de naastliggende **rij**.

Wanneer een schermlezer van cel naar cel springt, leest hij dankzij `scope` automatisch eerst de relevante kolom- of rijkop voor, zodat de gebruiker altijd weet waar de cijfers of gegevens over gaan.

### Codevoorbeeld: Eenvoudige tabel met koppen en caption

In het onderstaande voorbeeld zie je een drankaanbod. Merk op hoe `<caption>` boven de tabel verschijnt en hoe `<th>` het onderscheid maakt tussen titels en gegevens.

```html
<table>
  <caption>Cafetaria Thomas More Campus Geel - Drankaanbod</caption>
  <tr>
    <th scope="col">Product</th>
    <th scope="col">Formaat</th>
    <th scope="col">Prijs</th>
  </tr>
  <tr>
    <td>Koffie</td>
    <td>Normaal</td>
    <td>€ 1,80</td>
  </tr>
  <tr>
    <td>Thee natuur</td>
    <td>Normaal</td>
    <td>€ 1,80</td>
  </tr>
  <tr>
    <td>Mineraalwater</td>
    <td>50 cl</td>
    <td>€ 1,50</td>
  </tr>
  <tr>
    <td>Vers fruitsap</td>
    <td>25 cl</td>
    <td>€ 2,50</td>
  </tr>
</table>
```

<CodeSandbox
  title="Voorbeeld: Eenvoudige tabel met caption en koppen"
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cafetaria Thomas More Campus Geel</title>
  <style>
    table, th, td {
      border: 1px solid #ccc;
      border-collapse: collapse;
      padding: 6px 10px;
    }
    th {
      background-color: #f2f4f8;
    }
    caption {
      font-weight: bold;
      margin-bottom: 8px;
    }
  </style>
</head>
<body>
  <table>
    <caption>Cafetaria Thomas More Campus Geel - Drankaanbod</caption>
    <tr>
      <th scope="col">Product</th>
      <th scope="col">Formaat</th>
      <th scope="col">Prijs</th>
    </tr>
    <tr>
      <td>Koffie</td>
      <td>Normaal</td>
      <td>€ 1,80</td>
    </tr>
    <tr>
      <td>Thee natuur</td>
      <td>Normaal</td>
      <td>€ 1,80</td>
    </tr>
    <tr>
      <td>Mineraalwater</td>
      <td>50 cl</td>
      <td>€ 1,50</td>
    </tr>
    <tr>
      <td>Vers fruitsap</td>
      <td>25 cl</td>
      <td>€ 2,50</td>
    </tr>
  </table>
</body>
</html>'
  height="460px"
/>

## Cellen samenvoegen: `colspan` en `rowspan`

In meer complexe overzichten komt het vaak voor dat een cel zich over meerdere kolommen of rijen moet uitstrekken. Denk bijvoorbeeld aan een lesblok dat twee lesuren duurt, of een categoriehoofding die over de hele breedte van de tabel loopt.

Hiervoor gebruik je de attributen `colspan` en `rowspan` op een `<th>` of `<td>`:

- **`colspan="aantal"` (column span):** Voegt cellen **horizontaal** samen over meerdere kolommen.
- **`rowspan="aantal"` (row span):** Voegt cellen **verticaal** samen over meerdere rijen.

### Horizontaal samenvoegen met `colspan`

Wanneer je een cel twee kolommen breed maakt met `colspan="2"`, neemt deze cel de plaats in van twee normale cellen in die rij. Dat betekent dat je in diezelfde rij één `<td>` of `<th>` minder moet schrijven:

```html
<tr>
  <!-- Deze cel neemt 2 kolommen in beslag -->
  <th colspan="2" scope="colgroup">Warme dranken</th>
  <th scope="col">Prijs</th>
</tr>
```

### Verticaal samenvoegen met `rowspan`

Wanneer je een cel twee rijen hoog maakt met `rowspan="2"`, zakt deze cel door naar de onderliggende rij. Dat betekent dat je in de **volgende rij** één cel minder moet typen op die positie:

```html
<tr>
  <!-- Deze cel zakt 2 rijen omlaag -->
  <th rowspan="2" scope="rowgroup">Ochtend</th>
  <td>08.30 - 10.30</td>
  <td>Web Essentials</td>
</tr>
<tr>
  <!-- Geen eerste cel hier, want 'Ochtend' loopt hier nog door! -->
  <td>10.45 - 12.45</td>
  <td>Programming Basics</td>
</tr>
```

::: warning Veelgemaakte fout bij samenvoegen
Als je cellen samenvoegt maar vergeet om de overtollige `<td>`-tags weg te laten, duwt de samengevoegde cel de andere cellen naar rechts buiten de tabel. Tel in elke rij steeds goed na of de som van alle cellen en hun `colspan`-waarden exact gelijk is aan het totale aantal kolommen.
:::

### Codevoorbeeld: Lesrooster met `colspan` en `rowspan`

In het onderstaande voorbeeld zie je een dagoverzicht voor studenten op de campus. Merk op hoe het vak Project verticaal over twee opeenvolgende lesblokken loopt (`rowspan="2"`) en hoe de studietijd onderaan horizontaal over twee kolommen loopt (`colspan="2"`).

```html
<table>
  <caption>Lesrooster ICT - Thomas More Campus Geel</caption>
  <tr>
    <th scope="col">Tijdstip</th>
    <th scope="col">Lokaal</th>
    <th scope="col">Onderdeel</th>
  </tr>
  <tr>
    <td>08.30 - 10.30</td>
    <td>Lokaal 1.02</td>
    <td>Web Essentials</td>
  </tr>
  <tr>
    <td>10.45 - 12.45</td>
    <td rowspan="2">Lokaal 2.15</td>
    <td rowspan="2">Projectwerk ICT</td>
  </tr>
  <tr>
    <td>13.30 - 15.30</td>
  </tr>
  <tr>
    <td>15.45 - 17.15</td>
    <td colspan="2">Zelfstandige studietijd in het open leercentrum</td>
  </tr>
</table>
```

<CodeSandbox
  title="Voorbeeld: Cellen samenvoegen met colspan en rowspan"
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lesrooster ICT</title>
  <style>
    table, th, td {
      border: 1px solid #ccc;
      border-collapse: collapse;
      padding: 8px 12px;
    }
    th {
      background-color: #f2f4f8;
    }
    caption {
      font-weight: bold;
      margin-bottom: 8px;
    }
  </style>
</head>
<body>
  <table>
    <caption>Lesrooster ICT - Thomas More Campus Geel</caption>
    <tr>
      <th scope="col">Tijdstip</th>
      <th scope="col">Lokaal</th>
      <th scope="col">Onderdeel</th>
    </tr>
    <tr>
      <td>08.30 - 10.30</td>
      <td>Lokaal 1.02</td>
      <td>Web Essentials</td>
    </tr>
    <tr>
      <td>10.45 - 12.45</td>
      <td rowspan="2">Lokaal 2.15</td>
      <td rowspan="2">Projectwerk ICT</td>
    </tr>
    <tr>
      <td>13.30 - 15.30</td>
    </tr>
    <tr>
      <td>15.45 - 17.15</td>
      <td colspan="2">Zelfstandige studietijd in het open leercentrum</td>
    </tr>
  </table>
</body>
</html>'
  height="480px"
/>

## Semantische groepering: `<thead>`, `<tbody>` en `<tfoot>`

Bij grotere of professionele tabellen is het belangrijk om structuur aan te brengen in de verschillende zones van de tabel. HTML5 biedt hiervoor drie semantische elementen:

- **`<thead>` (table head):** Groepeert de rij(en) met de kolomtitels. Er mag maximaal één `<thead>` in een tabel staan.
- **`<tbody>` (table body):** Groepeert de feitelijke gegevensrijen. Een tabel kan één of meerdere `<tbody>`-elementen bevatten (bijvoorbeeld om verschillende categorieën gegevens af te bakenen).
- **`<tfoot>` (table foot):** Groepeert de samenvattende voettekstrij(en), zoals een totaalbedrag, een gemiddelde of een toelichting.

```html
<table>
  <caption>Boekenverkoop</caption>
  <thead>
    <tr>
      <th scope="col">Titel</th>
      <th scope="col">Aantal</th>
      <th scope="col">Prijs</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Web Essentials Handboek</td>
      <td>25</td>
      <td>€ 35,00</td>
    </tr>
    <tr>
      <td>Git in de Praktijk</td>
      <td>18</td>
      <td>€ 24,50</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Totaal</th>
      <td>43</td>
      <td>€ 1316,00</td>
    </tr>
  </tfoot>
</table>
```

### Waarom zijn deze elementen nuttig?

1. **Toegankelijkheid:** Schermlezers herkennen direct welke rijen titels zijn, welke data bevatten en welke een samenvatting vormen.
2. **Scrollen in lange tabellen:** Met CSS kan je later instellen dat de `<tbody>` scrollt terwijl de `<thead>` bovenaan netjes vast blijft staan (sticky header).
3. **Afdrukken:** Wanneer een gebruiker een lange tabel afdrukt die meerdere pagina's beslaat, herhaalt de browser de `<thead>` en `<tfoot>` automatisch bovenaan en onderaan elke pagina.

## Kolommen beheren met `<colgroup>` en `<col>`

Omdat een HTML-tabel uitsluitend rij voor rij wordt gecodeerd (`<tr>`), bestaat er in de HTML-structuur geen direct element dat een hele kolom omvat. Als je later met CSS een bepaalde kolom een vaste breedte of een achtergrondkleur wil geven, zou je zonder extra hulpmiddelen elke individuele cel in die kolom van een klasse moeten voorzien.

Om kolommen toch logisch te groeperen en voor te bereiden op latere CSS-styling, gebruik je de elementen `<colgroup>` en `<col>`:

- **`<colgroup>`:** Groepeert een verzameling van één of meerdere kolommen.
- **`<col>`:** Vertegenwoordigt een individuele kolom binnen de groep. Dit is een leeg element (zonder sluitingstag).
- **Het attribuut `span`:** Met `span="n"` laat je één `<col>`-element gelden voor *n* opeenvolgende kolommen.

Plaats `<colgroup>` direct na `<caption>` (indien aanwezig) en altijd vóór `<thead>`, `<tbody>` of de eerste `<tr>`.

```html
<table>
  <caption>Resultaten ICT Module</caption>
  <!-- Eerste kolom (studentnummer) -->
  <colgroup>
    <col class="kolom-id">
  </colgroup>
  <!-- Volgende twee kolommen (theorie en praktijk) -->
  <colgroup span="2" class="kolom-punten"></colgroup>
  <thead>
    <tr>
      <th scope="col">Student</th>
      <th scope="col">Theorie</th>
      <th scope="col">Praktijk</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>r0123456</td>
      <td>14</td>
      <td>16</td>
    </tr>
  </tbody>
</table>
```

::: tip Waarom nu al `<col>` leren?
Hoewel de visuele impact van `<col>` pas echt zichtbaar wordt wanneer we CSS-eigenschappen zoals `width`, `background-color` en `visibility` koppelen, zorgt het opnemen van `<colgroup>` in je HTML-structuur voor een robuuste en professionele basis.
:::

### Codevoorbeeld: Complete semantische tabel

In het onderstaande voorbeeld komen alle semantische onderdelen samen: `<caption>`, `<colgroup>`, `<thead>`, `<tbody>` en `<tfoot>`.

```html
<table>
  <caption>Bezoekersstatistieken Infodag - Thomas More Campus Geel</caption>
  <colgroup>
    <col>
    <col span="2">
    <col>
  </colgroup>
  <thead>
    <tr>
      <th scope="col">Opleiding</th>
      <th scope="col">Voormiddag</th>
      <th scope="col">Namiddag</th>
      <th scope="col">Totaal dag</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Graduaat Programmeren</td>
      <td>85</td>
      <td>110</td>
      <td>195</td>
    </tr>
    <tr>
      <td>Graduaat Systeem- en Netwerkbeheer</td>
      <td>65</td>
      <td>95</td>
      <td>160</td>
    </tr>
    <tr>
      <td>Bachelor Toegepaste Informatica</td>
      <td>120</td>
      <td>140</td>
      <td>260</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row">Totale bezoekers</th>
      <td>270</td>
      <td>345</td>
      <td>615</td>
    </tr>
  </tfoot>
</table>
```

<CodeSandbox
  title="Voorbeeld: Gestructureerde tabel met thead, tbody en tfoot"
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bezoekersstatistieken Infodag</title>
  <style>
    table, th, td {
      border: 1px solid #ccc;
      border-collapse: collapse;
      padding: 8px 12px;
    }
    thead th {
      background-color: #1e2d5a;
      color: #ffffff;
    }
    tfoot {
      font-weight: bold;
      background-color: #f2f4f8;
    }
    caption {
      font-weight: bold;
      margin-bottom: 8px;
    }
  </style>
</head>
<body>
  <table>
    <caption>Bezoekersstatistieken Infodag - Thomas More Campus Geel</caption>
    <colgroup>
      <col>
      <col span="2">
      <col>
    </colgroup>
    <thead>
      <tr>
        <th scope="col">Opleiding</th>
        <th scope="col">Voormiddag</th>
        <th scope="col">Namiddag</th>
        <th scope="col">Totaal dag</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Graduaat Programmeren</td>
        <td>85</td>
        <td>110</td>
        <td>195</td>
      </tr>
      <tr>
        <td>Graduaat Systeem- en Netwerkbeheer</td>
        <td>65</td>
        <td>95</td>
        <td>160</td>
      </tr>
      <tr>
        <td>Bachelor Toegepaste Informatica</td>
        <td>120</td>
        <td>140</td>
        <td>260</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <th scope="row">Totale bezoekers</th>
        <td>270</td>
        <td>345</td>
        <td>615</td>
      </tr>
    </tfoot>
  </table>
</body>
</html>'
  height="540px"
/>

## Tabellen genereren met Emmet in PhpStorm

Het handmatig uittypen van tientallen `<tr>`- en `<td>`-tags is tijdrovend. In PhpStorm kan je met behulp van Emmet in een fractie van een seconde een volledig tabelskelet aanmaken.

Typ de gewenste Emmet-afkorting in een HTML-bestand en druk direct op `Tab`:

| Doel | Emmet-afkorting |
| --- | --- |
| Eenvoudige tabel van 3 rijen met 2 cellen | `table>tr*3>td*2` |
| Tabel met koprij en 4 gegevensrijen | `table>tr>th*3^^tr*4>td*3` |
| Volledige structuur met caption en koppen | `table>caption+(tr>th*3)+(tr*3>td*3)` |
| Semantische tabel met thead en tbody | `table>thead>tr>th*3^^tbody>tr*3>td*3` |
| Complete structuur met thead, tbody en tfoot | `table>thead>tr>th*3^^tbody>tr*4>td*3^^tfoot>tr>td*3` |

::: tip De dakje-operator (^) in Emmet
Het dakje-teken (`^`) in Emmet betekent: 'ga één niveau omhoog in de boomstructuur'. Met `thead>tr>th*3^^tbody` zorg je ervoor dat `tbody` op hetzelfde niveau als `thead` wordt geplaatst (als direct kind van `table`), en niet per ongeluk binnen `thead`.
:::

## Oefeningen

### Oefening 1: Prijslijst van de campuscafetaria

Maak in PhpStorm een nieuw bestand aan met de naam `drankkaart.html`.

1. Bouw het standaardskelet van een HTML5-pagina op met een hoofdtitel `<h1>`: `Campuscafetaria De Kleinhoef`.
2. Voeg een tabel toe met een duidelijke beschrijving via `<caption>`: `Aanbod warme en koude dranken`.
3. Maak een koprij met drie kolommen:
   - `Product`
   - `Volume`
   - `Prijs`
4. Voorzie de `<th>`-elementen van het juiste `scope`-attribuut.
5. Voeg minstens vier rijen met dranken en prijzen toe (bijvoorbeeld Espresso, Cappuccino, Plat water, Cola).
6. Controleer het resultaat in je browser en let op hoe de tabelstructuur zonder CSS wordt weergegeven.

### Oefening 2: Examenrooster met `colspan` en `rowspan`

Maak in PhpStorm een nieuw bestand aan met de naam `examenrooster.html`.

1. Bouw de HTML5-basisstructuur op en geef de pagina de titel `Examenplanning Eerste Semester`.
2. Maak een tabel met `<caption>`: `Examenrooster ICT - Thomas More Campus Geel`.
3. Maak een tabel met 4 kolommen: `Dag`, `Tijdstip`, `Vak` en `Lokaal`.
4. Voeg de volgende examenmomenten in en pas `rowspan` en `colspan` toe:
   - **Maandag:**
     - 09.00 - 11.00: Web Essentials (Lokaal 1.04)
     - 11.15 - 12.15: Feedback en inzage (Lokaal 1.04)
     - *Tip:* Het lokaal is hetzelfde voor beide blokken; voeg de lokaalcel samen over 2 rijen met `rowspan="2"`.
   - **Dinsdag:**
     - 09.00 - 12.00: Geen examens (studietijd voor studenten)
     - *Tip:* Laat deze melding over de twee kolommen `Vak` en `Lokaal` lopen met `colspan="2"`.
   - **Woensdag:**
     - 09.00 - 12.00: Programming Basics (Lokaal 2.10)
5. Zorg ervoor dat alle rijen netjes uitlijnen en geen cellen uit de tabel steken.

### Oefening 3: Semantisch verkoopoverzicht met validatie

Maak in PhpStorm een bestand aan met de naam `cursusverkoop.html`.

1. Maak een semantische tabel met een `<caption>`: `Verkoop cursusmateriaal academiejaar 2026-2027`.
2. Voeg een `<colgroup>` toe met twee `<col>`-elementen:
   - De eerste kolom voor de cursusnaam
   - Een samengestelde groep met `span="3"` voor de cijfers (aantal gedrukt, aantal verkocht, voorraad)
3. Gebruik `<thead>` voor de kolomtitels en voorzie elke `<th>` van `scope="col"`.
4. Plaats in de `<tbody>` drie rijen met cursussen (bijvoorbeeld *Web Essentials*, *Database Fundamentals*, *Computer Systems*).
5. Voeg een `<tfoot>` toe met een samenvattingsrij:
   - Gebruik een `<th>` met `scope="row"` en de tekst `Totalen`.
   - Vul de sommen in van de verkochte aantallen en de resterende voorraad.
6. Open het bestand in Google Chrome en valideer de code met de extensie **Validify**. Zorg ervoor dat er nul fouten of waarschuwingen zijn.
