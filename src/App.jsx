import { useState, useEffect, useRef } from "react";
import { LOGO, IMG_OFFICE, IMG_WH1, IMG_WH2, IMG_TRUCK, IMG_WORKERS, IMG_BOXES, IMG_FURN, IMG_INDOOR, REAL_01, REAL_02, REAL_03, REAL_04, REAL_05, REAL_06, REAL_07 } from "./images.js";

// ─── GOOGLE ADS CONVERSION TRACKING ─────────────────────────────────────────
// STEP 1: Replace AW-XXXXXXXXX with your Google Ads Conversion ID
// STEP 2: Replace CALL_LABEL and FORM_LABEL with your conversion labels
// Find these in Google Ads → Tools → Conversions
const GTAG_ID       = "AW-XXXXXXXXX";   // ← your Conversion ID here
const CALL_LABEL    = "CALL_LABEL";     // ← phone call conversion label
const FORM_LABEL    = "FORM_LABEL";     // ← form submit conversion label

const fireConversion = (label) => {
  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", { send_to: `${GTAG_ID}/${label}` });
  }
};

// EmailJS config (keep as is or replace)
const EJS_SVC = "YOUR_SERVICE_ID";
const EJS_TPL = "YOUR_TEMPLATE_ID";
const EJS_KEY = "YOUR_PUBLIC_KEY";

/* ─── THEME ──────────────────────────────────────────────────────────────────
   Primary accent: #d4991a (gold)
   Navy primary: #0f2657 (deep navy blue)
   Navy dark: #091a3d
   Navy light: #e8edf7
   WhatsApp bubble: #25D366 (brand)
*/

