import type { ErrorInfo, ReactNode } from "react";
import React, { Component } from "react";

import { getEnvConfig, getEnvironmentErrors, isEnvironmentValid } from "../config/env";
import { logger } from "../lib/utils/production-logger";
import { AuroraCard } from "./ui/aurora-card";

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
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      hasError: true,
      error,
      errorId,
    };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    logger.error("🚨 Application Error Boundary");
    logger.error("Error:", error);
    logger.error("Error Info:", errorInfo);
    logger.error("Component Stack:", errorInfo.componentStack);

    this.logEnvironmentDiagnostics();
  }

  private logEnvironmentDiagnostics() {
    logger.error("🔍 Environment Diagnostics");

    try {
      const envValid = isEnvironmentValid();
      logger.error("Environment Valid:", envValid);

      if (!envValid) {
        const errors = getEnvironmentErrors();
        logger.error("Environment Errors:", errors);
      }

      const config = getEnvConfig();
      logger.error("Environment Config:", config);
    } catch (envError) {
      logger.error("Environment Configuration Error:", envError);
    }

    if (navigator.onLine) {
      logger.error("Network Status: Online");
    } else {
      logger.error("Network Status: Offline");
    }

    try {
      localStorage.setItem("test", "test");
      localStorage.removeItem("test");
      logger.error("LocalStorage: Available");
    } catch {
      logger.error("LocalStorage: Not available");
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch {
      // Ignore
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

    void navigator.clipboard?.writeText(JSON.stringify(reportData, null, 2));
    alert("Fehlerbericht wurde in die Zwischenablage kopiert");
  };

  override render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorId } = this.state;

      if (this.props.fallback) {
        return this.props.fallback(error!, errorInfo!);
      }

      return (
        <div className="bg-surface-base flex min-h-dvh items-center justify-center p-4">
          <AuroraCard className="shadow-depth-4 w-full max-w-2xl rounded-lg" padding="lg">
            <div className="mb-8 text-center">
              <div className="bg-danger/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <svg
                  className="text-danger h-8 w-8"
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
              <h1 className="text-text-primary mb-2 text-2xl font-bold">Anwendungsfehler</h1>
              <p className="text-text-secondary">
                Die Anwendung ist auf einen unerwarteten Fehler gestoßen
              </p>
            </div>

            <div className="bg-surface-subtle mb-6 rounded-lg p-4">
              <h2 className="text-text-primary mb-2 font-semibold">Fehlerdetails</h2>
              <div className="text-text-secondary space-y-1 text-sm">
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
              <div className="border-warn/30 bg-warn/10 mb-6 rounded-lg border p-4">
                <h3 className="text-warn mb-2 font-semibold">Konfigurationsproblem</h3>
                <p className="text-warn/80 mb-2 text-sm">
                  Die Umgebungskonfiguration ist unvollständig:
                </p>
                <ul className="text-warn/80 list-inside list-disc text-sm">
                  {getEnvironmentErrors().map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                onClick={this.handleReload}
                className="bg-brand hover:bg-brand/90 flex-1 rounded-lg px-4 py-2 text-white transition-colors"
              >
                Seite neu laden
              </button>
              <button
                onClick={this.handleReset}
                className="bg-surface-subtle text-text-primary hover:bg-card flex-1 rounded-lg px-4 py-2 transition-colors"
              >
                App zurücksetzen
              </button>
              <button
                onClick={this.handleReportError}
                className="bg-success hover:bg-success/90 flex-1 rounded-lg px-4 py-2 text-white transition-colors"
              >
                Fehler melden
              </button>
            </div>

            <div className="border-border mt-6 border-t pt-6">
              <details className="text-sm">
                <summary className="text-text-secondary hover:text-text-primary cursor-pointer">
                  Technische Details anzeigen
                </summary>
                <div className="bg-surface-subtle text-text-primary mt-4 max-h-40 overflow-auto rounded p-4 font-mono text-xs">
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
          </AuroraCard>
        </div>
      );
    }

    return this.props.children;
  }
}

export function useErrorReporting() {
  const reportError = (error: Error, context?: string) => {
    logger.error("🚨 Manual Error Report");
    logger.error("Error:", error);
    if (context) logger.error("Context:", context);
  };

  return { reportError };
}

export function StartupDiagnostics({ children }: { children: ReactNode }) {
  const [warnings, setWarnings] = React.useState<string[]>([]);
  const [showWarnings, setShowWarnings] = React.useState(false);

  React.useEffect(() => {
    const runDiagnostics = () => {
      const diagnosticWarnings: string[] = [];

      try {
        if (!isEnvironmentValid()) {
          diagnosticWarnings.push(...getEnvironmentErrors());
        }

        if (!navigator.onLine) {
          diagnosticWarnings.push("Offline-Modus aktiv");
        }

        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );

        if (!isMobile) {
          setTimeout(async () => {
            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 3000);

              const { checkApiHealth } = await import("../api/openrouter");
              await checkApiHealth({ timeoutMs: 3000, signal: controller.signal });

              clearTimeout(timeoutId);
            } catch {
              logger.warn("API connectivity check failed - using existing error handling");
            }
          }, 2000);
        }

        if (diagnosticWarnings.length > 0) {
          setWarnings(diagnosticWarnings);
          setShowWarnings(true);
        }
      } catch (error) {
        logger.warn("Startup diagnostics failed:", error);
      }
    };

    runDiagnostics();
  }, []);

  return (
    <>
      {showWarnings && warnings.length > 0 && (
        <div className="border-warn/30 bg-warn/10 fixed left-0 right-0 top-0 z-60 border-b p-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg
                className="text-warn h-5 w-5"
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
              <span className="text-warn text-sm">
                {warnings.length === 1 ? warnings[0] : `${warnings.length} Konfigurationswarnungen`}
              </span>
            </div>
            <button
              onClick={() => setShowWarnings(false)}
              className="text-warn hover:text-warn/80 text-xl font-bold"
              aria-label="Warning schließen"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className={showWarnings && warnings.length > 0 ? "pt-12" : ""}>{children}</div>
    </>
  );
}
