import { useState, useEffect } from "react";
import api from "../api/api";

const C = {
  bg: "#050505", yellow: "#FFD200", red: "#FF3B30",
  graphite: "#191919", g2: "#111111",
  text: "#F2F2F2", muted: "#666",
};

function useCount(target, duration = 1000) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let s = null;
    const step = (ts) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / duration, 1);
      setV(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return v;
}

function SectionLabel({ children, color }) {
  return (
    <div style={{
      fontFamily: "'Space Mono', monospace", fontSize: 9,
      letterSpacing: "0.25em", color: color || C.muted,
      textTransform: "uppercase", marginBottom: 10,
    }}>{children}</div>
  );
}

function MuscleChip({ name, fatigue }) {
  const recovering = fatigue > 30;
  const color = recovering ? C.red : C.yellow;
  const bg = recovering ? "rgba(255,59,48,0.15)" : "rgba(255,210,0,0.1)";
  const border = recovering ? "rgba(255,59,48,0.25)" : "rgba(255,210,0,0.25)";
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:bg, border:`1px solid ${border}`, borderRadius:100, padding:"5px 11px" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:color, flexShrink:0 }} />
      <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, fontWeight:500, color:C.text }}>{name}</span>
    </div>
  );
}

function Dashboard({ onRegister, userId }) {
  const v = useCount(78);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const muscles = [
    { name:"Peito", fatigue:70 }, { name:"Tríceps", fatigue:65 },
    { name:"Costas", fatigue:10 }, { name:"Pernas", fatigue:5 },
  ];

  useEffect(() => {
    api.post(`/suggestions/${userId}`, { painfulMuscleIds: [] })
      .then(res => setSuggestion(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="volt-screen">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
        <div>
          <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.muted, marginBottom:2 }}>{greeting} ⚡</div>
          <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:26, letterSpacing:"-0.02em" }}>Esther</div>
        </div>
        <div style={{ width:42, height:42, background:C.yellow, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:16, color:"#050505" }}>E</div>
      </div>

      <div style={{ background:C.yellow, borderRadius:20, padding:"20px 22px", marginBottom:18 }}>
        <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:"rgba(0,0,0,0.45)", textTransform:"uppercase", marginBottom:6 }}>Output Level</div>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:64, lineHeight:1, color:"#050505", letterSpacing:"-0.02em" }}>{v}%</div>
        <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:"rgba(0,0,0,0.45)", marginTop:4 }}>Carga disponível</div>
      </div>

      <div style={{ marginBottom:22 }}>
        <SectionLabel>Sistema Muscular</SectionLabel>
        <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
          {muscles.map(m => <MuscleChip key={m.name} name={m.name} fatigue={m.fatigue} />)}
        </div>
      </div>

      {suggestion?.type === "REST" ? (
        <div style={{ marginBottom:18, background:"rgba(255,210,0,0.07)", border:"1px solid rgba(255,210,0,0.2)", borderRadius:16, padding:"14px 16px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:C.yellow, boxShadow:`0 0 8px ${C.yellow}` }} />
            <span style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color:C.yellow, letterSpacing:"0.2em", fontWeight:700 }}>DIA DE DESCANSO</span>
          </div>
          <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.text, lineHeight:1.6 }}>
            {suggestion.message}
          </div>
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

      <div>
        <SectionLabel>{suggestion?.type === "REST" ? "Próximo Treino" : "Sugestão de Hoje"}</SectionLabel>
        <div style={{ background:C.graphite, borderRadius:16, padding:"18px", border:"1px solid rgba(255,210,0,0.07)" }}>
          {loading ? (
            <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.muted, textAlign:"center", padding:"20px 0" }}>
              Carregando sugestão...
            </div>
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
                  REGISTRAR TREINO ▶
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const EQUIPMENT_OPTIONS = ["FREE_WEIGHT","MACHINE","MIXED"];
const EQUIPMENT_LABELS  = { FREE_WEIGHT:"Peso Livre", MACHINE:"Máquina", MIXED:"Misto" };

function NumericStepper({ label, value, onChange, min=1, max=99, unit="" }) {
  return (
    <div style={{ flex:1 }}>
      <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:C.muted, textTransform:"uppercase", marginBottom:8 }}>{label}</div>
      <div style={{ display:"flex", alignItems:"center", gap:0, background:C.graphite, borderRadius:12, border:"1px solid rgba(255,255,255,0.08)", overflow:"hidden" }}>
        <button onClick={() => onChange(Math.max(min, value - 1))} style={{ width:40, height:44, background:"none", border:"none", color:C.muted, fontSize:18, cursor:"pointer", flexShrink:0 }}>−</button>
        <div style={{ flex:1, textAlign:"center", fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:20, color:C.text }}>
          {value}<span style={{ fontSize:11, color:C.muted, fontFamily:"'DM Sans', sans-serif", fontWeight:400 }}>{unit}</span>
        </div>
        <button onClick={() => onChange(Math.min(max, value + 1))} style={{ width:40, height:44, background:"none", border:"none", color:C.yellow, fontSize:18, cursor:"pointer", flexShrink:0 }}>+</button>
      </div>
    </div>
  );
}

