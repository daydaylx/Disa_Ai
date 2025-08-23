import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/globals.css";

const Home = React.lazy(() => import("./views/Home"));
const Chat = React.lazy(() => import("./views/Chat"));

const router = createBrowserRouter([
  { path: "/", element: <React.Suspense fallback={<div className="p-6">Lade…</div>}><Home /></React.Suspense> },
  { path: "/chat", element: <React.Suspense fallback={<div className="p-6">Lade…</div>}><Chat /></React.Suspense> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
