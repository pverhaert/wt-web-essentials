---
title: Transities
---

# Transities

In het hoofdstuk over [2D Transformaties](./2d-transformaties) heb je geleerd hoe je elementen roteert, schaalt en verplaatst. Wanneer je met CSS de opmaak of transformatie van een element aanpast bij een interactie, zoals een kleurwissel of schaling bij een `:hover`-toestand, gebeurt die overgang standaard van de ene op de andere milliseconde. De browser schakelt de nieuwe stijl direct in, wat er vaak houterig en abrupt uitziet. Met <dfn title="Een CSS-mechanisme waarmee veranderingen in stijleigenschappen geleidelijk en vloeiend over een instelbare tijdsduur worden weergegeven">CSS-transities</dfn> laat je die stijlwijzigingen soepel in elkaar overvloeien. Door eigenschappen zoals achtergrondkleuren, afmetingen of 2D-transformaties geleidelijk te animeren, voelt een website levendiger, tastbaarder en professioneler aan voor de bezoeker.

## Leerdoelen

Na dit hoofdstuk kan je:

- Uitleggen wat een CSS-transitie is en hoe deze reageert op toestandswijzigingen zoals `:hover` en `:focus-visible`
- De overgangsduur instellen met `transition-duration` in seconden (`s`) of milliseconden (`ms`)
- Selectief bepalen welke stijlen vloeiend veranderen via `transition-property`
- Het snelheidsverloop sturen met `transition-timing-function` (`ease`, `linear`, `ease-in`, `ease-out`, `ease-in-out`)
- Een startvertraging inbouwen met `transition-delay`
- De samengestelde `transition`-shorthand foutloos en gestructureerd toepassen
- Beargumenteren waarom een transitie op het basiselement moet staan en niet enkel op de interactietoestand
- Interacties via een ouder-element opbouwen
- Rekening houden met toegankelijkheid via de media feature `prefers-reduced-motion`

## Wat is een transitie?

Een transitie is een geleidelijke overgang tussen twee verschillende stijltoestanden van hetzelfde HTML-element. In het vorige hoofdstuk zag je bijvoorbeeld hoe een knop bij `:hover` kan vergroten met `transform: scale(1.1)`. Zonder transitie verspringt die knop bij het aanwijzen met de muis onmiddellijk naar zijn grotere formaat. Met een transitie berekent de browser automatisch alle tussenliggende schaalstappen en kleurschakeringen over een door jou gekozen tijdsduur, bijvoorbeeld 300 milliseconden.

Een transitie treedt op wanneer een element van toestand verandert. Veelvoorkomende interactietoestanden zijn:

- `:hover`: wanneer de bezoeker met de muisaanwijzer over het element beweegt
- `:focus` en `:focus-visible`: wanneer een invoerveld of knop focus krijgt via het toetsenbord of een muisklik
- `:active`: op het exacte moment dat een gebruiker een knop of link ingedrukt houdt
- Toestanden die dynamisch wisselen doordat een klasse wordt toegevoegd of verwijderd

### Welke eigenschappen kan je animeren?

Niet elke CSS-eigenschap leent zich voor een vloeiende overgang. Een browser kan enkel vloeiend tussen twee waarden overvloeien als er een wiskundige tussenstap mogelijk is:

- **Wel animeerbaar:** eigenschappen met meetbare getallen, lengtes, percentages of kleuren (zoals `background-color`, `color`, `opacity`, `transform`, `box-shadow`, `border-color`, `width`, `height`, `padding` en `margin`).
- **Niet animeerbaar:** eigenschappen met binaire of discrete waarden (zoals `display: none` naar `display: block`, of het wisselen van `font-family`). De browser kan immers geen wiskundig gemiddelde berekenen tussen een blokweergave en onzichtbaarheid.

::: tip Prestaties op mobiele apparaten
Het soepelst animeren eigenschappen die de grafische processor (<abbr title="Graphics Processing Unit: de grafische chip van een computer of smartphone">GPU</abbr>) rechtstreeks kan berekenen zonder de hele pagina opnieuw in te delen. De eigenschappen `transform` en `opacity` presteren veruit het best. Eigenschappen zoals `width`, `height` of `margin` dwingen de browser om bij elke frame de positie van alle omringende elementen opnieuw te berekenen, wat op oudere smartphones kan leiden tot lichte haperingen.
:::

