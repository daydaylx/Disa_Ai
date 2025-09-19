import { hapticFeedback } from "../../lib/touch/haptics";

type Props = {
  visible: boolean;
  onClick: () => void;
};

export default function ScrollToEndFAB({ visible, onClick }: Props) {
  if (!visible) return null;

  const handleClick = () => {
    hapticFeedback.tap();
    onClick();
  };

  return (
    <button
      type="button"
      aria-label="Zum Ende scrollen"
      onClick={handleClick}
      className="touch-target fixed right-4 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full text-white shadow-[0_16px_32px_rgba(168,85,247,0.35)] transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(9,11,17,0.8)] active:scale-95"
      style={{
        bottom:
          "calc(env(safe-area-inset-bottom) + var(--bottomnav-h, 56px) + var(--composer-offset, 112px))",
        background: "var(--brand-gradient)",
      }}
      data-no-zoom
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
        <path
          d="M12 5v14m0 0l-6-6m6 6l6-6"
          strokeWidth="2"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
