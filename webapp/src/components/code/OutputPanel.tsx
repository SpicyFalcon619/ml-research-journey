import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent } from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, Clock, ImageIcon, Keyboard, Maximize2, Terminal, X } from 'lucide-react'
import type { CapturedOutput } from '@/lib/outputs'
import { cn } from '@/lib/cn'

export function withBase(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

export function ImageLightbox({ src, onClose }: { src: string; onClose: () => void }) {
  const [zoomed, setZoomed] = useState(false)

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 cursor-pointer rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
      >
        <X className="h-5 w-5" />
      </button>
      <div
        className={cn('max-h-full max-w-full', zoomed ? 'overflow-auto' : 'overflow-hidden')}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt=""
          onClick={() => setZoomed((z) => !z)}
          className={cn(
            'rounded-md',
            zoomed ? 'w-auto max-w-none cursor-zoom-out' : 'max-h-[88vh] max-w-[88vw] cursor-zoom-in object-contain',
          )}
        />
      </div>
    </div>,
    document.body,
  )
}

function OutputImages({ images }: { images: string[] }) {
  const [openSrc, setOpenSrc] = useState<string | null>(null)

  return (
    <div className="border-t border-[var(--color-code-border)] bg-[var(--color-code-bg)] px-4 py-3">
      <div className="mb-2 flex items-center gap-2">
        <ImageIcon className="h-3.5 w-3.5 shrink-0 text-[var(--color-code-ink-faint)]" />
        <span className="text-xs font-medium text-[var(--color-code-ink-dim)]">
          {images.length === 1 ? 'Figure' : `Figures (${images.length})`}
        </span>
        <span className="text-[11px] text-[var(--color-code-ink-faint)]">· click to zoom</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {images.map((src) => {
          const url = withBase(src)
          return (
            <a
              key={src}
              href={url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => {
                // Plain left-click opens the in-app zoom view instead of a new
                // tab; a modifier-click (or right-click, via the native context
                // menu) still opens the real link the normal browser way.
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
                e.preventDefault()
                setOpenSrc(url)
              }}
              className="group relative block h-36 overflow-hidden rounded-lg border border-[var(--color-code-border)] bg-[var(--color-code-surface)] transition-colors hover:border-[var(--color-code-border-strong)]"
            >
              <img src={url} alt="" className="h-full w-auto" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-150 group-hover:bg-black/40 group-hover:opacity-100">
                <Maximize2 className="h-4 w-4 text-white" />
              </div>
            </a>
          )
        })}
      </div>

      {openSrc && <ImageLightbox src={openSrc} onClose={() => setOpenSrc(null)} />}
    </div>
  )
}

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
          <pre className="code-font whitespace-pre font-mono leading-relaxed text-[var(--color-code-ink)]">
            {active.stdout}
          </pre>
        </div>
      )}
    </div>
  )
}

const OUTPUT_HEIGHT_KEY = 'mlfg-output-height'
const DEFAULT_OUTPUT_HEIGHT = 160
const MIN_OUTPUT_HEIGHT = 80
const KEY_STEP = 24

function maxOutputHeight() {
  return Math.max(MIN_OUTPUT_HEIGHT + 40, Math.round(window.innerHeight * 0.75))
}

function clampHeight(value: number) {
  return Math.min(maxOutputHeight(), Math.max(MIN_OUTPUT_HEIGHT, Math.round(value)))
}

function readStoredHeight() {
  try {
    const stored = Number(window.localStorage.getItem(OUTPUT_HEIGHT_KEY))
    if (stored) return clampHeight(stored)
  } catch {
    // storage blocked: use the default
  }
  return DEFAULT_OUTPUT_HEIGHT
}

