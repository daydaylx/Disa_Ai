import React from "react";

import { Button } from "../primitives/Button";
export interface ActionsProps {
  onCopy: () => void;
  onRetry?: () => void;
  onEdit?: () => void;
  onPin?: () => void;
}
export function MessageActions({ onCopy, onRetry, onEdit, onPin }: ActionsProps) {
  return (
    <div className="flex gap-2 opacity-80">
      <Button variant="outline" size="sm" onClick={onCopy}>
        Copy
      </Button>
      {onRetry && (
        <Button variant="ghost" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
      {onEdit && (
        <Button variant="ghost" size="sm" onClick={onEdit}>
          Edit
        </Button>
      )}
      {onPin && (
        <Button variant="ghost" size="sm" onClick={onPin}>
          Pin
        </Button>
      )}
    </div>
  );
}
