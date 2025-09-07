import React from "react";
export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "green" | "purple";
}) {
  const map = {
    neutral: "border border-white/30 bg-white/60 text-slate-700 backdrop-blur-md",
    green: "border border-white/30 bg-white/60 text-emerald-700 backdrop-blur-md",
    purple: "border border-white/30 bg-white/60 text-fuchsia-700 backdrop-blur-md",
  } as const;
  return (
    <span className={`inline-flex h-6 items-center rounded-full px-2 text-xs ${map[tone]}`}>
      {children}
    </span>
  );
}
