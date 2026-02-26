import { cva, type VariantProps } from "class-variance-authority";

/**
 * Pill Select Trigger Variants
 * Type-safe pill component styles for role/model selectors
 */
export const selectTriggerVariants = cva(
  // Base styles
  "flex items-center justify-center gap-2 font-medium leading-none transition-colors",
  {
    variants: {
      // Size variants
      size: {
        compact: "h-7 px-2 text-[10px]",
        default: "h-9 px-3 text-xs",
      },
      // Visual variant (role vs model styling)
      variant: {
        role: "rounded-2xl border border-[var(--card-border-color-focus)] bg-brand-secondary/10 text-ink-primary shadow-[var(--card-shadow-focus)]",
        model:
          "rounded-full border border-white/8 bg-surface-1/40 text-ink-tertiary hover:border-white/12 hover:bg-surface-1/60 hover:text-ink-secondary",
      },
      // State variants
      state: {
        default: "",
        active: "",
      },
    },
    compoundVariants: [
      // Active role gets special styling
      {
        variant: "role",
        state: "active",
        className: "text-ink-primary",
      },
      // Model hover state
      {
        variant: "model",
        state: "default",
        className: "hover:border-white/12 hover:bg-surface-1/60 hover:text-ink-secondary",
      },
    ],
    defaultVariants: {
      size: "compact",
      variant: "model",
      state: "default",
    },
  },
);

export type SelectTriggerVariantProps = VariantProps<typeof selectTriggerVariants>;

/**
 * Quickstart Chip Variants
 * For quickstart suggestion chips in empty state
 */
export const quickstartChipVariants = cva(
  // Base styles
  "inline-flex items-center gap-1.5 flex-shrink-0 snap-start cursor-pointer touch-manipulation transition-all duration-150",
  {
    variants: {
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4 text-sm",
      },
      variant: {
        default:
          "rounded-full border border-white/8 bg-surface-1/40 text-ink-secondary hover:bg-surface-1/60 hover:border-white/12 hover:text-ink-primary active:bg-surface-1/80 active:scale-[0.98]",
      },
    },
    defaultVariants: {
      size: "sm",
      variant: "default",
    },
  },
);

export type QuickstartChipVariantProps = VariantProps<typeof quickstartChipVariants>;
