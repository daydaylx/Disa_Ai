/**
 * Lighthouse CI configuration for Disa AI
 * Runs against the statically built Vite output in ./dist
 */

const DEFAULT_URLS = ["/", "/chat", "/settings/api"];

/** @type {import('lighthouse-ci').LHCIConfig} */
const config = {
  ci: {
    collect: {
      staticDistDir: "./dist",
      url: DEFAULT_URLS,
      numberOfRuns: 1,
      settings: {
        chromeFlags: "--no-sandbox --headless=new",
        preset: "desktop",
      },
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

