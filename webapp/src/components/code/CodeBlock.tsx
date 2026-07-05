import { useEffect, useRef, useState } from 'react'
import type { ShikiTransformer } from 'shiki'
import { getHighlighter } from '@/lib/highlighter'
import { CopyButton } from './CopyButton'
import { cn } from '@/lib/cn'

interface CodeBlockProps {
  code: string
  filename?: string
  focusLine?: number
  className?: string
}

const lineIdTransformer: ShikiTransformer = {
  line(node, line) {
    node.properties.id = `L${line}`
    this.addClassToHast(node, 'code-line')
  },
}

export function CodeBlock({ code, filename, focusLine, className }: CodeBlockProps) {
  const [html, setHtml] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    getHighlighter().then((highlighter) => {
      if (cancelled) return
      const out = highlighter.codeToHtml(code, {
        lang: 'python',
        theme: 'poimandres',
        transformers: [lineIdTransformer],
      })
      setHtml(out)
    })
    return () => {
      cancelled = true
    }
  }, [code])

  useEffect(() => {
    if (!html || !focusLine || !containerRef.current) return
    const el = containerRef.current.querySelector(`#L${focusLine}`)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    el.classList.add('line-flash')
    const t = setTimeout(() => el.classList.remove('line-flash'), 1800)
    return () => clearTimeout(t)
  }, [html, focusLine])

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[#0b0b14] shadow-[var(--shadow-glass)] transition-colors hover:border-[var(--color-border-strong)]',
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-[var(--color-border)] bg-white/[0.025] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/70" />
          {filename && (
            <span className="ml-3 font-mono text-xs text-[var(--color-ink-faint)]">{filename}</span>
          )}
        </div>
        <CopyButton text={code} />
      </div>
      <div ref={containerRef} className="code-scroll overflow-x-auto py-3 text-[13px] leading-relaxed">
        {html ? (
          <div dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <pre className="px-4 font-mono text-[var(--color-ink-dim)]">{code}</pre>
        )}
      </div>
    </div>
  )
}
