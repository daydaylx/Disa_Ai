/**
 * Zentrale Initialisierung aller Mobile-Features
 */

import { initializeMobileShortcuts } from "../gestures/mobileShortcuts";
import { MobilePerformanceOptimizer } from "../performance/mobileOptimizer";
import { OfflineManager } from "../pwa/offlineManager";
import { mobileToast } from "../toast/mobileToast";
import { hapticFeedback } from "../touch/haptics";
import { TouchPerformanceManager } from "../touch/performance";

export interface MobileInitOptions {
  enableHapticFeedback?: boolean;
  enableGestureShortcuts?: boolean;
  enablePerformanceOptimization?: boolean;
  enableOfflineMode?: boolean;
  enableToastNotifications?: boolean;
  enableTouchOptimizations?: boolean;
  autoInitialize?: boolean;
}

const DEFAULT_OPTIONS: Required<MobileInitOptions> = {
  enableHapticFeedback: true,
  enableGestureShortcuts: true,
  enablePerformanceOptimization: true,
  enableOfflineMode: true,
  enableToastNotifications: true,
  enableTouchOptimizations: true,
  autoInitialize: true,
};

/**
 * Mobile Features Manager
 */
export class MobileFeaturesManager {
  private static instance: MobileFeaturesManager | null = null;
  private options: Required<MobileInitOptions>;
  private isInitialized = false;
  private managers: { [key: string]: any } = {};

  static getInstance(options: MobileInitOptions = {}): MobileFeaturesManager {
    if (!MobileFeaturesManager.instance) {
      MobileFeaturesManager.instance = new MobileFeaturesManager(options);
    }
    return MobileFeaturesManager.instance;
  }

  private constructor(options: MobileInitOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };

