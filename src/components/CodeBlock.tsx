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
    <div className={['relative group codeblock', 'rounded-xl border border-white/10 bg-[#232832]/80 backdrop-blur-md shadow-[0_0_12px_rgba(79,195,247,0.18)] hover:shadow-[0_0_16px_rgba(167,139,250,0.22)] transition', className].filter(Boolean).join(' ')}>
      <button
        type="button"
        aria-label="Code kopieren"
        onClick={handleCopy}
        className="absolute right-2 top-2 z-10 text-[#e5e7eb] hover:text-white bg-transparent px-2 py-1 rounded-md hover:shadow-[0_0_16px_#00ffff99]"
      >
        Kopieren
      </button>
      <pre ref={preRef} className="overflow-x-auto rounded-xl border border-white/10 bg-background/80 p-4 text-foreground">
        <code className="whitespace-pre text-sm">
          {lang ? `// ${lang}\n` : null}
          {code}
        </code>
      </pre>
    </div>
  )
}
