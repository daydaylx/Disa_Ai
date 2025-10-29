import { type ReactNode } from "react";

import { cn } from "../../lib/utils";

interface MobilePageShellProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function MobilePageShell({ children, className, contentClassName }: MobilePageShellProps) {
  return (
    <div
      className={cn(
        "relative min-h-dvh overflow-hidden bg-[var(--surface-bg)] text-[var(--color-text-primary)]",
        className,
      )}
    >
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(150%_120%_at_12%_10%,rgba(var(--color-surface-base-rgb),0.18)_0%,transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(130%_110%_at_88%_18%,rgba(var(--color-brand-strong-rgb),0.12)_0%,transparent_60%)]" />
      </div>
      <div className={cn("relative z-10 mx-auto w-full max-w-4xl px-4 pb-12", contentClassName)}>
        {children}
      </div>
    </div>
  );
}
