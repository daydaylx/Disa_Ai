import * as React from "react";

import { SkipLink } from "./components/accessibility/SkipLink";
import Aurora from "./components/Aurora";
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
  const [route, nav] = useHashRoute();

  return (
    <ToastsProvider>
      <div className="app-bg bg-bg-primary relative min-h-[100dvh] text-foreground">
        <Aurora />
        <SkipLink targetId="main" />

        {/* Main layout container */}
        <div className="flex min-h-[100dvh] flex-col">
          <NetworkBanner />

          {/* Header */}
          <header className="sticky top-0 z-40 border-b border-neutral-900 bg-surface-primary/95 backdrop-blur">
            <div className="container flex h-16 items-center">
              <h1 className="text-xl font-semibold">Disa AI</h1>
            </div>
          </header>

          {/* Main content */}
          <main id="main" role="main" className="flex-1 pb-20">
            <ErrorBoundary>
              <React.Suspense
                fallback={
                  <div className="container flex items-center justify-center py-12">
                    <div className="glass rounded-lg p-6 text-center">
                      <div className="border-current border-t-transparent mx-auto h-8 w-8 animate-spin rounded-full border-4"></div>
                      <p className="mt-3 text-sm text-neutral-300">Lädt...</p>
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
