import { useState, useEffect } from "react";
import api from "../api/api";
import { C } from "../utils/constants";
import { useCount, SectionLabel } from "../utils/components";
import { useLang } from "../utils/langContext";
import { muscleT } from "../utils/translations";

export default function ChargeMap({ userId }) {
  const { t, lang } = useLang();
  const [fatigue, setFatigue] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.post(`/suggestions/${userId}`, { painfulMuscleIds: [] })
      .then(res => setFatigue(res.data.muscleFatigue || {}))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [userId]);

  const muscles = Object.entries(fatigue)
    .map(([name, value]) => {
      const clamped = Math.min(100, Math.round(value));
      return { name, fatigue: clamped, recovering: clamped > 30 };
    })
    .sort((a, b) => b.fatigue - a.fatigue);

  const totalTreinos = useCount(muscles.filter(m => m.fatigue > 0).length);
  const emRecarga    = useCount(muscles.filter(m => m.recovering).length);

  const fatigueOf = (...names) => {
    const vals = names.map(n => fatigue[n] ?? 0);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  };
  const segColor = (f) => {
    if (f > 60) return C.red;
    if (f > 20) return C.yellow;
    return C.graphite;
  };
  const segOpacity = (f) => f > 0 ? Math.max(0.4, f / 100) : 0.25;

  const chestF = fatigueOf("CHEST");
  const armF   = fatigueOf("BICEPS", "TRICEPS", "SHOULDERS", "POSTERIOR_SHOULDERS");
  const legF   = fatigueOf("LEGS_ANTERIOR", "LEGS_POSTERIOR", "GLUTES", "CALVES");

  if (loading) return (
    <div className="volt-screen">
      <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.muted, paddingTop:40, textAlign:"center" }}>
        {lang === "pt-BR" ? "Carregando charge map..." : "Loading charge map..."}
      </div>
    </div>
  );

  return (
    <div className="volt-screen">
      <SectionLabel>Charge Map</SectionLabel>
      <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:44, lineHeight:1, letterSpacing:"-0.02em", marginBottom:22 }}>
        {lang === "pt-BR" ? <><span>Esta</span><br/><span>Semana</span></> : <><span>This</span><br/><span>Week</span></>}
      </div>

      <div style={{ background:C.g2, borderRadius:18, padding:20, marginBottom:14, border:"1px solid rgba(255,210,0,0.06)", display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
        <svg width="80" height="140" viewBox="0 0 60 120" fill="none">
          <circle cx="30" cy="10" r="9" fill="rgba(255,255,255,0.15)" stroke="rgba(255,210,0,0.3)" strokeWidth="1.5"/>
          <rect x="18" y="22" width="24" height="32" rx="4" fill="rgba(255,255,255,0.1)"/>
          <rect x="6" y="22" width="10" height="28" rx="4" fill="rgba(255,255,255,0.1)"/>
          <rect x="44" y="22" width="10" height="28" rx="4" fill="rgba(255,255,255,0.1)"/>
          <rect x="19" y="57" width="10" height="36" rx="4" fill="rgba(255,255,255,0.1)"/>
          <rect x="31" y="57" width="10" height="36" rx="4" fill="rgba(255,255,255,0.1)"/>
          <rect x="18" y="22" width="24" height="32" rx="4" fill={segColor(chestF)} opacity={segOpacity(chestF)}/>
          <rect x="6" y="22" width="10" height="28" rx="4" fill={segColor(armF)} opacity={segOpacity(armF)}/>
          <rect x="44" y="22" width="10" height="28" rx="4" fill={segColor(armF)} opacity={segOpacity(armF)}/>
          <rect x="19" y="57" width="10" height="36" rx="4" fill={segColor(legF)} opacity={segOpacity(legF)}/>
          <rect x="31" y="57" width="10" height="36" rx="4" fill={segColor(legF)} opacity={segOpacity(legF)}/>
        </svg>
        <div style={{ display:"flex", justifyContent:"space-between", width:"100%" }}>
          <span style={{ fontFamily:"'Space Mono', monospace", fontSize:9, background:"rgba(255,59,48,0.12)", color:C.red, padding:"3px 8px", borderRadius:6 }}>● {t("recovering")}</span>
          <span style={{ fontFamily:"'Space Mono', monospace", fontSize:9, background:"rgba(255,210,0,0.1)", color:C.yellow, padding:"3px 8px", borderRadius:6 }}>● {t("active")}</span>
          <span style={{ fontFamily:"'Space Mono', monospace", fontSize:9, background:"rgba(255,255,255,0.05)", color:C.muted, padding:"3px 8px", borderRadius:6 }}>● {t("resting")}</span>
        </div>
      </div>

      <div style={{ display:"flex", gap:10, marginBottom:14 }}>
        <div style={{ flex:1, background:C.g2, borderRadius:14, padding:"14px 16px", border:"1px solid rgba(255,210,0,0.06)" }}>
          <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:38, color:C.yellow, lineHeight:1 }}>{totalTreinos}</div>
          <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:11, color:C.muted, marginTop:4 }}>
            {lang === "pt-BR" ? "grupos ativos" : "active groups"}
          </div>
        </div>
        <div style={{ flex:1, background:C.g2, borderRadius:14, padding:"14px 16px", border:"1px solid rgba(255,210,0,0.06)" }}>
          <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:38, color:C.red, lineHeight:1 }}>{emRecarga}</div>
          <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:11, color:C.muted, marginTop:4 }}>
            {lang === "pt-BR" ? "em recarga" : "recovering"}
          </div>
        </div>
      </div>

      <div style={{ background:C.g2, borderRadius:14, padding:"14px 16px", border:"1px solid rgba(255,210,0,0.06)", marginBottom:14 }}>
        <SectionLabel>{lang === "pt-BR" ? "Fadiga por Músculo" : "Muscle Fatigue"}</SectionLabel>
        {muscles.length === 0 ? (
          <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.muted }}>{t("no_workouts_yet")}</div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {muscles.map(m => (
              <div key={m.name}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                  <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, color:C.text }}>{muscleT(m.name, lang)}</div>
                  <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color: m.recovering ? C.red : C.muted }}>{m.fatigue}%</div>
                </div>
                <div style={{ flex:1, height:4, background:"rgba(255,255,255,0.06)", borderRadius:2, overflow:"hidden" }}>
                  <div style={{ width:`${m.fatigue}%`, height:"100%", background: m.recovering ? C.red : C.yellow, borderRadius:2, transition:"width 1s ease" }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ background:C.graphite, borderRadius:12, padding:"12px 14px", border:"1px solid rgba(255,210,0,0.06)" }}>
        <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, color:C.text, lineHeight:1.6 }}>
          <strong style={{ color:C.text }}>VOLT {lang === "pt-BR" ? "sugere" : "suggests"}:</strong>{" "}
          <span style={{ color:C.muted }}>
            {emRecarga > 0
              ? lang === "pt-BR"
                ? `${muscles.filter(m => m.recovering).map(m => muscleT(m.name, lang)).join(", ")} em recuperação. Treine os grupos descansados. ⚡`
                : `${muscles.filter(m => m.recovering).map(m => muscleT(m.name, lang)).join(", ")} recovering. Train the rested groups. ⚡`
              : lang === "pt-BR"
                ? "Todos os grupos estão recuperados. Bora treinar! ⚡"
                : "All muscle groups are recovered. Let's train! ⚡"
            }
          </span>
        </span>
      </div>
    </div>
  );
}