import { defineConfig } from 'vitepress'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'node:fs'
import path from 'node:path'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'nl-BE',
  title: 'Web Essentials',
  description: 'Basiscursus HTML en CSS voor eerstejaars ICT-studenten - Thomas More Hogeschool',

  // Favicon en metadata
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon-180x180.png' }],
    ['link', { rel: 'manifest', href: '/manifest.webmanifest' }],
    ['meta', { name: 'theme-color', content: '#1E2D5A' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }],
    ['meta', { name: 'apple-mobile-web-app-title', content: 'Web Essentials' }],
    ['meta', { name: 'author', content: 'Patrick Verhaert' }],
  ],

  // Laatste wijzigingsdatum tonen
  lastUpdated: true,

  // Vite plugins (PWA)
  vite: {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        outDir: '.vitepress/dist',
        manifest: {
          lang: 'nl-BE',
          name: 'Web Essentials - Thomas More',
          short_name: 'Web Essentials',
          description: 'Basiscursus HTML en CSS voor eerstejaars ICT-studenten Thomas More Hogeschool',
          theme_color: '#1E2D5A',
          background_color: '#1E2D5A',
          display: 'standalone',
          start_url: '/',
          icons: [
            {
              src: '/pwa-64x64.png',
              sizes: '64x64',
              type: 'image/png',
            },
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/maskable-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{css,js,html,svg,png,ico,txt,woff2}'],
        },
      }),
    ],
  },

  // Markdown-it configuratie: voorkom dat lege regels binnen <CodeSandbox> tags
  // het CommonMark type 7 HTML-blok afbreken en <p>-tags injecteren.
  markdown: {
    config(md) {
      md.core.ruler.before('normalize', 'fix-codesandbox-empty-lines', (state) => {
        state.src = state.src.replace(/<(CodeSandbox|FullscreenSandbox)\b([\s\S]*?)(?:\/>|>[\s\S]*?<\/\1>)/g, (fullMatch) => {
          let prev
          let curr = fullMatch
          do {
            prev = curr
            curr = curr.replace(/\n[ \t]*\n/g, '\n&#10;')
          } while (curr !== prev)
          return curr
        })
      })
    },
  },

  themeConfig: {
    // Logo in de header
    logo: '/logo.svg',

    // Naam naast het logo
    siteTitle: 'Web Essentials',

    // Externe link icoon activeren
    externalLinkIcon: true,

    // Hoofdnavigatie bovenaan met dropdown menu's
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'HTML5',
        activeMatch: '/html/',
        items: [
          { text: 'Introductie', link: '/html/' },
          { text: 'Basistags', link: '/html/basistags' },
          { text: 'Afbeeldingen', link: '/html/afbeeldingen' },
          { text: 'Hyperlinks', link: '/html/hyperlinks' },
          { text: 'Speciale Tekens', link: '/html/speciale-tekens' },
          { text: 'Lijsten', link: '/html/lijsten' },
          { text: 'Tabellen', link: '/html/tabellen' },
        ],
      },
      {
        text: 'CSS3',
        activeMatch: '/css/',
        items: [
          { text: 'Introductie', link: '/css/' },
          { text: 'Lettertypen', link: '/css/lettertypen' },
          { text: 'Webfonts & Iconen', link: '/css/webfonts' },
          { text: 'Kleuren', link: '/css/kleuren' },
          { text: 'Box Model & Randen', link: '/css/box-model' },
          { text: 'CSS Variabelen', link: '/css/variabelen' },
          { text: 'Lijsten', link: '/css/lijsten' },
          { text: 'Tabellen', link: '/css/tabellen' },
          { text: 'Display', link: '/css/display' },
          { text: 'Afbeeldingen & Achtergronden', link: '/css/afbeeldingen' },
          { text: 'Positionering', link: '/css/positionering' },
          { text: 'Flexbox', link: '/css/flexbox' },
          { text: 'Grid (Bootstrap)', link: '/css/grid' },
          { text: 'Media Queries', link: '/css/media-queries' },
          { text: '2D Transformaties', link: '/css/2d-transformaties' },
          { text: 'Transities', link: '/css/transities' },
          { text: 'Animaties', link: '/css/animaties' },
          { text: '3D Transformaties', link: '/css/3d-transformaties' },
        ],
      },
      {
        text: 'Tools & Webapps',
        activeMatch: '/tools/|/sandbox',
        items: [
          {
            text: 'Installatie & Ontwikkelomgeving',
            items: [
              { text: 'PhpStorm Setup', link: '/tools/phpstorm' },
              { text: 'Git Basics', link: '/tools/git' },
              { text: 'Browser DevTools', link: '/tools/devtools' },
              { text: 'AI Cursusassistent', link: '/tools/ai-assistent' },
            ],
          },
          {
            text: 'Webapps & Extensies',
            items: [
              { text: 'Afbeeldingen Optimaliseren', link: '/tools/afbeeldingen-optimaliseren', target: 'page2' },
              { text: 'Photo Edit Pro', link: 'https://photo-edit-pro.netlify.app/', target: 'page2' },
              { text: 'RealFaviconGenerator', link: '/tools/realfavicongenerator', target: 'page2' },
              { text: 'Favicon Generator (.ico)', link: '/tools/favicon-generator', target: 'page2' },
              { text: 'Browser Extensies', link: '/tools/extensions', target: 'page2' },
              { text: 'Line-height Spel', link: '/tools/line-height-spel', target: 'page2' },
              { text: 'Font Simulator', link: '/tools/font-simulator', target: 'page2' },
              { text: 'Kleurenomzetter', link: '/tools/kleurenomzetter', target: 'page2' },
              { text: 'CSS Colors Timeline', link: 'https://css-colors-timeline.netlify.app/', target: 'page2' },
              { text: 'Fullscreen Sandbox', link: '/sandbox', target: 'page2' },
            ],
          },
        ],
      },
    ],

    // Geen linker sidebar: navigatie verloopt via dropdown menu's in de header
    sidebar: false,

    // Sociale links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/pverhaert/wt-web-essentials' },
    ],

    // Zoekfunctie (lokaal)
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: 'Zoeken...',
            buttonAriaLabel: 'Zoeken',
          },
          modal: {
            noResultsText: 'Geen resultaten voor',
            resetButtonTitle: 'Zoekopdracht wissen',
            footer: {
              selectText: 'selecteren',
              navigateText: 'navigeren',
              closeText: 'sluiten',
            },
          },
        },
      },
    },

    // Paginanavigatie (vorige / volgende)
    docFooter: {
      prev: 'Vorige pagina',
      next: 'Volgende pagina',
    },

    // Inhoudsopgave links
    outline: {
      label: 'Op deze pagina',
      level: [2, 3],
    },
    aside: 'left',

    // Laatste update tekst
    lastUpdated: {
      text: 'Bijgewerkt op',
    },

    // 404 pagina teksten
    notFound: {
      title: 'PAGINA NIET GEVONDEN',
      quote: 'Oeps! De opgevraagde pagina bestaat niet of is verplaatst.',
      linkText: 'Terug naar startpagina',
      linkLabel: 'Terug naar startpagina',
    },

    // Footer
    footer: {
      message: 'Web Essentials - Basiscursus HTML en CSS',
      copyright: 'Thomas More Hogeschool - IT Factory',
    },
  },

  // Zorg dat de standalone Thomas More 404.html gegarandeerd in de root van de dist-map staat voor Netlify
  buildEnd: async (siteConfig) => {
    const custom404Source = path.resolve(siteConfig.root, 'public/404.html')
    const dist404Target = path.resolve(siteConfig.outDir, '404.html')
    if (fs.existsSync(custom404Source)) {
      fs.copyFileSync(custom404Source, dist404Target)
      console.log('Custom Thomas More 404.html succesvol naar dist/404.html gekopieerd voor Netlify.')
    }
  },
})
