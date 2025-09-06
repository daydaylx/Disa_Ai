import React from "react";

import ModelPicker from "../components/ModelPicker";
import Switch from "../components/Switch";
import { Button } from "../components/ui/Button";
import { useToasts } from "../components/ui/Toast";
import type { Safety } from "../config/models";
import {
  fetchRoleTemplates,
  getRoleById,
  getRoleLoadStatus,
  listRoleTemplates,
  type RoleTemplate,
} from "../config/promptTemplates";
import {
  getCtxMaxTokens,
  getCtxReservedTokens,
  getMemoryEnabled,
  getNSFW,
  getSelectedModelId,
  getStyle,
  getTemplateId,
  getUseRoleStyle,
  setCtxMaxTokens,
  setCtxReservedTokens,
  setMemoryEnabled,
  setNSFW,
  setSelectedModelId,
  setStyle,
  setTemplateId,
  setUseRoleStyle,
  type StyleKey,
} from "../config/settings";
import { composeSystemPrompt } from "../features/prompt/composeSystemPrompt";
import { usePWAInstall } from "../hooks/usePWAInstall";
import { getApiKey,setApiKey } from "../services/openrouter";

// ---- Helper für uneinheitliche Rollentypen ----
// rolePurpose entfällt – wir zeigen den echten Systemprompt

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
  const pwa = usePWAInstall();
  // Persistente Werte laden
  const [key, setKey] = React.useState<string>(getApiKey() ?? "");
  const [modelId, setModelId] = React.useState<string | null>(getSelectedModelId());
  const [nsfw, setNsfw] = React.useState<boolean>(getNSFW());
  const [memEnabled, setMemEnabled] = React.useState<boolean>(getMemoryEnabled());
  const [ctxMax, setCtxMax] = React.useState<number>(getCtxMaxTokens());
  const [ctxReserve, setCtxReserve] = React.useState<number>(getCtxReservedTokens());
  const [style, setStyleState] = React.useState<StyleKey>(getStyle());
  const [templateId, setTemplateIdState] = React.useState<string | null>(getTemplateId());
  const [useRoleStyle, setUseRoleStyleState] = React.useState<boolean>(getUseRoleStyle());

  const [templates, setTemplates] = React.useState<RoleTemplate[]>(() => listRoleTemplates());
  const [roleLoad, setRoleLoad] = React.useState<{ state: string; error: string | null }>(
    () => getRoleLoadStatus(),
  );

  // Rollen-Templates beim Einstieg laden (einmalig)
  React.useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const list = await fetchRoleTemplates(false, ac.signal);
        setTemplates(list);
      } catch {
        /* ignore */
      } finally {
        setRoleLoad(getRoleLoadStatus());
      }
    })();
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

  // Vorschau: Bevorzugt den Systemtext aus der gewählten Rolle (styles.json),
  // sonst den effektiven Systemprompt (Stil + Rolle + NSFW)
  const systemPreview = React.useMemo(() => {
    const role = getRoleById(templateId ?? "");
    const roleSystem = (role as any)?.system as string | undefined;
    const roleText = roleSystem && roleSystem.trim().length > 0 ? roleSystem : "";
    if (roleText) return roleText;
    return (
      composeSystemPrompt({
        style,
        useRoleStyle,
        roleId: templateId ?? null,
        allowNSFW: nsfw,
      }) || "—"
    );
  }, [style, useRoleStyle, templateId, nsfw]);

  // Labels für Rollen-Select mit Policy/Tags
  function policyLabel(p?: Safety | string): string {
    if (!p) return "";
    if (p === "strict") return "[strikt] ";
    if (p === "moderate") return "[moderat] ";
    if (p === "loose") return "[frei] ";
    return ""; // any/unknown → kein Präfix
  }
  const groupedRoleOptions = React.useMemo(() => {
    const groups = new Map<string, Array<{ id: string; label: string }>>();
    for (const t of templates) {
      const cat = (t.tags && t.tags[0]) || "Allgemein";
      const label = `${policyLabel(t.policy)}${t.name || t.id}`;
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push({ id: t.id, label });
    }
    // sortiere Gruppen + Einträge alphabetisch
    const order = Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    order.forEach(([, arr]) => arr.sort((a, b) => a.label.localeCompare(b.label)));
    return order;
  }, [templates]);

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
  function onToggleMem(e: React.ChangeEvent<HTMLInputElement>) {
    setMemEnabled(e.target.checked);
    setMemoryEnabled(e.target.checked);
  }
  function onCtxMax(n: number) {
    setCtxMax(n);
    setCtxMaxTokens(n);
  }
  function onCtxReserve(n: number) {
    setCtxReserve(n);
    setCtxReservedTokens(n);
  }

  return (
    <main
      className="mx-auto w-full max-w-4xl space-y-8 px-4 py-6"
      style={{ paddingBottom: "calc(var(--bottomnav-h, 56px) + 24px)" }}
    >
      <header className="space-y-1">
        <h1 className="text-xl font-semibold">Einstellungen</h1>
        <p className="text-sm opacity-80">API-Key, Stil, Modell & Rolle.</p>
      </header>

      {/* App-Installation */}
      <section className="rounded-xl border border-border bg-background/60 p-4 glass card-gradient">
        <h2 className="mb-3 text-base font-semibold title-underline">App-Installation</h2>
        <div className="text-sm opacity-90">
          Installiere die App für schnellen Zugriff, eigenständiges Icon und Offline-Unterstützung.
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {pwa.canInstall ? (
            <button className="btn-glow tilt-on-press" onClick={pwa.requestInstall}>
              Jetzt installieren
            </button>
          ) : pwa.installed ? (
            <span className="nav-pill">Bereits installiert</span>
          ) : (
            <span className="text-xs opacity-70">Installations‑Aufforderung momentan nicht verfügbar.</span>
          )}
          {pwa.showIOSHowTo && (
            <span className="text-xs opacity-80">
              iOS: Über „Teilen“ → „Zum Home‑Bildschirm“ hinzufügen
            </span>
          )}
        </div>
      </section>

      {/* API-Key */}
      <section className="rounded-xl border border-border bg-background/60 p-4 glass card-gradient">
        <h2 className="mb-3 text-base font-semibold title-underline">OpenRouter API Key</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="sk-…"
            aria-label="API-Schlüssel"
            className="input min-w-0 flex-1 text-sm"
          />
          <Button onClick={saveKey} aria-label="API-Schlüssel speichern">
            Speichern
          </Button>
        </div>
        <p className="mt-2 text-xs opacity-70">Wird lokal gespeichert (kein Server-Speicher).</p>
      </section>

      {/* Stil */}
      <section className="rounded-xl border border-border bg-background/60 p-4 glass card-gradient">
        <h2 className="mb-3 text-base font-semibold title-underline">Stil</h2>
        <div className="grid gap-2">
          <select
            value={style}
            onChange={onStyleChange}
            aria-label="Stil auswählen"
            className="w-full input text-sm"
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

      {/* Kontext & Gedächtnis */}
      <section className="rounded-xl border border-border bg-background/60 p-4">
        <h2 className="mb-3 text-base font-semibold title-underline">Kontext & Gedächtnis</h2>
        <div className="grid gap-3">
          <div className="flex items-center justify-between rounded-lg border border-neutral-700 bg-black/20 px-3 py-2 text-sm">
            <Switch checked={memEnabled} onChange={(v) => onToggleMem({ target: { checked: v } } as any)} label="Gedächtnis aktivieren (lokal, pro Chat)" />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <label className="flex items-center gap-2">
              max Tokens:
              <input
                type="number"
                min={1024}
                step={512}
                value={ctxMax}
                onChange={(e) => onCtxMax(Number(e.target.value) || 0)}
                className="w-28 rounded-md border border-border bg-background px-2 py-1"
                aria-label="Maximales Kontextfenster"
              />
            </label>
            <label className="flex items-center gap-2">
              Antwort‑Reserve:
              <input
                type="number"
                min={128}
                step={128}
                value={ctxReserve}
                onChange={(e) => onCtxReserve(Number(e.target.value) || 0)}
                className="w-28 rounded-md border border-border bg-background px-2 py-1"
                aria-label="Reservierte Tokens für die Antwort"
              />
            </label>
          </div>
          <p className="text-xs opacity-70">
            Hinweis: Das Gedächtnis bleibt lokal gespeichert. Der Systemprompt enthält einen kompakten
            Kontextauszug (Themen, Entitäten, Fakten, Summary). Das Token‑Budget kürzt lange Verläufe automatisch.
          </p>
        </div>
      </section>

      {/* Modell */}
      <section className="space-y-3 rounded-xl border border-border bg-background/60 p-4 glass card-gradient">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold title-underline">Modell</h2>
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
      <section className="rounded-xl border border-border bg-gradient-to-b from-violet-900/20 to-fuchsia-900/10 p-4 glass card-gradient">
        <div className="mb-3">
          <h2 className="text-base font-semibold title-underline">Rolle</h2>
          <p className="text-sm opacity-80">Optionales System-Verhalten für den Chat.</p>
        </div>

        <div className="grid gap-3">
          <select
            value={templateId ?? ""}
            onChange={onTemplateChange}
            aria-label="Rolle auswählen"
            className="w-full input text-sm"
          >
            <option value="">Keine spezielle Rolle</option>
            {groupedRoleOptions.map(([cat, arr]) => (
              <optgroup key={cat} label={cat}>
                {arr.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {roleLoad.state === "loading" && (
            <div className="text-xs opacity-70">Rollen werden geladen…</div>
          )}
          {roleLoad.state === "missing" && (
            <div className="text-xs text-amber-300">
              Keine Rollen gefunden. Lege <code>public/styles.json</code> mit Feld <code>styles</code> an.
            </div>
          )}
          {roleLoad.state === "error" && (
            <div className="text-xs text-red-300">Fehler beim Laden: {roleLoad.error}</div>
          )}

          <div className="flex items-center justify-between rounded-lg border border-neutral-700 bg-black/20 px-3 py-2 text-sm">
            <Switch
              checked={useRoleStyle}
              onChange={(v) => onUseRoleStyle({ target: { checked: v } } as any)}
              label="Stil an Rolle anpassen"
            />
          </div>

          {/* Systemprompt-Vorschau (effektiv) */}
          <div className="rounded-lg border border-border bg-background/60 p-3">
            <div className="mb-2 text-sm font-medium opacity-90">Vorschau Systemprompt</div>
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap text-sm leading-relaxed">{systemPreview}</pre>
          </div>
        </div>

        {/* Optional: NSFW */}
        <div className="mt-3 flex items-center gap-3">
          <Switch checked={nsfw} onChange={(v) => onToggleNSFW({ target: { checked: v } } as any)} label="NSFW-Filter lockern" />
        </div>
      </section>

      {/* separate Stil-Vorschau entfernt: die effektive Vorschau steht nun bei Rolle */}

      <nav className="flex justify-end">
        <a href="#/chat" className="underline">zurück zum Chat</a>
      </nav>
    </main>
  );
}
