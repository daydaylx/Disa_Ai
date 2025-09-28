import "./index.css"; // Tailwind base/components/utilities
import "./ui/base.css"; // Reset & base styles

import React from "react";

import { ToastsProvider } from "./components/ui/toast/ToastsProvider";
import { Router } from "./Router";

export default function App() {
  return (
    <ToastsProvider>
      <Router />
    </ToastsProvider>
  );
}
