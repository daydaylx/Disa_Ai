import { cn } from "../../lib/utils";

interface SkeletonProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  variant?: "rounded" | "circular" | "rectangular";
  animation?: "pulse" | "wave" | "none";
  children?: React.ReactNode;
}

/**
 * Enhanced Skeleton Component with multiple variants and loading states
 * Provides visual feedback during loading operations
 */
export function Skeleton({
  className,
  size = "md",
  variant = "rounded",
  animation = "pulse",
  children,
}: SkeletonProps) {
  // Size mappings
  const sizeClasses = {
    sm: "h-4 w-24", // Small text line
    md: "h-6 w-32", // Medium text line
    lg: "h-8 w-40", // Large text line
    xl: "h-12 w-48", // Extra large element
    full: "h-24 w-full", // Full width element
  };

  // Variant mappings
  const variantClasses = {
    rounded: "rounded-lg",
    circular: "rounded-full",
    rectangular: "rounded-none",
  };

  // Animation mappings
  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-wave",
    none: "",
  };

  const baseClasses = "bg-muted";
  const sizeClass = sizeClasses[size];
  const variantClass = variantClasses[variant];
  const animationClass = animationClasses[animation];

  const skeletonClasses = cn(baseClasses, sizeClass, variantClass, animationClass, className);

  if (children) {
    // If children are provided, wrap them with skeleton overlay
    return (
      <div className="relative">
        {children}
        <div
          className={cn(
            "absolute inset-0 bg-muted/70",
            variantClasses[variant],
            animationClass,
            className,
          )}
          aria-hidden="true"
        />
      </div>
    );
  }

  return <div className={skeletonClasses} aria-busy="true" />;
}

/**
 * Predefined skeleton variants for common UI patterns
 */
export const SkeletonVariants = {
  // For text elements
  text: (props: Omit<SkeletonProps, "variant"> = {}) => <Skeleton variant="rounded" {...props} />,

  // For avatar images
  avatar: (props: Omit<SkeletonProps, "variant" | "size"> = {}) => (
    <Skeleton variant="circular" size="sm" {...props} />
  ),

  // For larger avatar images
  avatarLarge: (props: Omit<SkeletonProps, "variant" | "size"> = {}) => (
    <Skeleton variant="circular" size="xl" {...props} />
  ),

  // For images
  image: (props: Omit<SkeletonProps, "variant"> = {}) => <Skeleton variant="rounded" {...props} />,

  // For buttons
  button: (props: Omit<SkeletonProps, "variant"> = {}) => (
    <Skeleton variant="rounded" size="md" {...props} />
  ),

  // For cards
  card: (props: Omit<SkeletonProps, "variant"> = {}) => (
    <Skeleton variant="rounded" size="full" {...props} />
  ),

  // For list items
  listItem: (props: Omit<SkeletonProps, "variant"> = {}) => (
    <Skeleton variant="rounded" size="full" {...props} />
  ),
};

/**
 * Common skeleton patterns for specific UI components
 */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4 p-4", className)}>
      <SkeletonVariants.avatar className="mb-2" />
      <SkeletonVariants.text className="w-3/4" />
      <SkeletonVariants.text />
      <SkeletonVariants.text className="w-2/3" />
      <div className="flex space-x-2">
        <SkeletonVariants.button className="h-8 w-16" />
        <SkeletonVariants.button className="h-8 w-16" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-2">
          <SkeletonVariants.avatar />
          <div className="flex-1 space-y-2">
            <SkeletonVariants.text />
            <SkeletonVariants.text className="w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonChatMessage() {
  return (
    <div className="flex gap-3 px-3 py-4">
      <SkeletonVariants.avatar />
      <div className="flex-1 space-y-2">
        <SkeletonVariants.text className="w-16" />
        <div className="space-y-1">
          <SkeletonVariants.text />
          <SkeletonVariants.text className="w-5/6" />
          <SkeletonVariants.text className="w-4/6" />
        </div>
      </div>
    </div>
  );
}
