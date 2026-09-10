---
title: Speciale Tekens
---

# Speciale Tekens

Wanneer je tekst schrijft in HTML, kom je tekens tegen die een speciale betekenis hebben voor de browser, zoals het kleiner-dan-teken (`<`) en het groter-dan-teken (`>`). Omdat de browser deze tekens gebruikt om HTML-tags te herkennen, kan je ze niet zomaar als gewone tekst typen. In dit hoofdstuk leer je hoe je met HTML-entiteiten elk gewenst symbool, wiskundig teken of vaste spatie veilig en volgens de standaarden op je pagina toont.

## Leerdoelen

Na dit hoofdstuk kan je:

- Uitleggen waarom gereserveerde tekens in HTML gecodeerd moeten worden
- De opbouw en syntax van een HTML-entiteit ontleden en toepassen
- De vijf gereserveerde basistekens (`<`, `>`, `&`, `"`, `'`) veilig weergeven op een webpagina
- Uitleggen hoe UTF-8 het mogelijk maakt om letters met accenten en emoji's rechtstreeks te kopiëren en plakken
- De vaste spatie (`&nbsp;`) doelgericht inzetten om ongewenste regelafbrekingen te voorkomen
- Veelgebruikte symbolen en typografische tekens opzoeken en gebruiken
- HTML-code controleren op fouten tegen speciale tekens met de W3C-validator

## Waarom speciale tekens coderen?

Een browser leest een HTML-document van boven naar beneden en probeert de inhoud te interpreteren (dit proces heet *parsen*). Zodra de browser een `<`-teken tegenkomt, verwacht hij de naam van een HTML-element, zoals `<p>`, `<h1>` of `<img>`.

Als je in een wiskundige tekst schrijft: `5 < 8`, kan de browser in de war raken. Hij denkt mogelijk dat `< 8` het begin is van een nieuwe HTML-tag. Hierdoor kan een deel van je tekst plotseling verdwijnen of wordt de lay-out van je pagina verstoord.

Om dergelijke verwarring te voorkomen, vervang je gereserveerde tekens door een **HTML-entiteit** (een speciale vervangingscode).

## UTF-8: Accenten en emoji's rechtstreeks kopiëren en plakken

In oudere versies van HTML moesten webontwikkelaars alle letters met accenten (zoals `é`, `ë`, `à` of `ç`) omslachtig omzetten naar entiteiten zoals `&eacute;` of `&ccedil;`. Voor emoji's bestond er toen zelfs helemaal geen ondersteuning.

In moderne webpagina's is dat dankzij de metatag `<meta charset="UTF-8">` in het `<head>`-element niet meer nodig. UTF-8 (Universal Character Set Transformation Format) ondersteunt vrijwel alle tekens, alfabetten en symbolen ter wereld:

- **Letters met accenten:** Woorden zoals `café`, `België`, `recepten` of `kopiëren` typ je gewoon rechtstreeks via je toetsenbord.
- **Valutasymbolen:** Tekens zoals `€`, `$` of `£` typ je direct in je code.
- **Emoji's:** Omdat emoji's deel uitmaken van de officiële Unicode-standaard, kan je ze rechtstreeks kopiëren en plakken (*copy/pasten*) in je HTML-bestanden.

### Hoe voeg je emoji's in?

Je hoeft voor een emoji dus geen code of entiteit te onthouden. Je kan ze op twee eenvoudige manieren toevoegen:

1. **Kopiëren en plakken:** Zoek de gewenste emoji op een website (zoals Emojipedia) en plak hem via `Ctrl + V` (of `Cmd + V`) rechtstreeks in je HTML-code in PhpStorm.
2. **Het emojipaneel van je besturingssysteem:**
   - In **Windows:** Druk op de toetsencombinatie `Win + .` (de Windows-toets samen met de punt) of `Win + ;`. Er verschijnt een pop-upvenster waarin je emoji's kan zoeken en aanklikken.
   - Op **macOS:** Druk op `Command + Control + Spatie`.

```html
<p>Welkom bij onze webshop! 🛒</p>
<p>Bestellingen vanaf € 50 verzenden we gratis. 📦</p>
```

::: tip Emoji's zijn tekst, geen afbeeldingen
Voor de browser is een emoji een tekstkarakter en geen losse afbeelding. Dit betekent dat de emoji automatisch meegroeit met de lettergrootte van de omringende tekst. Wees echter spaarzaam met emoji's: gebruik ze functioneel en vermijd dat een zakelijke pagina er rommelig door oogt.
:::

