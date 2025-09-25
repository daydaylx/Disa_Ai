import * as React from "react";

import { cn } from "../../lib/cn";

interface BaseProps {
  id?: string;
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
  testId?: string;
  loading?: boolean;
  variant?: "default" | "glass";
}

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & BaseProps;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ id, label, hint, error, className, testId, loading, variant = "default", ...props }, ref) => {
    const inputId = id || props.name || "input";
    const describedBy: string[] = [];
    if (hint) describedBy.push(`${inputId}-hint`);
    if (error) describedBy.push(`${inputId}-error`);

    const inputClassName = variant === "glass" ? "glass-input" : "input";

    return (
      <div className={cn("w-full", className)}>
        {label ? (
          <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-text-default">
            {label}
          </label>
        ) : null}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            className={cn(
              inputClassName,
              error && "border-danger focus:border-danger",
              loading && "pr-10",
            )}
            aria-invalid={!!error || undefined}
            aria-describedby={describedBy.length ? describedBy.join(" ") : undefined}
            data-testid={testId}
            disabled={props.disabled || loading}
            {...props}
          />
          {loading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
        </div>
        {hint ? (
          <p id={`${inputId}-hint`} className="mt-1 text-xs text-text-muted">
            {hint}
          </p>
        ) : null}
        {error ? (
          <p id={`${inputId}-error`} className="mt-1 text-xs text-danger">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
