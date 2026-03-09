import { useState, useEffect } from "react";
import api from "../api/api";

const C = {
  bg: "#050505", yellow: "#FFD200", red: "#FF3B30",
  graphite: "#191919", g2: "#111111", text: "#F2F2F2", muted: "#666",
};

const DAYS = [
  { key: "MONDAY",    label: "SEG" },
  { key: "TUESDAY",   label: "TER" },
  { key: "WEDNESDAY", label: "QUA" },
  { key: "THURSDAY",  label: "QUI" },
  { key: "FRIDAY",    label: "SEX" },
  { key: "SATURDAY",  label: "SAB" },
  { key: "SUNDAY",    label: "DOM" },
];

const STEPS = ["Dias", "Treinos", "Confirmar"];

function SectionLabel({ children }) {
  return (
    <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, letterSpacing:"0.25em", color:C.muted, textTransform:"uppercase", marginBottom:10 }}>
      {children}
    </div>
  );
}

function StepDays({ selectedDays, onToggle }) {
  return (
    <div>
      <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.muted, marginBottom:20, lineHeight:1.6 }}>
        Selecione os dias em que você treina normalmente.
      </div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
        {DAYS.map(d => {
          const active = selectedDays.includes(d.key);
          return (
            <button key={d.key} onClick={() => onToggle(d.key)} style={{
              flex:"1 1 calc(14% - 8px)", minWidth:44, padding:"14px 6px",
              borderRadius:12, cursor:"pointer",
              background: active ? C.yellow : C.graphite,
              border: active ? "none" : "1px solid rgba(255,255,255,0.08)",
              fontFamily:"'Space Mono', monospace", fontSize:10, fontWeight:700,
              color: active ? "#050505" : C.muted, transition:"all 0.15s",
            }}>
              {d.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepWorkouts({ selectedDays, dayConfigs, onUpdateDay, muscleGroups }) {
  const [openDay, setOpenDay] = useState(selectedDays[0] || null);

  const toggleType = (dayKey, type) => {
    const current = dayConfigs[dayKey] || { types: [], muscles: [] };
    const types = current.types.includes(type)
      ? current.types.filter(t => t !== type)
      : [...current.types, type];
    const muscles = types.includes("STRENGTH") ? current.muscles : [];
    onUpdateDay(dayKey, { ...current, types, muscles });
  };

  const toggleMuscle = (dayKey, muscleId) => {
    const current = dayConfigs[dayKey] || { types: [], muscles: [] };
    const muscles = current.muscles.includes(muscleId)
      ? current.muscles.filter(id => id !== muscleId)
      : [...current.muscles, muscleId];
    onUpdateDay(dayKey, { ...current, muscles });
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.muted, marginBottom:8, lineHeight:1.6 }}>
        Configure o que você faz em cada dia.
      </div>
      {selectedDays.map(dayKey => {
        const dayLabel = DAYS.find(d => d.key === dayKey)?.label;
        const config = dayConfigs[dayKey] || { types: [], muscles: [] };
        const isOpen = openDay === dayKey;

        return (
          <div key={dayKey} style={{ background:C.g2, borderRadius:16, border:`1px solid ${isOpen ? "rgba(255,210,0,0.2)" : "rgba(255,255,255,0.05)"}`, overflow:"hidden", transition:"border 0.2s" }}>
            <div onClick={() => setOpenDay(isOpen ? null : dayKey)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 16px", cursor:"pointer" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontFamily:"'Space Mono', monospace", fontSize:11, fontWeight:700, color: isOpen ? C.yellow : C.text }}>{dayLabel}</span>
                {config.types.length > 0 && (
                  <div style={{ display:"flex", gap:6 }}>
                    {config.types.map(t => (
                      <span key={t} style={{ background:"rgba(255,210,0,0.1)", border:"1px solid rgba(255,210,0,0.2)", borderRadius:100, padding:"2px 8px", fontFamily:"'Space Mono', monospace", fontSize:8, color:C.yellow }}>
                        {t === "STRENGTH" ? "💪" : t === "RUN" ? "🏃" : "😴"}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <span style={{ color:C.muted, fontSize:12 }}>{isOpen ? "▲" : "▼"}</span>
            </div>

            {isOpen && (
              <div style={{ padding:"0 16px 16px" }}>
                <SectionLabel>Tipo de Treino</SectionLabel>
                <div style={{ display:"flex", gap:8, marginBottom:14 }}>
                  {[
                    { key:"STRENGTH", icon:"💪", label:"Musculação" },
                    { key:"RUN",      icon:"🏃", label:"Corrida"    },
                    { key:"REST",     icon:"😴", label:"Descanso"   },
                  ].map(t => {
                    const active = config.types.includes(t.key);
                    return (
                      <button key={t.key} onClick={() => toggleType(dayKey, t.key)} style={{
                        flex:1, padding:"10px 6px", borderRadius:12, cursor:"pointer",
                        background: active ? "rgba(255,210,0,0.1)" : C.graphite,
                        border:`1px solid ${active ? C.yellow : "rgba(255,255,255,0.08)"}`,
                        fontFamily:"'DM Sans', sans-serif", fontSize:12, fontWeight:500,
                        color: active ? C.yellow : C.muted, transition:"all 0.15s",
                        display:"flex", flexDirection:"column", alignItems:"center", gap:4,
                      }}>
                        <span style={{ fontSize:16 }}>{t.icon}</span>
                        <span style={{ fontFamily:"'Space Mono', monospace", fontSize:8, letterSpacing:"0.1em" }}>{t.label.toUpperCase()}</span>
                      </button>
                    );
                  })}
                </div>

                {config.types.includes("STRENGTH") && (
                  <>
                    <SectionLabel>Grupos Musculares</SectionLabel>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                      {muscleGroups.map(m => {
                        const active = config.muscles.includes(m.id);
                        return (
                          <button key={m.id} onClick={() => toggleMuscle(dayKey, m.id)} style={{
                            padding:"6px 12px", borderRadius:100, cursor:"pointer",
                            background: active ? "rgba(255,210,0,0.1)" : "rgba(255,255,255,0.04)",
                            border:`1px solid ${active ? C.yellow : "rgba(255,255,255,0.08)"}`,
                            fontFamily:"'DM Sans', sans-serif", fontSize:12,
                            color: active ? C.yellow : C.muted, transition:"all 0.15s",
                          }}>
                            {m.name}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function StepReview({ selectedDays, dayConfigs, muscleGroups }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
      <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.muted, marginBottom:8, lineHeight:1.6 }}>
        Revise seu plano antes de confirmar.
      </div>
      {selectedDays.map(dayKey => {
        const dayLabel = DAYS.find(d => d.key === dayKey)?.label;
        const config = dayConfigs[dayKey] || { types: [], muscles: [] };
        const muscleNames = config.muscles
          .map(id => muscleGroups.find(m => m.id === id)?.name)
          .filter(Boolean).join(", ");

        return (
          <div key={dayKey} style={{ background:C.g2, borderRadius:14, padding:"14px 16px", border:"1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <span style={{ fontFamily:"'Space Mono', monospace", fontSize:11, fontWeight:700, color:C.yellow }}>{dayLabel}</span>
              <div style={{ display:"flex", gap:6 }}>
                {config.types.map(t => (
                  <span key={t} style={{ background:"rgba(255,210,0,0.08)", border:"1px solid rgba(255,210,0,0.15)", borderRadius:100, padding:"2px 8px", fontFamily:"'Space Mono', monospace", fontSize:8, color:C.yellow }}>
                    {t === "STRENGTH" ? "💪 MUSCULAÇÃO" : t === "RUN" ? "🏃 CORRIDA" : "😴 DESCANSO"}
                  </span>
                ))}
              </div>
            </div>
            {muscleNames && (
              <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, color:C.muted, marginTop:6 }}>{muscleNames}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function TrainingPlanSetup({ userId, onDone, onSkip }) {
  const [step, setStep] = useState(0);
  const [selectedDays, setSelectedDays] = useState([]);
  const [dayConfigs, setDayConfigs] = useState({});
  const [muscleGroups, setMuscleGroups] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get("/muscle-groups")
      .then(res => setMuscleGroups(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    api.get(`/training-plans/user/${userId}`)
      .then(res => {
        const plan = res.data;
        const days = [];
        const configs = {};

        plan.days.forEach(day => {
          days.push(day.dayOfWeek);
          const types = day.entries.map(e => e.workoutType);
          const muscles = day.entries
            .filter(e => e.workoutType === "STRENGTH")
            .flatMap(e => e.muscleGroups.map(m => m.id));
          configs[day.dayOfWeek] = { types, muscles };
        });

        const ORDER = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"];
        days.sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));

        setSelectedDays(days);
        setDayConfigs(configs);
      })
      .catch(() => {});
  }, [userId]);

  const toggleDay = (dayKey) => {
    setSelectedDays(prev =>
      prev.includes(dayKey) ? prev.filter(d => d !== dayKey) : [...prev, dayKey]
    );
  };

  const updateDay = (dayKey, config) => {
    setDayConfigs(prev => ({ ...prev, [dayKey]: config }));
  };

  const validate = () => {
    if (step === 0 && selectedDays.length === 0) {
      setError("Selecione pelo menos um dia de treino."); return false;
    }
    if (step === 1) {
      for (const dayKey of selectedDays) {
        const config = dayConfigs[dayKey] || { types: [] };
        if (config.types.length === 0) {
          setError(`Configure o tipo de treino para ${DAYS.find(d => d.key === dayKey)?.label}.`);
          return false;
        }
        if (config.types.includes("STRENGTH") && (!config.muscles || config.muscles.length === 0)) {
          setError(`Selecione pelo menos um grupo muscular para ${DAYS.find(d => d.key === dayKey)?.label}.`);
          return false;
        }
      }
    }
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (!validate()) return;
    setStep(s => s + 1);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const days = selectedDays.map(dayKey => {
        const config = dayConfigs[dayKey] || { types: [], muscles: [] };
        const entries = config.types.map(type => ({
          workoutType: type,
          muscleGroupIds: type === "STRENGTH" ? (config.muscles || []) : [],
        }));
        return { dayOfWeek: dayKey, entries };
      });

      await api.post("/training-plans", { userId, days });
      onDone();
    } catch (err) {
      console.error(err);
      setError("Erro ao salvar plano. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background:C.bg, minHeight:"100vh", display:"flex", flexDirection:"column", padding:"0 28px", fontFamily:"'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

     <div style={{ paddingTop:56, marginBottom:32 }}>
       <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:12 }}>
         {onSkip === undefined && (
           <button onClick={onDone} style={{ background:C.graphite, border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, width:40, height:40, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, color:C.text, flexShrink:0 }}>←</button>
         )}
         <div>
           <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:32, color:C.text, letterSpacing:"-0.02em", marginBottom:4 }}>Plano de Treino</div>
           <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color:C.muted, letterSpacing:"0.2em" }}>CONFIGURE SUA SEMANA</div>
         </div>
       </div>
     </div>

      <div style={{ display:"flex", gap:8, marginBottom:28 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex:1, display:"flex", flexDirection:"column", gap:6 }}>
            <div style={{ height:3, borderRadius:2, background: i <= step ? C.yellow : "rgba(255,255,255,0.08)", transition:"background 0.3s" }} />
            <div style={{ fontFamily:"'Space Mono', monospace", fontSize:8, letterSpacing:"0.15em", color: i === step ? C.yellow : C.muted }}>{s.toUpperCase()}</div>
          </div>
        ))}
      </div>

      <div style={{ flex:1, overflowY:"auto", paddingBottom:16 }}>
        {step === 0 && <StepDays selectedDays={selectedDays} onToggle={toggleDay} />}
        {step === 1 && <StepWorkouts selectedDays={selectedDays} dayConfigs={dayConfigs} onUpdateDay={updateDay} muscleGroups={muscleGroups} />}
        {step === 2 && <StepReview selectedDays={selectedDays} dayConfigs={dayConfigs} muscleGroups={muscleGroups} />}
      </div>

      {error && (
        <div style={{ background:"rgba(255,59,48,0.1)", border:"1px solid rgba(255,59,48,0.3)", borderRadius:12, padding:"12px 16px", marginBottom:16, fontSize:13, color:C.red }}>
          {error}
        </div>
      )}

      <div style={{ paddingBottom:40, paddingTop:8, display:"flex", flexDirection:"column", gap:10 }}>
        {step < 2 ? (
          <button onClick={handleNext} style={{ width:"100%", background:C.yellow, border:"none", borderRadius:14, padding:"15px", fontFamily:"'Space Mono', monospace", fontSize:11, fontWeight:700, letterSpacing:"0.2em", color:"#050505", cursor:"pointer" }}>
            CONTINUAR →
          </button>
        ) : (
          <button onClick={handleSave} disabled={saving} style={{ width:"100%", background: saving ? "rgba(255,210,0,0.3)" : C.yellow, border:"none", borderRadius:14, padding:"15px", fontFamily:"'Space Mono', monospace", fontSize:11, fontWeight:700, letterSpacing:"0.2em", color:"#050505", cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "SALVANDO..." : "SALVAR PLANO ⚡"}
          </button>
        )}
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} style={{ width:"100%", background:"none", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"13px", fontFamily:"'Space Mono', monospace", fontSize:10, color:C.muted, cursor:"pointer" }}>
            ← VOLTAR
          </button>
        )}
        {onSkip && step === 0 && (
          <button onClick={onSkip} style={{ width:"100%", background:"none", border:"none", padding:"8px", fontFamily:"'Space Mono', monospace", fontSize:9, color:C.muted, cursor:"pointer", letterSpacing:"0.15em" }}>
            PULAR POR AGORA
          </button>
        )}
      </div>
    </div>
  );
}