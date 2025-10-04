import { useState } from "react";

import { useStudio } from "../app/state/StudioContext";
import type { Role } from "../data/roles";

function RolesTab() {
  const { roles, activeRole, setActiveRole } = useStudio();

  return (
    <div className="p-4">
      <h2 className="mb-4 text-lg font-bold text-[color:var(--color-corporate-text-primary)]">
        Rollen
      </h2>
      <div className="space-y-2">
        {roles.map((role: Role) => (
          <button
            key={role.id}
            type="button"
            className={`u-card flex w-full items-center justify-between border border-transparent bg-[color:var(--color-corporate-bg-card)] p-3 text-left text-[color:var(--color-corporate-text-primary)] transition hover:bg-[color:var(--color-corporate-bg-hover)] ${
              activeRole?.id === role.id ? "border-[color:var(--color-accent-outline)]" : ""
            }`}
            onClick={() => setActiveRole(role)}
          >
            <div>
              <span className="font-semibold">{role.name}</span>
              {role.category ? (
                <span className="ml-2 text-xs uppercase tracking-wide text-[color:var(--color-corporate-text-muted)]">
                  {role.category}
                </span>
              ) : null}
              {role.description ? (
                <p className="mt-1 text-sm text-[color:var(--color-corporate-text-muted)]">
                  {role.description}
                </p>
              ) : null}
            </div>
            <span className="rounded bg-[color:var(--color-accent-subtle)] px-2 py-1 text-xs text-[color:var(--color-accent-500)]">
              Aktivieren
            </span>
          </button>
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
      <h2 className="mb-4 text-lg font-bold text-[color:var(--color-corporate-text-primary)]">
        Stile
      </h2>
      <div className="space-y-4 text-[color:var(--color-corporate-text-primary)]">
        <div>
          <label className="mb-2 block text-[color:var(--color-corporate-text-secondary)]">
            Schriftgröße: {typographyScale}
          </label>
          <input
            type="range"
            min="0.8"
            max="1.5"
            step="0.1"
            value={typographyScale}
            onChange={(e) => setTypographyScale(parseFloat(e.target.value))}
            className="accent-[color:var(--color-accent-500)]"
          />
        </div>
        <div>
          <label className="mb-2 block text-[color:var(--color-corporate-text-secondary)]">
            Eckenradius: {borderRadius}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={borderRadius}
            onChange={(e) => setBorderRadius(parseFloat(e.target.value))}
            className="accent-[color:var(--color-accent-500)]"
          />
        </div>
        <div>
          <label className="mb-2 block text-[color:var(--color-corporate-text-secondary)]">
            Akzentfarbe: {accentColor}
          </label>
          <input
            type="color"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            className="h-10 w-20 cursor-pointer rounded border border-[color:var(--color-corporate-border-secondary)] bg-[color:var(--color-corporate-bg-elevated)]"
          />
        </div>
      </div>
    </div>
  );
}

export default function Studio() {
  const [activeTab, setActiveTab] = useState("roles");

  return (
    <div className="flex h-full flex-col bg-[color:var(--color-corporate-bg-primary)]">
      <div className="flex border-b border-[color:var(--color-corporate-border-primary)]">
        <button
          className={`px-4 py-2 text-[color:var(--color-corporate-text-secondary)] transition ${
            activeTab === "roles"
              ? "border-b-2 border-[color:var(--color-accent-500)] text-[color:var(--color-corporate-text-primary)]"
              : "hover:text-[color:var(--color-corporate-text-primary)]"
          }`}
          onClick={() => setActiveTab("roles")}
        >
          <span>Rollen</span>
        </button>
        <button
          className={`px-4 py-2 text-[color:var(--color-corporate-text-secondary)] transition ${
            activeTab === "styles"
              ? "border-b-2 border-[color:var(--color-accent-500)] text-[color:var(--color-corporate-text-primary)]"
              : "hover:text-[color:var(--color-corporate-text-primary)]"
          }`}
          onClick={() => setActiveTab("styles")}
        >
          <span>Stile</span>
        </button>
        <div className="flex-grow" />
      </div>
      <div className="flex-grow">{activeTab === "roles" ? <RolesTab /> : <StylesTab />}</div>
    </div>
  );
}
