import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  className?: string;
}

/**
 * TypingIndicator - Animated dots showing AI is "typing"
 *
 * Features:
 * - 3 bouncing dots with staggered animation
 * - Smooth bounce effect using animate-smooth-bounce
 * - Respects reduced motion preferences
 */
export function TypingIndicator({ className }: TypingIndicatorProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-surface-1/80 border border-white/10 backdrop-blur-sm w-fit",
        className,
      )}
      role="status"
      aria-label="KI antwortet..."
    >
      <div className="flex items-center gap-1">
        <span
          className="h-2 w-2 rounded-full bg-accent-models animate-smooth-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="h-2 w-2 rounded-full bg-accent-models animate-smooth-bounce"
          style={{ animationDelay: "200ms" }}
        />
        <span
          className="h-2 w-2 rounded-full bg-accent-models animate-smooth-bounce"
          style={{ animationDelay: "400ms" }}
        />
      </div>
      <span className="text-xs text-ink-tertiary ml-1">Disa tippt...</span>
    </div>
  );
}
