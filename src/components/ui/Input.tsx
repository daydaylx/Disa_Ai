import React from "react";
import { cn } from "../../lib/utils/cn";

interface BaseProps {
  id?: string;
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
}

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & BaseProps;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ id, label, hint, error, className, ...props }, ref) => {
    const inputId = id || props.name || "input";
    const describedBy: string[] = [];
    if (hint) describedBy.push(`${inputId}-hint`);
    if (error) describedBy.push(`${inputId}-error`);

    return (
      <div className={cn("w-full", className)}>
        {label ? (
          <label htmlFor={inputId} className="mb-1 block text-sm font-medium">
            {label}
          </label>
        ) : null}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "input",
            error && "border-destructive focus-visible:ring-destructive"
          )}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy.length ? describedBy.join(" ") : undefined}
          {...props}
        />
        {hint ? (
          <p id={`${inputId}-hint`} className="mt-1 text-xs text-muted-foreground">
            {hint}
          </p>
        ) : null}
        {error ? (
          <p id={`${inputId}-error`} className="mt-1 text-xs text-destructive">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
