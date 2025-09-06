import React from "react";

import ModelPicker from "../components/ModelPicker";
import type { Safety } from "../config/models";
import { getRoleById,listRoleTemplates } from "../config/promptTemplates";
import {
  getNSFW,
  getSelectedModelId,
  getStyle,
  getTemplateId,
  getUseRoleStyle,
  setNSFW,
  setSelectedModelId,
  setStyle,
  setTemplateId,
  setUseRoleStyle,
  type StyleKey,
} from "../config/settings";
import { getApiKey,setApiKey } from "../services/openrouter";

// Helper, um unterschiedliche Feldnamen in Role-Objekten abzudecken
function roleTitle(r: unknown): string {
  const x = r as any;
  return x?.title ?? x?.name ?? x?.label ?? x?.id ?? "Unbenannt";
}
function rolePurpose(r: unknown): string {
  const x = r as any;
  return x?.purpose ?? x?.description ?? x?.desc ?? "";
}

type RolePolicy = Safety | "any";

const STYLE_OPTIONS: { value: StyleKey; label: string }[] = [
  { value: "blunt_de" as StyleKey, label: "Direkt (DE, bissig)" },
  { value: "concise" as StyleKey, label: "Kompakt" },
  { value: "friendly" as StyleKey, label: "Locker" },
  { value: "creative_light" as StyleKey, label: "Kreativ (leicht)" },
  { value: "minimal" as StyleKey, label: "Minimal" },
];

export default function SettingsView() {
  const [key, setKey] = React.useState<string>(getApiKey() ?? "");
  const [modelId, setModelId] = React.useState<string | null>(getSelectedModelId());
  const [nsfw, setNsfw] = React.useState<boolean>(getNSFW());
  const [style, setStyleState] = React.useState<StyleKey>(getStyle());
  const [templateId, setTemplateIdState] = React.useState<string | null>(getTemplateId());
  const [useRoleStyle, setUseRoleStyleState] = React.useState<boolean>(getUseRoleStyle());

  const templates = React.useMemo(() => listRoleTemplates(), []);

  function saveKey() {
    setApiKey(key.trim());
  }
  function onToggleNSFW(e: React.ChangeEvent<HTMLInputElement>) {
    setNsfw(e.target.checked);
    setNSFW(e.target.checked);
  }
  function onStyleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value as StyleKey;
    setStyleState(val);
    setStyle(val);
  }
  function onTemplateChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value || null;
    setTemplateIdState(val);
    setTemplateId(val);
  }
  function onUseRoleStyle(e: React.ChangeEvent<HTMLInputElement>) {
    setUseRoleStyleState(e.target.checked);
    setUseRoleStyle(e.target.checked);
  }

  // Rollen-Policy streng auf Safety|"any" normalisieren
  const policyFromRole: RolePolicy = React.useMemo(() => {
    const r = getRoleById(templateId ?? "");
    const raw = (r as any)?.policy as unknown;
    return raw === "loose" || raw === "moderate" || raw === "strict" ? (raw as Safety) : "any";
  }, [templateId]);

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 space-y-8">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold">Einstellungen</h1>
        <p className="text-sm opacity-80">API-Schlüssel, Modell, Rolle & Stil konfigurieren.</p>
      </header>

      {/* API Key */}
      <section aria-labelledby="api-key" className="rounded-xl border border-border bg-background/60 p-4">
        <h2 id="api-key" className="mb-3 text-base font-semibold">API-Schlüssel</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-…"
            aria-label="API-Schlüssel"
            className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <button
            onClick={saveKey}
            className="rounded-md border border-border bg-white/10 px-4 py-2 text-sm active:scale-[.99]"
            aria-label="API-Schlüssel speichern"
          >
            Speichern
          </button>
        </div>
        <p className="mt-2 text-xs opacity-70">Der Schlüssel wird lokal im Browser gespeichert.</p>
      </section>

      {/* Model */}
      <section aria-labelledby="model" className="rounded-xl border border-border bg-background/60 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 id="model" className="text-base font-semibold">Modell</h2>
          <div className="text-sm opacity-80">aktuell: <span className="font-mono">{modelId ?? "—"}</span></div>
        </div>
        <ModelPicker
          value={modelId}
          onChange={(id) => { setModelId(id); setSelectedModelId(id); }}
          policyFromRole={policyFromRole}
        />
      </section>

      {/* Role & Style */}
      <section aria-labelledby="role-style" className="rounded-xl border border-border bg-background/60 p-4 space-y-4">
        <h2 id="role-style" className="text-base font-semibold">Rolle & Stil</h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm">Rolle</span>
            <select
              value={templateId ?? ""}
              onChange={onTemplateChange}
              aria-label="Rolle auswählen"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <option value="">Keine spezielle Rolle</option>
              {templates.map((t: unknown, i: number) => (
                <option key={i} value={(t as any)?.id ?? ""}>
                  {roleTitle(t)}
                </option>
              ))}
            </select>
            {templateId ? (
              <p className="mt-1 text-xs opacity-70">
                {rolePurpose(getRoleById(templateId))}
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className="mb-1 block text-sm">Stil</span>
            <select
              value={style}
              onChange={onStyleChange}
              aria-label="Stil auswählen"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              {STYLE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={useRoleStyle} onChange={onUseRoleStyle} aria-label="Rollenstil-Overlay aktivieren" />
            Rollenstil in Systemprompt einblenden
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={nsfw} onChange={onToggleNSFW} aria-label="NSFW-Filter deaktivieren" />
            NSFW-Filter lockern
          </label>
        </div>
      </section>

      <nav className="flex justify-end">
        <a href="#/chat" className="underline">zurück zum Chat</a>
      </nav>
    </main>
  );
}
