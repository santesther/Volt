import { useState } from "react";
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

export default function Configuracoes({ onBack }) {
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
          Seu email é usado para login e notificações. Ao alterar, você precisará fazer login novamente.
        </div>
        <Field label="Novo email" value={email} onChange={setEmail} type="email" />
        <SaveButton onClick={saveEmail} saved={savedEmail} />
      </Section>

      <Section title="Trocar Senha">
        <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, color:C.muted, marginBottom:14, lineHeight:1.6 }}>
          Use uma senha com pelo menos 8 caracteres.
        </div>
        <Field label="Senha atual"          value={passwords.current} onChange={v => setPasswords(p => ({...p, current:v}))} type="password" />
        <Field label="Nova senha"           value={passwords.next}    onChange={v => setPasswords(p => ({...p, next:v}))}    type="password" />
        <Field label="Confirmar nova senha" value={passwords.confirm} onChange={v => setPasswords(p => ({...p, confirm:v}))} type="password" />
        {passError && <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, color:C.red, marginBottom:12 }}>{passError}</div>}
        <SaveButton onClick={savePassword} saved={savedPass} />
      </Section>

      <Section title="Zona de Perigo">
        <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, color:C.muted, marginBottom:14, lineHeight:1.6 }}>
          Ações irreversíveis. Proceda com cautela.
        </div>
        <button style={{ width:"100%", background:"rgba(255,59,48,0.08)", border:"1px solid rgba(255,59,48,0.25)", borderRadius:14, padding:"13px", cursor:"pointer", fontFamily:"'Space Mono', monospace", fontSize:10, fontWeight:700, letterSpacing:"0.15em", color:C.red, transition:"background 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,59,48,0.15)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,59,48,0.08)"}
        >
          EXCLUIR CONTA
        </button>
      </Section>
    </div>
  );
}
