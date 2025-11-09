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

  // Fix für Issue #60: Robuste Base-Pfad-Logik mit Validierung und Fallbacks
  let base = "/";

  /**
   * Validates and normalizes a base path
   * @param {string} path - The base path to validate
   * @returns {string} - Normalized and validated base path
   */
  function validateBasePath(path) {
    if (!path || typeof path !== "string") return "/";

    // Remove any trailing slash except for root
    let normalized = path.replace(/\/+$/, "") || "/";

    // Ensure it starts with a slash
    if (!normalized.startsWith("/")) {
      normalized = "/" + normalized;
    }

    // Ensure it ends with a slash (except for root)
    if (normalized !== "/" && !normalized.endsWith("/")) {
      normalized += "/";
    }

    // Basic security check - no relative paths or dangerous characters
    if (normalized.includes("..") || normalized.includes("//") || /[<>:"|?*]/.test(normalized)) {
      console.warn(`[BUILD] Invalid base path detected: ${path}, falling back to /`);
      return "/";
    }

    return normalized;
  }

  // Robuste Base-Pfad-Bestimmung mit Validierung
  try {
    // 1. Environment Variable hat Priorität (mit Validierung)
    if (env.VITE_BASE_URL) {
      const validatedBase = validateBasePath(env.VITE_BASE_URL);
      if (validatedBase !== "/") {
        base = validatedBase;
      }
    }
    // 2. Cloudflare Pages Detection
    else if (env.CF_PAGES && env.CF_PAGES_URL) {
      base = "/";
    }
    // 3. Development/Local Default
    else {
      base = "/";
    }
  } catch (error) {
    console.error(`[BUILD] Base path determination failed:`, error);
    base = "/";
  }

  return {
    plugins: [
      react(),
      analyzerPlugin,
      // Progressive PWA re-enablement - start conservative
      VitePWA({
        strategies: "injectManifest",
        srcDir: "public",
        filename: "sw.js",
        registerType: "autoUpdate",
        injectRegister: false, // We control registration manually
        devOptions: {
          enabled: false, // Keep disabled in dev to avoid conflicts
          type: "module",
        },
        injectManifest: {
          // Conservative glob patterns - only essential files
          globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2}"],
          globIgnores: [
            "**/node_modules/**/*",
            "sw.js",
            "workbox-*.js",
            "**/*.map", // Skip source maps
            "stats.html", // Skip analyzer output
          ],
          rollupFormat: "es",
          // Defensive caching - don't cache everything immediately
          maximumFileSizeToCacheInBytes: 2 * 1024 * 1024, // 2MB limit
        },
        manifest: false, // We have our own manifest.webmanifest
        // Workbox configuration for stability
        workbox: {
          cleanupOutdatedCaches: true,
          skipWaiting: true,
          clientsClaim: true,
        },
      }),
    ],
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
      __DEV__: "false",
    },
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
      chunkSizeWarningLimit: 1500, // Erhöht für moderne React PWA
      // Robuste Asset-Generation für Cloudflare Pages
      assetsInlineLimit: 4096, // Inline small assets to reduce requests
      cssCodeSplit: true, // CSS-Chunks für besseres Caching
      // Production-spezifische Optimierungen
      ...(isProduction && {
        sourcemap: false, // Kleinere Builds in Production
        reportCompressedSize: false, // Schnellere Builds
      }),
      // Additional performance optimizations for main thread
      brotliSize: true, // Report Brotli compressed size
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
          // Removing aggressive manual chunking to avoid circular vendor bundles
          // that caused React to load as undefined in production builds.
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
