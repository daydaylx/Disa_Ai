import { hapticFeedback } from "../../lib/touch/haptics";

export default function TopMenuButton() {
  const handleClick = () => {
    hapticFeedback.tap();
  };

  return (
    <a
      href="#/settings"
      aria-label="Menü öffnen"
      onClick={handleClick}
      className="touch-target border-border bg-surface-1 text-text-0 fixed right-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border transition active:scale-95"
      style={{ top: `calc(var(--inset-t) + 16px)` }}
      data-no-zoom
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
        <path
          d="M3 12a1.5 1.5 0 0 1 1.5-1.5h15a1.5 1.5 0 1 1 0 3h-15A1.5 1.5 0 0 1 3 12zm0-5a1.5 1.5 0 0 1 1.5-1.5h15a1.5 1.5 0 1 1 0 3h-15A1.5 1.5 0 0 1 3 7zm0 10a1.5 1.5 0 0 1 1.5-1.5h15a1.5 1.5 0 1 1 0 3h-15a1.5 1.5 0 0 1-1.5-1.5z"
          fill="currentColor"
        />
      </svg>
    </a>
  );
}