/**
 * Mobile-spezifische Shortcuts und Gesten für erweiterte UX
 */

import { TouchGestureHandler } from "../touch/gestures";
import { hapticFeedback } from "../touch/haptics";

export interface MobileShortcut {
  id: string;
  name: string;
  description: string;
  gesture: "double-tap" | "long-press" | "swipe-up" | "swipe-down" | "pinch" | "three-finger-tap";
  target?: string;
  action: () => void;
  enabled: boolean;
}

export interface GesturePattern {
  touches: number;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  distance?: number;
}

/**
 * Mobile Shortcuts Manager
 */
export class MobileShortcutsManager {
  private shortcuts = new Map<string, MobileShortcut>();
  private gestureHandlers = new Map<HTMLElement, TouchGestureHandler>();
  private globalShortcuts: MobileShortcut[] = [];
  private isEnabled = true;

  constructor() {
    this.initializeDefaultShortcuts();
    this.setupGlobalGestureHandlers();
  }

  /**
   * Standard-Shortcuts initialisieren
   */
  private initializeDefaultShortcuts(): void {
    this.globalShortcuts = [
      {
        id: "scroll-to-top",
        name: "Nach oben scrollen",
        description: "Doppeltippen oben am Bildschirm um nach oben zu scrollen",
        gesture: "double-tap",
        target: "top-area",
        action: () => {
          window.scrollTo({ top: 0, behavior: "smooth" });
          hapticFeedback.success();
        },
        enabled: true,
      },
      {
        id: "open-settings",
        name: "Einstellungen öffnen",
        description: "Langes Drücken mit drei Fingern öffnet die Einstellungen",
        gesture: "three-finger-tap",
        action: () => {
          window.location.hash = "/settings";
          hapticFeedback.success();
        },
        enabled: true,
      },
      {
        id: "toggle-theme",
        name: "Theme wechseln",
        description: "Swipe nach oben mit drei Fingern wechselt das Theme",
        gesture: "swipe-up",
        action: () => {
          this.toggleTheme();
          hapticFeedback.impact("medium");
        },
        enabled: true,
      },
      {
        id: "refresh-page",
        name: "Seite aktualisieren",
        description: "Swipe nach unten am oberen Bildschirmrand",
        gesture: "swipe-down",
        target: "top-area",
        action: () => {
          window.location.reload();
          hapticFeedback.warning();
        },
        enabled: true,
      },
      {
        id: "focus-input",
        name: "Eingabefeld fokussieren",
        description: "Doppeltippen am unteren Bildschirmrand",
        gesture: "double-tap",
        target: "bottom-area",
        action: () => {
          const input = document.querySelector('[data-testid="composer-input"]') as HTMLElement;
          if (input) {
            input.focus();
            hapticFeedback.select();
          }
        },
        enabled: true,
      },
    ];

    this.globalShortcuts.forEach((shortcut) => {
      this.shortcuts.set(shortcut.id, shortcut);
    });
  }

  /**
   * Globale Gesten-Handler einrichten
   */
  private setupGlobalGestureHandlers(): void {
    // Bereiche für spezifische Gesten definieren
    this.createGestureArea("top-area", {
      top: 0,
      left: 0,
      right: "100%",
      height: "15%",
    });

    this.createGestureArea("bottom-area", {
      bottom: 0,
      left: 0,
      right: "100%",
      height: "15%",
    });

    // Globale Dokumenten-Gesten
    this.setupDocumentGestures();
  }

  /**
   * Gesten-Bereich erstellen
   */
  private createGestureArea(id: string, style: any): void {
    const area = document.createElement("div");
    area.id = `gesture-area-${id}`;
    area.style.cssText = `
      position: fixed;
      z-index: -1;
      pointer-events: none;
      ${Object.entries(style)
        .map(([key, value]) => `${key}: ${value}`)
        .join("; ")};
    `;

    document.body.appendChild(area);

    // Touch-Events für diesen Bereich aktivieren
    area.style.pointerEvents = "auto";
    area.style.zIndex = "999";
    area.style.background = "transparent";

    const handler = new TouchGestureHandler(area);

    // Doppeltippen
    this.setupDoubleTapGesture(handler, id);

    // Swipe-Gesten
    handler.onSwipeGesture((event) => {
      this.handleSwipeGesture(event.direction, id);
    });

    this.gestureHandlers.set(area, handler);
  }

  /**
   * Doppeltippen-Geste einrichten
   */
  private setupDoubleTapGesture(handler: TouchGestureHandler, areaId: string): void {
    let lastTap = 0;
    const doubleTapThreshold = 300;

    handler.onTapGesture(() => {
      const now = Date.now();
      if (now - lastTap < doubleTapThreshold) {
        this.executeShortcutByGesture("double-tap", areaId);
        lastTap = 0;
      } else {
        lastTap = now;
      }
    });
  }

