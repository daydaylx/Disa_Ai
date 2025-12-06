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
      <div className="relative flex items-end gap-3 rounded-3xl border bg-surface-1 p-2.5 shadow-md focus-within:border-accent-primary focus-within:shadow-lg transition-all">
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
            "flex-shrink-0 h-12 w-12 rounded-2xl transition-all duration-200",
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

      {/* Context Pills: Visual hierarchy with Role as primary */}
      <div className="w-full">
        <div className="flex w-full items-stretch gap-2">
          {/* PRIMARY: Role Pill - More prominent with brand accent */}
          <button
            onClick={() => navigate("/roles")}
            className={cn(
              "flex h-10 flex-[1.3] items-center justify-center gap-1.5 rounded-full border px-3 text-xs font-semibold leading-none text-center transition-all",
              activeRole
                ? "border-accent-secondary/30 bg-accent-secondary/12 text-accent-secondary hover:border-accent-secondary/40 hover:bg-accent-secondary/16 shadow-sm"
                : "border glass-subtle text-ink-secondary hover:border-medium hover:text-ink-primary hover:bg-surface-2",
            )}
          >
            <User className="h-4 w-4" />
            <span className="truncate">{roleLabel}</span>
          </button>

          {/* SECONDARY: Style & Creativity - More subtle */}
          <Select
            value={settings.discussionPreset}
            onValueChange={(preset) => setDiscussionPreset(preset as DiscussionPresetKey)}
          >
            <SelectTrigger
              aria-label="Stil auswählen"
              className="flex h-9 flex-1 items-center justify-center gap-1 rounded-full border glass-subtle px-2.5 text-[11px] font-medium leading-none text-ink-tertiary transition-colors hover:border-medium hover:bg-surface-2 hover:text-ink-secondary"
            >
              <Palette className="h-3.5 w-3.5 opacity-60" />
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
              className="flex h-9 flex-1 items-center justify-center gap-1 rounded-full border glass-subtle px-2.5 text-[11px] font-medium leading-none text-ink-tertiary transition-colors hover:border-medium hover:bg-surface-2 hover:text-ink-secondary"
            >
              <Sparkles className="h-3.5 w-3.5 opacity-60" />
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
