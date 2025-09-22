import "./styles/base.css";

import React, { useEffect } from "react";

import NavBar from "./components/NavBar";
import ChatApp from "./ui2/ChatApp";
// import SettingsView from "./ui2/SettingsView";
// import ModelPickerView from "./views/ModelPickerView";

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
  // Temporary simple models component
  const TempModels = () => (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold text-white">🤖 Modelle</h1>
        <p className="text-gray-400">Models page coming soon...</p>
        <button
          onClick={() => (window.location.hash = "#/chat")}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
        >
          Zurück zum Chat
        </button>
      </div>
    </div>
  );

  // Temporary simple settings component
  const TempSettings = () => (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-bold text-white">⚙️ Einstellungen</h1>
        <p className="text-gray-400">Settings page coming soon...</p>
        <button
          onClick={() => (window.location.hash = "#/chat")}
          className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
        >
          Zurück zum Chat
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative h-full">
      {route === "chat" && <ChatApp />}
      {route === "models" && <TempModels />}
      {route === "settings" && <TempSettings />}
      <NavBar />
    </div>
  );
}
