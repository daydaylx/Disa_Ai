import React from "react";
import { Logo } from "./Logo";
import { Button } from "./Button";
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[rgba(11,11,14,0.75)] backdrop-blur-xs">
      <div className="container-page h-16 flex items-center justify-between">
        <Logo size="md" withWordmark />
        <div className="flex items-center gap-2">
          <Button variant="ghost">Changelog</Button>
          <Button>Neu starten</Button>
        </div>
      </div>
    </header>
  );
}
