import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
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
