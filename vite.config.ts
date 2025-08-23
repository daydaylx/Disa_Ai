import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") }
  },
  plugins: [
    react(),
    VitePWA({
      manifest: true,          // wir liefern ein Manifest in /public
      registerType: "autoUpdate",
      selfDestroying: true,    // installierbar, aber ohne Offline-Caching
      injectRegister: "auto"
    })
  ]
});
