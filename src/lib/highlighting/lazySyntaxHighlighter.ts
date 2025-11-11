/**
 * Lazy Syntax Highlighter Service
 *
 * Issue-Prompt #8: Highlighter/Markdown nur "on demand"
 * Feature-Flag: lazyHighlighter
 *
 * Lädt Prism.js nur bei Bedarf und nur wenn Feature-Flag aktiv ist.
 */

import { isFeatureEnabled } from "../../config/flags";
import { logWarn } from "../logging";

// Typed Prism interface für bessere TypeScript-Unterstützung
interface PrismStatic {
  highlight: (text: string, grammar: any, language: string) => string;
  languages: Record<string, any>;
  plugins?: any;
}

// Cache für geladene Prism-Instanz
let prismInstance: PrismStatic | null = null;
let prismLoadingPromise: Promise<PrismStatic> | null = null;

/**
 * Unterstützte Sprachen für Syntax-Highlighting
 * Fokus auf die häufigsten Programmiersprachen
 */
const SUPPORTED_LANGUAGES = {
  javascript: "js",
  typescript: "ts",
  python: "py",
  java: "java",
  cpp: "cpp",
  c: "c",
  rust: "rust",
  go: "go",
  php: "php",
  ruby: "rb",
  swift: "swift",
  kotlin: "kt",
  scala: "scala",
  shell: "bash",
  bash: "bash",
  json: "json",
  xml: "xml",
  html: "html",
  css: "css",
  scss: "scss",
  sql: "sql",
  yaml: "yaml",
  markdown: "md",
  dockerfile: "docker",
  nginx: "nginx",
} as const;

/**
 * Lazy Load Prism.js mit spezifischen Sprachen
 * Nur wenn Feature-Flag aktiv ist
 */
async function loadPrism(): Promise<PrismStatic> {
  // Feature-Flag Check
  if (!isFeatureEnabled("lazyHighlighter")) {
    throw new Error("Lazy highlighting disabled via feature flag");
  }

  // Return cached instance
  if (prismInstance) {
    return prismInstance;
  }

  // Return existing loading promise
  if (prismLoadingPromise) {
    return prismLoadingPromise;
  }

  // Start loading
  prismLoadingPromise = (async () => {
    try {
      // Dynamic import von Prism.js Core (sicherstellen, dass es vollständig geladen ist)
      const PrismModule = await import("prismjs");
      const Prism = PrismModule.default || PrismModule;

      // Wichtige Sprachen nachladen (Typdeklarationen in vite-env.d.ts)
      // Wichtig: Importiere sie in der richtigen Reihenfolge, um Abhängigkeiten zu vermeiden
      const languageImports = [
        import("prismjs/components/prism-javascript"),
        import("prismjs/components/prism-typescript"),
        import("prismjs/components/prism-python"),
        import("prismjs/components/prism-java"),
        import("prismjs/components/prism-cpp"),
        import("prismjs/components/prism-rust"),
        import("prismjs/components/prism-go"),
        import("prismjs/components/prism-json"),
        import("prismjs/components/prism-bash"),
        import("prismjs/components/prism-css"),
        import("prismjs/components/prism-sql"),
        import("prismjs/components/prism-yaml"),
        import("prismjs/components/prism-markdown"),
      ];

      // Warte auf alle Sprachimporte
      await Promise.all(languageImports);

      // Stelle sicher, dass Prism vollständig initialisiert ist
      prismInstance = Prism;

      logWarn("[Lazy Highlighter] Prism.js loaded successfully");
      return prismInstance;
    } catch (error) {
      logWarn("[Lazy Highlighter] Failed to load Prism.js", error as Error);
      prismLoadingPromise = null; // Reset for retry
      throw error;
    }
  })();

  return prismLoadingPromise;
}

/**
 * Sprache normalisieren (Aliase unterstützen)
 */
function normalizeLanguage(language: string): string {
  const normalized = language.toLowerCase();

  // Bekannte Aliase
  const aliases: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    py: "python",
    rb: "ruby",
    sh: "bash",
    yml: "yaml",
    md: "markdown",
    htm: "html",
  };

  return aliases[normalized] || normalized;
}

/**
 * Prüft ob eine Sprache unterstützt wird
 */
function isLanguageSupported(language: string): boolean {
  const normalized = normalizeLanguage(language);
  return normalized in SUPPORTED_LANGUAGES || normalized === "text" || normalized === "plain";
}

/**
 * Highlight-Code mit Lazy Loading
 *
 * @param code - Code-String zum Highlighten
 * @param language - Programmiersprache
 * @returns Promise mit gehighlightetem HTML oder original code bei Fehlern
 */
export async function highlightCode(
  code: string,
  language: string = "text",
): Promise<{
  highlighted: string;
  language: string;
  success: boolean;
  fallback: boolean;
}> {
  // Feature-Flag Check
  if (!isFeatureEnabled("lazyHighlighter")) {
    return {
      highlighted: code,
      language: "text",
      success: false,
      fallback: true,
    };
  }

  const normalizedLanguage = normalizeLanguage(language);

  // Unsupported language → Fallback
  if (!isLanguageSupported(normalizedLanguage)) {
    return {
      highlighted: code,
      language: "text",
      success: false,
      fallback: true,
    };
  }

  try {
    const prism = await loadPrism();

    // Language grammar check
    const grammar = prism.languages[normalizedLanguage];
    if (!grammar) {
      logWarn(`[Lazy Highlighter] Grammar for "${normalizedLanguage}" not found`);
      return {
        highlighted: code,
        language: "text",
        success: false,
        fallback: true,
      };
    }

    // Perform highlighting
    const highlighted = prism.highlight(code, grammar, normalizedLanguage);

    return {
      highlighted,
      language: normalizedLanguage,
      success: true,
      fallback: false,
    };
  } catch (error) {
    logWarn("[Lazy Highlighter] Highlighting failed", error as Error);

    return {
      highlighted: code,
      language: "text",
      success: false,
      fallback: true,
    };
  }
}

/**
 * Preload Prism.js (optional, für bessere UX)
 * Kann aufgerufen werden wenn Code-Blöcke wahrscheinlich sind
 */
export async function preloadHighlighter(): Promise<boolean> {
  if (!isFeatureEnabled("lazyHighlighter")) {
    return false;
  }

  try {
    await loadPrism();
    return true;
  } catch {
    return false;
  }
}

/**
 * Syntax-Highlighter-Status für Debugging
 */
export function getHighlighterStatus() {
  return {
    featureFlagEnabled: isFeatureEnabled("lazyHighlighter"),
    prismLoaded: !!prismInstance,
    isLoading: !!prismLoadingPromise && !prismInstance,
    supportedLanguages: Object.keys(SUPPORTED_LANGUAGES),
  };
}
