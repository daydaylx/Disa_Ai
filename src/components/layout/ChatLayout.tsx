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
    <div className="relative flex h-[calc(var(--vh,1vh)*100)] w-full flex-col bg-slate-900 text-white overflow-hidden selection:bg-accent-primary/30">
      {/* Modern Header with Dark Background and Blue Glow */}
      <header className="sticky top-0 z-header border-b glass-header shadow-lg">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          {/* Left: Hamburger Menu */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              aria-label="Menü öffnen"
              className="text-white hover:bg-surface-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <BrandWordmark
                className="h-5 w-auto text-white"
                state={logoState}
                data-testid="brand-logo"
              />
              <span className="sr-only">Disa AI</span>
            </div>
            {title && (
              <p className="text-base font-semibold tracking-tight text-white sm:text-lg">
                {title}
              </p>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">{headerActions}</div>
        </div>
      </header>
      {/* Blue Glow Effect for Header */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-blue-500/10 rounded-lg blur-xl"></div>
      </div>
      {/* Enhanced Blue Glow around Logo */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <div className="w-20 h-20 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Main Page Content Area */}
      <div
        className={cn(
          "flex-1 relative flex flex-col w-full max-w-5xl mx-auto overflow-hidden px-4 sm:px-6",
          className,
        )}
      >
        <h1 className="sr-only">Disa AI – Chat</h1>
        {children}
      </div>
    </div>
  );
}
