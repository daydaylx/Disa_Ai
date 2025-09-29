import React, { useState } from "react";

import { useStudio } from "../app/state/StudioContext";
import type { Persona } from "../data/personas";

function PersonasTab() {
  const { personas, setActivePersona } = useStudio();

  return (
    <div className="p-4">
      <h2 className="mb-4 text-lg font-bold text-on-surface">Personas</h2>
      <div className="space-y-2">
        {personas.map((persona: Persona) => (
          <div
            key={persona.id}
            className={`u-card flex cursor-pointer items-center justify-between bg-surface-variant p-2 text-on-surface`}
          >
            <span>{persona.name}</span>
            <button
              className="rounded bg-primary px-2 py-1 text-on-primary"
              onClick={() => setActivePersona(persona)}
            >
              Aktivieren
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StylesTab() {
  const {
    typographyScale,
    setTypographyScale,
    borderRadius,
    setBorderRadius,
    accentColor,
    setAccentColor,
  } = useStudio();

  return (
    <div className="p-4">
      <h2 className="mb-4 text-lg font-bold text-on-surface">Stile</h2>
      <div className="space-y-4 text-on-surface">
        <div>
          <label className="mb-2 block">Schriftgröße: {typographyScale}</label>
          <input
            type="range"
            min="0.8"
            max="1.5"
            step="0.1"
            value={typographyScale}
            onChange={(e) => setTypographyScale(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label className="mb-2 block">Eckenradius: {borderRadius}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={borderRadius}
            onChange={(e) => setBorderRadius(parseFloat(e.target.value))}
          />
        </div>
        <div>
          <label className="mb-2 block">Akzentfarbe: {accentColor}</label>
          <input
            type="color"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default function Studio() {
  const [activeTab, setActiveTab] = useState("personas");
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <div className="flex h-full flex-col bg-surface">
      <div className="flex border-b border-outline">
        <button
          className={`px-4 py-2 ${activeTab === "personas" ? "border-b-2 border-primary" : ""}`}
          onClick={() => setActiveTab("personas")}
        >
          <span className="text-on-surface">Personas</span>
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "styles" ? "border-b-2 border-primary" : ""}`}
          onClick={() => setActiveTab("styles")}
        >
          <span className="text-on-surface">Stile</span>
        </button>
        <div className="flex-grow" />
        <button
          onClick={toggleTheme}
          className="m-2 rounded-md bg-surface-variant p-2 text-on-surface"
        >
          {theme === "light" ? "Dark Mode" : "Light Mode"}
        </button>
      </div>
      <div className="flex-grow">{activeTab === "personas" ? <PersonasTab /> : <StylesTab />}</div>
    </div>
  );
}
