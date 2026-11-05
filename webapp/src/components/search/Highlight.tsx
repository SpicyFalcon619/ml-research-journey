import { Fragment } from 'react'
import { highlightWords } from '@/lib/search'

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Wraps the parts of `text` that match the search words (and their plurals) in <mark>, so you
// can see why a result matched. Synonym and typo matches have nothing to mark.
export function Highlight({ text, query }: { text: string; query: string }) {
  // Longest first, so "dictionaries" is marked whole rather than just "dictionar".
  const words = highlightWords(query).sort((a, b) => b.length - a.length)
  if (words.length === 0) return <>{text}</>

  const pattern = new RegExp(`(${words.map(escapeRegExp).join('|')})`, 'ig')
  return (
    <>
      {text.split(pattern).map((part, i) =>
        // split() with one capture group puts every match at an odd index
        i % 2 === 1 ? (
          <mark key={i} className="rounded-[2px] bg-[var(--color-accent-glow)] text-[var(--color-ink)]">
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}
