import "./styles/primitives.css";
import "./styles/components.css";

import { Outlet } from "react-router-dom";

import { AuroraBackground } from "./components/glass/AuroraBackground";
import { NavBarV2 } from "./components/NavBarV2";
import { ToastsProvider } from "./components/ui/Toast";

export default function AppV2() {
  return (
    <ToastsProvider>
      <div className="relative h-full min-h-screen">
        <AuroraBackground />

        {/* Enhanced main content container with better responsive design */}
        <main className="relative z-10 flex h-screen flex-col">
          <div className="flex-1 overflow-hidden">
            <Outlet />
          </div>

          {/* V2 Navigation with improved positioning */}
          <NavBarV2 />
        </main>

        {/* Enhanced performance indicators */}
        <div className="pointer-events-none fixed bottom-4 left-4 z-50">
          <div className="glass-backdrop rounded-lg px-3 py-1 text-xs text-glass-text-muted">
            UI V2
          </div>
        </div>
      </div>
    </ToastsProvider>
  );
}
