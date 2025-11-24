import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/ui/Button";
import { MaterialCard } from "@/ui/MaterialCard";
import { Typography } from "@/ui/Typography";

import { LiquidLogo } from "../../components/branding/LiquidLogo";

type TourStep = {
  id: string;
  title: string;
  description: string;
  target: string;
  icon: React.ReactNode;
  action?: () => void;
};

export default function GuidedTour() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const tourSteps: TourStep[] = [
    {
      id: "chat-interface",
      title: "Chat-Interface",
      description:
        "Lerne, wie du Nachrichten eingibst und mit Disa AI kommunizierst. Tippe einfach deine Frage oder Anweisung ein und sende sie mit Enter oder dem Senden-Button.",
      target: "Hier beginnt deine Reise mit Disa AI",
      icon: (
        <svg
          className="w-6 h-6 text-liquid-turquoise"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
    },
    {
      id: "model-selection",
      title: "Modellauswahl",
      description:
        "Wähle das passende KI-Modell für deine Aufgabe. Verschiedene Modelle haben unterschiedliche Stärken - einige sind besser für kreative Aufgaben, andere für präzise Antworten.",
      target: "Modell wechseln",
      icon: (
        <svg
          className="w-6 h-6 text-liquid-blue"
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
      ),
    },
    {
      id: "roles-system",
      title: "Rollen-System",
      description:
        "Nutze vorgefertigte Rollen, um Disa AI für spezifische Aufgaben zu konfigurieren. Ob du einen Wissenschaftler, Lehrer oder Kreativcoach brauchst - wir haben die passende Rolle für dich.",
      target: "Rolle auswählen",
      icon: (
        <svg
          className="w-6 h-6 text-liquid-purple"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      id: "settings-basics",
      title: "Einstellungen",
      description:
        "Passe grundlegende Einstellungen an, um Disa AI an deine Bedürfnisse anzupassen. Hier kannst du Sprache, Kreativitätsgrad und andere wichtige Parameter konfigurieren.",
      target: "Einstellungen öffnen",
      icon: (
        <svg
          className="w-6 h-6 text-liquid-indigo"
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
      ),
    },
    {
      id: "conversation-history",
      title: "Verlauf & Speicher",
      description:
        "Speichere deine Gespräche und greife später darauf zurück. Disa AI merkt sich deine Konversationen, sodass du sie jederzeit fortsetzen kannst.",
      target: "Verlauf anzeigen",
      icon: (
        <svg
          className="w-6 h-6 text-liquid-teal"
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
      ),
    },
  ];

  useEffect(() => {
    // Fortschritt berechnen
    setProgress(((currentStep + 1) / tourSteps.length) * 100);
  }, [currentStep, tourSteps.length]);

  const nextStep = useCallback(() => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Tour abgeschlossen
      void navigate("/", { state: { onboardingComplete: true } });
    }
  }, [currentStep, navigate, tourSteps.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const skipTour = useCallback(() => {
    void navigate("/", { state: { onboardingSkipped: true } });
  }, [navigate]);

  const currentTourStep = tourSteps[currentStep];

  return (
    <div className="min-h-screen-mobile flex flex-col items-center justify-center p-6 bg-gradient-to-b from-surface-base to-surface-1">
      {/* Liquid Branding Header */}
      <div className="mb-8 text-center">
        <LiquidLogo className="w-20 h-20 mx-auto mb-4" animate={true} />
        <Typography variant="h2" className="text-2xl font-bold text-text-primary">
          Geführte Tour
        </Typography>
        <Typography variant="body-lg" className="text-text-secondary mt-1">
          Schritt {currentStep + 1} von {tourSteps.length}
        </Typography>
      </div>

      {/* Fortschrittsbalken */}
      <div className="w-full max-w-md mb-8">
        <div className="h-2 bg-surface-inset rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-liquid-blue via-liquid-turquoise to-liquid-purple transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Aktueller Schritt */}
      <div className="w-full max-w-md">
        <MaterialCard variant="hero" className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-liquid-surface flex items-center justify-center">
                {currentTourStep?.icon}
              </div>
            </div>
            <div className="flex-1">
              <Typography variant="h3" className="text-xl font-semibold text-text-primary mb-2">
                {currentTourStep?.title}
              </Typography>
              <Typography variant="body-sm" className="text-text-secondary mb-4">
                {currentTourStep?.description}
              </Typography>
              <div className="bg-surface-inset rounded-lg p-3">
                <Typography variant="body-sm" className="text-text-secondary font-medium">
                  {currentTourStep?.target}
                </Typography>
              </div>
            </div>
          </div>
        </MaterialCard>
      </div>

      {/* Navigation */}
      <div className="w-full max-w-md mt-8 flex flex-col sm:flex-row gap-4">
        {currentStep > 0 && (
          <Button variant="secondary" onClick={prevStep} className="flex-1">
            Zurück
          </Button>
        )}

        <Button
          variant="primary"
          onClick={nextStep}
          className="flex-1 bg-gradient-to-r from-liquid-blue to-liquid-purple hover:from-liquid-indigo hover:to-liquid-magenta"
        >
          {currentStep < tourSteps.length - 1 ? "Weiter" : "Tour abschließen"}
        </Button>
      </div>

      {/* Skip Button */}
      <div className="mt-6">
        <Button
          variant="ghost"
          onClick={skipTour}
          className="text-text-secondary hover:text-text-primary"
        >
          Tour überspringen
        </Button>
      </div>
    </div>
  );
}
