/**
 * PWA Feature Handlers
 *
 * Handles share targets, protocol handlers, file handlers, and launch handlers
 * for native app-like experiences
 */

export interface ShareData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

export interface ProtocolHandlerData {
  action: string;
  params?: Record<string, string>;
}

export interface FileHandlerData {
  files: File[];
  source: "file_handler" | "drag_drop" | "file_input";
}

/**
 * Handle incoming share target data
 */
export function handleShareTarget(): ShareData | null {
  if (typeof window === "undefined") return null;

  const urlParams = new URLSearchParams(window.location.search);

  const shareData: ShareData = {
    title: urlParams.get("title") || undefined,
    text: urlParams.get("text") || undefined,
    url: urlParams.get("url") || undefined,
  };

  // Only return if we actually have share data
  if (shareData.title || shareData.text || shareData.url) {
    // Clean up URL after handling
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete("title");
    newUrl.searchParams.delete("text");
    newUrl.searchParams.delete("url");

    if (newUrl.search !== window.location.search) {
      window.history.replaceState({}, "", newUrl.toString());
    }

    return shareData;
  }

  return null;
}

/**
 * Handle protocol handler activation
 */
export function handleProtocolHandler(): ProtocolHandlerData | null {
  if (typeof window === "undefined") return null;

  const urlParams = new URLSearchParams(window.location.search);
  const handler = urlParams.get("handler");

  if (!handler) return null;

  try {
    // Parse protocol data (format: protocol://action?param1=value1&param2=value2)
    const protocolUrl = new URL(handler);
    const action = protocolUrl.pathname.replace(/^\/+/, "") || protocolUrl.hostname;

    const params: Record<string, string> = {};
    protocolUrl.searchParams.forEach((value, key) => {
      params[key] = value;
    });

    // Clean up URL
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete("handler");

    if (newUrl.search !== window.location.search) {
      window.history.replaceState({}, "", newUrl.toString());
    }

    return { action, params };
  } catch (error) {
    console.error("Failed to parse protocol handler data:", error);
    return null;
  }
}

/**
 * Handle file drop or file handler activation
 */
export function handleFiles(
  files: File[] | FileList,
  source: FileHandlerData["source"] = "file_input",
): FileHandlerData {
  const fileArray = Array.from(files);

  return {
    files: fileArray,
    source,
  };
}

/**
 * Process shared text into a chat message
 */
export function processSharedText(shareData: ShareData): string {
  const parts: string[] = [];

  if (shareData.title) {
    parts.push(`**${shareData.title}**`);
  }

  if (shareData.text) {
    parts.push(shareData.text);
  }

  if (shareData.url) {
    parts.push(`\nQuelle: ${shareData.url}`);
  }

  return parts.join("\n\n").trim();
}

/**
 * Process shared files into chat content
 */
export async function processSharedFiles(files: File[]): Promise<string> {
  const results: string[] = [];

  for (const file of files) {
    try {
      if (
        file.type.startsWith("text/") ||
        file.name.endsWith(".md") ||
        file.name.endsWith(".txt")
      ) {
        // Read text files
        const content = await file.text();
        results.push(`**Datei: ${file.name}**\n\`\`\`\n${content.substring(0, 10000)}\n\`\`\``);
      } else if (file.type === "application/json") {
        // Read JSON files
        const content = await file.text();
        try {
          const parsed = JSON.parse(content);
          results.push(
            `**JSON-Datei: ${file.name}**\n\`\`\`json\n${JSON.stringify(parsed, null, 2).substring(0, 10000)}\n\`\`\``,
          );
        } catch {
          results.push(`**Datei: ${file.name}**\n\`\`\`\n${content.substring(0, 10000)}\n\`\`\``);
        }
      } else {
        // For other file types, just show metadata
        results.push(
          `**Datei: ${file.name}**\nGröße: ${formatFileSize(file.size)}\nTyp: ${file.type || "unbekannt"}\n\n*Diese Datei kann nicht direkt angezeigt werden, aber Sie können Fragen dazu stellen.*`,
        );
      }
    } catch (error) {
      results.push(
        `**Fehler beim Lesen der Datei: ${file.name}**\n${error instanceof Error ? error.message : "Unbekannter Fehler"}`,
      );
    }
  }

  return results.join("\n\n---\n\n");
}

