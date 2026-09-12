---
title: 2D Transformaties
---

# 2D Transformaties

Met het box model, flexbox en positionering heb je geleerd hoe je elementen een vaste plek geeft op de pagina. Maar wat als je een element een kwartslag wilt draaien, schuin wilt trekken, subtiel wilt vergroten bij een muisbeweging, of een paar pixels wilt opschuiven zonder de omringende inhoud te verstoren? Daarvoor gebruik je <dfn title="Een CSS-eigenschap waarmee je de visuele vorm, grootte, stand of positie van een element kunt aanpassen in een tweedimensionaal vlak">CSS 2D-transformaties</dfn>. Transformaties zijn krachtig en efficiënt: ze worden direct berekend door de grafische processor (<abbr title="Graphics Processing Unit: de grafische chip van een computer of smartphone">GPU</abbr>) en laten de normale documentstroom van de pagina volledig intact.

## Leerdoelen

Na dit hoofdstuk kan je:

- Uitleggen hoe transformaties werken en waarom ze de normale documentstroom niet verstoren
- Elementen verplaatsen langs de X- en Y-as met `translate()`, `translateX()` en `translateY()`
- Elementen roteren in graden (`deg`) of omwentelingen (`turn`) met `rotate()`
- Elementen vergroten, verkleinen en spiegelen met `scale()`, `scaleX()` en `scaleY()`
- Elementen schuin trekken met `skew()`, `skewX()` en `skewY()`
- Meerdere transformatiemethoden combineren in één `transform`-declaratie en beredeneren waarom de volgorde van belang is
- Het rotatie- en schaalankerpunt verleggen met de eigenschap `transform-origin`

## Wat is een transformatie?

Wanneer je een element verplaatst met `margin` of `padding`, verschuift de browser ook alle aangrenzende elementen op de pagina. Een transformatie via de CSS-eigenschap `transform` werkt fundamenteel anders.

Bij een transformatie behoudt het element zijn oorspronkelijke, gereserveerde plaats in de documentstroom. De browser tekent de getransformeerde weergave als een visuele laag bovenop die plek. Hierdoor bewegen omringende alinea's, knoppen of kolommen **niet** mee wanneer het element draait, groeit of verschuift.

De basissyntaxis is altijd:

```css
selector {
  transform: methode(waarde);
}
```

Er zijn vier basismethoden voor tweedimensionale transformaties:
1. `translate()`: verplaatsen
2. `scale()`: schalen (vergroten of verkleinen)
3. `rotate()`: draaien
4. `skew()`: schuin trekken

## Elementen verplaatsen: translate()

Met `translate()` verschuif je een element horizontaal langs de X-as en verticaal langs de Y-as.

- **Positieve waarden:** bewegen naar **rechts** (X-as) of naar **beneden** (Y-as).
- **Negatieve waarden:** bewegen naar **links** (X-as) of naar **boven** (Y-as).

```css
/* Verschuif 20 pixels naar rechts en 10 pixels omlaag */
.blok {
  transform: translate(20px, 10px);
}

/* Enkel horizontaal verschuiven */
.knop {
  transform: translateX(1.5rem);
}

/* Enkel verticaal verschuiven */
.kaart {
  transform: translateY(-8px);
}
```

Als je `translate()` met één argument gebruikt, zoals `translate(20px)`, geldt dat argument uitsluitend voor de horizontale X-as. De verticale Y-as blijft dan ongewijzigd op `0`.

### Verplaatsen met percentages

Naast vaste eenheden zoals `px` of `rem` kan je bij `translate()` ook percentages gebruiken. Het grote voordeel: een percentage verwijst naar de **eigen afmetingen van het getransformeerde element**, en niet naar de breedte van het ouderelement.

```css
/* Verschuif het element exact de helft van zijn eigen breedte naar links */
.element {
  transform: translateX(-50%);
}
```

Dit principe wordt in de praktijk veelvuldig gecombineerd met absolute positionering (`left: 50%; transform: translateX(-50%);`) om een element exact in het midden van een container uit te lijnen, ongeacht hoe breed het element precies is.

## Elementen schalen: scale()

Met `scale()` zoom je een element in of uit.

- **Waarden groter dan 1:** het element wordt **vergroot** (bijvoorbeeld `1.2` = 20% groter).
- **Waarden tussen 0 en 1:** het element wordt **verkleind** (bijvoorbeeld `0.8` = 20% kleiner).
- **Waarde 1:** de oorspronkelijke grootte (100%).

