import { useState, useEffect } from "react";
import api from "../api/api";
import { C, EQUIPMENT_OPTIONS, EQUIPMENT_LABELS } from "../utils/constants";
import { SectionLabel, NumericStepper, EffortSlider } from "../utils/components";

function SetRow({ setNum, data, onChange, onRemove }) {
  return (
    <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:8 }}>
      <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color:C.muted, width:20, textAlign:"center", flexShrink:0 }}>{setNum}</div>
      <div style={{ flex:1, position:"relative" }}>
        <input type="number" placeholder="kg" value={data.weightKg}
          onChange={e => onChange({...data, weightKg: e.target.value})}
          style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"9px 10px", color:C.text, fontSize:13, fontFamily:"'DM Sans', sans-serif", outline:"none" }}
        />
        <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", fontFamily:"'Space Mono', monospace", fontSize:9, color:C.muted }}>kg</span>
      </div>
      <div style={{ flex:1, position:"relative" }}>
        <input type="number" placeholder="reps" value={data.reps}
          onChange={e => onChange({...data, reps: e.target.value})}
          style={{ width:"100%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"9px 10px", color:C.text, fontSize:13, fontFamily:"'DM Sans', sans-serif", outline:"none" }}
        />
        <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", fontFamily:"'Space Mono', monospace", fontSize:9, color:C.muted }}>rep</span>
      </div>
      <button onClick={onRemove} style={{ background:"rgba(255,59,48,0.1)", border:"1px solid rgba(255,59,48,0.2)", borderRadius:8, width:32, height:32, cursor:"pointer", color:C.red, fontSize:14, flexShrink:0 }}>×</button>
    </div>
  );
}

function ExerciseCard({ exercise, sets, onAddSet, onUpdateSet, onRemoveSet, onRemoveExercise }) {
  return (
    <div style={{ background:C.g2, borderRadius:14, padding:"14px 16px", marginBottom:10, border:"1px solid rgba(255,210,0,0.07)" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
        <span style={{ fontFamily:"'DM Sans', sans-serif", fontWeight:600, fontSize:14, color:C.text }}>{exercise.name}</span>
        <button onClick={onRemoveExercise} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted, fontSize:16 }}>×</button>
      </div>
      <div style={{ marginBottom:8 }}>
        <div style={{ display:"flex", gap:8, marginBottom:6 }}>
          <div style={{ fontFamily:"'Space Mono', monospace", fontSize:8, color:C.muted, width:20 }}>#</div>
          <div style={{ fontFamily:"'Space Mono', monospace", fontSize:8, color:C.muted, flex:1 }}>CARGA</div>
          <div style={{ fontFamily:"'Space Mono', monospace", fontSize:8, color:C.muted, flex:1 }}>REPS</div>
          <div style={{ width:32 }} />
        </div>
        {sets.map((s, i) => (
          <SetRow key={i} setNum={i+1} data={s}
            onChange={updated => onUpdateSet(i, updated)}
            onRemove={() => onRemoveSet(i)}
          />
        ))}
      </div>
      <button onClick={onAddSet} style={{
        width:"100%", background:"rgba(255,210,0,0.06)", border:"1px dashed rgba(255,210,0,0.2)",
        borderRadius:10, padding:"8px", cursor:"pointer",
        fontFamily:"'Space Mono', monospace", fontSize:9, color:C.yellow, letterSpacing:"0.15em",
      }}>+ SÉRIE</button>
    </div>
  );
}

