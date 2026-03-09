import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VoltApp from "./pages/VoltApp";
import TrainingPlanSetup from "./pages/TrainingPlanSetup";

export default function App() {
  const [userId, setUserId] = useState(null);
  const [screen, setScreen] = useState("login");
  const [needsPlan, setNeedsPlan] = useState(false);

  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");
    if (savedUserId) setUserId(Number(savedUserId));
  }, []);

 const handleLogin = async (id) => {
   setUserId(id);
   try {
     await api.get(`/training-plans/user/${id}`);
     setNeedsPlan(false);
   } catch {
     setNeedsPlan(true);
   }
 };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setUserId(null);
    setScreen("login");
  };

  if (userId && needsPlan) return <TrainingPlanSetup userId={userId} onDone={() => setNeedsPlan(false)} onSkip={() => setNeedsPlan(false)} />;
  if (userId) return <VoltApp userId={userId} onLogout={handleLogout} />;
  return <Login onLogin={handleLogin} onRegister={() => setScreen("register")} />;
}