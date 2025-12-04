import {
  type ComponentType,
  type ReactNode,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { ModelEntry } from "@/config/models";
import { useRoles } from "@/contexts/RolesContext";
import type { UIRole } from "@/data/roles";
import { useSettings } from "@/hooks/useSettings";
import { Brain, Check, ChevronDown, Cpu, Feather, SlidersHorizontal, Sparkles, User, Waves } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { DiscussionPresetKey } from "@/prompts/discussion/presets";

interface ContextDropdownBarProps {
  models: ModelEntry[] | null;
  modelsLoading?: boolean;
  modelsError?: string | null;
  onRefreshModels?: () => void;
}

type DropdownKey = "role" | "style" | "creativity" | "context" | "model" | null;

interface DropdownOption<T> {
  id: T;
  label: string;
  icon?: ComponentType<{ className?: string }>;
}

const styleOptions: DropdownOption<DiscussionPresetKey>[] = [
  { id: "nuechtern_pragmatisch", label: "Sachlich", icon: Feather },
  { id: "freundlich_offen", label: "Ausgewogen", icon: Waves },
  { id: "locker_neugierig", label: "Locker", icon: Sparkles },
  { id: "sarkastisch_witzig", label: "Kreativ", icon: Sparkles },
  { id: "analytisch_detailliert", label: "Roleplay", icon: User },
];

const creativityOptions: DropdownOption<number>[] = [
  { id: 5, label: "Sehr niedrig", icon: Brain },
  { id: 20, label: "Niedrig", icon: Brain },
  { id: 45, label: "Mittel", icon: Brain },
  { id: 70, label: "Hoch", icon: Brain },
  { id: 95, label: "Extrem", icon: Brain },
];

const contextOptions: DropdownOption<number>[] = [
  { id: 5, label: "Minimal", icon: Feather },
  { id: 6, label: "Kurz", icon: Feather },
  { id: 8, label: "Normal", icon: Feather },
  { id: 9, label: "Lang", icon: Feather },
  { id: 10, label: "Maximal", icon: Feather },
];

const CURATED_ROLE_NAMES = ["Mentor", "Assistent", "Humorvoll", "Experte"];

function useOutsideClose(ref: RefObject<HTMLElement>, onClose: () => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return undefined;

    const handleClick = (event: Event) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      onClose();
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [enabled, onClose, ref]);
}

function DropdownPanel({
  open,
  anchorRef,
  children,
  onClose,
}: {
  open: boolean;
  anchorRef: RefObject<HTMLElement>;
  children: ReactNode;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<"bottom" | "top">("bottom");
  const [maxHeight, setMaxHeight] = useState<number | undefined>();

  useOutsideClose(panelRef, onClose, open);

  useEffect(() => {
    if (!open) return undefined;

    const updatePlacement = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;

      const rect = anchor.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom - 12;
      const spaceAbove = rect.top - 12;
      const shouldPlaceBottom = spaceBelow >= spaceAbove;
      setPlacement(shouldPlaceBottom ? "bottom" : "top");
      const availableSpace = shouldPlaceBottom ? spaceBelow : spaceAbove;
      setMaxHeight(Math.max(0, Math.min(availableSpace, 320)));
    };

    updatePlacement();
    window.addEventListener("resize", updatePlacement);
    window.addEventListener("scroll", updatePlacement, true);
    return () => {
      window.removeEventListener("resize", updatePlacement);
      window.removeEventListener("scroll", updatePlacement, true);
    };
  }, [anchorRef, open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      ref={panelRef}
      className={cn(
        "dropdown-appear absolute z-popover w-[260px] origin-top-left rounded-2xl border border-[var(--border-chalk)] bg-[rgba(19,19,20,0.96)] p-3 text-text-primary shadow-[0_18px_40px_rgba(0,0,0,0.45)] backdrop-blur",
        placement === "bottom" ? "top-full mt-2" : "bottom-full mb-2",
      )}
      style={{ maxHeight: maxHeight ? `${maxHeight}px` : undefined }}
    >
      <div className="max-h-full space-y-1 overflow-y-auto no-scrollbar">{children}</div>
    </div>
  );
}

function DropdownItem<T>({
  option,
  selected,
  onSelect,
}: {
  option: DropdownOption<T>;
  selected: boolean;
  onSelect: (value: T) => void;
}) {
  const Icon = option.icon;
  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      className="group flex h-11 w-full items-center justify-between rounded-lg px-3 text-[14px] leading-[1.2] text-text-primary transition-colors duration-150 hover:bg-[rgba(255,255,255,0.05)]"
    >
      <div className="flex min-w-0 items-center gap-3 truncate">
        {Icon ? <Icon className="h-4 w-4 text-ink-tertiary" /> : null}
        <span className="truncate">{option.label}</span>
      </div>
      {selected ? <Check className="h-4 w-4 text-text-primary" /> : null}
    </button>
  );
}

