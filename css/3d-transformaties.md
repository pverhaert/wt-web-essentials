---
title: 3D Transformaties
---

# 3D Transformaties

::: info Optionele leerstof
Dit hoofdstuk is optionele verdieping voor wie visueel creatieve webinterfaces wil bouwen. De basisprincipes van CSS transities en animaties uit de voorgaande hoofdstukken volstaan voor de meeste standaardwebsites.
:::

In het hoofdstuk over [2D Transformaties](/css/2d-transformaties) leerde je elementen verplaatsen, schalen, roteren en vervormen op een tweedimensionaal vlak via de horizontale X-as en de verticale Y-as. Met <dfn title="CSS-eigenschappen waarmee je elementen in een virtuele driedimensionale ruimte kunt roteren, kantelen en verplaatsen langs de Z-as">3D transformaties</dfn> voeg je hier een derde as aan toe: de **Z-as**.

Hiermee creëer je diepte, kantel je kaarten in de ruimte en bouw je interactieve effecten zoals een omklappend visitekaartje (*flip card*) of een roterende productweergave.

## Leerdoelen

Na dit hoofdstuk kan je:

- De werking van de Z-as in een driedimensionaal virtueel assenstelsel uitleggen
- Ruimtelijke diepte instellen met de eigenschappen `perspective` en `perspective-origin`
- Elementen in 3D roteren met `rotateX()`, `rotateY()` en `rotateZ()`
- Elementen naar de kijker toe of van de kijker weg verplaatsen met `translateZ()`
- Kindelementen in een gedeelde 3D-ruimte renderen met `transform-style: preserve-3d`
- De achterkant van een omgeklapt vlak verbergen met `backface-visibility: hidden`
- Zelfstandig een responsieve dubbelzijdige 3D-flipkaart ontwerpen en animeren

## Het driedimensionale assenstelsel

In een webbrowser begint het standaard assenstelsel in de linkerbovenhoek van een element:

- De **X-as** loopt horizontaal: positieve waarden gaan naar rechts, negatieve waarden naar links
- De **Y-as** loopt verticaal: positieve waarden gaan naar onder, negatieve waarden naar boven
- De **Z-as** loopt loodrecht op je beeldscherm: positieve waarden komen naar jou toe (uit het scherm), negatieve waarden gaan dieper het scherm in (weg van jou)

```text
         -Y (boven)
          ^
          |   -Z (dieper in het scherm)
          |  /
          | /
-X <------+------> +X (rechts)
         /|
        / |
       v  v
     +Z   +Y (onder)
(naar jou toe)
```

## Perspectief toevoegen: `perspective`

Zonder perspectief lijkt een 3D-rotatie vlak en tweedimensionaal. Als je een rechthoek 45 graden kantelt om de Y-as zonder perspectief, ziet de browser enkel dat de breedte visueel krimpt (net zoals bij een gewone 2D-schaling). Het menselijk oog ervaart pas diepte wanneer objecten die dichterbij staan groter lijken dan objecten die verder weg staan.

De <dfn title="De afstand in pixels tussen de virtuele kijker en het beeldscherm; bepaalt de intensiteit van het 3D-effect">`perspective`</dfn>-eigenschap stelt de virtuele afstand in tussen het oog van de kijker en het beeldscherm.

```css
.scene {
  perspective: 800px;
}
```

### De impact van de perspectiefwaarde

- **Kleine waarde (bijvoorbeeld `200px` tot `400px`):** Het oog bevindt zich heel dicht bij het object. Dit zorgt voor een dramatisch, extreem groothoek- of vogelvluchtperspectief met sterke vervorming.
- **Middelgrote waarde (bijvoorbeeld `600px` tot `1000px`):** Geeft een natuurlijke, realistische ruimtelijke diepte. Dit is de meest gebruikte bereikwaarde voor gebruikersinterfaces en kaarten.
- **Grote waarde (bijvoorbeeld `1500px` tot `2500px`):** Het oog bevindt zich ver weg. Het 3D-effect is heel subtiel en lijkt bijna orthografisch (vlak).

::: tip Perspectief op de ouder versus op het element zelf
Je plaatst `perspective: 800px` bij voorkeur op het **containerelement** (vaak de `.scene` genoemd). Alle kindelementen binnen die container delen dan hetzelfde, coherente verdwijnpunt. Gebruik je in plaats daarvan de transformatiefunctie `transform: perspective(800px) rotateY(45deg)` op het element zelf, dan heeft elk element zijn eigen individuele verdwijnpunt.
:::

