import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ThemeProvider } from '@/hooks/useTheme'
import { CodeFontSizeProvider } from '@/hooks/useCodeFontSize'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <CodeFontSizeProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </CodeFontSizeProvider>
    </ThemeProvider>
  </StrictMode>,
)
