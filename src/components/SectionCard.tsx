import React from "react";

import Icon from "./Icon";

type Variant = "solid" | "glass";
type Accent = "none" | "blue" | "purple" | "green" | "pink";
type Props = {
  title: string;
  icon?: string;
  children: React.ReactNode;
  subtitle?: string;
  variant?: Variant;
  accent?: Accent;
};

function wrap(content: React.ReactNode, variant: Variant, accent: Accent) {
  if (variant === "glass") {
    const ring =
      accent === "blue"
        ? "from-blue-500/35 via-indigo-500/25 to-transparent"
        : accent === "purple"
          ? "from-purple-500/35 via-fuchsia-500/25 to-transparent"
          : accent === "green"
            ? "from-emerald-500/35 via-teal-500/25 to-transparent"
            : accent === "pink"
              ? "from-pink-500/35 via-rose-500/25 to-transparent"
              : "from-neutral-500/20 via-neutral-500/10 to-transparent";
    return (
      <div
        className={`rounded-2xl bg-gradient-to-tr p-[1px] ${ring} transition-transform will-change-transform hover:scale-[1.002]`}
      >
        <div className="rounded-2xl border border-white/30 bg-white/65 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-neutral-900/55">
          {content}
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      {content}
    </div>
  );
}

export default function SectionCard({
  title,
  icon,
  children,
  subtitle,
  variant = "glass",
  accent = "blue",
}: Props) {
  const header = (
    <div className="mb-4 flex items-start gap-3">
      {icon && (
        <div className="mt-0.5 shrink-0">
          <Icon name={icon as any} width="18" height="18" />
        </div>
      )}
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs opacity-70">{subtitle}</p>}
      </div>
    </div>
  );
  const body = (
    <div className="p-4 md:p-6">
      {header}
      {children}
    </div>
  );
  return wrap(body, variant, accent);
}
