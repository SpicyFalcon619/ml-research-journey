import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { GradientMesh } from '@/components/layout/GradientMesh'
import { MobileDrawer } from '@/components/layout/MobileDrawer'
import { Sidebar } from '@/components/layout/Sidebar'
import { SidebarToggle } from '@/components/layout/SidebarToggle'
import { TopBar } from '@/components/layout/TopBar'
import { CommandPalette } from '@/components/search/CommandPalette'
import { Home } from '@/pages/Home'
import { CategoryPage } from '@/pages/CategoryPage'
import { SearchResultsPage } from '@/pages/SearchResultsPage'
import { TagPage } from '@/pages/TagPage'
import { ExplorePage } from '@/pages/ExplorePage'
import { ProgressPage } from '@/pages/ProgressPage'
import { AskButton } from '@/components/ai/AskButton'
import { SelectionAsk } from '@/components/ai/SelectionAsk'
import { useAssistant } from '@/hooks/useAssistant'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { cn } from '@/lib/cn'

// Shiki (syntax highlighting) is only needed once a snippet is opened, so keep
// it out of the initial bundle that Home/CategoryPage load.
// The assistant panel is also loaded on demand: most visits never open it.
const AssistantPanel = lazy(() => import('@/components/ai/AssistantPanel').then((m) => ({ default: m.AssistantPanel })))
const SnippetPage = lazy(() => import('@/pages/SnippetPage').then((m) => ({ default: m.SnippetPage })))

// A new route should start at the top, like a real page load. Jumps to a
// specific line (?line=) are left alone: the code block scrolls there itself.
function ScrollToTopOnNavigate() {
  const { pathname, search } = useLocation()
  const first = useRef(true)
  useEffect(() => {
    // Move keyboard and screen-reader focus to the new page (not on the very first load).
    if (first.current) first.current = false
    else document.getElementById('main')?.focus({ preventScroll: true })
    if (new URLSearchParams(search).has('line')) return
    window.scrollTo(0, 0)
  }, [pathname, search])
  return null
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}

function NotFound() {
  return (
    <div className="mx-auto max-w-2xl py-16">
      <h1 className="text-5xl leading-none font-bold text-[var(--color-ink)]">That page is not on the map.</h1>
      <p className="mt-4 text-lg text-[var(--color-ink-dim)]">The link may be old, or mistyped.</p>
      <Link to="/" className="plate mt-6">
        Back to the map
      </Link>
    </div>
  )
}

function App() {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const { pathname } = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(() => !['', '#', '#/'].includes(window.location.hash))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { everOpened } = useAssistant()

  // On Home the journey map is the navigation, so the path rail steps aside; every other page opens it.
  useEffect(() => {
    setSidebarOpen(pathname !== '/')
  }, [pathname])

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen((v) => !v)
      } else if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !isTypingTarget(event.target)) {
        // "/" opens search too, as on most documentation sites.
        event.preventDefault()
        setPaletteOpen(true)
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [])

  return (
    <>
      <a href="#main" className="skip-link" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}>
        Skip to the page
      </a>
      <GradientMesh />
      <ScrollToTopOnNavigate />
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside
          aria-label="Lesson path"
          className={cn(
            'sticky top-0 hidden h-screen shrink-0 border-r border-[var(--color-border)] lg:block transition-[width,opacity,margin] duration-300 ease-in-out',
            sidebarOpen ? 'w-72 opacity-100' : 'w-0 border-none opacity-0 overflow-hidden'
          )}
        >
          <div className="w-72 h-full">
            <Sidebar />
          </div>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col transition-all duration-300 ease-in-out">
          <SidebarToggle open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
          <TopBar
            onOpenSearch={() => setPaletteOpen(true)}
            onOpenDrawer={() => setDrawerOpen(true)}
            sidebarOpen={sidebarOpen}
          />
          <main id="main" tabIndex={-1} className="flex-1 px-4 py-8 pb-20 sm:px-10 sm:pb-8">
            <ErrorBoundary inline key={pathname}>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Home onOpenSearch={() => setPaletteOpen(true)} />} />
                <Route path="/c/:categorySlug" element={<CategoryPage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/tag/:tag" element={<TagPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/me" element={<ProgressPage />} />
                <Route path="/s/:id" element={<SnippetPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            </ErrorBoundary>
          </main>
        </div>
      </div>
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <AskButton />
      <SelectionAsk />
      {everOpened && (
        <Suspense fallback={null}>
          <AssistantPanel />
        </Suspense>
      )}
    </>
  )
}

export default App
