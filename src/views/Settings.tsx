import React from "react";

import Icon from "../components/Icon";
import InlineBanner from "../components/InlineBanner";
import ModelPicker from "../components/ModelPicker";
import PillSelect from "../components/PillSelect";
import SectionCard from "../components/SectionCard";
import Switch from "../components/Switch";
import { getPreferRolePolicy, setPreferRolePolicy } from "../config/featureFlags";
import type { Safety } from "../config/models";
import {
  fetchRoleTemplates,
  getRoleById,
  getRoleLoadStatus,
  listRoleTemplates,
  type RoleTemplate,
} from "../config/promptTemplates";
import { recommendedPolicyForRole } from "../config/rolePolicy";
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
import { getApiKey, pingOpenRouter, setApiKey } from "../services/openrouter";

const STYLE_OPTIONS: { value: StyleKey; label: string }[] = [
  { value: "blunt_de", label: "Direkt & kritisch" },
  { value: "neutral", label: "Neutral" },
  { value: "concise", label: "Sehr knapp" },
  { value: "friendly", label: "Freundlich" },
  { value: "creative_light", label: "Bildhaft" },
  { value: "minimal", label: "Nur Antwort" },
];

export default function SettingsView() {
  const [key, setKey] = React.useState<string>(getApiKey() ?? "");
  const [modelId, setModelId] = React.useState<string | null>(getSelectedModelId());
  const [nsfw, setNsfw] = React.useState<boolean>(getNSFW());
  const [style, setStyleState] = React.useState<StyleKey>(getStyle());
  const [templateId, setTemplateIdState] = React.useState<string | null>(getTemplateId());
  const [useRoleStyle, setUseRoleStyleState] = React.useState<boolean>(getUseRoleStyle());
  const [preferRolePolicy, setPreferRolePolicyState] =
    React.useState<boolean>(getPreferRolePolicy());
  const [templates, setTemplates] = React.useState<RoleTemplate[]>([]);
  const [savedToast, setSavedToast] = React.useState<string | null>(null);
  const hasKey = !!(getApiKey() ?? "");

  const [diagRunning, setDiagRunning] = React.useState(false);
  const [diagResult, setDiagResult] = React.useState<null | {
    ok: boolean;
    status: number | null;
    corsBlocked: boolean;
    message: string;
  }>(null);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await fetchRoleTemplates(true);
        if (!alive) return;
        setTemplates(listRoleTemplates());
      } catch {
        setTemplates([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  React.useEffect(() => {
    if (!savedToast) return;
    const t = window.setTimeout(() => setSavedToast(null), 1200);
    return () => window.clearTimeout(t);
  }, [savedToast]);

  function saveKey() {
    setApiKey(key.trim());
    setSavedToast("Key gespeichert");
  }
  function clearKey() {
    setKey("");
    setApiKey("");
    setSavedToast("Key gelöscht");
  }
  function _onChoose(id: string) {
    setModelId(id);
    setSelectedModelId(id);
    setSavedToast("Modell geändert");
  }

  function _toggleNSFW() {
    const next = !nsfw;
    setNsfw(next);
    setNSFW(next);
  }
  function _togglePreferRolePolicy() {
    const next = !preferRolePolicy;
    setPreferRolePolicyState(next);
    setPreferRolePolicy(next);
  }

  const currentRole = React.useMemo(() => getRoleById(templateId), [templateId, templates]);
  const recPolicy: Safety | "any" = React.useMemo(
    () => recommendedPolicyForRole(currentRole?.id ?? null),
    [currentRole?.id],
  );
  const roleLoad = getRoleLoadStatus();

  async function runDiag() {
    setDiagRunning(true);
    try {
      const r = await pingOpenRouter();
      setDiagResult({
        ok: !!r,
        status: r ? 200 : 0,
        corsBlocked: false,
        message: r ? "OK" : "nicht erreichbar",
      });
    } finally {
      setDiagRunning(false);
    }
  }

  // Reine styles.json-Vorschau – kein Fallback mehr
  const previewTitle = "Vorschau (Template aus styles.json)";
  const previewText = (currentRole?.system ?? "").trim();

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6">
      <h1 className="text-xl font-semibold">Einstellungen</h1>

      {!hasKey && (
        <InlineBanner tone="warn" title="Kein OpenRouter API-Key gespeichert.">
          Ohne Key kann nicht gechattet werden.
        </InlineBanner>
      )}

      {roleLoad.state === "missing" && (
        <InlineBanner tone="warn" title="styles.json fehlt">
          <span>
            Lege <code>public/styles.json</code> an und redeploy. Sonst sind Rollen deaktiviert.
          </span>
        </InlineBanner>
      )}
      {roleLoad.state === "error" && (
        <InlineBanner tone="error" title="Fehler beim Laden von styles.json">
          <span>{roleLoad.error ?? "Unbekannter Fehler"}</span>
        </InlineBanner>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <SectionCard title="API-Key" icon="key" subtitle="Wird lokal gespeichert.">
          <div className="flex flex-col gap-2">
            <label className="sr-only" htmlFor="api-key">
              OpenRouter API-Key
            </label>
            <input
              id="api-key"
              type="password"
              autoComplete="off"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sk-or-…"
              aria-describedby="api-key-help"
              className="rounded-xl border border-neutral-300 bg-white px-3 py-2 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={saveKey}
                className="rounded-xl border border-blue-600 bg-blue-600 px-3 py-2 text-white hover:brightness-110 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500"
              >
                Speichern
              </button>
              <button
                type="button"
                onClick={clearKey}
                className="rounded-xl border border-neutral-300 px-3 py-2 hover:bg-neutral-100 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-neutral-700 dark:hover:bg-neutral-800"
              >
                Löschen
              </button>
            </div>
            <p id="api-key-help" className="mt-1 inline-flex items-center gap-1 text-xs opacity-70">
              <Icon name="shield" width="14" height="14" /> Lokal, kein Server-Upload.
            </p>
          </div>
        </SectionCard>

        <SectionCard
          title="Diagnose"
          icon="info"
          subtitle="Prüft OpenRouter-Erreichbarkeit (CORS / Whitelist / Key)."
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={runDiag}
              disabled={diagRunning}
              className="rounded-xl border border-neutral-300 px-3 py-2 hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
            >
              {diagRunning ? "Prüfe…" : "API-Diagnose starten"}
            </button>
            {diagResult && (
              <span
                className={`text-sm ${diagResult.ok ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
              >
                {diagResult.ok
                  ? `OK (HTTP ${diagResult.status})`
                  : diagResult.corsBlocked
                    ? `CORS/Origin blockiert – Domain whitelisten`
                    : diagResult.message}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs opacity-70">
            Wenn CORS blockiert: <code>disaai.pages.dev</code> in OpenRouter „Allowed Origins“
            eintragen.
          </p>
        </SectionCard>

        <SectionCard title="Inhalte" icon="nsfw" subtitle="Sensible Themen & Stil.">
          <div className="space-y-4">
            <Switch
              id="nsfw"
              checked={nsfw}
              onChange={(v) => {
                setNsfw(v);
                setNSFW(v);
              }}
              label="NSFW (18+) erlauben"
            />
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-sm font-medium">
                <Icon name="style" width="16" height="16" />
                Antwort-Stil
              </div>
              <PillSelect
                value={style}
                options={STYLE_OPTIONS}
                onChange={(v) => {
                  setStyleState(v as StyleKey);
                  setStyle(v as StyleKey);
                }}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Rolle" icon="role" subtitle="System-Verhalten für den Chat.">
          <div className="space-y-3">
            <select
              value={templateId ?? ""}
              onChange={(e) => {
                const val = e.target.value || null;
                setTemplateIdState(val);
                setTemplateId(val);
              }}
              className="w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 dark:border-neutral-700 dark:bg-neutral-900"
            >
              <option value="">Keine Rolle</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <Switch
              id="use-role-style"
              checked={useRoleStyle}
              onChange={(v) => {
                setUseRoleStyleState(v);
                setUseRoleStyle(v);
              }}
              label="Stil an Rolle anpassen"
            />
            <Switch
              id="pref-role-policy"
              checked={preferRolePolicy}
              onChange={() => {
                const nxt = !preferRolePolicy;
                setPreferRolePolicyState(nxt);
                setPreferRolePolicy(nxt);
              }}
              label="Modell-Policy an Rolle ausrichten"
            />
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-950">
              <div className="mb-1 text-xs opacity-60">{previewTitle}</div>
              {previewText ? (
                <pre className="whitespace-pre-wrap text-xs leading-relaxed">{previewText}</pre>
              ) : (
                <div className="text-xs opacity-70">
                  Kein <code>system</code>-Text in styles.json für diese Rolle hinterlegt.
                </div>
              )}
              <div className="mt-2 text-xs opacity-80">
                Empfohlene Policy: <strong>{recPolicy}</strong>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Modell" icon="model" subtitle="Sprachmodell für den Chat.">
          <div className="space-y-2">
            <ModelPicker
              value={modelId}
              onChange={(id) => {
                setModelId(id);
                setSelectedModelId(id);
              }}
              policyFromRole={preferRolePolicy ? recPolicy : "any"}
            />
            <p className="text-xs opacity-70">
              Einige Rollen erzwingen ggf. kompatible Modelle. Bei Konflikt wird automatisch
              umgeschaltet.
            </p>
          </div>
        </SectionCard>
      </div>

      {savedToast && (
        <div className="fixed left-1/2 top-[60px] z-20 -translate-x-1/2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/65 px-3 py-1.5 text-sm shadow-sm backdrop-blur dark:border-white/10 dark:bg-neutral-900/55">
            <Icon name="check" width="14" height="14" />
            <span>{savedToast}</span>
          </div>
        </div>
      )}
    </div>
  );
}
