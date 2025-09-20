import * as React from "react";

import { cn } from "../../lib/utils/cn";

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        "from-slate-200 via-slate-300 to-slate-200 animate-pulse rounded-md bg-gradient-to-r bg-[length:200%_100%]",
        "dark:from-slate-700 dark:via-slate-600 dark:to-slate-700",
        className,
      )}
      style={{
        animation: "skeleton-loading 1.5s ease-in-out infinite",
      }}
      aria-hidden="true"
    >
      {children}
    </div>
  );
};

// Message skeleton for chat loading states
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

// Header skeleton
export const HeaderSkeleton: React.FC = () => {
  return (
    <div
      className="flex items-center justify-between border-b border-border-subtle p-4"
      aria-hidden="true"
    >
      <div className="flex items-center space-x-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="w-24 h-4" />
          <Skeleton className="w-16 h-3" />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="h-8 w-8 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
    </div>
  );
};

// Chat list skeleton
export const ChatListSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="space-y-2 p-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center space-x-3 rounded-lg p-3">
          <Skeleton className="h-10 w-10 flex-shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="w-32 h-4" />
              <Skeleton className="h-3 w-12" />
            </div>
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Composer skeleton
export const ComposerSkeleton: React.FC = () => {
  return (
    <div className="composer-container safe-pad safe-bottom py-3" aria-hidden="true">
      <div className="relative flex items-end gap-2">
        <Skeleton className="h-14 w-full rounded-[14px]" />
        <Skeleton className="h-11 w-11 flex-shrink-0 rounded-[14px]" />
      </div>
    </div>
  );
};

// Loading dots animation for streaming messages
export const LoadingDots: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn("flex items-center space-x-1 text-text-muted", className)}
      aria-label="Lädt..."
    >
      <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
      <div className="h-2 w-2 animate-bounce rounded-full bg-current" />
    </div>
  );
};

// Typing indicator for real-time responses
export const TypingIndicator: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn("chat-bubble chat-bubble--assistant mr-auto", className)}
      aria-live="polite"
      aria-label="KI tippt..."
    >
      <div className="flex items-center space-x-2 text-text-muted">
        <LoadingDots />
        <span className="text-sm">KI tippt...</span>
      </div>
    </div>
  );
};

// Skeleton for settings page
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

// Add skeleton animation styles to CSS
export const skeletonStyles = `
@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
`;
