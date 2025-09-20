import { useCallback, useRef } from "react";

import { cn } from "../lib/utils/cn";

export interface CodeBlockProps {
  code: string;
  lang?: string;
  onCopied: () => void;
  className?: string;
}

export default function CodeBlock({ code, lang, onCopied, className }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement | null>(null);

  const copyWithFallback = useCallback(() => {
    const target = preRef.current;
    if (!target) return false;

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(target);
    selection?.removeAllRanges();
    selection?.addRange(range);

    let success = false;
    try {
      success = document.execCommand("copy");
    } catch (error) {
      console.warn("Code copy fallback failed", error);
    }

    selection?.removeAllRanges();
    if (success) onCopied();
    return success;
  }, [onCopied]);

  const handleCopy = useCallback(async () => {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(code);
        onCopied();
        return;
      }
      copyWithFallback();
    } catch (error) {
      console.warn("Code copy failed", error);
      copyWithFallback();
    }
  }, [code, onCopied, copyWithFallback]);

  return (
    <div className={cn("code-block relative", className)}>
      <button
        type="button"
        aria-label="Code kopieren"
        onClick={handleCopy}
        className="btn btn-ghost btn-sm absolute right-3 top-3"
      >
        Kopieren
      </button>
      <pre ref={preRef}>
        <code>
          {lang ? `// ${lang}\n` : ""}
          {code}
        </code>
      </pre>
    </div>
  );
}