### Het kijkpunt verleggen: `perspective-origin`

Standaard kijkt de virtuele camera recht naar het midden van de container (`50% 50%`). Met de eigenschap `perspective-origin` verplaats je dit virtuele kijkpunt:

```css
.scene {
  perspective: 800px;
  perspective-origin: top right; /* Je kijkt schuin van rechtsboven op de scène */
}
```

Mogelijke waarden zijn sleutelwoorden (`left`, `center`, `right`, `top`, `bottom`) of percentages en lengtematen.

In de onderstaande CodeSandbox zie je het directe effect van de eigenschap `perspective` op een 3D-rotatie over de Y-as (`rotateY(45deg)`). Beweeg je muisaanwijzer over de verschillende scènes om de kaarten te laten kantelen.

### Opbouw van de elementen

- `main.grid`: de flex-container die de drie testscènes netjes naast elkaar centreert (`display: flex`, `gap: 1.5rem`).
- `div.scene`: de scènecontainer waarin de `perspective`-afstand voor de virtuele camera wordt vastgelegd.
- `div.kaart`: de blauwe kaart die bij een hover 45 graden om haar verticale Y-as draait (`transform: rotateY(45deg)`) en oranje kleurt.

### Overzicht van de getoonde perspectieven

| Scène / Klasse | Perspectiefwaarde | Visueel effect bij hover |
|---|---|---|
| **Geen perspectief** (`.scene-none`) | Geen `perspective` ingesteld | Lijkt op een platte, tweedimensionale krimp van de breedte. Het menselijk oog ervaart geen diepte. |
| **Dichtbij** (`.scene-close`) | `perspective: 300px;` | Sterk, dramatisch groothoekperspectief. De rand die naar voren komt lijkt veel groter dan de rand die naar achteren wijkt. |
| **Natuurlijk** (`.scene-natural`) | `perspective: 800px;` | Realistische ruimtelijke diepte zoals je die in het echte leven waarneemt. De standaardkeuze voor webinterfaces. |

<CodeSandbox
  title="Perspectief vergelijken bij 3D-rotatie"
  height="460px"
  initialTab="split"
  activeCodeTab="css"
  highlightHtml="10-11, 14, 17"
  highlightCss="34, 37, 40, 56, 60-61"
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Perspectief</title>
    <link rel="stylesheet" href="stijl.css">
  </head>
  <body>
    <main class="grid">
      <div class="scene scene-none">
        <div class="kaart">Geen perspectief</div>
      </div>
      <div class="scene scene-close">
        <div class="kaart">Dichtbij (300px)</div>
      </div>
      <div class="scene scene-natural">
        <div class="kaart">Natuurlijk (800px)</div>
      </div>
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
  padding: 2rem;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.grid {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}
/* Scènes met verschillende perspectieven */
.scene-none {
  /* Geen perspective gedefinieerd */
}
.scene-close {
  perspective: 300px;
}
.scene-natural {
  perspective: 800px;
}
/* Basisopmaak van de kaart */
.kaart {
  width: 180px;
  height: 220px;
  background-color: var(--kleur-primair);
  color: var(--kleur-wit);
  font-weight: 600;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.4s ease, background-color 0.4s ease;
}
/* Rotatie bij hover */
.scene:hover .kaart {
  transform: rotateY(45deg);
  background-color: var(--kleur-accent);
}'
  js=''
/>

## 3D Transformatiefuncties

Net zoals bij 2D transformaties pas je 3D transformaties toe via de `transform`-eigenschap.

### 1. Roteren in de ruimte: `rotateX()`, `rotateY()` en `rotateZ()`

- **`rotateX(hoek)`:** Kantelt het element voorover of achterover rond de horizontale as (zoals een openklappende garagedeur of een laptopdeksel)
- **`rotateY(hoek)`:** Draait het element linksom of rechtsom rond de verticale as (zoals een draaideur of een boekpagina)
- **`rotateZ(hoek)`:** Draait het element in het beeldschermvlak (identiek aan de bekende 2D `rotate()`)
- **`rotate3d(x, y, z, hoek)`:** Draait het element om een vrije vectoras in de 3D-ruimte

