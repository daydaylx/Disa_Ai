import { forwardRef } from "react";

import { cn } from "../../lib/utils";

// Typography variants basierend auf design-tokens.css
export type TypographyVariant =
  | "h1" // --text-4xl (36px) Display Titles
  | "h2" // --text-3xl (30px) Hero Titles
  | "h3" // --text-2xl (24px) Page Titles (Seitentitel groß & bold)
  | "h4" // --text-xl (20px) Section Titles
  | "h5" // --text-lg (18px) Subtitle
  | "h6" // --text-base (16px) Larger Body
  | "body-lg" // --text-base (16px) Larger Body
  | "body" // --text-sm (14px) Body, Standard
  | "body-sm" // --text-sm (14px) Body, Standard (alias)
  | "body-xs" // --text-xs (12px) Caption, Meta
  | "caption" // --text-xs (12px) Caption, Meta (alias)
  | "small"; // --text-xs (12px) Small text

export type TypographyElement =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "div"
  | "small"
  | "li";

interface TypographyProps {
  variant?: TypographyVariant;
  as?: TypographyElement;
  className?: string;
  children: React.ReactNode;
}

// Variant-to-element mapping für semantische HTML-Struktur
const variantElementMap: Record<TypographyVariant, TypographyElement> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  "body-lg": "p",
  body: "p",
  "body-sm": "p",
  "body-xs": "span",
  caption: "span",
  small: "small",
};

// Variant-to-CSS mapping basierend auf design-tokens.css
const variantStyleMap: Record<TypographyVariant, string> = {
  // Headings
  h1: "text-[var(--text-4xl)] font-bold leading-[var(--leading-tight)]", // 36px Display
  h2: "text-[var(--text-3xl)] font-bold leading-[var(--leading-tight)]", // 30px Hero
  h3: "text-[var(--text-2xl)] font-semibold leading-[var(--leading-tight)]", // 24px Page Titles
  h4: "text-[var(--text-xl)] font-semibold leading-[var(--leading-normal)]", // 20px Section
  h5: "text-[var(--text-lg)] font-medium leading-[var(--leading-normal)]", // 18px Subtitle
  h6: "text-[var(--text-base)] font-medium leading-[var(--leading-normal)]", // 16px

  // Body text
  "body-lg": "text-[var(--text-base)] leading-[var(--leading-normal)]", // 16px Larger Body
  body: "text-[var(--text-sm)] leading-[var(--leading-normal)]", // 14px Standard Body
  "body-sm": "text-[var(--text-sm)] leading-[var(--leading-normal)]", // 14px (alias)
  "body-xs": "text-[var(--text-xs)] leading-[var(--leading-normal)]", // 12px Caption
  caption: "text-[var(--text-xs)] leading-[var(--leading-normal)]", // 12px (alias)
  small: "text-[var(--text-xs)] leading-[var(--leading-normal)]", // 12px Small
};

export const Typography = forwardRef<
  HTMLElement,
  TypographyProps & React.HTMLAttributes<HTMLElement>
>(({ variant = "body", as, className, children, ...props }, ref) => {
  // Wähle das HTML-Element: explizit über 'as' prop oder aus variant-mapping
  const Element = as || variantElementMap[variant];

  // Kombiniere Basis-Styles mit variant-spezifischen Styles
  const classes = cn(
    // Basis text color (kann über className überschrieben werden)
    "text-[var(--text-primary)]",
    // Variant-spezifische Styles
    variantStyleMap[variant],
    // Zusätzliche Custom-Classes
    className,
  );

  return (
    <Element ref={ref as any} className={classes} {...props}>
      {children}
    </Element>
  );
});

Typography.displayName = "Typography";

// Export für einfache Verwendung
export default Typography;
