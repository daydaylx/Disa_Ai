import { hapticFeedback } from "@/lib/haptics";
import { Bookmark } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface HistoryFABProps {
  onClick: () => void;
  isOpen: boolean;
  conversationCount: number;
  className?: string;
  keyboardOffset?: number;
}

/**
 * HistoryFAB - Floating Action Button for History Panel
 *
 * Appears bottom-left when conversation history is available.
 * Shows badge with conversation count (max "9+").
 * Icon fills when history panel is open.
 */
export function HistoryFAB({
  onClick,
  isOpen,
  conversationCount,
  className,
  keyboardOffset = 0,
}: HistoryFABProps) {
  const handleClick = () => {
    hapticFeedback("light");
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "fixed z-fab",
        "flex items-center justify-center",
        "h-11 w-11 rounded-full shadow-lg",
        "transition-all duration-300",
        "hover:scale-110 hover:shadow-xl active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-accent-chat focus:ring-offset-2",
        "left-4 sm:left-[calc(50%-1.375rem-22rem)]", // Centers relative to the 3xl (48rem) container on larger screens
        isOpen
          ? "bg-accent-chat text-white"
          : "bg-surface-1/90 backdrop-blur-sm text-accent-chat border border-accent-chat/20",
        className,
      )}
      aria-label={
        isOpen
          ? "Verlauf schließen"
          : `Verlauf öffnen (${conversationCount} ${conversationCount === 1 ? "Unterhaltung" : "Unterhaltungen"})`
      }
      aria-expanded={isOpen}
      style={{
        bottom: `calc(var(--inset-safe-bottom, 0px) + var(--composer-offset, 0px) + var(--keyboard-offset, 0px) + 16px + ${Math.max(0, keyboardOffset)}px)`,
        transition:
          "opacity 180ms var(--disa-ease-standard), transform 180ms var(--disa-ease-standard)",
      }}
    >
      {/* Badge for conversation count */}
      {conversationCount > 0 && !isOpen && (
        <div
          className={cn(
            "absolute -top-1 -right-1 h-5 min-w-[1.25rem] px-1.5",
            "flex items-center justify-center",
            "rounded-full bg-accent-chat text-white",
            "text-[10px] font-bold shadow-sm",
            "animate-fade-in-scale",
          )}
        >
          {conversationCount > 9 ? "9+" : conversationCount}
        </div>
      )}

      {/* Bookmark Icon */}
      <Bookmark className={cn("h-5 w-5 transition-all", isOpen && "fill-current")} />
    </button>
  );
}
