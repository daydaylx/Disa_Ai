import "./ui/interaction-helpers";
import "./ui/overlap-guard";
import "./ui/guard";
import "./ui/viewport";
import "./ui/base.css";
import "./ui/kit.css";
import "./ui/tokens.css";
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
import { installSkipLinkFocus } from "./lib/a11y/skipLink";
import { registerSW } from "./lib/pwa/registerSW";

// Ensure dark baseline + tokens are applied early
initTheme();
installSkipLinkFocus("a.skip-link", "main");
registerSW();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastsProvider>
      <App />
    </ToastsProvider>
  </React.StrictMode>,
);