function TriggerBadge({
  label,
  icon: Icon,
  open,
  onClick,
  innerRef,
}: {
  label: string;
  icon?: ComponentType<{ className?: string }>;
  open: boolean;
  onClick: () => void;
  innerRef: RefObject<HTMLButtonElement>;
}) {
  return (
    <button
      type="button"
      ref={innerRef}
      onClick={onClick}
      className={cn(
        "chalk-focus flex min-h-[44px] items-center gap-2 rounded-full border chalk-border bg-[rgba(255,255,255,0.02)] px-3 py-2 text-[13px] font-medium text-text-primary transition-all duration-150 hover:chalk-border-strong hover:bg-[rgba(255,255,255,0.06)]",
        open && "chalk-border-strong shadow-[var(--chalk-glow)]",
      )}
      aria-expanded={open}
    >
      {Icon ? <Icon className="h-4 w-4 text-ink-tertiary" /> : null}
      <span className="chalk-text truncate">{label}</span>
      <ChevronDown className="h-4 w-4 text-ink-tertiary" />
    </button>
  );
}

export function ContextDropdownBar({
  models,
  modelsLoading,
  modelsError,
  onRefreshModels,
}: ContextDropdownBarProps) {
  const { roles, activeRole, setActiveRole } = useRoles();
  const {
    settings,
    setCreativity,
    setDiscussionPreset,
    setDiscussionMaxSentences,
    setPreferredModel,
  } = useSettings();

  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRefs = {
    role: useRef<HTMLButtonElement>(null),
    model: useRef<HTMLButtonElement>(null),
  };

  useOutsideClose(containerRef, () => setOpenDropdown(null), openDropdown !== null);

  const toggleDropdown = (key: DropdownKey) => {
    setOpenDropdown((current) => (current === key ? null : key));
  };

  const modelOptions = useMemo(() => models ?? [], [models]);

  const curatedRoles = useMemo(
    () =>
      CURATED_ROLE_NAMES.map((name) =>
        roles.find((role) => role.name.toLowerCase().includes(name.toLowerCase())),
      ).filter((role): role is UIRole => Boolean(role)),
    [roles],
  );
  const remainingRoles = useMemo(
    () => roles.filter((role) => !curatedRoles.some((curated) => curated.id === role.id)),
    [curatedRoles, roles],
  );

  const activeModelLabel = useMemo(() => {
    if (modelsLoading) return "Modelle laden...";
    const activeModel = modelOptions.find((model) => model.id === settings.preferredModelId);
    const modelName = activeModel?.label ?? settings.preferredModelId;
    return modelName ? `${modelName}` : "Modell";
  }, [modelOptions, modelsLoading, settings.preferredModelId]);

  return (
    <>
      <div className="mx-auto w-full max-w-3xl px-3 pb-3 sm:px-4">
        <div ref={containerRef} className="flex items-center gap-2">
          {/* Rolle */}
          <div className="relative">
            <TriggerBadge
              innerRef={triggerRefs.role}
              label={activeRole?.name ?? "Rolle"}
              icon={User}
              open={openDropdown === "role"}
              onClick={() => toggleDropdown("role")}
            />
            <DropdownPanel
              open={openDropdown === "role"}
              anchorRef={triggerRefs.role}
              onClose={() => setOpenDropdown(null)}
            >
              <DropdownItem<UIRole | null>
                option={{ id: null, label: "Standard", icon: User }}
                selected={activeRole === null}
                onSelect={() => {
                  setActiveRole(null);
                  setOpenDropdown(null);
                }}
              />
              {curatedRoles.length > 0 && (
                <>
                  <div className="my-1 h-px w-full bg-[rgba(255,255,255,0.06)]" />
                  {curatedRoles.map((role) => (
                    <DropdownItem<UIRole>
                      key={role.id}
                      option={{ id: role, label: role.name, icon: User }}
                      selected={activeRole?.id === role.id}
                      onSelect={(value) => {
                        setActiveRole(value);
                        setOpenDropdown(null);
                      }}
                    />
                  ))}
                </>
              )}
              {remainingRoles.length > 0 && (
                <>
                  <div className="my-1 h-px w-full bg-[rgba(255,255,255,0.06)]" />
                  {remainingRoles.map((role) => (
                    <DropdownItem<UIRole>
                      key={role.id}
                      option={{ id: role, label: role.name, icon: User }}
                      selected={activeRole?.id === role.id}
                      onSelect={(value) => {
                        setActiveRole(value);
                        setOpenDropdown(null);
                      }}
                    />
                  ))}
                </>
              )}
            </DropdownPanel>
          </div>

          {/* Modell */}
          <div className="relative">
            <TriggerBadge
              innerRef={triggerRefs.model}
              label={activeModelLabel}
              icon={Cpu}
              open={openDropdown === "model"}
              onClick={() => toggleDropdown("model")}
            />
            <DropdownPanel
              open={openDropdown === "model"}
              anchorRef={triggerRefs.model}
              onClose={() => setOpenDropdown(null)}
            >
              {modelsLoading ? (
                <div className="flex h-11 items-center justify-center rounded-lg px-3 text-sm text-[#A3A3AB]">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#A3A3AB] border-t-transparent" />
                    Modelle werden geladen...
                  </div>
                </div>
              ) : modelsError ? (
                <div className="flex flex-col gap-2 rounded-lg px-3 py-2">
                  <div className="text-sm text-color-error">{modelsError}</div>
                  {onRefreshModels && (
                    <button
                      type="button"
                      onClick={() => {
                        onRefreshModels();
                      }}
                      className="flex h-9 items-center justify-center gap-2 rounded-lg bg-[rgba(255,255,255,0.05)] px-3 text-sm text-text-primary transition-colors hover:bg-[rgba(255,255,255,0.08)]"
                    >
                      <ChevronDown className="h-4 w-4 rotate-180" />
                      Nochmal versuchen
                    </button>
                  )}
                </div>
              ) : modelOptions.length > 0 ? (
                modelOptions.map((model) => (
                  <DropdownItem<string>
                    key={model.id}
                    option={{ id: model.id, label: model.label ?? model.id, icon: Cpu }}
                    selected={settings.preferredModelId === model.id}
                    onSelect={(value) => {
                      setPreferredModel(value);
                      setOpenDropdown(null);
                    }}
                  />
                ))
              ) : (
                <div className="flex flex-col gap-2 rounded-lg px-3 py-2">
                  <div className="text-sm text-[#A3A3AB]">Keine Modelle verfügbar</div>
                  {onRefreshModels && (
                    <button
                      type="button"
                      onClick={() => {
                        onRefreshModels();
                      }}
                      className="flex h-9 items-center justify-center gap-2 rounded-lg bg-[rgba(255,255,255,0.05)] px-3 text-sm text-text-primary transition-colors hover:bg-[rgba(255,255,255,0.08)]"
                    >
                      <ChevronDown className="h-4 w-4 rotate-180" />
                      Nochmal versuchen
                    </button>
                  )}
                </div>
              )}
            </DropdownPanel>
          </div>

          {/* Erweitert Button */}
          <button
            type="button"
            onClick={() => setIsAdvancedOpen(true)}
            className="ml-auto flex min-h-[44px] items-center gap-2 rounded-full border border-[var(--border-chalk)] bg-[rgba(255,255,255,0.02)] px-3 text-[13px] font-medium text-text-primary transition-colors duration-150 hover:border-[var(--border-chalk-strong)] hover:bg-[rgba(255,255,255,0.05)]"
            aria-label="Erweiterte Einstellungen"
          >
            <SlidersHorizontal className="h-4 w-4 text-ink-tertiary" />
            <span className="hidden sm:inline">Erweitert</span>
          </button>
        </div>
      </div>

      {/* Advanced Settings Bottom Sheet */}
      {isAdvancedOpen && (
        <AdvancedSettingsSheet
          isOpen={isAdvancedOpen}
          onClose={() => setIsAdvancedOpen(false)}
          settings={settings}
          onStyleChange={setDiscussionPreset}
          onCreativityChange={setCreativity}
          onContextChange={setDiscussionMaxSentences}
        />
      )}
    </>
  );
}

