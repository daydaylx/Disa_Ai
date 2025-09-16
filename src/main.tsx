import "./ui/base.css";
import "./styles/globals.css";
import "./styles/brand.css";
import "./styles/theme.css";
import "./styles/chat.css";
import "./styles/mobile.css";
import "./bootstrap/migrations";

import ReactDOM from "react-dom/client";

import App from "./App";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element #root not found");
}

root.classList.add("app-bg", "bg-bg", "text-foreground");
root.classList.add("min-h-[100svh]", "relative");

ReactDOM.createRoot(root).render(<App />);
