import { useState, useEffect } from "react";
import api from "../api/api";
import { C } from "../utils/constants";
import { useCount, SectionLabel, MuscleChip } from "../utils/components";

export default function Dashboard({ onRegister, userId }) {
  const v = useCount(78);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    api.post(`/suggestions/${userId}`, { painfulMuscleIds: [] })
      .then(res => setSuggestion(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [userId]);

   useEffect(() => {
     api.get(`/users/${userId}`)
       .then(res => setUserName(res.data.name?.split(" ")[0] || ""))
       .catch(err => console.error(err));
   }, [userId]);

  return (
    <div className="volt-screen">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
        <div>
          <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.muted, marginBottom:2 }}>{greeting} ⚡</div>
          <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.02em" }}>{userName}</div>
        </div>
        <div style={{ width:42, height:42, background:C.yellow, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:16, color:"#050505" }}>{userName?.charAt(0)?.toUpperCase() || "?"}</div>
      </div>

      <div style={{ background:C.yellow, borderRadius:20, padding:"20px 22px", marginBottom:18 }}>
        <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:"rgba(0,0,0,0.45)", textTransform:"uppercase", marginBottom:6 }}>Output Level</div>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:64, lineHeight:1, color:"#050505", letterSpacing:"-0.02em" }}>{v}%</div>
        <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:"rgba(0,0,0,0.45)", marginTop:4 }}>Carga disponível</div>
      </div>

      {suggestion?.muscleFatigue && Object.keys(suggestion.muscleFatigue).length > 0 && (
        <div style={{ marginBottom:22 }}>
          <SectionLabel>Sistema Muscular</SectionLabel>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
            {Object.entries(suggestion.muscleFatigue)
              .filter(([, v]) => v > 0)
              .sort(([, a], [, b]) => b - a)
              .map(([name, value]) => (
                <MuscleChip key={name} name={name} fatigue={Math.min(100, Math.round(value))} />
              ))}
          </div>
        </div>
      )}

      {suggestion?.type === "REST" ? (
        <div style={{ marginBottom:18, background:"rgba(255,210,0,0.07)", border:"1px solid rgba(255,210,0,0.2)", borderRadius:16, padding:"14px 16px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:C.yellow, boxShadow:`0 0 8px ${C.yellow}` }} />
            <span style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color:C.yellow, letterSpacing:"0.2em", fontWeight:700 }}>DIA DE DESCANSO</span>
          </div>
          <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.text, lineHeight:1.6 }}>{suggestion.message}</div>
        </div>
      ) : (
        <div style={{ marginBottom:18, background:"rgba(255,59,48,0.07)", border:"1px solid rgba(255,59,48,0.3)", borderRadius:16, padding:"14px 16px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:C.red, boxShadow:`0 0 8px ${C.red}` }} />
            <span style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color:C.red, letterSpacing:"0.2em", fontWeight:700 }}>VOLT ALERT</span>
          </div>
          <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.text, lineHeight:1.6 }}>
            {suggestion?.message || "Analisando seu histórico..."}
          </div>
        </div>
      )}

      <div style={{ marginBottom:16 }}>
        <SectionLabel>{suggestion?.type === "REST" ? "Próximo Treino" : "Sugestão de Hoje"}</SectionLabel>
        <div style={{ background:C.graphite, borderRadius:16, padding:"18px", border:"1px solid rgba(255,210,0,0.07)" }}>
          {loading ? (
            <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.muted, textAlign:"center", padding:"20px 0" }}>Carregando sugestão...</div>
          ) : (
            <>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                <div>
                  <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:20, color:C.text, marginBottom:2 }}>
                    {suggestion?.suggestedMuscles?.map(m => m.name).join(" + ") || "—"}
                  </div>
                  <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:11, color:C.muted }}>
                    {suggestion?.suggestedSets ? `${suggestion.suggestedSets} séries · ` : ""}
                    intensidade {suggestion?.intensity?.toLowerCase() || "—"}
                  </div>
                </div>
                <div style={{ background:"rgba(255,210,0,0.1)", border:`1px solid rgba(255,210,0,0.2)`, borderRadius:100, padding:"4px 10px", fontFamily:"'Space Mono', monospace", fontSize:9, color:C.yellow, letterSpacing:"0.1em", flexShrink:0 }}>
                  {suggestion?.intensity || "—"}
                </div>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
                {suggestion?.suggestedMuscles?.map(m => (
                  <span key={m.id} style={{ background:"rgba(255,210,0,0.08)", border:"1px solid rgba(255,210,0,0.15)", borderRadius:100, padding:"4px 10px", fontFamily:"'DM Sans', sans-serif", fontSize:11, color:C.yellow }}>
                    {m.name}
                  </span>
                ))}
              </div>
              {suggestion?.type !== "REST" && (
                <div onClick={() => onRegister(suggestion)} style={{ width:"100%", background:C.yellow, border:"none", borderRadius:12, padding:"12px", cursor:"pointer", fontFamily:"'Space Mono', monospace", fontSize:10, fontWeight:700, letterSpacing:"0.15em", color:"#050505", textAlign:"center" }}>
                  REGISTRAR TREINO SUGERIDO ▶
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div style={{ marginBottom:32 }}>
        <SectionLabel>Registrar Agora</SectionLabel>
        <div style={{ display:"flex", gap:10 }}>
          <div onClick={() => onRegister({ type:"STRENGTH", suggestedMuscles:[] })} style={{ flex:1, background:C.graphite, border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"16px 12px", cursor:"pointer", textAlign:"center", transition:"border-color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,210,0,0.3)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
          >
            <div style={{ fontSize:22, marginBottom:6 }}>🏋️</div>
            <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color:C.yellow, letterSpacing:"0.15em" }}>MUSCULAÇÃO</div>
          </div>
          <div onClick={() => onRegister({ type:"RUN", suggestedMuscles:[] })} style={{ flex:1, background:C.graphite, border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"16px 12px", cursor:"pointer", textAlign:"center", transition:"border-color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,210,0,0.3)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
          >
            <div style={{ fontSize:22, marginBottom:6 }}>🏃</div>
            <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color:C.yellow, letterSpacing:"0.15em" }}>CORRIDA</div>
          </div>
        </div>
      </div>
    </div>
  );
}
