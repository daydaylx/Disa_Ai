import React from "react";

import { cn } from "../../lib/utils/cn";

/**
 * Loader-Komponenten:
 * - Skeleton: Platzhalter-Flächen (z. B. für Nachrichten)
 * - Spinner: als Fallback für sehr kurze Wartezeiten
 */

export interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} aria-hidden="true" />;
};

export interface SpinnerProps {
  size?: number;
  label?: string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 20, label = "Lädt …", className }) => {
  const border = Math.max(2, Math.round(size / 10));
  return (
    <div
      className={cn("inline-flex items-center gap-2", className)}
      role="status"
      aria-live="polite"
    >
      <div
        className="inline-block animate-spin rounded-full border-t-transparent"
        style={{
          width: size,
          height: size,
          borderStyle: "solid",
          borderWidth: border,
          borderColor: "hsl(var(--muted-foreground))",
          borderTopColor: "transparent",
        }}
        aria-hidden="true"
      />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
};
