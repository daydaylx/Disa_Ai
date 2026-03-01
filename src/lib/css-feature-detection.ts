/**
 * CSS Feature Detection and Fallback Management
 *
 * This utility detects browser support for modern CSS features and applies
 * appropriate fallback classes to ensure consistent experience across browsers
 */

export function initializeCSSFeatureDetection() {
  // Detect color-mix support
  const hasColorMixSupport = CSS.supports("color", "color-mix(in srgb, red 50%, blue 50%)");

  // Detect other modern CSS features
  const hasBackdropFilterSupport = CSS.supports("backdrop-filter", "blur(1px)");
  const hasModernGridSupport =
    CSS.supports("display", "grid") && CSS.supports("display", "subgrid");

  // Apply feature detection classes to document element
  if (!hasColorMixSupport) {
    document.documentElement.classList.add("supports-no-color-mix");
  }

  if (!hasBackdropFilterSupport) {
    document.documentElement.classList.add("supports-no-backdrop-filter");
  }

  // Set a CSS variable to indicate if fallbacks are needed
  document.documentElement.style.setProperty(
    "--css-modern-features-supported",
    hasColorMixSupport ? "true" : "false",
  );

  if (import.meta.env.DEV) {
    console.warn("CSS Feature Detection initialized:", {
      "color-mix": hasColorMixSupport,
      "backdrop-filter": hasBackdropFilterSupport,
      subgrid: hasModernGridSupport,
    });
  }
}

// Initialize on DOM ready
if (typeof document !== "undefined" && typeof CSS !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeCSSFeatureDetection);
  } else {
    initializeCSSFeatureDetection();
  }
}
