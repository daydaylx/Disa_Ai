/**
 * Typography tokens aligned with Fluent 2.
 * Sizes are expressed in rem to keep scaling responsive.
 */

export type FontStackTokens = {
  sans: string;
  mono: string;
  numeric: string;
};

export type TextStyle = {
  fontSize: string;
  lineHeight: string;
  fontWeight: number;
  letterSpacing?: string;
  textTransform?: string;
};

export type TypographyTokens = {
  fontStacks: FontStackTokens;
  textStyles: {
    display: TextStyle;
    headline: TextStyle;
    title: TextStyle;
    subtitle: TextStyle;
    body: TextStyle;
    bodyStrong: TextStyle;
    bodySmall: TextStyle;
    caption: TextStyle;
    label: TextStyle;
    mono: TextStyle;
  };
  cardTextStyles: {
    titleHero: TextStyle;
    titleLg: TextStyle;
    titleBase: TextStyle;
    titleSm: TextStyle;
    descriptionLg: TextStyle;
    descriptionBase: TextStyle;
    descriptionSm: TextStyle;
    metadata: TextStyle;
    label: TextStyle;
  };
  fixedSizes: {
    badge: string;
    input: string;
  };
};

export const typographyTokens: TypographyTokens = {
  fontStacks: {
    sans: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, system-ui, sans-serif',
    mono: '"JetBrains Mono", "Cascadia Code", "SFMono-Regular", Menlo, Consolas, monospace',
    numeric: '"Plus Jakarta Sans", "Segoe UI", system-ui, sans-serif',
  },
  textStyles: {
    display: {
      fontSize: "2rem",
      lineHeight: "2.5rem",
      fontWeight: 700,
      letterSpacing: "-0.01em",
      textTransform: "none",
    },
    headline: {
      fontSize: "1.75rem",
      lineHeight: "2.1875rem",
      fontWeight: 700,
      letterSpacing: "-0.008em",
      textTransform: "none",
    },
    title: {
      fontSize: "1.5rem",
      lineHeight: "1.875rem",
      fontWeight: 600,
      letterSpacing: "-0.006em",
      textTransform: "none",
    },
    subtitle: {
      fontSize: "1.25rem",
      lineHeight: "1.5rem",
      fontWeight: 600,
      letterSpacing: "-0.002em",
      textTransform: "none",
    },
    body: {
      fontSize: "1rem",
      lineHeight: "1.5rem",
      fontWeight: 400,
      letterSpacing: "0em",
      textTransform: "none",
    },
    bodyStrong: {
      fontSize: "1rem",
      lineHeight: "1.5rem",
      fontWeight: 600,
      letterSpacing: "0em",
      textTransform: "none",
    },
    bodySmall: {
      fontSize: "0.875rem",
      lineHeight: "1.3125rem",
      fontWeight: 400,
      letterSpacing: "0em",
      textTransform: "none",
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: "1.125rem",
      fontWeight: 600,
      letterSpacing: "0.02em",
      textTransform: "none",
    },
    label: {
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      fontWeight: 600,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
    },
    mono: {
      fontSize: "0.875rem",
      lineHeight: "1.3rem",
      fontWeight: 400,
      letterSpacing: "0em",
      textTransform: "none",
    },
  },
  cardTextStyles: {
    titleHero: {
      fontSize: "1.5rem",
      lineHeight: "1.875rem",
      fontWeight: 600,
      letterSpacing: "-0.008em",
      textTransform: "none",
    },
    titleLg: {
      fontSize: "1.25rem",
      lineHeight: "1.5rem",
      fontWeight: 600,
      letterSpacing: "-0.006em",
      textTransform: "none",
    },
    titleBase: {
      fontSize: "1.125rem",
      lineHeight: "1.5rem",
      fontWeight: 600,
      letterSpacing: "-0.004em",
      textTransform: "none",
    },
    titleSm: {
      fontSize: "1rem",
      lineHeight: "1.375rem",
      fontWeight: 600,
      letterSpacing: "-0.002em",
      textTransform: "none",
    },
    descriptionLg: {
      fontSize: "1rem",
      lineHeight: "1.5rem",
      fontWeight: 400,
      letterSpacing: "0em",
      textTransform: "none",
    },
    descriptionBase: {
      fontSize: "0.875rem",
      lineHeight: "1.35rem",
      fontWeight: 400,
      letterSpacing: "0em",
      textTransform: "none",
    },
    descriptionSm: {
      fontSize: "0.75rem",
      lineHeight: "1.125rem",
      fontWeight: 400,
      letterSpacing: "0.02em",
      textTransform: "none",
    },
    metadata: {
      fontSize: "0.75rem",
      lineHeight: "1.125rem",
      fontWeight: 600,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    },
    label: {
      fontSize: "0.75rem",
      lineHeight: "1.125rem",
      fontWeight: 600,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
    },
  },
  fixedSizes: {
    badge: "0.75rem",
    input: "1rem",
  },
};

