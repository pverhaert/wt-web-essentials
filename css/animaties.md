---
title: Animaties
---

# Animaties

In het vorige hoofdstuk heb je gezien hoe je met transities een vloeiende overgang maakt tussen twee toestanden, zoals bij een `:hover`-effect. Transities hebben echter één duidelijke beperking: ze vereisen altijd een actie van de gebruiker (zoals een muisbeweging of toetsaanslag) en bewegen enkel lineair van toestand A naar toestand B. Met <dfn title="Een geavanceerd CSS-mechanisme waarmee elementen zelfstandig en herhaaldelijk door een reeks stapsgewijze stijlwijzigingen bewegen zonder gebruikersinteractie">CSS-animaties</dfn> ga je een grote stap verder. Je kan elementen automatisch laten bewegen zodra de pagina laadt, complexe tussenstappen definiëren, bewegingen oneindig laten herhalen en afspeelrichtingen omkeren.

## Leerdoelen

Na dit hoofdstuk kan je:

- Het fundamentele verschil uitleggen tussen een transitie (toestandsgebonden) en een animatie (zelfstandig lopend)
- Een tijdlijn van tussenstappen definiëren met de `@keyframes`-regel
- Tussenstappen vastleggen met sleutelwoorden (`from`, `to`) of percentages (`0%` tot `100%`)
- Een animatie koppelen aan een element met `animation-name` en `animation-duration`
- Het herhaaldelijk afspelen sturen met `animation-iteration-count` (aantal of `infinite`)
- De afspeelrichting bepalen met `animation-direction` (`normal`, `reverse`, `alternate`, `alternate-reverse`)
- De toestand vóór en na afloop beheren met `animation-fill-mode` (`none`, `forwards`, `backwards`, `both`)
- Een animatie pauzeren en hervatten met `animation-play-state`
- De `animation`-shorthand gestructureerd en foutloos toepassen
- Bewegingsgevoelige gebruikers beschermen via `prefers-reduced-motion`

## De twee bouwstenen van een animatie

Elke CSS-animatie bestaat altijd uit twee onafhankelijke onderdelen:

1. **Het script of de tijdlijn (`@keyframes`):** hierin leg je vast welke stijlen het element op welk moment aanneemt.
2. **De toewijzing op het element (`animation-*` eigenschappen):** hierin bepaal je welk element de animatie afspeelt, hoe lang ze duurt, hoe vaak ze herhaalt en met welke snelheidscurve.

Door deze scheiding kan je één tijdlijn definiëren en die vervolgens hergebruiken op meerdere verschillende elementen op je pagina.

## De tijdlijn definiëren: @keyframes

Met de <dfn title="Een CSS at-rule waarmee je de tussenstappen en stijlen van een animatie over een tijdlijn van 0% tot 100% vastlegt">@keyframes</dfn> at-rule geef je de animatie een herkenbare naam en beschrijf je de visuele tussenstappen (*keyframes*).

De eenvoudigste vorm gebruikt de sleutelwoorden `from` (het begin, overeenkomend met `0%`) en `to` (het einde, overeenkomend met `100%`):

```css
@keyframes oplichten {
  from {
    background-color: #0056b3;
    opacity: 0.5;
  }
  to {
    background-color: #e87722;
    opacity: 1;
  }
}
```

### Nauwkeurige fasen met percentages

Voor complexe bewegingen met meer dan twee momenten gebruik je percentages tussen `0%` en `100%`. Elk percentage stelt een breekpunt op de tijdlijn voor:

```css
@keyframes pulseren {
  0% {
    transform: scale(1);
    background-color: #0056b3;
  }
  50% {
    transform: scale(1.15);
    background-color: #e87722;
  }
  100% {
    transform: scale(1);
    background-color: #0056b3;
  }
}
```

### Stappen groeperen en rustpunten inbouwen

Als een element op verschillende momenten dezelfde stijl moet aannemen, kan je de percentages met een komma groeperen. Zo bouw je eenvoudig een rustpunt in waarbij de stijl tijdelijk gelijk blijft:

```css
@keyframes knipperen {
  /* Volledig zichtbaar bij de start (0%) en aan het einde van de cyclus (100%) */
  0%, 100% {
    opacity: 1;
  }
  /* Rustpunt: tussen 40% en 60% verandert de dekking niet en blijft het element gedimd */
  40%, 60% {
    opacity: 0.2;
  }
}
```

