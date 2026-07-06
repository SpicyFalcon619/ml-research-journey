import { lazy, Suspense, useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { GradientMesh } from '@/components/layout/GradientMesh'
import { Sidebar } from '@/components/layout/Sidebar'
import { SidebarToggle } from '@/components/layout/SidebarToggle'
import { TopBar } from '@/components/layout/TopBar'
import { CommandPalette } from '@/components/search/CommandPalette'
import { Home } from '@/pages/Home'
import { CategoryPage } from '@/pages/CategoryPage'
import { SearchResultsPage } from '@/pages/SearchResultsPage'
import { cn } from '@/lib/cn'

// Shiki (syntax highlighting) is only needed once a snippet is opened, so keep
// it out of the initial bundle that Home/CategoryPage load.
const SnippetPage = lazy(() => import('@/pages/SnippetPage').then((m) => ({ default: m.SnippetPage })))

function App() {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [])

  return (
    <>
      <GradientMesh />
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside
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
          <TopBar onOpenSearch={() => setPaletteOpen(true)} sidebarOpen={sidebarOpen} />
          <main className="flex-1 px-4 py-8 sm:px-8">
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Home onOpenSearch={() => setPaletteOpen(true)} />} />
                <Route path="/c/:categorySlug" element={<CategoryPage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/s/:id" element={<SnippetPage />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </div>
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  )
}

export default App
