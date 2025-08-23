import React from "react";
export function Badge({ children, tone="neutral" }:{ children: React.ReactNode; tone?: "neutral"|"green"|"purple"; }) {
  const map = {
    neutral: "bg-white/10 text-zinc-200",
    green: "bg-emerald-500/15 text-emerald-300",
    purple: "bg-fuchsia-500/15 text-fuchsia-300",
  } as const;
  return <span className={`inline-flex items-center h-6 px-2 rounded-full text-xs ${map[tone]}`}>{children}</span>;
}
