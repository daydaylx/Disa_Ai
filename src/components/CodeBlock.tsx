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

  const normalizedLang = React.useMemo(() => (lang ? lang.trim() : ""), [lang]);

  return (
    <div className={cn("glass-code-block", className)}>
      <div className="glass-code-block__header">
        <div className="code-block__meta" aria-hidden={!normalizedLang}>
          {normalizedLang ? normalizedLang : "Code"}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleWrap}
            className={cn("glass-code-block__copy", wrap && "opacity-100")}
            aria-pressed={wrap}
            aria-label={wrap ? "Zeilenumbruch deaktivieren" : "Zeilenumbruch aktivieren"}
          >
            <Icon name="wrap" size={12} aria-hidden />
          </button>
          <CopyButton
            text={code}
            onCopied={handleCopied}
            className="glass-code-block__copy"
            aria-label="Code kopieren"
          >
            {copied ? (
              <Icon name="check" size={12} aria-hidden />
            ) : (
              <Icon name="copy" size={12} aria-hidden />
            )}
          </CopyButton>
        </div>
      </div>
      <div className="glass-code-block__content">
        <pre className={cn("", wrap && "whitespace-pre-wrap")}>
          <code data-lang={normalizedLang || undefined}>{code}</code>
        </pre>
      </div>
    </div>
  );
}
