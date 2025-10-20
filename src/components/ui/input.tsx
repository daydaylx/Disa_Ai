import * as React from "react";

import { cn } from "../../lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "glass glass--subtle hover:border-border-hover flex h-11 w-full rounded-base border border-border/80 px-3 py-2 text-sm text-text-0 transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-1 hover:bg-hover-bg focus-visible:border-border-focus focus-visible:bg-hover-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-0 disabled:cursor-not-allowed disabled:opacity-60",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
