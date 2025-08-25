import React from "react"

type Props = { children: React.ReactNode }

export default function SessionLayout({ children }: Props) {
  return <div className="h-full w-full flex">{children}</div>
}