function EffortSlider({ value, onChange }) {
  const color = value <= 3 ? "#00C875" : value <= 6 ? C.yellow : C.red;
  const label = value <= 3 ? "Leve" : value <= 6 ? "Moderado" : value <= 8 ? "Intenso" : "Máximo";
  return (
    <div style={{ marginBottom:18 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
        <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:C.muted, textTransform:"uppercase" }}>Esforço Percebido</div>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:22, color }}>{value}</span>
          <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:11, color:C.muted }}>{label}</span>
        </div>
      </div>
      <input type="range" min="1" max="10" value={value} onChange={e => onChange(Number(e.target.value))}
        style={{ width:"100%", accentColor: color, height:4, cursor:"pointer" }}
      />
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
        <span style={{ fontFamily:"'Space Mono', monospace", fontSize:8, color:C.muted }}>1</span>
        <span style={{ fontFamily:"'Space Mono', monospace", fontSize:8, color:C.muted }}>10</span>
      </div>
    </div>
  );
}


const MOCK_EXERCISES = {
  "COSTAS":  [{id:11,name:"Puxada Frontal Aberta"},{id:12,name:"Puxada Neutra"},{id:13,name:"Remada Curvada"},{id:14,name:"Remada Unilateral"},{id:15,name:"Levantamento Terra"},{id:16,name:"Barra Fixa"}],
  "BÍCEPS":  [{id:17,name:"Rosca Direta com Barra"},{id:18,name:"Rosca Alternada"},{id:19,name:"Rosca Concentrada"},{id:20,name:"Rosca Scott"},{id:21,name:"Rosca Martelo"}],
  "PEITO":   [{id:1,name:"Supino Reto"},{id:2,name:"Supino Inclinado"},{id:3,name:"Supino Declinado"},{id:6,name:"Crucifixo"},{id:8,name:"Peck Deck"},{id:9,name:"Crossover"}],
  "TRÍCEPS": [{id:22,name:"Tríceps Pulley"},{id:23,name:"Tríceps Corda"},{id:24,name:"Tríceps Testa"},{id:25,name:"Tríceps Francês"},{id:26,name:"Mergulho"}],
  "PERNAS":  [{id:27,name:"Agachamento Livre"},{id:28,name:"Leg Press 45°"},{id:29,name:"Extensão de Pernas"},{id:30,name:"Flexão de Pernas"},{id:31,name:"Stiff"}],
  "OMBROS":  [{id:32,name:"Desenvolvimento com Halteres"},{id:33,name:"Elevação Lateral"},{id:34,name:"Elevação Frontal"},{id:35,name:"Arnold Press"}],
};

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

