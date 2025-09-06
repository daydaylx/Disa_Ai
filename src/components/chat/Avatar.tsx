import React from 'react'

type Props = { kind: 'user' | 'assistant'; className?: string }

export default function Avatar({ kind, className }: Props) {
  const label = kind === 'user' ? 'Du' : 'AI'
  return (
    <div
      aria-hidden
      className={[
        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-800 text-xs font-medium',
        kind === 'user' ? 'bg-sky-900/50 text-sky-200' : 'bg-violet-900/40 text-violet-200',
        className || ''
      ].join(' ')}
    >
      {label}
    </div>
  )
}