// Advanced Settings Bottom Sheet Component
interface AdvancedSettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReturnType<typeof useSettings>["settings"];
  onStyleChange: (value: DiscussionPresetKey) => void;
  onCreativityChange: (value: number) => void;
  onContextChange: (value: number) => void;
}

function AdvancedSettingsSheet({
  isOpen,
  onClose,
  settings,
  onStyleChange,
  onCreativityChange,
  onContextChange,
}: AdvancedSettingsSheetProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[var(--z-bottom-sheet)] flex items-end justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-t-2xl border-t border-[var(--border-chalk)] bg-[rgba(19,19,20,0.98)] p-6 shadow-[0_-8px_32px_rgba(0,0,0,0.5)] backdrop-blur animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Erweiterte Einstellungen</h2>
          <button
            onClick={onClose}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-[rgba(255,255,255,0.05)] hover:text-ink-primary"
            aria-label="Schließen"
          >
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>

        {/* Settings */}
        <div className="space-y-6">
          {/* Stil */}
          <div>
            <label className="mb-2 block text-sm font-medium text-ink-secondary">Stil</label>
            <div className="grid grid-cols-2 gap-2">
              {styleOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = settings.discussionPreset === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => onStyleChange(option.id)}
                    className={cn(
                      "flex min-h-[48px] items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                      isSelected
                        ? "border-[var(--border-chalk-strong)] bg-[rgba(255,255,255,0.08)] text-text-primary"
                        : "border-[var(--border-chalk)] bg-transparent text-ink-secondary hover:border-[var(--border-chalk-strong)] hover:bg-[rgba(255,255,255,0.03)]",
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{option.label}</span>
                    {isSelected && <Check className="ml-auto h-4 w-4" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Kreativität */}
          <div>
            <label className="mb-2 block text-sm font-medium text-ink-secondary">Kreativität</label>
            <div className="space-y-1">
              {creativityOptions.map((option) => {
                const isSelected = (settings.creativity ?? 45) === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => onCreativityChange(option.id)}
                    className={cn(
                      "flex w-full min-h-[44px] items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors",
                      isSelected
                        ? "border-[var(--border-chalk-strong)] bg-[rgba(255,255,255,0.08)] text-text-primary font-medium"
                        : "border-transparent bg-transparent text-ink-secondary hover:bg-[rgba(255,255,255,0.03)]",
                    )}
                  >
                    <span>{option.label}</span>
                    {isSelected && <Check className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Kontext */}
          <div>
            <label className="mb-2 block text-sm font-medium text-ink-secondary">
              Kontextlänge
            </label>
            <div className="space-y-1">
              {contextOptions.map((option) => {
                const isSelected = settings.discussionMaxSentences === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => onContextChange(option.id)}
                    className={cn(
                      "flex w-full min-h-[44px] items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors",
                      isSelected
                        ? "border-[var(--border-chalk-strong)] bg-[rgba(255,255,255,0.08)] text-text-primary font-medium"
                        : "border-transparent bg-transparent text-ink-secondary hover:bg-[rgba(255,255,255,0.03)]",
                    )}
                  >
                    <span>{option.label}</span>
                    {isSelected && <Check className="h-4 w-4" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