```css
.paneel-a {
  /* Kantelt 40 graden naar achteren */
  transform: rotateX(40deg);
}

.paneel-b {
  /* Draait 45 graden om zijn verticale as */
  transform: rotateY(45deg);
}
```

### 2. Diepteverplaatsing: `translateZ()` en `translate3d()`

Met `translateZ()` verplaats je een element langs de Z-as:

- Een **positieve waarde** (bijv. `translateZ(60px)`) brengt het element dichter bij de kijker. In combinatie met een container die `perspective` heeft, wordt het element hierdoor zichtbaar groter.
- Een **negatieve waarde** (bijv. `translateZ(-60px)`) duwt het element dieper naar achteren in het beeldscherm, waardoor het kleiner lijkt.

Met de kortere notatie `translate3d(x, y, z)` verplaats je een element gelijktijdig over alle drie de assen:

```css
.badge {
  /* 10px naar rechts, 20px naar beneden en 50px dichter bij de kijker */
  transform: translate3d(10px, 20px, 50px);
}
```

### 3. Schalen in de diepte: `scaleZ()` en `scale3d()`

`scaleZ()` schaalt een element langs de Z-as. Aangezien een standaard <abbr title="HyperText Markup Language: de standaard opmaaktaal voor webpagina's">HTML</abbr>-element zelf geen dikte heeft (het is een plat tweedimensionaal vlak van 0 pixels diep), zie je het effect van `scaleZ()` enkel wanneer het element samenwerkt met kindelementen die in 3D zijn gepositioneerd.

## De 3D-ruimte bewaren: `transform-style: preserve-3d`

Standaard rendert een browser elk kindelement plat op het vlak van zijn ouder. Dit heet `transform-style: flat`. Als de ouder in 3D draait, worden alle kinderen samengedrukt (*geflattened*) tot één plat beeld.

Wil je dat kindelementen hun eigen zelfstandige positie en diepte op de Z-as behouden binnen de 3D-wereld van de ouder, dan moet je de eigenschap <dfn title="CSS-eigenschap die bepaalt of kindelementen in een gedeelde driedimensionale ruimte leven of plat op het vlak van de ouder worden gerenderd">`transform-style: preserve-3d`</dfn> declareren op het roterende tussenelement.

```css
.card {
  transform-style: preserve-3d;
}
```

Het onderstaande interactieve voorbeeld toont een ruimtelijk zwevende kaart. Door `transform-style: preserve-3d` op het roterende hoofdelement te combineren met verschillende `translateZ`-waarden op de kindelementen, zweven de badge en de knop virtueel op afzonderlijke dieptelagen boven het kaartoppervlak.

Beweeg je muisaanwijzer over de kaart om de ruimtelijke diepte in actie te zien.

### Opbouw van de elementen

- `div.scene`: de overkoepelende 3D-scène met perspectief (`perspective: 900px`).
- `article.card`: het hoofdkaartje met `transform-style: preserve-3d`. Bij `:hover` kantelt de kaart in 3D en trekt zij met `scale(0.95)` iets naar achteren (`rotateX(15deg) rotateY(-20deg) scale(0.95)`).
- `span.badge`: een oranje label dat bij rust 40px zweeft (`translateZ(40px)`). Bij `:hover` komt het extra ver naar voren (`translateZ(65px) scale(1.1)`).
- `h2` en `p`: de platte tekst die direct op het kaartoppervlak blijft liggen (`translateZ: 0`).
- `button.knop`: de actieknop die bij rust 30px zweeft (`translateZ(30px)`). Bij `:hover` springt de knop naar voren (`translateZ(50px) scale(1.08)`).

### Overzicht van de dieptelagen op de Z-as

| Element / Klasse | Diepte in ruststand | Diepte en effect bij `:hover` | Visuele werking |
|---|---|---|---|
| **Kaartoppervlak** (`.card`) | `translateZ(0)` | `rotateX(15deg) rotateY(-20deg) scale(0.95)` | Kantelt ruimtelijk weg en trekt iets naar achteren waardoor de dieptewerking versterkt. |
| **Statusbadge** (`.badge`) | `transform: translateZ(40px);` | `translateZ(85px) scale(1.3)` | Komt opvallend naar voren en vergroot subtiel als de hoogste visuele laag. |
| **Actieknop** (`.knop`) | `transform: translateZ(30px);` | `translateZ(50px) scale(1.2)` | Zweeft 50 pixels boven het oppervlak uit en vergroot voelbaar naar de kijker toe. |

