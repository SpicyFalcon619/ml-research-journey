import { useCallback, useState } from 'react'
import { useLocation } from 'react-router-dom'

// Whether the lesson path (the sidebar) is showing on a wide screen.
//
// The reader's own choice always wins and is remembered, in the same key in all three field guides so they behave
// alike. Until they have made a choice, only the pages that are about lessons (a lesson, a track) open it; the home
// map is its own navigation, and Explore, Sandbox, Progress and Glossary are not about one lesson, so they leave it
// closed. Following a link in the top bar therefore never changes it.
const KEY = 'mlfg-sidebar'
type Choice = 'open' | 'closed'

function readChoice(): Choice | null {
  try {
    const stored = window.localStorage.getItem(KEY)
    return stored === 'open' || stored === 'closed' ? stored : null
  } catch {
    return null
  }
}

const opensByDefault = (pathname: string) => pathname.startsWith('/s/') || pathname.startsWith('/c/')

export function useSidebar() {
  const { pathname } = useLocation()
  const [choice, setChoice] = useState<Choice | null>(readChoice)
  const open = choice ? choice === 'open' : opensByDefault(pathname)

  const toggle = useCallback(() => {
    const next: Choice = open ? 'closed' : 'open'
    setChoice(next)
    try {
      window.localStorage.setItem(KEY, next)
    } catch {
      // Not remembering the choice is fine: it still applies for this visit.
    }
  }, [open])

  return { open, toggle }
}
