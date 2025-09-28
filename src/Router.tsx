import React from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";

import { colors } from "./styles/design-tokens";

// Ultra-simple fallback components with minimal styling
function FallbackChat() {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.neutral[900],
        color: "white",
        padding: "2rem",
      }}
    >
      <div
        style={{
          border: `1px solid ${colors.neutral[600]}`,
          borderRadius: "8px",
          padding: "2rem",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Disa AI</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            data-testid="composer-input"
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: "8px",
              border: `1px solid ${colors.neutral[500]}`,
              backgroundColor: colors.neutral[700],
              color: "white",
            }}
            placeholder="Type your message..."
          />
          <button
            data-testid="composer-send"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: colors.accent[500],
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function FallbackSettings() {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.neutral[900],
        color: "white",
        padding: "2rem",
      }}
    >
      <div
        style={{
          border: `1px solid ${colors.neutral[600]}`,
          borderRadius: "8px",
          padding: "2rem",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Settings</h1>
        <p>Settings page loaded successfully.</p>
      </div>
    </div>
  );
}

// Direct usage of fallback components - no lazy loading, no complex shells
const ChatApp = FallbackChat;
const SettingsView = FallbackSettings;

const router = createHashRouter([
  {
    path: "/",
    element: <ChatApp />,
  },
  {
    path: "/models",
    element: <ChatApp />,
  },
  {
    path: "/settings",
    element: <SettingsView />,
  },
  {
    path: "/chat/:id?",
    element: <ChatApp />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
