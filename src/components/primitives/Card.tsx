import React from "react";
import { twMerge } from "tailwind-merge";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  const cardClasses = twMerge(
    "bg-surface/70 backdrop-blur-xl",
    "border border-border/80 rounded-lg",
    "shadow-drop",
    className,
  );

  return <div ref={ref} className={cardClasses} {...props} />;
});

Card.displayName = "Card";
