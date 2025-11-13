import { cn } from "../../lib/utils";

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    initial?: 1 | 2 | 3 | 4 | 6 | 12;
    sm?: 1 | 2 | 3 | 4 | 6 | 12;
    md?: 1 | 2 | 3 | 4 | 6 | 12;
    lg?: 1 | 2 | 3 | 4 | 6 | 12;
  };
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
}

export function Grid({
  children,
  className,
  cols = { initial: 1, sm: 1, md: 2, lg: 3 },
  gap = "md",
  align = "stretch",
  justify = "start",
}: GridProps) {
  // Build responsive column classes
  const colClasses: string[] = [];

  if (cols.initial) colClasses.push(`grid-cols-${cols.initial}`);
  if (cols.sm) colClasses.push(`sm:grid-cols-${cols.sm}`);
  if (cols.md) colClasses.push(`md:grid-cols-${cols.md}`);
  if (cols.lg) colClasses.push(`lg:grid-cols-${cols.lg}`);

  // Gap classes mapping
  const gapClasses = {
    none: "gap-0",
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  // Alignment classes
  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
  };

  // Justification classes
  const justifyClasses = {
    start: "justify-items-start",
    center: "justify-items-center",
    end: "justify-items-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  return (
    <div
      className={cn(
        "grid",
        colClasses.join(" "),
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        className,
      )}
    >
      {children}
    </div>
  );
}

// Preset grid components for common use cases
interface CardGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    initial?: 1 | 2 | 3 | 4;
    sm?: 1 | 2 | 3 | 4;
    md?: 1 | 2 | 3 | 4;
    lg?: 1 | 2 | 3 | 4;
  };
}

export function CardGrid({
  children,
  className,
  cols = { initial: 1, sm: 2, md: 2, lg: 3 },
}: CardGridProps) {
  return (
    <Grid cols={cols} gap="md" align="stretch" className={cn("w-full", className)}>
      {children}
    </Grid>
  );
}

interface FeatureGridProps {
  children: React.ReactNode;
  className?: string;
}

export function FeatureGrid({ children, className }: FeatureGridProps) {
  return (
    <Grid
      cols={{ initial: 1, sm: 1, md: 2, lg: 3 }}
      gap="lg"
      align="start"
      className={cn("w-full", className)}
    >
      {children}
    </Grid>
  );
}

interface ListGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    initial?: 1 | 2;
    sm?: 1 | 2;
    md?: 1 | 2 | 3;
    lg?: 1 | 2 | 3 | 4;
  };
}

export function ListGrid({
  children,
  className,
  cols = { initial: 1, md: 2, lg: 3 },
}: ListGridProps) {
  return (
    <Grid cols={cols} gap="sm" align="start" className={cn("w-full", className)}>
      {children}
    </Grid>
  );
}
