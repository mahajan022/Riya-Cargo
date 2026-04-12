import { useState, useEffect } from "react";
import { LOGO, IMG_OFFICE, IMG_WH1, IMG_WH2, IMG_TRUCK, IMG_WORKERS, IMG_BOXES, IMG_FURN, IMG_INDOOR, REAL_01, REAL_02, REAL_03, REAL_04, REAL_05, REAL_06, REAL_07 } from "./images.js";

const EJS_SVC = "YOUR_SERVICE_ID";
const EJS_TPL = "YOUR_TEMPLATE_ID";
const EJS_KEY = "YOUR_PUBLIC_KEY";

/* ─── THEME: White + Warm Yellow ─────────────────────────
   --acc  : #e6a817  (golden yellow — buttons, borders, accents)
   --acc2 : #f5c842  (lighter yellow hover)
   --accd : #c48e0a  (dark yellow hover)
   --acl  : #fef9ec  (very light yellow — card bgs, labels)
   --black: #1a1a1a
   --dark : #2d2d2d
   --grey : #666
   --bg   : #ffffff
*/

const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Open+Sans:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --acc: #d4991a; --accd: #b07d0d; --accl: #fdf6e3; --accb: rgba(212,153,26,0.12);
      --black: #1a1a1a; --dark: #333; --grey: #777;
      --border: #ebebeb; --bg: #fff; --bgalt: #fafafa;
      --shadow: 0 2px 12px rgba(0,0,0,0.06); --shadow-lg: 0 8px 28px rgba(0,0,0,0.08);
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
    }
    @media(max-width:560px){
      .g3{grid-template-columns:1fr!important} .g4{grid-template-columns:1fr!important}
      .gal{columns:1!important} .fgrid{grid-template-columns:1fr!important}
      .frow{grid-template-columns:1fr!important}
      .hero-form-grid{grid-template-columns:1fr!important}
      .top-bar-right{display:none!important}
      .sec{padding:2.5rem 1rem!important}
      .hero-inner{padding:2.5rem 1rem 2rem!important}
    }
    .mm{display:none;position:fixed;inset:0;z-index:999;background:rgba(255,255,255,0.99);flex-direction:column;align-items:center;justify-content:center;gap:1rem}
    .mm.open{display:flex}
    .mm button{background:transparent;border:none;cursor:pointer;font-family:'Poppins',sans-serif;font-weight:700;font-size:1.2rem;letter-spacing:1px;text-transform:uppercase;color:var(--dark);padding:10px 20px;transition:color 0.2s}
    .mm button:hover,.mm button.act{color:var(--acc)}
    input:focus,select:focus,textarea:focus{border-color:var(--acc)!important;box-shadow:0 0 0 3px rgba(212,153,26,0.15)!important;outline:none}
    input,select,textarea{outline:none}
  `}</style>
);

const H = { fontFamily: "'Poppins', sans-serif" };
const B = { fontFamily: "'Open Sans', sans-serif" };

/* ── Shared ── */
const Tag = ({ text }) => (
  <div style={{ display:"inline-block", background:"var(--accl)", color:"var(--accd)", padding:"3px 13px", borderRadius:"3px", ...H, fontWeight:700, fontSize:"0.68rem", letterSpacing:"2px", textTransform:"uppercase", marginBottom:"0.7rem", border:"1px solid rgba(212,153,26,0.25)" }}>{text}</div>
);

const Btn = ({ children, onClick, outline }) => {
  const [hov, setHov] = useState(false);
  const bg = outline ? (hov ? "var(--acc)" : "transparent") : "var(--acc)";
  const cl = outline ? (hov ? "var(--black)" : "var(--acc)") : "var(--black)";
  return (
    <button onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ background:bg, color:cl, border:outline?"2px solid var(--acc)":"none", padding:"11px 26px", cursor:"pointer", borderRadius:"4px", ...H, fontWeight:700, fontSize:"0.82rem", letterSpacing:"0.8px", textTransform:"uppercase", transition:"all 0.22s", transform:hov?"translateY(-2px)":"translateY(0)", boxShadow:hov?"0 6px 20px rgba(212,153,26,0.4)":"none" }}>
      {children}{hov ? " →" : ""}
    </button>
  );
};

const PH = ({ tag, title, setPage }) => (
  <div className="ph" style={{ background:"#f4f0e6", padding:"5rem 2rem 2.8rem", position:"relative", borderBottom:"1px solid var(--border)" }}>
    <div style={{ position:"absolute", top:0, left:0, right:0, height:"4px", background:"var(--acc)" }} />
    <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
      <Tag text={tag} />
      <h1 style={{ ...H, fontWeight:800, fontSize:"clamp(1.8rem,4vw,3rem)", color:"var(--black)", lineHeight:1.1, marginBottom:"0.7rem" }}>{title}</h1>
      <div style={{ display:"flex", gap:"8px", ...B, fontSize:"0.8rem", color:"var(--grey)" }}>
        <span style={{ cursor:"pointer" }} onClick={()=>setPage("Home")} onMouseEnter={e=>e.target.style.color="var(--acc)"} onMouseLeave={e=>e.target.style.color="var(--grey)"}>Home</span>
        <span>›</span><span style={{ color:"var(--acc)" }}>{title}</span>
      </div>
    </div>
  </div>
);

const CTA = ({ title, sub, btn, setPage }) => (
  <div style={{ background:"var(--acc)", padding:"3.5rem 2rem", textAlign:"center" }}>
    <h2 style={{ ...H, fontWeight:800, fontSize:"clamp(1.2rem,2.5vw,1.8rem)", color:"var(--black)", marginBottom:"0.5rem" }}>{title}</h2>
    <p style={{ ...B, color:"rgba(26,26,26,0.7)", marginBottom:"1.5rem", fontSize:"0.95rem" }}>{sub}</p>
    <button onClick={()=>setPage("Contact")} style={{ background:"var(--black)", color:"white", border:"none", padding:"12px 32px", cursor:"pointer", borderRadius:"4px", ...H, fontWeight:700, fontSize:"0.85rem", letterSpacing:"0.8px", textTransform:"uppercase", transition:"all 0.22s" }}
      onMouseEnter={e=>{ e.currentTarget.style.background="white"; e.currentTarget.style.color="var(--black)"; }}
      onMouseLeave={e=>{ e.currentTarget.style.background="var(--black)"; e.currentTarget.style.color="white"; }}>{btn}</button>
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
      <div style={{ background:"#2a2a2a", padding:"5px 2rem", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"6px" }}>
        <div style={{ display:"flex", gap:"1.5rem", flexWrap:"wrap" }}>
          <a href="tel:9146171008" style={{ ...B, fontSize:"0.73rem", color:"rgba(255,255,255,0.75)", textDecoration:"none", fontWeight:500 }}>📞 +91 91461 71008</a>
          <a href="mailto:info.riyacargopune@gmail.com" style={{ ...B, fontSize:"0.73rem", color:"rgba(255,255,255,0.75)", textDecoration:"none", fontWeight:500 }}>✉️ info.riyacargopune@gmail.com</a>
        </div>
        <div className="top-bar-right" style={{ ...B, fontSize:"0.68rem", color:"rgba(255,255,255,0.5)" }}>GSTIN: 33BTFPA7894F1ZN &nbsp;|&nbsp; ISO 9001-2015 Certified</div>
      </div>
      {/* main nav */}
      <nav style={{ position:"sticky", top:0, zIndex:500, background:"white", boxShadow: sc?"0 2px 14px rgba(0,0,0,0.1)":"0 1px 0 var(--border)", padding:"0 2rem", height:"62px", display:"flex", alignItems:"center", justifyContent:"space-between", transition:"box-shadow 0.3s" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"11px", cursor:"pointer" }} onClick={()=>go("Home")}>
          <img src={LOGO} alt="Riya Cargo Packers and Movers Pune" style={{ width:"42px", height:"42px", borderRadius:"50%", objectFit:"cover", border:"2px solid var(--acc)" }} />
          <div style={{ lineHeight:1.2 }}>
            <div style={{ ...H, fontWeight:800, fontSize:"1.05rem", color:"var(--black)", letterSpacing:"0.5px" }}>RIYA CARGO</div>
            <div style={{ ...B, fontSize:"0.5rem", color:"var(--grey)", letterSpacing:"2px", textTransform:"uppercase" }}>Packers & Movers Pune</div>
          </div>
        </div>
        <div className="nl" style={{ display:"flex", alignItems:"center", gap:"2px" }}>
          {ls.map(l=>(
            <button key={l} onClick={()=>go(l)} style={{ background: page===l?"var(--acc)":"transparent", color: page===l?"var(--black)":"var(--dark)", border:"none", cursor:"pointer", padding:"7px 15px", borderRadius:"4px", ...H, fontWeight:600, fontSize:"0.8rem", letterSpacing:"0.3px", transition:"all 0.2s" }}
              onMouseEnter={e=>{ if(page!==l){ e.currentTarget.style.background="var(--accl)"; e.currentTarget.style.color="var(--accd)"; }}}
              onMouseLeave={e=>{ if(page!==l){ e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--dark)"; }}}>
              {l==="Contact"?"Get Quote":l}
            </button>
          ))}
        </div>
        <button className="hb" onClick={()=>setMo(true)} style={{ display:"none", background:"transparent", border:"none", cursor:"pointer", flexDirection:"column", gap:"5px", padding:"4px" }}>
          {[0,1,2].map(i=><span key={i} style={{ width:"22px", height:"2px", background:"var(--dark)", display:"block", borderRadius:"2px" }} />)}
        </button>
      </nav>
      <div className={`mm ${mo?"open":""}`}>
        <button onClick={()=>setMo(false)} style={{ position:"absolute", top:"20px", right:"20px", fontSize:"1.8rem", color:"var(--grey)", background:"none", border:"none", cursor:"pointer" }}>✕</button>
        {ls.map(l=><button key={l} className={page===l?"act":""} onClick={()=>go(l)}>{l==="Contact"?"Get Quote":l}</button>)}
      </div>
    </>
  );
};

/* ── HERO ── */
const Hero = ({ setPage }) => {
  const [sl, setSl] = useState(0);
  const [form, setForm] = useState({ name:"", phone:"", from:"", to:"", service:"", date:"" });
  const [st, setSt] = useState("idle");
  const slides = [IMG_WORKERS, IMG_FURN, IMG_BOXES, REAL_03];
  useEffect(()=>{ const t=setInterval(()=>setSl(s=>(s+1)%slides.length),5000); return()=>clearInterval(t); },[]);

  const submit = async () => {
    if(!form.name||!form.phone){ alert("Please enter your name and phone."); return; }
    setSt("sending");
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
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(100deg, rgba(10,10,10,0.80) 0%, rgba(10,10,10,0.72) 50%, rgba(10,10,10,0.60) 100%)" }} />
      </div>

      {/* Content */}
      <div className="hero-inner" style={{ position:"relative", zIndex:5, maxWidth:"1280px", margin:"0 auto", padding:"5rem 2.5rem 3.5rem", display:"flex", alignItems:"center", gap:"3rem", minHeight:"88vh" }}>

        {/* Left text */}
        <div className="hero-text" style={{ flex:"1 1 0", minWidth:0 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"7px", background:"rgba(212,153,26,0.18)", border:"1px solid rgba(212,153,26,0.4)", padding:"3px 12px 3px 5px", borderRadius:"30px", marginBottom:"1.1rem", animation:"fadeUp 0.7s ease both" }}>
            <span style={{ background:"var(--acc)", color:"var(--black)", padding:"2px 9px", borderRadius:"20px", ...H, fontWeight:700, fontSize:"0.6rem", letterSpacing:"1px" }}>ISO CERTIFIED</span>
            <span style={{ ...B, fontSize:"0.7rem", color:"rgba(255,255,255,0.8)", letterSpacing:"0.8px" }}>PUNE'S TRUSTED MOVERS & PACKERS</span>
          </div>
          {/* KEYWORD 1 — H1 hero headline */}
          <h1 style={{ ...H, fontWeight:900, fontSize:"clamp(1.8rem,4.2vw,3.4rem)", lineHeight:1.1, color:"white", animation:"fadeUp 0.8s ease 0.1s both", marginBottom:"0.9rem", textShadow:"0 2px 10px rgba(0,0,0,0.4)" }}>
            #1 PACKERS AND<br /><span style={{ color:"var(--acc)" }}>MOVERS IN PUNE</span>
          </h1>
          {/* KEYWORD 2 — hero sub-description */}
          <p style={{ ...B, fontSize:"0.92rem", color:"rgba(255,255,255,0.75)", maxWidth:"420px", lineHeight:1.85, animation:"fadeUp 0.8s ease 0.2s both", marginBottom:"1.5rem" }}>
            Riya Cargo — trusted <strong style={{color:"rgba(255,255,255,0.9)"}}>Movers and Packers in Pune</strong> for household shifting, office relocation & car transport across India. Safe, insured & stress-free.
          </p>
          <div className="hero-stats" style={{ display:"flex", gap:"2rem", flexWrap:"wrap", animation:"fadeUp 0.8s ease 0.3s both" }}>
            {[["5000+","Moves Done"],["15+","Years Exp"],["100%","Safe Delivery"]].map(([n,l])=>(
              <div key={n}>
                <div style={{ ...H, fontWeight:900, fontSize:"1.7rem", color:"var(--acc)" }}>{n}</div>
                <div style={{ ...B, fontSize:"0.65rem", color:"rgba(255,255,255,0.52)", textTransform:"uppercase", letterSpacing:"0.8px" }}>{l}</div>
              </div>
            ))}
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
              <h3 style={{ ...H, fontWeight:700, color:"var(--accd)", fontSize:"1.2rem", marginBottom:"0.4rem" }}>Request Sent!</h3>
              <p style={{ ...B, color:"var(--grey)", fontSize:"0.87rem" }}>We'll call you within 2 hours.</p>
              <button onClick={()=>setSt("idle")} style={{ marginTop:"1rem", background:"var(--acc)", color:"var(--black)", border:"none", padding:"8px 20px", borderRadius:"4px", cursor:"pointer", ...H, fontWeight:700, fontSize:"0.8rem" }}>Submit Again</button>
            </div>
          ):(
            <div style={{ background:"white", borderRadius:"10px", overflow:"hidden", boxShadow:"0 12px 40px rgba(0,0,0,0.3)" }}>
              <div style={{ background:"linear-gradient(135deg, #1a1a1a, #2d2d2d)", padding:"1rem 1.4rem", borderBottom:"3px solid var(--acc)" }}>
                {/* KEYWORD 3 — form header */}
                <div style={{ ...H, fontWeight:800, fontSize:"1rem", color:"white", marginBottom:"0.15rem" }}>GET A <span style={{ color:"var(--acc)" }}>FREE QUOTE</span></div>
                <div style={{ ...B, fontSize:"0.68rem", color:"rgba(255,255,255,0.45)" }}>Best Packers and Movers Near Me · Reply within 2 hrs · Free</div>
              </div>
              <div style={{ padding:"1.4rem" }}>
              <div className="hero-form-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.7rem" }}>
                <div><label style={{...lbl, color:"var(--grey)"}}>Name *</label><input style={inp} placeholder="Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
                <div><label style={{...lbl, color:"var(--grey)"}}>Phone *</label><input style={inp} placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
                <div><label style={{...lbl, color:"var(--grey)"}}>Moving From</label><input style={inp} placeholder="City / Area" value={form.from} onChange={e=>setForm({...form,from:e.target.value})} /></div>
                <div><label style={{...lbl, color:"var(--grey)"}}>Moving To</label><input style={inp} placeholder="City / Area" value={form.to} onChange={e=>setForm({...form,to:e.target.value})} /></div>
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
              <button onClick={submit} disabled={st==="sending"} style={{ width:"100%", marginTop:"1rem", background:st==="sending"?"#ccc":`linear-gradient(135deg, #e6ac20, var(--acc), #c48a0a)`, color:"#1a1a1a", border:"none", padding:"11px", cursor:st==="sending"?"not-allowed":"pointer", borderRadius:"6px", ...H, fontWeight:700, fontSize:"0.85rem", letterSpacing:"0.5px", textTransform:"uppercase", transition:"all 0.25s", boxShadow:"0 4px 15px rgba(212,153,26,0.3)" }}
                onMouseEnter={e=>{ if(st!=="sending"){ e.currentTarget.style.boxShadow="0 6px 22px rgba(212,153,26,0.5)"; e.currentTarget.style.transform="translateY(-2px)"; }}}
                onMouseLeave={e=>{ if(st!=="sending"){ e.currentTarget.style.boxShadow="0 4px 15px rgba(212,153,26,0.3)"; e.currentTarget.style.transform="translateY(0)"; }}}>
                {st==="sending"?"Sending...":"Get Free Quote →"}
              </button>
              </div>
            </div>
          )}
        </div>
      </div>
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

      {/* TICKER */}
      <div style={{ background:"var(--black)", padding:"0.65rem 0", overflow:"hidden" }}>
        <div style={{ display:"flex", gap:"3rem", animation:"ticker 22s linear infinite", whiteSpace:"nowrap" }}>
          {[...Array(2)].map((_,r)=>
            ["Packers and Movers Pune","Car Transportation","Office Relocation","Movers and Packers Pune","Warehouse Storage","Insurance Coverage"].map((s,i)=>(
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
            {/* KEYWORD 4 — About section heading */}
            <h2 style={{ ...H, fontWeight:800, fontSize:"clamp(1.5rem,3vw,2.4rem)", color:"var(--black)", lineHeight:1.15, marginBottom:"1rem" }}>PUNE'S MOST <span style={{ color:"var(--acc)" }}>TRUSTED</span> PACKERS AND MOVERS</h2>
            {/* KEYWORD 5 — About body paragraph */}
            <p style={{ ...B, color:"var(--grey)", lineHeight:1.85, marginBottom:"1rem", fontSize:"0.94rem" }}>Riya Cargo is a leading name among <strong>Movers and Packers in Pune</strong> — ISO 9001-2015 certified, based in Pune with branches in Chennai & Ahmedabad. With 5000+ moves and a zero damage guarantee, we are the name families and businesses trust for safe relocation.</p>
            <ul style={{ listStyle:"none", marginBottom:"1.6rem" }}>
              {["Professionally trained packing team","Transit insurance on all shipments","GST registered, transparent pricing","Pan-India network & delivery"].map(f=>(
                <li key={f} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"6px 0", borderBottom:"1px solid var(--border)", ...B, fontSize:"0.9rem", color:"var(--dark)" }}>
                  <span style={{ width:"18px", height:"18px", background:"var(--acc)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.55rem", color:"var(--black)", fontWeight:"bold", flexShrink:0 }}>✓</span>{f}
                </li>
              ))}
            </ul>
            <Btn onClick={()=>setPage("About")}>Learn More</Btn>
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
            {/* KEYWORD 6 — Services section heading */}
            <h2 style={{ ...H, fontWeight:800, fontSize:"clamp(1.5rem,3vw,2.4rem)", color:"var(--black)" }}>OUR <span style={{ color:"var(--acc)" }}>SERVICES</span></h2>
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

      {/* PROCESS */}
      <div className="sec" style={{ background:"var(--bg)", padding:"5rem 2rem" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"2.2rem" }}>
            <Tag text="How It Works" />
            <h2 style={{ ...H, fontWeight:800, fontSize:"clamp(1.5rem,3vw,2.4rem)", color:"var(--black)" }}>4-STEP <span style={{ color:"var(--acc)" }}>PROCESS</span></h2>
          </div>
          <div className="g4" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0", position:"relative" }}>
            <div style={{ position:"absolute", top:"28px", left:"12%", right:"12%", height:"2px", background:"linear-gradient(90deg,var(--acc),var(--black))", zIndex:0 }} />
            {[{n:"01",t:"Book Survey",d:"Expert visits for free pre-move inspection."},
              {n:"02",t:"Get Quote",d:"Transparent quote — zero hidden charges."},
              {n:"03",t:"We Pack",d:"Trained crew packs & loads all goods safely."},
              {n:"04",t:"Delivery",d:"Goods arrive safe at your new home."}].map((s,i)=>(
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
            <h2 style={{ ...H, fontWeight:800, fontSize:"clamp(1.5rem,3vw,2.4rem)", color:"var(--black)" }}>SEE WHAT WE <span style={{ color:"var(--acc)" }}>DO BEST</span></h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gridTemplateRows:"190px 190px", gap:"10px" }}>
            {[IMG_WORKERS,IMG_FURN,IMG_BOXES,IMG_WH1,IMG_TRUCK].map((src,i)=>(
              <div key={i} style={{ overflow:"hidden", borderRadius:"6px", gridRow:i===0?"span 2":undefined }}>
                <img src={src} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s" }} onMouseEnter={e=>e.target.style.transform="scale(1.06)"} onMouseLeave={e=>e.target.style.transform="scale(1)"} />
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
            <h2 style={{ ...H, fontWeight:800, fontSize:"clamp(1.5rem,3vw,2.4rem)", color:"var(--black)" }}>WHAT <span style={{ color:"var(--acc)" }}>CUSTOMERS</span> SAY</h2>
          </div>
          <div className="g3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.3rem" }}>
            {[
              /* KEYWORD 7 — woven into testimonial review text */
              {nm:"Rahul Kale",rt:"Pune to Mumbai",tx:"Found them while searching for Packers and Movers near me — every item packed with care, delivered without a scratch. Best movers in Pune!",st:5,in:"RK"},
              {nm:"Sunita Patil",rt:"Office Shift, Pune",tx:"Best Movers and Packers in Pune! Shifted our entire office in a day — punctual, organized, excellent team.",st:5,in:"SP"},
              {nm:"Arun Menon",rt:"Pune to Chennai",tx:"Riya Cargo Packers and Movers handled my car with total care. Transported in perfect condition — insurance gave complete peace of mind.",st:4,in:"AM"}
            ].map((t,i)=>(
              <div key={i} style={{ background:"var(--bgalt)", border:"1px solid var(--border)", borderTop:"3px solid var(--acc)", padding:"1.7rem", borderRadius:"6px", transition:"transform 0.3s" }}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-4px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                <div style={{ color:"var(--acc)", fontSize:"0.9rem", marginBottom:"8px" }}>{"★".repeat(t.st)}{"☆".repeat(5-t.st)}</div>
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

      {/* KEYWORD 8 — CTA banner */}
      <CTA title="LOOKING FOR PACKERS AND MOVERS NEAR YOU IN PUNE?" sub="Call Riya Cargo — the most trusted Movers and Packers in Pune. Free consultation, 7 days a week." btn="Get Free Quote" setPage={setPage} />
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
          <h2 style={{ ...H, fontWeight:800, fontSize:"clamp(1.5rem,3vw,2.4rem)", color:"var(--black)", lineHeight:1.15, marginBottom:"1.1rem" }}>TRUSTED PACKERS AND MOVERS<br />IN <span style={{ color:"var(--acc)" }}>PUNE</span></h2>
          {["Riya Cargo Movers & Packers (Regd.) is one of Pune's most trusted relocation companies. As professional Packers and Movers in Pune, we've perfected seamless, safe, and efficient moving for over a decade.",
            "ISO 9001-2015 certified, ensuring the highest international quality standards. Our trained professionals handle every move with care — from studio apartments to full corporate shifts.",
            "Headquartered in Pune with offices in Chennai (Mr. Ajay Kaswan) and Ahmedabad (Mr. Sandeep Kaswan), giving us a strong Pan-India reach for long-distance relocations.",
            "All shipments backed with transit insurance — no hidden costs, clear quotes, and open communication throughout your move."
          ].map((p,i)=><p key={i} style={{ ...B, color:"var(--grey)", lineHeight:1.85, marginBottom:"1rem", fontSize:"0.94rem" }}>{p}</p>)}
        </div>
        <div style={{ position:"sticky", top:"80px" }}>
          <img src={IMG_OFFICE} alt="Riya Cargo Movers and Packers Pune Office" style={{ width:"100%", borderRadius:"6px", boxShadow:"var(--shadow-lg)", marginBottom:"12px" }} />
          <img src={IMG_WH2} alt="Packers and Movers Pune Warehouse" style={{ width:"100%", borderRadius:"6px", boxShadow:"var(--shadow-lg)" }} />
        </div>
      </div>
    </div>
    <div className="sec" style={{ background:"var(--bgalt)", padding:"5rem 2rem" }}>
      <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
        <div style={{ textAlign:"center", marginBottom:"2.2rem" }}>
          <Tag text="Our Values" />
          <h2 style={{ ...H, fontWeight:800, fontSize:"clamp(1.5rem,3vw,2.4rem)", color:"var(--black)" }}>WHY CHOOSE <span style={{ color:"var(--acc)" }}>US</span></h2>
        </div>
        <div className="g3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.3rem" }}>
          {[{i:"🏆",t:"ISO 9001-2015",d:"Internationally certified quality management."},
            {i:"🛡️",t:"Transit Insurance",d:"Every shipment fully covered."},
            {i:"💬",t:"Honest Pricing",d:"No hidden costs, ever."},
            {i:"⚡",t:"On-Time Delivery",d:"We always commit to timelines."},
            {i:"🌐",t:"Pan-India Network",d:"Chennai, Ahmedabad & all India."},
            {i:"🤝",t:"5000+ Happy Clients",d:"Trust built over a decade of moving families across Pune."}].map((v,i)=>(
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
          <h2 style={{ ...H, fontWeight:800, fontSize:"clamp(1.5rem,3vw,2.4rem)", color:"var(--black)" }}>MEET THE <span style={{ color:"var(--acc)" }}>TEAM</span></h2>
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
                <div style={{ ...B, color:"var(--grey)", fontSize:"0.78rem" }}>📞 {m.ph}</div>
                <div style={{ ...B, color:"var(--grey)", fontSize:"0.73rem" }}>📍 {m.ci}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <CTA title="EXPERIENCED. TRUSTED. RELIABLE." sub="Join thousands of happy customers who chose Riya Cargo — Packers and Movers in Pune." btn="Get a Free Quote" setPage={setPage} />
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
            <h2 style={{ ...H, fontWeight:800, fontSize:"clamp(1.5rem,3vw,2.4rem)", color:"var(--black)" }}>EVERYTHING YOU <span style={{ color:"var(--acc)" }}>NEED</span></h2>
            <p style={{ ...B, color:"var(--grey)", fontSize:"0.88rem", marginTop:"0.5rem" }}>Trusted <strong>Packers and Movers near you</strong> — serving all areas of Pune</p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:"1.4rem" }}>
            {sv.map((s,i)=>(
              <div key={i} className="gsd" style={{ display:"grid", gridTemplateColumns:i%2===0?"0.9fr 1.1fr":"1.1fr 0.9fr", gap:"2.5rem", alignItems:"center", padding:"2rem", borderRadius:"8px", background:i%2===0?"var(--bgalt)":"white", border:"1px solid var(--border)", transition:"border-color 0.3s,box-shadow 0.3s" }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--acc)"; e.currentTarget.style.boxShadow="var(--shadow)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border)"; e.currentTarget.style.boxShadow="none"; }}>
                {i%2===0?(
                  <><div style={{ overflow:"hidden", borderRadius:"6px" }}><img src={s.img} alt={`${s.t} - Packers and Movers Pune`} style={{ width:"100%", height:"230px", objectFit:"cover", transition:"transform 0.5s" }} onMouseEnter={e=>e.target.style.transform="scale(1.04)"} onMouseLeave={e=>e.target.style.transform="scale(1)"} /></div>
                    <div><h3 style={{ ...H, fontWeight:800, fontSize:"1.35rem", color:"var(--black)", marginBottom:"0.7rem" }}>{s.i} {s.t}</h3><p style={{ ...B, color:"var(--grey)", lineHeight:1.85, marginBottom:"1rem", fontSize:"0.92rem" }}>{s.d}</p><div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>{s.tg.map(t=><span key={t} style={{ background:"var(--accl)", color:"var(--accd)", padding:"3px 10px", borderRadius:"20px", fontSize:"0.72rem", ...H, fontWeight:700, border:"1px solid rgba(212,153,26,0.25)" }}>{t}</span>)}</div></div></>
                ):(
                  <><div><h3 style={{ ...H, fontWeight:800, fontSize:"1.35rem", color:"var(--black)", marginBottom:"0.7rem" }}>{s.i} {s.t}</h3><p style={{ ...B, color:"var(--grey)", lineHeight:1.85, marginBottom:"1rem", fontSize:"0.92rem" }}>{s.d}</p><div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>{s.tg.map(t=><span key={t} style={{ background:"var(--accl)", color:"var(--accd)", padding:"3px 10px", borderRadius:"20px", fontSize:"0.72rem", ...H, fontWeight:700, border:"1px solid rgba(212,153,26,0.25)" }}>{t}</span>)}</div></div>
                    <div style={{ overflow:"hidden", borderRadius:"6px" }}><img src={s.img} alt={`${s.t} - Movers and Packers Pune`} style={{ width:"100%", height:"230px", objectFit:"cover", transition:"transform 0.5s" }} onMouseEnter={e=>e.target.style.transform="scale(1.04)"} onMouseLeave={e=>e.target.style.transform="scale(1)"} /></div></>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <CTA title="NOT SURE WHICH SERVICE YOU NEED?" sub="Our team of expert Movers and Packers in Pune will guide you to the right solution." btn="Talk to an Expert" setPage={setPage} />
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
            <h2 style={{ ...H, fontWeight:800, fontSize:"clamp(1.5rem,3vw,2.4rem)", color:"var(--black)" }}>OUR WORK <span style={{ color:"var(--acc)" }}>SPEAKS</span></h2>
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
            <h2 style={{ ...H, fontWeight:800, fontSize:"clamp(1.5rem,3vw,2.4rem)", color:"var(--black)", lineHeight:1.15, marginBottom:"1rem" }}>WE'RE HERE TO <span style={{ color:"var(--acc)" }}>HELP YOU MOVE</span></h2>
            <p style={{ ...B, color:"var(--grey)", marginBottom:"2rem", lineHeight:1.8, fontSize:"0.93rem" }}>Looking for <strong>Movers and Packers near you in Pune</strong>? Reach out for a free survey, quote, or any questions. Our team responds quickly!</p>
            {[{ic:"📍",t:"Head Office",c:"Khanna Building, Office No.2, Plot No.44,\nSec No.23, Transport Nagar,\nNigdi, Pune - 411044"},
              {ic:"📞",t:"Phone / WhatsApp",c:"+91 91461 71008\n+91 99620 71008 (Chennai)\n+91 99629 71008 (Ahmedabad)"},
              {ic:"📧",t:"Email",c:"info.riyacargopune@gmail.com\ninfo.rcmpindia@gmail.com"},
              {ic:"🌐",t:"Website & GST",c:"www.riyacargomovers.com\nGST: 33BTFPA7894F1ZN"},
              {ic:"⏰",t:"Business Hours",c:"Mon-Sat: 8:00 AM - 8:00 PM\nSunday: 10:00 AM - 4:00 PM"}].map((b,i)=>(
              <div key={i} style={{ display:"flex", gap:"12px", alignItems:"flex-start", padding:"0.9rem", marginBottom:"0.7rem", background:"var(--bgalt)", borderRadius:"6px", borderLeft:"3px solid var(--acc)", transition:"all 0.22s" }}
                onMouseEnter={e=>{ e.currentTarget.style.background="var(--accl)"; e.currentTarget.style.transform="translateX(4px)"; }} onMouseLeave={e=>{ e.currentTarget.style.background="var(--bgalt)"; e.currentTarget.style.transform="translateX(0)"; }}>
                <div style={{ width:"34px", height:"34px", background:"var(--acc)", borderRadius:"6px", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.9rem", flexShrink:0 }}>{b.ic}</div>
                <div><div style={{ ...H, fontWeight:700, color:"var(--black)", fontSize:"0.76rem", marginBottom:"3px" }}>{b.t}</div><div style={{ ...B, color:"var(--grey)", fontSize:"0.79rem", lineHeight:1.65, whiteSpace:"pre-line" }}>{b.c}</div></div>
              </div>
            ))}
          </div>
          <div style={{ background:"white", borderRadius:"12px", overflow:"hidden", boxShadow:"0 4px 24px rgba(0,0,0,0.08)", border:"2px solid var(--acc)", display:"flex", flexDirection:"column" }}>
            <div style={{ background:"linear-gradient(135deg, #1a1a1a, #2d2d2d)", padding:"1.6rem 2rem", borderBottom:"3px solid var(--acc)" }}>
              <div style={{ ...H, fontWeight:800, fontSize:"1.3rem", color:"white", marginBottom:"0.2rem" }}>GET A <span style={{ color:"var(--acc)" }}>FREE QUOTE</span></div>
              <div style={{ ...B, fontSize:"0.73rem", color:"rgba(255,255,255,0.5)" }}>#1 Packers and Movers Pune · Reply within 2 hours · No obligation · 100% Free</div>
            </div>
            <div style={{ padding:"1.8rem 2rem", flex:1, display:"flex", flexDirection:"column" }}>
            {st==="success"?(
              <div style={{ background:"#f0fdf4", border:"1px solid #c3e6cb", padding:"2rem", borderRadius:"8px", textAlign:"center" }}>
                <div style={{ fontSize:"2.5rem", marginBottom:"0.7rem" }}>✅</div>
                <h4 style={{ ...H, fontWeight:800, fontSize:"1.2rem", color:"#2d6a4f", marginBottom:"0.4rem" }}>REQUEST SENT!</h4>
                <p style={{ ...B, color:"#40916c", fontSize:"0.88rem" }}>We'll call you within 2 hours to confirm.</p>
                <button onClick={()=>setSt("idle")} style={{ marginTop:"1rem", background:"var(--acc)", color:"var(--black)", border:"none", padding:"9px 22px", borderRadius:"4px", cursor:"pointer", ...H, fontWeight:700, fontSize:"0.8rem" }}>Submit Another</button>
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
                <div style={{ marginBottom:"1.2rem" }}><label style={lbl}>Message</label><textarea style={{ ...inp, resize:"vertical", minHeight:"130px" }} placeholder="Tell us more about your move..." {...bind("msg")} /></div>
                </div>
                <button onClick={submit} disabled={st==="sending"} style={{ width:"100%", marginTop:"auto", background:st==="sending"?"#ccc":`linear-gradient(135deg, #e6ac20, var(--acc), #c48a0a)`, color:"#1a1a1a", border:"none", padding:"14px", ...H, fontWeight:800, fontSize:"0.9rem", letterSpacing:"1.5px", textTransform:"uppercase", cursor:st==="sending"?"not-allowed":"pointer", borderRadius:"6px", transition:"all 0.25s", boxShadow:"0 4px 15px rgba(212,153,26,0.3)" }}
                  onMouseEnter={e=>{ if(st!=="sending"){ e.currentTarget.style.boxShadow="0 6px 22px rgba(212,153,26,0.5)"; e.currentTarget.style.transform="translateY(-2px)"; }}}
                  onMouseLeave={e=>{ if(st!=="sending"){ e.currentTarget.style.boxShadow="0 4px 15px rgba(212,153,26,0.3)"; e.currentTarget.style.transform="translateY(0)"; }}}>
                  {st==="sending"?"Sending...":"Send My Request →"}
                </button>
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
const Footer = ({ setPage }) => (
  <footer style={{ background:"var(--black)", borderTop:"3px solid var(--acc)", padding:"3.5rem 2rem 1.5rem" }}>
    <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
      <div className="fgrid" style={{ display:"grid", gridTemplateColumns:"1.5fr 1fr 1fr 1fr", gap:"2.5rem", paddingBottom:"2.5rem", borderBottom:"1px solid rgba(255,255,255,0.08)", marginBottom:"1.5rem" }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:"11px", marginBottom:"1rem" }}>
            <img src={LOGO} alt="Riya Cargo Packers and Movers Pune" style={{ width:"44px", height:"44px", borderRadius:"50%", objectFit:"cover", border:"2px solid var(--acc)" }} />
            <div>
              <div style={{ ...H, fontWeight:800, fontSize:"1rem", color:"white" }}>RIYA CARGO</div>
              <div style={{ ...B, fontSize:"0.48rem", color:"rgba(255,255,255,0.35)", letterSpacing:"2px" }}>MOVERS & PACKERS (REGD.)</div>
            </div>
          </div>
          {/* KEYWORD — Footer description */}
          <p style={{ ...B, color:"rgba(255,255,255,0.45)", fontSize:"0.82rem", lineHeight:1.75 }}>ISO 9001-2015 certified <strong style={{color:"rgba(255,255,255,0.3)"}}>Packers and Movers in Pune</strong> providing prompt & secured relocation services across India. The most trusted <strong style={{color:"rgba(255,255,255,0.3)"}}>Movers and Packers near you</strong> in Pune.</p>
          <div style={{ marginTop:"0.7rem", ...B, fontSize:"0.68rem", color:"rgba(255,255,255,0.2)" }}>GST: 33BTFPA7894F1ZN</div>
        </div>
        {[{title:"Quick Links",items:[["Home","Home"],["About","About"],["Services","Services"],["Gallery","Gallery"],["Contact","Contact"]]},
          {title:"Services",items:[["Household Shifting",null],["Office Relocation",null],["Car Transport",null],["Packing & Unpacking",null],["Warehousing",null]]}].map((col,i)=>(
          <div key={i}>
            <h4 style={{ ...H, fontWeight:700, color:"white", fontSize:"0.76rem", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"1rem", paddingBottom:"6px", borderBottom:"2px solid var(--acc)", display:"inline-block" }}>{col.title}</h4>
            <ul style={{ listStyle:"none" }}>
              {col.items.map(([label,pg])=>(
                <li key={label} style={{ marginBottom:"6px" }}>
                  <span style={{ ...B, color:"rgba(255,255,255,0.45)", fontSize:"0.82rem", cursor:pg?"pointer":"default", transition:"color 0.2s" }}
                    onClick={()=>pg&&setPage(pg)} onMouseEnter={e=>{ if(pg) e.target.style.color="var(--acc)"; }} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.45)"}>→ {label}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h4 style={{ ...H, fontWeight:700, color:"white", fontSize:"0.76rem", letterSpacing:"1px", textTransform:"uppercase", marginBottom:"1rem", paddingBottom:"6px", borderBottom:"2px solid var(--acc)", display:"inline-block" }}>Contact</h4>
          <div style={{ ...B, fontSize:"0.79rem", color:"rgba(255,255,255,0.45)", lineHeight:2 }}>
            <div>📍 Nigdi, Pune 411044</div>
            <div>📞 <a href="tel:9146171008" style={{ color:"rgba(255,255,255,0.45)", textDecoration:"none" }}>91461 71008</a></div>
            <div>📧 <a href="mailto:info.riyacargopune@gmail.com" style={{ color:"rgba(255,255,255,0.45)", textDecoration:"none", fontSize:"0.72rem" }}>info.riyacargopune@gmail.com</a></div>
          </div>
        </div>
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:"0.72rem", color:"rgba(255,255,255,0.2)", ...B }}>
        <span>© 2026 Riya Cargo Movers & Packers (Regd.) — Packers and Movers Pune. All rights reserved.</span>
        <span>Made with ❤️ by Adswirll</span>
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
      <a href="https://wa.me/919146171008" target="_blank" rel="noreferrer"
        style={{ position:"fixed", bottom:"28px", right:"28px", zIndex:999, width:"52px", height:"52px", borderRadius:"50%", background:"#25D366", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.4rem", textDecoration:"none", animation:"pulse 2.5s infinite", boxShadow:"0 4px 18px rgba(37,211,102,0.5)", transition:"transform 0.3s" }}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>💬</a>
    </>
  );
}