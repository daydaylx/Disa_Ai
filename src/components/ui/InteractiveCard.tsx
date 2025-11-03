import { ChevronRight, MoreHorizontal } from "lucide-react";
import React, { useState } from "react";

import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Card, CardContent, CardFooter, CardHeader, type CardProps, CardTitle } from "./card";

interface InteractiveCardProps extends Omit<CardProps, "clickable" | "onCardClick"> {
  /**
   * Main title of the card
   */
  title: string;
  /**
   * Subtitle or description
   */
  subtitle?: string;
  /**
   * Leading element (icon, avatar, etc.)
   */
  leading?: React.ReactNode;
  /**
   * Trailing element (badge, button, etc.)
   */
  trailing?: React.ReactNode;
  /**
   * Main content area
   */
  children?: React.ReactNode;
  /**
   * Action buttons in footer
   */
  actions?: React.ReactNode;
  /**
   * Whether the card is selectable
   */
  selectable?: boolean;
  /**
   * Whether the card is currently selected
   */
  selected?: boolean;
  /**
   * Whether to show a chevron indicating clickability
   */
  showChevron?: boolean;
  /**
   * Whether to show a menu button
   */
  showMenu?: boolean;
  /**
   * Menu items (for dropdown)
   */
  menuItems?: Array<{
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
  }>;
  /**
   * Callback when card is clicked
   */
  onCardClick?: () => void;
  /**
   * Callback when selection changes
   */
  onSelectionChange?: (selected: boolean) => void;
  /**
   * Loading state
   */
  isLoading?: boolean;
  /**
   * Disabled state
   */
  disabled?: boolean;
}

export const InteractiveCard = React.forwardRef<HTMLDivElement, InteractiveCardProps>(
  (
    {
      title,
      subtitle,
      leading,
      trailing,
      children,
      actions,
      selectable = false,
      selected = false,
      showChevron = false,
      showMenu = false,
      menuItems = [],
      onCardClick,
      onSelectionChange,
      isLoading = false,
      disabled = false,
      className,
      ...props
    },
    ref,
  ) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleCardClick = () => {
      if (disabled || isLoading) return;

      if (selectable) {
        const newSelected = !selected;
        onSelectionChange?.(newSelected);
      }

      onCardClick?.();
    };

    const handleMenuClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsMenuOpen(!isMenuOpen);
    };

    const isClickable = !disabled && !isLoading && (!!onCardClick || selectable);

    return (
      <Card
        ref={ref}
        clickable={isClickable}
        onCardClick={handleCardClick}
        state={isLoading ? "loading" : disabled ? "disabled" : selected ? "selected" : "default"}
        interactive={isClickable ? "gentle" : false}
        elevation="subtle"
        padding="none"
        className={cn("relative overflow-visible", className)}
        {...props}
      >
        <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-4">
          {/* Selection indicator */}
          {selectable && (
            <div className="flex-shrink-0">
              <div
                className={cn(
                  "h-4 w-4 rounded border-2 transition-colors",
                  selected ? "bg-brand border-brand" : "hover:border-brand border-border-strong",
                )}
              >
                {selected && (
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                )}
              </div>
            </div>
          )}

          {/* Leading content */}
          {leading && <div className="flex-shrink-0">{leading}</div>}

          {/* Title and subtitle */}
          <div className="min-w-0 flex-1">
            <CardTitle className="text-text-strong truncate text-base leading-snug">
              {title}
            </CardTitle>
            {subtitle && <p className="mt-1 truncate text-sm text-text-muted">{subtitle}</p>}
          </div>

          {/* Trailing content */}
          <div className="flex flex-shrink-0 items-center gap-2">
            {trailing}

            {showMenu && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleMenuClick}
                  disabled={disabled || isLoading}
                  aria-label="More options"
                  className="h-8 w-8"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>

                {/* Simple dropdown menu */}
                {isMenuOpen && menuItems.length > 0 && (
                  <div className="border-border absolute right-0 top-full z-10 mt-2 w-48 rounded-lg border bg-surface-popover shadow-neo-xl">
                    {menuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.stopPropagation();
                          item.onClick();
                          setIsMenuOpen(false);
                        }}
                        disabled={item.disabled}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm first:rounded-t-lg last:rounded-b-lg hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {showChevron && (
              <ChevronRight
                className={cn(
                  "h-4 w-4 text-text-muted transition-transform",
                  selected && "rotate-90",
                )}
              />
            )}
          </div>
        </CardHeader>

        {/* Main content */}
        {children && <CardContent className="px-4 pb-4 pt-0">{children}</CardContent>}

        {/* Footer actions */}
        {actions && (
          <CardFooter className="border-t border-border-divider px-4 py-3">
            <div className="flex w-full items-center justify-between gap-3">{actions}</div>
          </CardFooter>
        )}

        {/* Click overlay for better accessibility when disabled */}
        {(disabled || isLoading) && isClickable && (
          <div className="absolute inset-0 cursor-not-allowed bg-transparent" />
        )}
      </Card>
    );
  },
);

InteractiveCard.displayName = "InteractiveCard";

// Specialized variants can be added here if needed
// Note: Dedicated ModelCard component exists in ./ModelCard.tsx

export interface ConversationCardProps extends Omit<InteractiveCardProps, "title" | "subtitle"> {
  conversationTitle: string;
  lastMessage?: string;
  timestamp?: Date;
  messageCount?: number;
  isActive?: boolean;
  onSelectConversation?: () => void;
  onDeleteConversation?: () => void;
}

export const ConversationCard = React.forwardRef<HTMLDivElement, ConversationCardProps>(
  (
    {
      conversationTitle,
      lastMessage,
      timestamp,
      messageCount,
      isActive = false,
      onSelectConversation,
      onDeleteConversation,
      ...props
    },
    ref,
  ) => {
    const menuItems = onDeleteConversation
      ? [
          {
            label: "Delete Conversation",
            onClick: onDeleteConversation,
            icon: <span className="text-status-error">🗑️</span>,
          },
        ]
      : [];

    return (
      <InteractiveCard
        ref={ref}
        title={conversationTitle}
        subtitle={lastMessage}
        trailing={
          <div className="text-right">
            {messageCount && (
              <div className="mb-1 text-xs text-text-muted">{messageCount} messages</div>
            )}
            {timestamp && (
              <div className="text-xs text-text-muted">{timestamp.toLocaleDateString()}</div>
            )}
          </div>
        }
        selected={isActive}
        onCardClick={onSelectConversation}
        showMenu={menuItems.length > 0}
        menuItems={menuItems}
        intent={isActive ? "primary" : "default"}
        {...props}
      />
    );
  },
);

ConversationCard.displayName = "ConversationCard";
