import React, { useCallback, useRef } from 'react'

export interface CodeBlockProps {
  code: string
  lang?: string
  onCopied: () => void
  className?: string
}

export default function CodeBlock({ code, lang, onCopied, className }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement | null>(null)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      onCopied()
    } catch {
      // Fallback: Text selektieren
      const el = preRef.current
      if (el) {
        const r = document.createRange()
        r.selectNodeContents(el)
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(r)
        try { document.execCommand('copy') } catch { /* noop */ }
        sel?.removeAllRanges()
        onCopied()
      }
    }
  }, [code, onCopied])

  return (
    <div className={['relative group codeblock', 'rounded-2xl border border-white/30 bg-white/70 backdrop-blur-lg shadow-soft transition', className].filter(Boolean).join(' ')}>
      <button
        type="button"
        aria-label="Code kopieren"
        onClick={handleCopy}
        className="absolute right-2 top-2 z-10 rounded-[14px] border border-white/30 bg-white/60 px-2 py-1 text-xs text-foreground backdrop-blur-md hover:bg-white/70"
      >
        Kopieren
      </button>
      <pre ref={preRef} className="overflow-x-auto rounded-2xl border border-white/30 bg-white/80 p-4 text-foreground">
        <code className="whitespace-pre text-sm font-mono">
          {lang ? `// ${lang}\n` : null}
          {code}
        </code>
      </pre>
    </div>
  )
}
