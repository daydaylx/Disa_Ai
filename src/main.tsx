import "./styles/tokens.css";
import "./styles/brand.css";
import "./styles/theme.css";
import "./styles/shadcn.css";
import "./styles/chat.css";
import "./styles/models.css";
import "./styles/settings.css";
import "./styles/a11y.css";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { installSkipLinkFocus } from "./lib/a11y/skipLink";
import { registerSW } from "./lib/pwa/registerSW";

installSkipLinkFocus("a.skip-link", "main");
registerSW();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
