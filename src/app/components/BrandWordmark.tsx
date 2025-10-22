import type { ComponentProps } from "react";

export function BrandWordmark({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={`text-text-strong text-lg font-semibold tracking-tight ${className || ""}`.trim()}
      {...props}
    >
      Disa<span className="text-brand">AI</span>
    </span>
  );
}
