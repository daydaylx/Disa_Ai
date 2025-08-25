import React, { Component } from "react"
import type { ReactNode, ErrorInfo } from "react"

type Props = { children: ReactNode }
type State = { hasError: boolean; message?: string }

export default class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false }
  static getDerivedStateFromError(error: unknown): Partial<State> {
    return { hasError: true, message: error instanceof Error ? error.message : String(error) }
  }
  override componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info)
  }
  override render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 rounded-md border border-red-300 bg-red-50 text-red-900">
          <div className="font-semibold mb-1">Es ist ein Fehler aufgetreten.</div>
          <div className="text-sm opacity-80 break-words">{this.state.message}</div>
        </div>
      )
    }
    return this.props.children
  }
}
