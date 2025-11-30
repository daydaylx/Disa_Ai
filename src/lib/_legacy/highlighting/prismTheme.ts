import { logWarn } from "../logging";
import { loadStylesheet } from "../utils/loadStylesheet";

/**
 * Lazy-loaded Prism.js CSS Theme
 *
 * Lädt Prism CSS nur bei Bedarf und passt es an das Design-System an
 */

let prismCSSLoaded = false;

/**
 * Lädt Prism.js CSS Theme lazy
 * Nur einmal ausgeführt
 */

const PRISM_THEME_URL = "https://cdn.jsdelivr.net/npm/prismjs@1.30.0/themes/prism-tomorrow.min.css";
const PRISM_THEME_INTEGRITY =
  "sha384-wFjoQjtV1y5jVHbt0p35Ui8aV8GVpEZkyF99OXWqP/eNJDU93D3Ugxkoyh6Y2I4A";

export async function loadPrismCSS(): Promise<void> {
  if (prismCSSLoaded) return;

  try {
    if (typeof document === "undefined") {
      prismCSSLoaded = true;
      return;
    }

    await loadStylesheet({
      href: PRISM_THEME_URL,
      id: "prism-theme",
      crossOrigin: "anonymous",
      integrity: PRISM_THEME_INTEGRITY,
      referrerPolicy: "no-referrer",
      importance: "low",
    });
    injectCustomPrismCSS();
    prismCSSLoaded = true;
  } catch (error) {
    prismCSSLoaded = true;
    logWarn("[Lazy Highlighter] Failed to load Prism CSS", error as Error);
  }
}

/**
 * Custom CSS für Design-System-Integration
 * Passt Prism.js an unser Neomorphic Design an
 */
function injectCustomPrismCSS(): void {
  const style = document.createElement("style");
  style.id = "prism-custom-theme";

  style.textContent = `
    /* Prism.js Design System Integration */
    .code-block-container {
      background: var(--surface-neumorphic-inset);
      border: var(--border-neumorphic-subtle);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-inset-subtle);
      overflow: hidden;
      margin: var(--space-md) 0;
    }

    .code-block-header {
      background: var(--surface-neumorphic-raised);
      border-bottom: var(--border-neumorphic-light);
      padding: var(--space-sm) var(--space-md);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .code-block-language {
      color: var(--color-text-secondary);
      font-size: var(--text-xs);
      font-weight: var(--font-medium);
      text-transform: uppercase;
      letter-spacing: var(--tracking-wide);
    }

    .code-block-copy {
      background: transparent;
      border: none;
      color: var(--color-text-secondary);
      cursor: pointer;
      padding: var(--space-xs);
      border-radius: var(--radius-md);
      transition: all var(--duration-200);
    }

    .code-block-copy:hover {
      background: var(--surface-neumorphic-floating);
      color: var(--color-text-primary);
    }

    /* Prism Code Styling Override */
    .code-block-container pre[class*="language-"] {
      background: transparent !important;
      margin: 0 !important;
      padding: var(--space-md) !important;
      overflow-x: auto;
      font-family: var(--font-mono);
      font-size: var(--text-sm);
      line-height: var(--leading-relaxed);
    }

    .code-block-container code[class*="language-"] {
      background: transparent !important;
      color: var(--color-text-primary);
    }

    /* Syntax Highlighting Colors (Dark/Light Theme Compatible) */
    .token.comment,
    .token.prolog,
    .token.doctype,
    .token.cdata {
      color: var(--color-text-tertiary);
      font-style: italic;
    }

    .token.punctuation {
      color: var(--color-text-secondary);
    }

    .token.property,
    .token.tag,
    .token.boolean,
    .token.number,
    .token.constant,
    .token.symbol,
    .token.deleted {
      color: var(--acc1);
    }

    .token.selector,
    .token.attr-name,
    .token.string,
    .token.char,
    .token.builtin,
    .token.inserted {
      color: var(--succ);
    }

    .token.operator,
    .token.entity,
    .token.url,
    .language-css .token.string,
    .style .token.string {
      color: var(--warn);
    }

    .token.atrule,
    .token.attr-value,
    .token.keyword {
      color: var(--acc2);
    }

    .token.function,
    .token.class-name {
      color: var(--err);
    }

    .token.regex,
    .token.important,
    .token.variable {
      color: var(--color-text-primary);
      font-weight: var(--font-medium);
    }

    /* Mobile Optimizations */
    @media (max-width: 768px) {
      .code-block-container pre[class*="language-"] {
        padding: var(--space-sm) !important;
        font-size: var(--text-xs);
      }

      .code-block-header {
        padding: var(--space-xs) var(--space-sm);
      }
    }

    /* Loading State */
    .code-block-loading {
      background: var(--surface-base);
      padding: var(--space-md);
      text-align: center;
      color: var(--color-text-tertiary);
      font-style: italic;
    }

    .code-block-loading::after {
      content: '...';
      animation: loading-dots 1.5s steps(3, end) infinite;
    }

    @keyframes loading-dots {
      0%, 20% { content: ''; }
      40% { content: '.'; }
      60% { content: '..'; }
      80%, 100% { content: '...'; }
    }
  `;

  document.head.appendChild(style);
}
