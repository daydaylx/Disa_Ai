import { cn } from "@/lib/utils";

type AccentColor = "brand" | "models" | "roles" | "settings";

const ACCENT_COLORS: Record<
  AccentColor,
  { border: string; text: string; corner: string; focusRing: string }
> = {
  brand: {
    border: "border-brand-primary/30",
    text: "text-brand-primary",
    corner: "rgba(139, 92, 246, 0.4)",
    focusRing: "focus-visible:ring-brand-primary/50",
  },
  models: {
    border: "border-accent-models/30",
    text: "text-accent-models",
    corner: "rgba(6, 182, 212, 0.4)",
    focusRing: "focus-visible:ring-accent-models/50",
  },
  roles: {
    border: "border-accent-roles/30",
    text: "text-accent-roles",
    corner: "rgba(244, 114, 182, 0.4)",
    focusRing: "focus-visible:ring-accent-roles/50",
  },
  settings: {
    border: "border-accent-settings/30",
    text: "text-accent-settings",
    corner: "rgba(99, 102, 241, 0.4)",
    focusRing: "focus-visible:ring-accent-settings/50",
  },
};

interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  leading?: React.ReactNode;
  count?: number;
  isActive?: boolean;
  /** Page-specific accent color for selected state. Defaults to "brand" (violet). */
  accentColor?: AccentColor;
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
  accentColor = "brand",
  ...props
}: FilterChipProps) {
  const isActiveState = selected || isActive;
  const accent = ACCENT_COLORS[accentColor];

  return (
    <button
      type="button"
      className={cn(
        "relative inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-lg",
        "px-4 text-sm font-medium",
        "transition-all duration-[120ms]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
        accent.focusRing,
        // Inactive: plain chip
        !isActiveState && [
          "bg-surface-2 text-ink-secondary border border-white/[0.08]",
          "hover:text-ink-primary hover:border-white/[0.14] hover:bg-surface-2/80",
          "active:scale-[0.98] active:translate-y-px",
        ],
        // Active: Mini-Frame-Cut (corner mark top-right)
        isActiveState && [
          "bg-surface-card border",
          accent.border,
          accent.text,
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
            borderTop: `1px solid ${accent.corner}`,
            borderRight: `1px solid ${accent.corner}`,
            borderTopRightRadius: "6px",
          }}
        />
      )}
    </button>
  );
}
