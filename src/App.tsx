import "./index.css"; // Tailwind base/components/utilities
import "./ui/base.css"; // Reset & base styles

import React from "react";

import { Router } from "./app/router";
import { StudioProvider } from "./app/state/StudioContext";
import { ToastsProvider } from "./components/ui/toast/ToastsProvider";
import { PersonaProvider } from "./config/personas";

export default function App() {
  return (
    <PersonaProvider>
      <ToastsProvider>
        <StudioProvider>
          <Router />
        </StudioProvider>
      </ToastsProvider>
    </PersonaProvider>
  );
}
