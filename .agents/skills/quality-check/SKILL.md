---
name: quality-check
description: >
  Verplichte kwaliteitscontrolelijst voor elke cursuspagina in Web Essentials.
  Gebruik deze skill als afrondingsstap nadat je een pagina hebt geschreven
  of aangepast. Loop alle punten systematisch na voordat je het resultaat
  presenteert aan de gebruiker.
---

# Skill: Kwaliteitscontrole

## Wanneer gebruik je deze skill?

Loop deze checklist na **nadat** je een cursuspagina hebt geschreven of significant hebt aangepast. Presenteer het resultaat pas aan de gebruiker nadat je alle punten hebt gecontroleerd.

## Checklist (11 punten)

### 1. Goedkeuring vooraf

- [ ] Is het gedetailleerde inhoudelijke overzicht van de pagina vooraf expliciet goedgekeurd door de gebruiker?
- [ ] Bij verwijzing naar een oude cursus: zijn de keuzes (weglaten / behouden / toevoegen) vooraf besproken?

Zie skill `new-chapter-workflow` voor de volledige werkwijze.

### 2. Leerdoelen

- [ ] Zijn alle leerdoelen concreet en meetbaar?
- [ ] Beginnen ze allemaal met een observeerbaar werkwoord?
- [ ] Staan ze na de zin "Na dit hoofdstuk kan je:"?

**Goed:** "Een ongeordende lijst aanmaken met `<ul>` en `<li>`"
**Fout:** "Lijsten begrijpen"

Zie skill `page-structure` voor volledige richtlijnen.

### 3. Paginastructuur

- [ ] Staat de `<PageSummary>` aanwezig boven de `## Oefeningen`-sectie?
- [ ] Volgt de pagina de vaste structuur (frontmatter → titel → intro → leerdoelen → theorie → PageSummary → oefeningen)?

Zie skill `page-structure` en skill `page-summary`.

### 4. Codeblokken en CSS3 Progressiematrix

- [ ] Zijn alle codeblokken voorzien van de juiste taalannotatie (` ```html `, ` ```css `, enz.)?
- [ ] Zijn alle CodeSandbox-voorbeelden voorzien van de volledige HTML-structuur?
- [ ] Bevatten alle `<CodeSandbox>`-componenten **alle 10 props in de exacte vaste volgorde** (ook als ze leeg zijn: `title`, `height`, `initialTab`, `activeCodeTab`, `highlightHtml`, `highlightCss`, `highlightJs`, `html`, `css`, `js`)?
- [ ] Zijn in `highlightCss` (en/of `highlightHtml`) de belangrijkste regels van de les daadwerkelijk gemarkeerd (bijv. de declaratie én het gebruik van CSS-variabelen, of de display/boxmodel eigenschappen)?
- [ ] Voldoen alle CSS-voorbeelden aan de **CSS3 Progressiematrix** (zie `code-examples`):
  - [ ] Geen CSS-eigenschappen gebruikt uit latere, nog niet behandelde hoofdstukken?
  - [ ] Vanaf *Kleuren*: expliciete `font-family` op de `body` (Segoe UI of Arial stack)?
  - [ ] Vanaf *Box Model*: universele resetter bovenaan (`* { box-sizing: border-box; margin: 0; padding: 0; }`)?
  - [ ] Vanaf *CSS Variabelen*: variabelen via `:root` en `var()` toegepast waar zinvol?
  - [ ] Vanaf *Display*: knoppen/inline-elementen met afmetingen voorzien van `display: inline-block` of `block`?
  - [ ] Vanaf *Afbeeldingen*: afbeeldingen voorzien van `max-width: 100%; height: auto` of `object-fit: cover`?

Zie skill `code-examples`.

### 5. Taal en stijl

- [ ] Zijn er **geen emoji's** in de tekst?
- [ ] Zijn er **geen en-streepjes** (--) of **em-streepjes** (---) als leestekens?
- [ ] Zijn er **geen `---`** tussen titels of secties (alleen frontmatter bovenaan)?
- [ ] Wordt de **jij-vorm** consequent gebruikt (niet "u", niet "jullie")?
- [ ] Staan er geen zinnen die beginnen met "Uiteraard", "Zoals je weet" of "Vanzelfsprekend"?

### 6. Technische termen

- [ ] Worden alle technische termen en afkortingen bij de eerste vermelding uitgelegd?
- [ ] Zijn afkortingen voorzien van `<abbr title="...">` bij de eerste vermelding?
- [ ] Zijn nieuwe begrippen voorzien van `<dfn title="...">` bij de introductie?
- [ ] Wordt nergens `<KeyTerm>` of een vergelijkbaar zelfbedacht component gebruikt?

Zie skill `abbr-dfn`.

### 7. CSS-beperkingen

- [ ] Gebruiken alle codeblokken, oefeningen en CodeSandboxen uitsluitend CSS-eigenschappen uit het huidige of voorgaande hoofdstukken?
- [ ] Zijn eventuele uitzonderingen vooraf besproken en goedgekeurd?

Zie skill `code-examples` voor de lijst van verboden eigenschappen per fase.

### 8. Links

- [ ] Zijn alle interne links relatief (geen absolute URL's naar de live site)?
- [ ] Zijn er zinvolle externe links naar MDN, W3C of andere relevante documentatie?

Zie skill `technical-conventions`.

### 9. Afbeeldingen

- [ ] Heeft elke afbeelding een beschrijvende `alt`-tekst?
- [ ] Staan afbeeldingen in een `images/`-map naast het `.md`-bestand?
- [ ] Worden bij voorkeur WebP (foto's) of SVG (diagrammen) gebruikt?

Zie skill `images`.

### 10. Campus en locatie

- [ ] Wordt nergens "Campus De Nayer" of "Sint-Katelijne-Waver" vermeld?
- [ ] Als er een adres of campusnaam staat: is dit altijd "Thomas More Campus Geel (Kleinhoefstraat 4, 2440 Geel)"?

### 11. Git

- [ ] Zijn er geen nieuwe Git-branches aangemaakt door de AI?
- [ ] Is er niet gepusht naar GitHub door de AI?

## Na de controle

Presenteer het resultaat aan de gebruiker. Als er punten zijn die je niet kon controleren (bijv. omdat je een bestaande pagina hebt aangepast die al leerdoelen had), geef dat dan expliciet aan.
