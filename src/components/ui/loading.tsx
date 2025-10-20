import React from "react";

import { cn } from "@/lib/utils";

interface LoadingProps {
  variant?: "dots" | "pulse" | "shimmer" | "spinner";
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function Loading({ variant = "dots", size = "md", className, text }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const dotSizes = {
    sm: "h-1 w-1",
    md: "h-2 w-2",
    lg: "h-3 w-3",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex space-x-1">
          <div className={cn(dotSizes[size], "animate-bounce rounded-full bg-accent1")} />
          <div
            className={cn(
              dotSizes[size],
              "animate-bounce rounded-full bg-accent2 [animation-delay:0.15s]",
            )}
          />
          <div
            className={cn(
              dotSizes[size],
              "animate-bounce rounded-full bg-accent1 [animation-delay:0.3s]",
            )}
          />
        </div>
        {text && <span className={cn(textSizes[size], "animate-pulse text-text-1")}>{text}</span>}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className={cn(sizeClasses[size], "animate-pulse rounded-full bg-accent1")} />
        {text && <span className={cn(textSizes[size], "animate-pulse text-text-1")}>{text}</span>}
      </div>
    );
  }

  if (variant === "shimmer") {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <div className="from-accent1/20 via-accent1/60 to-accent1/20 animate-shimmer h-2 w-24 rounded-full bg-gradient-to-r" />
        {text && (
          <span className={cn(textSizes[size], "mt-1 block animate-pulse text-text-1")}>
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === "spinner") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div
          className={cn(
            sizeClasses[size],
            "border-accent1/20 animate-spin rounded-full border-2 border-t-accent1",
          )}
        />
        {text && <span className={cn(textSizes[size], "text-text-1")}>{text}</span>}
      </div>
    );
  }

  return null;
}

interface LoadingBubbleProps {
  text?: string;
  className?: string;
}

export function LoadingBubble({ text = "Disa denkt nach...", className }: LoadingBubbleProps) {
  return (
    <div className={cn("animate-fade-in flex justify-start", className)}>
      <div className="glass glass--subtle mr-12 max-w-[85%] rounded-base border border-border/80 p-4">
        <div className="flex items-center space-x-3">
          <Loading variant="dots" size="md" />
          <span className="animate-pulse text-sm text-text-1">{text}</span>
        </div>
        {/* Subtle shimmer effect */}
        <div className="from-accent1/20 via-accent1/40 to-accent1/20 animate-shimmer mt-2 h-1 rounded-full bg-gradient-to-r" />
      </div>
    </div>
  );
}

interface LoadingCardProps {
  title?: string;
  className?: string;
  children?: React.ReactNode;
}

export function LoadingCard({ title = "Laden...", className, children }: LoadingCardProps) {
  return (
    <div className={cn("surface-card animate-fade-in", className)}>
      {(title || children) && (
        <div className="space-y-4 p-6">
          {title && (
            <div className="from-text-1/20 to-text-1/40 animate-shimmer h-6 w-1/3 rounded bg-gradient-to-r" />
          )}
          {children || (
            <>
              <div className="space-y-2">
                <div className="from-text-1/20 to-text-1/40 animate-shimmer h-4 rounded bg-gradient-to-r" />
                <div className="from-text-1/20 to-text-1/40 animate-shimmer h-4 w-5/6 rounded bg-gradient-to-r" />
                <div className="from-text-1/20 to-text-1/40 animate-shimmer h-4 w-4/6 rounded bg-gradient-to-r" />
              </div>
              <div className="flex gap-2 pt-2">
                <div className="from-accent1/20 to-accent1/40 animate-shimmer h-8 w-20 rounded bg-gradient-to-r" />
                <div className="from-accent2/20 to-accent2/40 animate-shimmer h-8 w-16 rounded bg-gradient-to-r" />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
