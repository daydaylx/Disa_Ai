import React from "react";
import { cn } from "../lib/cn";
export function Card({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={cn("card p-5", className)}>{children}</div>;
}
export function CardHeader({ title, subtitle, right }:{title:string; subtitle?:string; right?:React.ReactNode}) {
  return (
    <div className="mb-3 flex items-start justify-between gap-4">
      <div>
        <div className="text-lg font-semibold">{title}</div>
        {subtitle && <div className="text-sm text-zinc-400">{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}
export function CardFooter({ children }: React.PropsWithChildren) {
  return <div className="mt-4 pt-4 border-t border-white/10">{children}</div>;
}
