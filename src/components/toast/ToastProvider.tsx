// Legacy-Adapter auf den kanonischen React-Toaster
import React from "react";

import { ToastsProvider, useToasts } from "../ui/Toast";

export type ToastKind = "info" | "success" | "warn" | "error";
export interface ToastItem {
  id: string;
  kind: ToastKind;
  title: string;
  message?: string | undefined;
  action?: { label: string; onClick: () => void } | undefined;
}

export const useToast = () => {
  const { push } = useToasts();
  return {
    push: (t: Omit<ToastItem, "id">) =>
      push({
        kind: (t.kind === "warn" ? "warning" : (t.kind as any)) ?? "info",
        title: t.title,
        message: t.message,
        action: t.action,
      } as any),
  };
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ToastsProvider>{children}</ToastsProvider>;
};
