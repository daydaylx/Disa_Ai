/**
 * Android-specific system utilities and optimizations
 */

import { designTokens } from "../../styles/design-tokens";

export interface AndroidFeatures {
  isAndroid: boolean;
  supportsPredictiveBack: boolean;
  supportsEdgeToEdge: boolean;
  isStandalone: boolean;
  hasNotch: boolean;
  supportsSplitScreen: boolean;
}

/**
 * Detect Android device and available features
 */
export function detectAndroidFeatures(): AndroidFeatures {
  const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const isAndroid = /Android/i.test(userAgent);
  const isStandalone =
    typeof window !== "undefined" &&
    (window.matchMedia("(display-mode: standalone)").matches || "standalone" in window.navigator);

  return {
    isAndroid,
    supportsPredictiveBack: isAndroid && "onbeforeunload" in window,
    supportsEdgeToEdge: isStandalone && isAndroid,
    isStandalone,
    hasNotch:
      typeof window !== "undefined" &&
      (window.screen?.height > window.screen?.width * 2 ||
        CSS.supports("padding: env(safe-area-inset-top)")),
    supportsSplitScreen: isAndroid && typeof window !== "undefined" && window.screen?.height < 600,
  };
}

/**
 * Setup Android-specific behaviors
 */
export function setupAndroidOptimizations() {
  const features = detectAndroidFeatures();

  if (!features.isAndroid) return;

  // Setup predictive back gesture
  if (features.supportsPredictiveBack) {
    setupPredictiveBack();
  }

  // Setup edge-to-edge gesture detection
  if (features.supportsEdgeToEdge) {
    setupEdgeToEdgeGestures();
  }

  // Setup Android keyboard handling
  setupAndroidKeyboard();

  // Setup split-screen layout detection
  if (features.supportsSplitScreen) {
    setupSplitScreenLayout();
  }

  // Setup theme color updates
  setupThemeColorUpdates();
}

/**
 * Setup predictive back gesture indicator
 */
function setupPredictiveBack() {
  let backGestureActive = false;

  // Create back gesture indicator
  const indicator = document.createElement("div");
  indicator.className = "back-gesture-indicator";
  document.body.appendChild(indicator);

  // Listen for edge swipe gestures
  let startX = 0;
  let startTime = 0;

  document.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    if (touch && touch.clientX < 20) {
      // Edge area
      startX = touch.clientX;
      startTime = Date.now();
      backGestureActive = true;
      indicator.classList.add("active");
    }
  });

  document.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    if (backGestureActive && touch) {
      const deltaX = touch.clientX - startX;
      const deltaTime = Date.now() - startTime;

      if (deltaX > 50 && deltaTime < 500) {
        // Trigger back navigation
        window.history.back();
        backGestureActive = false;
        indicator.classList.remove("active");
      }
    }
  });

  document.addEventListener("touchend", () => {
    backGestureActive = false;
    indicator.classList.remove("active");
  });
}

/**
 * Setup edge-to-edge gesture areas
 */
function setupEdgeToEdgeGestures() {
  const leftEdge = document.createElement("div");
  const rightEdge = document.createElement("div");

  leftEdge.className = "gesture-edge-left";
  rightEdge.className = "gesture-edge-right";

  document.body.appendChild(leftEdge);
  document.body.appendChild(rightEdge);
}

/**
 * Enhanced Android keyboard detection and handling
 */
function setupAndroidKeyboard() {
  let initialViewportHeight = window.innerHeight;
  let keyboardHeight = 0;

  const updateKeyboardHeight = () => {
    const currentHeight = window.innerHeight;
    const heightDiff = initialViewportHeight - currentHeight;

    if (heightDiff > 150) {
      // Keyboard likely open
      keyboardHeight = heightDiff;
      document.documentElement.style.setProperty("--keyboard-height", `${keyboardHeight}px`);
      document.body.classList.add("keyboard-open");
    } else {
      keyboardHeight = 0;
      document.documentElement.style.setProperty("--keyboard-height", "0px");
      document.body.classList.remove("keyboard-open");
    }
  };

  // Visual Viewport API (preferred on Android)
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", updateKeyboardHeight);
  } else {
    window.addEventListener("resize", updateKeyboardHeight);
  }

  // Focus management for inputs
  const inputs = document.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    input.addEventListener("focus", () => {
      setTimeout(() => {
        input.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300); // Wait for keyboard animation
    });
  });
}

/**
 * Setup split-screen layout detection
 */
function setupSplitScreenLayout() {
  const checkSplitScreen = () => {
    const isLandscape = window.orientation === 90 || window.orientation === -90;
    const isShort = window.innerHeight < 500;

    if (isLandscape && isShort) {
      document.body.classList.add("split-screen-layout");
    } else {
      document.body.classList.remove("split-screen-layout");
    }
  };

  window.addEventListener("orientationchange", checkSplitScreen);
  window.addEventListener("resize", checkSplitScreen);
  checkSplitScreen(); // Initial check
}

/**
 * Update theme color based on current UI state
 */
function setupThemeColorUpdates() {
  const themeColorMeta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;

  if (!themeColorMeta) return;

  const updateThemeColor = (color: string) => {
    themeColorMeta.content = color;
    // Also update CSS custom property for consistency
    document.documentElement.style.setProperty("--theme-color", color);
  };

  // Update theme color based on route changes
  const observer = new MutationObserver(() => {
    const currentHash = window.location.hash;

    switch (true) {
      case currentHash.includes("chat"):
        updateThemeColor(designTokens.colors.brand.base);
        break;
      case currentHash.includes("settings"):
        updateThemeColor(designTokens.colors.accent.base);
        break;
      default:
        updateThemeColor(designTokens.colors.surface[1]);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Initial theme color update
  window.addEventListener("hashchange", () => {
    setTimeout(() => observer.disconnect(), 100);
    setTimeout(() => observer.observe(document.body, { childList: true, subtree: true }), 200);
  });
}

/**
 * Show Android-style snackbar notification
 */
export function showAndroidSnackbar(message: string, duration = 3000) {
  // Remove existing snackbar
  const existing = document.querySelector(".snackbar-android");
  existing?.remove();

  const snackbar = document.createElement("div");
  snackbar.className = "snackbar-android";
  snackbar.textContent = message;

  document.body.appendChild(snackbar);

  // Trigger show animation
  setTimeout(() => snackbar.classList.add("show"), 100);

  // Auto-hide
  setTimeout(() => {
    snackbar.classList.remove("show");
    setTimeout(() => snackbar.remove(), 300);
  }, duration);
}

/**
 * Setup Android-specific haptic feedback patterns
 */
export function setupAndroidHaptics() {
  if (!("vibrate" in navigator)) return;

  return {
    tap: () => navigator.vibrate?.(10),
    select: () => navigator.vibrate?.(25),
    success: () => navigator.vibrate?.([50, 50, 100]),
    warning: () => navigator.vibrate?.(100),
    error: () => navigator.vibrate?.(200),
  };
}
