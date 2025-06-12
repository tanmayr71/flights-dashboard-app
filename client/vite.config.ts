import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";   // needed for alias helper

export default defineConfig({
  plugins: [react(), tailwind()],               // ← no tsconfigPaths()
  resolve: {
    alias: {
      "@shared": fileURLToPath(new URL("../shared", import.meta.url)),
    },
  },
  optimizeDeps: {
    exclude: ['@myproj/shared']  // don't pre-bundle the shared workspace package
  },
});