<CodeSandbox
  title="Gelaagde diepte met translateZ en preserve-3d"
  height="460px"
  initialTab="split"
  activeCodeTab="css"
  highlightHtml="10-12, 15"
  highlightCss="30, 40-41, 46, 58-59, 63, 84-85, 89"
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Z-as lagen</title>
    <link rel="stylesheet" href="stijl.css">
  </head>
  <body>
    <div class="scene">
      <article class="card">
        <span class="badge">Nieuw</span>
        <h2>Web Essentials</h2>
        <p>Beweeg je muis over deze kaart om het gelaagde 3D-effect te zien.</p>
        <button class="knop">Ontdek meer</button>
      </article>
    </div>
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
  --kleur-achtergrond: #0f172a;
  --kleur-kaart: #1e293b;
  --kleur-rand: #334155;
  --kleur-tekst: #f8fafc;
  --kleur-tekst-muted: #94a3b8;
  --kleur-wit: #ffffff;
}
/* Paginastijl */
body {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  background-color: var(--kleur-achtergrond);
  color: var(--kleur-tekst);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
/* 3D Scène */
.scene {
  perspective: 900px;
}
/* Kaart met behoud van 3D context */
.card {
  width: 280px;
  background-color: var(--kleur-kaart);
  border: 1px solid var(--kleur-rand);
  border-radius: 12px;
  padding: 2rem;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
}
/* Kaart kantelt en verkleint lichtjes naar achteren op hover */
.scene:hover .card {
  transform: rotateX(15deg) rotateY(-20deg) scale(0.95);
}
/* Badge zweeft op de Z-as */
.badge {
  display: inline-block;
  background-color: var(--kleur-accent);
  color: var(--kleur-wit);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  transform: translateZ(40px);
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}
/* Badge komt extra naar voren en vergroot op hover */
.scene:hover .badge {
  transform: translateZ(85px) scale(1.3);
}
h2 {
  font-size: 1.4rem;
  margin-bottom: 0.75rem;
}
p {
  color: var(--kleur-tekst-muted);
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}
/* Knop zweeft op de Z-as */
.knop {
  background-color: var(--kleur-primair);
  color: var(--kleur-wit);
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transform: translateZ(30px);
  transition: transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}
/* Knop springt naar voren en vergroot op hover */
.scene:hover .knop {
  transform: translateZ(50px) scale(1.2);
}'
  js=''
/>

## De achterkant beheren: `backface-visibility`

Wanneer je een element 180 graden draait om de Y-as, toont de browser standaard een spiegelbeeld van de voorkant op de achterkant. Dat is handig als het element van glas is, maar niet als je een ondoorschijnende kaart of speelkaart wilt nabootsen.

Met de eigenschap <dfn title="CSS-eigenschap die bepaalt of de achterkant van een element zichtbaar is wanneer het naar de kijker toe wordt gekeerd">`backface-visibility`</dfn> bepaal je of de achterkant zichtbaar is:

- **`visible` (standaard):** De achterkant is zichtbaar in spiegelbeeld.
- **`hidden`:** Zodra het vlak meer dan 90 graden van de kijker weggedraaid is, wordt het volledig transparant en onzichtbaar.

```css
.kaart-vlak {
  backface-visibility: hidden;
}
```

## Praktijkvoorbeeld: De 3D Flip Card ontleden

Het bekendste en meest toegepaste 3D-patroon op het web is de dubbelzijdige kaart die bij een muisbeweging vloeiend omklapt naar haar achterzijde. De constructie steunt op het samenspel tussen perspectief, het bewaren van de 3D-ruimte en het verbergen van de afgewende achterkant.

Beweeg je muisaanwijzer over het visitekaartje om de kaart 180 graden om te laten klappen.

### Opbouw van de elementen

- `div.scene`: de vaste scène (`width: 240px`, `height: 320px`, `perspective: 800px`) die het gezichtspunt voor de virtuele camera levert.
- `div.card`: de draaiende kaartcontainer (`transform-style: preserve-3d`, `transition: transform 0.6s ease`). Bij `.scene:hover` draait dit element 180 graden om de Y-as (`transform: rotateY(180deg)`).
- `div.card-face`: de gedeelde basisopmaak voor beide zijden (`position: absolute`, volle breedte en hoogte, afgeronde hoeken en `backface-visibility: hidden`).
- `div.card-front`: het blauwe voorvlak (start op `rotateY(0deg)`).
- `div.card-back`: het oranje achtervlak (start vooraf reeds 180 graden gedraaid via `transform: rotateY(180deg)`).

### Werking van de flip-animatie

| Toestand | Positie voorkant (`.card-front`) | Positie achterkant (`.card-back`) | Wat ziet de gebruiker? |
|---|---|---|---|
| **Ruststand** | `rotateY(0deg)` (naar voren gericht, zichtbaar) | `rotateY(180deg)` (weggedraaid, verborgen via `backface-visibility: hidden`) | De blauwe voorkant met titel en laptopicoon. |
| **Hover (`.scene:hover`)** | Roteert naar `180deg` (wordt onzichtbaar) | Roteert naar `360deg` (keert naar voren en wordt zichtbaar) | De oranje achterkant met cursusinhoud en campuslocatie. |

<CodeSandbox
  title="Interactieve 3D Flip Card met twee zijden"
  height="490px"
  initialTab="split"
  activeCodeTab="css"
  highlightHtml="10-12, 17"
  highlightCss="27, 34-35, 39, 53, 65"
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>3D Flip Card</title>
    <link rel="stylesheet" href="stijl.css">
  </head>
  <body>
    <div class="scene">
      <div class="card">
        <div class="card-face card-front">
          <span class="icoon">💻</span>
          <h2>Frontend Dev</h2>
          <p>Beweeg over mij</p>
        </div>
        <div class="card-face card-back">
          <h2>Inhoud</h2>
          <p>HTML5, CSS3, Flexbox, Grid en animaties.</p>
          <span class="campus">Campus Geel</span>
        </div>
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
/* CSS variabelen */
:root {
  --kleur-voorkant: #0284c7;
  --kleur-achterkant: #e87722;
  --kleur-achtergrond: #f1f5f9;
  --kleur-wit: #ffffff;
}
/* Paginastijl */
body {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  background-color: var(--kleur-achtergrond);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
/* 1. De scène met perspectief */
.scene {
  width: 240px;
  height: 320px;
  perspective: 800px;
}
/* 2. De kaartcontainer met 3D-behoud */
.card {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s ease;
}
/* 3. Omklappen van de kaartcontainer bij hover */
.scene:hover .card {
  transform: rotateY(180deg);
}
/* 4. Gemeenschappelijke stijlen voor beide vlakken */
.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  backface-visibility: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
/* 5. Voorkant */
.card-front {
  background-color: var(--kleur-voorkant);
  color: var(--kleur-wit);
}
/* 6. Achterkant (vooraf 180 graden gedraaid) */
.card-back {
  background-color: var(--kleur-achterkant);
  color: var(--kleur-wit);
  transform: rotateY(180deg);
}
.icoon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.campus {
  margin-top: 1.5rem;
  font-size: 0.85rem;
  opacity: 0.8;
}'
  js=''
/>

## Emmet-afkortingen voor 3D transformaties

In PhpStorm genereer je 3D-stijlen snel met de volgende Emmet-afkortingen:

| Emmet-afkorting | Gegenereerde CSS | Betekenis |
|---|---|---|
| `pe:800` of `pe800` | `perspective: 800px;` | Perspectiefafstand van 800px instellen |
| `po:c` of `po:t` | `perspective-origin: center;` / `top;` | Kijkpunt bepalen |
| `trf:ry(180deg)` | `transform: rotateY(180deg);` | 180 graden roteren om Y-as |
| `trf:rx(45deg)` | `transform: rotateX(45deg);` | 45 graden kantelen om X-as |
| `trf:tz(50px)` | `transform: translateZ(50px);` | 50px naar voren verplaatsen |
| `ts:p3d` | `transform-style: preserve-3d;` | 3D-context van kindelementen behouden |
| `bv:h` | `backface-visibility: hidden;` | Achterkant onzichtbaar maken bij rotatie |

<PageSummary>

### Syntaxis in een oogopslag

| Eigenschap of Functie | Toepassen op | Doel & Voorbeeld |
|---|---|---|
| `perspective: <lengte>;` | Container / Scène | Bepaalt de kijkafstand en diepte-intensiteit (`perspective: 800px;`) |
| `perspective-origin: <x> <y>;` | Container / Scène | Bepaalt het virtuele oogpunt (`perspective-origin: center top;`) |
| `transform-style: preserve-3d;` | Tussenelement / Wrapper | Behoudt de 3D-posities van kindelementen in de ruimte |
| `backface-visibility: hidden;` | Roterend vlak | Verbergt de achterzijde wanneer een vlak weggedraaid is |
| `rotateX(<hoek>)` | Getransformeerd element | Kantelt voorover of achterover om de horizontale as |
| `rotateY(<hoek>)` | Getransformeerd element | Draait linksom of rechtsom om de verticale as |
| `translateZ(<lengte>)` | Getransformeerd element | Verplaatst het element naar de kijker toe of van de kijker weg |

### Veelgemaakte fouten

- **Geen `perspective` op de ouder plaatsen:** Zonder perspectief zien rotaties met `rotateX()` of `rotateY()` er plat uit en lijken ze gewoon op een `scale()`-verkleining.
- **`preserve-3d` vergeten op het tussenelement:** Als je kindelementen een `translateZ()` geeft maar de ouder geen `transform-style: preserve-3d` heeft, worden alle kinderen plat op het vlak van de ouder geprojecteerd.
- **`perspective` op het roterende element zelf zetten in plaats van op de scène:** Hierdoor krijgt elk element een eigen verdwijnpunt, wat bij meerdere kaarten naast elkaar een onnatuurlijk, scheef beeld oplevert.
- **Vergeten om `card-back` initieel 180 graden te draaien:** Als je `.card-back` niet vooraf `transform: rotateY(180deg)` geeft, staan beide zijden in dezelfde richting en zie je bij het omklappen niets meer.
- **Extreem lage `perspective`-waarden kiezen:** Een waarde zoals `perspective: 50px` veroorzaakt enorme optische vertekeningen waarbij elementen door het beeldschermvlak lijken te snijden.

### Tips voor beginners

- Begin altijd met een container met `perspective: 800px` tot `1000px` voor een realistisch diepte-effect.
- Combineer `translateZ` subtiel: een verplaatsing van `20px` tot `40px` naar voren is al ruim voldoende om diepte te suggereren op knoppen of titels.
- Zorg ervoor dat zowel `.card-front` als `.card-back` voorzien zijn van `backface-visibility: hidden` en exact dezelfde afmetingen en absolute positionering hebben binnen de kaartcontainer.

</PageSummary>

## Oefeningen

### Oefening 1: Kantelend fotopaneel met perspectief

Bouw een container met drie fotopanelen naast elkaar.
- Geef de overkoepelende container een perspectief van `700px`.
- Zorg dat elk paneel bij een `:hover` vloeiend (`transition: transform 0.4s ease`) 25 graden achterover kantelt met `rotateX(25deg)`.
- Voeg bij de hover ook een subtiel vergrote schaduw toe zodat het paneel lijkt op te lichten in de ruimte.

### Oefening 2: 3D Visitekaartje met twee zijden

Ontwikkel een interactieve 3D flip card voor Thomas More Campus Geel.
- De voorkant toont het logo, de naam van de campus en de opleiding.
- De achterkant toont het officiële adres (Kleinhoefstraat 4, 2440 Geel) en contactgegevens.
- Zorg voor een correcte structuur met `.scene`, `.card`, `.card-front` en `.card-back`.
- Gebruik `transform-style: preserve-3d` en `backface-visibility: hidden` zodat de kaart bij een hover omklapt over de Y-as in `0.6s`.

### Oefening 3: 3D Isometrische knoppenstack

Ontwerp een zwevende knoppenstack waarin elementen op verschillende Z-lagen rusten.
- Maak een basiskaart die onder een lichte hoek geroteerd staat (`rotateX(20deg) rotateY(-15deg)`).
- Plaats hierin drie knoppen of badges die elk een andere `translateZ`-waarde hebben (`20px`, `40px`, `60px`).
- Laat de Z-afstanden bij een hover nog verder uit elkaar schuiven (*parallax-effect in 3D*).

