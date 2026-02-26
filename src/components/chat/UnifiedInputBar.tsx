import * as React from "react";

import { useModelCatalog } from "@/contexts/ModelCatalogContext";
import { useRoles } from "@/contexts/RolesContext";
import { useSettings } from "@/hooks/useSettings";
import { useVisualViewport } from "@/hooks/useVisualViewport";
import { MAX_PROMPT_LENGTH } from "@/lib/chat/validation";
import { Cpu, Palette, Send, Sparkles, User } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { type DiscussionPresetKey, discussionPresetOptions } from "@/prompts/discussion/presets";
import { BrandCard } from "@/ui/BrandCard";
import { Button } from "@/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/ui/Select";

export interface UnifiedInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading?: boolean;
  className?: string;
}

export function UnifiedInputBar({
  value,
  onChange,
  onSend,
  isLoading = false,
  className,
}: UnifiedInputBarProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const viewport = useVisualViewport();
  const { activeRole, setActiveRole, roles } = useRoles();
  const { models } = useModelCatalog();
  const { settings, setCreativity, setDiscussionPreset, setPreferredModel } = useSettings();

  // Auto-resize logic
  React.useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 44), 160);
      textarea.style.height = `${newHeight}px`;
    }
  }, [value]);

  // Ensure input visibility when keyboard opens
  React.useEffect(() => {
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

  const roleLabel = activeRole?.name || "Standard";

  const creativityOptions = [
    { value: "10", label: "Präzise (10%)", short: "Präzise" },
    { value: "30", label: "Klar & fokussiert (30%)", short: "Klar" },
    { value: "45", label: "Ausgewogen (45%)", short: "Ausgewogen" },
    { value: "70", label: "Kreativ (70%)", short: "Kreativ" },
    { value: "90", label: "Verspielt (90%)", short: "Verspielt" },
  ];

  const shortDiscussionLabels: Record<DiscussionPresetKey, string> = {
    locker_neugierig: "Locker",
    edgy_provokant: "Edgy",
    nuechtern_pragmatisch: "Nüchtern",
    akademisch_formell: "Akademisch",
    freundlich_offen: "Freundlich",
    analytisch_detailliert: "Analytisch",
    sarkastisch_witzig: "Sarkastisch",
    fachlich_tiefgehend: "Fachlich",
  };

  const discussionPresetLabel =
    settings.discussionPreset && shortDiscussionLabels[settings.discussionPreset]
      ? shortDiscussionLabels[settings.discussionPreset]
      : discussionPresetOptions.find((preset) => preset.key === settings.discussionPreset)?.label ||
        "Standard";

  const creativityOption = creativityOptions.find(
    (option) => option.value === String(settings.creativity),
  );
  const creativityShortLabel = creativityOption?.short || `${settings.creativity}%`;
  const [showExtraControls, setShowExtraControls] = React.useState(false);

  const selectedModel = models?.find((m) => m.id === settings.preferredModelId);
  const modelLabel =
    selectedModel?.label?.split("/").pop() || selectedModel?.id?.split("/").pop() || "Modell";

  return (
    <div className={cn("w-full", className)}>
      {/* Unified Input Card – textarea + context pills in one BrandCard */}
      <BrandCard
        variant="plain"
        padding="none"
        className={cn(
          "input-focus-animation relative border-white/14 bg-surface-1/88 shadow-[0_10px_24px_rgba(0,0,0,0.24)] transition-all backdrop-blur-sm",
        )}
        aria-label="Eingabebereich"
      >
        {/* Zone A – Typing area */}
        <div className="flex items-end gap-2 px-3 pt-3 pb-1 pr-safe-right">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Schreibe eine Nachricht..."
            className="h-11 max-h-[160px] min-h-[44px] w-full flex-1 resize-none bg-transparent px-0 py-2.5 text-[16px] leading-relaxed tracking-[0.002em] text-ink-primary placeholder:text-ink-muted focus:outline-none textarea-resize-transition"
            rows={1}
            data-testid="composer-input"
            aria-label="Nachricht eingeben"
          />

          {/* Send Button */}
          <Button
            onClick={onSend}
            disabled={!value.trim() || isLoading}
            variant="primary"
            size="icon"
            className={cn(
              "mb-0.5 h-11 w-11 flex-shrink-0 rounded-xl border border-white/10 transition-all duration-150",
              !value.trim() &&
                !isLoading &&
                "bg-surface-2/90 text-ink-tertiary shadow-none opacity-70",
              value.trim() &&
                !isLoading &&
                "bg-accent-chat text-white shadow-[0_8px_24px_rgba(139,92,246,0.36)] hover:bg-accent-chat/90",
              isLoading && "bg-accent-chat/85 text-white",
            )}
            aria-label="Senden"
          >
            {isLoading ? (
              <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className={cn("h-5 w-5", value.trim() && "ml-0.5")} />
            )}
          </Button>
        </div>

        {/* Hairline separator between typing and context zones */}
        <div className="border-t border-white/[0.09]" />

        {/* Zone B – Context pills row 1 */}
        <div className="flex w-full items-center gap-2 overflow-x-auto px-3 py-2.5 no-scrollbar">
          {/* Role Dropdown */}
          <Select
            value={activeRole?.id || "standard"}
            onValueChange={(id) => {
              if (id === "standard") {
                setActiveRole(null);
                return;
              }
              const role = roles.find((r) => r.id === id);
              if (role) setActiveRole(role);
            }}
          >
            <SelectTrigger
              aria-label="Rolle auswählen"
              className={cn(
                "animate-pill-slide-in role-badge-transition flex h-10 min-w-fit items-center justify-center gap-2 px-3.5 text-[0.78rem] font-medium leading-none tracking-[0.01em]",
                activeRole
                  ? "rounded-full border border-accent-roles/45 bg-accent-roles/10 text-ink-primary shadow-[0_0_0_1px_rgba(244,114,182,0.15)]"
                  : "rounded-full border border-white/10 bg-surface-1/55 text-ink-secondary hover:border-white/20 hover:bg-surface-1/70 hover:text-ink-primary",
              )}
            >
              <User className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="whitespace-nowrap">{roleLabel}</span>
            </SelectTrigger>
            <SelectContent className="max-h-[280px] w-64">
              <SelectItem value="standard">Standard</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* More options toggle */}
          <button
            type="button"
            onClick={() => setShowExtraControls((prev) => !prev)}
            className="flex h-10 items-center justify-center rounded-full border border-white/10 bg-surface-1/55 px-3.5 text-[0.78rem] font-medium tracking-[0.01em] text-ink-secondary transition-colors hover:border-white/20 hover:text-ink-primary"
          >
            {showExtraControls ? "Weniger Optionen" : "Mehr Optionen"}
          </button>
        </div>

        {/* Zone C – Context pills row 2 (optional) */}
        {showExtraControls && (
          <>
            <div className="border-t border-white/[0.05]" />
            <div className="flex w-full flex-wrap items-center gap-2 overflow-x-auto px-3 py-2 no-scrollbar">
              <Select
                value={settings.preferredModelId}
                onValueChange={(id) => setPreferredModel(id)}
              >
                <SelectTrigger
                  aria-label="Modell auswählen"
                  className="animate-pill-slide-in flex h-10 min-w-fit items-center justify-center gap-2 rounded-full border border-white/10 bg-surface-1/55 px-3.5 text-[0.78rem] font-medium leading-none tracking-[0.01em] text-ink-tertiary transition-colors hover:border-white/20 hover:bg-surface-1/70 hover:text-ink-secondary"
                  style={{ animationDelay: "70ms" }}
                >
                  <Cpu className="h-3.5 w-3.5 flex-shrink-0 opacity-70" />
                  <span className="whitespace-nowrap">{modelLabel}</span>
                </SelectTrigger>
                <SelectContent className="max-h-[280px] w-64">
                  {models?.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.label || model.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={settings.discussionPreset}
                onValueChange={(preset) => setDiscussionPreset(preset as DiscussionPresetKey)}
              >
                <SelectTrigger
                  aria-label="Stil auswählen"
                  className="animate-pill-slide-in flex h-10 min-w-fit items-center justify-center gap-2 rounded-full border border-white/10 bg-surface-1/55 px-3.5 text-[0.78rem] font-medium leading-none tracking-[0.01em] text-ink-tertiary transition-colors hover:border-white/20 hover:bg-surface-1/70 hover:text-ink-secondary"
                  style={{ animationDelay: "120ms" }}
                >
                  <Palette className="h-3.5 w-3.5 flex-shrink-0 opacity-70" />
                  <span className="whitespace-nowrap">{discussionPresetLabel}</span>
                </SelectTrigger>
                <SelectContent className="w-64">
                  {discussionPresetOptions.map((preset) => (
                    <SelectItem key={preset.key} value={preset.key}>
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={String(settings.creativity)}
                onValueChange={(value) => setCreativity(Number(value))}
              >
                <SelectTrigger
                  aria-label="Kreativität auswählen"
                  className="animate-pill-slide-in flex h-10 min-w-fit items-center justify-center gap-2 rounded-full border border-white/10 bg-surface-1/55 px-3.5 text-[0.78rem] font-medium leading-none tracking-[0.01em] text-ink-tertiary transition-colors hover:border-white/20 hover:bg-surface-1/70 hover:text-ink-secondary"
                  style={{ animationDelay: "170ms" }}
                >
                  <Sparkles className="h-3.5 w-3.5 flex-shrink-0 opacity-70" />
                  <span className="whitespace-nowrap">{creativityShortLabel}</span>
                </SelectTrigger>
                <SelectContent className="w-64">
                  {creativityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </BrandCard>

      {/* Character Counter – below the card */}
      {value.length > MAX_PROMPT_LENGTH * 0.8 && (
        <div className="flex justify-end px-2 mt-1 animate-fade-in">
          <span
            className={cn(
              "text-xs font-medium transition-colors",
              value.length > MAX_PROMPT_LENGTH
                ? "text-status-error"
                : value.length > MAX_PROMPT_LENGTH * 0.9
                  ? "text-status-warning"
                  : "text-ink-tertiary",
            )}
          >
            {value.length} / {MAX_PROMPT_LENGTH}
          </span>
        </div>
      )}
    </div>
  );
}
