import { useState, useEffect } from "react";
import api from "../api/api";
import { C } from "../utils/constants";
import { SectionLabel } from "../utils/components";
import { useLang } from "../utils/langContext";
import { goalT } from "../utils/translations";

const GOALS = ["HYPERTROPHY","FAT_LOSS","STRENGTH","ENDURANCE","FITNESS","REHABILITATION"];

function maxBirthDate() {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 15);
  return d.toISOString().split("T")[0];
}

function applyHeightMask(raw) {
  const digits = raw.replace(/\D/g, "").slice(0, 3);
  if (digits.length === 0) return "";
  if (digits.length === 1) return digits;
  if (digits.length === 2) return digits[0] + "." + digits[1];
  return digits[0] + "." + digits.slice(1);
}

function applyWeightMask(raw) {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return digits.slice(0, -1) + "." + digits.slice(-1);
}

function formatHeight(val) {
  if (!val) return "";
  const n = parseFloat(val);
  if (isNaN(n)) return val.toString();
  return n.toFixed(2);
}

function formatWeight(val) {
  if (!val) return "";
  const n = parseFloat(val);
  if (isNaN(n)) return val.toString();
  return n % 1 === 0 ? n.toString() : n.toString();
}

function Field({ label, value, onChange, type="text", placeholder="", max="" }) {
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:C.muted, textTransform:"uppercase", marginBottom:6 }}>{label}</div>
      <input type={type} value={value} placeholder={placeholder} max={max || undefined}
        onChange={e => onChange(e.target.value)}
        style={{ width:"100%", background:C.graphite, border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"12px 14px", color:C.text, fontSize:14, fontFamily:"'DM Sans', sans-serif", outline:"none", transition:"border-color 0.2s", colorScheme:"dark" }}
        onFocus={e => e.target.style.borderColor = "rgba(255,210,0,0.4)"}
        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
      />
    </div>
  );
}

function MaskedField({ label, value, onChange, placeholder, maskFn }) {
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:C.muted, textTransform:"uppercase", marginBottom:6 }}>{label}</div>
      <input
        type="text" inputMode="numeric" value={value} placeholder={placeholder}
        onChange={e => onChange(maskFn(e.target.value))}
        style={{ width:"100%", background:C.graphite, border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"12px 14px", color:C.text, fontSize:14, fontFamily:"'DM Sans', sans-serif", outline:"none", transition:"border-color 0.2s" }}
        onFocus={e => e.target.style.borderColor = "rgba(255,210,0,0.4)"}
        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
      />
    </div>
  );
}

