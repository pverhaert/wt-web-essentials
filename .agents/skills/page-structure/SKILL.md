---
name: page-structure
description: >
  Vaste paginastructuur en sjabloon voor elke lespagina in de Web Essentials
  cursus. Beschrijft ook de regels voor het schrijven van goede, meetbare
  leerdoelen. Gebruik deze skill telkens wanneer je een nieuwe cursuspagina
  aanmaakt of een bestaande structureel herziet.
---

# Skill: Paginastructuur en leerdoelen

## Vaste structuur van elke lespagina

Elke lespagina volgt deze vaste volgorde. Wijk hier niet van af.

```
---
title: [Paginatitel]
---

# [Paginatitel]

[Korte, motiverende inleidende alinea]

## Leerdoelen

Na dit hoofdstuk kan je:

- [concreet, meetbaar leerdoel]
- ...

[Theorie met tussenkopjes, codeblokken en CodeSandbox-voorbeelden]

<PageSummary>
...
</PageSummary>

## Oefeningen

[Concrete, stapsgewijze opdrachten]
```

## Toelichting per onderdeel

### Frontmatter

Elke pagina begint met YAML-frontmatter. De `---` mogen **uitsluitend** in de frontmatter staan, nooit als visuele scheiding tussen secties.

```yaml
---
title: Hyperlinks
---
```

### Inleidende alinea

- Maximaal 3-4 zinnen
- Motiverend: waarom is dit onderwerp relevant voor de student?
- Geen opsommingen, geen koppen
- Geen aannames over voorkennis ("Zoals je weet..." is verboden)

**Goed:**
> Met hyperlinks verbind je pagina's en bestanden met elkaar. Ze vormen de ruggengraat van het web: zonder hyperlinks bestaat er geen internet. In dit hoofdstuk leer je alle vormen van links kennen en correct toepassen.

**Fout:**
> Zoals je weet, zijn hyperlinks heel belangrijk. We gaan ze nu bespreken.

### Theoriesecties

- Gebruik `##` voor hoofdsecties en `###` voor subsecties
- Gebruik **nooit** `---` als visuele scheiding tussen kopjes
- Codeblokken en `<CodeSandbox>`-voorbeelden staan direct bij de bijbehorende theorie, niet gebundeld achteraan de pagina

### `<PageSummary>`

- Staat altijd **boven** de `## Oefeningen`-sectie
- Zie de skill `page-summary` voor gedetailleerde instructies

### Oefeningen

- Concreet en stapsgewijs: de student weet exact wat er van hem verwacht wordt
- Gerichte vragen die de leerstof van het hoofdstuk toetsen
- Geen open vragen als enige oefening

## Leerdoelen schrijven

### Regels

Goede leerdoelen zijn:
- **Concreet en meetbaar**: de student (of docent) kan achteraf controleren of het doel bereikt is
- **Actief**: beginnen met een werkwoord
- **Realistisch voor beginners**: geen veronderstelde voorkennis
- **In de jij-vorm**: na de zin "Na dit hoofdstuk kan je:"

### Geschikte werkwoorden

Gebruik werkwoorden die observeerbaar gedrag beschrijven:

| Niveau | Voorbeeldwerkwoorden |
|---|---|
| Kennen | uitleggen, beschrijven, benoemen, omschrijven |
| Toepassen | aanmaken, schrijven, gebruiken, toepassen, instellen |
| Analyseren | vergelijken, onderscheiden, kiezen tussen, herkennen |

### Goede leerdoelen

- "Een ongeordende lijst aanmaken met `<ul>` en `<li>`"
- "Het verschil uitleggen tussen `margin` en `padding`"
- "Een externe en interne hyperlink schrijven met het juiste `href`-attribuut"
- "De `font-family`-eigenschap gebruiken om een lettertypestapel in te stellen"

### Slechte leerdoelen

- "Lijsten begrijpen" — niet meetbaar
- "HTML gebruiken" — te vaag
- "Kennis hebben van het box model" — geen werkwoord, niet concreet
- "Weten wat CSS is" — niet observeerbaar
- "Flexbox" — geen zin, geen werkwoord

## Koppeling aan andere skills

- Codeblokken en CodeSandbox: zie skill `code-examples`
- `<PageSummary>` schrijven: zie skill `page-summary`
- `<abbr>` en `<dfn>` toevoegen: zie skill `abbr-dfn`
- Afbeeldingen plaatsen: zie skill `images`
- Technische naamgeving en links: zie skill `technical-conventions`
