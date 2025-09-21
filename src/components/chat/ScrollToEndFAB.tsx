import { hapticFeedback } from "../../lib/touch/haptics";

type Props = {
  visible: boolean;
  onClick: () => void;
  keyboardLift?: number;
};

export default function ScrollToEndFAB({ visible, onClick, keyboardLift = 0 }: Props) {
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
      className="btn btn-primary btn-sm right-5 fixed z-50 inline-flex items-center justify-center shadow-elev2"
      style={{
        bottom:
          "calc(env(safe-area-inset-bottom) + var(--bottomnav-h, 56px) + var(--composer-offset, 112px))",
        transform: keyboardLift > 0 ? `translateY(-${keyboardLift}px)` : undefined,
        transition: "transform 160ms ease-out",
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
