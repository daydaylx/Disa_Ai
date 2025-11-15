import { cn } from "../../lib/utils";

interface GridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    initial?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  };
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  autoFlow?: "row" | "col" | "dense" | "row-dense" | "col-dense";
}

export function Grid({
  children,
  className,
  cols = { initial: 1, sm: 1, md: 2, lg: 3 },
  gap = "md",
  align = "stretch",
  justify = "start",
  autoFlow = "row",
}: GridProps) {
  // Build responsive column classes
  const colClasses: string[] = [];

  if (cols.initial) colClasses.push(`grid-cols-${cols.initial}`);
  if (cols.sm) colClasses.push(`sm:grid-cols-${cols.sm}`);
  if (cols.md) colClasses.push(`md:grid-cols-${cols.md}`);
  if (cols.lg) colClasses.push(`lg:grid-cols-${cols.lg}`);
  if (cols.xl) colClasses.push(`xl:grid-cols-${cols.xl}`);

  // Enhanced gap classes mapping (8px base system)
  const gapClasses = {
    none: "gap-0",
    xs: "gap-1", // 8px
    sm: "gap-2", // 16px
    md: "gap-3", // 24px
    lg: "gap-4", // 32px
    xl: "gap-6", // 48px
    "2xl": "gap-8", // 64px
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

  // Auto flow classes
  const autoFlowClasses = {
    row: "grid-flow-row",
    col: "grid-flow-col",
    dense: "grid-flow-dense",
    "row-dense": "grid-flow-row-dense",
    "col-dense": "grid-flow-col-dense",
  };

  return (
    <div
      className={cn(
        "grid",
        colClasses.join(" "),
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        autoFlowClasses[autoFlow],
        className,
      )}
    >
      {children}
    </div>
  );
}

// Enhanced Container System
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  center?: boolean;
  padding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
}

export function Container({
  children,
  className,
  size = "lg",
  center = true,
  padding = "md",
}: ContainerProps) {
  const sizeClasses = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    "2xl": "max-w-7xl",
    full: "max-w-full",
  };

  const paddingClasses = {
    none: "p-0",
    xs: "px-3 py-2",
    sm: "px-4 py-3",
    md: "px-6 py-4",
    lg: "px-8 py-6",
    xl: "px-12 py-8",
  };

  return (
    <div
      className={cn(
        "w-full",
        sizeClasses[size],
        center && "mx-auto",
        paddingClasses[padding],
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
    initial?: 1 | 2 | 3 | 4 | 5 | 6;
    sm?: 1 | 2 | 3 | 4 | 5 | 6;
    md?: 1 | 2 | 3 | 4 | 5 | 6;
    lg?: 1 | 2 | 3 | 4 | 5 | 6;
    xl?: 1 | 2 | 3 | 4 | 5 | 6;
  };
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

export function CardGrid({
  children,
  className,
  cols = { initial: 1, sm: 2, md: 2, lg: 3, xl: 4 },
  gap = "lg",
}: CardGridProps) {
  return (
    <Grid cols={cols} gap={gap} align="stretch" className={cn("w-full", className)}>
      {children}
    </Grid>
  );
}

interface FeatureGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    initial?: 1 | 2 | 3 | 4;
    sm?: 1 | 2 | 3 | 4;
    md?: 1 | 2 | 3 | 4;
    lg?: 1 | 2 | 3 | 4;
    xl?: 1 | 2 | 3 | 4;
  };
}

export function FeatureGrid({
  children,
  className,
  cols = { initial: 1, md: 2, lg: 3 },
}: FeatureGridProps) {
  return (
    <Grid cols={cols} gap="xl" align="start" className={cn("w-full", className)}>
      {children}
    </Grid>
  );
}

interface ListGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    initial?: 1 | 2 | 3;
    sm?: 1 | 2 | 3;
    md?: 1 | 2 | 3 | 4;
    lg?: 1 | 2 | 3 | 4 | 5 | 6;
  };
  gap?: "none" | "xs" | "sm" | "md" | "lg";
}

export function ListGrid({
  children,
  className,
  cols = { initial: 1, md: 2, lg: 3 },
  gap = "md",
}: ListGridProps) {
  return (
    <Grid cols={cols} gap={gap} align="start" className={cn("w-full", className)}>
      {children}
    </Grid>
  );
}

// Dashboard Grid for complex layouts
interface DashboardGridProps {
  children: React.ReactNode;
  className?: string;
  sidebar?: "left" | "right" | "none";
  sidebarWidth?: "sm" | "md" | "lg" | "xl";
  gap?: "sm" | "md" | "lg" | "xl";
}

export function DashboardGrid({
  children,
  className,
  sidebar = "left",
  sidebarWidth = "md",
  gap = "lg",
}: DashboardGridProps) {
  const gapClasses = {
    sm: "gap-3",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  const sidebarWidthClasses = {
    sm: "w-64",
    md: "w-80",
    lg: "w-96",
    xl: "w-[28rem]",
  };

  if (sidebar === "none") {
    return <div className={cn("flex flex-col", gapClasses[gap], className)}>{children}</div>;
  }

  return (
    <div className={cn("flex gap-6", gapClasses[gap], className)}>
      {sidebar === "left" && (
        <aside className={cn("flex-shrink-0", sidebarWidthClasses[sidebarWidth])}>
          {/* Sidebar content would be passed as first child */}
          {Array.isArray(children) ? children[0] : children}
        </aside>
      )}
      <main className="flex-1 min-w-0">
        {/* Main content */}
        {Array.isArray(children) ? children[1] || children[0] : children}
      </main>
      {sidebar === "right" && (
        <aside className={cn("flex-shrink-0", sidebarWidthClasses[sidebarWidth])}>
          {/* Sidebar content would be passed as first child */}
          {Array.isArray(children) ? children[0] : children}
        </aside>
      )}
    </div>
  );
}

// Hero Section Layout
interface HeroLayoutProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
  variant?: "default" | "large" | "compact";
  background?: "default" | "gradient" | "surface" | "glass";
}

export function HeroLayout({
  children,
  className,
  align = "center",
  variant = "default",
  background = "default",
}: HeroLayoutProps) {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const variantClasses = {
    default: "py-16 md:py-20",
    large: "py-20 md:py-24 lg:py-32",
    compact: "py-8 md:py-12",
  };

  const backgroundClasses = {
    default: "",
    gradient:
      "bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-primary-100)] dark:from-[var(--color-primary-950)] dark:to-[var(--color-primary-900)]",
    surface: "bg-[var(--surface-card)]",
    glass: "bg-[var(--layer-glass-panel)] backdrop-blur-[var(--backdrop-blur-medium)]",
  };

  return (
    <section
      className={cn("relative", variantClasses[variant], backgroundClasses[background], className)}
    >
      <Container padding="lg" className={alignClasses[align]}>
        {children}
      </Container>
    </section>
  );
}
