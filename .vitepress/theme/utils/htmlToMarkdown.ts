/**
 * Converteert een HTML-element of HTML-fragment (zoals gerenderd binnen <PageSummary>)
 * naar zuivere Markdown met behoud van tabellen, koppen, vette tekst, inline code en lijsten.
 */
export function htmlToMarkdown(html: string): string {
  if (typeof document === 'undefined') return ''

  const container = document.createElement('div')
  container.innerHTML = html

  function processNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || ''
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return ''
    }

    const el = node as HTMLElement
    const tag = el.tagName.toLowerCase()

    switch (tag) {
      case 'h1':
        return `\n\n# ${getChildrenMarkdown(el).trim()}\n\n`
      case 'h2':
        return `\n\n## ${getChildrenMarkdown(el).trim()}\n\n`
      case 'h3':
        return `\n\n### ${getChildrenMarkdown(el).trim()}\n\n`
      case 'h4':
        return `\n\n#### ${getChildrenMarkdown(el).trim()}\n\n`
      case 'p':
        return `\n\n${getChildrenMarkdown(el).trim()}\n\n`
      case 'strong':
      case 'b':
        return `**${getChildrenMarkdown(el)}**`
      case 'em':
      case 'i':
        return `*${getChildrenMarkdown(el)}*`
      case 'code':
        return `\`${el.textContent || ''}\``
      case 'a': {
        const href = el.getAttribute('href') || ''
        const text = getChildrenMarkdown(el)
        return href ? `[${text}](${href})` : text
      }
      case 'ul': {
        const items = Array.from(el.children).filter(c => c.tagName.toLowerCase() === 'li')
        const liMarkdown = items.map(li => `- ${getChildrenMarkdown(li).trim()}`).join('\n')
        return `\n\n${liMarkdown}\n\n`
      }
      case 'ol': {
        const items = Array.from(el.children).filter(c => c.tagName.toLowerCase() === 'li')
        const liMarkdown = items.map((li, idx) => `${idx + 1}. ${getChildrenMarkdown(li).trim()}`).join('\n')
        return `\n\n${liMarkdown}\n\n`
      }
      case 'li':
        return getChildrenMarkdown(el).trim()
      case 'table':
        return processTable(el)
      case 'blockquote':
        return `\n\n> ${getChildrenMarkdown(el).trim()}\n\n`
      case 'hr':
        return `\n\n---\n\n`
      case 'br':
        return '\n'
      default:
        return getChildrenMarkdown(el)
    }
  }

  function getChildrenMarkdown(parent: Element): string {
    let result = ''
    parent.childNodes.forEach(child => {
      result += processNode(child)
    })
    return result
  }

  function processTable(table: HTMLElement): string {
    const rows: string[][] = []
    const headerRows: string[][] = []

    const thead = table.querySelector('thead')
    if (thead) {
      thead.querySelectorAll('tr').forEach(tr => {
        const cells: string[] = []
        tr.querySelectorAll('th, td').forEach(cell => {
          cells.push(getChildrenMarkdown(cell).trim().replace(/\|/g, '\\|'))
        })
        if (cells.length) headerRows.push(cells)
      })
    }

    const tbody = table.querySelector('tbody') || table
    tbody.querySelectorAll('tr').forEach(tr => {
      // Sla over als het al in thead zat
      if (thead && thead.contains(tr)) return
      const cells: string[] = []
      tr.querySelectorAll('th, td').forEach(cell => {
        cells.push(getChildrenMarkdown(cell).trim().replace(/\|/g, '\\|'))
      })
      if (cells.length) rows.push(cells)
    })

    if (!headerRows.length && rows.length) {
      // Eerste rij als header behandelen indien geen thead
      headerRows.push(rows.shift()!)
    }

    if (!headerRows.length) return ''

    const headers = headerRows[0]
    let md = `\n\n| ${headers.join(' | ')} |\n`
    md += `| ${headers.map(() => '---').join(' | ')} |\n`

    rows.forEach(r => {
      // Vul aan tot gelijk aantal kolommen indien nodig
      while (r.length < headers.length) r.push('')
      md += `| ${r.join(' | ')} |\n`
    })

    return md + '\n'
  }

  let markdown = getChildrenMarkdown(container)

  // Normaliseer overbodige witregels (max 2 opeenvolgende enters)
  markdown = markdown
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return markdown
}
