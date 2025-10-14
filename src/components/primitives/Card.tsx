import React from "react";
import { twMerge } from "tailwind-merge";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  const cardClasses = twMerge("surface-card rounded-lg", className);

  return <div ref={ref} className={cardClasses} {...props} />;
});

Card.displayName = "Card";
