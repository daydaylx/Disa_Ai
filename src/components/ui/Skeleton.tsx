import * as React from "react";

import { cn } from "../../lib/cn";

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        // Dramatic Neomorphic Skeleton
        "animate-pulse rounded-[var(--radius-md)] transition-all duration-300",
        "bg-[var(--surface-neumorphic-base)]",
        "shadow-[var(--shadow-inset-subtle)]",
        "border border-[var(--border-neumorphic-subtle)]",
        // Enhanced shimmer effect
        "relative overflow-hidden",
        "before:absolute before:inset-0",
        "before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
        "before:animate-[shimmer_2s_infinite]",
        className,
      )}
      aria-hidden="true"
    >
      {children}
    </div>
  );
};

export const MessageSkeleton: React.FC<{ isUser?: boolean }> = ({ isUser = false }) => {
  return (
    <div
      className={cn(
        // Dramatic Neomorphic Message Bubble Skeleton
        "rounded-[var(--radius-lg)] p-4 transition-all duration-300",
        "bg-[var(--surface-neumorphic-floating)]",
        "shadow-[var(--shadow-neumorphic-md)]",
        "border border-[var(--border-neumorphic-light)]",
        "max-w-[min(100%,640px)]",
        isUser ? "ml-auto" : "mr-auto",
      )}
      aria-hidden="true"
    >
      <div className="space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
};

export const HeaderSkeleton: React.FC = () => {
  return (
    <div
      className={cn(
        "flex items-center justify-between p-6 transition-all duration-300",
        "bg-[var(--surface-neumorphic-floating)]",
        "shadow-[var(--shadow-neumorphic-md)]",
        "border-b border-[var(--border-neumorphic-light)]",
        "backdrop-blur-xl",
      )}
      aria-hidden="true"
    >
      <div className="flex items-center space-x-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-[var(--radius-lg)]" />
        <Skeleton className="h-10 w-10 rounded-[var(--radius-lg)]" />
      </div>
    </div>
  );
};

export const ChatListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="space-y-3 p-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex items-center space-x-4 rounded-[var(--radius-lg)] p-4 transition-all duration-300",
            "bg-[var(--surface-neumorphic-raised)]",
            "shadow-[var(--shadow-neumorphic-sm)]",
            "border border-[var(--border-neumorphic-light)]",
            "hover:shadow-[var(--shadow-neumorphic-md)]",
          )}
        >
          <Skeleton className="h-12 w-12 flex-shrink-0 rounded-full" />
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const ComposerSkeleton: React.FC = () => {
  return (
    <div
      className={cn(
        "safe-x safe-bottom py-4 px-4 transition-all duration-300",
        "bg-[var(--surface-neumorphic-floating)]",
        "shadow-[var(--shadow-neumorphic-lg)]",
        "border-t border-[var(--border-neumorphic-light)]",
        "backdrop-blur-xl",
      )}
      aria-hidden="true"
    >
      <div className="relative flex items-end gap-3 max-w-4xl mx-auto">
        <Skeleton className="h-16 w-full rounded-[var(--radius-lg)]" />
        <Skeleton className="h-12 w-12 flex-shrink-0 rounded-[var(--radius-lg)]" />
      </div>
    </div>
  );
};

export const LoadingDots: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("flex items-center space-x-2", className)} aria-label="Lädt...">
      <div
        className={cn(
          "h-2.5 w-2.5 animate-bounce rounded-full [animation-delay:-0.4s] transition-all duration-300",
          "bg-[var(--color-text-primary)]",
          "shadow-[var(--shadow-neumorphic-sm)]",
        )}
      />
      <div
        className={cn(
          "h-2.5 w-2.5 animate-bounce rounded-full [animation-delay:-0.2s] transition-all duration-300",
          "bg-[var(--color-text-primary)]",
          "shadow-[var(--shadow-neumorphic-sm)]",
        )}
      />
      <div
        className={cn(
          "h-2.5 w-2.5 animate-bounce rounded-full transition-all duration-300",
          "bg-[var(--color-text-primary)]",
          "shadow-[var(--shadow-neumorphic-sm)]",
        )}
      />
    </div>
  );
};

export const TypingIndicator: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        // Dramatic Neomorphic Typing Indicator
        "mr-auto max-w-[min(100%,640px)] rounded-[var(--radius-lg)] p-4 transition-all duration-300",
        "bg-[var(--surface-neumorphic-floating)]",
        "shadow-[var(--shadow-neumorphic-md)]",
        "border border-[var(--border-neumorphic-light)]",
        // Enhanced animation
        "animate-pulse",
        className,
      )}
      aria-live="polite"
      aria-label="KI tippt..."
    >
      <div className="flex items-center space-x-3 text-[var(--color-text-secondary)]">
        <LoadingDots />
        <span className="text-sm font-medium">KI tippt...</span>
      </div>
    </div>
  );
};

export const SettingsSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 p-6" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "space-y-4 rounded-[var(--radius-lg)] p-6 transition-all duration-300",
            "bg-[var(--surface-neumorphic-floating)]",
            "shadow-[var(--shadow-neumorphic-md)]",
            "border border-[var(--border-neumorphic-light)]",
          )}
        >
          <Skeleton className="h-6 w-40" />
          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-[var(--radius-lg)]" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const SoftDepthSpinner: React.FC<{ size?: "sm" | "md" | "lg"; className?: string }> = ({
  size = "md",
  className,
}) => {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-10 w-10",
  };

  return (
    <div
      className={cn(
        // Dramatic Neomorphic Spinner
        "animate-spin rounded-full border-3 transition-all duration-300",
        "border-[var(--border-neumorphic-subtle)]",
        "border-t-[var(--acc1)]",
        "shadow-[var(--shadow-neumorphic-sm)]",
        // Enhanced glow effect
        "shadow-[0_0_15px_rgba(75,99,255,0.3)]",
        sizeClasses[size],
        className,
      )}
      style={{
        animation: "spin 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      }}
      aria-label="Loading..."
      aria-hidden="true"
    />
  );
};

export const SavePulse: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn(
        // Dramatic Neomorphic Save Pulse
        "h-3 w-3 animate-pulse rounded-full transition-all duration-300",
        "bg-[var(--succ)]",
        "shadow-[var(--shadow-neumorphic-sm)]",
        // Enhanced glow effect
        "shadow-[0_0_12px_rgba(34,197,94,0.4)]",
        className,
      )}
      style={{
        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      }}
      aria-label="Saving..."
      aria-hidden="true"
    />
  );
};

export const skeletonStyles = `
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
`;
