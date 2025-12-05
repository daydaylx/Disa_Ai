import {
  // Removed RefObject from here as it's not directly used
  useEffect,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";

import type { ModelEntry } from "@/config/models";
import { useRoles } from "@/contexts/RolesContext";
import { useSettings } from "@/hooks/useSettings";
import { useVisualViewport } from "@/hooks/useVisualViewport";
import { Cpu, Send, SlidersHorizontal, User } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

export interface UnifiedInputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading?: boolean;
  className?: string;
  // models, modelsLoading, modelsError, onRefreshModels are passed but not directly used in this component's JSX after refactor
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
  // Removed unused props from destructuring
  // models, modelsLoading, modelsError, onRefreshModels,
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

  return (
    <div className={cn("w-full transition-all", className)}>
      {/* Context Bar (Above Input) */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {/* Active Model Badge */}
          <button
            onClick={() => navigate("/models")}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-surface-2 transition-colors text-xs font-medium text-ink-secondary"
          >
            <Cpu className="h-3.5 w-3.5" />
            <span>{settings.preferredModelId.split("/").pop() || "Auto"}</span>
          </button>

          {/* Active Role Badge */}
          <button
            onClick={() => navigate("/roles")}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-surface-2 transition-colors text-xs font-medium",
              activeRole ? "text-accent-primary" : "text-ink-secondary",
            )}
          >
            <User className="h-3.5 w-3.5" />
            <span>{activeRole?.name || "Standard"}</span>
          </button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-ink-tertiary"
          onClick={() => navigate("/settings")}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Input Field */}
      <div className="relative flex items-end gap-2 bg-surface-2 rounded-2xl p-1.5 ring-1 ring-white/5 focus-within:ring-accent-primary/50 transition-shadow">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Schreibe eine Nachricht..."
          className="flex-1 max-h-[160px] min-h-[44px] w-full resize-none bg-transparent px-3 py-2.5 text-[16px] text-ink-primary placeholder:text-ink-tertiary focus:outline-none"
          rows={1}
          data-testid="composer-input" // Added data-testid back here
        />

        <Button
          onClick={onSend}
          disabled={!value.trim() || isLoading}
          variant={value.trim() ? "primary" : "ghost"}
          size="icon"
          className={cn(
            "mb-0.5 h-10 w-10 rounded-xl transition-all",
            !value.trim() && "text-ink-muted hover:bg-transparent",
          )}
        >
          <Send className={cn("h-5 w-5", value.trim() && "ml-0.5")} />
        </Button>
      </div>
    </div>
  );
}
