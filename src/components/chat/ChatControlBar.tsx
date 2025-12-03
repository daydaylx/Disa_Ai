import { type ComponentType, useMemo } from "react";

import type { ModelEntry } from "@/config/models";
import { useRoles } from "@/contexts/RolesContext";
import { useMemory } from "@/hooks/useMemory";
import { useSettings } from "@/hooks/useSettings";
import { Brain, Cpu, Feather, Sparkles, User } from "@/lib/icons";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
} from "@/ui/Select";
import { Switch } from "@/ui/Switch";

const CREATIVE_STYLES = [
  { id: 10, label: "Präzise" },
  { id: 45, label: "Ausgewogen" },
  { id: 80, label: "Kreativ" },
];

interface ChatControlBarProps {
  modelCatalog: ModelEntry[] | null;
  className?: string;
}

function ControlLabel({
  icon: Icon,
  label,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-tertiary">
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </div>
  );
}

export function ChatControlBar({ modelCatalog, className }: ChatControlBarProps) {
  const { roles, activeRole, setActiveRole } = useRoles();
  const { settings, setPreferredModel, setCreativity } = useSettings();
  const { isEnabled: memoryEnabled, toggleMemory } = useMemory();

  const modelOptions = useMemo(() => {
    if (modelCatalog && modelCatalog.length > 0) return modelCatalog;
    if (settings.preferredModelId) {
      return [
        {
          id: settings.preferredModelId,
          label: settings.preferredModelId,
          tags: [],
          safety: "any",
        } as ModelEntry,
      ];
    }
    return [] as ModelEntry[];
  }, [modelCatalog, settings.preferredModelId]);

  const activeStyleLabel =
    CREATIVE_STYLES.find((style) => style.id === (settings.creativity ?? 45))?.label ??
    "Ausgewogen";

  return (
    <div
      className={cn("w-full bg-bg-page/95 backdrop-blur border-b border-border-ink/10", className)}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-wrap gap-2 px-3 py-3 sm:gap-3 sm:px-4 md:grid md:grid-cols-3">
        <Select
          value={activeRole?.id ?? "none"}
          onValueChange={(value) => {
            if (value === "none") {
              setActiveRole(null);
              return;
            }
            const role = roles.find((r) => r.id === value);
            setActiveRole(role ?? null);
          }}
        >
          <SelectTrigger aria-label="Rolle auswählen" className="min-h-[44px] text-left">
            <div className="flex w-full items-center gap-2 truncate">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-ink-secondary">
                <User className="h-4 w-4" />
              </div>
              <div className="flex flex-col truncate text-start">
                <ControlLabel icon={User} label="Rolle" />
                <span className="truncate text-sm font-medium text-ink-primary">
                  {activeRole?.name ?? "Keine Rolle"}
                </span>
              </div>
            </div>
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectLabel>Rollen</SelectLabel>
              <SelectItem value="none">Standard (Keine)</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={String(settings.creativity ?? 45)}
          onValueChange={(value) => {
            if (value === "memory-toggle") {
              toggleMemory();
              return;
            }
            const numericValue = Number(value);
            if (!Number.isNaN(numericValue)) {
              setCreativity(numericValue);
            }
          }}
        >
          <SelectTrigger aria-label="Stil und Gedächtnis" className="min-h-[44px] text-left">
            <div className="flex w-full items-center gap-2 truncate">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-ink-secondary">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="flex flex-col truncate text-start">
                <ControlLabel icon={Feather} label="Stil & Gedächtnis" />
                <span className="truncate text-sm font-medium text-ink-primary">
                  {activeStyleLabel}
                  <span className="text-ink-tertiary">
                    {" "}
                    • {memoryEnabled ? "Memory an" : "Memory aus"}
                  </span>
                </span>
              </div>
            </div>
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectLabel>Stil</SelectLabel>
              {CREATIVE_STYLES.map((style) => (
                <SelectItem key={style.id} value={String(style.id)}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectSeparator />
            <div className="flex items-center justify-between gap-3 px-3 py-2 text-sm text-ink-primary">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-ink-secondary" />
                <span>Gedächtnis</span>
              </div>
              <Switch
                checked={memoryEnabled}
                onCheckedChange={toggleMemory}
                aria-label="Gedächtnis umschalten"
              />
            </div>
          </SelectContent>
        </Select>

        <Select
          value={settings.preferredModelId}
          onValueChange={(value) => setPreferredModel(value)}
          disabled={modelCatalog === null && modelOptions.length === 0}
        >
          <SelectTrigger aria-label="Modell auswählen" className="min-h-[44px] text-left">
            <div className="flex w-full items-center gap-2 truncate">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-ink-secondary">
                <Cpu className="h-4 w-4" />
              </div>
              <div className="flex flex-col truncate text-start">
                <ControlLabel icon={Cpu} label="Modell" />
                <span className="truncate text-sm font-medium text-ink-primary">
                  {modelOptions.find((model) => model.id === settings.preferredModelId)?.label ??
                    settings.preferredModelId}
                </span>
              </div>
            </div>
          </SelectTrigger>
          <SelectContent align="start">
            <SelectGroup>
              <SelectLabel>Modelle</SelectLabel>
              {modelOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-ink-secondary">Keine Modelle verfügbar</div>
              ) : (
                modelOptions.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.label ?? model.id}
                  </SelectItem>
                ))
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
