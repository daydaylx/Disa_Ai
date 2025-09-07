import React from 'react'

type Props = {
  visible: boolean
  onClick: () => void
}

export default function ScrollToEndFAB({ visible, onClick }: Props) {
  if (!visible) return null
  return (
    <button
      type="button"
      aria-label="Zum Ende scrollen"
      onClick={onClick}
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+24px)] right-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/80 text-foreground backdrop-blur-md shadow-[0_0_14px_rgba(79,195,247,0.35)] hover:shadow-[0_0_18px_rgba(167,139,250,0.35)] transition active:scale-95"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
        <path d="M12 5v14m0 0l-6-6m6 6l6-6" strokeWidth="2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}