// Output panel height, remembered across lessons. The panel sits at the bottom of
// the screen, so dragging its top edge UP makes it taller.
function useOutputHeight() {
  const [height, setHeight] = useState(readStoredHeight)
  const drag = useRef<{ startY: number; startHeight: number } | null>(null)

  const commit = useCallback((value: number) => {
    const next = clampHeight(value)
    setHeight(next)
    try {
      window.localStorage.setItem(OUTPUT_HEIGHT_KEY, String(next))
    } catch {
      // not persisted, still applies for this visit
    }
  }, [])

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { startY: event.clientY, startHeight: height }
  }
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    setHeight(clampHeight(drag.current.startHeight + (drag.current.startY - event.clientY)))
  }
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    commit(drag.current.startHeight + (drag.current.startY - event.clientY))
    drag.current = null
  }
  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowUp') commit(height + KEY_STEP)
    else if (event.key === 'ArrowDown') commit(height - KEY_STEP)
    else if (event.key === 'Home') commit(DEFAULT_OUTPUT_HEIGHT)
    else return
    event.preventDefault()
  }

  const handleProps = {
    role: 'separator' as const,
    'aria-orientation': 'horizontal' as const,
    'aria-label': 'Resize output',
    'aria-valuemin': MIN_OUTPUT_HEIGHT,
    'aria-valuenow': height,
    tabIndex: 0,
    title: 'Drag to resize, double-click to reset',
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
    onKeyDown,
    onDoubleClick: () => commit(DEFAULT_OUTPUT_HEIGHT),
  }
  return { height, handleProps }
}

interface OutputPanelProps {
  output: CapturedOutput
  filename?: string
  onClose?: () => void
}

export function OutputPanel({ output, filename, onClose }: OutputPanelProps) {
  const { height, handleProps } = useOutputHeight()

  return (
    <div className="border-t border-[var(--color-code-border)]">
      <div
        {...handleProps}
        className="group/resize flex h-3 cursor-row-resize touch-none items-center justify-center bg-[var(--color-code-surface)] outline-none"
      >
        <span className="h-1 w-10 rounded-full bg-[var(--color-code-border-strong)] transition-colors group-hover/resize:bg-[var(--color-code-ink-faint)] group-focus-visible/resize:bg-[var(--color-code-accent-soft)]" />
      </div>
      <div className="flex items-center gap-2 bg-[var(--color-code-surface)] px-4 py-2.5">
        <Terminal className="h-3.5 w-3.5 text-[var(--color-code-ink-faint)]" />
        <span className="text-xs font-medium text-[var(--color-code-ink-dim)]">Output</span>
        <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[output.status]}`} />
        {filename && (
          <span className="font-mono text-[11px] text-[var(--color-code-ink-faint)]">{filename}</span>
        )}
        {output.status === 'ok' && (
          <span className={cn('font-mono text-[10px] text-[var(--color-code-ink-faint)]', onClose ? 'ml-auto mr-1' : 'ml-auto')}>
            {output.durationMs}ms
          </span>
        )}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close output"
            className={cn(
              'cursor-pointer rounded-md p-1 text-[var(--color-code-ink-faint)] transition-colors hover:bg-[var(--color-code-surface-hover)] hover:text-[var(--color-code-ink)]',
              output.status !== 'ok' && 'ml-auto',
            )}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div
        className="output-scroll overflow-auto bg-[var(--color-code-terminal-bg)] px-4 py-3"
        tabIndex={0}
        role="group"
        aria-label="Output, scrollable"
        style={{ height }}
      >
        {output.status === 'ok' && (
          <>
            <pre className="code-font whitespace-pre font-mono leading-relaxed text-[var(--color-code-ink)]">
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

        {output.status === 'empty' && !output.images?.length && (
          <p className="font-mono text-[13px] text-[var(--color-code-ink-faint)] italic">
            This script doesn't print anything (yet) — it's an in-progress exercise. Check the
            numbered comments in the code for what's left to fill in.
          </p>
        )}
        {output.status === 'empty' && output.images?.length ? (
          <p className="font-mono text-[13px] text-[var(--color-code-ink-faint)] italic">
            This script doesn't print to the console — see the figure below.
          </p>
        ) : null}

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
          <pre className="code-font whitespace-pre-wrap font-mono leading-relaxed text-rose-300">
            {output.stderr || 'This script exited with an error.'}
          </pre>
        )}
      </div>

      {output.images && output.images.length > 0 && <OutputImages images={output.images} />}
    </div>
  )
}
