import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import ChatApp from "./ui2/ChatApp";
import SettingsView from "./ui2/SettingsView";
import ModelPickerView from "./views/ModelPickerView";

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
        element: <ModelPickerView onSelectChat={() => {}} />,
      },
      {
        path: "settings",
        element: <SettingsView />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
