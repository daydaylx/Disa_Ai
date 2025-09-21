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
        <pre className="bg-surface-secondary overflow-x-auto rounded-lg p-4 text-sm">
          <code>{props.code}</code>
        </pre>
      }
    >
      <CodeBlock {...props} />
    </React.Suspense>
  );
}
