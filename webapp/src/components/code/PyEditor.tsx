import { useEffect, useRef } from 'react'
import { EditorState } from '@codemirror/state'
import { drawSelection, EditorView, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers } from '@codemirror/view'
import { defaultKeymap, history, historyKeymap, indentLess, indentMore } from '@codemirror/commands'
import { bracketMatching, indentOnInput, indentUnit, syntaxHighlighting } from '@codemirror/language'
import { python } from '@codemirror/lang-python'
import { classHighlighter } from '@lezer/highlight'

interface PyEditorProps {
  value: string
  onChange: (code: string) => void
  /** Ctrl+Enter (Cmd+Enter on a Mac). */
  onRun: () => void
  /** The number shown beside the first line, so a lesson's blocks keep their real line numbers. */
  firstLine?: number
  label: string
}

// The colours come from the site's own variables, so the editor follows whichever theme is on.
const editorTheme = EditorView.theme({
  '&': { color: 'var(--color-code-ink)', backgroundColor: 'var(--color-code-bg)', fontSize: 'var(--code-font-size)' },
  '.cm-scroller': { fontFamily: 'var(--font-mono)', lineHeight: '1.6' },
  '.cm-content': { caretColor: 'var(--color-code-accent-soft)', padding: '0.6rem 0' },
  '.cm-line': { padding: '0 1rem 0 0.5rem' },
  '.cm-gutters': { backgroundColor: 'transparent', color: 'var(--color-code-ink-faint)', border: 'none' },
  '.cm-lineNumbers .cm-gutterElement': { padding: '0 0.5rem 0 0.9rem' },
  '.cm-activeLine': { backgroundColor: 'var(--color-code-surface)' },
  '.cm-activeLineGutter': { backgroundColor: 'transparent', color: 'var(--color-code-ink)' },
  '&.cm-focused': { outline: '2px solid var(--color-code-accent-soft)', outlineOffset: '-2px' },
  '.cm-cursor': { borderLeftColor: 'var(--color-code-accent-soft)' },
  '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground': {
    backgroundColor: 'var(--color-code-accent-glow)',
  },
  '.cm-matchingBracket': { backgroundColor: 'var(--color-code-accent-glow)', outline: 'none' },
})

export default function PyEditor({ value, onChange, onRun, firstLine = 1, label }: PyEditorProps) {
  const host = useRef<HTMLDivElement>(null)
  const view = useRef<EditorView | null>(null)
  // Callbacks change on every render; the editor reads the latest through these.
  const latest = useRef({ onChange, onRun })
  latest.current = { onChange, onRun }

  useEffect(() => {
    if (!host.current) return
    // Tab indents, which would trap a keyboard user inside the editor. Esc then Tab moves on instead.
    let leaveOnTab = false
    const tab = (view: EditorView, indent: (v: EditorView) => boolean) => {
      if (leaveOnTab) {
        leaveOnTab = false
        return false
      }
      return indent(view)
    }
    const editor = new EditorView({
      parent: host.current,
      state: EditorState.create({
        doc: value,
        extensions: [
          lineNumbers({ formatNumber: (n) => String(n + firstLine - 1) }),
          highlightActiveLine(),
          highlightActiveLineGutter(),
          history(),
          drawSelection(),
          indentOnInput(),
          bracketMatching(),
          indentUnit.of('    '),
          EditorState.tabSize.of(4),
          python(),
          syntaxHighlighting(classHighlighter),
          editorTheme,
          EditorView.contentAttributes.of({
            'aria-label': `${label}. Press Escape, then Tab, to leave the editor.`,
            tabindex: '0',
            spellcheck: 'false',
            autocapitalize: 'off',
            autocorrect: 'off',
          }),
          keymap.of([
            { key: 'Mod-Enter', run: () => (latest.current.onRun(), true) },
            {
              key: 'Escape',
              run: () => {
                leaveOnTab = true
                return true
              },
            },
            { key: 'Tab', run: (v) => tab(v, indentMore) },
            { key: 'Shift-Tab', run: (v) => tab(v, indentLess) },
            ...defaultKeymap,
            ...historyKeymap,
          ]),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) latest.current.onChange(update.state.doc.toString())
            if (update.docChanged || update.selectionSet) leaveOnTab = false
          }),
        ],
      }),
    })
    view.current = editor
    return () => {
      editor.destroy()
      view.current = null
    }
    // The editor is created once; later changes to `value` are applied below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // The page can replace the text (for example "Revert"); typing in the editor never takes this path.
  useEffect(() => {
    const editor = view.current
    if (editor && editor.state.doc.toString() !== value) {
      editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: value } })
    }
  }, [value])

  return <div ref={host} className="live-editor" />
}
