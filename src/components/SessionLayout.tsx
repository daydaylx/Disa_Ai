import React from "react";

type Props = { children: React.ReactNode };

export default function SessionLayout({ children }: Props) {
  return <div className="flex h-full w-full">{children}</div>;
}
