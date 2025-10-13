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

  const isAndroidPlatform =
    uaData?.platform?.toLowerCase() === "android" || /android/i.test(userAgent);

  const isMobileFormFactor =
    (uaData?.mobile ?? false) ||
    /mobi|android/i.test(userAgent) ||
    prefersCoarsePointer ||
    matchesMobileBreakpoint;

  return isAndroidPlatform && isMobileFormFactor ? "allowed" : "blocked";
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
      <div className="flex min-h-screen items-center justify-center bg-[#04070f] text-white">
        <div className="glass-card overlay-soft max-w-sm text-center">
          <div className="flex flex-col items-center gap-4 px-6 py-8">
            <Smartphone className="h-8 w-8 text-white/70" />
            <p className="text-white/70">Geräteprüfung läuft…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#04070f] px-6 py-10 text-white">
      <div className="glass-card overlay-soft max-w-md text-center">
        <div className="relative flex flex-col items-center gap-5 px-8 py-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/90 shadow-glass-soft">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-white">Nur auf Android verfügbar</h1>
            <p className="text-sm text-white/70">
              Dieses Interface wurde speziell für Android-Smartphones entwickelt. Bitte öffne die
              App auf einem Android-Gerät, um fortzufahren.
            </p>
          </div>

          <div className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
            <p>Nächste Schritte:</p>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-left text-white/70">
              <li>QR-Code oder Link auf deinem Android-Gerät öffnen.</li>
              <li>Im Chrome- oder Edge-Browser die Seite laden.</li>
              <li>Optional als PWA installieren, um Vollbild zu erhalten.</li>
            </ol>
          </div>

          {reason ? <p className="text-xs text-white/40">{reason}</p> : null}
        </div>
      </div>
    </div>
  );
}
