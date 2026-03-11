import { useState, useEffect } from "react";
import api from "../api/api";
import { C } from "../utils/constants";
import { SectionLabel } from "../utils/components";
import { useLang } from "../utils/langContext";
import { muscleT } from "../utils/translations";

export default function Historico({ userId, highlightId }) {
  const { t, lang } = useLang();
  const [workouts, setWorkouts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get(`/strength-workouts/user/${userId}`).then(r => r.data.map(w => ({...w, workoutType:"STRENGTH"}))).catch(() => []),
      api.get(`/run-workouts/user/${userId}`).then(r => r.data.map(w => ({...w, workoutType:"RUN"}))).catch(() => []),
    ]).then(([strength, run]) => {
      const sorted = [...strength, ...run].sort((a, b) => new Date(b.date) - new Date(a.date));
      setWorkouts(sorted);
      const toSelect = highlightId
        ? sorted.find(w => w.id === highlightId) || sorted[0]
        : sorted[0];
      setSelected(toSelect || null);
    }).finally(() => setLoading(false));
  }, [userId]);

  const formatDate = (dateStr) => {
    const locale = lang === "pt-BR" ? "pt-BR" : "en-US";
    const d = new Date(dateStr);
    return d.toLocaleDateString(locale, { weekday:"short", day:"2-digit", month:"short" }).toUpperCase()
      + " · " + d.toLocaleTimeString(locale, { hour:"2-digit", minute:"2-digit" });
  };

  const formatDuration = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h${String(m).padStart(2,"0")}` : `${m}min`;
  };

  const workoutLabel = (w) => w.workoutType === "RUN"
    ? `${w.km}KM`
    : w.muscles?.map(m => muscleT(m.name, lang)).join(" + ") || (lang === "pt-BR" ? "TREINO" : "WORKOUT");

  const pillLabel = (w) => w.workoutType === "RUN"
    ? "🏃"
    : w.muscles?.[0]?.name?.split(" ")[0] || (lang === "pt-BR" ? "TREINO" : "WORKOUT");

  if (loading) return (
    <div className="volt-screen">
      <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.muted, paddingTop:40, textAlign:"center" }}>
        {lang === "pt-BR" ? "Carregando histórico..." : "Loading history..."}
      </div>
    </div>
  );

  if (!workouts.length) return (
    <div className="volt-screen">
      <SectionLabel color={C.yellow}>{t("history").toUpperCase()}</SectionLabel>
      <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:32, marginBottom:12 }}>
        {lang === "pt-BR" ? "Nenhum treino" : "No workouts"}
      </div>
      <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:14, color:C.muted }}>
        {lang === "pt-BR"
          ? "Registre seu primeiro treino para ver o histórico aqui."
          : "Register your first workout to see history here."}
      </div>
    </div>
  );

  return (
    <div className="volt-screen">
      <SectionLabel color={C.yellow}>{t("history").toUpperCase()}</SectionLabel>
      <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:40, lineHeight:1, letterSpacing:"-0.02em", marginBottom:4 }}>
        {selected ? workoutLabel(selected) : "—"}
      </div>
      <div style={{ fontFamily:"'Space Mono', monospace", fontSize:10, color:C.muted, marginBottom:22 }}>
        {selected ? formatDate(selected.date) : ""}
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:22, overflowX:"auto", paddingBottom:4 }}>
        {workouts.map(w => (
          <button key={`${w.workoutType}-${w.id}`} onClick={() => setSelected(w)} style={{
            background: selected?.id === w.id && selected?.workoutType === w.workoutType ? C.yellow : C.graphite,
            color: selected?.id === w.id && selected?.workoutType === w.workoutType ? "#050505" : C.muted,
            border: w.id === highlightId ? `1px solid ${C.yellow}` : "none",
            borderRadius:100, padding:"6px 14px", cursor:"pointer",
            fontFamily:"'Space Mono', monospace", fontSize:9, letterSpacing:"0.15em",
            whiteSpace:"nowrap", flexShrink:0,
          }}>
            {pillLabel(w)}
          </button>
        ))}
      </div>

      {selected?.workoutType === "STRENGTH" && (
        <>
          <div style={{ display:"flex", gap:10, marginBottom:16 }}>
            {[
              { label: t("duration"), value: formatDuration(selected.durationMinutes), unit:"" },
              { label: t("effort"),   value: selected.effort, unit:"/10" },
              { label: t("sets"),     value: selected.sets?.length || 0, unit:"" },
            ].map(s => (
              <div key={s.label} style={{ flex:1, background:C.graphite, borderRadius:12, padding:"12px 14px" }}>
                <div style={{ fontFamily:"'Space Mono', monospace", fontSize:8, color:C.muted, marginBottom:4 }}>{s.label}</div>
                <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:20, color:C.text }}>{s.value}<span style={{ fontSize:11, color:C.muted }}>{s.unit}</span></div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
            {Object.values(
              (selected.sets || []).reduce((acc, s) => {
                const key = s.exercise.id;
                if (!acc[key]) acc[key] = { exercise: s.exercise, sets: [] };
                acc[key].sets.push(s);
                return acc;
              }, {})
            ).map(({ exercise, sets }) => (
              <div key={exercise.id} style={{ background:C.graphite, borderRadius:14, padding:"14px 16px", border:"1px solid rgba(255,210,0,0.05)" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <span style={{ fontFamily:"'DM Sans', sans-serif", fontWeight:600, fontSize:14, color:C.text }}>{exercise.name}</span>
                  <span style={{ background:"rgba(255,210,0,0.08)", color:C.yellow, borderRadius:6, padding:"2px 8px", fontFamily:"'Space Mono', monospace", fontSize:9 }}>
                    {muscleT(exercise.muscleGroup?.name || "", lang)}
                  </span>
                </div>
                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {sets.map((s, j) => (
                    <span key={j} style={{ background:"rgba(255,255,255,0.04)", borderRadius:6, padding:"4px 8px", fontFamily:"'Space Mono', monospace", fontSize:10, color:C.muted }}>
                      {s.weightKg}kg × {s.reps}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ background:"rgba(255,210,0,0.05)", border:"1px solid rgba(255,210,0,0.1)", borderRadius:12, padding:"10px 14px" }}>
            <span style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color:C.muted, letterSpacing:"0.15em" }}>{t("equipment")} · </span>
            <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.yellow }}>{selected.equipmentType?.replace("_", " ") || "—"}</span>
          </div>
        </>
      )}

      {selected?.workoutType === "RUN" && (
        <>
          <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap" }}>
            {[
              { label: t("distance"), value: selected.km,                    unit:"km"     },
              { label: t("duration"), value: formatDuration(selected.duration), unit:""     },
              { label: t("pace"),     value: selected.pace?.toFixed(2),       unit:"min/km" },
              { label: t("effort"),   value: selected.effort,                 unit:"/10"    },
            ].map(s => (
              <div key={s.label} style={{ flex:"1 1 40%", background:C.graphite, borderRadius:12, padding:"12px 14px" }}>
                <div style={{ fontFamily:"'Space Mono', monospace", fontSize:8, color:C.muted, marginBottom:4 }}>{s.label}</div>
                <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:20, color:C.text }}>{s.value}<span style={{ fontSize:11, color:C.muted }}> {s.unit}</span></div>
              </div>
            ))}
          </div>
          <div style={{ display:"flex", gap:10, marginBottom:10 }}>
            <div style={{ flex:1, background:"rgba(255,210,0,0.05)", border:"1px solid rgba(255,210,0,0.1)", borderRadius:12, padding:"10px 14px" }}>
              <span style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color:C.muted }}>{t("zone")} · </span>
              <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.yellow }}>{selected.zone}</span>
            </div>
            <div style={{ flex:1, background:"rgba(255,210,0,0.05)", border:"1px solid rgba(255,210,0,0.1)", borderRadius:12, padding:"10px 14px" }}>
              <span style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color:C.muted }}>{t("weather")} · </span>
              <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.yellow }}>
                {selected.weather ? t(`weather_${selected.weather.toLowerCase()}`) : "—"}
              </span>
            </div>
          </div>
          {(selected.uphill > 0 || selected.downhill > 0) && (
            <div style={{ display:"flex", gap:10 }}>
              <div style={{ flex:1, background:C.graphite, borderRadius:12, padding:"10px 14px" }}>
                <span style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color:C.muted }}>↑ {t("uphill")} · </span>
                <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.text }}>{selected.uphill}m</span>
              </div>
              <div style={{ flex:1, background:C.graphite, borderRadius:12, padding:"10px 14px" }}>
                <span style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color:C.muted }}>↓ {t("downhill")} · </span>
                <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.text }}>{selected.downhill}m</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}