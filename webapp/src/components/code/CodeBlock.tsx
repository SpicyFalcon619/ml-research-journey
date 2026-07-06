import { useEffect, useRef, useState } from 'react'
import type { ShikiTransformer } from 'shiki'
import { AnimatePresence } from 'framer-motion'
import { Play } from 'lucide-react'
import { getHighlighter, SHIKI_THEME_BY_SITE_THEME } from '@/lib/highlighter'
import { useTheme } from '@/hooks/useTheme'
import { computeFoldRanges } from '@/lib/foldRanges'
import type { CapturedOutput } from '@/lib/outputs'
import { CopyButton } from './CopyButton'
import { OutputPanel } from './OutputPanel'
import { cn } from '@/lib/cn'

interface CodeBlockProps {
  code: string
  filename?: string
  focusLine?: number
  className?: string
  output?: CapturedOutput
}

const lineIdTransformer: ShikiTransformer = {
  line(node, line) {
    node.properties.id = `L${line}`
    this.addClassToHast(node, 'code-line')
  },
}

export function CodeBlock({ code, filename, focusLine, className, output }: CodeBlockProps) {
  const [siteTheme] = useTheme()
  const [html, setHtml] = useState<string | null>(null)
  const [showOutput, setShowOutput] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    getHighlighter().then((highlighter) => {
      if (cancelled) return
      const out = highlighter.codeToHtml(code, {
        lang: filename?.endsWith('.csv') ? 'csv' : 'python',
        theme: SHIKI_THEME_BY_SITE_THEME[siteTheme],
        transformers: [lineIdTransformer],
      })
      setHtml(out)
    })
    return () => {
      cancelled = true
    }
  }, [code, siteTheme])

  // Injects a fold toggle on every line that opens a block (def/class/if/for/...),
  // so users can collapse just that block instead of the whole file. This is done
  // imperatively on the Shiki-rendered DOM rather than in JSX, since the highlighted
  // markup is inserted via dangerouslySetInnerHTML.
  useEffect(() => {
    if (!html || !containerRef.current) return
    const root = containerRef.current
    const ranges = computeFoldRanges(code)
    const disposers: (() => void)[] = []

    for (const range of ranges) {
      const headerEl = root.querySelector<HTMLElement>(`#L${range.start}`)
      if (!headerEl) continue

      const bodyLines: HTMLElement[] = []
      for (let n = range.start + 1; n <= range.end; n++) {
        const el = root.querySelector<HTMLElement>(`#L${n}`)
        if (el) bodyLines.push(el)
      }
      if (bodyLines.length === 0) continue

      const toggle = document.createElement('button')
      toggle.type = 'button'
      toggle.className = 'fold-toggle'
      toggle.setAttribute('aria-label', 'Toggle code fold')
      headerEl.prepend(toggle)

      const summary = document.createElement('span')
      summary.className = 'fold-summary'
      summary.textContent = ` ⋯ ${bodyLines.length} line${bodyLines.length === 1 ? '' : 's'} hidden`

      let folded = false
      function handleClick() {
        folded = !folded
        toggle.classList.toggle('folded', folded)
        for (const line of bodyLines) line.classList.toggle('fold-hidden', folded)
        if (folded) headerEl!.appendChild(summary)
        else summary.remove()
      }

      toggle.addEventListener('click', handleClick)
      disposers.push(() => toggle.removeEventListener('click', handleClick))
    }

    return () => {
      disposers.forEach((dispose) => dispose())
    }
  }, [html, code])

  useEffect(() => {
    if (!html || !focusLine || !containerRef.current) return
    const el = containerRef.current.querySelector(`#L${focusLine}`)
    if (!el) return
    // Un-fold any ancestor block so a search/topic jump into folded code is visible.
    el.classList.remove('fold-hidden')
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.classList.add('line-flash')
    const t = setTimeout(() => el.classList.remove('line-flash'), 1800)
    return () => clearTimeout(t)
  }, [html, focusLine])

  return (
    <div
      className={cn(
        'group relative rounded-xl border border-[var(--color-code-border)] bg-[var(--color-code-bg)] shadow-[var(--shadow-code)] transition-colors hover:border-[var(--color-code-border-strong)]',
        className,
      )}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-xl border-b border-[var(--color-code-border)] bg-[var(--color-code-bg)] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/70" />
          {filename && (
            <span className="ml-3 font-mono text-xs text-[var(--color-code-ink-faint)]">{filename}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {output && !filename?.endsWith('.csv') && (
            <button
              onClick={() => setShowOutput((v) => !v)}
              className={cn(
                'flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs transition-colors',
                showOutput
                  ? 'border-[var(--color-code-accent-glow)] bg-[var(--color-code-accent-glow)]/20 text-[var(--color-code-accent-soft)]'
                  : 'border-[var(--color-code-border)] bg-[var(--color-code-surface)] text-[var(--color-code-ink-dim)] hover:border-[var(--color-code-border-strong)] hover:bg-[var(--color-code-surface-hover)] hover:text-[var(--color-code-ink)]',
              )}
            >
              <Play className="h-3.5 w-3.5" /> Run
            </button>
          )}
          <CopyButton text={code} />
        </div>
      </div>
      <div ref={containerRef} className="code-scroll overflow-x-auto py-3 text-[13px] leading-relaxed">
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <pre className="px-4 font-mono text-[var(--color-code-ink-dim)]">{code}</pre>
        )}
      </div>
      <AnimatePresence initial={false}>
        {showOutput && output && <OutputPanel key="output" output={output} />}
      </AnimatePresence>
    </div>
  )
}
