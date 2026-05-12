import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
function useInView(t=0.1){const r=useRef(null);const[v,s]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)s(true)},{threshold:t});if(r.current)o.observe(r.current);return()=>o.disconnect();},[t]);return[r,v];}

const SERVICES=[
  {icon:"🌐",tag:"WEB",title:"Website Design & Development",desc:"We build blazing-fast, pixel-perfect websites that don't just look good — they convert. From landing pages to full e-commerce platforms, every site is built for performance, SEO, and growth.",features:["Custom UI/UX Design","Mobile Responsive","SEO Optimized","Fast Loading Speed","CMS Integration","Analytics Setup"],teal:false},
  {icon:"🎨",tag:"BRAND",title:"Logo & Brand Identity",desc:"Your brand is your first impression. We craft complete visual identities — logos, color systems, typography, brand guidelines — that make you instantly recognizable and unforgettable.",features:["Logo Design (3 concepts)","Brand Color Palette","Typography System","Brand Guidelines Doc","Business Card Design","Social Media Kit"],teal:true},
  {icon:"📸",tag:"VISUAL",title:"Photography & Content Creation",desc:"Scroll-stopping visuals that tell your brand's story. Professional photography, product shoots, and content creation tailored for your website, social media, and marketing campaigns.",features:["Product Photography","Lifestyle Shoots","Video Content","Reels & Shorts","Editing & Retouching","Content Calendar"],teal:false},
  {icon:"📱",tag:"SOCIAL",title:"Social Media Management",desc:"We own your social presence end-to-end. Daily posts, story creation, community management, influencer outreach — everything you need to dominate Instagram, Facebook, and beyond.",features:["Daily Content Posting","Story Creation","Community Management","Hashtag Strategy","Monthly Reports","Competitor Analysis"],teal:true},
  {icon:"🚀",tag:"GROWTH",title:"Reach & Follower Growth",desc:"Real, organic growth strategies that build an engaged audience. We use data-driven techniques to reach your ideal customers and convert them into loyal followers and buyers.",features:["Organic Growth Strategy","Targeted Audience Research","Engagement Campaigns","Collaboration Outreach","Growth Analytics","A/B Testing"],teal:false},
  {icon:"✍️",tag:"SEO",title:"SEO & Blog Content",desc:"Rank higher, get found, drive revenue. We create keyword-rich blog content and implement technical SEO strategies that put you on the first page of Google — and keep you there.",features:["Keyword Research","Blog Writing (4/month)","On-Page SEO","Technical SEO Audit","Backlink Building","Monthly SEO Report"],teal:true},
];

const CSS=`
@media(max-width:768px){
  .sv-hero{padding:120px 20px 72px!important}
  .sv-grid{grid-template-columns:1fr!important;padding:48px 20px 72px!important}
  .sv-card{padding:28px 20px!important}
  .sv-feats{grid-template-columns:1fr!important}
  .sv-cta{margin:0 16px 72px!important;padding:44px 24px!important;flex-direction:column!important;gap:24px!important}
}`;

