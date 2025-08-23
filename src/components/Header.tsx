import React from "react";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { Link, NavLink } from "react-router-dom";
import { features } from "../config/features";
import { usePersonaSelection } from "../config/personas";
import { Badge } from "./Badge";

export function Header() {
  const { active } = usePersonaSelection();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[rgba(11,11,14,0.75)] backdrop-blur-xs">
      <div className="container-page h-16 flex items-center justify-between">
        <Link to="/" aria-label="Disa AI – Start" className="flex items-center gap-3">
          <Logo size="md" withWordmark />
          {/* Aktive Persona kurz anzeigen (nicht klickbar, nur Info) */}
          {active && (
            <span className="hidden sm:inline-block">
              <Badge tone="purple">
                <span className="max-w-[220px] inline-block truncate align-middle" title={active.label}>
                  {active.label}
                </span>
              </Badge>
            </span>
          )}
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
            <NavLink to="/settings" title="Einstellungen (API-Key, Modell, Persona)">
              {({ isActive }) => (
                <Button variant={isActive ? "primary" : "ghost"}>Einstellungen</Button>
              )}
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
