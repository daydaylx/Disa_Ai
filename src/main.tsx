import React from "react";
import { createRoot } from "react-dom/client";

import { Router } from "./Router";
import { RouterV2 } from "./RouterV2";

const el = document.getElementById("root");
if (!el) throw new Error("Root element #root not found");

// Feature flag for UI V2 - now fully implemented!
const useV2 = import.meta.env.VITE_UI_V2 === "true";
const AppRouter = useV2 ? RouterV2 : Router;

createRoot(el).render(<AppRouter />);
