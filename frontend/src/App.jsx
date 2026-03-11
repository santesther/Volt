import { useState, useEffect } from "react";
import api from "./api/api";
import Login            from "./pages/Login";
import Register         from "./pages/Register";
import VoltApp          from "./pages/VoltApp";
import TrainingPlanSetup from "./pages/TrainingPlanSetup";

function AppShell({ children }) {
  return <div className="volt-app-root">{children}</div>;
}

export default function App() {
  const [userId, setUserId] = useState(null);
  const [screen, setScreen] = useState("login");
  const [needsPlan, setNeedsPlan] = useState(false);

  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");
    if (savedUserId) setUserId(Number(savedUserId));
  }, []);

  const handleLogin = async (id, isNewUser = false) => {
    setUserId(id);
    setScreen("login");
    if (isNewUser) {
      setNeedsPlan(true);
      return;
    }
    try {
      await api.get(`/training-plans/user/${id}`);
      setNeedsPlan(false);
    } catch {
      setNeedsPlan(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUserId(null);
    setScreen("login");
  };

  if (screen === "register")
    return <AppShell><Register onLogin={handleLogin} onBack={() => setScreen("login")} /></AppShell>;

  if (userId && needsPlan)
    return <AppShell><TrainingPlanSetup userId={userId} onDone={() => setNeedsPlan(false)} onSkip={() => setNeedsPlan(false)} /></AppShell>;

  if (userId)
    return <VoltApp userId={userId} onLogout={handleLogout} />;

  return <AppShell><Login onLogin={handleLogin} onRegister={() => setScreen("register")} /></AppShell>;
}