import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ThemeProvider } from '@/hooks/useTheme'
import { CodeFontSizeProvider } from '@/hooks/useCodeFontSize'
import { LibraryProvider } from '@/hooks/useLibrary'
import { AssistantProvider } from '@/hooks/useAssistant'
import { ConfirmProvider } from '@/hooks/useConfirm'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
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
  </StrictMode>,
)
