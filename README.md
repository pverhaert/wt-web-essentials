# Web Essentials

Nederlandstalige basiscursus HTML5 en CSS3 voor eerstejaars ICT-studenten van Thomas More Hogeschool.

## Ontwikkeling

```bash
# Installeer afhankelijkheden
npm install

# Start de ontwikkelserver op http://localhost:5674
npm run dev

# Bouw de site voor productie
npm run build

# Genereer PWA-iconen vanuit public/logo.svg
npm run generate-pwa-assets
```

## Projectstructuur

```
wt_web_essentials/
├── .vitepress/
│   ├── config.mts          # VitePress configuratie
│   └── theme/
│       ├── index.ts        # Theme entry point (medium-zoom, componenten)
│       ├── style.css       # Thomas More huisstijl
│       └── components/
│           ├── CodeSandbox.vue      # Live codevoorbeelden
│           └── ProgressIndicator.vue # Voortgangsbalk
├── public/
│   └── logo.svg            # Site logo (ook PWA-icoon bron)
├── html/                   # HTML5-sectie (8 pagina's)
├── css/                    # CSS3-sectie (19 pagina's)
├── tools/                  # Tools-sectie (4 pagina's)
├── index.md                # Homepagina
├── AGENTS.md               # Instructies voor AI-assistenten
├── netlify.toml            # Netlify deployment
└── pwa-assets.config.ts    # PWA iconen generator
```

## Deployment

De site wordt automatisch gebouwd en gepubliceerd via Netlify bij elke push naar de hoofdbranch.

Build command: `npm run build`
Publish directory: `.vitepress/dist`

## Licentie

Thomas More Hogeschool - IT Factory
