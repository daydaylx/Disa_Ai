import "./styles/layers.css";
import "./styles/tokens.css";

import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const el = document.getElementById("app");
if (!el) throw new Error("#app not found");
createRoot(el).render(<App />);
