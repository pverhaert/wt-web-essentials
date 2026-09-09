# EXTRAS.md — Interactieve uitbreidingen voor de Web Essentials cursus

Dit document bevat ideeën voor interactieve Vue-componenten die de cursus verrijken en de studenten helpen om HTML5 en CSS3 beter te begrijpen via hands-on experimenteren.  
**Geen van deze functies is momenteel geïmplementeerd.** Dit document dient als planningsdocument.

---

## Overzicht

| # | Geïmplementeerd | Moeilijkheidsgraad | Korte omschrijving |
|---|:---:|---|---|
| 1 | [ ] | Eenvoudig | **Kleurenconvertor** — Zet HEX, RGB en HSL live naar elkaar om met een kleurenkiezer |
| 2 | [ ] | Eenvoudig | **Speciale-tekens zoekmachine** — Doorzoekbare tabel van HTML-entiteiten met kopieerknop |
| 3 | [ ] | Eenvoudig | **CSS Eenheden Omzetter** — Zet px naar rem/em/vw/vh om op basis van een instelbare rootgrootte |
| 4 | [ ] | Gemiddeld | **Box Model Visualizer** — Toon margin, border, padding en content interactief met live CSS-output |
| 5 | [ ] | Gemiddeld | **CSS Specificiteitsberekening** — Voer een CSS-selector in en zie de specificiteitswaarde met uitleg |
| 6 | [ ] | Gemiddeld | **Typografische Schaal Viewer** — Pas font-size, line-height en font-family aan en zie de verhoudingen live |
| 7 | [ ] | Gemiddeld | **CSS Gradient Generator** — Genereer lineaire en radiale verlopen met live preview en CSS-code |
| 8 | [ ] | Gemiddeld | **Flexbox Speelplaats** — Pas alle flexbox-eigenschappen aan op een live container met items |
| 9 | [ ] | Gemiddeld | **CSS Grid Builder** — Bouw een grid-layout visueel op en genereer de bijbehorende CSS-code |
| 10 | [ ] | Complex | **Responsieve Simulator** — Bekijk een URL of eigen HTML in vooringestelde schermbreedtes (mobiel, tablet, desktop) |
| 11 | [ ] | Complex | **CSS Selector Tester** — Voer een CSS-selector in op een live HTML-fragment en zie welke elementen oplichten |
| 12 | [ ] | Complex | **HTML/CSS Linting Sandbox** — Typ HTML en CSS en ontvang inline foutmeldingen en verbeteringstips |

---

## Gedetailleerde beschrijvingen en implementatie-instructies

---

### 1. Kleurenconvertor

**Doel:** Studenten die werken met CSS-kleuren begrijpen snel dat HEX, RGB en HSL drie notaties zijn voor dezelfde kleur. Deze tool laat hen live wisselen tussen formaten.

**Functionaliteiten:**
- Een kleurenkiezer (`<input type="color">`) als centraal invoerelement.
- Drie tekstvelden die live bijgewerkt worden: HEX (`#e87722`), RGB (`rgb(232, 119, 34)`) en HSL (`hsl(28, 80%, 52%)`).
- Elke waarde is bewerkbaar: wijzig je de RGB-waarde, dan past de HEX en HSL zich direct aan.
- Een kopieerknop naast elk veld.
- Een vierkant kleurblok dat de geselecteerde kleur toont.

**Implementatie:**
- Bestandsnaam: `ColorConverter.vue`
- State: één reactieve kleur opgeslagen als HSL of RGB intern; afgeleid naar de andere formaten via `computed`.
- Conversiefuncties: `hexToRgb`, `rgbToHsl`, `hslToHex` in het `<script setup>`-blok.
- Integratie: op de CSS-pagina `/css/kleuren.md`, na de theorie over kleurnotaties.
- Geen externe afhankelijkheden.

---

### 2. Speciale-tekens zoekmachine

**Doel:** De pagina `/html/speciale-tekens` bevat momenteel een statische tabel. Een doorzoekbare versie helpt studenten snel de juiste entiteit te vinden voor elk speciaal teken.

