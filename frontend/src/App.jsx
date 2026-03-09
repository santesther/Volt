import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VoltApp from "./pages/VoltApp";

export default function App() {
  const [userId, setUserId] = useState(null);
  const [screen, setScreen] = useState("login"); // "login" | "register"

  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");
    if (savedUserId) setUserId(Number(savedUserId));
  }, []);

  const handleLogin = (id) => { setUserId(id); setScreen("login"); };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUserId(null);
    setScreen("login");
  };

  if (userId) return <VoltApp userId={userId} onLogout={handleLogout} />;
  if (screen === "register") return <Register onLogin={handleLogin} onBack={() => setScreen("login")} />;
  return <Login onLogin={handleLogin} onRegister={() => setScreen("register")} />;
}