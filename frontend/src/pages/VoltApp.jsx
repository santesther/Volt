import { useState } from "react";
import { C, TABS } from "../utils/constants";
import Dashboard        from "./Dashboard";
import Historico        from "./Historico";
import ChargeMap        from "./ChargeMap";
import Perfil           from "./Perfil";
import Configuracoes    from "./Configuracoes";
import RegisterStrength from "./RegisterStrength";
import RegisterRun      from "./RegisterRun";

export default function VoltApp({ userId, onLogout }) {
  const [tab, setTab] = useState("dashboard");
  const [showSettings, setShowSettings] = useState(false);
  const [registering, setRegistering] = useState(null);
  const [lastSavedId, setLastSavedId] = useState(null);

  const handleSave = (savedWorkoutId) => {
    setRegistering(null);
    setLastSavedId(savedWorkoutId || null);
    setTab("historico");
  };

  const renderTab = () => {
    if (registering) {
      const back = () => setRegistering(null);
      if (registering.type === "STRENGTH") return <RegisterStrength suggestion={registering} userId={userId} onBack={back} onSave={handleSave} />;
      if (registering.type === "RUN")      return <RegisterRun      suggestion={registering} userId={userId} onBack={back} onSave={handleSave} />;
    }
    if (tab === "dashboard") return <Dashboard onRegister={s => setRegistering(s)} userId={userId} />;
    if (tab === "historico") return <Historico userId={userId} highlightId={lastSavedId} />;
    if (tab === "charge")    return <ChargeMap key={lastSavedId} userId={userId} />;
    if (tab === "perfil" && showSettings) return <Configuracoes userId={userId} onBack={() => setShowSettings(false)} onLogout={onLogout} />;
    if (tab === "perfil")  return <Perfil userId={userId} onOpenSettings={() => setShowSettings(true)} onLogout={onLogout} />;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
        html, body { background: #050505; }
      `}</style>

      <div style={{ background:C.bg, minHeight:"100vh", color:C.text, fontFamily:"'DM Sans', sans-serif", paddingBottom:80 }}>
        <div style={{ animation:"fadeUp 0.4s forwards" }}>
          {renderTab()}
        </div>

        <div className="volt-bottom-nav" style={{
          position:"fixed", bottom:0, left:0, right:0,
          background:"rgba(5,5,5,0.97)", backdropFilter:"blur(16px)",
          borderTop:"1px solid rgba(255,255,255,0.06)",
          display:"flex", justifyContent:"space-around",
          padding:"12px 22px 22px",
        }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => { setRegistering(null); setTab(t.id); }} style={{
              background:"none", border:"none", cursor:"pointer",
              display:"flex", flexDirection:"column", alignItems:"center", gap:4,
              opacity: !registering && tab === t.id ? 1 : 0.3,
            }}>
              <span style={{ fontSize:20 }}>{t.icon}</span>
              <span style={{ fontFamily:"'Space Mono', monospace", fontSize:8, letterSpacing:"0.1em", color: !registering && tab === t.id ? C.yellow : C.muted }}>
                {t.label.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
