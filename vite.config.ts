import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { analyzer } from "vite-bundle-analyzer";
import { VitePWA } from "vite-plugin-pwa";
import { sentryVitePlugin } from "@sentry/vite-plugin";

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

  // PWA can be disabled via VITE_PWA_DISABLED flag for clean deployments
  const isPWADisabled = env.VITE_PWA_DISABLED === "true";

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
      // Sentry plugin - only in production with proper configuration
      ...(isProduction && env.SENTRY_AUTH_TOKEN && env.VITE_SENTRY_DSN
        ? [
            sentryVitePlugin({
              org: env.SENTRY_ORG || "disa-ai",
              project: env.SENTRY_PROJECT || "disa-ai-web",
              authToken: env.SENTRY_AUTH_TOKEN,
              sourceMaps: {
                include: ["./dist/assets"],
                ignore: ["node_modules"],
              },
              release: {
                name: env.VITE_BUILD_ID || "development",
                cleanArtifacts: true,
              },
              telemetry: false, // Disable telemetry for privacy
            }),
          ]
        : []),
      // Progressive PWA with Service Worker - can be disabled via VITE_PWA_DISABLED=true
      ...(!isPWADisabled
        ? [
            VitePWA({
              // Disable auto-injected register script, we register manually in the app
              injectRegister: null,
              registerType: "autoUpdate",
              workbox: {
                globPatterns: ["**/*.{js,css,html,ico,png,svg,webmanifest}"],
                // Skip large KaTeX font files from precache - they're lazy loaded
                globIgnores: ["**/assets/fonts/KaTeX*.ttf", "**/assets/fonts/KaTeX*Regular*.woff"],
                maximumFileSizeToCacheInBytes: 3000000, // 3MB - reduced since we skip large fonts
                skipWaiting: true,
                clientsClaim: true,
                runtimeCaching: [
                  {
                    urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                    handler: "CacheFirst",
                    options: {
                      cacheName: "google-fonts-cache",
                      expiration: {
                        maxEntries: 10,
                        maxAgeSeconds: 60 * 60 * 24 * 365, // 365 days
                      },
                    },
                  },
                  // Cache KaTeX fonts dynamically when needed
                  {
                    urlPattern: /.*\/assets\/fonts\/KaTeX.*\.(woff2|woff)$/,
                    handler: "CacheFirst",
                    options: {
                      cacheName: "katex-fonts-cache",
                      expiration: {
                        maxEntries: 30,
                        maxAgeSeconds: 60 * 60 * 24 * 180, // 180 days
                      },
                    },
                  },
                  // Cache API responses for better offline experience
                  {
                    urlPattern: /^https:\/\/openrouter\.ai\/api\/.*/i,
                    handler: "NetworkFirst",
                    options: {
                      cacheName: "api-cache",
                      expiration: {
                        maxEntries: 50,
                        maxAgeSeconds: 60 * 60, // 1 hour
                      },
                      networkTimeoutSeconds: 10,
                    },
                  },
                ],
              },
              includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
              manifest: {
                name: "Disa AI",
                short_name: "Disa",
                description: "AI-powered chat assistant with offline-first architecture",
                theme_color: "#007AFF",
                background_color: "#0b0f14",
                display: "standalone",
                scope: "/",
                start_url: "/",
                icons: [
                  {
                    src: "icons/icon-192.png",
                    sizes: "192x192",
                    type: "image/png",
                  },
                  {
                    src: "icons/icon-512.png",
                    sizes: "512x512",
                    type: "image/png",
                  },
                ],
              },
              devOptions: {
                enabled: true,
                type: "module",
              },
            }),
          ]
        : []),
    ],
    define: {
      "process.env.NODE_ENV": JSON.stringify(isProduction ? "production" : "development"),
      __DEV__: JSON.stringify(!isProduction),
      __VITE_PWA_DISABLED__: JSON.stringify(isPWADisabled),
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
      modulePreload: {
        polyfill: true,
        // Preload critical chunks only
        resolveDependencies: (filename, deps) => {
          return deps.filter(
            (dep) =>
              dep.includes("react-vendor") || dep.includes("utils") || !dep.includes("katex"), // Don't preload KaTeX - it's lazy loaded
          );
        },
      },
      rollupOptions: {
        treeshake: {
          preset: "recommended",
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
          unknownGlobalSideEffects: false,
        },
        // Smart chunking strategy to optimize bundle size without circular dependencies
        output: {
          compact: true,
          entryFileNames: "assets/js/[name]-[hash].js",
          chunkFileNames: "assets/js/[name]-[hash].js",
          // Smart manual chunks - let React dependencies be handled automatically
          manualChunks: (id) => {
            // Radix UI components (large but stable)
            if (id.includes("node_modules/@radix-ui/")) {
              return "radix-ui";
            }

            // Prism.js core and languages (for code highlighting)
            // Chunk nur für Prism selbst; vermeidet Kollisions-Matches auf generische "prism-" Dateinamen.
            if (id.includes("node_modules/prismjs/")) {
              return "prism";
            }

            // KaTeX (math rendering - large)
            if (id.includes("node_modules/katex/")) {
              return "katex";
            }

            // Other vendor libraries
            if (id.includes("node_modules/")) {
              // Group small utilities together
              if (
                id.includes("clsx") ||
                id.includes("class-variance-authority") ||
                id.includes("tailwind-merge") ||
                id.includes("nanoid") ||
                id.includes("zod")
              ) {
                return "utils";
              }
              return "vendor";
            }
          },
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
