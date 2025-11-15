import * as React from "react";

import { cn } from "../../lib/utils";

// Typography Component for consistent text styling
interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "body"
    | "body-sm"
    | "body-xs"
    | "caption"
    | "overline"
    | "code"
    | "pre";
  color?: "default" | "primary" | "secondary" | "muted" | "success" | "warning" | "error";
  align?: "left" | "center" | "right" | "justify";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold";
  className?: string;
  children: React.ReactNode;
}

const colorClasses = {
  default: "text-[var(--text-primary)]",
  primary: "text-[var(--color-primary-600)]",
  secondary: "text-[var(--text-secondary)]",
  muted: "text-[var(--text-muted)]",
  success: "text-[var(--color-success-600)]",
  warning: "text-[var(--color-warning-600)]",
  error: "text-[var(--color-error-600)]",
};

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
  justify: "text-justify",
};

const weightClasses = {
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
};

const variantClasses = {
  h1: "text-h1",
  h2: "text-h2",
  h3: "text-h3",
  h4: "text-h4",
  h5: "text-h5",
  h6: "text-h6",
  body: "text-body",
  "body-sm": "text-body-sm",
  "body-xs": "text-body-xs",
  caption: "text-caption",
  overline: "text-overline",
  code: "font-mono text-sm bg-[var(--color-neutral-100)] text-[var(--color-neutral-800)] px-1.5 py-0.5 rounded-[var(--radius-xs)]",
  pre: "font-mono text-sm bg-[var(--color-neutral-50)] p-3 rounded-[var(--radius-md)] border border-[var(--border-muted)] overflow-x-auto",
};

export function Typography({
  variant = "body",
  color = "default",
  align = "left",
  weight,
  className,
  children,
  ...props
}: TypographyProps) {
  const Component = variant.startsWith("h") ? variant : "p";

  return (
    <Component
      className={cn(
        variantClasses[variant],
        colorClasses[color],
        alignClasses[align],
        weight && weightClasses[weight],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

// Specialized typography components for convenience
export function Heading1({ children, className, ...props }: Omit<TypographyProps, "variant">) {
  return (
    <Typography variant="h1" className={className} {...props}>
      {children}
    </Typography>
  );
}

export function Heading2({ children, className, ...props }: Omit<TypographyProps, "variant">) {
  return (
    <Typography variant="h2" className={className} {...props}>
      {children}
    </Typography>
  );
}

export function Heading3({ children, className, ...props }: Omit<TypographyProps, "variant">) {
  return (
    <Typography variant="h3" className={className} {...props}>
      {children}
    </Typography>
  );
}

export function Heading4({ children, className, ...props }: Omit<TypographyProps, "variant">) {
  return (
    <Typography variant="h4" className={className} {...props}>
      {children}
    </Typography>
  );
}

export function Heading5({ children, className, ...props }: Omit<TypographyProps, "variant">) {
  return (
    <Typography variant="h5" className={className} {...props}>
      {children}
    </Typography>
  );
}

export function Heading6({ children, className, ...props }: Omit<TypographyProps, "variant">) {
  return (
    <Typography variant="h6" className={className} {...props}>
      {children}
    </Typography>
  );
}

export function BodyText({ children, className, ...props }: Omit<TypographyProps, "variant">) {
  return (
    <Typography variant="body" className={className} {...props}>
      {children}
    </Typography>
  );
}

export function BodyTextSmall({ children, className, ...props }: Omit<TypographyProps, "variant">) {
  return (
    <Typography variant="body-sm" className={className} {...props}>
      {children}
    </Typography>
  );
}

export function BodyTextExtraSmall({
  children,
  className,
  ...props
}: Omit<TypographyProps, "variant">) {
  return (
    <Typography variant="body-xs" className={className} {...props}>
      {children}
    </Typography>
  );
}

export function Caption({ children, className, ...props }: Omit<TypographyProps, "variant">) {
  return (
    <Typography variant="caption" className={className} {...props}>
      {children}
    </Typography>
  );
}

export function Overline({ children, className, ...props }: Omit<TypographyProps, "variant">) {
  return (
    <Typography variant="overline" className={className} {...props}>
      {children}
    </Typography>
  );
}

export function Code({ children, className, ...props }: Omit<TypographyProps, "variant">) {
  return (
    <Typography variant="code" className={className} {...props}>
      {children}
    </Typography>
  );
}

export function Preformatted({ children, className, ...props }: Omit<TypographyProps, "variant">) {
  return (
    <Typography variant="pre" className={className} {...props}>
      {children}
    </Typography>
  );
}
