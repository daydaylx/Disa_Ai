import * as React from "react";

interface CopyButtonProps {
  text: string;
  onCopied?: () => void;
  className?: string;
  children?: React.ReactNode;
  size?: "sm" | "md";
  variant?: "primary" | "secondary" | "ghost";
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  onCopied,
  className = "",
  children,
  size = "sm",
  variant = "secondary",
}) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      onCopied?.();

      // Dispatch toast event for consistent UX
      window.dispatchEvent(
        new CustomEvent("disa:toast", {
          detail: { kind: "success", title: "Kopiert" },
        }),
      );
    } catch (error) {
      console.warn("Copy failed:", error);
      window.dispatchEvent(
        new CustomEvent("disa:toast", {
          detail: { kind: "error", title: "Kopieren fehlgeschlagen" },
        }),
      );
    }
  };

  const sizeClass = size === "sm" ? "!min-h-0 !px-2 !py-1 text-xs" : "px-3 py-2 text-sm";
  const variantClass = `btn-${variant}`;

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`${variantClass} ${sizeClass} ${className}`}
      aria-label="Text kopieren"
    >
      {children || "Kopieren"}
    </button>
  );
};