function RegisterStrength({ suggestion, onBack, onSave }) {
  const today = new Date().toISOString().slice(0,16);
  const [date, setDate] = useState(today);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [equipment, setEquipment] = useState("FREE_WEIGHT");
  const [effort, setEffort] = useState(5);
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [showPicker, setShowPicker] = useState(null);
  const [saved, setSaved] = useState(false);

  const availableExercises = (muscle) => MOCK_EXERCISES[muscle] || [];

  const addExercise = (muscle, exercise) => {
    if (selectedExercises.find(e => e.exercise.id === exercise.id)) return;
    setSelectedExercises(prev => [...prev, { exercise, sets:[{weightKg:"", reps:""}] }]);
    setShowPicker(null);
  };

  const removeExercise = (exerciseId) =>
    setSelectedExercises(prev => prev.filter(e => e.exercise.id !== exerciseId));

  const addSet = (exerciseId) =>
    setSelectedExercises(prev => prev.map(e =>
      e.exercise.id === exerciseId ? {...e, sets:[...e.sets, {weightKg:"", reps:""}]} : e
    ));

  const updateSet = (exerciseId, setIdx, updated) =>
    setSelectedExercises(prev => prev.map(e =>
      e.exercise.id === exerciseId
        ? {...e, sets: e.sets.map((s,i) => i === setIdx ? updated : s)}
        : e
    ));

  const removeSet = (exerciseId, setIdx) =>
    setSelectedExercises(prev => prev.map(e =>
      e.exercise.id === exerciseId
        ? {...e, sets: e.sets.filter((_,i) => i !== setIdx)}
        : e
    ));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onSave(); }, 1800);
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

      {suggestion.muscles.map(muscle => (
        <div key={muscle} style={{ marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:C.yellow, display:"inline-block" }} />
              <span style={{ fontFamily:"'Space Mono', monospace", fontSize:10, color:C.yellow, letterSpacing:"0.15em" }}>{muscle}</span>
            </div>
            <button onClick={() => setShowPicker(showPicker === muscle ? null : muscle)} style={{
              background:"rgba(255,210,0,0.08)", border:"1px solid rgba(255,210,0,0.2)",
              borderRadius:100, padding:"4px 12px", cursor:"pointer",
              fontFamily:"'Space Mono', monospace", fontSize:9, color:C.yellow, letterSpacing:"0.1em",
            }}>+ EXERCÍCIO</button>
          </div>

          {showPicker === muscle && (
            <div style={{ background:C.graphite, borderRadius:14, padding:"12px", marginBottom:10, border:"1px solid rgba(255,210,0,0.1)" }}>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {availableExercises(muscle).map(ex => (
                  <button key={ex.id} onClick={() => addExercise(muscle, ex)} style={{
                    background: selectedExercises.find(e => e.exercise.id === ex.id) ? "rgba(255,210,0,0.1)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${selectedExercises.find(e => e.exercise.id === ex.id) ? C.yellow : "rgba(255,255,255,0.06)"}`,
                    borderRadius:10, padding:"10px 14px", cursor:"pointer", textAlign:"left",
                    fontFamily:"'DM Sans', sans-serif", fontSize:13,
                    color: selectedExercises.find(e => e.exercise.id === ex.id) ? C.yellow : C.text,
                    transition:"all 0.15s",
                  }}>
                    {ex.name}
                    {selectedExercises.find(e => e.exercise.id === ex.id) && <span style={{ float:"right", color:C.yellow }}>✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedExercises
            .filter(e => availableExercises(muscle).find(ex => ex.id === e.exercise.id))
            .map(({ exercise, sets }) => (
              <ExerciseCard key={exercise.id} exercise={exercise} sets={sets}
                onAddSet={() => addSet(exercise.id)}
                onUpdateSet={(i, updated) => updateSet(exercise.id, i, updated)}
                onRemoveSet={(i) => removeSet(exercise.id, i)}
                onRemoveExercise={() => removeExercise(exercise.id)}
              />
            ))
          }
        </div>
      ))}

      <div style={{ marginBottom:16 }}>
        <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:C.muted, textTransform:"uppercase", marginBottom:8 }}>Equipamento</div>
        <div style={{ display:"flex", gap:8 }}>
          {EQUIPMENT_OPTIONS.map(eq => (
            <button key={eq} onClick={() => setEquipment(eq)} style={{
              flex:1, padding:"11px 6px", borderRadius:12, cursor:"pointer",
              background: equipment === eq ? "rgba(255,210,0,0.1)" : C.graphite,
              border: `1px solid ${equipment === eq ? C.yellow : "rgba(255,255,255,0.08)"}`,
              fontFamily:"'Space Mono', monospace", fontSize:8, letterSpacing:"0.1em",
              color: equipment === eq ? C.yellow : C.muted, transition:"all 0.2s",
            }}>{EQUIPMENT_LABELS[eq]}</button>
          ))}
        </div>
      </div>

      <div style={{ display:"flex", gap:10, marginBottom:16 }}>
        <NumericStepper label="Duração" value={durationMinutes} onChange={setDurationMinutes} min={10} max={180} unit="min" />
      </div>

      <div style={{ background:C.g2, borderRadius:16, padding:"16px", marginBottom:20, border:"1px solid rgba(255,255,255,0.05)" }}>
        <EffortSlider value={effort} onChange={setEffort} />
      </div>

      <button onClick={handleSave} style={{
        width:"100%", background: saved ? "rgba(255,210,0,0.15)" : C.yellow,
        border: saved ? `1px solid ${C.yellow}` : "none",
        borderRadius:14, padding:"14px", cursor:"pointer",
        fontFamily:"'Space Mono', monospace", fontSize:11, fontWeight:700, letterSpacing:"0.2em",
        color: saved ? C.yellow : "#050505", transition:"all 0.3s",
      }}>
        {saved ? "✓ TREINO REGISTRADO" : "SALVAR TREINO"}
      </button>
    </div>
  );
}

const ZONE_OPTIONS = ["Z1","Z2","Z3","Z4","Z5"];
const WEATHER_OPTIONS = ["SUNNY","CLOUDY","RAINY","WINDY","HOT","COLD"];
const WEATHER_LABELS  = { SUNNY:"☀️ Sol", CLOUDY:"☁️ Nublado", RAINY:"🌧️ Chuva", WINDY:"💨 Vento", HOT:"🌡️ Calor", COLD:"❄️ Frio" };
const RUNTYPE_OPTIONS = ["EASY","TEMPO","LONG_RUN","INTERVAL","RECOVERY"];
const RUNTYPE_LABELS  = { EASY:"Fácil", TEMPO:"Tempo", LONG_RUN:"Longão", INTERVAL:"Intervalado", RECOVERY:"Recuperação" };

function RegisterRun({ suggestion, onBack, onSave }) {
  const today = new Date().toISOString().slice(0,16);
  const [form, setForm] = useState({
    effort: 5, date: today,
    km: suggestion.suggestedKm || 6,
    duration: 40,
    zone: suggestion.suggestedZone || "Z2",
    uphill: 0, downhill: 0,
    weather: "SUNNY",
  });
  const [saved, setSaved] = useState(false);
  const set = f => v => setForm(p => ({...p, [f]:v}));

  const pace = form.duration > 0 && form.km > 0 ? (form.duration / form.km).toFixed(2) : "—";

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onSave(); }, 1800);
  };

  return (
    <div className="volt-screen">
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
        <NumericStepper label="Duração" value={form.duration} onChange={set("duration")} min={5} max={360} unit="min" />
      </div>

      <div style={{ marginBottom:16 }}>
        <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:C.muted, textTransform:"uppercase", marginBottom:8 }}>Zona de Esforço</div>
        <div style={{ display:"flex", gap:8 }}>
          {ZONE_OPTIONS.map(z => (
            <button key={z} onClick={() => set("zone")(z)} style={{
              flex:1, padding:"10px 4px", borderRadius:10, cursor:"pointer",
              background: form.zone === z ? "rgba(255,210,0,0.1)" : C.graphite,
              border: `1px solid ${form.zone === z ? C.yellow : "rgba(255,255,255,0.08)"}`,
              fontFamily:"'Space Mono', monospace", fontSize:10, fontWeight:700,
              color: form.zone === z ? C.yellow : C.muted, transition:"all 0.2s",
            }}>{z}</button>
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
            <button key={w} onClick={() => set("weather")(w)} style={{
              padding:"8px 12px", borderRadius:10, cursor:"pointer",
              background: form.weather === w ? "rgba(255,210,0,0.1)" : C.graphite,
              border: `1px solid ${form.weather === w ? C.yellow : "rgba(255,255,255,0.08)"}`,
              fontFamily:"'DM Sans', sans-serif", fontSize:12,
              color: form.weather === w ? C.yellow : C.muted, transition:"all 0.2s",
            }}>{WEATHER_LABELS[w]}</button>
          ))}
        </div>
      </div>

      <div style={{ background:C.g2, borderRadius:16, padding:"16px", marginBottom:20, border:"1px solid rgba(255,255,255,0.05)" }}>
        <EffortSlider value={form.effort} onChange={set("effort")} />
      </div>

      <button onClick={handleSave} style={{
        width:"100%", background: saved ? "rgba(255,210,0,0.15)" : C.yellow,
        border: saved ? `1px solid ${C.yellow}` : "none",
        borderRadius:14, padding:"14px", cursor:"pointer",
        fontFamily:"'Space Mono', monospace", fontSize:11, fontWeight:700, letterSpacing:"0.2em",
        color: saved ? C.yellow : "#050505", transition:"all 0.3s",
      }}>
        {saved ? "✓ TREINO REGISTRADO" : "SALVAR TREINO"}
      </button>
    </div>
  );
}


