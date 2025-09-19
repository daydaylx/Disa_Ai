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
  const baseClasses = `glass ${paddingClasses[padding]}`;
  const hoverClasses = hover ? "hover:scale-[1.02] transition-transform duration-200" : "";

  return <div className={`${baseClasses} ${hoverClasses} ${className}`}>{children}</div>;
};
