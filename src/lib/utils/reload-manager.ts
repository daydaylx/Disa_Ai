/**
 * Centralized Reload Manager
 *
 * Consolidates all page reload functionality to prevent race conditions
 * and provide better control over when/how the app reloads.
 */

type ReloadReason =
  | "service-worker-update"
  | "critical-error"
  | "user-requested"
  | "settings-change"
  | "deployment-update"
  | "memory-pressure"
  | "ab-test-change";

interface ReloadOptions {
  reason: ReloadReason;
  delay?: number;
  force?: boolean;
  preventDuplicates?: boolean;
}

class ReloadManager {
  private isReloading = false;
  private reloadTimeout: ReturnType<typeof setTimeout> | null = null;
  private lastReloadTime = 0;
  private minReloadInterval = 1000; // Minimum 1 second between reloads

  /**
   * Safely reload the page with proper debouncing and error handling
   */
  reload(options: ReloadOptions): void {
    const { reason, delay = 0, force = false, preventDuplicates = true } = options;

    // Prevent duplicate reloads unless forced
    if (this.isReloading && preventDuplicates && !force) {
      console.warn(`[ReloadManager] Reload already in progress, ignoring: ${reason}`);
      return;
    }

    // Prevent rapid successive reloads
    const now = Date.now();
    if (now - this.lastReloadTime < this.minReloadInterval && !force) {
      console.warn(`[ReloadManager] Reload too soon after last reload, ignoring: ${reason}`);
      return;
    }

    this.isReloading = true;
    this.lastReloadTime = now;

    // eslint-disable-next-line no-console
    console.log(
      `[ReloadManager] Scheduling reload: ${reason}${delay > 0 ? ` (delay: ${delay}ms)` : ""}`,
    );

    // Clear any existing reload timeout
    if (this.reloadTimeout) {
      clearTimeout(this.reloadTimeout);
    }

    // Schedule the reload
    this.reloadTimeout = setTimeout(() => {
      try {
        // Dispatch event before reload for cleanup
        window.dispatchEvent(
          new CustomEvent("app-before-reload", {
            detail: { reason },
          }),
        );

        // Add small delay to allow React cleanup
        setTimeout(() => {
          // Perform the actual reload
          window.location.reload();
        }, 150);
      } catch (error) {
        console.error(`[ReloadManager] Failed to reload for reason: ${reason}`, error);
        this.isReloading = false;

        // Fallback: try alternative reload methods
        this.fallbackReload();
      }
    }, delay);
  }

  /**
   * Cancel a scheduled reload
   */
  cancelReload(): void {
    if (this.reloadTimeout) {
      clearTimeout(this.reloadTimeout);
      this.reloadTimeout = null;
      this.isReloading = false;
      // eslint-disable-next-line no-console
      console.log("[ReloadManager] Reload cancelled");
    }
  }

  /**
   * Check if a reload is currently scheduled or in progress
   */
  isReloadPending(): boolean {
    return this.isReloading;
  }

  /**
   * Fallback reload methods if primary method fails
   */
  private fallbackReload(): void {
    try {
      // Try location.href assignment
      const currentUrl = window.location.href;
      window.location.href = currentUrl;
    } catch (error1) {
      try {
        // Try location.replace
        window.location.replace(window.location.href);
      } catch (error2) {
        console.error("[ReloadManager] All reload methods failed", { error1, error2 });
        // At this point, we can't reload - maybe show a manual reload prompt
        this.showManualReloadPrompt();
      }
    }
  }

  /**
   * Show a user prompt to manually reload when automatic reload fails
   */
  private showManualReloadPrompt(): void {
    const event = new CustomEvent("disa:toast", {
      detail: {
        kind: "error",
        title: "Aktualisierung erforderlich",
        message:
          "Die automatische Aktualisierung ist fehlgeschlagen. Bitte laden Sie die Seite manuell neu.",
        action: {
          label: "Manuell neu laden",
          onClick: () => {
            // User-triggered reload
            try {
              window.location.reload();
            } catch {
              // If that fails too, show browser refresh instruction
              alert("Bitte drücken Sie F5 oder Strg+R um die Seite zu aktualisieren.");
            }
          },
        },
        durationMs: 0, // Persistent until user acts
      },
    });
    window.dispatchEvent(event);
  }

  /**
   * Cleanup method for when the manager is destroyed
   */
  destroy(): void {
    this.cancelReload();
  }
}

// Singleton instance
export const reloadManager = new ReloadManager();

// React hook for components that need reload functionality
export function useReloadManager() {
  return {
    reload: (options: ReloadOptions) => reloadManager.reload(options),
    cancelReload: () => reloadManager.cancelReload(),
    isReloadPending: () => reloadManager.isReloadPending(),
  };
}

// Helper functions for common reload scenarios
export const reloadHelpers = {
  serviceWorkerUpdate: (delay = 0) =>
    reloadManager.reload({
      reason: "service-worker-update",
      delay,
      preventDuplicates: true,
    }),

  criticalError: (force = true) =>
    reloadManager.reload({
      reason: "critical-error",
      force,
      delay: 100,
    }),

  userRequested: () =>
    reloadManager.reload({
      reason: "user-requested",
      force: true,
      delay: 0,
    }),

  settingsChange: (delay = 500) =>
    reloadManager.reload({
      reason: "settings-change",
      delay,
      preventDuplicates: true,
    }),
};
