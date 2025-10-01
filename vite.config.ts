import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { analyzer } from "vite-bundle-analyzer";

const analyzerPlugin = analyzer({
  analyzerMode: process.env.BUNDLE_ANALYZE_MODE ?? "static",
  openAnalyzer: false,
  enabled: process.env.BUNDLE_ANALYZE !== "false",
});

export default defineConfig(({ mode }) => {
  // Umweltspezifische Konfiguration für robuste Asset-Pfade
  const isProduction = mode === "production";
  const base = process.env.VITE_BASE_URL || "/";

  return {
    plugins: [react(), analyzerPlugin],
    base, // Umweltspezifische Basis für Cloudflare Pages
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
      // Robuste Asset-Generation für Cloudflare Pages
      assetsInlineLimit: 4096, // Kleine Assets inline für weniger HTTP-Requests
      cssCodeSplit: true, // CSS-Chunks für besseres Caching
      // Production-spezifische Optimierungen
      ...(isProduction && {
        sourcemap: false, // Kleinere Builds in Production
        reportCompressedSize: false, // Schnellere Builds
      }),
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Core React vendors (strict separation)
            if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/")) {
              return "vendor-react";
            }
            // Router separate (contains @remix-run packages)
            if (
              id.includes("node_modules/react-router") ||
              id.includes("node_modules/@remix-run")
            ) {
              return "vendor-router";
            }
            // Radix UI separate (large component library)
            if (id.includes("node_modules/@radix-ui")) {
              return "vendor-radix";
            }
            // Other UI utilities (icons, styling)
            if (
              id.includes("node_modules/lucide-react") ||
              id.includes("node_modules/class-variance-authority") ||
              id.includes("node_modules/tailwind-merge") ||
              id.includes("node_modules/clsx")
            ) {
              return "vendor-ui-utils";
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
  };
});
