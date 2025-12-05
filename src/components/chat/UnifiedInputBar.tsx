import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import type { ModelEntry } from "@/config/models";
import { useRoles } from "@/contexts/RolesContext";
import { useSettings } from "@/hooks/useSettings";
import { useVisualViewport } from "@/hooks/useVisualViewport";
import { Cpu, Send, User } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

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
  const { settings } = useSettings();
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

  const modelLabel = settings.preferredModelId.split("/").pop() || "Modell";
  const roleLabel = activeRole?.name || "Standard";

  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* Context Bar (subdued, doesn't compete with primary action) */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate("/models")}
            className="flex items-center gap-1.5 rounded-full border border-white/5 bg-surface-1/60 px-2.5 py-1.5 text-xs font-medium text-ink-secondary transition-colors hover:border-white/10 hover:text-ink-primary hover:bg-surface-2/80"
          >
            <Cpu className="h-3.5 w-3.5 opacity-70" />
            <span className="truncate max-w-[140px]">{modelLabel}</span>
          </button>
          <button
            onClick={() => navigate("/roles")}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium transition-colors",
              activeRole
                ? "border-accent-primary/20 bg-accent-primary/8 text-accent-primary hover:border-accent-primary/30 hover:bg-accent-primary/12"
                : "border-white/5 bg-surface-1/60 text-ink-secondary hover:border-white/10 hover:text-ink-primary hover:bg-surface-2/80",
            )}
          >
            <User className="h-3.5 w-3.5 opacity-70" />
            <span className="truncate max-w-[140px]">{roleLabel}</span>
          </button>
        </div>
        <span className="text-[10px] text-ink-secondary/60 hidden sm:inline">
          Enter • Shift+Enter
        </span>
      </div>

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
    </div>
  );
}
