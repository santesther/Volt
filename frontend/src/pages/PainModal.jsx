import { useState, useEffect } from "react";
import api from "../api/api";
import { useLang } from "../utils/langContext";
import { muscleT } from "../utils/translations";

const C = {
  bg: "#050505", yellow: "#FFD200", red: "#FF3B30",
  graphite: "#191919", g2: "#111111", text: "#F2F2F2", muted: "#666",
  orange: "#FF8C00",
};

function painColor(value) {
  if (!value || value === 0) return C.muted;
  if (value <= 30) return C.yellow;
  if (value <= 60) return C.orange;
  return C.red;
}

function painLabel(value, lang) {
  if (!value || value === 0) return lang === "pt-BR" ? "Sem dor" : "No pain";
  if (value <= 30) return lang === "pt-BR" ? "Leve" : "Mild";
  if (value <= 60) return lang === "pt-BR" ? "Moderada" : "Moderate";
  return lang === "pt-BR" ? "Intensa" : "Intense";
}


export default function PainModal({ workoutId, onDone, onSkip }) {
  const { lang } = useLang();
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [painMap, setPainMap] = useState({});
  const [activeMuscle, setActiveMuscle] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    Promise.all([
      api.get("/muscle-groups").then(r => r.data).catch(() => []),
      api.get(`/workouts/${workoutId}/pain`).then(r => r.data).catch(() => []),
    ]).then(([muscles, existing]) => {
      setMuscleGroups(muscles);

      const map = {};
      existing.forEach(e => {
        if (e.painIntensity > 0) map[e.muscleGroupId] = e.painIntensity;
      });
      setPainMap(map);

      const firstPainful = existing.find(e => e.painIntensity > 0);
      if (firstPainful) setActiveMuscle(firstPainful.muscleGroupId);
    }).finally(() => setLoading(false));
  }, [workoutId]);

  const toggleMuscle = (id) => {
    setActiveMuscle(prev => prev === id ? null : id);
    setPainMap(prev => {
      if (prev[id] !== undefined) return prev;
      return { ...prev, [id]: 0 };
    });
  };

  const setPain = (id, value) => {
    setPainMap(prev => ({ ...prev, [id]: Number(value) }));
  };

  const removeMuscle = (id) => {
    setActiveMuscle(null);
    setPainMap(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const entries = Object.entries(painMap)
        .filter(([, v]) => v > 0)
        .map(([muscleGroupId, painIntensity]) => ({
          muscleGroupId: Number(muscleGroupId),
          painIntensity,
        }));
      await api.patch(`/workouts/${workoutId}/pain`, { entries });
    } catch (err) {
      console.error("Erro ao salvar dor:", err);
    } finally {
      setSaving(false);
      onDone();
    }
  };

  const selectedIds = Object.keys(painMap).map(Number);

  if (loading) return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", zIndex:999, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.muted }}>
        {lang === "pt-BR" ? "Carregando..." : "Loading..."}
      </div>
    </div>
  );

  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.88)",
      zIndex:999, display:"flex", alignItems:"flex-end", justifyContent:"center",
    }}>
      <div style={{
        background:"#111", borderRadius:"24px 24px 0 0",
        padding:"28px 24px 40px", width:"100%", maxWidth:480,
        border:"1px solid rgba(255,255,255,0.08)", borderBottom:"none",
        maxHeight:"85vh", overflowY:"auto",
      }}>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:6 }}>
          <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:20, color:C.text }}>
            {lang === "pt-BR" ? "Sentiu dor?" : "Any pain?"}
          </div>
          <button onClick={onSkip} style={{
            background:"none", border:"none", cursor:"pointer",
            fontFamily:"'Space Mono', monospace", fontSize:9,
            color:C.muted, letterSpacing:"0.15em", paddingTop:4,
          }}>
            {lang === "pt-BR" ? "PULAR" : "SKIP"}
          </button>
        </div>
        <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.muted, marginBottom:20, lineHeight:1.6 }}>
          {lang === "pt-BR"
            ? "Selecione os músculos e arraste o slider para indicar a intensidade da dor."
            : "Select muscles and drag the slider to indicate pain intensity."}
        </div>


        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:20 }}>
          {muscleGroups.map(m => {
            const selected = selectedIds.includes(m.id);
            const pain = painMap[m.id] ?? 0;
            const color = selected ? painColor(pain) : C.muted;
            return (
              <button key={m.id} onClick={() => toggleMuscle(m.id)} style={{
                padding:"8px 14px", borderRadius:100, cursor:"pointer",
                background: selected ? `${painColor(pain)}18` : C.graphite,
                border:`1px solid ${selected ? painColor(pain) : "rgba(255,255,255,0.08)"}`,
                fontFamily:"'DM Sans', sans-serif", fontSize:13,
                color, transition:"all 0.15s",
              }}>
                {selected && pain > 0 ? "● " : selected ? "○ " : ""}{muscleT(m.name, lang)}
                {selected && pain > 0 && (
                  <span style={{ fontFamily:"'Space Mono', monospace", fontSize:9, marginLeft:6, color }}>
                    {pain}%
                  </span>
                )}
              </button>
            );
          })}
        </div>


        {activeMuscle !== null && (
          <div style={{
            background:C.graphite, borderRadius:14, padding:"16px",
            marginBottom:20, border:`1px solid ${painColor(painMap[activeMuscle] ?? 0)}40`,
            transition:"border 0.2s",
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, fontWeight:600, color:C.text }}>
                {muscleT(muscleGroups.find(m => m.id === activeMuscle)?.name || "", lang)}
              </span>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{
                  fontFamily:"'Space Mono', monospace", fontSize:10, fontWeight:700,
                  color:painColor(painMap[activeMuscle] ?? 0),
                }}>
                  {painMap[activeMuscle] ?? 0}% — {painLabel(painMap[activeMuscle] ?? 0, lang)}
                </span>
                <button onClick={() => removeMuscle(activeMuscle)} style={{
                  background:"none", border:"none", cursor:"pointer",
                  color:C.muted, fontSize:16, lineHeight:1,
                }}>×</button>
              </div>
            </div>

            <input
              type="range" min={0} max={100} step={5}
              value={painMap[activeMuscle] ?? 0}
              onChange={e => setPain(activeMuscle, e.target.value)}
              style={{ width:"100%", accentColor:painColor(painMap[activeMuscle] ?? 0) }}
            />

            <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
              {["0", "25", "50", "75", "100"].map(v => (
                <span key={v} style={{ fontFamily:"'Space Mono', monospace", fontSize:8, color:C.muted }}>{v}%</span>
              ))}
            </div>
          </div>
        )}


        {selectedIds.length > 0 && (
          <div style={{ marginBottom:20 }}>
            <div style={{ fontFamily:"'Space Mono', monospace", fontSize:8, letterSpacing:"0.2em", color:C.muted, marginBottom:10 }}>
              {lang === "pt-BR" ? "RESUMO" : "SUMMARY"}
            </div>
            {selectedIds.map(id => {
              const m = muscleGroups.find(mg => mg.id === id);
              const pain = painMap[id] ?? 0;
              if (!m) return null;
              return (
                <div key={id} style={{ marginBottom:8 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                    <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, color:C.text }}>{muscleT(m.name, lang)}</span>
                    <span style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color:painColor(pain) }}>{pain}%</span>
                  </div>
                  <div style={{ height:3, background:"rgba(255,255,255,0.06)", borderRadius:2 }}>
                    <div style={{ width:`${pain}%`, height:"100%", background:painColor(pain), borderRadius:2, transition:"width 0.3s" }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button onClick={handleSave} disabled={saving} style={{
          width:"100%", background:saving ? "rgba(255,210,0,0.3)" : C.yellow,
          border:"none", borderRadius:14, padding:"14px",
          fontFamily:"'Space Mono', monospace", fontSize:11, fontWeight:700,
          letterSpacing:"0.2em", color:"#050505", cursor:saving ? "not-allowed" : "pointer",
        }}>
          {saving
            ? (lang === "pt-BR" ? "SALVANDO..." : "SAVING...")
            : selectedIds.length > 0
              ? (lang === "pt-BR" ? "SALVAR E CONTINUAR" : "SAVE AND CONTINUE")
              : (lang === "pt-BR" ? "SEM DOR, CONTINUAR" : "NO PAIN, CONTINUE")}
        </button>
      </div>
    </div>
  );
}