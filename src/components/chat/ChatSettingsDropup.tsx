import { useEffect, useRef, useState } from "react";

import type { ModelEntry } from "@/config/models";
import { loadModelCatalog } from "@/config/models";
import { useRoles } from "@/contexts/RolesContext";
import type { UIRole } from "@/data/roles";
import { useSettings } from "@/hooks/useSettings";
import { Check, SlidersHorizontal } from "@/lib/icons";
import { cn } from "@/lib/utils";

// Simple creative styles list
const CREATIVE_STYLES = [
  { id: 10, label: "Präzise" },
  { id: 45, label: "Ausgewogen" },
  { id: 80, label: "Kreativ" },
];

function useClickOutside(ref: React.RefObject<HTMLElement>, handler: () => void) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

export function ChatSettingsDropup() {
  const { settings, setPreferredModel, setCreativity } = useSettings();
  const { roles, activeRole, setActiveRole } = useRoles();
  const [models, setModels] = useState<ModelEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setIsOpen(false));

  // Load models
  useEffect(() => {
    loadModelCatalog().then(setModels).catch(console.error);
  }, []);

  const handleModelSelect = (modelId: string) => {
    setPreferredModel(modelId);
    setIsOpen(false);
  };

  const handleRoleSelect = (role: UIRole | null) => {
    setActiveRole(role);
    setIsOpen(false);
  };

  const handleStyleSelect = (value: number) => {
    setCreativity(value);
    setIsOpen(false);
  };

  const activeModelLabel =
    models.find((m) => m.id === settings.preferredModelId)?.label ?? "Modell";
  const activeRoleLabel = activeRole?.name ?? "Keine Rolle";
  const activeStyleLabel =
    CREATIVE_STYLES.find((s) => s.id === settings.creativity)?.label ?? "Ausgewogen";

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
          isOpen
            ? "bg-accent/10 text-accent"
            : "text-ink-secondary hover:bg-black/5 hover:text-ink-primary",
        )}
        aria-label="Chat Einstellungen"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <SlidersHorizontal className="h-5 w-5" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="absolute bottom-12 left-0 z-popover mt-2 w-72 origin-bottom-left divide-y divide-border-ink/10 rounded-xl bg-bg-page shadow-xl ring-1 ring-black/5 focus:outline-none animate-in fade-in zoom-in-95 duration-100">
          {/* Header Status - Optional Visual Confirmation */}
          <div className="px-4 py-2 bg-surface-2 rounded-t-xl border-b border-border-ink/5">
            <div className="text-[10px] uppercase tracking-wider text-ink-tertiary font-semibold flex justify-between">
              <span>{activeModelLabel}</span>
              <span>{activeStyleLabel}</span>
            </div>
          </div>

          {/* Models Section */}
          <div className="p-1">
            <div className="px-3 py-1.5 text-xs font-semibold text-ink-tertiary uppercase tracking-wider">
              Modell
            </div>
            <div className="max-h-40 overflow-y-auto scrollbar-thin">
              {models.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelSelect(model.id)}
                  className={cn(
                    "group flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                    settings.preferredModelId === model.id
                      ? "bg-accent/10 text-accent font-medium"
                      : "text-ink-primary hover:bg-surface-2",
                  )}
                >
                  <span className="truncate mr-2">{model.label}</span>
                  {settings.preferredModelId === model.id && (
                    <Check className="h-4 w-4 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Roles Section */}
          <div className="p-1">
            <div className="px-3 py-1.5 text-xs font-semibold text-ink-tertiary uppercase tracking-wider">
              Rolle ({activeRoleLabel})
            </div>
            <div className="max-h-40 overflow-y-auto scrollbar-thin">
              <button
                onClick={() => handleRoleSelect(null)}
                className={cn(
                  "group flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                  activeRole === null
                    ? "bg-accent/10 text-accent font-medium"
                    : "text-ink-primary hover:bg-surface-2",
                )}
              >
                Standard (Keine)
                {activeRole === null && <Check className="h-4 w-4" />}
              </button>
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  className={cn(
                    "group flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                    activeRole?.id === role.id
                      ? "bg-accent/10 text-accent font-medium"
                      : "text-ink-primary hover:bg-surface-2",
                  )}
                >
                  <span className="truncate mr-2">{role.name}</span>
                  {activeRole?.id === role.id && <Check className="h-4 w-4 flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Style Section */}
          <div className="p-1">
            <div className="px-3 py-1.5 text-xs font-semibold text-ink-tertiary uppercase tracking-wider">
              Stil
            </div>
            {CREATIVE_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => handleStyleSelect(style.id)}
                className={cn(
                  "group flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                  (settings.creativity ?? 45) === style.id
                    ? "bg-accent/10 text-accent font-medium"
                    : "text-ink-primary hover:bg-surface-2",
                )}
              >
                {style.label}
                {(settings.creativity ?? 45) === style.id && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
