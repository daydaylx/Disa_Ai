import { useEffect, useRef } from "react";

import { useRoles } from "@/contexts/RolesContext";
import { useSettings } from "@/hooks/useSettings";
import { useVisualViewport } from "@/hooks/useVisualViewport";
import { Palette, Send, Sparkles, User } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { type DiscussionPresetKey, discussionPresetOptions } from "@/prompts/discussion/presets";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const viewport = useVisualViewport();
  const { activeRole, setActiveRole, roles } = useRoles();
  const { settings, setCreativity, setDiscussionPreset } = useSettings();

  // Auto-resize logic
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 44), 160);
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

  const roleLabel = activeRole?.name || "Standard";

  const creativityOptions = [
    { value: "10", label: "Präzise (10%)", short: "Präzise" },
    { value: "30", label: "Klar & fokussiert (30%)", short: "Klar" },
    { value: "45", label: "Ausgewogen (45%)", short: "Ausgewogen" },
    { value: "70", label: "Kreativ (70%)", short: "Kreativ" },
    { value: "90", label: "Verspielt (90%)", short: "Verspielt" },
  ];

  const discussionPresetLabel =
    discussionPresetOptions.find((preset) => preset.key === settings.discussionPreset)?.label ||
    "Standard";

  const creativityOption = creativityOptions.find(
    (option) => option.value === String(settings.creativity),
  );
  const creativityLabel = creativityOption?.label || `${settings.creativity}%`;
  const creativityShortLabel = creativityOption?.short || `${settings.creativity}%`;

  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* Main Input Container - Floating Glass */}
      <div className="relative flex items-end gap-3 rounded-3xl border border-white/10 bg-surface-glass backdrop-blur-xl p-2 shadow-lg focus-within:border-brand-primary/50 focus-within:ring-1 focus-within:ring-brand-primary/30 focus-within:shadow-glow-md transition-all duration-300">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Schreibe eine Nachricht..."
          className="flex-1 max-h-[160px] min-h-[44px] w-full resize-none bg-transparent px-3 py-2.5 text-[16px] text-ink-primary placeholder:text-ink-tertiary focus:outline-none leading-relaxed"
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
            "flex-shrink-0 h-11 w-11 rounded-xl transition-all duration-300 mb-0.5 mr-0.5",
            !value.trim() &&
              !isLoading &&
              "opacity-50 shadow-none bg-surface-3 text-ink-tertiary hover:bg-surface-3",
            value.trim() && "shadow-glow-sm hover:shadow-glow-md hover:scale-105",
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

      {/* Context Pills */}
      <div className="w-full px-1">
        <div className="flex w-full items-stretch gap-2">
          {/* Role Dropdown - Primary */}
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
                "flex h-11 flex-[1.3] items-center justify-center gap-1.5 rounded-full border px-3 text-xs font-medium leading-none text-center transition-all",
                activeRole
                  ? "border-brand-secondary/30 bg-brand-secondary/10 text-brand-secondary hover:border-brand-secondary/50 hover:bg-brand-secondary/20 hover:shadow-glow-text"
                  : "border-white/5 bg-surface-1/40 text-ink-secondary hover:border-white/10 hover:text-ink-primary hover:bg-surface-1/60",
              )}
            >
              <User className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{roleLabel}</span>
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
              className="flex h-11 flex-1 items-center justify-center gap-1 rounded-full border border-white/5 bg-surface-1/40 px-2.5 text-[11px] font-medium leading-none text-ink-tertiary transition-colors hover:border-white/10 hover:bg-surface-1/60 hover:text-ink-secondary"
            >
              <Palette className="h-3.5 w-3.5 flex-shrink-0 opacity-60" />
              <span className="truncate">Stil: {discussionPresetLabel}</span>
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
              className="flex h-11 flex-1 items-center justify-center gap-1 rounded-full border border-white/5 bg-surface-1/40 px-2.5 text-[11px] font-medium leading-none text-ink-tertiary transition-colors hover:border-white/10 hover:bg-surface-1/60 hover:text-ink-secondary"
            >
              <Sparkles className="h-3.5 w-3.5 flex-shrink-0 opacity-60" />
              <span className="truncate">Kreativität: {creativityShortLabel}</span>
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
    </div>
  );
}
