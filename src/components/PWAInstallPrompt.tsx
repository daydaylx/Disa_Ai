import { useState } from "react";

import { usePWAHandlers } from "../hooks/usePWAHandlers";

interface PWAInstallPromptProps {
  className?: string;
  variant?: "banner" | "button" | "card";
  autoHide?: boolean;
  hideDelay?: number;
}

/**
 * PWA Install Prompt Component
 *
 * Shows installation prompt when available and handles user interaction
 */
export function PWAInstallPrompt({
  className = "",
  variant = "banner",
  autoHide = true,
  hideDelay = 10000,
}: PWAInstallPromptProps) {
  const { installPromptAvailable, isInstalled, installApp, support } = usePWAHandlers();
  const [isHidden, setIsHidden] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // Auto-hide after delay
  useState(() => {
    if (autoHide && installPromptAvailable) {
      const timer = setTimeout(() => {
        setIsHidden(true);
      }, hideDelay);

      return () => clearTimeout(timer);
    }
  });

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const result = await installApp();
      if (!result) {
        // User cancelled or error occurred
        setIsHidden(true);
      }
    } catch (error) {
      console.error("Installation failed:", error);
      setIsHidden(true);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsHidden(true);
  };

  // Don't render if not available, already installed, hidden, or no SW support
  if (!installPromptAvailable || isInstalled || isHidden || !support.serviceWorker) {
    return null;
  }

  if (variant === "button") {
    return (
      <button
        onClick={handleInstall}
        disabled={isInstalling}
        className={`bg-accent-primary hover:bg-accent-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      >
        {isInstalling ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <span>Installiere...</span>
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span>App installieren</span>
          </>
        )}
      </button>
    );
  }

  if (variant === "card") {
    return (
      <div
        className={`bg-neutral-light/5 border-neutral-light/10 rounded-lg border p-4 ${className}`}
      >
        <div className="flex items-start gap-3">
          <div className="bg-accent-primary/10 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
            <svg className="text-accent-primary h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-text-primary text-sm font-medium">Disa AI installieren</h3>
            <p className="text-text-secondary mt-1 text-xs">
              Installiere die App für schnelleren Zugriff und Offline-Funktionen.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={handleInstall}
                disabled={isInstalling}
                className="bg-accent-primary hover:bg-accent-primary/90 rounded-md px-3 py-1.5 text-xs text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isInstalling ? "Installiere..." : "Installieren"}
              </button>
              <button
                onClick={handleDismiss}
                className="text-text-secondary hover:text-text-primary px-3 py-1.5 text-xs transition-colors"
              >
                Später
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-text-secondary hover:text-text-primary flex-shrink-0 transition-colors"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // Default banner variant
  return (
    <div
      className={`bg-accent-primary/10 border-accent-primary/20 flex items-center gap-3 rounded-lg border p-3 ${className}`}
    >
      <div className="bg-accent-primary/20 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full">
        <svg className="text-accent-primary h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="flex-1">
        <span className="text-accent-primary text-sm font-medium">
          Disa AI als App installieren für bessere Performance
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleInstall}
          disabled={isInstalling}
          className="bg-accent-primary hover:bg-accent-primary/90 rounded-md px-3 py-1.5 text-sm text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isInstalling ? "Installiere..." : "Installieren"}
        </button>
        <button
          onClick={handleDismiss}
          className="text-accent-primary hover:bg-accent-primary/10 rounded-md px-3 py-1.5 text-sm transition-colors"
        >
          Später
        </button>
      </div>
    </div>
  );
}
