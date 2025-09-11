import "./ui/interaction-helpers";
import "@/bootstrap/migrations";
import "./ui/overlap-guard";
import "./ui/guard";
import "./ui/viewport";
import "./ui/base.css";
import "./ui/kit.css";
// Old UI tokens are obsolete; theme tokens live in styles/tokens.css
// import "./ui/tokens.css"; // removed
import "./ui/globals";
import "./styles/a11y.css";
import "./styles/brand.css";
import "./styles/chat.css";
import "./styles/glass.css";
import "./styles/layout.css";
import "./styles/models.css";
import "./styles/overrides.css";
import "./styles/settings.css";
import "./styles/shadcn.css";
import "./styles/theme.css";
import "./styles/tokens.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { ToastsProvider } from "./components/ui/Toast";
import { initTheme } from "./config/theme";
import { migrateConversationsToLimits } from "./hooks/useConversations";
import { installSkipLinkFocus } from "./lib/a11y/skipLink";

// Ensure dark baseline + tokens are applied early
initTheme();
installSkipLinkFocus("a.skip-link", "main");

// Migrate existing conversations to respect storage limits
try {
  const migrationResult = migrateConversationsToLimits();
  if (migrationResult.conversationsProcessed > 0 || migrationResult.conversationsRemoved > 0) {
    console.log("Storage migration completed:", migrationResult);
  }
} catch (error) {
  console.warn("Storage migration failed:", error);
}

if (import.meta.env.PROD) {
  // registerSW(); // DEAKTIVIERT: verhindert stale HTML-Content
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastsProvider>
      <App />
    </ToastsProvider>
  </React.StrictMode>,
);
