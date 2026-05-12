import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
const LOGO = "logo.jpeg";

function useInView(t=0.12){const r=useRef(null);const[v,s]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)s(true)},{threshold:t});if(r.current)o.observe(r.current);return()=>o.disconnect();},[t]);return[r,v];}
function useCounter(end,dur=2000,go=false){const[c,s]=useState(0);useEffect(()=>{if(!go)return;let t0=null;const step=ts=>{if(!t0)t0=ts;const p=Math.min((ts-t0)/dur,1);s(Math.floor(p*end));if(p<1)requestAnimationFrame(step);};requestAnimationFrame(step);},[end,dur,go]);return c;}

const SVCS=[
  {icon:"🌐",title:"Website Design",desc:"Pixel-perfect, blazing-fast websites that convert visitors into paying customers.",teal:false},
  {icon:"🎨",title:"Logo & Branding",desc:"Complete visual identities that make you instantly recognizable and unforgettable.",teal:true},
  {icon:"📱",title:"Social Media",desc:"We own your social presence end-to-end — strategy, content, and growth.",teal:false},
  {icon:"🚀",title:"SEO & Growth",desc:"Data-driven strategies that put you on page 1 of Google and keep you there.",teal:true},
  {icon:"📸",title:"Photography",desc:"Scroll-stopping visuals tailored for your website, social media, and ads.",teal:false},
  {icon:"✍️",title:"Blog & Content",desc:"Keyword-rich content that builds authority and drives organic traffic every month.",teal:true},
];
const MARQUEE=["Website Design","Brand Identity","Social Media","Photography","SEO","Growth Strategy","Content Creation","Logo Design"];
const LIVE=[
  {name:"En Rachna Design Labs",url:"https://enrachnadesignlabs.com/",desc:"Premium interior design studio — elegant Next.js site built to convert high-value clients.",tag:"Website · Next.js"},
  {name:"Riya Cargo Pune",url:"https://riyacargopune.com/",desc:"Logistics company website — fast, trust-building, and SEO-optimised for local Pune searches.",tag:"Website · Next.js"},
];

const CSS=`
@media(max-width:768px){
  .h-wrap{padding:110px 20px 60px!important;flex-direction:column!important}
  .h-text{text-align:center!important}
  .h-btns{justify-content:center!important;flex-wrap:wrap!important}
  .h-visual{display:none!important}
  .stats-g{grid-template-columns:repeat(2,1fr)!important;padding:40px 20px!important}
  .s-grid{grid-template-columns:1fr!important;padding:0 20px 72px!important}
  .lp-grid{grid-template-columns:1fr!important}
  .cta-inner{padding:48px 20px!important;flex-direction:column!important;gap:28px!important}
  .lp-section{padding:72px 20px!important}
  .svc-section{padding:72px 20px 0!important}
}`;

