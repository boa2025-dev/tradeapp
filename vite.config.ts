import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'remove-crossorigin',
      transformIndexHtml(html: string) {
        return html.replace(/\s+crossorigin/g, '')
      },
    },
  ],
  base: './',
})
