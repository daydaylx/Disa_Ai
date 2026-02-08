import { type ReactNode } from "react";

import { type LogoState } from "@/app/components/AnimatedLogo";
import { BrandWordmark } from "@/app/components/BrandWordmark";
import { Menu } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

interface ChatLayoutProps {
  children: ReactNode;
  title?: string;
  onMenuClick?: () => void;
  className?: string;
  headerActions?: ReactNode;
  logoState?: LogoState;
}

export function ChatLayout({
  children,
  title,
  onMenuClick,
  className,
  headerActions,
  logoState = "idle",
}: ChatLayoutProps) {
  return (
    <div className="relative flex h-[calc(var(--vh,1vh)*100)] w-full flex-col bg-bg-app text-ink-primary overflow-hidden selection:bg-accent-primary/30">
      {/* Enhanced Header with Color Accents */}
      <header className="relative z-header glass-header shadow-sm overflow-hidden h-[3.5rem] sm:h-16">
        {/* Subtle gradient overlay - 25% reduced intensity */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent-chat/[0.02] via-transparent to-accent-models/[0.02] pointer-events-none" />
        <div className="mx-auto flex h-full w-full max-w-5xl items-center justify-between px-4 sm:px-6 relative z-10">
          {/* Left: Hamburger Menu */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              aria-label="Menü öffnen"
              className={cn(
                "text-ink-primary hover:bg-surface-2 ripple-effect",
                "hover:text-accent-chat transition-colors duration-200",
              )}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <BrandWordmark
                className="h-5 w-auto text-ink-primary"
                state={logoState}
                data-testid="brand-logo"
              />
              <span className="sr-only">Disa AI</span>
            </div>
            {title && (
              <p className="text-base font-semibold tracking-tight text-ink-primary sm:text-lg title-transition max-w-[44vw] sm:max-w-[60vw] truncate">
                {title}
              </p>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 pr-safe-right">{headerActions}</div>
        </div>
      </header>

      {/* Main Page Content Area */}
      <div
        className={cn(
          "flex-1 relative flex flex-col w-full max-w-5xl mx-auto overflow-hidden px-4 sm:px-6 min-h-0",
          className,
        )}
      >
        <h1 className="sr-only">Disa AI – Chat</h1>
        {children}
      </div>
    </div>
  );
}
