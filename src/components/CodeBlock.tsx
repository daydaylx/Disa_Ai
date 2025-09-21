import * as React from "react";

import { cn } from "../lib/utils/cn";
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
    <div className={cn("code-block", className)}>
      <div className="code-block__toolbar">
        <div className="code-block__meta" aria-hidden={!normalizedLang}>
          {normalizedLang ? normalizedLang : "Code"}
        </div>
        <div className="code-block__actions">
          <button
            type="button"
            onClick={handleToggleWrap}
            className={cn("btn btn-ghost btn-sm code-block__toggle", wrap && "is-active")}
            aria-pressed={wrap}
            aria-label={wrap ? "Zeilenumbruch deaktivieren" : "Zeilenumbruch aktivieren"}
          >
            <Icon name="wrap" size={16} aria-hidden />
            <span className="code-block__action-label">Umbruch</span>
          </button>
          <CopyButton
            text={code}
            onCopied={handleCopied}
            size="sm"
            variant="ghost"
            className="code-block__copy"
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
      <pre className={cn("code-block__pre", wrap && "code-block__pre--wrap")}>
        <code className="code-block__code" data-lang={normalizedLang || undefined}>
          {code}
        </code>
      </pre>
    </div>
  );
}
