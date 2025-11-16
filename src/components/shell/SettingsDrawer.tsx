import { type ComponentType } from "react";
import { Link } from "react-router-dom";

import { type AppNavItem, isNavItemActive } from "../../config/navigation";
import { Bot, Check, Sparkles, Users } from "../../lib/icons";
import { cn } from "../../lib/utils";
import { DrawerSheet } from "../ui/drawer-sheet";
import { GlassPanel } from "../ui/GlassPanel";
import { Switch } from "../ui/Switch";
import { Typography } from "../ui/typography";

const MODEL_PRESETS = [
  { id: "openai/gpt-4o-mini", label: "GPT‑4o mini", hint: "Schnell & günstig" },
  { id: "anthropic/claude-3.5-sonnet", label: "Claude 3.5 Sonnet", hint: "Story & Strategie" },
  { id: "meta-llama/llama-3.1-405b", label: "Llama 3.1 405B", hint: "On-Device Bridge" },
];

const ROLE_PRESETS: Array<{
  id: string;
  label: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  {
    id: "coach",
    label: "Mindful Coach",
    description: "Atmung, Check-ins, Fokus in Sessions",
    icon: Users,
  },
  {
    id: "pm",
    label: "Produktstratege",
    description: "Roadmaps, KPIs, Narrative schärfen",
    icon: Sparkles,
  },
  {
    id: "dev",
    label: "Pair Programmer",
    description: "Refactors, Tests, sichere Deploys",
    icon: Bot,
  },
  {
    id: "persona",
    label: "Persona Builder",
    description: "Rollenbibliothek & Tonalität testen",
    icon: Users,
  },
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
  navItems: AppNavItem[];
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
  const preferenceSections: Array<{
    title: string;
    description: string;
    items: ToggleConfig[];
  }> = [
    {
      title: "Signale & Benachrichtigungen",
      description: "Steuere Hinweise zu Antworten, Laufzeiten und Performance.",
      items: [
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
      ],
    },
    {
      title: "Inhalt & Sicherheit",
      description: "Kontrolliere, welche Themen Modelle beantworten dürfen.",
      items: [
        {
          ...toggles.nsfw,
          label: "Explizite Inhalte",
          description: "Modelle dürfen sensiblere Themen behandeln",
        },
      ],
    },
  ];

  return (
    <DrawerSheet title="Disa AI Studio" isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        <section aria-labelledby="drawer-nav">
          <GlassPanel
            padded
            className="bg-surface-panel/90 shadow-none border-[var(--glass-border-soft)]"
          >
            <div className="flex items-center gap-2 text-text-muted" id="drawer-nav">
              <Sparkles className="h-4 w-4 text-[var(--accent)]" />
              <Typography variant="caption" className="uppercase tracking-[0.25em]">
                Navigation
              </Typography>
            </div>
            <div className="mt-3 space-y-2 text-sm">
              {navItems.map((item) => {
                const isActive = isNavItemActive(item, activePath);
                const Icon = item.Icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between rounded-2xl border px-4 py-3 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-soft)]",
                      isActive
                        ? "border-[var(--accent-border)] bg-[var(--accent-soft)] text-text-primary shadow-[0_15px_35px_rgba(97,231,255,0.25)]"
                        : "border-[var(--glass-border-soft)] text-text-muted hover:text-text-primary hover:border-[var(--glass-border-strong)]",
                    )}
                  >
                    <span className="flex grow items-center gap-3 text-left">
                      <span
                        className={cn(
                          "inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl border transition-colors",
                          isActive
                            ? "border-[var(--accent-border)] bg-[var(--accent-soft)] text-[var(--accent)]"
                            : "border-[var(--glass-border-soft)] text-text-secondary",
                        )}
                        aria-hidden="true"
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>
                        <Typography variant="h6" className="block text-text-primary">
                          {item.label}
                        </Typography>
                        {item.description && (
                          <Typography variant="caption" className="text-text-muted">
                            {item.description}
                          </Typography>
                        )}
                      </span>
                    </span>
                    {isActive && <Check className="h-4 w-4 text-[var(--accent)]" />}
                  </Link>
                );
              })}
            </div>
          </GlassPanel>
        </section>

        <section aria-labelledby="drawer-models">
          <GlassPanel padded>
            <header className="flex items-center justify-between" id="drawer-models">
              <div>
                <Typography variant="body" className="font-semibold tracking-tight">
                  Modellwahl
                </Typography>
                <Typography variant="caption" className="text-text-muted">
                  Kuratierte Empfehlungen
                </Typography>
              </div>
              <Typography
                variant="caption"
                as="span"
                className="rounded-full bg-[var(--accent-soft)] px-3 py-1 font-medium text-[var(--accent)]"
                style={{ fontSize: "11px" }}
              >
                Beta
              </Typography>
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
                      "w-full rounded-2xl border px-4 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-soft)]",
                      isActive
                        ? "border-[var(--accent-border)] bg-[var(--accent-soft)] text-text-primary shadow-[0_18px_40px_rgba(97,231,255,0.25)]"
                        : "border-[var(--glass-border-soft)] text-text-primary/90 hover:border-[var(--glass-border-strong)] hover:text-text-primary",
                    )}
                    aria-pressed={isActive}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <Typography variant="body" className="font-semibold">
                          {model.label}
                        </Typography>
                        <Typography variant="caption" className="text-text-muted">
                          {model.hint}
                        </Typography>
                      </div>
                      {isActive && (
                        <Typography
                          variant="caption"
                          as="span"
                          className="rounded-full bg-[var(--accent)]/20 px-3 py-1 font-semibold text-[var(--accent)]"
                          style={{ fontSize: "11px" }}
                        >
                          aktiv
                        </Typography>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </GlassPanel>
        </section>

        <section aria-labelledby="drawer-roles">
          <GlassPanel padded>
            <header className="flex items-center justify-between" id="drawer-roles">
              <Typography variant="body" className="font-semibold tracking-tight">
                Rollen & Presets
              </Typography>
              <Typography
                variant="caption"
                as="span"
                className="uppercase tracking-[0.32em] text-text-muted"
              >
                In Arbeit
              </Typography>
            </header>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {ROLE_PRESETS.map((role) => {
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    type="button"
                    className="rounded-2xl border border-[var(--glass-border-soft)] bg-surface-inline/60 px-4 py-3 text-left transition hover:border-[var(--glass-border-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-soft)]"
                  >
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--accent-soft)]/30 text-[var(--accent)]">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="space-y-1">
                        <Typography variant="body" className="font-semibold">
                          {role.label}
                        </Typography>
                        <Typography variant="caption" className="text-text-muted">
                          {role.description}
                        </Typography>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </GlassPanel>
        </section>

        <section aria-labelledby="drawer-preferences">
          <GlassPanel padded className="space-y-4">
            {preferenceSections.map((section) => {
              const sectionId = `drawer-pref-${section.title.replace(/\s+/g, "-").toLowerCase()}`;
              return (
                <div key={section.title} className="space-y-3" aria-labelledby={sectionId}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Typography
                        variant="body"
                        className="font-semibold tracking-tight"
                        id={sectionId}
                      >
                        {section.title}
                      </Typography>
                      <Typography variant="caption" className="text-text-muted">
                        {section.description}
                      </Typography>
                    </div>
                  </div>
                  <div className="space-y-3 rounded-2xl border border-[var(--glass-border-soft)] bg-surface-inline/40 p-3">
                    {section.items.map((toggle) => (
                      <div
                        key={toggle.label}
                        className="flex items-center justify-between gap-3 rounded-xl border border-transparent px-2 py-2 transition hover:border-[var(--glass-border-strong)]"
                      >
                        <div>
                          <Typography variant="body" className="font-medium">
                            {toggle.label}
                          </Typography>
                          <Typography variant="caption" className="text-text-muted">
                            {toggle.description}
                          </Typography>
                        </div>
                        <Switch
                          checked={toggle.value}
                          onChange={() => toggle.onToggle()}
                          size="sm"
                          aria-label={toggle.label}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </GlassPanel>
        </section>
      </div>
    </DrawerSheet>
  );
}
