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
  private static readonly FONT_CSS_URLS = [
    "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap",
    "https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600;700&display=swap",
  ];

  /**
   * Preload critical fonts before they are needed
   */
  static preloadCriticalFonts(): void {
    // Create link elements for preloading
    this.FONT_CSS_URLS.forEach((url) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "style";
      link.href = url;
      link.onload = () => {
        // After preload, set the actual font stylesheet
        const fontLink = document.createElement("link");
        fontLink.rel = "stylesheet";
        fontLink.href = url;
        document.head.appendChild(fontLink);
      };
      document.head.appendChild(link);
    });

    // Add font-display swap to prevent invisible text
    this.injectFontFaceRule();
  }

  /**
   * Inject custom font-face rule with swap display strategy
   */
  private static injectFontFaceRule(): void {
    const style = document.createElement("style");
    style.textContent = `
      @font-face {
        font-family: 'Plus Jakarta Sans';
        font-display: swap;
        src: url('https://fonts.gstatic.com/s/plusjakartasans/v8/tuw4NstQCU5Hn3b8_v8DHKCZ3fiqHwjx.woff2') format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
      
      @font-face {
        font-family: 'Fira Code';
        font-display: swap;
        src: url('https://fonts.gstatic.com/s/firacode/v22/uU9NCBsR6Z2vfE9aq3bh0NSDulI.woff2') format('woff2');
        unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
      }
    `;
    document.head.appendChild(style);
  }

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

  /**
   * Apply font loading strategy to document
   */
  static applyFontStrategy(): void {
    // Add preload links for critical fonts
    try {
      this.preloadCriticalFonts();
    } catch (error) {
      console.warn("Font preloading failed:", error);
      // Fallback: just load the fonts normally
      this.loadFontsNormally();
    }
  }

  /**
   * Fallback method to load fonts normally if preloading fails
   */
  private static loadFontsNormally(): void {
    // Create link elements for the Google Fonts
    this.FONT_CSS_URLS.forEach((url) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = url;
      link.crossOrigin = "anonymous";
      document.head.appendChild(link);
    });
  }

  /**
   * Initialize font strategy on document ready
   */
  static initialize(): void {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.applyFontStrategy());
    } else {
      this.applyFontStrategy();
    }
  }
}

// Initialize font loading when DOM is ready
if (typeof document !== "undefined") {
  FontLoader.initialize();
}
