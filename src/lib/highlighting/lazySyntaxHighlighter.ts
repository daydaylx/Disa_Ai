/**
 * Lazy Syntax Highlighter Service
 *
 * Lädt Prism.js nur bei Bedarf und nur wenn Feature-Flag aktiv ist.
 */

import { isFeatureEnabled } from "../../config/flags";
import { logWarn } from "../logging";

interface PrismStatic {
  highlight: (text: string, grammar: any, language: string) => string;
  languages: Record<string, any>;
  plugins?: any;
}

let prismInstance: PrismStatic | null = null;
let prismLoadingPromise: Promise<PrismStatic> | null = null;

const SUPPORTED_LANGUAGES = {
  javascript: "js",
  typescript: "ts",
  python: "py",
  java: "java",
  cpp: "cpp",
  c: "c",
  rust: "rust",
  go: "go",
  json: "json",
  html: "html",
  css: "css",
  bash: "bash",
  yaml: "yaml",
  markdown: "md",
} as const;

async function loadPrism(): Promise<PrismStatic> {
  if (!isFeatureEnabled("lazyHighlighter")) {
    throw new Error("Lazy highlighting disabled via feature flag");
  }

  if (prismInstance) return prismInstance;
  if (prismLoadingPromise) return prismLoadingPromise;

  prismLoadingPromise = (async () => {
    try {
      const PrismModule: any = await import("prismjs");
      const Prism: PrismStatic = PrismModule.default || PrismModule;

      // Basis-Grammatiken zuerst laden (über side-effect Imports, TS-agnostisch)
      await import("prismjs/components/prism-clike.js");
      await import("prismjs/components/prism-markup.js");

      // Wichtige Sprachen nachladen (ebenfalls nur side-effects)
      await Promise.all([
        import("prismjs/components/prism-javascript.js"),
        import("prismjs/components/prism-typescript.js"),
        import("prismjs/components/prism-python.js"),
        import("prismjs/components/prism-java.js"),
        import("prismjs/components/prism-c.js"),
        import("prismjs/components/prism-cpp.js"),
        import("prismjs/components/prism-rust.js"),
        import("prismjs/components/prism-go.js"),
        import("prismjs/components/prism-json.js"),
        import("prismjs/components/prism-css.js"),
        import("prismjs/components/prism-bash.js"),
        import("prismjs/components/prism-yaml.js"),
        import("prismjs/components/prism-markdown.js"),
      ]);

      prismInstance = Prism;
      logWarn("[Lazy Highlighter] Prism.js loaded successfully");
      return prismInstance;
    } catch (error) {
      logWarn("[Lazy Highlighter] Failed to load Prism.js", error as Error);
      prismLoadingPromise = null;
      throw error;
    }
  })();

  return prismLoadingPromise;
}

function normalizeLanguage(language: string): string {
  const normalized = language.toLowerCase();
  const aliases: Record<string, string> = {
    js: "javascript",
    ts: "typescript",
    py: "python",
    sh: "bash",
    yml: "yaml",
    md: "markdown",
    htm: "html",
  };
  return aliases[normalized] || normalized;
}

function isLanguageSupported(language: string): boolean {
  const normalized = normalizeLanguage(language);
  return normalized in SUPPORTED_LANGUAGES || normalized === "text" || normalized === "plain";
}

export async function highlightCode(
  code: string,
  language: string = "text",
): Promise<{
  highlighted: string;
  language: string;
  success: boolean;
  fallback: boolean;
}> {
  if (!isFeatureEnabled("lazyHighlighter")) {
    return { highlighted: code, language: "text", success: false, fallback: true };
  }

  const normalizedLanguage = normalizeLanguage(language);
  if (!isLanguageSupported(normalizedLanguage)) {
    return { highlighted: code, language: "text", success: false, fallback: true };
  }

  try {
    const prism = await loadPrism();
    const grammar = prism.languages[normalizedLanguage];
    if (!grammar) {
      logWarn(`[Lazy Highlighter] Grammar for "${normalizedLanguage}" not found`);
      return { highlighted: code, language: "text", success: false, fallback: true };
    }

    const highlighted = prism.highlight(code, grammar, normalizedLanguage);
    return { highlighted, language: normalizedLanguage, success: true, fallback: false };
  } catch (error) {
    logWarn("[Lazy Highlighter] Highlighting failed", error as Error);
    return { highlighted: code, language: "text", success: false, fallback: true };
  }
}

export async function preloadHighlighter(): Promise<boolean> {
  if (!isFeatureEnabled("lazyHighlighter")) return false;
  try {
    await loadPrism();
    return true;
  } catch {
    return false;
  }
}

export function getHighlighterStatus() {
  return {
    featureFlagEnabled: isFeatureEnabled("lazyHighlighter"),
    prismLoaded: !!prismInstance,
    isLoading: !!prismLoadingPromise && !prismInstance,
    supportedLanguages: Object.keys(SUPPORTED_LANGUAGES),
  };
}
