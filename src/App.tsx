import * as React from "react";

import { SkipLink } from "./components/accessibility/SkipLink";
// AndroidNoticeBanner entfernt (Quarantäne)
import Aurora from "./components/Aurora";
import PremiumEffects from "./components/effects/PremiumEffects";
import { ErrorBoundary } from "./components/ErrorBoundary";
import BottomNav from "./components/layout/BottomNav";
import NetworkBanner from "./components/NetworkBanner";
import { ToastsProvider } from "./components/ui/Toast";

// Code-splitting für bessere Performance
const ChatsView = React.lazy(() => import("./views/ChatsView"));
const ChatView = React.lazy(() => import("./views/ChatView"));
const QuickStartView = React.lazy(() => import("./views/QuickStartView"));
const SettingsView = React.lazy(() => import("./views/SettingsView"));

type Route = { name: "chat" | "settings" | "chats" | "quickstart"; chatId?: string | null };

function parseHash(): Route {
  const h = (location.hash || "#").slice(1); // remove '#'
  const parts = h.split("/").filter(Boolean); // ["chat", "<id>"]
  const [seg, arg] = parts;
  if (seg === "settings") return { name: "settings" };
  if (seg === "chats") return { name: "chats" };
  if (seg === "quickstart") return { name: "quickstart" };
  if (seg === "chat") return { name: "chat", chatId: arg ?? null };
  // Default to quickstart for mobile-first experience
  return { name: "quickstart" };
}

function useHashRoute(): [Route, (r: Route) => void] {
  const [route, setRoute] = React.useState<Route>(() => parseHash());

  React.useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const nav = (r: Route) => {
    let target = "#/chat";
    if (r.name === "settings") target = "#/settings";
    else if (r.name === "chats") target = "#/chats";
    else if (r.name === "quickstart") target = "#/quickstart";
    else if (r.name === "chat") target = r.chatId ? `#/chat/${r.chatId}` : "#/chat";
    if (location.hash !== target) location.hash = target;
    setRoute(r);
  };

  return [route, nav];
}

export default function App() {
  // Activate neon theme by default for mobile
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", "neon");
  }, []);

  const [route, nav] = useHashRoute();

  return (
    <ToastsProvider>
      <div className="app-bg parallax-container relative min-h-[100svh] bg-bg-primary text-foreground">
        <Aurora />
        <PremiumEffects />
        <SkipLink targetId="main" />
        <div className="parallax-near relative z-10 flex min-h-[100svh] flex-col">
          <NetworkBanner />
          {/* AndroidNoticeBanner entfernt */}
          <header className="sticky top-0 z-40 w-full py-3">
            <div className="mx-auto flex w-full max-w-4xl items-center justify-center px-4">
              <h1 className="text-xl font-semibold">Disa AI</h1>
            </div>
          </header>

          <main id="main" role="main" className="relative mx-auto w-full max-w-4xl flex-1 p-4">
            <ErrorBoundary>
              <React.Suspense
                fallback={
                  <div className="flex items-center justify-center py-12">
                    <div className="rounded-lg p-6 text-center glass">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent"></div>
                      <p className="mt-3 text-sm text-muted-foreground">Lädt...</p>
                    </div>
                  </div>
                }
              >
                {route.name === "settings" ? (
                  <SettingsView />
                ) : route.name === "chats" ? (
                  <ChatsView onOpen={(id) => nav({ name: "chat", chatId: id })} />
                ) : route.name === "quickstart" ? (
                  <QuickStartView />
                ) : (
                  <ChatView convId={route.chatId ?? null} />
                )}
              </React.Suspense>
            </ErrorBoundary>
          </main>

          {/* Build-/Umgebungsdiagnose: Version + manueller Reload */}
          <footer className="mt-6 pb-20">
            <div className="mx-auto flex w-full max-w-4xl items-center justify-end gap-3 px-4 text-xs opacity-80">
              <span className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5">
                v {import.meta.env.VITE_APP_VERSION ?? "dev"}
              </span>
              <button
                type="button"
                className="btn-ghost !min-h-0 px-2 py-1"
                onClick={() => {
                  try {
                    window.location.reload();
                  } catch {
                    /* noop */
                  }
                }}
                aria-label="Neu laden"
              >
                Neu laden
              </button>
            </div>
          </footer>

          <BottomNav />
        </div>
      </div>
    </ToastsProvider>
  );
}
