import type { ReactNode } from "react";

import { cn } from "../../lib/utils";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  width?: "max" | "wide" | "narrow";
}

const widths: Record<NonNullable<PageContainerProps["width"]>, string> = {
  max: "max-w-6xl",
  wide: "max-w-5xl",
  narrow: "max-w-3xl",
};

export function PageContainer({ children, className, width = "wide" }: PageContainerProps) {
  return (
    <div className={cn("mx-auto w-full px-4 py-8 sm:px-8 sm:py-10", widths[width], className)}>
      {children}
    </div>
  );
}
