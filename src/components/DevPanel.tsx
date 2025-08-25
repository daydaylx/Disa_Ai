import React from "react"

type Props = {
  open: boolean
  onClose: () => void
  samples: number[]
  costs: number[]
  lastCost: number
  errors: number
}

function percentile(arr: number[], p: number): number {
  if (!arr.length) return 0
  const a = arr.slice().sort((x,y)=>x-y)
  const clamped = Math.max(0, Math.min(a.length - 1, Math.round((p / 100) * (a.length - 1))))
  return a[clamped] ?? 0
}

function formatMs(ms: number) {
  if (ms < 1000) return `${ms|0}ms`
  const s = ms/1000
  return `${s.toFixed(2)}s`
}

function usd(n: number) { return `$${(n||0).toFixed(n>=0.01?2:4)}` }

export default function DevPanel({ open, onClose, samples, costs, lastCost, errors }: Props) {
  if (!open) return null
  const p50 = percentile(samples, 50)
  const p95 = percentile(samples, 95)
  const avg = samples.length ? samples.reduce((a,b)=>a+b,0)/samples.length : 0
  const avgCost = costs.length ? costs.reduce((a,b)=>a+b,0)/costs.length : 0
  return (
    <div className="fixed right-3 bottom-[calc(64px+env(safe-area-inset-bottom))] z-30 w-[320px] rounded-xl border border-neutral-300 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 backdrop-blur shadow-lg">
      <div className="px-3 py-2 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <div className="text-sm font-medium">Dev</div>
        <button onClick={onClose} className="text-xs px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800">Close</button>
      </div>
      <div className="p-3 text-sm space-y-2">
        <div className="flex justify-between"><span>Requests:</span><span>{samples.length}</span></div>
        <div className="flex justify-between"><span>p50 Latenz:</span><span>{formatMs(p50)}</span></div>
        <div className="flex justify-between"><span>p95 Latenz:</span><span>{formatMs(p95)}</span></div>
        <div className="flex justify-between"><span>Ø Latenz:</span><span>{formatMs(avg)}</span></div>
        <div className="flex justify-between"><span>Ø Kosten (est):</span><span>{usd(avgCost)}</span></div>
        <div className="flex justify-between"><span>Letzte Kosten (est):</span><span>{usd(lastCost)}</span></div>
        <div className="flex justify-between"><span>Fehler:</span><span>{errors}</span></div>
      </div>
    </div>
  )
}