## Direct vergelijken: met en zonder transitie

In het onderstaande interactieve voorbeeld zie je twee knoppen. Beweeg je muis over beide knoppen om het visuele verschil tussen een abrupte stijlverspringing en een vloeiende transitie zelf te ervaren:

<CodeSandbox
  title="Vergelijking: met en zonder CSS-transitie"
  height="420px"
  initialTab="split"
  activeCodeTab="css"
  highlightHtml=""
  highlightCss="19,25"
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vergelijking transities</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <div class="knoppen-groep">
    <!-- Knop 1 wisselt direct zonder overgang -->
    <button class="knop knop-direct">Zonder transitie</button>
    <!-- Knop 2 vloeit soepel over -->
    <button class="knop knop-vloeiend">Met transitie</button>
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
}
/* Knoppengroep */
.knoppen-groep {
  display: flex;
  gap: 1.5rem;
}
/* Basisopmaak voor beide knoppen */
.knop {
  font-size: 1rem;
  font-weight: 600;
  padding: 0.85rem 1.6rem;
  color: #ffffff;
  background-color: #0056b3;
  border: 2px solid #0056b3;
  border-radius: 0.5rem;
  cursor: pointer;
}
/* Knop 1: directe sprong bij hover */
.knop-direct:hover {
  background-color: #e87722;
  border-color: #e87722;
}
/* Knop 2: vloeiende overgang van 300 milliseconden */
.knop-vloeiend {
  transition: background-color 300ms ease, border-color 300ms ease;
}
.knop-vloeiend:hover {
  background-color: #e87722;
  border-color: #e87722;
}'
  js=''
/>

## De vier transitie-eigenschappen

Een complete transitie wordt gestuurd door vier afzonderlijke CSS-eigenschappen.

### 1. transition-property

Met `transition-property` vertel je de browser welke stijleigenschap hij geleidelijk moet veranderen.

```css
.kaart {
  transition-property: background-color;
}
```

Als je meerdere eigenschappen tegelijk wilt aanpassen, scheid je de namen met een komma:

```css
.kaart {
  transition-property: background-color, transform, box-shadow;
}
```

Het sleutelwoord `all` zorgt ervoor dat de browser elke animeerbare eigenschap die verandert automatisch van een overgang voorziet:

```css
.kaart {
  transition-property: all;
}
```

::: warning Beperk het gebruik van `all`
Hoewel `all` erg handig lijkt, is het een goede gewoonte om uitsluitend de eigenschappen te benoemen die je effectief wilt animeren. Met `all` moet de browser bij elke interactie controleren of tientallen eigenschappen gewijzigd zijn. Bovendien loop je het risico dat eigenschappen die je later toevoegt ongewild mee gaan animeren.
:::

### 2. transition-duration

Met `transition-duration` bepaal je hoe lang de overgang duurt van begin tot einde. Je kan de tijd noteren in seconden (`s`) of milliseconden (`ms`):

```css
.knop {
  transition-duration: 0.3s;   /* 0.3 seconden */
}
.banner {
  transition-duration: 400ms;  /* 400 milliseconden */
}
```

Zonder `transition-duration` (of wanneer de waarde `0s` bedraagt) vindt er geen geleidelijke overgang plaats en verspringt de stijl onmiddellijk.

### 3. transition-timing-function

De <dfn title="Een wiskundige functie die bepaalt hoe de snelheid van een overgang varieert tussen het begin en het einde">timingfunctie</dfn> legt het snelheidsverloop van de animatie vast. Een overgang hoeft immers niet met een constante snelheid te bewegen; ze kan traag op gang komen, in het midden versnellen of zacht uitdoven.

De meest gebruikte ingebouwde sleutelwoorden zijn:

