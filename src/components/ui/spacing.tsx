import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils";

// Spacing utility components for consistent spacing
interface SpacingProps {
  className?: string;
  children?: React.ReactNode;
}

// Stack component for vertical spacing
interface StackProps extends SpacingProps {
  direction?: "vertical" | "horizontal";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
}

const stackVariants = cva("flex", {
  variants: {
    direction: {
      vertical: "flex-col",
      horizontal: "flex-row",
    },
    gap: {
      none: "gap-0",
      xs: "gap-1", // 8px
      sm: "gap-2", // 16px
      md: "gap-3", // 24px
      lg: "gap-4", // 32px
      xl: "gap-6", // 48px
      "2xl": "gap-8", // 64px
      "3xl": "gap-12", // 96px
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
  },
  defaultVariants: {
    direction: "vertical",
    gap: "md",
    align: "stretch",
    justify: "start",
  },
});

export function Stack({
  direction = "vertical",
  gap = "md",
  align = "stretch",
  justify = "start",
  wrap = false,
  className,
  children,
}: StackProps) {
  return (
    <div
      className={cn(
        stackVariants({ direction, gap, align, justify }),
        wrap && "flex-wrap",
        className,
      )}
    >
      {children}
    </div>
  );
}

// Inline component for horizontal spacing
interface InlineProps extends SpacingProps {
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  align?: "start" | "center" | "end" | "baseline";
  wrap?: boolean;
}

const inlineVariants = cva("flex flex-row", {
  variants: {
    gap: {
      none: "gap-0",
      xs: "gap-1", // 8px
      sm: "gap-2", // 16px
      md: "gap-3", // 24px
      lg: "gap-4", // 32px
      xl: "gap-6", // 48px
      "2xl": "gap-8", // 64px
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      baseline: "items-baseline",
    },
  },
  defaultVariants: {
    gap: "sm",
    align: "center",
  },
});

export function Inline({
  gap = "sm",
  align = "center",
  wrap = false,
  className,
  children,
}: InlineProps) {
  return (
    <div className={cn(inlineVariants({ gap, align }), wrap && "flex-wrap", className)}>
      {children}
    </div>
  );
}

// Spacer component for flexible spacing
interface SpacerProps {
  size?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  direction?: "vertical" | "horizontal";
  className?: string;
}

const spacerSizes = {
  none: "0",
  xs: "8px",
  sm: "16px",
  md: "24px",
  lg: "32px",
  xl: "48px",
  "2xl": "64px",
  "3xl": "96px",
};

export function Spacer({ size = "md", direction = "vertical", className }: SpacerProps) {
  const sizeValue = spacerSizes[size];

  if (direction === "vertical") {
    return <div className={cn("w-full", className)} style={{ height: sizeValue }} />;
  } else {
    return <div className={cn("h-full", className)} style={{ width: sizeValue }} />;
  }
}

// Flex container for more complex layouts
interface FlexProps extends SpacingProps {
  direction?: "row" | "col";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

const flexVariants = cva("flex", {
  variants: {
    direction: {
      row: "flex-row",
      col: "flex-col",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    wrap: {
      true: "flex-wrap",
      false: "flex-nowrap",
    },
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-3",
      lg: "gap-4",
      xl: "gap-6",
      "2xl": "gap-8",
    },
  },
  defaultVariants: {
    direction: "row",
    align: "stretch",
    justify: "start",
    wrap: false,
    gap: "none",
  },
});

export function Flex({
  direction = "row",
  align = "stretch",
  justify = "start",
  wrap = false,
  gap = "none",
  className,
  children,
}: FlexProps) {
  return (
    <div className={cn(flexVariants({ direction, align, justify, wrap, gap }), className)}>
      {children}
    </div>
  );
}

// Grid component wrapper for consistency
export function Grid({
  children,
  className,
  gap = "md",
  ...props
}: React.ComponentProps<"div"> & { gap?: SpacingProps["gap"] }) {
  const gapClasses = {
    none: "gap-0",
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-3",
    lg: "gap-4",
    xl: "gap-6",
    "2xl": "gap-8",
  };

  return (
    <div className={cn("grid", gapClasses[gap], className)} {...props}>
      {children}
    </div>
  );
}
