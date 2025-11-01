/**
 * Enhanced Card System Types
 *
 * Comprehensive TypeScript definitions for the card component system.
 * Provides type safety and IntelliSense support for all card variants.
 */

import { type VariantProps } from "class-variance-authority";
import * as React from "react";

import { type cardVariants } from "./card";

// Re-export the generated variant props
export type CardVariantProps = VariantProps<typeof cardVariants>;

// Core card interface
export interface BaseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Custom CSS classes to merge with card variants
   */
  className?: string;

  /**
   * Ref forwarding for the card element
   */
  ref?: React.Ref<HTMLDivElement>;
}

// Extended card interface with interaction support
export interface ExtendedCardProps extends BaseCardProps, CardVariantProps {
  /**
   * Whether the card should be rendered as a clickable element
   * @default false
   */
  clickable?: boolean;

  /**
   * Callback fired when the card is clicked (only if clickable=true)
   */
  onCardClick?: (event: React.MouseEvent<HTMLDivElement>) => void;

  /**
   * ARIA label for accessibility when clickable
   */
  "aria-label"?: string;
}

// Status card types
export type StatusType = "loading" | "success" | "error" | "warning" | "info";

// StatusCardProps are defined in ./StatusCard.tsx

// Discussion topic card types
export type DiscussionCategory = "curiosity" | "future" | "society" | "general";

// DiscussionTopicCardProps are defined in ./DiscussionTopicCard.tsx

// Interactive card with advanced features
export interface AdvancedInteractiveCardProps
  extends Omit<ExtendedCardProps, "clickable" | "onCardClick"> {
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
   * @default false
   */
  selectable?: boolean;

  /**
   * Whether the card is currently selected
   * @default false
   */
  selected?: boolean;

  /**
   * Whether to show a chevron indicating clickability
   * @default false
   */
  showChevron?: boolean;

  /**
   * Whether to show a menu button
   * @default false
   */
  showMenu?: boolean;

  /**
   * Menu items (for dropdown)
   */
  menuItems?: MenuItem[];

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
   * @default false
   */
  isLoading?: boolean;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
}

// Menu item interface
export interface MenuItem {
  /**
   * Display text for the menu item
   */
  label: string;

  /**
   * Callback when menu item is clicked
   */
  onClick: () => void;

  /**
   * Optional icon element
   */
  icon?: React.ReactNode;

  /**
   * Whether the menu item is disabled
   * @default false
   */
  disabled?: boolean;
}

// Model card specific props are defined in ./ModelCard.tsx

// ConversationCardProps are defined in ./InteractiveCard.tsx

// Grid layout props
export interface CardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of columns in the grid
   * @default 2
   */
  columns?: 1 | 2 | 3 | 4;

  /**
   * Child elements (typically cards)
   */
  children: React.ReactNode;
}

// Animation and transition types
export type InteractionType = CardVariantProps["interactive"];
export type IntentType = CardVariantProps["intent"];
export type StateType = CardVariantProps["state"];
export type ToneType = CardVariantProps["tone"];
export type ElevationType = CardVariantProps["elevation"];
export type PaddingType = CardVariantProps["padding"];
export type SizeType = CardVariantProps["size"];

// Compound variant combinations for advanced use cases
export interface CardVariantCombination {
  tone?: ToneType;
  elevation?: ElevationType;
  interactive?: InteractionType;
  padding?: PaddingType;
  size?: SizeType;
  intent?: IntentType;
  state?: StateType;
}

// Utility type for card event handlers
export type CardEventHandler = (event: React.MouseEvent<HTMLDivElement>) => void;
export type CardKeyboardEventHandler = (event: React.KeyboardEvent<HTMLDivElement>) => void;

// Props for card sub-components
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

// Helper type for conditional props based on clickable state
export type ConditionalCardProps<T extends boolean> = T extends true
  ? Required<Pick<ExtendedCardProps, "onCardClick" | "aria-label">>
  : Partial<Pick<ExtendedCardProps, "onCardClick" | "aria-label">>;

// All types are already exported above, no need for re-export

// Constants for type checking and validation
export const STATUS_TYPES = ["loading", "success", "error", "warning", "info"] as const;
export const DISCUSSION_CATEGORIES = ["curiosity", "future", "society", "general"] as const;
export const INTERACTION_TYPES = ["gentle", "dramatic", "subtle", "press", "lift", "glow"] as const;
export const INTENT_TYPES = [
  "default",
  "primary",
  "secondary",
  "warning",
  "error",
  "success",
  "info",
] as const;
export const STATE_TYPES = ["default", "loading", "disabled", "selected", "focus"] as const;
