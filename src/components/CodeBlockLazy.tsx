import * as React from "react";

// Lazy load the heavy CodeBlock component
const CodeBlock = React.lazy(() => import("./CodeBlock"));

export interface CodeBlockLazyProps {
  code: string;
  lang?: string;
  onCopied?: () => void;
  className?: string;
}

export default function CodeBlockLazy(props: CodeBlockLazyProps) {
  return (
    <React.Suspense
      fallback={
        <div className="glass-code-block">
          <div className="glass-code-block__header">
            <div>Code</div>
          </div>
          <div className="glass-code-block__content">
            <pre>
              <code>{props.code}</code>
            </pre>
          </div>
        </div>
      }
    >
      <CodeBlock {...props} />
    </React.Suspense>
  );
}
