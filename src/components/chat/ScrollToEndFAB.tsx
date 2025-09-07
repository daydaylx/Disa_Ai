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
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+24px)] right-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/70 text-foreground backdrop-blur-lg shadow-soft transition active:scale-95"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
        <path d="M12 5v14m0 0l-6-6m6 6l6-6" strokeWidth="2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}