const HISTORY = [
  {
    id: 1, label:"PEITO", date:"QUI 05 MAR · 07:42", alert: true,
    exercises: [
      { name:"Supino Reto", muscle:"Peito", sets:["80kg×8","80kg×8","75kg×10"] },
      { name:"Crucifixo",   muscle:"Peito", sets:["14kg×12","14kg×12","12kg×15"] },
    ],
  },
  {
    id: 2, label:"COSTAS", date:"TER 04 MAR · 18:10", alert: false,
    exercises: [
      { name:"Remada Curvada", muscle:"Costas", sets:["60kg×10","60kg×10","55kg×12"] },
      { name:"Puxada Frontal",  muscle:"Costas", sets:["70kg×8","70kg×8","65kg×10"] },
    ],
  },
];

function Historico() {
  const [selected, setSelected] = useState(HISTORY[0]);
  return (
    <div className="volt-screen">
      <SectionLabel color={C.yellow}>← HISTÓRICO</SectionLabel>
      <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:52, lineHeight:1, letterSpacing:"-0.02em", marginBottom:4 }}>
        {selected.label}
      </div>
      <div style={{ fontFamily:"'Space Mono', monospace", fontSize:10, color:C.muted, marginBottom:22 }}>
        {selected.date}
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:22, overflowX:"auto", paddingBottom:4 }}>
        {HISTORY.map(h => (
          <button key={h.id} onClick={() => setSelected(h)} style={{
            background: selected.id === h.id ? C.yellow : C.graphite,
            color: selected.id === h.id ? "#050505" : C.muted,
            border: "none", borderRadius:100, padding:"6px 14px", cursor:"pointer",
            fontFamily:"'Space Mono', monospace", fontSize:9, letterSpacing:"0.15em",
            whiteSpace:"nowrap", flexShrink:0,
          }}>{h.label}</button>
        ))}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:16 }}>
        {selected.exercises.map((ex, i) => (
          <div key={i} style={{ background:C.graphite, borderRadius:14, padding:"14px 16px", border:"1px solid rgba(255,210,0,0.05)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <span style={{ fontFamily:"'DM Sans', sans-serif", fontWeight:600, fontSize:14, color:C.text }}>{ex.name}</span>
              <span style={{ background:"rgba(255,210,0,0.08)", color:C.yellow, borderRadius:6, padding:"2px 8px", fontFamily:"'Space Mono', monospace", fontSize:9 }}>{ex.muscle}</span>
            </div>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {ex.sets.map((s, j) => (
                <span key={j} style={{ background:"rgba(255,255,255,0.04)", borderRadius:6, padding:"4px 8px", fontFamily:"'Space Mono', monospace", fontSize:10, color:C.muted }}>{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selected.alert && (
        <div style={{ background:"rgba(255,59,48,0.08)", border:"1px solid rgba(255,59,48,0.2)", borderRadius:12, padding:"12px 14px" }}>
          <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color:C.red, letterSpacing:"0.15em", marginBottom:4 }}>VOLT ALERT ⚡</div>
          <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, color:C.text, lineHeight:1.6 }}>
            Carga máxima detectada. Peito + Tríceps em recuperação por 48–72h.
          </div>
        </div>
      )}
    </div>
  );
}

function ChargeMap() {
  const treinos = useCount(5);
  const recarga = useCount(2);
  const muscles = [
    { name:"Peito",    fatigue:85, recovering:true  },
    { name:"Tríceps",  fatigue:70, recovering:true  },
    { name:"Costas",   fatigue:10, recovering:false },
    { name:"Bíceps",   fatigue:15, recovering:false },
    { name:"Pernas",   fatigue:5,  recovering:false },
    { name:"Ombros",   fatigue:0,  recovering:false },
  ];

  return (
    <div className="volt-screen">
      <SectionLabel>Charge Map</SectionLabel>
      <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:44, lineHeight:1, letterSpacing:"-0.02em", marginBottom:22 }}>
        Esta<br/>Semana
      </div>

      <div style={{ background:C.g2, borderRadius:18, padding:20, marginBottom:14, border:"1px solid rgba(255,210,0,0.06)", display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
        <svg width="80" height="140" viewBox="0 0 60 120" fill="none">
          <circle cx="30" cy="10" r="9" fill={C.graphite} stroke="rgba(255,210,0,0.3)" strokeWidth="1.5"/>
          <rect x="18" y="22" width="24" height="32" rx="4" fill={C.red} opacity="0.75"/>
          <rect x="6"  y="22" width="10" height="28" rx="4" fill={C.graphite} stroke="rgba(255,210,0,0.15)" strokeWidth="1"/>
          <rect x="44" y="22" width="10" height="28" rx="4" fill={C.graphite} stroke="rgba(255,210,0,0.15)" strokeWidth="1"/>
          <rect x="19" y="57" width="10" height="36" rx="4" fill={C.yellow} opacity="0.9"/>
          <rect x="31" y="57" width="10" height="36" rx="4" fill={C.yellow} opacity="0.9"/>
        </svg>
        <div style={{ display:"flex", justifyContent:"space-between", width:"100%" }}>
          <span style={{ fontFamily:"'Space Mono', monospace", fontSize:9, background:"rgba(255,59,48,0.12)", color:C.red, padding:"3px 8px", borderRadius:6 }}>● Recarregando</span>
          <span style={{ fontFamily:"'Space Mono', monospace", fontSize:9, background:"rgba(255,210,0,0.1)", color:C.yellow, padding:"3px 8px", borderRadius:6 }}>● Charged</span>
        </div>
      </div>

      <div style={{ display:"flex", gap:10, marginBottom:14 }}>
        <div style={{ flex:1, background:C.g2, borderRadius:14, padding:"14px 16px", border:"1px solid rgba(255,210,0,0.06)" }}>
          <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:38, color:C.yellow, lineHeight:1 }}>{treinos}</div>
          <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:11, color:C.muted, marginTop:4 }}>treinos</div>
        </div>
        <div style={{ flex:1, background:C.g2, borderRadius:14, padding:"14px 16px", border:"1px solid rgba(255,210,0,0.06)" }}>
          <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:38, color:C.red, lineHeight:1 }}>{recarga}</div>
          <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:11, color:C.muted, marginTop:4 }}>em recarga</div>
        </div>
      </div>

      <div style={{ background:C.g2, borderRadius:14, padding:"14px 16px", border:"1px solid rgba(255,210,0,0.06)", marginBottom:14 }}>
        <SectionLabel>Fadiga por Músculo</SectionLabel>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {muscles.map(m => (
            <div key={m.name} style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, color:C.text, width:60, flexShrink:0 }}>{m.name}</div>
              <div style={{ flex:1, height:4, background:"rgba(255,255,255,0.06)", borderRadius:2, overflow:"hidden" }}>
                <div style={{ width:`${m.fatigue}%`, height:"100%", background: m.recovering ? C.red : C.yellow, borderRadius:2, transition:"width 1s ease" }} />
              </div>
              <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color: m.recovering ? C.red : C.muted, width:30, textAlign:"right" }}>{m.fatigue}%</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:C.graphite, borderRadius:12, padding:"12px 14px", border:"1px solid rgba(255,210,0,0.06)" }}>
        <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, color:C.text, lineHeight:1.6 }}>
          <strong style={{ color:C.text }}>VOLT sugere:</strong>{" "}
          <span style={{ color:C.muted }}>Corrida leve 30min. Pernas com carga máxima amanhã. ⚡</span>
        </span>
      </div>
    </div>
  );
}

