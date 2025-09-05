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
        "h-12 w-full rounded-2xl border border-border bg-[#12121A]/80 px-4 text-foreground focus:shadow-ring focus:outline-none",
        className,
      )}
      {...rest}
    >
      {children}
    </select>
  );
}
