import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: "none" | "sm" | "md" | "lg";
};

export function Card({ className, padding = "md", ...props }: CardProps) {
  const pad =
    padding === "none" ? "p-0" : padding === "sm" ? "p-3" : padding === "lg" ? "p-6" : "p-4";
  return <div className={clsx("card-surface", pad, className)} {...props} />;
}
