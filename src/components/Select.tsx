import React from "react";

import { cn } from "../lib/cn";

export function Select({
  value,
  onChange,
  children,
  className,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={cn(
        "h-12 w-full rounded-[14px] border border-white/30 bg-white/70 px-4 text-foreground backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-[color:rgba(91,140,255,0.4)] focus:ring-offset-2 focus:ring-offset-background",
        className,
      )}
      {...rest}
    >
      {children}
    </select>
  );
}