Tussen `40%` en `60%` verandert de doorschijnendheid niet, waardoor er een korte pauze ontstaat waarin het element gedimd blijft.

## De animatie-eigenschappen in detail

Nadat je de tijdlijn hebt opgesteld, activeer je deze op een HTML-element via de specifieke `animation`-eigenschappen.

### 1. animation-name en animation-duration

Dit zijn de twee absolute minimumeisen. Zonder naam weet de browser niet welke tijdlijn hij moet volgen, en zonder duur (`0s`) beweegt er niets:

```css
.status-badge {
  animation-name: pulseren;
  animation-duration: 2s;
}
```

Net als bij transities noteer je de tijd in seconden (`s`) of milliseconden (`ms`).

### 2. animation-iteration-count

Standaard speelt een animatie exact één keer af. Met `animation-iteration-count` bepaal je het aantal herhalingen:

- **Een vast getal:** bijvoorbeeld `3` om de animatie driemaal te laten lopen.
- **Kommagetallen:** bijvoorbeeld `2.5` om tweeënhalve cyclus af te spelen.
- **`infinite`:** de animatie blijft zich oneindig herhalen zolang de pagina geopend is.

```css
.laadicoon {
  animation-iteration-count: infinite;
}
```

### 3. animation-direction

Met `animation-direction` stuur je de richting waarin de browser door de tijdlijn van `@keyframes` wandelt:

| Waarde | Looprichting |
|---|---|
| `normal` | Speelt af van `0%` naar `100%`. Bij een herhaling springt het element direct terug naar `0%` (standaardwaarde). |
| `reverse` | Speelt omgekeerd af, van `100%` terug naar `0%`. |
| `alternate` | Speelt af van `0%` naar `100%`, keert dan soepel om van `100%` terug naar `0%`, en herhaalt zo verder. |
| `alternate-reverse` | Start bij `100%`, loopt naar `0%`, keert terug naar `100%`, en herhaalt. |

::: tip Schokvrije herhalingen met alternate
Wanneer je een element continu wilt laten pulseren of heen en weer wilt laten bewegen, is `animation-direction: alternate` in combinatie met `infinite` de ideale keuze. De beweging keert naadloos om zonder dat het element plotseling terugschiet naar zijn beginpositie.
:::

### 4. animation-timing-function

Net zoals bij transities bepaalt de timingfunctie de versnelling en vertraging tussen de opeenvolgende keyframes. De vertrouwde waarden zijn direct inzetbaar:

- `ease` (standaard): begint rustig, versnelt en dooft zacht uit
- `linear`: beweegt met een volkomen constante snelheid (ideaal voor oneindig draaiende spinners)
- `ease-in`, `ease-out`, `ease-in-out`
- `steps(n)`: getrapte weergave zonder vloeiende tussenstappen

### 5. animation-delay

Met `animation-delay` stel je een wachttijd in voordat de animatie voor de allereerste keer van start gaat:

```css
.notificatie {
  animation-delay: 500ms;
}
```

::: warning Delay geldt alleen voor de start
Bij een animatie met `animation-iteration-count: infinite` geldt de `animation-delay` uitsluitend voorafgaand aan de allereerste cyclus. Zodra de animatie loopt, is er **geen** wachttijd meer tussen opeenvolgende herhalingen. Wil je een pauze tussen herhalingen inbouwen, doe dat dan met percentages binnen je `@keyframes` (bijvoorbeeld door tussen `80%` en `100%` geen stijlwijziging toe te passen).
:::

### 6. animation-fill-mode

Standaard heeft een animatie enkel invloed op een element tijdens de seconden waarin ze daadwerkelijk afspeelt. Vóór de startvertraging en na afloop herstelt de browser onmiddellijk de basisstijl van het element.

Met <dfn title="Een animatie-eigenschap die bepaalt of de begin- of eindstijl van keyframes zichtbaar blijft vóór de startvertraging of na afloop van de animatie">animation-fill-mode</dfn> pas je dat gedrag aan:

| Waarde | Vóór de start (tijdens delay) | Na afloop (einde animatie) |
|---|---|---|
| `none` | Toont de gewone CSS-basisstijl van het element (standaardwaarde). | Keert onmiddellijk terug naar de gewone CSS-basisstijl. |
| `forwards` | Toont de gewone CSS-basisstijl. | **Blijft staan in de stijl van het laatste keyframe** (`100%`). |
| `backwards` | **Neemt direct de stijl aan van het eerste keyframe** (`0%`). | Keert terug naar de gewone CSS-basisstijl. |
| `both` | Neemt direct het eerste keyframe aan (`0%`). | Blijft na afloop staan in het laatste keyframe (`100%`). |

