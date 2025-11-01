import React from "react";

import { cn } from "../../lib/utils";
import { Input, type InputProps } from "./input";

export interface FloatingInputProps extends InputProps {
  label: string;
  id: string;
}

export const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <div className={cn("input-floating-label", className)}>
        <Input
          ref={ref}
          id={id}
          placeholder=" " // Required for CSS :not(:placeholder-shown) selector
          {...props}
        />
        <label htmlFor={id}>{label}</label>
      </div>
    );
  },
);
FloatingInput.displayName = "FloatingInput";
