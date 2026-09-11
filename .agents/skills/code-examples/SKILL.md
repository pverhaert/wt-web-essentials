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

## CSS-beperkingen per hoofdstuk (strikte regel)

Voorbeelden, oefeningen en `<CodeSandbox>`-toepassingen mogen **uitsluitend** gebruikmaken van CSS-eigenschappen die:
1. In het **huidige hoofdstuk** worden behandeld, of
2. In **voorgaande CSS-hoofdstukken** al zijn besproken.

Gebruik in een vroeg hoofdstuk nooit eigenschappen uit latere hoofdstukken:

| Verboden vóór het desbetreffende hoofdstuk |
|---|
| `display: flex` (pas na het Flexbox-hoofdstuk) |
| `display: grid` (pas na het Grid-hoofdstuk) |
| `position: absolute/relative/fixed` (pas na Positionering) |
| `transform`, `transition`, `animation` (pas na de respectieve hoofdstukken) |

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

**Goed:**
```vue
<CodeSandbox
  title="Kleurvoorbeeld"
  height="300px"
  html='<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kleuren</title>
  <link rel="stylesheet" href="stijl.css">
</head>
<body>
  <p class="tekst">Hallo wereld</p>
</body>
</html>'
  css='.tekst {
  color: #e87722;
  font-size: 1.2rem;
}'
/>
```

**Fout:**
```vue
<CodeSandbox
  title="Kleurvoorbeeld"
  html='<p class="tekst">Hallo wereld</p>'
  css='.tekst { color: red; }'
/>
```

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
