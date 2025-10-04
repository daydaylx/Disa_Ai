/**
 * Lighthouse CI Configuration
 * Implements Issue #109 - Lighthouse-Budgets in CI
 */

module.exports = {
  ci: {
    collect: {
      // URLs to test - only main page for stability in CI
      url: ["http://localhost:4173"],
      // Single run for CI stability
      numberOfRuns: 1,
      // Settings for the collection
      settings: {
        // Use desktop preset for CI stability (mobile emulation can be added later)
        preset: "desktop",
        // Chrome flags for CI environment
        chromeFlags:
          "--no-sandbox --disable-dev-shm-usage --disable-background-timer-throttling --disable-renderer-backgrounding --disable-features=TranslateUI --no-first-run",
      },
    },
    assert: {
      // Performance budgets - strict but achievable targets
      assertions: {
        // Core Web Vitals - relaxed for CI stability
        "categories:performance": ["warn", { minScore: 0.7 }], // 70+ performance score
        "categories:accessibility": ["error", { minScore: 0.9 }], // 90+ accessibility score
        "categories:best-practices": ["warn", { minScore: 0.7 }], // 70+ best practices
        "categories:seo": ["warn", { minScore: 0.6 }], // 60+ SEO (warning only)

        // Critical performance metrics - relaxed for CI
        "first-contentful-paint": ["warn", { maxNumericValue: 3000 }], // 3s max FCP
        "largest-contentful-paint": ["warn", { maxNumericValue: 4000 }], // 4s max LCP
        "cumulative-layout-shift": ["warn", { maxNumericValue: 0.2 }], // 0.2 max CLS
        "total-blocking-time": ["warn", { maxNumericValue: 600 }], // 600ms max TBT
        "speed-index": ["warn", { maxNumericValue: 5000 }], // 5s max Speed Index

        // Resource budgets
        "resource-summary:document:size": ["error", { maxNumericValue: 50000 }], // 50KB HTML
        "resource-summary:script:size": ["error", { maxNumericValue: 500000 }], // 500KB JS
        "resource-summary:stylesheet:size": ["error", { maxNumericValue: 100000 }], // 100KB CSS
        "resource-summary:image:size": ["warn", { maxNumericValue: 1000000 }], // 1MB images (warning)
        "resource-summary:font:size": ["warn", { maxNumericValue: 200000 }], // 200KB fonts (warning)

        // Network requests
        "resource-summary:script:count": ["warn", { maxNumericValue: 10 }], // Max 10 JS files
        "resource-summary:third-party:count": ["warn", { maxNumericValue: 5 }], // Max 5 third-party requests

        // Modern best practices
        "modern-image-formats": "warn", // Encourage WebP/AVIF
        "uses-text-compression": "error", // Require gzip/brotli
        "efficient-animated-content": "warn", // Encourage efficient animations
        "unused-css-rules": "warn", // Flag unused CSS
        "unused-javascript": "warn", // Flag unused JS

        // Accessibility requirements
        "color-contrast": "error", // Require sufficient contrast
        "focus-traps": "error", // Require proper focus management
        "focusable-controls": "error", // Require focusable interactive elements
        "interactive-element-affordance": "error", // Require clear interactive affordances
        "logical-tab-order": "error", // Require logical tab order

        // Security and best practices
        "is-on-https": "off", // Skip HTTPS check for localhost
        "uses-http2": "warn", // Encourage HTTP/2
        "no-vulnerable-libraries": "error", // Flag security vulnerabilities
        charset: "error", // Require charset declaration
      },
    },
    upload: {
      // Store results for comparison
      target: "temporary-public-storage",
    },
    // Server configuration removed - let CI workflow handle server startup
    // server: {
    //   command: "npm run build && npm run preview",
    //   port: 4173,
    //   wait: 10000,
    // },
  },
};
