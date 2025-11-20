import { cn } from "@/lib/utils";

/**
 * MaterialSkeleton - Inset loading placeholder
 * - Uses Material inset style for depth
 * - Pulsing animation for loading state
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-surface-inset shadow-inset", className)}
      {...props}
    />
  );
}

export { Skeleton };
