export interface CopyResult {
  success: boolean;
  error?: string;
}

export async function copyToClipboard(text: string): Promise<CopyResult> {
  try {
    // Try modern Clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return { success: true };
    }

    // Fallback for older browsers or non-secure contexts
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);

    if (successful) {
      return { success: true };
    } else {
      return { success: false, error: "Copy command failed" };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown clipboard error",
    };
  }
}

export function showCopyFeedback(success: boolean, error?: string) {
  // For now, use a simple console log - could be enhanced with toast notifications
  if (success) {
    // Text successfully copied to clipboard
  } else {
    console.error("❌ Failed to copy:", error);
  }
}
