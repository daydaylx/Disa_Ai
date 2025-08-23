import React from "react";
type Props = { size?: "sm" | "md" | "lg"; withWordmark?: boolean; };
const sizes = { sm: "h-7 w-7", md: "h-9 w-9", lg: "h-12 w-12" };
export function Logo({ size="md", withWordmark=true }: Props) {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className={`${sizes[size]} rounded-2xl bg-gradient-to-br from-primary to-indigo-500 shadow-glow relative`} aria-hidden>
        <div className="absolute inset-0 rounded-2xl blur-[12px] opacity-30 bg-gradient-to-br from-primary to-indigo-500" />
        <svg viewBox="0 0 24 24" className="absolute inset-0 m-auto h-5 w-5 text-white">
          <path fill="currentColor" d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.9 7.2 18l.9-5.4L4.2 8.7l5.4-.8L12 3z"/>
        </svg>
      </div>
      {withWordmark && (
        <div className="leading-none">
          <div className="text-white font-bold tracking-tight text-lg">
            Disa <span className="text-primary">AI</span>
          </div>
          <div className="text-xs text-zinc-400">Private Assistant</div>
        </div>
      )}
    </div>
  );
}
