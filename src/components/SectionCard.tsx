import React from "react"
import Icon from "./Icon"

type Props = { title: string; icon?: string; children: React.ReactNode; subtitle?: string }

export default function SectionCard({ title, icon, children, subtitle }: Props) {
  return (
    <section className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm p-4 md:p-6">
      <div className="flex items-start gap-3 mb-4">
        {icon && <div className="mt-0.5"><Icon name={icon as any} width="18" height="18" /></div>}
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          {subtitle && <p className="text-xs opacity-70 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  )
}
