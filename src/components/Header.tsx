import React from "react";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { Link, NavLink } from "react-router-dom";
import { features } from "../config/features";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[rgba(11,11,14,0.75)] backdrop-blur-xs">
      <div className="container-page h-16 flex items-center justify-between">
        <Link to="/" aria-label="Disa AI – Start">
          <Logo size="md" withWordmark />
        </Link>
        <nav className="flex items-center gap-2">
          {features.chat && (
            <NavLink to="/chat">
              {({ isActive }) => (
                <Button variant={isActive ? "primary" : "ghost"}>Chat</Button>
              )}
            </NavLink>
          )}
          {features.settings && (
            <NavLink to="/settings">
              {({ isActive }) => (
                <Button variant={isActive ? "primary" : "ghost"}>Einstellungen</Button>
              )}
            </NavLink>
          )}
          {/* Deaktiviert: Changelog / Neu starten */}
        </nav>
      </div>
    </header>
  );
}
