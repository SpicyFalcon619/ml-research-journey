import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getStoredKey, getStoredModel, looksLikeKey, removeKey, saveKey, saveModel } from '@/lib/groq'

interface AssistantValue {
  open: boolean
  /** True once opened, so the (lazy) panel is only downloaded when someone wants it. */
  everOpened: boolean
  /** A question waiting to be sent as soon as the panel is ready. */
  pending: string | null
  apiKey: string
  model: string
  openAssistant: (prompt?: string) => void
  closeAssistant: () => void
  consumePending: () => void
  setApiKey: (key: string) => void
  clearApiKey: () => void
  setModel: (id: string) => void
}

const AssistantContext = createContext<AssistantValue | null>(null)

// Holds the assistant's open state and the saved Groq key. The key is kept in this browser's
// storage only. A setup link (#/?k=...) stores a key for whoever opens it, then removes it
// from the address bar so it isn't left in the history or in screenshots.
export function AssistantProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [everOpened, setEverOpened] = useState(false)
  const [pending, setPending] = useState<string | null>(null)
  const [apiKey, setKeyState] = useState(getStoredKey)
  const [model, setModelState] = useState(getStoredModel)

  useEffect(() => {
    const match = window.location.hash.match(/[?&]k=([^&]+)/)
    if (!match) return
    const key = decodeURIComponent(match[1])
    if (looksLikeKey(key)) {
      saveKey(key)
      setKeyState(key)
    }
    const cleaned = window.location.hash.replace(/([?&])k=[^&]*&?/, '$1').replace(/[?&]$/, '')
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${cleaned}`)
  }, [])

  const openAssistant = useCallback((prompt?: string) => {
    setEverOpened(true)
    setOpen(true)
    if (prompt) setPending(prompt)
  }, [])

  const value = useMemo<AssistantValue>(
    () => ({
      open,
      everOpened,
      pending,
      apiKey,
      model,
      openAssistant,
      closeAssistant: () => setOpen(false),
      consumePending: () => setPending(null),
      setApiKey: (key) => {
        saveKey(key)
        setKeyState(key.trim())
      },
      clearApiKey: () => {
        removeKey()
        setKeyState('')
      },
      setModel: (id) => {
        saveModel(id)
        setModelState(id)
      },
    }),
    [open, everOpened, pending, apiKey, model, openAssistant],
  )

  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>
}

export function useAssistant() {
  const ctx = useContext(AssistantContext)
  if (!ctx) throw new Error('useAssistant must be used within an AssistantProvider')
  return ctx
}
