import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // API 요청을 Flask 서버로 프록시
      '/api': 'http://localhost:5000'
    }
  }
})
