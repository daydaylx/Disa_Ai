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
          ? 'border-[#4FC3F7]/40 bg-[#4FC3F7]/10 text-[#4FC3F7]'
          : 'border-[#A78BFA]/40 bg-[#A78BFA]/10 text-[#A78BFA]',
        className || ''
      ].join(' ')}
    >
      {label}
    </div>
  )
}
