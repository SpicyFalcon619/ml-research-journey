import { useEffect } from 'react'

const BASE_TITLE = 'ML Field Guide · Python to machine learning'

// Gives every page its own browser-tab title (and so its own history/bookmark
// entry) instead of the same static one everywhere.
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ML Field Guide` : BASE_TITLE
    return () => {
      document.title = BASE_TITLE
    }
  }, [title])
}
