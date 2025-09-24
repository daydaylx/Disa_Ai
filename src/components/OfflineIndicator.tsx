import { useOnlineStatus } from "../hooks/useOnlineStatus";

export default function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  return (
    <div
      className={`fixed bottom-24 right-4 z-50 transform rounded-full px-4 py-2 text-white shadow-lg transition-all duration-300 ease-out ${
        isOnline
          ? "translate-y-2 scale-0 bg-green-500 opacity-0"
          : "translate-y-0 scale-100 bg-red-500 opacity-100"
      }`}
      data-testid="pwa.offlineIndicator"
      aria-live="polite"
      role="status"
    >
      <p className="text-sm font-medium">{isOnline ? "Online" : "Offline"}</p>
    </div>
  );
}