Wanneer heb je entiteiten dan wél nog nodig? Uitsluitend voor **gereserveerde tekens** (zoals `<` en `&`), voor **de vaste spatie** (`&nbsp;`) en voor **specifieke typografische symbolen** (zoals `&copy;` of `&rarr;`).

## De opbouw van een HTML-entiteit

Elke HTML-entiteit volgt een vast patroon en bestaat uit drie opeenvolgende onderdelen:

1. **Een ampersand (`&`):** Dit teken geeft aan de browser het signaal dat er een speciale entiteit begint.
2. **De entiteitsnaam:** Een herkenbare naam in kleine letters (zoals `lt` voor *less than* of `copy` voor *copyright*).
3. **Een puntkomma (`;`):** Sluit de entiteit formeel af.

```html
&naam;
```

Voorbeelden:

- `&lt;` toont een kleiner-dan-teken (`<`)
- `&gt;` toont een groter-dan-teken (`>`)
- `&amp;` toont een ampersand (`&`)
- `&copy;` toont het copyright-teken (`©`)

::: warning Vergeet de puntkomma niet
Een veelgemaakte fout bij beginners is het weglaten van de afsluitende puntkomma (bijvoorbeeld `&copy` in plaats van `&copy;`). Sommige browsers proberen dit te raden, maar het leidt gegarandeerd tot foutmeldingen in de W3C-validator.
:::

## De vijf gereserveerde tekens

Er zijn vijf tekens die binnen HTML een strikt gereserveerde functie hebben. Wil je deze tekens als letterlijke tekst tonen, dan ben je verplicht om hun entiteit te gebruiken:

| Teken | Betekenis | Entiteit | Waarom gereserveerd? |
| --- | --- | --- | --- |
| `<` | Kleiner dan | `&lt;` | Begint een HTML-tag |
| `>` | Groter dan | `&gt;` | Sluit een HTML-tag |
| `&` | Ampersand / En-teken | `&amp;` | Begint een HTML-entiteit |
| `"` | Dubbel aanhalingsteken | `&quot;` | Sluit attribuutwaarden in |
| `'` | Enkel aanhalingsteken | `&apos;` | Sluit attribuutwaarden in |

::: tip Ezelsbruggetje
Onthoud `&lt;` en `&gt;` aan de hand van de Engelse termen:

- `&lt;` = **L**ess **T**han (kleiner dan, `<`)
- `&gt;` = **G**reater **T**han (groter dan, `>`)
:::

### Ampersands in lopende tekst en links

De ampersand (`&`) wordt in het dagelijks taalgebruik vaak getypt in namen van bedrijven of merken: `Thomas More & Partners`, `Ben & Jerry's`, `H&M`.

Omdat de browser bij elke losse `&` denkt dat er een entiteit volgt, moet je een losse ampersand in HTML altijd schrijven als `&amp;`:

```html
<!-- Fout: niet geldig volgens W3C -->
<p>Welkom bij Thomas More & Partners.</p>

<!-- Juist: semantisch correct en geldig -->
<p>Welkom bij Thomas More &amp; Partners.</p>
```

### Codevoorbeeld: HTML-tags als tekst tonen

Wanneer je een handleiding of programmeercursus schrijft, wil je regelmatig letterlijke HTML-code aan de lezer laten zien. Door `&lt;` en `&gt;` te combineren met het semantische `<code>`-element, voorkom je dat de browser de tags uitvoert.

```html
<h3>HTML-tags veilig weergeven</h3>
<p>Als je over HTML schrijft, moet je tags coderen met entiteiten:</p>
<p>
  Een afbeelding voeg je in met de tag <code>&lt;img src="foto.webp" alt="Campus Geel"&gt;</code>.
</p>
<p>
  In een vergelijking gebruik je entiteiten: 5 &lt; 10 en 100 &gt; 50.
</p>
<p>
  Bedrijfsnamen schrijf je met een gecodeerde ampersand: Johnson &amp; Johnson.
</p>
<p>
  Dankzij UTF-8 kan je emoji's rechtstreeks kopiëren en plakken: 🚀 Veel succes met coderen! 💻
</p>
```

<CodeSandbox
  title="Voorbeeld: Gereserveerde tekens, code en emoji's tonen"
  highlightHtml=""
  highlightCss=""
  highlightJs=""
  html="<h3>HTML-tags veilig weergeven</h3>
<p>Als je over HTML schrijft, moet je tags coderen met entiteiten:</p>
<p>
  Een afbeelding voeg je in met de tag <code>&amp;lt;img src=&quot;foto.webp&quot; alt=&quot;Campus Geel&quot;&amp;gt;</code>.
