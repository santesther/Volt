import { useState, useEffect } from "react";
import Login from "./pages/Login";
import VoltApp from "./pages/VoltApp";

export default function App() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // verifica se já tem sessão salva
    const savedUserId = localStorage.getItem("userId");
    if (savedUserId) setUserId(Number(savedUserId));
  }, []);

  const handleLogin = (id) => {
    setUserId(id);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUserId(null);
  };

  if (!userId) return <Login onLogin={handleLogin} />;
  return <VoltApp userId={userId} onLogout={handleLogout} />;
}