import assert from 'node:assert/strict'
import test from 'node:test'
import { EditorState, EditorSelection } from '@codemirror/state'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { history, undo, redo } from '@codemirror/commands'
import { createCodeIndentation, indentCode, restoreIndentation } from '../.vitepress/theme/composables/useCodeIndentation.ts'

function editor(doc, language = html()) {
  const view = {
    state: EditorState.create({ doc, extensions: [language, history(), createCodeIndentation()] }),
    dispatch(transaction) { view.state = transaction.state ?? view.state.update(transaction).state },
    focus() {},
  }
  return view
}

test('openen herstelt HTML, CSS en JavaScript met twee spaties en behoudt regels', () => {
  const examples = [
    ['html', '<div>\n<p>Tekst</p>\n</div>', '<div>\n  <p>Tekst</p>\n</div>'],
    ['css', 'p {\ncolor: red;\n}', 'p {\n  color: red;\n}'],
    ['js', 'if (true) {\nconsole.log(1);\n}', 'if (true) {\n  console.log(1);\n}'],
  ]
  for (const [language, input, expected] of examples) {
    assert.equal(indentCode(input, language), expected)
    assert.equal(indentCode(expected, language), expected)
    assert.equal(indentCode(input, language).split('\n').length, input.split('\n').length)
  }
  assert.equal(indentCode('<div><p>Tekst</p></div>', 'html'), '<div><p>Tekst</p></div>')
  assert.equal(indentCode('', 'css'), '')
})

test('plakken herstelt alleen de geplakte regels en één undo herstelt de bron', () => {
  const original = '<div>\n\n       <p>Bestaand</p>\n</div>'
  const view = editor(original)
  const pasted = '<section>\n<p>Nieuw</p>\n</section>\n'
  view.dispatch({
    changes: { from: 6, insert: pasted },
    selection: { anchor: 6 + pasted.length },
    userEvent: 'input.paste',
  })
  const expected = '<div>\n  <section>\n    <p>Nieuw</p>\n  </section>\n\n       <p>Bestaand</p>\n</div>'
  assert.equal(view.state.doc.toString(), expected)
  assert.equal(view.state.selection.main.head, expected.indexOf('\n\n') + 1)
  assert.equal(undo(view), true)
  assert.equal(view.state.doc.toString(), original)
  assert.equal(redo(view), true)
  assert.equal(view.state.doc.toString(), expected)
})

test('de knop is apart ongedaan te maken en voegt bij correcte code geen geschiedenis toe', () => {
  const view = editor('p {\ncolor: red;\n}', css())
  view.dispatch({ changes: { from: 11, to: 14, insert: 'blue' }, userEvent: 'input.type' })
  const before = view.state.doc.toString()
  restoreIndentation(view)
  assert.equal(view.state.doc.toString(), 'p {\n  color: blue;\n}')
  restoreIndentation(view)
  assert.equal(undo(view), true)
  assert.equal(view.state.doc.toString(), before)
})

test('inhoud van pre, textarea en JavaScript-templates blijft exact behouden', () => {
  for (const tag of ['pre', 'textarea']) {
    const input = `<div>\n<${tag}>\n    eerste\n tweede\n</${tag}>\n</div>`
    assert.equal(indentCode(input, 'html'), `<div>\n  <${tag}>\n    eerste\n tweede\n</${tag}>\n</div>`)
  }
  const js = 'const text = `\n    eerste\n tweede\n`;'
  assert.equal(indentCode(js, 'js'), js)
})

test('meerdere plaklocaties worden elk in hun eigen context ingesprongen', () => {
  const view = editor('<div>\n\n</div>\n<section>\n\n</section>')
  const first = 6
  const second = view.state.doc.toString().indexOf('\n\n', first + 1) + 1
  view.state = view.state.update({
    selection: EditorSelection.create([EditorSelection.cursor(first), EditorSelection.cursor(second)]),
  }).state
  view.dispatch({
    changes: [{ from: first, insert: '<p>A</p>' }, { from: second, insert: '<p>B</p>' }],
    userEvent: 'input.paste',
  })
  assert.equal(view.state.doc.toString(), '<div>\n  <p>A</p>\n</div>\n<section>\n  <p>B</p>\n</section>')
})
