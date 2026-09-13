import fs from 'node:fs'
import path from 'node:path'

export interface PageTopicInfo {
  title: string
  path: string
  category: 'HTML5' | 'CSS3' | 'Tools' | 'Algemeen'
  sections: string[]
  keyTerms: string[]
  codeFeatures: string[]
  summary?: string
}

const COURSE_SEQUENCE: Array<{ relPath: string; category: PageTopicInfo['category'] }> = [
  // HTML5
  { relPath: 'html/index.md', category: 'HTML5' },
  { relPath: 'html/basistags.md', category: 'HTML5' },
  { relPath: 'html/afbeeldingen.md', category: 'HTML5' },
  { relPath: 'html/hyperlinks.md', category: 'HTML5' },
  { relPath: 'html/speciale-tekens.md', category: 'HTML5' },
  { relPath: 'html/lijsten.md', category: 'HTML5' },
  { relPath: 'html/tabellen.md', category: 'HTML5' },

  // CSS3
  { relPath: 'css/index.md', category: 'CSS3' },
  { relPath: 'css/lettertypen.md', category: 'CSS3' },
  { relPath: 'css/webfonts.md', category: 'CSS3' },
  { relPath: 'css/kleuren.md', category: 'CSS3' },
  { relPath: 'css/box-model.md', category: 'CSS3' },
  { relPath: 'css/variabelen.md', category: 'CSS3' },
  { relPath: 'css/lijsten.md', category: 'CSS3' },
  { relPath: 'css/tabellen.md', category: 'CSS3' },
  { relPath: 'css/display.md', category: 'CSS3' },
  { relPath: 'css/afbeeldingen.md', category: 'CSS3' },
  { relPath: 'css/positionering.md', category: 'CSS3' },
  { relPath: 'css/flexbox.md', category: 'CSS3' },
  { relPath: 'css/grid.md', category: 'CSS3' },
  { relPath: 'css/media-queries.md', category: 'CSS3' },
  { relPath: 'css/2d-transformaties.md', category: 'CSS3' },
  { relPath: 'css/transities.md', category: 'CSS3' },
  { relPath: 'css/animaties.md', category: 'CSS3' },
  { relPath: 'css/3d-transformaties.md', category: 'CSS3' },

  // Tools & Webapps
  { relPath: 'tools/phpstorm.md', category: 'Tools' },
  { relPath: 'tools/git.md', category: 'Tools' },
  { relPath: 'tools/devtools.md', category: 'Tools' },
  { relPath: 'tools/ai-assistent.md', category: 'Tools' },
]

/**
 * Hulpfunctie om markdown op te schonen van componenttags en frontmatter voor llms-full.txt
 */
function cleanMarkdownForLlm(raw: string): string {
  let content = raw

  // Verwijder YAML frontmatter
  content = content.replace(/^---[\s\S]*?---\n*/, '')

  // Verwijder CodeSandbox tags maar behoud de samenvattende titel
  content = content.replace(/<CodeSandbox[\s\S]*?\/>/g, (match) => {
    const titleMatch = match.match(/title=["']([^"']+)["']/)
    const title = titleMatch ? titleMatch[1] : 'Interactief codevoorbeeld'
    return `\n\n> [Codevoorbeeld: ${title}]\n\n`
  })

  // Verwijder overige custom Vue componenten zoals Simulatoren, MiniColorPicker etc.
  content = content.replace(/<[A-Z][A-Za-z0-9]+[^>]*\/>/g, '')
  content = content.replace(/<[A-Z][A-Za-z0-9]+[^>]*>[\s\S]*?<\/[A-Z][A-Za-z0-9]+>/g, (match) => {
    if (match.startsWith('<PageSummary>')) {
      // Behoud de inhoud van PageSummary zonder de tags
      return match.replace(/<\/?PageSummary>/g, '')
    }
    return ''
  })

  // Vervang <abbr title="...">TEXT</abbr> door TEXT (afkorting)
  content = content.replace(/<abbr\s+title=["']([^"']+)["']>([^<]+)<\/abbr>/gi, '$2 ($1)')

  // Vervang <dfn title="...">TEXT</dfn> door **TEXT**
  content = content.replace(/<dfn\s+title=["']([^"']+)["']>([^<]+)<\/dfn>/gi, '**$2** ($1)')

  // Verwijder meervoudige witregels
  content = content.replace(/\n{3,}/g, '\n\n')

  return content.trim()
}

/**
 * Extraheert belangrijke trefwoorden, CSS-eigenschappen en HTML-tags uit een pagina
 */
