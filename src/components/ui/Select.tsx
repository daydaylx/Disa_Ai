import React from "react";
import { cn } from "../../lib/utils/cn";

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
}

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & BaseProps;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ id, label, hint, error, options, placeholder, className, ...props }, ref) => {
    const selectId = id || props.name || "select";
    const describedBy: string[] = [];
    if (hint) describedBy.push(`${selectId}-hint`);
    if (error) describedBy.push(`${selectId}-error`);

    return (
      <div className={cn("w-full", className)}>
        {label ? (
          <label htmlFor={selectId} className="mb-1 block text-sm font-medium">
            {label}
          </label>
        ) : null}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "input",
            "appearance-none pr-9", // Platz für Dropdown-Indikator
            error && "border-destructive focus-visible:ring-destructive"
          )}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy.length ? describedBy.join(" ") : undefined}
          {...props}
        >
          {placeholder ? <option value="">{placeholder}</option> : null}
          {options.map((o) => (
            <option key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

Select.displayName = "Select";
