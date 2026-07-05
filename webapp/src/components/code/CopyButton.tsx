import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 rounded-md border border-[var(--color-code-border)] bg-[var(--color-code-surface)] px-2.5 py-1 text-xs text-[var(--color-code-ink-dim)] transition-colors hover:border-[var(--color-code-border-strong)] hover:bg-[var(--color-code-surface-hover)] hover:text-[var(--color-code-ink)] cursor-pointer"
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5"
          >
            <Check className="h-3.5 w-3.5 text-emerald-400" /> Copied
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5"
          >
            <Copy className="h-3.5 w-3.5" /> Copy
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
