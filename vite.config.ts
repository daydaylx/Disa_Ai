import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import fs from "node:fs";
import { resolve as resolvePath } from "node:path";
import { analyzer } from "vite-bundle-analyzer";
import { VitePWA } from "vite-plugin-pwa";
import { sentryVitePlugin } from "@sentry/vite-plugin";

// Some CI sandboxes block /tmp writes (jiti cache for Tailwind). Keep builds hermetic by
// redirecting temp usage into a repo-local .tmp directory.
const localTmpDir = resolvePath(".tmp");
if (!fs.existsSync(localTmpDir)) {
  fs.mkdirSync(localTmpDir, { recursive: true });
}
process.env.TMPDIR ??= localTmpDir;
process.env.JITI_CACHE_DIR ??= localTmpDir;

const analyzerPlugin = analyzer({
  analyzerMode:
    (process.env.BUNDLE_ANALYZE_MODE as "static" | "server" | "json" | undefined) ?? "static",
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

    // Make sure .env.build values are visible to Vite's import.meta.env replacement
    for (const [key, value] of Object.entries(buildEnv)) {
      if (typeof value === "string" && value.length > 0) {
        process.env[key] = value;
      }
    }
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
  function validateBasePath(path: string) {
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

  const devPort = Number.parseInt(env.VITE_PORT || "5173", 10);
  const hmrPort = Number.parseInt(env.VITE_HMR_PORT || `${devPort}`, 10);
  const hmrHost = env.VITE_HMR_HOST || "localhost";
  const hmrProtocol = env.VITE_HMR_PROTOCOL || (env.HTTPS ? "wss" : "ws");

  return {
    // Optimized dependency bundling - less aggressive for faster builds
    optimizeDeps: {
      force: true,
      include: [
        // Core React - diese werden immer gebraucht
        "react",
        "react-dom",
        "react-router-dom",
        "use-sync-external-store/shim",
      ],
      exclude: [
        "react-markdown", // CDN
        "@radix-ui/react-avatar", // Lass Vite auto-discovery
        "@radix-ui/react-dialog",
      ],
      esbuildOptions: {
        target: "es2020",
      },
    },
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
              sourcemaps: {
                assets: ["./dist/assets"],
                ignore: ["node_modules"],
              },
              release: {
                name: env.VITE_BUILD_ID || "development",
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
                  // Cache CDN-hosted CSS/JS for Prism + KaTeX
                  {
                    urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/npm\/(prismjs|katex)@.*$/i,
                    handler: "CacheFirst",
                    options: {
                      cacheName: "cdn-styles-cache",
                      expiration: {
                        maxEntries: 20,
                        maxAgeSeconds: 60 * 60 * 24 * 120,
                      },
                    },
                  },
                  // Cache ESM modules fetched at runtime (react-markdown, etc.)
                  {
                    urlPattern: /^https:\/\/esm\.sh\/.*/i,
                    handler: "NetworkFirst",
                    options: {
                      cacheName: "esm-runtime-cache",
                      expiration: {
                        maxEntries: 30,
                        maxAgeSeconds: 60 * 60 * 24 * 7,
                      },
                      networkTimeoutSeconds: 5,
                    },
                  },
                  /*
                   * DO NOT CACHE API responses containing sensitive data (conversations)
                   * This prevents sensitive user data from being stored in service worker cache
                   */
                  // Cache kuratierte Metadaten für Offline-Use, immer erst Netzwerk
                  {
                    urlPattern: /\/models_metadata\.json$/i,
                    handler: "NetworkFirst",
                    options: {
                      cacheName: "models-metadata-cache",
                      expiration: {
                        maxEntries: 1,
                        maxAgeSeconds: 60 * 60 * 24, // 24 hours
                      },
                      networkTimeoutSeconds: 5,
                    },
                  },
                ],
              },
              includeAssets: ["favicon.ico", "icons/icon-180.png", "icons/icon.svg"],
              manifest: false, // Use public/manifest.webmanifest as single source of truth
              devOptions: {
                enabled: false,
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
      force: true,
      // Vite handles SPA routing automatically, no need for historyApiFallback
      host: env.VITE_HOST || "0.0.0.0",
      port: devPort,
      strictPort: false,
      hmr: {
        host: hmrHost,
        port: hmrPort,
        clientPort: hmrPort,
        protocol: hmrProtocol,
      },
      // Development warmup for faster initial loads
      warmup: {
        clientFiles: [
          "./src/App.tsx",
          "./src/pages/Chat.tsx",
          "./src/components/chat/ChatMessage.tsx",
          "./src/app/layouts/AppShell.tsx",
          "./src/ui/Button.tsx",
          "./src/hooks/useSettings.ts",
        ],
      },
      // Proxy configuration for local development
      /* proxy: {
        "/api": {
          target: "https://disaai.de", // Fallback to live backend for local dev
          changeOrigin: true,
          secure: false,
          // Optionally rewrite if needed, but /api matches /api on prod
        },
      }, */
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    build: {
      target: "es2020",
      minify: "esbuild", // Much faster than terser
      cssMinify: "esbuild",
      minifyIdentifiers: true,
      chunkSizeWarningLimit: 1500, // Erhöht für moderne React PWA
      // Robuste Asset-Generation für Cloudflare Pages
      assetsInlineLimit: 4096, // Inline small assets to reduce requests
      cssCodeSplit: true, // CSS-Chunks für besseres Caching
      // Production-spezifische Optimierungen
      ...(isProduction && {
        sourcemap: true, // Required for Sentry
        reportCompressedSize: false, // Schnellere Builds
      }),
      rollupOptions: {
        output: {
          // Vereinfachte Chunk-Strategie
          manualChunks: {
            // React Framework
            "react-vendor": ["react", "react-dom"],
            // Router
            "router-vendor": ["react-router-dom"],
            // UI-Komponenten
            "ui-vendor": ["@radix-ui/react-avatar", "@radix-ui/react-dialog"],
            // Utility-Bibliotheken
            "utils-vendor": ["clsx", "class-variance-authority", "tailwind-merge", "nanoid"],
          },
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
