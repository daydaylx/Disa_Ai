import * as React from "react";

import { cn } from "../lib/cn";
import { CopyButton } from "./ui/CopyButton";
import { Icon } from "./ui/Icon";

export interface CodeBlockProps {
  code: string;
  lang?: string;
  onCopied?: () => void;
  className?: string;
}

export default function CodeBlock({ code, lang, onCopied, className }: CodeBlockProps) {
  const [wrap, setWrap] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const resetTimer = React.useRef<number | null>(null);

  const handleCopied = React.useCallback(() => {
    setCopied(true);
    onCopied?.();
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopied(false), 1600);
  }, [onCopied]);

  React.useEffect(() => {
    return () => {
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    };
  }, []);

  const handleToggleWrap = React.useCallback(() => {
    setWrap((prev) => !prev);
  }, []);

  const normalizedLang = React.useMemo(() => (lang ? lang.trim().toLowerCase() : ""), [lang]);

  return (
    <div className={cn("rounded-lg bg-gray-900/70 text-sm text-white", className)}>
      <div className="flex items-center justify-between rounded-t-lg bg-gray-800/50 px-4 py-2">
        <span className="font-mono text-xs text-gray-400">{normalizedLang || "code"}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleWrap}
            className={cn(
              "rounded p-1 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white",
              wrap && "bg-gray-700 text-white",
            )}
            aria-pressed={wrap}
            aria-label={wrap ? "Zeilenumbruch deaktivieren" : "Zeilenumbruch aktivieren"}
          >
            <Icon name="wrap" size={14} aria-hidden />
          </button>
          <CopyButton
            text={code}
            onCopied={handleCopied}
            className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
            aria-label="Code kopieren"
          >
            {copied ? (
              <Icon name="check" size={14} aria-hidden />
            ) : (
              <Icon name="copy" size={14} aria-hidden />
            )}
          </CopyButton>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto p-4">
        <pre className={cn("min-w-0", wrap && "whitespace-pre-wrap")}>
          <code data-lang={normalizedLang || undefined}>{code}</code>
        </pre>
      </div>
    </div>
  );
}
