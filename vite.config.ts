import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
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
        id: "/",
        start_url: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#0a0a0a",
        theme_color: "#0a0a0a",
        lang: "de",
        scope: "/",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/icons/maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
          { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
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
    // Für Debug-Builds per ENV aktivierbar, Standard bleibt aus
    sourcemap: process.env.DEBUG_SOURCEMAP === "1",
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
        },
      },
    },
  },
}));
