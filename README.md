# Web Essentials

Nederlandstalige basiscursus HTML5 en CSS3 voor eerstejaars ICT-studenten van Thomas More Hogeschool (Campus Geel).

De cursus leidt studenten stap voor stap van een blanco pagina naar volwaardige, gestileerde en responsieve webpagina's. Naast HTML en CSS worden ook praktische tools en workflows behandeld zoals PhpStorm, Git en browser DevTools.

Live website: [https://wt-web-essentials.netlify.app](https://wt-web-essentials.netlify.app)

## Belangrijkste features

- **Interactieve CodeSandbox (met Fullscreen-modus):**
  - Live bewerken en previewen van HTML, CSS en JavaScript via CodeMirror 6.
  - Ingebouwde Emmet-ondersteuning voor snelle HTML- en CSS-afkortingen.
  - Regelmarkering (`highlightHtml`, `highlightCss`) om sleutelconcepten te belichten.
  - Fullscreen Sandbox (`/sandbox`) met gestapelde editors en versleepbare splitters om HTML en CSS tegelijkertijd te bewerken.

- **Uitgebreide interactieve simulators & labs:**
  - **Flexbox & Grid labs:** `FlexAxisViewer`, `FlexAlignmentLab`, `FlexGrowShrinkVisualizer`.
  - **Animaties & Transities:** `TransitionSimulator`, `AnimationSimulator`, `Transform2dSimulator`, `Transform3dSimulator`.
  - **Typografie & Lay-out:** `GoogleFontsSimulator`, `LineHeightGame`, `DisplayVisualizer`, `PositioningSimulator`, `VerticalAlignLab`.
  - **Media & Kleuren:** `ImageFormatComparator`, `ObjectFitSimulator`, `BackgroundHeroSimulator`, `ColorConverter`, `MiniColorPicker`, `FaviconGenerator`.
  - **Tabellen & UI:** `TableWorkbench`, `ButtonBuilder`, `GitWorkflowDiagram`.

- **Cursusmarkeringen & Notities (Annotations):**
  - Tekst selecteren en markeren in 5 herkenbare kleuren (geel, groen, blauw, roze, oranje).
  - Persoonlijke notities toevoegen aan geselecteerde tekstfragmenten.
  - Slide-over zijbalk en een centrale overzichtspagina (`/annotations`) met groepering per pagina.
  - Exporteren en importeren van notities via JSON.

- **Geïntegreerde AI Cursusassistent:**
  - Persoonlijke AI-studieassistent aangedreven door de officiële Google Gemini API (`@google/genai`).
  - Configureerbare instellingen (`/tools/ai-assistent`): eigen API-sleutel invoeren, studentnaam instellen en modelkeuze (bijv. Gemini 2.5 Flash / Pro).
  - Direct contextgevoelige vragen stellen via een slide-over chatvenster.

- **Samenvattingskaarten per lespagina (`<PageSummary>`):**
  - Inklapbare referentiekaarten onderaan elke theoriepagina met een syntaxistabel, veelgemaakte fouten en handige tips voor beginners.
  - Zwevende `PageSummaryModal` knop om de samenvatting snel op te roepen tijdens het maken van oefeningen.

- **Semantische tooltips voor vaktermen en afkortingen:**
  - Geautomatiseerde en consistente styling voor `<abbr>` en `<dfn>` tags met Thomas More-huisstijl tooltips (`TermTooltip`).

- **Progressive Web App (PWA) & Offline ondersteuning:**
  - Volledige offline beschikbaarheid en caching via Service Workers (`vite-plugin-pwa` en Workbox).
  - Discrete updatemelding (`PwaNotification`) zodra er op de achtergrond een nieuwe cursusversie klaarstaat.
  - Installeerbaar als desktop- of mobiele app.

- **AI-vriendelijke cursusdocumentatie (LLM-ready):**
  - Automatische generatie van `llms.txt`, `llms-full.txt` en `course-topics.json` tijdens het bouwen voor optimale ondersteuning van AI-studieassistenten en tooling.

## Gebruikte technologieën

### Framework & Platform
- **[VitePress](https://vitepress.dev/):** Moderne, snelle static site generator aangedreven door Vite en Vue 3.
- **[Vue 3](https://vuejs.org/):** Reactieve frontend-componenten (Composition API, `<script setup>`).
- **[TypeScript](https://www.typescriptlang.org/):** Veilige en gestructureerde configuratie en hulpscripts.

### Code Editor & Developer Experience
- **[CodeMirror 6](https://codemirror.net/):** Modulaire next-generation in-browser code editor voor de sandboxen.
  - `@codemirror/lang-html`, `@codemirror/lang-css`, `@codemirror/lang-javascript`
  - `@codemirror/theme-one-dark`
  - `@emmetio/codemirror6-plugin` (Emmet-expansie in de editor)

### AI & Intelligentie
- **[@google/genai](https://www.npmjs.com/package/@google/genai):** Officiële Google Gemini SDK voor de geïntegreerde AI Cursusassistent.
- **[Marked](https://marked.js.org/):** Snelle client-side Markdown-parser voor rendering van AI-antwoorden en notities.

### PWA & Offline
- **[vite-plugin-pwa](https://vite-pwa-org.netlify.app/):** Zero-config PWA-integratie voor Vite.
- **[workbox-window](https://developer.chrome.com/docs/workbox/):** Geavanceerd beheer van service workers en cache-levenscyclus.
- **[@vite-pwa/assets-generator](https://github.com/vite-pwa/assets-generator):** Automatische generatie van PWA-iconen en splash screens.

### UI, Iconen & Media
- **[Lucide Vue](https://lucide.dev/):** Moderne, consistente iconenset (`@lucide/vue`, `lucide`).
- **[medium-zoom](https://github.com/francoischalifour/medium-zoom):** Elegante afbeelding-zoomfunctionaliteit bij het klikken op illustraties.
- **CSS3 Custom Properties:** Uitgebreid CSS-variabelensysteem in de Thomas More-huisstijl met automatische dark mode ondersteuning.

### Hosting & Deployment
- **[Netlify](https://www.netlify.com/):** Continue deployment (CI/CD) met automatische preview-deploys en custom error routing.

## Ontwikkeling

```bash
# Installeer afhankelijkheden
npm install

# Start de ontwikkelserver op http://localhost:5674
npm run dev

# Bouw de site voor productie
npm run build

# Bekijk de productiebuild lokaal
npm run preview

# Genereer PWA-iconen vanuit public/logo.svg
npm run generate-pwa-assets
```

## Projectstructuur

```
wt_web_essentials/
├── .vitepress/
│   ├── config.mts              # VitePress configuratie, PWA, navigatie en metadata
│   ├── generateLlms.mts        # Generator voor llms.txt, llms-full.txt en course-topics.json
│   └── theme/
│       ├── index.ts            # Theme entry point en componentregistratie
│       ├── style.css           # Thomas More huisstijl en variabelen
│       ├── annotations.css     # Stijlen voor markeringen en notities
│       ├── composables/        # Vue composables (useAnnotations, usePageSummary, ...)
│       └── components/         # Herbruikbare Vue-componenten en interactieve simulators
├── public/                     # Statische assets (logo, favicon, PWA-manifest, etc.)
├── html/                       # HTML5-cursuspagina's (8 hoofdstukken)
├── css/                        # CSS3-cursuspagina's (18 hoofdstukken)
├── tools/                      # Tools & Webapps (PhpStorm, Git, DevTools, Simulators, etc.)
├── index.md                    # Cursushomepagina
├── annotations.md              # Overzichtspagina voor bewaarde markeringen
├── AGENTS.md                   # Richtlijnen en standaarden voor AI-assistenten
├── netlify.toml                # Netlify deployment-configuratie
└── pwa-assets.config.ts        # PWA iconenconfiguratie
```

## Deployment

De site wordt automatisch gebouwd en gepubliceerd via Netlify bij elke push naar de GitHub repository (`main` branch).

- **Build command:** `npm run build`
- **Publish directory:** `.vitepress/dist`

## Licentie & Eigendom

Thomas More Hogeschool - IT Factory  
Campus Geel, Kleinhoefstraat 4, 2440 Geel  
Auteur: Patrick Verhaert

