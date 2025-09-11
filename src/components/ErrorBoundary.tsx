import type { ErrorInfo, ReactNode } from "react";
import { Component } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean; message?: string };

export default class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };
  static getDerivedStateFromError(error: unknown): Partial<State> {
    return { hasError: true, message: error instanceof Error ? error.message : String(error) };
  }
  override componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info);
  }
  override render() {
    if (this.state.hasError) {
      return (
        <div className="glass mx-auto max-w-md rounded-lg p-6 text-center">
          <div className="mb-3 text-lg font-semibold text-destructive">
            ⚠️ Es ist ein Fehler aufgetreten
          </div>
          <div className="mb-4 break-words text-sm text-muted-foreground">
            {this.state.message}
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={() => window.location.reload()}
          >
            Neu laden
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
