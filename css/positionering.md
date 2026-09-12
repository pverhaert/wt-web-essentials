---
title: Positionering
---

# Positionering

In voorgaande hoofdstukken leerde je hoe elementen elkaar opvolgen via het Box Model en de `display`-eigenschap. Soms wil je echter een element doelgericht op een exacte plek vastpinnen: denk aan een kortingsbadge op een productfoto, een navigatiebalk die blijft meescrollen, of een zwevende contactknop rechtsonder in beeld.

Met de <dfn title="Een CSS-eigenschap waarmee je bepaalt volgens welk positioneringsschema een element op het scherm wordt geplaatst">`position`</dfn>-eigenschap in CSS bepaal je hoe een element zich verhoudt tot de documentstroom en de rest van de pagina.

## Leerdoelen

Na dit hoofdstuk kan je:

- Het verschil uitleggen tussen de normale documentstroom en expliciete positionering
- De 5 positioneringswaarden toepassen (`static`, `relative`, `absolute`, `fixed` en `sticky`)
- Elementen doelgericht verplaatsen met de coördinaateigenschappen `top`, `right`, `bottom` en `left`
- Een positioneringscontext opzetten met een `relative` ouder en een `absolute` kind
- De stapelvolgorde van overlappende lagen beheren met `z-index`

## Wat is de normale documentstroom? (`position: static`)

Standaard heeft elk HTML-element <dfn title="De standaardwaarde waarbij een element zijn natuurlijke positie in de documentstroom inneemt en niet reageert op coördinaten">`position: static`</dfn>.

In <dfn title="De natuurlijke volgorde waarin elementen van boven naar beneden (block) en van links naar rechts (inline) op de pagina vloeien">de normale documentstroom</dfn> geldt:
- Block-elementen (zoals `<div>`, `<p>`, `<h1>`) beginnen op een nieuwe regel en stapelen zich netjes onder elkaar op.
- Inline-elementen (zoals `<span>`, `<a>`, `<strong>`) sluiten direct aan op dezelfde regel.
- De coördinaateigenschappen `top`, `right`, `bottom` en `left` hebben **geen enkel effect** op een `static` element.
- De stapel-eigenschap `z-index` heeft eveneens **geen effect** op een `static` element.

Pas wanneer je de `position`-eigenschap instelt op `relative`, `absolute`, `fixed` of `sticky`, wordt een element *expliciet gepositioneerd*.

## Relatieve positionering (`position: relative`)

Wanneer je een element <dfn title="Een positioneringswaarde waarbij het element verschuift ten opzichte van zijn eigen oorspronkelijke plek in de documentstroom">`position: relative`</dfn> geeft, gebeuren er twee belangrijke dingen:

1. **Verschuiving ten opzichte van zichzelf:** Je kan het element verplaatsen via `top`, `right`, `bottom` en `left`. Deze afstanden worden berekend ten opzichte van de *oorspronkelijke plek* waar het element normaal zou staan.
2. **De oorspronkelijke ruimte blijft gereserveerd:** Dit is het meest typerende kenmerk van `relative`. Het element laat een onzichtbaar spookgat achter in de documentstroom. Broerelementen blijven rustig op hun plaats staan en schuiven **niet** op om het gat op te vullen.

```css
/* Voorbeeld relatieve verschuiving */
.aankondiging {
  position: relative;
  top: 15px;  /* Schuift 15px omlaag t.o.v. oorspronkelijke positie */
  left: 20px; /* Schuift 20px naar rechts t.o.v. oorspronkelijke positie */
}
```

::: tip Waarom gebruik je position: relative?
In de praktijk gebruik je `position: relative` zelden om elementen zomaar te verschuiven. De allergrootste kracht van `position: relative` is dat het dient als **referentiekader** voor absoluut gepositioneerde kind-elementen.
:::

## Absolute positionering (`position: absolute`)

Een element met <dfn title="Een positioneringswaarde waarbij het element volledig uit de documentstroom wordt gelicht en geplaatst wordt t.o.v. de dichtstbijzijnde gepositioneerde voorouder">`position: absolute`</dfn> gedraagt zich fundamenteel anders dan `relative`:

