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

  const selectedModel = models?.find((m) => m.id === settings.preferredModelId);
  const modelLabel =
    selectedModel?.label?.split("/").pop() || selectedModel?.id?.split("/").pop() || "Modell";

  return (
    <div className={cn("w-full space-y-2", className)}>
      {/* Model selection moved to settings - cleaner input area */}

      {/* Main Input Container - Material-based with clear focus */}
      <BrandCard
        variant="tinted"
        padding="sm"
        className={cn(
          "relative flex items-end gap-3 transition-all backdrop-blur-sm input-focus-animation pr-safe-right",
        )}
        aria-label="Eingabebereich"
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Schreibe eine Nachricht..."
          className="flex-1 max-h-[160px] min-h-[44px] w-full resize-none bg-transparent px-3 py-2.5 text-[16px] text-ink-primary placeholder:text-ink-tertiary focus:outline-none leading-relaxed textarea-resize-transition"
          rows={1}
          data-testid="composer-input"
          aria-label="Nachricht eingeben"
        />

        {/* Send Button - Material Chip */}
        <Button
          onClick={onSend}
          disabled={!value.trim() || isLoading}
          variant="primary"
          size="icon"
          className={cn(
            "flex-shrink-0 h-10 w-10 rounded-xl transition-all duration-200 mb-0.5 mr-1",
            !value.trim() &&
              !isLoading &&
              "opacity-40 bg-surface-2 text-ink-tertiary hover:bg-surface-2 shadow-sm",
            value.trim() &&
              !isLoading &&
              "bg-accent-chat text-white shadow-glow-sm hover:shadow-glow-md hover:scale-105 active:scale-100 animate-send-pulse",
          )}
          aria-label="Senden"
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className={cn("h-5 w-5", value.trim() && "ml-0.5")} />
          )}
        </Button>
      </BrandCard>

      {/* Character Counter */}
      {value.length > MAX_PROMPT_LENGTH * 0.8 && (
        <div className="flex justify-end px-2 animate-fade-in">
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

      {/* Context Pills */}
      <div className="w-full px-1">
        <div className="flex w-full items-center gap-2 overflow-x-auto no-scrollbar pb-1 px-1 -mx-1 mask-linear-fade">
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
                "flex h-9 min-w-fit items-center justify-center gap-2 px-3 text-xs font-medium leading-none role-badge-transition animate-pill-slide-in",
                activeRole
                  ? "rounded-2xl border border-[var(--card-border-color-focus)] bg-brand-secondary/10 text-brand-secondary shadow-[var(--card-shadow-focus)]"
                  : "rounded-full border border-white/8 bg-surface-1/40 text-ink-secondary hover:border-white/12 hover:text-ink-primary hover:bg-surface-1/60",
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

          {/* Style Dropdown */}
          <Select
            value={settings.discussionPreset}
            onValueChange={(preset) => setDiscussionPreset(preset as DiscussionPresetKey)}
          >
            <SelectTrigger
              aria-label="Stil auswählen"
              className="flex h-9 min-w-fit items-center justify-center gap-2 rounded-full border border-white/8 bg-surface-1/40 px-3 text-xs font-medium leading-none text-ink-tertiary transition-colors hover:border-white/12 hover:bg-surface-1/60 hover:text-ink-secondary animate-pill-slide-in"
              style={{ animationDelay: "50ms" }}
            >
              <Palette className="h-3.5 w-3.5 flex-shrink-0 opacity-60" />
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

          {/* Creativity Dropdown */}
          <Select
            value={String(settings.creativity)}
            onValueChange={(value) => setCreativity(Number(value))}
          >
            <SelectTrigger
              aria-label="Kreativität auswählen"
              className="flex h-9 min-w-fit items-center justify-center gap-2 rounded-full border border-white/8 bg-surface-1/40 px-3 text-xs font-medium leading-none text-ink-tertiary transition-colors hover:border-white/12 hover:bg-surface-1/60 hover:text-ink-secondary animate-pill-slide-in"
              style={{ animationDelay: "100ms" }}
            >
              <Sparkles className="h-3.5 w-3.5 flex-shrink-0 opacity-60" />
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

          {/* Model Dropdown */}
          <Select value={settings.preferredModelId} onValueChange={(id) => setPreferredModel(id)}>
            <SelectTrigger
              aria-label="Modell auswählen"
              className="flex h-9 min-w-fit items-center justify-center gap-2 rounded-full border border-white/8 bg-surface-1/40 px-3 text-xs font-medium leading-none text-ink-tertiary transition-colors hover:border-white/12 hover:bg-surface-1/60 hover:text-ink-secondary animate-pill-slide-in"
              style={{ animationDelay: "150ms" }}
            >
              <Cpu className="h-3.5 w-3.5 flex-shrink-0 opacity-60" />
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
        </div>
      </div>
    </div>
  );
}
