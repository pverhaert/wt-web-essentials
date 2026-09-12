---
name: components
description: >
  Catalogus van alle beschikbare VitePress-componenten in de Web Essentials
  cursus. Gebruik deze skill wanneer je een component wilt inzetten op een
  cursuspagina en de correcte syntax of het juiste gebruik wilt kennen.
---

# Skill: Beschikbare VitePress-componenten

Alle onderstaande componenten zijn globaal geregistreerd en direct beschikbaar in elk `.md`-bestand zonder extra import.

## Verplichte werkwijze bij aanpassen van bestaande componenten

Wanneer de gebruiker vraagt om een bestaande Vue-component aan te passen of uit te breiden:
1. **NOOIT direct de code induiken of blindelings bewerken:** Ga niet herhaaldelijk door de componentcode zoeken of lezen.
2. **Eerst voorstellen formuleren:** Geef altijd eerst een beknopte opsomming van mogelijke oplossingsrichtingen en hoe de aanpassing aangepakt kan worden.
3. **Wacht op akkoord:** Pas nadat de gebruiker een keuze heeft gemaakt of akkoord heeft gegeven, wordt de concrete code-aanpassing uitgevoerd.

---

## CodeSandbox

Toont een live, interactief codevoorbeeld met ingebouwde CodeMirror 6 editor en live preview. Ondersteunt HTML, CSS en JavaScript.

Zie de skill `code-examples` voor de volledige gebruiksregels en beperkingen.

**Dwingende eis:** Elk CodeSandbox-element bevat **altijd alle 10 onderstaande props in deze exacte volgorde** (ook als ze leeg zijn):

```vue
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

| Nr | Prop | Type | Beschrijving |
|:---:|---|---|---|
| 1 | `title` | string | Titelbalk boven het codevoorbeeld |
| 2 | `height` | string | Hoogte van het werkgebied (bijv. `450px`) |
| 3 | `initialTab` | `'preview' \| 'code' \| 'split'` | Initiële weergavemodus |
| 4 | `activeCodeTab` | `'html' \| 'css' \| 'js'` | Actieve codetab in de editor |
| 5 | `highlightHtml` | string | Regelnummers om te markeren in HTML (bijv. `'3,5-7'`) |
| 6 | `highlightCss` | string | Regelnummers om te markeren in CSS |
| 7 | `highlightJs` | string | Regelnummers om te markeren in JS |
| 8 | `html` | string | Volledige HTML-broncode |
| 9 | `css` | string | CSS-stijlblad |
| 10 | `js` | string | JavaScript-code |

## PageSummary

Een inklapbare referentiekaart onderaan de cursuspagina (boven de oefeningen). De open/dicht-voorkeur van de student wordt opgeslagen via `localStorage`.

Zie de skill `page-summary` voor de volledige structuur en schrijfregels.

```vue
<PageSummary>

### Syntaxis in een oogopslag

| Wat | Hoe | Voorbeeld |
|---|---|---|
| ... | `...` | `...` |

### Veelgemaakte fouten

- ...

### Tips voor beginners

- ...

</PageSummary>
```

## ImageCarousel

Toont een interactieve afbeeldingencarousel. Ondersteunt thumbnails, navigatieknoppen, bolletjesindicatoren, autoplay, touch-swipe en toetsenbordnavigatie.

```vue
<ImageCarousel
  title="Voorbeeld galerij"
  :thumbnails="true"
  :nav="true"
  :dots="true"
  :auto="false"
  aspectRatio="16/10"
>
  <img src="./images/foto1.webp" alt="Omschrijving 1" />
  <img src="./images/foto2.webp" alt="Omschrijving 2" />
</ImageCarousel>
```

| Prop | Type | Beschrijving |
|---|---|---|
| `title` | string | Toegankelijke titel van de carousel |
| `:thumbnails` | boolean | Toon thumbnailnavigatie onderaan |
| `:nav` | boolean | Toon vorige/volgende knoppen |
| `:dots` | boolean | Toon bolletjesindicatoren |
| `:auto` | boolean | Automatisch doorschuiven |
| `aspectRatio` | string | Verhouding (bijv. `16/10`, `4/3`) |

## MiniColorPicker

Compacte kleurenkiezer voor het visualiseren en ontleden van hexadecimale kleurcodes. Toont de opbouw uit rode, groene en blauwe kanalen.

```vue
<MiniColorPicker initialHex="#e87722" />
```

| Prop | Beschrijving |
|---|---|
| `initialHex` | Beginkleur in hex-notatie (`#RRGGBB`) |

