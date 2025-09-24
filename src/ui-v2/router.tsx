import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

import { RequireApiKey } from "./components/RequireApiKey";
import { Chat } from "./pages/Chat";
import { Settings } from "./pages/Settings";
import { Welcome } from "./pages/Welcome";

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/welcome" replace /> },
  { path: "/welcome", element: <Welcome /> },
  {
    path: "/chat",
    element: (
      <RequireApiKey>
        <Chat />
      </RequireApiKey>
    ),
  },
  { path: "/settings", element: <Settings /> },
  { path: "*", element: <Navigate to="/welcome" replace /> },
]);
