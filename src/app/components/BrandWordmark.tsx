import type { ComponentProps } from "react";

export function BrandWordmark({
  className,
  showTagline = true,
  ...props
}: ComponentProps<"span"> & { showTagline?: boolean }) {
  return (
    <span className={`flex flex-col ${className || ""}`.trim()} {...props}>
      <span className="text-text-strong text-lg font-semibold tracking-tight leading-none">
        Disa<span className="text-liquid-blue">AI</span>
      </span>
      {showTagline && (
        <span className="text-liquid-turquoise text-xs font-medium tracking-wide leading-none mt-px">
          Liquid Intelligence
        </span>
      )}
    </span>
  );
}
