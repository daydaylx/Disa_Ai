import "./styles/base.css";

import { Outlet } from "react-router-dom";

import { AuroraBackground } from "./components/glass/AuroraBackground";
import NavBar from "./components/NavBar";
import { ToastsProvider } from "./components/ui/Toast";

export default function App() {
  return (
    <ToastsProvider>
      <div className="relative h-full">
        <AuroraBackground />
        <Outlet />
        <NavBar />
      </div>
    </ToastsProvider>
  );
}
