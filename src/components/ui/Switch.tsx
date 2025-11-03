import React from "react";

import { cn } from "../../lib/utils";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  disabled?: boolean;
  "aria-describedby"?: string;
  /** Size variant for different scales */
  size?: "sm" | "md" | "lg";
  /** Variant for different visual intensity */
  variant?: "default" | "dramatic";
}

const switchSizes = {
  sm: {
    track: "h-5 w-9",
    thumb: "h-3.5 w-3.5",
    checkedTranslate: "translate-x-4",
    uncheckedTranslate: "translate-x-0.5",
  },
  md: {
    track: "h-6 w-11",
    thumb: "h-4 w-4",
    checkedTranslate: "translate-x-6",
    uncheckedTranslate: "translate-x-1",
  },
  lg: {
    track: "h-8 w-14",
    thumb: "h-6 w-6",
    checkedTranslate: "translate-x-7",
    uncheckedTranslate: "translate-x-1",
  },
};

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    { checked, onChange, id, disabled = false, "aria-describedby": describedBy, size = "md" },
    ref,
  ) => {
    const handleClick = () => {
      if (!disabled) {
        onChange(!checked);
      }
    };

    const sizeConfig = switchSizes[size];

    return (
      <button
        ref={ref}
        id={id}
        role="switch"
        aria-checked={checked}
        aria-describedby={describedBy}
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          // Base Layout
          "relative inline-flex items-center rounded-full",
          sizeConfig.track,

          // Neomorphic Track Foundation (Inset/Groove Effect)
          "bg-[var(--surface-neumorphic-base)]",
          "shadow-[var(--shadow-inset-strong)]",
          "border-[var(--border-neumorphic-dark)]",

          // Checked State Track (Illuminated Groove)
          checked &&
            [
              "bg-gradient-to-r from-[var(--acc1)] to-[var(--acc2)]",
              "shadow-[var(--shadow-inset-medium)]",
              "border-[var(--border-neumorphic-light)]",
            ].join(" "),

          // Hover State
          "hover:shadow-[var(--shadow-inset-extreme)]",

          // Focus State (Dramatic Neomorphic)
          "focus-visible:outline-none",
          "focus-visible:shadow-[var(--shadow-focus-neumorphic)]",
          "focus-visible:border-[var(--acc1)]",

          // Interactive States
          "transition-all duration-300 ease-out",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",

          // Dark Mode
          "dark:bg-[var(--surface-neumorphic-base)]",
          "dark:border-[var(--border-neumorphic-dark)]",
        )}
      >
        {/* Dramatic Neomorphic Thumb */}
        <span
          className={cn(
            // Base Thumb Structure
            "inline-block rounded-full transform transition-all duration-300 ease-out",
            sizeConfig.thumb,

            // Position Animation
            checked ? sizeConfig.checkedTranslate : sizeConfig.uncheckedTranslate,

            // Neomorphic Thumb Foundation (Highly Raised)
            "bg-[var(--surface-neumorphic-floating)]",
            "shadow-[var(--shadow-neumorphic-lg)]",
            "border-[var(--border-neumorphic-light)]",

            // Gradient Overlay for Enhanced Depth
            "bg-gradient-to-br from-white to-[var(--surface-neumorphic-raised)]",

            // Checked State Thumb (Enhanced Illumination)
            checked &&
              [
                "shadow-[var(--shadow-neumorphic-xl)]",
                "bg-gradient-to-br from-white via-[var(--surface-neumorphic-floating)] to-[var(--acc1)]",
                "border-[var(--acc1)]",
              ].join(" "),

            // Interactive States
            !disabled &&
              [
                // Hover: Subtle lift effect
                "hover:shadow-[var(--shadow-neumorphic-xl)]",
                "hover:scale-105",

                // Active: Press effect
                "active:shadow-[var(--shadow-neumorphic-md)]",
                "active:scale-95",
              ].join(" "),

            // Disabled State
            disabled &&
              ["shadow-[var(--shadow-neumorphic-sm)]", "bg-[var(--surface-neumorphic-base)]"].join(
                " ",
              ),

            // Dark Mode Optimization
            "dark:bg-gradient-to-br dark:from-[var(--surface-neumorphic-floating)] dark:to-[var(--surface-neumorphic-base)]",
            "dark:border-[var(--border-neumorphic-light)]",
          )}
        >
          {/* Inner highlight for extreme depth perception */}
          <span
            className={cn(
              "absolute inset-1 rounded-full",
              "bg-gradient-to-br from-white/40 to-transparent",
              "transition-opacity duration-300",
              checked ? "opacity-60" : "opacity-30",
            )}
          />
        </span>

        {/* Track Inner Light Effect */}
        <span
          className={cn(
            "absolute inset-1 rounded-full",
            "bg-gradient-to-br from-white/10 to-transparent",
            "pointer-events-none",
            "transition-opacity duration-300",
            checked ? "opacity-40" : "opacity-0",
          )}
        />
      </button>
    );
  },
);

Switch.displayName = "Switch";
