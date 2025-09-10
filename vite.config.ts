import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Disa_Ai/',  // wichtig für GitHub Pages (Unterpfad)
})
