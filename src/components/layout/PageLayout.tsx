import { type ReactNode } from "react";

import { type LogoState } from "@/app/components/AnimatedLogo";
import { BrandWordmark } from "@/app/components/BrandWordmark";
import { Menu } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

import { useMenuDrawer } from "./AppMenuDrawer";

export interface PageLayoutProps {
  children: ReactNode;
  /**
   * Optional page title shown in header next to brand logo
   */
  title?: string;
  /**
   * Optional header actions (buttons, etc.) shown on the right side
   */
  headerActions?: ReactNode;
  /**
   * Optional className for the content container
   */
  className?: string;
  /**
   * Logo animation state
   * @default "idle"
   */
  logoState?: LogoState;
  /**
   * Page-specific accent color for subtle header highlights
   * @default "chat"
   */
  accentColor?: "chat" | "models" | "roles" | "settings" | "none";
  /**
   * Whether to show the menu button
   * @default true
   */
  showMenu?: boolean;
  /**
   * Custom menu click handler (if not provided, uses AppMenuDrawer hook)
   */
  onMenuClick?: () => void;
}

/**
 * PageLayout - Unified layout component for all pages
 *
 * Replaces ChatLayout and BookLayout with a consistent structure:
 * - Unified 64px header with BrandWordmark
 * - Consistent content container (max-w-5xl)
 * - Standardized padding (px-4 sm:px-6)
 * - Page-specific accent colors
 * - Glass morphism header
 */
export function PageLayout({
  children,
  title,
  headerActions,
  className,
  logoState = "idle",
  accentColor = "chat",
  showMenu = true,
  onMenuClick: customOnMenuClick,
}: PageLayoutProps) {
  const { openMenu } = useMenuDrawer();
  const handleMenuClick = customOnMenuClick ?? openMenu;

  // Map accent colors to gradient classes
  const accentGradient = {
    chat: "from-accent-chat/[0.02] via-transparent to-accent-models/[0.02]",
    models: "from-accent-models/[0.02] via-transparent to-accent-roles/[0.02]",
    roles: "from-accent-roles/[0.02] via-transparent to-accent-chat/[0.02]",
    settings: "from-accent-settings/[0.02] via-transparent to-accent-chat/[0.02]",
    none: "from-transparent via-transparent to-transparent",
  }[accentColor];

  return (
    <div className="relative flex h-[calc(var(--vh,1vh)*100)] w-full flex-col bg-bg-app text-ink-primary overflow-hidden selection:bg-brand-primary/30">
      {/* Unified Header - 64px height, consistent across all pages */}
      <header className="sticky top-0 z-header glass-header shadow-sm relative overflow-hidden">
        {/* Subtle gradient overlay based on page accent */}
        <div
          className={cn("absolute inset-0 bg-gradient-to-r pointer-events-none", accentGradient)}
        />
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6 relative z-10">
          {/* Left: Menu + Brand */}
          <div className="flex items-center gap-3">
            {showMenu && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMenuClick}
                aria-label="Menü öffnen"
                className={cn(
                  "text-ink-primary hover:bg-surface-2 ripple-effect",
                  "hover:text-brand-primary transition-colors duration-200",
                )}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <div className="flex items-center gap-2">
              <BrandWordmark
                className="h-5 w-auto text-ink-primary"
                state={logoState}
                data-testid="brand-logo"
              />
              <span className="sr-only">Disa AI</span>
            </div>
            {title && (
              <p className="text-base font-semibold tracking-tight text-ink-primary sm:text-lg title-transition">
                {title}
              </p>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 pr-safe-right">{headerActions}</div>
        </div>
      </header>

      {/* Main Page Content Area - Consistent container */}
      <div
        className={cn(
          "flex-1 relative flex flex-col w-full max-w-5xl mx-auto overflow-hidden px-4 sm:px-6",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
