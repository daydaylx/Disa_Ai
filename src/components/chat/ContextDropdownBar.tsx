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
import { Brain, Check, ChevronDown, Cpu, Feather, Sparkles, User, Waves } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { DiscussionPresetKey } from "@/prompts/discussion/presets";

interface ContextDropdownBarProps {
  models: ModelEntry[] | null;
  modelsLoading?: boolean;
  modelsError?: string | null;
  onRefreshModels?: () => void;
}

type DropdownKey = "role" | "style" | "creativity" | "model" | null;

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
        {Icon ? <Icon className="h-4 w-4 text-ink-tertiary stroke-[1.5]" /> : null}
        <span className="truncate">{option.label}</span>
      </div>
      {selected ? <Check className="h-4 w-4 text-text-primary" /> : null}
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
  const { settings, setCreativity, setDiscussionPreset, setPreferredModel } = useSettings();

  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRefs = {
    role: useRef<HTMLButtonElement>(null),
    style: useRef<HTMLButtonElement>(null),
    creativity: useRef<HTMLButtonElement>(null),
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

  return (
    <>
      <div className="mx-auto w-full max-w-3xl px-3 pb-3 sm:px-4">
        <div
          ref={containerRef}
          className="flex w-full flex-wrap items-center justify-between gap-2"
        >
          <div className="flex flex-wrap items-center gap-2">
            {/* Rolle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown("role")}
                ref={triggerRefs.role}
                className={cn(
                  "chalk-pill flex items-center gap-2",
                  openDropdown === "role" && "active",
                )}
              >
                <User className="h-4 w-4 stroke-[1.5]" />
                Rolle
                <ChevronDown className="h-3.5 w-3.5 stroke-[1.5] text-ink-tertiary" />
              </button>
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

            {/* Stil */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown("style")}
                ref={triggerRefs.style}
                className={cn(
                  "chalk-pill flex items-center gap-2",
                  openDropdown === "style" && "active",
                )}
              >
                <Feather className="h-4 w-4 stroke-[1.5]" />
                Stil
                <ChevronDown className="h-3.5 w-3.5 stroke-[1.5] text-ink-tertiary" />
              </button>
              <DropdownPanel
                open={openDropdown === "style"}
                anchorRef={triggerRefs.style}
                onClose={() => setOpenDropdown(null)}
              >
                {styleOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = settings.discussionPreset === option.id;
                  return (
                    <DropdownItem<DiscussionPresetKey>
                      key={option.id}
                      option={{ id: option.id, label: option.label, icon: Icon }}
                      selected={isSelected}
                      onSelect={(value) => {
                        setDiscussionPreset(value);
                        setOpenDropdown(null);
                      }}
                    />
                  );
                })}
              </DropdownPanel>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Kreativität */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown("creativity")}
                ref={triggerRefs.creativity}
                className={cn(
                  "chalk-pill flex items-center gap-2",
                  openDropdown === "creativity" && "active",
                )}
              >
                <Brain className="h-4 w-4 stroke-[1.5]" />
                Kreativ
                <ChevronDown className="h-3.5 w-3.5 stroke-[1.5] text-ink-tertiary" />
              </button>
              <DropdownPanel
                open={openDropdown === "creativity"}
                anchorRef={triggerRefs.creativity}
                onClose={() => setOpenDropdown(null)}
              >
                {creativityOptions.map((option) => {
                  const isSelected = (settings.creativity ?? 45) === option.id;
                  return (
                    <DropdownItem<number>
                      key={option.id}
                      option={{ id: option.id, label: option.label, icon: Brain }}
                      selected={isSelected}
                      onSelect={(value) => {
                        setCreativity(value);
                        setOpenDropdown(null);
                      }}
                    />
                  );
                })}
              </DropdownPanel>
            </div>

            {/* Modell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown("model")}
                ref={triggerRefs.model}
                className={cn(
                  "chalk-pill flex items-center gap-2",
                  openDropdown === "model" && "active",
                )}
              >
                <Cpu className="h-4 w-4 stroke-[1.5]" />
                Modell
                <ChevronDown className="h-3.5 w-3.5 stroke-[1.5] text-ink-tertiary" />
              </button>
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
          </div>
        </div>
      </div>
    </>
  );
}
