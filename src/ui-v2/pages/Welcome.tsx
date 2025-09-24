import React from "react";
import { useNavigate } from "react-router-dom";

export const Welcome: React.FC = () => {
  const nav = useNavigate();
  const handleStart = () => {
    try {
      sessionStorage.setItem("disaai.welcome.dismissed", "1");
    } catch (err) {
      console.warn("sessionStorage not available:", err);
    }
    void nav("/chat");
  };

  return (
    <div className="safe-px flex min-h-dvh items-center justify-center bg-gradient-to-b from-[#1B1337] via-[#1a1442] to-bg p-4 text-white">
      <a href="#welcome-main" className="skip-link">
        Zum Inhalt springen
      </a>
      <div id="welcome-main" className="card w-full max-w-sm p-6" tabIndex={-1}>
        <div className="mb-6">
          <p className="text-xs uppercase tracking-widest text-white/60">Willkommen</p>
          <h1 className="mt-1 text-3xl font-extrabold">
            Triff <span className="text-violet-400">Disa&nbsp;AI</span>
          </h1>
          <p className="mt-2 text-sm text-white/70">
            Schneller, sauberer Code-Chat. Starte eine Session oder öffne die Einstellungen.
          </p>
        </div>

        <div className="relative mb-6 h-40" aria-hidden="true">
          <div className="absolute inset-0 animate-pulse-soft rounded-3xl bg-gradient-to-tr from-violet-600/40 to-fuchsia-500/30 blur-2xl" />
          <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-[0_0_40px_0_rgba(167,139,250,0.6)]">
            <div className="h-16 w-16 animate-pulse rounded-full bg-accent-400/30" />
          </div>
        </div>

        <div className="grid gap-3">
          <button
            onClick={handleStart}
            className="btn-primary rounded-full"
            aria-label="Loslegen und zum Chat wechseln"
          >
            Get Started
          </button>
          <a
            href="/settings"
            className="btn-ghost flex items-center justify-center rounded-full text-sm text-white/80"
            aria-label="Zu den Einstellungen wechseln"
          >
            Zu den Einstellungen
          </a>
        </div>
      </div>
    </div>
  );
};
