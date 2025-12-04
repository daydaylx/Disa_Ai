/**
 * ChatHeader Component
 *
 * Displays a minimalist header with clock icon showing current time
 * in the "Schiefer & Kreide" aesthetic.
 */

import { useEffect, useState } from "react";

import { Clock } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  className?: string;
}

export function ChatHeader({ className }: ChatHeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3",
        "bg-gradient-to-b from-bg-app/95 to-transparent backdrop-blur-sm",
        className
      )}
    >
      {/* Optional: Chat Title */}
      <div className="text-ink-secondary text-sm font-medium opacity-0">Disa</div>

      {/* Clock Icon with Time */}
      <div className="ml-auto flex items-center gap-2 relative">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-1/50 backdrop-blur-sm relative
          before:content-[''] before:absolute before:inset-0 before:rounded-full
          before:shadow-[0_0_0_1.5px_var(--border-chalk)] before:pointer-events-none
          before:opacity-[var(--chalk-rough-opacity)]"
        >
          <Clock className="h-4 w-4 text-ink-secondary" />
          <span className="text-xs font-medium text-ink-primary tabular-nums">
            {formattedTime}
          </span>
        </div>
      </div>
    </div>
  );
}
