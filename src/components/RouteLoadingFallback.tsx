import { Loader2 } from "lucide-react";

interface RouteLoadingFallbackProps {
  message?: string;
}

export function RouteLoadingFallback({ message = "Lädt..." }: RouteLoadingFallbackProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center space-y-4 p-8">
      <div className="rounded-xl bg-white/5 p-4 backdrop-blur-sm">
        <Loader2 className="h-8 w-8 animate-spin text-accent-500" />
      </div>
      <p className="text-sm text-white/60">{message}</p>
    </div>
  );
}
