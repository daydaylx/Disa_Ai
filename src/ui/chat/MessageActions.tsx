import React, { useState } from "react";

import { copyToClipboard, showCopyFeedback } from "../../lib/clipboard";
import { Button } from "../primitives/Button";
import { Role } from "./types";

export interface ActionsProps {
  messageId: string;
  content: string;
  role: Role;
  onRegenerate?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function MessageActions(props: ActionsProps) {
  const { content, role, onRegenerate, onEdit, onDelete } = props;
  const [isCopying, setIsCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState<boolean | null>(null);

  const handleCopy = async () => {
    setIsCopying(true);
    const result = await copyToClipboard(content);
    setCopySuccess(result.success);
    showCopyFeedback(result.success, result.error);
    setIsCopying(false);

    // Reset feedback after 2 seconds
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const getCopyButtonText = () => {
    if (isCopying) return "Kopiere...";
    if (copySuccess === true) return "Kopiert ✓";
    if (copySuccess === false) return "Fehler";
    return "Copy";
  };

  const getCopyButtonVariant = (): "outline" | "ghost" => {
    if (copySuccess === true) return "ghost";
    return "outline";
  };

  return (
    <div className="flex gap-2 opacity-80" data-testid="message.actions">
      {/* Copy Button - Always available */}
      <Button
        variant={getCopyButtonVariant()}
        size="sm"
        onClick={handleCopy}
        disabled={isCopying}
        data-testid="message.copy"
        className={copySuccess === true ? "text-green-400" : undefined}
      >
        {getCopyButtonText()}
      </Button>

      {/* Regenerate Button - Only for assistant messages */}
      {role === "assistant" && onRegenerate && (
        <Button variant="ghost" size="sm" onClick={onRegenerate} data-testid="message.regenerate">
          🔄 Regenerate
        </Button>
      )}

      {/* Edit Button - Only for user messages */}
      {role === "user" && onEdit && (
        <Button variant="ghost" size="sm" onClick={onEdit} data-testid="message.edit">
          ✏️ Edit
        </Button>
      )}

      {/* Delete Button - Always available but with confirmation */}
      {onDelete && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          data-testid="message.delete"
          className="text-red-400 hover:text-red-300"
        >
          🗑️ Delete
        </Button>
      )}
    </div>
  );
}
