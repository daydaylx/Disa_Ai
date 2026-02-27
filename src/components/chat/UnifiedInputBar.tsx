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
  onInputFocus?: () => void;
  isLoading?: boolean;
  className?: string;
}

export function UnifiedInputBar({
  value,
  onChange,
  onSend,
  onInputFocus,
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
          "relative transition-all duration-300 bg-surface-1/40 backdrop-blur-md border-white/10 input-focus-animation shadow-lg",
          "hover:border-white/20 focus-within:border-brand-primary/30 focus-within:bg-surface-1/60",
        )}
        aria-label="Eingabebereich"
      >
        {/* Zone A – Typing area */}
        <div className="flex items-end gap-3 px-4 pt-3 pb-2 pr-safe-right">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onInputFocus}
            onKeyDown={handleKeyDown}
            placeholder="Nachricht an Disa..."
            className="h-11 max-h-[160px] min-h-[44px] w-full flex-1 resize-none bg-transparent px-0 py-2.5 text-[16px] leading-relaxed text-ink-primary placeholder:text-ink-muted/50 focus:outline-none textarea-resize-transition"
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
              "mb-0.5 h-11 w-11 flex-shrink-0 rounded-xl border border-white/5 transition-all duration-200",
              !value.trim() && !isLoading && "bg-white/5 text-ink-muted/30 shadow-none opacity-40",
              value.trim() &&
                !isLoading &&
                "bg-accent-chat text-white shadow-lg shadow-accent-chat/20 hover:scale-105 active:scale-95",
              isLoading && "bg-accent-chat/80 text-white",
            )}
            aria-label="Senden"
          >
            {isLoading ? (
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className={cn("h-4.5 w-4.5", value.trim() && "translate-x-0.5")} />
            )}
          </Button>
        </div>

        {/* Subtle hairline separator */}
        <div className="mx-4 border-t border-white/[0.05]" />

        {/* Zone B – Context pills */}
        <div className="flex w-full items-center gap-1.5 overflow-x-auto no-scrollbar px-3 py-2.5">
          {/* Role Pill */}
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
                "flex h-11 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-semibold transition-all",
                activeRole
                  ? "bg-brand-primary/15 text-brand-primary border border-brand-primary/20 shadow-sm shadow-brand-primary/5"
                  : "bg-white/5 text-ink-secondary border border-transparent hover:bg-white/10",
              )}
            >
              <User className="h-3 w-3" />
              <span className="max-w-[80px] truncate">{roleLabel}</span>
            </SelectTrigger>
            <SelectContent className="max-h-[280px] w-64">
              <SelectItem value="standard">Standard-Verhalten</SelectItem>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Model Pill */}
          <Select value={settings.preferredModelId} onValueChange={(id) => setPreferredModel(id)}>
            <SelectTrigger
              aria-label="Modell auswählen"
              className="flex h-11 items-center gap-1.5 rounded-full bg-white/5 px-2.5 text-[11px] font-semibold text-ink-tertiary border border-transparent transition-all hover:bg-white/10 hover:text-ink-secondary"
            >
              <Cpu className="h-3 w-3 opacity-70" />
              <span className="max-w-[80px] truncate">{modelLabel}</span>
            </SelectTrigger>
            <SelectContent className="max-h-[280px] w-64">
              {models?.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.label || model.id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Spacer */}
          <div className="flex-1" />

          {/* More options toggle */}
          <button
            type="button"
            onClick={() => setShowExtraControls((prev) => !prev)}
            className={cn(
              "relative flex h-11 w-11 items-center justify-center rounded-full transition-all",
              showExtraControls
                ? "bg-brand-primary text-white"
                : "bg-white/5 text-ink-tertiary hover:bg-white/10",
            )}
            title={showExtraControls ? "Weniger Optionen" : "Mehr Optionen"}
          >
            <Palette className="h-3 w-3" />
            {!showExtraControls && (
              <span
                aria-hidden="true"
                className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-brand-primary/70"
              />
            )}
          </button>
        </div>

        {/* Zone C – Extra controls (Expandable) */}
        {showExtraControls && (
          <div className="animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="mx-4 border-t border-white/[0.05]" />
            <div className="flex w-full items-center gap-1.5 overflow-x-auto no-scrollbar px-3 py-2.5">
              <Select
                value={settings.discussionPreset}
                onValueChange={(preset) => setDiscussionPreset(preset as DiscussionPresetKey)}
              >
                <SelectTrigger
                  aria-label="Stil auswählen"
                  className="flex h-11 items-center gap-1.5 rounded-full bg-white/5 px-2.5 text-[11px] font-semibold text-ink-tertiary border border-transparent transition-all hover:bg-white/10"
                >
                  <Sparkles className="h-3 w-3 opacity-70" />
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
                  className="flex h-11 items-center gap-1.5 rounded-full bg-white/5 px-2.5 text-[11px] font-semibold text-ink-tertiary border border-transparent transition-all hover:bg-white/10"
                >
                  <span className="text-[10px] font-bold opacity-70">%</span>
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
          </div>
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
