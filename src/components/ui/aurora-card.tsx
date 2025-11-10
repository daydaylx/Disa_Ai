import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

type AuroraCardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: "none" | "sm" | "md" | "lg";
};

export function AuroraCard({ className, padding = "md", ...props }: AuroraCardProps) {
  const pad =
    padding === "none" ? "p-0" : padding === "sm" ? "p-3" : padding === "lg" ? "p-6" : "p-4";
  return <div className={clsx("card-surface", pad, className)} {...props} />;
}