## ProgressIndicator

Toont de leesvoortgang voor een cursussectie. Gebruik op overzichtspagina's (`index.md` van een sectie).

```vue
<ProgressIndicator section="html" :total="8" />
<ProgressIndicator section="css" :total="19" />
<ProgressIndicator section="tools" :total="4" />
```

| Prop | Beschrijving |
|---|---|
| `section` | Naam van de sectie (`html`, `css`, `tools`) |
| `:total` | Totaal aantal pagina's in de sectie |

## AiAssistant, AiAssistantNavButton & AiAssistantSetup

De geïntegreerde AI Cursusassistent via de officiële `@google/genai` SDK.

- `<AiAssistantNavButton>`: Compacte knop in de hoofdnavigatie (via Teleport).
- `<AiAssistant>`: Slide-over drawer met interactieve chat (in `layout-bottom` slot).
- `<AiAssistantSetup>`: Configuratiekaart voor `tools/ai-assistent.md`. Studenten voeren hier hun Gemini API-sleutel in en selecteren een model.

```vue
<AiAssistantSetup />
```

## PwaNotification

Toont een discrete toast-notificatie linksonder wanneer een nieuwe versie van de cursus beschikbaar is. De student kan kiezen om direct te vernieuwen of te sluiten. Verdwijnt automatisch na 12 seconden. Wordt geladen in het `layout-bottom` slot.

Geen props; werkt automatisch via de Service Worker.

## TableWorkbench

Interactieve tabel-simulator voor `/css/tabellen.md` en `/tools/tabel-simulator.md`. Laat studenten experimenteren met `border-collapse`, `border-spacing`, `empty-cells`, `caption-side` en `table-layout: auto` vs `fixed`.

```vue
<TableWorkbench />
```

## DisplayVisualizer

Interactieve simulator van de normale documentstroom voor `/css/display.md` en `/tools/display-simulator.md`. Toont het effect van `inline`, `inline-block`, `block`, `none` en `visibility: hidden` op omringende tekst en referentievakken.

```vue
<DisplayVisualizer />
```

## ButtonBuilder

Stap-voor-stap didactische simulator voor `/css/display.md` en `/tools/button-builder.md`. Demonstreert in 4 stappen waarom een knop `display: inline-block` vereist om overlap met omliggende alinea's te voorkomen.

```vue
<ButtonBuilder />
```

## VerticalAlignLab

Lay-out simulator voor `/css/display.md` en `/tools/vertical-align-lab.md`. Demonstreert hoe `vertical-align: baseline` kaarten met ongelijke tekst scheef trekt, en hoe `vertical-align: top` strakke, gelijke bovenkanten waarborgt.

```vue
<VerticalAlignLab />
```

## FullscreenSandbox

Fullscreen sandbox-weergave op `/sandbox`. Bereikbaar via de knop "Openen in nieuw tabblad" in elke `<CodeSandbox>`. In tegenstelling tot de inline sandbox staan de codevensters hier **onder elkaar gestapeld** met versleepbare scheidingsbalken. Dubbelklikken op een scheidingsbalk herstelt de gelijke hoogteverdeling.

Dit component wordt automatisch gerenderd op de `/sandbox`-route en hoeft niet handmatig te worden ingevoegd. Let op: "Browser Extensies" en "Fullscreen Sandbox" staan in het Tools-menu altijd als laatste twee items onderaan.

## VitePress standaardcontainers

Gebruik de ingebouwde VitePress containers voor extra informatie, tips en waarschuwingen:

```markdown
::: info
Aanvullende achtergrondinformatie voor de student.
:::

::: tip
Praktische tip of slimme werkwijze.
:::

::: warning
Let op: dit is een veelgemaakte fout.
:::

::: danger
Vermijd dit: dit geeft problemen of fouten.
:::
```

### Wanneer welke container?

| Container | Gebruik voor |
|---|---|
| `info` | Achtergrondinfo, context, interessante bijzaak |
| `tip` | Sneltoets, best practice, efficiënte werkwijze |
| `warning` | Veelgemaakte fout, iets om op te letten |
| `danger` | Kritieke fout die de code breekt of veiligheidsproblemen geeft |

### Wat nooit te gebruiken

Gebruik **nooit** zelfbedachte of externe componenten zoals `<KeyTerm>`, `<Callout>` of vergelijkbare wrappers. Gebruik altijd de standaard semantische `<abbr>`, `<dfn>` of bovenstaande VitePress-containers.
