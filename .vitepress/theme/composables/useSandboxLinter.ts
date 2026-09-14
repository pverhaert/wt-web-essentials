import { type Extension } from '@codemirror/state'
import { linter, type Diagnostic } from '@codemirror/lint'
import { syntaxTree } from '@codemirror/language'
import type { EditorView } from '@codemirror/view'

/**
 * Lijst van HTML5 void elements die volgens de standaard nooit een sluitende tag hebben.
 */
const HTML_VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
])

interface OpenTagInfo {
  name: string
  from: number
  to: number
  line: number
}

/**
 * Controleert HTML-code op niet-afgesloten tags, verkeerde nesting en overtollige sluitende tags.
 */
export function validateHtml(view: EditorView): Diagnostic[] {
  const diagnostics: Diagnostic[] = []
  const doc = view.state.doc
  const text = doc.toString()

  if (!text.trim()) return diagnostics

  // Regex die HTML-tags matcht, met uitzondering van comments en doctypes
  // match[1] = eventuele '/' (sluitende tag)
  // match[2] = tagnaam
  // match[3] = attributen
  // match[4] = eventuele zelfsluitende '/'
  const tagRegex = /<(\/)?([a-zA-Z0-9\-]+)([^>]*?)(\/)?>/g
  const commentRegex = /<!--[\s\S]*?-->/g

  // Maskeer HTML comments zodat tags binnen commentaar genegeerd worden
  let cleanText = text
  let commentMatch: RegExpExecArray | null
  while ((commentMatch = commentRegex.exec(text)) !== null) {
    cleanText =
      cleanText.slice(0, commentMatch.index) +
      ' '.repeat(commentMatch[0].length) +
      cleanText.slice(commentMatch.index + commentMatch[0].length)
  }

  const stack: OpenTagInfo[] = []
  let match: RegExpExecArray | null

  while ((match = tagRegex.exec(cleanText)) !== null) {
    const fullTag = match[0]
    const isClosing = Boolean(match[1])
    const tagName = match[2].toLowerCase()
    const isSelfClosing = Boolean(match[4]) || HTML_VOID_ELEMENTS.has(tagName)
    const from = match.index
    const to = from + fullTag.length
    const line = doc.lineAt(from).number

    // Negeer doctype of speciale tags
    if (tagName === '!doctype') continue

    if (isClosing) {
      if (HTML_VOID_ELEMENTS.has(tagName)) {
        diagnostics.push({
          from,
          to,
          severity: 'warning',
          message: `Het element <${tagName}> is een void-element en mag geen sluitende tag </${tagName}> hebben.`,
        })
        continue
      }

      if (stack.length === 0) {
        diagnostics.push({
          from,
          to,
          severity: 'error',
          message: `Onverwachte sluitende tag </${tagName}>: er is geen geopende <${tagName}> gevonden.`,
        })
        continue
      }

      const top = stack[stack.length - 1]

      if (top.name === tagName) {
        stack.pop()
      } else {
        // Controleer of de tag verder terug in de stack zit (foute nesting)
        const openIndex = stack.map((item) => item.name).lastIndexOf(tagName)

        if (openIndex !== -1) {
          // Alle tags die tussen openIndex en het einde liggen zijn niet gesloten vóór deze sluitende tag
          const unclosedBetween = stack.slice(openIndex + 1)
          for (const item of unclosedBetween) {
            diagnostics.push({
              from: item.from,
              to: item.to,
              severity: 'error',
              message: `Foutieve nesting: <${item.name}> werd geopend na <${tagName}>, maar niet gesloten vóór </${tagName}>.`,
            })
          }
          // Verwijder vanaf openIndex
          stack.splice(openIndex)
        } else {
          diagnostics.push({
            from,
            to,
            severity: 'error',
            message: `Sluitende tag </${tagName}> komt niet overeen met geopende tag <${top.name}> op regel ${top.line}.`,
          })
        }
      }
    } else if (!isSelfClosing) {
      // Openende tag
      stack.push({
        name: tagName,
        from,
        to,
        line,
      })
    }
  }

  // Resterende niet-afgesloten tags in de stack
  while (stack.length > 0) {
    const unclosed = stack.pop()!
    diagnostics.push({
      from: unclosed.from,
      to: unclosed.to,
      severity: 'error',
      message: `Niet-afgesloten tag <${unclosed.name}>: vergeet de sluitende tag </${unclosed.name}> niet.`,
    })
  }

  return diagnostics
}

