import * as React from "react";

export interface SimpleMarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Simple markdown renderer for basic formatting
 * Handles: **bold**, *italic*, `code`, and basic line breaks
 */
export default function SimpleMarkdownRenderer({
  content,
  className = "",
}: SimpleMarkdownRendererProps) {
  const processedContent = React.useMemo(() => {
    let text = content;

    // Handle code blocks (```...```)
    text = text.replace(/```[\s\S]*?```/g, (match) => {
      const code = match.slice(3, -3).trim();
      return `<pre class="bg-surface-secondary rounded-lg p-4 overflow-x-auto my-4"><code>${code}</code></pre>`;
    });

    // Handle inline code (`...`)
    text = text.replace(
      /`([^`]+)`/g,
      '<code class="bg-surface-secondary px-1.5 py-0.5 rounded text-sm font-mono">$1</code>',
    );

    // Handle bold (**...** or __...__)
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/__(.*?)__/g, "<strong>$1</strong>");

    // Handle italic (*...* or _..._)
    text = text.replace(/\*(.*?)\*/g, "<em>$1</em>");
    text = text.replace(/_(.*?)_/g, "<em>$1</em>");

    // Handle line breaks
    text = text.replace(/\n\n/g, "</p><p>");
    text = text.replace(/\n/g, "<br>");

    // Wrap in paragraph if not already wrapped
    if (!text.startsWith("<")) {
      text = `<p>${text}</p>`;
    }

    return text;
  }, [content]);

  return (
    <div
      className={`prose prose-invert max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}
