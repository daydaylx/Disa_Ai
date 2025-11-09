/**
 * Lighthouse CI configuration for Disa AI.
 * We run audits against the preview server to exercise real SPA routing.
 */

const DEFAULT_PATHS = ["/", "/chat", "/settings/api"];
const PREVIEW_HOST = process.env.LHCI_HOST ?? "127.0.0.1";
const PREVIEW_PORT = Number(process.env.LHCI_PORT ?? "4173");
const BASE_URL = `http://${PREVIEW_HOST}:${PREVIEW_PORT}`;
const SHOULD_START_SERVER = process.env.LHCI_SKIP_SERVER !== "true";

const DEFAULT_URLS = DEFAULT_PATHS.map((path) => new URL(path, BASE_URL).toString());
const START_SERVER_CMD = `VITE_PREVIEW_HOST=${PREVIEW_HOST} VITE_PREVIEW_PORT=${PREVIEW_PORT} npm run preview`;

/** @type {import('lighthouse-ci').LHCIConfig} */
const config = {
  ci: {
    collect: {
      url: DEFAULT_URLS,
      numberOfRuns: 1,
      settings: {
        chromeFlags: "--no-sandbox --headless=new",
        preset: "desktop",
      },
      ...(SHOULD_START_SERVER && {
        startServerCommand: START_SERVER_CMD,
        startServerReadyPattern: "Serving dist on http",
        startServerReadyTimeout: 120000,
      }),
    },
    assert: {
      preset: "lighthouse:recommended",
      assertions: {
        "categories:pwa": ["warn", { minScore: 0.75 }],
        "categories:performance": ["warn", { minScore: 0.75 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};

module.exports = config;
