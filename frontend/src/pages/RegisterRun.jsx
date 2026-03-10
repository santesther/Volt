import { useState, useEffect } from "react";
import api from "../api/api";
import { C, ZONE_OPTIONS, WEATHER_OPTIONS, WEATHER_LABELS, RUNTYPE_OPTIONS, RUNTYPE_LABELS } from "../utils/constants";
import { SectionLabel, NumericStepper, DurationStepper, EffortSlider } from "../utils/components";

function PainfulMusclesModal({ workoutId, userId, onDone }) {
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/muscle-groups")
      .then(res => setMuscleGroups(res.data))
      .catch(err => console.error(err));
  }, []);

  const toggle = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch(`/run-workouts/${workoutId}/painful-muscles`, selected);
    } catch (err) {
      console.error("Erro ao salvar músculos doloridos:", err);
    } finally {
      setSaving(false);
      onDone();
    }
  };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:999, display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
      <div style={{ background:"#111", borderRadius:"24px 24px 0 0", padding:"28px 24px 40px", width:"100%", maxWidth:480, border:"1px solid rgba(255,255,255,0.08)", borderBottom:"none" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:20, color:C.text, marginBottom:6 }}>Algum músculo doeu?</div>
        <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.muted, marginBottom:20, lineHeight:1.6 }}>
          Selecione os músculos que ficaram doloridos/pesados durante ou após a corrida. Isso ajuda o motor de sugestões a evitá-los nos próximos treinos.
        </div>

        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:24 }}>
          {muscleGroups.map(m => {
            const active = selected.includes(m.id);
            return (
              <button key={m.id} onClick={() => toggle(m.id)} style={{
                padding:"8px 14px", borderRadius:100, cursor:"pointer",
                background: active ? "rgba(255,59,48,0.12)" : C.graphite,
                border:`1px solid ${active ? C.red : "rgba(255,255,255,0.08)"}`,
                fontFamily:"'DM Sans', sans-serif", fontSize:13,
                color: active ? C.red : C.muted, transition:"all 0.15s",
              }}>
                {active ? "🔴 " : ""}{m.name}
              </button>
            );
          })}
        </div>

        <button onClick={handleSave} disabled={saving} style={{
          width:"100%", background: saving ? "rgba(255,210,0,0.3)" : C.yellow,
          border:"none", borderRadius:14, padding:"14px",
          fontFamily:"'Space Mono', monospace", fontSize:11, fontWeight:700,
          letterSpacing:"0.2em", color:"#050505", cursor: saving ? "not-allowed" : "pointer",
        }}>
          {saving ? "SALVANDO..." : selected.length > 0 ? "SALVAR E CONTINUAR" : "NENHUM — CONTINUAR"}
        </button>
      </div>
    </div>
  );
}

