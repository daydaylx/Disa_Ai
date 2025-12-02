import type { ModelEntry } from "@/config/models";
import { Send, Square } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

import { CreativitySelector } from "./CreativityDropdown";
import { ModelSelector } from "./ModelSelector";
import { PersonaSelector } from "./PersonaSelector";
import { ContextLengthSelector } from "./QuickSettingsDropdown";
import { StyleSelector } from "./StyleDropdown";

interface ContextBarProps {
  modelCatalog: ModelEntry[] | null;
  className?: string;
  onSend?: () => void;
  onStop?: () => void;
  isLoading?: boolean;
  canSend?: boolean;
}

export function ContextBar({
  modelCatalog,
  className,
  onSend,
  onStop,
  isLoading = false,
  canSend = false,
}: ContextBarProps) {
  return (
    <div
      className={cn(
        "w-full flex items-center gap-2 px-2 py-2 sm:px-4 bg-bg-page/98 backdrop-blur-sm transition-all",
        "pb-[max(0.5rem,env(safe-area-inset-bottom))]",
        className,
      )}
    >
      <div className="flex-1 overflow-x-auto">
        <div className="flex min-w-max items-center gap-2 pr-1">
          <PersonaSelector />
          <StyleSelector />
          <CreativitySelector />
          <ContextLengthSelector />
          <ModelSelector catalog={modelCatalog} />
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center gap-1.5 sm:gap-2">
        {isLoading ? (
          <Button
            onClick={onStop}
            variant="secondary"
            size="icon"
            className="h-10 w-10 rounded-xl bg-surface-2 hover:bg-surface-hover"
            title="Stoppen"
            aria-label="Antwort stoppen"
          >
            <Square className="h-4 w-4 fill-current animate-pulse" />
          </Button>
        ) : (
          <Button
            onClick={onSend}
            disabled={!canSend}
            variant="primary"
            size="icon"
            className={cn(
              "h-10 w-10 rounded-xl transition-all duration-200",
              canSend
                ? "bg-ink-primary text-surface-1 shadow-md hover:bg-ink-primary/90 active:scale-95"
                : "bg-surface-2 text-ink-tertiary opacity-60 cursor-not-allowed",
            )}
            title="Senden"
            aria-label="Nachricht senden"
          >
            <Send className="h-4.5 w-4.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
