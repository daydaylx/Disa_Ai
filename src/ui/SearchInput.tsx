import * as React from "react";

import { Search as SearchIcon, X } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  className?: string;
}

/**
 * SearchInput - Consistent search input across the app
 *
 * Features:
 * - Search icon on the left
 * - Clear button when has value
 * - Focus ring consistent with design system
 */
export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = "Suchen...",
  className,
  ...props
}: SearchInputProps) {
  const handleClear = () => {
    onChange("");
    onClear?.();
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary pointer-events-none">
        <SearchIcon className="h-4 w-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full h-11 rounded-xl bg-surface-2 border border-white/5",
          "pl-10 pr-10 text-sm text-ink-primary",
          "placeholder:text-ink-tertiary",
          "focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary/50",
          "transition-all duration-200"
        )}
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-tertiary hover:text-ink-primary transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
