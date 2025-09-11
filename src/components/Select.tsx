import * as React from 'react';

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
      // Now using the centralized .input class from theme.css
      className={cn("input", className)}
      {...rest}
    >
      {children}
    </select>
  );
}
