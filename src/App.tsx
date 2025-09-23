import "./styles/base.css";

import React, { useEffect } from "react";

import { AuroraBackground } from "./components/glass/AuroraBackground";
import NavBar from "./components/NavBar";
import { ToastsProvider } from "./components/ui/Toast";
import ChatApp from "./ui2/ChatApp";
import SettingsView from "./ui2/SettingsView";
import ModelPickerView from "./views/ModelPickerView";

function useForceUpdateOnHash() {
  const [, setTick] = React.useState(0);
  useEffect(() => {
    const h = () => setTick((t) => t + 1);
    window.addEventListener("hashchange", h);
    return () => window.removeEventListener("hashchange", h);
  }, []);
}

export default function App() {
  useForceUpdateOnHash();
  const hash = typeof window !== "undefined" ? window.location.hash || "#/chat" : "#/chat";
  const route = hash.split("#/")[1]?.split("#")[0] ?? "chat";

  // Original models component
  const TempModels = () => (
    <ModelPickerView onSelectChat={() => (window.location.hash = "#/chat")} />
  );

  // Original settings component
  const TempSettings = () => <SettingsView />;

  return (
    <ToastsProvider>
      <div className="relative h-full">
        <AuroraBackground />
        {route === "chat" && <ChatApp />}
        {route === "models" && <TempModels />}
        {route === "settings" && <TempSettings />}
        <NavBar />
      </div>
    </ToastsProvider>
  );
}