const GOALS = ["HYPERTROPHY","FAT_LOSS","STRENGTH","ENDURANCE","FITNESS","REHABILITATION"];
const GOAL_LABELS = {
  HYPERTROPHY:"Hipertrofia", FAT_LOSS:"Emagrecimento", STRENGTH:"Força",
  ENDURANCE:"Resistência", FITNESS:"Condicionamento", REHABILITATION:"Reabilitação",
};

function Field({ label, value, onChange, type="text", placeholder="" }) {
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:C.muted, textTransform:"uppercase", marginBottom:6 }}>{label}</div>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={{
          width:"100%", background:C.graphite, border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:12, padding:"12px 14px", color:C.text, fontSize:14,
          fontFamily:"'DM Sans', sans-serif", outline:"none",
          transition:"border-color 0.2s",
        }}
        onFocus={e => e.target.style.borderColor = "rgba(255,210,0,0.4)"}
        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
      />
    </div>
  );
}

function SaveButton({ onClick, saved }) {
  return (
    <button onClick={onClick} style={{
      width:"100%", background: saved ? "rgba(255,210,0,0.15)" : C.yellow,
      border: saved ? `1px solid ${C.yellow}` : "none",
      borderRadius:14, padding:"14px", cursor:"pointer",
      fontFamily:"'Space Mono', monospace", fontSize:11,
      fontWeight:700, letterSpacing:"0.2em",
      color: saved ? C.yellow : "#050505",
      transition:"all 0.3s",
    }}>
      {saved ? "✓ SALVO" : "SALVAR ALTERAÇÕES"}
    </button>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ background:C.g2, borderRadius:18, padding:"18px 16px", border:"1px solid rgba(255,255,255,0.05)", marginBottom:14 }}>
      <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:16, marginBottom:16, color:C.text }}>{title}</div>
      {children}
    </div>
  );
}

