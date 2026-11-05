import { useCallback, useEffect, useRef, useState } from 'react'
import { Play, RotateCcw, Square, Undo2 } from 'lucide-react'
import { pyRunner, RunStopped, usePyStatus } from '@/lib/pyRunner'
import type { PyStream } from '@/lib/pyProtocol'
import { ImageLightbox } from '@/components/code/OutputPanel'
import PyEditor from '@/components/code/PyEditor'
import { cn } from '@/lib/cn'

interface Chunk {
  stream: PyStream
  text: string
}

interface LiveRunnerProps {
  /** Which variable space this editor runs in. Editors with the same key share variables. */
  sessionKey: string
  /** The lesson's repo path, or a made-up name like "playground.py". */
  filename: string
  initialCode: string
  firstLine?: number
  /** The lesson's earlier code blocks, run first (silently) so this one has the variables it expects. */
  priorCode?: string[]
  onCodeChange?: (code: string) => void
  variant?: 'block' | 'page'
  label?: string
}

const needsTypedInput = (code: string) => /\binput\s*\(/.test(code)

const button =
  'flex min-h-6 cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[13px] transition-colors disabled:cursor-not-allowed disabled:opacity-50'
const quiet =
  'border-[var(--color-code-border)] bg-[var(--color-code-surface)] text-[var(--color-code-ink-dim)] hover:border-[var(--color-code-border-strong)] hover:bg-[var(--color-code-surface-hover)] hover:text-[var(--color-code-ink)]'

export default function LiveRunner({
  sessionKey,
  filename,
  initialCode,
  firstLine = 1,
  priorCode = [],
  onCodeChange,
  variant = 'block',
  label = 'Editable Python code',
}: LiveRunnerProps) {
  const status = usePyStatus()
  const [code, setCode] = useState(initialCode)
  const [chunks, setChunks] = useState<Chunk[]>([])
  const [images, setImages] = useState<string[]>([])
  const [running, setRunning] = useState(false)
  const [outcome, setOutcome] = useState<{ ok: boolean; ms: number } | null>(null)
  const [note, setNote] = useState('')
  const [typed, setTyped] = useState('')
  const [withPrior, setWithPrior] = useState(true)
  const [zoomed, setZoomed] = useState<string | null>(null)

  // Output arrives line by line, sometimes thousands of lines a second; paint it once per frame.
  const buffer = useRef<Chunk[]>([])
  const frame = useRef(0)
  const flush = useCallback(() => {
    frame.current = 0
    const pending = buffer.current
    buffer.current = []
    if (!pending.length) return
    setChunks((current) => {
      const next = current.slice()
      for (const piece of pending) {
        const last = next[next.length - 1]
        if (last && last.stream === piece.stream) next[next.length - 1] = { stream: last.stream, text: last.text + piece.text }
        else next.push(piece)
      }
      return next
    })
  }, [])
  const append = useCallback(
    (stream: PyStream, text: string) => {
      buffer.current.push({ stream, text })
      if (!frame.current) frame.current = requestAnimationFrame(flush)
    },
    [flush],
  )
  useEffect(() => () => cancelAnimationFrame(frame.current), [])

  const edit = (next: string) => {
    setCode(next)
    onCodeChange?.(next)
  }

  const run = async () => {
    if (running) return
    setRunning(true)
    setChunks([])
    setImages([])
    setOutcome(null)
    setNote('')
    buffer.current = []
    try {
      if (withPrior) {
        for (const part of priorCode) {
          // A part that waits for typed input cannot be replayed on its own, so it is skipped.
          if (needsTypedInput(part)) continue
          const early = await pyRunner.run({ key: sessionKey, code: part, filename, silent: true, onOutput: (s, t) => s === 'err' && append(s, t) })
          if (!early.ok) {
            setNote('An earlier part of the lesson failed, so this part was not run.')
            return
          }
        }
      }
      const lines = typed.length ? typed.split('\n') : []
      const result = await pyRunner.run({ key: sessionKey, code, filename, inputs: lines, onOutput: append })
      flush()
      setImages(result.images)
      setOutcome({ ok: result.ok, ms: result.ms })
    } catch (error) {
      flush()
      if (error instanceof RunStopped) setNote('Stopped. Python restarts on the next run, so variables from earlier runs are cleared.')
      else append('err', `${error instanceof Error ? error.message : String(error)}\n`)
    } finally {
      flush()
      setRunning(false)
    }
  }

  const resetVariables = () => {
    pyRunner.reset(sessionKey)
    setNote('Variables cleared. The next run starts fresh.')
  }

  const busyElsewhere = !running && status.phase === 'running'
  const changed = code !== initialCode
  const showOutput = chunks.length > 0 || images.length > 0 || note || outcome
  const progress = running && (status.phase === 'loading' || status.phase === 'running') ? status.message : ''

  return (
    <div className={cn('live', variant === 'page' && 'live-page')}>
      <PyEditor value={code} onChange={edit} onRun={() => void run()} firstLine={firstLine} label={label} />

      <div className="guide-part-bar">
        <div className="flex flex-wrap items-center gap-2">
          {running ? (
            <button type="button" onClick={() => pyRunner.stop()} className={cn(button, 'border-[var(--color-code-ember)] text-[var(--color-code-ember-soft)] hover:bg-[var(--color-code-surface-hover)]')}>
              <Square className="h-3 w-3 fill-current" aria-hidden /> Stop
            </button>
          ) : (
            <button
              type="button"
              onClick={() => void run()}
              disabled={busyElsewhere}
              className={cn(button, 'border-[var(--color-code-accent-glow)] bg-[var(--color-code-accent-glow)]/20 text-[var(--color-code-accent-soft)] hover:bg-[var(--color-code-accent-glow)]/35')}
            >
              <Play className="h-3 w-3" aria-hidden /> Run
            </button>
          )}
          <span className="hidden text-xs text-[var(--color-code-ink-faint)] sm:inline">Ctrl+Enter</span>
          {priorCode.length > 0 && (
            <label className="flex min-h-6 cursor-pointer items-center gap-1.5 text-xs text-[var(--color-code-ink-dim)]">
              <input type="checkbox" checked={withPrior} onChange={(event) => setWithPrior(event.target.checked)} className="h-3.5 w-3.5 cursor-pointer accent-[var(--color-accent)]" />
              Run the earlier parts first
            </label>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {changed && (
            <button type="button" onClick={() => edit(initialCode)} className={cn(button, quiet)}>
              <Undo2 className="h-3 w-3" aria-hidden /> Revert
            </button>
          )}
          <button type="button" onClick={resetVariables} className={cn(button, quiet)} title="Forget every variable from earlier runs">
            <RotateCcw className="h-3 w-3" aria-hidden /> Reset variables
          </button>
        </div>
      </div>

      {needsTypedInput(code) && (
        <label className="live-input">
          <span>Typed input for input(), one line for each call</span>
          <textarea value={typed} onChange={(event) => setTyped(event.target.value)} rows={2} spellCheck={false} placeholder="For example: 42" />
        </label>
      )}

      <div className="live-status" role="status" aria-live="polite">
        {progress || (busyElsewhere ? 'Python is busy with another part.' : '')}
      </div>

      {showOutput && (
        <div className="guide-part-out" role="region" aria-label="Output">
          {chunks.length > 0 && (
            <pre tabIndex={0}>
              {chunks.map((chunk, index) => (
                <span key={index} className={chunk.stream === 'err' ? 'live-err' : undefined}>
                  {chunk.text}
                </span>
              ))}
            </pre>
          )}
          {images.map((src, index) => (
            <button key={index} type="button" onClick={() => setZoomed(src)} aria-label="Enlarge this figure" className="guide-part-figure">
              <img src={src} alt="A figure drawn by this code" />
            </button>
          ))}
          {note && <p className="guide-part-none">{note}</p>}
          {outcome && chunks.length === 0 && images.length === 0 && !note && <p className="guide-part-none">The code ran and printed nothing.</p>}
          {outcome && <p className="live-meta">{outcome.ok ? `Ran in ${(outcome.ms / 1000).toFixed(2)} s` : 'Stopped with an error'}</p>}
        </div>
      )}
      {zoomed && <ImageLightbox src={zoomed} onClose={() => setZoomed(null)} />}
    </div>
  )
}
