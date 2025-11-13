import { cn } from "../../lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "narrow" | "wide" | "full";
  padding?: "none" | "sm" | "md" | "lg";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  background?: "default" | "elevated" | "surface";
  minHeight?: "screen" | "dvh" | "none";
}

const layoutVariants = {
  container: {
    default: "max-w-4xl",
    narrow: "max-w-2xl",
    wide: "max-w-6xl",
    full: "max-w-full",
  },
  padding: {
    none: "p-0",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  },
  gap: {
    none: "gap-0",
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  },
  minHeight: {
    screen: "min-h-screen",
    dvh: "min-h-[100dvh]",
    none: "",
  },
  background: {
    default: "bg-[var(--surface-bg)] text-[var(--text-primary)]",
    elevated: "bg-[var(--surface-card)] text-[var(--text-primary)]",
    surface: "bg-[var(--surface-base)] text-[var(--text-primary)]",
  },
};

export function Layout({
  children,
  className,
  variant = "default",
  padding = "md",
  gap = "md",
  background = "default",
  minHeight = "dvh",
}: LayoutProps) {
  const containerClass = layoutVariants.container[variant];
  const paddingClass = layoutVariants.padding[padding];
  const gapClass = layoutVariants.gap[gap];
  const minHeightClass = layoutVariants.minHeight[minHeight];
  const backgroundClass = layoutVariants.background[background];

  return (
    <div className={cn("flex flex-col", minHeightClass, backgroundClass, className)}>
      <div
        className={cn(
          "relative z-10 mx-auto w-full",
          containerClass,
          paddingClass,
          gapClass,
          "flex-1 flex flex-col",
        )}
      >
        {children}
      </div>
    </div>
  );
}

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "card" | "surface" | "elevated";
  padding?: "none" | "xs" | "sm" | "md" | "lg";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
}

export function Section({
  children,
  className,
  variant = "default",
  padding = "md",
  gap = "md",
}: SectionProps) {
  const variantClasses = {
    default: "",
    card: "rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--surface-card)]",
    surface: "bg-[var(--surface-base)]",
    elevated: "bg-[var(--surface-card)] shadow-[var(--shadow-1)] rounded-[var(--radius-md)]",
  };

  const paddingClasses = {
    none: "p-0",
    xs: "p-2",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const gapClasses = {
    none: "gap-0",
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  return (
    <div
      className={cn(
        variantClasses[variant],
        paddingClasses[padding],
        gapClasses[gap],
        "flex flex-col",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface ContentAreaProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "full-width" | "centered" | "sidebar";
  padding?: "none" | "sm" | "md" | "lg";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
}

export function ContentArea({
  children,
  className,
  variant = "default",
  padding = "md",
  gap = "md",
}: ContentAreaProps) {
  const variantClasses = {
    default: "w-full",
    "full-width": "w-full max-w-full",
    centered: "w-full max-w-2xl mx-auto",
    sidebar: "flex",
  };

  const paddingClasses = {
    none: "p-0",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const gapClasses = {
    none: "gap-0",
    xs: "gap-1",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };

  return (
    <div
      className={cn(
        "flex flex-col",
        variantClasses[variant],
        paddingClasses[padding],
        gapClasses[gap],
        className,
      )}
    >
      {children}
    </div>
  );
}