::: tip Wanneer gebruik je forwards?
Stel dat je een banner hebt die van links het scherm binnenschuift en daarna stil moet blijven staan. Zonder `animation-fill-mode: forwards` springt de banner na de animatie plotsklaps terug naar zijn startpositie buiten beeld. Met `forwards` bevriest de browser de eindtoestand permanent op het scherm.
:::

### 7. animation-play-state

Met `animation-play-state` kan je een lopende animatie pauzeren (`paused`) en weer laten doorlopen (`running`). Dit is bijzonder krachtig in combinatie met `:hover`:

```css
.draaiend-wiel {
  animation: roteren 4s linear infinite;
}

/* Pauzeer de animatie zodra de bezoeker er met de muis over zweeft */
.draaiend-wiel:hover {
  animation-play-state: paused;
}
```

## De samengestelde eigenschap: animation (shorthand)

Net als bij transities combineer je de afzonderlijke eigenschappen in de praktijk bijna altijd in één overzichtelijke shorthand:

```css
/* Volgorde van de waarden: */
/* animation: naam duur timingfunctie vertraging herhaling richting fill-mode; */

.status-bol {
  animation: pulseren 1.5s ease-in-out 200ms infinite alternate both;
}
```

Als je enkel de minimale parameters nodig hebt, volstaan de naam en de duur:

```css
.spinner {
  animation: draaien 1s linear infinite;
}
```

### De vaste volgorde voor tijdeenheden

Als je zowel een duur als een vertraging opgeeft in de shorthand, hanteert de browser dezelfde onbreekbare regel als bij transities:
1. De **eerste tijdseenheid** is altijd de **duur** (`duration`).
2. De **tweede tijdseenheid** is altijd de **startvertraging** (`delay`).

## Live demonstratie: pulseren en interactief pauzeren

In het onderstaande interactieve voorbeeld zie je twee verschillende zelfstandig lopende animaties: een gloeiende en pulserende statusbol voor een live-uitzending en een continu ronddraaiende radarwijzer. Zodra je met de muis over de kaart beweegt, worden beide animaties ter plekke bevroren via `animation-play-state: paused`.

### Opbouw van de elementen

- `div.kaart`: de centrale container (`max-width: 340px`, afgeronde hoeken, padding en schaduw). De hover-toestand is aan deze kaart gekoppeld (`.kaart:hover`), waardoor beide kind-animaties gelijktijdig pauzeren.
- `span.puls-bol`: een cirkelvormig element (`border-radius: 50%`) dat via keyframes ritmisch groter en feller gloeit met `box-shadow`.
- `div.radar-container`: het ronde referentiekader met een stippelrand (`border: 2px dashed var(--kleur-radar-rand)`).
- `div.radar-wijzer`: de naald die met `transform-origin: bottom center` vanuit het midden van de radar ronddraait.

### Overzicht van de animaties en interactie

| Element / Klasse | Animatie-eigenschappen | Keyframes-werking | Effect bij hover over de kaart |
|---|---|---|---|
| **Live-indicator** (`.puls-bol`) | `animation: gloeien 1.2s ease-in-out infinite alternate;` | Schaalt van 90% naar 125% terwijl een oranje `box-shadow` uitdijt en vervaagt. Keert dankzij `alternate` soepel om. | `animation-play-state: paused;` (de bol bevriest in zijn huidige schaal). |
| **Radarwijzer** (`.radar-wijzer`) | `animation: draaien 3s linear infinite;` | Roteert continu 360 graden rond zijn basis (`bottom center`) met een gelijkmatige snelheid (`linear`). | `animation-play-state: paused;` (de wijzer stopt op zijn actuele hoek). |