| Sleutelwoord | Werking | Toepassing |
|---|---|---|
| `ease` | Start gematigd, versnelt in het midden en vertraagt zacht op het einde (standaardwaarde). | Geschikt voor vrijwel alle algemene interacties. |
| `linear` | Beweegt met een constante, gelijkmatige snelheid van start tot finish. | Ideaal voor draaiende cirkels of mechanische verplaatsingen. |
| `ease-in` | Start heel traag en bouwt geleidelijk snelheid op tot het einde. | Geschikt voor elementen die het scherm verlaten. |
| `ease-out` | Schiet snel uit de startblokken en remt op het einde zachtjes af. | Perfect voor elementen die het scherm binnentreden of knoppen die direct moeten reageren op de gebruiker. |
| `ease-in-out` | Begint traag, versnelt in het centrum en eindigt opnieuw traag. | Natuurlijke beweging voor zwevende blokken of vouwpanelen. |
| `steps(n)` | Knipt de overgang op in een vast aantal discrete sprongen. | Nuttig voor getrapte tellers of retro sprite-animaties. |

Voor maximale controle kan je ook een eigen Bézier-kromme definiëren via `cubic-bezier(x1, y1, x2, y2)`. In de DevTools van Chrome of Firefox kan je op het icoontje naast de timingfunctie klikken om deze kromme visueel met handvatten af te stellen.

### 4. transition-delay

Met `transition-delay` stel je een wachttijd in alvorens de transitie effectief begint te lopen. Ook hier gebruik je seconden (`s`) of milliseconden (`ms`).

```css
.tooltip {
  /* De tooltip verschijnt pas nadat de bezoeker de muis 200 milliseconden stilhoudt */
  transition-delay: 200ms;
}
```

Standaard staat de vertraging op `0s`, waardoor de transitie onmiddellijk start zodra de interactie plaatsvindt.

## De samengestelde eigenschap: transition (shorthand)

In de praktijk schrijven webontwikkelaars zelden de vier afzonderlijke eigenschappen uit. Je combineert ze vrijwel altijd in één overzichtelijke regel via de `transition`-shorthand:

```css
/* Syntaxis van de shorthand: */
/* transition: eigenschap duur timingfunctie vertraging; */

.knop {
  transition: background-color 300ms ease 50ms;
}
```

Als je geen vertraging nodig hebt en tevreden bent met de standaard timingfunctie `ease`, volstaan de eigenschap en de duur:

```css
.knop {
  transition: background-color 300ms;
}
```

### De gouden regel voor tijdeenheden

In de shorthand staan soms twee tijdseenheden achter elkaar:

```css
.paneel {
  transition: transform 500ms ease 200ms;
}
```

In dat geval hanteert elke browser altijd dezelfde volgorde:
1. De **eerste tijdseenheid** is altijd de **overgangsduur** (`transition-duration`: 500ms).
2. De **tweede tijdseenheid** is altijd de **startvertraging** (`transition-delay`: 200ms).

### Meerdere eigenschappen met verschillende tijden combineren

Je kan aan één element meerdere transities tegelijk toewijzen door ze te scheiden met een komma:

```css
.kaart {
  transition:
    background-color 200ms ease,
    transform 350ms ease,
    box-shadow 350ms ease;
}
```

Hierdoor kan de achtergrondkleur razendsnel oplichten in 200 milliseconden, terwijl de kaart zelf wat rustiger omhoog beweegt over 350 milliseconden.

## Live demonstratie: timingfuncties en vertragingen

In het onderstaande voorbeeld zie je vier balken met identiek dezelfde afstand. Beweeg je muis over het kader om te zien hoe de timingfunctie en de vertraging de waargenomen snelheid en cadans van de beweging bepalen:

<CodeSandbox
  title="Demonstratie van timingfuncties en startvertraging"
  height="460px"
  initialTab="split"
  activeCodeTab="css"
  highlightHtml=""
  highlightCss="30,34,38,42"
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Timingfuncties en vertraging</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <div class="testbaan">
    <p class="toelichting">Beweeg je muis over dit kader:</p>
    <div class="spoor">
      <div class="loper loper-linear">linear</div>
    </div>
    <div class="spoor">
      <div class="loper loper-ease">ease</div>
    </div>
    <div class="spoor">
      <div class="loper loper-ease-in-out">ease-in-out</div>
    </div>
    <div class="spoor">
      <div class="loper loper-vertraagd">vertraagd (delay)</div>
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
  background-color: #eef2f5;
  padding: 1.5rem;
}
/* Testbaan kader */
.testbaan {
  width: 100%;
  max-width: 500px;
  background-color: #ffffff;
  border: 1px solid #ced4da;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.toelichting {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 1rem;
}
/* Afzonderlijke sporen */
.spoor {
  background-color: #f1f3f5;
  border-radius: 0.25rem;
  margin-bottom: 0.75rem;
  overflow: hidden;
}
/* Basisopmaak van de bewegende balken */
.loper {
  width: 110px;
  height: 36px;
  line-height: 36px;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: #ffffff;
  border-radius: 0.25rem;
}
/* Verschillende timingfuncties */
.loper-linear {
  background-color: #007acc;
  transition: transform 1.2s linear;
}
.loper-ease {
  background-color: #e87722;
  transition: transform 1.2s ease;
}
.loper-ease-in-out {
  background-color: #28a745;
  transition: transform 1.2s ease-in-out;
}
.loper-vertraagd {
  background-color: #6f42c1;
  transition: transform 1.2s ease-out 300ms;
}
/* Verplaatsing bij hover over het hele kader */
.testbaan:hover .loper {
  transform: translateX(260px);
}'
  js=''
/>

## De juiste plaats: basistoestand vs. hovertoestand

Een van de meest gemaakte beginnersfouten is het plaatsen van de `transition`-eigenschap op de interactietoestand zelf:

```css
/* FOUT: transitie staat in de hovertoestand */
.knop {
  background-color: #0056b3;
}
.knop:hover {
  background-color: #e87722;
  transition: background-color 300ms ease; /* Fout! */
}
```

### Wat gebeurt er als je dit doet?

1. **Heenreis (muis op de knop):** De browser ziet de hoverregel inclusief de transitie. De knop vloeit keurig in 300ms over naar oranje.
2. **Terugreis (muis verlaat de knop):** Zodra de muis van de knop glijdt, vervalt de `:hover`-status onmiddellijk. Omdat de transitie-instructie in dat hoverblok stond, verdwijnt ook de transitie zelf. Gevolg: de knop klapt in één fractie van een seconde abrupt terug naar blauw.

### De correcte regel

Plaats de `transition`-eigenschap **altijd op de basisklasse** van het element:

```css
/* GOED: transitie staat op de basistoestand */
.knop {
  background-color: #0056b3;
  transition: background-color 300ms ease; /* Blijft altijd actief */
}
.knop:hover {
  background-color: #e87722;
}
```

Omdat de basisklasse permanent van kracht blijft, animeert de knop nu zowel bij het betreden als bij het verlaten van het element mooi vloeiend.

## Interactie via een ouder-element

Vaak wil je dat een kindelement reageert wanneer de bezoeker over een grotere kaart of container beweegt. Denk aan een productkaart waarbij een knop oplicht zodra de bezoeker ergens binnen de kaart zweeft.

In dat geval koppel je de pseudoklasse `:hover` aan het ouder-element en richt je de stijlregel op het kind:

```css
/* Het kindelement heeft altijd de transitie */
.kaart .actieknop {
  background-color: #6c757d;
  color: #ffffff;
  transform: scale(1);
  transition: background-color 250ms ease, transform 250ms ease;
}

/* De hover activeert wanneer je over de KAART beweegt */
.kaart:hover .actieknop {
  background-color: #0056b3;
  transform: scale(1.05);
}
```

Hierdoor hoeft de bezoeker niet precies op de kleine knop te mikken; zodra de cursor het oppervlak van de kaart raakt, reageert de knop onmiddellijk.

## Praktijkvoorbeeld: een interactieve productkaart

In het onderstaande voorbeeld passen we alle geleerde concepten samen toe in een herkenbare component: een interactieve kaart met zweefeffect (*rising card*), een badge en een actieknop die simultaan reageren op de bezoeker:

<CodeSandbox
  title="Praktijkvoorbeeld: interactieve kaart met samengestelde transities"
  height="480px"
  initialTab="split"
  activeCodeTab="css"
  highlightHtml=""
  highlightCss="26,38,48,53"
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Interactieve kaart</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <article class="kaart">
    <span class="badge">Nieuw</span>
    <h2 class="kaart-titel">Web Essentials</h2>
    <p class="kaart-tekst">Leer moderne websites bouwen met semantische HTML5 en modulaire CSS3.</p>
    <a href="#" class="kaart-knop">Bekijk cursus</a>
  </article>
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
  background-color: #f0f4f8;
  padding: 1.5rem;
}
/* De productkaart */
.kaart {
  width: 100%;
  max-width: 320px;
  background-color: #ffffff;
  border: 1px solid #dcdfe3;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);
  transition: transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease;
}
/* Kaart tilt op bij hover */
.kaart:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: #0056b3;
}
/* Badge */
.badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #ffffff;
  background-color: #e87722;
  padding: 0.25rem 0.6rem;
  border-radius: 1rem;
  margin-bottom: 0.75rem;
  transition: transform 300ms ease;
}
.kaart:hover .badge {
  transform: scale(1.08);
}
/* Titel en tekst */
.kaart-titel {
  font-size: 1.35rem;
  color: #1a202c;
  margin-bottom: 0.5rem;
}
.kaart-tekst {
  font-size: 0.95rem;
  color: #4a5568;
  line-height: 1.5;
  margin-bottom: 1.25rem;
}
/* Knop */
.kaart-knop {
  display: inline-block;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffffff;
  background-color: #0056b3;
  padding: 0.6rem 1.2rem;
  border-radius: 0.375rem;
  transition: background-color 250ms ease, transform 250ms ease;
}
.kaart-knop:hover {
  background-color: #003d82;
  transform: translateX(4px);
}'
  js=''
/>

## Toegankelijkheid: prefers-reduced-motion

Niet elke bezoeker ervaart animaties en transities als aangenaam. Mensen met vestibulaire aandoeningen of evenwichtsstoornissen kunnen duizelig of misselijk worden van plotselinge of grote bewegingen op het scherm.

Moderne besturingssystemen (Windows, macOS, iOS en Android) bieden een instelling aan om animaties te minimaliseren. In CSS kan je die voorkeur opvangen via de media feature `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    transition-duration: 0.01ms !important;
  }
}
```

Met deze handige veiligheidsregel schakel je voor gebruikers met die voorkeur alle overbodige beweging uit, terwijl de visuele feedback (zoals de kleurverandering) nog steeds feilloos functioneert.

## Emmet-sneltoetsen in PhpStorm

In PhpStorm genereer je de eigenschappen voor transities in een handomdraai met Emmet:

| Emmet-opdracht | Resulterende CSS | Betekenis |
|---|---|---|
| `trs` + `TAB` | `transition: ;` | Samengestelde eigenschap |
| `trsp` + `TAB` | `transition-property: ;` | Te animeren eigenschap |
| `trsdu` + `TAB` | `transition-duration: ;` | Overgangsduur |
| `trstf` + `TAB` | `transition-timing-function: ;` | Timingfunctie |
| `trsde` + `TAB` | `transition-delay: ;` | Startvertraging |

<PageSummary>

### Syntaxis in een oogopslag

| Wat | Hoe | Voorbeeld |
|---|---|---|
| Samengestelde transitie | `transition: [prop] [duur] [timing] [delay];` | `transition: color 0.3s ease;` |
| Meerdere eigenschappen | Scheiden met een komma | `transition: color 0.2s, transform 0.3s;` |
| Overgangsduur | Waarde in `s` of `ms` | `transition-duration: 250ms;` |
| Snelheidscurve | `ease`, `linear`, `ease-in-out` | `transition-timing-function: ease-out;` |
| Startvertraging | Wachttijd voor aanvang | `transition-delay: 100ms;` |
| Selectieve eigenschap | Specifieke CSS-naam ipv `all` | `transition-property: background-color;` |

### Regels en naamgeving

