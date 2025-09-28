import "./styles/primitives.css";
import "./styles/components.css";

import { Outlet } from "react-router-dom";

import { AuroraBackground } from "./components/glass/AuroraBackground";
import NavBar from "./components/NavBar";
import { ToastsProvider } from "./components/ui/Toast";

export default function App() {
  return (
    <ToastsProvider>
      <div className="relative h-full">
        <AuroraBackground />
        <div className="relative z-10">
          <Outlet />
        </div>
        <NavBar />
      </div>
    </ToastsProvider>
  );
}
