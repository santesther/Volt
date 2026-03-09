import { useState } from "react";
import api from "../api/api";

const C = {
  bg: "#050505", yellow: "#FFD200", red: "#FF3B30",
  graphite: "#191919", g2: "#111111", text: "#F2F2F2", muted: "#666",
};

const GOALS = ["HYPERTROPHY","FAT_LOSS","STRENGTH","ENDURANCE","FITNESS","REHABILITATION"];
const GOAL_LABELS = {
  HYPERTROPHY:"Hipertrofia", FAT_LOSS:"Emagrecimento", STRENGTH:"Força",
  ENDURANCE:"Resistência", FITNESS:"Condicionamento", REHABILITATION:"Reabilitação",
};

function Field({ label, value, onChange, type="text", placeholder="" }) {
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color:C.muted, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:8 }}>{label}</div>
      <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
        style={{ width:"100%", background:C.graphite, border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"14px 16px", color:C.text, fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:"'DM Sans', sans-serif", colorScheme: "dark" }}
        onFocus={e => e.target.style.borderColor = "rgba(255,210,0,0.4)"}
        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
      />
    </div>
  );
}

const STEPS = ["Conta", "Dados", "Objetivo"];

export default function Register({ onLogin, onBack }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name:"", email:"", password:"", password_confirmation:"",
    height:"", weight:"", dateOfBirth:"", gender:"F", goal:"HYPERTROPHY",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const set = f => v => setForm(p => ({...p, [f]:v}));

  const nextStep = () => {
    setError(null);

    if (step === 0) {
      if (!form.name) return setError("Informe seu nome.");
      if (!form.email || !form.email.includes("@")) return setError("Email inválido.");
      if (form.password.length < 8) return setError("Senha deve ter pelo menos 8 caracteres.");
      if (form.password !== form.password_confirmation) return setError("As senhas não coincidem.");
    }
    if (step === 1) {
      if (!form.height || isNaN(parseFloat(form.height))) return setError("Informe uma altura válida.");
      if (!form.weight || isNaN(parseFloat(form.weight))) return setError("Informe um peso válido.");
      if (!form.dateOfBirth) return setError("Informe sua data de nascimento.");
    }

    setStep(s => s + 1);
  };

  const handleRegister = async () => {
    setError(null);
    setLoading(true);
    try {
      await api.post("/users", {
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation,
        height: parseFloat(form.height),
        weight: parseFloat(form.weight),
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        goal: form.goal,
      });

      const res = await api.post("/auth/login", { email: form.email, password: form.password });
      const { token, userId } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      onLogin(userId);
    } catch (err) {
      const msg = err.response?.data?.message || "Erro ao criar conta. Tente novamente.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background:C.bg, minHeight:"100vh", display:"flex", flexDirection:"column", padding:"0 28px", fontFamily:"'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>

      <div style={{ paddingTop:56, marginBottom:36 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted, fontFamily:"'Space Mono', monospace", fontSize:10, letterSpacing:"0.15em", marginBottom:24, padding:0 }}>← VOLTAR</button>
        <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:32, color:C.text, letterSpacing:"-0.02em", marginBottom:4 }}>Criar Conta</div>
        <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color:C.muted, letterSpacing:"0.2em" }}>VOLT TRAINING INTELLIGENCE</div>
      </div>

      <div style={{ display:"flex", gap:8, marginBottom:32 }}>
        {STEPS.map((s, i) => (
          <div key={s} style={{ flex:1, display:"flex", flexDirection:"column", gap:6 }}>
            <div style={{ height:3, borderRadius:2, background: i <= step ? C.yellow : "rgba(255,255,255,0.08)", transition:"background 0.3s" }} />
            <div style={{ fontFamily:"'Space Mono', monospace", fontSize:8, letterSpacing:"0.15em", color: i === step ? C.yellow : C.muted }}>{s.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {step === 0 && (
        <div style={{ flex:1 }}>
          <Field label="Nome completo" value={form.name} onChange={set("name")} placeholder="Nome Completo" />
          <Field label="Email" value={form.email} onChange={set("email")} type="email" placeholder="seu@email.com" />
          <Field label="Senha" value={form.password} onChange={set("password")} type="password" placeholder="••••••••" />
          <Field label="Confirmar senha" value={form.password_confirmation} onChange={set("password_confirmation")} type="password" placeholder="••••••••" />
        </div>
      )}

      {step === 1 && (
        <div style={{ flex:1 }}>
          <div style={{ display:"flex", gap:10 }}>
            <div style={{ flex:1 }}><Field label="Altura (m)" value={form.height} onChange={set("height")} placeholder="1.70" /></div>
            <div style={{ flex:1 }}><Field label="Peso (kg)"  value={form.weight} onChange={set("weight")} placeholder="70" /></div>
          </div>
          <Field label="Data de Nascimento" value={form.dateOfBirth} onChange={set("dateOfBirth")} type="date" />
          <div style={{ marginBottom:14 }}>
            <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color:C.muted, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:8 }}>Gênero</div>
            <div style={{ display:"flex", gap:8 }}>
              {["F","M"].map(g => (
                <button key={g} onClick={() => set("gender")(g)} style={{ flex:1, padding:"13px", borderRadius:12, cursor:"pointer", background: form.gender === g ? C.yellow : C.graphite, color: form.gender === g ? "#050505" : C.muted, border: form.gender === g ? "none" : "1px solid rgba(255,255,255,0.08)", fontFamily:"'Space Mono', monospace", fontSize:11, fontWeight:700 }}>
                  {g === "F" ? "Feminino" : "Masculino"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.muted, marginBottom:20, lineHeight:1.6 }}>
            Qual é o seu principal objetivo de treino?
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:14 }}>
            {GOALS.map(g => (
              <button key={g} onClick={() => set("goal")(g)} style={{ background: form.goal === g ? "rgba(255,210,0,0.1)" : C.graphite, border:`1px solid ${form.goal === g ? C.yellow : "rgba(255,255,255,0.06)"}`, borderRadius:12, padding:"14px 16px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center", transition:"all 0.15s" }}>
                <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:14, fontWeight:500, color: form.goal === g ? C.yellow : C.text }}>{GOAL_LABELS[g]}</span>
                {form.goal === g && <span style={{ color:C.yellow }}>✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div style={{ background:"rgba(255,59,48,0.1)", border:"1px solid rgba(255,59,48,0.3)", borderRadius:12, padding:"12px 16px", marginBottom:16, fontSize:13, color:C.red }}>
          {error}
        </div>
      )}

      <div style={{ paddingBottom:40, paddingTop:8 }}>
        {step < 2 ? (
          <button onClick={nextStep} style={{ width:"100%", background:C.yellow, border:"none", borderRadius:14, padding:"15px", fontFamily:"'Space Mono', monospace", fontSize:11, fontWeight:700, letterSpacing:"0.2em", color:"#050505", cursor:"pointer" }}>
            CONTINUAR →
          </button>
        ) : (
          <button onClick={handleRegister} disabled={loading} style={{ width:"100%", background: loading ? "rgba(255,210,0,0.3)" : C.yellow, border:"none", borderRadius:14, padding:"15px", fontFamily:"'Space Mono', monospace", fontSize:11, fontWeight:700, letterSpacing:"0.2em", color:"#050505", cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "CRIANDO CONTA..." : "CRIAR CONTA ⚡"}
          </button>
        )}
      </div>
    </div>
  );
}