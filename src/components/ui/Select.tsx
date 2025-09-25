import * as React from "react";

import { cn } from "../../lib/cn";

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
}

interface BaseProps {
  id?: string;
  label?: string;
  hint?: string;
  error?: string;
  options: Option[];
  placeholder?: string;
  className?: string;
  testId?: string;
  loading?: boolean;
  variant?: "default" | "glass";
}

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & BaseProps;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      id,
      label,
      hint,
      error,
      options,
      placeholder,
      className,
      testId,
      loading,
      variant = "default",
      ...props
    },
    ref,
  ) => {
    const selectId = id || props.name || "select";
    const describedBy: string[] = [];
    if (hint) describedBy.push(`${selectId}-hint`);
    if (error) describedBy.push(`${selectId}-error`);

    const selectClassName = variant === "glass" ? "glass-input" : "select";

    return (
      <div className={cn("w-full", className)}>
        {label ? (
          <label htmlFor={selectId} className="mb-1 block text-sm font-medium text-text-default">
            {label}
          </label>
        ) : null}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              selectClassName,
              "appearance-none pr-8",
              error && "border-danger focus:border-danger",
              loading && "pr-16",
            )}
            aria-invalid={!!error || undefined}
            aria-describedby={describedBy.length ? describedBy.join(" ") : undefined}
            data-testid={testId}
            disabled={props.disabled || loading}
            {...props}
          >
            {placeholder ? <option value="">{placeholder}</option> : null}
            {options.map((o) => (
              <option key={o.value} value={o.value} disabled={o.disabled}>
                {o.label}
              </option>
            ))}
          </select>
          {/* Chevron Down Icon */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <svg
              className="h-4 w-4 text-text-muted"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
          {loading && (
            <div className="absolute inset-y-0 right-6 flex items-center pr-3">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
        </div>
        {hint ? (
          <p id={`${selectId}-hint`} className="mt-1 text-xs text-text-muted">
            {hint}
          </p>
        ) : null}
        {error ? (
          <p id={`${selectId}-error`} className="mt-1 text-xs text-danger">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

Select.displayName = "Select";