/**
 * Controleert CSS-code op niet-afgesloten accolades en syntaxisfouten.
 */
export function validateCss(view: EditorView): Diagnostic[] {
  const diagnostics: Diagnostic[] = []
  const doc = view.state.doc
  const text = doc.toString()

  if (!text.trim()) return diagnostics

  // 1. Accolades en ronde haken tellen/traceren
  const braceStack: { char: string; pos: number; line: number }[] = []
  let inComment = false
  let inString: string | null = null

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const next = text[i + 1]

    if (inComment) {
      if (char === '*' && next === '/') {
        inComment = false
        i++
      }
      continue
    }

    if (char === '/' && next === '*') {
      inComment = true
      i++
      continue
    }

    if (inString) {
      if (char === inString && text[i - 1] !== '\\') {
        inString = null
      }
      continue
    }

    if (char === '"' || char === "'") {
      inString = char
      continue
    }

    if (char === '{' || char === '(') {
      braceStack.push({ char, pos: i, line: doc.lineAt(i).number })
    } else if (char === '}') {
      const top = braceStack.length ? braceStack[braceStack.length - 1] : null
      if (top && top.char === '{') {
        braceStack.pop()
      } else {
        diagnostics.push({
          from: i,
          to: i + 1,
          severity: 'error',
          message: 'Onverwachte sluitaccolade `}`: er is geen geopende `{` voor dit blok.',
        })
      }
    } else if (char === ')') {
      const top = braceStack.length ? braceStack[braceStack.length - 1] : null
      if (top && top.char === '(') {
        braceStack.pop()
      } else {
        diagnostics.push({
          from: i,
          to: i + 1,
          severity: 'error',
          message: 'Onverwacht sluithaakje `)`: er is geen geopend haakje `(` voor deze expressie.',
        })
      }
    }
  }

  for (const unclosed of braceStack) {
    if (unclosed.char === '{') {
      diagnostics.push({
        from: unclosed.pos,
        to: unclosed.pos + 1,
        severity: 'error',
        message: `Niet-afgesloten CSS-blok: ontbrekende sluitaccolade \`}\` voor het blok geopend op regel ${unclosed.line}.`,
      })
    } else if (unclosed.char === '(') {
      diagnostics.push({
        from: unclosed.pos,
        to: unclosed.pos + 1,
        severity: 'error',
        message: `Niet-afgesloten haakje: ontbrekend sluithaakje \`)\` voor de functie geopend op regel ${unclosed.line}.`,
      })
    }
  }

  // 2. SyntaxTree Lezer parse error inspectie
  const tree = syntaxTree(view.state)
  tree.iterate({
    enter(node) {
      if (node.type.isError) {
        // Bepaal een duidelijke context (woord of regel) in plaats van slechts 1 punt/leesteken
        const line = doc.lineAt(node.from)
        let from = node.from
        let to = node.to

        if (to <= from) {
          // Als de fout een leeg punt is, breid uit naar het voorgaande of volgende token op dezelfde regel
          const lineText = line.text
          const offsetInLine = node.from - line.from
          // Zoek woordgrenzen rondom node.from binnen de huidige regel
          let start = offsetInLine
          while (start > 0 && /\S/.test(lineText[start - 1])) {
            start--
          }
          let end = offsetInLine
          while (end < lineText.length && /\S/.test(lineText[end])) {
            end++
          }

          if (end > start) {
            from = line.from + start
            to = line.from + end
          } else {
            from = Math.max(line.from, node.from - 1)
            to = Math.min(line.to, node.from + 1)
          }
        } else if (to - from === 1) {
          // Als het bereik slechts 1 karakter is (bv. ':' of ';'), breid uit naar het hele omliggende woord
          const lineText = line.text
          const offsetInLine = from - line.from
          let start = offsetInLine
          while (start > 0 && /[a-zA-Z0-9_-]/.test(lineText[start - 1])) {
            start--
          }
          let end = offsetInLine + 1
          while (end < lineText.length && /[a-zA-Z0-9_-]/.test(lineText[end])) {
            end++
          }
          if (end > start) {
            from = line.from + start
            to = line.from + end
          }
        }

        // Vermijd dubbele meldingen als we al een accolade-fout op die positie hebben
        if (!diagnostics.some((d) => Math.abs(d.from - from) <= 2)) {
          diagnostics.push({
            from,
            to: Math.max(to, from + 1),
            severity: 'error',
            message: 'CSS-syntaxisfout: controleer of er geen puntkomma `;` of dubbelepunt `:` ontbreekt.',
          })
        }
      }
    },
  })

  return diagnostics
}

