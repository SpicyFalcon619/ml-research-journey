import { Fragment } from 'react'

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Wraps the parts of `text` that match the search words in <mark>, so you can
// see why a result matched. Search is fuzzy, so a hit may have nothing to mark.
export function Highlight({ text, query }: { text: string; query: string }) {
  const words = query
    .trim()
    .split(/\s+/)
    .filter((word) => word.length >= 2)
  if (words.length === 0) return <>{text}</>

  const pattern = new RegExp(`(${words.map(escapeRegExp).join('|')})`, 'ig')
  return (
    <>
      {text.split(pattern).map((part, i) =>
        // split() with one capture group puts every match at an odd index
        i % 2 === 1 ? (
          <mark key={i} className="rounded-sm bg-[var(--color-accent-glow)] text-inherit">
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  )
}