    if (this.options.autoInitialize) {
      void this.initialize();
    }
  }

  /**
   * Alle Mobile-Features initialisieren
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Device-Detection
      if (!this.isMobileDevice()) {
        console.log("Desktop device detected - skipping mobile optimizations");
        return;
      }

      console.log("Initializing mobile features...");

      // Haptisches Feedback
      if (this.options.enableHapticFeedback) {
        await this.initializeHapticFeedback();
      }

      // Touch-Optimierungen
      if (this.options.enableTouchOptimizations) {
        await this.initializeTouchOptimizations();
      }

      // Gesture-Shortcuts
      if (this.options.enableGestureShortcuts) {
        await this.initializeGestureShortcuts();
      }

      // Performance-Optimierung
      if (this.options.enablePerformanceOptimization) {
        await this.initializePerformanceOptimization();
      }

      // Offline-Modus
      if (this.options.enableOfflineMode) {
        await this.initializeOfflineMode();
      }

      // Toast-Benachrichtigungen
      if (this.options.enableToastNotifications) {
        await this.initializeToastNotifications();
      }

      this.isInitialized = true;

      // Erfolgs-Feedback
      if (this.options.enableHapticFeedback) {
        await hapticFeedback.success();
      }

      if (this.options.enableToastNotifications) {
        mobileToast.success("Mobile-Features aktiviert", {
          duration: 2000,
          position: "top",
          icon: "📱",
        });
      }

      console.log("Mobile features initialized successfully");
    } catch (error) {
      console.error("Failed to initialize mobile features:", error);

      if (this.options.enableToastNotifications) {
        mobileToast.error("Fehler beim Initialisieren der Mobile-Features", {
          duration: 4000,
          position: "top",
        });
      }
    }
  }

  /**
   * Mobile-Device erkennen
   */
  private isMobileDevice(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ["mobile", "android", "iphone", "ipad", "ipod", "blackberry", "windows phone"];

    const isMobileUA = mobileKeywords.some((keyword) => userAgent.includes(keyword));
    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;

    return isMobileUA || (isTouchDevice && isSmallScreen);
  }

  /**
   * Haptisches Feedback initialisieren
   */
  private async initializeHapticFeedback(): Promise<void> {
    try {
      const isSupported = await hapticFeedback.tap();
      if (isSupported) {
        console.log("Haptic feedback initialized");
      } else {
        console.log("Haptic feedback not supported on this device");
      }
    } catch (error) {
      console.warn("Failed to initialize haptic feedback:", error);
    }
  }

  /**
   * Touch-Optimierungen initialisieren
   */
  private initializeTouchOptimizations(): void {
    try {
      const manager = TouchPerformanceManager.getInstance();
      manager.enableGlobalOptimizations();
      this.managers.touchPerformance = manager;
      // console.log("Touch optimizations initialized");
    } catch (error) {
      console.warn("Failed to initialize touch optimizations:", error);
    }
  }

  /**
   * Gesture-Shortcuts initialisieren
   */
  private async initializeGestureShortcuts(): Promise<void> {
    try {
      const manager = initializeMobileShortcuts();
      this.managers.gestureShortcuts = manager;
      console.log("Gesture shortcuts initialized");
    } catch (error) {
      console.warn("Failed to initialize gesture shortcuts:", error);
    }
  }

  /**
   * Performance-Optimierung initialisieren
   */
  private async initializePerformanceOptimization(): Promise<void> {
    try {
      const manager = MobilePerformanceOptimizer.getInstance({
        enableFPSMonitoring: true,
        enableMemoryOptimization: true,
        enableTouchOptimization: true,
        enableRenderOptimization: true,
        enableNetworkOptimization: true,
      });

      this.managers.performance = manager;
      console.log("Performance optimization initialized");

      // Performance-Report nach 5 Sekunden
      setTimeout(() => {
        const report = manager.generateReport();
        console.log("Performance Report:", report);

        if (report.score < 70) {
          console.warn("Low performance score detected:", report.score);
        }
      }, 5000);
    } catch (error) {
      console.warn("Failed to initialize performance optimization:", error);
    }
  }

  /**
   * Offline-Modus initialisieren
   */
  private async initializeOfflineMode(): Promise<void> {
    try {
      const manager = OfflineManager.getInstance();
      this.managers.offline = manager;

      // Status-Updates überwachen
      manager.on("statusChange", (status: any) => {
        console.log("Offline status changed:", status);

        if (this.options.enableToastNotifications) {
          if (status.isOnline) {
            mobileToast.success("Online-Verbindung wiederhergestellt", {
              duration: 2000,
              position: "top",
              icon: "🌐",
            });
          } else {
            mobileToast.warning("Offline-Modus aktiviert", {
              duration: 3000,
              position: "top",
              icon: "📴",
            });
          }
        }
      });

      console.log("Offline mode initialized");
    } catch (error) {
      console.warn("Failed to initialize offline mode:", error);
    }
  }

  /**
   * Toast-Benachrichtigungen initialisieren
   */
  private async initializeToastNotifications(): Promise<void> {
    try {
      // Toast-System ist bereits verfügbar, keine weitere Initialisierung nötig
      console.log("Toast notifications initialized");
    } catch (error) {
      console.warn("Failed to initialize toast notifications:", error);
    }
  }

  /**
   * Feature-Status abrufen
   */
  getStatus(): {
    initialized: boolean;
    features: { [key: string]: boolean };
    managers: string[];
  } {
    return {
      initialized: this.isInitialized,
      features: {
        hapticFeedback: this.options.enableHapticFeedback,
        gestureShortcuts: this.options.enableGestureShortcuts,
        performanceOptimization: this.options.enablePerformanceOptimization,
        offlineMode: this.options.enableOfflineMode,
        toastNotifications: this.options.enableToastNotifications,
        touchOptimizations: this.options.enableTouchOptimizations,
      },
      managers: Object.keys(this.managers),
    };
  }

  /**
   * Manager abrufen
   */
  getManager<T>(name: string): T | null {
    return this.managers[name] || null;
  }

  /**
   * Feature aktivieren/deaktivieren
   */
  setFeatureEnabled(feature: keyof MobileInitOptions, enabled: boolean): void {
    this.options[feature] = enabled;

    // Entsprechenden Manager neu initialisieren oder deaktivieren
    if (this.isInitialized) {
      switch (feature) {
        case "enableGestureShortcuts":
          if (enabled) {
            void this.initializeGestureShortcuts();
          } else {
            this.managers.gestureShortcuts?.destroy();
            delete this.managers.gestureShortcuts;
          }
          break;

        case "enablePerformanceOptimization":
          if (enabled) {
            void this.initializePerformanceOptimization();
          } else {
            this.managers.performance?.destroy();
            delete this.managers.performance;
          }
          break;

        // Weitere Features...
      }
    }
  }

  /**
   * Performance-Report abrufen
   */
  getPerformanceReport(): any {
    const performanceManager = this.getManager<MobilePerformanceOptimizer>("performance");
    return performanceManager?.generateReport() || null;
  }

  /**
   * Cleanup alle Features
   */
  destroy(): void {
    Object.values(this.managers).forEach((manager) => {
      if (manager && typeof manager.destroy === "function") {
        manager.destroy();
      }
    });

    this.managers = {};
    this.isInitialized = false;
    MobileFeaturesManager.instance = null;
  }
}

/**
 * Globale Initialisierung
 */
export const mobileFeatures = {
  initialize: (options?: MobileInitOptions) => MobileFeaturesManager.getInstance(options).initialize(),
  getInstance: (options?: MobileInitOptions) => MobileFeaturesManager.getInstance(options),
  getStatus: () => MobileFeaturesManager.getInstance().getStatus(),
  getManager: <T>(name: string): T | null => MobileFeaturesManager.getInstance().getManager<T>(name),
  getPerformanceReport: () => MobileFeaturesManager.getInstance().getPerformanceReport(),
};

/**
 * Auto-Initialisierung beim Laden
 */
if (typeof window !== "undefined" && document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    void mobileFeatures.initialize();
  });
} else if (typeof window !== "undefined") {
  // DOM bereits geladen
  void mobileFeatures.initialize();
}