import "./styles/tailwind.css";
import "./ui/base.css";
import "./styles/globals.css";
import "./styles/legacy-buttons.css";
import "./styles/glass-components.css";
import "./styles/brand.css";
import "./styles/chat.css";

import { Outlet } from "react-router-dom";

import { AuroraBackground } from "./components/glass/AuroraBackground";
import NavBar from "./components/NavBar";
import { ToastsProvider } from "./components/ui/Toast";

export default function App() {
  return (
    <ToastsProvider>
      <div className="relative h-full">
        <AuroraBackground />
        <main className="relative z-10">
          <Outlet />
        </main>
        <NavBar />
      </div>
    </ToastsProvider>
  );
}
