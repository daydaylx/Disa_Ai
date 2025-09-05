export type ToastKind = "info" | "success" | "warning" | "error";

export interface ToastItem {
  id: string;
  kind: ToastKind;
  title?: string;
  message?: string;
  durationMs?: number; // auto close
  action?: { label: string; onClick: () => void };
}
