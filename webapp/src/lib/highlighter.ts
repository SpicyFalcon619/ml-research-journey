import { createHighlighterCore, type HighlighterCore, type ThemeRegistrationRaw } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import python from 'shiki/langs/python.mjs'
import poimandres from 'shiki/themes/poimandres.mjs'
import vesper from './themes/vesper-shiki-theme.json'
import quietlight from './themes/quietlight-shiki-theme.json'
import type { ThemeId } from './theme'

// Shiki theme name to use for each site theme, so code blocks look native to
// whichever theme is active instead of always rendering the same dark palette.
export const SHIKI_THEME_BY_SITE_THEME: Record<ThemeId, string> = {
  dark: 'poimandres',
  vesper: 'vesper',
  light: 'quietlight',
}

let highlighterPromise: Promise<HighlighterCore> | null = null

export function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [poimandres, vesper as unknown as ThemeRegistrationRaw, quietlight as unknown as ThemeRegistrationRaw],
      langs: [python],
      engine: createJavaScriptRegexEngine(),
    })
  }
  return highlighterPromise
}
