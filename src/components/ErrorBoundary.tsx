import React, { Component, ErrorInfo, ReactNode } from "react";

import { getEnvConfig, getEnvironmentErrors, isEnvironmentValid } from "../config/env";

interface Props {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

/**
 * Global Error Boundary with comprehensive error reporting
 * Provides detailed error information and recovery options
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Generate unique error ID for tracking
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Log detailed error information
    console.error("🚨 Application Error Boundary");
    console.error("Error:", error);
    console.error("Error Info:", errorInfo);
    console.error("Component Stack:", errorInfo.componentStack);

    // Log environment diagnostics
    this.logEnvironmentDiagnostics();
  }

  private logEnvironmentDiagnostics() {
    console.error("🔍 Environment Diagnostics");

    try {
      const envValid = isEnvironmentValid();
      console.error("Environment Valid:", envValid);

      if (!envValid) {
        const errors = getEnvironmentErrors();
        console.error("Environment Errors:", errors);
      }

      const config = getEnvConfig();
      console.error("Environment Config:", config);
    } catch (envError) {
      console.error("Environment Configuration Error:", envError);
    }

    // Check network connectivity
    if (navigator.onLine) {
      console.error("Network Status: Online");
    } else {
      console.error("Network Status: Offline");
    }

    // Check localStorage availability
    try {
      localStorage.setItem("test", "test");
      localStorage.removeItem("test");
      console.error("LocalStorage: Available");
    } catch {
      console.error("LocalStorage: Not available");
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    // Clear localStorage and reload
    try {
      localStorage.clear();
    } catch {
      // Ignore if localStorage is not available
    }
    window.location.reload();
  };

  private handleReportError = () => {
    const { error, errorInfo, errorId } = this.state;
    const reportData = {
      errorId,
      error: error?.toString(),
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };

    // Copy error report to clipboard
    void navigator.clipboard?.writeText(JSON.stringify(reportData, null, 2));
    alert("Fehlerbericht wurde in die Zwischenablage kopiert");
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorId } = this.state;

      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(error!, errorInfo!);
      }

      // Default error UI
      return (
        <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-xl">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 14.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h1 className="mb-2 text-2xl font-bold text-gray-900">Anwendungsfehler</h1>
              <p className="text-gray-600">
                Die Anwendung ist auf einen unerwarteten Fehler gestoßen
              </p>
            </div>

            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <h2 className="mb-2 font-semibold text-gray-900">Fehlerdetails</h2>
              <div className="space-y-1 text-sm text-gray-700">
                <div>
                  <strong>Fehler-ID:</strong> {errorId}
                </div>
                <div>
                  <strong>Typ:</strong> {error?.name || "Unbekannt"}
                </div>
                <div>
                  <strong>Nachricht:</strong> {error?.message || "Keine Details verfügbar"}
                </div>
                <div>
                  <strong>Zeit:</strong> {new Date().toLocaleString()}
                </div>
              </div>
            </div>

            {!isEnvironmentValid() && (
              <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <h3 className="mb-2 font-semibold text-yellow-800">Konfigurationsproblem</h3>
                <p className="mb-2 text-sm text-yellow-700">
                  Die Umgebungskonfiguration ist unvollständig:
                </p>
                <ul className="list-inside list-disc text-sm text-yellow-700">
                  {getEnvironmentErrors().map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={this.handleReload}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Seite neu laden
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 rounded-lg bg-gray-600 px-4 py-2 text-white transition-colors hover:bg-gray-700"
              >
                App zurücksetzen
              </button>
              <button
                onClick={this.handleReportError}
                className="flex-1 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
              >
                Fehler melden
              </button>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <details className="text-sm">
                <summary className="cursor-pointer text-gray-600 hover:text-gray-900">
                  Technische Details anzeigen
                </summary>
                <div className="mt-3 max-h-40 overflow-auto rounded bg-gray-900 p-3 font-mono text-xs text-gray-100">
                  <div>
                    <strong>Stack Trace:</strong>
                  </div>
                  <pre>{error?.stack}</pre>
                  {errorInfo?.componentStack && (
                    <>
                      <div className="mt-2">
                        <strong>Component Stack:</strong>
                      </div>
                      <pre>{errorInfo.componentStack}</pre>
                    </>
                  )}
                </div>
              </details>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook for manual error reporting
 */
export function useErrorReporting() {
  const reportError = (error: Error, context?: string) => {
    console.error("🚨 Manual Error Report");
    console.error("Error:", error);
    if (context) console.error("Context:", context);

    // You could send this to an error tracking service
  };

  return { reportError };
}

/**
 * Startup diagnostics component
 * Runs initial checks and reports problems as non-blocking warnings
 */
export function StartupDiagnostics({ children }: { children: ReactNode }) {
  const [warnings, setWarnings] = React.useState<string[]>([]);
  const [showWarnings, setShowWarnings] = React.useState(false);

  React.useEffect(() => {
    const runDiagnostics = () => {
      const diagnosticWarnings: string[] = [];

      try {
        // Environment validation (non-critical)
        if (!isEnvironmentValid()) {
          diagnosticWarnings.push(...getEnvironmentErrors());
        }

        // Network connectivity check (informational only)
        if (!navigator.onLine) {
          diagnosticWarnings.push("Offline-Modus aktiv");
        }

        // API availability check (delayed, non-blocking)
        // Only check if we have an API key configured and not on mobile to prevent crashes
        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );

        if (!isMobile) {
          setTimeout(async () => {
            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 3000);

              const config = getEnvConfig();
              if (config.VITE_OPENROUTER_BASE_URL) {
                await fetch(config.VITE_OPENROUTER_BASE_URL + "/models", {
                  method: "GET",
                  signal: controller.signal,
                });
              }

              clearTimeout(timeoutId);
            } catch {
              // API issues are handled by the existing error system
              console.warn("API connectivity check failed - using existing error handling");
            }
          }, 2000); // Longer delay for stability
        }

        if (diagnosticWarnings.length > 0) {
          setWarnings(diagnosticWarnings);
          setShowWarnings(true);
        }
      } catch (error) {
        // Log but don't block
        console.warn("Startup diagnostics failed:", error);
      }
    };

    runDiagnostics();
  }, []);

  return (
    <>
      {/* Non-blocking warning banner */}
      {showWarnings && warnings.length > 0 && (
        <div className="fixed left-0 right-0 top-0 z-50 border-b border-yellow-200 bg-yellow-100 p-3">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg
                className="h-5 w-5 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 14.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span className="text-sm text-yellow-800">
                {warnings.length === 1 ? warnings[0] : `${warnings.length} Konfigurationswarnungen`}
              </span>
            </div>
            <button
              onClick={() => setShowWarnings(false)}
              className="text-xl font-bold text-yellow-600 hover:text-yellow-800"
              aria-label="Warning schließen"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* App always renders */}
      <div className={showWarnings && warnings.length > 0 ? "pt-12" : ""}>{children}</div>
    </>
  );
}
