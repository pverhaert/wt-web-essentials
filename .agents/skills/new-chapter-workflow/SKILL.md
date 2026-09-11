---
name: new-chapter-workflow
description: >
  Verplichte werkwijze en goedkeuringsstap voordat je start met het schrijven
  of programmeren van een nieuw cursushoofdstuk voor Web Essentials.
  Gebruik deze skill altijd wanneer de gebruiker een nieuw hoofdstuk aanvraagt
  of verwijst naar een pagina van de oude cursus.
---

# Skill: Werkwijze bij nieuwe hoofdstukken

## Kernregel

Start **nooit** direct met het schrijven van een bestand. Presenteer altijd eerst een gedetailleerd voorstel en wacht op expliciete goedkeuring van de gebruiker.

## Stap-voor-stap workflow

### Stap 1: Voorstel opstellen

Stel een inhoudelijk overzicht op met:

- **Leerdoelen** (concreet en meetbaar, zie skill `page-structure`)
- **Thematische tussenkopjes** (de hoofdsecties van de pagina)
- **Te behandelen theorie** per sectie (kort samengevat)
- **Interactieve CodeSandbox-voorbeelden** die je plant (zie skill `code-examples`)
- **Oefeningen** die de leerstof toetsen

### Stap 2: Voorstel voorleggen

Presenteer het overzicht als leesbare lijst aan de gebruiker. Gebruik geen codeblokken voor het overzicht zelf; schrijf het in gewone markdown.

### Stap 3: Wachten op goedkeuring

Wacht op expliciete goedkeuring ("ga je gang", "akkoord", "start maar") voordat je ook maar één regel van de pagina schrijft.

**Goed:**
> "Hier is mijn voorstel voor het hoofdstuk Tabellen. Na goedkeuring begin ik met schrijven."

**Fout:**
> Direct een volledig `.md`-bestand aanmaken zonder voorstel.

### Stap 4: Schrijven en verifiëren

Nadat de gebruiker akkoord gaat, schrijf je de volledige pagina. Gebruik de `quality-check` skill als afrondingschecklist.

## Werkwijze bij een referentie naar de oude cursus

Wanneer de gebruiker een link of inhoud van de oude cursus meegeeft, analyseer je deze pagina grondig **voordat** je een voorstel doet. Bespreek expliciet:

### Wat je gaat weglaten (en waarom)

Typische redenen:
- Verouderde technieken (bijv. `<center>`, `<font>`, `<table>` voor layout)
- Overbodige ballast of herhaalde uitleg
- Externe afhankelijkheden die niet meer werken
- Engelstalige teksten of instructies

**Goed:**
> "Ik laat de sectie over `<font>` weg omdat die tag al jaren verouderd is en studenten beter direct `font-family` in CSS leren."

**Fout:**
> Stille weglating zonder toelichting.

### Wat je gaat behouden en verbeteren

Beschrijf wat inhoudelijk goed is maar modernisering verdient:
- Theorie die klopt maar compacter kan
- Voorbeelden die statisch zijn maar als CodeSandbox kunnen worden aangeboden
- Teksten die naar de `u`-vorm moeten (omzetten naar `jij`-vorm)

### Wat je gaat toevoegen

Typische toevoegingen voor een modern hoofdstuk:
- Semantische HTML5-elementen
- Toegankelijkheidsaspecten (`alt`, `lang`, ARIA waar relevant)
- Interactieve `<CodeSandbox>`-voorbeelden
- `<abbr>` en `<dfn>` tags voor vaktermen (zie skill `abbr-dfn`)
- Emmet-sneltoetsen voor PhpStorm
- Een `<PageSummary>` referentiekaart (zie skill `page-summary`)

## Voorbeeld van een goed voorstel

> **Voorstel: hoofdstuk "Hyperlinks"**
>
> **Leerdoelen:** Na dit hoofdstuk kan de student...
> - Een interne, externe en ankerlink aanmaken met `<a>`
> - Het verschil uitleggen tussen `href`, `target` en `rel`
> - Een e-maillink en een telefoonlink schrijven
>
> **Structuur:**
> 1. Wat is een hyperlink? (theorie + CodeSandbox met simpele link)
> 2. Interne vs. externe links (verschil `./`, `/`, `https://`)
> 3. Het `target`-attribuut en `rel="noopener"` (veiligheid)
> 4. Ankerlinks (`#id`)
> 5. Speciale links (`mailto:`, `tel:`)
>
> **Oefeningen:** 3 oefeningen waarbij studenten een navigatiemenu bouwen
>
> Akkoord? Dan begin ik met schrijven.

## Voorbeeld van een slecht voorstel

**Fout (te vaag):**
> "Ik ga een pagina over hyperlinks schrijven met uitleg en oefeningen."

**Fout (te snel):**
> Direct starten met code zonder enig voorstel.
