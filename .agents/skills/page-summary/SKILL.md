---
name: page-summary
description: >
  Schrijf een beknopte paginasamenvatting voor een cursushoofdstuk in de
  Web Essentials cursus van Thomas More Hogeschool. De samenvatting dient
  als compacte referentiekaart die de student kan raadplegen tijdens het
  maken van oefeningen, zonder de volledige cursustekst opnieuw te hoeven
  lezen.
---

# Skill: Paginasamenvatting schrijven (`<PageSummary>`)

## Doel

Elke cursuspagina van Web Essentials kan een optionele `<PageSummary>`-sectie bevatten. Dit is een inklapbare referentiekaart onderaan de pagina (boven de oefeningen) die de student gebruikt als spiekbriefje tijdens oefeningen en herhaling.

De samenvatting vervangt de volledige cursustekst **niet**. Ze is bewust compact en gestructureerd: geen uitgebreide uitleg, geen codeblokken, maar gerichte overzichten, regels en tips.

---

## Wanneer gebruik je deze skill?

Activeer deze skill wanneer:
- Je een nieuw cursushoofdstuk schrijft of bijwerkt en er nog geen `<PageSummary>` aanwezig is.
- De gebruiker vraagt om een samenvatting toe te voegen aan een bestaand hoofdstuk.
- Je een bestaande samenvatting wilt herzien na een grote inhoudelijke update van de cursuspagina.

---

## Werkwijze (verplichte stappen)

### Stap 1: Lees de volledige cursuspagina

Lees eerst de volledige `.md`-pagina grondig door voordat je iets schrijft. Let op:
- De leerdoelen (zijn de kernconcepten aanwezig in de samenvatting?)
- De theorie-onderdelen en tussenkopjes (wat zijn de centrale concepten?)
- De oefeningen (welke kennis moet de student paraat hebben?)
- Bestaande `::: warning` en `::: danger` containers (veelgemaakte fouten!)

### Stap 2: Stel de samenvatting samen

Gebruik altijd de **vijfdelenstructuur** (zie hieronder). Laat secties weg als ze leeg zouden zijn, maar houd de volgorde aan.

### Stap 3: Verwerk in de `.md`-pagina

Voeg de samenvatting in **boven de `## Oefeningen`-sectie** als volgt:

```markdown
<PageSummary>

[inhoud van de samenvatting]

</PageSummary>

## Oefeningen
```

---

## Vaste structuur van een samenvatting

Een `<PageSummary>` bestaat altijd uit maximaal vijf genummerde secties, in deze volgorde. Gebruik `### ` (h3) voor elk sectionhoofd.

### 1. Syntaxis in een oogopslag (tabel)

Gebruik een Markdown-tabel met drie kolommen: **Wat**, **Hoe** en **Voorbeeld**.
- "Wat": een korte naam voor het concept of de eigenschap
- "Hoe": de syntaxis of het patroon
- "Voorbeeld": een minimale, concrete toepassing

Richtlijnen:
- Max. 8-10 rijen. Meer = te veel.
- Gebruik backticks voor alle syntaxis en voorbeelden.
- Geen uitleg in de tabel zelf: de tabel is puur visueel geheugensteun.

Gebruik een tabel enkel als er duidelijk syntaxis of eigenschappen te vergelijken zijn (HTML-tags, CSS-properties, enz.). Bij conceptuele hoofdstukken kan je de tabel weglaten of vervangen door een korte opsomming.

### 2. Regels en naamgeving (lijstje)

Een compacte bulletlijst met de **do's en don'ts** voor correct gebruik.
- Schrijf elke bullet als een concrete, actieve regel.
- Gebruik **vette tekst** voor het sleutelwoord.
- Max. 6 bullets. Kies de meest essentiële regels.

### 3. Veelgemaakte fouten (lijstje)

Een lijstje met **3-5 concrete beginnerfouten** die in de oefeningen vaak voorkomen.
- Elke bullet beschrijft de fout en de correcte aanpak in een of twee zinnen.
- Haal inspiratie uit de bestaande `::: warning` en `::: danger`-containers op de pagina.
- Formuleer als: "Vergeten dat..." / "... weglaten, terwijl ..." / "... verwarren met ..."

### 4. Tips voor beginners (lijstje)

**2-4 praktische tips** die de student helpen efficiënter te werken.
- Gericht op workflow, DevTools, PhpStorm-sneltoetsen of slimme gewoontes.
- Geen herhaling van theorie. Dit zijn pro-tips die de student zelfstandig sneller maken.

### 5. Optionele extra sectie (indien van toepassing)

Voeg een vijfde sectie toe als het hoofdstuk een extra dimensie heeft die een apart blok verdient, zoals:
- "Semantisch gebruik" voor HTML-tags met specifieke semantische regels
- "Wanneer gebruik je wat?" voor een keuzetabel (bijv. `margin` vs. `padding`)
- "Sneltoetsen in PhpStorm" als het hoofdstuk veel Emmet-snelkoppelingen bevat

---

## Taal- en stijlregels

Volg alle regels uit AGENTS.md (zie projectroot). Aanvullend voor samenvattingen:

- Schrijf in de **jij-vorm**, actief en direct.
- Gebruik **geen volledige cursustekst**: geen uitleg, geen voorbeeldcode in codeblokken, geen contextparagrafen.
- Gebruik **inline code** (backtick) voor alle technische termen, syntaxis, tags en eigenschappen.
- Geen emoji's. Geen en-streepjes of em-streepjes als leesteken.
- Houd elke bullet zo kort mogelijk: liefst een zin, max. twee.
- De volledige samenvatting moet **op een scherm passen** (max. ca. 40 regels Markdown-inhoud).

---

## Sjabloon om te kopieren

```markdown
<PageSummary>

### Syntaxis in een oogopslag

| Wat | Hoe | Voorbeeld |
|---|---|---|
| ... | `...` | `...` |

### Regels en naamgeving

- **Regel 1:** ...
- **Regel 2:** ...

### Veelgemaakte fouten

- Vergeten dat ...
- ... weglaten, terwijl het verplicht is wanneer ...
- ... verwarren met ...; het verschil is ...

### Tips voor beginners

- ...
- Open de DevTools (`F12`) en ... om snel ... te controleren.

</PageSummary>

## Oefeningen
```

---

## Bestaand voorbeeld

Zie `css/variabelen.md` voor de eerste uitgewerkte samenvatting als referentie.

---

## Technische nota

De `<PageSummary>`-component is gedefinieerd in:
`.vitepress/theme/components/PageSummary.vue`

De component is globaal geregistreerd in `.vitepress/theme/index.ts` en is direct beschikbaar in alle `.md`-bestanden zonder extra import. De open/dicht-voorkeur van de student wordt opgeslagen via `localStorage` (sleutel: `we_page_summary_open`) en blijft bewaard tussen paginawissels en sessies.
