import * as React from "react";

import { cn } from "../../lib/cn";

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, children }) => {
  return (
    <div className={cn("bg-surface-subtle animate-pulse rounded-md", className)} aria-hidden="true">
      {children}
    </div>
  );
};

export const MessageSkeleton: React.FC<{ isUser?: boolean }> = ({ isUser = false }) => {
  return (
    <div
      className={cn(
        "chat-bubble",
        isUser ? "chat-bubble--user ml-auto" : "chat-bubble--assistant mr-auto",
      )}
      aria-hidden="true"
    >
      <div className="space-y-2">
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
      className="border-border flex items-center justify-between border-b p-4"
      aria-hidden="true"
    >
      <div className="flex items-center space-x-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </div>
  );
};

export const ChatListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="space-y-2 p-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 rounded-lg p-3">
          <Skeleton className="h-10 w-10 flex-shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-12" />
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
    <div className="composer-container safe-x safe-bottom py-3" aria-hidden="true">
      <div className="relative flex items-end gap-2">
        <Skeleton className="h-14 w-full rounded-lg" />
        <Skeleton className="h-11 w-11 flex-shrink-0 rounded-lg" />
      </div>
    </div>
  );
};

export const LoadingDots: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn("flex items-center space-x-1.5", className)} aria-label="Lädt...">
      <div className="bg-text-1 h-2 w-2 animate-bounce rounded-full [animation-delay:-0.4s]" />
      <div className="bg-text-1 h-2 w-2 animate-bounce rounded-full [animation-delay:-0.2s]" />
      <div className="bg-text-1 h-2 w-2 animate-bounce rounded-full" />
    </div>
  );
};

export const TypingIndicator: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn("chat-bubble chat-bubble--assistant mr-auto", className)}
      aria-live="polite"
      aria-label="KI tippt..."
    >
      <div className="text-text-secondary flex items-center space-x-2">
        <LoadingDots />
        <span className="text-sm">KI tippt...</span>
      </div>
    </div>
  );
};

export const SettingsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 p-4" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-3 w-3/4" />
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
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div
      className={cn(
        "border-border border-t-brand animate-spin rounded-full border-2",
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
      className={cn("bg-success h-2 w-2 animate-pulse rounded-full", className)}
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
`;
