import { QUICKSTARTS } from "@/config/quickstarts";
import { cn } from "@/lib/utils";

export interface QuickstartChipsProps {
  onSelect: (system: string, user: string) => void;
  className?: string;
}

/**
 * QuickstartChips - Horizontal scrollable quickstart suggestions for empty state
 * Shows first 4 quickstarts as tappable chips with icons
 */
export function QuickstartChips({ onSelect, className }: QuickstartChipsProps) {
  // Get first 4 quickstarts for empty state display
  const featuredQuickstarts = QUICKSTARTS.slice(0, 4);

  return (
    <div className={cn("flex gap-2 overflow-x-auto pb-2 px-4 scrollbar-hide snap-x", className)}>
      {featuredQuickstarts.map((qs, index) => (
        <button
          key={qs.id}
          type="button"
          onClick={() => onSelect(qs.system, qs.user)}
          className={cn(
            "flex-shrink-0 snap-start inline-flex items-center gap-1.5",
            "h-8 px-3 rounded-full border border-white/8",
            "bg-surface-1/40 text-ink-secondary text-xs font-medium",
            "hover:bg-surface-1/60 hover:border-white/12 hover:text-ink-primary",
            "active:bg-surface-1/80 active:scale-[0.98]",
            "transition-all duration-150 cursor-pointer",
            "touch-manipulation",
            // Staggered fade-in animation
            "animate-fade-in",
          )}
          style={{ animationDelay: `${index * 50}ms` }}
          aria-label={`Start: ${qs.title}`}
        >
          {/* Icon placeholder - could be replaced with actual icons */}
          <span className="text-sm" role="presentation" aria-hidden="true">
            {qs.category === "wissenschaft" && "🔬"}
            {qs.category === "realpolitik" && "🏛️"}
            {qs.category === "hypothetisch" && "💭"}
            {qs.category === "kultur" && "🎭"}
            {qs.category === "verschwörungstheorien" && "🔍"}
            {!qs.category && "💬"}
          </span>
          <span className="whitespace-nowrap">{qs.title}</span>
        </button>
      ))}
    </div>
  );
}
