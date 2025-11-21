import type { ComponentProps } from "react";

import { BrandWordmark } from "../app/components/BrandWordmark";
import { MenuIcon } from "../components/layout/AppMenuDrawer";

/**
 * AppHeader - PREMIUM SIGNATURE HEADER
 *
 * Erkennungsmerkmale:
 * - Layered Material Depth (Strong Raise + Brand-Glow)
 * - Lila-Akzent Underline
 * - Bevel-Highlight
 * - Gestaffelte Z-Index Hierarchie
 *
 * Dieses Design macht den Header zum visuellen Anker der App.
 */

interface AppHeaderProps extends ComponentProps<"header"> {
  pageTitle: string;
  onClickMenu?: () => void;
}

export function AppHeader({ pageTitle, onClickMenu, ...props }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 h-[var(--header-height)] safe-area-top" {...props}>
      {/* Background Layer mit Material Depth */}
      <div className="absolute inset-0 bg-surface-2 shadow-raiseLg">
        {/* Bevel Highlight */}
        <div className="absolute inset-0 bg-bevel-highlight-strong opacity-90 pointer-events-none" />

        {/* Lila Accent-Strip am Bottom (SIGNATURE ELEMENT) */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-gradient opacity-60"
          style={{ boxShadow: "0 0 8px rgba(139, 92, 246, 0.4)" }}
        />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 h-full w-full px-[var(--spacing-4)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BrandWordmark />
          <div className="w-px h-6 bg-surface-1 shadow-inset" />
          <span className="text-base font-semibold text-text-primary">{pageTitle}</span>
        </div>
        <div className="flex items-center gap-2">
          {onClickMenu && <MenuIcon onClick={onClickMenu} />}
        </div>
      </div>
    </header>
  );
}
