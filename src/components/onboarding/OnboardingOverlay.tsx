import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { analytics } from "@/lib/analytics";
import { Bot, Shield, Sparkles } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { MaterialCard, PrimaryButton } from "@/ui";

interface OnboardingOverlayProps {
  onComplete: () => void;
}

export function OnboardingOverlay({ onComplete }: OnboardingOverlayProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    analytics.trackOnboardingStep(step, "view");
  }, [step]);

  const steps = [
    {
      title: "Willkommen bei Disa AI",
      description:
        "Dein professioneller, privater KI-Assistent. Lokal im Browser, sicher und schnell.",
      icon: Sparkles,
      color: "text-brand",
      bgColor: "bg-brand/10",
    },
    {
      title: "Wie es funktioniert",
      description:
        "Disa AI verbindet sich direkt mit OpenRouter. Deine Daten bleiben auf deinem Gerät. Wir speichern nichts in der Cloud.",
      icon: Bot,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Sicher & Fair",
      description:
        "Du hast die Kontrolle. Nutze den eingebauten Jugendschutz oder deinen eigenen API-Key für maximale Leistung.",
      icon: Shield,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
  ];

  const currentStep = steps[step] || steps[0]!;
  const Icon = currentStep.icon;

  const handleNext = () => {
    analytics.trackOnboardingStep(step, "complete");
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      analytics.track("onboarding_completed");
      onComplete();
    }
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-base/80 backdrop-blur-md p-4">
      <MaterialCard
        variant="raised"
        className="w-full max-w-sm p-6 space-y-6 animate-in fade-in zoom-in-95 duration-300"
      >
        <div className="flex justify-center">
          <div
            className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-raise",
              currentStep.bgColor,
            )}
          >
            <Icon className={cn("w-8 h-8", currentStep.color)} />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-text-primary">{currentStep.title}</h2>
          <p className="text-text-secondary leading-relaxed">{currentStep.description}</p>
        </div>

        <div className="flex gap-1 justify-center py-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === step ? "w-6 bg-brand" : "w-1.5 bg-surface-3",
              )}
            />
          ))}
        </div>

        <PrimaryButton onClick={handleNext} className="w-full py-6 text-lg shadow-brandGlow">
          {step === steps.length - 1 ? "Loslegen" : "Weiter"}
        </PrimaryButton>
      </MaterialCard>
    </div>,
    document.body,
  );
}
