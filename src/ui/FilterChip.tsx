import { cn } from "@/lib/utils";

interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  leading?: React.ReactNode;
  count?: number;
  isActive?: boolean;
}

/**
 * FilterChip - Disa Frame Branding System
 *
 * Material Chip Component with Mini-Frame-Cut
 * - Inactive: plain chip with subtle border
 * - Active: Mini-Frame-Cut (corner mark top-right, no hole)
 * - No glow, clear contrast logic
 */
export function FilterChip({
  selected,
  leading,
  children,
  className,
  count,
  isActive,
  ...props
}: FilterChipProps) {
  const isActiveState = selected || isActive;

  return (
    <button
      type="button"
      className={cn(
        "relative inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-lg",
        "px-4 text-sm font-medium",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50 focus-visible:ring-offset-1",
        // Inactive: plain chip
        !isActiveState && [
          "bg-surface-2 text-ink-secondary border border-white/5",
          "hover:text-ink-primary hover:border-white/10 hover:bg-surface-2/80",
          "active:scale-[0.98] active:translate-y-px",
        ],
        // Active: Mini-Frame-Cut (corner mark top-right)
        isActiveState && [
          "bg-surface-card text-brand-primary border border-brand-primary/30",
          "active:scale-[0.98] active:translate-y-px",
        ],
        className,
      )}
      {...props}
    >
      {leading}
      {children}
      {count !== undefined && <span className="ml-1 text-xs text-ink-tertiary">{count}</span>}

      {/* Mini-Frame-Cut: Corner mark top-right (only when active) */}
      {isActiveState && (
        <div
          className="absolute top-0 right-0 pointer-events-none"
          style={{
            width: "8px",
            height: "8px",
            borderTop: "1px solid rgba(139, 92, 246, 0.4)",
            borderRight: "1px solid rgba(139, 92, 246, 0.4)",
            borderTopRightRadius: "6px",
          }}
        />
      )}
    </button>
  );
}
