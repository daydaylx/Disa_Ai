

export function GlassCard({className = "", children}: React.PropsWithChildren<{className?: string}>) {
  return (
    <div className={[
      "relative rounded-2xl",
      "bg-[rgba(255,255,255,var(--glass-alpha))]",
      "[backdrop-filter:blur(var(--glass-blur))_saturate(120%)]",
      "shadow-[0_10px_30px_rgba(0,0,0,var(--shadow))]",
      "ring-1 ring-white/20"
    ].join(" ") + (className ? " " + className : "")}>
      <div className="pointer-events-none absolute inset-0 rounded-2xl mix-blend-overlay
                      [background-image:url('data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'120\' height=\'120\'><filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/></filter><rect width=\'120\' height=\'120\' filter=\'url(#n)\' opacity=\'.04\'/></svg>')]"></div>
      <div className="before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none
                      before:shadow-[inset_0_1px_0_rgba(255,255,255,var(--stroke-in))]"></div>
      <div className="relative p-4">
        {children}
      </div>
    </div>
  );
}

export function GlassGrid({children}: React.PropsWithChildren) {
  return (
    <div className="grid grid-cols-1 gap-3 px-3 py-3
                    sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {children}
    </div>
  );
}