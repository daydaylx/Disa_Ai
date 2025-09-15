import "./bootstrap/migrations";
import "./ui/base.css";
import "./styles/globals.css";
import "./styles/brand.css";
import "./styles/theme.css";
import "./styles/chat.css";

import ReactDOM from "react-dom/client";

import App from "./App";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element #root not found");
}

ReactDOM.createRoot(root).render(<App />);
