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

    const copyWithExec = () => {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "true");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        onCopied?.();
        runToast("success", "Kopiert");
      } catch (error) {
        console.warn("Copy fallback failed", error);
        runToast("error", "Kopieren fehlgeschlagen");
      } finally {
        document.body.removeChild(textarea);
      }
    };

    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(text);
        onCopied?.();
        runToast("success", "Kopiert");
        return;
      }
      copyWithExec();
    } catch (error) {
      console.warn("Copy failed:", error);
      copyWithExec();
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
