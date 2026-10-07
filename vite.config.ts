import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { svgSprite } from './vite/svg-sprite'

export default defineConfig({
  plugins: [
    vue(),
    svgSprite({
      dir: fileURLToPath(new URL('./src/shared/ui/icon/svg', import.meta.url)),
      typesFile: fileURLToPath(new URL('./src/shared/ui/icon/icon-names.ts', import.meta.url)),
    }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    proxy: {
      '/api': { target: 'http://localhost:8000', changeOrigin: true },
    },
  },
})