<CodeSandbox
  title="Demonstratie: statusbadge en interactief pauzeren"
  height="450px"
  initialTab="split"
  activeCodeTab="css"
  highlightHtml="10, 13, 16-17"
  highlightCss="30-31, 41-44, 52, 69, 74, 84, 92-101, 103-110"
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live animatiedemonstratie</title>
    <link rel="stylesheet" href="stijl.css">
  </head>
  <body>
    <div class="kaart">
      <div class="status-rij">
        <!-- Pulserende live-indicator -->
        <span class="puls-bol"></span>
        <span class="status-label">Live uitzending</span>
      </div>
      <div class="radar-container">
        <div class="radar-wijzer"></div>
      </div>
      <p class="toelichting">Beweeg je muis over deze kaart om de animaties te pauzeren.</p>
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
  --kleur-primair: #0056b3;
  --kleur-accent: #e87722;
  --kleur-achtergrond: #f0f4f8;
  --kleur-kaart: #ffffff;
  --kleur-rand: #dcdfe3;
  --kleur-radar-rand: #b0bec5;
  --kleur-tekst: #1a202c;
  --kleur-tekst-muted: #6c757d;
}
/* Paginastijl */
body {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--kleur-achtergrond);
  padding: 1.5rem;
}
/* Container */
.kaart {
  width: 100%;
  max-width: 340px;
  background-color: var(--kleur-kaart);
  border: 1px solid var(--kleur-rand);
  border-radius: 0.75rem;
  padding: 1.75rem;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
/* Statusrij met pulserende bol */
.status-rij {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
}
.puls-bol {
  width: 14px;
  height: 14px;
  background-color: var(--kleur-accent);
  border-radius: 50%;
  animation: gloeien 1.2s ease-in-out infinite alternate;
}
.status-label {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--kleur-tekst);
}
/* Radarcontainer */
.radar-container {
  width: 100px;
  height: 100px;
  margin: 0 auto 1.25rem;
  border: 2px dashed var(--kleur-radar-rand);
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.radar-wijzer {
  width: 4px;
  height: 45px;
  background-color: var(--kleur-primair);
  border-radius: 2px;
  transform-origin: bottom center;
  position: absolute;
  top: 5px;
  animation: draaien 3s linear infinite;
}
/* Pauzeren op hover over de kaart */
.kaart:hover .puls-bol,
.kaart:hover .radar-wijzer {
  animation-play-state: paused;
}
.toelichting {
  font-size: 0.85rem;
  color: var(--kleur-tekst-muted);
  line-height: 1.4;
}
/* Keyframes voor het pulseren */
@keyframes gloeien {
  0% {
    transform: scale(0.9);
    box-shadow: 0 0 0 0 rgba(232, 119, 34, 0.6);
  }
  100% {
    transform: scale(1.25);
    box-shadow: 0 0 0 10px rgba(232, 119, 34, 0);
  }
}
/* Keyframes voor het draaien */
@keyframes draaien {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}'
  js=''
/>

## Live demonstratie: animation-fill-mode ontleed

Om het abstracte verschil tussen `none`, `forwards`, `backwards`, `both` én herhalingspatronen zoals `infinite` visueel inzichtelijk te maken, toont de onderstaande testbaan zes identieke balken. Elke balk heeft een startvertraging van 1 seconde (`1s`) en schuift vervolgens in 1,5 seconde 200 pixels naar rechts met een kleurwissel van oranje naar blauw.

Beweeg je muisaanwijzer over het testkader om de animaties gelijktijdig te triggeren.

### Opbouw van de elementen

- `div.testbaan`: het testkader (`max-width: 480px`, padding, schaduw). De animaties starten bij `:hover` over dit kader (`.testbaan:hover .blok-...`).
- `div.spoor`: de grijze achtergrondsporen (`background-color: var(--kleur-spoor)`) waarin de blokken glijden.
- `div.blok`: de bewegende blokken met een donkergrijze basiskleur (`var(--kleur-blok)`).

### Overzicht van de animatie-instellingen en gedrag

| Waarde / Klasse | Gedrag tijdens delay (eerste seconde) | Gedrag na afloop of tijdens herhaling |
|---|---|---|
| **none** (`.blok-none`) | Blijft donkergrijs op de ruststand (`0px`). | Schiet na afloop direct terug naar de donkergrijze ruststand. |
| **forwards** (`.blok-forwards`) | Blijft donkergrijs op de ruststand (`0px`). | **Blijft permanent blauw aan de finish staan** (`translateX(240px)`). |
| **backwards** (`.blok-backwards`) | **Springt tijdens de delay direct naar oranje** (`translateX(40px)`). | Schiet na afloop direct terug naar de donkergrijze ruststand. |
| **both** (`.blok-both`) | **Springt tijdens de delay direct naar oranje**. | **Blijft na afloop permanent blauw aan de finish staan**. |
| **infinite** (`.blok-infinite`) | Blijft donkergrijs op de ruststand (`0px`). | **Stopt nooit**: herhaalt de cyclus oneindig en springt na elke ronde terug naar de start. |
| **infinite alternate** (`.blok-infinite-alt`) | Blijft donkergrijs op de ruststand (`0px`). | **Pendelt continu**: keert aan de finish soepel om en glijdt vloeiend heen en weer. |

<CodeSandbox
  title="Vergelijking van animation-fill-mode en herhalingsgedrag"
  height="540px"
  initialTab="split"
  activeCodeTab="css"
  highlightHtml="10, 16, 19, 22, 25, 28"
  highlightCss="30-31, 62, 65, 68, 71, 74, 77, 80-89"
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fill-mode demonstratie</title>
    <link rel="stylesheet" href="stijl.css">
  </head>
  <body>
    <div class="testbaan">
      <p class="instructie">Beweeg over het kader: start na 1s delay</p>
      <div class="spoor">
        <div class="blok blok-none">none</div>
      </div>
      <div class="spoor">
        <div class="blok blok-forwards">forwards</div>
      </div>
      <div class="spoor">
        <div class="blok blok-backwards">backwards</div>
      </div>
      <div class="spoor">
        <div class="blok blok-both">both</div>
      </div>
      <div class="spoor">
        <div class="blok blok-infinite">infinite</div>
      </div>
      <div class="spoor">
        <div class="blok blok-infinite-alt">infinite alternate</div>
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
  --kleur-primair: #0056b3;
  --kleur-accent: #e87722;
  --kleur-achtergrond: #f4f6f8;
  --kleur-kaart: #ffffff;
  --kleur-rand: #ced4da;
  --kleur-spoor: #e9ecef;
  --kleur-blok: #343a40;
  --kleur-tekst-muted: #6c757d;
  --kleur-wit: #ffffff;
}
/* Paginastijl */
body {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--kleur-achtergrond);
  padding: 1.5rem;
}
.testbaan {
  width: 100%;
  max-width: 480px;
  background-color: var(--kleur-kaart);
  border: 1px solid var(--kleur-rand);
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}
.instructie {
  font-size: 0.85rem;
  color: var(--kleur-tekst-muted);
  margin-bottom: 1rem;
}
.spoor {
  background-color: var(--kleur-spoor);
  border-radius: 0.25rem;
  margin-bottom: 0.75rem;
}
/* Basisblok */
.blok {
  width: 110px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--kleur-wit);
  background-color: var(--kleur-blok);
  border-radius: 0.25rem;
}
/* Fill-modes en herhalingsopties geactiveerd op hover */
.testbaan:hover .blok-none {
  animation: verschuif 1.5s ease 1s none;
}
.testbaan:hover .blok-forwards {
  animation: verschuif 1.5s ease 1s forwards;
}
.testbaan:hover .blok-backwards {
  animation: verschuif 1.5s ease 1s backwards;
}
.testbaan:hover .blok-both {
  animation: verschuif 1.5s ease 1s both;
}
.testbaan:hover .blok-infinite {
  animation: verschuif 1.5s ease 1s infinite;
}
.testbaan:hover .blok-infinite-alt {
  animation: verschuif 1.5s ease 1s infinite alternate;
}
/* Keyframes met kleurwissel en verplaatsing */
@keyframes verschuif {
  0% {
    background-color: var(--kleur-accent);
    transform: translateX(40px);
  }
  100% {
    background-color: var(--kleur-primair);
    transform: translateX(240px);
  }
}'
  js=''
