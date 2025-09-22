import React from "react";

type Props = {
  title: string;
  meta?: string;
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  role?: "button" | "region";
  ariaExpanded?: boolean;
  ariaControls?: string;
  ariaLabelledby?: string;
};

export default function Card({
  title,
  meta,
  active,
  onClick,
  children,
  role,
  ariaExpanded,
  ariaControls,
  ariaLabelledby,
}: Props) {
  const interactive = typeof onClick === "function";
  const Comp: any = interactive ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      role={role}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      aria-labelledby={ariaLabelledby}
      className={[
        "w-full rounded-xl border border-white/10 text-left",
        "bg-white/5 transition-colors hover:bg-white/10",
        "px-3 py-3",
        interactive ? "cursor-pointer" : "",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
      ].join(" ")}
      style={{ minHeight: 56 }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate font-medium">{title}</div>
          {meta && <div className="truncate text-xs text-muted/80">{meta}</div>}
        </div>
        {active !== undefined && (
          <span
            className={
              "rounded-full border px-2 py-1 text-xs " +
              (active ? "border-white/20 bg-primary/25" : "border-white/10 bg-white/5")
            }
          >
            {active ? "Aktiv" : "Inaktiv"}
          </span>
        )}
      </div>
      {children && <div className="mt-2 text-sm text-white/90">{children}</div>}
    </Comp>
  );
}
