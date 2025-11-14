import { Link } from "react-router-dom";

import { Check, Sparkles } from "../../lib/icons";
import { cn } from "../../lib/utils";
import { DrawerSheet } from "../ui/drawer-sheet";
import { GlassPanel } from "../ui/GlassPanel";
import { Switch } from "../ui/Switch";

const MODEL_PRESETS = [
  { id: "openai/gpt-4o-mini", label: "GPT‑4o mini", hint: "Schnell & günstig" },
  { id: "anthropic/claude-3.5-sonnet", label: "Claude 3.5 Sonnet", hint: "Story & Strategie" },
  { id: "meta-llama/llama-3.1-405b", label: "Llama 3.1 405B", hint: "On-Device Bridge" },
];

const ROLE_PRESETS = [
  { id: "coach", label: "Mindful Coach" },
  { id: "pm", label: "Produktstratege" },
  { id: "dev", label: "Pair Programmer" },
  { id: "persona", label: "Persona Builder" },
];

interface ToggleConfig {
  value: boolean;
  onToggle: () => void;
  label: string;
  description: string;
}

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: { path: string; label: string }[];
  activePath: string;
  selectedModelId?: string;
  onSelectModel: (modelId: string) => void;
  toggles: {
    nsfw: Omit<ToggleConfig, "label" | "description">;
    analytics: Omit<ToggleConfig, "label" | "description">;
    notifications: Omit<ToggleConfig, "label" | "description">;
  };
}

export function SettingsDrawer({
  isOpen,
  onClose,
  navItems,
  activePath,
  selectedModelId,
  onSelectModel,
  toggles,
}: SettingsDrawerProps) {
  const toggleConfigs: ToggleConfig[] = [
    {
      ...toggles.notifications,
      label: "Push-Benachrichtigungen",
      description: "Updates zu neuen Antworten und Laufzeiten",
    },
    {
      ...toggles.analytics,
      label: "Produkt-Insights",
      description: "Anonyme Nutzungsdaten helfen bei der Optimierung",
    },
    {
      ...toggles.nsfw,
      label: "Explizite Inhalte",
      description: "Modelle dürfen sensiblere Themen behandeln",
    },
  ];

  return (
    <DrawerSheet title="Disa AI Studio" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        <GlassPanel
          padded
          className="bg-surface-panel/90 shadow-none border-[var(--glass-border-soft)]"
        >
          <div className="flex items-center gap-2 text-text-muted">
            <Sparkles className="h-4 w-4 text-[var(--accent)]" />
            <span className="text-xs uppercase tracking-[0.25em]">Navigation</span>
          </div>
          <div className="mt-3 space-y-2 text-sm">
            {navItems.map((item) => {
              const isActive =
                item.path === "/"
                  ? activePath === "/"
                  : activePath.startsWith(item.path) || activePath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between rounded-2xl border px-4 py-3 transition-colors",
                    isActive
                      ? "border-[var(--accent-border)] bg-[var(--accent-soft)] text-text-primary shadow-[0_15px_35px_rgba(97,231,255,0.25)]"
                      : "border-[var(--glass-border-soft)] text-text-muted hover:text-text-primary hover:border-[var(--glass-border-strong)]",
                  )}
                >
                  <span className="text-base font-medium">{item.label}</span>
                  {isActive && <Check className="h-4 w-4 text-[var(--accent)]" />}
                </Link>
              );
            })}
          </div>
        </GlassPanel>

        <GlassPanel padded>
          <header className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold tracking-tight">Modellwahl</p>
              <p className="text-xs text-text-muted">Kuratierte Empfehlungen</p>
            </div>
            <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[11px] font-medium text-[var(--accent)]">
              Beta
            </span>
          </header>
          <div className="mt-3 space-y-2">
            {MODEL_PRESETS.map((model) => {
              const isActive = selectedModelId === model.id;
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => onSelectModel(model.id)}
                  className={cn(
                    "w-full rounded-2xl border px-4 py-3 text-left transition-colors",
                    isActive
                      ? "border-[var(--accent-border)] bg-[var(--accent-soft)] text-text-primary shadow-[0_18px_40px_rgba(97,231,255,0.25)]"
                      : "border-[var(--glass-border-soft)] text-text-primary/90 hover:border-[var(--glass-border-strong)] hover:text-text-primary",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{model.label}</p>
                      <p className="text-xs text-text-muted">{model.hint}</p>
                    </div>
                    {isActive && (
                      <span className="rounded-full bg-[var(--accent)]/20 px-3 py-1 text-[11px] font-semibold text-[var(--accent)]">
                        aktiv
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </GlassPanel>

        <GlassPanel padded>
          <header className="flex items-center justify-between">
            <p className="text-sm font-semibold tracking-tight">Rollen & Presets</p>
            <span className="text-xs uppercase tracking-[0.32em] text-text-muted">In Arbeit</span>
          </header>
          <div className="mt-3 flex flex-wrap gap-2">
            {ROLE_PRESETS.map((role) => (
              <button
                key={role.id}
                type="button"
                className="rounded-full border border-[var(--glass-border-soft)] bg-surface-inline/70 px-4 py-2 text-xs font-medium text-text-primary/90 hover:border-[var(--glass-border-strong)]"
              >
                {role.label}
              </button>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel padded>
          <p className="text-sm font-semibold tracking-tight">Sicherheit & Signale</p>
          <div className="mt-3 space-y-3">
            {toggleConfigs.map((toggle) => (
              <div key={toggle.label} className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{toggle.label}</p>
                  <p className="text-xs text-text-muted">{toggle.description}</p>
                </div>
                <Switch checked={toggle.value} onChange={() => toggle.onToggle()} size="sm" />
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </DrawerSheet>
  );
}
