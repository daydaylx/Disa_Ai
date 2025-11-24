import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ONBOARDING_COMPLETED_KEY = "disaai_onboarding_completed";
const ONBOARDING_SKIPPED_KEY = "disaai_onboarding_skipped";

type OnboardingStep = "welcome" | "tour" | "custom" | "completed";

export function useOnboarding() {
  const navigate = useNavigate();
  const location = useLocation();
  const [onboardingStatus, setOnboardingStatus] = useState<OnboardingStep>("welcome");
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(false);

  // Check if this is the first visit
  useEffect(() => {
    const hasCompleted = localStorage.getItem(ONBOARDING_COMPLETED_KEY);
    const hasSkipped = localStorage.getItem(ONBOARDING_SKIPPED_KEY);

    if (!hasCompleted && !hasSkipped) {
      setIsFirstVisit(true);
      // Redirect to welcome screen if not on a special route
      if (
        !location.pathname.startsWith("/welcome") &&
        !location.pathname.startsWith("/onboarding") &&
        !location.pathname.startsWith("/impressum") &&
        !location.pathname.startsWith("/datenschutz")
      ) {
        void navigate("/welcome", { replace: true });
      }
    } else {
      setIsFirstVisit(false);
    }
  }, [navigate, location.pathname]);

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
    void navigate("/onboarding/tour");
  }, [navigate]);

  const startCustomSetup = useCallback(() => {
    setOnboardingStatus("custom");
    void navigate("/onboarding/custom");
  }, [navigate]);

  const goToWelcome = useCallback(() => {
    setOnboardingStatus("welcome");
    void navigate("/welcome");
  }, [navigate]);

  const finishTour = useCallback(() => {
    completeOnboarding();
    void navigate("/", { replace: true });
  }, [completeOnboarding, navigate]);

  const finishCustomSetup = useCallback(() => {
    completeOnboarding();
    void navigate("/", { replace: true });
  }, [completeOnboarding, navigate]);

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
