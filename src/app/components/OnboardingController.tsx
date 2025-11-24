import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ONBOARDING_COMPLETED_KEY = "disaai_onboarding_completed";
const ONBOARDING_SKIPPED_KEY = "disaai_onboarding_skipped";

/**
 * OnboardingController component that handles onboarding redirection
 * This component MUST be rendered inside a Router context
 */
export function OnboardingController() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hasCompleted = localStorage.getItem(ONBOARDING_COMPLETED_KEY);
    const hasSkipped = localStorage.getItem(ONBOARDING_SKIPPED_KEY);

    if (!hasCompleted && !hasSkipped) {
      // Redirect to welcome screen if not on a special route
      if (
        !location.pathname.startsWith("/welcome") &&
        !location.pathname.startsWith("/onboarding") &&
        !location.pathname.startsWith("/impressum") &&
        !location.pathname.startsWith("/datenschutz")
      ) {
        void navigate("/welcome", { replace: true });
      }
    }
  }, [navigate, location.pathname]);

  return null;
}
