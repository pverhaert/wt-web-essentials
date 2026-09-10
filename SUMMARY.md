# Paginasamenvattingen in Web Essentials

Analyse van vijf mogelijke oplossingen om per cursuspagina een korte samenvatting aan te bieden aan studenten.

---

## Achtergrond

Sommige studenten lezen de volledige cursustekst niet (meer) door wanneer ze oefeningen maken of een concept snel willen opzoeken. Een beknopte samenvatting per pagina kan de drempel verlagen en het leerproces ondersteunen. Hieronder volgen vijf concrete oplossingen, gerangschikt van eenvoudig naar complex.

---

## Oplossing 1: Handmatige samenvatting via een VitePress `details`-container

### Concept

Bovenaan elke `.md`-pagina een inklapbaar blok (`<details>`) plaatsen met een handmatig geschreven samenvatting. VitePress heeft hier geen eigen component voor, maar standaard HTML5 `<details>` en `<summary>` werken perfect in Markdown.

```markdown
<details>
<summary>Korte samenvatting van dit hoofdstuk</summary>

- `<h1>` t/m `<h6>` zijn koppen; gebruik ze altijd hiërarchisch.
- Een paragraaf maak je met `<p>`.
- Tekst benadrukken doe je met `<strong>` (vet) of `<em>` (cursief).

</details>
```

### Moeilijkheidsgraad: 1/5 (zeer eenvoudig)

### Voordelen
- Geen extra code, geen component, geen afhankelijkheden.
- Werkt op alle apparaten en in alle browsers.
- Volledig offline beschikbaar.
- 100% controle over de inhoud van de samenvatting door de docent.
- Geen API-sleutel of studentinstellingen vereist.

### Nadelen
- Handmatig schrijven en onderhouden bij elke pagina-update.
- Geen dynamische of gepersonaliseerde inhoud.
- Stijl van het `<details>`-element is browser-afhankelijk en minimalistisch.
- Studenten moeten zelf het blok openen; het is niet visueel opvallend.

### Aanbeveling
Ideale **tussenoplossing** als snelle start, of als basislaag wanneer geen AI beschikbaar is.

---

## Oplossing 2: Handmatige `<PageSummary>`-component met toggle

### Concept

Een nieuwe Vue-component `PageSummary.vue` die een toggle-knop ("Samenvatting tonen / verbergen") toont bovenaan de pagina. De inhoud van de samenvatting wordt als slot meegegeven in de Markdown. De component onthoudt de voorkeur van de student via `localStorage`.

```markdown
<PageSummary>

- `<h1>` t/m `<h6>` zijn koppen.
- Een paragraaf maak je met `<p>`.

</PageSummary>
```

De component toont een stijlvolle kaart in Thomas More-huisstijl met een knop "Toon samenvatting" / "Verberg samenvatting".

### Moeilijkheidsgraad: 2/5 (eenvoudig)

### Voordelen
- Volledige controle over inhoud en stijl.
- Voorkeur van student wordt onthouden tussen sessies (localStorage).
- Consistent met bestaande componenten in het project.
- Offline beschikbaar, geen API nodig.
- Kan gekoppeld worden aan het bestaande stijlsysteem (Thomas More kleuren).

### Nadelen
- Handmatig schrijven en onderhouden van de samenvatting per pagina.
- Vereist programmeerwerk (nieuw Vue-component + registratie in `index.ts`).
- Bij grote pagina-updates moet ook de samenvatting worden bijgewerkt.

### Aanbeveling
**Beste balans** tussen eenvoud en gebruikerservaring, zonder AI-afhankelijkheid. Ideaal als permanente oplossing naast een AI-optie.

---

## Oplossing 3: AI-samenvatting on-demand via bestaande AI-tutor (sidebar)

### Concept

Gebruik de bestaande `AiAssistant`-drawer. Voeg een knop toe aan elke cursuspagina (of globaal via het `doc-before`-slot in VitePress) met de tekst "Vraag samenvatting op". Bij klikken:

1. Opent de AI-drawer automatisch.
2. Stuurt automatisch een voorgedefinieerde prompt: "Geef me een beknopte samenvatting van de huidige pagina over [paginatitel] in maximaal 5 opsommingspunten."
3. De AI genereert de samenvatting in de bestaande chatinterface.

De page context (`title`, `path`) is al aanwezig in `useAiTutor.ts` via `executeGenerate`.

### Moeilijkheidsgraad: 3/5 (gemiddeld)

### Voordelen
- Bouwt op de bestaande AI-infrastructuur (geen nieuwe API-integratie nodig).
- Samenvatting is dynamisch en altijd up-to-date met de paginainhoud.
- Geen handmatig onderhoud vereist.
- De student kan direct vervolgvragen stellen over de samenvatting.

### Nadelen
- Vereist dat de student een Gemini API-sleutel heeft geconfigureerd.
- De samenvatting staat in de AI-sidebar, niet direct zichtbaar naast de cursustekst.
- Netwerkverbinding vereist: werkt niet offline.
- Afhankelijk van AI-quota (max. 15 verzoeken/minuut bij gratis tier).
- De samenvatting is niet voorspelbaar of controleerbaar door de docent.

### Aanbeveling
Goede aanvulling op oplossing 2, maar **niet als enige oplossing** gezien de API-sleutelvereiste.

---

## Oplossing 4: AI-samenvatting in een overlay modal (nieuw component)

### Concept

