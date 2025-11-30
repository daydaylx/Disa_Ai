/**
 * Font Loading Strategy for Disa_AI Application
 *
 * Implements best practices for web font loading including:
 * - Preloading critical fonts
 * - Font Display Swap strategy
 * - Fallback font handling
 */

export interface FontConfig {
  fontFamily: string;
  fontDisplay?: "auto" | "block" | "swap" | "fallback" | "optional";
  fontStyle?: string;
  fontWeight?: string | number;
  unicodeRange?: string;
  variant?: string;
}

export class FontLoader {
  private static readonly FONT_LOAD_TIMEOUT = 5000; // 5 seconds

  /**
   * Dynamically load a font with a timeout
   */
  static async loadFont(config: FontConfig): Promise<boolean> {
    return new Promise((resolve) => {
      const controller = new AbortController();

      // Create a timeout to prevent hanging
      const timeoutId = setTimeout(() => {
        controller.abort();
        resolve(false);
      }, this.FONT_LOAD_TIMEOUT);

      // Create font face
      const fontFace = new FontFace(config.fontFamily, `url(${this.getFontUrl(config)})`, {
        style: config.fontStyle || "normal",
        weight:
          typeof config.fontWeight === "string"
            ? config.fontWeight
            : String(config.fontWeight || "normal"),
        display: config.fontDisplay || "swap",
        unicodeRange: config.unicodeRange,
      });

      fontFace
        .load()
        .then(() => {
          // Add to document
          (document as any).fonts.add(fontFace);
          clearTimeout(timeoutId);
          resolve(true);
        })
        .catch(() => {
          clearTimeout(timeoutId);
          resolve(false);
        });

      // Timeout cleanup
      controller.signal.addEventListener("abort", () => {
        clearTimeout(timeoutId);
        resolve(false);
      });
    });
  }

  /**
   * Check if a font is loaded
   */
  static isFontLoaded(fontFamily: string, testText = "AxmTYklsjo190QW"): boolean {
    try {
      // Use the Font Loading API if available
      if ("fonts" in document) {
        return (
          (document as any).fonts.check(`12px ${fontFamily}`) ||
          (document as any).fonts.check(`bold 12px ${fontFamily}`) ||
          (document as any).fonts.check(`italic 12px ${fontFamily}`)
        );
      }

      // Fallback to canvas measurement
      return this.isFontAvailable(fontFamily, testText);
    } catch {
      return true; // Assume available if we can't check
    }
  }

  /**
   * Canvas-based font detection
   */
  private static isFontAvailable(fontFamily: string, testText: string): boolean {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return true;

    const baseline = "monospace";

    context.font = `72px ${baseline}`;
    const baselineSize = context.measureText(testText).width;

    context.font = `72px "${fontFamily}", ${baseline}`;
    const measuredSize = context.measureText(testText).width;

    // If sizes are the same, the font is not available
    return Math.abs(measuredSize - baselineSize) > 1;
  }

  /**
   * Get font URL based on config
   */
  private static getFontUrl(config: FontConfig): string {
    // This would normally return the actual font file URL
    // For now we'll simulate it
    return config.variant || "";
  }
}
