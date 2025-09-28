import * as React from "react";

import { cn } from "../../lib/utils";

interface SwitchProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  id?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onChange, id, label, disabled, ...props }, ref) => {
    return (
      <label
        htmlFor={id}
        className={cn("inline-flex cursor-pointer select-none items-center gap-3", className)}
      >
        {label && <span className="text-text-secondary text-sm">{label}</span>}
        <span
          className={cn(
            "duration-fast relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
            checked ? "bg-accent" : "bg-surface-300",
            disabled && "cursor-not-allowed opacity-50",
          )}
        >
          <input
            ref={ref}
            id={id}
            type="checkbox"
            className="sr-only"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
            {...props}
          />
          <span
            className={cn(
              "bg-surface-100 duration-fast inline-block h-5 w-5 transform rounded-full shadow transition-transform",
              checked ? "translate-x-6" : "translate-x-1",
            )}
          />
        </span>
      </label>
    );
  },
);

Switch.displayName = "Switch";

export { Switch };
