import React from "react";
import { createRoot } from "react-dom/client";

import { Router } from "./Router";

const el = document.getElementById("root");
if (!el) throw new Error("Root element #root not found");

createRoot(el).render(<Router />);
