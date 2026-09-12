---
name: code-examples
description: >
  Regels voor codeblokken en de CodeSandbox-component in de Web Essentials
  cursus. Bevat ook de strikte CSS-beperkingsregels per hoofdstuk. Gebruik
  deze skill telkens wanneer je codevoorbeelden schrijft of een CodeSandbox
  toevoegt aan een cursuspagina.
---

# Skill: Codevoorbeelden en CodeSandbox

## Positie van codevoorbeelden

Plaats codeblokken en `<CodeSandbox>`-voorbeelden altijd **direct bij de bijbehorende theorie**. Niet gebundeld achteraan de pagina.

**Goed:** Theorie over `border-radius` → direct gevolgd door codeblok en sandbox met `border-radius`.

**Fout:** Alle codevoorbeelden van het hoofdstuk samengebundeld in een sectie "Voorbeelden" onderaan.

## Regels voor markdown-codeblokken

- Gebruik altijd de juiste taalannotatie:
  - ` ```html ` voor HTML
  - ` ```css ` voor CSS
  - ` ```bash ` voor terminalopdrachten
  - ` ```markdown ` voor markdown
- Elk codevoorbeeld moet **volledig en werkend** zijn
- Houd voorbeelden **minimaal**: toon alleen wat nodig is voor het huidige concept
- Voeg altijd een korte uitlegzin toe vóór elk codeblok
- Gebruik **betekenisvolle namen** voor klassen, id's en variabelen

**Goed:**
```css
.artikel-titel {
  font-size: 1.5rem;
  color: #333;
}
```

**Fout:**
```css
.div1 {
  font-size: 1.5rem;
  kleur2: #333;
}
```

## CSS3 Progressiematrix & Cumulatieve Regels

Voorbeelden, oefeningen en `<CodeSandbox>`-toepassingen volgen drie strikte didactische basisregels:

1. **Strikt verbod op toekomstige eigenschappen:** Gebruik **nooit** CSS-eigenschappen die pas in een later hoofdstuk aan bod komen (bijvoorbeeld geen `display: flex` vóór Flexbox, geen `position: absolute` vóór Positionering).
2. **Voorgaande eigenschappen MOGEN:** Eigenschappen uit reeds behandelde hoofdstukken mogen vrij gebruikt en gecombineerd worden.
3. **Cumulatieve standaarden MOETEN:** Bepaalde gevestigde best practices **moeten** vanaf hun introductie in alle latere hoofdstukken consistent worden toegepast:
   - **Vanaf *Kleuren* (`/css/kleuren`):** Altijd een expliciete `font-family` instellen op de `body`-tag. Gebruik bij voorkeur één van deze twee goedgekeurde stacks:
     - `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;`
     - `Arial, "Helvetica Neue", Helvetica, sans-serif;`
   - **Vanaf *Box Model* (`/css/box-model`):** Altijd de universele resetter bovenaan de stylesheet plaatsen:
     ```css
     * {
       box-sizing: border-box;
       margin: 0;
       padding: 0;
     }
     ```
   - **Vanaf *CSS Variabelen* (`/css/variabelen`):** Waar nuttig en gewenst (zoals voor themakleuren, consistente marges of afgeronde hoeken) worden variabelen gedefinieerd in `:root` en hergebruikt met `var(--...)`.
   - **Vanaf *Display* (`/css/display`):** Elementen zoals knoppen (`<a>` of `<button>`) die padding of afmetingen krijgen, worden voorzien van `display: inline-block` of `display: block`.
   - **Vanaf *Afbeeldingen* (`/css/afbeeldingen`):** Afbeeldingen in voorbeelden krijgen standaard de responsieve regel `max-width: 100%; height: auto;` of `object-fit: cover` bij vaste kaders.

### De Volledige CSS3 Progressiematrix

