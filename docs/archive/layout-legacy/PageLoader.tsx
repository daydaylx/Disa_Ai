/**
 * PageLoader Component
 *
 * Displays a centered loading indicator, consistent with the initial app load spinner.
 * Used as a Suspense fallback for lazy-loaded pages.
 */
export function PageLoader() {
  return (
    <div
      className="flex h-full min-h-[200px] flex-1 flex-col items-center justify-center gap-4"
      aria-label="Seite wird geladen"
    >
      <div
        className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-500"
        role="status"
      />
      <span className="text-sm text-gray-500">Laden...</span>
    </div>
  );
}
