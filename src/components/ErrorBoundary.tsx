import React, { Component, ErrorInfo, ReactNode } from "react";

import { logger } from "@/lib/logger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to centralized logger
    logger.error("React Error Boundary caught error", {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      errorInfo: {
        componentStack: errorInfo.componentStack,
      },
      timestamp: new Date().toISOString(),
    });
  }

  private handleReload = (): void => {
    // Clear error state and reload page
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });

    // Force page reload to recover from error state
    window.location.reload();
  };

  private handleRetry = (): void => {
    // Clear error state to retry rendering
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="text-foreground bg-background flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md space-y-6 text-center">
            <div className="space-y-2">
              <h1 className="text-danger text-2xl font-semibold">Oops! Something went wrong</h1>
              <p className="text-muted-foreground">
                The application encountered an unexpected error. This has been logged and will be
                investigated.
              </p>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details className="bg-muted rounded-lg p-4 text-left text-sm">
                <summary className="mb-2 cursor-pointer font-medium">
                  Error Details (Development)
                </summary>
                <div className="space-y-2">
                  <div>
                    <strong>Error:</strong> {this.state.error.name}
                  </div>
                  <div>
                    <strong>Message:</strong> {this.state.error.message}
                  </div>
                  {this.state.error.stack && (
                    <div>
                      <strong>Stack:</strong>
                      <pre className="bg-background mt-1 whitespace-pre-wrap rounded border p-2 text-xs">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="bg-background mt-1 whitespace-pre-wrap rounded border p-2 text-xs">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex justify-center gap-3">
              <button
                onClick={this.handleRetry}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-md px-4 py-2 transition-colors"
              >
                Reload Page
              </button>
            </div>

            <p className="text-muted-foreground text-xs">
              If this problem persists, please refresh your browser or contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