| Volgorde | Hoofdstuk | Verplicht aanwezig in voorbeelden (MOET) | Wat MAG uit voorgaande | Wat is nog STRIKT VERBODEN |
|:---:|---|---|---|---|
| 1 | **Lettertypen** | `font-family`, `font-size` (rem), `line-height` | Basistags HTML | Kleuren (`color`, `background-color`), box-model, flex, grid, positionering |
| 2 | **Webfonts & Iconen** | `@import` / Google Fonts / `@font-face` | Alles uit 1 | Kleuren, box-model, layout |
| 3 | **Kleuren** | **`font-family` op `body`** (Segoe UI of Arial stack), `color`, `background-color` | Alles uit 1-2 | `margin`, `padding`, `border`, `width`, `height`, flex, grid |
| 4 | **Box Model & Randen** | **Universele resetter (`* { box-sizing: border-box; margin: 0; padding: 0; }`)**, `font-family` op `body`, `margin`, `padding`, `border`, `width` / `max-width` | Alles uit 1-3 | CSS Variabelen (`:root`, `var()`), `display: flex/grid`, `position: absolute/relative` |
| 5 | **CSS Variabelen** | Universele resetter, `font-family` op `body`, **`:root` met `--variabelen`** voor kleuren/afmetingen | Alles uit 1-4 | `display: inline-block`, `display: flex/grid`, `position` |
| 6 | **Lijsten** | Reset, font op body, CSS-variabelen waar zinvol, `list-style-*` | Alles uit 1-5 | `display: inline-block` voor navigatiebalken (pas in Display), flex/grid |
| 7 | **Tabellen** | Reset, font op body, variabelen waar zinvol, `border-collapse: collapse`, `table-layout` | Alles uit 1-6 | `display: flex/grid`, `position` |
| 8 | **Display** | Reset, font op body, variabelen waar nuttig, **`display: block / inline-block / none`** | Alles uit 1-7 | `object-fit`, `background-size`, `float`, `position: absolute/relative`, flex, grid |
| 9 | **Afbeeldingen & Achtergronden** | Reset, font op body, **`max-width: 100%; height: auto`** of **`object-fit: cover`**, `background-size: cover`, `display: flow-root` bij float | Alles uit 1-8 | `position: absolute/relative/fixed/sticky`, `display: flex/grid`, transform, transition |
| 10 | **Positionering** | Reset, font op body, `position: relative/absolute/fixed/sticky`, `z-index` | Alles uit 1-9 | `display: flex`, `display: grid`, transform, transition, animaties |
| 11 | **Flexbox** | Reset, font op body, **`display: flex`**, flexbox-eigenschappen | Alles uit 1-10 | `display: grid`, media queries (tenzij basis), animaties |
| 12 | **Grid (Bootstrap)** | Reset, font op body, Grid classes / structuur | Alles uit 1-11 | Complexe media queries, animaties |
| 13 | **Media Queries** | Reset, font op body, **`@media (...)`** voor responsieve aanpassingen | Alles uit 1-12 | Transformaties, transities, animaties |
| 14 | **2D Transformaties** | Reset, font op body, `transform: translate / rotate / scale / skew` | Alles uit 1-13 | `transition`, `@keyframes`, 3D |
| 15 | **Transities** | Reset, font op body, `transition: property duration timing-function` | Alles uit 1-14 | `@keyframes`, animaties, 3D |
| 16 | **Animaties** | Reset, font op body, `@keyframes`, `animation` | Alles uit 1-15 | 3D transformaties |
| 17 | **3D Transformaties** | Reset, font op body, `perspective`, `transform: rotateX/Y/Z` | Alles uit 1-16 | - |

Uitzonderingen zijn enkel toegestaan als je dit **vooraf expliciet aan de gebruiker vraagt** en goedkeuring krijgt.

## Regels voor de CodeSandbox-component

### Altijd de volledige HTML-structuur

Toon nooit losse HTML-fragmenten. Elke sandbox bevat altijd:

```html
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Voorbeeld</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <!-- inhoud -->
</body>
</html>
```

### Vaste volgorde en verplichte aanwezigheid van ALLE props (Dwingende eis)

Elk `<CodeSandbox>`-codevoorbeeld in de cursus **moet** altijd alle onderstaande properties bevatten in deze **exacte, vaste volgorde**, ook als ze leeg zijn:

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

**Standaard sjabloon voor elke CodeSandbox:**
```vue
<CodeSandbox
  title="Titel van het voorbeeld"
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
  <title>Titel</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <h1>Hallo wereld</h1>
</body>
</html>'
  css='/* Universele resetter */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  color: #212529;
  padding: 1.5rem;
}'
  js=''
/>
```