/>

## Praktijkvoorbeeld: geanimeerde laadcirkel (spinner)

Een van de meest voorkomende toepassingen van CSS-animaties in moderne webapplicaties is een laadindicator (*spinner*). In onderstaand voorbeeld combineren we een ronde cirkel met een contrasterende bovenrand en een oneindige, vloeiende rotatie via de `linear` timingfunctie.

### Opbouw van de elementen

- `div.laad-kader`: de gecentreerde kaart (`padding: 2rem`, lichte rand en schaduw) die het laadproces omsluit.
- `div.spinner`: de laadring zelf. Deze is perfect rond (`border-radius: 50%`) en heeft een grijze basisrand met één opvallende blauwe bovenrand (`border-top-color: var(--kleur-primair)`).
- `p.laad-tekst`: de begeleidende statustekst onder de cirkel.

### Werking van de laadanimatie

| Eigenschap | Waarde | Waarom deze keuze? |
|---|---|---|
| `@keyframes spin` | `from { transform: rotate(0deg); }`<br>`to { transform: rotate(360deg); }` | Laat de cirkel een volledige omwenteling van 360 graden maken. |
| `animation-duration` | `0.8s` | Zorgt voor een vlotte, natuurlijke rotatiesnelheid (niet te snel, niet te traag). |
| `animation-timing-function` | `linear` | Beweegt met een volkomen constante snelheid zonder te vertragen of haperen op het breekpunt. |
| `animation-iteration-count` | `infinite` | Blijft continu doordraaien zolang de bezoeker wacht op het laden van de gegevens. |