Een nieuw Vue-component `AiSummaryModal.vue` dat:

1. Een kleine, vaste knop toont rechtsonder in beeld (naast de bestaande BackToTop-knop), zichtbaar op alle cursuspaginas.
2. Bij klikken: een compacte modal/overlay opent, overlappend op de cursustekst.
3. In de modal wordt automatisch via de Gemini API een samenvatting van de huidige pagina gegenereerd, op basis van de pagina-URL en -titel.
4. De samenvatting wordt gecached in `sessionStorage` (enkel voor de huidige browsersessie), zodat bij herhaald openen geen nieuw API-verzoek wordt gedaan.
5. Als er geen API-sleutel beschikbaar is, toont de modal een vriendelijke melding met een link naar de instellingenpagina.

De modal gebruikt `document.querySelector('.VPDoc .content')` om de daadwerkelijke pagina-inhoud op te halen als context voor de AI.

### Moeilijkheidsgraad: 4/5 (complex)

### Voordelen
- Volledig geintegreerde, visueel aantrekkelijke gebruikerservaring.
- Samenvatting verschijnt direct zichtbaar, zonder van de cursuspagina weg te navigeren.
- Slimme caching: geen onnodige API-verzoeken bij meerdere keren openen.
- Automatische fallback als geen API-sleutel beschikbaar is.
- Past naadloos in de bestaande component-architectuur (vergelijkbaar met `BackToTop.vue` en `PwaNotification.vue`).

### Nadelen
- Significant meer programmeerwerk dan oplossingen 1 t/m 3.
- Vereist een API-sleutel van de student.
- Werkt niet offline.
- De samenvatting is gegenereerd vanuit de DOM-inhoud; de kwaliteit hangt af van de structuur van de pagina en het gekozen AI-model.
- Geen controle door de docent over de precieze inhoud van de samenvatting.

### Aanbeveling
**Meest complete oplossing** mits een AI-sleutel aanwezig is. Combineer met oplossing 2 als fallback.

---

## Oplossing 5: Statische AI-vooraf-gegenereerde samenvattingen via build-script

### Concept

Een Node.js-script dat **bij het bouwen van de cursus** (`npm run build`) automatisch voor elke `.md`-pagina een samenvatting genereert via de Gemini API en opslaat als JSON-bestand (`summaries.json`). De VitePress-site laadt dit JSON-bestand als statisch asset en toont de juiste samenvatting per pagina zonder API-verzoek van de student.

**Workflow:**
1. Build-script leest alle `.md`-bestanden.
2. Per pagina: verstuurt de inhoud naar Gemini API (met docent-API-sleutel).
3. Samenvatting wordt opgeslagen in `public/summaries.json`.
4. Een `PageSummary.vue`-component laadt bij mount het JSON-bestand en toont de samenvatting op basis van de huidige routepad.

### Moeilijkheidsgraad: 5/5 (zeer complex)

### Voordelen
- Geen API-sleutel vereist van studenten.
- Werkt volledig offline na het laden van de site.
- Samenvatting is deterministisch en gecontroleerd (de docent kan ze nakijken en aanpassen in het JSON-bestand).
- Geen runtime-quota-problemen.
- Snelste gebruikerservaring: geen wachttijd bij het openen van de samenvatting.

### Nadelen
- Meest complexe implementatie: vereist een custom build-integratie.
- Bij elke grote pagina-update moet het script opnieuw worden gedraaid.
- Vereist een API-sleutel van de **docent** in de build-omgeving (bijv. als Netlify environment variable).
- Risico op verouderde samenvattingen als het script niet consequent wordt gedraaid.
- Extra build-tijd en API-kosten voor de docent bij elke volledige rebuild.

### Aanbeveling
Ideaal voor een **productieklare, schaalbare aanpak** op lange termijn. Niet geschikt als quick-win.

---

## Vergelijkingstabel

| | Oplossing 1 | Oplossing 2 | Oplossing 3 | Oplossing 4 | Oplossing 5 |
|---|---|---|---|---|---|
| **Type** | Handmatig / HTML | Handmatig / Vue | AI / Sidebar | AI / Modal | AI / Build-script |
| **Moeilijkheid** | 1/5 | 2/5 | 3/5 | 4/5 | 5/5 |
| **API-sleutel student** | Nee | Nee | Ja | Ja | Nee |
| **Offline** | Ja | Ja | Nee | Nee | Ja (na laden) |
| **Onderhoud docent** | Hoog | Hoog | Geen | Geen | Laag |
| **Kwaliteitscontrole** | Volledig | Volledig | Geen | Geen | Gedeeltelijk |
| **UX-kwaliteit** | Basis | Goed | Gemiddeld | Uitstekend | Uitstekend |
| **Nieuwe code** | Geen | Klein | Gemiddeld | Groot | Zeer groot |

---

## Aanbevolen aanpak

Een combinatie van **oplossing 2 + oplossing 4** geeft de beste gebruikerservaring:

- **Oplossing 2** als handmatige basislaag: de docent schrijft een beknopte samenvatting in de `<PageSummary>`-component. Altijd beschikbaar, ook zonder AI, ook offline.
- **Oplossing 4** als AI-verrijking: studenten met een API-sleutel kunnen via een knop een AI-gegenereerde, diepere samenvatting opvragen in een overlay modal.

Dit garandeert dat **alle studenten** een samenvatting kunnen raadplegen, ongeacht of ze de AI-tutor hebben geconfigureerd.