> **Let op:** Als er geen CSS of JavaScript van toepassing is, mogen deze eigenschappen gewoon volledig leeg zijn (`css=''` en `js=''`). Ook de highlight-props mogen leeg blijven (`highlightHtml=""`, `highlightCss=""`, `highlightJs=""`). Alle 10 properties blijven echter **verplicht aanwezig** in het componentblok in deze vaste volgorde.

**Voorbeeld van een pure HTML-sandbox (zonder CSS of JS):**
```vue
<CodeSandbox
  title="Basis HTML-elementen"
  height="400px"
  initialTab="split"
  activeCodeTab="html"
  highlightHtml="7-8"
  highlightCss=""
  highlightJs=""
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Voorbeeld</title>
</head>
<body>
  <h1>Titel</h1>
  <p>Een eenvoudige alinea.</p>
</body>
</html>'
  css=''
  js=''
/>
```

### Belangrijke regels automatisch markeren (`highlightCss` & `highlightHtml`)

Om de didactische focus van een codevoorbeeld direct duidelijk te maken aan de student, mogen `highlightCss` (en waar relevant `highlightHtml`) **nooit zomaar leeg gelaten worden** als het voorbeeld over een nieuw concept gaat:

- **Accentueer altijd de kernelementen van de les:** Vul altijd de regelnummers in van de specifieke eigenschappen die in die sectie worden uitgelegd.
- **Zowel definitie als gebruik markeren:**
  - *Bij CSS-variabelen:* markeer zowel de declaraties in `:root` als de regels waar `var(--...)` wordt aangeroepen (bijv. `highlightCss="2-4,12,18"`).
  - *Bij Display:* markeer de `display: inline-block;` regel en de bijhorende afmetingen/marges.
  - *Bij Box Model:* markeer de `box-sizing`, `padding`, `margin` of `border` regels.
  - *Bij Afbeeldingen:* markeer `max-width: 100%; height: auto;` of `object-fit: cover;`.
  - *Bij HTML-hoofdstukken:* markeer via `highlightHtml` de specifieke tags waar de oefening om draait (bijv. de `<table>`, `<ul>` of `<img>` regels).
- **Formaat:** Gebruik een komma-gescheiden lijst van regelnummers en/of bereiken (bijvoorbeeld `"3-5,8,12"`). Let op dat de regelnummers exact overeenkomen met de regels in het bijbehorende attribuut (1-geïndexeerd).

### Geen lege regels binnen CodeSandbox-attributen

In Markdown-it veroorzaakt een lege regel binnen een componentattribuut dat de markdown-parser onbedoeld `<p>`-tags injecteert middenin de attribuutwaarde. Gebruik in plaats van lege regels altijd inhoudelijke commentaarregels om blokken te scheiden.

**Goed:**
```vue
<CodeSandbox
  css='/* Paginastijl */
body {
  font-family: sans-serif;
}
/* Koptekststijl */
h1 {
  color: #e87722;
}'
/>
```

**Fout:**
```vue
<CodeSandbox
  css='body {
  font-family: sans-serif;
}

h1 {
  color: #e87722;
}'
/>
```

### Universele resetter (verplicht vanaf Box Model)

Vanaf het hoofdstuk **Box Model** start elke CSS-stylesheet in een CodeSandbox altijd bovenaan met de universele resetter:

```css
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
```

### Nette inspringing

Gebruik 2 spaties per inspringniveau, zowel voor HTML als CSS.

### Naast de sandbox altijd een statisch codeblok

Voeg naast elke `<CodeSandbox>` ook een statisch markdown-codeblok toe, zodat studenten de code kunnen lezen zonder de sandbox te openen.

## Syntax van de CodeSandbox-component

```vue
<CodeSandbox
  title="Beschrijving van het voorbeeld"
  height="400px"
  activeCodeTab="css"
  css='...'
  html='...'
/>
```

| Prop | Beschrijving |
|---|---|
| `title` | Korte beschrijvende titel van het voorbeeld |
| `height` | Hoogte van de preview (standaard `400px`) |
| `activeCodeTab` | Welk tabblad standaard actief is: `html` of `css` |
| `css` | CSS-code als string |
| `html` | Volledige HTML-code als string |
