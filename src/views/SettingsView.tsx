import React from "react";

import ModelPicker from "../components/ModelPicker";
import { useToasts } from "../components/ui/Toast";
import type { Safety } from "../config/models";
import { fetchRoleTemplates,getRoleById, listRoleTemplates } from "../config/promptTemplates";
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

// ---- Helper für uneinheitliche Rollentypen ----
function roleTitle(r: unknown): string {
  const x = r as any;
  return x?.title ?? x?.name ?? x?.label ?? x?.id ?? "Unbenannt";
}
function rolePurpose(r: unknown): string {
  const x = r as any;
  return x?.purpose ?? x?.description ?? x?.desc ?? "";
}

// ---- Style-Metadaten (nur Anzeige + Vorschau) ----
const STYLE_META: Partial<
  Record<
    StyleKey,
    {
      label: string;
      description: string;
      system: string; // „Vorschau Systemprompt“
    }
  >
> = {
  concise: {
    label: "Neutral Standard",
    description: "Nüchtern, faktisch, ohne Floskeln.",
    system: "Du bist ein sachlicher, hilfreicher Assistent. Antworte klar und strukturiert.",
  },
  blunt_de: {
    label: "Direkt (DE, bissig)",
    description:
      "Schonungslos ehrlich, keine Motivationsfloskeln. Risiken/Schwächen zuerst.",
    system:
      "Antworte direkt und kritisch. Benenne Risiken und Schwächen zuerst, dann Optionen. Kein Motivationssprech.",
  },
  friendly: {
    label: "Locker",
    description: "Kollegialer Ton, aber präzise.",
    system: "Antworte locker, aber präzise. Kein Smalltalk.",
  },
  creative_light: {
    label: "Kreativ (leicht)",
    description: "Analogie-/Beispiel-freundlich, ohne abzuschweifen.",
    system:
      "Erkläre mit kurzen Analogien/Beispielen, bleibe präzise und handlungsorientiert.",
  },
  minimal: {
    label: "Minimal",
    description: "Extrem knapp, nur das Nötigste.",
    system: "Antworte so kurz wie möglich, ohne Informationsverlust.",
  },
};

// ---- Settings-View ----
type RolePolicy = Safety | "any";