export const typographyCssVars = {
  fontStacks: {
    sans: "--font-family-sans",
    mono: "--font-family-mono",
    numeric: "--font-family-numeric",
  },
  textStyles: {
    display: {
      fontSize: "--font-size-display",
      lineHeight: "--line-height-display",
      fontWeight: "--font-weight-display",
      letterSpacing: "--letter-spacing-display",
      textTransform: "--text-transform-display",
    },
    headline: {
      fontSize: "--font-size-headline",
      lineHeight: "--line-height-headline",
      fontWeight: "--font-weight-headline",
      letterSpacing: "--letter-spacing-headline",
    },
    title: {
      fontSize: "--font-size-title",
      lineHeight: "--line-height-title",
      fontWeight: "--font-weight-title",
      letterSpacing: "--letter-spacing-title",
    },
    subtitle: {
      fontSize: "--font-size-subtitle",
      lineHeight: "--line-height-subtitle",
      fontWeight: "--font-weight-subtitle",
    },
    body: {
      fontSize: "--font-size-body",
      lineHeight: "--line-height-body",
      fontWeight: "--font-weight-body",
    },
    bodyStrong: {
      fontSize: "--font-size-body-strong",
      lineHeight: "--line-height-body-strong",
      fontWeight: "--font-weight-body-strong",
    },
    bodySmall: {
      fontSize: "--font-size-body-small",
      lineHeight: "--line-height-body-small",
      fontWeight: "--font-weight-body-small",
    },
    caption: {
      fontSize: "--font-size-caption",
      lineHeight: "--line-height-caption",
      fontWeight: "--font-weight-caption",
      letterSpacing: "--letter-spacing-caption",
    },
    label: {
      fontSize: "--font-size-label",
      lineHeight: "--line-height-label",
      fontWeight: "--font-weight-label",
      letterSpacing: "--letter-spacing-label",
      textTransform: "--text-transform-label",
    },
    mono: {
      fontSize: "--font-size-mono",
      lineHeight: "--line-height-mono",
      fontWeight: "--font-weight-mono",
    },
  },
  cardTextStyles: {
    titleHero: {
      fontSize: "--font-size-title-hero",
      lineHeight: "--line-height-title-hero",
      fontWeight: "--font-weight-title-hero",
      letterSpacing: "--letter-spacing-title-hero",
      textTransform: "--text-transform-title-hero",
    },
    titleLg: {
      fontSize: "--font-size-title-lg",
      lineHeight: "--line-height-title-lg",
      fontWeight: "--font-weight-title-lg",
      letterSpacing: "--letter-spacing-title-lg",
      textTransform: "--text-transform-title-lg",
    },
    titleBase: {
      fontSize: "--font-size-title-base",
      lineHeight: "--line-height-title-base",
      fontWeight: "--font-weight-title-base",
      letterSpacing: "--letter-spacing-title-base",
      textTransform: "--text-transform-title-base",
    },
    titleSm: {
      fontSize: "--font-size-title-sm",
      lineHeight: "--line-height-title-sm",
      fontWeight: "--font-weight-title-sm",
      letterSpacing: "--letter-spacing-title-sm",
      textTransform: "--text-transform-title-sm",
    },
    descriptionLg: {
      fontSize: "--font-size-description-lg",
      lineHeight: "--line-height-description-lg",
      fontWeight: "--font-weight-description-lg",
      letterSpacing: "--letter-spacing-description-lg",
      textTransform: "--text-transform-description-lg",
    },
    descriptionBase: {
      fontSize: "--font-size-description-base",
      lineHeight: "--line-height-description-base",
      fontWeight: "--font-weight-description-base",
      letterSpacing: "--letter-spacing-description-base",
      textTransform: "--text-transform-description-base",
    },
    descriptionSm: {
      fontSize: "--font-size-description-sm",
      lineHeight: "--line-height-description-sm",
      fontWeight: "--font-weight-description-sm",
      letterSpacing: "--letter-spacing-description-sm",
      textTransform: "--text-transform-description-sm",
    },
    metadata: {
      fontSize: "--font-size-metadata",
      lineHeight: "--line-height-metadata",
      fontWeight: "--font-weight-metadata",
      letterSpacing: "--letter-spacing-metadata",
      textTransform: "--text-transform-metadata",
    },
    label: {
      fontSize: "--font-size-card-label",
      lineHeight: "--line-height-card-label",
      fontWeight: "--font-weight-card-label",
      letterSpacing: "--letter-spacing-card-label",
      textTransform: "--text-transform-card-label",
    },
  },
  fixedSizes: {
    badge: "--font-size-badge",
    input: "--font-size-input",
  },
} as const;