function Perfil({ onOpenSettings, onLogout }) {
  const [photo, setPhoto] = useState(null);
  const [form, setForm] = useState({ name:"Esther", height:"1.65", weight:"60", dateOfBirth:"2000-03-06", gender:"F", goal:"HYPERTROPHY" });
  const [savedInfo, setSavedInfo] = useState(false);
  const [activeGoal, setActiveGoal] = useState(form.goal);

  const set = (field) => (val) => setForm(f => ({ ...f, [field]: val }));

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhoto(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const saveInfo = () => {
    setSavedInfo(true);
    setTimeout(() => setSavedInfo(false), 2500);
  };

  return (
    <div className="volt-screen">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
        <div>
          <SectionLabel>Perfil</SectionLabel>
          <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:32, letterSpacing:"-0.02em" }}>
            Suas Informações
          </div>
        </div>
        <button onClick={onOpenSettings} style={{
          background:C.graphite, border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:12, width:42, height:42, cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:18, transition:"border-color 0.2s", marginTop:4,
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,210,0,0.4)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
          title="Configurações"
        >⚙️</button>
      </div>

      <div style={{ display:"flex", justifyContent:"center", marginBottom:24 }}>
        <label style={{ cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
          <input type="file" accept="image/*" onChange={handlePhoto} style={{ display:"none" }} />
          <div style={{
            width:90, height:90, borderRadius:"50%",
            background: photo ? "transparent" : C.graphite,
            border:`2px solid ${photo ? C.yellow : "rgba(255,210,0,0.2)"}`,
            display:"flex", alignItems:"center", justifyContent:"center",
            overflow:"hidden", position:"relative", transition:"border-color 0.2s",
          }}>
            {photo
              ? <img src={photo} alt="perfil" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              : <span style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:32, color:C.yellow }}>E</span>
            }
            <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center", opacity:0, transition:"opacity 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0}
            ><span style={{ fontSize:20 }}>📷</span></div>
          </div>
          <span style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color:C.yellow, letterSpacing:"0.2em" }}>
            {photo ? "TROCAR FOTO" : "ADICIONAR FOTO"}
          </span>
        </label>
      </div>

      <Section title="Dados Pessoais">
        <Field label="Nome" value={form.name} onChange={set("name")} />
        <div style={{ display:"flex", gap:10 }}>
          <div style={{ flex:1 }}><Field label="Altura (m)" value={form.height} onChange={set("height")} placeholder="1.70" /></div>
          <div style={{ flex:1 }}><Field label="Peso (kg)"  value={form.weight} onChange={set("weight")} placeholder="70" /></div>
        </div>
        <Field label="Data de Nascimento" value={form.dateOfBirth} onChange={set("dateOfBirth")} type="date" />
        <div>
          <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:C.muted, textTransform:"uppercase", marginBottom:6 }}>Gênero</div>
          <div style={{ display:"flex", gap:8 }}>
            {["F","M"].map(g => (
              <button key={g} onClick={() => set("gender")(g)} style={{
                flex:1, padding:"12px", borderRadius:12, cursor:"pointer",
                background: form.gender === g ? C.yellow : C.graphite,
                color: form.gender === g ? "#050505" : C.muted,
                border: form.gender === g ? "none" : "1px solid rgba(255,255,255,0.08)",
                fontFamily:"'Space Mono', monospace", fontSize:11, fontWeight:700, transition:"all 0.2s",
              }}>{g === "F" ? "Fem" : "Masc"}</button>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 18 }}>
          <SaveButton onClick={saveInfo} saved={savedInfo} />
        </div>
      </Section>

      <Section title="Objetivo de Treino">
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:14 }}>
          {GOALS.map(g => (
            <button key={g} onClick={() => { setActiveGoal(g); set("goal")(g); }} style={{
              background: activeGoal === g ? "rgba(255,210,0,0.1)" : C.graphite,
              border: `1px solid ${activeGoal === g ? C.yellow : "rgba(255,255,255,0.06)"}`,
              borderRadius:12, padding:"12px 16px", cursor:"pointer",
              display:"flex", justifyContent:"space-between", alignItems:"center", transition:"all 0.2s",
            }}>
              <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:14, fontWeight:500, color: activeGoal === g ? C.yellow : C.text }}>
                {GOAL_LABELS[g]}
              </span>
              {activeGoal === g && <span style={{ color:C.yellow, fontSize:14 }}>✓</span>}
            </button>
          ))}
        </div>
        <SaveButton onClick={saveInfo} saved={savedInfo} />
      </Section>

      <button onClick={onLogout} style={{
        width:"100%", background:"none", border:"1px solid rgba(255,255,255,0.08)",
        borderRadius:14, padding:"14px", cursor:"pointer", marginBottom:14,
        fontFamily:"'Space Mono', monospace", fontSize:10, fontWeight:700,
        letterSpacing:"0.2em", color:C.muted, transition:"all 0.2s",
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,59,48,0.4)"; e.currentTarget.style.color = C.red; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = C.muted; }}
      >
        SAIR DA CONTA
      </button>
    </div>
  );
}

