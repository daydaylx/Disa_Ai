import React from "react";
import { NavLink } from "react-router-dom";

const base = "flex-1 text-center py-2 tap pill bg-white/5 mx-1";

export const TabBar: React.FC = () => {
  return (
    <nav className="tabbar safe-pad safe-bottom sticky bottom-0 z-40 py-2">
      <div className="glass card-round p-2 flex">
        <NavLink to="/" end className={({isActive}) => `${base} ${isActive ? "btn-glow text-black" : "text-white/90"}`}>
          Chat
        </NavLink>
        <NavLink to="/settings" className={({isActive}) => `${base} ${isActive ? "btn-glow text-black" : "text-white/90"}`}>
          Einstellungen
        </NavLink>
      </div>
    </nav>
  );
};
export default TabBar;
