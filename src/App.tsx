import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastsProvider } from "./components/ui/toast/ToastsProvider";
import ChatView from "./views/ChatView";
import SettingsView from "./views/SettingsView";
import "./styles/layout.css";
import TabBar from "./components/nav/TabBar";

const App: React.FC = () => (
  <div className="app-bg min-h-dvh text-white">
    <BrowserRouter>
      <ToastsProvider>
        <Routes>
          <Route path="/" element={<ChatView />} />
          <Route path="/settings" element={<SettingsView />} />
        </Routes>
        <TabBar />
      </ToastsProvider>
    </BrowserRouter>
  </div>
);

export default App;
