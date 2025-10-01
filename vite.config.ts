import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { analyzer } from "vite-bundle-analyzer";

const analyzerPlugin = analyzer({
  analyzerMode: process.env.BUNDLE_ANALYZE_MODE ?? "static",
  openAnalyzer: false,
  enabled: process.env.BUNDLE_ANALYZE !== "false",
});

export default defineConfig(({ mode }) => {
  // Load build environment variables for Issue #81
  const env = loadEnv(mode, process.cwd(), "");

  // Also load from .env.build if it exists
  try {
    const buildEnv = loadEnv("build", process.cwd(), "");
    Object.assign(env, buildEnv);
  } catch {
    // .env.build doesn't exist, that's fine
  }

  // Umweltspezifische Konfiguration für robuste Asset-Pfade (Issue #60)
  const isProduction = mode === "production";

  // Fix für Issue #60: Erweiterte Base-Pfad-Logik für Cloudflare Pages
  let base = "/";

  // 1. Environment Variable hat Priorität
  if (env.VITE_BASE_URL) {
    base = env.VITE_BASE_URL;
    console.log(`[Vite] Using VITE_BASE_URL: ${base}`);
  }
  // 2. Cloudflare Pages Detection
  else if (env.CF_PAGES && env.CF_PAGES_URL) {
    base = "/";
    console.log(`[Vite] Cloudflare Pages detected, using base: ${base}`);
  }
  // 3. GitHub Pages Detection
  else if (env.GITHUB_ACTIONS && env.GITHUB_REPOSITORY) {
    const repo = env.GITHUB_REPOSITORY.split("/")[1];
    base = `/${repo}/`;
    console.log(`[Vite] GitHub Pages detected, using base: ${base}`);
  }
  // 4. Development/Local Default
  else {
    base = "/";
    console.log(`[Vite] Using default base: ${base}`);
  }

  return {
    plugins: [react(), analyzerPlugin],
    base, // Umweltspezifische Basis für Cloudflare Pages
    // Fix für Issue #75: Erweiterte Server-Konfiguration für SPA-Routing
    server: {
      historyApiFallback: {
        index: "/index.html",
      },
    },
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
            // Core React vendors - kleinere Chunks für besseres Caching
            if (id.includes("node_modules/react-dom")) {
              return "vendor-react-dom";
            }
            if (id.includes("node_modules/react") && !id.includes("react-dom")) {
              return "vendor-react";
            }
            // Router separat
            if (id.includes("node_modules/react-router-dom")) {
              return "vendor-router";
            }
            // UI Komponenten - größere Sammlung aufteilen
            if (id.includes("node_modules/@radix-ui")) {
              return "vendor-radix";
            }
            if (id.includes("node_modules/lucide-react")) {
              return "vendor-icons";
            }
            // Utility Libraries
            if (
              id.includes("node_modules/clsx") ||
              id.includes("node_modules/tailwind-merge") ||
              id.includes("node_modules/class-variance-authority")
            ) {
              return "vendor-utils";
            }
            // Data/API libraries
            if (id.includes("node_modules/zod") || id.includes("node_modules/js-yaml")) {
              return "vendor-data";
            }
            // App-spezifische große Chunks
            if (id.includes("/src/pages/ChatV2")) {
              return "page-chat";
            }
            if (id.includes("/src/pages/Models")) {
              return "page-models";
            }
            if (id.includes("/src/pages/Settings")) {
              return "page-settings";
            }
            // Async features
            if (id.includes("/src/components/chat/") || id.includes("/src/components/message/")) {
              return "features-chat";
            }
            // Kleine dependencies ins main bundle für bessere mobile performance
            return undefined;
          },
          // Issue #60: Optimierte Asset-Organisation für korrekte MIME-Types
          compact: true,
          entryFileNames: "assets/js/[name]-[hash].js",
          chunkFileNames: "assets/js/[name]-[hash].js",
          assetFileNames: (assetInfo) => {
            if (!assetInfo.name) return "assets/[name]-[hash][extname]";

            const info = assetInfo.name.split(".");
            const ext = info[info.length - 1];

            // CSS-Files in eigenen Ordner für korrekte MIME-Type-Erkennung
            if (/\.(css)$/.test(assetInfo.name)) {
              return "assets/css/[name]-[hash].[ext]";
            }
            // Font-Files
            if (/\.(woff|woff2|ttf|eot)$/.test(assetInfo.name)) {
              return "assets/fonts/[name]-[hash].[ext]";
            }
            // Image-Files
            if (/\.(png|jpg|jpeg|gif|svg|webp)$/.test(assetInfo.name)) {
              return "assets/images/[name]-[hash].[ext]";
            }
            // JSON-Files (z.B. quickstarts.json)
            if (/\.(json)$/.test(assetInfo.name)) {
              return "assets/data/[name]-[hash].[ext]";
            }
            // Alle anderen Assets
            return "assets/misc/[name]-[hash].[ext]";
          },
        },
      },
    },
  };
});
