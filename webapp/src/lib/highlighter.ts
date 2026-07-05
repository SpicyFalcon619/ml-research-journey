import { createHighlighterCore, type HighlighterCore } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import python from 'shiki/langs/python.mjs'
import poimandres from 'shiki/themes/poimandres.mjs'

let highlighterPromise: Promise<HighlighterCore> | null = null

export function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [poimandres],
      langs: [python],
      engine: createJavaScriptRegexEngine(),
    })
  }
  return highlighterPromise
}
