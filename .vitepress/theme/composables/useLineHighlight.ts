import { RangeSetBuilder, type Extension } from '@codemirror/state'
import { Decoration, type DecorationSet, EditorView, ViewPlugin, type ViewUpdate } from '@codemirror/view'

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

/**
 * Formatteert een verzameling regelnummers naar een compacte, gesorteerde reeks (bijv. "4, 7-9, 12").
 */
export function formatLineRange(numbers: Iterable<number>): string {
  const arr = Array.from(numbers).filter((n) => typeof n === 'number' && !isNaN(n) && n > 0)
  if (arr.length === 0) return ''
  arr.sort((a, b) => a - b)
  const unique = Array.from(new Set(arr))

  const ranges: string[] = []
  let rangeStart = unique[0]
  let prev = unique[0]

  for (let i = 1; i < unique.length; i++) {
    const curr = unique[i]
    if (curr === prev + 1) {
      prev = curr
    } else {
      ranges.push(rangeStart === prev ? String(rangeStart) : `${rangeStart}-${prev}`)
      rangeStart = curr
      prev = curr
    }
  }

  ranges.push(rangeStart === prev ? String(rangeStart) : `${rangeStart}-${prev}`)
  return ranges.join(', ')
}

/**
 * Schakelt een regelnummer aan of uit binnen een bestaande reeks (bijv. toggleLineInRange("8, 20-25", 8) -> "20-25").
 */
export function toggleLineInRange(currentRange: string | undefined, lineNum: number): string {
  const lines = parseLineRange(currentRange)
  if (lines.has(lineNum)) {
    lines.delete(lineNum)
  } else {
    lines.add(lineNum)
  }
  return formatLineRange(lines)
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
 * Maakt een CodeMirror 6 extensie aan die dynamisch reageert op wijzigingen in het document en reconfigures.
 */
export function createLineHighlightExtension(getRangeStr: () => string): Extension {
  return ViewPlugin.fromClass(
    class {
      decorations: DecorationSet
      constructor(view: EditorView) {
        this.decorations = buildHighlightDecorations(view.state.doc, getRangeStr())
      }
      update(update: ViewUpdate) {
        this.decorations = buildHighlightDecorations(update.state.doc, getRangeStr())
      }
    },
    {
      decorations: (v) => v.decorations,
    }
  )
}