<CodeSandbox
  title="Praktijkvoorbeeld: oneindig draaiende laadindicator"
  height="420px"
  initialTab="split"
  activeCodeTab="css"
  highlightHtml="10-12"
  highlightCss="40, 48-55"
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Laadindicator</title>
    <link rel="stylesheet" href="stijl.css">
  </head>
  <body>
    <div class="laad-kader">
      <div class="spinner"></div>
      <p class="laad-tekst">Gegevens ophalen...</p>
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
  --kleur-primair: #0056b3;
  --kleur-achtergrond: #f8fafc;
  --kleur-kaart: #ffffff;
  --kleur-rand: #e2e8f0;
  --kleur-tekst: #475569;
}
/* Paginastijl */
body {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--kleur-achtergrond);
}
.laad-kader {
  text-align: center;
  padding: 2rem;
  background-color: var(--kleur-kaart);
  border: 1px solid var(--kleur-rand);
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);
}
/* De draaiende spinner */
.spinner {
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
  border: 4px solid var(--kleur-rand);
  border-top-color: var(--kleur-primair);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
.laad-tekst {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--kleur-tekst);
}
/* 360 graden rotatie */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}'
  js=''
/>

## Toegankelijkheid: prefers-reduced-motion

Net als bij transities moet je waken over de toegankelijkheid van geanimeerde onderdelen. Continue bewegingen (zoals oneindig knipperende meldingen of ronddraaiende elementen) kunnen concentratieproblemen of fysieke klachten veroorzaken bij gebruikers met cognitieve of vestibulaire gevoeligheden.

