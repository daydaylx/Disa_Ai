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
    <div
      className={cn(
        "rounded-base border-border bg-surface-2 text-text-0 relative overflow-hidden border text-sm",
        className,
      )}
    >
      <span className="brand-rail bg-brand absolute left-0 top-0 h-full w-1" aria-hidden="true" />
      <div className="border-border bg-surface-1 flex items-center justify-between border-b px-4 py-2 pl-6">
        <span className="text-text-1 font-mono text-xs uppercase tracking-[0.08em]">
          {normalizedLang || "code"}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleToggleWrap}
            className={cn(
              "rounded-base text-text-1 hover:bg-surface-2 hover:text-text-0 focus-visible:ring-brand focus-visible:ring-offset-surface-1 inline-flex h-9 w-9 items-center justify-center border border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              wrap && "bg-surface-2 text-text-0",
            )}
            aria-pressed={wrap}
            aria-label={wrap ? "Zeilenumbruch deaktivieren" : "Zeilenumbruch aktivieren"}
          >
            <Icon name="wrap" size={14} aria-hidden />
          </button>
          <CopyButton
            text={code}
            onCopied={handleCopied}
            size="sm"
            variant="ghost"
            className="focus-visible:ring-offset-surface-1 h-9 w-9"
            aria-label="Code kopieren"
          >
            {copied ? (
              <Icon name="check" size={16} aria-hidden />
            ) : (
              <Icon name="copy" size={16} aria-hidden />
            )}
          </CopyButton>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto px-4 py-4 pl-6">
        <pre className={cn("min-w-0 text-sm leading-6", wrap && "whitespace-pre-wrap")}>
          <code data-lang={normalizedLang || undefined} className="font-mono text-sm">
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
}
