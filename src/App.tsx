import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Shell from "./components/Shell";
import Home from "./views/Home";
import Chat from "./views/Chat";
import Settings from "./views/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Shell><Home /></Shell>} />
        <Route path="/chat" element={<Shell><Chat /></Shell>} />
        <Route path="/settings" element={<Shell><Settings /></Shell>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
