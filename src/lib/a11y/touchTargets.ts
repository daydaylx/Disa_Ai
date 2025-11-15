/**
 * Touch Target & Accessibility Enforcement
 * Implements Issue #107 - A11y & Touch-Ziele hart durchsetzen
 */

// Minimum touch target sizes according to WCAG guidelines
export const TOUCH_TARGET_SIZES = {
  minimum: 44, // WCAG 2.1 AA minimum
  recommended: 48, // Material Design recommendation
  comfortable: 56, // iOS HIG recommendation
} as const;

// Accessibility validation rules
export interface A11yViolation {
  element: Element;
  type: "touch-target" | "missing-aria" | "missing-alt" | "missing-label" | "color-contrast";
  severity: "error" | "warning";
  message: string;
  suggestion: string;
}

declare global {
  interface Window {
    __DISA_A11Y_LAST_VIOLATIONS__?: A11yViolation[];
  }
}

const reportedElements = new WeakSet<Element>();

/**
 * Check if an element meets minimum touch target requirements
 */
export function validateTouchTarget(element: Element): A11yViolation[] {
  const violations: A11yViolation[] = [];

  if (!isInteractive(element)) {
    return violations;
  }

  const rect = getVisibleRect(element);
  if (!rect) {
    return violations;
  }

  const minSize = TOUCH_TARGET_SIZES.minimum;

  if (rect.width < minSize || rect.height < minSize) {
    violations.push({
      element,
      type: "touch-target",
      severity: "error",
      message: `Touch target too small: ${Math.round(rect.width)}×${Math.round(rect.height)}px (minimum ${minSize}×${minSize}px required)`,
      suggestion: `Add padding or increase size to meet ${minSize}px minimum. Consider using the 'tap-target' class.`,
    });
  }

  return violations;
}

/**
 * Check if element has required ARIA attributes
 */
export function validateAriaAttributes(element: Element): A11yViolation[] {
  const violations: A11yViolation[] = [];
  const tagName = element.tagName.toLowerCase();
  if (!isElementVisible(element)) {
    return violations;
  }

  // Check for missing aria-label on buttons without text content
  if (tagName === "button" && !hasAccessibleName(element)) {
    violations.push({
      element,
      type: "missing-aria",
      severity: "error",
      message: "Button missing accessible name",
      suggestion: "Add aria-label, aria-labelledby, or visible text content",
    });
  }

  // Check for missing alt text on images
  if (tagName === "img" && !element.hasAttribute("alt")) {
    violations.push({
      element,
      type: "missing-alt",
      severity: "error",
      message: "Image missing alt text",
      suggestion: "Add alt attribute (empty string for decorative images)",
    });
  }

  // Check for missing labels on form controls
  if (isFormControl(element) && !hasAssociatedLabel(element)) {
    violations.push({
      element,
      type: "missing-label",
      severity: "error",
      message: "Form control missing associated label",
      suggestion: "Add aria-label, aria-labelledby, or associate with <label> element",
    });
  }

  return violations;
}

/**
 * Auto-fix accessibility violations where possible
 */
export function autoFixA11yViolations(element: Element): boolean {
  let fixed = false;

  // Add tap-target class for small interactive elements
  if (isInteractive(element)) {
    const rect = getVisibleRect(element);
    if (
      rect &&
      (rect.width < TOUCH_TARGET_SIZES.minimum || rect.height < TOUCH_TARGET_SIZES.minimum)
    ) {
      element.classList.add("tap-target");
      fixed = true;
    }
  }

  // Add missing role for custom interactive elements
  if (
    isInteractive(element) &&
    !element.hasAttribute("role") &&
    element.tagName.toLowerCase() === "div"
  ) {
    element.setAttribute("role", "button");
    fixed = true;
  }

  // Add tabindex for keyboard navigation
  if (
    isInteractive(element) &&
    !element.hasAttribute("tabindex") &&
    element.tagName.toLowerCase() !== "button"
  ) {
    element.setAttribute("tabindex", "0");
    fixed = true;
  }

  return fixed;
}

/**
 * Scan document for accessibility violations
 */
export function scanDocumentA11y(container: Element = document.body): A11yViolation[] {
  const violations: A11yViolation[] = [];
  const elements = container.querySelectorAll("*");

  for (const element of elements) {
    violations.push(...validateTouchTarget(element), ...validateAriaAttributes(element));
  }

  return violations;
}

/**
 * Apply accessibility enhancements to the entire document
 */
export function enforceA11yStandards(container: Element = document.body): {
  violations: A11yViolation[];
  fixedCount: number;
} {
  let fixedCount = 0;

  // Attempt auto-fixes
  const elements = container.querySelectorAll("*");
  for (const element of elements) {
    if (autoFixA11yViolations(element)) {
      fixedCount++;
    }
  }

  // Re-scan after fixes
  const remainingViolations = scanDocumentA11y(container);

  return {
    violations: remainingViolations,
    fixedCount,
  };
}

/**
 * Create accessibility monitoring observer
 */
export function createA11yObserver(
  callback: (violations: A11yViolation[]) => void,
): MutationObserver {
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const violations = scanDocumentA11y(node as Element);
            if (violations.length > 0) {
              callback(violations);
            }
          }
        }
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return observer;
}