```css
/* Vergroot het element met 15% in zowel de breedte als de hoogte */
.knop:hover {
  transform: scale(1.15);
}

/* Afzonderlijk schalen op breedte (X) en hoogte (Y) */
.banner {
  transform: scale(1.2, 0.8);
}

/* Enkel de breedte schalen */
.balk {
  transform: scaleX(1.5);
}

/* Enkel de hoogte schalen */
.kolom {
  transform: scaleY(0.7);
}
```

### Spiegelen met negatieve getallen

Wanneer je een negatieve factor meegeeft aan `scale()`, keert de browser het element visueel om:

```css
/* Spiegelt een afbeelding horizontaal (handig voor pijltjes of iconen) */
.icoon-terug {
  transform: scaleX(-1);
}
```

## Live demonstratie: translate() en scale()

In de onderstaande sandbox zie je het effect van `translate()` en `scale()` in actie. Merk op dat de omringende kaders netjes blijven staan, terwijl de getransformeerde vlakken buiten hun grenzen reiken:

<CodeSandbox
  title="Demonstratie van translate() en scale()"
  height="430px"
  initialTab="split"
  activeCodeTab="css"
  highlightHtml=""
  highlightCss="32,36,40,44"
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Translate en Scale demonstratie</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <div class="galerij">
    <div class="kader">
      <div class="kaart kaart-translate">translate(20px, -15px)</div>
    </div>
    <div class="kader">
      <div class="kaart kaart-scale">scale(1.15)</div>
    </div>
    <div class="kader">
      <div class="kaart kaart-scale-asymmetrisch">scale(1.2, 0.85)</div>
    </div>
    <div class="kader">
      <div class="kaart kaart-spiegel">scaleX(-1)</div>
    </div>
  </div>
</body>
</html>'
  css='/* Universele resetter */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
