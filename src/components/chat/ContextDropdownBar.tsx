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
        "dropdown-appear absolute z-popover w-[260px] origin-top-left rounded-[16px] border border-white/5 bg-[rgba(20,20,20,0.95)] p-3 text-[#F2F2F5] shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur",
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
      className="group flex h-11 w-full items-center justify-between rounded-lg px-3 text-[14px] leading-[1.2] text-[#F2F2F5] transition-colors duration-150 hover:bg-[rgba(255,255,255,0.08)]"
    >
      <div className="flex min-w-0 items-center gap-3 truncate">
        {Icon ? <Icon className="h-4 w-4 text-[#A3A3AB]" /> : null}
        <span className="truncate">{option.label}</span>
      </div>
      {selected ? <Check className="h-4 w-4 text-[#F2F2F5]" /> : null}
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
        "flex h-10 items-center gap-2 rounded-full border border-white/5 bg-[rgba(28,28,28,0.92)] px-3 text-[13px] font-medium text-[#F2F2F5] transition-colors duration-150 hover:bg-[rgba(255,255,255,0.05)]",
        open && "shadow-[0_0_0_1px_rgba(111,108,255,0.35)]",
      )}
      aria-expanded={open}
    >
      {Icon ? <Icon className="h-4 w-4 text-[#A3A3AB]" /> : null}
      <span className="truncate">{label}</span>
      <ChevronDown className="h-4 w-4 text-[#A3A3AB]" />
    </button>
  );
}

export function ContextDropdownBar({ models, modelsLoading }: ContextDropdownBarProps) {
  const { roles, activeRole, setActiveRole } = useRoles();
  const {
    settings,
    setCreativity,
    setDiscussionPreset,
    setDiscussionMaxSentences,
    setPreferredModel,
  } = useSettings();

  const [openDropdown, setOpenDropdown] = useState<DropdownKey>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRefs = {
    role: useRef<HTMLButtonElement>(null),
    style: useRef<HTMLButtonElement>(null),
    creativity: useRef<HTMLButtonElement>(null),
    context: useRef<HTMLButtonElement>(null),
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

  const activeStyleLabel =
    styleOptions.find((option) => option.id === settings.discussionPreset)?.label ?? "Stil";

  const activeCreativityLabel =
    creativityOptions.find((option) => option.id === settings.creativity)?.label ?? "Kreativität";

  const activeContextLabel =
    contextOptions.find((option) => option.id === settings.discussionMaxSentences)?.label ??
    "Kontext";

  const activeModelLabel = useMemo(() => {
    if (modelsLoading) return "Modelle laden";
    const activeModel = modelOptions.find((model) => model.id === settings.preferredModelId);
    return activeModel?.label ?? settings.preferredModelId ?? "Modell";
  }, [modelOptions, modelsLoading, settings.preferredModelId]);

  return (
    <div className="mx-auto w-full max-w-3xl px-3 pb-3 sm:px-4">
      <div ref={containerRef} className="flex flex-wrap gap-2">
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

        <div className="relative">
          <TriggerBadge
            innerRef={triggerRefs.style}
            label={activeStyleLabel}
            icon={Feather}
            open={openDropdown === "style"}
            onClick={() => toggleDropdown("style")}
          />
          <DropdownPanel
            open={openDropdown === "style"}
            anchorRef={triggerRefs.style}
            onClose={() => setOpenDropdown(null)}
          >
            {styleOptions.map((option) => (
              <DropdownItem<DiscussionPresetKey>
                key={option.id}
                option={option}
                selected={settings.discussionPreset === option.id}
                onSelect={(value) => {
                  setDiscussionPreset(value);
                  setOpenDropdown(null);
                }}
              />
            ))}
          </DropdownPanel>
        </div>

        <div className="relative">
          <TriggerBadge
            innerRef={triggerRefs.creativity}
            label={activeCreativityLabel}
            icon={Sparkles}
            open={openDropdown === "creativity"}
            onClick={() => toggleDropdown("creativity")}
          />
          <DropdownPanel
            open={openDropdown === "creativity"}
            anchorRef={triggerRefs.creativity}
            onClose={() => setOpenDropdown(null)}
          >
            {creativityOptions.map((option) => (
              <DropdownItem<number>
                key={option.id}
                option={option}
                selected={(settings.creativity ?? 45) === option.id}
                onSelect={(value) => {
                  setCreativity(value);
                  setOpenDropdown(null);
                }}
              />
            ))}
          </DropdownPanel>
        </div>

        <div className="relative">
          <TriggerBadge
            innerRef={triggerRefs.context}
            label={activeContextLabel}
            icon={Brain}
            open={openDropdown === "context"}
            onClick={() => toggleDropdown("context")}
          />
          <DropdownPanel
            open={openDropdown === "context"}
            anchorRef={triggerRefs.context}
            onClose={() => setOpenDropdown(null)}
          >
            {contextOptions.map((option) => (
              <DropdownItem<number>
                key={option.id}
                option={option}
                selected={settings.discussionMaxSentences === option.id}
                onSelect={(value) => {
                  setDiscussionMaxSentences(value);
                  setOpenDropdown(null);
                }}
              />
            ))}
          </DropdownPanel>
        </div>

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
              <div className="flex h-11 items-center rounded-lg px-3 text-sm text-[#A3A3AB]">
                Modelle werden geladen...
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
              <div className="flex h-11 items-center rounded-lg px-3 text-sm text-[#A3A3AB]">
                Keine Modelle verfügbar
              </div>
            )}
          </DropdownPanel>
        </div>
      </div>
    </div>
  );
}
