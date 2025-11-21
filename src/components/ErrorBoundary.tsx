import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

import { Button } from "@/ui/Button";
import { PremiumCard } from "@/ui/PremiumCard";

import { getEnvConfig, getEnvironmentErrors, isEnvironmentValid } from "../config/env";
import { logger } from "../lib/utils/production-logger";

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
        <div className="bg-[var(--surface-base)] flex min-h-dvh items-center justify-center p-4">
          <PremiumCard className="w-full max-w-2xl">
            <div className="mb-8 text-center">
              <div className="bg-[var(--glass-surface-medium)] backdrop-blur-[var(--backdrop-blur-strong)] border border-[var(--aurora-red-400)] mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl shadow-[var(--shadow-glow-red)] animate-pulse">
                <svg
                  className="text-destructive h-10 w-10 drop-shadow-glow-destructive"
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

            <div className="bg-[var(--glass-surface-subtle)] backdrop-blur-[var(--backdrop-blur-medium)] border border-[var(--glass-border-subtle)] shadow-[var(--shadow-glow-soft)] mb-6 rounded-2xl p-6">
              <h2 className="text-text-primary mb-2 font-semibold flex items-center gap-2">
                <span className="text-destructive text-xl">⚠️</span>Fehlerdetails
              </h2>
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
              <Button onClick={this.handleReload} variant="primary" size="lg" className="flex-1">
                Seite neu laden
              </Button>
              <Button onClick={this.handleReset} variant="secondary" size="lg" className="flex-1">
                App zurücksetzen
              </Button>
              <Button
                onClick={this.handleReportError}
                variant="secondary"
                size="lg"
                className="flex-1"
              >
                Fehler melden
              </Button>
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
          </PremiumCard>
        </div>
      );
    }

    return this.props.children;
  }
}
