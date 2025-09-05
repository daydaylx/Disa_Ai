import { Link, NavLink } from "react-router-dom";

import Logo from "./Logo";

export default function Header() {
  return (
    <header className="header-sticky sticky top-0 z-40">
      <div className="header-sticky border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="header-sticky mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link to="/" className="header-sticky flex items-center gap-2">
            <Logo className="header-sticky h-6 w-6" />
            <span className="header-sticky font-semibold tracking-tight">Disa AI</span>
          </Link>
          <nav className="header-sticky flex items-center gap-4 text-sm">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-white ${isActive ? "text-white" : "text-zinc-400"}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/chat"
              className={({ isActive }) =>
                `hover:text-white ${isActive ? "text-white" : "text-zinc-400"}`
              }
            >
              Chat
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `hover:text-white ${isActive ? "text-white" : "text-zinc-400"}`
              }
            >
              Einstellungen
            </NavLink>
            <Link
              to="/chat"
              className="header-sticky rounded-xl bg-violet-600/90 px-3 py-1.5 font-medium text-white shadow-sm transition hover:bg-violet-500 active:scale-[0.99]"
            >
              Loslegen
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
