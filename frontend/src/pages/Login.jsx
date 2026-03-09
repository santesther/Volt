import { useState } from "react";
import api from "../api/api";

const C = {
  bg: "#050505", yellow: "#FFD200", red: "#FF3B30",
  graphite: "#191919", text: "#F2F2F2", muted: "#666",
};

export default function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, userId } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      onLogin(userId);
    } catch (err) {
      setError("Email ou senha incorretos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 28px", fontFamily: "'DM Sans', sans-serif" }}>

      <div style={{ marginBottom: 48, textAlign: "center" }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 48, color: C.yellow, letterSpacing: "-0.02em" }}>VOLT</div>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: C.muted, letterSpacing: "0.3em" }}>TRAINING INTELLIGENCE</div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: C.muted, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>Email</div>
        <input
          type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="seu@email.com"
          style={{ width: "100%", background: C.graphite, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 16px", color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box" }}
        />
      </div>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: C.muted, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>Senha</div>
        <input
          type="password" value={password} onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          style={{ width: "100%", background: C.graphite, border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "14px 16px", color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box" }}
        />
      </div>

      {error && (
        <div style={{ background: "rgba(255,59,48,0.1)", border: "1px solid rgba(255,59,48,0.3)", borderRadius: 12, padding: "12px 16px", marginBottom: 20, fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.red }}>
          {error}
        </div>
      )}

      <button onClick={handleLogin} disabled={loading} style={{
        width: "100%", background: loading ? "rgba(255,210,0,0.3)" : C.yellow,
        border: "none", borderRadius: 14, padding: "15px",
        fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700,
        letterSpacing: "0.2em", color: "#050505", cursor: loading ? "not-allowed" : "pointer",
        transition: "all 0.2s",
      }}>
        {loading ? "ENTRANDO..." : "ENTRAR"}
      </button>
      <div style={{ textAlign:"center", marginTop:20 }}>
        <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.muted }}>Não tem conta? </span>
        <button onClick={onRegister} style={{ background:"none", border:"none", cursor:"pointer", fontFamily:"'Space Mono', monospace", fontSize:10, color:C.yellow, letterSpacing:"0.15em" }}>CRIAR CONTA</button>
      </div>
    </div>
  );
}