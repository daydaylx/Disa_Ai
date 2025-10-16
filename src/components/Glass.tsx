import React from "react";

interface GlassProps {
  children: React.ReactNode;
  className?: string;
  variant?: "subtle" | "standard" | "strong";
  asChild?: boolean;
  onClick?: () => void; // Added onClick support
}

export const Glass: React.FC<GlassProps> = ({
  children,
  className = "",
  variant = "standard",
  asChild = false,
  onClick,
}) => {
  // Only apply glass effect if backdrop-filter is supported
  const glassClass = `glass ${variant === "subtle" ? "glass--subtle" : variant === "strong" ? "glass--strong" : ""}`;

  const elementClass = `${glassClass} ${className}`;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: `${elementClass} ${(children.props as any).className || ""}`,
      onClick: onClick || (children.props as any).onClick,
    } as React.Attributes);
  } else {
    return (
      <div className={elementClass} onClick={onClick}>
        {children}
      </div>
    );
  }
};
