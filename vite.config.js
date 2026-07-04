import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/sirac-portfolio/',
  build: {
    // Raise the warning threshold — vendor-three is intentionally large
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 3D rendering — largest chunk, keep isolated
            if (
              id.includes('three') ||
              id.includes('@react-three') ||
              id.includes('@react-spring') ||
              id.includes('troika-three-text') ||
              id.includes('three-stdlib')
            ) {
              return 'vendor-three';
            }
            // Animation library — second largest, split from app
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            // i18n — moderate size, rarely changes
            if (id.includes('i18next') || id.includes('react-i18next')) {
              return 'vendor-i18n';
            }
            // Smooth scroll
            if (id.includes('lenis')) {
              return 'vendor-lenis';
            }
            // Remaining react runtime
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
          }
        }
      }
    }
  }
})
