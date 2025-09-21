/** @type {import('lighthouse').Flags} */
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      startServerCommand: "npm run build && npm run preview -- --port=4174",
      // Vite schreibt "Local: http://...", nicht "ready". Also darauf warten:
      startServerReadyPattern: "Local:",
      startServerReadyTimeout: 120000,
      url: ["http://localhost:4174/"],
      settings: {
        // Korrekt in neuen LH-Versionen: Formfaktor + Screen-Emulation
        formFactor: "mobile",
        screenEmulation: { mobile: true, width: 390, height: 844, deviceScaleFactor: 3, disabled: false },
        throttlingMethod: "simulate"
      }
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.90 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 0.90 }],
        "total-byte-weight": ["warn", { maxNumericValue: 450000 }],
        "script-treemap-data": "off"
      }
    },
    upload: { target: "temporary-public-storage" }
  }
};
