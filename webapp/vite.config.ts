import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages serves this project from /ml-research-journey/; local dev/preview stays at root.
  base: command === 'build' ? '/ml-research-journey/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    fs: {
      // Content (.py files) lives in sibling folders one level above webapp/
      allow: ['..'],
    },
  },
}))
