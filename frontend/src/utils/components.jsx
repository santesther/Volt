import { useState, useEffect } from "react";
import { C } from "./constants";

export function useCount(target, duration = 1000) {
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

export function SectionLabel({ children, color }) {
  return (
    <div style={{
      fontFamily: "'Space Mono', monospace", fontSize: 9,
      letterSpacing: "0.25em", color: color || C.muted,
      textTransform: "uppercase", marginBottom: 10,
    }}>{children}</div>
  );
}

export function MuscleChip({ name, fatigue }) {
  const recovering = fatigue > 30;
  const color  = recovering ? C.red    : C.yellow;
  const bg     = recovering ? "rgba(255,59,48,0.15)"  : "rgba(255,210,0,0.1)";
  const border = recovering ? "rgba(255,59,48,0.25)"  : "rgba(255,210,0,0.25)";
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:5, background:bg, border:`1px solid ${border}`, borderRadius:100, padding:"5px 11px" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:color, flexShrink:0 }} />
      <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:12, fontWeight:500, color:C.text }}>{name}</span>
    </div>
  );
}

export function NumericStepper({ label, value, onChange, min, max, unit }) {
  const [editing, setEditing] = useState(false);
  const [raw, setRaw] = useState("");

  const handleBlur = () => {
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) onChange(Math.min(max, Math.max(min, parsed)));
    setEditing(false);
  };

  return (
    <div style={{ flex:1 }}>
      <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:C.muted, textTransform:"uppercase", marginBottom:8 }}>{label}</div>
      <div style={{ background:C.graphite, borderRadius:12, border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 10px" }}>
        <button onClick={() => onChange(Math.max(min, value - 1))} style={{ background:"none", border:"none", color:C.muted, fontSize:18, cursor:"pointer", padding:"0 4px", lineHeight:1 }}>−</button>
        {editing ? (
          <input
            autoFocus
            type="number"
            defaultValue={value}
            onChange={e => setRaw(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={e => e.key === "Enter" && handleBlur()}
            style={{ background:"none", border:"none", outline:"none", color:C.yellow, fontFamily:"'Space Mono', monospace", fontSize:13, fontWeight:700, width:60, textAlign:"center", colorScheme:"dark" }}
          />
        ) : (
          <div onClick={() => { setRaw(String(value)); setEditing(true); }} style={{ fontFamily:"'Space Mono', monospace", fontSize:13, fontWeight:700, color:C.yellow, cursor:"text", minWidth:60, textAlign:"center" }}>
            {value}<span style={{ fontSize:9, color:C.muted, fontWeight:400 }}> {unit}</span>
          </div>
        )}
        <button onClick={() => onChange(Math.min(max, value + 1))} style={{ background:"none", border:"none", color:C.muted, fontSize:18, cursor:"pointer", padding:"0 4px", lineHeight:1 }}>+</button>
      </div>
    </div>
  );
}

export function DurationStepper({ label, value, onChange }) {
  const hours = Math.floor(value / 60);
  const mins = value % 60;
  const display = `${String(hours).padStart(2,"0")}:${String(mins).padStart(2,"0")}`;

  const [editing, setEditing] = useState(false);
  const [raw, setRaw] = useState("");

  const handleBlur = () => {
    if (raw.includes(":")) {
      const [h, m] = raw.split(":").map(Number);
      if (!isNaN(h) && !isNaN(m)) onChange(Math.min(720, Math.max(1, h * 60 + m)));
    } else {
      const parsed = parseInt(raw);
      if (!isNaN(parsed)) onChange(Math.min(720, Math.max(1, parsed)));
    }
    setEditing(false);
  };

  return (
    <div style={{ flex:1 }}>
      <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:C.muted, textTransform:"uppercase", marginBottom:8 }}>{label}</div>
      <div style={{ background:C.graphite, borderRadius:12, border:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 10px" }}>
        <button onClick={() => onChange(Math.max(1, value - 1))} style={{ background:"none", border:"none", color:C.muted, fontSize:18, cursor:"pointer", padding:"0 4px", lineHeight:1 }}>−</button>
        {editing ? (
          <input
            autoFocus
            type="text"
            defaultValue={display}
            placeholder="HH:MM"
            onChange={e => setRaw(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={e => e.key === "Enter" && handleBlur()}
            style={{ background:"none", border:"none", outline:"none", color:C.yellow, fontFamily:"'Space Mono', monospace", fontSize:13, fontWeight:700, width:64, textAlign:"center" }}
          />
        ) : (
          <div onClick={() => { setRaw(display); setEditing(true); }} style={{ fontFamily:"'Space Mono', monospace", fontSize:13, fontWeight:700, color:C.yellow, cursor:"text", minWidth:64, textAlign:"center" }}>
            {display}<span style={{ fontSize:9, color:C.muted, fontWeight:400 }}> h</span>
          </div>
        )}
        <button onClick={() => onChange(Math.min(720, value + 1))} style={{ background:"none", border:"none", color:C.muted, fontSize:18, cursor:"pointer", padding:"0 4px", lineHeight:1 }}>+</button>
      </div>
    </div>
  );
}

export function EffortSlider({ value, onChange }) {
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
        style={{ width:"100%", accentColor:color, height:4, cursor:"pointer" }}
      />
      <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
        <span style={{ fontFamily:"'Space Mono', monospace", fontSize:8, color:C.muted }}>1</span>
        <span style={{ fontFamily:"'Space Mono', monospace", fontSize:8, color:C.muted }}>10</span>
      </div>
    </div>
  );
}

export function Field({ label, value, onChange, type="text", placeholder="" }) {
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:C.muted, textTransform:"uppercase", marginBottom:8 }}>{label}</div>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width:"100%", background:C.graphite, border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"12px 14px", color:C.text, fontSize:13, fontFamily:"'DM Sans', sans-serif", outline:"none" }}
      />
    </div>
  );
}

export function SaveButton({ onClick, saved }) {
  return (
    <button onClick={onClick} style={{
      width:"100%", background: saved ? "rgba(255,210,0,0.1)" : C.yellow,
      border: saved ? `1px solid ${C.yellow}` : "none",
      borderRadius:12, padding:"12px", cursor:"pointer",
      fontFamily:"'Space Mono', monospace", fontSize:10, fontWeight:700, letterSpacing:"0.15em",
      color: saved ? C.yellow : "#050505", transition:"all 0.3s",
    }}>
      {saved ? "✓ SALVO" : "SALVAR"}
    </button>
  );
}

export function Section({ title, children }) {
  return (
    <div style={{ background:C.graphite, borderRadius:16, padding:"18px 16px", marginBottom:14, border:"1px solid rgba(255,255,255,0.04)" }}>
      <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color:C.yellow, letterSpacing:"0.2em", textTransform:"uppercase", marginBottom:14 }}>{title}</div>
      {children}
    </div>
  );
}