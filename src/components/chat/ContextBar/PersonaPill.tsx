import { forwardRef } from "react";

import type { UIRole } from "@/data/roles";
import { ChevronDown } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface PersonaPillProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "role"> {
  role: UIRole | null;
  isActive?: boolean;
}

// Map role categories/tags to emojis
function getRoleEmoji(role: UIRole | null): string {
  if (!role) return "🧠";

  const name = role.name?.toLowerCase() || "";
  const category = role.category?.toLowerCase() || "";
  const tags = role.tags?.map((t) => t.toLowerCase()) || [];

  // Check specific patterns
  if (name.includes("code") || name.includes("developer") || tags.includes("code")) return "🧑‍💻";
  if (name.includes("karriere") || name.includes("coach") || category.includes("business"))
    return "💼";
  if (name.includes("kreativ") || name.includes("schreib") || tags.includes("creative"))
    return "✨";
  if (name.includes("lehrer") || name.includes("tutor") || tags.includes("education")) return "📚";
  if (category.includes("erwachsene") || tags.includes("nsfw")) return "🔞";
  if (name.includes("story") || name.includes("roleplay")) return "🎭";

  return "🧠"; // Default
}

export const PersonaPill = forwardRef<HTMLButtonElement, PersonaPillProps>(
  ({ role, isActive, className, ...props }, ref) => {
    const emoji = getRoleEmoji(role);

    return (
      <button
        ref={ref}
        className={cn(
          "group flex items-center gap-1.5 rounded-full border border-border-ink bg-surface-1 pl-2.5 pr-2 py-1.5 text-sm font-medium text-ink-primary transition-all duration-200",
          "hover:bg-surface-2 hover:border-border-ink/80 active:scale-[0.98]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50",
          isActive && "bg-ink-primary text-surface-1 border-ink-primary hover:bg-ink-primary/90",
          className,
        )}
        aria-label={`Aktuelle Rolle: ${role?.name || "Standard"}. Ändern…`}
        {...props}
      >
        <span className="flex items-center justify-center text-base leading-none">{emoji}</span>

        <span className="truncate max-w-[80px] sm:max-w-[120px] text-xs sm:text-sm">
          {role?.name || "Standard"}
        </span>

        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-ink-secondary transition-transform duration-200",
            isActive ? "text-surface-1/70 rotate-180" : "group-hover:text-ink-primary",
          )}
        />
      </button>
    );
  },
);

PersonaPill.displayName = "PersonaPill";
