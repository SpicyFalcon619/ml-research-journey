import type { CSSProperties, Ref } from 'react'
import { FileCode2, Minus, Square, X } from 'lucide-react'
import type { ThemeId } from '@/lib/theme'
import type { CaptureStyle } from '@/lib/captureSettings'
import { cn } from '@/lib/cn'

interface CaptureCardProps {
  /** Highlighted `<pre>` markup, already reduced to the lines being captured. */
  html: string
  filename?: string
  style: CaptureStyle
  /** The concrete theme to draw in (a "site" choice has already been resolved). */
  theme: ThemeId
  /** Terminal output to print under the code, or empty for none. */
  output?: string
  /** The element that gets exported as the image. */
  ref?: Ref<HTMLDivElement>
}

const MAC_DOTS = ['#ff5f57', '#febc2e', '#28c840']
const MAX_OUTPUT_LINES = 40

function backgroundFor(style: CaptureStyle): string {
  switch (style.background) {
    case 'transparent':
      return 'transparent'
    case 'theme':
      return 'var(--color-bg)'
    case 'light':
      return '#f4f4f5'
    case 'dark':
      return '#0b0b0f'
    case 'custom':
      return style.customColor
  }
}

// The title bar, drawn in the style of each operating system's windows.
function WindowBar({ style, filename }: { style: CaptureStyle; filename?: string }) {
  if (style.windowStyle === 'none') return null
  const title = style.showTitle ? filename : undefined
  const titleClass = 'truncate font-mono text-xs text-[var(--color-code-ink-dim)]'

  if (style.windowStyle === 'minimal') {
    return title ? <div className={cn('px-5 pt-4', titleClass)}>{title}</div> : null
  }

  return (
    <div className="flex items-center border-b border-[var(--color-code-border)] px-4 py-2.5">
      {style.windowStyle === 'macos' && (
        <div className="flex w-full items-center gap-2">
          {MAC_DOTS.map((color) => (
            <span key={color} className="h-3 w-3 rounded-full" style={{ background: color }} />
          ))}
          {title && <span className={cn('ml-3', titleClass)}>{title}</span>}
        </div>
      )}

      {style.windowStyle === 'windows' && (
        <div className="flex w-full items-center justify-between gap-6">
          <div className="flex min-w-0 items-center gap-2">
            <FileCode2 className="h-3.5 w-3.5 shrink-0 text-[var(--color-code-accent-soft)]" />
            {title && <span className={titleClass}>{title}</span>}
          </div>
          <div className="flex items-center gap-5 text-[var(--color-code-ink-dim)]">
            <Minus className="h-3.5 w-3.5" />
            <Square className="h-3 w-3" />
            <X className="h-3.5 w-3.5" />
          </div>
        </div>
      )}

      {style.windowStyle === 'linux' && (
        <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-4">
          <span />
          <span className={titleClass}>{title ?? ''}</span>
          <span className="flex justify-end">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-code-surface-hover)] text-[var(--color-code-ink-dim)]">
              <X className="h-3 w-3" />
            </span>
          </span>
        </div>
      )}
    </div>
  )
}

// One component renders both the live preview and the exported image, so what you
// see in the preview is exactly what the PNG contains.
export function CaptureCard({ html, filename, style, theme, output, ref }: CaptureCardProps) {
  const outputLines = output ? output.replace(/\s+$/, '').split('\n') : []
  const clipped = outputLines.length > MAX_OUTPUT_LINES
  const shown = clipped ? outputLines.slice(0, MAX_OUTPUT_LINES).join('\n') + '\n...' : outputLines.join('\n')

  const card: CSSProperties = {
    borderRadius: style.radius,
    background: 'var(--color-code-bg)',
    color: 'var(--color-code-ink)',
    boxShadow: style.shadow ? '0 24px 48px -16px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--color-code-border)' : 'none',
    border: style.shadow ? 'none' : '1px solid var(--color-code-border)',
  }

  return (
    <div
      ref={ref}
      data-theme={theme}
      style={{ display: 'inline-block', minWidth: 360, padding: style.padding, background: backgroundFor(style) }}
    >
      <div className="overflow-hidden" style={card}>
        <WindowBar style={style} filename={filename} />
        <div
          className={cn('capture-code font-mono px-4 py-4 leading-relaxed', !style.lineNumbers && 'capture-no-numbers')}
          style={{ fontSize: style.fontSize }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {output && (
          <pre
            className="m-0 border-t border-[var(--color-code-border)] px-4 py-3 font-mono leading-relaxed whitespace-pre"
            style={{ background: 'var(--color-code-terminal-bg)', fontSize: style.fontSize - 1 }}
          >
            {shown}
          </pre>
        )}
      </div>
    </div>
  )
}
