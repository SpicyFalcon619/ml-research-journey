import { StrictMode } from 'react'
import { MotionConfig } from 'framer-motion'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ThemeProvider } from '@/hooks/useTheme'
import { CodeFontSizeProvider } from '@/hooks/useCodeFontSize'
import { LibraryProvider } from '@/hooks/useLibrary'
import { AssistantProvider } from '@/hooks/useAssistant'
import { ConfirmProvider } from '@/hooks/useConfirm'
import { ErrorBoundary, reloadOnceForStaleCode } from '@/components/ui/ErrorBoundary'
import './index.css'
import App from './App.tsx'

// Vite reports a failed code download (an old tab after an update) with this event.
window.addEventListener('vite:preloadError', (event) => {
  if (reloadOnceForStaleCode()) event.preventDefault()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
    <MotionConfig reducedMotion="user">
    <ThemeProvider>
      <CodeFontSizeProvider>
        <LibraryProvider>
          <AssistantProvider>
            <ConfirmProvider>
              <HashRouter>
                <App />
              </HashRouter>
            </ConfirmProvider>
          </AssistantProvider>
        </LibraryProvider>
      </CodeFontSizeProvider>
    </ThemeProvider>
    </MotionConfig>
    </ErrorBoundary>
  </StrictMode>,
)
