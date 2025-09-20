import * as React from "react";
export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "green" | "purple";
}) {
  const map = {
    neutral: "border border-border-subtle bg-surface-100 text-text-secondary",
    green: "border border-border-subtle bg-[rgba(34,197,94,0.12)] text-success",
    purple: "border border-border-subtle bg-[rgba(192,132,252,0.12)] text-text-secondary",
  } as const;
  return (
    <span className={`inline-flex h-6 items-center rounded-full px-2 text-xs ${map[tone]}`}>
      {children}
    </span>
  );
}
