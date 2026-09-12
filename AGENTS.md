# AGENTS.md - Web Essentials Cursus

Dit bestand bevat de kernregels voor AI-assistenten die helpen bij het schrijven en uitbreiden van de Web Essentials cursus. Gespecialiseerde richtlijnen staan in de skills onder `.agents/skills/`.

## Projectidentiteit

**Naam:** Web Essentials
**Instelling:** Thomas More Hogeschool, IT Factory
**Campus:** Thomas More Campus Geel, Kleinhoefstraat 4, 2440 Geel (gebruik NOOIT Campus De Nayer)
**Doelgroep:** Eerstejaars studenten ICT, geen voorkennis verondersteld
**Taal:** Nederlands (Belgie)
**Platform:** VitePress, gehost op Netlify (https://wt-web-essentials.netlify.app)
**Repository:** https://github.com/pverhaert/wt-web-essentials

## Doel van de cursus

Web Essentials is een Nederlandstalige basiscursus HTML5 en CSS3 voor eerstejaars ICT-studenten. De cursus leidt studenten stap voor stap van een blanco pagina naar volwaardige, gestileerde en responsieve webpagina's. Naast HTML en CSS worden ook praktische tools behandeld zoals PhpStorm, Git en browser DevTools.

## Doelgroep in detail

- Leeftijd: 18-20 jaar, eerstejaars hogeschool
- Voorkennis: geen programmeer- of webontwikkelervaring verondersteld
- Taalvaardigheid: moedertaal of hoog niveau Nederlands
- Motivatie: gevarieerd (van weinig tot sterk gemotiveerd)
- Leeromgeving: blended learning (les op school + zelfstandig thuis)

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
- Geen drie streepjes / dashes (`---`) tussen titels of secties (gebruik NOOIT horizontale lijnen als scheiding tussen koppen; `---` mag uitsluitend in de YAML-frontmatter helemaal bovenaan het bestand staan)
- Geen Engelse woorden als die een goede Nederlandse equivalent hebben
- Geen aannames over voorkennis die studenten niet hebben
- Gebruik NOOIT "Campus De Nayer" of "Sint-Katelijne-Waver"; gebruik in alle voorbeelden en teksten altijd uitsluitend: Thomas More Campus Geel (Kleinhoefstraat 4, 2440 Geel)
- Maak zelf NOOIT nieuwe branches aan in Git
- Push zelf NOOIT naar GitHub (laat Git commits, branches en pushes altijd over aan de gebruiker)
- **Componentaanpassingen verplicht via voorstel:** Pas bestaande Vue-componenten (zoals simulatoren, sandboxes, navigatiecomponenten) NOOIT direct aan zonder voorafgaand voorstel. Bij elke vraag om een bestaande component te wijzigen of uit te breiden: geef ALTIJD eerst een overzicht van mogelijke oplossingen en de voorgestelde aanpak, en wacht expliciet op akkoord van de gebruiker vóór je code begint te bewerken. Dit voorkomt dat de assistent vastloopt in herhaaldelijke lees- en zoeklussen in grote componentcode.

### Engelstalige technische termen

Gebruik de Engelse term wanneer die de standaard is in de industrie, maar geef altijd een Nederlandse uitleg bij de eerste vermelding:

Goed: "De `border-radius`-eigenschap (de eigenschap voor afgeronde hoeken) ..."
Fout: "Geef de rand een border-radius."

### Gebruik van `<abbr>` en `<dfn>` voor vaktermen en afkortingen

Om studenten optimaal te ondersteunen en de officiële HTML5-semantiek direct in de praktijk te tonen, gebruik je in lopende teksten waar relevant de officiële HTML-tags:

- **`<abbr title="...">` (Abbreviation):** Gebruik dit bij de eerste vermelding van een afkorting of acroniem (zoals `<abbr title="HyperText Markup Language: de standaard opmaaktaal voor webpagina's">HTML</abbr>`, `<abbr title="Cascading Style Sheets: de stijlen- en opmaaktaal voor het web">CSS</abbr>`, `<abbr title="World Wide Web Consortium: de officiële internationale standaardiseringsorganisatie voor het web">W3C</abbr>`, `<abbr title="Document Object Model: de boomstructuur van HTML-elementen">DOM</abbr>`). De cursus toont hier automatisch een interactieve tooltip in Thomas More-huisstijl bij.
- **`<dfn title="...">` (Definition):** Gebruik dit wanneer een nieuw technisch begrip of concept voor het eerst geïntroduceerd of gedefinieerd wordt in de tekst (bijvoorbeeld `<dfn title="De volgorde en regels waarmee browsers bepalen welke CSS-stijlregel voorrang krijgt">de Cascade</dfn>`).
- Gebruik **nooit** zelfbedachte componenten zoals `<KeyTerm>`; vertrouw altijd op de standaard semantische `<abbr>` en `<dfn>` tags.

Gedetailleerde richtlijnen en een lijst van veelgebruikte afkortingen staan in:
`.agents/skills/abbr-dfn/SKILL.md`

## Projectomgeving

- **Editor voor de cursus:** PhpStorm
- **Buildtool:** VitePress
- **Developmentserver:** `npm run dev` op poort 5674
- **Hosting:** Netlify (https://wt-web-essentials.netlify.app)
- **Repository:** https://github.com/pverhaert/wt-web-essentials
- **Versiebeheer:** Git (maak zelf NOOIT nieuwe branches aan en push NOOIT naar GitHub)

## Structuur van de cursus

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
| `/tools/line-height-spel` | Line-height Spel |
| `/tools/font-simulator` | Font Simulator |
| `/tools/kleurenomzetter` | Kleurenomzetter |
| `/tools/tabel-simulator` | Tabel Simulator |
| `/tools/display-simulator` | Display Simulator |
| `/tools/vertical-align-lab` | Vertical-align Lab |
| `/tools/positioning-simulator` | Positioning Simulator |
| `/tools/extensions` | Browser Extensies |
| `/sandbox` | Fullscreen Sandbox |

> **Volgorde-afspraak Tools & Webapps:** In de navigatie en overzichten van "Tools & Webapps" staan "Browser Extensies" (`/tools/extensions`) en "Fullscreen Sandbox" (`/sandbox`) ALTIJD helemaal onderaan de lijst.

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
- **Toon in alle sandboxen ALTIJD de volledige HTML-code:** Neem in alle sandboxen altijd de volledige HTML-structuur op (`<!DOCTYPE html>`, `<html lang="nl">`, `<head>`, `<meta charset="UTF-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1.0">`, `<title>`, eventueel `<link rel="stylesheet" href="stijl.css">` en `<body>`). Toon nooit alleen losse HTML-fragmenten.
- **GEEN lege regels binnen de CodeSandbox-attributen:** In Markdown-it veroorzaakt een lege regel binnen een componenttag een breuk in het HTML-blok, waardoor de markdown-parser onbedoeld `<p>`-tags middenin attributen zoals `css` of `html` injecteert. Laat daarom NOOIT lege regels vallen binnen de code van de attributen; gebruik om regels of blokken te scheiden altijd echte, inhoudelijke commentaarregels (bijvoorbeeld `/* Algemene paginastijl */` of `<!-- Hoofdnavigatie -->`) en GEEN loze opvulcommentaar zoals `/* --- */`.
- **CSS3 Progressiematrix & Cumulatieve standaarden:** Volg strikt de progressiematrix uit `.agents/skills/code-examples/SKILL.md`:
  - **VERBODEN:** Gebruik nooit CSS-eigenschappen die pas in een later hoofdstuk worden behandeld.
  - **TOEGESTAAN:** Eigenschappen uit reeds behandelde hoofdstukken mogen vrij gecombineerd worden.
- **Vaste volgorde en verplichte aanwezigheid van ALLE 10 props:** Elk `<CodeSandbox>`-codevoorbeeld moet ALTIJD alle 10 onderstaande properties bevatten in deze exacte volgorde, ook als ze leeg zijn:
  1. `title`
  2. `height`
  3. `initialTab`
  4. `activeCodeTab`
  5. `highlightHtml`
  6. `highlightCss`
  7. `highlightJs`
  8. `html`
  9. `css`
  10. `js`
- **Automatische regelmarkering (`highlightCss` & `highlightHtml`):** Laat `highlightCss` (en waar relevant `highlightHtml`) nooit zomaar leeg bij voorbeelden over een nieuw concept. Markeer altijd de sleutelregels van de les (bijv. bij CSS-variabelen zowel de declaraties in `:root` als het gebruik via `var(--...)`; bij Display de `display: inline-block` en afmetingen).
- **Nette inspringing:** Zorg dat zowel HTML als CSS netjes en consistent zijn ingesprongen (2 spaties per inspringniveau).

```vue
<!-- Volledige CodeSandbox met alle 10 props in de vaste volgorde -->
<CodeSandbox
  title="Voorbeeld met styling"
  height="450px"
  initialTab="split"
  activeCodeTab="css"
  highlightHtml=""
  highlightCss=""
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Voorbeeld</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <h1>Oranje titel</h1>
</body>
</html>'
  css='h1 {
  color: #EC6639;
  font-family: sans-serif;
}'
  js=''
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

## Paginasamenvattingen (`<PageSummary>`)

Elke cursuspagina eindigt met een beknopte, inklapbare referentiekaart voor de student. Deze kaart staat **boven de `## Oefeningen`-sectie** en bevat:

- Een syntaxistabel (tags, properties of patronen in een oogopslag)
- Regels en naamgeving (concrete do's en don'ts)
- Veelgemaakte fouten (3-5 concrete beginnerfouten)
- Tips voor beginners (2-4 praktische workflow-tips)

De component wordt als volgt opgenomen in een `.md`-bestand:

```markdown
<PageSummary>

### Syntaxis in een oogopslag

[tabel of bullets]

### Veelgemaakte fouten

[bullets]

### Tips voor beginners

[bullets]

</PageSummary>

## Oefeningen
```

**Gedetailleerde instructies** voor het schrijven van een samenvatting staan in de aparte skill:

```
.agents/skills/page-summary/SKILL.md
```

Lees dit bestand altijd **voor** je een nieuwe samenvatting schrijft of een bestaande herziet.

## Kwaliteitscontrole

Voor elke pagina die je schrijft of aanpast:

1. Controleer of het gedetailleerde inhoudelijke overzicht (en bij een oude cursus: de analyse van weglaten en toevoegen) vooraf expliciet is goedgekeurd door de gebruiker
2. Controleer of alle leerdoelen concreet en meetbaar zijn
3. Controleer of de structuur (Leerdoelen / Theorie met geïntegreerde codevoorbeelden / Samenvatting & tips / Oefeningen) intact is
4. Controleer of alle codeblokken volledig en werkend zijn
5. Controleer of er geen emoji's, en-streepjes, em-streepjes of drie dashes (`---` tussen titels of secties) in de tekst staan
6. Controleer of alle technische termen uitgelegd worden bij de eerste vermelding
7. Controleer of de jij-vorm consequent wordt gebruikt
8. Controleer of interne links correct zijn (relatieve paden)
9. Controleer of voorbeelden, oefeningen en CodeSandbox-toepassingen voldoen aan de CSS3 Progressiematrix (geen toekomstige eigenschappen, wel verplichte cumulatieve eigenschappen zoals font-family op body, resetter, variabelen)
10. Controleer of een `<PageSummary>`-blok aanwezig is boven de oefeningen (zie skill hieronder)
11. Controleer of afkortingen en nieuw geïntroduceerde begrippen waar nuttig voorzien zijn van `<abbr title="...">` of `<dfn title="...">` tags (voor interactieve Thomas More-tooltips)

## Skills-overzicht

Gedetailleerde richtlijnen staan in de volgende skills:

| Skill | Locatie | Gebruik voor |
|---|---|---|
| Werkwijze nieuwe hoofdstukken | `.agents/skills/new-chapter-workflow/SKILL.md` | Verplichte goedkeuringsstap vóór elk nieuw hoofdstuk |
| Paginastructuur & leerdoelen | `.agents/skills/page-structure/SKILL.md` | Paginasjabloon en regels voor leerdoelen |
| Codevoorbeelden & CodeSandbox | `.agents/skills/code-examples/SKILL.md` | Regels voor codeblokken en CodeSandbox |
| VitePress-componenten | `.agents/skills/components/SKILL.md` | Volledige componentcatalogus met voorbeelden |
| `<abbr>` en `<dfn>` | `.agents/skills/abbr-dfn/SKILL.md` | Afkortingen en begrippen markeren |
| Afbeeldingen | `.agents/skills/images/SKILL.md` | Formaten, alt-tekst, mapstructuur |
| Technische naamgeving | `.agents/skills/technical-conventions/SKILL.md` | Bestandsnamen, links, frontmatter |
| Kwaliteitscontrole | `.agents/skills/quality-check/SKILL.md` | Volledige checklist na elke pagina |
| Paginasamenvatting | `.agents/skills/page-summary/SKILL.md` | `<PageSummary>`-component schrijven |
