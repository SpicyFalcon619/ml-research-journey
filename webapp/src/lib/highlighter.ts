import { createHighlighterCore, type HighlighterCore, type ThemeRegistrationRaw } from 'shiki/core'
import type { ShikiTransformer } from 'shiki'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import python from 'shiki/langs/python.mjs'
import poimandres from 'shiki/themes/poimandres.mjs'
import tokyoNight from 'shiki/themes/tokyo-night.mjs'
import githubLight from 'shiki/themes/github-light.mjs'
import vitesseBlack from 'shiki/themes/vitesse-black.mjs'
import vesper from './themes/vesper-shiki-theme.json'
import quietlight from './themes/quietlight-shiki-theme.json'
import expedition from './themes/expedition-shiki-theme.json'
import type { ThemeId } from './theme'

// Shiki theme name to use for each site theme, so code blocks look native to
// whichever theme is active instead of always rendering the same dark palette.
export const SHIKI_THEME_BY_SITE_THEME: Record<ThemeId, string> = {
  dark: 'poimandres',
  vesper: 'vesper',
  light: 'quietlight',
  midnight: 'tokyo-night',
  paper: 'github-light',
  terminal: 'vitesse-black',
  expedition: 'expedition',
}

// Tokyo Night, GitHub Light and Vitesse Black set comments at 2.6-4.3:1 contrast,
// which reads as "disabled" on a site where the comments *are* the lesson. Recolor
// only the comment rules to a tone that still looks muted but clears 4.5:1. Comments
// are also always italic (and lighter in weight, see .code-line in index.css), so a
// reader can tell notes from code by shape and weight, not by colour alone.
function withReadableComments(theme: ThemeRegistrationRaw, color: string, scopeContains = 'comment'): ThemeRegistrationRaw {
  const italic = scopeContains === 'comment'
  const recolor = (rules: NonNullable<ThemeRegistrationRaw['tokenColors']>) =>
    rules.map((rule) => {
      const scopes = Array.isArray(rule.scope) ? rule.scope : rule.scope ? [rule.scope] : []
      return scopes.some((scope) => scope.includes(scopeContains))
        ? { ...rule, settings: { ...rule.settings, foreground: color, ...(italic ? { fontStyle: 'italic' } : {}) } }
        : rule
    })
  return theme.tokenColors
    ? { ...theme, tokenColors: recolor(theme.tokenColors) }
    : { ...theme, settings: recolor(theme.settings ?? []) }
}

/** Gives every line of a code chunk its real file line number as an id, so search hits and links land on the right line. */
export function chunkTransformer(firstLine: number): ShikiTransformer {
  return {
    line(node, line) {
      node.properties.id = `L${firstLine + line - 1}`
      this.addClassToHast(node, 'code-line')
    },
  }
}

let highlighterPromise: Promise<HighlighterCore> | null = null

export function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [
        withReadableComments(poimandres as unknown as ThemeRegistrationRaw, '#8b92b3'),
        vesper as unknown as ThemeRegistrationRaw,
        withReadableComments(withReadableComments(quietlight as unknown as ThemeRegistrationRaw, '#6a6a6a'), '#3a7a1f', 'string'),
        expedition as unknown as ThemeRegistrationRaw,
        withReadableComments(tokyoNight as unknown as ThemeRegistrationRaw, '#7983b0'),
        withReadableComments(githubLight as unknown as ThemeRegistrationRaw, '#636c76'),
        withReadableComments(vitesseBlack as unknown as ThemeRegistrationRaw, '#778a77'),
      ],
      langs: [python],
      engine: createJavaScriptRegexEngine(),
    })
  }
  return highlighterPromise
}
