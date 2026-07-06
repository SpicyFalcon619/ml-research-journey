import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CircleCheck, Flame, Grid3x3, LineChart, Search, Table2, Terminal } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { snippets } from '@/lib/content'
import { navGroups, basecamps, countSnippets } from '@/lib/roadmap'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { StatTile } from '@/components/ui/StatTile'

const CATEGORY_ICON: Record<string, LucideIcon> = {
  'python-tutorial': Terminal,
  'numpy-basics': Grid3x3,
  'pandas-basics': Table2,
  'classical-ml': LineChart,
  'deep-learning-pytorch': Flame,
}

export function Home({ onOpenSearch }: { onOpenSearch: () => void }) {
  const categories = navGroups.flatMap((g) => g.categories)
  const totalLines = snippets.reduce((sum, s) => sum + s.lineCount, 0)

  return (
    <div className="mx-auto max-w-5xl">
      <section className="animate-fade-up py-10 text-center sm:py-16">
        <p className="mb-3 text-sm font-medium tracking-[0.2em] text-[var(--color-accent-soft)] uppercase">
          Personal Field Guide
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-[var(--color-ink)] sm:text-6xl">
          Every line you've written,
          <br className="hidden sm:block" /> one search away.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[var(--color-ink-dim)]">
          A living reference of every Python, NumPy, Pandas, and scikit-learn snippet from the ML
          Research trail — instantly searchable.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={onOpenSearch}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-[var(--color-accent)] px-5 py-3 text-sm font-medium text-[var(--color-accent-ink)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Search className="h-4 w-4" /> Search the guide
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Snippets" value={snippets.length} />
        <StatTile label="Categories" value={categories.length} />
        <StatTile label="Lines of code" value={totalLines} />
        <StatTile label="Basecamps started" value={basecamps.filter((b) => b.doneCount > 0).length} />
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2">
        {categories.map((category, i) => {
          const Icon = CATEGORY_ICON[category.slug] ?? Terminal
          return (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <Link to={`/c/${category.slug}`}>
                <GlassPanel className="group flex h-full flex-col justify-between p-5 transition-all hover:-translate-y-0.5 hover:border-[var(--color-border-strong)] hover:shadow-[0_0_0_1px_var(--color-accent-glow)]">
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                      <Icon className="h-5 w-5 text-[var(--color-accent-soft)]" strokeWidth={1.75} />
                    </div>
                    <h3 className="mt-3 text-lg font-medium text-[var(--color-ink)]">{category.label}</h3>
                    <p className="mt-1 text-sm text-[var(--color-ink-faint)]">
                      {countSnippets(category)} snippets
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-sm text-[var(--color-accent-soft)] opacity-0 transition-opacity group-hover:opacity-100">
                    Browse <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </GlassPanel>
              </Link>
            </motion.div>
          )
        })}
      </section>

      <section className="mt-10 pb-16">
        <h2 className="mb-4 text-sm font-semibold tracking-wider text-[var(--color-ink-faint)] uppercase">
          Trail Progress
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {basecamps.map((b) => {
            const cleared = b.totalCount > 0 && b.doneCount === b.totalCount
            return (
              <GlassPanel key={b.slug} className="p-4">
                <div className="flex items-baseline gap-1.5 text-sm">
                  <span className="font-medium text-[var(--color-ink)]">{b.title}</span>
                  {cleared && (
                    <CircleCheck
                      className="h-3.5 w-3.5 shrink-0 translate-y-0.5 text-[var(--color-accent-soft)]"
                      strokeWidth={2}
                    />
                  )}
                </div>
                {b.tagline && <p className="mt-1 text-xs text-[var(--color-ink-faint)]">{b.tagline}</p>}
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-surface-hover)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-ember)] transition-[width] duration-500"
                    style={{ width: `${b.totalCount ? (b.doneCount / b.totalCount) * 100 : 0}%` }}
                  />
                </div>
              </GlassPanel>
            )
          })}
        </div>
      </section>
    </div>
  )
}
