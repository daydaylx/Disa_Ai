module.exports = {
  ci: {
    collect: {
      url: [
        "http://localhost:4200/",
        "http://localhost:4200/chat",
        "http://localhost:4200/models",
        "http://localhost:4200/settings",
      ],
      numberOfRuns: 3,
      startServerCommand: "VITE_PREVIEW_PORT=4200 npm run preview",
      startServerReadyPattern: "Serving dist on",
      startServerReadyTimeout: 30000,
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.85 }],
        "categories:accessibility": ["warn", { minScore: 0.95 }],
        "categories:best-practices": ["warn", { minScore: 0.95 }],
        "categories:seo": ["warn", { minScore: 0.95 }],
        "categories:pwa": ["warn", { minScore: 0.9 }],
        "first-contentful-paint": ["warn", { maxNumericValue: 2000 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["warn", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["warn", { maxNumericValue: 300 }],
        "speed-index": ["warn", { maxNumericValue: 4000 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
