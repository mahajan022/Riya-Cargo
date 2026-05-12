import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
function useInView(t=0.1){const r=useRef(null);const[v,s]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)s(true)},{threshold:t});if(r.current)o.observe(r.current);return()=>o.disconnect();},[t]);return[r,v];}

const VALUES=[
  {icon:"🎯",t:"Results-First",d:"Every decision is tied to measurable outcomes. No fluff, no guesswork — pure data-driven growth.",teal:false},
  {icon:"⚡",t:"Fast Execution",d:"We move at startup speed. Quick turnarounds, rapid testing, and a team that ships without compromising quality.",teal:true},
  {icon:"🔍",t:"Deep Research",d:"We study your industry, competitors, and customers before touching a single pixel. Strategy before speed.",teal:false},
  {icon:"🤝",t:"Long-Term Partners",d:"We don't disappear after delivery. We track, optimise, and iterate with you every single month.",teal:true},
  {icon:"💡",t:"Creative Excellence",d:"Bold ideas, executed with precision. We bring fresh perspectives that make your brand impossible to ignore.",teal:false},
  {icon:"🌐",t:"Full-Stack Team",d:"Designers, developers, marketers, writers — everything under one roof. One team, zero coordination nightmares.",teal:true},
];
const TEAM=[
  {name:"Anurag",role:"Founder & Creative Director",emoji:"👨‍💼"},
  {name:"Design Team",role:"UI/UX & Brand Design",emoji:"🎨"},
  {name:"Dev Team",role:"Web Development",emoji:"💻"},
  {name:"Growth Team",role:"SEO & Social Media",emoji:"🚀"},
];

const CSS=`
@media(max-width:768px){
  .ab-hero{padding:120px 20px 72px!important}
  .ab-mis-g{grid-template-columns:1fr!important;gap:40px!important;padding:60px 20px!important}
  .ab-vals{padding:60px 20px!important}
  .ab-vg{grid-template-columns:1fr!important}
  .ab-team{padding:60px 20px!important}
  .ab-tg{grid-template-columns:repeat(2,1fr)!important}
  .ab-cta{margin:0 16px 72px!important;padding:44px 24px!important;flex-direction:column!important;gap:24px!important}
}`;

