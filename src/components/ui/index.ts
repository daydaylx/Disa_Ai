export * from "./Accordion";
export * from "./avatar";
export * from "./badge";
export * from "./BottomSheet";
export * from "./button";
export * from "./chip";
export * from "./CommandPalette";
export * from "./CopyButton";
export * from "./Dialog";
export * from "./drawer-sheet";
export * from "./dropdown-menu";
export * from "./FloatingInput";
export * from "./HeroOrb";
export * from "./HolographicOrb";
export * from "./Icon";
export * from "./input";
export * from "./LazyImage";
export { LoadingCard as UILoadingCard } from "./loading";
export * from "./MessageBubble";
export * from "./select";
export * from "./separator";
export * from "./Skeleton";
export * from "./StaticSurfaceSection";
export * from "./StatusCard";
export * from "./Switch";
export * from "./table";
export * from "./tabs";
export * from "./textarea";
export * from "./Toast";
export * from "./tooltip";
export * from "./VirtualList";

// Card System - explicit exports to avoid conflicts
export type { CardProps } from "./card";
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
export type { ModelCardProps } from "./ModelCard";
export { ModelCard } from "./ModelCard";

// Enhanced Card System
export type {
  CardVariantProps,
  // ModelCardProps are defined in ./ModelCard.tsx and exported above
} from "./card-types";
export * from "./DiscussionTopicCard";
export * from "./StatusCard";

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
