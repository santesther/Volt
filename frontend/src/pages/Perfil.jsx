import { useState } from "react";
import { C } from "../utils/constants";
import { SectionLabel } from "../utils/components";

const GOALS = ["HYPERTROPHY","FAT_LOSS","STRENGTH","ENDURANCE","FITNESS","REHABILITATION"];
const GOAL_LABELS = {
  HYPERTROPHY:"Hipertrofia", FAT_LOSS:"Emagrecimento", STRENGTH:"Força",
  ENDURANCE:"Resistência", FITNESS:"Condicionamento", REHABILITATION:"Reabilitação",
};

function Field({ label, value, onChange, type="text", placeholder="" }) {
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:C.muted, textTransform:"uppercase", marginBottom:6 }}>{label}</div>
      <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
        style={{ width:"100%", background:C.graphite, border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"12px 14px", color:C.text, fontSize:14, fontFamily:"'DM Sans', sans-serif", outline:"none", transition:"border-color 0.2s" }}
        onFocus={e => e.target.style.borderColor = "rgba(255,210,0,0.4)"}
        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
      />
    </div>
  );
}

function SaveButton({ onClick, saved }) {
  return (
    <button onClick={onClick} style={{ width:"100%", background: saved ? "rgba(255,210,0,0.15)" : C.yellow, border: saved ? `1px solid ${C.yellow}` : "none", borderRadius:14, padding:"14px", cursor:"pointer", fontFamily:"'Space Mono', monospace", fontSize:11, fontWeight:700, letterSpacing:"0.2em", color: saved ? C.yellow : "#050505", transition:"all 0.3s" }}>
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

export default function Perfil({ onOpenSettings, onLogout }) {
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

  const saveInfo = () => { setSavedInfo(true); setTimeout(() => setSavedInfo(false), 2500); };

  return (
    <div className="volt-screen">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
        <div>
          <SectionLabel>Perfil</SectionLabel>
          <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:32, letterSpacing:"-0.02em" }}>Suas Informações</div>
        </div>
        <button onClick={onOpenSettings} style={{ background:C.graphite, border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, width:42, height:42, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, transition:"border-color 0.2s", marginTop:4 }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,210,0,0.4)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
        >⚙️</button>
      </div>

      <div style={{ display:"flex", justifyContent:"center", marginBottom:24 }}>
        <label style={{ cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
          <input type="file" accept="image/*" onChange={handlePhoto} style={{ display:"none" }} />
          <div style={{ width:90, height:90, borderRadius:"50%", background: photo ? "transparent" : C.graphite, border:`2px solid ${photo ? C.yellow : "rgba(255,210,0,0.2)"}`, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", position:"relative" }}>
            {photo
              ? <img src={photo} alt="perfil" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              : <span style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:32, color:C.yellow }}>E</span>
            }
          </div>
          <span style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color:C.yellow, letterSpacing:"0.2em" }}>{photo ? "TROCAR FOTO" : "ADICIONAR FOTO"}</span>
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
              <button key={g} onClick={() => set("gender")(g)} style={{ flex:1, padding:"12px", borderRadius:12, cursor:"pointer", background: form.gender === g ? C.yellow : C.graphite, color: form.gender === g ? "#050505" : C.muted, border: form.gender === g ? "none" : "1px solid rgba(255,255,255,0.08)", fontFamily:"'Space Mono', monospace", fontSize:11, fontWeight:700 }}>
                {g === "F" ? "Fem" : "Masc"}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginTop:18 }}><SaveButton onClick={saveInfo} saved={savedInfo} /></div>
      </Section>

      <Section title="Objetivo de Treino">
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:14 }}>
          {GOALS.map(g => (
            <button key={g} onClick={() => { setActiveGoal(g); set("goal")(g); }} style={{ background: activeGoal === g ? "rgba(255,210,0,0.1)" : C.graphite, border:`1px solid ${activeGoal === g ? C.yellow : "rgba(255,255,255,0.06)"}`, borderRadius:12, padding:"12px 16px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:14, fontWeight:500, color: activeGoal === g ? C.yellow : C.text }}>{GOAL_LABELS[g]}</span>
              {activeGoal === g && <span style={{ color:C.yellow, fontSize:14 }}>✓</span>}
            </button>
          ))}
        </div>
        <SaveButton onClick={saveInfo} saved={savedInfo} />
      </Section>

      <button onClick={onLogout} style={{ width:"100%", background:"none", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"14px", cursor:"pointer", marginBottom:14, fontFamily:"'Space Mono', monospace", fontSize:10, fontWeight:700, letterSpacing:"0.2em", color:C.muted, transition:"all 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,59,48,0.4)"; e.currentTarget.style.color = C.red; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = C.muted; }}
      >
        SAIR DA CONTA
      </button>
    </div>
  );
}
