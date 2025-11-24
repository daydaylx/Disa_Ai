import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { MaterialCard } from "@/ui/MaterialCard";
import { Typography } from "@/ui/Typography";

import { LiquidLogo } from "../../components/branding/LiquidLogo";

export function WelcomeScreen() {
  const navigate = useNavigate();

  const handleStartTour = useCallback(() => {
    void navigate("/onboarding/tour");
  }, [navigate]);

  const handleQuickStart = useCallback(() => {
    // Standard-Rolle auswählen und zum Chat weiterleiten
    void navigate("/", { state: { quickStart: true } });
  }, [navigate]);

  const handleCustomSetup = useCallback(() => {
    void navigate("/onboarding/custom");
  }, [navigate]);

  return (
    <div className="min-h-screen-mobile flex flex-col items-center justify-center p-6 bg-gradient-to-b from-surface-base to-surface-1">
      {/* Liquid Branding Header */}
      <div className="mb-12 text-center">
        <LiquidLogo className="w-24 h-24 mx-auto mb-4" />
        <Typography variant="h1" className="text-3xl font-bold text-text-primary">
          Willkommen bei Disa AI
        </Typography>
        <Typography variant="body-lg" className="text-text-secondary mt-2">
          Liquid Intelligence für deine Ideen
        </Typography>
      </div>

      {/* Optionen-Karten */}
      <div className="w-full max-w-md space-y-4">
        <MaterialCard
          variant="hero"
          className="p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300"
          onClick={handleQuickStart}
        >
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-accent-primary/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-accent-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <Typography variant="body-lg" className="font-semibold text-text-primary">
                Schnellstart
              </Typography>
              <Typography variant="body-sm" className="text-text-secondary">
                Direkt loslegen mit einer Standard-Konfiguration
              </Typography>
            </div>
          </div>
        </MaterialCard>

        <MaterialCard
          variant="hero"
          className="p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300"
          onClick={handleStartTour}
        >
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-accent-primary/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-accent-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>
            <div>
              <Typography variant="body-lg" className="font-semibold text-text-primary">
                Geführte Tour
              </Typography>
              <Typography variant="body-sm" className="text-text-secondary">
                Schritt-für-Schritt Einführung in alle Funktionen
              </Typography>
            </div>
          </div>
        </MaterialCard>

        <MaterialCard
          variant="hero"
          className="p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300"
          onClick={handleCustomSetup}
        >
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-accent-primary/20 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-accent-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <Typography variant="body-lg" className="font-semibold text-text-primary">
                Benutzerdefiniert
              </Typography>
              <Typography variant="body-sm" className="text-text-secondary">
                Vollständige Kontrolle über alle Einstellungen
              </Typography>
            </div>
          </div>
        </MaterialCard>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <Typography variant="body-sm" className="text-text-secondary">
          Bereits Nutzer?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-accent-primary hover:underline focus:outline-none focus:ring-2 focus:ring-accent-primary rounded"
          >
            Direkt zum Chat
          </button>
        </Typography>
      </div>
    </div>
  );
}
