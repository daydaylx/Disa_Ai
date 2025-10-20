import { AlertTriangle, Smartphone } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface MobileOnlyGateProps {
  children: React.ReactNode;
}

type GateState = "unknown" | "allowed" | "blocked";

function determineSupport() {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return "allowed";
  }

  // Development mode: always allow access for debugging
  if (import.meta.env.DEV) {
    console.warn("Development mode: allowing access for debugging");
    return "allowed";
  }

  const uaData = (
    navigator as Navigator & { userAgentData?: { mobile: boolean; platform: string } }
  ).userAgentData;
  const userAgent = navigator.userAgent || "";

  const matchesMedia =
    typeof window.matchMedia === "function" ? window.matchMedia.bind(window) : undefined;
  const prefersCoarsePointer = matchesMedia ? matchesMedia("(pointer: coarse)").matches : false;
  const matchesMobileBreakpoint = matchesMedia
    ? matchesMedia("(max-width: 900px)").matches
    : window.innerWidth <= 900;

  const isMobileFormFactor =
    (uaData?.mobile ?? false) ||
    /mobi|android/i.test(userAgent) ||
    prefersCoarsePointer ||
    matchesMobileBreakpoint;

  const isDesktopPlatform = (() => {
    const platform = uaData?.platform?.toLowerCase() ?? "";
    if (platform) {
      return ["windows", "mac", "macos", "linux", "cros"].some((value) => platform.includes(value));
    }

    return /windows|macintosh|mac os|linux|cros|x11/i.test(userAgent);
  })();

  if (isDesktopPlatform) {
    return "allowed";
  }

  // Allow all mobile devices and tablet form factors for testing purposes
  return isMobileFormFactor ? "allowed" : "blocked";
}

export function MobileOnlyGate({ children }: MobileOnlyGateProps) {
  const [{ state, reason }, setState] = useState<{ state: GateState; reason?: string }>({
    state: "unknown",
  });

  const isTestRun = useMemo(() => {
    try {
      return import.meta.env.MODE === "test";
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (isTestRun) {
      setState({ state: "allowed" });
      return;
    }

    function evaluate() {
      const result = determineSupport();
      setState({
        state: result,
        reason:
          result === "blocked"
            ? "Diese Version ist nur für Android-Smartphones optimiert."
            : undefined,
      });
    }

    evaluate();
    const resizeListener = () => evaluate();
    window.addEventListener("resize", resizeListener);

    return () => {
      window.removeEventListener("resize", resizeListener);
    };
  }, [isTestRun]);

  if (state === "allowed") {
    return <>{children}</>;
  }

  if (state === "unknown") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-0 text-text-0">
        <div className="max-w-sm rounded-lg border border-border bg-surface-1 text-center">
          <div className="flex flex-col items-center gap-4 px-6 py-8">
            <Smartphone className="h-8 w-8 text-text-1" />
            <p className="text-text-1">Geräteprüfung läuft…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-0 px-6 py-10 text-text-0">
      <div className="max-w-md rounded-lg border border-border bg-surface-1 text-center">
        <div className="relative flex flex-col items-center gap-5 px-8 py-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface-2 text-text-0">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-text-0">Nur auf Android verfügbar</h1>
            <p className="text-sm text-text-1">
              Dieses Interface wurde speziell für Android-Smartphones entwickelt. Bitte öffne die
              App auf einem Android-Gerät, um fortzufahren.
            </p>
          </div>

          <div className="w-full rounded-lg border border-border bg-surface-2 p-4 text-sm text-text-1">
            <p>Nächste Schritte:</p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-left text-text-1">
              <li>QR-Code oder Link auf deinem Android-Gerät öffnen.</li>
              <li>Im Chrome- oder Edge-Browser die Seite laden.</li>
              <li>Optional als PWA installieren, um Vollbild zu erhalten.</li>
            </ol>
          </div>

          {reason ? <p className="text-text-1/70 text-xs">{reason}</p> : null}
        </div>
      </div>
    </div>
  );
}
