import { useRef, useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
function useInView(t=0.1){const r=useRef(null);const[v,s]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)s(true)},{threshold:t});if(r.current)o.observe(r.current);return()=>o.disconnect();},[t]);return[r,v];}

const SVCS=["Website Design","Logo & Branding","Photography & Content","Social Media Management","Growth & Reach","SEO & Blogs","Full Package"];
const BUDGETS=["Under ₹10,000","₹10,000 – ₹25,000","₹25,000 – ₹50,000","₹50,000+","Let's discuss"];
const TIMELINES=["ASAP","1–2 weeks","1 month","2–3 months","Flexible"];
const INFO=[
  {icon:"📧",label:"Email Us",val:"sahibmahajan961@gmail.com",sub:"We reply within 24 hours",href:"mailto:sahibmahajan961@gmail.com"},
  {icon:"📱",label:"WhatsApp",val:"+91 8698325157",sub:"Quick chats welcome!",href:"https://wa.me/918698325157"},
  {icon:"📍",label:"Location",val:"India — Remote Friendly",sub:"We work with clients everywhere",href:null},
];

const CSS=`
@media(max-width:900px){
  .ct-hero{padding:120px 20px 56px!important}
  .ct-main{padding:24px 20px 72px!important}
  .ct-layout{grid-template-columns:1fr!important;gap:28px!important}
  .ct-info{order:2!important}
  .ct-form{order:1!important;padding:28px 20px!important}
  .ct-row{grid-template-columns:1fr!important}
}`;

