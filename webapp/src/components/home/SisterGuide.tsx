import { ArrowUpRight } from 'lucide-react'

// The two field guides are separate sites that point at each other. This card sits under the home page's hero.
const JAVA_GUIDE_URL = 'https://spicyfalcon619.github.io/java-field-guide/'

export function SisterGuide() {
  return (
    <aside
      aria-label="The Java Field Guide"
      className="mt-8 flex flex-col gap-4 border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
    >
      <div className="max-w-xl">
        <p className="text-xs font-semibold tracking-[0.14em] text-[var(--color-ink-faint)] uppercase">Also from this notebook</p>
        <h2 className="mt-1.5 text-xl font-bold text-[var(--color-ink)]">New to Java or object oriented programming?</h2>
        <p className="mt-1.5 text-[15px] leading-relaxed text-[var(--color-ink-dim)]">
          The Java Field Guide teaches it from zero: what a program is, variables, loops, then classes, inheritance and polymorphism, in plain
          words and with real output beside every example.
        </p>
      </div>
      <a href={JAVA_GUIDE_URL} className="plate shrink-0 self-start sm:self-center">
        Open the Java Field Guide
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </aside>
  )
}
