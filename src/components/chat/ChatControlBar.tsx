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

import { resolveInitialModelId } from "../models/resolveInitialModelId";

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

  const modelOptions = useMemo(() => modelCatalog ?? ([] as ModelEntry[]), [modelCatalog]);

  const resolvedModelId = useMemo(
    () => resolveInitialModelId(settings.preferredModelId, modelCatalog),
    [modelCatalog, settings.preferredModelId],
  );

  const modelSelectDisabled = modelOptions.length === 0;

  const selectedModelLabel =
    modelOptions.find((model) => model.id === resolvedModelId)?.label ??
    resolvedModelId ??
    "Kein Modell ausgewählt – bitte auswählen";

  const activeStyleLabel =
    CREATIVE_STYLES.find((style) => style.id === (settings.creativity ?? 45))?.label ??
    "Ausgewogen";

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40 bg-bg-page/95 backdrop-blur border-t border-border-ink/20",
        "before:content-[''] before:absolute before:inset-0 before:shadow-[0_-1px_0_var(--border-chalk)] before:pointer-events-none before:opacity-50",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-3xl items-center justify-center gap-2 px-3 py-3 overflow-x-auto no-scrollbar sm:gap-3 sm:px-4">
        {/* Rolle Button */}
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
          <SelectTrigger
            aria-label="Rolle auswählen"
            className="min-h-[44px] min-w-[80px] flex-shrink-0 rounded-xl relative before:content-[''] before:absolute before:inset-0 before:rounded-xl before:shadow-[0_0_0_1.5px_var(--border-chalk)] before:pointer-events-none before:opacity-[var(--chalk-rough-opacity)] hover:before:shadow-[0_0_0_2px_var(--accent-primary),var(--chalk-glow)] transition-all"
          >
            <div className="flex items-center gap-1.5 justify-center">
              <User className="h-4 w-4 text-ink-secondary" />
              <span className="text-xs font-medium text-ink-primary">Rolle</span>
              <span className="text-ink-tertiary">›</span>
            </div>
          </SelectTrigger>
          <SelectContent align="center">
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

        {/* Stil Button */}
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
          <SelectTrigger
            aria-label="Stil auswählen"
            className="min-h-[44px] min-w-[80px] flex-shrink-0 rounded-xl relative before:content-[''] before:absolute before:inset-0 before:rounded-xl before:shadow-[0_0_0_1.5px_var(--border-chalk)] before:pointer-events-none before:opacity-[var(--chalk-rough-opacity)] hover:before:shadow-[0_0_0_2px_var(--accent-primary),var(--chalk-glow)] transition-all"
          >
            <div className="flex items-center gap-1.5 justify-center">
              <Feather className="h-4 w-4 text-ink-secondary" />
              <span className="text-xs font-medium text-ink-primary">Stil</span>
              <span className="text-ink-tertiary">›</span>
            </div>
          </SelectTrigger>
          <SelectContent align="center">
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

        {/* Kreativität Button */}
        <Select
          value={String(settings.creativity ?? 45)}
          onValueChange={(value) => {
            const numericValue = Number(value);
            if (!Number.isNaN(numericValue)) {
              setCreativity(numericValue);
            }
          }}
        >
          <SelectTrigger
            aria-label="Kreativität"
            className="min-h-[44px] min-w-[110px] flex-shrink-0 rounded-xl relative before:content-[''] before:absolute before:inset-0 before:rounded-xl before:shadow-[0_0_0_1.5px_var(--border-chalk)] before:pointer-events-none before:opacity-[var(--chalk-rough-opacity)] hover:before:shadow-[0_0_0_2px_var(--accent-primary),var(--chalk-glow)] transition-all"
          >
            <div className="flex items-center gap-1.5 justify-center">
              <Sparkles className="h-4 w-4 text-ink-secondary" />
              <span className="text-xs font-medium text-ink-primary">Kreativität</span>
              <span className="text-ink-tertiary">≡</span>
            </div>
          </SelectTrigger>
          <SelectContent align="center">
            <SelectGroup>
              <SelectLabel>Kreativität</SelectLabel>
              {CREATIVE_STYLES.map((style) => (
                <SelectItem key={style.id} value={String(style.id)}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {/* Modell Button */}
        <Select
          value={resolvedModelId ?? ""}
          onValueChange={(value) => setPreferredModel(value)}
          disabled={modelSelectDisabled}
        >
          <SelectTrigger
            aria-label="Modell auswählen"
            className="min-h-[44px] min-w-[90px] flex-shrink-0 rounded-xl relative before:content-[''] before:absolute before:inset-0 before:rounded-xl before:shadow-[0_0_0_1.5px_var(--border-chalk)] before:pointer-events-none before:opacity-[var(--chalk-rough-opacity)] hover:before:shadow-[0_0_0_2px_var(--accent-primary),var(--chalk-glow)] transition-all disabled:opacity-50"
          >
            <div className="flex items-center gap-1.5 justify-center">
              <Cpu className="h-4 w-4 text-ink-secondary" />
              <span className="text-xs font-medium text-ink-primary">Modell</span>
              <span className="text-ink-tertiary">›</span>
            </div>
          </SelectTrigger>
          <SelectContent align="center">
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
