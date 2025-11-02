/**
 * Enhanced PWA Installation Management
 * Provides stable, user-friendly PWA installation experience
 */

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let installPromptShown = false;

/**
 * Initialize PWA installation prompt handling
 */
export function initPWAInstallPrompt(): void {
  // Handle beforeinstallprompt event
  window.addEventListener("beforeinstallprompt", (e: Event) => {
    console.warn("[PWA] Install prompt available");

    // Prevent the default mini-infobar from appearing
    e.preventDefault();

    // Store the event for later use
    deferredPrompt = e as BeforeInstallPromptEvent;

    // Show our custom install prompt after a delay
    setTimeout(showInstallPrompt, 3000);
  });

  // Handle successful app installation
  window.addEventListener("appinstalled", () => {
    console.warn("[PWA] App successfully installed");
    deferredPrompt = null;
    installPromptShown = false;

    // Store installation status
    localStorage.setItem("pwa-installed", "true");
  });

  // Check if already installed
  if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) {
    localStorage.setItem("pwa-installed", "true");
  }
}

/**
 * Show custom PWA installation prompt
 */
function showInstallPrompt(): void {
  if (!deferredPrompt || installPromptShown) return;
  if (localStorage.getItem("pwa-install-dismissed") === "true") return;
  if (localStorage.getItem("pwa-installed") === "true") return;

  installPromptShown = true;

  // Create custom install prompt (you can customize this UI)
  const installBanner = document.createElement("div");
  installBanner.id = "pwa-install-banner";
  installBanner.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      left: 20px;
      right: 20px;
      background: rgba(var(--accent-color-rgb), 0.95);
      backdrop-filter: blur(10px);
      color: white;
      padding: var(--space-md);
      border-radius: var(--radius-install-prompt);
      box-shadow: var(--shadow-neumorphic-lg);
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 12px;
      font-family: system-ui, -apple-system, sans-serif;
    ">
      <div style="flex: 1;">
        <div style="font-weight: 600; margin-bottom: 4px;">Disa AI installieren</div>
        <div style="font-size: 14px; opacity: 0.9;">Für schnelleren Zugriff und bessere Performance</div>
      </div>
      <button id="pwa-install-btn" style="
        background: white;
        color: var(--accent-color);
        border: none;
        padding: calc(var(--space-sm) - 4px) var(--space-sm);
        border-radius: var(--radius-focus);
        font-weight: 600;
        cursor: pointer;
      ">Installieren</button>
      <button id="pwa-dismiss-btn" style="
        background: transparent;
        color: white;
        border: var(--border-neumorphic-light);
        padding: calc(var(--space-sm) - 4px) var(--space-md);
        border-radius: var(--radius-focus);
        cursor: pointer;
      ">×</button>
    </div>
  `;

  document.body.appendChild(installBanner);

  // Handle install button click
  document.getElementById("pwa-install-btn")?.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      console.warn("[PWA] User choice:", choiceResult.outcome);

      if (choiceResult.outcome === "accepted") {
        localStorage.setItem("pwa-installed", "true");
      }
    } catch (error) {
      console.error("[PWA] Installation failed:", error);
    }

    // Remove prompt
    installBanner.remove();
    deferredPrompt = null;
  });

  // Handle dismiss button click
  document.getElementById("pwa-dismiss-btn")?.addEventListener("click", () => {
    localStorage.setItem("pwa-install-dismissed", "true");
    installBanner.remove();
  });

  // Auto-hide after 10 seconds
  setTimeout(() => {
    if (document.getElementById("pwa-install-banner")) {
      installBanner.remove();
    }
  }, 10000);
}

/**
 * Check if PWA can be installed
 */
export function canInstallPWA(): boolean {
  return !!deferredPrompt && !installPromptShown;
}

/**
 * Manually trigger PWA installation
 */
export async function installPWA(): Promise<boolean> {
  if (!deferredPrompt) {
    console.warn("[PWA] No install prompt available");
    return false;
  }

  try {
    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      localStorage.setItem("pwa-installed", "true");
      return true;
    }

    return false;
  } catch (error) {
    console.error("[PWA] Manual installation failed:", error);
    return false;
  }
}
