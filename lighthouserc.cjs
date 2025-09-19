/** @type {import('lighthouse').Flags} */
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      startServerCommand: "npm run build && npm run preview -- --port=4174",
      url: ["http://localhost:4174/"],
      settings: {
        // Mobile-Simulation, realistisch fürs Ziel
        preset: "mobile",
        throttlingMethod: "simulate"
      }
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.85 }],
        "categories:accessibility": ["warn", { minScore: 0.90 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["warn", { minScore: 0.90 }],
        // Budgets gegen Aufblähung
        "total-byte-weight": ["warn", { maxNumericValue: 450000 }],  // ~440 KB
        "script-treemap-data": "off"
      }
    },
    upload: {
      target: "temporary-public-storage"
    }
  }
};
