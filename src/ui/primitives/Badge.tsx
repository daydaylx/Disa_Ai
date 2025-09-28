import { forwardRef } from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "accent" | "success" | "warning" | "danger";
  children: React.ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", className = "", children, ...props }, ref) => {
    const variantClasses = {
      default: "",
      accent: "glass-badge--accent",
      success: "glass-badge--success",
      warning: "glass-badge--warning",
      danger: "glass-badge--danger",
    };

    const classes = ["glass-badge", variantClasses[variant], className].filter(Boolean).join(" ");

    return (
      <span ref={ref} className={classes} {...props}>
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";