export default function HomePage(){
  const[hRef,hIn]=useInView(0.05);
  const[sRef,sIn]=useInView(0.2);
  const[svRef,svIn]=useInView(0.05);
  const[lpRef,lpIn]=useInView(0.05);
  const[ctaRef,ctaIn]=useInView(0.15);
  const c0=useCounter(50,1800,sIn);
  const c1=useCounter(3,1800,sIn);
  const c2=useCounter(30,1800,sIn);
  const c3=useCounter(100,1800,sIn);

  return(
    <div style={{background:"var(--bg)",color:"var(--ink)",overflowX:"hidden"}}>
      <style>{CSS}</style>
      <Navbar/>

      {/* ── HERO ── */}
      <section style={{minHeight:"100vh",display:"flex",alignItems:"center",position:"relative",overflow:"hidden",background:"var(--bg)"}}>
        <div className="dots" style={{position:"absolute",inset:0,opacity:.6,pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:"5%",right:"-5%",width:520,height:520,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,105,165,.1) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"-5%",left:"-8%",width:380,height:380,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,120,150,.08) 0%,transparent 70%)",pointerEvents:"none"}}/>

        <div className="h-wrap" style={{maxWidth:1180,margin:"0 auto",padding:"0 32px",width:"100%",display:"flex",alignItems:"center",gap:80,paddingTop:100}}>
          {/* Text */}
          <div ref={hRef} className="h-text" style={{flex:1,minWidth:0}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"var(--blue-lt)",border:"1.5px solid var(--blue-md)",borderRadius:999,padding:"6px 16px",marginBottom:28,opacity:hIn?1:0,transition:"opacity .7s ease"}}>
              <span style={{width:7,height:7,borderRadius:"50%",background:"var(--blue)",display:"inline-block",animation:"blink 2s ease-in-out infinite"}}/>
              <span style={{fontSize:".72rem",fontWeight:800,color:"var(--blue)",letterSpacing:"1.5px",textTransform:"uppercase"}}>Full-Service Digital Agency</span>
            </div>

            <h1 className="fd" style={{fontSize:"clamp(3.2rem,7vw,6.5rem)",fontWeight:900,marginBottom:24,opacity:hIn?1:0,transform:hIn?"none":"translateY(40px)",transition:"all .9s ease .1s"}}>
              We Make<br/>
              <span className="grad-text-anim" style={{fontStyle:"italic"}}>Businesses</span><br/>
              Grow.
            </h1>

            <p style={{fontSize:"clamp(1rem,1.8vw,1.1rem)",color:"var(--mid)",maxWidth:480,lineHeight:1.78,marginBottom:40,opacity:hIn?1:0,transform:hIn?"none":"translateY(24px)",transition:"all .9s ease .25s"}}>
              From stunning websites to social media that captivates — we handle everything so you can focus on what you love.
            </p>

            <div className="h-btns" style={{display:"flex",gap:14,opacity:hIn?1:0,transform:hIn?"none":"translateY(20px)",transition:"all .9s ease .4s"}}>
              <Link to="/services" className="btn-blue">Explore Services →</Link>
              <Link to="/contact" className="btn-outline">Get Free Quote</Link>
            </div>

            {/* Social proof */}
            <div style={{display:"flex",alignItems:"center",gap:16,marginTop:44,opacity:hIn?1:0,transition:"opacity 1s ease .6s"}}>
              <div style={{display:"flex"}}>
                {["🧑","👩","👨","🧑"].map((e,i)=>(
                  <div key={i} style={{width:32,height:32,borderRadius:"50%",background:`hsl(${200+i*20},40%,82%)`,border:"2.5px solid var(--bg)",marginLeft:i?-10:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".9rem"}}>{e}</div>
                ))}
              </div>
              <div>
                <div style={{color:"var(--blue)",fontSize:".85rem",letterSpacing:1}}>★★★★★</div>
                <div style={{fontSize:".75rem",color:"var(--light)",fontWeight:500}}>Trusted by 50+ businesses across India</div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="h-visual" style={{flexShrink:0,position:"relative",width:400,height:460,opacity:hIn?1:0,transition:"opacity 1.2s ease .5s"}}>
            <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:200,height:200,borderRadius:"50%",animation:"floatY 5s ease-in-out infinite"}}>
              <div style={{position:"absolute",inset:-28,borderRadius:"50%",border:"1.5px dashed rgba(0,105,165,.3)",animation:"spin 30s linear infinite"}}/>
              <div style={{position:"absolute",inset:-10,borderRadius:"50%",border:"2px solid transparent",background:"linear-gradient(var(--bg),var(--bg)) padding-box,linear-gradient(135deg,var(--blue),var(--teal)) border-box",animation:"spinR 20s linear infinite"}}/>
              <img src={LOGO} style={{width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover",border:"4px solid white",boxShadow:"var(--sh-lg)",position:"relative",zIndex:1}} alt="AdSwirll"/>
            </div>
            {/* Floating cards */}
            {[
              {top:"6%",left:"-8%",val:"50+",lbl:"Clients Grown",d:"0s"},
              {top:"6%",right:"-8%",val:"100%",lbl:"Satisfaction",d:".4s"},
              {bottom:"6%",left:"-4%",val:"30+",lbl:"Sites Live",d:".8s"},
              {bottom:"6%",right:"-4%",val:"3x",lbl:"Avg Growth",d:"1.2s"},
            ].map((s,i)=>(
              <div key={i} style={{
                position:"absolute",
                ...(s.top ? {top:s.top} : {}),
                ...(s.bottom ? {bottom:s.bottom} : {}),
                ...(s.left ? {left:s.left} : {}),
                ...(s.right ? {right:s.right} : {}),
                background:"white",
                border:"1px solid var(--border)",
                borderRadius:16,
                padding:"14px 18px",
                boxShadow:"var(--sh-md)",
                animation:`floatY ${4+i*.5}s ease-in-out ${s.d} infinite`
              }}>
                <div style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:"1.4rem",color:"var(--blue)",lineHeight:1}}>{s.val}</div>
                <div style={{fontSize:".68rem",color:"var(--light)",fontWeight:600,letterSpacing:".5px",marginTop:2}}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{background:"var(--ink)",padding:"18px 0",overflow:"hidden"}}>
        <div className="mq-inner">
          {[...MARQUEE,...MARQUEE].map((item,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:18,paddingRight:48,whiteSpace:"nowrap"}}>
              <span style={{color:"rgba(255,255,255,.45)",fontSize:".82rem",fontWeight:600,letterSpacing:"1px",textTransform:"uppercase"}}>{item}</span>
              <span style={{color:"var(--teal)",fontSize:".75rem"}}>✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <section style={{background:"var(--bg2)",padding:"80px 32px"}}>
        <div ref={sRef} className="stats-g" style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,background:"var(--border)"}}>
          {[{v:c0,s:"+",l:"Clients Grown",sub:"Across India"},{v:c1,s:"x",l:"Avg Growth",sub:"In 6 months"},{v:c2,s:"+",l:"Sites Launched",sub:"Live & converting"},{v:c3,s:"%",l:"Satisfaction",sub:"We never compromise"}].map((st,i)=>(
            <div key={i} style={{textAlign:"center",padding:"48px 20px",background:"white",opacity:sIn?1:0,transform:sIn?"none":"translateY(20px)",transition:`all .6s ease ${i*.1}s`}}>
              <div style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:"clamp(2.5rem,5vw,3.5rem)",color:"var(--blue)",lineHeight:1}}>{st.v}{st.s}</div>
              <div style={{fontWeight:700,color:"var(--ink)",fontSize:".95rem",marginTop:8}}>{st.l}</div>
              <div style={{fontSize:".75rem",color:"var(--light)",marginTop:4}}>{st.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="svc-section" style={{padding:"96px 32px 0"}}>
        <div ref={svRef} style={{maxWidth:1180,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:60}}>
            <div className="stag" style={{justifyContent:"center"}}>What We Do</div>
            <h2 className="fd" style={{fontSize:"clamp(2.2rem,5vw,4rem)",fontWeight:900,marginBottom:16}}>
              Everything Your<br/><span className="grad-text" style={{fontStyle:"italic"}}>Business Needs</span>
            </h2>
            <p style={{color:"var(--mid)",fontSize:"1rem",maxWidth:440,margin:"0 auto",lineHeight:1.78}}>One trusted partner for your entire digital presence.</p>
          </div>

          <div className="s-grid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,paddingBottom:96}}>
            {SVCS.map((s,i)=>(
              <div key={i} className="card" style={{padding:"32px 28px",position:"relative",overflow:"hidden",opacity:svIn?1:0,transform:svIn?"none":"translateY(40px)",transition:`all .6s ease ${i*.08}s`}}>
                <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:s.teal?"var(--teal)":"var(--blue)",borderRadius:"18px 18px 0 0"}}/>
                <div style={{width:52,height:52,borderRadius:14,background:s.teal?"var(--teal-lt)":"var(--blue-lt)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.5rem",marginBottom:20}}>{s.icon}</div>
                <h3 style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:"1.1rem",color:"var(--ink)",marginBottom:10}}>{s.title}</h3>
                <p style={{color:"var(--mid)",fontSize:".875rem",lineHeight:1.75}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE PROJECTS ── */}
      <section className="lp-section" style={{background:"var(--ink)",padding:"96px 32px"}}>
        <div ref={lpRef} style={{maxWidth:1180,margin:"0 auto"}}>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:52,flexWrap:"wrap",gap:20}}>
            <div>
              <div className="stag" style={{color:"var(--teal)"}}>Live Work</div>
              <h2 className="fd" style={{fontSize:"clamp(2rem,4.5vw,3.5rem)",color:"white"}}>
                Sites We've<br/><span className="grad-text" style={{fontStyle:"italic"}}>Actually Built</span>
              </h2>
            </div>
            <Link to="/portfolio" className="btn-ghost-white">View All Work →</Link>
          </div>
          <div className="lp-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:24}}>
            {LIVE.map((p,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.09)",borderRadius:24,overflow:"hidden",opacity:lpIn?1:0,transform:lpIn?"none":"translateY(36px)",transition:`all .6s ease ${i*.15}s`}}>
                {/* Browser chrome */}
                <div style={{background:"rgba(0,0,0,.25)",padding:"14px 18px 0"}}>
                  <div style={{display:"flex",gap:6,marginBottom:10}}>
                    {["#ff5f57","#ffbd2e","#28c841"].map(c=><div key={c} style={{width:9,height:9,borderRadius:"50%",background:c}}/>)}
                  </div>
                  <div style={{background:"rgba(255,255,255,.07)",borderRadius:"7px 7px 0 0",padding:"8px 14px",display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:".65rem"}}>🔒</span>
                    <span style={{fontSize:".72rem",color:"rgba(255,255,255,.4)",fontFamily:"monospace"}}>{p.url}</span>
                  </div>
                </div>
                <div style={{padding:"28px"}}>
                  <div style={{display:"inline-block",padding:"3px 12px",background:"rgba(0,120,150,.2)",border:"1px solid rgba(0,120,150,.35)",borderRadius:999,fontSize:".68rem",fontWeight:800,color:"var(--teal)",letterSpacing:"1px",textTransform:"uppercase",marginBottom:16}}>{p.tag}</div>
                  <h3 style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:"1.4rem",color:"white",marginBottom:12,letterSpacing:"-.4px"}}>{p.name}</h3>
                  <p style={{color:"rgba(255,255,255,.45)",fontSize:".9rem",lineHeight:1.75,marginBottom:24}}>{p.desc}</p>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{width:8,height:8,borderRadius:"50%",background:"#4ade80"}}/>
                      <span style={{fontSize:".8rem",fontWeight:700,color:"#4ade80"}}>Live & Growing</span>
                    </div>
                    <a href={p.url} target="_blank" rel="noreferrer" className="btn-text" style={{color:"var(--teal)"}}>Visit Site →</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{padding:"96px 32px"}}>
        <div ref={ctaRef} style={{maxWidth:1180,margin:"0 auto"}}>
          <div className="cta-inner" style={{background:"linear-gradient(135deg,var(--blue),var(--teal))",borderRadius:28,padding:"72px 80px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:48,position:"relative",overflow:"hidden",opacity:ctaIn?1:0,transform:ctaIn?"none":"translateY(30px)",transition:"all .8s ease"}}>
            <div style={{position:"absolute",top:-80,right:-80,width:300,height:300,borderRadius:"50%",background:"rgba(255,255,255,.08)",pointerEvents:"none"}}/>
            <div style={{position:"relative"}}>
              <h2 className="fd" style={{fontSize:"clamp(1.8rem,4vw,3rem)",color:"white",marginBottom:14,letterSpacing:"-1px"}}>Ready to Make Your Business Unstoppable?</h2>
              <p style={{color:"rgba(255,255,255,.8)",fontSize:"1rem",lineHeight:1.75,maxWidth:460}}>Let's build something extraordinary together. Get a free strategy call today.</p>
            </div>
            <div style={{flexShrink:0,position:"relative",display:"flex",flexDirection:"column",gap:12}}>
              <Link to="/contact" style={{background:"white",color:"var(--blue)",padding:"15px 36px",borderRadius:999,fontWeight:800,fontSize:".97rem",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:8,whiteSpace:"nowrap",boxShadow:"0 8px 24px rgba(0,0,0,.15)"}}>
                Start for Free →
              </Link>
              <Link to="/portfolio" style={{color:"rgba(255,255,255,.75)",fontSize:".85rem",textDecoration:"none",textAlign:"center",fontWeight:600}}>
                See our work →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}