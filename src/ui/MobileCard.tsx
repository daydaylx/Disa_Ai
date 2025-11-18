import { forwardRef, type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type MobileCardAccent = "primary" | "lila" | "green" | "neutral";

interface MobileCardProps extends HTMLAttributes<HTMLDivElement> {
  accent?: MobileCardAccent;
  padded?: boolean;
}

const accentMap: Record<MobileCardAccent, string> = {
  primary: "from-[var(--aurora-primary-500)] to-[var(--aurora-lila-500)]",
  lila: "from-[var(--aurora-lila-500)] to-[var(--aurora-lila-300)]",
  green: "from-[var(--aurora-green-500)] to-[var(--aurora-green-300)]",
  neutral: "from-[var(--glass-border-soft)] to-transparent",
};

export const MobileCard = forwardRef<HTMLDivElement, MobileCardProps>(
  ({ accent = "primary", padded = true, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-[24px] border border-[var(--glass-border-soft)]",
          "bg-[var(--surface-card)]/95 shadow-[var(--shadow-md)]",
          "backdrop-blur-[var(--backdrop-blur-soft)]",
          className,
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-x-5 top-0 h-1 rounded-full bg-gradient-to-r",
            accentMap[accent],
          )}
        />
        <div className={cn("relative", padded && "p-5 space-y-4")}>{children}</div>
      </div>
    );
  },
);

MobileCard.displayName = "MobileCard";
