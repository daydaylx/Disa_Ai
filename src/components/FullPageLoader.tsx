import type { ReactNode } from "react";

interface FullPageLoaderProps {
  message?: string;
  actionHint?: ReactNode;
}

export function FullPageLoader({ message = "Ladevorgang läuft", actionHint }: FullPageLoaderProps) {
  return (
    <div
      className="bg-surface-base flex min-h-screen-mobile items-center justify-center px-4"
      aria-busy="true"
    >
      <div className="bg-surface-2 shadow-raise flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl p-6 text-center">
        <div className="flex w-full items-center gap-4">
          <div
            className="border-border/40 text-accent h-12 w-12 animate-spin rounded-full border-4 border-t-current"
            aria-hidden="true"
          />
          <div className="flex-1 space-y-2">
            <div className="bg-surface-subtle h-3 w-20 animate-pulse rounded-full" />
            <div className="bg-surface-subtle h-3 w-28 animate-pulse rounded-full" />
          </div>
        </div>
        <p className="text-text-secondary text-sm">{message}</p>
        {actionHint}
        <span className="sr-only" role="status" aria-live="polite">
          {message}
        </span>
      </div>
    </div>
  );
}
