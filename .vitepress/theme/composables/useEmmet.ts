import type { EditorView } from 'codemirror'
import { indentWithTab } from '@codemirror/commands'
import { abbreviationTracker, expandAbbreviation } from '@emmetio/codemirror6-plugin'
import type { CompletionSource } from '@codemirror/autocomplete'
import type { Extension } from '@codemirror/state'
import { keymap } from '@codemirror/view'

/**
 * PhpStorm-compatibele Emmet mappings voor CSS.
 * Lost verschillen op tussen JetBrains Emmet en de standaard Web-Emmet parser
 * (zoals ff:v vs ffv, en tal dat text-align: left moet zijn in plaats van text-align-last).
 */
export const PHPSTORM_CSS_EMMET_MAP: Record<string, string> = {
  // Font-family
  'ff:v': 'font-family: Verdana, Geneva, sans-serif;',
  'ffv': 'font-family: Verdana, Geneva, sans-serif;',
  'ff:a': 'font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;',
  'ffa': 'font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;',
  'ff:t': 'font-family: "Times New Roman", Times, Baskerville, Georgia, serif;',
  'fft': 'font-family: "Times New Roman", Times, Baskerville, Georgia, serif;',
  'ff:s': 'font-family: serif;',
  'ffs': 'font-family: serif;',
  'ff:ss': 'font-family: sans-serif;',
  'ffss': 'font-family: sans-serif;',
  'ff:m': 'font-family: monospace;',
  'ffm': 'font-family: monospace;',
  'ff:c': 'font-family: cursive;',
  'ffc': 'font-family: cursive;',
  'ff:f': 'font-family: fantasy;',
  'fff': 'font-family: fantasy;',

  // Text-align (standaard Web-Emmet kiest text-align-last voor 'tal')
  'tal': 'text-align: left;',
  'ta:l': 'text-align: left;',
  'tac': 'text-align: center;',
  'ta:c': 'text-align: center;',
  'tar': 'text-align: right;',
  'ta:r': 'text-align: right;',
  'taj': 'text-align: justify;',
  'ta:j': 'text-align: justify;',

  // Text-decoration
  'tdu': 'text-decoration: underline;',
  'td:u': 'text-decoration: underline;',
  'tdn': 'text-decoration: none;',
  'td:n': 'text-decoration: none;',

  // Text-transform
  'ttu': 'text-transform: uppercase;',
  'tt:u': 'text-transform: uppercase;',
  'ttl': 'text-transform: lowercase;',
  'tt:l': 'text-transform: lowercase;',
  'ttc': 'text-transform: capitalize;',
  'tt:c': 'text-transform: capitalize;',

  // Font-style
  'fsi': 'font-style: italic;',
  'fs:i': 'font-style: italic;',
  'fsn': 'font-style: normal;',
  'fs:n': 'font-style: normal;',
  'fso': 'font-style: oblique;',
  'fs:o': 'font-style: oblique;',

  // Font-weight
  'fwb': 'font-weight: bold;',
  'fw:b': 'font-weight: bold;',
  'fwn': 'font-weight: normal;',
  'fw:n': 'font-weight: normal;',
  'fwbr': 'font-weight: bolder;',
  'fw:br': 'font-weight: bolder;',
  'fwlr': 'font-weight: lighter;',
  'fw:lr': 'font-weight: lighter;',

  // Font-variant
  'fvsc': 'font-variant: small-caps;',
  'fv:sc': 'font-variant: small-caps;',
  'fvn': 'font-variant: normal;',
  'fv:n': 'font-variant: normal;',
}

/**
 * Breidt een afkorting uit. Controleert eerst de PhpStorm CSS-tabel en
 * roept bij geen match de officiële Emmet-plugin aan.
 */
export function expandEmmetOrPhpStorm(view: EditorView, lang: 'html' | 'css' | 'js'): boolean {
  if (lang === 'js') return false

  if (lang === 'css') {
    const sel = view.state.selection.main
    if (sel.empty) {
      const line = view.state.doc.lineAt(sel.anchor)
      const lineTextBefore = line.text.slice(0, sel.anchor - line.from)
      const match = lineTextBefore.match(/(?:^|[\s;{}])([a-zA-Z0-9_:#.-]+)$/)

      if (match) {
        const abbr = match[1]
        const expansion = PHPSTORM_CSS_EMMET_MAP[abbr]
        if (expansion) {
          const from = sel.anchor - abbr.length
          const lineTextAfter = line.text.slice(sel.anchor - line.from)
          const hasTrailingSemicolon = lineTextAfter.startsWith(';')
          const to = hasTrailingSemicolon ? sel.anchor + 1 : sel.anchor

          view.dispatch({
            changes: { from, to, insert: expansion },
            selection: { anchor: from + expansion.length },
            scrollIntoView: true,
          })
          return true
        }
      }
    }
  }

  // Standaard Emmet expansie voor HTML en reguliere CSS
  return expandAbbreviation(view)
}

/**
 * Autocompletion bron voor PhpStorm CSS Emmet snelkoppelingen
 */
export const phpstormCssEmmetCompletion: CompletionSource = (context) => {
  const word = context.matchBefore(/[a-zA-Z0-9_:#.-]+/)
  if (!word) return null
  const query = word.text.toLowerCase()

  const matches = Object.entries(PHPSTORM_CSS_EMMET_MAP)
    .filter(([abbr]) => abbr.toLowerCase().startsWith(query))
    .map(([abbr, expansion]) => ({
      label: abbr,
      detail: expansion,
      type: 'snippet',
      apply: expansion,
      boost: 99,
    }))

  if (matches.length === 0) return null

  return {
    from: word.from,
    options: matches,
  }
}

/**
 * Maakt een gecombineerde keymap voor Tab-expansie van Emmet en PhpStorm shortcuts
 */
export function createEmmetKeymap(getLang: () => 'html' | 'css' | 'js'): Extension {
  return keymap.of([
    {
      key: 'Tab',
      run: (view) => {
        const lang = getLang()
        if (lang !== 'js') {
          const expanded = expandEmmetOrPhpStorm(view, lang)
          if (expanded) return true
        }
        return indentWithTab.run!(view)
      },
    },
  ])
}

export { abbreviationTracker }
