/** @type {import('lighthouse').Configuration} */
module.exports = {
  ci: {
    collect: {
      startServerCommand: "npm run build && npm run preview -- --port=4174",
      url: ["http://localhost:4174/"],
      numberOfRuns: 1,
      settings: {
        formFactor: "mobile",
        screenEmulation: { mobile: true, width: 360, height: 640, deviceScaleRatio: 2 },
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["warn", { minScore: 0.85 }],
        "categories:accessibility": ["warn", { minScore: 0.9 }],
        "first-contentful-paint": ["warn", { maxNumericValue: 2500 }],
        "largest-contentful-paint": ["warn", { maxNumericValue: 2500 }],
        "total-blocking-time": ["warn", { maxNumericValue: 200 }],
        "cumulative-layout-shift": ["warn", { maxNumericValue: 0.02 }],
      },
    },
    upload: { target: "filesystem", outputDir: ".lighthouseci" },
  },
};
