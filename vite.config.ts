import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',  // Cloudflare Pages deploys to root
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
