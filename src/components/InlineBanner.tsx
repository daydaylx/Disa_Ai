import React from "react";

type Tone = "info" | "warn" | "error" | "success";

type Props = {
  tone?: Tone;
  title: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
};

const toneClass: Record<Tone, string> = {
  info: "bg-blue-500/10 border-blue-500/30",
  warn: "bg-yellow-500/10 border-yellow-500/30",
  error: "bg-red-500/10 border-red-500/30",
  success: "bg-emerald-500/10 border-emerald-500/30",
};

export default function InlineBanner({ tone = "info", title, actions, children }: Props) {
  return (
    <div className={`rounded-xl border px-3 py-2 ${toneClass[tone]}`}>
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="font-medium">{title}</div>
          {children && <div className="mt-0.5 text-sm opacity-90">{children}</div>}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
