import React from "react";

import { cn } from "../../lib/utils";
import { Card, CardContent, type CardProps } from "./card";

interface DiscussionTopicCardProps extends Omit<CardProps, "onCardClick"> {
  /**
   * The main title/question for the discussion topic
   */
  title: string;
  /**
   * Additional hint or description about the topic
   */
  hint?: string;
  /**
   * Category or theme of the discussion (affects styling)
   */
  category?: "curiosity" | "future" | "society" | "general";
  /**
   * Whether this topic is currently selected or active
   */
  isSelected?: boolean;
  /**
   * Whether this topic is disabled/unavailable
   */
  isDisabled?: boolean;
  /**
   * Callback when the topic is clicked
   */
  onTopicClick?: (title: string) => void;
  /**
   * Additional action button (optional)
   */
  actionButton?: React.ReactNode;
}

const categoryStyles = {
  curiosity: {
    intent: "info" as const,
    className: "border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10",
  },
  future: {
    intent: "primary" as const,
    className: "border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/10",
  },
  society: {
    intent: "success" as const,
    className: "border-green-500/30 bg-green-500/5 hover:bg-green-500/10",
  },
  general: {
    intent: "default" as const,
    className: "",
  },
};

export const DiscussionTopicCard = React.forwardRef<HTMLDivElement, DiscussionTopicCardProps>(
  (
    {
      title,
      hint,
      category = "general",
      isSelected = false,
      isDisabled = false,
      onTopicClick,
      actionButton,
      className,
      ...props
    },
    ref,
  ) => {
    const categoryStyle = categoryStyles[category];

    const handleClick = () => {
      if (!isDisabled && onTopicClick) {
        onTopicClick(title);
      }
    };

    return (
      <Card
        ref={ref}
        clickable={!isDisabled}
        onCardClick={handleClick}
        intent={categoryStyle.intent}
        state={isSelected ? "selected" : isDisabled ? "disabled" : "default"}
        interactive={isDisabled ? false : "gentle"}
        padding="sm"
        elevation="surface"
        className={cn(
          "group transition-all duration-200",
          categoryStyle.className,
          "focus-visible:ring-brand/50 focus-visible:ring-2 focus-visible:ring-offset-2",
          isSelected && "ring-brand/30 ring-2",
          className,
        )}
        aria-label={`Discussion topic: ${title}`}
        role="button"
        {...props}
      >
        <CardContent className="flex flex-col gap-2 p-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3
                className={cn(
                  "text-text-strong text-sm font-medium leading-snug",
                  "break-words [hyphens:auto]",
                  isDisabled && "text-text-muted",
                )}
                lang="de"
              >
                {title}
              </h3>
              {hint && (
                <p
                  className={cn(
                    "text-text-subtle mt-1 text-xs leading-relaxed",
                    isDisabled && "text-text-muted",
                  )}
                >
                  {hint}
                </p>
              )}
            </div>
            {actionButton && <div className="flex-shrink-0">{actionButton}</div>}
          </div>

          {/* Category Badge (optional) */}
          {category !== "general" && (
            <div className="flex items-center justify-between">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                  category === "curiosity" &&
                    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
                  category === "future" &&
                    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
                  category === "society" &&
                    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
                )}
              >
                {category === "curiosity" && "🤔 Neugier"}
                {category === "future" && "🚀 Zukunft"}
                {category === "society" && "🌍 Gesellschaft"}
              </span>

              {isSelected && <span className="text-brand text-xs font-medium">✓ Ausgewählt</span>}
            </div>
          )}
        </CardContent>
      </Card>
    );
  },
);

DiscussionTopicCard.displayName = "DiscussionTopicCard";

// Loading Skeleton for DiscussionTopicCard
export const DiscussionTopicCardSkeleton = React.forwardRef<
  HTMLDivElement,
  Omit<CardProps, "state">
>(({ className, ...props }, ref) => (
  <Card
    ref={ref}
    state="loading"
    padding="sm"
    elevation="surface"
    className={cn("animate-pulse", className)}
    {...props}
  >
    <CardContent className="flex flex-col gap-2 p-0">
      <div className="h-4 w-3/4 rounded bg-surface-subtle"></div>
      <div className="h-3 w-1/2 rounded bg-surface-subtle"></div>
      <div className="mt-2 flex items-center justify-between">
        <div className="h-5 w-16 rounded-full bg-surface-subtle"></div>
        <div className="h-3 w-12 rounded bg-surface-subtle"></div>
      </div>
    </CardContent>
  </Card>
));

DiscussionTopicCardSkeleton.displayName = "DiscussionTopicCardSkeleton";

// Grid container for DiscussionTopicCards
export interface DiscussionTopicGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
}

export const DiscussionTopicGrid = React.forwardRef<HTMLDivElement, DiscussionTopicGridProps>(
  ({ children, columns = 2, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "grid gap-3",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
      role="group"
      aria-label="Discussion topics"
      {...props}
    >
      {children}
    </div>
  ),
);

DiscussionTopicGrid.displayName = "DiscussionTopicGrid";
