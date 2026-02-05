import { cn } from "@/lib/utils";

import { Skeleton } from "./Skeleton";

interface CardSkeletonProps {
  count?: number;
  className?: string;
}

/**
 * CardSkeleton - Loading placeholder for Role/Model/Theme cards
 *
 * Features:
 * - Mimics card layout with icon, title, description
 * - Animated pulse effect
 * - Configurable count for multiple skeletons
 */
export function CardSkeleton({ count = 3, className }: CardSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="relative rounded-2xl border border-white/5 bg-surface-1/50 p-4 overflow-hidden"
          data-testid="card-skeleton"
        >
          <div className="flex items-center gap-4">
            {/* Icon skeleton */}
            <Skeleton className="h-12 w-12 rounded-2xl flex-shrink-0" />

            {/* Content skeleton */}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>

            {/* Action skeleton */}
            <Skeleton className="h-8 w-8 rounded-lg flex-shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface ListSkeletonProps {
  count?: number;
  className?: string;
}

/**
 * ListSkeleton - Loading placeholder for list items (e.g., Chat History)
 */
export function ListSkeleton({ count = 3, className }: ListSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-white/5 bg-surface-1/50 p-4"
          data-testid="list-skeleton"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface SettingsSkeletonProps {
  count?: number;
  className?: string;
}

/**
 * SettingsSkeleton - Loading placeholder for settings cards
 */
export function SettingsSkeleton({ count = 6, className }: SettingsSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-white/5 bg-surface-1/50 p-4"
          data-testid="settings-skeleton"
        >
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-2xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-4 w-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface HeaderSkeletonProps {
  className?: string;
}

/**
 * HeaderSkeleton - Loading placeholder for page headers
 */
export function HeaderSkeleton({ className }: HeaderSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)} data-testid="header-skeleton">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
    </div>
  );
}

interface FilterSkeletonProps {
  count?: number;
  className?: string;
}

/**
 * FilterSkeleton - Loading placeholder for filter pills
 */
export function FilterSkeleton({ count = 4, className }: FilterSkeletonProps) {
  return (
    <div className={cn("flex gap-2", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-20 rounded-full" data-testid="filter-skeleton" />
      ))}
    </div>
  );
}
