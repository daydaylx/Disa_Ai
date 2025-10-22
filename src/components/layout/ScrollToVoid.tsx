import { useEffect, useRef } from "react";

import { cn } from "../../lib/utils";

interface ScrollToVoidProps {
  children: React.ReactNode;
}

export function ScrollToVoid({ children }: ScrollToVoidProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const maxScroll = container.scrollHeight - container.clientHeight;

      // Wenn der Benutzer nach unten scrollt, wird der Hintergrund dunkler
      if (maxScroll > 0) {
        const scrollRatio = Math.min(scrollTop / maxScroll, 1);
        const opacity = Math.min(scrollRatio * 1.5, 1); // Verstärkung für stärkeren Effekt

        container.style.setProperty("--scroll-opacity", opacity.toString());
      }
    };

    // Initial einstellen
    handleScroll();

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative min-h-dvh overflow-y-auto",
        "before:absolute before:inset-0 before:z-[-1] before:bg-black before:opacity-[var(--scroll-opacity,0)] before:transition-opacity before:duration-300",
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}
