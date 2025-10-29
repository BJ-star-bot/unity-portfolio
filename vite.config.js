import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages: use relative base so assets work under subpath
export default defineConfig({
  base: './',
  plugins: [react()],
})
