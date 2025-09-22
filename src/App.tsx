import "./styles/base.css";

import React, { useEffect } from "react";

import NavBar from "./components/NavBar";
import ChatApp from "./ui2/ChatApp";
import SettingsView from "./ui2/SettingsView";

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
  return (
    <div className="relative h-full">
      {route === "chat" && <ChatApp />}
      {route === "settings" && <SettingsView />}
      {/* Modelle-Ansicht kann später folgen */}
      <NavBar />
    </div>
  );
}