/* Paginastijl */
body {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f4f6f8;
  padding: 1.5rem;
}
.galerij {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}
/* Vast referentiekader */
.kader {
  width: 140px;
  height: 140px;
  border: 2px dashed #b0bec5;
  background-color: #ffffff;
  border-radius: 0.5rem;
}
/* Kaart binnen het kader */
.kaart {
  width: 100%;
  height: 100%;
  padding: 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #ffffff;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
/* Toepassingen van transformaties */
.kaart-translate {
  background-color: #0056b3;
  transform: translate(20px, -15px);
}
.kaart-scale {
  background-color: #e87722;
  transform: scale(1.15);
}
.kaart-scale-asymmetrisch {
  background-color: #28a745;
  transform: scale(1.2, 0.85);
}
.kaart-spiegel {
  background-color: #6f42c1;
  transform: scaleX(-1);
}'
  js=''
/>

## Elementen draaien: rotate()

Met `rotate()` draai je een element rond een vast punt.

- **Positieve hoeken:** draaien **met de klok mee** (naar rechts).
- **Negatieve hoeken:** draaien **tegen de klok in** (naar links).

### Eenheden voor rotatie

In CSS kan je hoeken op twee manieren noteren:

1. **Graden (`deg`):** een volledige cirkel telt 360 graden (`360deg`). Een kwartslag is `90deg` en een halve draai is `180deg`.
2. **Omwentelingen (`turn`):** een volledige cirkel is `1turn`. Een kwartslag noteer je als `0.25turn` en een halve draai als `0.5turn`.

```css
.badge {
  transform: rotate(15deg);    /* 15 graden met de klok mee */
}

.label {
  transform: rotate(-0.25turn); /* Kwartslag tegen de klok in */
}
```

::: warning Vergeet de eenheid niet
In CSS mag een hoek van `0` zonder eenheid worden geschreven (`rotate(0)`), maar voor alle andere waarden is de eenheid **verplicht**. `transform: rotate(45)` is ongeldig en wordt genegeerd door de browser; schrijf altijd `rotate(45deg)` of `rotate(0.125turn)`.
:::

## Elementen schuin trekken: skew()

Met `skew()` vervorm je de hoeken van een rechthoekig element, zodat het verandert in een parallellogram. Dit creëert een dynamisch, sportief effect dat vaak wordt toegepast op badges of actielabels.

- `skewX(hoek)`: trekt het element horizontaal schuin langs de X-as.
- `skewY(hoek)`: trekt het element verticaal schuin langs de Y-as.
- `skew(x, y)`: combineert beide assen.

```css
/* Badge met schuine kanten */
.actielabel {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  background-color: #e87722;
  color: #ffffff;
  transform: skewX(-12deg);
}

/* Tekst weer rechtzetten binnen het schuine label */
.actielabel span {
  display: inline-block;
  transform: skewX(12deg);
}
```

In het bovenstaande voorbeeld zie je een slimme truc: door de binnenste tekst exact in tegengestelde richting schuin te trekken (`12deg` tegenover `-12deg`), blijft de tekst perfect leesbaar terwijl het omringende kader schuin staat.

## Meerdere transformaties combineren

Je kan meerdere transformaties tegelijk toepassen op één element. Je plaatst de verschillende methoden achter elkaar in dezelfde `transform`-eigenschap, gescheiden door een **spatie** (en dus **nooit** met een komma):

```css
.kaart:hover {
  /* GOED: gescheiden door spaties */
  transform: translateY(-6px) scale(1.05) rotate(2deg);
}
```

```css
/* FOUT: scheiden met komma's maakt de regel ongeldig */
.kaart:hover {
  transform: translateY(-6px), scale(1.05); /* Fout! */
}
```

### Let op: de volgorde maakt uit!

De volgorde waarin je transformatiemethoden noteert, bepaalt het visuele resultaat. Transformaties worden van links naar rechts uitgevoerd, en elke transformatie roteert of verplaatst het interne assenstelsel van het element mee:

- `transform: rotate(45deg) translateX(50px);`: het element draait eerst 45 graden schuin. Vervolgens verschuift het 50 pixels over zijn **nieuwe, schuine X-as** (dus diagonaal naar rechtsonder).
- `transform: translateX(50px) rotate(45deg);`: het element schuift eerst zuiver horizontaal 50 pixels naar rechts, en draait pas daarna 45 graden ter plaatse rond.

## Het ankerpunt verleggen: transform-origin

Standaard draait en schaalt elk element rond zijn exacte middelpunt (`center center` of `50% 50%`). Met de eigenschap `transform-origin` kan je dit <dfn title="Het vaste referentiepunt waaromheen een element draait, schaalt of vervormt">ankerpunt</dfn> verleggen naar een andere locatie.

Mogelijke waarden zijn:

- **Sleutelwoorden:** `top`, `bottom`, `left`, `right`, `center`
- **Lengtematen of percentages:** bijvoorbeeld `0 0` (linkerbovenhoek), `100% 100%` (rechteronderhoek) of `20px 50px`

```css
/* Draait rond de linkerbovenhoek alsof het element daar vastgeprikt zit */
.uithangbord {
  transform-origin: top left;
  transform: rotate(15deg);
}

/* Schaalt vanuit de onderkant */
.pilaar:hover {
  transform-origin: bottom center;
  transform: scaleY(1.3);
}
```

## Live demonstratie: roteren, ankerpunten en combinaties

In de onderstaande sandbox ontdek je hoe het verleggen van `transform-origin` het draaipunt volledig transformeert, en hoe een gecombineerde transformatie een professionele interactieve kaart oplevert:

<CodeSandbox
  title="Demonstratie van rotate(), transform-origin en gecombineerde transformaties"
  height="450px"
  initialTab="split"
  activeCodeTab="css"
  highlightHtml=""
  highlightCss="32,37,42,47"
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rotatie en Origin demonstratie</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <div class="speelveld">
    <!-- Draait rond het centrum (standaard) -->
    <div class="bord bord-midden">center origin</div>
    <!-- Draait rond de linkerbovenhoek -->
    <div class="bord bord-hoek">top left origin</div>
    <!-- Schuin getrokken badge -->
    <div class="bord bord-skew">skewX(-15deg)</div>
    <!-- Gecombineerde transformatie bij hover -->
    <div class="bord bord-combinatie">Beweeg over mij</div>
  </div>
</body>
</html>'
  css='/* Universele resetter */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
/* Paginastijl */
body {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eef2f5;
  padding: 1.5rem;
}
.speelveld {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}
/* Basisbord */
.bord {
  width: 140px;
  height: 100px;
  border-radius: 0.5rem;
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
/* 1. Standaard rotatie vanuit het midden */
.bord-midden {
  background-color: #0056b3;
  transform: rotate(15deg);
}
/* 2. Rotatie vanuit de linkerbovenhoek */
.bord-hoek {
  background-color: #e87722;
  transform-origin: top left;
  transform: rotate(15deg);
}
/* 3. Schuin trekken */
.bord-skew {
  background-color: #28a745;
  transform: skewX(-15deg);
}
/* 4. Gecombineerde transformatie op interactie */
.bord-combinatie {
  background-color: #6f42c1;
  cursor: pointer;
}
.bord-combinatie:hover {
  transform: translateY(-8px) scale(1.08) rotate(-3deg);
}'
  js=''
/>

## Emmet-sneltoetsen in PhpStorm

In PhpStorm genereer je transformatieregels snel met Emmet:

| Emmet-opdracht | Resulterende CSS | Betekenis |
|---|---|---|
| `trf` + `TAB` | `transform: ;` | Algemene transformatie-eigenschap |
| `trf:t` + `TAB` | `transform: translate();` | Verplaatsen over X en Y |
| `trf:tx` + `TAB` | `transform: translateX();` | Horizontaal verplaatsen |
| `trf:ty` + `TAB` | `transform: translateY();` | Verticaal verplaatsen |
| `trf:r` + `TAB` | `transform: rotate();` | Roteren |
| `trf:sc` + `TAB` | `transform: scale();` | Schalen |
| `trfo` + `TAB` | `transform-origin: ;` | Ankerpunt instellen |

<PageSummary>

### Syntaxis in een oogopslag

| Wat | Hoe | Voorbeeld |
|---|---|---|
| Verplaatsen | `transform: translate(x, y);` | `transform: translate(10px, -5px);` |
| Schalen | `transform: scale(factor);` | `transform: scale(1.1);` |
| Horizontaal spiegelen | Negatieve schaalfactor | `transform: scaleX(-1);` |
| Roteren | `transform: rotate(hoek);` | `transform: rotate(45deg);` |
| Schuin trekken | `transform: skewX(hoek);` | `transform: skewX(-10deg);` |
| Combineren | Scheiden met een spatie | `transform: translateY(-4px) scale(1.05);` |
| Ankerpunt verleggen | `transform-origin: x y;` | `transform-origin: top left;` |

### Regels en naamgeving

- **Geen verstoring van omliggende elementen:** Een getransformeerd element behoudt zijn oorspronkelijke vakje in de documentstroom.
- **Spaties tussen gecombineerde methoden:** Scheid meerdere transformaties altijd met een spatie, nooit met een komma.
- **Altijd een eenheid bij hoeken:** Gebruik bij `rotate()` en `skew()` altijd `deg` of `turn`. Zonder eenheid is de regel ongeldig.
- **Volgorde is bepalend:** `rotate()` vóór `translate()` draait ook de richting van de verplaatsing mee.

### Veelgemaakte fouten

- **Komma's gebruiken tussen transformaties:** Schrijven van `transform: scale(1.1), rotate(5deg)` in plaats van spaties.
- **Meerdere `transform`-declaraties onder elkaar:** Twee afzonderlijke regels schrijven (`transform: scale(1.1); transform: rotate(5deg);`). De tweede regel overschrijft de eerste volledig. Combineer ze altijd in één regel.
- **De eenheid vergeten bij rotatie:** `rotate(45)` schrijven in plaats van `rotate(45deg)`.

### Tips voor beginners

- **Gebruik negatieve marges niet voor zweefeffecten:** Gebruik bij `:hover` altijd `transform: translateY(-4px)` in plaats van `margin-top: -4px`. Transformaties zijn soepeler en triggeren geen herberekening van de pagina.
- **Centreren met translate(-50%, -50%):** Combineer `position: absolute; top: 50%; left: 50%;` met `transform: translate(-50%, -50%);` om een element perfect te centreren.

</PageSummary>

## Oefeningen

### Oefening 1: Interactieve meldingsbadge (Basis)

Ontwerp een opvallende actiebadge voor een promotie:

1. Bouw een `<span>`-element met witte tekst op een rode achtergrond, afgeronde hoeken en royale binnenruimte.
2. Zorg dat de badge lichtjes schuin staat met `transform: rotate(-6deg)`.
3. Laat bij `:hover` de badge horizontaal recht trekken (`rotate(0deg)`) en 15% groter worden via `scale(1.15)`.

### Oefening 2: Dynamische navigatielinks (Gemiddeld)

Bouw een verticaal menu met drie navigatie-items:

1. Geef elk menu-item een lichte achtergrondkleur, een linkerrand en padding.
2. Laat het menu-item bij `:hover` 8 pixels naar rechts schuiven met `transform: translateX(8px)`.
3. Voeg aan het menu-item een klein pijlicoon toe (`>`) dat bij hover extra 4 pixels naar rechts beweegt ten opzichte van de tekst.

### Oefening 3: Kantelend fotokader (Uitdagend)

Maak een polaroid-achtig fotokader met titel:

1. Bouw een `<figure>`-element met een witte achtergrond, een lichte schaduw en een ingesloten foto.
2. Laat het fotokader standaard 4 graden naar links hellen vanuit de linkerbovenhoek (`transform-origin: top left`).
3. Zorg dat bij `:hover` het kader 6 pixels omhoog beweegt (`translateY(-6px)`), lichtjes vergroot (`scale(1.04)`) en terug recht draait naar `0deg`.

