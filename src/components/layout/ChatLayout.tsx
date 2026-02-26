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
  headerActions?: ReactNode;
  subHeader?: ReactNode;
}

export function ChatLayout({
  children,
  title,
  onMenuClick,
  className,
  logoState = "idle",
  headerActions,
  subHeader,
}: ChatLayoutProps) {
  return (
    <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-bg-app text-ink-primary selection:bg-accent-primary/30">
      <header className="relative z-header overflow-hidden border-b border-white/12 bg-surface-2/92 shadow-[0_6px_20px_rgba(0,0,0,0.28)] backdrop-blur-md">
        <div className="relative z-content mx-auto flex h-header w-full max-w-5xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
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
                className="chat-brandwordmark h-5 w-auto text-ink-primary"
                state={logoState}
                data-testid="brand-logo"
              />
              <span className="sr-only">Disa AI</span>
            </div>
            {title && (
              <p className="max-w-[38vw] truncate text-[0.95rem] font-semibold tracking-[0.005em] text-ink-primary sm:max-w-[52vw]">
                {title}
              </p>
            )}
          </div>

          {headerActions ? (
            <div className="ml-3 flex items-center gap-2">{headerActions}</div>
          ) : null}
        </div>

        {subHeader ? (
          <div className="relative z-content border-t border-white/8 bg-surface-1/62">
            <div className="mx-auto w-full max-w-5xl px-4 py-2 sm:px-6">{subHeader}</div>
          </div>
        ) : null}
      </header>

      <main
        id="main"
        tabIndex={-1}
        className={cn(
          "relative mx-auto flex w-full max-w-5xl min-h-0 flex-1 flex-col overflow-hidden px-4 sm:px-6",
          className,
        )}
      >
        <h1 className="sr-only">Disa AI – Chat</h1>
        {children}
      </main>
    </div>
  );
}
