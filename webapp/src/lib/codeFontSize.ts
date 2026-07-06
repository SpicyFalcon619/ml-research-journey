export const MIN_CODE_FONT_SIZE = 11
export const MAX_CODE_FONT_SIZE = 20
export const DEFAULT_CODE_FONT_SIZE = 13

const STORAGE_KEY = 'mlfg-code-font-size'

export function getStoredCodeFontSize(): number {
  if (typeof window === 'undefined') return DEFAULT_CODE_FONT_SIZE
  const stored = Number(window.localStorage.getItem(STORAGE_KEY))
  if (!stored || stored < MIN_CODE_FONT_SIZE || stored > MAX_CODE_FONT_SIZE) return DEFAULT_CODE_FONT_SIZE
  return stored
}

export function applyCodeFontSize(size: number) {
  document.documentElement.style.setProperty('--code-font-size', `${size}px`)
  window.localStorage.setItem(STORAGE_KEY, String(size))
}
