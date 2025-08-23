export default function Logo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className}>
      <defs>
        <radialGradient id="g" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="1" />
          <stop offset="60%" stopColor="#22d3ee" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#111827" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="28" fill="url(#g)" />
      <circle cx="28" cy="24" r="6" fill="#fff" fillOpacity="0.7" />
      <circle cx="40" cy="36" r="4" fill="#fff" fillOpacity="0.35" />
    </svg>
  );
}
