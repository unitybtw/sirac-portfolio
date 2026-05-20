import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three') || id.includes('@react-spring') || id.includes('troika-three-text') || id.includes('three-stdlib')) {
              return 'vendor-three';
            }
          }
        }
      }
    }
  }
})
