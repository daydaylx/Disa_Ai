import { hapticFeedback } from "@/lib/haptics";
import { ChevronDown } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface ScrollToBottomProps {
  onClick: () => void;
  visible: boolean;
  newMessageCount?: number;
  className?: string;
}

/**
 * ScrollToBottom - Floating Action Button (FAB)
 *
 * Appears when user scrolls up from the bottom of the chat.
 * Shows badge with new message count when available.
 * Uses existing animations from ui-state-animations.css
 */
export function ScrollToBottom({
  onClick,
  visible,
  newMessageCount = 0,
  className,
}: ScrollToBottomProps) {
  const handleClick = () => {
    hapticFeedback("light");
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "fixed bottom-24 right-4 z-50",
        "flex items-center justify-center",
        "h-11 w-11 rounded-full shadow-lg",
        "bg-accent-primary text-white",
        "transition-all duration-300",
        "hover:scale-110 hover:shadow-xl active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none",
        className,
      )}
      aria-label={newMessageCount > 0 ? `${newMessageCount} neue Nachrichten` : "Zum Ende scrollen"}
      style={{
        transition:
          "opacity 180ms var(--disa-ease-standard), transform 180ms var(--disa-ease-standard)",
      }}
    >
      {/* Badge for new message count */}
      {newMessageCount > 0 && (
        <div
          className={cn(
            "absolute -top-1 -right-1 h-5 min-w-[1.25rem] px-1.5",
            "flex items-center justify-center",
            "rounded-full bg-status-error text-white",
            "text-[10px] font-bold shadow-sm",
            "animate-fade-in-scale",
          )}
        >
          {newMessageCount > 99 ? "99+" : newMessageCount}
        </div>
      )}

      {/* Arrow Icon */}
      <ChevronDown className="h-5 w-5" />
    </button>
  );
}
