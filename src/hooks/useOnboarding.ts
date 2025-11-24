import { useCallback, useState } from "react";

const ONBOARDING_COMPLETED_KEY = "disaai_onboarding_completed";
const ONBOARDING_SKIPPED_KEY = "disaai_onboarding_skipped";

type OnboardingStep = "welcome" | "tour" | "custom" | "completed";

export function useOnboarding() {
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStep>("welcome");
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(() => {
    const hasCompleted = localStorage.getItem(ONBOARDING_COMPLETED_KEY);
    const hasSkipped = localStorage.getItem(ONBOARDING_SKIPPED_KEY);
    return !hasCompleted && !hasSkipped;
  });

  const completeOnboarding = useCallback(() => {
    localStorage.setItem(ONBOARDING_COMPLETED_KEY, "true");
    setOnboardingStatus("completed");
    setIsFirstVisit(false);
  }, []);

  const skipOnboarding = useCallback(() => {
    localStorage.setItem(ONBOARDING_SKIPPED_KEY, "true");
    setOnboardingStatus("completed");
    setIsFirstVisit(false);
  }, []);

  const startTour = useCallback(() => {
    setOnboardingStatus("tour");
  }, []);

  const startCustomSetup = useCallback(() => {
    setOnboardingStatus("custom");
  }, []);

  const goToWelcome = useCallback(() => {
    setOnboardingStatus("welcome");
  }, []);

  const finishTour = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  const finishCustomSetup = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  return {
    isFirstVisit,
    onboardingStatus,
    completeOnboarding,
    skipOnboarding,
    startTour,
    startCustomSetup,
    goToWelcome,
    finishTour,
    finishCustomSetup,
  };
}
