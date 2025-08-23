import React from "react";
import { cn } from "@/shared/lib/cn";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return <input ref={ref} className={cn("input-base", className)} {...props} />;
  }
);
Input.displayName = "Input";
