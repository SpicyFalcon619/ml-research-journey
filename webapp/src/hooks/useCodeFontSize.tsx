import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { applyCodeFontSize, getStoredCodeFontSize } from '@/lib/codeFontSize'

type CodeFontSizeContextValue = readonly [number, (size: number) => void]

const CodeFontSizeContext = createContext<CodeFontSizeContextValue | null>(null)

// Shared across every CodeBlock on the page (and persisted), so bumping the
// size once in a snippet applies everywhere — matches how the theme toggle works.
export function CodeFontSizeProvider({ children }: { children: ReactNode }) {
  const [size, setSize] = useState<number>(getStoredCodeFontSize)

  useEffect(() => {
    applyCodeFontSize(size)
  }, [size])

  return <CodeFontSizeContext.Provider value={[size, setSize]}>{children}</CodeFontSizeContext.Provider>
}

export function useCodeFontSize() {
  const ctx = useContext(CodeFontSizeContext)
  if (!ctx) throw new Error('useCodeFontSize must be used within a CodeFontSizeProvider')
  return ctx
}
