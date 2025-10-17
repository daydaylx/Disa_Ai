import React from "react";

import { Glass } from "./Glass";

interface ChatHistoryItem {
  id: string;
  title: string;
  timestamp: string;
  model: string;
}

interface ChatHistoryProps {
  items: ChatHistoryItem[];
  onItemSelect: (item: ChatHistoryItem) => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ items, onItemSelect }) => {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <Glass
          key={item.id}
          variant="subtle"
          className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-[rgba(255,255,255,0.05)]"
          onClick={() => onItemSelect(item)}
        >
          <div className="font-medium text-[var(--fg)]">{item.title}</div>
          <div className="mt-1 flex justify-between text-xs text-[var(--fg-dim)]">
            <span>{item.timestamp}</span>
            <span>{item.model}</span>
          </div>
        </Glass>
      ))}
    </div>
  );
};