1. **Het element verlaat de documentstroom:** Het element neemt geen enkele fysieke ruimte meer in beslag. Andere elementen op de pagina doen alsof het absoluut gepositioneerde element helemaal niet bestaat en schuiven direct door om de lege plek in te nemen.
2. **Breedte krimpt naar de inhoud:** Tenzij je expliciet een `width` instelt, krimpt een absoluut element automatisch naar de breedte van zijn inhoud (`width: auto`).
3. **De positioneringscontext (referentiekader):** Het element positioneert zich met `top`, `right`, `bottom` en `left` ten opzichte van zijn **dichtstbijzijnde gepositioneerde voorouder**.

### De gouden combinatie: relative ouder + absolute kind

Als een absoluut kind geen enkele gepositioneerde ouder tegenkomt in de <abbr title="Document Object Model: de boomstructuur van HTML-elementen">DOM</abbr>-boom, positioneert het zich helemaal ten opzichte van het browserdocument (`<body>`). Dat is zelden wat je wil.

Om een element binnen een specifieke kaart, header of kader te positioneren, pas je de gouden regel van CSS-positionering toe:
- Geef de **ouder** `position: relative;` (zonder `top` of `left`). De ouder blijft gewoon op zijn normale plek staan, maar fungeert nu als <dfn title="Het gecoördineerde referentiekader waarbinnen absolute kinderen worden geplaatst">positioneringscontext</dfn>.
- Geef het **kind** `position: absolute;` met de gewenste coördinaten (bijvoorbeeld `top: 12px; right: 12px;`).

```css
/* De ouder vormt het referentiekader */
.kaart {
  position: relative;
  width: 320px;
}

/* Het kind plakt exact in de hoek van de ouder */
.badge {
  position: absolute;
  top: 12px;
  right: 12px;
}
```

In onderstaande CodeSandbox zie je deze techniek in actie: een productkaart met een oranje kortingsbadge rechtsboven en een prijslabel linksonder.

<CodeSandbox
  title="Productkaart met absolute badges"
  height="460px"
  initialTab="split"
  activeCodeTab="css"
  highlightHtml="11,12,14"
  highlightCss="15,25-27,37-39"
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Productkaart met Badge</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <!-- Kaartcontainer als positioneringscontext -->
  <article class="kaart">
    <span class="badge">Nieuw</span>
    <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80" alt="Draadloze koptelefoon">
    <span class="prijs-tag">&euro; 79,99</span>
    <div class="kaart-inhoud">
      <h3>Premium Koptelefoon</h3>
      <p>Draadloos luisteren met actieve ruisonderdrukking.</p>
    </div>
  </article>
</body>
</html>'
  css='/* Reset en basisopmaak */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
/* Paginastijl */
body {
  font-family: "Segoe UI", Arial, sans-serif;
  background-color: #f1f5f9;
  padding: 2rem 1rem;
}
/* Oudercontainer vormt de context */
.kaart {
  position: relative;
  width: 300px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #cbd5e1;
}
/* Absolute badge rechtsboven */
.badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: #e87722;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 4px 10px;
  border-radius: 4px;
}
/* Absolute prijstag linksonder op de foto */
.prijs-tag {
  position: absolute;
  top: 140px;
  left: 12px;
  background-color: rgba(30, 45, 90, 0.85);
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
}
/* Afbeelding vult de bovenkant */
.kaart img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  display: block;
}
/* Kaarttekst */
.kaart-inhoud {
  padding: 1rem;
}
.kaart-inhoud h3 {
  color: #1e2d5a;
  font-size: 1.1rem;
  margin-bottom: 0.4rem;
}
.kaart-inhoud p {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.4;
}'
  js=''
/>

## Vaste positionering (`position: fixed`)

Een element met <dfn title="Een positioneringswaarde waarbij het element vast verankerd wordt aan het zichtbare browservenster (de viewport) en meebeweegt tijdens scrollen">`position: fixed`</dfn> wordt eveneens uit de normale documentstroom gelicht, maar met een bijzonder referentiepunt:

- Het element richt zich **altijd op de viewport** (het zichtbare scherm van de browser), ongeacht in welk HTML-element het zich bevindt.
- Zelfs wanneer de gebruiker door een lange pagina scrolt, blijft een `fixed` element op **exact dezelfde positie op het beeldscherm** staan.
- Net zoals bij `absolute` neemt het element geen fysieke ruimte in de pagina in.

Typische toepassingen zijn:
- Een vaste navigatiebalk bovenaan het scherm (`top: 0; left: 0; width: 100%;`).
- Een zwevende "Terug naar boven"- of WhatsApp-helpknop rechtsonder (`bottom: 20px; right: 20px;`).
- Een vaste cookie-toestemmingsbalk onderaan (`bottom: 0; left: 0; width: 100%;`).

::: warning Let op bij vaste navigatiebalken
Omdat een `fixed` navigatiebalk geen ruimte inneemt in de normale stroom, zal de eerste inhoud van je pagina er standaard achter verdwijnen. Los dit op door op `body` of je eerste `<main>`-sectie een `padding-top` in te stellen die minstens gelijk is aan de hoogte van de navigatiebalk.
:::

In onderstaande CodeSandbox zie je een pagina met een vaste navigatiebalk bovenaan en een zwevende actieknop rechtsonder. Scrol door het resultaat om te zien hoe ze rotsvast blijven staan.

<CodeSandbox
  title="Vaste navigatiebalk en zwevende knop"
  height="460px"
  initialTab="split"
  activeCodeTab="css"
  highlightHtml="11,23"
  highlightCss="19-24,45-48"
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fixed Navigatie en Knop</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <!-- Vaste navigatiebalk bovenaan -->
  <header class="vaste-nav">
    <h2>Thomas More Geel</h2>
  </header>
  <!-- Inhoud met voldoende tekst om te kunnen scrollen -->
  <main class="inhoud">
    <h3>Web Essentials Opleiding</h3>
    <p>Welkom op de cursuspagina. Scrol naar beneden om het vaste gedrag te bekijken.</p>
    <p>De navigatiebalk bovenaan blijft altijd in beeld staan, ongeacht hoe ver je naar beneden bladert.</p>
    <p>Dit garandeert dat bezoekers op elk moment toegang hebben tot de belangrijkste menu-opties.</p>
    <p>Rechtsonder zie je een zwevende contactknop die eveneens vergrendeld is aan de viewport.</p>
  </main>
  <!-- Zwevende knop rechtsonder -->
  <a href="#top" class="zwevende-knop">Hulp</a>
</body>
</html>'
  css='/* Reset */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
/* Paginastijl */
body {
  font-family: "Segoe UI", Arial, sans-serif;
  background-color: #f8fafc;
  color: #334155;
  line-height: 1.6;
  /* Ruimte vrijmaken voor de vaste balk van 50px */
  padding-top: 60px;
  min-height: 140vh;
}
/* Vaste navigatiebalk */
.vaste-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px;
  z-index: 100;
  background-color: #1e2d5a;
  color: #ffffff;
  padding: 10px 20px;
}
.vaste-nav h2 {
  font-size: 1.1rem;
}
/* Pagina-inhoud */
.inhoud {
  padding: 1.5rem 1.25rem;
}
.inhoud h3 {
  color: #1e2d5a;
  margin-bottom: 0.75rem;
}
.inhoud p {
  margin-bottom: 1rem;
}
/* Zwevende ronde knop rechtsonder */
.zwevende-knop {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 99;
  background-color: #e87722;
  color: #ffffff;
  padding: 12px 18px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: bold;
  font-size: 0.85rem;
}'
  js=''
/>

## Klevende positionering (`position: sticky`)

<dfn title="Een hybride positioneringswaarde die zich eerst gedraagt als static en bij het bereiken van een drempelwaarde overgaat in fixed binnen zijn ouder">`position: sticky`</dfn> is een elegante combinatie van `static` en `fixed`:

1. **Normale stroom:** Zolang het element zich in zijn normale positie bevindt, gedraagt het zich als een gewoon statisch block-element en neemt het zijn normale ruimte in.
2. **Kleeft bij een drempelwaarde:** Zodra de bezoeker scrolt en het element een opgegeven drempelwaarde bereikt (bijvoorbeeld `top: 0`), "plakt" het element vast aan die rand van het venster alsof het `fixed` is.
3. **Blijft binnen zijn ouder:** Het element blijft klevend zolang zijn directe ouder-element zichtbaar is in beeld. Zodra de oudercontainer voorbij gescrold is, verdwijnt het sticky element netjes mee naar boven.

::: tip Vereiste voor position: sticky
Voor `position: sticky` moet je **altijd** minstens één drempeleigenschap opgeven (`top`, `bottom`, `left` of `right`), meestal `top: 0;`. Zonder deze eigenschap weet de browser niet op welke drempelwaarde het element moet gaan kleven en blijft het statisch.
:::

::: warning Let op: de overflow-valkuil bij sticky
`position: sticky` werkt **nooit** wanneer een voorouder (zoals de oudercontainer) een `overflow`-eigenschap heeft die op `hidden`, `auto` of `scroll` staat ingesteld. De browser kan de scroldrempel dan niet meer relateren aan de pagina. Laat `overflow: hidden` op de ouder dus altijd weg als je sticky elementen gebruikt!
:::

In onderstaande CodeSandbox zie je een pagina met sticky sectiekoppen. Op `body` is `min-height: 150vh` ingesteld zodat er altijd een duidelijke schuifbalk aanwezig is. Scrol in het resultaatvenster en let op hoe elke kopbalk netjes tegen de bovenrand blijft kleven totdat de volgende sectie hem aflost:

<CodeSandbox
  title="Sticky sectiekoppen bij scrollen"
  height="460px"
  initialTab="split"
  activeCodeTab="css"
  highlightHtml="12,21,30"
  highlightCss="12,23-24"
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sticky Koppen</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <!-- Sectie 1 -->
  <section class="sectie">
    <h3 class="sticky-kop">Hoofdstuk 1: HTML5 Basis</h3>
    <div class="tekstblok">
      <p>HTML vormt het skelet van elke webpagina. Je gebruikt elementen zoals koppen, paragrafen, lijsten en tabellen om inhoud semantisch te structureren.</p>
      <p>Door goede semantische tags te gebruiken, begrijpen browsers en zoekmachines de betekenis van je pagina.</p>
      <p>Scrol naar beneden in dit venster om te zien hoe deze kopbalk bovenaan blijft kleven totdat de volgende sectie in beeld komt.</p>
    </div>
  </section>
  <!-- Sectie 2 -->
  <section class="sectie">
    <h3 class="sticky-kop">Hoofdstuk 2: CSS3 Styling</h3>
    <div class="tekstblok">
      <p>CSS verzorgt de visuele presentatie. Je bepaalt kleuren, lettertypen, afstanden en het gedrag van het box model.</p>
      <p>Met positionering kan je elementen losmaken van de normale stroom en exact neerzetten waar je wenst.</p>
      <p>Klevende koppen zijn ideaal om de context van een lang hoofdstuk of productgroep zichtbaar te houden.</p>
    </div>
  </section>
  <!-- Sectie 3 -->
  <section class="sectie">
    <h3 class="sticky-kop">Hoofdstuk 3: Positionering</h3>
    <div class="tekstblok">
      <p>Met position: sticky combineer je de normale stroom met een vast ankerpunt tijdens het scrollen.</p>
      <p>Zodra een sectie voorbij gescrold is, verlaat de bijbehorende sticky kop het scherm samen met zijn ouder-sectie.</p>
    </div>
  </section>
</body>
</html>'
  css='/* Reset */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
/* Paginastijl met gegarandeerde scrollruimte */
body {
  font-family: "Segoe UI", Arial, sans-serif;
  background-color: #f1f5f9;
  padding: 1rem;
  min-height: 150vh;
}
/* Sectiecontainer: GEEN overflow:hidden gebruiken bij sticky! */
.sectie {
  margin-bottom: 2rem;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
}
/* Klevende kopbalk */
.sticky-kop {
  position: sticky;
  top: 0;
  background-color: #1e2d5a;
  color: #ffffff;
  padding: 12px 16px;
  font-size: 0.95rem;
  border-left: 5px solid #e87722;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;
  z-index: 10;
}
/* Inhoud van het tekstblok */
.tekstblok {
  padding: 1rem 1.25rem 2.5rem 1.25rem;
}
.tekstblok p {
  color: #475569;
  font-size: 0.875rem;
  line-height: 1.6;
  margin-bottom: 0.75rem;
}'
  js=''
