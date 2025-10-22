import React from "react";

import { cn } from "../../lib/utils";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  disabled?: boolean;
  "aria-describedby"?: string;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onChange, id, disabled = false, "aria-describedby": describedBy }, ref) => {
    const handleClick = () => {
      if (!disabled) {
        onChange(!checked);
      }
    };

    return (
      <button
        ref={ref}
        id={id}
        role="switch"
        aria-checked={checked}
        aria-describedby={describedBy}
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-border-focus)] focus:ring-offset-2",
          checked ? "bg-[var(--color-brand-primary)]" : "bg-[var(--color-surface-subtle)]",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            checked ? "translate-x-6" : "translate-x-1",
          )}
        />
      </button>
    );
  },
);

Switch.displayName = "Switch";