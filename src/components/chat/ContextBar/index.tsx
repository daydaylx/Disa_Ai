import type { ModelEntry } from "@/config/models";
import { cn } from "@/lib/utils";

import { ContextBarMiddle } from "./ContextBarMiddle";
import { ModelSelector } from "./ModelSelector";
import { PersonaSelector } from "./PersonaSelector";

interface ContextBarProps {
  modelCatalog: ModelEntry[] | null;
  className?: string;
}

export function ContextBar({ modelCatalog, className }: ContextBarProps) {
  return (
    <div
      className={cn(
        "w-full flex items-center justify-between px-2 py-2 sm:px-4 bg-bg-page/95 border-t border-border-ink backdrop-blur-sm transition-all",
        className,
      )}
    >
      {/* Left: Role */}
      <div className="flex-shrink-0 min-w-0 max-w-[35%]">
        <PersonaSelector />
      </div>

      {/* Center: Settings */}
      <div className="flex-shrink-0">
        <ContextBarMiddle />
      </div>

      {/* Right: Model */}
      <div className="flex-shrink-0 min-w-0 max-w-[30%] flex justify-end">
        <ModelSelector catalog={modelCatalog} />
      </div>
    </div>
  );
}
