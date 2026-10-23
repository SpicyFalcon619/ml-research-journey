export type ThemeId = 'dark' | 'vesper' | 'light' | 'midnight' | 'paper' | 'terminal' | 'expedition'
// What the user picked: a concrete theme, or "system" to follow the device.
export type ThemePreference = ThemeId | 'system'

export interface ThemeSwatch {
  bg: string
  accent: string
  ember: string
}

export interface ThemeOption {
  id: ThemePreference
  label: string
  description: string
  /** A few real colors from the theme, so the picker can show how it will look. */
  swatch: ThemeSwatch
  /** Only "System": the light half, shown beside the dark one. */
  split?: ThemeSwatch
}

// Swatch colors mirror each theme's page background, accent and second accent in index.css.
export const THEME_OPTIONS: ThemeOption[] = [
  { id: 'dark', label: 'Aurora', description: 'Night sky, violet accent', swatch: { bg: '#08080d', accent: '#8b8ff7', ember: '#f2a65a' } },
  { id: 'vesper', label: 'Vesper', description: 'Dusk, peach accent', swatch: { bg: '#101010', accent: '#ffc799', ember: '#99ffe4' } },
  { id: 'light', label: 'Quiet Light', description: 'Soft daylight, muted purple', swatch: { bg: '#f5f5f5', accent: '#705697', ember: '#9c5d27' } },
  { id: 'midnight', label: 'Midnight', description: 'Deep sea, cyan accent', swatch: { bg: '#0a0f1e', accent: '#5ccfe6', ember: '#ff9e64' } },
  { id: 'paper', label: 'Paper', description: 'Warm stock, terracotta ink', swatch: { bg: '#f4efe6', accent: '#b4532a', ember: '#2e6f68' } },
  { id: 'terminal', label: 'Terminal', description: 'Phosphor green on black', swatch: { bg: '#070a07', accent: '#4ade80', ember: '#facc15' } },
  { id: 'expedition', label: 'Expedition', description: 'Navy and gold, like the roadmap', swatch: { bg: '#0c1118', accent: '#d2a14e', ember: '#c06a3f' } },
  {
    id: 'system',
    label: 'System',
    description: 'Follows your device, day and night',
    swatch: { bg: '#08080d', accent: '#8b8ff7', ember: '#f2a65a' },
    split: { bg: '#f5f5f5', accent: '#705697', ember: '#9c5d27' },
  },
]

const STORAGE_KEY = 'mlfg-theme'

function isThemePreference(value: string | null): value is ThemePreference {
  return value !== null && THEME_OPTIONS.some((option) => option.id === value)
}

export function getStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'dark'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return isThemePreference(stored) ? stored : 'dark'
}

// "System" resolves to Aurora in a dark OS setting and Quiet Light in a light one.
export function getSystemTheme(): ThemeId {
  if (typeof window === 'undefined' || !window.matchMedia) return 'dark'
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function applyTheme(theme: ThemeId, preference: ThemePreference) {
  document.documentElement.setAttribute('data-theme', theme)
  window.localStorage.setItem(STORAGE_KEY, preference)
}
