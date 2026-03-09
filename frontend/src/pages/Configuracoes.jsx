import { useState, useEffect } from "react";
import api from "../api/api";
import { C } from "../utils/constants";
import { SectionLabel } from "../utils/components";

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
  const bg     = error ? "rgba(255,59,48,0.1)" : saved ? "rgba(255,210,0,0.15)" : saving ? "rgba(255,210,0,0.4)" : C.yellow;
  const border = error ? `1px solid ${C.red}` : saved ? `1px solid ${C.yellow}` : "none";
  const color  = error ? C.red : saved ? C.yellow : "#050505";
  const label  = error ? "ERRO AO SALVAR" : saved ? "✓ SALVO" : saving ? "SALVANDO..." : "SALVAR ALTERAÇÕES";
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

export default function Configuracoes({ userId, onBack, onLogout }) {
  const [userData, setUserData] = useState(null);
  const [email, setEmail] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);
  const [savedEmail, setSavedEmail] = useState(false);
  const [errorEmail, setErrorEmail] = useState("");

  const [passwords, setPasswords] = useState({ current:"", next:"", confirm:"" });
  const [savingPass, setSavingPass] = useState(false);
  const [savedPass, setSavedPass] = useState(false);
  const [errorPass, setErrorPass] = useState("");

  useEffect(() => {
    api.get(`/users/${userId}`)
      .then(res => {
        setUserData(res.data);
        setEmail(res.data.email || "");
      })
      .catch(err => console.error("Erro ao carregar usuário:", err));
  }, [userId]);

  const saveEmail = async () => {
    setErrorEmail("");
    if (!email || !email.includes("@")) { setErrorEmail("Email inválido."); return; }
    if (!userData) return;
    setSavingEmail(true);
    try {
      await api.put(`/users/${userId}`, {
        name: userData.name,
        email: email,
        height: userData.height,
        weight: userData.weight,
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender,
        goal: userData.goal,
        password: "",
        password_confirmation: "",
      });
      setUserData(prev => ({ ...prev, email }));
      setSavedEmail(true);
      setTimeout(() => setSavedEmail(false), 2500);
    } catch (err) {
      console.error("Erro ao salvar email:", err);
      setErrorEmail("Erro ao salvar. Tente novamente.");
    } finally {
      setSavingEmail(false);
    }
  };

  const savePassword = async () => {
    setErrorPass("");
    if (!passwords.current) { setErrorPass("Informe a senha atual."); return; }
    if (passwords.next.length < 8) { setErrorPass("Nova senha deve ter pelo menos 8 caracteres."); return; }
    if (passwords.next !== passwords.confirm) { setErrorPass("As senhas não coincidem."); return; }
    if (!userData) return;
    setSavingPass(true);
    try {
      await api.put(`/users/${userId}`, {
        name: userData.name,
        email: userData.email,
        height: userData.height,
        weight: userData.weight,
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender,
        goal: userData.goal,
        password: passwords.next,
        password_confirmation: passwords.confirm,
      });
      setSavedPass(true);
      setPasswords({ current:"", next:"", confirm:"" });
      setTimeout(() => onLogout(), 2000);
    } catch (err) {
      console.error("Erro ao salvar senha:", err);
      setErrorPass("Erro ao salvar. Tente novamente.");
    } finally {
      setSavingPass(false);
    }
  };

  return (
    <div className="volt-screen">
      <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:28 }}>
        <button onClick={onBack} style={{ background:C.graphite, border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, width:40, height:40, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, color:C.text, flexShrink:0 }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,210,0,0.4)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
        >←</button>
        <div>
          <SectionLabel>Perfil</SectionLabel>
          <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:28, letterSpacing:"-0.02em", lineHeight:1 }}>Configurações</div>
        </div>
      </div>

      <Section title="Endereço de Email">
        <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, color:C.muted, marginBottom:14, lineHeight:1.6 }}>
          Seu email é usado para login e notificações.
        </div>
        <Field label="Novo email" value={email} onChange={setEmail} type="email" />
        {errorEmail && <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, color:C.red, marginBottom:12 }}>{errorEmail}</div>}
        <SaveButton onClick={saveEmail} saving={savingEmail} saved={savedEmail} error={!!errorEmail} />
      </Section>

      <Section title="Trocar Senha">
        <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, color:C.muted, marginBottom:14, lineHeight:1.6 }}>
          Após trocar a senha você será deslogado automaticamente.
        </div>
        <Field label="Senha atual"          value={passwords.current} onChange={v => setPasswords(p => ({...p, current:v}))} type="password" />
        <Field label="Nova senha"           value={passwords.next}    onChange={v => setPasswords(p => ({...p, next:v}))}    type="password" />
        <Field label="Confirmar nova senha" value={passwords.confirm} onChange={v => setPasswords(p => ({...p, confirm:v}))} type="password" />
        {errorPass && <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, color:C.red, marginBottom:12 }}>{errorPass}</div>}
        <SaveButton onClick={savePassword} saving={savingPass} saved={savedPass} error={!!errorPass} />
      </Section>

      <Section title="Zona de Perigo">
        <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, color:C.muted, marginBottom:14, lineHeight:1.6 }}>
          Ações irreversíveis. Proceda com cautela.
        </div>
        <button onClick={async () => {
          if (!window.confirm("Tem certeza? Essa ação é irreversível.")) return;
          try {
            await api.delete(`/users/${userId}`);
            onLogout();
          } catch (err) {
            console.error("Erro ao excluir conta:", err);
          }
        }} style={{ width:"100%", background:"rgba(255,59,48,0.08)", border:"1px solid rgba(255,59,48,0.25)", borderRadius:14, padding:"13px", cursor:"pointer", fontFamily:"'Space Mono', monospace", fontSize:10, fontWeight:700, letterSpacing:"0.15em", color:C.red, transition:"background 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,59,48,0.15)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,59,48,0.08)"}
        >
          EXCLUIR CONTA
        </button>
      </Section>
    </div>
  );
}