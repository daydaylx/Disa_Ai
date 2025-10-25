import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "../../lib/utils";
import type { CategoryKey } from "../../styles/tokens/category-tonal-scales";
import { getCategoryData, normalizeCategoryKey } from "../../utils/category-mapping";

const chipVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Subtle variants using 100-level backgrounds for chips
        subtle: "border-transparent",
        // Outlined variants using 300-level borders
        outline: "bg-transparent",
        // Filled variants using 500-level backgrounds
        filled: "border-transparent text-white",
        // Soft variants using 50-level backgrounds with 200-level borders
        soft: "",
      },
      size: {
        xs: "text-[10px] px-1.5 py-0.5 gap-1",
        sm: "text-[11px] px-2 py-0.5 gap-1",
        md: "text-xs px-2.5 py-1 gap-1.5",
        lg: "text-sm px-3 py-1.5 gap-2",
      },
      category: {
        alltag: "",
        business: "",
        kreativ: "",
        bildung: "",
        familie: "",
        beratung: "",
        "model-premium": "",
        "model-alltag": "",
      } as Record<CategoryKey, string>,
    },
    compoundVariants: [
      // Subtle variants for each category
      {
        variant: "subtle",
        category: "alltag",
        class:
          "bg-[var(--role-accent-alltag-100)] text-[var(--role-accent-alltag-800)] border-[var(--role-accent-alltag-200)]",
      },
      {
        variant: "subtle",
        category: "business",
        class:
          "bg-[var(--role-accent-business-100)] text-[var(--role-accent-business-800)] border-[var(--role-accent-business-200)]",
      },
      {
        variant: "subtle",
        category: "kreativ",
        class:
          "bg-[var(--role-accent-kreativ-100)] text-[var(--role-accent-kreativ-800)] border-[var(--role-accent-kreativ-200)]",
      },
      {
        variant: "subtle",
        category: "bildung",
        class:
          "bg-[var(--role-accent-bildung-100)] text-[var(--role-accent-bildung-800)] border-[var(--role-accent-bildung-200)]",
      },
      {
        variant: "subtle",
        category: "familie",
        class:
          "bg-[var(--role-accent-familie-100)] text-[var(--role-accent-familie-800)] border-[var(--role-accent-familie-200)]",
      },
      {
        variant: "subtle",
        category: "beratung",
        class:
          "bg-[var(--role-accent-beratung-100)] text-[var(--role-accent-beratung-800)] border-[var(--role-accent-beratung-200)]",
      },
      {
        variant: "subtle",
        category: "model-premium",
        class:
          "bg-[var(--role-accent-model-premium-100)] text-[var(--role-accent-model-premium-800)] border-[var(--role-accent-model-premium-200)]",
      },
      {
        variant: "subtle",
        category: "model-alltag",
        class:
          "bg-[var(--role-accent-model-alltag-100)] text-[var(--role-accent-model-alltag-800)] border-[var(--role-accent-model-alltag-200)]",
      },

      // Outline variants for each category
      {
        variant: "outline",
        category: "alltag",
        class:
          "border-[var(--role-accent-alltag-300)] text-[var(--role-accent-alltag-700)] hover:bg-[var(--role-accent-alltag-50)]",
      },
      {
        variant: "outline",
        category: "business",
        class:
          "border-[var(--role-accent-business-300)] text-[var(--role-accent-business-700)] hover:bg-[var(--role-accent-business-50)]",
      },
      {
        variant: "outline",
        category: "kreativ",
        class:
          "border-[var(--role-accent-kreativ-300)] text-[var(--role-accent-kreativ-700)] hover:bg-[var(--role-accent-kreativ-50)]",
      },
      {
        variant: "outline",
        category: "bildung",
        class:
          "border-[var(--role-accent-bildung-300)] text-[var(--role-accent-bildung-700)] hover:bg-[var(--role-accent-bildung-50)]",
      },
      {
        variant: "outline",
        category: "familie",
        class:
          "border-[var(--role-accent-familie-300)] text-[var(--role-accent-familie-700)] hover:bg-[var(--role-accent-familie-50)]",
      },
      {
        variant: "outline",
        category: "beratung",
        class:
          "border-[var(--role-accent-beratung-300)] text-[var(--role-accent-beratung-700)] hover:bg-[var(--role-accent-beratung-50)]",
      },
      {
        variant: "outline",
        category: "model-premium",
        class:
          "border-[var(--role-accent-model-premium-300)] text-[var(--role-accent-model-premium-700)] hover:bg-[var(--role-accent-model-premium-50)]",
      },
      {
        variant: "outline",
        category: "model-alltag",
        class:
          "border-[var(--role-accent-model-alltag-300)] text-[var(--role-accent-model-alltag-700)] hover:bg-[var(--role-accent-model-alltag-50)]",
      },

      // Filled variants for each category
      {
        variant: "filled",
        category: "alltag",
        class: "bg-[var(--role-accent-alltag-500)] text-[var(--role-accent-alltag-50)]",
      },
      {
        variant: "filled",
        category: "business",
        class: "bg-[var(--role-accent-business-500)] text-[var(--role-accent-business-50)]",
      },
      {
        variant: "filled",
        category: "kreativ",
        class: "bg-[var(--role-accent-kreativ-500)] text-[var(--role-accent-kreativ-50)]",
      },
      {
        variant: "filled",
        category: "bildung",
        class: "bg-[var(--role-accent-bildung-500)] text-[var(--role-accent-bildung-50)]",
      },
      {
        variant: "filled",
        category: "familie",
        class: "bg-[var(--role-accent-familie-500)] text-[var(--role-accent-familie-50)]",
      },
      {
        variant: "filled",
        category: "beratung",
        class: "bg-[var(--role-accent-beratung-500)] text-[var(--role-accent-beratung-50)]",
      },
      {
        variant: "filled",
        category: "model-premium",
        class:
          "bg-[var(--role-accent-model-premium-500)] text-[var(--role-accent-model-premium-50)]",
      },
      {
        variant: "filled",
        category: "model-alltag",
        class: "bg-[var(--role-accent-model-alltag-500)] text-[var(--role-accent-model-alltag-50)]",
      },

      // Soft variants for each category (ultra-subtle)
      {
        variant: "soft",
        category: "alltag",
        class:
          "bg-[var(--role-accent-alltag-50)] text-[var(--role-accent-alltag-900)] border-[var(--role-accent-alltag-100)]",
      },
      {
        variant: "soft",
        category: "business",
        class:
          "bg-[var(--role-accent-business-50)] text-[var(--role-accent-business-900)] border-[var(--role-accent-business-100)]",
      },
      {
        variant: "soft",
        category: "kreativ",
        class:
          "bg-[var(--role-accent-kreativ-50)] text-[var(--role-accent-kreativ-900)] border-[var(--role-accent-kreativ-100)]",
      },
      {
        variant: "soft",
        category: "bildung",
        class:
          "bg-[var(--role-accent-bildung-50)] text-[var(--role-accent-bildung-900)] border-[var(--role-accent-bildung-100)]",
      },
      {
        variant: "soft",
        category: "familie",
        class:
          "bg-[var(--role-accent-familie-50)] text-[var(--role-accent-familie-900)] border-[var(--role-accent-familie-100)]",
      },
      {
        variant: "soft",
        category: "beratung",
        class:
          "bg-[var(--role-accent-beratung-50)] text-[var(--role-accent-beratung-900)] border-[var(--role-accent-beratung-100)]",
      },
      {
        variant: "soft",
        category: "model-premium",
        class:
          "bg-[var(--role-accent-model-premium-50)] text-[var(--role-accent-model-premium-900)] border-[var(--role-accent-model-premium-100)]",
      },
      {
        variant: "soft",
        category: "model-alltag",
        class:
          "bg-[var(--role-accent-model-alltag-50)] text-[var(--role-accent-model-alltag-900)] border-[var(--role-accent-model-alltag-100)]",
      },
    ],
    defaultVariants: {
      variant: "subtle",
      size: "md",
      category: "alltag",
    },
  },
);

