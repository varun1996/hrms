import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const envDir = fileURLToPath(new URL('.', import.meta.url))
  const env = loadEnv(mode, envDir, '')
  const apiBaseUrl = env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
  console.log("apiBaseUrl: ", apiBaseUrl)
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': apiBaseUrl,
        '/docs': apiBaseUrl,
      },
    },
  }
})
