import { Cpu, MessageSquare, PlusSquare, Settings } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

import { Badge, Button } from "../../components/ui";

interface NavigationItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const navigationItems: NavigationItem[] = [
  {
    to: "/chat",
    label: "Chat",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    to: "/models",
    label: "Models",
    icon: <Cpu className="h-5 w-5" />,
  },
  {
    to: "/settings",
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

function MiniModelPicker() {
  return (
    <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1.5">
      <Cpu className="h-4 w-4" />
      <span className="hidden sm:inline">GPT-4</span>
      <span className="sm:hidden">Model</span>
    </Badge>
  );
}

function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 dark:border-neutral-700 dark:bg-neutral-900">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">Disa AI</h1>
      </div>

      <div className="flex items-center gap-3">
        <MiniModelPicker />
        <Button size="sm" aria-label="New conversation">
          <PlusSquare className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">New</span>
        </Button>
      </div>
    </header>
  );
}

function BottomTabs() {
  return (
    <nav
      className="flex border-t border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900 md:hidden"
      aria-label="Bottom navigation"
    >
      {navigationItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors ${
              isActive
                ? "text-accent-500 dark:text-accent-300"
                : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            }`
          }
        >
          {item.icon}
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

function TopTabs() {
  return (
    <nav
      className="hidden border-b border-neutral-200 bg-white px-4 dark:border-neutral-700 dark:bg-neutral-900 md:block"
      aria-label="Top navigation"
    >
      <div className="flex gap-1">
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-t-lg px-4 py-3 text-sm transition-colors ${
                isActive
                  ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
                  : "dark:hover:bg-neutral-800/50 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export function AppShell() {
  return (
    <div className="flex h-screen flex-col bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white">
      <Header />
      <TopTabs />

      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>

      <BottomTabs />
    </div>
  );
}