function extractPageFeatures(rawContent: string): {
  title: string
  sections: string[]
  keyTerms: string[]
  codeFeatures: string[]
} {
  // Paginatitel
  const titleMatch = rawContent.match(/^#\s+(.+)$/m)
  const title = titleMatch ? titleMatch[1].trim() : ''

  // Sectiekoppen (## en ###)
  const sections: string[] = []
  const sectionRegex = /^#{2,3}\s+(.+)$/gm
  let sMatch
  while ((sMatch = sectionRegex.exec(rawContent)) !== null) {
    const secTitle = sMatch[1].trim()
    if (
      !secTitle.includes('Leerdoelen') &&
      !secTitle.includes('Oefeningen') &&
      !secTitle.includes('Syntaxis in een oogopslag') &&
      !secTitle.includes('Veelgemaakte fouten') &&
      !secTitle.includes('Tips voor beginners')
    ) {
      sections.push(secTitle)
    }
  }

  // <dfn> en <abbr> begrippen
  const keyTerms: string[] = []
  const dfnRegex = /<(?:dfn|abbr)[^>]*>([^<]+)<\/(?:dfn|abbr)>/gi
  let dMatch
  while ((dMatch = dfnRegex.exec(rawContent)) !== null) {
    const term = dMatch[1].trim()
    if (term && !keyTerms.includes(term)) {
      keyTerms.push(term)
    }
  }

  // Zoek specifieke eigenschappen en technieken zoals display: flow-root, box-sizing, etc.
  const codeFeatures: string[] = []
  const propertyPatterns = [
    /display:\s*(?:flow-root|inline-block|block|inline|flex|grid|none)/gi,
    /float:\s*(?:left|right|none)/gi,
    /clear:\s*(?:both|left|right)/gi,
    /position:\s*(?:relative|absolute|fixed|sticky)/gi,
    /object-fit:\s*(?:cover|contain|fill|scale-down|none)/gi,
    /box-sizing:\s*(?:border-box|content-box)/gi,
    /transform:\s*(?:translate|rotate|scale|skew)[a-zA-Z0-9_()]*/gi,
    /perspective(?::|-origin:)/gi,
    /transform-style:\s*preserve-3d/gi,
    /backface-visibility:\s*hidden/gi,
    /@keyframes/gi,
    /transition(?::|-property:|-duration:)/gi,
    /animation(?::|-name:|-duration:)/gi,
    /flex-(?:direction|wrap|flow|grow|shrink|basis)/gi,
    /justify-(?:content|items|self)/gi,
    /align-(?:items|content|self)/gi,
    /vertical-align/gi,
    /overflow(?::|-x:|-y:)/gi,
    /background-(?:image|size|position|repeat|attachment)/gi,
    /linear-gradient|radial-gradient/gi,
    /var\(--[a-zA-Z0-9_-]+\)/gi,
    /:root/gi,
  ]

  for (const pat of propertyPatterns) {
    const matches = rawContent.match(pat)
    if (matches) {
      for (const m of matches) {
        const clean = m.trim().toLowerCase()
        if (!codeFeatures.includes(clean)) {
          codeFeatures.push(clean)
        }
      }
    }
  }

  return { title, sections, keyTerms, codeFeatures }
}

/**
 * Hoofdfunctie die llms.txt, llms-full.txt en course-topics.json genereert
 */
export async function generateLlmsFiles(rootDir: string, outDir?: string) {
  const publicDir = path.resolve(rootDir, 'public')
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  const pagesInfo: PageTopicInfo[] = []
  let fullDocumentation = `# Web Essentials - Volledige Cursusdocumentatie\n\n`
  fullDocumentation += `> Auteur: Patrick Verhaert\n`
  fullDocumentation += `> Instelling: Thomas More Hogeschool, IT Factory, Campus Geel (Kleinhoefstraat 4, 2440 Geel)\n`
  fullDocumentation += `> Doelgroep: Eerstejaarsstudenten ICT, HTML5 & CSS3 basiscursus\n`
  fullDocumentation += `> Website: https://wt-web-essentials.netlify.app/\n\n`
  fullDocumentation += `---\n\n`

  for (const item of COURSE_SEQUENCE) {
    const filePath = path.resolve(rootDir, item.relPath)
    if (!fs.existsSync(filePath)) continue

    const rawContent = fs.readFileSync(filePath, 'utf-8')
    const { title, sections, keyTerms, codeFeatures } = extractPageFeatures(rawContent)

    const routePath = '/' + item.relPath.replace(/\.md$/, '').replace(/\/index$/, '')

    pagesInfo.push({
      title: title || item.relPath,
      path: routePath,
      category: item.category,
      sections: sections.slice(0, 10),
      keyTerms: keyTerms.slice(0, 10),
      codeFeatures: codeFeatures.slice(0, 12),
    })

    const cleanedText = cleanMarkdownForLlm(rawContent)
    fullDocumentation += `# ${title || routePath}\n\n`
    fullDocumentation += `- **URL / Route:** ${routePath}\n`
    fullDocumentation += `- **Categorie:** ${item.category}\n\n`
    fullDocumentation += `${cleanedText}\n\n`
    fullDocumentation += `---\n\n`
  }

  // 1. Genereer llms.txt volgens de officiële standaard
  let llmsTxt = `# Web Essentials\n\n`
  llmsTxt += `> Basiscursus HTML5 en CSS3 voor eerstejaarsstudenten ICT aan Thomas More Hogeschool (Campus Geel, IT Factory).\n`
  llmsTxt += `> Website: https://wt-web-essentials.netlify.app/\n\n`
  llmsTxt += `## Cursusstructuur & Onderwerpen\n\n`

  let currentCategory = ''
  for (const page of pagesInfo) {
    if (page.category !== currentCategory) {
      currentCategory = page.category
      llmsTxt += `### ${currentCategory}\n\n`
    }

    const featureHints: string[] = []
    if (page.codeFeatures.length > 0) {
      featureHints.push(page.codeFeatures.join(', '))
    }
    if (page.sections.length > 0) {
      featureHints.push(page.sections.slice(0, 5).join('; '))
    }

    const hintsText = featureHints.length > 0 ? ` - ${featureHints.join(' | ')}` : ''
    llmsTxt += `- [${page.title}](https://wt-web-essentials.netlify.app${page.path}): ${page.path}${hintsText}\n`
  }

  llmsTxt += `\n## Belangrijke technische verwijzingen binnen de cursus\n\n`
  llmsTxt += `- **display: flow-root / clearfix:** Uitvoerig behandeld in [/css/afbeeldingen](https://wt-web-essentials.netlify.app/css/afbeeldingen#het-probleem-van-de-inzakkende-container-clearfix) als de moderne methode om inzakkende containers bij zwevende elementen (float) op te lossen.\n`
  llmsTxt += `- **display waarden (block, inline, inline-block, none) & vertical-align:** Behandeld in [/css/display](https://wt-web-essentials.netlify.app/css/display).\n`
  llmsTxt += `- **Flexbox lay-out:** Behandeld in [/css/flexbox](https://wt-web-essentials.netlify.app/css/flexbox).\n`
  llmsTxt += `- **2D Transformaties (translate, rotate, scale, skew):** Behandeld in [/css/2d-transformaties](https://wt-web-essentials.netlify.app/css/2d-transformaties).\n`
  llmsTxt += `- **CSS Transities:** Behandeld in [/css/transities](https://wt-web-essentials.netlify.app/css/transities).\n`
  llmsTxt += `- **CSS Animaties & @keyframes:** Behandeld in [/css/animaties](https://wt-web-essentials.netlify.app/css/animaties).\n`
  llmsTxt += `- **3D Transformaties (perspective, preserve-3d, backface-visibility):** Behandeld in [/css/3d-transformaties](https://wt-web-essentials.netlify.app/css/3d-transformaties).\n\n`
  llmsTxt += `## Volledige Cursusdocumentatie\n\n`
  llmsTxt += `- [llms-full.txt](https://wt-web-essentials.netlify.app/llms-full.txt): Bevat de integrale Markdown-inhoud van alle lessen voor LLM-analyse.\n`

  // Schrijf bestanden weg naar /public
  fs.writeFileSync(path.resolve(publicDir, 'llms.txt'), llmsTxt, 'utf-8')
  fs.writeFileSync(path.resolve(publicDir, 'llms-full.txt'), fullDocumentation, 'utf-8')
  fs.writeFileSync(path.resolve(publicDir, 'course-topics.json'), JSON.stringify(pagesInfo, null, 2), 'utf-8')

  // Indien er een outDir (zoals .vitepress/dist) is gespecificeerd, schrijf ook daar direct heen
  if (outDir && fs.existsSync(outDir)) {
    fs.writeFileSync(path.resolve(outDir, 'llms.txt'), llmsTxt, 'utf-8')
    fs.writeFileSync(path.resolve(outDir, 'llms-full.txt'), fullDocumentation, 'utf-8')
    fs.writeFileSync(path.resolve(outDir, 'course-topics.json'), JSON.stringify(pagesInfo, null, 2), 'utf-8')
  }

  console.log(`[LLMs Generator] llms.txt (${(llmsTxt.length / 1024).toFixed(1)} KB), llms-full.txt (${(fullDocumentation.length / 1024).toFixed(1)} KB) en course-topics.json succesvol gegenereerd.`)
}
