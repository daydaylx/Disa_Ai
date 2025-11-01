/**
 * Optimized Typography Tokens for Disa AI
 * Reduced complexity: 15+ styles → 6 essential styles
 * Clean, readable, and consistent typography system
 */

export type OptimizedTextStyle = {
  fontSize: string;
  lineHeight: string;
  fontWeight: number;
  letterSpacing?: string;
  textTransform?: string;
};

export type OptimizedTypographyTokens = {
  fontStacks: {
    sans: string;
    mono: string;
  };
  textStyles: {
    display: OptimizedTextStyle;
    headline: OptimizedTextStyle;
    title: OptimizedTextStyle;
    body: OptimizedTextStyle;
    caption: OptimizedTextStyle;
    label: OptimizedTextStyle;
  };
};

export const optimizedTypographyTokens: OptimizedTypographyTokens = {
  fontStacks: {
    sans: '"Inter Variable", "Inter", "Segoe UI", "Helvetica Neue", Arial, system-ui, sans-serif',
    mono: '"JetBrains Mono", "Cascadia Code", "SFMono-Regular", Menlo, Consolas, monospace',
  },
  textStyles: {
    display: {
      fontSize: "2rem",
      lineHeight: "2.5rem",
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    headline: {
      fontSize: "1.5rem",
      lineHeight: "2rem",
      fontWeight: 600,
      letterSpacing: "-0.008em",
    },
    title: {
      fontSize: "1.25rem",
      lineHeight: "1.75rem",
      fontWeight: 500,
      letterSpacing: "-0.006em",
    },
    body: {
      fontSize: "1rem",
      lineHeight: "1.5rem",
      fontWeight: 400,
    },
    caption: {
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      fontWeight: 400,
      letterSpacing: "0.01em",
    },
    label: {
      fontSize: "0.75rem",
      lineHeight: "1rem",
      fontWeight: 500,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
    },
  },
};
