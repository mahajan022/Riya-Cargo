import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
function useInView(t=0.1){const r=useRef(null);const[v,s]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)s(true)},{threshold:t});if(r.current)o.observe(r.current);return()=>o.disconnect();},[t]);return[r,v];}

const LIVE=[
  {name:"En Rachna Design Labs",url:"https://enrachnadesignlabs.com/",desc:"Premium interior design studio — elegant Next.js website built to convert high-value residential and commercial clients.",tag:"Website · Next.js",emoji:"🏠"},
  {name:"Riya Cargo Pune",url:"https://riyacargopune.com/",desc:"Logistics & cargo transport company — fast, trust-building website optimised for local Pune market searches.",tag:"Website · Next.js",emoji:"🚚"},
];
const PROJECTS=[
  {tag:"Website",title:"FreshBite Cafe",desc:"Full brand refresh + website. 3x online orders in 60 days.",result:"300% order growth",emoji:"☕",teal:false},
  {tag:"Branding",title:"ZenFit Studio",desc:"Complete brand identity — logo, colors, social kit. Launched in record time.",result:"Launched in 7 days",emoji:"💪",teal:true},
  {tag:"Social Media",title:"Luxe Jewels",desc:"Instagram & Facebook management. Grew from 1K to 28K followers organically.",result:"28x follower growth",emoji:"💎",teal:false},
  {tag:"SEO",title:"TechRepair Hub",desc:"SEO strategy + blog content. Now ranking #1 for 12 local keywords.",result:"#1 Google ranking",emoji:"🔧",teal:true},
  {tag:"Photography",title:"Bloom Boutique",desc:"Product photography + reels for fashion brand. 5x engagement boost.",result:"5x engagement",emoji:"👗",teal:false},
  {tag:"Full Package",title:"SwiftCourier",desc:"Website, branding, social, SEO — complete digital transformation.",result:"Full rebrand launch",emoji:"📦",teal:true},
];
const FILTERS=["All","Website","Branding","Social Media","SEO","Photography","Full Package"];

const CSS=`
@media(max-width:768px){
  .pt-hero{padding:120px 20px 72px!important}
  .pt-live{padding:0 20px 72px!important}
  .pt-lg{grid-template-columns:1fr!important}
  .pt-filters{gap:8px!important;padding:0 20px!important}
  .pt-grid{grid-template-columns:1fr!important;padding:0 20px 72px!important}
  .pt-stats{padding:48px 20px!important}
  .pt-sg{grid-template-columns:repeat(2,1fr)!important}
  .pt-cta{margin:0 16px 72px!important;padding:44px 24px!important;flex-direction:column!important;gap:24px!important}
}`;

