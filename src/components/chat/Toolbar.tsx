import React from "react";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";

export interface ToolbarProps {
  title?: string;
  onMenu?: () => void;
  onSettings?: () => void;
  onModels?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ title = "Chat", onMenu, onSettings, onModels }) => {
  return (
    <header className="chat-header px-3 py-2">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" aria-label="Menü" onClick={onMenu}>
            <Icon name="menu" />
          </Button>
          <h1 className="text-base font-semibold">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" aria-label="Modelle" onClick={onModels}>
            <Icon name="info" />
          </Button>
          <Button variant="ghost" size="sm" aria-label="Einstellungen" onClick={onSettings}>
            <Icon name="settings" />
          </Button>
        </div>
      </div>
    </header>
  );
};