export default function RegisterStrength({ suggestion, userId, onBack, onSave }) {
  const today = new Date().toISOString().slice(0,16);
  const [date, setDate] = useState(today);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [equipment, setEquipment] = useState("FREE_WEIGHT");
  const [effort, setEffort] = useState(5);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [showPicker, setShowPicker] = useState(null);
  const [exercisesByMuscle, setExercisesByMuscle] = useState({});
  const [loadingExercises, setLoadingExercises] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [allMuscles, setAllMuscles] = useState([]);

  const isFreestyle = !suggestion?.suggestedMuscles?.length;
  const muscles = isFreestyle ? allMuscles : (suggestion?.suggestedMuscles || []);

  useEffect(() => {
    if (isFreestyle) {
      api.get("/muscle-groups")
        .then(res => setAllMuscles(res.data))
        .catch(() => setAllMuscles([]));
    }
  }, [isFreestyle]);

  const openPicker = (muscle) => {
    const next = showPicker?.id === muscle.id ? null : muscle;
    setShowPicker(next);
    if (next && !exercisesByMuscle[muscle.id]) {
      setLoadingExercises(prev => ({...prev, [muscle.id]: true}));
      api.get(`/exercises/muscle-group/${muscle.id}`)
        .then(res => setExercisesByMuscle(prev => ({...prev, [muscle.id]: res.data})))
        .catch(() => setExercisesByMuscle(prev => ({...prev, [muscle.id]: []})))
        .finally(() => setLoadingExercises(prev => ({...prev, [muscle.id]: false})));
    }
  };

  const addExercise = (exercise) => {
    if (selectedExercises.find(e => e.exercise.id === exercise.id)) return;
    setSelectedExercises(prev => [...prev, { exercise, sets:[{weightKg:"", reps:""}] }]);
    setShowPicker(null);
  };

  const removeExercise = (id) => setSelectedExercises(prev => prev.filter(e => e.exercise.id !== id));
  const addSet = (id) => setSelectedExercises(prev => prev.map(e => e.exercise.id === id ? {...e, sets:[...e.sets, {weightKg:"", reps:""}]} : e));
  const updateSet = (id, idx, updated) => setSelectedExercises(prev => prev.map(e => e.exercise.id === id ? {...e, sets: e.sets.map((s,i) => i === idx ? updated : s)} : e));
  const removeSet = (id, idx) => setSelectedExercises(prev => prev.map(e => e.exercise.id === id ? {...e, sets: e.sets.filter((_,i) => i !== idx)} : e));

  const handleSave = async () => {
    setError(null);
    const sets = [];
    let order = 1;
    selectedExercises.forEach(({ exercise, sets: exSets }) => {
      exSets.forEach(s => {
        if (s.weightKg && s.reps)
          sets.push({ exerciseId: exercise.id, weightKg: parseFloat(s.weightKg), reps: parseInt(s.reps), order: order++ });
      });
    });
    if (sets.length === 0) { setError("Adicione ao menos uma série antes de salvar."); return; }
    try {
      setSaving(true);
      const res = await api.post("/strength-workouts", { userId, effort, date: date + ":00", durationMinutes, equipment, sets });
      setSaved(true);
      setTimeout(() => { setSaved(false); onSave(res.data.id); }, 1800);
    } catch (err) {
      setError("Erro ao salvar treino. Tente novamente.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="volt-screen">
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
        <button onClick={onBack} style={{ background:C.graphite, border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, width:40, height:40, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, color:C.text, flexShrink:0 }}>←</button>
        <div>
          <SectionLabel>Registrar Treino</SectionLabel>
          <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.02em", lineHeight:1 }}>Musculação</div>
        </div>
      </div>

      <div style={{ marginBottom:16 }}>
        <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:C.muted, textTransform:"uppercase", marginBottom:8 }}>Data e Hora</div>
        <input type="datetime-local" value={date} onChange={e => setDate(e.target.value)}
          style={{ width:"100%", background:C.graphite, border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"12px 14px", color:C.text, fontSize:13, fontFamily:"'DM Sans', sans-serif", outline:"none", colorScheme:"dark" }}
        />
      </div>

      {muscles.map(muscle => (
        <div key={muscle.id} style={{ marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:C.yellow, display:"inline-block" }} />
              <span style={{ fontFamily:"'Space Mono', monospace", fontSize:10, color:C.yellow, letterSpacing:"0.15em" }}>{muscle.name}</span>
            </div>
            <button onClick={() => openPicker(muscle)} style={{ background:"rgba(255,210,0,0.08)", border:"1px solid rgba(255,210,0,0.2)", borderRadius:100, padding:"4px 12px", cursor:"pointer", fontFamily:"'Space Mono', monospace", fontSize:9, color:C.yellow, letterSpacing:"0.1em" }}>+ EXERCÍCIO</button>
          </div>
          {showPicker?.id === muscle.id && (
            <div style={{ background:C.graphite, borderRadius:14, padding:"12px", marginBottom:10, border:"1px solid rgba(255,210,0,0.1)" }}>
              {loadingExercises[muscle.id] ? (
                <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.muted, textAlign:"center", padding:"12px 0" }}>Carregando...</div>
              ) : (
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {(exercisesByMuscle[muscle.id] || []).map(ex => {
                    const sel = !!selectedExercises.find(e => e.exercise.id === ex.id);
                    return (
                      <button key={ex.id} onClick={() => addExercise(ex)} style={{ background: sel ? "rgba(255,210,0,0.1)" : "rgba(255,255,255,0.03)", border:`1px solid ${sel ? C.yellow : "rgba(255,255,255,0.06)"}`, borderRadius:10, padding:"10px 14px", cursor:"pointer", textAlign:"left", fontFamily:"'DM Sans', sans-serif", fontSize:13, color: sel ? C.yellow : C.text }}>
                        {ex.name} {sel && <span style={{ float:"right", color:C.yellow }}>✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {selectedExercises.filter(e => e.exercise.muscleGroup?.id === muscle.id).map(({ exercise, sets }) => (
            <ExerciseCard key={exercise.id} exercise={exercise} sets={sets}
              onAddSet={() => addSet(exercise.id)}
              onUpdateSet={(i, u) => updateSet(exercise.id, i, u)}
              onRemoveSet={(i) => removeSet(exercise.id, i)}
              onRemoveExercise={() => removeExercise(exercise.id)}
            />
          ))}
        </div>
      ))}

      <div style={{ marginBottom:16 }}>
        <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:C.muted, textTransform:"uppercase", marginBottom:8 }}>Equipamento</div>
        <div style={{ display:"flex", gap:8 }}>
          {EQUIPMENT_OPTIONS.map(eq => (
            <button key={eq} onClick={() => setEquipment(eq)} style={{ flex:1, padding:"11px 6px", borderRadius:12, cursor:"pointer", background: equipment === eq ? "rgba(255,210,0,0.1)" : C.graphite, border:`1px solid ${equipment === eq ? C.yellow : "rgba(255,255,255,0.08)"}`, fontFamily:"'Space Mono', monospace", fontSize:8, letterSpacing:"0.1em", color: equipment === eq ? C.yellow : C.muted }}>
              {EQUIPMENT_LABELS[eq]}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:"flex", gap:10, marginBottom:16 }}>
        <NumericStepper label="Duração" value={durationMinutes} onChange={setDurationMinutes} min={10} max={180} unit="min" />
      </div>

      <div style={{ background:C.g2, borderRadius:16, padding:"16px", marginBottom:16, border:"1px solid rgba(255,255,255,0.05)" }}>
        <EffortSlider value={effort} onChange={setEffort} />
      </div>

      {error && <div style={{ background:"rgba(255,59,48,0.08)", border:"1px solid rgba(255,59,48,0.25)", borderRadius:12, padding:"12px 14px", marginBottom:16, fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.red }}>{error}</div>}

      <button onClick={handleSave} disabled={saving} style={{ width:"100%", background: saved ? "rgba(255,210,0,0.15)" : saving ? "rgba(255,210,0,0.4)" : C.yellow, border: saved ? `1px solid ${C.yellow}` : "none", borderRadius:14, padding:"14px", cursor: saving ? "not-allowed" : "pointer", fontFamily:"'Space Mono', monospace", fontSize:11, fontWeight:700, letterSpacing:"0.2em", color: saved ? C.yellow : "#050505", transition:"all 0.3s", marginBottom:24 }}>
        {saved ? "✓ TREINO REGISTRADO" : saving ? "SALVANDO..." : "SALVAR TREINO"}
      </button>
    </div>
  );
}