export default function PortfolioPage(){
  const[active,setActive]=useState("All");
  const[hRef,hIn]=useInView(0.1);
  const[lRef,lIn]=useInView(0.05);
  const[gRef,gIn]=useInView(0.05);
  const[cRef,cIn]=useInView(0.2);
  const filtered=active==="All"?PROJECTS:PROJECTS.filter(p=>p.tag===active);

  return(
    <div style={{background:"var(--bg)",color:"var(--ink)",overflowX:"hidden"}}>
      <style>{CSS}</style>
      <Navbar/>

      {/* HERO */}
      <section ref={hRef} className="pt-hero" style={{padding:"160px 32px 80px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div className="dots" style={{position:"absolute",inset:0,opacity:.5,pointerEvents:"none"}}/>
        <div style={{position:"absolute",width:600,height:400,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(0,105,165,.1) 0%,transparent 70%)",top:"-60px",left:"50%",transform:"translateX(-50%)",pointerEvents:"none"}}/>
        <div style={{maxWidth:760,margin:"0 auto",position:"relative"}}>
          <div className="stag" style={{justifyContent:"center",opacity:hIn?1:0,transition:"opacity .6s ease"}}>Our Work</div>
          <h1 className="fd" style={{fontSize:"clamp(3rem,7vw,5.5rem)",fontWeight:900,marginBottom:24,opacity:hIn?1:0,transform:hIn?"none":"translateY(40px)",transition:"all .9s ease .1s"}}>
            Real Clients.<br/><span className="grad-text" style={{fontStyle:"italic"}}>Real Results.</span>
          </h1>
          <p style={{fontSize:"1.05rem",color:"var(--mid)",maxWidth:500,margin:"0 auto",lineHeight:1.8,opacity:hIn?1:0,transform:hIn?"none":"translateY(28px)",transition:"all .9s ease .25s"}}>
            Every project is a story of growth. Here's what we've built for businesses like yours.
          </p>
        </div>
      </section>

      {/* LIVE PROJECTS */}
      <section className="pt-live" style={{padding:"0 32px 80px"}}>
        <div ref={lRef} style={{maxWidth:1180,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:36,flexWrap:"wrap"}}>
            <h2 className="fd" style={{fontSize:"1.5rem",fontWeight:900}}>Live Sites We Built</h2>
            <div style={{display:"flex",alignItems:"center",gap:6,padding:"4px 12px",background:"var(--blue-lt)",border:"1.5px solid var(--blue-md)",borderRadius:999,flexShrink:0}}>
              <span style={{width:7,height:7,borderRadius:"50%",background:"var(--blue)",display:"inline-block",animation:"blink 2s ease-in-out infinite"}}/>
              <span style={{fontSize:".65rem",fontWeight:800,color:"var(--blue)",letterSpacing:"1.5px",textTransform:"uppercase"}}>Live on Google</span>
            </div>
          </div>
          <div className="pt-lg" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:24}}>
            {LIVE.map((p,i)=>(
              <div key={i} style={{background:"white",border:"1.5px solid var(--border)",borderRadius:24,overflow:"hidden",boxShadow:"var(--sh-sm)",transition:"all .35s ease",opacity:lIn?1:0,transform:lIn?"none":"translateY(36px)",transitionDelay:`${i*.15}s`}}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow="var(--sh-md)";e.currentTarget.style.transform="translateY(-6px)";e.currentTarget.style.borderColor="var(--blue-md)"}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow="var(--sh-sm)";e.currentTarget.style.transform=lIn?"none":"translateY(36px)";e.currentTarget.style.borderColor="var(--border)"}}>
                {/* Browser chrome */}
                <div style={{background:"var(--ink)",padding:"14px 18px 0"}}>
                  <div style={{display:"flex",gap:6,marginBottom:10}}>
                    {["#ff5f57","#ffbd2e","#28c841"].map(c=><div key={c} style={{width:9,height:9,borderRadius:"50%",background:c}}/>)}
                  </div>
                  <div style={{background:"rgba(255,255,255,.08)",borderRadius:"7px 7px 0 0",padding:"8px 14px",display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:".65rem"}}>🔒</span>
                    <span style={{fontSize:".72rem",color:"rgba(255,255,255,.4)",fontFamily:"monospace"}}>{p.url}</span>
                  </div>
                </div>
                <div style={{padding:"28px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                    <div style={{width:44,height:44,borderRadius:12,background:"var(--blue-lt)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.3rem",flexShrink:0}}>{p.emoji}</div>
                    <div>
                      <h3 style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:"1.15rem",color:"var(--ink)",letterSpacing:"-.3px"}}>{p.name}</h3>
                      <div style={{fontSize:".7rem",color:"var(--light)",fontWeight:600,marginTop:2}}>{p.tag}</div>
                    </div>
                  </div>
                  <p style={{color:"var(--mid)",fontSize:".875rem",lineHeight:1.75,marginBottom:22}}>{p.desc}</p>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{width:8,height:8,borderRadius:"50%",background:"#16a34a"}}/>
                      <span style={{fontSize:".8rem",fontWeight:700,color:"#16a34a"}}>Live & Growing</span>
                    </div>
                    <a href={p.url} target="_blank" rel="noreferrer" className="btn-blue" style={{padding:"9px 20px",fontSize:".82rem"}}>Visit Site ↗</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section style={{background:"var(--bg2)",padding:"80px 32px"}}>
        <div style={{maxWidth:1180,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:44}}>
            <div className="stag" style={{justifyContent:"center"}}>Case Studies</div>
            <h2 className="fd" style={{fontSize:"clamp(1.8rem,4vw,3rem)",fontWeight:900}}>More Client <span className="grad-text" style={{fontStyle:"italic"}}>Stories</span></h2>
          </div>
          {/* Filters */}
          <div className="pt-filters" style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center",marginBottom:44}}>
            {FILTERS.map(f=>(
              <button key={f} onClick={()=>setActive(f)} style={{
                padding:"9px 22px",borderRadius:999,cursor:"pointer",
                fontFamily:"'Outfit',sans-serif",fontWeight:700,fontSize:".83rem",
                transition:"all .22s ease",border:"1.5px solid",
                background:active===f?"var(--blue)":"transparent",
                borderColor:active===f?"var(--blue)":"var(--border2)",
                color:active===f?"white":"var(--mid)",
                boxShadow:active===f?"var(--sh-blue)":"none",
              }}>{f}</button>
            ))}
          </div>
          {/* Grid */}
          <div ref={gRef} className="pt-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
            {filtered.map((p,i)=>(
              <div key={p.title} className="card" style={{overflow:"hidden",opacity:gIn?1:0,transform:gIn?"none":"translateY(36px)",transitionDelay:`${i*.07}s`,transition:"all .5s ease"}}>
                <div style={{height:120,background:p.teal?"linear-gradient(135deg,var(--teal-lt),var(--blue-lt))":"linear-gradient(135deg,var(--blue-lt),var(--teal-lt))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"2.8rem",position:"relative"}}>
                  <span style={{position:"relative",zIndex:1}}>{p.emoji}</span>
                  <div style={{position:"absolute",top:12,left:12,padding:"3px 10px",background:"rgba(255,255,255,.85)",borderRadius:999,fontSize:".6rem",fontWeight:800,letterSpacing:"1.5px",color:p.teal?"var(--teal)":"var(--blue)",border:`1px solid ${p.teal?"var(--teal-lt)":"var(--blue-lt)"}`}}>{p.tag}</div>
                </div>
                <div style={{padding:"22px"}}>
                  <h3 style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:"1.05rem",color:"var(--ink)",marginBottom:8}}>{p.title}</h3>
                  <p style={{color:"var(--mid)",fontSize:".85rem",lineHeight:1.72,marginBottom:16}}>{p.desc}</p>
                  <div style={{display:"flex",alignItems:"center",gap:7,padding:"7px 12px",background:p.teal?"var(--teal-lt)":"var(--blue-lt)",borderRadius:999,width:"fit-content"}}>
                    <span style={{color:p.teal?"var(--teal)":"var(--blue)",fontSize:".65rem"}}>✦</span>
                    <span style={{color:p.teal?"var(--teal)":"var(--blue)",fontSize:".78rem",fontWeight:700}}>{p.result}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="pt-stats" style={{padding:"60px 32px",borderTop:"1px solid var(--border)",borderBottom:"1px solid var(--border)"}}>
        <div className="pt-sg" style={{maxWidth:1000,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:24,textAlign:"center"}}>
          {[["50+","Projects Done"],["6","Industries"],["100%","Client Retention"],["3x","Avg ROI"]].map(([v,l],i)=>(
            <div key={i}>
              <div style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:"clamp(2rem,5vw,2.8rem)",color:"var(--blue)",marginBottom:8}}>{v}</div>
              <div style={{fontSize:".72rem",fontWeight:700,color:"var(--light)",letterSpacing:"2px",textTransform:"uppercase"}}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div ref={cRef} style={{padding:"80px 32px"}}>
        <div className="pt-cta" style={{maxWidth:1180,margin:"0 auto",background:"linear-gradient(135deg,var(--blue),var(--teal))",borderRadius:28,padding:"64px 72px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:40,position:"relative",overflow:"hidden",opacity:cIn?1:0,transform:cIn?"none":"translateY(28px)",transition:"all .8s ease"}}>
          <div style={{position:"absolute",top:-60,right:-60,width:280,height:280,borderRadius:"50%",background:"rgba(255,255,255,.07)",pointerEvents:"none"}}/>
          <div style={{position:"relative",maxWidth:560}}>
            <h2 className="fd" style={{fontSize:"clamp(1.6rem,3.5vw,2.6rem)",color:"white",marginBottom:14,letterSpacing:"-1px"}}>Want Results Like These?</h2>
            <p style={{color:"rgba(255,255,255,.78)",fontSize:"1rem",lineHeight:1.75}}>Your business could be our next success story. Let's make it happen.</p>
          </div>
          <Link to="/contact" style={{background:"white",color:"var(--blue)",padding:"15px 36px",borderRadius:999,fontWeight:800,fontSize:".95rem",textDecoration:"none",flexShrink:0,boxShadow:"0 8px 24px rgba(0,0,0,.12)"}}>
            Start Your Project →
          </Link>
        </div>
      </div>

      <Footer/>
    </div>
  );
}
