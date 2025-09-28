import { NavLink, Outlet } from "react-router-dom";

export function RootLayout() {
  return (
    <div className="flex h-screen flex-col">
      <nav aria-label="Main" className="bg-surface p-4 text-on-surface">
        <NavLink to="/" className="mr-4">
          Chat
        </NavLink>
        <NavLink to="/studio">Studio</NavLink>
      </nav>
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}
