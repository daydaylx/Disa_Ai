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
        "relative min-h-dvh overflow-hidden bg-[var(--surface-neumorphic-base)] text-[var(--color-text-primary)]",
        // Android-safe: Avoid complex gradients for performance
        className,
      )}
    >
      {/* Simplified background for Android performance */}
      <div className="pointer-events-none fixed inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(150%_120%_at_12%_10%,rgba(var(--color-brand-subtle),0.12)_0%,transparent_65%)]" />
      </div>

      <div
        className={cn(
          "relative z-10 mx-auto w-full max-w-4xl px-4 pb-24", // Increased bottom padding for Android nav
          "safe-area-top safe-area-bottom",
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
