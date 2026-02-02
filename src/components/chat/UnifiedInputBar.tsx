import * as React from "react";

import { useModelCatalog } from "@/contexts/ModelCatalogContext";
import { useRoles } from "@/contexts/RolesContext";
import { useSettings } from "@/hooks/useSettings";
import { useVisualViewport } from "@/hooks/useVisualViewport";
import { Send } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

export interface UnifiedInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export function UnifiedInputBar({
  value,
  onChange,
  onSend,
  isLoading = false,
  placeholder = "Schreibe eine Nachricht...",
  className,
}: UnifiedInputBarProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const viewport = useVisualViewport();
  const { activeRole: _activeRole } = useRoles();
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

  const handleSend = () => {
    if (value.trim()) {
      onSend();
    }
  };

  const creativityOptions = [
    { value: "10", label: "Präzise (10%)", short: "Präzise" },
    { value: "30", label: "Klar & fokussiert (30%)", short: "Klar" },
    { value: "45", label: "Ausgewogen (45%)", short: "Ausgewogen" },
    { value: "70", label: "Kreativ (70%)", short: "Kreativ" },
    { value: "90", label: "Verspielt (90%)", short: "Verspielt" },
  ];

  const hasContent = value.trim().length > 0;

  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* Main Input Container - Enhanced Visual Design */}
      <div
        className={cn(
          "relative flex items-end gap-3 transition-all duration-300 ease-out",
          // Base styling with subtle gradient
          "bg-gradient-to-b from-surface-1/90 to-surface-2/80",
          "border border-white/10 rounded-2xl p-3",
          // Focus states
          "focus-within:border-accent-chat/40 focus-within:shadow-[0_0_20px_rgba(139,92,246,0.15)]",
          "focus-within:bg-gradient-to-b focus-within:from-surface-1 focus-within:to-surface-2/90",
          // Active state with content
          hasContent && "shadow-md border-white/12",
          // Backdrop blur for glass effect
          "backdrop-blur-md",
        )}
        aria-label="Eingabebereich"
      >
        {/* Textarea - Enhanced Focus Experience */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={cn(
              "w-full max-h-[160px] min-h-[44px] resize-none bg-transparent",
              "px-3 py-2.5 text-[16px] leading-relaxed",
              "text-ink-primary placeholder:text-ink-tertiary/60",
              "focus:outline-none textarea-resize-transition",
            )}
            rows={1}
            data-testid="composer-input"
            aria-label="Nachricht eingeben"
          />
          {/* Character counter (optional, appears when text is long) */}
          {value.length > 200 && (
            <div className="absolute right-3 -top-5 text-[10px] text-ink-tertiary/60">
              {value.length} Zeichen
            </div>
          )}
        </div>

        {/* Send Button - Enhanced Ready State */}
        <Button
          onClick={handleSend}
          disabled={!value.trim() || isLoading}
          variant="primary"
          size="icon"
          className={cn(
            "flex-shrink-0 h-11 w-11 rounded-xl transition-all duration-300 mb-0.5 mr-0.5",
            // Disabled state - subtle
            !value.trim() && "bg-surface-3/30 text-ink-muted border border-white/5 shadow-none",
            // Loading state
            isLoading && "opacity-70",
            // Active state - prominent
            value.trim() &&
              !isLoading &&
              "bg-gradient-to-br from-accent-chat to-accent-chat/90 text-white",
            // Hover effects only when active
            value.trim() &&
              !isLoading &&
              "shadow-[0_4px_16px_rgba(139,92,246,0.35)] hover:shadow-[0_6px_20px_rgba(139,92,246,0.45)] hover:scale-105 hover:-translate-y-[2px]",
            // Active press effect
            value.trim() &&
              "active:scale-95 active:translate-y-0 active:shadow-[0_2px_8px_rgba(139,92,246,0.3)]",
          )}
          aria-label="Senden"
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className={cn("h-5 w-5 transition-transform", value.trim() && "ml-0.5")} />
          )}
        </Button>
      </div>
    </div>
  );
}
