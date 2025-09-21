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
    cssMinify: "esbuild",
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunk for core React
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "vendor";
          }
          // Small utilities chunk
          if (id.includes("node_modules/zod") || id.includes("node_modules/js-yaml")) {
            return "utils";
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