export default function RegisterRun({ suggestion, userId, onBack, onSave }) {
  const today = new Date().toISOString().slice(0,16);
  const [form, setForm] = useState({
    effort: 5, date: today,
    km: suggestion.suggestedKm || 6,
    duration: 40,
    zone: suggestion.suggestedZone || "Z2",
    uphill: 0, downhill: 0,
    weather: "SUNNY",
    runType: suggestion.runType || "EASY",
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showPainModal, setShowPainModal] = useState(false);
  const [savedWorkoutId, setSavedWorkoutId] = useState(null);
  const set = f => v => setForm(p => ({...p, [f]:v}));

  const pace = form.duration > 0 && form.km > 0 ? (form.duration / form.km).toFixed(2) : "—";

  const handleSave = async () => {
    setError(null);
    try {
      setSaving(true);
      const res = await api.post("/run-workouts", {
        userId, effort: form.effort, date: form.date + ":00",
        km: form.km, duration: form.duration, zone: form.zone,
        uphill: form.uphill, downhill: form.downhill,
        weather: form.weather, runType: form.runType,
        painfulMuscleIds: [],
      });
      setSaved(true);
      setSavedWorkoutId(res.data.id);
      setTimeout(() => setShowPainModal(true), 800);
    } catch (err) {
      setError("Erro ao salvar corrida. Tente novamente.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleModalDone = () => {
    setShowPainModal(false);
    onSave(savedWorkoutId);
  };

  return (
    <div className="volt-screen">
      {showPainModal && (
        <PainfulMusclesModal
          workoutId={savedWorkoutId}
          userId={userId}
          onDone={handleModalDone}
        />
      )}

      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
        <button onClick={onBack} style={{ background:C.graphite, border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, width:40, height:40, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, color:C.text, flexShrink:0 }}>←</button>
        <div>
          <SectionLabel>Registrar Treino</SectionLabel>
          <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.02em", lineHeight:1 }}>Corrida</div>
        </div>
      </div>

      <div style={{ background:`linear-gradient(135deg, #1A1400, ${C.graphite})`, borderRadius:18, padding:"16px 20px", marginBottom:16, border:"1px solid rgba(255,210,0,0.1)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color:C.muted, letterSpacing:"0.2em", marginBottom:4 }}>PACE ESTIMADO</div>
          <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:36, color:C.yellow, lineHeight:1 }}>{pace}<span style={{ fontSize:13, color:C.muted, fontWeight:400 }}> min/km</span></div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color:C.muted, letterSpacing:"0.15em", marginBottom:4 }}>ZONA</div>
          <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:22, color:C.text }}>{form.zone}</div>
        </div>
      </div>

      <div style={{ marginBottom:16 }}>
        <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:C.muted, textTransform:"uppercase", marginBottom:8 }}>Data e Hora</div>
        <input type="datetime-local" value={form.date} onChange={e => set("date")(e.target.value)}
          style={{ width:"100%", background:C.graphite, border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"12px 14px", color:C.text, fontSize:13, fontFamily:"'DM Sans', sans-serif", outline:"none", colorScheme:"dark" }}
        />
      </div>

      <div style={{ display:"flex", gap:10, marginBottom:16 }}>
        <NumericStepper label="Distância" value={form.km} onChange={set("km")} min={1} max={100} unit="km" />
        <DurationStepper label="Duração" value={form.duration} onChange={set("duration")} />
      </div>

      <div style={{ marginBottom:16 }}>
        <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:C.muted, textTransform:"uppercase", marginBottom:8 }}>Zona de Esforço</div>
        <div style={{ display:"flex", gap:8 }}>
          {ZONE_OPTIONS.map(z => (
            <button key={z} onClick={() => set("zone")(z)} style={{ flex:1, padding:"10px 4px", borderRadius:10, cursor:"pointer", background: form.zone === z ? "rgba(255,210,0,0.1)" : C.graphite, border:`1px solid ${form.zone === z ? C.yellow : "rgba(255,255,255,0.08)"}`, fontFamily:"'Space Mono', monospace", fontSize:10, fontWeight:700, color: form.zone === z ? C.yellow : C.muted }}>{z}</button>
          ))}
        </div>
      </div>

      <div style={{ display:"flex", gap:10, marginBottom:16 }}>
        <NumericStepper label="Subida (m)" value={form.uphill} onChange={set("uphill")} min={0} max={5000} unit="m" />
        <NumericStepper label="Descida (m)" value={form.downhill} onChange={set("downhill")} min={0} max={5000} unit="m" />
      </div>

      <div style={{ marginBottom:16 }}>
        <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:C.muted, textTransform:"uppercase", marginBottom:8 }}>Clima</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {WEATHER_OPTIONS.map(w => (
            <button key={w} onClick={() => set("weather")(w)} style={{ padding:"8px 12px", borderRadius:10, cursor:"pointer", background: form.weather === w ? "rgba(255,210,0,0.1)" : C.graphite, border:`1px solid ${form.weather === w ? C.yellow : "rgba(255,255,255,0.08)"}`, fontFamily:"'DM Sans', sans-serif", fontSize:12, color: form.weather === w ? C.yellow : C.muted }}>{WEATHER_LABELS[w]}</button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom:16 }}>
        <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:C.muted, textTransform:"uppercase", marginBottom:8 }}>Tipo de Corrida</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {RUNTYPE_OPTIONS.map(r => (
            <button key={r} onClick={() => set("runType")(r)} style={{ padding:"8px 12px", borderRadius:10, cursor:"pointer", background: form.runType === r ? "rgba(255,210,0,0.1)" : C.graphite, border:`1px solid ${form.runType === r ? C.yellow : "rgba(255,255,255,0.08)"}`, fontFamily:"'DM Sans', sans-serif", fontSize:12, color: form.runType === r ? C.yellow : C.muted }}>{RUNTYPE_LABELS[r]}</button>
          ))}
        </div>
      </div>

      <div style={{ background:C.g2, borderRadius:16, padding:"16px", marginBottom:20, border:"1px solid rgba(255,255,255,0.05)" }}>
        <EffortSlider value={form.effort} onChange={set("effort")} />
      </div>

      {error && <div style={{ background:"rgba(255,59,48,0.08)", border:"1px solid rgba(255,59,48,0.25)", borderRadius:12, padding:"12px 14px", marginBottom:16, fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.red }}>{error}</div>}

      <button onClick={handleSave} disabled={saving || saved} style={{ width:"100%", background: saved ? "rgba(255,210,0,0.15)" : saving ? "rgba(255,210,0,0.4)" : C.yellow, border: saved ? `1px solid ${C.yellow}` : "none", borderRadius:14, padding:"14px", cursor: saving || saved ? "not-allowed" : "pointer", fontFamily:"'Space Mono', monospace", fontSize:11, fontWeight:700, letterSpacing:"0.2em", color: saved ? C.yellow : "#050505", transition:"all 0.3s", marginBottom:24 }}>
        {saved ? "✓ TREINO REGISTRADO" : saving ? "SALVANDO..." : "SALVAR TREINO"}
      </button>
    </div>
  );
}