import { Link, NavLink } from "react-router-dom";

import Logo from "./Logo";

export default function Header() {
  return (
    <header className="sticky top-0 z-40">
      <div className="backdrop-blur bg-black/30 border-b border-white/10">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <span className="font-semibold tracking-tight">Disa AI</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
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
              className="rounded-xl bg-violet-600/90 px-3 py-1.5 font-medium text-white shadow-sm hover:bg-violet-500 active:scale-[0.99] transition"
            >
              Loslegen
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
