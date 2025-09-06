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
    <div className={['relative group codeblock', className].filter(Boolean).join(' ')}>
      <button
        type="button"
        aria-label="Code kopieren"
        onClick={handleCopy}
        className="absolute right-2 top-2 z-10 btn btn-ghost text-neutral-200/80 hover:text-white"
      >
        Kopieren
      </button>
      <pre ref={preRef} className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-neutral-100">
        <code className="whitespace-pre text-sm">
          {lang ? `// ${lang}\n` : null}
          {code}
        </code>
      </pre>
    </div>
  )
}
