import { RangeSetBuilder, type Extension } from '@codemirror/state'
import { Decoration, type DecorationSet, EditorView } from '@codemirror/view'

/**
 * Ontleedt een reeks zoals "8, 20-25, 30" naar een Set van regelnummers.
 */
export function parseLineRange(str?: string): Set<number> {
  const result = new Set<number>()
  if (!str) return result
  const parts = str.split(',')
  for (const part of parts) {
    const trimmed = part.trim()
    if (!trimmed) continue
    if (trimmed.includes('-')) {
      const [startStr, endStr] = trimmed.split('-')
      const start = parseInt(startStr.trim(), 10)
      const end = parseInt(endStr.trim(), 10)
      if (!isNaN(start) && !isNaN(end)) {
        const min = Math.min(start, end)
        const max = Math.max(start, end)
        for (let i = min; i <= max; i++) {
          result.add(i)
        }
      }
    } else {
      const line = parseInt(trimmed, 10)
      if (!isNaN(line)) {
        result.add(line)
      }
    }
  }
  return result
}

const lineHighlightDeco = Decoration.line({
  class: 'cm-highlight-line',
})

/**
 * Bouwt een DecorationSet op basis van het huidige document en een reeks regelnummers.
 */
export function buildHighlightDecorations(doc: any, rangeStr: string): DecorationSet {
  const lines = parseLineRange(rangeStr)
  if (lines.size === 0) return Decoration.none

  const builder = new RangeSetBuilder<Decoration>()
  for (let i = 1; i <= doc.lines; i++) {
    if (lines.has(i)) {
      const line = doc.line(i)
      builder.add(line.from, line.from, lineHighlightDeco)
    }
  }
  return builder.finish()
}

/**
 * Maakt een CodeMirror 6 extensie aan die dynamisch reageert op wijzigingen in het document.
 */
export function createLineHighlightExtension(getRangeStr: () => string): Extension {
  return EditorView.decorations.compute(['doc'], (state) => {
    return buildHighlightDecorations(state.doc, getRangeStr())
  })
}
