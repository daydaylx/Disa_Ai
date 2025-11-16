import { cn } from "@/lib/utils";

interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  leading?: React.ReactNode;
  count?: number;
  isActive?: boolean;
}

export function FilterChip({
  selected,
  leading,
  children,
  className,
  count,
  isActive,
  ...props
}: FilterChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-full border",
        "border-[color-mix(in_srgb,var(--line)_70%,transparent)]",
        "bg-[color-mix(in_srgb,var(--surface-card)_85%,transparent)]",
        "px-4 text-sm font-medium text-text-secondary",
        "shadow-[0_2px_8px_rgba(0,0,0,0.05)] backdrop-blur-sm",
        "transition-all duration-150",
        "hover:bg-[color-mix(in_srgb,var(--surface-card)_90%,white_5%)] hover:text-text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        (selected || isActive) &&
          [
            "border-[color-mix(in_srgb,var(--accent)_50%,transparent)]",
            "bg-[color-mix(in_srgb,var(--accent)_20%,transparent)]",
            "text-accent",
            "shadow-[0_2px_12px_rgba(139,92,246,0.2)]",
          ].join(" "),
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