/**
 * Controleert JavaScript-code op syntaxisfouten en niet-afgesloten structuren.
 */
export function validateJs(view: EditorView): Diagnostic[] {
  const diagnostics: Diagnostic[] = []
  const doc = view.state.doc
  const text = doc.toString()

  if (!text.trim()) return diagnostics

  // 1. Controleer haakjes en accolades
  const stack: { char: string; pos: number; line: number }[] = []
  let inString: string | null = null
  let inComment = false
  let inLineComment = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const next = text[i + 1]

    if (inLineComment) {
      if (char === '\n') inLineComment = false
      continue
    }

    if (inComment) {
      if (char === '*' && next === '/') {
        inComment = false
        i++
      }
      continue
    }

    if (char === '/' && next === '/') {
      inLineComment = true
      i++
      continue
    }

    if (char === '/' && next === '*') {
      inComment = true
      i++
      continue
    }

    if (inString) {
      if (char === inString && text[i - 1] !== '\\') {
        inString = null
      }
      continue
    }

    if (char === '"' || char === "'" || char === '`') {
      inString = char
      continue
    }

    if (char === '{' || char === '(' || char === '[') {
      stack.push({ char, pos: i, line: doc.lineAt(i).number })
    } else if (char === '}' || char === ')' || char === ']') {
      const matchMap: Record<string, string> = { '}': '{', ')': '(', ']': '[' }
      const expected = matchMap[char]
      const top = stack.length ? stack[stack.length - 1] : null

      if (top && top.char === expected) {
        stack.pop()
      } else {
        diagnostics.push({
          from: i,
          to: i + 1,
          severity: 'error',
          message: `Onverwacht sluitteken \`${char}\`: komt niet overeen met geopende structuur.`,
        })
      }
    }
  }

  for (const unclosed of stack) {
    diagnostics.push({
      from: unclosed.pos,
      to: unclosed.pos + 1,
      severity: 'error',
      message: `Niet-afgesloten \`${unclosed.char}\` geopend op regel ${unclosed.line}.`,
    })
  }

  // 2. SyntaxTree Lezer parse error inspectie
  const tree = syntaxTree(view.state)
  tree.iterate({
    enter(node) {
      if (node.type.isError) {
        const line = doc.lineAt(node.from)
        let from = node.from
        let to = node.to

        if (to <= from) {
          const lineText = line.text
          const offsetInLine = node.from - line.from
          let start = offsetInLine
          while (start > 0 && /\S/.test(lineText[start - 1])) {
            start--
          }
          let end = offsetInLine
          while (end < lineText.length && /\S/.test(lineText[end])) {
            end++
          }
          if (end > start) {
            from = line.from + start
            to = line.from + end
          } else {
            from = Math.max(line.from, node.from - 1)
            to = Math.min(line.to, node.from + 1)
          }
        } else if (to - from === 1) {
          const lineText = line.text
          const offsetInLine = from - line.from
          let start = offsetInLine
          while (start > 0 && /[a-zA-Z0-9_$]/.test(lineText[start - 1])) {
            start--
          }
          let end = offsetInLine + 1
          while (end < lineText.length && /[a-zA-Z0-9_$]/.test(lineText[end])) {
            end++
          }
          if (end > start) {
            from = line.from + start
            to = line.from + end
          }
        }

        if (!diagnostics.some((d) => Math.abs(d.from - from) <= 2)) {
          diagnostics.push({
            from,
            to: Math.max(to, from + 1),
            severity: 'error',
            message: 'JavaScript-syntaxisfout: controleer haakjes, variabelen of expressies.',
          })
        }
      }
    },
  })

  return diagnostics
}

/**
 * Maakt een CodeMirror 6 linter-extensie aan voor de opgegeven taal.
 */
export function createSandboxLinter(getLang: () => 'html' | 'css' | 'js'): Extension {
  return linter(
    (view: EditorView) => {
      const lang = getLang()
      if (lang === 'html') {
        return validateHtml(view)
      }
      if (lang === 'css') {
        return validateCss(view)
      }
      if (lang === 'js') {
        return validateJs(view)
      }
      return []
    },
    {
      delay: 350,
    }
  )
}
