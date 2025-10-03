/**
 * Lighthouse CI Configuration
 * Implements Issue #109 - Lighthouse-Budgets in CI
 */

module.exports = {
  ci: {
    collect: {
      // URLs to test
      url: [
        "http://localhost:5173",
        "http://localhost:5173/models",
        "http://localhost:5173/settings",
      ],
      // Number of runs per URL for more stable results
      numberOfRuns: 3,
      // Settings for the collection
      settings: {
        // Mobile simulation for performance testing
        preset: "desktop", // Can be 'mobile' or 'desktop'
        // Chrome flags for CI environment
        chromeFlags: "--no-sandbox --disable-dev-shm-usage",
      },
    },
    assert: {
      // Performance budgets - strict but achievable targets
      assertions: {
        // Core Web Vitals - Google's key metrics
        "categories:performance": ["error", { minScore: 0.9 }], // 90+ performance score
        "categories:accessibility": ["error", { minScore: 0.95 }], // 95+ accessibility score
        "categories:best-practices": ["error", { minScore: 0.9 }], // 90+ best practices
        "categories:seo": ["warn", { minScore: 0.8 }], // 80+ SEO (warning only)

        // Critical performance metrics
        "first-contentful-paint": ["error", { maxNumericValue: 2000 }], // 2s max FCP
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }], // 2.5s max LCP
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }], // 0.1 max CLS
        "total-blocking-time": ["error", { maxNumericValue: 300 }], // 300ms max TBT
        "speed-index": ["error", { maxNumericValue: 3000 }], // 3s max Speed Index

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
    server: {
      // Start local server for testing
      command: "npm run build && npm run preview",
      port: 4173,
      wait: 5000, // Wait 5s for server to start
    },
  },
};