export default function SettingsView() {
  const toasts = useToasts();
  // Persistente Werte laden
  const [key, setKey] = React.useState<string>(getApiKey() ?? "");
  const [modelId, setModelId] = React.useState<string | null>(getSelectedModelId());
  const [nsfw, setNsfw] = React.useState<boolean>(getNSFW());
  const [style, setStyleState] = React.useState<StyleKey>(getStyle());
  const [templateId, setTemplateIdState] = React.useState<string | null>(getTemplateId());
  const [useRoleStyle, setUseRoleStyleState] = React.useState<boolean>(getUseRoleStyle());

  const templates = React.useMemo(() => listRoleTemplates(), []);

  // Rollen-Templates beim Einstieg laden (einmalig)
  React.useEffect(() => {
    const ac = new AbortController();
    try {
      // lädt aus public/styles.json | persona.json | roles.json
      fetchRoleTemplates(false, ac.signal).catch(() => {});
    } catch (_e) {
      void 0;
    }
    return () => ac.abort();
  }, []);

  // Normalisierte Policy aus Rolle → ModelPicker-Filter
  const policyFromRole: RolePolicy = React.useMemo(() => {
    const r = getRoleById(templateId ?? "");
    const raw = (r as any)?.policy as unknown;
    return raw === "loose" || raw === "moderate" || raw === "strict" ? (raw as Safety) : "any";
  }, [templateId]);

  // Anzeigenamen/Beschreibung/Systemprompt zum Stil
  const styleMeta = React.useMemo(() => {
    return (
      STYLE_META[style] ?? {
        label: String(style),
        description: "",
        system: "",
      }
    );
  }, [style]);

  // Vorschau-Text für die Rolle (wie im alten Stand)
  const rolePreview = React.useMemo(() => {
    const r = getRoleById(templateId ?? "");
    const purpose = rolePurpose(r);
    const lines: string[] = [];
    lines.push("Feintuning: Ton=medium, Kürze=balanced, Humor=none, Emojis=nein.");
    lines.push("Priorität: Ehrlichkeit → Klarheit → Kürze.");
    lines.push("Struktur: Ziel → Plan → Monitoring.");
    lines.push("Listen: prefer (max. 6 Punkte).");
    lines.push("Hinweise: Kein Ersatz für ärztlichen Rat.");
    lines.push("Vermeiden: Floskeln, Motivationssprech.");
    lines.push("Rolle: direkt, kritisch.");
    if (purpose) {
      lines.push("");
      lines.push("Rollen-Zusatz:");
      lines.push(purpose);
    }
    return lines.join("\n");
  }, [templateId]);

  // --- Handlers (persistieren) ---
  function saveKey() {
    const val = key.trim();
    setApiKey(val);
    toasts.push({ kind: "success", title: "Gespeichert", message: val ? "API‑Key wurde lokal gespeichert." : "API‑Key entfernt." });
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

  return (
    <main className="mx-auto w-full max-w-4xl space-y-8 px-4 py-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold">Einstellungen</h1>
        <p className="text-sm opacity-80">API-Key, Stil, Modell & Rolle.</p>
      </header>

      {/* API-Key */}
      <section className="rounded-xl border border-border bg-background/60 p-4">
        <h2 className="mb-3 text-base font-semibold">OpenRouter API Key</h2>
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
        <p className="mt-2 text-xs opacity-70">Wird lokal gespeichert (kein Server-Speicher).</p>
      </section>

      {/* Stil */}
      <section className="rounded-xl border border-border bg-background/60 p-4">
        <h2 className="mb-3 text-base font-semibold">Stil</h2>
        <div className="grid gap-2">
          <select
            value={style}
            onChange={onStyleChange}
            aria-label="Stil auswählen"
            className="w-full rounded-lg border border-border bg-background/70 px-3 py-2 text-sm outline-none ring-0"
          >
            <option value="concise">{STYLE_META.concise?.label ?? "Kompakt"}</option>
            <option value="blunt_de">{STYLE_META.blunt_de?.label ?? "Direkt (DE)"}</option>
            <option value="friendly">{STYLE_META.friendly?.label ?? "Locker"}</option>
            <option value="creative_light">{STYLE_META.creative_light?.label ?? "Kreativ (leicht)"}</option>
            <option value="minimal">{STYLE_META.minimal?.label ?? "Minimal"}</option>
          </select>
          {styleMeta.description ? (
            <p className="text-sm opacity-80">{styleMeta.description}</p>
          ) : null}
        </div>
      </section>

      {/* Modell */}
      <section className="space-y-3 rounded-xl border border-border bg-background/60 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Modell</h2>
          <div className="text-sm opacity-80">
            aktuell: <span className="font-mono">{modelId ?? "—"}</span>
          </div>
        </div>
        <ModelPicker
          value={modelId}
          onChange={(id) => {
            setModelId(id);
            setSelectedModelId(id);
          }}
          policyFromRole={policyFromRole}
        />
      </section>

      {/* Rolle */}
      <section className="rounded-xl border border-border bg-gradient-to-b from-violet-900/20 to-fuchsia-900/10 p-4">
        <div className="mb-3">
          <h2 className="text-base font-semibold">Rolle</h2>
          <p className="text-sm opacity-80">Optionales System-Verhalten für den Chat.</p>
        </div>

        <div className="grid gap-3">
          <select
            value={templateId ?? ""}
            onChange={onTemplateChange}
            aria-label="Rolle auswählen"
            className="w-full rounded-lg border border-border bg-background/70 px-3 py-2 text-sm outline-none ring-0"
          >
            <option value="">Keine spezielle Rolle</option>
            {templates.map((t: unknown, i: number) => (
              <option key={i} value={(t as any)?.id ?? ""}>
                {roleTitle(t)}
              </option>
            ))}
          </select>

          <label className="flex items-center justify-between rounded-lg border border-neutral-700 bg-black/20 px-3 py-2 text-sm">
            <span>Stil an Rolle anpassen</span>
            <input
              type="checkbox"
              className="h-5 w-10 cursor-pointer appearance-none rounded-full bg-neutral-700 outline-none transition
                         checked:bg-blue-600
                         before:ml-0.5 before:block before:h-4 before:w-4 before:translate-x-0 before:rounded-full before:bg-white before:transition
                         checked:before:translate-x-5"
              checked={useRoleStyle}
              onChange={onUseRoleStyle}
              aria-label="Stil automatisch an die Rolle anpassen"
            />
          </label>

          {/* Vorschau-Box */}
          <div className="rounded-lg border border-neutral-700 bg-black/30 p-3">
            <div className="mb-2 text-sm font-medium opacity-90">Vorschau</div>
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap text-sm leading-relaxed">
{rolePreview}
            </pre>
          </div>
        </div>

        {/* Optional: NSFW */}
        <div className="mt-3 flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={nsfw}
              onChange={onToggleNSFW}
              aria-label="NSFW-Filter lockern"
            />
            NSFW-Filter lockern
          </label>
        </div>
      </section>

      {/* Vorschau Systemprompt (Stil) */}
      <section className="rounded-xl border border-border bg-background/60 p-4">
        <h2 className="mb-3 text-base font-semibold">Vorschau Systemprompt</h2>
        <div className="rounded-lg border border-border bg-background/60 p-3 text-sm leading-relaxed">
          {styleMeta.system || "—"}
        </div>
      </section>

      <nav className="flex justify-end">
        <a href="#/chat" className="underline">zurück zum Chat</a>
      </nav>
    </main>
  );
}