**Functionaliteiten:**
- Een zoekveld bovenaan; de tabel filtert live op naam, teken of entiteitscode.
- Kolommen: Teken | HTML-entiteit | Decimale code | Omschrijving.
- Kopieerknop naast elke rij (kopieert de HTML-entiteit naar het klembord).
- Categoriefilter (Wiskundige symbolen, Valuta, Leestekens, Accenten, Pijlen, ...).
- De dataset (minstens 100 tekens) staat als JSON-array in het `<script setup>`-blok.

**Implementatie:**
- Bestandsnaam: `SpecialCharsSearch.vue`
- State: `searchQuery` (ref), `activeCategory` (ref), gefilterde lijst als `computed`.
- Dataset: JSON-array met objecten `{ char, entity, decimal, description, category }`.
- Integratie: vervangt de statische tabel op `/html/speciale-tekens.md`.
- Geen externe afhankelijkheden.

---

### 3. CSS Eenheden Omzetter

**Doel:** Eerstejaars studenten worstelen vaak met de verhouding tussen `px`, `rem`, `em`, `vw` en `vh`. Deze tool maakt de relatie concreet en aanpasbaar.

**Functionaliteiten:**
- Invoer: een pixelwaarde en een instelbare `root font-size` (standaard 16 px).
- Output: de equivalente waarde in `rem`, `em` (ten opzichte van een instelbare parent-grootte), `vw` en `vh` (ten opzichte van een instelbaar viewport).
- Live bijwerking bij elke invoerwijziging.
- Visuele balk die de verhouding toont ten opzichte van de rootgrootte.

**Implementatie:**
- Bestandsnaam: `UnitConverter.vue`
- Alle berekeningen via `computed`-properties; geen externe afhankelijkheden.
- Integratie: op de CSS-pagina `/css/lettertypen.md` of een toekomstige pagina over CSS-eenheden.

---

### 4. Box Model Visualizer

**Doel:** Het CSS Box Model is een van de moeilijkste concepten voor beginners. Een interactief diagram maakt het direct voelbaar.

**Functionaliteiten:**
- Vier instelbare waarden via sliders of invoervelden: `margin`, `border`, `padding` en de afmeting van de `content` (breedte x hoogte).
- Een genest, gekleurde rechthoekweergave (geel = margin, oranje = border, groen = padding, blauw = content) die live meebeweegt.
- Bijbehorende CSS-code die live gegenereerd wordt en gekopieerd kan worden.
- Optioneel: keuze tussen `box-sizing: content-box` en `box-sizing: border-box` met uitleg van het verschil in de berekende totaalbreedte.

**Implementatie:**
- Bestandsnaam: `BoxModelVisualizer.vue`
- State: vier `ref`-waarden (`margin`, `border`, `padding`, `contentW`, `contentH`).
- Weergave: geneste `<div>`-elementen met inline `:style`-bindingen.
- Integratie: op de CSS-pagina `/css/box-model.md`, direct na de uitleg van het box model.
- Geen externe afhankelijkheden.

---

### 5. CSS Specificiteitsberekening

**Doel:** CSS-specificiteit is abstract. Een berekener die de score opsplitst in `(id, class, element)` maakt het begrip tastbaar.

**Functionaliteiten:**
- Tekstveld: voer een CSS-selector in (bijv. `#nav .item > a:hover`).
- Live weergave van de specificiteitscore als `(a, b, c)` tabel met kleurcodering.
- Uitleg per onderdeel: welke deelselector levert hoeveel punten op.
- Vergelijkingsmodus: voer twee selectors in en zie welke specificieker is.

**Implementatie:**
- Bestandsnaam: `SpecificityCalculator.vue`
- Parser: reguliere expressies om het aantal `#`-id'`s, `.`-klassen, `:pseudo-classes`, `[attr]`-attributen en elementen te tellen.
- Geen externe CSS-parser nodig voor de basisimplementatie.
- Integratie: op een toekomstige pagina over CSS-selectors of op `/css/`.

---

### 6. Typografische Schaal Viewer

