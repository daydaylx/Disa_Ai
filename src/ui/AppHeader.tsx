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
      className="sticky top-0 z-20 h-[var(--header-height)] bg-bg-base safe-area-top shadow-soft-raise flex items-center"
      {...props}
    >
      <div className="w-full px-[var(--spacing-4)] flex items-center justify-between">
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
