import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { applyTheme, getStoredTheme, type ThemeId } from '@/lib/theme'

type ThemeContextValue = readonly [ThemeId, (theme: ThemeId) => void]

const ThemeContext = createContext<ThemeContextValue | null>(null)

// A single shared theme state, provided once at the app root. Previously this
// was a plain hook with its own useState, so every component calling it (the
// ThemeToggle, every CodeBlock) had its own disconnected copy — toggling the
// theme updated the DOM attribute (so CSS-variable-driven colors changed live)
// but components that pick behavior in JS based on the theme (like which Shiki
// syntax theme to render) never re-rendered, since nothing told them the value
// had changed. A refresh "fixed" it only because it re-read localStorage fresh.
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>(getStoredTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  return <ThemeContext.Provider value={[theme, setTheme]}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}
