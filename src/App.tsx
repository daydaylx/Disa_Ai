import React from "react";

// AndroidNoticeBanner entfernt (Quarantäne)
import Aurora from "./components/Aurora";
import ErrorBoundary from "./components/ErrorBoundary";
import NetworkBanner from "./components/NetworkBanner";

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
  return { name: "chat", chatId: null };
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
    <div
      className="min-h-[100svh] relative bg-background text-foreground app-bg"
      style={{ ["--bottomnav-h" as unknown as string]: "0px" }}
    >
      <Aurora />
      <NetworkBanner />
      {/* AndroidNoticeBanner entfernt */}
      <header className="sticky top-0 z-40 w-full py-2">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-4">
          <div className="font-semibold">Disa AI</div>
          <nav className="tabs">
            <a
              href="#/chat"
              onClick={(e) => { e.preventDefault(); nav({ name: "chat", chatId: null }); }}
              className={`tab ${route.name === "chat" ? "tab--active" : ""}`}
              data-testid="nav-top-chat"
            >
              Chat
            </a>
            <a
              href="#/chats"
              onClick={(e) => { e.preventDefault(); nav({ name: "chats" }); }}
              className={`tab ${route.name === "chats" ? "tab--active" : ""}`}
              data-testid="nav-top-chats"
            >
              Unterhaltungen
            </a>
            <a
              href="#/quickstart"
              onClick={(e) => { e.preventDefault(); nav({ name: "quickstart" }); }}
              className={`tab ${route.name === "quickstart" ? "tab--active" : ""}`}
              data-testid="nav-top-quickstart"
            >
              Quickstart
            </a>
            <a
              href="#/settings"
              onClick={(e) => { e.preventDefault(); nav({ name: "settings" }); }}
              className={`tab ${route.name === "settings" ? "tab--active" : ""}`}
              data-testid="nav-top-settings"
            >
              Einstellungen
            </a>
          </nav>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-4xl p-4">
        <ErrorBoundary>
          <React.Suspense fallback={<div className="flex items-center justify-center py-12">
            <div className="glass rounded-lg p-6 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent"></div>
              <p className="mt-3 text-sm text-muted-foreground">Lädt...</p>
            </div>
          </div>}>
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
      <footer className="mt-6 pb-6">
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
    </div>
  );
}
