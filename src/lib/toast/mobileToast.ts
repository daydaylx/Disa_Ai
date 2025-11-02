/**
 * Mobile-optimiertes Toast-System mit Haptic Feedback
 */

import { hapticFeedback } from "../touch/haptics";

export interface MobileToastOptions {
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
  position?: "top" | "center" | "bottom";
  haptic?: boolean;
  icon?: string;
  action?: {
    label: string;
    handler: () => void;
  };
}

export interface ToastData extends Required<Omit<MobileToastOptions, "action">> {
  id: string;
  message: string;
  timestamp: number;
  action?: {
    label: string;
    handler: () => void;
  };
}

const DEFAULT_OPTIONS: Required<Omit<MobileToastOptions, "action">> = {
  type: "info",
  duration: 3000,
  position: "top",
  haptic: true,
  icon: "",
};

/**
 * Mobile Toast Manager
 */
export class MobileToastManager {
  private static instance: MobileToastManager | null = null;
  private activeToasts = new Map<string, ToastData>();
  private container: HTMLElement | null = null;
  private animationFrameId: number | null = null;

  static getInstance(): MobileToastManager {
    if (!MobileToastManager.instance) {
      MobileToastManager.instance = new MobileToastManager();
    }
    return MobileToastManager.instance;
  }

  private constructor() {
    this.createContainer();
    this.setupGlobalStyles();
  }

