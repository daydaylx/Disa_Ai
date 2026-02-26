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
  logoState?: LogoState;
}

export function ChatLayout({
  children,
  title,
  onMenuClick,
  className,
  logoState = "idle",
}: ChatLayoutProps) {
  return (
    <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-bg-app text-ink-primary selection:bg-accent-primary/30">
      <header className="relative z-header h-header overflow-hidden border-b border-white/12 bg-surface-2/85 shadow-[0_1px_0_0_rgba(139,92,246,0.2),0_2px_12px_rgba(139,92,246,0.06)] backdrop-blur-xl sm:h-16">
        {/* Subtle brand gradient shimmer across the header */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-brand-primary/[0.08] via-transparent to-accent-chat/[0.06] pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative z-content mx-auto flex h-full w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              aria-label="Menü öffnen"
              className={cn(
                "text-ink-primary transition-colors duration-200",
                "hover:bg-surface-1/70 hover:text-ink-primary",
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
              <p className="max-w-[44vw] truncate text-sm font-medium tracking-tight text-ink-primary sm:max-w-[60vw] sm:text-base">
                {title}
              </p>
            )}
          </div>
        </div>
      </header>

      <main
        id="main"
        tabIndex={-1}
        className={cn(
          "flex-1 relative flex flex-col w-full max-w-5xl mx-auto overflow-hidden px-4 sm:px-6 min-h-0",
          className,
        )}
      >
        <h1 className="sr-only">Disa AI – Chat</h1>
        {children}
      </main>
    </div>
  );
}
