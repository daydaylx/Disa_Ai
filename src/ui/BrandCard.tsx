import { cva, type VariantProps } from "class-variance-authority";
import {
  type ButtonHTMLAttributes,
  type CSSProperties,
  forwardRef,
  type HTMLAttributes,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";

const brandCardVariants = cva("brand-card", {
  variants: {
    variant: {
      plain: "brand-card--plain",
      tinted: "brand-card--tinted",
      roleStrong: "brand-card--role",
    },
    interactive: {
      true: "brand-card--interactive",
      false: "",
    },
    padding: {
      none: "p-0",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    },
  },
  defaultVariants: {
    variant: "tinted",
    interactive: false,
    padding: "md",
  },
});

export interface BrandCardProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof brandCardVariants> {
  as?: "div" | "button" | "article" | "section";
  /**
   * Custom tint color in `r, g, b` format (e.g. "139, 92, 246").
   * Falls back to design token defaults when omitted.
   */
  tintRgb?: string;
}

export const BrandCard = forwardRef<HTMLDivElement, BrandCardProps>(
  (
    { as = "div", variant, interactive, padding, tintRgb, className, children, style, ...props },
    ref,
  ) => {
    const mergedStyle = tintRgb
      ? ({ "--card-tint-rgb": tintRgb, ...style } as CSSProperties)
      : style;
    const classes = cn(brandCardVariants({ variant, interactive, padding }), className);

    if (as === "button") {
      return (
        <button
          ref={ref as Ref<HTMLButtonElement>}
          type="button"
          className={classes}
          style={mergedStyle}
          {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {children}
        </button>
      );
    }

    if (as === "article") {
      return (
        <article ref={ref} className={classes} style={mergedStyle} {...props}>
          {children}
        </article>
      );
    }

    if (as === "section") {
      return (
        <section ref={ref} className={classes} style={mergedStyle} {...props}>
          {children}
        </section>
      );
    }

    return (
      <div ref={ref} className={classes} style={mergedStyle} {...props}>
        {children}
      </div>
    );
  },
);

BrandCard.displayName = "BrandCard";
