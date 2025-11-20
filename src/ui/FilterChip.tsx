import { cn } from "@/lib/utils";

interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  leading?: React.ReactNode;
  count?: number;
  isActive?: boolean;
}

/**
 * MaterialChip (formerly FilterChip)
 *
 * Neumorphism/Soft-Depth Chip Component
 * - NO borders
 * - Default: mini-raised (soft-raise shadow)
 * - Active: inset + accent ring
 * - Press: scale(0.98) + inset shadow
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
        "inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-sm",
        "px-4 text-sm font-medium",
        "transition-all duration-fast",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary",
        // Default raised state
        !isActiveState && [
          "bg-surface-2 text-text-secondary shadow-raise",
          "hover:text-text-primary hover:shadow-raiseLg",
          "active:scale-[0.98] active:shadow-inset active:translate-y-px",
        ],
        // Active inset state
        isActiveState && [
          "bg-surface-inset text-accent-primary shadow-inset",
          "ring-1 ring-accent-primary",
        ],
        className,
      )}
      {...props}
    >
      {leading}
      {children}
      {count !== undefined && <span className="ml-1 text-xs text-text-muted">{count}</span>}
    </button>
  );
}
