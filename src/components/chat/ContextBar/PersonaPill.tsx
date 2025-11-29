import { forwardRef } from "react";

import type { UIRole } from "@/data/roles";
import { ChevronDown } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface PersonaPillProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "role"> {
  role: UIRole | null;
  isActive?: boolean;
}

export const PersonaPill = forwardRef<HTMLButtonElement, PersonaPillProps>(
  ({ role, isActive, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group flex items-center gap-2 rounded-full border border-border-ink bg-surface-1 pl-3 pr-3 py-1.5 text-sm font-medium text-ink-primary transition-all duration-200",
          "hover:bg-surface-2 hover:border-border-ink/80 active:scale-[0.98]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50",
          isActive && "bg-ink-primary text-surface-1 border-ink-primary hover:bg-ink-primary/90",
          className,
        )}
        aria-label={`Aktuelle Rolle: ${role?.name || "Standard"}. Ändern…`}
        {...props}
      >
        <span className="flex items-center justify-center text-lg leading-none">{"🧠"}</span>

        <span className="truncate max-w-[120px] sm:max-w-[160px]">
          {role?.name || "Disa Standard"}
        </span>

        <ChevronDown
          className={cn(
            "h-4 w-4 text-ink-secondary transition-transform duration-200",
            isActive ? "text-surface-1/70 rotate-180" : "group-hover:text-ink-primary",
          )}
        />
      </button>
    );
  },
);

PersonaPill.displayName = "PersonaPill";
