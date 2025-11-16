import * as React from "react";

import { cn } from "../../lib/utils";

type CopyButtonVariant = "base" | "brand" | "ghost" | "danger";

const sizeClasses: Record<"sm" | "md", string> = {
  sm: "h-10 w-10",
  md: "h-11 px-4",
};

const variantClasses: Record<CopyButtonVariant, string> = {
  base: "border-border-subtle bg-surface-card text-text-muted hover:bg-surface-card-hover hover:text-text-strong",
  brand: "border-transparent bg-brand-base text-surface-0 hover:bg-brand-strong",
  ghost:
    "border-transparent bg-transparent text-text-muted hover:bg-surface-card hover:text-text-strong",
  danger: "border-transparent bg-state-danger/10 text-state-danger hover:bg-state-danger/15",
};

interface CopyButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick"> {
  text: string;
  onCopied?: () => void;
  size?: "sm" | "md";
  variant?: CopyButtonVariant;
  children?: React.ReactNode;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  onCopied,
  size = "sm",
  variant = "ghost",
  className,
  children,
  ...buttonProps
}) => {
  const handleCopy = async () => {
    const runToast = (kind: "success" | "error", title: string) => {
      window.dispatchEvent(
        new CustomEvent("disa:toast", {
          detail: { kind, title },
        }),
      );
    };

    const copyWithClipboard = async () => {
      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") {
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        console.warn("Kopieren fehlgeschlagen:", error);
        return false;
      }
    };

    const copyWithExec = () => {
      if (typeof document.execCommand !== "function") {
        return false;
      }

      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "true");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();

      let copied = false;
      try {
        copied = document.execCommand("copy");
      } catch (error) {
        console.warn("Kopieren (Fallback) fehlgeschlagen", error);
      }

      return copied;
    };

    const reportSuccess = () => {
      onCopied?.();
      runToast("success", "Kopiert");
    };

    try {
      if (await copyWithClipboard()) {
        reportSuccess();
        return;
      }

      if (copyWithExec()) {
        reportSuccess();
        return;
      }

      runToast("error", "Kopieren nicht unterstützt");
    } catch (error) {
      console.warn("Kopieren fehlgeschlagen:", error);
      runToast("error", "Kopieren fehlgeschlagen");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "rounded-lg focus-visible:ring-brand-weak focus-visible:ring-offset-surface-0 inline-flex items-center justify-center border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      aria-label={`Text kopieren: ${text.substring(0, 50)}${text.length > 50 ? "..." : ""}`}
      {...buttonProps}
    >
      {children || "Kopieren"}
    </button>
  );
};
