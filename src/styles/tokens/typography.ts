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
  fixedSizes: {
    badge: string;
    input: string;
  };
};

export const typographyTokens: TypographyTokens = {
  fontStacks: {
    sans: '"Segoe UI Variable", "Segoe UI", Inter, "Helvetica Neue", Helvetica, Arial, system-ui, sans-serif',
    mono: '"Cascadia Code", "Fira Code", "SFMono-Regular", Menlo, Consolas, monospace',
    numeric: '"Segoe UI Variable", "Segoe UI", Inter, system-ui, sans-serif',
  },
  textStyles: {
    display: {
      fontSize: "2.25rem",
      lineHeight: "2.75rem",
      fontWeight: 600,
      letterSpacing: "-0.01em",
      textTransform: "none",
    },
    headline: {
      fontSize: "1.75rem",
      lineHeight: "2.25rem",
      fontWeight: 600,
      letterSpacing: "-0.008em",
      textTransform: "none",
    },
    title: {
      fontSize: "1.5rem",
      lineHeight: "2rem",
      fontWeight: 600,
      letterSpacing: "-0.006em",
      textTransform: "none",
    },
    subtitle: {
      fontSize: "1.25rem",
      lineHeight: "1.75rem",
      fontWeight: 500,
      letterSpacing: "0em",
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
      fontSize: "0.9375rem",
      lineHeight: "1.375rem",
      fontWeight: 400,
      letterSpacing: "0em",
      textTransform: "none",
    },
    caption: {
      fontSize: "0.8125rem",
      lineHeight: "1.125rem",
      fontWeight: 500,
      letterSpacing: "0.01em",
      textTransform: "none",
    },
    label: {
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      fontWeight: 600,
      letterSpacing: "0.02em",
      textTransform: "uppercase",
    },
    mono: {
      fontSize: "0.9375rem",
      lineHeight: "1.375rem",
      fontWeight: 400,
      letterSpacing: "0em",
      textTransform: "none",
    },
  },
  fixedSizes: {
    badge: "0.6875rem" /* 11px equivalent */,
    input: "1rem" /* 16px */,
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
  fixedSizes: {
    badge: "--font-size-badge",
    input: "--font-size-input",
  },
} as const;
