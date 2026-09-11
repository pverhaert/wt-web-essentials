---
name: abbr-dfn
description: >
  Richtlijnen voor het gebruik van de semantische HTML-tags <abbr> en <dfn>
  in de cursusteksten van Web Essentials. Gebruik deze skill telkens wanneer
  je afkortingen of nieuwe vaktermen introduceert op een cursuspagina.
---

# Skill: Gebruik van `<abbr>` en `<dfn>`

## Doel

De Web Essentials cursus gebruikt `<abbr>` en `<dfn>` om studenten direct de officiële HTML5-semantiek in de praktijk te tonen en om interactieve tooltips in Thomas More-huisstijl te activeren.

## Wanneer gebruik je `<abbr>`?

Gebruik `<abbr title="...">` bij de **eerste vermelding** van een afkorting of acroniem in een tekst. Daarna schrijf je de afkorting gewoon zonder tag.

**Goed:**
```html
<abbr title="HyperText Markup Language: de standaard opmaaktaal voor webpagina's">HTML</abbr>
is de taal van het web.
```

**Fout:**
```html
HTML (HyperText Markup Language) is de taal van het web.
```

**Fout (te vaak herhalen):**
```html
<!-- Niet elke keer <abbr> herhalen: -->
<abbr title="...">HTML</abbr> ... <abbr title="...">HTML</abbr> ... <abbr title="...">HTML</abbr>
```

## Wanneer gebruik je `<dfn>`?

Gebruik `<dfn title="...">` wanneer een nieuw technisch **begrip of concept voor het eerst gedefinieerd** wordt in de tekst. De `title` bevat de definitie.

**Goed:**
```html
<dfn title="De volgorde en regels waarmee browsers bepalen welke CSS-stijlregel voorrang krijgt">de Cascade</dfn>
is een van de kernprincipes van CSS.
```

**Fout:**
```html
De cascade is een van de kernprincipes van CSS.
<!-- Geen dfn bij eerste introductie van het begrip -->
```

## Verschil tussen `<abbr>` en `<dfn>`

| Tag | Gebruik voor | Voorbeeld |
|---|---|---|
| `<abbr>` | Afkorting of acroniem | `HTML`, `CSS`, `W3C`, `URL`, `SEO` |
| `<dfn>` | Nieuw concept of vakterm | "het box model", "de cascade", "een ankerlink" |

Een woord kan zelden beide zijn. Als een afkorting ook een nieuw concept introduceert, gebruik je `<abbr>` (de uitgeschreven vorm in `title` is voldoende uitleg).

## Veelgebruikte afkortingen met correcte `title`

| Afkorting | `title`-waarde |
|---|---|
| HTML | `HyperText Markup Language: de standaard opmaaktaal voor webpagina's` |
| CSS | `Cascading Style Sheets: de stijlen- en opmaaktaal voor het web` |
| W3C | `World Wide Web Consortium: de officiële internationale standaardiseringsorganisatie voor het web` |
| DOM | `Document Object Model: de boomstructuur van HTML-elementen` |
| URL | `Uniform Resource Locator: het adres van een webpagina of bestand` |
| SEO | `Search Engine Optimization: het optimaliseren van een website voor zoekmachines` |
| SVG | `Scalable Vector Graphics: een XML-gebaseerd formaat voor vectorafbeeldingen` |
| PNG | `Portable Network Graphics: een verliesvrij rasterafbeeldingsformaat` |
| JPEG | `Joint Photographic Experts Group: een compressieformaat voor foto's` |
| GIF | `Graphics Interchange Format: een rasterformaat dat animaties ondersteunt` |
| CDN | `Content Delivery Network: een gedistribueerd netwerk van servers voor snellere bestandslevering` |
| API | `Application Programming Interface: een interface voor communicatie tussen softwarecomponenten` |
| HEX | `Hexadecimaal: een talstelsel met grondtal 16, gebruikt voor kleurnotatie in CSS` |
| RGB | `Red Green Blue: een additief kleurmodel op basis van rood, groen en blauw licht` |
| HSL | `Hue Saturation Lightness: een kleurmodel op basis van tint, verzadiging en helderheid` |
| DRY | `Don't Repeat Yourself: het principe om herhaling in code te vermijden` |
| WCAG | `Web Content Accessibility Guidelines: internationale richtlijnen voor toegankelijke webcontent` |
| UTF-8 | `Unicode Transformation Format 8-bit: de meest gebruikte tekencodering voor het web` |
| PDF | `Portable Document Format: een bestandsformaat voor documentuitwisseling` |
| RFC | `Request for Comments: een officieel document met technische internetstandaarden` |

## Wat nooit te gebruiken

Gebruik **nooit** zelfbedachte componenten zoals `<KeyTerm>`, `<Tooltip>`, `<Callout>` of vergelijkbare wrappers. Vertrouw altijd op de standaard semantische tags `<abbr>` en `<dfn>`.

**Fout:**
```html
<KeyTerm definition="...">CSS</KeyTerm>
```

**Goed:**
```html
<abbr title="Cascading Style Sheets: de stijlen- en opmaaktaal voor het web">CSS</abbr>
```

## Technische achtergrond

De interactieve tooltips worden verzorgd door het `TermTooltip.vue`-component dat globaal gemonteerd is in `.vitepress/theme/index.ts`. Het luistert naar alle `abbr[title]`- en `dfn[title]`-elementen en toont een tooltip in Thomas More-huisstijl (oranje kader). Geen extra configuratie nodig.
