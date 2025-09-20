import * as React from "react";

import { cn } from "../../lib/utils/cn";

type CopyButtonVariant = "primary" | "ghost" | "danger" | "base";

const sizeClasses: Record<"sm" | "md", string> = {
  sm: "btn-sm",
  md: "",
};

const variantClasses: Record<CopyButtonVariant, string> = {
  primary: "btn-primary",
  ghost: "btn-ghost",
  danger: "btn-danger",
  base: "",
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
        console.warn("Copy failed:", error);
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
        console.warn("Copy fallback failed", error);
      } finally {
        document.body.removeChild(textarea);
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
      console.warn("Copy failed:", error);
      runToast("error", "Kopieren fehlgeschlagen");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn("btn", variantClasses[variant], sizeClasses[size], className)}
      aria-label="Text kopieren"
      {...buttonProps}
    >
      {children || "Kopieren"}
    </button>
  );
};
