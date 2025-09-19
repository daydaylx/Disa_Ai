import * as React from "react";

export interface GlassCardProps {
  /** Card content */
  children: React.ReactNode;
  /** Optional className for additional styling */
  className?: string;
  /** Optional padding variant */
  padding?: "sm" | "md" | "lg";
  /** Optional hover effects */
  hover?: boolean;
}

const paddingClasses = {
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  padding = "md",
  hover = false,
}) => {
  const baseClasses = `glass ${paddingClasses[padding]} relative`;
  const hoverClasses = hover ? "hover:scale-[1.02] hover:shadow-glow-outer" : "";

  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`}>
      {/* Optional subtle noise texture */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
};
