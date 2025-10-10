import { Link, useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const tabs = [
  {
    to: "/",
    label: "Chat",
    ariaLabel: "Zur Chat-Seite navigieren",
    testId: "nav-bottom-chat",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    to: "/models",
    label: "Modelle",
    ariaLabel: "Zur Modellauswahl navigieren",
    testId: "nav-bottom-models",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    to: "/settings",
    label: "Einst.",
    ariaLabel: "Zu den Einstellungen navigieren",
    testId: "nav-bottom-settings",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
];

export function NavBar() {
  const location = useLocation();

  return (
    <nav className="p-2">
      <div className="glass-card-secondary grid grid-cols-3 gap-2 rounded-lg p-2">
        {tabs.map((t) => {
          const active = location.pathname === t.to;
          const linkClasses = twMerge(
            "group relative flex flex-col items-center justify-center space-y-1",
            "rounded-md px-3 py-2 transition-all duration-200 ease-in-out",
            "hover:scale-[1.02] active:scale-95",
            active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white",
          );

          return (
            <Link
              key={t.to}
              to={t.to}
              data-testid={t.testId}
              className={linkClasses}
              aria-label={t.ariaLabel}
              aria-current={active ? "page" : undefined}
            >
              <div
                className={twMerge(
                  "relative transition-all duration-200",
                  active ? "scale-110" : "group-hover:scale-105",
                )}
              >
                {t.icon}
              </div>
              <span className="text-xs font-medium leading-none">{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
