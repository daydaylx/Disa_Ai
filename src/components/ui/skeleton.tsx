import { cn } from "../../lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "list" | "card" | "bubble";
}

const base =
  "relative overflow-hidden bg-[color-mix(in_srgb,var(--surface-base)_85%,transparent)]" +
  " before:absolute before:inset-0 before:-translate-x-full before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.06),transparent)]" +
  " before:animate-[skeleton-shimmer_1200ms_ease-in-out_infinite]";

export function Skeleton({ variant = "card", className, ...props }: SkeletonProps) {
  const radius = "rounded-[8px]"; // All variants use 8px radius

  return <div className={cn(base, radius, "animate-fade-in-1", className)} {...props} />;
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} variant="list" className="h-3 w-full" />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return <Skeleton variant="card" className="h-24 w-full" />;
}

export function BubbleSkeleton() {
  return <Skeleton variant="bubble" className="h-10 w-3/4" />;
}
