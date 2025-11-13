import { cn } from "../../lib/utils";

interface FilterChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  leading?: React.ReactNode;
}

export function FilterChip({ selected, leading, children, className, ...props }: FilterChipProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface-glass px-4 text-sm font-medium text-text-secondary shadow-1 transition-all duration-150 hover:bg-surface-muted/80 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        selected && "border-accent/50 bg-accent/10 text-accent shadow-glow-accent/50",
        className,
      )}
      {...props}
    >
      {leading}
      {children}
    </button>
  );
}
