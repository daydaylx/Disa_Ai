import { cn } from "../../lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "narrow" | "wide" | "full" | "container";
  padding?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  background?: "default" | "elevated" | "surface" | "glass" | "gradient";
  minHeight?: "screen" | "dvh" | "auto" | "none";
  center?: boolean;
}

const layoutVariants = {
  container: {
    default: "max-w-4xl",
    narrow: "max-w-2xl",
    wide: "max-w-6xl",
    full: "max-w-full",
    container: "max-w-7xl",
  },
  padding: {
    none: "p-0",
    xs: "px-3 py-2", // 24px/16px
    sm: "px-4 py-3", // 32px/24px
    md: "px-6 py-4", // 48px/32px
    lg: "px-8 py-6", // 64px/48px
    xl: "px-12 py-8", // 96px/64px
    "2xl": "px-16 py-12", // 128px/96px
  },
  gap: {
    none: "gap-0",
    xs: "gap-1", // 8px
    sm: "gap-2", // 16px
    md: "gap-3", // 24px
    lg: "gap-4", // 32px
    xl: "gap-6", // 48px
    "2xl": "gap-8", // 64px
  },
  minHeight: {
    screen: "min-h-screen",
    dvh: "min-h-[100dvh]",
    auto: "min-h-auto",
    none: "",
  },
  background: {
    default: "bg-[var(--surface-bg)] text-[var(--text-primary)]",
    elevated: "bg-[var(--surface-card)] text-[var(--text-primary)] shadow-[var(--shadow-light)]",
    surface: "bg-[var(--surface-base)] text-[var(--text-primary)]",
    glass:
      "bg-[var(--layer-glass-panel)] backdrop-blur-[var(--backdrop-blur-medium)] text-[var(--text-primary)]",
    gradient:
      "bg-gradient-to-br from-[var(--color-primary-50)] to-[var(--color-primary-100)] dark:from-[var(--color-primary-950)] dark:to-[var(--color-primary-900)] text-[var(--text-primary)]",
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
  center = true,
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
          "relative z-10 w-full",
          center && "mx-auto",
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
  variant?: "default" | "card" | "surface" | "elevated" | "glass" | "bordered";
  padding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  rounded?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
}

export function Section({
  children,
  className,
  variant = "default",
  padding = "md",
  gap = "md",
  rounded = "md",
}: SectionProps) {
  const variantClasses = {
    default: "",
    card: "bg-[var(--surface-card)] border border-[var(--border-muted)]",
    surface: "bg-[var(--surface-base)]",
    elevated:
      "bg-[var(--surface-card)] shadow-[var(--shadow-light)] border border-[var(--border-subtle)]",
    glass:
      "bg-[var(--layer-glass-panel)] backdrop-blur-[var(--backdrop-blur-medium)] border border-[var(--glass-border-soft)]",
    bordered: "border-2 border-[var(--border-default)]",
  };

  const paddingClasses = {
    none: "p-0",
    xs: "px-3 py-2", // 24px/16px
    sm: "px-4 py-3", // 32px/24px
    md: "px-6 py-4", // 48px/32px
    lg: "px-8 py-6", // 64px/48px
    xl: "px-12 py-8", // 96px/64px
  };

  const gapClasses = {
    none: "gap-0",
    xs: "gap-1", // 8px
    sm: "gap-2", // 16px
    md: "gap-3", // 24px
    lg: "gap-4", // 32px
    xl: "gap-6", // 48px
    "2xl": "gap-8", // 64px
  };

  const roundedClasses = {
    none: "rounded-none",
    xs: "rounded-[var(--radius-xs)]",
    sm: "rounded-[var(--radius-sm)]",
    md: "rounded-[var(--radius-md)]",
    lg: "rounded-[var(--radius-lg)]",
    xl: "rounded-[var(--radius-xl)]",
  };

  return (
    <div
      className={cn(
        "flex flex-col",
        variantClasses[variant],
        paddingClasses[padding],
        gapClasses[gap],
        roundedClasses[rounded],
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
  variant?: "default" | "full-width" | "centered" | "sidebar" | "narrow" | "wide";
  padding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "none";
}

export function ContentArea({
  children,
  className,
  variant = "default",
  padding = "md",
  gap = "md",
  maxWidth = "none",
}: ContentAreaProps) {
  const variantClasses = {
    default: "w-full",
    "full-width": "w-full max-w-full",
    centered: "w-full mx-auto",
    sidebar: "flex",
    narrow: "w-full max-w-2xl mx-auto",
    wide: "w-full max-w-6xl mx-auto",
  };

  const maxWidthClasses = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    "2xl": "max-w-7xl",
    full: "max-w-full",
    none: "",
  };

  const paddingClasses = {
    none: "p-0",
    xs: "px-3 py-2", // 24px/16px
    sm: "px-4 py-3", // 32px/24px
    md: "px-6 py-4", // 48px/32px
    lg: "px-8 py-6", // 64px/48px
    xl: "px-12 py-8", // 96px/64px
  };

  const gapClasses = {
    none: "gap-0",
    xs: "gap-1", // 8px
    sm: "gap-2", // 16px
    md: "gap-3", // 24px
    lg: "gap-4", // 32px
    xl: "gap-6", // 48px
    "2xl": "gap-8", // 64px
  };

  return (
    <div
      className={cn(
        "flex flex-col",
        variantClasses[variant],
        maxWidth !== "none" && maxWidthClasses[maxWidth],
        paddingClasses[padding],
        gapClasses[gap],
        className,
      )}
    >
      {children}
    </div>
  );
}

// Professional Page Header Component
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  className?: string;
  variant?: "default" | "compact" | "large" | "minimal";
  align?: "left" | "center" | "right";
}

export function PageHeader({
  title,
  subtitle,
  description,
  actions,
  breadcrumbs,
  className,
  variant = "default",
  align = "left",
}: PageHeaderProps) {
  const variantClasses = {
    default: "py-8 border-b border-[var(--border-subtle)]",
    compact: "py-4 border-b border-[var(--border-subtle)]",
    large: "py-12 border-b border-[var(--border-subtle)] bg-[var(--surface-card)]",
    minimal: "",
  };

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const sizeClasses = {
    default: {
      title: "text-2xl md:text-3xl",
      subtitle: "text-lg md:text-xl",
      description: "text-base",
    },
    compact: {
      title: "text-xl md:text-2xl",
      subtitle: "text-base md:text-lg",
      description: "text-sm",
    },
    large: {
      title: "text-3xl md:text-4xl",
      subtitle: "text-xl md:text-2xl",
      description: "text-lg",
    },
    minimal: {
      title: "text-lg md:text-xl",
      subtitle: "text-sm md:text-base",
      description: "text-sm",
    },
  };

  return (
    <div className={cn("flex flex-col", variantClasses[variant], className)}>
      <div className="w-full max-w-full">
        {breadcrumbs && <div className="mb-4">{breadcrumbs}</div>}

        <div className={cn("flex flex-col gap-4", alignClasses[align])}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1
                className={cn(
                  "font-bold text-[var(--text-primary)] leading-tight",
                  sizeClasses[variant].title,
                )}
              >
                {title}
              </h1>

              {subtitle && (
                <p
                  className={cn(
                    "font-medium text-[var(--text-secondary)] mt-2",
                    sizeClasses[variant].subtitle,
                  )}
                >
                  {subtitle}
                </p>
              )}

              {description && (
                <p
                  className={cn(
                    "text-[var(--text-muted)] mt-3 leading-relaxed",
                    sizeClasses[variant].description,
                  )}
                >
                  {description}
                </p>
              )}
            </div>

            {actions && <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
