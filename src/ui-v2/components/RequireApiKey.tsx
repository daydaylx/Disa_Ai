import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import { useSettings } from "../state/settings";

/** Optionaler Guard: wenn kein Key, leite zu /settings */
export const RequireApiKey: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const loc = useLocation();
  if (!settings.apiKey) {
    return <Navigate to="/settings" replace state={{ from: loc.pathname }} />;
  }
  return <>{children}</>;
};
