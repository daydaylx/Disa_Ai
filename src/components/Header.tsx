import { Menu } from "lucide-react";
import React from "react";

import { cn } from "../lib/utils";
import { ThemeToggle } from "./navigation/ThemeToggle";
import { Button } from "./ui/button";

interface HeaderProps {
  status?: "online" | "offline" | "loading" | "error";
  model?: string;
  tokensUsed?: number;
}

const STATUS_META: Record<
  NonNullable<HeaderProps["status"]>,
  { label: string; bg: string; dot: string; text: string }
> = {
  online: {
    label: "Online",
    bg: "bg-status-success-bg",
    dot: "bg-status-success",
    text: "text-status-success",
  },
  offline: {
    label: "Offline",
    bg: "bg-status-danger-bg",
    dot: "bg-status-danger",
    text: "text-status-danger",
  },
  loading: {
    label: "Verbinde",
    bg: "bg-status-warning-bg",
    dot: "bg-status-warning",
    text: "text-status-warning",
  },
  error: {
    label: "Fehler",
    bg: "bg-status-danger-bg",
    dot: "bg-status-danger",
    text: "text-status-danger",
  },
};

export const Header: React.FC<HeaderProps> = ({
  status = "online",
  model = "openrouter/auto",
  tokensUsed = 0,
}) => {
  const [condensed, setCondensed] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setCondensed(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const statusMeta = STATUS_META[status];

  const toggleBottomSheet = () => {
    window.dispatchEvent(
      new CustomEvent("disa:bottom-sheet", { detail: { action: "toggle" as const } }),
    );
  };

  return (
    <header
      className={cn(
        "safe-x sticky top-0 z-40 border-b border-border-hairline bg-surface-base pt-safe-top transition-[padding,box-shadow,background-color] duration-small ease-standard",
        condensed
          ? "pb-[var(--space-sm)] pt-[var(--space-sm)] shadow-surface"
          : "pb-[var(--space-md)] pt-[var(--space-md)]",
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-[var(--space-inline-lg)] px-[var(--space-container-x)]">
        <div className="flex min-w-0 flex-1 items-center gap-[var(--space-inline-md)]">
          <div className="flex size-[var(--size-touch-compact)] items-center justify-center rounded-[var(--radius-lg)] bg-brand-subtle">
            <span className="text-body-strong font-semibold text-brand-primary">DA</span>
          </div>
          <div className="flex min-w-0 flex-col gap-[var(--space-3xs)]">
            <div className="text-title font-semibold leading-tight text-text-primary">Disa AI</div>
            <div className="flex flex-wrap items-center gap-[var(--space-inline-sm)] text-caption text-text-tertiary">
              <span
                className={cn(
                  "inline-flex items-center gap-[var(--space-3xs)] rounded-full px-[var(--space-inline-sm)] py-[var(--space-3xs)]",
                  statusMeta.bg,
                  statusMeta.text,
                )}
              >
                <span
                  className={cn("h-2.5 w-2.5 rounded-full", statusMeta.dot)}
                  aria-hidden="true"
                />
                {statusMeta.label}
              </span>
              <span className="truncate">{model}</span>
              {tokensUsed > 0 ? (
                <span className="text-text-secondary">{tokensUsed} Tokens</span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-[var(--space-inline-sm)]">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Schnellmenü öffnen"
            onClick={toggleBottomSheet}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
