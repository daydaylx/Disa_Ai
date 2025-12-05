import {
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import type { ModelEntry } from "@/config/models";
import { useRoles } from "@/contexts/RolesContext";
import { useSettings } from "@/hooks/useSettings";
import { useVisualViewport } from "@/hooks/useVisualViewport";
import { ChevronUp, Cpu, Send, User } from "@/lib/icons";
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
  const [showContext, setShowContext] = useState(false);

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
    <div className={cn("w-full space-y-2", className)}>
      {/* Context Bar (Collapsible) */}
      {showContext && (
        <div className="flex items-center gap-2 px-1 animate-fade-in">
          <button
            onClick={() => navigate("/models")}
            className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg bg-surface-2 text-ink-secondary hover:text-ink-primary hover:bg-surface-3 transition-colors border border-white/5"
          >
            <Cpu className="h-3.5 w-3.5" />
            <span className="font-medium truncate max-w-[100px]">{modelLabel}</span>
          </button>

          <button
            onClick={() => navigate("/roles")}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-xs rounded-lg bg-surface-2 hover:bg-surface-3 transition-colors border border-white/5",
              activeRole ? "text-accent-primary" : "text-ink-secondary hover:text-ink-primary"
            )}
          >
            <User className="h-3.5 w-3.5" />
            <span className="font-medium truncate max-w-[100px]">{roleLabel}</span>
          </button>
        </div>
      )}

      {/* Main Input Container */}
      <div className="relative flex items-end gap-2 bg-surface-1 rounded-2xl border border-white/5 p-1.5 focus-within:border-accent-primary/30 transition-colors">
        {/* Context Toggle */}
        <button
          onClick={() => setShowContext(!showContext)}
          className={cn(
            "flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center transition-colors",
            showContext
              ? "bg-accent-primary/10 text-accent-primary"
              : "text-ink-tertiary hover:text-ink-primary hover:bg-surface-2"
          )}
          aria-label="Optionen anzeigen"
        >
          <ChevronUp className={cn("h-5 w-5 transition-transform", showContext && "rotate-180")} />
        </button>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Schreibe eine Nachricht..."
          className="flex-1 max-h-[160px] min-h-[44px] w-full resize-none bg-transparent px-2 py-2.5 text-[16px] text-ink-primary placeholder:text-ink-tertiary focus:outline-none"
          rows={1}
          data-testid="composer-input"
        />

        {/* Send Button */}
        <Button
          onClick={onSend}
          disabled={!value.trim() || isLoading}
          variant={value.trim() ? "primary" : "ghost"}
          size="icon"
          className={cn(
            "flex-shrink-0 h-10 w-10 rounded-xl transition-all duration-200",
            !value.trim() && "text-ink-muted hover:text-ink-tertiary hover:bg-surface-2",
            isLoading && "opacity-50"
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
