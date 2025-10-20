// src/components/navigation/EdgeSwipeHandle.tsx
import React from "react";

import { useSidepanel } from "../../app/state/SidepanelContext";
import { useEdgeSwipe } from "../../hooks/useEdgeSwipe";
import { cn } from "../../lib/utils";

type Props = {
  edgeWidth?: number; // px, default 24
  breakpoint?: string; // Tailwind Hidden-BP, z.B. "md" oder "lg"
  className?: string;
  zIndex?: number; // falls du üble Overlays hast
};

export function EdgeSwipeHandle({
  edgeWidth = 24,
  breakpoint = "md",
  className,
  zIndex = 60,
}: Props) {
  const { openPanel } = useSidepanel();

  useEdgeSwipe({
    onOpen: openPanel,
    edge: "right",
    edgeWidth,
    minDX: 40,
    maxDY: 30,
    active: true,
  });

  // unsichtbarer Handle, nur auf Mobile sichtbar
  return (
    <div
      aria-hidden
      className={cn(
        `fixed right-0 top-0 h-[100dvh] ${breakpoint}:hidden select-none`,
        "edge-swipe-handle",
        className,
      )}
      style={{ width: edgeWidth, zIndex }}
    />
  );
}
