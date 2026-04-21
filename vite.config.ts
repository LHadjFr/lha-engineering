import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  preview: {
    host: true,
    port: 4173,
  },
  server: {
    host: true,        // écoute 0.0.0.0 → accessible depuis l'hôte Docker
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: true,
      },
    },
    watch: {
      usePolling: true, // nécessaire pour détecter les changements via volumes Docker
    },
  },
})