function Configuracoes({ onBack }) {
  const [email, setEmail] = useState("esther@email.com");
  const [savedEmail, setSavedEmail] = useState(false);
  const [passwords, setPasswords] = useState({ current:"", next:"", confirm:"" });
  const [savedPass, setSavedPass] = useState(false);
  const [passError, setPassError] = useState("");

  const saveEmail = () => { setSavedEmail(true); setTimeout(() => setSavedEmail(false), 2500); };

  const savePassword = () => {
    setPassError("");
    if (!passwords.current) return setPassError("Informe a senha atual.");
    if (passwords.next.length < 8) return setPassError("Nova senha deve ter pelo menos 8 caracteres.");
    if (passwords.next !== passwords.confirm) return setPassError("As senhas não coincidem.");
    setSavedPass(true);
    setPasswords({ current:"", next:"", confirm:"" });
    setTimeout(() => setSavedPass(false), 2500);
  };

  return (
    <div className="volt-screen">
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:28 }}>
        <button onClick={onBack} style={{
          background:C.graphite, border:"1px solid rgba(255,255,255,0.08)",
          borderRadius:12, width:40, height:40, cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:16, color:C.text, transition:"border-color 0.2s", flexShrink:0,
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,210,0,0.4)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
        >←</button>
        <div>
          <SectionLabel>Perfil</SectionLabel>
          <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:28, letterSpacing:"-0.02em", lineHeight:1 }}>
            Configurações
          </div>
        </div>
      </div>

      <Section title="Endereço de Email">
        <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, color:C.muted, marginBottom:14, lineHeight:1.6 }}>
          Seu email é usado para login e notificações. Ao alterar, você precisará fazer login novamente.
        </div>
        <Field label="Novo email" value={email} onChange={setEmail} type="email" />
        <SaveButton onClick={saveEmail} saved={savedEmail} />
      </Section>

      <Section title="Trocar Senha">
        <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, color:C.muted, marginBottom:14, lineHeight:1.6 }}>
          Use uma senha com pelo menos 8 caracteres.
        </div>
        <Field label="Senha atual" value={passwords.current} onChange={v => setPasswords(p => ({...p, current:v}))} type="password" />
        <Field label="Nova senha"  value={passwords.next}    onChange={v => setPasswords(p => ({...p, next:v}))}    type="password" />
        <Field label="Confirmar nova senha" value={passwords.confirm} onChange={v => setPasswords(p => ({...p, confirm:v}))} type="password" />
        {passError && <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, color:C.red, marginBottom:12 }}>{passError}</div>}
        <SaveButton onClick={savePassword} saved={savedPass} />
      </Section>

      <Section title="Zona de Perigo">
        <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, color:C.muted, marginBottom:14, lineHeight:1.6 }}>
          Ações irreversíveis. Proceda com cautela.
        </div>
        <button style={{
          width:"100%", background:"rgba(255,59,48,0.08)", border:"1px solid rgba(255,59,48,0.25)",
          borderRadius:14, padding:"13px", cursor:"pointer",
          fontFamily:"'Space Mono', monospace", fontSize:10, fontWeight:700,
          letterSpacing:"0.15em", color:C.red, transition:"background 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,59,48,0.15)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,59,48,0.08)"}
        >
          EXCLUIR CONTA
        </button>
      </Section>
    </div>
  );
}

