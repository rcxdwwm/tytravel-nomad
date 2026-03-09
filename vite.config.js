import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/tytravel-nomad/',   // ← À adapter selon votre repo GitHub Pages
})
