import { BrowserRouter, Navigate,Route, Routes } from "react-router-dom";

import Chat from "./views/Chat";
import Home from "./views/Home";
import Settings from "./views/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/chat" element={<Chat/>} />
        <Route path="/settings" element={<Settings/>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