/>

## Stapelvolgorde met `z-index`

Wanneer elementen elkaar overlappen door `relative`, `absolute`, `fixed` of `sticky`, bepaalt de browser welke laag bovenop ligt. Dit noemen we <dfn title="De volgorde waarin overlappende elementen langs de denkbeeldige z-as (loodrecht op het beeldscherm) worden getoond">de stapelvolgorde (stacking order)</dfn>.

Standaard geldt:
- Elementen die **later in de HTML-code** staan, worden vóór eerdere elementen getekend.
- Gepositioneerde elementen (`relative`, `absolute`, `fixed`, `sticky`) worden altijd getoond **vóór** standaard `static` elementen.

### De z-index eigenschap

Met <dfn title="Een CSS-eigenschap die het niveaunummer van een gepositioneerd element op de virtuele diepte-as bepaalt">`z-index`</dfn> kan je deze volgorde expliciet aanpassen:

```css
/* Stapelvolgorde forceren */
.achtergrondkaart {
  position: absolute;
  z-index: 1; /* Ligt achteraan */
}

.voorgrondkaart {
  position: absolute;
  z-index: 10; /* Ligt voor elementen met een lagere z-index */
}
```

::: danger Gouden regel voor z-index
`z-index` werkt **uitsluitend** op elementen die expliciet gepositioneerd zijn (`position: relative;`, `position: absolute;`, `position: fixed;` of `position: sticky;`). Op een element met `position: static` heeft `z-index` **geen enkel effect**!
:::

### Negatieve z-index

Je kan `z-index` ook een negatief getal geven (bijvoorbeeld `z-index: -1`). Hiermee plaats je een element **achter** de normale tekst en achtergrond van zijn ouder. Dit wordt vaak gebruikt voor decoratieve watermerken of subtiele achtergrondpatronen.

## Interactieve Positioning Simulator

Met onderstaande interactieve simulator experimenteer je rechtstreeks met de verschillende positioneringstechnieken. Schakel tussen de tabbladen om te ontdekken hoe elk schema reageert op coördinaten, wat er gebeurt met de gereserveerde ruimte in de documentstroom en hoe de positioneringscontext werkt.

<PositioningSimulator />

## Emmet-sneltoetsen in PhpStorm

In PhpStorm kan je positioneringseigenschappen razendsnel genereren met handige Emmet-afkortingen:

| Emmet-instructie | Resultaat na <kbd>Tab</kbd> |
|---|---|
| `pos:r` | `position: relative;` |
| `pos:a` | `position: absolute;` |
| `pos:f` | `position: fixed;` |
| `pos:s` | `position: sticky;` |
| `t10` | `top: 10px;` |
| `r20` | `right: 20px;` |
| `b0` | `bottom: 0;` |
| `l-15` | `left: -15px;` |
| `z10` | `z-index: 10;` |
| `pos:a+t10+r10` | `position: absolute; top: 10px; right: 10px;` |

<PageSummary>

### Syntaxis in een oogopslag

| Waarde | Documentstroom | Referentiepunt (context) | Typische use case |
|---|---|---|---|
| `static` | Behoudt normale ruimte | Geen (`top`/`left` werken niet) | Standaardelementen |
| `relative` | Behoudt oorspronkelijke ruimte | Zichzelf (oorspronkelijke plek) | Ouder van absolute kinderen, micro-aanpassing |
| `absolute` | Verlaat de stroom (ruimte weg) | Dichtstbijzijnde gepositioneerde ouder | Badges, labels, sluitkruisjes, overlays |
| `fixed` | Verlaat de stroom (ruimte weg) | Het browservenster (viewport) | Vaste menubalk, terug-naar-boven knop |
| `sticky` | Behoudt ruimte tot drempel | Viewport binnen directe ouder | Klevende tabelheaders, tussenkoppen |