**Doel:** Typografie is een van de eerste dingen die studenten aanpassen. Een live preview helpt hen de impact van keuzes direct te zien.

**Functionaliteiten:**
- Schuifregelaars voor `font-size` (basis), `line-height` en `letter-spacing`.
- Keuzelijst voor `font-family` (systeem-fonts + een aantal Google Fonts geladen via `<link>`).
- Preview van alle `<h1>` t/m `<h6>` plus bodytekst met een lipsumtekst.
- Gegenereerde CSS-code (voor de `body`-selector) die gekopieerd kan worden.
- Optioneel: keuze tussen een lichte en donkere achtergrond voor de preview.

**Implementatie:**
- Bestandsnaam: `TypographyViewer.vue`
- Google Fonts: laad een beperkte set via `<link rel="stylesheet">` in de `onMounted`-hook.
- State: `fontSize`, `lineHeight`, `letterSpacing`, `fontFamily` als `ref`.
- Integratie: op `/css/lettertypen.md` of `/css/webfonts.md`.

---

### 7. CSS Gradient Generator

**Doel:** Verlopen zijn visueel aantrekkelijk en studenten experimenteren er graag mee. Een generator verlaagt de drempel en toont de CSS-syntax direct.

**Functionaliteiten:**
- Keuze tussen `linear-gradient` en `radial-gradient`.
- Toevoeging en verwijdering van kleurstops (minimaal 2) met kleurenkiezers en positiewaarden.
- Instelbare hoek (voor lineaire verlopen) of vorm en positie (voor radiale verlopen).
- Live preview in een groot rechthoekig vlak.
- Gegenereerde CSS-code die gekopieerd kan worden.

**Implementatie:**
- Bestandsnaam: `GradientGenerator.vue`
- State: `type` (linear/radial), `angle`, `stops[]` (elk `{ color, position }`).
- CSS-string wordt samengesteld via een `computed`-property.
- Integratie: op `/css/kleuren.md` of `/css/afbeeldingen.md` (bij achtergrondkleuren).
- Geen externe afhankelijkheden.

---

### 8. Flexbox Speelplaats

**Doel:** Flexbox heeft veel eigenschappen die onderling samenhangen. Een live omgeving laat studenten elke combinatie uitproberen zonder een editor te openen.

**Functionaliteiten:**
- Container-instellingen: `flex-direction`, `flex-wrap`, `justify-content`, `align-items`, `align-content`, `gap`.
- Item-instellingen (per geselecteerd item): `flex-grow`, `flex-shrink`, `flex-basis`, `align-self`, `order`.
- Visuele preview van de container met 3 tot 6 aanpasbare items (voeg items toe of verwijder ze).
- Gegenereerde CSS-code voor zowel de container als het geselecteerde item.

**Implementatie:**
- Bestandsnaam: `FlexboxPlayground.vue`
- State: `containerProps` (object), `items[]` (array van objecten), `selectedItemIndex`.
- CSS-string voor container en item via `computed`.
- Integratie: op `/css/flexbox.md`, als centraal interactief element van die pagina.
- Geen externe afhankelijkheden.

---

### 9. CSS Grid Builder

**Doel:** CSS Grid is krachtiger maar ook complexer dan Flexbox. Een visuele builder helpt studenten de structuur van rijen en kolommen intuïtief te begrijpen.

**Functionaliteiten:**
- Instelbaar aantal kolommen en rijen (1 tot 6).
- Instelbare `column-gap`, `row-gap` en kolombreedtes (bijv. `1fr`, `200px`, `auto`).
- Klik op cellen om ze samen te voegen (`grid-column-span`, `grid-row-span`).
- Live preview van de gemaakte grid met genummerde cellen.
- Gegenereerde CSS-code (`grid-template-columns`, `grid-template-rows`, `gap`) die gekopieerd kan worden.

**Implementatie:**
- Bestandsnaam: `GridBuilder.vue`
- State: `columns[]`, `rows[]`, `cells[]` (met span-informatie).
- Rendering: `display: grid` met inline `:style`-bindingen op de container.
- Integratie: op `/css/grid.md`.
- Geen externe afhankelijkheden.

