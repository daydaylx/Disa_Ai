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
      padding: env(safe-area-inset-top, 16px) 16px env(safe-area-inset-bottom, 16px) 16px;
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
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border-radius: 16px;
        padding: 12px 16px;
        margin: 4px 0;
        max-width: calc(100vw - 32px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
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
        background: rgba(34, 197, 94, 0.9);
        color: white;
      }

      .mobile-toast--error {
        background: rgba(239, 68, 68, 0.9);
        color: white;
      }

      .mobile-toast--warning {
        background: rgba(245, 158, 11, 0.9);
        color: white;
      }

      .mobile-toast--info {
        background: rgba(59, 130, 246, 0.9);
        color: white;
      }

      .mobile-toast__icon {
        font-size: 16px;
        flex-shrink: 0;
      }

      .mobile-toast__content {
        flex: 1;
        line-height: 1.4;
      }

      .mobile-toast__action {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: inherit;
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s ease;
      }

      .mobile-toast__action:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .mobile-toast__action:active {
        background: rgba(255, 255, 255, 0.4);
        transform: scale(0.98);
      }

      /* Position variants */
      .mobile-toast-container--top {
        justify-content: flex-start;
        padding-top: calc(env(safe-area-inset-top, 16px) + 16px);
      }

      .mobile-toast-container--center {
        justify-content: center;
      }

      .mobile-toast-container--bottom {
        justify-content: flex-end;
        padding-bottom: calc(env(safe-area-inset-bottom, 16px) + 16px);
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