### Regels en naamgeving

- **Gouden regel voor absolute:** Geef de oudercontainer altijd `position: relative` zodat het kind een stabiel referentiekader heeft.
- **Drempelwaarde voor sticky:** Geef een `position: sticky` element altijd een richtingswaarde mee (meestal `top: 0;`).
- **Voorwaarde voor z-index:** Gebruik `z-index` alleen op elementen met `position: relative`, `absolute`, `fixed` of `sticky`.
- **Compenseer bij fixed:** Voeg `padding-top` toe aan `body` wanneer je een vaste navigatiebalk bovenaan plaatst.

### Veelgemaakte fouten

- **Vergeten om `position: relative` op de ouder te zetten:** Hierdoor vliegt het absolute kind naar de uithoeken van het complete browservenster in plaats van netjes binnen de kaart te blijven.
- **`z-index` proberen toepassen op `position: static`:** Het element weigert naar de voorgrond te komen omdat `z-index` niet actief is op niet-gepositioneerde elementen.
- **Geen `top` of `bottom` meegeven aan `sticky`:** Het element zal nooit gaan kleven omdat de browser niet weet waar de overgang moet plaatsvinden.
- **Geen breedte instellen op een absolute navigatiebalk:** Een absolute of fixed balk krimpt automatisch naar zijn inhoud tenzij je `width: 100%` of `left: 0; right: 0;` opgeeft.

### Tips voor beginners

- Gebruik `position: relative` op een oudercontainer zonder `top` of `left` in te vullen: het element blijft gewoon netjes op zijn plek staan in de stroom, maar activeert wel de positioneringscontext voor al zijn kinderen.
- Open je browser DevTools (F12) en inspecteer de layout: selecteer een absoluut element en kijk in het tabblad *Computed* naar zijn breedte en berekende coördinaten.
- Houd je `z-index`-waarden bescheiden (bijvoorbeeld 1, 10, 100) in plaats van willekeurige getallen zoals `999999`.

</PageSummary>

## Oefeningen

### Oefening 1: Notificatiebadge op een profielkaart (Relative + Absolute)

Bouw een profielkaartje voor een student aan Thomas More Campus Geel (Kleinhoefstraat 4, 2440 Geel):
1. Maak een kaartcontainer `.profielkaart` met een breedte van 280px en een lichte achtergrond.
2. Plaats de profielfoto in een cirkel (`border-radius: 50%`) binnen een foto-kader.
3. Plaats een rode notificatie-indicator of statusbolletje (`.status-online`: 14px bij 14px, groen) rechtsonder op de profielfoto.
4. Zorg ervoor dat het bolletje exact op de rand van de foto blijft staan dankzij de gouden combinatie (`position: relative` op het fotokader en `position: absolute` op het bolletje).

### Oefening 2: Vaste "Terug naar boven"-knop (Fixed)

Maak een lange informatieve pagina:
1. Zorg voor minstens 3 tekstparagrafen zodat de pagina verticaal scrolbaar is.
2. Voeg een link `<a href="#top" class="top-knop">` toe.
3. Positioneer deze knop vast in de rechterbenedenhoek van het browservenster (`bottom: 24px; right: 24px;`).
4. Geef de knop een opvallende kleur (bijv. `#e87722`), afgeronde hoeken en een gepaste `z-index` zodat hij altijd boven de tekst blijft zweven.

### Oefening 3: Klevende dagprogramma-tabelkop (Sticky)

Ontwerp een overzicht van de lesroosters:
1. Maak een tabel of een lijst met een header `.tabel-header`.
2. Zorg dat de inhoudssectie hoog genoeg is om te kunnen scrollen (bijvoorbeeld door een scrollbare container of lange pagina).
3. Geef de header `position: sticky; top: 0;`.
4. Geef de header een contrasterende achtergrondkleur (zoals `#1e2d5a`) en een `z-index: 10`, zodat de passerende rijen er vloeiend onderdoor verdwijnen tijdens het scrollen.
