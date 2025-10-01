module.exports = {
  ci: {
    collect: {
      url: [
        "http://localhost:4173/",
        "http://localhost:4173/chat",
        "http://localhost:4173/models",
        "http://localhost:4173/settings",
      ],
      startServerCommand: "npx vite preview --port 4173",
      startServerReadyPattern: "Local:.*http://localhost:4173",
      numberOfRuns: 3, // More reliable results with multiple runs
      settings: {
        // Mobile emulation for realistic performance testing
        preset: "desktop", // Start with desktop, can be changed to mobile
        chromeFlags: ["--no-sandbox", "--disable-dev-shm-usage"],
      },
    },
    assert: {
      assertions: {
        // Issue #109 requirements: Performance ≥ 85, Accessibility ≥ 90
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:performance": ["error", { minScore: 0.85 }],
        "categories:best-practices": ["warn", { minScore: 0.8 }],
        "categories:seo": ["warn", { minScore: 0.8 }],

        // Budget assertions for script and image sizes
        "resource-summary:script:size": ["error", { maxNumericValue: 600000 }], // 600KB max for scripts
        "resource-summary:image:size": ["warn", { maxNumericValue: 200000 }], // 200KB max for images
        "resource-summary:font:size": ["warn", { maxNumericValue: 100000 }], // 100KB max for fonts
        "resource-summary:stylesheet:size": ["warn", { maxNumericValue: 100000 }], // 100KB max for CSS

        // Core Web Vitals thresholds
        "largest-contentful-paint": ["warn", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["warn", { maxNumericValue: 0.1 }],
        "first-contentful-paint": ["warn", { maxNumericValue: 1800 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