// Helper functions

function isInteractive(element: Element): boolean {
  const tagName = element.tagName.toLowerCase();
  const interactiveTags = ["button", "a", "input", "select", "textarea"];

  if (interactiveTags.includes(tagName)) {
    return true;
  }

  // Check for click handlers or role
  const hasClickHandler =
    element.hasAttribute("onclick") ||
    element.getAttribute("role") === "button" ||
    element.classList.contains("cursor-pointer");

  return hasClickHandler;
}

function hasAccessibleName(element: Element): boolean {
  return !!(
    element.getAttribute("aria-label") ||
    element.getAttribute("aria-labelledby") ||
    element.textContent?.trim() ||
    element.querySelector("img[alt]") ||
    element.getAttribute("title")
  );
}

function isFormControl(element: Element): boolean {
  const tagName = element.tagName.toLowerCase();
  return (
    ["input", "select", "textarea"].includes(tagName) &&
    (element as HTMLInputElement).type !== "hidden"
  );
}

function hasAssociatedLabel(element: Element): boolean {
  const id = element.id;
  if (id && document.querySelector(`label[for="${id}"]`)) {
    return true;
  }

  return !!(
    element.getAttribute("aria-label") ||
    element.getAttribute("aria-labelledby") ||
    element.closest("label")
  );
}

/**
 * Enhanced focus management for accessibility
 */
export class FocusManager {
  private static instance: FocusManager | null = null;
  private trapStack: Element[] = [];

  static getInstance(): FocusManager {
    if (!FocusManager.instance) {
      FocusManager.instance = new FocusManager();
    }
    return FocusManager.instance;
  }

  /**
   * Trap focus within an element (for modals, dropdowns, etc.)
   */
  trapFocus(element: Element): () => void {
    this.trapStack.push(element);

    const focusableElements = this.getFocusableElements(element);
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: Event) => {
      const keyboardEvent = e as KeyboardEvent;
      if (keyboardEvent.key !== "Tab") return;

      if (keyboardEvent.shiftKey) {
        if (document.activeElement === firstFocusable) {
          keyboardEvent.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          keyboardEvent.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    element.addEventListener("keydown", handleKeyDown);
    firstFocusable?.focus();

    return () => {
      element.removeEventListener("keydown", handleKeyDown);
      this.trapStack.pop();
    };
  }

  /**
   * Get all focusable elements within a container
   */
  getFocusableElements(container: Element): Element[] {
    const selector = [
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "a[href]",
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(", ");

    return Array.from(container.querySelectorAll(selector)).filter((element) =>
      isElementVisible(element),
    );
  }
}

/**
 * Global accessibility enforcement for the application
 */
export function initializeA11yEnforcement(): void {
  // Add global CSS for tap targets
  const style = document.createElement("style");
  style.textContent = `
    .tap-target {
      min-width: ${TOUCH_TARGET_SIZES.minimum}px;
      min-height: ${TOUCH_TARGET_SIZES.minimum}px;
      touch-action: manipulation;
      cursor: pointer;
    }

    .tap-target:focus-visible {
      box-shadow: var(--focus-ring);
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
      .tap-target:focus-visible {
        outline-width: 3px;
      }
    }

    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      .tap-target {
        transition: none !important;
      }
    }
  `;
  document.head.appendChild(style);

  // Initial enforcement on page load
  document.addEventListener("DOMContentLoaded", () => {
    const result = enforceA11yStandards();
    const uniqueViolations = filterNewViolations(result.violations);
    if (uniqueViolations.length > 0) {
      logViolations("Accessibility violations detected at startup", uniqueViolations);
    }

    if (result.fixedCount > 0) {
      console.warn(`✅ Auto-fixed ${result.fixedCount} accessibility issues`);
    }
  });

  // Monitor for new violations
  createA11yObserver((violations) => {
    const uniqueViolations = filterNewViolations(violations);
    if (uniqueViolations.length > 0) {
      logViolations("New accessibility violations detected", uniqueViolations);
    }
  });
}

function filterNewViolations(violations: A11yViolation[]): A11yViolation[] {
  return violations.filter((violation) => {
    if (reportedElements.has(violation.element)) {
      return false;
    }
    reportedElements.add(violation.element);
    return true;
  });
}

function logViolations(message: string, violations: A11yViolation[]) {
  console.warn(`🔍 ${message} (${violations.length})`);
  violations.forEach((violation) => {
    console.warn(`• [${violation.type}] ${violation.message}`, violation.element);
    console.warn("  💡 Suggestion:", violation.suggestion);
  });
  if (typeof window !== "undefined") {
    window.__DISA_A11Y_LAST_VIOLATIONS__ = violations;
  }
}

function isElementVisible(element: Element): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  if (!(element instanceof HTMLElement)) {
    return false;
  }

  if (element.getAttribute("aria-hidden") === "true") {
    return false;
  }

  const style = window.getComputedStyle(element);
  if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
    return false;
  }

  return true;
}

function getVisibleRect(element: Element): DOMRect | null {
  if (!isElementVisible(element)) {
    return null;
  }

  const rect = element.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) {
    return null;
  }

  return rect;
}