</p>
<p>
  In een vergelijking gebruik je entiteiten: 5 &amp;lt; 10 en 100 &amp;gt; 50.
</p>
<p>
  Bedrijfsnamen schrijf je met een gecodeerde ampersand: Johnson &amp;amp; Johnson.
</p>
<p>
  Dankzij UTF-8 kan je emoji's rechtstreeks kopiëren en plakken: 🚀 Veel succes met coderen! 💻
</p>"
  height="360px"
/>

## De vaste spatie: `&nbsp;` (non-breaking space)

In normale omstandigheden behandelt de browser meerdere spaties achter elkaar als één enkele spatie. Bovendien mag de browser een zin aan het einde van een regel op elke willekeurige spatie afbreken naar de volgende regel.

Soms wil je dat gedrag echter bewust vermijden. De entiteit **`&nbsp;`** staat voor **non-breaking space** (een vaste of niet-afbrekende spatie).

Een vaste spatie heeft twee unieke eigenschappen:

1. **Ze voorkomt een regelafbreking:** De twee woorden of getallen aan weerszijden van `&nbsp;` blijven altijd op dezelfde regel staan.
2. **Ze wordt niet samengevoegd:** Als je meerdere `&nbsp;` achter elkaar plaatst, behoudt de browser ze allemaal.

### Waar gebruik je de vaste spatie?

Gebruik `&nbsp;` overal waar het storend of verwarrend is als twee delen van een getal of uitdrukking over twee regels worden gesplitst:

- **Telefoonnummers:** `014&nbsp;56&nbsp;23&nbsp;10` (voorkomt dat een telefoonnummer half op de eerste en half op de tweede regel staat).
- **Bedragen en eenheden:** `€&nbsp;250` of `20&nbsp;°C` of `15&nbsp;km` (het getal en de eenheid blijven netjes samen).
- **Persoonsnamen en titels:** `Koning&nbsp;Filip` of `Dr.&nbsp;Peeters`.
- **Zwevende woorden vermijden:** Een kort woordje aan het einde van een zin (zoals een lidwoord of voegwoord) koppel je met `&nbsp;` aan het volgende woord zodat het niet eenzaam op een nieuwe regel belandt.

```html
<p>Het inschrijvingsgeld voor dit academiejaar bedraagt €&nbsp;1115.</p>
<p>Voor vragen bel je naar het nummer 014&nbsp;56&nbsp;23&nbsp;10.</p>
```

::: danger Gebruik de vaste spatie nooit voor lay-out
Gebruik `&nbsp;` nooit om witruimte, inspringingen of kolommen te maken (bijvoorbeeld door tien keer `&nbsp;&nbsp;&nbsp;` te typen om een woord naar rechts te duwen).

In HTML structureer je uitsluitend de inhoud en de betekenis. Het toevoegen van witruimte, marges en uitlijning is de taak van CSS (via eigenschappen zoals `margin`, `padding` en `gap`).
:::

### Codevoorbeeld: Het effect van `&nbsp;`

In het onderstaande voorbeeld zie je twee identieke zinnen met een telefoonnummer. Maak het venster smaller om te zien wat er gebeurt: het nummer met gewone spaties breekt lelijk af, terwijl het nummer met vaste spaties altijd als één geheel bijeen blijft.

```html
<!-- Zonder vaste spatie: kan lelijk afbreken -->
<p>
  Neem contact op met het onthaal via 014 56 23 10.
</p>

<!-- Met vaste spatie: blijft altijd op één regel -->
<p>
  Neem contact op met het onthaal via 014&nbsp;56&nbsp;23&nbsp;10.
</p>
```

<CodeSandbox
  title="Voorbeeld: Vaste spatie in actie"
  highlightHtml=""
  highlightCss=""
  highlightJs=""
  html="<h3>Het verschil tussen een gewone spatie en een vaste spatie</h3>
<p>Maak het venster of paneel smaller om het effect van regelafbrekingen te zien:</p>

<h4>1. Gewone spaties (nummer breekt af):</h4>
<p>
  Bij vragen over de opleiding ICT aan Thomas More Campus Geel neem je contact op met het nummer 014 56 23 10.
</p>

<h4>2. Vaste spaties (nummer blijft altijd één geheel):</h4>
<p>
  Bij vragen over de opleiding ICT aan Thomas More Campus Geel neem je contact op met het nummer 014&amp;nbsp;56&amp;nbsp;23&amp;nbsp;10.
</p>"
  height="360px"
/>

## Veelgebruikte symbolen en typografie

Naast gereserveerde tekens en vaste spaties biedt HTML entiteiten voor nuttige symbolen en typografische tekens:

