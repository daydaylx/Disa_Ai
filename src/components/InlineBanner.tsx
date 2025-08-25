import React from "react"

type Props = { tone?: "info" | "warn" | "error" | "success"; title: string; children?: React.ReactNode; actions?: React.ReactNode; className?: string }

const toneMap = {
  info: { wrapper: "border-sky-300 bg-sky-50 text-sky-900 dark:border-sky-700/60 dark:bg-sky-900/30 dark:text-sky-100" },
  warn: { wrapper: "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700/60 dark:bg-amber-900/30 dark:text-amber-100" },
  error: { wrapper: "border-red-300 bg-red-50 text-red-900 dark:border-red-700/60 dark:bg-red-900/30 dark:text-red-100" },
  success: { wrapper: "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700/60 dark:bg-emerald-900/30 dark:text-emerald-100" }
} as const

export default function InlineBanner({ tone = "info", title, children, actions, className }: Props) {
  return (
    <div className={`p-3 rounded-md border ${toneMap[tone].wrapper} ${className ?? ""}`}>
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="font-semibold">{title}</div>
          {children && <div className="mt-1 text-sm opacity-90">{children}</div>}
        </div>
        {actions && <div className="shrink-0 flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  )
}
