/**
 * Lazy Syntax Highlighter Service
 *
 * Lädt Prism.js nur bei Bedarf und nur wenn Feature-Flag aktiv ist.
 */

import { isFeatureEnabled } from "../../config/flags";
import { logWarn } from "../logging";
import { loadScript } from "../utils/loadScript";

interface PrismStatic {
  highlight: (text: string, grammar: any, language: string) => string;
  languages: Record<string, any>;
  plugins?: any;
}

declare global {
  interface Window {
    Prism?: PrismStatic;
  }
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

const PRISM_BASE_URL = "https://cdn.jsdelivr.net/npm/prismjs@1.30.0";
const PRISM_CORE_ID = "prism-core";
const PRISM_LANGUAGE_COMPONENTS = [
  "clike",
  "markup",
  "bash",
  "c",
  "cpp",
  "go",
  "java",
  "javascript",
  "json",
  "markdown",
  "python",
  "rust",
  "typescript",
  "yaml",
  "css",
] as const;

async function loadPrism(): Promise<PrismStatic> {
  if (!isFeatureEnabled("lazyHighlighter")) {
    throw new Error("Lazy highlighting disabled via feature flag");
  }

  if (prismInstance) return prismInstance;
  if (prismLoadingPromise) return prismLoadingPromise;

  prismLoadingPromise = (async () => {
    try {
      if (typeof window === "undefined") {
        throw new Error("Prism requires a browser environment");
      }

      await loadScript({
        id: PRISM_CORE_ID,
        src: `${PRISM_BASE_URL}/prism.min.js`,
        crossOrigin: "anonymous",
        referrerPolicy: "no-referrer",
      });

      await Promise.all(
        PRISM_LANGUAGE_COMPONENTS.map((language) =>
          loadScript({
            id: `prism-language-${language}`,
            src: `${PRISM_BASE_URL}/components/prism-${language}.min.js`,
            crossOrigin: "anonymous",
            referrerPolicy: "no-referrer",
          }),
        ),
      );

      const Prism = window.Prism;
      if (!Prism) {
        throw new Error("Prism global not found after loading scripts");
      }

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
