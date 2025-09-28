import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", loading, className = "", children, disabled, ...props },
    ref,
  ) => {
    const variantClasses = {
      primary: "glass-button--primary",
      secondary: "glass-button--secondary",
      ghost: "glass-button--ghost",
      danger: "glass-button--danger",
    };

    const sizeClasses = {
      sm: "glass-button--sm",
      md: "",
      lg: "glass-button--lg",
    };

    const classes = [
      "glass-button",
      variantClasses[variant],
      sizeClasses[size],
      loading && "opacity-50 cursor-wait",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} className={classes} disabled={disabled || loading} {...props}>
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {children}
          </div>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
