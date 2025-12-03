import { Bookmark as BookmarkIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface BookmarkProps {
  onClick: () => void;
  className?: string;
}

export function Bookmark({ onClick, className }: BookmarkProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "absolute right-[-12px] top-24 z-fab flex h-16 w-8 items-center justify-center rounded-l-md bg-accent text-ink-onAccent shadow-md transition-transform hover:-translate-x-1 active:scale-95 sm:right-[-16px] sm:w-10",
        "animate-bookmark-wiggle", // Optional: only wiggle on first render if needed
        className,
      )}
      aria-label="Verlauf öffnen"
    >
      <BookmarkIcon className="h-5 w-5 text-white" />
    </button>
  );
}
