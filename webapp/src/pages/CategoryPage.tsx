import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowRight, FileSpreadsheet } from 'lucide-react'
import { navGroups, flattenNavItems, countSnippets } from '@/lib/roadmap'
import { CATEGORY_INFO } from '@/lib/categoryInfo'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { Badge } from '@/components/ui/Badge'

export function CategoryPage() {
  const { categorySlug } = useParams()
  const categories = navGroups.flatMap((g) => g.categories)
  const index = categories.findIndex((c) => c.slug === categorySlug)
  const category = categories[index]
  const nextCategory = categories[index + 1]

  useDocumentTitle(category?.label)

  if (!category) return <Navigate to="/" replace />

  const sections = flattenNavItems([category]).filter((s) => s.snippets.length > 0)
  const info = CATEGORY_INFO[category.slug]

  return (
    <div className="mx-auto max-w-4xl animate-fade-up pb-16">
      <header className="mb-8">
        <p className="text-xs text-[var(--color-ink-faint)]">
          Track {index + 1} of {categories.length}
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-[var(--color-ink)]">{category.label}</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-faint)]">{countSnippets(category)} snippets</p>
        {info && <p className="mt-3 max-w-2xl leading-relaxed text-[var(--color-ink-dim)]">{info}</p>}
      </header>
      <div className="flex flex-col gap-10">
        {sections.map((section) => (
          <div key={section.slug}>
            {section.slug !== category.slug ? (
              <h2 className="mb-3 text-sm font-semibold tracking-wider text-[var(--color-ink-faint)] uppercase">
                {section.label}
              </h2>
            ) : (
              // Keeps the heading outline valid (h1 > h2 > h3) when a track has no sub-sections.
              <h2 className="sr-only">Lessons</h2>
            )}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {section.snippets.map((snippet) => {
                const isData = snippet.filename.endsWith('.csv')
                const rowCount = snippet.code.split('\n').filter((l) => l.trim().length > 0).length - 1
                return (
                  <Link key={snippet.id} to={`/s/${snippet.id}`} className="min-w-0">
                    <GlassPanel className="group h-full p-4 transition-all hover:-translate-y-0.5 hover:border-[var(--color-border-strong)]">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="flex items-center gap-1.5 font-medium text-[var(--color-ink)]">
                          {isData && <FileSpreadsheet className="h-3.5 w-3.5 shrink-0" />}
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

      {nextCategory && (
        <Link
          to={`/c/${nextCategory.slug}`}
          className="mt-12 flex items-center justify-between gap-4 border-t border-[var(--color-border)] pt-6 text-[var(--color-ink-dim)] transition-colors hover:text-[var(--color-ink)]"
        >
          <span>
            <span className="block text-xs text-[var(--color-ink-faint)]">Next track</span>
            <span className="font-medium">{nextCategory.label}</span>
          </span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
