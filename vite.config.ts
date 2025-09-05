import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "public",
      filename: "sw.js",
      injectRegister: null,
      registerType: "autoUpdate",
      manifest: {
        name: "Disa Ai",
        short_name: "Disa Ai",
        theme_color: "#0a0a0a",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    target: "es2020",
    sourcemap: false,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks(id: string): string | undefined {
          // Vendor-Split
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "vendor-react";
            return "vendor";
          }
          // Feature-Split: Modell-Picker
          if (id.includes("features/models")) return "models";
          // Standard: keine separate Chunk-Zuweisung
          return undefined;
        }
      }
    }
  }
});
