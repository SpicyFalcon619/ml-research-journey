export type ThemeId = 'dark' | 'vesper' | 'light' | 'midnight' | 'paper' | 'terminal'
// What the user picked: a concrete theme, or "system" to follow the device.
export type ThemePreference = ThemeId | 'system'

export interface ThemeOption {
  id: ThemePreference
  label: string
  description: string
}

export const THEME_OPTIONS: ThemeOption[] = [
  { id: 'dark', label: 'Aurora', description: 'Default dark' },
  { id: 'vesper', label: 'Vesper', description: 'Near-black, peach accent' },
  { id: 'light', label: 'Quiet Light', description: 'Muted purple accent' },
  { id: 'midnight', label: 'Midnight', description: 'Deep navy, cyan accent' },
  { id: 'paper', label: 'Paper', description: 'Warm cream, terracotta accent' },
  { id: 'terminal', label: 'Terminal', description: 'Near-black, phosphor green' },
  { id: 'system', label: 'System', description: 'Match your device' },
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
