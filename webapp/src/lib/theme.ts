export type ThemeId = 'dark' | 'vesper' | 'light'

export interface ThemeOption {
  id: ThemeId
  label: string
  description: string
}

export const THEME_OPTIONS: ThemeOption[] = [
  { id: 'dark', label: 'Aurora', description: 'Default dark' },
  { id: 'vesper', label: 'Vesper', description: 'Near-black, peach accent' },
  { id: 'light', label: 'Daylight', description: 'Light mode' },
]

const STORAGE_KEY = 'mlfg-theme'

function isThemeId(value: string | null): value is ThemeId {
  return value === 'dark' || value === 'vesper' || value === 'light'
}

export function getStoredTheme(): ThemeId {
  if (typeof window === 'undefined') return 'dark'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return isThemeId(stored) ? stored : 'dark'
}

export function applyTheme(theme: ThemeId) {
  document.documentElement.setAttribute('data-theme', theme)
  window.localStorage.setItem(STORAGE_KEY, theme)
}
