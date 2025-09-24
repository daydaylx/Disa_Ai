import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { analyzer } from "vite-bundle-analyzer";
import { aggressiveRemoveConsolePlugin } from "./build/vite-remove-console";
import { swVersionPlugin } from "./build/vite-sw-version-plugin.js";

const analyzerPlugin = analyzer({
  analyzerMode: process.env.BUNDLE_ANALYZE_MODE ?? "static",
  openAnalyzer: false,
  enabled: process.env.BUNDLE_ANALYZE !== "false",
});

export default defineConfig({
  plugins: [react(), swVersionPlugin(), aggressiveRemoveConsolePlugin(), analyzerPlugin],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    target: "esnext",
    minify: "esbuild",
    cssMinify: "esbuild",
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React vendors
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "vendor-react";
          }
          // UI/Styling libraries
          if (id.includes("node_modules/@heroicons") || id.includes("node_modules/tailwindcss")) {
            return "vendor-ui";
          }
          // Data/API libraries
          if (id.includes("node_modules/zod") || id.includes("node_modules/js-yaml")) {
            return "vendor-data";
          }
          // Markdown/Text processing (for future markdown features)
          if (
            id.includes("node_modules/marked") ||
            id.includes("node_modules/highlight.js") ||
            id.includes("node_modules/katex")
          ) {
            return "vendor-markdown";
          }
          // Everything else stays in main bundle for better mobile performance
          return undefined;
        },
        // Optimize for mobile bandwidth
        compact: true,
        entryFileNames: "js/[name]-[hash].js",
        chunkFileNames: "js/[name]-[hash].js",
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split(".");
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name)) {
            return "css/[name]-[hash].[ext]";
          }
          return "assets/[name]-[hash].[ext]";
        },
      },
    },
  },
});
