import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useRoles } from "@/contexts/RolesContext";
import { useSettings } from "@/hooks/useSettings";
import { useVisualViewport } from "@/hooks/useVisualViewport";
import { Palette, Send, Sparkles, User } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { type DiscussionPresetKey, discussionPresetOptions } from "@/prompts/discussion/presets";
import { Button } from "@/ui/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/Select";

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
  const { activeRole } = useRoles();
  const { settings, setCreativity, setDiscussionPreset } = useSettings();
  const navigate = useNavigate();

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
    { value: "10", label: "Präzise (10%)" },
    { value: "30", label: "Klar & fokussiert (30%)" },
    { value: "45", label: "Ausgewogen (45%)" },
    { value: "70", label: "Kreativ (70%)" },
    { value: "90", label: "Verspielt (90%)" },
  ];

  const discussionPresetLabel =
    discussionPresetOptions.find((preset) => preset.key === settings.discussionPreset)?.label ||
    "Standard";

  const creativityLabel =
    creativityOptions.find((option) => option.value === String(settings.creativity))?.label ||
    `${settings.creativity}%`;

  return (
    <div className={cn("w-full space-y-2.5", className)}>
      {/* Main Input Container */}
      <div className="relative flex items-end gap-3 rounded-3xl border border-white/8 bg-surface-1/90 p-2.5 shadow-[0_14px_50px_rgba(0,0,0,0.35)] backdrop-blur-sm focus-within:border-accent-primary/40 focus-within:shadow-[0_16px_55px_rgba(99,102,241,0.18)]">
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Schreibe eine Nachricht..."
          className="flex-1 max-h-[160px] min-h-[48px] w-full resize-none bg-transparent px-2 py-2.5 text-[16px] text-ink-primary placeholder:text-ink-tertiary focus:outline-none"
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
            "flex-shrink-0 h-12 w-12 rounded-2xl transition-all duration-200 shadow-md",
            isLoading && "opacity-60",
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

      {/* Kontext-Leiste: volle Breite, gleich große Pills */}
      <div className="w-full px-4 pb-3">
        <div className="flex w-full items-stretch gap-2 text-[11px] text-ink-tertiary">
          <button
            onClick={() => navigate("/roles")}
            className={cn(
              "flex h-10 flex-1 items-center justify-center gap-1.5 rounded-full border px-3 text-[11px] font-medium leading-none text-center transition-colors",
              activeRole
                ? "border-accent-primary/20 bg-accent-primary/8 text-accent-primary hover:border-accent-primary/30 hover:bg-accent-primary/12"
                : "border-white/5 bg-surface-1/60 text-ink-secondary hover:border-white/10 hover:text-ink-primary hover:bg-surface-2/80",
            )}
          >
            <User className="h-3.5 w-3.5 opacity-70" />
            <span className="truncate">{roleLabel}</span>
          </button>

          <Select
            value={settings.discussionPreset}
            onValueChange={(preset) => setDiscussionPreset(preset as DiscussionPresetKey)}
          >
            <SelectTrigger
              aria-label="Stil auswählen"
              className="flex h-10 flex-1 items-center justify-center gap-1 rounded-full border border-white/5 bg-surface-1/60 px-3 text-[11px] font-medium leading-none text-ink-secondary transition-colors hover:border-white/10 hover:bg-surface-2/80 hover:text-ink-primary"
            >
              <Palette className="h-3.5 w-3.5 opacity-70" />
              <SelectValue
                className="truncate px-0 py-0 text-[11px] leading-none text-center"
                placeholder={discussionPresetLabel}
              />
            </SelectTrigger>
            <SelectContent className="w-56">
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
              className="flex h-10 flex-1 items-center justify-center gap-1 rounded-full border border-white/5 bg-surface-1/60 px-3 text-[11px] font-medium leading-none text-ink-secondary transition-colors hover:border-white/10 hover:bg-surface-2/80 hover:text-ink-primary"
            >
              <Sparkles className="h-3.5 w-3.5 opacity-70" />
              <SelectValue
                className="truncate px-0 py-0 text-[11px] leading-none text-center"
                placeholder={creativityLabel}
              />
            </SelectTrigger>
            <SelectContent className="w-52">
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
