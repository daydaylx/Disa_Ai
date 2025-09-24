import React from "react";

type State = { hasError: boolean; error?: any };

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: any): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, info: any) {
    // Hook fuer Sentry oder Console

    console.error("UI ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh items-center justify-center bg-bg p-6 text-white">
          <div className="card max-w-md p-5">
            <h2 className="mb-2 text-lg font-semibold">Etwas ist schiefgelaufen.</h2>
            <p className="mb-4 text-sm text-white/70">
              Die Oberfläche hat einen Fehler abgefangen. Neu laden hilft meistens.
            </p>
            <pre className="max-h-48 overflow-auto whitespace-pre-wrap rounded-xl border border-white/15 bg-black/40 p-3 text-xs">
              {String(this.state.error ?? "")}
            </pre>
            <button className="btn-primary mt-4" onClick={() => location.reload()}>
              Neu laden
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
