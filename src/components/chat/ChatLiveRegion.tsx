import { memo } from "react";

interface ChatLiveRegionProps {
  message: string | null;
}

export const ChatLiveRegion = memo(function ChatLiveRegion({ message }: ChatLiveRegionProps) {
  if (!message) return null;

  return (
    <div aria-live="polite" aria-atomic="false" className="sr-only">
      {message}
    </div>
  );
});