function SaveButton({ onClick, saving, saved, error, t }) {
  const bg = error ? "rgba(255,59,48,0.1)" : saved ? "rgba(255,210,0,0.15)" : saving ? "rgba(255,210,0,0.4)" : C.yellow;
  const border = error ? `1px solid ${C.red}` : saved ? `1px solid ${C.yellow}` : "none";
  const color = error ? C.red : saved ? C.yellow : "#050505";
  const label = error ? t("save_error") : saved ? t("saved") : saving ? t("saving") : t("save_changes");
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
  const { t, lang, changeLang } = useLang();
  const [photo, setPhoto] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name:"", email:"", height:"", weight:"", dateOfBirth:"", gender:"F", goal:"HYPERTROPHY"
  });
  const [activeGoal, setActiveGoal] = useState("HYPERTROPHY");
  const [savingInfo, setSavingInfo] = useState(false);
  const [savedInfo, setSavedInfo] = useState(false);
  const [errorInfo, setErrorInfo] = useState(false);
  const [infoErrorMsg, setInfoErrorMsg] = useState(null);
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
          height: u.height ? formatHeight(u.height) : "",
          weight: u.weight ? formatWeight(u.weight) : "",
          dateOfBirth: u.dateOfBirth || "",
          gender: u.gender || "F",
          goal: u.goal || "HYPERTROPHY",
        });
        setActiveGoal(u.goal || "HYPERTROPHY");
        if (u.profilePictureBase64) {
          setPhoto(`data:image/jpeg;base64,${u.profilePictureBase64}`);
        }
      })
      .catch(err => console.error("Erro ao carregar perfil:", err))
      .finally(() => setLoading(false));
  }, [userId]);

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
    setUploadingPhoto(true);
    setPhotoError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.patch(`/users/${userId}/profile-picture`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.profilePictureBase64) {
        setPhoto(`data:image/jpeg;base64,${res.data.profilePictureBase64}`);
      }
    } catch (err) {
      console.error("Erro ao salvar foto:", err);
      setPhotoError(lang === "pt-BR" ? "Erro ao salvar foto." : "Error saving photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const saveInfo = async () => {
    setInfoErrorMsg(null);
    if (form.dateOfBirth && form.dateOfBirth > maxBirthDate()) {
      setInfoErrorMsg(lang === "pt-BR" ? "É necessário ter pelo menos 15 anos." : "You must be at least 15 years old.");
      setErrorInfo(true);
      setTimeout(() => { setErrorInfo(false); setInfoErrorMsg(null); }, 3000);
      return;
    }
    setErrorInfo(false);
    setSavingInfo(true);
    try {
      const res = await api.put(`/users/${userId}`, {
        name: form.name, email: form.email,
        height: parseFloat(form.height), weight: parseFloat(form.weight),
        dateOfBirth: form.dateOfBirth, gender: form.gender, goal: form.goal,
        password: "", password_confirmation: "",
      });
      setForm({
        name: res.data.name || "", email: res.data.email || "",
        height: res.data.height ? formatHeight(res.data.height) : "",
        weight: res.data.weight ? formatWeight(res.data.weight) : "",
        dateOfBirth: res.data.dateOfBirth || "", gender: res.data.gender || "F",
        goal: res.data.goal || "HYPERTROPHY",
      });
      setSavedInfo(true);
      setTimeout(() => setSavedInfo(false), 2500);
    } catch (err) {
      console.error(err);
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
      const res = await api.put(`/users/${userId}`, {
        name: form.name, email: form.email,
        height: parseFloat(form.height), weight: parseFloat(form.weight),
        dateOfBirth: form.dateOfBirth, gender: form.gender, goal: activeGoal,
        password: "", password_confirmation: "",
      });
      setForm(f => ({ ...f, goal: res.data.goal }));
      setActiveGoal(res.data.goal);
      setSavedGoal(true);
      setTimeout(() => setSavedGoal(false), 2500);
    } catch (err) {
      console.error(err);
      setErrorGoal(true);
      setTimeout(() => setErrorGoal(false), 3000);
    } finally {
      setSavingGoal(false);
    }
  };

  const initials = form.name?.charAt(0)?.toUpperCase() || "?";

  if (loading) return (
    <div className="volt-screen">
      <div style={{ fontFamily:"'DM Sans', sans-serif", fontSize:13, color:C.muted, paddingTop:40, textAlign:"center" }}>
        {lang === "pt-BR" ? "Carregando perfil..." : "Loading profile..."}
      </div>
    </div>
  );

  return (
    <div className="volt-screen">
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
        <div>
          <SectionLabel>{t("profile")}</SectionLabel>
          <div style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:"clamp(22px, 7vw, 32px)", letterSpacing:"-0.02em" }}>{t("profile_title")}</div>
        </div>
        <button onClick={onOpenSettings} style={{ background:C.graphite, border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, width:42, height:42, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, transition:"border-color 0.2s", marginTop:4 }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,210,0,0.4)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
        >⚙️</button>
      </div>

      <div style={{ display:"flex", justifyContent:"center", marginBottom:24 }}>
        <label style={{ cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:10 }}>
          <input type="file" accept="image/*" onChange={handlePhoto} style={{ display:"none" }} />
          <div style={{ position:"relative", width:90, height:90 }}>
            <div style={{ width:90, height:90, borderRadius:"50%", background: photo ? "transparent" : C.graphite, border:`2px solid ${photo ? C.yellow : "rgba(255,210,0,0.2)"}`, display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
              {photo
                ? <img src={photo} alt="perfil" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                : <span style={{ fontFamily:"'Syne', sans-serif", fontWeight:800, fontSize:32, color:C.yellow }}>{initials}</span>
              }
            </div>
            {uploadingPhoto && (
              <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"rgba(5,5,5,0.7)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <div style={{ width:20, height:20, border:`2px solid ${C.yellow}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
              </div>
            )}
          </div>
          <span style={{ fontFamily:"'Space Mono', monospace", fontSize:9, color: photoError ? C.red : C.yellow, letterSpacing:"0.2em" }}>
            {photoError ? photoError : uploadingPhoto ? (lang === "pt-BR" ? "SALVANDO..." : "SAVING...") : photo ? t("change_photo") : t("add_photo")}
          </span>
        </label>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <Section title={t("personal_data")}>
        <Field label={t("name")} value={form.name} onChange={set("name")} />
        <Field label={t("email")} value={form.email} onChange={set("email")} type="email" />
        <div style={{ display:"flex", gap:10 }}>
          <div style={{ flex:1 }}>
            <MaskedField label={t("height")} value={form.height} onChange={set("height")} placeholder="1.70" maskFn={applyHeightMask} />
          </div>
          <div style={{ flex:1 }}>
            <MaskedField label={t("weight")} value={form.weight} onChange={set("weight")} placeholder="70.0" maskFn={applyWeightMask} />
          </div>
        </div>
        <Field label={t("birth_date")} value={form.dateOfBirth} onChange={set("dateOfBirth")} type="date" max={maxBirthDate()} />
        <div style={{ fontFamily:"'Space Mono', monospace", fontSize:8, color:C.muted, marginTop:-8, marginBottom:14, letterSpacing:"0.1em" }}>
          {lang === "pt-BR" ? "* Necessário ter 15 anos ou mais" : "* Must be 15 years or older"}
        </div>
        {infoErrorMsg && (
          <div style={{ background:"rgba(255,59,48,0.1)", border:"1px solid rgba(255,59,48,0.3)", borderRadius:10, padding:"10px 14px", marginBottom:12, fontSize:12, color:C.red, fontFamily:"'DM Sans', sans-serif" }}>
            {infoErrorMsg}
          </div>
        )}
        <div style={{ marginBottom:14 }}>
          <div style={{ fontFamily:"'Space Mono', monospace", fontSize:9, letterSpacing:"0.2em", color:C.muted, textTransform:"uppercase", marginBottom:6 }}>{t("gender")}</div>
          <div style={{ display:"flex", gap:8 }}>
            {["F","M"].map(g => (
              <button key={g} onClick={() => set("gender")(g)} style={{ flex:1, padding:"12px", borderRadius:12, cursor:"pointer", background: form.gender === g ? C.yellow : C.graphite, color: form.gender === g ? "#050505" : C.muted, border: form.gender === g ? "none" : "1px solid rgba(255,255,255,0.08)", fontFamily:"'Space Mono', monospace", fontSize:11, fontWeight:700 }}>
                {g === "F" ? t("female").slice(0,4) : t("male").slice(0,4)}
              </button>
            ))}
          </div>
        </div>
        <SaveButton onClick={saveInfo} saving={savingInfo} saved={savedInfo} error={errorInfo} t={t} />
      </Section>

      <Section title={t("training_goal")}>
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:14 }}>
          {GOALS.map(g => (
            <button key={g} onClick={() => setActiveGoal(g)} style={{ background: activeGoal === g ? "rgba(255,210,0,0.1)" : C.graphite, border:`1px solid ${activeGoal === g ? C.yellow : "rgba(255,255,255,0.06)"}`, borderRadius:12, padding:"12px 16px", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontFamily:"'DM Sans', sans-serif", fontSize:14, fontWeight:500, color: activeGoal === g ? C.yellow : C.text }}>{goalT(g, lang)}</span>
              {activeGoal === g && <span style={{ color:C.yellow, fontSize:14 }}>✓</span>}
            </button>
          ))}
        </div>
        <SaveButton onClick={saveGoal} saving={savingGoal} saved={savedGoal} error={errorGoal} t={t} />
      </Section>

      <Section title={t("language")}>
        <div style={{ display:"flex", gap:8 }}>
          {["pt-BR", "en"].map(l => (
            <button key={l} onClick={() => changeLang(l)} style={{
              flex:1, padding:"12px", borderRadius:12, cursor:"pointer",
              background: lang === l ? C.yellow : C.graphite,
              color: lang === l ? "#050505" : C.muted,
              border: lang === l ? "none" : "1px solid rgba(255,255,255,0.08)",
              fontFamily:"'Space Mono', monospace", fontSize:10, fontWeight:700,
              transition:"all 0.2s",
            }}>
              {l === "pt-BR" ? "🇧🇷 Português" : "🇺🇸 English"}
            </button>
          ))}
        </div>
      </Section>

      <button onClick={onEditPlan} style={{ width:"100%", background:C.graphite, border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"14px", cursor:"pointer", marginBottom:10, fontFamily:"'Space Mono', monospace", fontSize:10, fontWeight:700, letterSpacing:"0.2em", color:C.muted }}>
        {t("edit_plan")}
      </button>

      <button onClick={onLogout} style={{ width:"100%", background:"none", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:"14px", cursor:"pointer", marginBottom:14, fontFamily:"'Space Mono', monospace", fontSize:10, fontWeight:700, letterSpacing:"0.2em", color:C.muted, transition:"all 0.2s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,59,48,0.4)"; e.currentTarget.style.color = C.red; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = C.muted; }}
      >
        {t("logout")}
      </button>
    </div>
  );
}