  /**
   * Toast-Container erstellen
   */
  private createContainer(): void {
    if (this.container) return;

    this.container = document.createElement("div");
    this.container.id = "mobile-toast-container";
    this.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      pointer-events: none;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: calc(var(--inset-t, 0px) + 16px) 16px calc(var(--inset-b, 0px) + 16px) 16px;
    `;

    document.body.appendChild(this.container);
  }

  /**
   * Globale Toast-Styles
   */
  private setupGlobalStyles(): void {
    const styleId = "mobile-toast-styles";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      .mobile-toast {
        pointer-events: auto;
        backdrop-filter: blur(18px);
        -webkit-backdrop-filter: blur(18px);
        border-radius: var(--radius-toast);
        padding: calc(var(--space-sm) - 4px) var(--space-sm);
        margin: calc(var(--space-xs) - 4px) 0;
        max-width: calc(100vw - 32px);
        box-shadow: var(--shadow-neumorphic-md);
        border: var(--border-neumorphic-light);
        background: var(--color-overlay-toast-bg);
        color: var(--color-overlay-toast-fg);
        display: flex;
        align-items: center;
        gap: var(--space-sm);
        font-size: var(--font-size-body-small);
        font-weight: 500;
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }

      .mobile-toast.show {
        opacity: 1;
        transform: translateY(0) scale(1);
      }

      .mobile-toast.hide {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
        transition: all 0.2s ease-out;
      }

      .mobile-toast--success {
        background: rgba(var(--ok-rgb), 0.65);
        background: color-mix(in srgb, var(--ok) 65%, var(--bg1));
        color: var(--fg-invert);
        border-color: rgba(var(--ok-rgb), 0.45);
        border-color: color-mix(in srgb, var(--ok) 45%, transparent);
      }

      .mobile-toast--error {
        background: rgba(var(--err-rgb), 0.65);
        background: color-mix(in srgb, var(--err) 65%, var(--bg1));
        color: var(--fg-invert);
        border-color: rgba(var(--err-rgb), 0.45);
        border-color: color-mix(in srgb, var(--err) 45%, transparent);
      }

      .mobile-toast--warning {
        background: rgba(var(--warn-rgb), 0.6);
        background: color-mix(in srgb, var(--warn) 60%, var(--bg1));
        color: var(--fg-invert);
        border-color: rgba(var(--warn-rgb), 0.45);
        border-color: color-mix(in srgb, var(--warn) 45%, transparent);
      }

      .mobile-toast--info {
        background: rgba(var(--info-rgb), 0.6);
        background: color-mix(in srgb, var(--info) 60%, var(--bg1));
        color: var(--fg-invert);
        border-color: rgba(var(--info-rgb), 0.45);
        border-color: color-mix(in srgb, var(--info) 45%, transparent);
      }

      .mobile-toast__icon {
        font-size: var(--font-size-input);
        flex-shrink: 0;
      }

      .mobile-toast__content {
        flex: 1;
        line-height: 1.4;
      }

      .mobile-toast__action {
        background: rgba(255, 255, 255, 0.18);
        background: color-mix(in srgb, currentColor 18%, transparent);
        border: var(--border-neumorphic-light);
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.3);
        box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 30%, transparent);
        color: inherit;
        padding: calc(var(--space-xs) - 4px) var(--space-sm);
        border-radius: var(--radius-badge);
        font-size: 0.8125rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s ease, transform 0.2s ease;
      }

      .mobile-toast__action:hover {
        background: rgba(255, 255, 255, 0.25);
        background: color-mix(in srgb, currentColor 25%, transparent);
      }

      .mobile-toast__action:active {
        background: rgba(255, 255, 255, 0.35);
        background: color-mix(in srgb, currentColor 35%, transparent);
        transform: scale(0.97);
      }

      /* Position variants */
      .mobile-toast-container--top {
        justify-content: flex-start;
        padding-top: calc(var(--inset-t, 0px) + 16px);
      }

      .mobile-toast-container--center {
        justify-content: center;
      }

      .mobile-toast-container--bottom {
        justify-content: flex-end;
        padding-bottom: calc(var(--inset-b, 0px) + 16px);
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Toast anzeigen
   */
  show(message: string, options: MobileToastOptions = {}): string {
    const finalOptions = { ...DEFAULT_OPTIONS, ...options };
    const id = this.generateId();

    const toastData: ToastData = {
      id,
      message,
      timestamp: Date.now(),
      ...finalOptions,
      action: options.action,
    };

    this.activeToasts.set(id, toastData);

    // Haptic Feedback
    if (finalOptions.haptic) {
      switch (finalOptions.type) {
        case "success":
          hapticFeedback.success();
          break;
        case "error":
          hapticFeedback.error();
          break;
        case "warning":
          hapticFeedback.warning();
          break;
        default:
          hapticFeedback.select();
      }
    }

    this.renderToast(toastData);

    // Auto-dismiss
    if (finalOptions.duration > 0) {
      setTimeout(() => {
        this.hide(id);
      }, finalOptions.duration);
    }

    return id;
  }

  /**
   * Toast-Element rendern
   */
  private renderToast(toastData: ToastData): void {
    if (!this.container) return;

    const element = document.createElement("div");
    element.id = `toast-${toastData.id}`;
    element.className = `mobile-toast mobile-toast--${toastData.type}`;

    // Icon
    const icon = this.getIcon(toastData.type, toastData.icon);
    if (icon) {
      const iconElement = document.createElement("span");
      iconElement.className = "mobile-toast__icon";
      iconElement.textContent = icon;
      element.appendChild(iconElement);
    }

    // Content
    const contentElement = document.createElement("div");
    contentElement.className = "mobile-toast__content";
    contentElement.textContent = toastData.message;
    element.appendChild(contentElement);

    // Action Button
    if (toastData.action) {
      const actionElement = document.createElement("button");
      actionElement.className = "mobile-toast__action";
      actionElement.textContent = toastData.action.label;
      actionElement.addEventListener("click", () => {
        hapticFeedback.tap();
        if (toastData.action) {
          toastData.action.handler();
        }
        this.hide(toastData.id);
      });
      element.appendChild(actionElement);
    }

    // Position based on toast position
    if (toastData.position === "bottom") {
      this.container.appendChild(element);
    } else {
      this.container.insertBefore(element, this.container.firstChild);
    }

    // Animate in
    requestAnimationFrame(() => {
      element.classList.add("show");
    });

    // Store reference
    element.setAttribute("data-toast-id", toastData.id);
  }

  /**
   * Toast ausblenden
   */
  hide(id: string): void {
    const toastData = this.activeToasts.get(id);
    if (!toastData) return;

    const element = document.getElementById(`toast-${id}`);
    if (!element) return;

    element.classList.add("hide");

    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
      this.activeToasts.delete(id);
    }, 200);
  }

  /**
   * Alle Toasts ausblenden
   */
  hideAll(): void {
    this.activeToasts.forEach((_, id) => this.hide(id));
  }

  /**
   * Icon für Toast-Typ
   */
  private getIcon(type: ToastData["type"], customIcon?: string): string {
    if (customIcon) return customIcon;

    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "⚠";
      case "warning":
        return "⚠";
      case "info":
        return "ℹ";
      default:
        return "";
    }
  }

  /**
   * Eindeutige ID generieren
   */
  private generateId(): string {
    return `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.hideAll();
    if (this.container) {
      document.body.removeChild(this.container);
      this.container = null;
    }

    const styles = document.getElementById("mobile-toast-styles");
    if (styles) {
      document.head.removeChild(styles);
    }

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}

/**
 * Convenience functions
 */
export const mobileToast = {
  show: (message: string, options?: MobileToastOptions) =>
    MobileToastManager.getInstance().show(message, options),

  success: (message: string, options?: Omit<MobileToastOptions, "type">) =>
    MobileToastManager.getInstance().show(message, { ...options, type: "success" }),

  error: (message: string, options?: Omit<MobileToastOptions, "type">) =>
    MobileToastManager.getInstance().show(message, { ...options, type: "error" }),

  warning: (message: string, options?: Omit<MobileToastOptions, "type">) =>
    MobileToastManager.getInstance().show(message, { ...options, type: "warning" }),

  info: (message: string, options?: Omit<MobileToastOptions, "type">) =>
    MobileToastManager.getInstance().show(message, { ...options, type: "info" }),

  hide: (id: string) => MobileToastManager.getInstance().hide(id),

  hideAll: () => MobileToastManager.getInstance().hideAll(),
};

/**
 * React Hook für Mobile Toasts
 */
export function useMobileToast() {
  const manager = MobileToastManager.getInstance();

  return {
    show: (message: string, options?: MobileToastOptions) => manager.show(message, options),
    success: (message: string, options?: Omit<MobileToastOptions, "type">) =>
      manager.show(message, { ...options, type: "success" }),
    error: (message: string, options?: Omit<MobileToastOptions, "type">) =>
      manager.show(message, { ...options, type: "error" }),
    warning: (message: string, options?: Omit<MobileToastOptions, "type">) =>
      manager.show(message, { ...options, type: "warning" }),
    info: (message: string, options?: Omit<MobileToastOptions, "type">) =>
      manager.show(message, { ...options, type: "info" }),
    hide: (id: string) => manager.hide(id),
    hideAll: () => manager.hideAll(),
  };
}
