import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import { fileURLToPath, URL } from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwind()
  ],
  resolve: {
    alias: {
      // same mapping the compiler sees
      "@shared": fileURLToPath(new URL("../shared", import.meta.url))
    }
  }
})