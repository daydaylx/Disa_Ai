import { createBrowserRouter, RouterProvider, useNavigate } from "react-router-dom";

import App from "./App";
import { PersonaProvider } from "./config/personas";
import ChatApp from "./ui2/ChatApp";
import SettingsView from "./ui2/SettingsView";
import ModelPickerView from "./views/ModelPickerView";

function ModelPickerWithNavigation() {
  const navigate = useNavigate();
  return <ModelPickerView onSelectChat={() => navigate("/")} />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <ChatApp />,
      },
      {
        path: "models",
        element: <ModelPickerWithNavigation />,
      },
      {
        path: "settings",
        element: <SettingsView />,
      },
    ],
  },
]);

export function Router() {
  return (
    <PersonaProvider>
      <RouterProvider router={router} />
    </PersonaProvider>
  );
}
