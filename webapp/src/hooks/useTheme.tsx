import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { applyTheme, getStoredPreference, getSystemTheme, type ThemeId, type ThemePreference } from '@/lib/theme'

// [theme actually on screen, setter for the user's preference, the preference itself].
// The preference can be "system"; the first value is always a concrete theme.
type ThemeContextValue = readonly [ThemeId, (preference: ThemePreference) => void, ThemePreference]

const ThemeContext = createContext<ThemeContextValue | null>(null)

// A single shared theme state, provided once at the app root. Previously this
// was a plain hook with its own useState, so every component calling it (the
// ThemeToggle, every CodeBlock) had its own disconnected copy — toggling the
// theme updated the DOM attribute (so CSS-variable-driven colors changed live)
// but components that pick behavior in JS based on the theme (like which Shiki
// syntax theme to render) never re-rendered, since nothing told them the value
// had changed. A refresh "fixed" it only because it re-read localStorage fresh.
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<ThemePreference>(getStoredPreference)
  const [systemTheme, setSystemTheme] = useState<ThemeId>(getSystemTheme)

  // Keep "System" live: if the device flips between light and dark, follow it.
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: light)')
    const handleChange = () => setSystemTheme(getSystemTheme())
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  const theme = preference === 'system' ? systemTheme : preference

  useEffect(() => {
    applyTheme(theme, preference)
  }, [theme, preference])

  return <ThemeContext.Provider value={[theme, setPreference, preference]}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
