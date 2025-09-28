import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ChatPage from "../pages/Chat";
import Studio from "../pages/Studio";
import { RootLayout } from "./layouts/RootLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <ChatPage />,
      },
      {
        path: "/studio",
        element: <Studio />,
      },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
