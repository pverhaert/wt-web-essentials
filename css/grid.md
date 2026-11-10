---
title: Grid (Bootstrap)
---

# Grid (Bootstrap)

Met Flexbox kan je al krachtige éénrichtingslay-outs bouwen, maar voor een volledige webpagina met meerschalende kolommen is zelf alle breedtes en breekpunten uitschrijven vaak veel werk. Een <dfn title="Een kant-en-klaar CSS-stijlblad met voorgedefinieerde klassen om pagina's snel in rijen en kolommen te verdelen">CSS-gridsysteem</dfn> neemt dat repeterende rekenwerk uit handen. In dit hoofdstuk werk je praktisch met het **12-koloms gridsysteem van Bootstrap 5.3.8**: je leert de juiste bestanden koppelen, waarom een reboot-stijlblad noodzakelijk is en hoe je met enkele HTML-klassen vlot responsieve indelingen bouwt voor smartphone, tablet en desktop.

::: tip Oefenen in de interactieve speeltuin
Een gridsysteem begrijp je het snelst door live te experimenteren met rijen, kolommen en schermbreedtes. Gebruik tijdens het doornemen van dit hoofdstuk zeker de interactieve webapp:
[ITF Bootstrap 5 Playground](https://itf-bs5-playground.netlify.app/)
Hier test je de werking van containers, kolommen en responsieve breekpunten visueel uit zonder eerst een volledig project op te zetten.
:::

## Leerdoelen

Na dit hoofdstuk kan je:

- Uitleggen waarom `bootstrap-reboot.min.css` en `bootstrap-grid.min.css` samen worden ingeladen en wat hun afzonderlijke rol is
- Bootstrap 5.3.8 centraal importeren in je stylesheet via `@import` en het verschil met `<link>` in HTML toelichten
- De werking van het 12-koloms gridsysteem en de 6 responsieve breekpunten toelichten
- Een geldige gridstructuur opbouwen door containers, rijen en kolommen correct te nesten
- Responsieve kolomindelingen en tussenruimtes (*gutters*) aanmaken voor mobiel, tablet en desktop
- Ingebouwde flexbox- en spacing-hulpmiddelen binnen `bootstrap-grid.min.css` toepassen voor uitlijning en ordening

## Bootstrap 5.3.8 koppelen (Reboot + Grid)

Bootstrap staat bekend als een compleet CSS-framework met kant-en-klare knoppen, navigatiebalken en kleurthema's. In deze cursus gebruiken we bewust **niet** het volledige `bootstrap.min.css`-bestand. We willen immers dat jij jouw eigen visuele stijl (kleuren, lettertypes, randen en kaarten) zelf ontwerpt in CSS.

Daarom laden we uitsluitend twee lichte deelbestanden van Bootstrap in via een <abbr title="Content Delivery Network: een gedistribueerd netwerk van servers voor snellere bestandslevering">CDN</abbr> zoals [cdnjs.com/libraries/bootstrap](https://cdnjs.com/libraries/bootstrap) (versie **5.3.8**):

1. `bootstrap-reboot.min.css`
2. `bootstrap-grid.min.css`

### Waarom is `bootstrap-reboot.min.css` nodig?

Elke webbrowser (Chrome, Firefox, Safari, Edge) hanteert van nature net iets andere standaardmarges, lettergroottes en afmetingen voor HTML-elementen. Bovendien staat `box-sizing` standaard op `content-box`, wat tot onverwachte breedteberekeningen leidt zodra je padding en randen toevoegt.

<dfn title="Een compact basisstijlblad van Bootstrap dat browser-inconsistenties gladstrijkt en een uniforme startbasis biedt voor alle HTML-elementen">Bootstrap Reboot</dfn> trekt die browser-afwijkingen direct recht voordat je layout wordt getekend:
- Het schakelt `box-sizing: border-box` globaal in, zodat het gridsysteem exacte percentages kan berekenen.
- Het verwijdert de standaard buitenmarge op `<body>` en stelt meteen een moderne systeemfont en regelafstand in.
- Het geeft koppen, alinea's, lijsten en tabellen in elke browser dezelfde voorspelbare marges en basisopmaak.

Zonder Reboot kunnen onzichtbare browsermarges jouw kolommen uit balans brengen of voor ongewenste horizontale schuifbalken zorgen.

::: tip Geen eigen resetter meer nodig
Omdat `bootstrap-reboot.min.css` deze basis al verzorgt, hoef je in je eigen `stijl.css` **geen** `* { box-sizing: border-box; margin: 0; padding: 0; }` resetter meer te schrijven. Daarnaast krijg je op `body` automatisch een systeemfont, regelafstand en `margin: 0` mee.

**Opmerking:** Wil je voor jouw ontwerp liever een ander lettertype gebruiken (zoals een Google Font), dan kun je het basisfont van Bootstrap uiteraard nog steeds eenvoudig overschrijven door zelf `font-family` in te stellen op `body` in `stijl.css`.
:::

### Wat zit er wel en niet in `bootstrap-grid.min.css`?

Het bestand `bootstrap-grid.min.css` is speciaal afgeslankt tot alles wat met **indeling, plaatsing en ruimteverdeling** te maken heeft. Je hoeft de interne CSS-code van dit bestand niet te kennen, maar je moet wel weten welke hulpmiddelen je eruit kunt aanspreken in je HTML:

| Onderdeel | Beschikbare klassen | Wat mag je zelf nog schrijven in `stijl.css`? |
|---|---|---|
| **Containers** | `.container`, `.container-fluid`, `.container-{breekpunt}` | Achtergrondkleuren en extra verticale opvulling |
| **12-koloms raster** | `.row`, `.col`, `.col-*`, `.row-cols-*` | Stijl van de inhoud binnen de kolommen |
| **Tussenruimte (Gutters)** | `.g-*`, `.gx-*`, `.gy-*` (`0` tot `5`) | Extra randen of scheidingslijnen op kaartcomponenten |
| **Verschuiven & volgorde** | `.offset-*`, `.order-*` | Positie van losse badges of decoratie |
| **Flexbox-uitlijning** | `.d-flex`, `.flex-*`, `.justify-content-*`, `.align-items-*` | Kleuraccenten, borders en afgeronde hoeken |
| **Marge & opvulling** | `.m-*`, `.p-*`, `.mt-*`, `.mb-*`, `.mx-auto`, `.gap-*` | Specifieke huisstijlspatiëring en typografie |

::: warning Wat zit er NIET in `bootstrap-grid.min.css`?
Klassen voor kleuren (zoals `.bg-primary` of `.text-danger`), randen (`.border`), tekstuitlijning (`.text-center`) of complete UI-componenten (zoals `.btn`, `.card` of `.navbar`) zitten **niet** in dit bestand. Alles wat met kleur, typografie en decoratie te maken heeft, schrijf je gewoon zelf in `stijl.css`.
:::

### De juiste koppelvolgorde: `@import` in `stijl.css` (aanbevolen)

Net zoals je in het hoofdstuk [Webfonts en Iconen](/css/webfonts) zag, is het voor websites met meerdere pagina's en schoolprojecten veel handiger om externe stylesheets centraal via `@import` bovenaan in `stijl.css` te koppelen:

```css
/* Verplicht helemaal bovenaan in stijl.css (vóór alle andere CSS-regels) */
@import url("https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.8/css/bootstrap-reboot.min.css");
@import url("https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.8/css/bootstrap-grid.min.css");
```

In elke HTML-pagina van je website volstaat daarna één enkele `<link>`-tag in `<head>`:

```html
<link rel="stylesheet" href="stijl.css">
```

Dit biedt twee grote voordelen:
- **Centraal beheer (DRY):** Bestaat je site uit 10 HTML-pagina's en verschijnt er een nieuwe versie van Bootstrap (bijvoorbeeld `5.3.9`), dan pas je slechts één versienummer in `stijl.css` aan en werkt je hele website meteen bij.
- **Vaste cascade-volgorde:** Omdat `@import` verplicht op de allereerste regels van `stijl.css` staat (nog vóór al je eigen stijlregels), laadt de browser eerst *Reboot*, daarna *Grid* en hebben al jouw eigen stijlregels daaronder via de <dfn title="De volgorde en regels waarmee browsers bepalen welke CSS-stijlregel voorrang krijgt">Cascade</dfn> voorrang.

::: info Alternatief: koppelen via `<link>` in HTML (maximale laadsnelheid)
Op grote, professionele productiewebsites kiest men soms voor drie losse `<link>`-tags rechtstreeks in `<head>` (in dezelfde volgorde: Reboot ➔ Grid ➔ `stijl.css`). Zo kan de browser de bestanden parallel downloaden zonder eerst `stijl.css` te hoeven lezen (geen netwerk-waterval) en kunnen beveiligingsattributen zoals `integrity` worden toegevoegd. Voor onze oefeningen en projecten weegt het gemak van centraal beheer via `@import` in `stijl.css` echter het zwaarst.
:::

## De drie bouwstenen: Container, Row en Column

Een Bootstrap-layout steunt altijd op drie vaste lagen die strak in elkaar genest worden:

```text
.container (of .container-fluid)  ➔  .row  ➔  .col-*
```

1. **Container (`.container` of `.container-fluid`):**
   De buitenste verpakking van een sectie of pagina.
   - `.container` centreert je inhoud automatisch in het midden van het scherm met een responsieve maximale breedte en vaste zijdelingse opvulling (*padding*).
   - `.container-fluid` neemt altijd de volledige 100% breedte van het browservenster in, ongeacht hoe breed het scherm is.
2. **Row (`.row`):**
   De horizontale rij die jouw kolommen groepeert en op Flexbox gebaseerd is. Een `.row` gebruikt negatieve zijmarges om de binnenste kolomruimte exact te laten aansluiten op de rand van de container.
3. **Column (`.col` of `.col-*`):**
   De werkelijke vakken waarin jouw inhoud staat. Een rij bestaat bij Bootstrap altijd uit **12 virtuele kolommen**.

::: danger Gouden regel bij het nesten
Plaats jouw HTML-inhoud (zoals koppen, afbeeldingen of kaarten) **altijd binnen een `.col-*`**, en plaats **nooit** rechtstreeks andere elementen als direct kind in een `.row`. Alleen kolomklassen horen rechtstreeks onder `.row`.
:::

### Gelijke kolommen vs. vaste breedtes

- **`.col` (zonder getal):** Bootstrap verdeelt de beschikbare 12 eenheden automatisch gelijkmatig over alle aanwezige kolommen in die rij (bijvoorbeeld 2 kolommen van elk 50%, of 3 kolommen van elk 33,33%).
- **`.col-1` tot `.col-12`:** Je kiest zelf hoeveel van de 12 eenheden een kolom inneemt. De som in één rij is idealiter 12 (bijvoorbeeld `.col-4` + `.col-8`).
- **Wat als de som groter is dan 12?** Zodra een volgende kolom niet meer bij op de lopende rij past (bijvoorbeeld `.col-7` + `.col-7`), schuift die kolom automatisch door naar een nieuwe regel binnen dezelfde `.row`.

## Live demonstratie: Het 12-koloms grid in actie

In dit eerste voorbeeld zie je hoe `.container`, `.row` en verschillende kolomklassen samenwerken op basis van Bootstrap 5.3.8. Verander gerust de getallen achter `.col-` in de HTML-editor en zie het effect onmiddellijk in de live weergave.

### Opbouw van de elementen

- `div.container`: De gecentreerde buitenste wrapper met vaste zijdelingse opvulling.
- `h1.pagina-titel`: De hoofdtitel van het overzicht in de Thomas More-huisstijl (`color: var(--blauw)` en `margin-bottom: 1rem`).
- `div.row.mb-3`: De horizontale rijen met een onderste buitenmarge via Bootstraps spacing-klasse `mb-3`.
- `div.col`, `div.col-4`, `div.col-8`, `div.col-7`: De daadwerkelijke grid-kolommen die bepalen hoeveel twaalfden van de rij elk blok inneemt.
- `div.blok` en `div.blok.blok-accent`: Eigen gestileerde binnenkaders in `stijl.css` met randen (`border: 2px solid var(--blauw)`), opvulling (`padding: 1rem`) en afgeronde hoeken (`border-radius: 6px`).

### Werking van de rijen in dit voorbeeld

| Rij | Toegepaste klassen | Verdeling binnen de 12 eenheden | Gedrag in het voorbeeld |
|---|---|---|---|
| **Rij 1** | 3x `.col` | Automatisch `4 + 4 + 4` | Drie gelijke kolommen van elk 33,33% breedte |
| **Rij 2** | `.col-4` + `.col-8` | Exact `4 + 8 = 12` | Smalle zijbalk links (1/3) en brede hoofdinhoud rechts (2/3) |
| **Rij 3** | `.col-7` + `.col-7` | `7 + 7 = 14` (> 12) | De tweede kolom past niet meer en zakt automatisch naar de volgende regel |

<CodeSandbox
  title="Basisprincipes van het 12-koloms grid (Bootstrap 5.3.8)"
  height="460px"
  initialTab="split"
  activeCodeTab="html"
  highlightHtml="10,13-16,19-21"
  highlightCss="2-3,19-26"
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bootstrap Grid Basis</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <div class="container">
    <h1 class="pagina-titel">Het 12-koloms grid in actie</h1>
    <!-- Rij 1: Drie gelijke kolommen -->
    <div class="row mb-3">
      <div class="col"><div class="blok">.col (1/3)</div></div>
      <div class="col"><div class="blok">.col (1/3)</div></div>
      <div class="col"><div class="blok">.col (1/3)</div></div>
    </div>
    <!-- Rij 2: Zijbalk en hoofdinhoud (4 + 8 = 12) -->
    <div class="row mb-3">
      <div class="col-4"><div class="blok">.col-4 (zijbalk)</div></div>
      <div class="col-8"><div class="blok blok-accent">.col-8 (hoofdinhoud)</div></div>
    </div>
    <!-- Rij 3: Automatische terugloop (> 12) -->
    <div class="row">
      <div class="col-7"><div class="blok">.col-7</div></div>
      <div class="col-7"><div class="blok">.col-7 (zakt naar nieuwe regel)</div></div>
    </div>
  </div>
</body>
</html>'
  css='/* Bootstrap 5.3.8 (Reboot + Grid) centraal importeren */
@import url("https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.8/css/bootstrap-reboot.min.css");
@import url("https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.8/css/bootstrap-grid.min.css");
:root {
  --oranje: #e87722;
  --blauw: #1e2d5a;
  --lichtgrijs: #f3f4f6;
}
body {
  background-color: var(--lichtgrijs);
  padding: 1.5rem 0;
}
.pagina-titel {
  font-size: 1.5rem;
  color: var(--blauw);
  margin-bottom: 1rem;
}
/* Eigen opmaak voor de grid-blokken */
.blok {
  background-color: #ffffff;
  border: 2px solid var(--blauw);
  border-radius: 6px;
  padding: 1rem;
  text-align: center;
  font-weight: 600;
}
.blok-accent {
  border-color: var(--oranje);
  color: var(--oranje);
}'
  js=''
/>

## Responsieve breekpunten (Mobile-First)

Op een smartphone lees je teksten het prettigst in één brede kolom onder elkaar, terwijl er op een laptop voldoende plaats is voor drie kolommen naast elkaar. Bootstrap maakt dit eenvoudig met zes vaste <dfn title="Een vooraf gedefinieerde schermbreedte vanaf waar een aangepaste kolomverdeling actief wordt">breekpunten</dfn> (*breakpoints*):

| Breekpunt | Klassenotatie | Schermbreedte | Max. breedte `.container` | Typisch apparaat |
|---|---|---|---|---|
| Extra small | `.col-*` *(geen infix)* | `< 576px` | `100%` | Smartphone (staand) |
| Small | `.col-sm-*` | `≥ 576px` | `540px` | Smartphone (liggend) |
| Medium | `.col-md-*` | `≥ 768px` | `720px` | Tablet |
| Large | `.col-lg-*` | `≥ 992px` | `960px` | Laptop en kleine desktop |
| Extra large | `.col-xl-*` | `≥ 1200px` | `1140px` | Standaard desktopmonitor |
| Extra extra large | `.col-xxl-*` | `≥ 1400px` | `1320px` | Grote breedbeeldmonitor |

### Klassen stapelen van smal naar breed

Bootstrap werkt volgens het **mobile-first principe**. Een klasse zoals `.col-md-6` betekent: *"neem 6 van de 12 kolommen in vanaf `768px` en alle grotere schermen daarboven, tenzij een groter breekpunt dit later overschrijft"*.

Door meerdere breekpunten op één kolom te combineren (bijvoorbeeld `class="col-12 col-md-6 col-lg-4"`), past de lay-out zich volledig automatisch aan:
- **Smartphone (`< 768px`):** `col-12` is actief ➔ kaarten staan onder elkaar (100% breed).
- **Tablet (`≥ 768px`):** `col-md-6` overschrijft `col-12` ➔ 2 kaarten naast elkaar (50% breed).
- **Laptop (`≥ 992px`):** `col-lg-4` overschrijft `col-md-6` ➔ 3 kaarten naast elkaar (33,33% breed).

## Live demonstratie: Responsieve kaartenreeks

In het onderstaande voorbeeld schakelen drie opleidingskaarten automatisch om per schermgrootte. Sleep de verticale scheidingsbalk in het midden van de sandbox naar links en rechts om het resultaatvenster smaller en breder te maken (of open het voorbeeld in een nieuw tabblad om alle breekpunten tot desktopbreedte te testen).

### Opbouw van de elementen

- `div.container`: Centreert het volledige kaartenoverzicht op bredere schermen.
- `div.row.g-3`: De rij waarin alle kaarten zitten, voorzien van een uniforme tussenruimte (`g-3`) zowel horizontaal als verticaal.
- `div.col-12.col-md-6.col-lg-4`: De eerste twee kaarten schalen mee van 1 kolom op mobiel naar 2 naast elkaar op tablet en 3 op laptop.
- `div.col-12.col-md-12.col-lg-4`: De derde kaart neemt op tablet bewust de volle breedte (`col-md-12`) in onder de eerste twee kaarten, zodat er geen lelijke lege plek naast overblijft.
- `article.opleiding-kaart`: De inhoudelijke kaart met eigen witte achtergrond, oranje bovenrand en `height: 100%` zodat alle kaarten op dezelfde rij even hoog zijn.

### Trapsgewijze werking per breekpunt

| Weergave | Schermbreedte | Actieve klassen | Zichtbare indeling |
|---|---|---|---|
| **Mobiel** | `< 768px` | `.col-12` op alle drie de kaarten | 3 kaarten netjes onder elkaar (1 kolom) |
| **Tablet** | `768px` tot `991px` | `.col-md-6`, `.col-md-6`, `.col-md-12` | Kaart 1 & 2 naast elkaar, kaart 3 over de volle breedte eronder |
| **Desktop** | `≥ 992px` | `.col-lg-4` op alle drie de kaarten | Alle 3 de kaarten gelijkwaardig naast elkaar |

<CodeSandbox
  title="Responsieve kaartenreeks van mobiel naar desktop"
  height="480px"
  initialTab="split"
  activeCodeTab="html"
  highlightHtml="13,14,20,26"
  highlightCss="2-3,17-24"
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Responsieve Kolommen</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <div class="container">
    <h1 class="sectie-titel">Opleidingen Thomas More Campus Geel</h1>
    <!-- 1 kolom op mobiel, 2+1 op tablet (md), 3 naast elkaar op laptop (lg) -->
    <div class="row g-3">
      <div class="col-12 col-md-6 col-lg-4">
        <article class="opleiding-kaart">
          <h2>App &amp; Web</h2>
          <p>Bouw moderne websites en webapplicaties vanaf de basis.</p>
        </article>
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <article class="opleiding-kaart">
          <h2>Cloud &amp; Cyber</h2>
          <p>Beheer netwerken en beveilig bedrijfskritische systemen.</p>
        </article>
      </div>
      <div class="col-12 col-md-12 col-lg-4">
        <article class="opleiding-kaart">
          <h2>AI &amp; Data</h2>
          <p>Analyseer datasets en bouw slimme modellen.</p>
        </article>
      </div>
    </div>
  </div>
</body>
</html>'
  css='/* Bootstrap 5.3.8 (Reboot + Grid) centraal importeren */
@import url("https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.8/css/bootstrap-reboot.min.css");
@import url("https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.8/css/bootstrap-grid.min.css");
:root {
  --oranje: #e87722;
  --licht: #f8fafc;
}
body {
  background-color: var(--licht);
  padding: 1.5rem 0;
}
.sectie-titel {
  font-size: 1.4rem;
  margin-bottom: 1rem;
}
/* Eigen kaartstyling bovenop Bootstrap Grid */
.opleiding-kaart {
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-top: 4px solid var(--oranje);
  border-radius: 8px;
  padding: 1.25rem;
  height: 100%;
}
.opleiding-kaart h2 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}'
  js=''
/>

## Praktische extra's in `bootstrap-grid.min.css`

Naast de basisverdeling in 12 kolommen bevat `bootstrap-grid.min.css` nog enkele tijdbesparende hulpmiddelen die je in bijna elk project zult inzetten.

### 1. Tussenruimte regelen met gutters (`g-*`, `gx-*`, `gy-*`)

De <dfn title="De horizontale en verticale tussenruimte tussen kolommen in een Bootstrap-rij">gutter</dfn> is de ruimte tussen twee aanliggende kolommen. Je stelt deze ruimte rechtstreeks op de `.row` in met een schaal van `0` (geen tussenruimte) tot `5` (grote tussenruimte):

- `.g-3`: past zowel horizontaal als verticaal gelijke tussenruimte toe.
- `.gx-4`: vergroot enkel de horizontale ruimte tussen kolommen naast elkaar.
- `.gy-2`: regelt enkel de verticale tussenruimte wanneer kolommen onder elkaar zakken.

### 2. Snel gelijke kolommen verdelen met `row-cols-*`

Wil je een overzicht met bijvoorbeeld 8 fotokaarten maken die op desktop steeds netjes per 4 op één rij staan? Dan hoef je niet op elke kaart `col-12 col-md-6 col-lg-3` te schrijven. Je plaatst de verdeling gewoon één keer op de `.row`:

- `class="row row-cols-1 row-cols-md-2 row-cols-lg-4"` op het ouderelement.
- Enkel `class="col"` op elk onderliggend kaartblok.

### 3. Verschuiven (`offset-*`) en volgorde aanpassen (`order-*`)

- **Kolommen verschuiven:** Met `.offset-md-2` sla je vanaf tabletbreedte 2 lege kolommen over aan de linkerkant van een element (handig om bijvoorbeeld een smal formulier van `.col-md-8` netjes te centreren via `.col-md-8.offset-md-2`).
- **Visuele volgorde wisselen:** Met `.order-1` tot `.order-5` (en responsieve varianten zoals `.order-lg-1`) verander je de volgorde waarin kolommen op het scherm getekend worden. Zo kan een belangrijke melding op mobiel bovenaan staan (`order-1`), terwijl hij op desktop rechts in een zijbalk verschijnt (`order-lg-2`).

### 4. Kolommen nesten en flexbox-utilities combineren

Je kunt een complexer rooster opbouwen door binnen een bestaande `.col-*` opnieuw een nieuwe `.row` te openen. Die geneste rij krijgt op zijn beurt weer 12 verse subkolommen binnen de breedte van zijn bovenliggende kolom. Daarnaast kan je voor elementen binnen je lay-out de ingebouwde flex-klassen gebruiken (zoals `.d-flex`, `.justify-content-between` en `.align-items-center`) en ruimte toevoegen met `.p-3` of `.mb-4`.

## Live demonstratie: Pagina-indeling met zijbalk, gutters en geneste kaarten

Dit praktijkvoorbeeld bundelt alle besproken technieken uit `bootstrap-grid.min.css`: een header met flex-uitlijning, een asymmetrische lay-out met hoofdinhoud en zijbalk, responsieve herordening via `order-*` en een geneste rij met `row-cols-*`.

### Opbouw van de elementen

- `header.kop-balk.d-flex.justify-content-between.align-items-center.mb-4.p-3`: Een navigatiebalk die gebruikmaakt van Bootstraps ingebouwde flex- en spacing-utilities, aangevuld met een oranje onderrand uit `stijl.css`.
- `div.row.g-4`: De hoofdrij met een ruime gutter (`g-4`) tussen de hoofdinhoud en de zijbalk.
- `main.col-12.col-lg-8.order-2.order-lg-1`: De hoofdinhoud neemt op desktop 8/12 in en staat daar links (`order-lg-1`), maar zakt op mobiel onder de meldingen (`order-2`).
- `div.row.row-cols-1.row-cols-sm-2.g-3.mt-2`: Een **geneste rij** binnen `<main>` die vier projectkaarten automatisch over 1 kolom (smal) of 2 kolommen (vanaf `sm`) verdeelt.
- `aside.col-12.col-lg-4.order-1.order-lg-2`: De zijbalk neemt op desktop 4/12 rechts in, maar staat op mobiel direct bovenaan.

### Gebruikte grid-klassen in dit overzicht

| Element | Gebruikte Bootstrap-klasse(n) | Effect in de lay-out |
|---|---|---|
| `header.kop-balk` | `.d-flex .justify-content-between .align-items-center` | Plaatst titel links en versiebadge rechts op één gecentreerde lijn |
| `div.row` (buitenste) | `.g-4` | Creëert royale horizontale en verticale tussenruimte |
| `main` & `aside` | `.order-2 .order-lg-1` / `.order-1 .order-lg-2` | Zet meldingen bovenaan op mobiel en rechts op desktop |
| `div.row` (binnenste) | `.row-cols-1 .row-cols-sm-2 .g-3` | Genest raster dat automatisch 1 of 2 kaarten naast elkaar zet |

<CodeSandbox
  title="Praktische lay-out met zijbalk, gutters en geneste kaarten"
  height="520px"
  initialTab="split"
  activeCodeTab="html"
  highlightHtml="11,15,17,21,30"
  highlightCss="2-3,14-18,33-39,48-55"
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Genest Grid en Utilities</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <div class="container">
    <header class="kop-balk d-flex justify-content-between align-items-center mb-4 p-3">
      <h1 class="merknaam">Campus Geel Portaal</h1>
      <span class="badge-label">Bootstrap 5.3.8</span>
    </header>
    <div class="row g-4">
      <!-- Hoofdgedeelte (8/12 op desktop, als tweede op mobiel via order) -->
      <main class="col-12 col-lg-8 order-2 order-lg-1">
        <div class="paneel">
          <h2>Recente projecten</h2>
          <!-- Geneste rij met row-cols -->
          <div class="row row-cols-1 row-cols-sm-2 g-3 mt-2">
            <div class="col"><div class="subkaart">Project A</div></div>
            <div class="col"><div class="subkaart">Project B</div></div>
            <div class="col"><div class="subkaart">Project C</div></div>
            <div class="col"><div class="subkaart">Project D</div></div>
          </div>
        </div>
      </main>
      <!-- Zijbalk (4/12 op desktop, als eerste op mobiel via order) -->
      <aside class="col-12 col-lg-4 order-1 order-lg-2">
        <div class="paneel paneel-zijbalk">
          <h2>Meldingen</h2>
          <p>Op mobiel staat deze zijbalk bovenaan dankzij order-1.</p>
        </div>
      </aside>
    </div>
  </div>
</body>
</html>'
  css='/* Bootstrap 5.3.8 (Reboot + Grid) centraal importeren */
@import url("https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.8/css/bootstrap-reboot.min.css");
@import url("https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.8/css/bootstrap-grid.min.css");
:root {
  --oranje: #e87722;
  --blauw: #1e2d5a;
  --licht: #f1f5f9;
}
body {
  background-color: var(--licht);
  padding: 1.5rem 0;
}
/* Header en badges (kleuren staan in eigen CSS) */
.kop-balk {
  background-color: #ffffff;
  border-radius: 8px;
  border-bottom: 3px solid var(--oranje);
}
.merknaam {
  font-size: 1.25rem;
  color: var(--blauw);
  margin-bottom: 0;
}
.badge-label {
  background-color: var(--oranje);
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.25rem 0.65rem;
  border-radius: 4px;
}
/* Panelen en geneste subkaarten */
.paneel {
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 1.25rem;
  height: 100%;
}
.paneel h2 {
  font-size: 1.15rem;
  color: var(--blauw);
  margin-bottom: 0.5rem;
}
.paneel-zijbalk {
  border-left: 4px solid var(--oranje);
}
.subkaart {
  background-color: var(--licht);
  border: 1px solid #94a3b8;
  border-radius: 6px;
  padding: 1rem;
  text-align: center;
  font-weight: 600;
}'
  js=''
/>

<PageSummary>

### Syntaxis in een oogopslag

| Wat | Hoe | Voorbeeld |
|---|---|---|
| Gecentreerde wrapper | `.container` of `.container-fluid` | `<div class="container">` |
| Rij voor kolommen | `.row` | `<div class="row">` |
| Gelijke kolommen | `.col` | `<div class="col">...</div>` |
| Vaste kolombreedte (1-12) | `.col-{1..12}` | `<div class="col-4">...</div>` |
| Responsieve kolombreedte | `.col-{sm\|md\|lg\|xl\|xxl}-{1..12}` | `<div class="col-12 col-md-6 col-lg-4">` |
| Aantal kolommen op rij | `.row-cols-{breekpunt}-{aantal}` | `<div class="row row-cols-1 row-cols-md-3">` |
| Tussenruimte (gutters) | `.g-{0..5}`, `.gx-*`, `.gy-*` | `<div class="row g-4">` |
| Verschuiven & volgorde | `.offset-*` / `.order-*` | `<div class="col-md-8 offset-md-2">` |
| Flex & spacing in grid | `.d-flex`, `.justify-content-*`, `.m-*`, `.p-*` | `<header class="d-flex justify-content-between p-3">` |

### Regels en naamgeving

- **Volgorde in `stijl.css`:** Plaats de `@import`-regels (`bootstrap-reboot.min.css` eerst, daarna `bootstrap-grid.min.css`) verplicht helemaal bovenaan in `stijl.css`, vóór al je eigen stijlregels.
- **Geen eigen resetter:** Schrijf naast `bootstrap-reboot.min.css` geen `* { box-sizing: border-box; margin: 0; padding: 0; }` meer; Reboot verzorgt dit al.
- **Vaste nesting:** Volg strikt de structuur `.container` (of `.container-fluid`) ➔ `.row` ➔ `.col-*`.
- **Alleen kolommen in `.row`:** Plaats nooit tekst, afbeeldingen of kaarten rechtstreeks als direct kind van `.row`, maar verpak ze altijd in een `.col-*`.
- **Som is 12:** Zorg dat de kolomgetallen binnen één logische rij optellen tot `12` (of gebruik een bewuste terugloop naar de volgende regel).
- **Mobile-first:** Begin met `.col-12` (of `.row-cols-1`) voor kleine schermen en voeg enkel grotere breekpunten toe (`md`, `lg`) waar de indeling wijzigt.

### Veelgemaakte fouten

- `@import`-regels onderaan of halverwege `stijl.css` plaatsen (na `body { ... }` of andere regels), waardoor de browser ze volledig negeert.
- `bootstrap-reboot.min.css` vergeten importeren, of erachter alsnog `* { margin: 0; padding: 0; }` zetten waardoor de nette basismarges van Reboot weer gewist worden.
- Kleurenklassen van de volledige Bootstrap proberen te gebruiken (zoals `.bg-primary` of `.btn`), terwijl `bootstrap-grid.min.css` enkel layoutklassen bevat.
- Een `.row` weglaten rond `.col-*`-elementen of inhoud rechtstreeks in `.row` plaatsen, waardoor negatieve marges en gutters stuklopen.
- Vergeten om in `<head>` eerst de meta-viewporttag (`<meta name="viewport" content="width=device-width, initial-scale=1.0">`) te plaatsen, waardoor breekpunten op smartphones niet werken.

### Tips voor beginners

- Test je kolomstructuur vooraf uit in de [ITF Bootstrap 5 Playground](https://itf-bs5-playground.netlify.app/) om het effect van elk breekpunt direct te zien.
- Gebruik de DevTools (<kbd>F12</kbd>) en schakel de *Device Toolbar* (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>M</kbd>) in om alle 6 breekpunten op verschillende schermbreedtes na te kijken.
- Geef kaartcomponenten binnen kolommen `height: 100%` in `stijl.css` zodat alle kaarten op dezelfde rij automatisch even hoog worden.
- Profiteer van het ingebouwde systeemfont van Reboot, of overschrijf `font-family` op `body` in `stijl.css` zodra je een eigen lettertype (zoals een Google Font) wilt gebruiken.

</PageSummary>

## Oefeningen

### Oefening 1: Bootstrap 5.3.8 koppelen en verhoudingen testen

In deze oefening zet je een nieuw project op in PhpStorm waarin je Bootstrap Reboot en Grid centraal via `stijl.css` importeert.

1. Maak een nieuwe projectmap aan genaamd `bootstrap-grid-oefening` met een `index.html` en een bestand `css/stijl.css`.
2. Surf naar [cdnjs.com/libraries/bootstrap](https://cdnjs.com/libraries/bootstrap), selecteer versie **5.3.8** en kopieer de URL's voor `bootstrap-reboot.min.css` en `bootstrap-grid.min.css`.
3. Plaats deze twee URL's als `@import url("...");` helemaal bovenaan in `css/stijl.css` (eerst *Reboot*, daarna *Grid*) en koppel in `index.html` enkel naar `<link rel="stylesheet" href="css/stijl.css">`.
4. Maak in `<body>` een `.container` aan met daarin drie aparte `.row`-blokken (met `mb-3` tussenruimte):
   - Rij 1: 4 gelijke kolommen met `.col`.
   - Rij 2: 2 ongelijke kolommen met de verhouding `3` en `9`.
   - Rij 3: 3 kolommen met `.col-5`, `.col-4` en `.col-3`.
5. Geef de inhoudsblokken in `css/stijl.css` een herkenbare rand, achtergrondkleur en padding, en bekijk het resultaat via `live-server`.

### Oefening 2: Responsieve campusgids (Thomas More Campus Geel)

Bouw een overzichtspagina voor nieuwe studenten op **Thomas More Campus Geel (Kleinhoefstraat 4, 2440 Geel)**.

1. Maak een `<main class="container">` met een titel `<h1>Campusgids Geel</h1>`.
2. Maak een `.row` met tussenruimte `g-4` en plaats daarin **6 `<article>`-kaarten** over faciliteiten op de campus (bijvoorbeeld: *Bibliotheek*, *Studentenrestaurant*, *IT Factory Labo's*, *Sportcomplex*, *Onthaal* en *Parking*).
3. Stel de kolomklassen zo in dat de kaarten zich responsief gedragen:
   - Op smartphones (`< 576px`): 1 kaart per rij (volle breedte).
   - Vanaf liggende smartphones of kleine tablets (`sm`): 2 kaarten naast elkaar.
   - Vanaf laptops (`lg`): 3 kaarten naast elkaar.
4. Zorg in `stijl.css` dat alle kaarten binnen dezelfde rij even hoog zijn (`height: 100%`) en werk af met een gekleurde bovenrand (`border-top`) en afgeronde hoeken.
5. Open de DevTools (<kbd>F12</kbd>) in je browser en controleer via de responsieve weergave of de omschakeling bij `576px` en `992px` foutloos verloopt.

### Oefening 3: Pagina met zijbalk, geneste kolommen en volgorde-wissel

Bouw een nieuwsportaal waarbij de weergave verandert tussen smartphone en desktop, en vergelijk je resultaat in de interactieve speeltuin.

1. Maak een `.container` met een `<header>` die via Bootstraps flex-utilities (`.d-flex .justify-content-between .align-items-center`) de titel links en een datum rechts plaatst.
2. Maak een hoofdrij `.row.g-4` met twee secties:
   - Een `<section>` voor de hoofdinhoud: volle breedte op mobiel, `8` kolommen op desktop (`lg`). Plaats deze sectie op mobiel als tweede (`order-2`) en op desktop als eerste (`order-lg-1`).
   - Een `<aside>` voor belangrijk campusnieuws: volle breedte op mobiel, `4` kolommen op desktop (`lg`). Plaats deze sectie op mobiel bovenaan (`order-1`) en op desktop rechts (`order-lg-2`).
3. Plaats binnen de `<section>` (hoofdinhoud) een **geneste rij** met `.row.row-cols-1.row-cols-md-2.g-3` waarin je vier korte nieuwsberichten in `.col`-blokken zet.
4. Test deze structuur ook eens uit in de [ITF Bootstrap 5 Playground](https://itf-bs5-playground.netlify.app/) om te controleren hoe de geneste rijen en breekpunten visueel opbouwen.