export default function AboutPage(){
  const[hRef,hIn]=useInView(0.1);
  const[mRef,mIn]=useInView(0.1);
  const[vRef,vIn]=useInView(0.05);
  const[tRef,tIn]=useInView(0.1);
  const[cRef,cIn]=useInView(0.2);

  return(
    <div style={{background:"var(--bg)",color:"var(--ink)",overflowX:"hidden"}}>
      <style>{CSS}</style>
      <Navbar/>

      {/* HERO */}
      <section ref={hRef} className="ab-hero" style={{padding:"160px 32px 96px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div className="dots" style={{position:"absolute",inset:0,opacity:.5,pointerEvents:"none"}}/>
        <div style={{position:"absolute",width:600,height:400,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(0,105,165,.1) 0%,transparent 70%)",top:"-60px",left:"50%",transform:"translateX(-50%)",pointerEvents:"none"}}/>
        <div style={{maxWidth:760,margin:"0 auto",position:"relative"}}>
          <div className="stag" style={{justifyContent:"center",opacity:hIn?1:0,transition:"opacity .6s ease"}}>Our Story</div>
          <h1 className="fd" style={{fontSize:"clamp(3rem,7vw,5.5rem)",fontWeight:900,marginBottom:24,opacity:hIn?1:0,transform:hIn?"none":"translateY(40px)",transition:"all .9s ease .1s"}}>
            Built to<br/><span className="grad-text" style={{fontStyle:"italic"}}>Grow You.</span>
          </h1>
          <p style={{fontSize:"1.05rem",color:"var(--mid)",maxWidth:520,margin:"0 auto",lineHeight:1.8,opacity:hIn?1:0,transform:hIn?"none":"translateY(28px)",transition:"all .9s ease .25s"}}>
            We're not just another agency. We're a team obsessed with one thing — making your business win online.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section style={{padding:"0 32px"}}>
        <div ref={mRef} className="ab-mis-g" style={{maxWidth:1180,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center",padding:"0 0 80px"}}>
          <div style={{opacity:mIn?1:0,transform:mIn?"none":"translateX(-40px)",transition:"all .9s ease"}}>
            <div className="stag">Our Mission</div>
            <h2 className="fd" style={{fontSize:"clamp(1.8rem,4vw,2.8rem)",fontWeight:900,marginBottom:24,lineHeight:1.1}}>
              Every Business Deserves<br/><span className="grad-text" style={{fontStyle:"italic"}}>World-Class Marketing.</span>
            </h2>
            <p style={{color:"var(--mid)",fontSize:".97rem",lineHeight:1.82,marginBottom:20}}>AdSwirll was born from a simple frustration — great businesses were being left behind because they couldn't afford big agencies or didn't know where to start online.</p>
            <p style={{color:"var(--mid)",fontSize:".97rem",lineHeight:1.82,marginBottom:20}}>We built AdSwirll to change that. A full-service digital team that works as hard as you do, delivers results you can measure, and stays by your side as you grow.</p>
            <p style={{color:"var(--mid)",fontSize:".97rem",lineHeight:1.82}}>From your first logo to your biggest campaign — we're with you every step of the way.</p>
          </div>
          <div style={{opacity:mIn?1:0,transform:mIn?"none":"translateX(40px)",transition:"all .9s ease .2s"}}>
            {[
              {n:"2026",t:"Founded",d:"AdSwirll started with a mission to make powerful digital marketing accessible to all."},
              {n:"50+",t:"Happy Clients",d:"Businesses across India that we've helped grow their digital presence."},
              {n:"3x",t:"Average Growth",d:"The average follower and revenue growth our clients see in 6 months."},
              {n:"6",t:"Core Services",d:"Web, Brand, Social, Photography, Growth, SEO — all under one roof."},
            ].map((item,i)=>(
              <div key={i} style={{display:"flex",gap:20,padding:"20px 0",borderBottom:"1px solid var(--border)"}}>
                <div style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:"clamp(1.5rem,4vw,2rem)",color:"var(--blue)",minWidth:64,lineHeight:1}}>{item.n}</div>
                <div>
                  <div style={{fontWeight:700,color:"var(--ink)",fontSize:"1rem",marginBottom:4}}>{item.t}</div>
                  <div style={{color:"var(--mid)",fontSize:".85rem",lineHeight:1.6}}>{item.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="ab-vals" style={{padding:"80px 32px",background:"var(--bg2)"}}>
        <div ref={vRef} style={{maxWidth:1180,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:56}}>
            <div className="stag" style={{justifyContent:"center"}}>What Drives Us</div>
            <h2 className="fd" style={{fontSize:"clamp(1.8rem,4vw,3rem)",fontWeight:900}}>Our Core <span className="grad-text" style={{fontStyle:"italic"}}>Values</span></h2>
          </div>
          <div className="ab-vg" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
            {VALUES.map((v,i)=>(
              <div key={i} className="card" style={{padding:"28px 24px",opacity:vIn?1:0,transform:vIn?"none":"translateY(40px)",transition:`all .6s ease ${i*.08}s`}}>
                <div style={{width:48,height:48,borderRadius:12,background:v.teal?"var(--teal-lt)":"var(--blue-lt)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",marginBottom:16}}>{v.icon}</div>
                <div style={{fontWeight:700,color:"var(--ink)",fontSize:"1rem",marginBottom:8}}>{v.t}</div>
                <div style={{color:"var(--mid)",fontSize:".85rem",lineHeight:1.72}}>{v.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="ab-team" style={{padding:"88px 32px"}}>
        <div ref={tRef} style={{maxWidth:1180,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:56}}>
            <div className="stag" style={{justifyContent:"center"}}>The Team</div>
            <h2 className="fd" style={{fontSize:"clamp(1.8rem,4vw,3rem)",fontWeight:900}}>Meet the <span className="grad-text" style={{fontStyle:"italic"}}>Minds Behind</span></h2>
          </div>
          <div className="ab-tg" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20}}>
            {TEAM.map((t,i)=>(
              <div key={i} className="card" style={{padding:"32px 20px",textAlign:"center",opacity:tIn?1:0,transform:tIn?"none":"translateY(40px)",transition:`all .6s ease ${i*.1}s`}}>
                <div style={{width:68,height:68,borderRadius:"50%",background:"linear-gradient(135deg,var(--blue-lt),var(--teal-lt))",border:"2px solid var(--blue-md)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.8rem",margin:"0 auto 16px"}}>{t.emoji}</div>
                <div style={{fontWeight:700,color:"var(--ink)",fontSize:".95rem",marginBottom:6}}>{t.name}</div>
                <div style={{color:"var(--light)",fontSize:".8rem",fontWeight:500}}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div ref={cRef} style={{padding:"0 32px 96px"}}>
        <div className="ab-cta" style={{maxWidth:1180,margin:"0 auto",background:"linear-gradient(135deg,var(--blue),var(--teal))",borderRadius:28,padding:"64px 72px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:40,position:"relative",overflow:"hidden",opacity:cIn?1:0,transform:cIn?"none":"translateY(28px)",transition:"all .8s ease"}}>
          <div style={{position:"absolute",top:-60,right:-60,width:280,height:280,borderRadius:"50%",background:"rgba(255,255,255,.07)",pointerEvents:"none"}}/>
          <div style={{position:"relative",maxWidth:560}}>
            <h2 className="fd" style={{fontSize:"clamp(1.6rem,3.5vw,2.6rem)",color:"white",marginBottom:14,letterSpacing:"-1px"}}>Let's Build Something Together</h2>
            <p style={{color:"rgba(255,255,255,.78)",fontSize:"1rem",lineHeight:1.75}}>Ready to take your business to the next level? Let's talk.</p>
          </div>
          <Link to="/contact" style={{background:"white",color:"var(--blue)",padding:"15px 36px",borderRadius:999,fontWeight:800,fontSize:".95rem",textDecoration:"none",flexShrink:0,boxShadow:"0 8px 24px rgba(0,0,0,.12)"}}>
            Get In Touch →
          </Link>
        </div>
      </div>

      <Footer/>
    </div>
  );
}
