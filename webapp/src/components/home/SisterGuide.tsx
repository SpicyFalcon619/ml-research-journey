import { ArrowUpRight } from 'lucide-react'
import { otherGuides } from '@/lib/guides'

// The field guides are separate sites that point at each other. This block sits under the home page's hero.
export function SisterGuide() {
  return (
    <aside aria-label="The other field guides" className="mt-8 border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
      <p className="text-xs font-semibold tracking-[0.14em] text-[var(--color-ink-faint)] uppercase">Also from this notebook</p>
      <ul className="mt-3 grid gap-4 sm:grid-cols-2">
        {otherGuides.map((guide) => (
          <li key={guide.id} className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-[var(--color-ink)]">{guide.name}</h2>
            <p className="text-[15px] leading-relaxed text-[var(--color-ink-dim)]">{guide.blurb}</p>
            <a
              href={guide.url}
              className="inline-flex min-h-6 w-fit items-center gap-1.5 text-[15px] text-[var(--color-ink-dim)] underline decoration-[var(--color-border-strong)] underline-offset-4 transition-colors hover:text-[var(--color-ink)]"
            >
              Open the {guide.name}
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </aside>
  )
}
