export function GlassCard({
  className = "",
  children,
}: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={
        [
          "relative rounded-2xl",
          "bg-[rgba(255,255,255,var(--glass-alpha))]",
          "[backdrop-filter:blur(var(--glass-blur))_saturate(120%)]",
          "shadow-[0_10px_30px_rgba(0,0,0,var(--shadow))]",
          "ring-1 ring-white/20",
        ].join(" ") + (className ? " " + className : "")
      }
    >
      {/* Noise texture overlay removed to reduce bundle size */}
      <div className="before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:shadow-[inset_0_1px_0_rgba(255,255,255,var(--stroke-in))] before:content-['']"></div>
      <div className="relative p-4">{children}</div>
    </div>
  );
}

export function GlassGrid({ children }: React.PropsWithChildren) {
  return (
    <div className="grid grid-cols-1 gap-3 px-3 py-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {children}
    </div>
  );
}
