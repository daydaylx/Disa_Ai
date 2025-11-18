import type { HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  align?: "start" | "center";
  spacing?: "default" | "compact";
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
  align = "start",
  spacing = "default",
  className,
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "w-full",
        align === "center" && "text-center",
        spacing === "compact" ? "space-y-2" : "space-y-3",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "flex w-full flex-col gap-2",
          align === "center" ? "items-center" : "items-start",
        )}
      >
        {eyebrow && (
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
            {eyebrow}
          </span>
        )}
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className={cn("space-y-1", align === "center" && "w-full")}>
            <h2 className="text-2xl font-semibold text-[var(--text-primary)]">{title}</h2>
            {description && <p className="text-sm text-[var(--text-secondary)]">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