| Symbool | Betekenis | Entiteit | Toepassing |
| --- | --- | --- | --- |
| `©` | Auteursrecht (Copyright) | `&copy;` | Copyright-vermelding in de footer van een pagina |
| `®` | Geregistreerd handelsmerk | `&reg;` | Merknamen en productnamen |
| `™` | Handelsmerk (Trademark) | `&trade;` | Niet-geregistreerde handelsmerken |
| `←` | Pijl naar links | `&larr;` | Terugknoppen en paginanavigatie |
| `→` | Pijl naar rechts | `&rarr;` | Lees meer-knoppen en doorverwijzingen |
| `↑` | Pijl naar boven | `&uarr;` | Terug naar boven-knoppen |
| `↓` | Pijl naar beneden | `&darr;` | Downloadknoppen |
| `•` | Opsommingsteken (Bullet) | `&bull;` | Scheidingsteken tussen menu-items of inline opsommingen |
| `…` | Beletselteken (Ellipsis) | `&hellip;` | Geeft aan dat er meer tekst volgt of dat een actie laadt |
| `×` | Vermenigvuldigingsteken | `&times;` | Afsluitknoppen (sluitkruisje) of wiskundige berekeningen |

::: tip Beletselteken versus drie losse puntjes
Typ in professionele teksten liever `&hellip;` dan drie losse punten achter elkaar (`...`). De entiteit `&hellip;` zorgt voor de juiste typografische spatiëring en voorkomt dat de puntjes aan het einde van een regel per ongeluk worden opgesplitst.
:::

### Codevoorbeeld: Typografische symbolen in een voettekst

In webontwikkeling combineer je deze entiteiten regelmatig in knoppen, linkteksten en footers:

```html
<footer>
  <p>&copy;&nbsp;2026 Thomas More Campus Geel &bull; Alle rechten voorbehouden.</p>
  <p>
    <a href="opleidingen.html">Bekijk onze opleidingen &rarr;</a>
  </p>
</footer>
```

<CodeSandbox
  title="Voorbeeld: Typografische symbolen en voettekst"
  highlightHtml=""
  highlightCss=""
  highlightJs=""
  html="<h3>Typografische entiteiten in de praktijk</h3>

<p>
  <a href=&quot;#&quot;>Lees het volledige artikel &amp;rarr;</a>
</p>

<p>
  Status: De gegevens worden geladen&amp;hellip;
</p>

<p>
  Afmetingen van het lokaal: 12&amp;nbsp;&amp;times;&amp;nbsp;8 meter.
</p>

<hr>

<footer>
  <p>&amp;copy;&amp;nbsp;2026 Thomas More Campus Geel &amp;bull; Kleinhoefstraat 4 &amp;bull; 2440 Geel</p>
</footer>"
  height="350px"
/>

<PageSummary>

### Syntaxis in een oogopslag

| Teken | Omschrijving | Entiteitnaam | Entiteitnummer |
|---|---|---|---|
| `<` | Kleiner dan (opentag) | `&lt;` | `&#60;` |
| `>` | Groter dan (sluittag) | `&gt;` | `&#62;` |
| `&` | En-teken (ampersand) | `&amp;` | `&#38;` |
| `"` | Dubbel aanhalingsteken | `&quot;` | `&#34;` |
| `'` | Enkel aanhalingsteken / apostrof | `&apos;` | `&#39;` |
| ` ` | Vaste spatie (non-breaking space) | `&nbsp;` | `&#160;` |
| `©` | Copyright-symbool | `&copy;` | `&#169;` |
| `€` | Euroteken | `&euro;` | `&#8364;` |
| `•` | Opsommingsteken (bullet) | `&bull;` | `&#8226;` |
| `×` | Maalteken / vermenigvuldiging | `&times;` | `&#215;` |

### Regels en afspraken

- **Syntaxis van een entiteit:** Begint **altijd** met een ampersand (`&`) en eindigt **altijd** met een puntkomma (`;`), bijvoorbeeld `&copy;`.
- **De 5 gereserveerde HTML-tekens:** De tekens `<`, `>`, `&`, `"` en `'` hebben een speciale functie in HTML. Wil je ze letterlijk als tekst op het scherm tonen, dan ben je **verplicht** om ze te vervangen door hun entiteit (`&lt;`, `&gt;`, `&amp;`, `&quot;`, `&apos;`).
- **Geen regeleinde met `&nbsp;`:** Gebruik de vaste spatie om te voorkomen dat twee woorden of getallen op het einde van een regel van elkaar worden losgerukt (bijvoorbeeld bij telefoonnummers `014&nbsp;56&nbsp;23&nbsp;10`, postcodes `2440&nbsp;Geel` of bedragen `€&nbsp;25`).
- **UTF-8:** Dankzij `<meta charset="UTF-8">` mag je gewone letters met accenten (zoals `é`, `ë`, `à`) gewoon direct via je toetsenbord typen; daarvoor heb je geen entiteiten nodig.

