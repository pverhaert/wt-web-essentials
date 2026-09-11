import { EditorState, type ChangeSet, type Extension } from '@codemirror/state'
import type { EditorView } from '@codemirror/view'
import { isolateHistory } from '@codemirror/commands'
import { ensureSyntaxTree, indentRange, indentUnit } from '@codemirror/language'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { javascript } from '@codemirror/lang-javascript'

type CodeLanguage = 'html' | 'css' | 'js'

function indentationChanges(state: EditorState, from = 0, to = state.doc.length): ChangeSet {
  // Gebruik ook bij lange documenten een volledige syntaxboom. Bij een time-out
  // behouden we de code in plaats van te gokken naar de inspringing.
  const tree = ensureSyntaxTree(state, state.doc.length, 100)
  if (!tree) return state.changes([])

  const protectedRanges: { from: number; to: number }[] = []
  tree.iterate({
    enter(node) {
      if (node.name !== 'Element') return
      const opening = node.node.firstChild
      const name = opening?.getChild('TagName')
      if (!opening || !name) return
      if (!['pre', 'textarea'].includes(state.sliceDoc(name.from, name.to).toLowerCase())) return
      const closing = node.node.lastChild
      protectedRanges.push({
        from: opening.to,
        to: closing?.name === 'CloseTag' ? closing.from : node.to,
      })
      return false
    },
  })

  const changes: { from: number; to: number; insert: string }[] = []
  indentRange(state, from, to).iterChanges((start, end, _from, _to, insert) => {
    // Witruimte in pre en textarea is inhoud en mag niet worden aangepast.
    if (protectedRanges.some(range => start >= range.from && start <= range.to)) return
    changes.push({ from: start, to: end, insert: insert.toString() })
  })
  return state.changes(changes)
}

/** Normaliseer ook de resetbron, zodat openen de resetknop niet activeert. */
export function indentCode(code: string, language: CodeLanguage): string {
  if (!code) return code
  const support = language === 'html' ? html() : language === 'css' ? css() : javascript()
  const state = EditorState.create({ doc: code, extensions: [support, indentUnit.of('  ')] })
  return indentationChanges(state).apply(state.doc).toString()
}

/** Herstel alle regels als één afzonderlijke, ongedaan te maken bewerking. */
export function restoreIndentation(view: EditorView | null): void {
  if (!view) return
  const changes = indentationChanges(view.state)
  if (!changes.empty) {
    view.dispatch({
      changes,
      userEvent: 'input.indent',
      annotations: isolateHistory.of('full'),
    })
  }
  view.focus()
}

/** Plakken en inspringen vormen samen één bewerking in de geschiedenis. */
export function createCodeIndentation(): Extension {
  return [
    indentUnit.of('  '),
    EditorState.transactionFilter.of(transaction => {
      if (!transaction.docChanged || !transaction.isUserEvent('input.paste')) return transaction
      let state = transaction.state
      let changes = state.changes([])
      transaction.changes.iterChangedRanges((_from, _to, from, to) => {
        const mappedFrom = changes.mapPos(from)
        const mappedTo = changes.mapPos(to)
        // Een afsluitende newline hoort niet bij de volgende bestaande regel.
        const end = mappedTo > mappedFrom && state.doc.lineAt(mappedTo).from === mappedTo
          ? mappedTo - 1 : mappedTo
        const next = indentationChanges(state, mappedFrom, end)
        changes = changes.compose(next)
        state = state.update({ changes: next, filter: false }).state
      })
      return changes.empty ? transaction : [transaction, { changes, sequential: true }]
    }),
  ]
}
