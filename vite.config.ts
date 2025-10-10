import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { analyzer } from "vite-bundle-analyzer";
import { VitePWA } from "vite-plugin-pwa";

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

  // Debug-Ausgaben für Base-Pfad-Erkennung
  console.log(`[BUILD] Mode: ${mode}`);
  console.log(`[BUILD] Environment variables:`, {
    CF_PAGES: env.CF_PAGES,
    CF_PAGES_URL: env.CF_PAGES_URL,
    GITHUB_ACTIONS: env.GITHUB_ACTIONS,
    GITHUB_REPOSITORY: env.GITHUB_REPOSITORY,
    VITE_BASE_URL: env.VITE_BASE_URL,
  });

  // 1. Environment Variable hat Priorität
  if (env.VITE_BASE_URL) {
    base = env.VITE_BASE_URL;
    console.log(`[BUILD] Using VITE_BASE_URL: ${base}`);
  }
  // 2. Cloudflare Pages Detection
  else if (env.CF_PAGES && env.CF_PAGES_URL) {
    base = "/";
    console.log(`[BUILD] Detected Cloudflare Pages, using base: ${base}`);
  }
  // 3. GitHub Pages Detection (only for production builds)
  else if (env.GITHUB_ACTIONS && env.GITHUB_REPOSITORY && isProduction) {
    const repo = env.GITHUB_REPOSITORY.split("/")[1];
    base = `/${repo}/`;
    console.log(`[BUILD] Detected GitHub Pages, using base: ${base}`);
  }
  // 4. Development/Local Default
  else {
    base = "/";
    console.log(`[BUILD] Using default base: ${base}`);
  }

  console.log(`[BUILD] Final base path: ${base}`);

  return {
    plugins: [
      react(),
      analyzerPlugin,
      // Temporarily disable PWA to debug loading issues
      // VitePWA({
      //   strategies: "injectManifest",
      //   srcDir: "public",
      //   filename: "sw.js",
      //   registerType: "autoUpdate",
      //   injectRegister: "auto",
      //   devOptions: {
      //     enabled: !isProduction, // Only enable in development
      //     type: "module",
      //   },
      //   injectManifest: {
      //     globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2,json,webmanifest}"],
      //     globIgnores: ["**/node_modules/**/*", "sw.js", "workbox-*.js"],
      //     rollupFormat: "es",
      //   },
      //   manifest: false, // We have our own manifest.webmanifest
      // }),
    ],
    base, // Umweltspezifische Basis für Cloudflare Pages
    // Fix für Issue #75: Erweiterte Server-Konfiguration für SPA-Routing
    server: {
      // Vite handles SPA routing automatically, no need for historyApiFallback
      port: parseInt(env.VITE_PORT || "5173"),
      strictPort: false,
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      target: "es2020",
      minify: "esbuild",
      cssMinify: "esbuild",
      chunkSizeWarningLimit: 500, // Reduce from 800 to 500KB
      // Robuste Asset-Generation für Cloudflare Pages
      assetsInlineLimit: 1024, // Reduce from 2048 to 1KB for better caching
      cssCodeSplit: true, // CSS-Chunks für besseres Caching
      // Production-spezifische Optimierungen
      ...(isProduction && {
        sourcemap: false, // Kleinere Builds in Production
        reportCompressedSize: false, // Schnellere Builds
      }),
      rollupOptions: {
        treeshake: {
          preset: "recommended",
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
          unknownGlobalSideEffects: false,
        },
        // Robust solution: No externalization needed for bundled app
        // Dependencies will be properly ordered through manualChunks priority
        output: {
          // Enable modern features for smaller bundles
          generatedCode: {
            arrowFunctions: true,
            constBindings: true,
            objectShorthand: true,
          },
          // Advanced chunk splitting for better caching and reduced initial load
          manualChunks: (id) => {
            // Vendor chunks - split by logical groups
            if (id.includes("node_modules")) {
              // React core
              if (id.includes("react") || id.includes("react-dom")) {
                return "vendor-react";
              }
              // UI framework
              if (id.includes("@radix-ui")) {
                return "vendor-ui";
              }
              // Router
              if (id.includes("react-router")) {
                return "vendor-router";
              }
              // Utilities
              if (
                id.includes("clsx") ||
                id.includes("tailwind-merge") ||
                id.includes("class-variance-authority")
              ) {
                return "vendor-utils";
              }
              // Icons
              if (id.includes("lucide-react")) {
                return "vendor-icons";
              }
              // Validation
              if (id.includes("zod")) {
                return "vendor-validation";
              }
              // Other vendor libs
              return "vendor-misc";
            }

            // App chunks - split by feature
            if (id.includes("/pages/")) {
              return "pages";
            }
            if (id.includes("/components/")) {
              return "components";
            }
            if (id.includes("/config/") || id.includes("/data/")) {
              return "config-data";
            }
            if (id.includes("/lib/") || id.includes("/utils/")) {
              return "utils";
            }
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
