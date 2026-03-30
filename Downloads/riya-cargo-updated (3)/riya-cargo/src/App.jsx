import { useState, useEffect } from "react";
import { LOGO, IMG_OFFICE, IMG_WH1, IMG_WH2, IMG_TRUCK, IMG_WORKERS, IMG_BOXES, IMG_FURN, IMG_INDOOR, REAL_01, REAL_02, REAL_03, REAL_04, REAL_05, REAL_06, REAL_07 } from "./images.js";

/* EMAILJS SETUP:
   1. Go to https://emailjs.com → Sign up FREE
   2. Add Email Service → connect your Gmail (info.riyacargopune@gmail.com)
   3. Create Email Template with variables: {{from_name}} {{phone}} {{email}} {{moving_from}} {{moving_to}} {{service}} {{date}} {{message}}
   4. Replace the 3 values below with your EmailJS dashboard values
*/
const EJS_SVC  = "YOUR_SERVICE_ID";
const EJS_TPL  = "YOUR_TEMPLATE_ID";
const EJS_KEY  = "YOUR_PUBLIC_KEY";

const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{--r:#e8311a;--rd:#b5240f;--am:#f5a623;--nv:#060d18;--n2:#0c1a2e;--n3:#0f1e30;--w:#f0f2f5;--mu:rgba(240,242,245,0.52);--bd:rgba(255,255,255,0.08);--cardbg:rgba(12,26,46,0.6);--mmb:rgba(6,13,24,0.98);--mmbtn:rgba(240,242,245,0.7);--navbg:rgba(6,13,24,0.97);--navborder:rgba(232,49,26,0.18)}
    html,body,#root{width:100%;max-width:100vw;overflow-x:hidden}
    html{scroll-behavior:smooth}
    body{font-family:"DM Sans",sans-serif;background:var(--nv);color:var(--w);transition:background 0.35s,color 0.35s}
    ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:var(--r);border-radius:4px}
    @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
    @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(37,211,102,.4)}50%{box-shadow:0 0 0 12px rgba(37,211,102,0)}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @media(max-width:900px){
      .nl{display:none!important}.hb{display:flex!important}
      .hero-stats{display:none!important}
      .g2{grid-template-columns:1fr!important}
      .g3{grid-template-columns:1fr 1fr!important}
      .g4{grid-template-columns:1fr 1fr!important}
      .gsd{grid-template-columns:1fr!important}
      .gal{columns:2!important}
      .cgrid{grid-template-columns:1fr!important}
      .fgrid{grid-template-columns:1fr 1fr!important}
    }
    @media(max-width:560px){
      .g3{grid-template-columns:1fr!important}
      .g4{grid-template-columns:1fr!important}
      .gal{columns:1!important}
      .fgrid{grid-template-columns:1fr!important}
      .hbtns{flex-direction:column!important}
      .frow{grid-template-columns:1fr!important}
    }
    .mm{display:none;position:fixed;inset:0;z-index:999;background:var(--mmb);flex-direction:column;align-items:center;justify-content:center;gap:1.5rem}
    .mm.open{display:flex}
    .mm button{background:transparent;border:none;cursor:pointer;font-family:"Montserrat",sans-serif;font-weight:700;font-size:1.4rem;letter-spacing:2px;text-transform:uppercase;color:var(--mmbtn);padding:10px 20px;transition:color 0.2s}
    .mm button:hover,.mm button.act{color:var(--r)}
  `}</style>
);

const H = {fontFamily:"'Montserrat',sans-serif"};
const B = {fontFamily:"'DM Sans',sans-serif"};

const Tag = ({c,a}) => (
  <div style={{display:"inline-block",padding:"3px 13px",marginBottom:"0.85rem",
    background:a?"rgba(245,166,35,0.12)":"rgba(232,49,26,0.12)",
    color:a?"var(--am)":"var(--r)",borderLeft:`3px solid ${a?"var(--am)":"var(--r)"}`,
    ...H,fontWeight:700,fontSize:"0.68rem",letterSpacing:"2.5px",textTransform:"uppercase"}}>{c}</div>
);

const Btn = ({children,onClick,v="r",s}) => {
  const vs = {
    r:{bg:"var(--r)",h:"var(--rd)",cl:"white",b:"none"},
    o:{bg:"transparent",h:"rgba(255,255,255,0.06)",cl:"var(--w)",b:"1px solid rgba(240,242,245,0.35)"},
    a:{bg:"transparent",h:"rgba(245,166,35,0.1)",cl:"var(--am)",b:"1px solid var(--am)"},
    w:{bg:"white",h:"#eee",cl:"var(--r)",b:"none"},
  };
  const x = vs[v];
  return (
    <button onClick={onClick} style={{background:x.bg,color:x.cl,border:x.b,
      padding:"11px 26px",cursor:"pointer",borderRadius:"4px",
      ...H,fontWeight:700,fontSize:"0.82rem",letterSpacing:"1.5px",textTransform:"uppercase",
      transition:"all 0.25s",...s}}
      onMouseEnter={e=>{e.currentTarget.style.background=x.h;e.currentTarget.style.transform="translateY(-2px)";}}
      onMouseLeave={e=>{e.currentTarget.style.background=x.bg;e.currentTarget.style.transform="translateY(0)";}}
    >{children}</button>
  );
};

const PH = ({tag,title,setPage}) => (
  <div style={{background:"linear-gradient(160deg,var(--n2),var(--n3))",padding:"8rem 2rem 3.5rem",position:"relative",overflow:"hidden",borderBottom:"1px solid var(--bd)"}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:"3px",background:"linear-gradient(90deg,var(--r),var(--am),var(--r))"}}/>
    <div style={{position:"absolute",bottom:"-1rem",right:"-1rem",...H,fontWeight:900,fontSize:"5rem",color:"rgba(255,255,255,0.025)",userSelect:"none",whiteSpace:"nowrap"}}>{title.toUpperCase()}</div>
    <div style={{maxWidth:"1200px",margin:"0 auto",position:"relative"}}>
      <Tag c={tag}/>
      <h1 style={{...H,fontWeight:900,fontSize:"clamp(2rem,4.5vw,3.2rem)",color:"var(--w)",lineHeight:1.05,marginBottom:"0.9rem"}}>{title}</h1>
      <div style={{display:"flex",gap:"8px",alignItems:"center",color:"var(--mu)",fontSize:"0.8rem",...B}}>
        <span style={{cursor:"pointer"}} onClick={()=>setPage("Home")}
          onMouseEnter={e=>e.target.style.color="var(--am)"} onMouseLeave={e=>e.target.style.color="var(--mu)"}>HOME</span>
        <span>›</span><span style={{color:"var(--am)"}}>{title.toUpperCase()}</span>
      </div>
    </div>
  </div>
);

const CTA = ({title,sub,btn,setPage}) => (
  <div style={{background:"linear-gradient(135deg,var(--r),var(--rd))",padding:"3.5rem 2rem",textAlign:"center",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.05) 1px,transparent 1px)",backgroundSize:"28px 28px"}}/>
    <div style={{position:"relative"}}>
      <h2 style={{...H,fontWeight:900,fontSize:"clamp(1.3rem,3vw,2rem)",color:"white",marginBottom:"0.6rem"}}>{title}</h2>
      <p style={{...B,color:"rgba(255,255,255,0.8)",marginBottom:"1.8rem",fontWeight:300}}>{sub}</p>
      <Btn onClick={()=>setPage("Contact")} v="w">{btn}</Btn>
    </div>
  </div>
);

const Nav = ({page,setPage}) => {
  const [sc,setSc] = useState(false);
  const [mo,setMo] = useState(false);
  useEffect(()=>{const h=()=>setSc(window.scrollY>50);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h);},[]);
  const go = p => {setPage(p);setMo(false);};
  const ls = ["Home","About","Services","Gallery","Contact"];
  return (
    <>
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:500,
        background:sc?"var(--navbg)":"rgba(6,13,24,0.72)",backdropFilter:"blur(16px)",
        borderBottom:sc?"1px solid var(--navborder)":"1px solid transparent",
        padding:"0 2rem",height:"62px",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all 0.35s"}}>
        <div style={{display:"flex",alignItems:"center",gap:"11px",cursor:"pointer"}} onClick={()=>go("Home")}>
          <img src={LOGO} alt="Riya Cargo" style={{width:"40px",height:"40px",borderRadius:"50%",objectFit:"cover",border:"2px solid var(--am)"}}/>
          <div style={{lineHeight:1.15}}>
            <div style={{...H,fontWeight:900,fontSize:"1.05rem",color:"var(--w)",letterSpacing:"1px"}}>RIYA CARGO</div>
            <div style={{...B,fontSize:"0.5rem",color:"var(--am)",letterSpacing:"2.5px",textTransform:"uppercase"}}>MOVERS & PACKERS</div>
          </div>
        </div>
        <div className="nl" style={{display:"flex",gap:"2px"}}>
          {ls.map(l=>(
            <button key={l} onClick={()=>go(l)} style={{background:page===l?"var(--r)":"transparent",
              color:page===l?"white":"rgba(240,242,245,0.58)",border:"none",cursor:"pointer",
              padding:"7px 13px",borderRadius:"4px",...H,fontWeight:700,fontSize:"0.78rem",
              letterSpacing:"1px",textTransform:"uppercase",transition:"all 0.2s"}}
              onMouseEnter={e=>{if(page!==l)e.currentTarget.style.color="white";}}
              onMouseLeave={e=>{if(page!==l)e.currentTarget.style.color="rgba(240,242,245,0.58)";}}>
              {l==="Contact"?"Get Quote":l}
            </button>
          ))}
        </div>
        <button className="hb" onClick={()=>setMo(true)} style={{display:"none",background:"transparent",border:"none",cursor:"pointer",flexDirection:"column",gap:"5px",padding:"4px"}}>
          {[0,1,2].map(i=><span key={i} style={{width:"22px",height:"2px",background:"var(--w)",display:"block",borderRadius:"2px"}}/>)}
        </button>
      </nav>
      <div className={`mm ${mo?"open":""}`}>
        <button onClick={()=>setMo(false)} style={{position:"absolute",top:"20px",right:"20px",fontSize:"1.8rem",color:"var(--mu)"}}>✕</button>
        {ls.map(l=><button key={l} className={page===l?"act":""} onClick={()=>go(l)}>{l==="Contact"?"Get Quote":l}</button>)}
      </div>
    </>
  );
};

/* ── HOME ─────────────────────────────────────────────── */
const Home = ({setPage}) => {
  const [sl,setSl] = useState(0);
  useEffect(()=>{const t=setInterval(()=>setSl(s=>(s+1)%4),5500);return()=>clearInterval(t);},[]);
  const slides=[IMG_WORKERS,IMG_FURN,IMG_BOXES,REAL_03];
  const svcs=[
    {i:"🏠",t:"Household Shifting",d:"Complete home relocation — pack, transport & unpack."},
    {i:"🚗",t:"Car Transportation",d:"Safe insured vehicle transport anywhere in India."},
    {i:"🏢",t:"Office Shifting",d:"Minimal-downtime moves with full IT equipment care."},
    {i:"📦",t:"Packing & Unpacking",d:"Expert packing with bubble wrap, foam & custom boxes."},
    {i:"🏭",t:"Warehousing",d:"24/7 secure storage for short & long-term needs."},
    {i:"🛡️",t:"Transit Insurance",d:"Full coverage on every shipment we carry."},
  ];
  return (
    <div style={{animation:"fadeIn 0.4s ease"}}>
      {/* HERO */}
      <div style={{position:"relative",height:"88vh",minHeight:"500px",maxHeight:"780px",overflow:"hidden"}}>
        {slides.map((src,i)=>(
          <div key={i} style={{position:"absolute",inset:0,backgroundImage:`url(${src})`,
            backgroundSize:"cover",backgroundPosition:"center",
            opacity:sl===i?1:0,transition:"opacity 1.5s ease"}}>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(6,13,24,0.88) 0%,rgba(6,13,24,0.5) 55%,rgba(6,13,24,0.28) 100%)"}}/>
          </div>
        ))}
        <div style={{position:"relative",zIndex:5,maxWidth:"1200px",margin:"0 auto",
          padding:"0 2.5rem",height:"100%",display:"flex",flexDirection:"column",justifyContent:"center"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:"8px",
            background:"rgba(232,49,26,0.15)",border:"1px solid rgba(232,49,26,0.3)",
            padding:"4px 14px 4px 5px",borderRadius:"30px",marginBottom:"1.3rem",width:"fit-content",animation:"fadeUp 0.8s ease both"}}>
            <span style={{background:"var(--r)",color:"white",padding:"2px 10px",borderRadius:"20px",...H,fontWeight:700,fontSize:"0.62rem",letterSpacing:"1.5px"}}>ISO CERTIFIED</span>
            <span style={{...B,fontSize:"0.72rem",color:"rgba(240,242,245,0.68)",letterSpacing:"1px"}}>PUNE'S TRUSTED MOVERS</span>
          </div>
          <h1 style={{...H,fontWeight:900,fontSize:"clamp(2.2rem,5vw,3.8rem)",lineHeight:1.1,color:"var(--w)",animation:"fadeUp 0.9s ease 0.15s both",marginBottom:"1rem"}}>
            YOUR MOVE.<br/><span style={{color:"var(--r)"}}>OUR PROMISE.</span>
          </h1>
          <p style={{...B,fontSize:"0.98rem",fontWeight:300,color:"rgba(240,242,245,0.72)",maxWidth:"440px",lineHeight:1.75,animation:"fadeUp 0.9s ease 0.3s both",marginBottom:"1.8rem"}}>
            Professional packing, safe transport & stress-free relocation for homes and offices across India.
          </p>
          <div className="hbtns" style={{display:"flex",gap:"0.9rem",flexWrap:"wrap",animation:"fadeUp 0.9s ease 0.45s both"}}>
            <Btn onClick={()=>setPage("Contact")}>Get Free Quote</Btn>
            <Btn onClick={()=>setPage("Services")} v="o">Our Services</Btn>
          </div>
        </div>
        <div style={{position:"absolute",bottom:"24px",left:"50%",transform:"translateX(-50%)",display:"flex",gap:"7px",zIndex:5}}>
          {[0,1,2,3].map(i=>(
            <button key={i} onClick={()=>setSl(i)} style={{width:sl===i?"26px":"7px",height:"7px",borderRadius:"4px",
              background:sl===i?"var(--r)":"rgba(255,255,255,0.28)",border:"none",cursor:"pointer",transition:"all 0.4s",padding:0}}/>
          ))}
        </div>
        <div className="hero-stats" style={{position:"absolute",bottom:0,right:0,zIndex:5,display:"flex"}}>
          {[["5000+","Moves Done"],["15+","Years Exp"],["100%","Safe Delivery"]].map(([n,l],i)=>(
            <div key={i} style={{background:"var(--cardbg)",backdropFilter:"blur(10px)",
              borderTop:`3px solid ${i===0?"var(--r)":i===1?"var(--am)":"#4ade80"}`,
              padding:"0.9rem 1.4rem",textAlign:"center",minWidth:"105px"}}>
              <div style={{...H,fontWeight:900,fontSize:"1.6rem",color:"var(--w)"}}>{n}</div>
              <div style={{...B,fontSize:"0.6rem",color:"var(--mu)",letterSpacing:"1px",textTransform:"uppercase"}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      {/* TICKER */}
      <div style={{background:"var(--r)",padding:"0.8rem 0",overflow:"hidden"}}>
        <div style={{display:"flex",gap:"3rem",animation:"ticker 22s linear infinite",whiteSpace:"nowrap"}}>
          {[...Array(2)].map((_,r)=>
            ["Household Shifting","Car Transportation","Office Relocation","Packing & Unpacking","Warehouse Storage","Insurance Coverage"].map((s,i)=>(
              <span key={`${r}-${i}`} style={{display:"inline-flex",alignItems:"center",gap:"10px",...H,fontWeight:700,fontSize:"0.78rem",letterSpacing:"2px",textTransform:"uppercase",color:"rgba(255,255,255,0.9)"}}>
                <span style={{width:"5px",height:"5px",background:"rgba(255,255,255,0.5)",borderRadius:"50%",display:"inline-block"}}/>{s}
              </span>
            ))
          )}
        </div>
      </div>
      {/* ABOUT */}
      <div style={{background:"var(--n2)",padding:"5rem 2rem"}}>
        <div className="g2" style={{maxWidth:"1200px",margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"3.5rem",alignItems:"center"}}>
          <div>
            <Tag c="About Riya Cargo"/>
            <h2 style={{...H,fontWeight:900,fontSize:"clamp(1.7rem,3vw,2.6rem)",color:"var(--w)",lineHeight:1.1,marginBottom:"1rem"}}>
              PUNE'S MOST<br/><span style={{color:"var(--r)"}}>TRUSTED</span> MOVERS
            </h2>
            <p style={{...B,color:"rgba(240,242,245,0.6)",lineHeight:1.8,marginBottom:"1rem",fontWeight:300,fontSize:"0.95rem"}}>
              Riya Cargo Movers & Packers (Regd.) is ISO 9001-2015 certified, based in Pune with branches in Chennai & Ahmedabad. 5000+ moves with zero damage guarantee.
            </p>
            <ul style={{listStyle:"none",marginBottom:"1.8rem"}}>
              {["Professionally trained packing team","Transit insurance on all shipments","GST registered, transparent pricing","Pan-India network & delivery"].map(f=>(
                <li key={f} style={{display:"flex",alignItems:"center",gap:"10px",padding:"6px 0",borderBottom:"1px solid var(--bd)",...B,fontSize:"0.9rem",color:"rgba(240,242,245,0.78)"}}>
                  <span style={{width:"18px",height:"18px",background:"var(--r)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.55rem",color:"white",fontWeight:"bold",flexShrink:0}}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Btn onClick={()=>setPage("About")}>Learn More</Btn>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"180px 180px",gap:"10px"}}>
            <img src={IMG_INDOOR} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"6px",gridRow:"span 2"}}/>
            <img src={IMG_FURN} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"6px"}}/>
            <img src={IMG_BOXES} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"6px"}}/>
          </div>
        </div>
      </div>
      {/* SERVICES */}
      <div style={{background:"var(--nv)",padding:"5rem 2rem"}}>
        <div style={{maxWidth:"1200px",margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
            <Tag c="What We Offer" a/>
            <h2 style={{...H,fontWeight:900,fontSize:"clamp(1.7rem,3vw,2.6rem)",color:"var(--w)"}}>OUR <span style={{color:"var(--am)"}}>SERVICES</span></h2>
          </div>
          <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.1rem"}}>
            {svcs.map((s,i)=>(
              <div key={i} style={{background:"var(--cardbg)",border:"1px solid var(--bd)",padding:"1.8rem 1.4rem",borderRadius:"8px",transition:"all 0.3s",cursor:"pointer"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(232,49,26,0.4)";e.currentTarget.style.transform="translateY(-5px)";}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--bd)";e.currentTarget.style.transform="translateY(0)";}}>
                <div style={{fontSize:"1.9rem",marginBottom:"0.9rem"}}>{s.i}</div>
                <h3 style={{...H,fontWeight:700,fontSize:"0.95rem",color:"var(--w)",marginBottom:"0.5rem"}}>{s.t}</h3>
                <p style={{...B,fontSize:"0.82rem",color:"var(--mu)",lineHeight:1.65,fontWeight:300}}>{s.d}</p>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center",marginTop:"2rem"}}><Btn onClick={()=>setPage("Services")}>View All Services</Btn></div>
        </div>
      </div>
      {/* PROCESS */}
      <div style={{background:"var(--n2)",padding:"5rem 2rem"}}>
        <div style={{maxWidth:"1100px",margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
            <Tag c="How It Works"/>
            <h2 style={{...H,fontWeight:900,fontSize:"clamp(1.7rem,3vw,2.6rem)",color:"var(--w)"}}>4-STEP <span style={{color:"var(--r)"}}>PROCESS</span></h2>
          </div>
          <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"0",position:"relative"}}>
            <div style={{position:"absolute",top:"34px",left:"12%",right:"12%",height:"1px",background:"linear-gradient(90deg,var(--r),var(--am))",zIndex:0}}/>
            {[{n:"01",t:"Book Survey",d:"Expert visits for free pre-move inspection.",c:"var(--r)"},
              {n:"02",t:"Get Quote",d:"Transparent quote — zero hidden charges.",c:"#e67e22"},
              {n:"03",t:"We Pack",d:"Trained crew packs & loads all goods safely.",c:"#27ae60"},
              {n:"04",t:"Delivery",d:"Goods arrive safe at your new home.",c:"#2980b9"}].map((s,i)=>(
              <div key={i} style={{textAlign:"center",padding:"0 0.8rem",position:"relative",zIndex:1}}>
                <div style={{width:"68px",height:"68px",borderRadius:"50%",background:s.c,color:"white",margin:"0 auto 1.1rem",
                  display:"flex",alignItems:"center",justifyContent:"center",...H,fontWeight:900,fontSize:"1.2rem",
                  border:"3px solid var(--n2)",boxShadow:`0 0 18px ${s.c}44`}}>{s.n}</div>
                <h4 style={{...H,fontWeight:700,fontSize:"0.88rem",color:"var(--w)",marginBottom:"5px",textTransform:"uppercase"}}>{s.t}</h4>
                <p style={{...B,fontSize:"0.78rem",color:"var(--mu)",lineHeight:1.6,fontWeight:300}}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* GALLERY PREVIEW */}
      <div style={{padding:"5rem 2rem",background:"var(--nv)"}}>
        <div style={{maxWidth:"1200px",margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"2rem"}}>
            <Tag c="Our Work"/>
            <h2 style={{...H,fontWeight:900,fontSize:"clamp(1.7rem,3vw,2.6rem)",color:"var(--w)"}}>SEE WHAT WE <span style={{color:"var(--r)"}}>DO BEST</span></h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gridTemplateRows:"200px 200px",gap:"10px"}}>
            {[IMG_WORKERS,IMG_FURN,IMG_BOXES,IMG_WH1,IMG_TRUCK].map((src,i)=>(
              <div key={i} style={{overflow:"hidden",borderRadius:"6px",gridRow:i===0?"span 2":undefined}}>
                <img src={src} style={{width:"100%",height:"100%",objectFit:"cover",transition:"transform 0.5s"}}
                  onMouseEnter={e=>e.target.style.transform="scale(1.06)"} onMouseLeave={e=>e.target.style.transform="scale(1)"}/>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center",marginTop:"1.8rem"}}><Btn onClick={()=>setPage("Gallery")} v="a">View Full Gallery</Btn></div>
        </div>
      </div>
      {/* TESTIMONIALS */}
      <div style={{background:"var(--n2)",padding:"5rem 2rem"}}>
        <div style={{maxWidth:"1100px",margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
            <Tag c="Client Reviews" a/>
            <h2 style={{...H,fontWeight:900,fontSize:"clamp(1.7rem,3vw,2.6rem)",color:"var(--w)"}}>WHAT <span style={{color:"var(--am)"}}>CUSTOMERS</span> SAY</h2>
          </div>
          <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.4rem"}}>
            {[{nm:"Rahul Kale",rt:"Pune to Mumbai",tx:"Every item packed with care, delivered without a scratch. Best movers in Pune!",st:5,in:"RK",cl:"var(--r)"},
              {nm:"Sunita Patil",rt:"Office Shift, Pune",tx:"Shifted our entire office in a day! Punctual, organized, excellent team.",st:5,in:"SP",cl:"var(--am)"},
              {nm:"Arun Menon",rt:"Pune to Chennai",tx:"Car transported in perfect condition. Insurance gave total peace of mind.",st:4,in:"AM",cl:"#4ade80"}].map((t,i)=>(
              <div key={i} style={{background:"var(--cardbg)",border:"1px solid var(--bd)",padding:"1.8rem",borderRadius:"8px",borderTop:`3px solid ${t.cl}`,transition:"transform 0.3s"}}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-4px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                <div style={{color:"var(--am)",fontSize:"0.78rem",marginBottom:"8px"}}>{"★".repeat(t.st)}{"☆".repeat(5-t.st)}</div>
                <p style={{fontStyle:"italic",color:"rgba(240,242,245,0.62)",lineHeight:1.7,marginBottom:"1rem",fontSize:"0.87rem",fontWeight:300}}>"{t.tx}"</p>
                <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                  <div style={{width:"36px",height:"36px",borderRadius:"50%",background:t.cl,display:"flex",alignItems:"center",justifyContent:"center",...H,fontWeight:700,fontSize:"0.75rem",color:i===1?"var(--nv)":"white",flexShrink:0}}>{t.in}</div>
                  <div>
                    <div style={{...H,fontWeight:700,color:"var(--w)",fontSize:"0.88rem"}}>{t.nm}</div>
                    <div style={{...B,fontSize:"0.7rem",color:"var(--mu)"}}>{t.rt}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <CTA title="READY TO MOVE? LET'S MAKE IT STRESS-FREE!" sub="Call us for a free consultation — 7 days a week." btn="Get Free Quote" setPage={setPage}/>
    </div>
  );
};

/* ── ABOUT ─────────────────────────────────────────────── */
const About = ({setPage}) => (
  <div style={{animation:"fadeIn 0.4s ease"}}>
    <PH tag="Our Story" title="About Us" setPage={setPage}/>
    <div style={{background:"var(--nv)",padding:"5rem 2rem"}}>
      <div className="g2" style={{maxWidth:"1200px",margin:"0 auto",display:"grid",gridTemplateColumns:"1.2fr 0.8fr",gap:"4rem",alignItems:"start"}}>
        <div>
          <Tag c="Who We Are"/>
          <h2 style={{...H,fontWeight:900,fontSize:"clamp(1.7rem,3vw,2.6rem)",color:"var(--w)",lineHeight:1.1,marginBottom:"1.1rem"}}>TRUSTED MOVING EXPERTS<br/>IN <span style={{color:"var(--r)"}}>PUNE</span></h2>
          {["Riya Cargo Movers & Packers (Regd.) is one of Pune's most trusted relocation companies. With over a decade of experience, we've perfected seamless, safe, and efficient moving.",
            "ISO 9001-2015 certified, ensuring the highest international quality standards. Our trained professionals handle every move with care — from studio apartments to full corporate shifts.",
            "Headquartered in Pune with offices in Chennai (Mr. Ajay Kaswan) and Ahmedabad (Mr. Sandeep Kaswan), giving us a strong Pan-India reach for long-distance relocations.",
            "All shipments backed with transit insurance — no hidden costs, clear quotes, and open communication throughout your move."
          ].map((p,i)=>(
            <p key={i} style={{...B,color:"rgba(240,242,245,0.62)",lineHeight:1.8,marginBottom:"1rem",fontWeight:300,fontSize:"0.95rem"}}>{p}</p>
          ))}
        </div>
        <div style={{position:"sticky",top:"80px"}}>
          <img src={IMG_OFFICE} style={{width:"100%",borderRadius:"8px",boxShadow:"0 20px 40px rgba(0,0,0,0.4)",marginBottom:"12px"}}/>
          <img src={IMG_WH2} style={{width:"100%",borderRadius:"8px",boxShadow:"0 20px 40px rgba(0,0,0,0.4)"}}/>
        </div>
      </div>
    </div>
    <div style={{background:"var(--n2)",padding:"5rem 2rem"}}>
      <div style={{maxWidth:"1100px",margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
          <Tag c="Our Values" a/>
          <h2 style={{...H,fontWeight:900,fontSize:"clamp(1.7rem,3vw,2.6rem)",color:"var(--w)"}}>WHY CHOOSE <span style={{color:"var(--am)"}}>US</span></h2>
        </div>
        <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.4rem"}}>
          {[{i:"🏆",t:"ISO 9001-2015",d:"Internationally certified quality management."},
            {i:"🛡️",t:"Transit Insurance",d:"Every shipment fully covered."},
            {i:"💬",t:"Honest Pricing",d:"No hidden costs, ever."},
            {i:"⚡",t:"On-Time Delivery",d:"We always commit to timelines."},
            {i:"🌐",t:"Pan-India Network",d:"Chennai, Ahmedabad & all India."},
            {i:"🤝",t:"5000+ Happy Clients",d:"Trust built over a decade."}].map((v,i)=>(
            <div key={i} style={{background:"rgba(6,13,24,0.5)",border:"1px solid var(--bd)",padding:"1.8rem",borderRadius:"8px",textAlign:"center",transition:"all 0.3s"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(232,49,26,0.4)";e.currentTarget.style.transform="translateY(-4px)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--bd)";e.currentTarget.style.transform="translateY(0)";}}>
              <div style={{fontSize:"1.9rem",marginBottom:"0.9rem"}}>{v.i}</div>
              <h3 style={{...H,fontWeight:700,fontSize:"0.92rem",color:"var(--w)",marginBottom:"5px"}}>{v.t}</h3>
              <p style={{...B,fontSize:"0.82rem",color:"var(--mu)",lineHeight:1.6,fontWeight:300}}>{v.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div style={{background:"var(--nv)",padding:"5rem 2rem"}}>
      <div style={{maxWidth:"1000px",margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
          <Tag c="Leadership"/>
          <h2 style={{...H,fontWeight:900,fontSize:"clamp(1.7rem,3vw,2.6rem)",color:"var(--w)"}}>MEET THE <span style={{color:"var(--r)"}}>TEAM</span></h2>
        </div>
        <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1.4rem"}}>
          {[{in:"RC",nm:"Riya Cargo Pune",rl:"Head Office",ph:"91461 71008",ci:"Pune, Maharashtra",cl:"var(--r)"},
            {in:"AK",nm:"Mr. Ajay Kaswan",rl:"Regional Director",ph:"99620 71008",ci:"Chennai",cl:"var(--am)"},
            {in:"SK",nm:"Mr. Sandeep Kaswan",rl:"Regional Director",ph:"99629 71008",ci:"Ahmedabad",cl:"#4ade80"}].map((m,i)=>(
            <div key={i} style={{background:"var(--n2)",border:"1px solid var(--bd)",borderRadius:"8px",overflow:"hidden",transition:"transform 0.3s"}}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-5px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
              <div style={{background:"rgba(6,13,24,0.8)",padding:"2rem 1rem 1rem",textAlign:"center",borderBottom:"1px solid var(--bd)"}}>
                <div style={{width:"66px",height:"66px",borderRadius:"50%",background:m.cl,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"center",...H,fontWeight:900,fontSize:"1.2rem",color:i===1?"var(--nv)":"white",boxShadow:`0 0 18px ${m.cl}44`}}>{m.in}</div>
              </div>
              <div style={{padding:"1.3rem",textAlign:"center"}}>
                <div style={{...H,fontWeight:700,color:"var(--w)",fontSize:"0.95rem",marginBottom:"3px"}}>{m.nm}</div>
                <div style={{color:m.cl,fontSize:"0.75rem",fontWeight:600,marginBottom:"7px",...B}}>{m.rl}</div>
                <div style={{...B,color:"var(--mu)",fontSize:"0.78rem"}}>📞 {m.ph}</div>
                <div style={{...B,color:"var(--mu)",fontSize:"0.73rem"}}>📍 {m.ci}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <CTA title="EXPERIENCED. TRUSTED. RELIABLE." sub="Join thousands of happy customers who trusted Riya Cargo." btn="Get a Free Quote" setPage={setPage}/>
  </div>
);

/* ── SERVICES ──────────────────────────────────────────── */
const Services = ({setPage}) => {
  const sv=[
    {i:"🏠",t:"Household Shifting",img:IMG_INDOOR,d:"Complete home relocation with professional packing, transport and unpacking. Bubble wrap for fragile items, foam for electronics, sturdy boxes for everything else.",tg:["Local Shifting","Inter-city","Unpacking","Furniture Assembly"]},
    {i:"📦",t:"Packing & Unpacking",img:IMG_FURN,d:"Expert packing using high-quality corrugated boxes, stretch wrap, and foam sheets. Every box labeled by room for easy unpacking.",tg:["Bubble Wrap","Foam Packing","Labeling","Fragile Handling"]},
    {i:"🚗",t:"Car Transportation",img:IMG_TRUCK,d:"Enclosed and open carrier transport for all vehicles. Door-to-door delivery across India with tracking and transit insurance.",tg:["Two-Wheelers","Four-Wheelers","Luxury Cars","Pan-India"]},
    {i:"🏢",t:"Office Shifting",img:IMG_WORKERS,d:"Minimal-downtime office relocation. We map floor plans, label workstations, and pack IT equipment with anti-static materials.",tg:["IT Equipment","Server Rooms","After-Hours","Full Setup"]},
    {i:"🏭",t:"Warehousing",img:IMG_WH1,d:"Secure 24/7 monitored warehouse for short and long-term storage. Zone-organized so your items are always easy to find.",tg:["Short-Term","Long-Term","24/7 Security","Zone-Organized"]},
  ];
  return (
    <div style={{animation:"fadeIn 0.4s ease"}}>
      <PH tag="Full-Service Moving" title="Our Services" setPage={setPage}/>
      <div style={{background:"var(--nv)",padding:"5rem 2rem"}}>
        <div style={{maxWidth:"1200px",margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
            <Tag c="Comprehensive Solutions"/>
            <h2 style={{...H,fontWeight:900,fontSize:"clamp(1.7rem,3vw,2.6rem)",color:"var(--w)"}}>EVERYTHING YOU <span style={{color:"var(--r)"}}>NEED</span></h2>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"1.8rem"}}>
            {sv.map((s,i)=>(
              <div key={i} className="gsd" style={{display:"grid",gridTemplateColumns:i%2===0?"0.9fr 1.1fr":"1.1fr 0.9fr",gap:"2.5rem",alignItems:"center",padding:"2rem",borderRadius:"10px",background:"rgba(12,26,46,0.5)",border:"1px solid var(--bd)",transition:"border-color 0.3s"}}
                onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(232,49,26,0.3)"} onMouseLeave={e=>e.currentTarget.style.borderColor="var(--bd)"}>
                {i%2===0?(
                  <>
                    <div style={{overflow:"hidden",borderRadius:"8px"}}>
                      <img src={s.img} style={{width:"100%",height:"240px",objectFit:"cover",transition:"transform 0.5s"}}
                        onMouseEnter={e=>e.target.style.transform="scale(1.04)"} onMouseLeave={e=>e.target.style.transform="scale(1)"}/>
                    </div>
                    <div>
                      <h3 style={{...H,fontWeight:800,fontSize:"1.45rem",color:"var(--w)",marginBottom:"0.7rem"}}>{s.i} {s.t}</h3>
                      <p style={{...B,color:"rgba(240,242,245,0.62)",lineHeight:1.8,marginBottom:"1rem",fontWeight:300,fontSize:"0.93rem"}}>{s.d}</p>
                      <div style={{display:"flex",flexWrap:"wrap",gap:"7px"}}>{s.tg.map(t=><span key={t} style={{background:"rgba(232,49,26,0.1)",color:"var(--r)",padding:"3px 11px",borderRadius:"20px",fontSize:"0.73rem",...H,fontWeight:700}}>{t}</span>)}</div>
                    </div>
                  </>
                ):(
                  <>
                    <div>
                      <h3 style={{...H,fontWeight:800,fontSize:"1.45rem",color:"var(--w)",marginBottom:"0.7rem"}}>{s.i} {s.t}</h3>
                      <p style={{...B,color:"rgba(240,242,245,0.62)",lineHeight:1.8,marginBottom:"1rem",fontWeight:300,fontSize:"0.93rem"}}>{s.d}</p>
                      <div style={{display:"flex",flexWrap:"wrap",gap:"7px"}}>{s.tg.map(t=><span key={t} style={{background:"rgba(232,49,26,0.1)",color:"var(--r)",padding:"3px 11px",borderRadius:"20px",fontSize:"0.73rem",...H,fontWeight:700}}>{t}</span>)}</div>
                    </div>
                    <div style={{overflow:"hidden",borderRadius:"8px"}}>
                      <img src={s.img} style={{width:"100%",height:"240px",objectFit:"cover",transition:"transform 0.5s"}}
                        onMouseEnter={e=>e.target.style.transform="scale(1.04)"} onMouseLeave={e=>e.target.style.transform="scale(1)"}/>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <CTA title="NOT SURE WHICH SERVICE YOU NEED?" sub="Our team will guide you to the right solution." btn="Talk to an Expert" setPage={setPage}/>
    </div>
  );
};

/* ── GALLERY ───────────────────────────────────────────── */
const Gallery = ({setPage}) => {
  const [hv,setHv] = useState(null);
  const items=[
    {s:IMG_WORKERS,c:"Professional Moving Crew"},{s:IMG_FURN,c:"Expert Furniture Wrapping"},
    {s:IMG_BOXES,c:"Apartment Move Complete"},{s:IMG_INDOOR,c:"Systematic Indoor Packing"},
    {s:IMG_TRUCK,c:"Ready for Transit"},{s:IMG_WH1,c:"Secure Warehouse"},
    {s:IMG_WH2,c:"Storage Facility"},{s:IMG_OFFICE,c:"Our Pune Office"},
    {s:REAL_01,c:"On-Site Packing"},{s:REAL_02,c:"Loading in Progress"},
    {s:REAL_03,c:"Fleet Ready"},{s:REAL_04,c:"Careful Handling"},
    {s:REAL_05,c:"Safe Delivery"},{s:REAL_06,c:"Team at Work"},
    {s:REAL_07,c:"Move Complete"},
  ];
  return (
    <div style={{animation:"fadeIn 0.4s ease"}}>
      <PH tag="Our Work in Pictures" title="Gallery" setPage={setPage}/>
      <div style={{background:"var(--nv)",padding:"5rem 2rem"}}>
        <div style={{maxWidth:"1200px",margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
            <Tag c="Real Moves"/>
            <h2 style={{...H,fontWeight:900,fontSize:"clamp(1.7rem,3vw,2.6rem)",color:"var(--w)"}}>OUR WORK <span style={{color:"var(--r)"}}>SPEAKS</span></h2>
            <p style={{...B,color:"var(--mu)",marginTop:"0.5rem",fontWeight:300,fontSize:"0.93rem"}}>Professional packing, loading and delivery across India.</p>
          </div>
          <div className="gal" style={{columns:"3",columnGap:"12px"}}>
            {items.map((item,i)=>(
              <div key={i} style={{breakInside:"avoid",marginBottom:"12px",borderRadius:"8px",overflow:"hidden",position:"relative",cursor:"pointer"}}
                onMouseEnter={()=>setHv(i)} onMouseLeave={()=>setHv(null)}>
                <img src={item.s} style={{width:"100%",display:"block",transition:"transform 0.5s",transform:hv===i?"scale(1.05)":"scale(1)"}}/>
                <div style={{position:"absolute",inset:0,background:hv===i?"rgba(6,13,24,0.52)":"rgba(6,13,24,0)",transition:"background 0.4s",display:"flex",alignItems:"flex-end",padding:"1rem"}}>
                  <span style={{color:"white",fontSize:"0.8rem",...H,fontWeight:700,letterSpacing:"0.5px",textTransform:"uppercase",opacity:hv===i?1:0,transform:hv===i?"translateY(0)":"translateY(10px)",transition:"all 0.3s"}}>{item.c}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:"center",marginTop:"2.5rem"}}><Btn onClick={()=>setPage("Contact")}>Book Your Move Today</Btn></div>
        </div>
      </div>
    </div>
  );
};

/* ── CONTACT ───────────────────────────────────────────── */
const Contact = ({setPage}) => {
  const [form,setForm] = useState({name:"",phone:"",email:"",from:"",to:"",service:"",date:"",msg:""});
  const [st,setSt] = useState("idle");

  const submit = async () => {
    if(!form.name||!form.phone){alert("Please enter your name and phone number.");return;}
    setSt("sending");
    try {
      if(EJS_SVC==="YOUR_SERVICE_ID"){
        await new Promise(r=>setTimeout(r,1500));
        setSt("success");
        setForm({name:"",phone:"",email:"",from:"",to:"",service:"",date:"",msg:""});
        return;
      }
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({service_id:EJS_SVC,template_id:EJS_TPL,user_id:EJS_KEY,
          template_params:{from_name:form.name,phone:form.phone,email:form.email||"N/A",
            moving_from:form.from||"N/A",moving_to:form.to||"N/A",service:form.service||"N/A",
            date:form.date||"N/A",message:form.msg||"N/A"}})
      });
      if(res.ok){setSt("success");setForm({name:"",phone:"",email:"",from:"",to:"",service:"",date:"",msg:""});}
      else setSt("error");
    } catch(e) {
      const body=`Name: ${form.name}\nPhone: ${form.phone}\nFrom: ${form.from}\nTo: ${form.to}\nService: ${form.service}\nMessage: ${form.msg}`;
      window.location.href=`mailto:info.riyacargopune@gmail.com?subject=Move%20Enquiry%20from%20${encodeURIComponent(form.name)}&body=${encodeURIComponent(body)}`;
      setSt("success");
    }
  };

  const inp={width:"100%",padding:"11px 14px",background:"rgba(6,13,24,0.5)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:"6px",color:"var(--w)",fontFamily:"'DM Sans',sans-serif",fontSize:"0.9rem",outline:"none",transition:"border-color 0.2s"};
  const lbl={display:"block",fontSize:"0.68rem",fontWeight:700,fontFamily:"'Montserrat',sans-serif",color:"rgba(240,242,245,0.52)",marginBottom:"5px",letterSpacing:"1.5px",textTransform:"uppercase"};
  const bind=(k)=>({value:form[k],onChange:e=>setForm({...form,[k]:e.target.value}),onFocus:e=>e.target.style.borderColor="var(--r)",onBlur:e=>e.target.style.borderColor="rgba(255,255,255,0.1)"});

  return (
    <div style={{animation:"fadeIn 0.4s ease"}}>
      <PH tag="Reach Out" title="Contact Us" setPage={setPage}/>
      <div style={{background:"var(--nv)",padding:"5rem 2rem"}}>
        <div className="cgrid" style={{maxWidth:"1200px",margin:"0 auto",display:"grid",gridTemplateColumns:"0.85fr 1.15fr",gap:"3.5rem"}}>
          <div>
            <Tag c="Get in Touch"/>
            <h2 style={{...H,fontWeight:900,fontSize:"clamp(1.7rem,3vw,2.6rem)",color:"var(--w)",lineHeight:1.1,marginBottom:"1rem"}}>WE'RE HERE<br/>TO <span style={{color:"var(--r)"}}>HELP YOU MOVE</span></h2>
            <p style={{...B,color:"var(--mu)",marginBottom:"2rem",lineHeight:1.7,fontWeight:300,fontSize:"0.93rem"}}>Reach out for a free survey, quote, or any questions. Our team responds quickly!</p>
            {[{ic:"📍",t:"Head Office",c:"Khanna Building, Office No.2, Plot No.44,\nSec No.23, Transport Nagar,\nNigdi, Pune - 411044"},
              {ic:"📞",t:"Phone / WhatsApp",c:"+91 91461 71008\n+91 99620 71008 (Chennai)\n+91 99629 71008 (Ahmedabad)"},
              {ic:"📧",t:"Email",c:"info.riyacargopune@gmail.com\ninfo.rcmpindia@gmail.com"},
              {ic:"🌐",t:"Website & GST",c:"www.riyacargomovers.com\nGST: 33BTFPA7894F1ZN"},
              {ic:"⏰",t:"Business Hours",c:"Mon-Sat: 8:00 AM - 8:00 PM\nSunday: 10:00 AM - 4:00 PM"}].map((b,i)=>(
              <div key={i} style={{display:"flex",gap:"13px",alignItems:"flex-start",padding:"1rem",marginBottom:"0.8rem",background:"rgba(12,26,46,0.5)",borderRadius:"8px",borderLeft:"3px solid var(--r)",transition:"all 0.3s"}}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(232,49,26,0.08)";e.currentTarget.style.transform="translateX(4px)";}} onMouseLeave={e=>{e.currentTarget.style.background="rgba(12,26,46,0.5)";e.currentTarget.style.transform="translateX(0)";}}>
                <div style={{width:"36px",height:"36px",background:"var(--r)",borderRadius:"8px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.95rem",flexShrink:0}}>{b.ic}</div>
                <div>
                  <div style={{...H,fontWeight:700,color:"var(--w)",fontSize:"0.78rem",letterSpacing:"1px",marginBottom:"3px"}}>{b.t}</div>
                  <div style={{...B,color:"var(--mu)",fontSize:"0.8rem",lineHeight:1.6,whiteSpace:"pre-line",fontWeight:300}}>{b.c}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{background:"rgba(12,26,46,0.7)",border:"1px solid var(--bd)",padding:"2.5rem",borderRadius:"12px"}}>
            <h3 style={{...H,fontWeight:800,fontSize:"1.6rem",color:"var(--w)",marginBottom:"1.6rem"}}>GET A <span style={{color:"var(--r)"}}>FREE QUOTE</span></h3>
            {st==="success"?(
              <div style={{background:"rgba(74,222,128,0.1)",border:"1px solid rgba(74,222,128,0.3)",padding:"2rem",borderRadius:"8px",textAlign:"center",color:"#4ade80"}}>
                <div style={{fontSize:"2.5rem",marginBottom:"0.8rem"}}>✅</div>
                <h4 style={{...H,fontWeight:800,fontSize:"1.3rem",marginBottom:"0.5rem"}}>REQUEST SENT!</h4>
                <p style={{...B,fontWeight:300,color:"rgba(74,222,128,0.8)",fontSize:"0.9rem"}}>We'll call you within 2 hours to confirm.</p>
                <button onClick={()=>setSt("idle")} style={{marginTop:"1rem",background:"transparent",color:"#4ade80",border:"1px solid #4ade80",padding:"7px 18px",borderRadius:"4px",cursor:"pointer",...H,fontWeight:700,letterSpacing:"1px",fontSize:"0.8rem"}}>Submit Another</button>
              </div>
            ):(
              <>
                <div className="frow" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.9rem",marginBottom:"0.9rem"}}>
                  <div><label style={lbl}>Your Name *</label><input style={inp} placeholder="Full Name" {...bind("name")}/></div>
                  <div><label style={lbl}>Phone *</label><input style={inp} placeholder="+91 XXXXX XXXXX" {...bind("phone")}/></div>
                </div>
                <div style={{marginBottom:"0.9rem"}}><label style={lbl}>Email</label><input style={inp} placeholder="your@email.com" {...bind("email")}/></div>
                <div className="frow" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.9rem",marginBottom:"0.9rem"}}>
                  <div><label style={lbl}>Moving From</label><input style={inp} placeholder="City / Area" {...bind("from")}/></div>
                  <div><label style={lbl}>Moving To</label><input style={inp} placeholder="City / Area" {...bind("to")}/></div>
                </div>
                <div className="frow" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.9rem",marginBottom:"0.9rem"}}>
                  <div><label style={lbl}>Service</label>
                    <select style={{...inp,cursor:"pointer"}} value={form.service} onChange={e=>setForm({...form,service:e.target.value})} onFocus={e=>e.target.style.borderColor="var(--r)"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"}>
                      <option value="">Select service...</option>
                      <option>Household Shifting</option><option>Office Shifting</option>
                      <option>Car Transportation</option><option>Packing & Unpacking</option>
                      <option>Storage / Warehousing</option>
                    </select>
                  </div>
                  <div><label style={lbl}>Moving Date</label><input type="date" style={inp} {...bind("date")}/></div>
                </div>
                <div style={{marginBottom:"1.3rem"}}><label style={lbl}>Message</label><textarea style={{...inp,resize:"vertical",minHeight:"80px"}} placeholder="Tell us more about your move..." {...bind("msg")}/></div>
                <button onClick={submit} disabled={st==="sending"} style={{width:"100%",background:st==="sending"?"rgba(232,49,26,0.5)":"var(--r)",color:"white",border:"none",padding:"13px",...H,fontWeight:800,fontSize:"0.88rem",letterSpacing:"2px",textTransform:"uppercase",cursor:st==="sending"?"not-allowed":"pointer",borderRadius:"6px",transition:"all 0.3s"}}
                  onMouseEnter={e=>{if(st!=="sending"){e.currentTarget.style.background="var(--rd)";e.currentTarget.style.transform="translateY(-2px)";}}}
                  onMouseLeave={e=>{if(st!=="sending"){e.currentTarget.style.background="var(--r)";e.currentTarget.style.transform="translateY(0)";}}}>
                  {st==="sending"?"Sending...":"Send My Request"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── FOOTER ────────────────────────────────────────────── */
const Footer = ({setPage}) => (
  <footer style={{background:"var(--n2)",borderTop:"1px solid var(--bd)",padding:"3.5rem 2rem 1.5rem"}}>
    <div style={{maxWidth:"1200px",margin:"0 auto"}}>
      <div className="fgrid" style={{display:"grid",gridTemplateColumns:"1.5fr 1fr 1fr 1fr",gap:"2.5rem",paddingBottom:"2.5rem",borderBottom:"1px solid var(--bd)",marginBottom:"1.5rem"}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:"11px",marginBottom:"1rem"}}>
            <img src={LOGO} style={{width:"44px",height:"44px",borderRadius:"50%",objectFit:"cover",border:"2px solid var(--am)"}}/>
            <div>
              <div style={{...H,fontWeight:900,fontSize:"1rem",color:"var(--w)",letterSpacing:"1px"}}>RIYA CARGO</div>
              <div style={{...B,fontSize:"0.5rem",color:"var(--am)",letterSpacing:"2.5px"}}>MOVERS & PACKERS (REGD.)</div>
            </div>
          </div>
          <p style={{...B,color:"var(--mu)",fontSize:"0.82rem",lineHeight:1.7,fontWeight:300}}>ISO 9001-2015 certified company providing prompt & secured relocation services across India.</p>
          <div style={{marginTop:"0.7rem",...B,fontSize:"0.7rem",color:"rgba(240,242,245,0.2)"}}>GST: 33BTFPA7894F1ZN</div>
        </div>
        {[{title:"Quick Links",items:[["Home","Home"],["About","About"],["Services","Services"],["Gallery","Gallery"],["Contact","Contact"]]},
          {title:"Services",items:[["Household Shifting",null],["Office Relocation",null],["Car Transport",null],["Packing & Unpacking",null],["Warehousing",null]]}].map((col,i)=>(
          <div key={i}>
            <h4 style={{...H,fontWeight:700,color:"var(--w)",fontSize:"0.78rem",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"1rem",paddingBottom:"7px",borderBottom:"2px solid var(--r)",display:"inline-block"}}>{col.title}</h4>
            <ul style={{listStyle:"none"}}>
              {col.items.map(([label,pg])=>(
                <li key={label} style={{marginBottom:"6px"}}>
                  <span style={{...B,color:"var(--mu)",fontSize:"0.82rem",cursor:pg?"pointer":"default",fontWeight:300,transition:"color 0.2s"}}
                    onClick={()=>pg&&setPage(pg)} onMouseEnter={e=>{if(pg)e.target.style.color="var(--am)";}} onMouseLeave={e=>e.target.style.color="var(--mu)"}>
                    → {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h4 style={{...H,fontWeight:700,color:"var(--w)",fontSize:"0.78rem",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:"1rem",paddingBottom:"7px",borderBottom:"2px solid var(--r)",display:"inline-block"}}>Contact</h4>
          <div style={{...B,fontSize:"0.8rem",color:"var(--mu)",lineHeight:2,fontWeight:300}}>
            <div>📍 Nigdi, Pune 411044</div>
            <div>📞 <a href="tel:9146171008" style={{color:"var(--mu)",textDecoration:"none"}}>91461 71008</a></div>
            <div>📧 <a href="mailto:info.riyacargopune@gmail.com" style={{color:"var(--mu)",textDecoration:"none",fontSize:"0.74rem"}}>info.riyacargopune@gmail.com</a></div>
          </div>
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"0.74rem",color:"rgba(240,242,245,0.2)",...B}}>
        <span>© 2026 Riya Cargo Movers & Packers (Regd.). All rights reserved.</span>
        <span>Made with ❤️ in Pune</span>
      </div>
    </div>
  </footer>
);

/* ── APP ───────────────────────────────────────────────── */
export default function App() {
  const [page,setPage] = useState("Home");
  const go = p => {window.scrollTo({top:0,behavior:"smooth"});setPage(p);};
  return (
    <>
      <G/>
      <Nav page={page} setPage={go}/>
      <main>
        {page==="Home"     && <Home     setPage={go}/>}
        {page==="About"    && <About    setPage={go}/>}
        {page==="Services" && <Services setPage={go}/>}
        {page==="Gallery"  && <Gallery  setPage={go}/>}
        {page==="Contact"  && <Contact  setPage={go}/>}
      </main>
      <Footer setPage={go}/>
      <a href="https://wa.me/919146171008" target="_blank" rel="noreferrer"
        style={{position:"fixed",bottom:"28px",right:"28px",zIndex:999,width:"52px",height:"52px",borderRadius:"50%",background:"#25D366",color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",textDecoration:"none",animation:"pulse 2.5s infinite",boxShadow:"0 4px 18px rgba(37,211,102,0.5)",transition:"transform 0.3s"}}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>💬</a>
    </>
  );
}