export interface ChipProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "category">,
    Omit<VariantProps<typeof chipVariants>, "category"> {
  /**
   * Category for the chip - can be a CategoryKey or any string that will be normalized
   */
  category?: string | CategoryKey;
  /**
   * Whether to show the category icon
   */
  showIcon?: boolean;
  /**
   * Whether to show a colored dot indicator
   */
  showDot?: boolean;
  /**
   * Whether the chip is removable (shows × button)
   */
  removable?: boolean;
  /**
   * Callback when remove button is clicked
   */
  onRemove?: () => void;
}

function Chip({
  className,
  variant,
  size,
  category: categoryProp,
  showIcon = false,
  showDot = false,
  removable = false,
  onRemove,
  children,
  ...props
}: ChipProps) {
  const categoryKey = normalizeCategoryKey(categoryProp);
  const categoryData = getCategoryData(categoryKey);

  return (
    <div
      className={cn(chipVariants({ variant, size, category: categoryKey }), className)}
      {...props}
    >
      {showIcon && (
        <span className="flex-shrink-0" aria-label={`${categoryData.label} Icon`}>
          {categoryData.icon}
        </span>
      )}

      {showDot && (
        <span
          className={cn(
            "flex-shrink-0 rounded-full",
            size === "xs"
              ? "w-1 h-1"
              : size === "sm"
                ? "w-1.5 h-1.5"
                : size === "lg"
                  ? "w-2.5 h-2.5"
                  : "w-2 h-2",
          )}
          style={{
            backgroundColor: `var(--role-accent-${categoryKey}-500)`,
          }}
          aria-hidden="true"
        />
      )}

      <span className="truncate">{children}</span>

      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className={cn(
            "flex-shrink-0 rounded-full hover:bg-black/10 focus:outline-none focus:bg-black/10 transition-colors",
            size === "xs"
              ? "w-3 h-3"
              : size === "sm"
                ? "w-3.5 h-3.5"
                : size === "lg"
                  ? "w-5 h-5"
                  : "w-4 h-4",
          )}
          aria-label={`${children} entfernen`}
        >
          <svg className="w-full h-full" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
        </button>
      )}
    </div>
  );
}

export { Chip, chipVariants };