### Veelgemaakte fouten

- De puntkomma (`;`) op het einde van de entiteit vergeten: `&copy` in plaats van `&copy;` is ongeldig en leidt tot validatiefouten.
- HTML-tags letterlijk in de tekst typen zonder entiteiten: schrijf `Gebruik de tag &lt;p&gt;` in plaats van `Gebruik de tag <p>`, anders probeert de browser een echte alinea aan te maken.
- Het losse en-teken (`&`) vergeten te escapen als `&amp;` (bijv. in "Koffie & Thee": schrijf `Koffie &amp; Thee`).
- Meerdere keren `&nbsp;&nbsp;&nbsp;` na elkaar gebruiken om witruimte te maken tussen elementen: witruimte regel je met CSS marges en padding.

### Tips voor beginners

- Onthoud de afkortingen: **lt** = *less than* (`<`), **gt** = *greater than* (`>`), **amp** = *ampersand* (`&`), **nbsp** = *non-breaking space*.
- Gebruik de Chrome-extensie **Validify** om je webpagina in één klik te controleren op niet-geëscapete ampersands of ontbrekende puntkomma's in entiteiten.

</PageSummary>

## Oefeningen

### Oefening 1: Een HTML-handleiding schrijven

Maak in PhpStorm een nieuw bestand aan met de naam `handleiding.html`.

1. Bouw het standaardskelet van een HTML5-pagina op.
2. Voeg een hoofdtitel `<h1>` toe: `Snelcursus HTML-basistags`.
3. Schrijf drie alinea's waarin je aan een medestudent uitlegt wat de volgende tags doen:
   - De tag `<h1>`
   - De tag `<p>`
   - De tag `<hr>`
4. Zorg ervoor dat alle tags in de tekst netjes zichtbaar zijn als code (omvat met `<code>`) en gebruik de juiste entiteiten voor `<` en `>`.
5. Voeg een alinea toe over wiskundige vergelijkingen: toon de uitdrukking `10 < 20 & 20 > 5` met de juiste entiteiten.
6. Open je pagina in Google Chrome en controleer of de code exact zo wordt weergegeven als bedoeld.

### Oefening 2: Contactkaart voor Thomas More Campus Geel

Maak een bestand genaamd `contact-campus.html`.

1. Maak een semantische structuur met een `<header>`, `<main>` en `<footer>`.
2. Plaats in de `<header>` een titel `<h1>`: `Contact &amp; Openingsuren`.
3. Plaats in de `<main>` de volgende gegevens:
   - Adres: `Kleinhoefstraat 4, 2440 Geel`
   - Telefoonnummer: `014 56 23 10`
   - Openingsuren: Maandag tot vrijdag van `08.00` tot `17.30` uur
   - Toegangsprijs voor bezoekers: `€ 0` (gratis toegang)
4. Pas de vaste spatie (`&nbsp;`) toe op het telefoonnummer, tussen het euroteken en het bedrag, en bij de postcode (`2440&nbsp;Geel`).
5. Plaats in de `<footer>` een copyrightregel:
   - Gebruik `&copy;` voor het copyright-symbool.
   - Voeg het jaartal toe, gescheiden van de campusnaam met een opsommingsteken (`&bull;`).
   - Voeg een link toe met de tekst: `Terug naar boven &uarr;`.

### Oefening 3: Foutopsporing en validatie met Validify

Kopieer het onderstaande ongeldige HTML-fragment naar een testbestand `fouten.html` in PhpStorm:

```html
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fouten opsporen</title>
</head>
<body>
  <h1>Acties & Promoties</h1>
  <p>Ontdek onze prijzen: alles voor < € 50 & gratis verzending!</p>
  <p>Gebruik de tag <p> voor tekst.</p>
  <footer>
    <p>Copyright &copy 2026 Thomas More.</p>
  </footer>
</body>
</html>
```

**Opdracht:**

1. Open het bestand in Google Chrome en klik op het icoontje van de extensie **Validify**.
2. Bekijk de foutmeldingen in het paneel van Validify of in de DevTools Console (`F12`).
3. Verbeter alle fouten tegen speciale tekens en entiteiten in PhpStorm.
4. Valideer opnieuw met Validify totdat je pagina volledig foutloos is (groene badge).