---

### 10. Responsieve Simulator

**Doel:** Studenten leren media queries schrijven, maar zien het resultaat doorgaans pas in de DevTools. Een ingebouwde simulator maakt responsive design direct zichtbaar binnen de cursus.

**Functionaliteiten:**
- Een `<iframe>` die een door de student ingevoerde URL (of de eigen cursuspagina's) weergeeft.
- Vooringestelde presets: Mobiel (375 px), Tablet (768 px), Laptop (1280 px), Desktop (1920 px).
- Vrij aanpasbare breedte via een schuifregelaar of invoerveld.
- Weergave van de huidige breedte in pixels boven de iframe.
- Optioneel: rotatiemodus (portret/landschap) voor mobiele presets.

**Implementatie:**
- Bestandsnaam: `ResponsiveSimulator.vue`
- De `<iframe>` krijgt een dynamische `width`-stijl via `:style`.
- Beperkingen: externe URL's kunnen door CSP/X-Frame-Options geblokkeerd worden; documenteer dit in een `:::warning`-blok op de pagina.
- Integratie: op `/css/media-queries.md`.

---

### 11. CSS Selector Tester

**Doel:** Studenten begrijpen pas echt hoe CSS-selectors werken als ze ze kunnen testen op echte HTML. Deze tool combineert een HTML-editor en een selectorinvoer met live markering.

**Functionaliteiten:**
- Linkerpaneel: een bewerkbaar HTML-fragment (standaard een klein voorbeelddocument).
- Bovenpaneel: een invoerveld voor een CSS-selector.
- Rechterpaneel: een live preview van het HTML-fragment waarbij overeenkomende elementen gehighlight worden (gele achtergrond of rode rand).
- Aantal gevonden overeenkomsten wordt weergegeven.
- Foutmelding als de selector syntactisch ongeldig is.

**Implementatie:**
- Bestandsnaam: `SelectorTester.vue`
- Gebruik `document.querySelectorAll()` op een verborgen of gesandboxte DOM-structuur (bijv. een `<div ref="previewRoot">` met `v-html`).
- Highlight via het toevoegen van een CSS-klasse aan gevonden elementen.
- Veiligheid: beperk de `v-html` tot een voorgedefinieerde, gesaniteerde template; voeg geen `<script>`-tags toe.
- Integratie: op een pagina over CSS-selectors of als bonustool op `/css/`.

---

### 12. HTML/CSS Linting Sandbox

**Doel:** Studenten maken typische fouten zoals ontbrekende afsluitende tags, verkeerde nestelingsorde of ongeldige CSS-waarden. Een inline linter geeft direct feedback zonder externe tools.

**Functionaliteiten:**
- Twee editorpanelen (HTML en CSS) op basis van een lichtgewicht `<textarea>` of CodeMirror 6 (al aanwezig als afhankelijkheid).
- Een live preview (`<iframe srcDoc>`).
- Een foutenpaneel onder de editors met fouttype, regelnummer en een korte uitleg.
- HTML-validatie: gebruik de `DOMParser` API om parse-fouten op te vangen.
- CSS-validatie: gebruik `CSSStyleSheet` / `CSS.supports()` voor basiscontrole van eigenschappen en waarden.
- Optioneel: suggesties voor veelgemaakte fouten (bijv. `colour` in plaats van `color`).

**Implementatie:**
- Bestandsnaam: `LintingSandbox.vue`
- HTML-linting: `new DOMParser().parseFromString(html, 'text/html')` — controleer `querySelectorAll('parsererror')`.
- CSS-linting: parseer elke regel via `new CSSStyleSheet()` (met `try/catch`) of reguliere expressies voor basiscontrole.
- Preview: `<iframe :srcdoc="combinedOutput">` waarbij `combinedOutput` een `computed` is van HTML + `<style>`-tag met de CSS.
- Integratie: als geavanceerde oefentool op de introductie-pagina's van `/html/` en `/css/`.
- Afhankelijkheid: CodeMirror 6 (al aanwezig in het project).

---

*Laatste update: september 2026*
