import { PageSkeleton } from "./feedback/PageSkeleton";

interface RouteLoadingFallbackProps {
  message?: string;
}

export function RouteLoadingFallback({ message }: RouteLoadingFallbackProps) {
  return <PageSkeleton message={message} />;
}