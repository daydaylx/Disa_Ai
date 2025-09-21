import * as React from "react";

import { SkipLink } from "./components/accessibility/SkipLink";
import { ErrorBoundary } from "./components/ErrorBoundary";
import BottomNav from "./components/layout/BottomNav";
import NetworkBanner from "./components/NetworkBanner";
import { ToastsProvider } from "./components/ui/Toast";
import { setupAndroidOptimizations } from "./lib/android/system";

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
  const [route, nav] = useHashRoute();

  // Setup Android optimizations on mount
  React.useEffect(() => {
    setupAndroidOptimizations();
  }, []);

  return (
    <ToastsProvider>
      <div className="app-shell relative min-h-[100dvh]">
        <SkipLink targetId="main" />

        {/* Main layout container */}
        <div className="flex min-h-[100dvh] flex-col">
          <NetworkBanner />

          {/* Header */}
          <header className="sticky top-0 z-40 border-b border-border-subtle bg-[rgba(17,26,38,0.94)] backdrop-blur">
            <div className="mx-auto flex h-16 w-full max-w-5xl items-center px-4">
              <h1 className="text-2xl font-semibold">Disa AI</h1>
            </div>
          </header>

          {/* Main content */}
          <main id="main" role="main" className="flex-1 pb-20">
            <ErrorBoundary>
              <React.Suspense
                fallback={
                  <div className="mx-auto flex w-full max-w-3xl items-center justify-center px-4 py-12">
                    <div className="card-elev1 w-full max-w-sm text-center">
                      <div className="border-accent-500 mx-auto h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
                      <p className="mt-3 text-sm text-text-secondary">Lädt...</p>
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

          {/* Bottom navigation */}
          <BottomNav />
        </div>
      </div>
    </ToastsProvider>
  );
}
