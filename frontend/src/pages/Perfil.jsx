import { useState, useEffect } from "react";
import api from "../api/api";
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

function SaveButton({ onClick, saving, saved, error }) {
  const bg = error ? "rgba(255,59,48,0.1)" : saved ? "rgba(255,210,0,0.15)" : saving ? "rgba(255,210,0,0.4)" : C.yellow;
  const border = error ? `1px solid ${C.red}` : saved ? `1px solid ${C.yellow}` : "none";
  const color = error ? C.red : saved ? C.yellow : "#050505";
  const label = error ? "ERRO AO SALVAR" : saved ? "✓ SALVO" : saving ? "SALVANDO..." : "SALVAR ALTERAÇÕES";
  return (
    <button onClick={onClick} disabled={saving} style={{ width:"100%", background:bg, border, borderRadius:14, padding:"14px", cursor: saving ? "not-allowed" : "pointer", fontFamily:"'Space Mono', monospace", fontSize:11, fontWeight:700, letterSpacing:"0.2em", color, transition:"all 0.3s" }}>
      {label}
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

export default function Perfil({ userId, onOpenSettings, onLogout, onEditPlan }) {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name:"", email:"", height:"", weight:"", dateOfBirth:"", gender:"F", goal:"HYPERTROPHY"
  });
  const [activeGoal, setActiveGoal] = useState("HYPERTROPHY");
  const [savingInfo, setSavingInfo] = useState(false);
  const [savedInfo, setSavedInfo] = useState(false);
  const [errorInfo, setErrorInfo] = useState(false);
  const [savingGoal, setSavingGoal] = useState(false);
  const [savedGoal, setSavedGoal] = useState(false);
  const [errorGoal, setErrorGoal] = useState(false);

  const set = (field) => (val) => setForm(f => ({ ...f, [field]: val }));

  useEffect(() => {
    api.get(`/users/${userId}`)
      .then(res => {
        const u = res.data;
        setForm({
          name: u.name || "",
          email: u.email || "",
          height: u.height?.toString() || "",
          weight: u.weight?.toString() || "",
          dateOfBirth: u.dateOfBirth || "",
          gender: u.gender || "F",
          goal: u.goal || "HYPERTROPHY",
        });
        setActiveGoal(u.goal || "HYPERTROPHY");
      })
      .catch(err => console.error("Erro ao carregar perfil:", err))
      .finally(() => setLoading(false));
  }, [userId]);

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setPhoto(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const saveInfo = async () => {
    setErrorInfo(false);
    setSavingInfo(true);
    try {
      await api.put(`/users/${userId}`, {
        name: form.name,
        email: form.email,
        height: parseFloat(form.height),
        weight: parseFloat(form.weight),
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        goal: form.goal,
        password: "",
        password_confirmation: "",
      });
      setSavedInfo(true);
      setTimeout(() => setSavedInfo(false), 2500);
    } catch (err) {
      console.error("Erro ao salvar perfil:", err);
      setErrorInfo(true);
      setTimeout(() => setErrorInfo(false), 3000);
    } finally {
      setSavingInfo(false);
    }
  };

  const saveGoal = async () => {
    setErrorGoal(false);
    setSavingGoal(true);
    try {
      await api.put(`/users/${userId}`, {
        name: form.name,
        email: form.email,
        height: parseFloat(form.height),
        weight: parseFloat(form.weight),
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        goal: activeGoal,
        password: "",
        password_confirmation: "",
      });
      setForm(f => ({ ...f, goal: activeGoal }));
      setSavedGoal(true);
      setTimeout(() => setSavedGoal(false), 2500);
    } catch (err) {
      console.error("Erro ao salvar objetivo:", err);
      setErrorGoal(true);
      setTimeout(() => setErrorGoal(false), 3000);
    } finally {
      setSavingGoal(false);
    }
  };

  const initials = form.name?.charAt(0)?.toUpperCase() || "?";

  if (loading) return (
    <div className="volt-screen">
      <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.muted, paddingTop:40, textAlign:"center" }}>Carregando perfil...</div>
    </div>
  );

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
              : <span style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:32, color:C.yellow }}>{initials}</span>
            }
          </div>
          <span style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color:C.yellow, letterSpacing:"0.2em" }}>{photo ? "TROCAR FOTO" : "ADICIONAR FOTO"}</span>
        </label>
      </div>

      <Section title="Dados Pessoais">
        <Field label="Nome"  value={form.name}  onChange={set("name")} />
        <Field label="Email" value={form.email} onChange={set("email")} type="email" />
        <div style={{ display:"flex", gap:10 }}>
          <div style={{ flex:1 }}><Field label="Altura (m)" value={form.height} onChange={set("height")} placeholder="1.70" /></div>
          <div style={{ flex:1 }}><Field label="Peso (kg)"  value={form.weight} onChange={set("weight")} placeholder="70" /></div>
        </div>
        <Field label="Data de Nascimento" value={form.dateOfBirth} onChange={set("dateOfBirth")} type="date" />
        <div style={{ marginBottom:14 }}>
          <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:C.muted, textTransform:"uppercase", marginBottom:6 }}>Gênero</div>
          <div style={{ display:"flex", gap:8 }}>
            {["F","M"].map(g => (
              <button key={g} onClick={() => set("gender")(g)} style={{ flex:1, padding:"12px", borderRadius:12, cursor:"pointer", background: form.gender === g ? C.yellow : C.graphite, color: form.gender === g ? "#050505" : C.muted, border: form.gender === g ? "none" : "1px solid rgba(255,255,255,0.08)", fontFamily:"'Space Mono', monospace", fontSize:11, fontWeight:700 }}>
                {g === "F" ? "Fem" : "Masc"}
              </button>
            ))}
          </div>
        </div>
        <SaveButton onClick={saveInfo} saving={savingInfo} saved={savedInfo} error={errorInfo} />
      </Section>

      <Section title="Objetivo de Treino">
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:14 }}>
          {GOALS.map(g => (
            <button key={g} onClick={() => setActiveGoal(g)} style={{ background: activeGoal === g ? "rgba(255,210,0,0.1)" : C.graphite, border:`1px solid ${activeGoal === g ? C.yellow : "rgba(255,255,255,0.06)"}`, borderRadius:12, padding:"12px 16px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:14, fontWeight:500, color: activeGoal === g ? C.yellow : C.text }}>{GOAL_LABELS[g]}</span>
              {activeGoal === g && <span style={{ color:C.yellow, fontSize:14 }}>✓</span>}
            </button>
          ))}
        </div>
        <SaveButton onClick={saveGoal} saving={savingGoal} saved={savedGoal} error={errorGoal} />
      </Section>

      <button onClick={onEditPlan} style={{ width:"100%", background:C.graphite, border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"14px", cursor:"pointer", marginBottom:10, fontFamily:"'Space Mono', monospace", fontSize:10, fontWeight:700, letterSpacing:"0.2em", color:C.muted }}>
        ⚡ EDITAR PLANO DE TREINO
      </button>

      <button onClick={onLogout} style={{ width:"100%", background:"none", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"14px", cursor:"pointer", marginBottom:14, fontFamily:"'Space Mono', monospace", fontSize:10, fontWeight:700, letterSpacing:"0.2em", color:C.muted, transition:"all 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,59,48,0.4)"; e.currentTarget.style.color = C.red; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = C.muted; }}
      >
        SAIR DA CONTA
      </button>
    </div>
  );
}