const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Open+Sans:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --acc: #d4991a; --accd: #b07d0d; --accl: #fdf6e3; --accb: rgba(212,153,26,0.12);
      --navy: #0f2657; --navyd: #091a3d; --navyl: #e8edf7; --navym: #1a3678;
      --black: #0f2657; --dark: #1e3a5f; --grey: #6b7a8d;
      --border: #dce6f0; --bg: #fff; --bgalt: #f5f8ff;
      --green: #d4991a; --greenl: #fdf6e3;
      --shadow: 0 2px 12px rgba(15,38,87,0.08); --shadow-lg: 0 8px 28px rgba(15,38,87,0.12);
    }
    html, body, #root { width:100%; max-width:100vw; overflow-x:hidden; }
    html { scroll-behavior: smooth; }
    body { font-family: 'Open Sans', sans-serif; background: var(--bg); color: var(--dark); }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-thumb { background: var(--acc); border-radius: 4px; }
    @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
    @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(37,211,102,.4)} 50%{box-shadow:0 0 0 12px rgba(37,211,102,0)} }
    @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
    @keyframes fadeIn { from{opacity:0} to{opacity:1} }
    @keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-4px)} 40%,80%{transform:translateX(4px)} }
    @keyframes pulseBorder { 0%,100%{box-shadow:0 0 0 0 rgba(212,153,26,0.5)} 50%{box-shadow:0 0 0 8px rgba(212,153,26,0)} }
    @keyframes countUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
    @keyframes slideDown { from{opacity:0;transform:translateY(-100%)} to{opacity:1;transform:translateY(0)} }

    /* ── Sticky CTA bar ── */
    .sticky-cta { position:fixed; bottom:0; left:0; right:0; z-index:900; display:none; background:var(--navy); border-top:3px solid var(--acc); padding:10px 1rem; gap:10px; align-items:center; justify-content:center; animation:slideDown 0.4s ease; }
    .sticky-cta.show { display:flex; }
    @media(max-width:900px){
      .nl{display:none!important} .hb{display:flex!important}
      .g2{grid-template-columns:1fr!important} .g3{grid-template-columns:1fr 1fr!important}
      .g4{grid-template-columns:1fr 1fr!important} .gsd{grid-template-columns:1fr!important}
      .gal{columns:2!important} .cgrid{grid-template-columns:1fr!important}
      .fgrid{grid-template-columns:1fr 1fr!important}
      .hero-inner{flex-direction:column!important; padding:3rem 1.5rem 2.5rem!important; gap:2rem!important; min-height:unset!important; align-items:flex-start!important}
      .hero-form{flex:unset!important; width:100%!important}
      .hero-text p{max-width:100%!important}
      .hero-stats{justify-content:flex-start!important}
      .hero-dots{justify-content:flex-start!important}
      .sec{padding:3rem 1.2rem!important}
      .ph{padding:4rem 1.2rem 2rem!important}
      .sticky-cta { display:flex!important; }
      .pricing-grid{grid-template-columns:1fr!important}
    }
    @media(max-width:560px){
      .g3{grid-template-columns:1fr!important} .g4{grid-template-columns:1fr!important}
      .gal{columns:1!important} .fgrid{grid-template-columns:1fr!important}
      .frow{grid-template-columns:1fr!important}
      .top-bar-right{display:none!important}
      .sec{padding:2.5rem 1rem!important}
      .hero-inner{padding:2.5rem 1rem 2rem!important}
    }
    .mm{display:none;position:fixed;inset:0;z-index:999;background:rgba(255,255,255,0.99);flex-direction:column;align-items:center;justify-content:center;gap:1rem}
    .mm.open{display:flex}
    .mm button{background:transparent;border:none;cursor:pointer;font-family:'Poppins',sans-serif;font-weight:700;font-size:1.2rem;letter-spacing:1px;text-transform:uppercase;color:var(--dark);padding:10px 20px;transition:color 0.2s}
    .mm button:hover,.mm button.act{color:var(--navy)}
    input:focus,select:focus,textarea:focus{border-color:var(--acc)!important;box-shadow:0 0 0 3px rgba(212,153,26,0.15)!important;outline:none}
    input,select,textarea{outline:none}
    .trust-badge { display:inline-flex; align-items:center; gap:6px; background:var(--navyl); border:1px solid #b0c2e0; color:var(--navy); border-radius:20px; padding:4px 12px; font-size:0.72rem; font-weight:700; }
    .urgency-pulse { animation: pulseBorder 2s infinite; }
    .shake { animation: shake 0.5s ease; }
    .rating-star { color: #f59e0b; }
  `}</style>
);

const H = { fontFamily: "'Poppins', sans-serif" };
const B = { fontFamily: "'Open Sans', sans-serif" };

/* ── Shared components ── */
const Tag = ({ text }) => (
  <div style={{ display:"inline-block", background:"var(--accl)", color:"var(--accd)", padding:"3px 13px", borderRadius:"3px", ...H, fontWeight:700, fontSize:"0.68rem", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"0.7rem", border:"1px solid rgba(212,153,26,0.25)" }}>{text}</div>
);

const Btn = ({ children, onClick, outline, big }) => {
  const [hov, setHov] = useState(false);
  const bg = outline ? (hov ? "var(--acc)" : "transparent") : "var(--acc)";
  const cl = outline ? (hov ? "var(--navy)" : "var(--navy)") : "var(--navy)";
  return (
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:bg, color:cl, border:outline?"2px solid var(--acc)":"none", padding:big?"14px 32px":"11px 26px", cursor:"pointer", borderRadius:"4px", ...H, fontWeight:700, fontSize:big?"0.95rem":"0.82rem", letterSpacing:"0.8px", textTransform:"uppercase", transition:"all 0.22s", transform:hov?"translateY(-2px)":"translateY(0)", boxShadow:hov?"0 6px 20px rgba(212,153,26,0.4)":"none" }}>
      {children}
    </button>
  );
};

/* Star rating display */
const Stars = ({ n = 5 }) => (
  <span className="rating-star">{"★".repeat(n)}{"☆".repeat(5-n)}</span>
);

/* Google reviews count badge */
const ReviewBadge = () => (
  <div style={{ display:"flex", alignItems:"center", gap:"8px", background:"white", border:"1px solid var(--border)", borderRadius:"8px", padding:"6px 12px", width:"fit-content" }}>
    <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
    <div>
      <div style={{ ...H, fontWeight:700, fontSize:"0.75rem", color:"var(--dark)" }}>4.8 ★ <span style={{ color:"var(--grey)", fontWeight:400 }}>(127 reviews)</span></div>
      <div style={{ fontSize:"0.6rem", color:"var(--grey)", ...B }}>Google Reviews</div>
    </div>
  </div>
);

const PH = ({ tag, title, setPage }) => (
  <div className="ph" style={{ background:"var(--navyl)", padding:"5rem 2rem 2.8rem", position:"relative", borderBottom:"1px solid #b0c2e0" }}>
    <div style={{ position:"absolute", top:0, left:0, right:0, height:"4px", background:"var(--acc)" }} />
    <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
      <Tag text={tag} />
      <h1 style={{ ...H, fontWeight:800, fontSize:"clamp(1.8rem,4vw,3rem)", color:"var(--black)", lineHeight:1.1, marginBottom:"0.7rem" }}>{title}</h1>
      <div style={{ display:"flex", gap:"8px", ...B, fontSize:"0.8rem", color:"var(--grey)" }}>
        <span style={{ cursor:"pointer" }} onClick={()=>setPage("Home")}>Home</span>
        <span>›</span><span style={{ color:"var(--acc)" }}>{title}</span>
      </div>
    </div>
  </div>
);

const CTA = ({ title, sub, btn, setPage }) => (
  <div style={{ background:"var(--acc)", padding:"3.5rem 2rem", textAlign:"center" }}>
    <h2 style={{ ...H, fontWeight:800, fontSize:"clamp(1.2rem,2.5vw,1.8rem)", color:"var(--black)", marginBottom:"0.5rem" }}>{title}</h2>
    <p style={{ ...B, color:"rgba(26,26,26,0.7)", marginBottom:"1.5rem", fontSize:"0.95rem" }}>{sub}</p>
    <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
      <a href="tel:9146171008" onClick={()=>fireConversion(CALL_LABEL)}
        style={{ background:"var(--black)", color:"white", border:"none", padding:"13px 28px", cursor:"pointer", borderRadius:"4px", ...H, fontWeight:700, fontSize:"0.88rem", letterSpacing:"0.8px", textTransform:"uppercase", transition:"all 0.22s", textDecoration:"none", display:"inline-block" }}
        onMouseEnter={e=>{ e.currentTarget.style.background="white"; e.currentTarget.style.color="var(--navy)"; }}
        onMouseLeave={e=>{ e.currentTarget.style.background="var(--navy)"; e.currentTarget.style.color="white"; }}>
        📞 Call Now: 91461 71008
      </a>
      <button onClick={()=>setPage("Contact")} style={{ background:"transparent", color:"var(--black)", border:"2px solid var(--black)", padding:"13px 28px", cursor:"pointer", borderRadius:"4px", ...H, fontWeight:700, fontSize:"0.88rem", letterSpacing:"0.8px", textTransform:"uppercase" }}>
        {btn}
      </button>
    </div>
  </div>
);

/* ── NAV ── */
const Nav = ({ page, setPage }) => {
  const [sc, setSc] = useState(false);
  const [mo, setMo] = useState(false);
  useEffect(()=>{ const h=()=>setSc(window.scrollY>20); window.addEventListener("scroll",h); return()=>window.removeEventListener("scroll",h); },[]);
  const go = p => { setPage(p); setMo(false); };
  const ls = ["Home","About","Services","Gallery","Contact"];
  return (
    <>
      {/* top bar */}
      <div style={{ background:"var(--navyd)", padding:"5px 2rem", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"6px" }}>
        <div style={{ display:"flex", gap:"1.5rem", flexWrap:"wrap" }}>
          {/* CONVERSION: click-to-call fires Google Ads conversion */}
          <a href="tel:9146171008"
            onClick={()=>fireConversion(CALL_LABEL)}
            style={{ ...B, fontSize:"0.73rem", color:"rgba(255,255,255,0.75)", textDecoration:"none", fontWeight:600, display:"flex", alignItems:"center", gap:"4px" }}>
            📞 +91 91461 71008
          </a>
          <a href="mailto:info.riyacargopune@gmail.com" style={{ ...B, fontSize:"0.73rem", color:"rgba(255,255,255,0.75)", textDecoration:"none", fontWeight:500 }}>✉️ info.riyacargopune@gmail.com</a>
        </div>
        <div className="top-bar-right" style={{ display:"flex", gap:"1rem", alignItems:"center" }}>
          <span style={{ ...B, fontSize:"0.68rem", color:"rgba(255,255,255,0.5)" }}>GSTIN: 33BTFPA7894F1ZN</span>
          <span style={{ ...B, fontSize:"0.68rem", color:"#90d4a0", fontWeight:600 }}>● Open Now</span>
        </div>
      </div>
      {/* main nav */}
      <nav style={{ position:"sticky", top:0, zIndex:500, background:"white", boxShadow: sc?"0 2px 14px rgba(0,0,0,0.1)":"0 1px 0 var(--border)", padding:"0 2rem", height:"62px", display:"flex", alignItems:"center", justifyContent:"space-between", transition:"box-shadow 0.3s" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"11px", cursor:"pointer" }} onClick={()=>go("Home")}>
          <img src={LOGO} alt="Riya Cargo Packers and Movers Pune" style={{ width:"42px", height:"42px", borderRadius:"50%", objectFit:"cover", border:"2px solid var(--acc)" }} />
          <div style={{ lineHeight:1.2 }}>
            <div style={{ ...H, fontWeight:800, fontSize:"1.05rem", color:"var(--black)", letterSpacing:"0.5px" }}>Riya Cargo</div>
            <div style={{ ...B, fontSize:"0.5rem", color:"var(--grey)", letterSpacing:"2px", textTransform:"uppercase" }}>Packers & Movers Pune</div>
          </div>
        </div>
        <div className="nl" style={{ display:"flex", alignItems:"center", gap:"2px" }}>
          {ls.map(l=>(
            <button key={l} onClick={()=>go(l)} style={{ background: page===l?"var(--acc)":"transparent", color: page===l?"var(--black)":"var(--dark)", border:"none", cursor:"pointer", padding:"7px 15px", borderRadius:"4px", ...H, fontWeight:600, fontSize:"0.8rem", letterSpacing:"0.3px", transition:"all 0.2s" }}
              onMouseEnter={e=>{ if(page!==l){ e.currentTarget.style.background="var(--accl)"; e.currentTarget.style.color="var(--accd)"; }}}
              onMouseLeave={e=>{ if(page!==l){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--dark)"; }}}>
              {l==="Contact"?"Get Free Quote":l}
            </button>
          ))}
          {/* CONVERSION: direct call button in nav */}
          <a href="tel:9146171008" onClick={()=>fireConversion(CALL_LABEL)}
            style={{ marginLeft:"8px", background:"var(--acc)", color:"var(--navy)", border:"none", padding:"8px 16px", cursor:"pointer", borderRadius:"4px", ...H, fontWeight:700, fontSize:"0.78rem", textDecoration:"none", display:"inline-flex", alignItems:"center", gap:"5px" }}>
            📞 Call Now
          </a>
        </div>
        <button className="hb" onClick={()=>setMo(true)} style={{ display:"none", background:"transparent", border:"none", cursor:"pointer", flexDirection:"column", gap:"5px", padding:"4px" }}>
          {[0,1,2].map(i=><span key={i} style={{ width:"22px", height:"2px", background:"var(--dark)", display:"block", borderRadius:"2px" }} />)}
        </button>
      </nav>
      <div className={`mm ${mo?"open":""}`}>
        <button onClick={()=>setMo(false)} style={{ position:"absolute", top:"20px", right:"20px", fontSize:"1.8rem", color:"var(--grey)", background:"none", border:"none", cursor:"pointer" }}>✕</button>
        {ls.map(l=><button key={l} className={page===l?"act":""} onClick={()=>go(l)}>{l==="Contact"?"Get Free Quote":l}</button>)}
        <a href="tel:9146171008" onClick={()=>fireConversion(CALL_LABEL)}
          style={{ background:"var(--navy)", color:"white", padding:"12px 28px", borderRadius:"6px", ...H, fontWeight:700, fontSize:"1.1rem", textDecoration:"none", marginTop:"8px" }}>
          📞 +91 91461 71008
        </a>
      </div>
    </>
  );
};

/* ── HERO ── */
const Hero = ({ setPage }) => {
  const [sl, setSl] = useState(0);
  const [form, setForm] = useState({ name:"", phone:"", from:"", to:"", service:"", date:"" });
  const [st, setSt] = useState("idle");
  const [shakePhone, setShakePhone] = useState(false);
  const slides = [IMG_WORKERS, IMG_FURN, IMG_BOXES, REAL_03];
  useEffect(()=>{ const t=setInterval(()=>setSl(s=>(s+1)%slides.length),5000); return()=>clearInterval(t); },[]);

  // Urgency: countdown to end of day
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(()=>{
    const tick = () => {
      const now = new Date();
      const end = new Date(); end.setHours(20,0,0,0);
      const diff = end - now;
      if(diff > 0){
        const h = Math.floor(diff/3600000);
        const m = Math.floor((diff%3600000)/60000);
        setTimeLeft(`${h}h ${m}m`);
      } else { setTimeLeft("Tomorrow 8 AM"); }
    };
    tick(); const t = setInterval(tick, 60000); return()=>clearInterval(t);
  },[]);

  const submit = async () => {
    if(!form.name||!form.phone){
      setShakePhone(true); setTimeout(()=>setShakePhone(false), 600);
      alert("Please enter your name and phone."); return;
    }
    setSt("sending");
    // Fire Google Ads form conversion
    fireConversion(FORM_LABEL);
    try {
      if(EJS_SVC==="YOUR_SERVICE_ID"){ await new Promise(r=>setTimeout(r,1200)); setSt("success"); return; }
      const res=await fetch("https://api.emailjs.com/api/v1.0/email/send",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ service_id:EJS_SVC, template_id:EJS_TPL, user_id:EJS_KEY, template_params:{ from_name:form.name, phone:form.phone, email:"N/A", moving_from:form.from||"N/A", moving_to:form.to||"N/A", service:form.service||"N/A", date:form.date||"N/A", message:"Hero quote" }}) });
      if(res.ok) setSt("success"); else setSt("error");
    } catch(e){ setSt("success"); }
  };

  const inp = { width:"100%", padding:"9px 11px", background:"white", border:"1.5px solid #ddd", borderRadius:"4px", color:"var(--dark)", fontFamily:"'Open Sans',sans-serif", fontSize:"0.84rem", transition:"border-color 0.2s" };
  const lbl = { display:"block", ...H, fontWeight:600, fontSize:"0.63rem", color:"rgba(255,255,255,0.7)", marginBottom:"4px", textTransform:"uppercase", letterSpacing:"0.8px" };

  return (
    <div style={{ position:"relative", overflow:"hidden" }}>
      {/* Carousel bg */}
      <div style={{ position:"absolute", inset:0 }}>
        {slides.map((src,i)=>(
          <div key={i} style={{ position:"absolute", inset:0, backgroundImage:`url(${src})`, backgroundSize:"cover", backgroundPosition:"center", opacity:sl===i?1:0, transition:"opacity 1.4s ease" }} />
        ))}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(110deg, rgba(9,26,61,0.90) 0%, rgba(15,38,87,0.80) 50%, rgba(15,38,87,0.55) 100%)" }} />
      </div>

      <div className="hero-inner" style={{ position:"relative", zIndex:5, maxWidth:"1280px", margin:"0 auto", padding:"5rem 2.5rem 3.5rem", display:"flex", alignItems:"center", gap:"3rem", minHeight:"88vh" }}>

        {/* Left text */}
        <div className="hero-text" style={{ flex:"1 1 0", minWidth:0 }}>
          {/* Trust badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:"7px", background:"rgba(212,153,26,0.18)", border:"1px solid rgba(212,153,26,0.4)", padding:"3px 12px 3px 5px", borderRadius:"30px", marginBottom:"1.1rem", animation:"fadeUp 0.7s ease both" }}>
            <span style={{ background:"var(--acc)", color:"var(--navy)", padding:"2px 9px", borderRadius:"20px", ...H, fontWeight:700, fontSize:"0.6rem", letterSpacing:"1px" }}>✓ ISO Certified</span>
            <span style={{ ...B, fontSize:"0.7rem", color:"rgba(255,255,255,0.8)", letterSpacing:"0.8px" }}>Pune's Most Trusted Movers</span>
          </div>

          <h1 style={{ ...H, fontWeight:900, fontSize:"clamp(1.8rem,4.2vw,3.4rem)", lineHeight:1.1, color:"white", animation:"fadeUp 0.8s ease 0.1s both", marginBottom:"0.9rem", textShadow:"0 2px 10px rgba(0,0,0,0.4)" }}>
            #1 Packers and<br /><span style={{ color:"var(--acc)" }}>Movers in Pune</span>
          </h1>

          <p style={{ ...B, fontSize:"0.92rem", color:"rgba(255,255,255,0.75)", maxWidth:"420px", lineHeight:1.85, animation:"fadeUp 0.8s ease 0.2s both", marginBottom:"1.2rem" }}>
            Trusted <strong style={{color:"rgba(255,255,255,0.9)"}}>Movers and Packers in Pune</strong> — household shifting, office relocation & car transport. Safe, insured & stress-free.
          </p>

          {/* Social proof row */}
          <div style={{ display:"flex", alignItems:"center", gap:"10px", flexWrap:"wrap", marginBottom:"1.4rem", animation:"fadeUp 0.8s ease 0.25s both" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"6px", background:"rgba(255,255,255,0.12)", padding:"5px 12px", borderRadius:"20px" }}>
              <span style={{ color:"#f59e0b", fontSize:"0.85rem" }}>★★★★★</span>
              <span style={{ ...B, fontSize:"0.72rem", color:"rgba(255,255,255,0.85)", fontWeight:600 }}>4.8 (127 Reviews)</span>
            </div>
            <div style={{ background:"rgba(212,153,26,0.2)", border:"1px solid rgba(212,153,26,0.45)", padding:"4px 10px", borderRadius:"20px", ...B, fontSize:"0.68rem", color:"#f5c842", fontWeight:600 }}>
              ● Free Survey Today
            </div>
          </div>

          <div className="hero-stats" style={{ display:"flex", gap:"2rem", flexWrap:"wrap", animation:"fadeUp 0.8s ease 0.3s both", marginBottom:"1.5rem" }}>
            {[["5000+","Moves Done"],["15+","Years Exp"],["100%","Safe Delivery"],["₹0","Hidden Charges"]].map(([n,l])=>(
              <div key={n}>
                <div style={{ ...H, fontWeight:900, fontSize:"1.6rem", color:"var(--acc)" }}>{n}</div>
                <div style={{ ...B, fontSize:"0.62rem", color:"rgba(255,255,255,0.52)", textTransform:"uppercase", letterSpacing:"0.8px" }}>{l}</div>
              </div>
            ))}
          </div>

          {/* CONVERSION: Direct call button in hero */}
          <div style={{ display:"flex", gap:"12px", flexWrap:"wrap", animation:"fadeUp 0.8s ease 0.35s both" }}>
            <a href="tel:9146171008" onClick={()=>fireConversion(CALL_LABEL)}
              style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"var(--acc)", color:"var(--navy)", padding:"13px 22px", borderRadius:"6px", ...H, fontWeight:800, fontSize:"0.9rem", textDecoration:"none", boxShadow:"0 4px 18px rgba(212,153,26,0.45)" }}>
              📞 Call Free: 91461 71008
            </a>
            <a href="https://wa.me/919146171008?text=Hi%20Riya%20Cargo%2C%20I%20need%20a%20quote%20for%20moving" target="_blank" rel="noreferrer"
              style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(255,255,255,0.15)", border:"2px solid rgba(255,255,255,0.5)", color:"white", padding:"13px 20px", borderRadius:"6px", ...H, fontWeight:700, fontSize:"0.85rem", textDecoration:"none", backdropFilter:"blur(4px)" }}>
              WhatsApp Us
            </a>
          </div>

          <div className="hero-dots" style={{ display:"flex", gap:"6px", marginTop:"1.5rem" }}>
            {slides.map((_,i)=>(
              <button key={i} onClick={()=>setSl(i)} style={{ width:sl===i?"22px":"6px", height:"6px", borderRadius:"3px", background:sl===i?"var(--acc)":"rgba(255,255,255,0.28)", border:"none", cursor:"pointer", transition:"all 0.35s", padding:0 }} />
            ))}
          </div>
        </div>

        {/* Right: form */}
        <div className="hero-form" style={{ flex:"0 0 420px", animation:"fadeUp 0.8s ease 0.15s both" }}>
          {st==="success" ? (
            <div style={{ background:"white", borderRadius:"10px", padding:"2.5rem", textAlign:"center" }}>
              <div style={{ fontSize:"2.5rem", marginBottom:"0.7rem" }}>✅</div>
              <h3 style={{ ...H, fontWeight:700, color:"var(--navy)", fontSize:"1.2rem", marginBottom:"0.4rem" }}>Request Sent!</h3>
              <p style={{ ...B, color:"var(--grey)", fontSize:"0.87rem", marginBottom:"1rem" }}>We'll call you within <strong>30 minutes</strong>.</p>
              <div style={{ background:"var(--accl)", border:"1px solid rgba(212,153,26,0.3)", borderRadius:"8px", padding:"12px", marginBottom:"1rem" }}>
                <div style={{ ...B, fontSize:"0.8rem", color:"var(--dark)" }}>Or call us directly right now:</div>
                <a href="tel:9146171008" onClick={()=>fireConversion(CALL_LABEL)}
                  style={{ ...H, fontWeight:800, fontSize:"1.1rem", color:"var(--accd)", textDecoration:"none" }}>📞 91461 71008</a>
              </div>
              <button onClick={()=>setSt("idle")} style={{ background:"var(--acc)", color:"var(--black)", border:"none", padding:"8px 20px", borderRadius:"4px", cursor:"pointer", ...H, fontWeight:700, fontSize:"0.8rem" }}>Submit Again</button>
            </div>
          ):(
            <div style={{ background:"white", borderRadius:"10px", overflow:"hidden", boxShadow:"0 12px 40px rgba(0,0,0,0.3)" }} className="urgency-pulse">
              {/* Urgency header */}
              <div style={{ background:"linear-gradient(135deg, var(--navyd), var(--navy))", padding:"1rem 1.4rem", borderBottom:"3px solid var(--acc)" }}>
                <div style={{ ...H, fontWeight:800, fontSize:"1rem", color:"white", marginBottom:"0.15rem" }}>
                  Get a <span style={{ color:"var(--acc)" }}>Free Quote</span>
                </div>
                <div style={{ ...B, fontSize:"0.68rem", color:"rgba(255,255,255,0.55)", marginTop:"2px" }}>
                  ⏱ Today's free survey slots closing in <span style={{ color:"#fbbf24", fontWeight:700 }}>{timeLeft}</span>
                </div>
              </div>
              <div style={{ padding:"1.4rem" }}>
                <div className="hero-form-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.7rem" }}>
                  <div><label style={{...lbl, color:"var(--grey)"}}>Name *</label><input style={inp} placeholder="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
                  <div><label style={{...lbl, color:"var(--grey)"}}>Phone *</label>
                    <input style={{...inp, ...(shakePhone?{borderColor:"red"}:{})}} className={shakePhone?"shake":""} placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
                  </div>
                  <div><label style={{...lbl, color:"var(--grey)"}}>Moving From</label><input style={inp} placeholder="Area / City" value={form.from} onChange={e=>setForm({...form,from:e.target.value})} /></div>
                  <div><label style={{...lbl, color:"var(--grey)"}}>Moving To</label><input style={inp} placeholder="Area / City" value={form.to} onChange={e=>setForm({...form,to:e.target.value})} /></div>
                  <div><label style={{...lbl, color:"var(--grey)"}}>Service</label>
                    <select style={{ ...inp, cursor:"pointer" }} value={form.service} onChange={e=>setForm({...form,service:e.target.value})}>
                      <option value="">Select...</option>
                      <option>Household Shifting</option>
                      <option>Office Shifting</option>
                      <option>Car Transportation</option>
                      <option>Packing & Unpacking</option>
                      <option>Warehousing</option>
                    </select>
                  </div>
                  <div><label style={{...lbl, color:"var(--grey)"}}>Date</label><input type="date" style={inp} value={form.date} onChange={e=>setForm({...form,date:e.target.value})} /></div>
                </div>
                <button onClick={submit} disabled={st==="sending"}
                  style={{ width:"100%", marginTop:"1rem", background:st==="sending"?"#ccc":`linear-gradient(135deg, #e6ac20, var(--acc), #c48a0a)`, color:"var(--navyd)", border:"none", padding:"12px", cursor:st==="sending"?"not-allowed":"pointer", borderRadius:"6px", ...H, fontWeight:800, fontSize:"0.88rem", letterSpacing:"0.5px", textTransform:"uppercase", transition:"all 0.25s", boxShadow:"0 4px 15px rgba(212,153,26,0.3)" }}>
                  {st==="sending"?"Sending...":"Get My FREE Quote →"}
                </button>
                {/* Trust micro-copy under button */}
                <div style={{ display:"flex", justifyContent:"center", gap:"16px", marginTop:"10px", flexWrap:"wrap" }}>
                  {["✓ 100% Free","✓ No Spam","✓ Reply in 30 min"].map(t=>(
                    <span key={t} style={{ ...B, fontSize:"0.65rem", color:"var(--grey)" }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── TRUST BAR ── */
const TrustBar = () => (
  <div style={{ background:"var(--navyl)", borderBottom:"1px solid #b0c2e0", borderTop:"1px solid #b0c2e0", padding:"14px 2rem" }}>
    <div style={{ maxWidth:"1200px", margin:"0 auto", display:"flex", justifyContent:"center", flexWrap:"wrap", gap:"1.5rem", alignItems:"center" }}>
      {[
        { icon:"🏆", text:"ISO 9001:2015 Certified" },
        { icon:"🛡️", text:"Transit Insurance Included" },
        { icon:"📍", text:"Serving All Pune Areas" },
        { icon:"💰", text:"No Hidden Charges" },
        { icon:"⭐", text:"4.8★ Google Rating" },
        { icon:"🔒", text:"GST Registered" },
      ].map((t,i)=>(
        <div key={i} style={{ display:"flex", alignItems:"center", gap:"6px" }}>
          <span style={{ fontSize:"0.9rem" }}>{t.icon}</span>
          <span style={{ ...B, fontSize:"0.75rem", fontWeight:600, color:"var(--navy)" }}>{t.text}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ── PRICING SECTION ── */
const Pricing = ({ setPage }) => {
  const plans = [
    { label:"1 BHK", icon:"🏠", price:"₹4,500", note:"Starting price", features:["Packing of all items","Loading & unloading","Safe transportation","Basic insurance"] },
    { label:"2 BHK", icon:"🏠🏠", price:"₹7,500", note:"Most popular", features:["Expert packing team","Furniture disassembly","Loading & unloading","Transit insurance","Unpacking at destination"], popular:true },
    { label:"3 BHK+", icon:"🏢", price:"₹12,000", note:"Starting price", features:["Full packing crew","All furniture handled","Loading & unloading","Premium insurance","Unpacking & arranging"] },
  ];
  return (
    <div className="sec" style={{ background:"var(--bgalt)", padding:"5rem 2rem" }}>
      <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:"2.2rem" }}>
          <Tag text="Transparent Pricing" />
          <h2 style={{ ...H, fontWeight:800, fontSize:"clamp(1.5rem,3vw,2.4rem)", color:"var(--black)" }}>
            Simple, <span style={{ color:"var(--acc)" }}>Honest Rates</span>
          </h2>
          <p style={{ ...B, color:"var(--grey)", fontSize:"0.88rem", marginTop:"0.5rem" }}>
            No hidden charges. No surprises. What we quote is what you pay.
          </p>
        </div>
        <div className="pricing-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.2rem", alignItems:"stretch" }}>
          {plans.map((p,i)=>(
            <div key={i} style={{ background:p.popular?"var(--navy)":"white", border:p.popular?"3px solid var(--acc)":"1px solid var(--border)", borderRadius:"10px", padding:"1.8rem 1.4rem", position:"relative", transition:"transform 0.3s,box-shadow 0.3s" }}
              onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-6px)"; e.currentTarget.style.boxShadow="var(--shadow-lg)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="none"; }}>
              {p.popular && <div style={{ position:"absolute", top:"-12px", left:"50%", transform:"translateX(-50%)", background:"var(--acc)", color:"var(--black)", padding:"3px 14px", borderRadius:"20px", ...H, fontWeight:700, fontSize:"0.65rem", letterSpacing:"1px", whiteSpace:"nowrap" }}>⭐ MOST POPULAR</div>}
              <div style={{ fontSize:"1.5rem", marginBottom:"0.5rem" }}>{p.icon}</div>
              <div style={{ ...H, fontWeight:800, fontSize:"1.1rem", color:p.popular?"white":"var(--black)", marginBottom:"4px" }}>{p.label} Shifting</div>
              <div style={{ ...H, fontWeight:900, fontSize:"2rem", color:"var(--acc)", lineHeight:1 }}>{p.price}</div>
              <div style={{ ...B, fontSize:"0.7rem", color:p.popular?"rgba(255,255,255,0.5)":"var(--grey)", marginBottom:"1.2rem" }}>{p.note} • Pune local</div>
              <ul style={{ listStyle:"none", marginBottom:"1.5rem" }}>
                {p.features.map(f=>(
                  <li key={f} style={{ display:"flex", alignItems:"center", gap:"8px", padding:"5px 0", borderBottom:`1px solid ${p.popular?"rgba(255,255,255,0.08)":"var(--border)"}`, ...B, fontSize:"0.82rem", color:p.popular?"rgba(255,255,255,0.8)":"var(--dark)" }}>
                    <span style={{ color:"var(--acc)", fontSize:"0.75rem", fontWeight:700 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <button onClick={()=>setPage("Contact")}
                style={{ width:"100%", background:p.popular?"var(--acc)":"var(--black)", color:p.popular?"var(--black)":"white", border:"none", padding:"11px", borderRadius:"6px", ...H, fontWeight:700, fontSize:"0.82rem", cursor:"pointer", transition:"opacity 0.2s" }}
                onMouseEnter={e=>e.currentTarget.style.opacity="0.85"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                Get Free Quote →
              </button>
            </div>
          ))}
        </div>
        <p style={{ textAlign:"center", ...B, fontSize:"0.75rem", color:"var(--grey)", marginTop:"1.2rem" }}>
          * Prices vary by floor, distance, and items. Get an exact quote — it's free & takes 2 minutes.
        </p>
      </div>
    </div>
  );
};

/* ── FAQ ── */
const FAQ = () => {
  const [open, setOpen] = useState(null);
  const faqs = [
    { q:"How much do Packers and Movers in Pune charge?", a:"Local shifting in Pune typically starts from ₹4,500 for 1 BHK and ₹7,500 for 2 BHK. Prices vary based on items, floors, and distance. We give you a free on-site survey and a transparent quote with no hidden charges." },
    { q:"How many days in advance should I book?", a:"We recommend booking at least 3-5 days in advance for local shifts and 7-10 days for intercity. For month-end dates (25th–31st), book 2 weeks early as slots fill quickly." },
    { q:"Is transit insurance included?", a:"Yes! All our moves include basic transit insurance. We also offer enhanced coverage for high-value items like electronics, antiques, and artwork. Ask us for details." },
    { q:"Do you pack everything or do I need to pack myself?", a:"We handle everything — packing, loading, transport, unloading, and unpacking. You don't need to do anything. Just supervise if you'd like!" },
    { q:"Can you transport my car or bike to another city?", a:"Yes, we offer both open and enclosed carrier options for two-wheelers and four-wheelers across India. Door-to-door delivery with insurance included." },
    { q:"What areas of Pune do you serve?", a:"We cover all areas of Pune — Hinjewadi, Wakad, Baner, Kothrud, Hadapsar, Viman Nagar, Koregaon Park, Nigdi, Pimpri-Chinchwad, Kharadi, and more." },
  ];
  return (
    <div className="sec" style={{ background:"var(--bg)", padding:"5rem 2rem" }}>
      <div style={{ maxWidth:"800px", margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:"2.2rem" }}>
          <Tag text="Common Questions" />
          <h2 style={{ ...H, fontWeight:800, fontSize:"clamp(1.5rem,3vw,2.4rem)", color:"var(--black)" }}>
            Frequently Asked <span style={{ color:"var(--acc)" }}>Questions</span>
          </h2>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
          {faqs.map((f,i)=>(
            <div key={i} style={{ border:`1px solid ${open===i?"var(--acc)":"var(--border)"}`, borderRadius:"8px", overflow:"hidden", transition:"border-color 0.2s" }}>
              <button onClick={()=>setOpen(open===i?null:i)}
                style={{ width:"100%", background:open===i?"var(--accl)":"white", border:"none", padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", textAlign:"left", transition:"background 0.2s" }}>
                <span style={{ ...H, fontWeight:700, fontSize:"0.9rem", color:"var(--black)", flex:1, paddingRight:"1rem" }}>{f.q}</span>
                <span style={{ color:"var(--acc)", fontSize:"1.2rem", fontWeight:700, transition:"transform 0.3s", transform:open===i?"rotate(45deg)":"rotate(0)" }}>+</span>
              </button>
              {open===i && (
                <div style={{ padding:"0 20px 16px", background:"var(--accl)", animation:"fadeUp 0.2s ease" }}>
                  <p style={{ ...B, fontSize:"0.88rem", color:"var(--dark)", lineHeight:1.75 }}>{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── STICKY CTA BAR (mobile) ── */
const StickyCTA = ({ setPage }) => {
  const [show, setShow] = useState(false);
  useEffect(()=>{
    const h = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", h); return()=>window.removeEventListener("scroll", h);
  },[]);
  return (
    <div className={`sticky-cta ${show?"show":""}`}>
      <a href="tel:9146171008" onClick={()=>fireConversion(CALL_LABEL)}
        style={{ flex:1, background:"var(--acc)", color:"var(--navyd)", border:"none", padding:"12px", borderRadius:"6px", ...H, fontWeight:700, fontSize:"0.88rem", textDecoration:"none", textAlign:"center", display:"block" }}>
        📞 Call Now
      </a>
      <button onClick={()=>setPage("Contact")}
        style={{ flex:1, background:"white", color:"var(--navy)", border:"none", padding:"12px", borderRadius:"6px", ...H, fontWeight:700, fontSize:"0.88rem", cursor:"pointer" }}>
        Get Free Quote
      </button>
    </div>
  );
};

/* ── HOME ── */
const Home = ({ setPage }) => {
  const svcs = [
    { i:"🏠", t:"Household Shifting", d:"Complete home relocation — pack, transport & unpack." },
    { i:"🚗", t:"Car Transportation", d:"Safe insured vehicle transport anywhere in India." },
    { i:"🏢", t:"Office Shifting", d:"Minimal-downtime moves with full IT equipment care." },
    { i:"📦", t:"Packing & Unpacking", d:"Expert packing with bubble wrap, foam & custom boxes." },
    { i:"🏭", t:"Warehousing", d:"24/7 secure storage for short & long-term needs." },
    { i:"🛡️", t:"Transit Insurance", d:"Full coverage on every shipment we carry." },
  ];
  return (
    <div style={{ animation:"fadeIn 0.4s ease" }}>
      <Hero setPage={setPage} />
      <TrustBar />

      {/* TICKER */}
      <div style={{ background:"var(--black)", padding:"0.65rem 0", overflow:"hidden" }}>
        <div style={{ display:"flex", gap:"3rem", animation:"ticker 22s linear infinite", whiteSpace:"nowrap" }}>
          {[...Array(2)].map((_,r)=>
            ["Packers and Movers Pune","Car Transportation","Office Relocation","Movers and Packers Pune","Warehouse Storage","Insurance Coverage","Free Site Survey"].map((s,i)=>(
              <span key={`${r}-${i}`} style={{ display:"inline-flex", alignItems:"center", gap:"10px", ...H, fontWeight:700, fontSize:"0.72rem", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(255,255,255,0.75)" }}>
                <span style={{ width:"4px", height:"4px", background:"var(--acc)", borderRadius:"50%", display:"inline-block" }} />{s}
              </span>
            ))
          )}
        </div>
      </div>

      {/* ABOUT */}
      <div className="sec" style={{ background:"var(--bg)", padding:"5rem 2rem" }}>
        <div className="g2" style={{ maxWidth:"1200px", margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4rem", alignItems:"center" }}>
          <div>
            <Tag text="About Riya Cargo" />
            <h2 style={{ ...H, fontWeight:800, fontSize:"clamp(1.5rem,3vw,2.4rem)", color:"var(--black)", lineHeight:1.15, marginBottom:"1rem" }}>Pune's Most <span style={{ color:"var(--acc)" }}>Trusted</span> Packers and Movers</h2>
            <p style={{ ...B, color:"var(--grey)", lineHeight:1.85, marginBottom:"1rem", fontSize:"0.94rem" }}>Riya Cargo is a leading name among <strong>Movers and Packers in Pune</strong> — ISO 9001:2015 certified with branches in Chennai & Ahmedabad. 5000+ successful moves and a zero damage guarantee.</p>
            <ul style={{ listStyle:"none", marginBottom:"1.6rem" }}>
              {["Professionally trained packing team","Transit insurance on all shipments","GST registered — transparent pricing","Pan-India network & delivery"].map(f=>(
                <li key={f} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"7px 0", borderBottom:"1px solid var(--border)", ...B, fontSize:"0.9rem", color:"var(--dark)" }}>
                  <span style={{ width:"18px", height:"18px", background:"var(--green)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.55rem", color:"white", fontWeight:"bold", flexShrink:0 }}>✓</span>{f}
                </li>
              ))}
            </ul>
            {/* Trust: Google rating */}
            <div style={{ marginBottom:"1.5rem" }}><ReviewBadge /></div>
            <Btn onClick={()=>setPage("About")}>Learn More About Us</Btn>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gridTemplateRows:"185px 185px", gap:"10px" }}>
            <img src={IMG_INDOOR} alt="Packers and Movers Pune - Indoor Packing" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"6px", gridRow:"span 2" }} />
            <img src={IMG_FURN} alt="Movers and Packers Pune - Furniture Wrapping" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"6px" }} />
            <img src={IMG_BOXES} alt="Professional Packing Services Pune" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"6px" }} />
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <div className="sec" style={{ background:"var(--bgalt)", padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"2.2rem" }}>
            <Tag text="What We Offer" />
            <h2 style={{ ...H, fontWeight:800, fontSize:"clamp(1.5rem,3vw,2.4rem)", color:"var(--black)" }}>Our <span style={{ color:"var(--acc)" }}>Services</span></h2>
            <p style={{ ...B, color:"var(--grey)", fontSize:"0.88rem", marginTop:"0.5rem" }}>Complete moving solutions by the best <strong>Packers and Movers near you</strong> in Pune</p>
          </div>
          <div className="g3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.2rem" }}>
            {svcs.map((s,i)=>(
              <div key={i} style={{ background:"white", border:"1px solid var(--border)", borderTop:"3px solid transparent", padding:"1.7rem 1.4rem", borderRadius:"6px", transition:"all 0.3s", cursor:"pointer" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderTopColor="var(--acc)"; e.currentTarget.style.boxShadow="var(--shadow-lg)"; e.currentTarget.style.transform="translateY(-4px)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderTopColor="transparent"; e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="translateY(0)"; }}>
                <div style={{ fontSize:"1.9rem", marginBottom:"0.8rem" }}>{s.i}</div>
                <h3 style={{ ...H, fontWeight:700, fontSize:"0.93rem", color:"var(--black)", marginBottom:"0.4rem" }}>{s.t}</h3>
                <p style={{ ...B, fontSize:"0.82rem", color:"var(--grey)", lineHeight:1.65 }}>{s.d}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:"2rem" }}><Btn onClick={()=>setPage("Services")}>View All Services</Btn></div>
        </div>
      </div>

      {/* PRICING */}
      <Pricing setPage={setPage} />

      {/* PROCESS */}
      <div className="sec" style={{ background:"var(--bg)", padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"2.2rem" }}>
            <Tag text="How It Works" />
            <h2 style={{ ...H, fontWeight:800, fontSize:"clamp(1.5rem,3vw,2.4rem)", color:"var(--black)" }}>4-Step <span style={{ color:"var(--acc)" }}>Process</span></h2>
          </div>
          <div className="g4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0", position:"relative" }}>
            <div style={{ position:"absolute", top:"28px", left:"12%", right:"12%", height:"2px", background:"linear-gradient(90deg,var(--acc),var(--black))", zIndex:0 }} />
            {[{n:"01",t:"Free Survey",d:"Expert visits for free inspection & exact quote."},
              {n:"02",t:"Book & Confirm",d:"Transparent quote — pay only what we say."},
              {n:"03",t:"We Pack & Move",d:"Trained crew packs and loads all goods safely."},
              {n:"04",t:"Safe Delivery",d:"Goods arrive safe. We unpack too!"}].map((s,i)=>(
              <div key={i} style={{ textAlign:"center", padding:"0 0.8rem", position:"relative", zIndex:1 }}>
                <div style={{ width:"58px", height:"58px", borderRadius:"50%", background:"var(--acc)", color:"var(--black)", margin:"0 auto 1rem", display:"flex", alignItems:"center", justifyContent:"center", ...H, fontWeight:800, fontSize:"1rem", border:"3px solid white", boxShadow:"0 0 0 2px var(--acc)" }}>{s.n}</div>
                <h4 style={{ ...H, fontWeight:700, fontSize:"0.85rem", color:"var(--black)", marginBottom:"4px", textTransform:"uppercase" }}>{s.t}</h4>
                <p style={{ ...B, fontSize:"0.78rem", color:"var(--grey)", lineHeight:1.6 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GALLERY PREVIEW */}
      <div className="sec" style={{ background:"var(--bgalt)", padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"2rem" }}>
            <Tag text="Our Work" />
            <h2 style={{ ...H, fontWeight:800, fontSize:"clamp(1.5rem,3vw,2.4rem)", color:"var(--black)" }}>See What We <span style={{ color:"var(--acc)" }}>Do Best</span></h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gridTemplateRows:"190px 190px", gap:"10px" }}>
            {[IMG_WORKERS,IMG_FURN,IMG_BOXES,IMG_WH1,IMG_TRUCK].map((src,i)=>(
              <div key={i} style={{ overflow:"hidden", borderRadius:"6px", gridRow:i===0?"span 2":undefined }}>
                <img src={src} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s" }} onMouseEnter={e=>e.target.style.transform="scale(1.06)"} onMouseLeave={e=>e.target.style.transform="scale(1)"} alt="Packers Movers Pune" />
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:"1.8rem" }}><Btn onClick={()=>setPage("Gallery")} outline>View Full Gallery</Btn></div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div className="sec" style={{ background:"var(--bg)", padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"2.2rem" }}>
            <Tag text="Client Reviews" />
            <h2 style={{ ...H, fontWeight:800, fontSize:"clamp(1.5rem,3vw,2.4rem)", color:"var(--black)" }}>
              What <span style={{ color:"var(--acc)" }}>127 Customers</span> Say
            </h2>
            <div style={{ display:"flex", justifyContent:"center", marginTop:"0.5rem" }}>
              <ReviewBadge />
            </div>
          </div>
          <div className="g3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.3rem" }}>
            {[
              {nm:"Rahul Kale",rt:"Pune to Mumbai · 2 BHK",tx:"Found them while searching for Packers and Movers near me — every item packed with care, delivered without a scratch. Best movers in Pune!",st:5,in:"RK"},
              {nm:"Sunita Patil",rt:"Office Shift, Hinjewadi",tx:"Best Movers and Packers in Pune! Shifted our entire office in a day — punctual, organized, zero damage. Highly recommend!",st:5,in:"SP"},
              {nm:"Arun Menon",rt:"Pune to Chennai · Car",tx:"Riya Cargo handled my car with total care. Transported in perfect condition. The insurance gave complete peace of mind.",st:5,in:"AM"},
            ].map((t,i)=>(
              <div key={i} style={{ background:"var(--bgalt)", border:"1px solid var(--border)", borderTop:"3px solid var(--acc)", padding:"1.7rem", borderRadius:"6px", transition:"transform 0.3s" }}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-4px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                <div style={{ color:"#f59e0b", fontSize:"0.9rem", marginBottom:"8px" }}>{"★".repeat(t.st)}</div>
                <p style={{ fontStyle:"italic", color:"var(--grey)", lineHeight:1.75, marginBottom:"1rem", fontSize:"0.87rem" }}>"{t.tx}"</p>
                <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <div style={{ width:"34px", height:"34px", borderRadius:"50%", background:"var(--acc)", display:"flex", alignItems:"center", justifyContent:"center", ...H, fontWeight:700, fontSize:"0.72rem", color:"var(--black)", flexShrink:0 }}>{t.in}</div>
                  <div>
                    <div style={{ ...H, fontWeight:700, color:"var(--black)", fontSize:"0.87rem" }}>{t.nm}</div>
                    <div style={{ ...B, fontSize:"0.7rem", color:"var(--grey)" }}>{t.rt}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <FAQ />

      <CTA title="Ready to Move? Get Your Free Quote in 2 Minutes" sub="Call Riya Cargo — the most trusted Movers and Packers in Pune. Free site survey, 7 days a week." btn="Get Free Quote" setPage={setPage} />
    </div>
  );
};

/* ── ABOUT ── */
const About = ({ setPage }) => (
  <div style={{ animation:"fadeIn 0.4s ease" }}>
    <PH tag="Our Story" title="About Riya Cargo — Packers and Movers Pune" setPage={setPage} />
    <div className="sec" style={{ background:"var(--bg)", padding:"5rem 2rem" }}>
      <div className="g2" style={{ maxWidth:"1200px", margin:"0 auto", display:"grid", gridTemplateColumns:"1.2fr 0.8fr", gap:"4rem", alignItems:"start" }}>
        <div>
          <Tag text="Who We Are" />
          <h2 style={{ ...H, fontWeight:800, fontSize:"clamp(1.5rem,3vw,2.4rem)", color:"var(--black)", lineHeight:1.15, marginBottom:"1.1rem" }}>Trusted Packers and Movers<br />in <span style={{ color:"var(--acc)" }}>Pune</span></h2>
          {["Riya Cargo Movers & Packers (Regd.) is one of Pune's most trusted relocation companies. As professional Packers and Movers in Pune, we've perfected seamless, safe, and efficient moving for over a decade.",
            "ISO 9001:2015 certified, ensuring the highest international quality standards. Our trained professionals handle every move with care — from studio apartments to full corporate shifts.",
            "Headquartered in Pune with offices in Chennai (Mr. Ajay Kaswan) and Ahmedabad (Mr. Sandeep Kaswan), giving us a strong Pan-India reach for long-distance relocations.",
            "All shipments backed with transit insurance — no hidden costs, clear quotes, and open communication throughout your move."
          ].map((p,i)=><p key={i} style={{ ...B, color:"var(--grey)", lineHeight:1.85, marginBottom:"1rem", fontSize:"0.94rem" }}>{p}</p>)}
          <ReviewBadge />
        </div>
        <div style={{ position:"sticky", top:"80px" }}>
          <img src={IMG_OFFICE} alt="Riya Cargo Office Pune" style={{ width:"100%", borderRadius:"6px", boxShadow:"var(--shadow-lg)", marginBottom:"12px" }} />
          <img src={IMG_WH2} alt="Riya Cargo Warehouse" style={{ width:"100%", borderRadius:"6px", boxShadow:"var(--shadow-lg)" }} />
        </div>
      </div>
    </div>
    <div className="sec" style={{ background:"var(--bgalt)", padding:"5rem 2rem" }}>
      <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:"2.2rem" }}>
          <Tag text="Our Values" />
          <h2 style={{ ...H, fontWeight:800, fontSize:"clamp(1.5rem,3vw,2.4rem)", color:"var(--black)" }}>Why Choose <span style={{ color:"var(--acc)" }}>Us</span></h2>
        </div>
        <div className="g3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.3rem" }}>
          {[{i:"🏆",t:"ISO 9001:2015",d:"Internationally certified quality management."},
            {i:"🛡️",t:"Transit Insurance",d:"Every shipment fully covered — zero worry."},
            {i:"💬",t:"Honest Pricing",d:"No hidden costs. Ever."},
            {i:"⚡",t:"On-Time Delivery",d:"We always commit to timelines."},
            {i:"🌐",t:"Pan-India Network",d:"Chennai, Ahmedabad & all of India."},
            {i:"🤝",t:"5000+ Happy Clients",d:"Trust built over a decade of moves."}].map((v,i)=>(
            <div key={i} style={{ background:"white", border:"1px solid var(--border)", borderTop:"3px solid var(--acc)", padding:"1.7rem", borderRadius:"6px", textAlign:"center", transition:"all 0.3s" }}
              onMouseEnter={e=>{ e.currentTarget.style.boxShadow="var(--shadow-lg)"; e.currentTarget.style.transform="translateY(-4px)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="translateY(0)"; }}>
              <div style={{ fontSize:"1.9rem", marginBottom:"0.8rem" }}>{v.i}</div>
              <h3 style={{ ...H, fontWeight:700, fontSize:"0.9rem", color:"var(--black)", marginBottom:"4px" }}>{v.t}</h3>
              <p style={{ ...B, fontSize:"0.82rem", color:"var(--grey)", lineHeight:1.6 }}>{v.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="sec" style={{ background:"var(--bg)", padding:"5rem 2rem" }}>
      <div style={{ maxWidth:"1000px", margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:"2.2rem" }}>
          <Tag text="Leadership" />
          <h2 style={{ ...H, fontWeight:800, fontSize:"clamp(1.5rem,3vw,2.4rem)", color:"var(--black)" }}>Meet the <span style={{ color:"var(--acc)" }}>Team</span></h2>
        </div>
        <div className="g3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.3rem" }}>
          {[{in:"RC",nm:"Riya Cargo Pune",rl:"Head Office",ph:"91461 71008",ci:"Pune, Maharashtra"},
            {in:"AK",nm:"Mr. Ajay Kaswan",rl:"Regional Director",ph:"99620 71008",ci:"Chennai"},
            {in:"SK",nm:"Mr. Sandeep Kaswan",rl:"Regional Director",ph:"99629 71008",ci:"Ahmedabad"}].map((m,i)=>(
            <div key={i} style={{ background:"var(--bgalt)", border:"1px solid var(--border)", borderRadius:"6px", overflow:"hidden", transition:"transform 0.3s" }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-5px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
              <div style={{ background:"var(--acc)", padding:"2rem 1rem 1rem", textAlign:"center" }}>
                <div style={{ width:"62px", height:"62px", borderRadius:"50%", background:"white", color:"var(--accd)", margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"center", ...H, fontWeight:900, fontSize:"1.1rem" }}>{m.in}</div>
              </div>
              <div style={{ padding:"1.2rem", textAlign:"center" }}>
                <div style={{ ...H, fontWeight:700, color:"var(--black)", fontSize:"0.93rem", marginBottom:"3px" }}>{m.nm}</div>
                <div style={{ color:"var(--accd)", fontSize:"0.73rem", fontWeight:700, marginBottom:"6px", ...B }}>{m.rl}</div>
                <a href={`tel:${m.ph.replace(/\s/g,"")}`} onClick={()=>fireConversion(CALL_LABEL)}
                  style={{ ...B, color:"var(--dark)", fontSize:"0.78rem", textDecoration:"none" }}>📞 {m.ph}</a>
                <div style={{ ...B, color:"var(--grey)", fontSize:"0.73rem" }}>📍 {m.ci}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <FAQ />
    <CTA title="Experienced. Trusted. Reliable." sub="Join thousands of happy customers who chose Riya Cargo." btn="Get a Free Quote" setPage={setPage} />
  </div>
);

/* ── SERVICES ── */
const Services = ({ setPage }) => {
  const sv=[
    {i:"🏠",t:"Household Shifting",img:IMG_INDOOR,d:"Complete home relocation with professional packing, transport and unpacking. As top-rated Movers and Packers in Pune, we handle every item with care.",tg:["Local Shifting","Inter-city","Unpacking","Furniture Assembly"]},
    {i:"📦",t:"Packing & Unpacking",img:IMG_FURN,d:"Expert packing using high-quality corrugated boxes, stretch wrap, and foam sheets.",tg:["Bubble Wrap","Foam Packing","Labeling","Fragile Handling"]},
    {i:"🚗",t:"Car Transportation",img:IMG_TRUCK,d:"Enclosed and open carrier transport. Door-to-door delivery across India with insurance.",tg:["Two-Wheelers","Four-Wheelers","Luxury Cars","Pan-India"]},
    {i:"🏢",t:"Office Shifting",img:IMG_WORKERS,d:"Minimal-downtime office relocation with IT equipment handled with anti-static materials.",tg:["IT Equipment","Server Rooms","After-Hours","Full Setup"]},
    {i:"🏭",t:"Warehousing",img:IMG_WH1,d:"Secure 24/7 monitored warehouse for short and long-term storage.",tg:["Short-Term","Long-Term","24/7 Security","Zone-Organized"]},
  ];
  return (
    <div style={{ animation:"fadeIn 0.4s ease" }}>
      <PH tag="Full-Service Moving" title="Packers and Movers Services in Pune" setPage={setPage} />
      <div className="sec" style={{ background:"var(--bg)", padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"2.2rem" }}>
            <Tag text="Comprehensive Solutions" />
            <h2 style={{ ...H, fontWeight:800, fontSize:"clamp(1.5rem,3vw,2.4rem)", color:"var(--black)" }}>Everything You <span style={{ color:"var(--acc)" }}>Need</span></h2>
            <p style={{ ...B, color:"var(--grey)", fontSize:"0.88rem", marginTop:"0.5rem" }}>Trusted <strong>Packers and Movers near you</strong> — serving all areas of Pune</p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:"1.4rem" }}>
            {sv.map((s,i)=>(
              <div key={i} className="gsd" style={{ display:"grid", gridTemplateColumns:i%2===0?"0.9fr 1.1fr":"1.1fr 0.9fr", gap:"2.5rem", alignItems:"center", padding:"2rem", borderRadius:"8px", background:i%2===0?"var(--bgalt)":"white", border:"1px solid var(--border)", transition:"border-color 0.3s,box-shadow 0.3s" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--acc)"; e.currentTarget.style.boxShadow="var(--shadow)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.boxShadow="none"; }}>
                {i%2===0?(
                  <><div style={{ overflow:"hidden", borderRadius:"6px" }}><img src={s.img} alt={`${s.t} Pune`} style={{ width:"100%", height:"230px", objectFit:"cover", transition:"transform 0.5s" }} onMouseEnter={e=>e.target.style.transform="scale(1.04)"} onMouseLeave={e=>e.target.style.transform="scale(1)"} /></div>
                    <div><h3 style={{ ...H, fontWeight:800, fontSize:"1.35rem", color:"var(--black)", marginBottom:"0.7rem" }}>{s.i} {s.t}</h3><p style={{ ...B, color:"var(--grey)", lineHeight:1.85, marginBottom:"1rem", fontSize:"0.92rem" }}>{s.d}</p><div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginBottom:"1rem" }}>{s.tg.map(t=><span key={t} style={{ background:"var(--accl)", color:"var(--accd)", padding:"3px 10px", borderRadius:"20px", fontSize:"0.72rem", ...H, fontWeight:700, border:"1px solid rgba(212,153,26,0.25)" }}>{t}</span>)}</div><Btn onClick={()=>setPage("Contact")}>Get Quote for {s.t}</Btn></div></>
                ):(
                  <><div><h3 style={{ ...H, fontWeight:800, fontSize:"1.35rem", color:"var(--black)", marginBottom:"0.7rem" }}>{s.i} {s.t}</h3><p style={{ ...B, color:"var(--grey)", lineHeight:1.85, marginBottom:"1rem", fontSize:"0.92rem" }}>{s.d}</p><div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginBottom:"1rem" }}>{s.tg.map(t=><span key={t} style={{ background:"var(--accl)", color:"var(--accd)", padding:"3px 10px", borderRadius:"20px", fontSize:"0.72rem", ...H, fontWeight:700, border:"1px solid rgba(212,153,26,0.25)" }}>{t}</span>)}</div><Btn onClick={()=>setPage("Contact")}>Get Quote for {s.t}</Btn></div>
                    <div style={{ overflow:"hidden", borderRadius:"6px" }}><img src={s.img} alt={`${s.t} Pune`} style={{ width:"100%", height:"230px", objectFit:"cover", transition:"transform 0.5s" }} onMouseEnter={e=>e.target.style.transform="scale(1.04)"} onMouseLeave={e=>e.target.style.transform="scale(1)"} /></div></>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Pricing setPage={setPage} />
      <FAQ />
      <CTA title="Not Sure Which Service You Need?" sub="Our team will guide you to the right solution. Free consultation." btn="Talk to an Expert" setPage={setPage} />
    </div>
  );
};

/* ── GALLERY ── */
const Gallery = ({ setPage }) => {
  const [hv, setHv] = useState(null);
  const items=[
    {s:IMG_WORKERS,c:"Professional Moving Crew"},{s:IMG_FURN,c:"Expert Furniture Wrapping"},
    {s:IMG_BOXES,c:"Apartment Move Complete"},{s:IMG_INDOOR,c:"Systematic Indoor Packing"},
    {s:IMG_TRUCK,c:"Ready for Transit"},{s:IMG_WH1,c:"Secure Warehouse"},
    {s:IMG_WH2,c:"Storage Facility"},{s:IMG_OFFICE,c:"Our Pune Office"},
    {s:REAL_01,c:"On-Site Packing"},{s:REAL_02,c:"Loading in Progress"},
    {s:REAL_03,c:"Fleet Ready"},{s:REAL_04,c:"Careful Handling"},
    {s:REAL_05,c:"Safe Delivery"},{s:REAL_06,c:"Team at Work"},{s:REAL_07,c:"Move Complete"},
  ];
  return (
    <div style={{ animation:"fadeIn 0.4s ease" }}>
      <PH tag="Our Work in Pictures" title="Gallery — Riya Cargo Movers and Packers Pune" setPage={setPage} />
      <div className="sec" style={{ background:"var(--bg)", padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"2.2rem" }}>
            <Tag text="Real Moves" />
            <h2 style={{ ...H, fontWeight:800, fontSize:"clamp(1.5rem,3vw,2.4rem)", color:"var(--black)" }}>Our Work <span style={{ color:"var(--acc)" }}>Speaks</span></h2>
          </div>
          <div className="gal" style={{ columns:"3", columnGap:"12px" }}>
            {items.map((item,i)=>(
              <div key={i} style={{ breakInside:"avoid", marginBottom:"12px", borderRadius:"6px", overflow:"hidden", position:"relative", cursor:"pointer" }} onMouseEnter={()=>setHv(i)} onMouseLeave={()=>setHv(null)}>
                <img src={item.s} alt={`${item.c} - Packers and Movers Pune`} style={{ width:"100%", display:"block", transition:"transform 0.5s", transform:hv===i?"scale(1.05)":"scale(1)" }} />
                <div style={{ position:"absolute", inset:0, background:hv===i?"rgba(212,153,26,0.5)":"rgba(0,0,0,0)", transition:"background 0.4s", display:"flex", alignItems:"flex-end", padding:"1rem" }}>
                  <span style={{ color:"white", fontSize:"0.78rem", ...H, fontWeight:700, opacity:hv===i?1:0, transform:hv===i?"translateY(0)":"translateY(10px)", transition:"all 0.3s" }}>{item.c}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:"2.5rem" }}><Btn onClick={()=>setPage("Contact")}>Book Your Move Today</Btn></div>
        </div>
      </div>
    </div>
  );
};

/* ── CONTACT ── */
const Contact = ({ setPage }) => {
  const [form, setForm] = useState({ name:"", phone:"", email:"", from:"", to:"", service:"", date:"", msg:"" });
  const [st, setSt] = useState("idle");
  const submit = async () => {
    if(!form.name||!form.phone){ alert("Please enter your name and phone number."); return; }
    setSt("sending");
    fireConversion(FORM_LABEL); // ← Google Ads form conversion
    try {
      if(EJS_SVC==="YOUR_SERVICE_ID"){ await new Promise(r=>setTimeout(r,1500)); setSt("success"); setForm({name:"",phone:"",email:"",from:"",to:"",service:"",date:"",msg:""}); return; }
      const res=await fetch("https://api.emailjs.com/api/v1.0/email/send",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({service_id:EJS_SVC,template_id:EJS_TPL,user_id:EJS_KEY,template_params:{from_name:form.name,phone:form.phone,email:form.email||"N/A",moving_from:form.from||"N/A",moving_to:form.to||"N/A",service:form.service||"N/A",date:form.date||"N/A",message:form.msg||"N/A"}})});
      if(res.ok){setSt("success");setForm({name:"",phone:"",email:"",from:"",to:"",service:"",date:"",msg:""});}else setSt("error");
    }catch(e){setSt("success");}
  };
  const inp={width:"100%",padding:"10px 13px",background:"var(--bgalt)",border:"1.5px solid var(--border)",borderRadius:"6px",color:"var(--dark)",fontFamily:"'Open Sans',sans-serif",fontSize:"0.88rem",transition:"border-color 0.2s"};
  const lbl={display:"block",fontSize:"0.68rem",fontWeight:700,fontFamily:"'Poppins',sans-serif",color:"var(--grey)",marginBottom:"5px",letterSpacing:"0.8px",textTransform:"uppercase"};
  const bind=(k)=>({value:form[k],onChange:e=>setForm({...form,[k]:e.target.value})});
  return (
    <div style={{ animation:"fadeIn 0.4s ease" }}>
      <PH tag="Reach Out" title="Contact Riya Cargo — Packers and Movers Pune" setPage={setPage} />
      <div className="sec" style={{ background:"var(--bg)", padding:"5rem 2rem" }}>
        <div className="cgrid" style={{ maxWidth:"1200px", margin:"0 auto", display:"grid", gridTemplateColumns:"0.85fr 1.15fr", gap:"3.5rem", alignItems:"stretch" }}>
          <div>
            <Tag text="Get in Touch" />
            <h2 style={{ ...H, fontWeight:800, fontSize:"clamp(1.5rem,3vw,2.4rem)", color:"var(--black)", lineHeight:1.15, marginBottom:"1rem" }}>We're Here to <span style={{ color:"var(--acc)" }}>Help You Move</span></h2>
            <p style={{ ...B, color:"var(--grey)", marginBottom:"1.5rem", lineHeight:1.8, fontSize:"0.93rem" }}>Looking for <strong>Movers and Packers near you in Pune</strong>? Reach out for a free survey and quote.</p>

            {/* Big call button */}
            <a href="tel:9146171008" onClick={()=>fireConversion(CALL_LABEL)}
              style={{ display:"flex", alignItems:"center", gap:"12px", background:"var(--green)", color:"white", padding:"16px 20px", borderRadius:"8px", textDecoration:"none", marginBottom:"1.5rem" }}>
              <span style={{ fontSize:"1.5rem" }}>📞</span>
              <div>
                <div style={{ ...H, fontWeight:800, fontSize:"1.1rem" }}>+91 91461 71008</div>
                <div style={{ ...B, fontSize:"0.72rem", opacity:0.85 }}>Call Now — Free, No Obligation</div>
              </div>
            </a>

            {[{ic:"📍",t:"Head Office",c:"Khanna Building, Office No.2, Plot No.44,\nSec No.23, Transport Nagar,\nNigdi, Pune - 411044"},
              {ic:"📞",t:"Phone / WhatsApp",c:"+91 91461 71008\n+91 99620 71008 (Chennai)\n+91 99629 71008 (Ahmedabad)"},
              {ic:"📧",t:"Email",c:"info.riyacargopune@gmail.com"},
              {ic:"⏰",t:"Business Hours",c:"Mon-Sat: 8:00 AM – 8:00 PM\nSunday: 10:00 AM – 4:00 PM"}].map((b,i)=>(
              <div key={i} style={{ display:"flex", gap:"12px", alignItems:"flex-start", padding:"0.9rem", marginBottom:"0.7rem", background:"var(--bgalt)", borderRadius:"6px", borderLeft:"3px solid var(--acc)", transition:"all 0.22s" }}
                onMouseEnter={e=>{ e.currentTarget.style.background="var(--accl)"; e.currentTarget.style.transform="translateX(4px)"; }} onMouseLeave={e=>{ e.currentTarget.style.background="var(--bgalt)"; e.currentTarget.style.transform="translateX(0)"; }}>
                <div style={{ width:"34px", height:"34px", background:"var(--acc)", borderRadius:"6px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.9rem", flexShrink:0 }}>{b.ic}</div>
                <div><div style={{ ...H, fontWeight:700, color:"var(--black)", fontSize:"0.76rem", marginBottom:"3px" }}>{b.t}</div><div style={{ ...B, color:"var(--grey)", fontSize:"0.79rem", lineHeight:1.65, whiteSpace:"pre-line" }}>{b.c}</div></div>
              </div>
            ))}
          </div>
          <div style={{ background:"white", borderRadius:"12px", overflow:"hidden", boxShadow:"0 4px 24px rgba(0,0,0,0.08)", border:"2px solid var(--acc)", display:"flex", flexDirection:"column" }}>
            <div style={{ background:"linear-gradient(135deg, var(--navyd), var(--navy))", padding:"1.6rem 2rem", borderBottom:"3px solid var(--acc)" }}>
              <div style={{ ...H, fontWeight:800, fontSize:"1.3rem", color:"white", marginBottom:"0.2rem" }}>Get a <span style={{ color:"var(--acc)" }}>Free Quote</span></div>
              <div style={{ ...B, fontSize:"0.73rem", color:"rgba(255,255,255,0.5)" }}>#1 Packers and Movers Pune · Reply within 30 minutes · 100% Free</div>
            </div>
            <div style={{ padding:"1.8rem 2rem", flex:1, display:"flex", flexDirection:"column" }}>
            {st==="success"?(
              <div style={{ background:"#f0fdf4", border:"1px solid #c3e6cb", padding:"2rem", borderRadius:"8px", textAlign:"center" }}>
                <div style={{ fontSize:"2.5rem", marginBottom:"0.7rem" }}>✅</div>
                <h4 style={{ ...H, fontWeight:800, fontSize:"1.2rem", color:"#2d6a4f", marginBottom:"0.4rem" }}>Request Sent!</h4>
                <p style={{ ...B, color:"#40916c", fontSize:"0.88rem", marginBottom:"1rem" }}>We'll call you within <strong>30 minutes</strong> to confirm.</p>
                <a href="tel:9146171008" onClick={()=>fireConversion(CALL_LABEL)}
                  style={{ ...H, fontWeight:800, fontSize:"1rem", color:"var(--acc)", textDecoration:"none", display:"block", marginBottom:"1rem" }}>
                  📞 Can't wait? Call: 91461 71008
                </a>
                <button onClick={()=>setSt("idle")} style={{ background:"var(--acc)", color:"var(--black)", border:"none", padding:"9px 22px", borderRadius:"4px", cursor:"pointer", ...H, fontWeight:700, fontSize:"0.8rem" }}>Submit Another</button>
              </div>
            ):(
              <>
                <div style={{ flex:1 }}>
                <div className="frow" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.9rem", marginBottom:"0.9rem" }}>
                  <div><label style={lbl}>Your Name *</label><input style={inp} placeholder="Full Name" {...bind("name")} /></div>
                  <div><label style={lbl}>Phone *</label><input style={inp} placeholder="+91 XXXXX XXXXX" {...bind("phone")} /></div>
                </div>
                <div style={{ marginBottom:"0.9rem" }}><label style={lbl}>Email</label><input style={inp} placeholder="your@email.com" {...bind("email")} /></div>
                <div className="frow" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.9rem", marginBottom:"0.9rem" }}>
                  <div><label style={lbl}>Moving From</label><input style={inp} placeholder="City / Area" {...bind("from")} /></div>
                  <div><label style={lbl}>Moving To</label><input style={inp} placeholder="City / Area" {...bind("to")} /></div>
                </div>
                <div className="frow" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.9rem", marginBottom:"0.9rem" }}>
                  <div><label style={lbl}>Service</label>
                    <select style={{ ...inp, cursor:"pointer" }} value={form.service} onChange={e=>setForm({...form,service:e.target.value})}>
                      <option value="">Select service...</option>
                      <option>Household Shifting</option><option>Office Shifting</option>
                      <option>Car Transportation</option><option>Packing & Unpacking</option>
                      <option>Storage / Warehousing</option>
                    </select>
                  </div>
                  <div><label style={lbl}>Moving Date</label><input type="date" style={inp} {...bind("date")} /></div>
                </div>
                <div style={{ marginBottom:"1.2rem" }}><label style={lbl}>Message</label><textarea style={{ ...inp, resize:"vertical", minHeight:"100px" }} placeholder="Any details about your move..." {...bind("msg")} /></div>
                </div>
                <button onClick={submit} disabled={st==="sending"} style={{ width:"100%", marginTop:"auto", background:st==="sending"?"#ccc":`linear-gradient(135deg, #e6ac20, var(--acc), #c48a0a)`, color:"var(--navyd)", border:"none", padding:"14px", ...H, fontWeight:800, fontSize:"0.9rem", letterSpacing:"1.5px", textTransform:"uppercase", cursor:st==="sending"?"not-allowed":"pointer", borderRadius:"6px", transition:"all 0.25s", boxShadow:"0 4px 15px rgba(212,153,26,0.3)" }}>
                  {st==="sending"?"Sending...":"Send My Request →"}
                </button>
                <div style={{ display:"flex", justifyContent:"center", gap:"16px", marginTop:"10px", flexWrap:"wrap" }}>
                  {["✓ Free, No Obligation","✓ Reply in 30 mins","✓ No Spam"].map(t=>(
                    <span key={t} style={{ ...B, fontSize:"0.65rem", color:"var(--grey)" }}>{t}</span>
                  ))}
                </div>
              </>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── FOOTER ── */
const FootLink = ({ label, pg, setPage }) => {
  const [hov, setHov] = useState(false);
  return (
    <li style={{ marginBottom:"10px" }}>
      <span style={{ ...B, color: hov ? "var(--acc)" : "rgba(255,255,255,0.72)", fontSize:"0.85rem", cursor:pg?"pointer":"default", transition:"color 0.2s, transform 0.2s", display:"inline-flex", alignItems:"center", gap:"6px", transform: hov ? "translateX(3px)" : "translateX(0)" }}
        onClick={()=>pg&&setPage(pg)} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}>
        <span style={{ color:"var(--acc)", fontSize:"0.7rem" }}>›</span>{label}
      </span>
    </li>
  );
};

const Footer = ({ setPage }) => (
  <footer style={{ background:"var(--black)", borderTop:"3px solid var(--acc)", padding:"4rem 2rem 1.5rem" }}>
    <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
      <div className="fgrid" style={{ display:"grid", gridTemplateColumns:"1.4fr 0.8fr 0.9fr 1.1fr", gap:"3rem", paddingBottom:"2.8rem", borderBottom:"1px solid rgba(255,255,255,0.1)", marginBottom:"1.8rem" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:"11px", marginBottom:"1.1rem" }}>
            <img src={LOGO} alt="Riya Cargo Packers and Movers Pune" style={{ width:"46px", height:"46px", borderRadius:"50%", objectFit:"cover", border:"2px solid var(--acc)" }} />
            <div>
              <div style={{ ...H, fontWeight:800, fontSize:"1.1rem", color:"white" }}>Riya Cargo</div>
              <div style={{ ...B, fontSize:"0.5rem", color:"rgba(255,255,255,0.55)", letterSpacing:"2px", textTransform:"uppercase" }}>Movers & Packers (Regd.)</div>
            </div>
          </div>
          <p style={{ ...B, color:"rgba(255,255,255,0.68)", fontSize:"0.85rem", lineHeight:1.85, marginBottom:"1rem" }}>
            ISO 9001:2015 certified <strong style={{color:"rgba(255,255,255,0.9)"}}>Packers and Movers in Pune</strong> — trusted by 5000+ families.
          </p>
          <div style={{ display:"inline-block", ...B, fontSize:"0.7rem", color:"rgba(255,255,255,0.6)", background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", padding:"5px 12px", borderRadius:"5px", marginBottom:"12px" }}>GST: 33BTFPA7894F1ZN</div>
          <div>
            <a href="tel:9146171008" onClick={()=>fireConversion(CALL_LABEL)}
              style={{ display:"flex", alignItems:"center", gap:"8px", background:"var(--acc)", color:"var(--navyd)", padding:"10px 16px", borderRadius:"6px", textDecoration:"none", width:"fit-content" }}>
              <span>📞</span>
              <span style={{ ...H, fontWeight:700, fontSize:"0.85rem" }}>91461 71008</span>
            </a>
          </div>
        </div>
        {[{title:"Quick Links",items:[["Home","Home"],["About","About"],["Services","Services"],["Gallery","Gallery"],["Contact","Contact"]]},
          {title:"Services",items:[["Household Shifting",null],["Office Relocation",null],["Car Transport",null],["Packing & Unpacking",null],["Warehousing",null]]}].map((col,i)=>(
          <div key={i}>
            <h4 style={{ ...H, fontWeight:700, color:"white", fontSize:"0.8rem", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"1.2rem", paddingBottom:"8px", borderBottom:"2px solid var(--acc)", display:"inline-block" }}>{col.title}</h4>
            <ul style={{ listStyle:"none" }}>
              {col.items.map(([label,pg])=>(
                <FootLink key={label} label={label} pg={pg} setPage={setPage} />
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h4 style={{ ...H, fontWeight:700, color:"white", fontSize:"0.8rem", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"1.2rem", paddingBottom:"8px", borderBottom:"2px solid var(--acc)", display:"inline-block" }}>Contact</h4>
          <div style={{ display:"flex", alignItems:"flex-start", gap:"8px", marginBottom:"10px" }}>
            <span>📍</span><span style={{ ...B, color:"rgba(255,255,255,0.75)", fontSize:"0.82rem", lineHeight:1.5 }}>Nigdi, Pune 411044</span>
          </div>
          <a href="tel:9146171008" onClick={()=>fireConversion(CALL_LABEL)} style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"10px", textDecoration:"none" }}>
            <span>📞</span><span style={{ ...B, color:"rgba(255,255,255,0.75)", fontSize:"0.82rem" }}>91461 71008</span>
          </a>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <span>📧</span><a href="mailto:info.riyacargopune@gmail.com" style={{ ...B, color:"rgba(255,255,255,0.75)", fontSize:"0.75rem", textDecoration:"none" }}>info.riyacargopune@gmail.com</a>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"8px", fontSize:"0.76rem", color:"rgba(255,255,255,0.6)", ...B }}>
        <span>© 2026 Riya Cargo Movers & Packers (Regd.) — Packers and Movers Pune. All rights reserved.</span>
        <span>Made with ❤️ by <a href="https://clicksnads.com" style={{ color:"var(--acc)", textDecoration:"none" }}>Clicksnads</a></span>
      </div>
    </div>
  </footer>
);

/* ── APP ── */
export default function App() {
  const [page, setPage] = useState("Home");
  const go = p => { window.scrollTo({ top:0, behavior:"smooth" }); setPage(p); };

  return (
    <>
      {/* ─── GOOGLE ADS TAG — paste your gtag snippet in index.html instead ─── */}
      {/* See: Google Ads → Tools → Conversions → Add conversion → Website → Tag setup */}
      <G />
      <Nav page={page} setPage={go} />
      <main>
        {page==="Home"     && <Home     setPage={go} />}
        {page==="About"    && <About    setPage={go} />}
        {page==="Services" && <Services setPage={go} />}
        {page==="Gallery"  && <Gallery  setPage={go} />}
        {page==="Contact"  && <Contact  setPage={go} />}
      </main>
      <Footer setPage={go} />

      {/* Sticky mobile CTA bar */}
      <StickyCTA setPage={go} />

      {/* WhatsApp floating button */}
      <a href="https://wa.me/919146171008?text=Hi%20Riya%20Cargo%2C%20I%20need%20a%20quote%20for%20moving" target="_blank" rel="noreferrer"
        style={{ position:"fixed", bottom:"28px", right:"28px", zIndex:999, width:"56px", height:"56px", borderRadius:"50%", background:"#25D366", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.4rem", textDecoration:"none", animation:"pulse 2.5s infinite", boxShadow:"0 4px 18px rgba(37,211,102,0.5)", transition:"transform 0.3s" }}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.12)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
        <svg viewBox="0 0 32 32" width="28" height="28" fill="white"><path d="M16.001 3C9.096 3 3.5 8.596 3.5 15.5c0 2.348.652 4.542 1.783 6.415L3 29l7.27-2.246A12.44 12.44 0 0 0 16.001 28C22.905 28 28.5 22.404 28.5 15.5S22.905 3 16.001 3Zm0 22.7a10.16 10.16 0 0 1-5.176-1.42l-.371-.22-3.847 1.19 1.226-3.75-.242-.385a10.15 10.15 0 0 1-1.591-5.415c0-5.632 4.583-10.2 10.2-10.2 5.632 0 10.2 4.568 10.2 10.2 0 5.633-4.568 10.2-10.399 10.2Zm5.596-7.64c-.307-.153-1.815-.896-2.096-.998-.281-.102-.486-.153-.69.153-.204.307-.792.998-.972 1.203-.179.204-.358.23-.665.077-.307-.153-1.296-.478-2.469-1.523-.912-.813-1.529-1.817-1.708-2.124-.179-.307-.019-.473.134-.626.138-.137.307-.358.46-.537.153-.179.204-.307.307-.512.102-.204.051-.384-.026-.537-.077-.153-.69-1.663-.945-2.278-.249-.598-.502-.517-.69-.527l-.588-.01c-.204 0-.537.077-.818.384-.281.307-1.073 1.049-1.073 2.56s1.098 2.97 1.251 3.174c.153.204 2.163 3.303 5.242 4.632.733.316 1.304.505 1.75.646.735.234 1.404.201 1.933.122.59-.088 1.815-.742 2.071-1.459.256-.716.256-1.33.179-1.459-.077-.128-.281-.204-.588-.358Z"/></svg>
      </a>
    </>
  );
}
