import { Link, NavLink } from "react-router-dom";

import Logo from "./Logo";

export default function Header() {
  return (
    <header className="header-sticky sticky top-0 z-40">
      <div className="header-sticky bg-white/60 backdrop-blur-md border-b border-white/30">
        <div className="header-sticky mx-auto flex h-14 max-w-5xl items-center justify-between px-4 text-foreground">
          <Link to="/" className="header-sticky flex items-center gap-2">
            <Logo className="header-sticky h-6 w-6" />
            <span className="header-sticky font-semibold tracking-tight">Disa AI</span>
          </Link>
          <nav className="header-sticky flex items-center gap-3 text-sm">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${isActive ? "nav-pill--active" : "nav-pill"}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/chat"
              className={({ isActive }) =>
                `${isActive ? "nav-pill--active" : "nav-pill"}`
              }
            >
              Chat
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `${isActive ? "nav-pill--active" : "nav-pill"}`
              }
            >
              Einstellungen
            </NavLink>
            <Link
              to="/chat"
              className="header-sticky btn-primary px-3 py-1.5 rounded-[14px]"
            >
              Loslegen
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
