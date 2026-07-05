import { useState } from 'react'
import { AlertTriangle, Clock, Keyboard, Terminal } from 'lucide-react'
import { motion } from 'framer-motion'
import type { CapturedOutput } from '@/lib/outputs'
import { cn } from '@/lib/cn'

const STATUS_DOT: Record<CapturedOutput['status'], string> = {
  ok: 'bg-emerald-400',
  empty: 'bg-[var(--color-code-ink-faint)]',
  interactive: 'bg-[var(--color-code-ember)]',
  timeout: 'bg-[var(--color-code-ember)]',
  error: 'bg-rose-400',
}

function InteractiveScenarioPicker({ output }: { output: CapturedOutput }) {
  const scenarios = output.scenarios ?? []
  const [selected, setSelected] = useState(scenarios.length > 0 ? 0 : -1)

  if (scenarios.length === 0) {
    return (
      <div className="flex gap-2">
        <Keyboard className="h-3.5 w-3.5 shrink-0 translate-y-0.5 text-[var(--color-code-ember)]" />
        <p className="font-mono text-[13px] text-[var(--color-code-ink-faint)] italic">
          This example reads live keyboard input (<code>input()</code>), so it can't be replayed
          here — copy it into your own terminal to try it.
        </p>
      </div>
    )
  }

  const active = scenarios[selected]

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Keyboard className="h-3.5 w-3.5 shrink-0 text-[var(--color-code-ember)]" />
        <p className="font-mono text-xs text-[var(--color-code-ink-faint)]">
          This example asks for input — pick what to type in:
        </p>
      </div>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {scenarios.map((scenario, i) => (
          <button
            key={scenario.label}
            onClick={() => setSelected(i)}
            className={cn(
              'cursor-pointer rounded-full border px-3 py-1 font-mono text-xs transition-colors',
              i === selected
                ? 'border-[var(--color-code-accent-glow)] bg-[var(--color-code-accent-glow)]/20 text-[var(--color-code-accent-soft)]'
                : 'border-[var(--color-code-border)] bg-[var(--color-code-surface)] text-[var(--color-code-ink-dim)] hover:border-[var(--color-code-border-strong)] hover:text-[var(--color-code-ink)]',
            )}
          >
            {scenario.label}
          </button>
        ))}
      </div>
      {active && (
        <div className="rounded-lg border border-[var(--color-code-border)] bg-[var(--color-code-surface)] p-3">
          <p className="mb-2 font-mono text-[11px] text-[var(--color-code-ink-faint)]">
            typed: <span className="text-[var(--color-code-accent-soft)]">{active.inputs.join('  →  ')}</span>
          </p>
          <pre className="whitespace-pre font-mono text-[13px] leading-relaxed text-[var(--color-code-ink)]">
            {active.stdout}
          </pre>
        </div>
      )}
    </div>
  )
}

export function OutputPanel({ output }: { output: CapturedOutput }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="overflow-hidden border-t border-[var(--color-code-border)]"
    >
      <div className="flex items-center gap-2 bg-[var(--color-code-surface)] px-4 py-2.5">
        <Terminal className="h-3.5 w-3.5 text-[var(--color-code-ink-faint)]" />
        <span className="text-xs font-medium text-[var(--color-code-ink-dim)]">Output</span>
        <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[output.status]}`} />
        {output.status === 'ok' && (
          <span className="ml-auto font-mono text-[10px] text-[var(--color-code-ink-faint)]">
            {output.durationMs}ms
          </span>
        )}
      </div>

      <div className="max-h-96 overflow-auto rounded-b-xl bg-[var(--color-code-terminal-bg)] px-4 py-3">
        {output.status === 'ok' && (
          <>
            <pre className="whitespace-pre font-mono text-[13px] leading-relaxed text-[var(--color-code-ink)]">
              {output.stdout}
            </pre>
            {output.stderr && (
              <div className="mt-3 flex gap-2 border-t border-[var(--color-code-border)] pt-3">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 translate-y-0.5 text-[var(--color-code-ember)]" />
                <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-[var(--color-code-ember-soft)]">
                  {output.stderr}
                </pre>
              </div>
            )}
          </>
        )}

        {output.status === 'empty' && (
          <p className="font-mono text-[13px] text-[var(--color-code-ink-faint)] italic">
            This script doesn't print anything (yet) — it's an in-progress exercise. Check the
            numbered comments in the code for what's left to fill in.
          </p>
        )}

        {output.status === 'interactive' && <InteractiveScenarioPicker output={output} />}

        {output.status === 'timeout' && (
          <div className="flex gap-2">
            <Clock className="h-3.5 w-3.5 shrink-0 translate-y-0.5 text-[var(--color-code-ember)]" />
            <p className="font-mono text-[13px] text-[var(--color-code-ink-faint)] italic">
              This example is an intentional infinite loop, so it never finishes on its own — see
              the code comments for what it's demonstrating.
            </p>
          </div>
        )}

        {output.status === 'error' && (
          <pre className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-rose-300">
            {output.stderr || 'This script exited with an error.'}
          </pre>
        )}
      </div>
    </motion.div>
  )
}
