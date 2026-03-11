import { useState, useEffect } from "react";
import api from "../api/api";
import { C } from "../utils/constants";
import { useCount, SectionLabel, MuscleChip } from "../utils/components";
import { useLang } from "../utils/langContext";
import { muscleT } from "../utils/translations";

export default function Dashboard({ onRegister, userId }) {
  const { t, lang } = useLang();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t("good_morning") : hour < 18 ? t("good_afternoon") : t("good_evening");
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  const calcOutputLevel = (muscleFatigue) => {
    if (!muscleFatigue) return 0;
    const values = Object.values(muscleFatigue);
    if (values.length === 0) return 100;
    const avgFatigue = values.reduce((a, b) => a + Math.min(100, b), 0) / values.length;
    return Math.round(100 - avgFatigue);
  };

  const outputTarget = suggestion ? calcOutputLevel(suggestion.muscleFatigue) : 0;
  const v = useCount(outputTarget);

  useEffect(() => {
    api.get(`/users/${userId}`)
      .then(res => setUserName(res.data.name?.split(" ")[0] || ""))
      .catch(err => console.error(err));
  }, [userId]);

  useEffect(() => {
    api.post(`/suggestions/${userId}`, { painfulMuscleIds: [] })
      .then(res => setSuggestion(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [userId]);

const buildMessage = (suggestion) => {
  if (!suggestion) return "";
  if (suggestion.type === "REST") {
    if (!suggestion.suggestedMuscles?.length) {
      return lang === "pt-BR"
        ? "Hoje é dia de descanso! Todos os músculos planejados ainda estão em recuperação."
        : "Rest day! All planned muscles are still recovering.";
    }
    const names = suggestion.suggestedMuscles.map(m => muscleT(m.name, lang)).join(", ");
    return lang === "pt-BR"
      ? `Hoje é dia de descanso! Próximo treino: ${names}.`
      : `Rest day! Next workout: ${names}.`;
  }
  if (suggestion.type === "RUN") {
    return lang === "pt-BR"
      ? `Sugerimos uma corrida ${suggestion.runType?.toLowerCase() || ""} de ${suggestion.suggestedKm}km na zona ${suggestion.suggestedZone}.`
      : `We suggest a ${suggestion.runType?.toLowerCase() || ""} run of ${suggestion.suggestedKm}km in zone ${suggestion.suggestedZone}.`;
  }
  const fatigued = Object.entries(suggestion.muscleFatigue || {})
    .filter(([, v]) => v > 30)
    .map(([name]) => muscleT(name, lang));
  if (fatigued.length === 0) {
    return lang === "pt-BR"
      ? "Todos os músculos de hoje estão recuperados. Bora treinar!"
      : "All today's muscles are recovered. Let's train!";
  }
  return lang === "pt-BR"
    ? `Atenção: ${fatigued.join(", ")} ainda em recuperação. Treine com cautela!`
    : `Heads up: ${fatigued.join(", ")} still recovering. Train carefully!`;
};

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
        <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:"rgba(0,0,0,0.45)", textTransform:"uppercase", marginBottom:6 }}>{t("output_level")}</div>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:64, lineHeight:1, color:"#050505", letterSpacing:"-0.02em" }}>{v}%</div>
        <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:"rgba(0,0,0,0.45)", marginTop:4 }}>
          {lang === "pt-BR" ? "Carga disponível" : "Available load"}
        </div>
      </div>

      {suggestion?.muscleFatigue && Object.keys(suggestion.muscleFatigue).length > 0 && (
        <div style={{ marginBottom:22 }}>
          <SectionLabel>{lang === "pt-BR" ? "Sistema Muscular" : "Muscle System"}</SectionLabel>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
            {Object.entries(suggestion.muscleFatigue)
              .filter(([, v]) => v > 0)
              .sort(([, a], [, b]) => b - a)
              .map(([name, value]) => (
                <MuscleChip key={name} name={muscleT(name, lang)} fatigue={Math.min(100, Math.round(value))} />
              ))}
          </div>
        </div>
      )}

      {suggestion?.type === "REST" ? (
        <div style={{ marginBottom:18, background:"rgba(255,210,0,0.07)", border:"1px solid rgba(255,210,0,0.2)", borderRadius:16, padding:"14px 16px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:C.yellow, boxShadow:`0 0 8px ${C.yellow}` }} />
            <span style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color:C.yellow, letterSpacing:"0.2em", fontWeight:700 }}>
              {t("rest_day").toUpperCase()}
            </span>
          </div>
          <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.text, lineHeight:1.6 }}>{buildMessage(suggestion)}</div>
        </div>
      ) : (
        <div style={{ marginBottom:18, background:"rgba(255,59,48,0.07)", border:"1px solid rgba(255,59,48,0.3)", borderRadius:16, padding:"14px 16px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:C.red, boxShadow:`0 0 8px ${C.red}` }} />
            <span style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color:C.red, letterSpacing:"0.2em", fontWeight:700 }}>VOLT ALERT</span>
          </div>
          <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.text, lineHeight:1.6 }}>
            {buildMessage(suggestion) || (lang === "pt-BR" ? "Analisando seu histórico..." : "Analyzing your history...")}
          </div>
        </div>
      )}

      <div style={{ marginBottom:16 }}>
        <SectionLabel>{suggestion?.type === "REST" ? (lang === "pt-BR" ? "Próximo Treino" : "Next Workout") : t("today_suggestion")}</SectionLabel>
        <div style={{ background:C.graphite, borderRadius:16, padding:"18px", border:"1px solid rgba(255,210,0,0.07)" }}>
          {loading ? (
            <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.muted, textAlign:"center", padding:"20px 0" }}>
              {lang === "pt-BR" ? "Carregando sugestão..." : "Loading suggestion..."}
            </div>
          ) : (
            <>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                <div>
                  <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:20, color:C.text, marginBottom:2, wordBreak:"break-word", overflowWrap:"anywhere" }}>
                    {suggestion?.suggestedMuscles?.map(m => muscleT(m.name, lang)).join(" + ") || "—"}
                  </div>
                  <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:11, color:C.muted }}>
                    {suggestion?.suggestedSets ? `${suggestion.suggestedSets} ${lang === "pt-BR" ? "séries" : "sets"} · ` : ""}
                    {lang === "pt-BR" ? "intensidade" : "intensity"} {suggestion?.intensity?.toLowerCase() || "—"}
                  </div>
                </div>
                <div style={{ background:"rgba(255,210,0,0.1)", border:`1px solid rgba(255,210,0,0.2)`, borderRadius:100, padding:"4px 10px", fontFamily:"'Space Mono', monospace", fontSize:9, color:C.yellow, letterSpacing:"0.1em", flexShrink:0 }}>
                  {suggestion?.intensity || "—"}
                </div>
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:14 }}>
                {suggestion?.suggestedMuscles?.map(m => (
                  <span key={m.id} style={{ background:"rgba(255,210,0,0.08)", border:"1px solid rgba(255,210,0,0.15)", borderRadius:100, padding:"4px 10px", fontFamily:"'DM Sans', sans-serif", fontSize:11, color:C.yellow }}>
                    {muscleT(m.name, lang)}
                  </span>
                ))}
              </div>
              {suggestion?.type !== "REST" && (
                <div onClick={() => onRegister(suggestion)} style={{ width:"100%", background:C.yellow, border:"none", borderRadius:12, padding:"12px", cursor:"pointer", fontFamily:"'Space Mono', monospace", fontSize:10, fontWeight:700, letterSpacing:"0.15em", color:"#050505", textAlign:"center" }}>
                  {lang === "pt-BR" ? "REGISTRAR TREINO SUGERIDO ▶" : "REGISTER SUGGESTED WORKOUT ▶"}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div style={{ marginBottom:32 }}>
        <SectionLabel>{lang === "pt-BR" ? "Registrar Agora" : "Register Now"}</SectionLabel>
        <div style={{ display:"flex", gap:10 }}>
          <div onClick={() => onRegister({ type:"STRENGTH", suggestedMuscles:[] })} style={{ flex:1, background:C.graphite, border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"16px 12px", cursor:"pointer", textAlign:"center", transition:"border-color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,210,0,0.3)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
          >
            <div style={{ fontSize:22, marginBottom:6 }}>🏋️</div>
            <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color:C.yellow, letterSpacing:"0.15em" }}>
              {t("strength").toUpperCase()}
            </div>
          </div>
          <div onClick={() => onRegister({ type:"RUN", suggestedMuscles:[] })} style={{ flex:1, background:C.graphite, border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"16px 12px", cursor:"pointer", textAlign:"center", transition:"border-color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,210,0,0.3)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
          >
            <div style={{ fontSize:22, marginBottom:6 }}>🏃</div>
            <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color:C.yellow, letterSpacing:"0.15em" }}>
              {t("run").toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}