import "./bootstrap/migrations";

import ReactDOM from "react-dom/client";

import App from "./App";
import { registerSW } from "./lib/pwa/registerSW";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element #root not found");
}

ReactDOM.createRoot(root).render(<App />);

// Service Worker nur in Produktion registrieren
if (import.meta.env.PROD) {
  registerSW();
}