  /**
   * Dokument-weite Gesten einrichten
   */
  private setupDocumentGestures(): void {
    let _touchStartTime = 0;
    let touchCount = 0;
    let threeFingerTimeout: number | null = null;

    document.addEventListener(
      "touchstart",
      (event) => {
        touchCount = event.touches.length;
        _touchStartTime = Date.now();

        // Drei-Finger-Geste erkennen
        if (touchCount === 3) {
          threeFingerTimeout = window.setTimeout(() => {
            this.executeShortcutByGesture("three-finger-tap");
          }, 500);
        }
      },
      { passive: true },
    );

    document.addEventListener(
      "touchmove",
      (event) => {
        // Drei-Finger Swipe-Gesten
        if (event.touches.length === 3 && threeFingerTimeout) {
          clearTimeout(threeFingerTimeout);
          threeFingerTimeout = null;

          const touch = event.touches[0]!;
          const deltaY = touch.clientY - touch.pageY;

          if (Math.abs(deltaY) > 50) {
            const direction = deltaY > 0 ? "down" : "up";
            this.executeShortcutByGesture(`swipe-${direction}` as any);
          }
        }
      },
      { passive: true },
    );

    document.addEventListener(
      "touchend",
      () => {
        if (threeFingerTimeout) {
          clearTimeout(threeFingerTimeout);
          threeFingerTimeout = null;
        }
      },
      { passive: true },
    );

    // Pinch-Geste für Zoom
    this.setupPinchGesture();
  }

  /**
   * Pinch-Geste einrichten
   */
  private setupPinchGesture(): void {
    let initialDistance = 0;
    let lastScale = 1;

    document.addEventListener(
      "touchstart",
      (event) => {
        if (event.touches.length === 2) {
          const touch1 = event.touches[0]!;
          const touch2 = event.touches[1]!;
          initialDistance = this.getDistance(touch1, touch2);
        }
      },
      { passive: true },
    );

    document.addEventListener(
      "touchmove",
      (event) => {
        if (event.touches.length === 2) {
          event.preventDefault();

          const touch1 = event.touches[0]!;
          const touch2 = event.touches[1]!;
          const currentDistance = this.getDistance(touch1, touch2);
          const scale = currentDistance / initialDistance;

          if (Math.abs(scale - lastScale) > 0.1) {
            lastScale = scale;

            if (scale > 1.2) {
              this.executeShortcutByGesture("pinch");
            }
          }
        }
      },
      { passive: false },
    );
  }

  /**
   * Distanz zwischen zwei Touch-Punkten berechnen
   */
  private getDistance(touch1: Touch, touch2: Touch): number {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Swipe-Geste behandeln
   */
  private handleSwipeGesture(direction: "left" | "right" | "up" | "down", areaId?: string): void {
    this.executeShortcutByGesture(`swipe-${direction}` as any, areaId);
  }

  /**
   * Shortcut nach Geste ausführen
   */
  private executeShortcutByGesture(gesture: MobileShortcut["gesture"], target?: string): void {
    if (!this.isEnabled) return;

    const matchingShortcuts = Array.from(this.shortcuts.values()).filter(
      (shortcut) =>
        shortcut.enabled &&
        shortcut.gesture === gesture &&
        (!target || !shortcut.target || shortcut.target === target),
    );

    matchingShortcuts.forEach((shortcut) => {
      try {
        shortcut.action();
      } catch (error) {
        console.error("Error executing shortcut:", shortcut.id, error);
      }
    });
  }

  /**
   * Theme wechseln
   */
  private toggleTheme(): void {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  }

  /**
   * Neuen Shortcut hinzufügen
   */
  addShortcut(shortcut: MobileShortcut): void {
    this.shortcuts.set(shortcut.id, shortcut);
  }

  /**
   * Shortcut entfernen
   */
  removeShortcut(id: string): void {
    this.shortcuts.delete(id);
  }

  /**
   * Shortcut aktivieren/deaktivieren
   */
  toggleShortcut(id: string, enabled?: boolean): void {
    const shortcut = this.shortcuts.get(id);
    if (shortcut) {
      shortcut.enabled = enabled !== undefined ? enabled : !shortcut.enabled;
    }
  }

  /**
   * Alle Shortcuts abrufen
   */
  getShortcuts(): MobileShortcut[] {
    return Array.from(this.shortcuts.values());
  }

  /**
   * Shortcuts aktivieren/deaktivieren
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * Cleanup
   */
  destroy(): void {
    // Gesten-Handler entfernen
    this.gestureHandlers.forEach((handler) => handler.destroy());
    this.gestureHandlers.clear();

    // Gesten-Bereiche entfernen
    document.querySelectorAll('[id^="gesture-area-"]').forEach((element) => {
      element.remove();
    });
  }
}

/**
 * React Hook für Mobile Shortcuts
 */
export function useMobileShortcuts() {
  // React Hook-Implementierung würde hier hin
  const manager = new MobileShortcutsManager();
  return {
    manager,
    shortcuts: manager.getShortcuts(),
    addShortcut: (shortcut: MobileShortcut) => {
      manager.addShortcut(shortcut);
    },
    removeShortcut: (id: string) => {
      manager.removeShortcut(id);
    },
    toggleShortcut: (id: string, enabled?: boolean) => {
      manager.toggleShortcut(id, enabled);
    },
    setEnabled: (enabled: boolean) => manager.setEnabled(enabled),
  };
}

/**
 * Globaler Shortcuts-Manager
 */
let globalShortcutsManager: MobileShortcutsManager | null = null;

export function initializeMobileShortcuts(): MobileShortcutsManager {
  if (!globalShortcutsManager) {
    globalShortcutsManager = new MobileShortcutsManager();
  }
  return globalShortcutsManager;
}

export function getMobileShortcutsManager(): MobileShortcutsManager | null {
  return globalShortcutsManager;
}
