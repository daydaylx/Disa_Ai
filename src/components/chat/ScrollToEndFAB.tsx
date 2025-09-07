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
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+84px)] right-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-[#f3f4f6] backdrop-blur-md shadow-[0_0_16px_#00ffff55] hover:shadow-[0_0_22px_#ff00ff66] transition active:scale-95"
    >
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
        <path d="M12 5v14m0 0l-6-6m6 6l6-6" strokeWidth="2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}
