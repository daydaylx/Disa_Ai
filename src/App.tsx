import "./index.css"; // Tailwind base/components/utilities
import "./styles/design-tokens.css"; // Design tokens (CSS variables)
import "./ui/base.css"; // Reset & base styles

import React from "react";

import { Router } from "./app/router";
import { StudioProvider } from "./app/state/StudioContext";
import { ToastsProvider } from "./components/ui/toast/ToastsProvider";
import { useViewportHeight } from "./hooks/useViewportHeight";
// Persona system is now handled by StudioContext

export default function App() {
  useViewportHeight();

  return (
    <StudioProvider>
      <ToastsProvider>
        <Router />
      </ToastsProvider>
    </StudioProvider>
  );
}
