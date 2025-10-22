export * from "./avatar";
export * from "./badge";
export * from "./button";
export * from "./card";
export * from "./dialog";
export * from "./dropdown-menu";
export * from "./input";
export * from "./ModelCard";
export * from "./select";
export * from "./StaticSurfaceSection";
export * from "./table";
export * from "./tabs";
export * from "./textarea";
export * from "./tooltip";

// Enhanced Card System
export * from "./card-types";
export * from "./DiscussionTopicCard";
export * from "./InteractiveCard";
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
