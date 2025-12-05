import {
  type ComponentType,
  type ReactNode,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { DEFAULT_MODEL_ID } from "@/config/modelPresets";
import type { ModelEntry } from "@/config/models";
import { useRoles } from "@/contexts/RolesContext";
import type { UIRole } from "@/data/roles";
import { useSettings } from "@/hooks/useSettings";
import { useVisualViewport } from "@/hooks/useVisualViewport";
import { Brain, Check, ChevronDown, Cpu, Feather, Send, Sparkles, User, Waves } from "@/lib/icons";
import { cn } from "@/lib/utils";
import type { DiscussionPresetKey } from "@/prompts/discussion/presets";
import { Textarea } from "@/ui/Textarea";

export interface UnifiedInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading?: boolean;
  className?: string;
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
  const PANEL_WIDTH = 260;
  const panelRef = useRef<HTMLDivElement>(null);
  const [placement, setPlacement] = useState<"bottom" | "top">("bottom");
  const [maxHeight, setMaxHeight] = useState<number | undefined>();
  const [position, setPosition] = useState<{ top?: number; bottom?: number; left: number }>({
    left: 0,
  });

  useOutsideClose(panelRef, onClose, open);

  useEffect(() => {
    if (!open) return undefined;

    const updatePlacement = () => {
      const anchor = anchorRef.current;
      if (!anchor) return;

      const rect = anchor.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const horizontalPadding = 12;
      const spaceBelow = viewportHeight - rect.bottom - 12;
      const spaceAbove = rect.top - 12;
      const shouldPlaceBottom = spaceBelow >= spaceAbove;
      setPlacement(shouldPlaceBottom ? "bottom" : "top");
      const availableSpace = shouldPlaceBottom ? spaceBelow : spaceAbove;
      setMaxHeight(Math.max(0, Math.min(availableSpace, 320)));

      const clampedLeft = Math.min(
        Math.max(rect.left, horizontalPadding),
        Math.max(horizontalPadding, viewportWidth - PANEL_WIDTH - horizontalPadding),
      );

      // Calculate fixed position
      if (shouldPlaceBottom) {
        setPosition({
          top: rect.bottom + 8,
          left: clampedLeft,
        });
      } else {
        setPosition({
          bottom: viewportHeight - rect.top + 8,
          left: clampedLeft,
        });
      }
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

  return createPortal(
    <div
      ref={panelRef}
      className={cn(
        "dropdown-appear fixed z-popover w-[260px] rounded-2xl border-2 border-[var(--border-chalk-strong)] bg-[rgba(26,28,32,0.98)] p-3 text-text-primary shadow-[0_24px_56px_rgba(0,0,0,0.65),var(--shadow-slate-soft)] backdrop-blur-xl",
        placement === "bottom" ? "origin-top-left" : "origin-bottom-left",
      )}
      style={{
        maxHeight: maxHeight ? `${maxHeight}px` : undefined,
        top: position.top !== undefined ? `${position.top}px` : undefined,
        bottom: position.bottom !== undefined ? `${position.bottom}px` : undefined,
        left: `${position.left}px`,
      }}
    >
      <div className="max-h-full space-y-1 overflow-y-auto no-scrollbar">{children}</div>
    </div>,
    document.body,
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
      className={cn(
        "group flex h-11 w-full items-center justify-between rounded-lg px-3 text-[14px] leading-[1.2] text-text-primary transition-all duration-150 hover:bg-[rgba(255,255,255,0.08)] hover:shadow-[inset_0_0_12px_rgba(243,214,138,0.08)]",
        selected && "bg-[rgba(243,214,138,0.06)] shadow-[inset_0_0_12px_rgba(243,214,138,0.12)]",
      )}
    >
      <div className="flex min-w-0 items-center gap-3 truncate">
        {Icon ? (
          <Icon
            className={cn(
              "h-4 w-4 stroke-[1.5] transition-colors",
              selected ? "text-accent-primary" : "text-ink-tertiary group-hover:text-ink-secondary",
            )}
          />
        ) : null}
        <span className="truncate">{option.label}</span>
      </div>
      {selected ? <Check className="h-4 w-4 text-accent-primary" /> : null}
    </button>
  );
}

export function UnifiedInputBar({
  value,
  onChange,
  onSend,
  isLoading = false,
  className,
  models,
  modelsLoading,
  modelsError,
  onRefreshModels,
}: UnifiedInputBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const viewport = useVisualViewport();
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

  // Auto-resize logic
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 36), 160);
      textarea.style.height = `${newHeight}px`;
    }
  }, [value]);

  // Ensure input visibility when keyboard opens
  useEffect(() => {
    if (viewport.isKeyboardOpen && textareaRef.current) {
      const timer = setTimeout(() => {
        textareaRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest",
        });
      }, 50);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [viewport.isKeyboardOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        onSend();
      }
    }
  };

  const hasActiveRole = activeRole !== null;
  const hasCustomStyle = settings.discussionPreset !== "locker_neugierig";
  const hasCustomCreativity = (settings.creativity ?? 45) !== 45;
  const hasCustomModel = Boolean(
    settings.preferredModelId && settings.preferredModelId !== DEFAULT_MODEL_ID,
  );

  return (
    <div
      ref={containerRef}
      className={cn("w-full max-w-3xl mx-auto transition-[padding] px-3 sm:px-4", className)}
      style={{
        paddingBottom:
          "calc(max(var(--keyboard-offset, 0px), env(safe-area-inset-bottom, 0px)) + 0.5rem)",
      }}
    >
      {/* Unified Chat Bar Container */}
      <div className="rounded-2xl border-2 border-[var(--border-chalk-strong)] bg-elevated/95 backdrop-blur-lg shadow-lg ring-1 ring-accent/10 p-3.5">
        {/* Input Row */}
        <div className="flex items-end gap-2.5 mb-3">
          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Formuliere deine Frage…"
              aria-label="Nachricht eingeben"
              className="input-chalk w-full min-h-[42px] max-h-[160px] resize-none rounded-xl bg-pill/50 border border-white/5 px-3.5 py-2.5 text-[14px] shadow-inner placeholder:text-muted focus:bg-pill focus:border-accent/40"
              rows={1}
              data-testid="composer-input"
            />
          </div>

          <div className="flex-shrink-0">
            <button
              onClick={onSend}
              disabled={!value.trim() || isLoading}
              className={cn(
                "h-[42px] w-[42px] flex items-center justify-center rounded-xl border-2 border-accent/75 bg-accent text-[var(--ink-on-accent)] shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all hover:translate-y-[-1px] hover:shadow-[0_8px_20px_color-mix(in_srgb,var(--accent-primary)_30%,transparent)] hover:scale-105",
                !value.trim() && "opacity-40 cursor-not-allowed",
              )}
              aria-label="Senden"
            >
              <Send className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>

        {/* Dropdown Chips Row - Horizontal Scroll on Mobile */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
          {/* Rolle */}
          <div className="relative flex-shrink-0">
            <button
              type="button"
              onClick={() => toggleDropdown("role")}
              ref={triggerRefs.role}
              className={cn(
                "h-9 px-3 flex items-center gap-2 rounded-full border border-white/10 bg-pill text-[13px] text-text-secondary shadow-sm backdrop-blur-sm transition-all duration-150",
                "hover:border-accent/40 hover:bg-pill/80 hover:shadow-md",
                (openDropdown === "role" || hasActiveRole) &&
                  "border-accent/75 text-text-primary shadow-md bg-pill ring-1 ring-accent/20",
              )}
            >
              {hasActiveRole ? (
                <span
                  className="h-[6px] w-[6px] rounded-full bg-[var(--accent-primary)] shadow-[0_0_6px_rgba(243,214,138,0.6),0_0_0_4px_rgba(243,214,138,0.2)]"
                  aria-hidden
                />
              ) : null}
              <User className="h-4 w-4 stroke-[1.5]" />
              <span className="whitespace-nowrap font-medium">Rolle</span>
              <ChevronDown className="h-3 w-3 stroke-[1.75] text-ink-tertiary" />
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
          <div className="relative flex-shrink-0">
            <button
              type="button"
              onClick={() => toggleDropdown("style")}
              ref={triggerRefs.style}
              className={cn(
                "h-9 px-3 flex items-center gap-2 rounded-full border border-white/10 bg-pill text-[13px] text-text-secondary shadow-sm backdrop-blur-sm transition-all duration-150",
                "hover:border-accent/40 hover:bg-pill/80 hover:shadow-md",
                (openDropdown === "style" || hasCustomStyle) &&
                  "border-accent/75 text-text-primary shadow-md bg-pill ring-1 ring-accent/20",
              )}
            >
              {hasCustomStyle ? (
                <span
                  className="h-[6px] w-[6px] rounded-full bg-[var(--accent-primary)] shadow-[0_0_6px_rgba(243,214,138,0.6),0_0_0_4px_rgba(243,214,138,0.2)]"
                  aria-hidden
                />
              ) : null}
              <Feather className="h-4 w-4 stroke-[1.5]" />
              <span className="whitespace-nowrap font-medium">Stil</span>
              <ChevronDown className="h-3 w-3 stroke-[1.75] text-ink-tertiary" />
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

          {/* Kreativität */}
          <div className="relative flex-shrink-0">
            <button
              type="button"
              onClick={() => toggleDropdown("creativity")}
              ref={triggerRefs.creativity}
              className={cn(
                "h-9 px-3 flex items-center gap-2 rounded-full border border-white/10 bg-pill text-[13px] text-text-secondary shadow-sm backdrop-blur-sm transition-all duration-150",
                "hover:border-accent/40 hover:bg-pill/80 hover:shadow-md",
                (openDropdown === "creativity" || hasCustomCreativity) &&
                  "border-accent/75 text-text-primary shadow-md bg-pill ring-1 ring-accent/20",
              )}
            >
              {hasCustomCreativity ? (
                <span
                  className="h-[6px] w-[6px] rounded-full bg-[var(--accent-primary)] shadow-[0_0_6px_rgba(243,214,138,0.6),0_0_0_4px_rgba(243,214,138,0.2)]"
                  aria-hidden
                />
              ) : null}
              <Brain className="h-4 w-4 stroke-[1.5]" />
              <span className="whitespace-nowrap font-medium">Kreativ</span>
              <ChevronDown className="h-3 w-3 stroke-[1.75] text-ink-tertiary" />
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
          <div className="relative flex-shrink-0">
            <button
              type="button"
              onClick={() => toggleDropdown("model")}
              ref={triggerRefs.model}
              className={cn(
                "h-9 px-3 flex items-center gap-2 rounded-full border border-white/10 bg-pill text-[13px] text-text-secondary shadow-sm backdrop-blur-sm transition-all duration-150",
                "hover:border-accent/40 hover:bg-pill/80 hover:shadow-md",
                (openDropdown === "model" || hasCustomModel) &&
                  "border-accent/75 text-text-primary shadow-md bg-pill ring-1 ring-accent/20",
              )}
            >
              {hasCustomModel ? (
                <span
                  className="h-[6px] w-[6px] rounded-full bg-[var(--accent-primary)] shadow-[0_0_6px_rgba(243,214,138,0.6),0_0_0_4px_rgba(243,214,138,0.2)]"
                  aria-hidden
                />
              ) : null}
              <Cpu className="h-4 w-4 stroke-[1.5]" />
              <span className="whitespace-nowrap font-medium">Modell</span>
              <ChevronDown className="h-3 w-3 stroke-[1.75] text-ink-tertiary" />
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
  );
}
