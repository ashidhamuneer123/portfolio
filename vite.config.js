import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' keeps asset paths relative, so the build works on Vercel,
// Hostinger, Namecheap or any sub-folder without changes.
export default defineConfig({
  plugins: [react()],
  base: './',
})
