import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
// import { VitePWA } from "vite-plugin-pwa"; // DEAKTIVIERT: SW nicht verwendet

export default defineConfig(() => {
  const base = process.env.VITE_BASE_URL ?? process.env.BASE_URL ?? "./";
  return {
    base,
    plugins: [
      react(),
      // VitePWA() - DEAKTIVIERT: Service Worker nicht verwendet, Build-Konflikte vermieden
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
          manualChunks(id) {
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
  };
});
