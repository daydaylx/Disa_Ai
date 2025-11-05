import { type ReactNode, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { BuildInfo } from "../../components/BuildInfo";
import { DesktopSidebar } from "../../components/layout/DesktopSidebar";
import { GlobalNav, NAV_ITEMS } from "../../components/layout/GlobalNav";
import SideDrawer from "../../components/navigation/SideDrawer";
import { NetworkBanner } from "../../components/NetworkBanner";
import { PWADebugInfo } from "../../components/pwa/PWADebugInfo";
import { PWAInstallPrompt } from "../../components/pwa/PWAInstallPrompt";
import { useIsMobile } from "../../hooks/useMediaQuery";
import { getAllConversations } from "../../lib/conversation-manager";
import { cn } from "../../lib/utils";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  return <AppShellLayout location={location}>{children}</AppShellLayout>;
}

interface AppShellLayoutProps {
  children: ReactNode;
  location: ReturnType<typeof useLocation>;
}

function AppShellLayout({ children, location }: AppShellLayoutProps) {
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [conversations, setConversations] = useState(() => getAllConversations());
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const activePath = useMemo(() => {
    return NAV_ITEMS.find((item) => location.pathname.startsWith(item.path))?.path ?? "/chat";
  }, [location.pathname]);

  // Refresh conversations when side drawer opens
  const handleSideDrawerOpen = () => {
    setConversations(getAllConversations());
    setIsSideDrawerOpen(true);
  };

  const handleSelectConversation = (id: string) => {
    // This would be implemented with proper routing
    setActiveConversationId(id);
    setIsSideDrawerOpen(false);
  };

  const handleDeleteConversation = (id: string) => {
    // This would be implemented with proper conversation management
    setConversations((prev) => prev.filter((conv) => conv.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  };

  const handleNewChat = () => {
    // This would be implemented with proper chat creation
    setActiveConversationId(null);
    setIsSideDrawerOpen(false);
  };

  return (
    <div
      className="relative flex min-h-[100dvh] flex-col bg-[var(--surface-neumorphic-base)] text-[var(--color-text-primary)]"
      style={{ minHeight: "calc(100dvh + var(--keyboard-offset, 0px))" }}
    >
      {isMobile ? <GlobalNav onMenuClick={handleSideDrawerOpen} /> : <DesktopSidebar />}

      <main
        id="main"
        key={location.pathname}
        className={cn(
          "min-h-0 flex flex-1 flex-col overflow-y-auto px-4 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-4",
          !isMobile && "ml-64",
        )}
      >
        <div className="mx-auto flex w-full max-w-2xl lg:max-w-4xl flex-1 flex-col">{children}</div>
      </main>

      {isMobile && (
        <>
          <footer className="border-t border-[var(--color-border-hairline)] bg-[var(--surface-neumorphic-floating)] px-4 py-4 text-xs text-[var(--color-text-secondary)]">
            <div className="mx-auto flex w-full max-w-2xl lg:max-w-4xl flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <div className="flex flex-col gap-1 sm:flex-row sm:gap-3">
                <span>Mobile Studio Preview</span>
                <span className="hidden sm:inline" aria-hidden="true">
                  ·
                </span>
                <a href="/datenschutz" className="text-[var(--color-text-link)] hover:underline">
                  Datenschutz
                </a>
              </div>
              <BuildInfo className="text-[11px] sm:text-xs" />
            </div>
          </footer>

          <NetworkBanner />
          <PWAInstallPrompt />
          {process.env.NODE_ENV === "development" && <PWADebugInfo />}

          <SideDrawer
            isOpen={isSideDrawerOpen}
            onClose={() => setIsSideDrawerOpen(false)}
            onNewChat={handleNewChat}
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={handleSelectConversation}
            onDeleteConversation={handleDeleteConversation}
          />
        </>
      )}
    </div>
  );
}
