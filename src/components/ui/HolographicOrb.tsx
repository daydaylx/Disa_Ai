interface HolographicOrbProps {
  variant?: "purple" | "teal";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

export function HolographicOrb({
  variant = "purple",
  size = "md",
  className = "",
  onClick,
}: HolographicOrbProps) {
  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-40 h-40",
    lg: "w-48 h-48",
  };

  const baseClasses = "holographic-orb";
  const variantClasses = variant === "teal" ? "holographic-orb--teal" : "";
  const allClasses = `${baseClasses} ${variantClasses} ${sizeClasses[size]} ${className}`.trim();

  return (
    <div
      className={allClasses}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label="AI Assistant Avatar"
    />
  );
}