- **Plaats de transitie altijd op de basisklasse:** Zo verloopt zowel de heenreis (naar hover) als de terugreis (terug naar normaal) mooi soepel.
- **Eerste tijdseenheid is altijd duur:** In de shorthand staat de duur (`duration`) altijd vóór de vertraging (`delay`).
- **Animeer selectief:** Vermijd `transition: all` op complexe pagina's om prestatieverlies op mobiele toestellen te voorkomen.
- **Kies voor snelle feedback:** Houd interactietijden bij knoppen en navigatie tussen 150ms en 350ms. Trager voelt traag en stroef aan voor de gebruiker.
- **Geef voorrang aan transform en opacity:** Deze eigenschappen worden direct door de grafische chip berekend zonder de pagina-indeling te verstoren.

### Veelgemaakte fouten

- **Transitie enkel op `:hover` plaatsen:** Hierdoor schiet het element bij het weghalen van de cursor abrupt terug naar zijn oorspronkelijke toestand.
- **De tijdseenheid vergeten:** Schrijven van `transition: 300` in plaats van `transition: 300ms` of `0.3s`. Zonder eenheid negeert de browser de declaratie volledig.
- **Tijdsvolgorde verwarren:** Denken dat de eerste tijdseenheid de vertraging is, terwijl het altijd de duur voorstelt.
- **Niet-animeerbare eigenschappen proberen te overvloeien:** Een transitie instellen op `display: none` naar `block`. Gebruik in de plaats `opacity` en `visibility`.

### Tips voor beginners

- **Gebruik de DevTools kromme-editor:** Inspecteer een element in de browser en klik op het kleine kromme-icoontje naast de timingfunctie om live met de versnelling te experimenteren.
- **Begin met 300ms ease:** Als vuistregel voor knoppen en hyperlinks levert `300ms ease` vrijwel altijd een prettig en natuurlijk resultaat op.
- **Combineer met lichte schaling:** Een subtiele `transform: scale(1.03)` gecombineerd met een schaduwovergang geeft een knop direct een tastbaar 3D-gevoel.

</PageSummary>

## Oefeningen

### Oefening 1: Interactieve actieknop (Basis)

Bouw een aantrekkelijke call-to-action knop voor een inschrijvingsformulier:

1. Geef de knop een donkerblauwe achtergrondkleur, witte tekst, royale padding en afgeronde hoeken (`border-radius`).
2. Zorg dat bij `:hover` de achtergrondkleur verandert naar Thomas More-oranje (`#e87722`) en dat de knop een fractie groter wordt via `transform: scale(1.05)`.
3. Voeg een transitie toe van 250 milliseconden met `ease-out`, zodat zowel de kleur als de schaling vloeiend overvloeien.
4. Zorg ervoor dat de knop ook bij het verlaten van de cursor even soepel terugkeert naar zijn oorspronkelijke toestand.

### Oefening 2: Navigatiemenu met geanimeerde onderlijn (Gemiddeld)

Maak een horizontale navigatiebalk met drie links (`Home`, `Opleidingen`, `Contact`):

1. Schakel de standaard tekstdecoratie van de links uit (`text-decoration: none`).
2. Maak een pseudo-element `::after` onder elke link met een hoogte van `3px`, een breedte van `0%` en een opvallende kleur.
3. Laat bij `:hover` op de link de breedte van het `::after`-streepje uitschuiven naar `100%`.
4. Stel een vloeiende transitie in van `300ms ease-in-out` op de `width`-eigenschap van het streepje.

### Oefening 3: Productkaart met zwevende schaduw en detailbadge (Uitdagend)

Ontwerp een component voor een opleidingskaart:

1. Bouw een kaart (`<article>`) met een titel, een korte beschrijving en een prijslabel (`<span class="prijs">`).
2. Geef de kaart een subtiele rand en een lichte standaardschaduw.
3. Laat de hele kaart bij `:hover` 8 pixels omhoog bewegen via `transform: translateY(-8px)` en voorzie een diepere, zachte schaduw (`box-shadow`).
4. Laat tegelijkertijd het prijslabel licht roteren met `transform: rotate(-4deg)` en een fellere achtergrondkleur aannemen.
5. Stel op de kaart een overgangsduur in van 350ms, en geef het prijslabel een kleine startvertraging van 50ms voor een speels, levendig effect.

