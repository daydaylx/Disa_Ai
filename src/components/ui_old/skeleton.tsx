import { cn } from "../../lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: "pulse" | "wave";
}

const basePulse =
  "relative overflow-hidden bg-[color-mix(in_srgb,var(--surface-base)_85%,transparent)] animate-pulse";
const baseWave =
  "relative overflow-hidden bg-[color-mix(in_srgb,var(--surface-base)_85%,transparent)] animate-wave";

export function Skeleton({ className, animation = "pulse", ...props }: SkeletonProps) {
  const radius = "rounded-[8px]"; // All variants use 8px radius
  const base = animation === "wave" ? baseWave : basePulse;

  return <div className={cn(base, radius, "animate-fade-in-1", className)} {...props} />;
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-full" />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return <Skeleton className="h-24 w-full" />;
}

export function BubbleSkeleton() {
  return <Skeleton className="h-10 w-3/4" />;
}
