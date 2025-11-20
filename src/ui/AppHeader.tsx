import type { ComponentProps } from "react";

import { BrandWordmark } from "../app/components/BrandWordmark";
import { MenuIcon } from "../components/layout/AppMenuDrawer";

interface AppHeaderProps extends ComponentProps<"header"> {
  pageTitle: string;
  onClickMenu?: () => void;
}

export function AppHeader({ pageTitle, onClickMenu, ...props }: AppHeaderProps) {
  return (
    <header
      className="sticky top-0 z-20 border-b border-[var(--glass-border-soft)] bg-gradient-to-b from-[var(--surface-base)] to-transparent backdrop-blur-xl safe-area-top"
      {...props}
    >
      <div className="w-full px-[var(--spacing-4)] py-[var(--spacing-2)] flex items-center justify-between max-h-[60px]">
        <div className="flex items-center gap-4">
          <BrandWordmark />
          <span className="text-lg font-medium text-text-secondary">{pageTitle}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Placeholder for theme and settings buttons */}
          {onClickMenu && <MenuIcon onClick={onClickMenu} />}
        </div>
      </div>
    </header>
  );
}
