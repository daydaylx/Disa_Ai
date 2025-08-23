import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";

import { PersonaProvider } from "./entities/PersonaProvider";
import { ClientProvider } from "./lib/client";
import { ToastProvider } from "./shared/ui/Toast";

const root = document.getElementById("root");
if (!root) throw new Error("ROOT element #root fehlt in index.html");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <PersonaProvider>
      <ClientProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ClientProvider>
    </PersonaProvider>
  </React.StrictMode>
);
