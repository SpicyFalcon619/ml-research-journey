import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getStoredModel, MODELS, purgeStoredKey, saveModel } from '@/lib/llm'

interface AssistantValue {
  open: boolean
  /** True once opened, so the (lazy) panel is only downloaded when someone wants it. */
  everOpened: boolean
  /** A question waiting to be sent as soon as the panel is ready. */
  pending: string | null
  /** True when the site was built with at least one provider's key. Nobody is ever asked for a key; with none, the assistant is switched off. */
  available: boolean
  model: string
  openAssistant: (prompt?: string) => void
  closeAssistant: () => void
  consumePending: () => void
  setModel: (id: string) => void
}

const AssistantContext = createContext<AssistantValue | null>(null)

// Holds the assistant's open state and the chosen model. The key comes from the build (see
// lib/groq.ts); visitors can't supply one, and a key saved by an older version is deleted.
export function AssistantProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [everOpened, setEverOpened] = useState(false)
  const [pending, setPending] = useState<string | null>(null)
  const [model, setModelState] = useState(getStoredModel)

  useEffect(() => purgeStoredKey(), [])

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
      available: MODELS.length > 0,
      model,
      openAssistant,
      closeAssistant: () => setOpen(false),
      consumePending: () => setPending(null),
      setModel: (id) => {
        saveModel(id)
        setModelState(id)
      },
    }),
    [open, everOpened, pending, model, openAssistant],
  )

  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>
}

export function useAssistant() {
  const ctx = useContext(AssistantContext)
  if (!ctx) throw new Error('useAssistant must be used within an AssistantProvider')
  return ctx
}
