import { Link, Navigate, useParams } from 'react-router-dom'
import { FileSpreadsheet } from 'lucide-react'
import { navGroups, flattenNavItems, countSnippets } from '@/lib/roadmap'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { Badge } from '@/components/ui/Badge'

export function CategoryPage() {
  const { categorySlug } = useParams()
  const category = navGroups.flatMap((g) => g.categories).find((c) => c.slug === categorySlug)

  if (!category) return <Navigate to="/" replace />

  const sections = flattenNavItems([category]).filter((s) => s.snippets.length > 0)

  return (
    <div className="mx-auto max-w-4xl animate-fade-up pb-16">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-[var(--color-ink)]">{category.label}</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-faint)]">{countSnippets(category)} snippets</p>
      </header>
      <div className="flex flex-col gap-10">
        {sections.map((section) => (
          <div key={section.slug}>
            {section.slug !== category.slug && (
              <h2 className="mb-3 text-sm font-semibold tracking-wider text-[var(--color-ink-faint)] uppercase">
                {section.label}
              </h2>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              {section.snippets.map((snippet) => {
                const isData = snippet.filename.endsWith('.csv')
                const rowCount = snippet.code.split('\n').filter((l) => l.trim().length > 0).length - 1
                return (
                  <Link key={snippet.id} to={`/s/${snippet.id}`}>
                    <GlassPanel className="group h-full p-4 transition-all hover:-translate-y-0.5 hover:border-[var(--color-border-strong)]">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="flex items-center gap-1.5 font-medium text-[var(--color-ink)]">
                          {isData && <FileSpreadsheet className="h-3.5 w-3.5 shrink-0 text-[var(--color-ember)]" />}
                          {snippet.title}
                        </h3>
                        <span className="shrink-0 font-mono text-[11px] text-[var(--color-ink-faint)]">
                          {isData ? `${rowCount} rows` : `${snippet.lineCount}L`}
                        </span>
                      </div>
                      <p className="mt-1 truncate font-mono text-xs text-[var(--color-ink-faint)]">
                        {snippet.filename}
                      </p>
                      {snippet.topics.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {snippet.topics.slice(0, 3).map((t) => (
                            <Badge key={t.line}>{t.label}</Badge>
                          ))}
                        </div>
                      )}
                    </GlassPanel>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
