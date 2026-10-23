import type { ThemeId } from './theme'

// ---- Appearance (global: saved and applied to every capture) ----------------

export type WindowStyle = 'macos' | 'windows' | 'linux' | 'minimal' | 'none'
export type CaptureBackground = 'transparent' | 'theme' | 'light' | 'dark' | 'custom'

export interface CaptureStyle {
  /** "site" follows whichever theme the site is showing; otherwise a fixed theme. */
  theme: 'site' | ThemeId
  windowStyle: WindowStyle
  showTitle: boolean
  lineNumbers: boolean
  fontSize: number
  padding: number
  background: CaptureBackground
  customColor: string
  radius: number
  shadow: boolean
  scale: number
}

export const DEFAULT_STYLE: CaptureStyle = {
  theme: 'site',
  windowStyle: 'macos',
  showTitle: true,
  lineNumbers: true,
  fontSize: 14,
  padding: 32,
  background: 'theme',
  customColor: '#1f2937',
  radius: 12,
  shadow: true,
  scale: 2,
}

export const WINDOW_STYLES: { id: WindowStyle; label: string }[] = [
  { id: 'macos', label: 'macOS' },
  { id: 'windows', label: 'Windows' },
  { id: 'linux', label: 'Linux' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'none', label: 'None' },
]

export const FONT_SIZES = [12, 14, 16, 18, 20]
export const PADDINGS = [
  { value: 0, label: 'None' },
  { value: 16, label: 'Small' },
  { value: 32, label: 'Medium' },
  { value: 64, label: 'Large' },
]
export const RADII = [
  { value: 0, label: 'Square' },
  { value: 12, label: 'Rounded' },
  { value: 20, label: 'Round' },
]
export const SCALES = [1, 2, 3]
export const BACKGROUNDS: { id: CaptureBackground; label: string }[] = [
  { id: 'transparent', label: 'Transparent' },
  { id: 'theme', label: 'Theme' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'custom', label: 'Custom' },
]

const STORAGE_KEY = 'mlfg-capture-style-v1'
const THEME_IDS = ['dark', 'vesper', 'light', 'midnight', 'paper', 'terminal', 'expedition']

// Anything read back from storage is validated field by field, so a hand-edited or
// out-of-date value can never put the dialog into a state it can't render.
export function loadStyle(): CaptureStyle {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STYLE
    const s = JSON.parse(raw) as Record<string, unknown>
    const d = DEFAULT_STYLE
    const pick = <T,>(value: unknown, allowed: readonly T[], fallback: T): T =>
      allowed.includes(value as T) ? (value as T) : fallback
    return {
      theme: pick(s.theme, ['site', ...THEME_IDS] as CaptureStyle['theme'][], d.theme),
      windowStyle: pick(s.windowStyle, WINDOW_STYLES.map((w) => w.id), d.windowStyle),
      showTitle: typeof s.showTitle === 'boolean' ? s.showTitle : d.showTitle,
      lineNumbers: typeof s.lineNumbers === 'boolean' ? s.lineNumbers : d.lineNumbers,
      fontSize: pick(s.fontSize, FONT_SIZES, d.fontSize),
      padding: pick(s.padding, PADDINGS.map((p) => p.value), d.padding),
      background: pick(s.background, BACKGROUNDS.map((b) => b.id), d.background),
      customColor: typeof s.customColor === 'string' && /^#[0-9a-f]{6}$/i.test(s.customColor) ? s.customColor : d.customColor,
      radius: pick(s.radius, RADII.map((r) => r.value), d.radius),
      shadow: typeof s.shadow === 'boolean' ? s.shadow : d.shadow,
      scale: pick(s.scale, SCALES, d.scale),
    }
  } catch {
    return DEFAULT_STYLE
  }
}

export function saveStyle(style: CaptureStyle) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(style))
  } catch {
    // Not persisting is harmless; the dialog still works for this visit.
  }
}

// ---- Line summaries ----------------------------------------------------------

/** Collapse [1,2,3,7,9,10] into "1-3, 7, 9-10". */
export function formatRanges(lines: number[]): string {
  const parts: string[] = []
  let start = lines[0]
  let prev = lines[0]
  for (let i = 1; i <= lines.length; i++) {
    const n = lines[i]
    if (n === prev + 1) {
      prev = n
      continue
    }
    parts.push(start === prev ? String(start) : `${start}-${prev}`)
    start = n
    prev = n
  }
  return parts.join(', ')
}
