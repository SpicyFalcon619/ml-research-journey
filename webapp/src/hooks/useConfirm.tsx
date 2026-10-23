import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ConfirmDialog, type ConfirmOptions } from '@/components/ui/ConfirmDialog'

type Confirm = (options: ConfirmOptions) => Promise<boolean>

// Outside a provider nothing is confirmed: the safe answer for "are you sure?".
const ConfirmContext = createContext<Confirm>(() => Promise.resolve(false))

interface Pending {
  options: ConfirmOptions
}

// `const confirm = useConfirm()` then `if (await confirm({ title: ... })) doIt()`: the same shape as
// the browser's confirm(), but drawn by the site itself.
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<Pending | null>(null)
  const resolver = useRef<((confirmed: boolean) => void) | null>(null)

  const confirm = useCallback<Confirm>((options) => {
    // A second request while one is open counts as "no" for the first.
    resolver.current?.(false)
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve
      setPending({ options })
    })
  }, [])

  const settle = useCallback((confirmed: boolean) => {
    resolver.current?.(confirmed)
    resolver.current = null
    setPending(null)
  }, [])

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AnimatePresence>{pending && <ConfirmDialog key="confirm" options={pending.options} onResolve={settle} />}</AnimatePresence>
    </ConfirmContext.Provider>
  )
}

export function useConfirm(): Confirm {
  return useContext(ConfirmContext)
}
