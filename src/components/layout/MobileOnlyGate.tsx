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

  // Mobile-only: Block desktop platforms and only allow mobile form factors
  if (isDesktopPlatform) {
    return "blocked";
  }

  // Allow mobile devices and tablet form factors
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
      <div className="bg-surface-0 text-text-0 flex min-h-screen items-center justify-center">
        <div className="border-border bg-surface-1 max-w-sm rounded-lg border text-center">
          <div className="flex flex-col items-center gap-4 px-6 py-8">
            <Smartphone className="text-text-1 h-8 w-8" />
            <p className="text-text-1">Geräteprüfung läuft…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-0 text-text-0 flex min-h-screen items-center justify-center px-6 py-10">
      <div className="border-border bg-surface-1 max-w-md rounded-lg border text-center">
        <div className="relative flex flex-col items-center gap-5 px-8 py-10">
          <div className="border-border bg-surface-2 text-text-0 flex h-16 w-16 items-center justify-center rounded-full border">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-text-0 text-xl font-semibold">Nur auf Mobilgeräten verfügbar</h1>
            <p className="text-text-1 text-sm">
              Dieses Interface wurde speziell für Smartphones und Tablets entwickelt. Bitte öffne
              die App auf einem Mobilgerät, um fortzufahren.
            </p>
          </div>

          <div className="border-border bg-surface-2 text-text-1 w-full rounded-lg border p-4 text-sm">
            <p>Nächste Schritte:</p>
            <ol className="text-text-1 mt-3 list-decimal space-y-2 pl-5 text-left">
              <li>QR-Code oder Link auf deinem Mobilgerät öffnen.</li>
              <li>Im mobilen Browser die Seite laden.</li>
              <li>Optional als PWA installieren, um Vollbild zu erhalten.</li>
            </ol>
          </div>

          {reason ? <p className="text-text-1/70 text-xs">{reason}</p> : null}
        </div>
      </div>
    </div>
  );
}
