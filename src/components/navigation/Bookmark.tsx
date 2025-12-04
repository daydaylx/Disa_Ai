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
        "absolute right-[-12px] top-20 z-fab flex h-12 w-7 items-center justify-center rounded-l-md border border-[var(--border-chalk)] text-ink-onAccent shadow-[0_10px_24px_rgba(0,0,0,0.28)] backdrop-blur-sm transition-transform duration-200 hover:-translate-x-1 sm:right-[-14px] sm:w-8",
        className,
      )}
      style={{ backgroundColor: "var(--accent-secondary)", opacity: 0.78 }}
      aria-label="Verlauf öffnen"
    >
      <BookmarkIcon className="h-5 w-5 text-white" />
    </button>
  );
}
