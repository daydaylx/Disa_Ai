import { lazy, Suspense } from "react";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useMediaQuery } from "@/hooks/useMediaQuery";

import { ChatInputBar } from "./ChatInputBar";
import { VirtualizedMessageList } from "./VirtualizedMessageList";

// Lazy-loaded mobile-specific components
const MobileChatComposer = lazy(() =>
  import("./MobileChatComposer").then((module) => ({
    default: module.MobileChatComposer,
  })),
);

interface MobileOptimizedChatProps {
  isMobile?: boolean;
  children?: React.ReactNode;
  // Chat props
  messages?: any[];
  onSend?: (message: string) => void;
  isLoading?: boolean;
  input?: string;
  onInputChange?: (value: string) => void;
}

export function MobileOptimizedChat({
  isMobile,
  children,
  messages = [],
  onSend,
  isLoading = false,
  input = "",
  onInputChange,
}: MobileOptimizedChatProps) {
  // Detect mobile devices
  const isMobileDevice = useMediaQuery("(max-width: 640px)") || isMobile;

  const handleSend = (message: string) => {
    onSend?.(message);
  };

  const handleDesktopSend = () => {
    onSend?.(input);
  };

  const handleChange = (value: string) => {
    onInputChange?.(value);
  };

  return (
    <div className="mobile-optimized-chat flex-1 flex flex-col min-h-0">
      {/* Chat Messages Area */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <VirtualizedMessageList messages={messages} />
      </div>

      {/* Mobile-optimized Composer */}
      {isMobileDevice ? (
        <ErrorBoundary>
          <Suspense fallback={<MobileComposerSkeleton />}>
            <MobileChatComposer onSend={handleSend} disabled={isLoading} />
          </Suspense>
        </ErrorBoundary>
      ) : (
        <ChatInputBar
          value={input}
          onChange={handleChange}
          onSend={handleDesktopSend}
          isLoading={isLoading}
        />
      )}

      {/* Mobile-specific features */}
      {isMobileDevice && <MobileFeatures />}

      {children}
    </div>
  );
}

// Skeleton loader for mobile composer
function MobileComposerSkeleton() {
  return (
    <div className="mobile-composer fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-3 animate-pulse">
      <div className="flex items-end gap-2 max-w-screen-lg mx-auto">
        <div className="flex-shrink-0 w-10 h-10 bg-surface-2 rounded-full" />
        <div className="flex-shrink-0 w-10 h-10 bg-surface-2 rounded-full" />
        <div className="flex-1 min-w-0">
          <div className="w-full h-12 bg-surface-2 rounded-full" />
        </div>
        <div className="flex-shrink-0 w-10 h-10 bg-surface-2 rounded-full" />
        <div className="flex-shrink-0 w-10 h-10 bg-surface-2 rounded-full" />
      </div>
    </div>
  );
}

// Mobile-specific features component
function MobileFeatures() {
  const handleQuickAction = (action: string) => () => {
    console.warn(`Mobile action not implemented: ${action}`);
  };

  const handleEmoji = (emoji: string) => () => {
    console.warn(`Emoji picker not implemented, selected: ${emoji}`);
  };

  return (
    <div className="mobile-features fixed bottom-20 left-4 right-4 z-40 space-y-2">
      {/* Quick Actions */}
      <div className="flex justify-center space-x-2">
        {["Kurz antworten", "Details", "Zusammenfassen"].map((action) => (
          <button
            key={action}
            className="bg-surface-2 text-text-secondary px-3 py-1.5 rounded-full text-xs hover:bg-surface-hover transition-colors"
            onClick={handleQuickAction(action)}
          >
            {action}
          </button>
        ))}
      </div>

      {/* Touch-friendly shortcuts */}
      <div className="flex justify-center space-x-2">
        {["💡", "🤔", "👍", "👎"].map((emoji) => (
          <button
            key={emoji}
            className="w-10 h-10 bg-surface-2 text-text-primary rounded-full flex items-center justify-center text-lg hover:bg-surface-hover transition-colors"
            onClick={handleEmoji(emoji)}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
