import * as React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean; message?: string };

export class ErrorBoundary extends React.Component<Props, State> {
  public override state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown): Partial<State> {
    return { hasError: true, message: String(error) };
  }

  public override componentDidCatch(error: unknown, info: React.ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary]", error, info);
  }

  public override render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg">
          <div className="font-semibold mb-1">Es ist ein Fehler aufgetreten.</div>
          <div className="break-words">{this.state.message ?? "Unbekannter Fehler"}</div>
        </div>
      );
    }
    return this.props.children;
  }
}