export default function ContactPage(){
  const[hRef,hIn]=useInView(0.1);
  const[fRef,fIn]=useInView(0.1);
  const[form,setForm]=useState({name:"",email:"",business:"",phone:"",service:"",budget:"",timeline:"",message:""});
  const[status,setStatus]=useState("idle");

  const handleSubmit=async(e)=>{
    e.preventDefault();setStatus("sending");
    try{
      const res=await fetch("https://formspree.io/f/xgolzakr",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify(form)});
      setStatus(res.ok?"success":"error");
    }catch{setStatus("error");}
  };

  const labelStyle={fontSize:".68rem",fontWeight:800,color:"var(--light)",letterSpacing:"2px",textTransform:"uppercase",marginBottom:7,display:"block"};
  const selStyle={padding:"13px 16px",background:"var(--bg)",border:"1.5px solid var(--border)",borderRadius:10,fontFamily:"'Outfit',sans-serif",fontSize:".9rem",color:"var(--ink)",width:"100%",outline:"none",cursor:"pointer",transition:"all .2s ease"};

  return(
    <div style={{background:"var(--bg)",color:"var(--ink)",overflowX:"hidden"}}>
      <style>{CSS}</style>
      <Navbar/>

      {/* HERO */}
      <section ref={hRef} className="ct-hero" style={{padding:"160px 32px 80px",textAlign:"center",position:"relative",overflow:"hidden"}}>
        <div className="dots" style={{position:"absolute",inset:0,opacity:.5,pointerEvents:"none"}}/>
        <div style={{position:"absolute",width:600,height:400,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(0,105,165,.1) 0%,transparent 70%)",top:"-60px",left:"50%",transform:"translateX(-50%)",pointerEvents:"none"}}/>
        <div style={{maxWidth:700,margin:"0 auto",position:"relative"}}>
          <div className="stag" style={{justifyContent:"center",opacity:hIn?1:0,transition:"opacity .6s ease"}}>Let's Talk</div>
          <h1 className="fd" style={{fontSize:"clamp(3rem,7vw,5.5rem)",fontWeight:900,marginBottom:24,opacity:hIn?1:0,transform:hIn?"none":"translateY(40px)",transition:"all .9s ease .1s"}}>
            Start Your<br/><span className="grad-text" style={{fontStyle:"italic"}}>Growth Story.</span>
          </h1>
          <p style={{fontSize:"1.05rem",color:"var(--mid)",lineHeight:1.8,opacity:hIn?1:0,transform:hIn?"none":"translateY(28px)",transition:"all .9s ease .25s"}}>
            Fill in the form below and we'll get back to you within 24 hours with a custom plan.
          </p>
        </div>
      </section>

      {/* MAIN */}
      <section className="ct-main" style={{padding:"0 32px 96px"}}>
        <div className="ct-layout" style={{maxWidth:1180,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 2fr",gap:40,alignItems:"start"}}>

          {/* LEFT: Info */}
          <div className="ct-info" style={{opacity:fIn?1:0,transform:fIn?"none":"translateX(-28px)",transition:"all .8s ease"}}>
            {INFO.map((item,i)=>(
              <div key={i} className="card" style={{padding:"22px 20px",marginBottom:14}}>
                <div style={{fontSize:"1.4rem",marginBottom:10}}>{item.icon}</div>
                <div style={{fontWeight:700,color:"var(--ink)",fontSize:".92rem",marginBottom:4}}>{item.label}</div>
                {item.href
                  ? <a href={item.href} style={{color:"var(--blue)",fontWeight:600,fontSize:".88rem",marginBottom:4,display:"block",wordBreak:"break-all",textDecoration:"none"}}>{item.val}</a>
                  : <div style={{color:"var(--blue)",fontWeight:600,fontSize:".88rem",marginBottom:4}}>{item.val}</div>
                }
                <div style={{color:"var(--light)",fontSize:".75rem"}}>{item.sub}</div>
              </div>
            ))}
            <div style={{padding:"22px",background:"linear-gradient(135deg,var(--blue-lt),var(--teal-lt))",border:"1.5px solid var(--blue-md)",borderRadius:18,textAlign:"center"}}>
              <div style={{fontSize:"1.6rem",marginBottom:8}}>⚡</div>
              <div style={{fontWeight:700,color:"var(--ink)",fontSize:"1rem",marginBottom:4}}>24hr Response</div>
              <div style={{color:"var(--mid)",fontSize:".8rem"}}>We take every inquiry seriously</div>
            </div>
          </div>

          {/* RIGHT: Form */}
          <div ref={fRef} className="ct-form card" style={{padding:"44px",opacity:fIn?1:0,transform:fIn?"none":"translateY(28px)",transition:"all .8s ease .1s",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,var(--blue),var(--teal))",borderRadius:"18px 18px 0 0"}}/>

            {status==="success"?(
              <div style={{textAlign:"center",padding:"48px 0"}}>
                <div style={{fontSize:"3.5rem",marginBottom:16}}>🎉</div>
                <h3 className="fd" style={{fontSize:"1.6rem",fontWeight:900,marginBottom:12}}>Message Sent!</h3>
                <p style={{color:"var(--mid)",lineHeight:1.7}}>We'll review your project and get back to you within 24 hours. Can't wait to work together!</p>
              </div>
            ):(
              <form onSubmit={handleSubmit}>
                <h3 className="fd" style={{fontSize:"1.4rem",fontWeight:900,color:"var(--ink)",marginBottom:8}}>Tell Us About Your Project</h3>
                <p style={{color:"var(--light)",fontSize:".85rem",marginBottom:28}}>The more detail you share, the better we can help.</p>

                <div className="ct-row" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                  {[{k:"name",l:"Your Name",p:"Rahul Sharma",t:"text",req:true},{k:"email",l:"Email",p:"rahul@business.com",t:"email",req:true}].map(f=>(
                    <div key={f.k}><label style={labelStyle}>{f.l}</label><input className="inp" type={f.t} placeholder={f.p} required={f.req} value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})}/></div>
                  ))}
                </div>
                <div className="ct-row" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                  {[{k:"business",l:"Business Name",p:"Your Company",t:"text"},{k:"phone",l:"Phone / WhatsApp",p:"+91 98765 43210",t:"tel"}].map(f=>(
                    <div key={f.k}><label style={labelStyle}>{f.l}</label><input className="inp" type={f.t} placeholder={f.p} value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})}/></div>
                  ))}
                </div>

                <div style={{marginBottom:14}}>
                  <label style={labelStyle}>Service Needed</label>
                  <select style={selStyle} value={form.service} onChange={e=>setForm({...form,service:e.target.value})}>
                    <option value="">— What do you need? —</option>
                    {SVCS.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="ct-row" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>
                  <div>
                    <label style={labelStyle}>Budget Range</label>
                    <select style={selStyle} value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})}>
                      <option value="">Select budget</option>
                      {BUDGETS.map(b=><option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Timeline</label>
                    <select style={selStyle} value={form.timeline} onChange={e=>setForm({...form,timeline:e.target.value})}>
                      <option value="">Select timeline</option>
                      {TIMELINES.map(t=><option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{marginBottom:24}}>
                  <label style={labelStyle}>Tell Us More</label>
                  <textarea className="inp" placeholder="Tell us about your business, goals, and any ideas you have..." rows={4} style={{resize:"vertical"}} value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/>
                </div>

                <button type="submit" disabled={status==="sending"} className="btn-blue" style={{width:"100%",padding:"15px",justifyContent:"center",fontSize:"1rem",opacity:status==="sending"?.7:1,borderRadius:14}}>
                  {status==="sending"?"Sending... ⏳":"Send Message — Let's Grow! 🚀"}
                </button>
                {status==="error"&&<p style={{textAlign:"center",color:"#dc2626",fontSize:".85rem",marginTop:12}}>Something went wrong. Please try again or WhatsApp us directly.</p>}
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}
