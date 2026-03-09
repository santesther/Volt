import { C } from "../utils/constants";
import { useCount, SectionLabel } from "../utils/components";

export default function ChargeMap() {
  const treinos = useCount(5);
  const recarga = useCount(2);
  const muscles = [
    { name:"Peito",   fatigue:85, recovering:true  },
    { name:"Tríceps", fatigue:70, recovering:true  },
    { name:"Costas",  fatigue:10, recovering:false },
    { name:"Bíceps",  fatigue:15, recovering:false },
    { name:"Pernas",  fatigue:5,  recovering:false },
    { name:"Ombros",  fatigue:0,  recovering:false },
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