const TABS = [
  { id:"dashboard", icon:"⚡",  label:"Dashboard" },
  { id:"historico", icon:"📋", label:"Histórico"  },
  { id:"charge",    icon:"🗺️", label:"Charge Map" },
  { id:"perfil",    icon:"👤", label:"Perfil"     },
];

export default function VoltApp({ userId, onLogout }) {
  const [tab, setTab] = useState("dashboard");
  const [showSettings, setShowSettings] = useState(false);
  const [registering, setRegistering] = useState(null);

  const renderTab = () => {
    if (registering) {
      const back = () => setRegistering(null);
      const save = () => setRegistering(null);
      if (registering.type === "STRENGTH") return <RegisterStrength suggestion={registering} onBack={back} onSave={save} />;
      if (registering.type === "RUN")      return <RegisterRun      suggestion={registering} onBack={back} onSave={save} />;
    }
    if (tab === "dashboard") return <Dashboard onRegister={s => setRegistering(s)} userId={userId} />;
    if (tab === "historico") return <Historico />;
    if (tab === "charge")    return <ChargeMap />;
    if (tab === "perfil" && showSettings) return <Configuracoes onBack={() => setShowSettings(false)} />;
    if (tab === "perfil")    return <Perfil onOpenSettings={() => setShowSettings(true)} onLogout={onLogout} />;
  };

  return (
    <>
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
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background:"none", border:"none", cursor:"pointer",
              display:"flex", flexDirection:"column", alignItems:"center", gap:4,
              opacity: tab === t.id ? 1 : 0.3,
            }}>
              <span style={{ fontSize:20 }}>{t.icon}</span>
              <span style={{
                fontFamily:"'Space Mono', monospace", fontSize:8, letterSpacing:"0.1em",
                color: tab === t.id ? C.yellow : C.muted,
              }}>
                {t.label.toUpperCase()}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}