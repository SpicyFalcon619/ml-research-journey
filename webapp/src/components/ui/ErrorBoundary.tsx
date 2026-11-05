import { Component, type ErrorInfo, type ReactNode } from 'react'

// A page that fails to render, or a piece of code that fails to download, must never leave a
// blank screen: this catches it, offers a way forward, and keeps the error readable.

const CHUNK_ERROR = /dynamically imported module|importing a module script failed|ChunkLoadError|Loading chunk|Outdated Optimize Dep/i
const RELOAD_KEY = 'mlfg-chunk-reload'

/** A stale tab (opened before a new version was published) can't find the code it asks for. A fresh load fixes it. */
export function reloadOnceForStaleCode(): boolean {
  try {
    const last = Number(window.sessionStorage.getItem(RELOAD_KEY) ?? 0)
    if (Date.now() - last < 30_000) return false // already tried a moment ago: show the message instead of looping
    window.sessionStorage.setItem(RELOAD_KEY, String(Date.now()))
  } catch {
    return false
  }
  window.location.reload()
  return true
}

interface Props {
  children: ReactNode
  /** Compact version for inside the page frame; the full version is the last line of defence. */
  inline?: boolean
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Field Guide: a page failed to render.', error, info.componentStack)
    if (CHUNK_ERROR.test(error.message)) reloadOnceForStaleCode()
  }

  render() {
    const { error } = this.state
    if (!error) return this.props.children

    const stale = CHUNK_ERROR.test(error.message)
    return (
      <div
        role="alert"
        className={this.props.inline ? 'mx-auto max-w-2xl py-16' : 'mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-16'}
        style={{ color: 'var(--color-ink, #edeef2)' }}
      >
        <h1 className="text-4xl leading-none font-bold sm:text-5xl">{stale ? 'This page is out of date.' : 'Something went wrong.'}</h1>
        <p className="mt-4 text-lg leading-relaxed" style={{ color: 'var(--color-ink-dim, #9a9aa8)' }}>
          {stale
            ? 'The guide was updated while this tab was open. Reloading gets you the latest version.'
            : 'This page could not be shown. Reloading usually fixes it, and your progress is safe because it is stored in this browser.'}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <button type="button" onClick={() => window.location.reload()} className="plate">
            Reload
          </button>
          <a href="#/" onClick={() => this.setState({ error: null })} className="underline underline-offset-4">
            Go to the home page
          </a>
        </div>
        <details className="mt-8 text-sm" style={{ color: 'var(--color-ink-faint, #8a8a94)' }}>
          <summary className="cursor-pointer">Details for the person fixing it</summary>
          <pre className="mt-2 overflow-x-auto whitespace-pre-wrap">{String(error.stack ?? error.message)}</pre>
        </details>
      </div>
    )
  }
}
