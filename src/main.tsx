import React from "react";
import { createRoot } from "react-dom/client";

import { App as AppV2 } from "./ui-v2/App";
// Legacy bleibt zur Not verfügbar:
// import { App as LegacyApp } from "./App";

const el = document.getElementById("root");
if (!el) throw new Error("Root element #root not found");

// UI-V2 ist jetzt Standard. Wenn du Legacy zwingend brauchst, nimm die kommentierte Zeile oben.
// createRoot(el).render(<LegacyApp />);
createRoot(el).render(<AppV2 />);
