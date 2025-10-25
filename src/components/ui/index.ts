export * from "./avatar";
export * from "./badge";
export * from "./button";
export * from "./chip";
export * from "./dialog";
export * from "./dropdown-menu";
export * from "./input";
export * from "./select";
export * from "./StaticSurfaceSection";
export * from "./table";
export * from "./tabs";
export * from "./textarea";
export * from "./tooltip";

// Card System - explicit exports to avoid conflicts
export type { CardProps } from "./card";
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
export type { ModelCardProps } from "./ModelCard";
export { ModelCard } from "./ModelCard";

// Enhanced Card System
export type {
  CardVariantProps,
  ConversationCardProps,
  ModelCardProps as ModelCardTypeProps,
} from "./card-types";
export * from "./DiscussionTopicCard";
export * from "./InteractiveCard";
export * from "./StatusCard";

// Modal and Drawer Components
export * from "./drawer";
export * from "./modal";

// Card System Utilities
export const CardUtils = {
  /**
   * Checks if a card state allows interaction
   */
  isInteractable: (state?: "default" | "loading" | "disabled" | "selected" | "focus"): boolean => {
    return state !== "disabled" && state !== "loading";
  },

  /**
   * Gets the appropriate cursor style for a card configuration
   */
  getCursorStyle: (
    clickable?: boolean,
    state?: "default" | "loading" | "disabled" | "selected" | "focus",
  ): string => {
    if (!clickable) return "";
    if (state === "disabled") return "cursor-not-allowed";
    if (state === "loading") return "cursor-wait";
    return "cursor-pointer";
  },

  /**
   * Determines if a card should have focus styles
   */
  shouldShowFocus: (
    clickable?: boolean,
    state?: "default" | "loading" | "disabled" | "selected" | "focus",
  ): boolean => {
    return Boolean(clickable && CardUtils.isInteractable(state));
  },
} as const;
