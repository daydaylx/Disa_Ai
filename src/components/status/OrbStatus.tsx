import React from 'react'

type Props = {
  streaming: boolean
  modelLabel: string
}

export default function OrbStatus({ streaming, modelLabel }: Props) {
  return (
    <div className="mx-auto mb-2 mt-1 w-full max-w-3xl">
      <div className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/70 px-3 py-2 shadow-soft backdrop-blur">
        <span
          aria-hidden
          className={[
            'inline-block h-2.5 w-2.5 rounded-full',
            streaming ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-400'
          ].join(' ')}
        />
        <div className="flex min-w-0 flex-col">
          <div className="truncate text-sm text-neutral-200">
            {streaming ? 'Denke…' : 'Bereit.'}
          </div>
          <div className="truncate text-xs text-neutral-400">Modell: {modelLabel}</div>
        </div>
      </div>
    </div>
  )
}
