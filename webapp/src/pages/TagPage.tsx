import { Link, useParams } from 'react-router-dom'
import { FileSpreadsheet } from 'lucide-react'
import { getRelatedTags, getSnippetsByTag, tagPath } from '@/lib/tags'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { Badge } from '@/components/ui/Badge'
import type { Snippet } from '@/types'

// Every lesson that carries one tag, grouped by track, with the tags it shares most
// with the others as a way to keep exploring.
export function TagPage() {
  const { tag = '' } = useParams()
  const matches = getSnippetsByTag(tag)
  const related = getRelatedTags(tag)

  useDocumentTitle(`Tag: ${tag}`)

  const groups = new Map<string, { label: string; slug: string; lessons: Snippet[] }>()
  for (const snippet of matches) {
    const group = groups.get(snippet.categorySlug) ?? { label: snippet.categoryLabel, slug: snippet.categorySlug, lessons: [] }
    group.lessons.push(snippet)
    groups.set(snippet.categorySlug, group)
  }

  return (
    <div className="mx-auto max-w-4xl animate-fade-up pb-16">
      <header className="mb-8">
        <p className="text-xs text-[var(--color-ink-faint)]">Tag</p>
        <h1 className="mt-1 text-3xl font-semibold break-words text-[var(--color-ink)]">{tag}</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-faint)]">
          {matches.length} {matches.length === 1 ? 'lesson' : 'lessons'}
          {groups.size > 1 ? ` across ${groups.size} tracks` : ''}
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--color-ink-dim)]">
          Tags come from a lesson's track and folder, its section titles, and the functions its code uses.
        </p>
      </header>

      {matches.length === 0 && (
        <GlassPanel className="p-8 text-center text-sm text-[var(--color-ink-faint)]">
          No lessons are tagged "{tag}". Try the search instead, or go back to the{' '}
          <Link to="/" className="underline underline-offset-4 hover:text-[var(--color-ink)]">
            home page
          </Link>
          .
        </GlassPanel>
      )}

      <div className="flex flex-col gap-10">
        {[...groups.values()].map((group) => (
          <section key={group.slug}>
            <h2 className="mb-3 flex items-baseline gap-2 text-sm font-semibold tracking-wider text-[var(--color-ink-faint)] uppercase">
              <Link to={`/c/${group.slug}`} className="transition-colors hover:text-[var(--color-ink-dim)]">
                {group.label}
              </Link>
              <span className="font-mono text-xs font-normal normal-case">{group.lessons.length}</span>
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {group.lessons.map((snippet) => {
                const isData = snippet.filename.endsWith('.csv')
                return (
                  <Link key={snippet.id} to={`/s/${snippet.id}`} className="group">
                    <GlassPanel className="h-full p-4 transition-all group-hover:-translate-y-0.5 group-hover:border-[var(--color-border-strong)]">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="flex min-w-0 items-center gap-1.5 font-medium text-[var(--color-ink)]">
                          {isData && <FileSpreadsheet className="h-3.5 w-3.5 shrink-0" />}
                          <span className="truncate">{snippet.title}</span>
                        </h3>
                        <span className="shrink-0 font-mono text-[11px] text-[var(--color-ink-faint)]">
                          {snippet.lineCount}L
                        </span>
                      </div>
                      <p className="mt-1 truncate font-mono text-xs text-[var(--color-ink-faint)]">{snippet.filename}</p>
                    </GlassPanel>
                  </Link>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      {related.length > 0 && (
        <section className="mt-12 border-t border-[var(--color-border)] pt-6">
          <h2 className="mb-3 text-sm font-semibold tracking-wider text-[var(--color-ink-faint)] uppercase">
            Often together with
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {related.map((item) => (
              <Link key={item.tag} to={tagPath(item.tag)} className="group">
                <Badge className="transition-colors group-hover:border-[var(--color-border-strong)] group-hover:text-[var(--color-ink)]">
                  {item.tag}
                  <span className="font-mono text-[10px] text-[var(--color-ink-faint)]">{item.count}</span>
                </Badge>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
