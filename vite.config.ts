import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // The Bounded client pulls in libraries that expect Node's `global` and `buffer`.
  define: { global: "globalThis" },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      buffer: "buffer/",
    },
  },
  build: {
    // The Bounded SDK is one lazily loaded chunk of about 900 kB; that size is expected.
    chunkSizeWarningLimit: 1500,
  },
})
