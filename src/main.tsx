import "./ui/base.css";
import "./styles/design-tokens.css";
import "./styles/base.css";
import "./styles/theme.css";
import "./styles/glass-components.css";
import "./styles/aurora.css";
import "./styles/mobile-glass.css";
import "./styles/chat-glass.css";
import "./styles/visual-effects.css";
import "./styles/interactive-effects.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
