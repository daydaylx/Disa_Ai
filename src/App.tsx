import "./styles/layout.css";

import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import TabBar from "./components/nav/TabBar";
import { ToastsProvider } from "./components/ui/toast/ToastsProvider";
import ChatView from "./views/ChatView";
const SettingsView = lazy(() => import("./views/SettingsView"));

const App: React.FC = () => (
  <div className="app-bg min-h-dvh text-white">
    <BrowserRouter>
      <ToastsProvider>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<ChatView />} />
            <Route path="/settings" element={<SettingsView />} />
          </Routes>
        </Suspense>
        <TabBar />
      </ToastsProvider>
    </BrowserRouter>
  </div>
);

export default App;
