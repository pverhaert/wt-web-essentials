# AGENTS.md - Web Essentials Cursus

Dit bestand bevat instructies en richtlijnen voor AI-assistenten die helpen bij het schrijven en uitbreiden van de Web Essentials cursus.

---

## Projectidentiteit

**Naam:** Web Essentials
**Instelling:** Thomas More Hogeschool, IT Factory
**Campus:** Thomas More Campus Geel, Kleinhoefstraat 4, 2440 Geel (gebruik NOOIT Campus De Nayer)
**Doelgroep:** Eerstejaars studenten ICT, geen voorkennis verondersteld
**Taal:** Nederlands (Belgie)
**Platform:** VitePress, gehost op Netlify (https://wt-web-essentials.netlify.app)
**Repository:** https://github.com/pverhaert/wt-web-essentials

---

## Doel van de cursus

Web Essentials is een Nederlandstalige basiscursus HTML5 en CSS3 voor eerstejaars ICT-studenten. De cursus leidt studenten stap voor stap van een blanco pagina naar volwaardige, gestileerde en responsieve webpagina's. Naast HTML en CSS worden ook praktische tools behandeld zoals PhpStorm, Git en browser DevTools.

---

## Doelgroep in detail

- Leeftijd: 18-20 jaar, eerstejaars hogeschool
- Voorkennis: geen programmeer- of webontwikkelervaring verondersteld
- Taalvaardigheid: moedertaal of hoog niveau Nederlands
- Motivatie: gevarieerd (van weinig tot sterk gemotiveerd)
- Leeromgeving: blended learning (les op school + zelfstandig thuis)

---

## Schrijfstijl en Tone of Voice

### Algemene regels

- Schrijf altijd in correct, formeel maar toegankelijk Nederlands
- Gebruik de jij-vorm (niet "u", niet "jullie", niet "men")
- Vermijd jargon waar mogelijk; leg technische termen altijd meteen uit
- Houd zinnen kort en duidelijk
- Schrijf actief, niet passief ("Je voegt een klasse toe", niet "Een klasse wordt toegevoegd")
- Schrijf motiverend en aanmoedigend zonder overdreven te zijn
- Vermijd omslachtige omschrijvingen; wees direct

### Wat absoluut NIET mag

- Geen emoji's in cursusteksten
- Geen en-streepjes (--) of em-streepjes (---) als leestekens in lopende tekst
- Geen Engelse woorden als die een goede Nederlandse equivalent hebben
- Geen aannames over voorkennis die studenten niet hebben
- Geen zinnen die beginnen met "Uiteraard", "Zoals je weet", "Vanzelfsprekend" of vergelijkbare uitdrukkingen die voorkennis impliceren
- Geen samentrekkingen zoals "kan't" of "isn't" (dit is een Nederlandse cursus)
- Gebruik NOOIT "Campus De Nayer" of "Sint-Katelijne-Waver"; gebruik in alle voorbeelden en teksten altijd uitsluitend: Thomas More Campus Geel (Kleinhoefstraat 4, 2440 Geel)
- Maak zelf NOOIT nieuwe branches aan in Git
- Push zelf NOOIT naar GitHub (laat Git commits, branches en pushes altijd over aan de gebruiker)

### Engelstalige technische termen

Gebruik de Engelse term wanneer die de standaard is in de industrie, maar geef altijd een Nederlandse uitleg bij de eerste vermelding:

Goed: "De `border-radius`-eigenschap (de eigenschap voor afgeronde hoeken) ..."
Fout: "Geef de rand een border-radius."

---

## Werkwijze bij nieuwe hoofdstukken (Verplichte goedkeuring vooraf)

Voordat je start met het uitschrijven of programmeren van een nieuw cursushoofdstuk, presenteer je altijd eerst een voorstel aan de gebruiker:

1. **Gedetailleerd inhoudelijk overzicht:**
   - Geef altijd eerst een helder en gedetailleerd overzicht van wat de pagina gaat inhouden: de voorgestelde leerdoelen, de thematische tussenkopjes, de te behandelen theorie, welke interactieve `<CodeSandbox>`-voorbeelden er komen en welke praktische oefeningen worden voorzien.
   - Start **nooit** direct met programmeren of het schrijven van bestanden voordat de gebruiker dit overzicht expliciet heeft goedgekeurd.

2. **Bij een link of referentie naar de oude cursus:**
   - Wanneer de gebruiker een link of inhoud van de oude cursus meegeeft, analyseer je deze pagina grondig en licht je vooraf expliciet toe:
     - Wat je gaat **weglaten** (en waarom, zoals verouderde technieken, overbodige ballast, externe afhankelijkheden of Engelstalige teksten).
     - Wat je gaat **behouden en verbeteren**.
     - Wat je gaat **toevoegen** (moderne standaarden, semantiek, toegankelijkheid, interactieve CodeSandbox-voorbeelden in pure HTML voor HTML-hoofdstukken, Emmet-sneltoetsen voor PhpStorm en gerichte oefeningen).
   - Pas nadat de gebruiker akkoord gaat met dit overzicht en deze keuzes, start je met het schrijven en programmeren van het hoofdstuk.

---

## Structuur van elke lespagina

Elke lespagina volgt deze vaste structuur:

```
---
title: [Paginatitel]
---

# [Paginatitel]

## Leerdoelen

Na dit hoofdstuk kan je:

- [concreet, meetbaar leerdoel in de je-vorm]
- [concreet, meetbaar leerdoel in de je-vorm]
- ...

[Gestructureerde uitleg met tussenkopjes, codeblokken, interactieve voorbeelden (zoals CodeSandbox) en eventueel afbeeldingen]

## Oefeningen

[Concrete, stapsgewijze opdrachten die de leerstof oefenen]
```

---

## Leerdoelen schrijven

Goede leerdoelen zijn:

- Concreet en meetbaar
- Geschreven in de je-vorm, na "Na dit hoofdstuk kan je:"
- Beginnend met een werkwoord (uitleggen, toepassen, gebruiken, beschrijven, maken, vergelijken)
- Realistisch voor beginners

Goed voorbeeld:
- "Een ongeordende lijst aanmaken met `<ul>` en `<li>`"
- "Het verschil uitleggen tussen `margin` en `padding`"

Slecht voorbeeld:
- "Lijsten begrijpen" (niet meetbaar)
- "HTML gebruiken" (te vaag)
- "Kennis hebben van het box model" (niet concreet)

---

## Codevoorbeelden en interactieve voorbeelden

Plaats codevoorbeelden en interactieve previews (zoals CodeSandbox) altijd rechtstreeks bij het bijbehorende theorie-onderdeel, in plaats van in een afzonderlijke sectie achteraan de pagina. Zo kan de student het concept direct in actie zien.

### Strikte beperking van CSS-eigenschappen (Geen voorkennis)

Voorbeelden, oefeningen en `<CodeSandbox>`-toepassingen mogen **uitsluitend** gebruikmaken van CSS-eigenschappen die in het huidige hoofdstuk worden behandeld of in voorgaande CSS-hoofdstukken al zijn besproken.

- Gebruik in eerdere hoofdstukken nooit eigenschappen uit latere hoofdstukken (zoals `display: flex`, `grid`, `position`, `transform`, `transition` of animaties) zolang deze niet eerder in de cursus aan bod zijn gekomen.
- Uitzonderingen zijn enkel toegestaan mits de AI-assistent dit vooraf expliciet vraagt en de gebruiker hiervoor goedkeuring geeft.

### Regels voor codeblokken

- Gebruik altijd de juiste taalannotatie in markdown (` ```html `, ` ```css `, ` ```bash `)
- Elk codevoorbeeld moet volledig en werkend zijn
- Houd voorbeelden minimaal: toon alleen wat nodig is voor dit concept
- Voeg altijd een korte uitleg toe voor elk codeblok
- Gebruik betekenisvolle namen voor klassen, id's en variabelen (geen `div1`, `kleur2`)
- Beperk CSS-eigenschappen tot de reeds behandelde leerstof (zie hierboven)

### Gebruik van de CodeSandbox-component

Gebruik de `<CodeSandbox>` component om live, interactieve voorbeelden te tonen:

```markdown
<CodeSandbox
  src="https://vitepress-sandbox.js-bridge.com/?..."
  title="Beschrijving van het voorbeeld"
  height="400px"
/>
```

Voeg altijd ook een statisch codeblok toe naast de CodeSandbox, zodat studenten de code kunnen lezen zonder de sandbox te openen.

---

## Afbeeldingen

- Gebruik afbeeldingen om concepten te verduidelijken, niet als decoratie
- Zet altijd een beschrijvend `alt`-attribuut in de markdown: `![Beschrijving van de afbeelding](./pad/naar/afbeelding.png)`
- Afbeeldingen worden automatisch zoom-baar via de medium-zoom-integratie
- Sla afbeeldingen op in een `images/`-map naast de bijbehorende `.md`-bestanden
- Gebruik bij voorkeur het WebP-formaat voor foto's, SVG voor diagrammen

---

## Structuur van de cursus

### Secties en pagina's

**HTML5** (`/html/`)

| Route | Paginatitel |
|---|---|
| `/html/` | Introductie |
| `/html/basistags` | Basistags |
| `/html/afbeeldingen` | Afbeeldingen |
| `/html/hyperlinks` | Hyperlinks |
| `/html/speciale-tekens` | Speciale Tekens |
| `/html/lijsten` | Lijsten |
| `/html/tabellen` | Tabellen |

**CSS3** (`/css/`)

| Route | Paginatitel |
|---|---|
| `/css/` | Introductie |
| `/css/lettertypen` | Lettertypen |
| `/css/webfonts` | Webfonts & Iconen |
| `/css/kleuren` | Kleuren |
| `/css/variabelen` | CSS Variabelen |
| `/css/lijsten` | Lijsten |
| `/css/tabellen` | Tabellen |
| `/css/box-model` | Box Model & Randen |
| `/css/display` | Display |
| `/css/afbeeldingen` | Afbeeldingen & Achtergronden |
| `/css/positionering` | Positionering |
| `/css/flexbox` | Flexbox |
| `/css/grid` | Grid (Bootstrap) |
| `/css/media-queries` | Media Queries |
| `/css/2d-transformaties` | 2D Transformaties |
| `/css/transities` | Transities |
| `/css/animaties` | Animaties |
| `/css/3d-transformaties` | 3D Transformaties (optioneel) |

**Tools & Webapps** (`/tools/`)

| Route | Paginatitel |
|---|---|
| `/tools/phpstorm` | PhpStorm Setup |
| `/tools/git` | Git Basics |
| `/tools/devtools` | Browser DevTools |
| `/tools/ai-assistent` | AI Cursusassistent |
| `/tools/afbeeldingen-optimaliseren` | Afbeeldingen Optimaliseren |
| `/tools/realfavicongenerator` | RealFaviconGenerator |
| `/tools/favicon-generator` | Favicon Generator (.ico) |
| `/tools/extensions` | Browser Extensies |

---

## Beschikbare VitePress-componenten

### AiAssistant, AiAssistantNavButton & AiAssistantSetup

De cursus beschikt over een geïntegreerde AI Cursusassistent via de officiële `@google/genai` SDK:
- `<AiAssistantNavButton>`: De compacte knop in de hoofdnavigatie bovenaan (direct achter de zoekbalk geplaatst via Teleport).
- `<AiAssistant>`: De slide-over drawer met interactieve chat, modelkeuze, studentnaam en geschiedenisbeheer (automatisch geladen in het `layout-bottom` slot).
- `<AiAssistantSetup>`: Een configureerbare instellingen-kaart voor `tools/ai-assistent.md` waar studenten hun eigen gratis Gemini API-sleutel invoeren, testen, opslaan of wissen, hun voornaam instellen en actuele Gemini Pro / Flash modellen selecteren.

```vue
<AiAssistantSetup />
```

### PwaNotification

Toont een discrete toast-notificatie linksonder in Thomas More-stijl zodra een nieuwe versie van de cursus op de achtergrond is gedownload door de Service Worker (geladen in het `layout-bottom` slot). Biedt de student de keuze om direct te vernieuwen of te sluiten, en verdwijnt automatisch na 12 seconden.

### ImageCarousel

Toont een interactieve afbeeldingencarousel met ondersteuning voor thumbnails, vorige/volgende navigatieknoppen, bolletjesindicatoren, optionele autoplay met pauzeerknop, mobiele touch-swipe en toetsenbordnavigatie (pijltjestoetsen).

```vue
<ImageCarousel
  title="Voorbeeld galerij"
  :thumbnails="true"
  :nav="true"
  :dots="true"
  :auto="false"
  aspectRatio="16/10"
>
  <img src="./pad/naar/foto1.webp" alt="Omschrijving 1" />
  <img src="./pad/naar/foto2.webp" alt="Omschrijving 2" />
```

### MiniColorPicker

Toont een compacte, interactieve kleurenkiezer en kleurenpalet voor het visualiseren en ontleden van hexadecimale kleurcodes (`#RRGGBB`). Studenten kunnen een voorgedefinieerde kleur kiezen of zelf een kleur selecteren via het native kleurenwiel, de HEX-code met één klik kopiëren en zien direct hoe de kleur is opgebouwd uit het rode (`RR`), groene (`GG`) en blauwe (`BB`) kanaal.

```vue
<MiniColorPicker initialHex="#e87722" />
```


### CodeSandbox

Toont een live, interactief codevoorbeeld met ingebouwde CodeMirror 6 editor en live preview. Ondersteunt zowel alleen HTML als afzonderlijke CSS en JavaScript via props:

#### Belangrijke richtlijnen voor CodeSandbox:
- **Toon in alle sandboxen ALTIJD de volledige HTML-code:** Neem in alle sandboxen altijd de volledige HTML-structuur op (`<!DOCTYPE html>`, `<html lang="nl">`, `<head>`, `<meta charset="UTF-8">`, `<title>`, eventueel `<link rel="stylesheet" href="stijl.css">` en `<body>`). Toon nooit alleen losse HTML-fragmenten.
- **GEEN lege regels binnen de CodeSandbox-attributen:** In Markdown-it veroorzaakt een lege regel binnen een componenttag een breuk in het HTML-blok, waardoor de markdown-parser onbedoeld `<p>`-tags middenin attributen zoals `css` of `html` injecteert. Laat daarom NOOIT lege regels vallen binnen de code van de attributen; gebruik om regels of blokken te scheiden altijd echte, inhoudelijke commentaarregels (bijvoorbeeld `/* Algemene paginastijl */` of `<!-- Hoofdnavigatie -->`) en GEEN loze opvulcommentaar zoals `/* --- */`.
- **Enkel reeds behandelde CSS:** Gebruik in sandboxen uitsluitend CSS-eigenschappen die in het huidige of in voorgaande CSS-hoofdstukken zijn besproken. Uitzonderingen zijn enkel toegestaan als je dit vooraf expliciet aan de gebruiker vraagt en goedkeuring krijgt.
- **Nette inspringing:** Zorg dat zowel HTML als CSS netjes en consistent zijn ingesprongen (2 spaties per inspringniveau).

```vue
<!-- Volledige HTML met CSS (toont tabbladen [HTML] [CSS]) -->
<CodeSandbox
  title="Voorbeeld met styling"
  height="450px"
  activeCodeTab="css"
  css='h1 {
  color: #e87722;
  font-family: sans-serif;
}'
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <title>Voorbeeld</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <h1>Oranje titel</h1>
</body>
</html>'
/>
```

### FullscreenSandbox

De fullscreen sandbox-weergave (`/sandbox`, bereikbaar via de knop "Openen in nieuw tabblad" in elke `<CodeSandbox>`):
- In tegenstelling tot de inline `<CodeSandbox>` (die tabbladen hanteert), staan in de fullscreen sandbox de actieve codevensters (HTML, CSS en optioneel JS) **onder elkaar gestapeld**.
- Tussen de codevensters bevindt zich een **versleepbare horizontale scheidingsbalk**, zodat de student alle talen gelijktijdig in het oog kan houden en bewerken zonder tussen tabbladen te moeten wisselen.
- Dubbelklikken op een scheidingsbalk herstelt de gelijke hoogteverdeling.

### ProgressIndicator

Toont de leesvoortgang voor een sectie (op overzichtspagina's).

```vue
<ProgressIndicator section="html" :total="8" />
<ProgressIndicator section="css" :total="19" />
<ProgressIndicator section="tools" :total="4" />
```

### VitePress standaardcomponenten

Gebruik de ingebouwde VitePress containers voor speciale informatie:

```markdown
::: info
Aanvullende informatie
:::

::: tip
Praktische tip voor de student
:::

::: warning
Let op: veelgemaakte fout
:::

::: danger
Vermijd dit: dit geeft problemen
:::
```

---

## Technische richtlijnen

### Bestandsnamen

- Gebruik altijd kleine letters
- Gebruik koppeltekens (-) in plaats van underscores (_) of spaties
- Gebruik Nederlandse bestandsnamen voor inhoudspagina's
- Voorbeelden: `box-model.md`, `speciale-tekens.md`, `media-queries.md`

### Frontmatter

Elke pagina begint met:

```yaml
---
title: Paginatitel (Nederlands)
---
```

### Interne links

Gebruik altijd relatieve paden voor interne links:

```markdown
Goed: [Basistags](./basistags)
Goed: [Ga naar CSS3](/css/)
Fout: [Basistags](https://web-essentials.be/html/basistags)
```

---

## Projectomgeving

- **Editor voor de cursus:** PhpStorm
- **Buildtool:** VitePress
- **Developmentserver:** `npm run dev` op poort 5674
- **Hosting:** Netlify (https://wt-web-essentials.netlify.app)
- **Repository:** https://github.com/pverhaert/wt-web-essentials
- **Versiebeheer:** Git (maak zelf NOOIT nieuwe branches aan en push NOOIT naar GitHub)

---

## Kwaliteitscontrole

Voor elke pagina die je schrijft of aanpast:

1. Controleer of het gedetailleerde inhoudelijke overzicht (en bij een oude cursus: de analyse van weglaten en toevoegen) vooraf expliciet is goedgekeurd door de gebruiker
2. Controleer of alle leerdoelen concreet en meetbaar zijn
3. Controleer of de structuur (Leerdoelen / Theorie met geïntegreerde codevoorbeelden / Oefeningen) intact is
4. Controleer of alle codeblokken volledig en werkend zijn
5. Controleer of er geen emoji's, en-streepjes of em-streepjes in de tekst staan
6. Controleer of alle technische termen uitgelegd worden bij de eerste vermelding
7. Controleer of de jij-vorm consequent wordt gebruikt
8. Controleer of interne links correct zijn (relatieve paden)
9. Controleer of voorbeelden, oefeningen en CodeSandbox-toepassingen ENKEL gebruikmaken van CSS-eigenschappen die in het huidige of voorgaande CSS-hoofdstukken zijn behandeld (tenzij een uitzondering vooraf expliciet is goedgekeurd)
