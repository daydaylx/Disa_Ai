import "./index.css"; // Tailwind base/components/utilities
import "./styles/design-tokens.css"; // Design tokens (CSS variables)
import "./styles/overlay-tokens.css"; // WCAG AA compliant overlay & menu tokens
import "./styles/mobile-fixes.css"; // Mobile viewport and scaling fixes
import "./styles/bottomsheet.css"; // Bottom sheet specific styles
import "./ui/base.css"; // Reset & base styles
import "./styles/a11y-improvements.css"; // A11y improvements
import "./styles/mobile-enhanced.css"; // Mobile-enhanced styles

import ReactDOM from "react-dom/client";

import { ErrorBoundary, StartupDiagnostics } from "./components/ErrorBoundary";
import { initEnvironment } from "./config/env";
import { initializeA11yEnforcement } from "./lib/a11y/touchTargets";
// PWA Installation Prompt
import { registerSW } from "./lib/pwa/registerSW";
import MobileApp from "./MobileApp";
import { themeController } from "./styles/theme";

// Initialize environment configuration
try {
  const envResult = initEnvironment();
  if (!envResult.success) {
    console.error("Environment initialization failed:", envResult.errors);
  }
} catch (error) {
  console.error("Critical environment error:", error);
}

// Initialize app
function initializeMobileApp() {
  const el = document.getElementById("app");
  if (!el) throw new Error("#app element not found");

  const root = ReactDOM.createRoot(el);
  root.render(
    <ErrorBoundary>
      <StartupDiagnostics>
        <MobileApp />
      </StartupDiagnostics>
    </ErrorBoundary>,
  );

  return root;
}

// Start the app
themeController.init();
initializeMobileApp();

// PWA Service Worker
registerSW();

// Initialize accessibility enforcement
initializeA11yEnforcement();
