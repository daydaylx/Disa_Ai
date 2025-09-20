import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { analyzer } from "vite-bundle-analyzer";
import { aggressiveRemoveConsolePlugin } from "./build/vite-remove-console";

const analyzerPlugin = analyzer({
  analyzerMode: process.env.BUNDLE_ANALYZE_MODE ?? "static",
  openAnalyzer: false,
  enabled: process.env.BUNDLE_ANALYZE !== "false",
});

export default defineConfig({
  plugins: [react(), aggressiveRemoveConsolePlugin(), analyzerPlugin],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor splitting for better caching
          vendor: ["react", "react-dom"],
          // Utils and libraries
          utils: ["zod", "js-yaml"],
          // Effects and animations
          effects: [
            "@/lib/sound/audio-feedback",
            "@/components/effects/PremiumEffects",
            "@/styles/plugins/neon",
          ],
          // UI components
          ui: [
            "@/components/ui/GlassCard",
            "@/components/ui/GlassTile",
            "@/components/ui/HeroOrb",
            "@/components/ui/Button",
          ],
        },
      },
    },
  },
});