/**
 * Handle protocol actions
 */
export function handleProtocolAction(
  action: string,
  params: Record<string, string>,
): {
  route?: string;
  message?: string;
  action?: string;
} {
  switch (action.toLowerCase()) {
    case "chat":
    case "new":
      return {
        route: "/",
        message: params.message || params.text || "",
      };

    case "settings":
      return {
        route: "/settings",
      };

    case "models":
      return {
        route: "/models",
      };

    case "history":
      return {
        route: "/",
        action: "show_history",
      };

    case "export":
      return {
        action: "export_conversations",
      };

    case "import":
      return {
        action: "import_conversations",
      };

    default:
      console.warn("Unknown protocol action:", action);
      return {
        route: "/",
      };
  }
}

/**
 * Format file size for display
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Check if PWA features are supported
 */
export function checkPWASupport() {
  return {
    shareTarget: "navigator" in window && "share" in navigator,
    protocolHandler: "navigator" in window && "registerProtocolHandler" in navigator,
    fileHandler: "launchQueue" in window,
    serviceWorker: "serviceWorker" in navigator,
    webAppManifest: "manifest" in document.createElement("link"),
  };
}

/**
 * Register protocol handler (if supported)
 */
export function registerProtocolHandler() {
  try {
    if ("navigator" in window && "registerProtocolHandler" in navigator) {
      navigator.registerProtocolHandler("web+disa", `${window.location.origin}/?handler=%s`);
      return true;
    }
  } catch (error) {
    console.error("Failed to register protocol handler:", error);
  }
  return false;
}

/**
 * Trigger native share (if supported)
 */
export async function triggerNativeShare(data: {
  title?: string;
  text?: string;
  url?: string;
}): Promise<boolean> {
  try {
    if ("navigator" in window && "share" in navigator) {
      await navigator.share(data);
      return true;
    }
  } catch (error) {
    // User cancelled or error occurred
    console.error("Native share failed:", error);
  }
  return false;
}

/**
 * Initialize PWA handlers
 */
export function initializePWAHandlers() {
  // Handle launch queue for file handlers
  if ("launchQueue" in window) {
    (window as any).launchQueue.setConsumer((launchParams: any) => {
      if (launchParams.files && launchParams.files.length > 0) {
        // Dispatch custom event for file handling
        const event = new CustomEvent("pwa-files-received", {
          detail: { files: launchParams.files, source: "file_handler" },
        });
        window.dispatchEvent(event);
      }
    });
  }

  // Handle drag and drop files
  document.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  document.addEventListener("drop", (e) => {
    e.preventDefault();

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      const event = new CustomEvent("pwa-files-received", {
        detail: { files: Array.from(e.dataTransfer.files), source: "drag_drop" },
      });
      window.dispatchEvent(event);
    }
  });

  // Register protocol handler on user interaction
  document.addEventListener(
    "click",
    () => {
      registerProtocolHandler();
    },
    { once: true },
  );
}

/**
 * Get installation prompt (if available)
 */
let deferredPrompt: any = null;

export function setupInstallPrompt() {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Dispatch event to show install button
    const event = new CustomEvent("pwa-install-available");
    window.dispatchEvent(event);
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;

    // Dispatch event to hide install button
    const event = new CustomEvent("pwa-installed");
    window.dispatchEvent(event);
  });
}

/**
 * Trigger installation prompt
 */
export async function triggerInstallPrompt(): Promise<boolean> {
  if (!deferredPrompt) return false;

  try {
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    deferredPrompt = null;

    return result.outcome === "accepted";
  } catch (error) {
    console.error("Install prompt failed:", error);
    return false;
  }
}
