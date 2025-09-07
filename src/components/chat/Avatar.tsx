import React from 'react'

type Props = { kind: 'user' | 'assistant'; className?: string }

export default function Avatar({ kind, className }: Props) {
  const label = kind === 'user' ? 'Du' : 'AI'
  return (
    <div
      aria-hidden
      className={[
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-medium',
        kind === 'user'
          ? 'border-cyan-400/40 bg-cyan-500/10 text-cyan-200 shadow-[0_0_12px_#00ffff55]'
          : 'border-fuchsia-400/40 bg-fuchsia-500/10 text-fuchsia-200 shadow-[0_0_12px_#ff00ff55]',
        className || ''
      ].join(' ')}
    >
      {label}
    </div>
  )
}