export default function ServicesPage(){
  const[hRef,hIn]=useInView(0.1);
  const[gRef,gIn]=useInView(0.05);
  const[cRef,cIn]=useInView(0.2);

  return(
    <div style={{background:"var(--bg)",color:"var(--ink)",overflowX:"hidden"}}>
      <style>{CSS}</style>
      <Navbar/>

      {/* HERO */}
      <section ref={hRef} className="sv-hero" style={{padding:"160px 32px 96px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div className="dots" style={{position:"absolute",inset:0,opacity:.5,pointerEvents:"none"}}/>
        <div style={{position:"absolute",width:600,height:400,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(0,105,165,.1) 0%,transparent 70%)",top:"-60px",left:"50%",transform:"translateX(-50%)",pointerEvents:"none"}}/>
        <div style={{maxWidth:760,margin:"0 auto",position:"relative"}}>
          <div className="stag" style={{justifyContent:"center",opacity:hIn?1:0,transition:"opacity .6s ease"}}>Our Services</div>
          <h1 className="fd" style={{fontSize:"clamp(3rem,7vw,5.5rem)",fontWeight:900,marginBottom:24,opacity:hIn?1:0,transform:hIn?"none":"translateY(40px)",transition:"all .9s ease .1s"}}>
            Everything<br/><span className="grad-text" style={{fontStyle:"italic"}}>You Need.</span>
          </h1>
          <p style={{fontSize:"1.05rem",color:"var(--mid)",maxWidth:520,margin:"0 auto 40px",lineHeight:1.8,opacity:hIn?1:0,transform:hIn?"none":"translateY(28px)",transition:"all .9s ease .25s"}}>
            Six core services. One team. Zero excuses. We handle your entire digital presence so you can focus on running your business.
          </p>
          <Link to="/contact" className="btn-blue" style={{opacity:hIn?1:0,transition:"opacity .9s ease .4s",display:"inline-flex"}}>Get a Free Quote →</Link>
        </div>
      </section>

      {/* GRID */}
      <section className="sv-grid" style={{padding:"0 32px 96px"}}>
        <div ref={gRef} style={{maxWidth:1180,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:24}}>
          {SERVICES.map((s,i)=>(
            <div key={i} className="card sv-card" style={{padding:"40px 36px",position:"relative",overflow:"hidden",opacity:gIn?1:0,transform:gIn?"none":"translateY(48px)",transition:`all .6s ease ${i*.1}s`}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:s.teal?"var(--teal)":"var(--blue)",borderRadius:"18px 18px 0 0"}}/>
              <div style={{display:"flex",alignItems:"flex-start",gap:16,marginBottom:24,flexWrap:"wrap"}}>
                <div style={{width:52,height:52,borderRadius:14,background:s.teal?"var(--teal-lt)":"var(--blue-lt)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",flexShrink:0}}>{s.icon}</div>
                <div style={{flex:1,minWidth:160}}>
                  <div style={{display:"inline-block",padding:"3px 10px",background:s.teal?"var(--teal-lt)":"var(--blue-lt)",borderRadius:999,fontSize:".62rem",fontWeight:800,color:s.teal?"var(--teal)":"var(--blue)",letterSpacing:"2px",marginBottom:8}}>{s.tag}</div>
                  <h3 style={{fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:"clamp(.95rem,2vw,1.2rem)",color:"var(--ink)",letterSpacing:"-.3px"}}>{s.title}</h3>
                </div>
              </div>
              <p style={{color:"var(--mid)",fontSize:".875rem",lineHeight:1.8,marginBottom:24}}>{s.desc}</p>
              <div className="sv-feats" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 16px"}}>
                {s.features.map((f,j)=>(
                  <div key={j} style={{display:"flex",alignItems:"center",gap:8,fontSize:".8rem",color:"var(--mid)",fontWeight:500}}>
                    <span style={{color:s.teal?"var(--teal)":"var(--blue)",fontSize:".65rem",flexShrink:0}}>✦</span>{f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div ref={cRef} style={{padding:"0 32px 96px"}}>
        <div className="sv-cta" style={{maxWidth:1180,margin:"0 auto",background:"linear-gradient(135deg,var(--blue),var(--teal))",borderRadius:28,padding:"64px 72px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:40,position:"relative",overflow:"hidden",opacity:cIn?1:0,transform:cIn?"none":"translateY(28px)",transition:"all .8s ease"}}>
          <div style={{position:"absolute",top:-60,right:-60,width:280,height:280,borderRadius:"50%",background:"rgba(255,255,255,.07)",pointerEvents:"none"}}/>
          <div style={{position:"relative",maxWidth:560}}>
            <h2 className="fd" style={{fontSize:"clamp(1.6rem,3.5vw,2.6rem)",color:"white",marginBottom:14,letterSpacing:"-1px"}}>Not Sure Which Service You Need?</h2>
            <p style={{color:"rgba(255,255,255,.78)",fontSize:"1rem",lineHeight:1.75}}>Let's have a free 30-min strategy call. We'll figure out exactly what will grow your business fastest.</p>
          </div>
          <Link to="/contact" style={{background:"white",color:"var(--blue)",padding:"15px 36px",borderRadius:999,fontWeight:800,fontSize:".95rem",textDecoration:"none",flexShrink:0,boxShadow:"0 8px 24px rgba(0,0,0,.12)"}}>
            Book Free Call →
          </Link>
        </div>
      </div>

      <Footer/>
    </div>
  );
}