Vang dit netjes op met een media query voor verminderde beweging:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
```

Met deze instelling flitst de animatie direct naar haar eindtoestand zonder de gebruiker te storen met aanhoudende beweging.

## Emmet-sneltoetsen in PhpStorm

In PhpStorm genereer je animatieregels razendsnel met Emmet:

| Emmet-opdracht | Resulterende CSS | Betekenis |
|---|---|---|
| `@kf` + `TAB` | `@keyframes identifier { }` | Tijdlijn aanmaken |
| `anim` + `TAB` | `animation: ;` | Samengestelde eigenschap |
| `animn` + `TAB` | `animation-name: ;` | Naam van de tijdlijn |
| `animdur` + `TAB` | `animation-duration: ;` | Afspeelduur |
| `animtf` + `TAB` | `animation-timing-function: ;` | Timingfunctie |
| `animdel` + `TAB` | `animation-delay: ;` | Startvertraging |
| `animic` + `TAB` | `animation-iteration-count: ;` | Aantal herhalingen |
| `animdir` + `TAB` | `animation-direction: ;` | Afspeelrichting |
| `animfm` + `TAB` | `animation-fill-mode: ;` | Stijl voor en na afloop |
| `animps` + `TAB` | `animation-play-state: ;` | Pauzeren of afspelen |

<PageSummary>

### Syntaxis in een oogopslag

| Wat | Hoe | Voorbeeld |
|---|---|---|
| Tijdlijn definiëren | `@keyframes naam { ... }` | `@keyframes puls { 0% {...} 100% {...} }` |
| Samengestelde animatie | `animation: [naam] [duur] [timing] [delay] [count] [dir] [fill];` | `animation: puls 2s ease infinite alternate;` |
| Oneindig herhalen | `animation-iteration-count: infinite;` | `animation-iteration-count: infinite;` |
| Heen en weer bewegen | `animation-direction: alternate;` | `animation-direction: alternate;` |
| Eindstand vasthouden | `animation-fill-mode: forwards;` | `animation-fill-mode: forwards;` |
| Pauzeren bij interactie | `animation-play-state: paused;` | `.element:hover { animation-play-state: paused; }` |

### Regels en naamgeving

- **Duur is verplicht:** Zonder `animation-duration` (standaard `0s`) wordt de animatie niet uitgevoerd.
- **Eerste tijdseenheid is altijd duur:** In de shorthand staat de duur altijd vóór de vertraging (`delay`).
- **Gebruik betekenisvolle namen:** Noem een keyframe naar de actie die het uitvoert (`draai-rond`, `schuif-in`, `puls`), niet naar het element (`animatie-div1`).
- **Optimaliseer prestaties:** Animeer bij voorkeur `transform` en `opacity` voor vloeiende 60fps-prestaties via de grafische kaart.
- **Pauzeer oneindige animaties op hover:** Bied de bezoeker rust door bewegende badges of tickers te pauzeren wanneer de cursor eroverheen beweegt.

### Veelgemaakte fouten

- **Vergeten om duration op te geven:** Wel een `animation-name` invullen, maar geen duur instellen. Hierdoor gebeurt er niets.
- **Typfout in de keyframenaam:** De naam achter `@keyframes` moet exact overeenkomen met de waarde van `animation-name` (inclusief hoofdlettergevoeligheid).
- **Fill-mode vergeten bij eenmalige animaties:** Verwachten dat een binnengeschoven melding blijft staan, terwijl ze zonder `forwards` direct terugspringt.
- **Denken dat delay tussen loops pauzeert:** `animation-delay` geldt alleen vóór de allereerste startcyclus, niet tussen herhalingen.

### Tips voor beginners

- **Gebruik linear voor draaiende cirkels:** Voor oneindig roterende spinners geeft `linear` een constante, soepele draai zonder horten of stoten.
- **Inspecteer in de DevTools:** Zowel Chrome als Firefox hebben een speciaal Animations-tabblad in hun DevTools waarmee je animaties kunt vertragen, pauzeren en frame per frame kunt bekijken.

</PageSummary>

## Oefeningen

### Oefening 1: Pulserende opname-indicator (Basis)

Maak een rode live-opnamebadge voor een mediastream:

1. Bouw een cirkelvormig element van `16px` bij `16px` met een felrode achtergrondkleur.
2. Definieer een `@keyframes`-regel met de naam `opname-puls`.
3. Laat de cirkel van `scale(1)` naar `scale(1.3)` groeien, en laat tegelijkertijd een zachte rode `box-shadow` naar buiten uitbreiden en vervagen (`opacity` naar 0).
4. Stel de animatie in op een duur van `1s`, een snelheidscurve van `ease-in-out`, oneindige herhaling (`infinite`) en omkerende richting (`alternate`).

### Oefening 2: Gekleurde progressiebalk (Gemiddeld)

Ontwerp een geanimeerde laadmeter voor een downloadpagina:

1. Bouw een grijze balk van `300px` breed met afgeronde hoeken.
2. Plaats daarin een binnenste vulbalk met een opvallende kleur (bijvoorbeeld Thomas More-oranje).
3. Definieer keyframes waarbij de vulbalk start op een breedte van `0%` en over 3 seconden groeit naar `100%`.
4. Zorg ervoor dat de vulbalk bij `100%` blijft staan en niet terugspringt naar `0%` door de juiste `animation-fill-mode` in te stellen.
5. Voeg een startvertraging toe van `500ms`.

### Oefening 3: Inschuivende toast-notificatie (Uitdagend)

Bouw een meldingstrook die subtiel van bovenaf binnenglijdt, enkele seconden blijft staan en daarna vervaagt:

1. Bouw een notificatiekader met een vinkje en de tekst "Je wijzigingen zijn succesvol opgeslagen".
2. Positioneer het kader bovenaan het scherm en laat het standaard net buiten beeld staan via `transform: translateY(-100px); opacity: 0;`.
3. Stel een tijdlijn op met percentages:
   - `0%`: buiten beeld (`translateY(-100px)` en `opacity: 0`)
   - `15%`: soepel binnengeschoven op de juiste plek (`translateY(0)` en `opacity: 1`)
   - `80%`: blijft stil en perfect leesbaar staan op die plek
   - `100%`: vervaagt langzaam weg (`opacity: 0`)
4. Koppel de animatie met een totale duur van `4s` en zorg met de juiste fill-mode dat de melding na afloop onzichtbaar blijft.

