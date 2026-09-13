---
name: sandbox-intro
description: >
  Didactische introductie en structuur voor interactieve CodeSandbox-voorbeelden
  in de Web Essentials cursus. Vervangt statische code-duplicatie door een
  heldere opbouw met CSS-selectornotatie en overzichtstabellen.
---

# Skill: Didactische CodeSandbox-introductie (`sandbox-intro`)

## Doel en Filosofie

In de Web Essentials cursus bevat de component `<CodeSandbox>` reeds de volledige, werkende en interactieve HTML-, CSS- en/of JS-code met syntax highlighting, regelnummers en een live preview.

Het dupliceren van deze volledige broncode in statische markdown-codeblokken (` ```html ` en ` ```css `) direct boven de sandbox creëert een **"wall of code"**. Dit leidt bij studenten tot:
- Onnodige scroll-vermoeidheid;
- Cognitieve overbelasting (dezelfde code tweemaal moeten scannen);
- Verlies van focus op wat de code daadwerkelijk doet.

### De Gouden Regel
> **Plaats NOOIT een volledig statisch HTML- of CSS-codeblok direct boven een `<CodeSandbox>` die exact diezelfde code al toont.**
> 
> Vervang het statische codeblok altijd door:
> 1. Een beknopte **didactische analyse van de elementen** met Emmet/CSS-selectornotatie;
> 2. Een **overzichtstabel of trapsgewijze werking** (gedrag, condities, breekpunten of states);
> 3. Direct aansluitend de interactieve `<CodeSandbox>`.

---

## Vaste structuur van een Sandbox-sectie

Wanneer een concept of praktijkvoorbeeld wordt geïntroduceerd met een live demonstratie in een sandbox, hanteer je deze opbouw:

```markdown
## [Titel van het voorbeeld of de demonstratie]

[Korte inleiding: wat demonstreert dit voorbeeld en wat moet de student observeren of uitproberen?]

### Opbouw van de elementen

- `tag.klasse`: korte toelichting van de functie, rol of styling.
- `tag#id`: toelichting (indien een id gebruikt wordt).
- `tag.klasse` met `::pseudo-element`: toelichting van dynamische of decoratieve inhoud.
- `tag.ouder > tag.kind`: toelichting bij specifieke nesting of hiërarchie.

### [Werking van het concept / Trapsgewijze werking / Toestanden]

| Toestand / Breekpunt / Trigger | Selector of Eigenschap | Visueel effect / Gedrag in preview |
|---|---|---|
| ... | ... | ... |

<CodeSandbox
  title="..."
  height="..."
  initialTab="split"
  activeCodeTab="css"
  highlightHtml="..."
  highlightCss="..."
  highlightJs="..."
  html='...'
  css='...'
  js=''
/>
```

---

## Richtlijnen voor de selectornotatie

Gebruik in de bullet points van **Opbouw van de elementen** altijd de compacte selector- en Emmet-notatie in inline code (`...`). Dit sluit direct aan bij wat studenten typen in PhpStorm en herkennen in stylesheets:

| Notatie | Betekenis in de toelichting |
|---|---|
| `body` | Het basiselement / globale pagina-instellingen |
| `div.status-kaart` | Een `<div>` met `class="status-kaart"` |
| `p.toelichting` | Een `<p>` met `class="toelichting"` |
| `nav.hoofd-nav` | Een `<nav>` met `class="hoofd-nav"` |
| `article.kaart` | Een `<article>` met `class="kaart"` |
| `div.badge` met `::after` | Het badge-element met gegenereerde content via een pseudo-element |
| `button#verzend-knop` | Een `<button>` met `id="verzend-knop"` |

Houd de beschrijving bij elk element bondig: noem de visuele rol (bijv. "een witte kaart met afgeronde hoeken") en de belangrijkste CSS-eigenschappen tussen haakjes (bijv. `padding: 1.5rem` en `border-radius: 8px`).

---

## Richtlijnen voor de tabel

Gebruik na de opbouw een compacte Markdown-tabel om de logica, condities of wisselwerking inzichtelijk te maken. Pas de kolommen aan volgens het type onderwerp:

### Type 1: Media Queries / Responsiviteit
| Weergave | Breekpunt (Media Query) | Gedrag container / navigatie | Gedrag inhoud / kaarten |
|---|---|---|---|
| **Mobiel (basis)** | Standaard (geen query) | Verticaal onder elkaar (`flex-direction: column`) | 1 kolom, volle breedte |
| **Tablet** | `@media (min-width: 768px)` | Horizontale balk (`flex-direction: row`) | 2 kolommen (`flex: 0 0 calc(50% - ... )`) |
| **Desktop** | `@media (min-width: 992px)` | Gecentreerde container (`max-width: ...`) | 3 kolommen (`flex: 0 0 calc(33.333% - ... )`) |

### Type 2: Pseudo-klassen / Interactieve toestanden (bv. `:hover`, `:focus`, `:active`)
| Toestand / Interactie | Selector / Pseudo-klasse | Toegepaste stijlverandering |
|---|---|---|
| **Normaal** | `.knop` | Primaire achtergrondkleur, geen schaduw |
| **Hover (muiscursor)** | `.knop:hover` | Donkerdere tint, lichte schaduw |
| **Focus (toetsenbord / tab)** | `.knop:focus-visible` | Duidelijke focusring (`outline`) |

### Type 3: Transities en Animaties
| Fase / Toestand | Selector / Keyframe | Eigenschap & Waarde |
|---|---|---|
| **Beginpositie** | `.kaart` | `transform: translateY(0)`, `opacity: 1` |
| **Doelpositie** | `.kaart:hover` | `transform: translateY(-8px)`, overgang via `transition: transform 0.3s ease` |

### Type 4: Layout & Display (bv. Flexbox / Grid)
| Element | CSS-rol | Eigenschap | Doel in de layout |
|---|---|---|---|
| `main.rooster` | Flex-container | `display: flex; gap: 1rem;` | Verdeelt de ruimte tussen de kinderen |
| `article.kaart` | Flex-item | `flex: 1 1 250px;` | Laat kaarten meeschalen en inpakken |

---

## Wanneer gebruik je WEL nog een los codeblok?

Er zijn specifieke situaties waarin een beknopt statisch codeblok wél nuttig en gewenst blijft:

1. **Geïsoleerde syntaxis-introductie:** Wanneer je een enkele nieuwe eigenschap of regel introduceert vóórdat er een compleet voorbeeld volgt (bijv. puur de syntaxis van `@media (min-width: 768px) { ... }`).
2. **Korte fragmenten / Snippets:** Bij het tonen van één specifieke regel of alternatief (bijvoorbeeld 2 à 3 regels CSS in een tip- of infoblok).
3. **Geen CodeSandbox aanwezig:** Op theoriepagina's waar voor dat specifieke deelaspect geen interactieve sandbox staat.

Zodra er een `<CodeSandbox>` volgt die het complete geheel (HTML + CSS) bundelt, verwijder je het redundante statische blok en pas je deze skill toe.
