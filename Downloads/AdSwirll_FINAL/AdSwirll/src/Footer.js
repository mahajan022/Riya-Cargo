import { Link } from "react-router-dom";
const LOGO = "logo.jpeg";

const NAV = [
  {to:"/",label:"Home"},{to:"/services",label:"Services"},
  {to:"/about",label:"About"},{to:"/portfolio",label:"Work"},{to:"/contact",label:"Contact"},
];
const SVCS = ["Website Design","Logo & Branding","Social Media","SEO & Blogs","Photography","Growth Strategy"];

export default function Footer() {
  return (
    <footer style={{background:"var(--ink)",color:"#fff"}}>
      <style>{`
        @media(max-width:768px){
          .fg{grid-template-columns:1fr 1fr!important;gap:40px!important}
          .fg-brand{grid-column:1/-1!important}
          .fb{flex-direction:column!important;gap:10px!important;text-align:center!important}
          .fstrip{flex-direction:column!important;gap:24px!important;padding:44px 20px!important}
          .fstrip h2{font-size:1.6rem!important}
          .fstrip-btns{flex-wrap:wrap!important}
        }
        @media(max-width:480px){.fg{grid-template-columns:1fr!important}}
      `}</style>

      {/* CTA Strip */}
      <div className="fstrip" style={{
        background:"var(--ink2)",borderBottom:"1px solid rgba(255,255,255,.08)",
        padding:"56px 32px",display:"flex",alignItems:"center",
        justifyContent:"space-between",flexWrap:"wrap",gap:24,
      }}>
        <div>
          <p style={{fontSize:".7rem",fontWeight:800,letterSpacing:"3px",textTransform:"uppercase",color:"var(--teal)",marginBottom:10}}>Ready to grow?</p>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:"clamp(1.6rem,3.5vw,2.4rem)",letterSpacing:"-1px",color:"#fff",lineHeight:1.1}}>
            Let's build something<br/><em style={{fontStyle:"italic",color:"var(--blue)"}}>extraordinary.</em>
          </h2>
        </div>
        <div className="fstrip-btns" style={{display:"flex",gap:12}}>
          <Link to="/contact" className="btn-blue">Get Free Quote →</Link>
          <a href="https://wa.me/918698325157" target="_blank" rel="noreferrer" className="btn-ghost-white">WhatsApp Us</a>
        </div>
      </div>

      {/* Main grid */}
      <div style={{maxWidth:1180,margin:"0 auto",padding:"64px 32px 0"}}>
        <div className="fg" style={{
          display:"grid",gridTemplateColumns:"1.6fr 1fr 1fr 1fr",
          gap:56,paddingBottom:56,borderBottom:"1px solid rgba(255,255,255,.08)",
        }}>

          {/* Brand */}
          <div className="fg-brand">
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <div style={{width:38,height:38,borderRadius:10,overflow:"hidden",border:"2px solid rgba(255,255,255,.15)",flexShrink:0}}>
                <img src={LOGO} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="AdSwirll"/>
              </div>
              <span style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:"1.2rem",color:"#fff",letterSpacing:"-.4px"}}>
                Ads<span style={{color:"var(--teal)"}}>wirll</span>
              </span>
            </div>
            <p style={{color:"rgba(255,255,255,.4)",fontSize:".875rem",lineHeight:1.78,maxWidth:240,marginBottom:24}}>
              Full-service digital growth partner for ambitious businesses across India.
            </p>
            <p style={{fontSize:".7rem",fontWeight:800,letterSpacing:"2px",textTransform:"uppercase",color:"rgba(255,255,255,.2)",marginBottom:14}}>Buzz · Swirl · Grow</p>
            {/* Social */}
            <div style={{display:"flex",gap:8}}>
              {[{l:"IG",h:"#"},{l:"WA",h:"https://wa.me/918698325157"},{l:"LI",h:"#"}].map(s=>(
                <a key={s.l} href={s.h} target="_blank" rel="noreferrer"
                  style={{width:36,height:36,borderRadius:"50%",border:"1px solid rgba(255,255,255,.12)",background:"rgba(255,255,255,.04)",display:"flex",alignItems:"center",justifyContent:"center",color:"rgba(255,255,255,.5)",textDecoration:"none",fontSize:".68rem",fontWeight:800,transition:"all .2s"}}
                  onMouseEnter={e=>{e.currentTarget.style.background="var(--blue)";e.currentTarget.style.borderColor="var(--blue)";e.currentTarget.style.color="#fff"}}
                  onMouseLeave={e=>{e.currentTarget.style.background="rgba(255,255,255,.04)";e.currentTarget.style.borderColor="rgba(255,255,255,.12)";e.currentTarget.style.color="rgba(255,255,255,.5)"}}
                >{s.l}</a>
              ))}
            </div>
          </div>

          {/* Navigate */}
          <div>
            <p style={{fontSize:".68rem",fontWeight:800,letterSpacing:"3px",textTransform:"uppercase",color:"rgba(255,255,255,.25)",marginBottom:20}}>Navigate</p>
            <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:10}}>
              {NAV.map(({to,label})=>(
                <li key={to}><Link to={to} className="fl">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p style={{fontSize:".68rem",fontWeight:800,letterSpacing:"3px",textTransform:"uppercase",color:"rgba(255,255,255,.25)",marginBottom:20}}>Services</p>
            <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:10}}>
              {SVCS.map(s=>(
                <li key={s}><Link to="/services" className="fl" style={{fontSize:".85rem"}}>{s}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p style={{fontSize:".68rem",fontWeight:800,letterSpacing:"3px",textTransform:"uppercase",color:"rgba(255,255,255,.25)",marginBottom:20}}>Contact</p>
            <div style={{display:"flex",flexDirection:"column",gap:18}}>
              {[
                {l:"Email",v:"sahibmahajan961@gmail.com",h:"mailto:sahibmahajan961@gmail.com"},
                {l:"WhatsApp",v:"+91 86983 25157",h:"https://wa.me/918698325157"},
                {l:"Location",v:"India — Remote Friendly",h:null},
              ].map(item=>(
                <div key={item.l}>
                  <p style={{fontSize:".65rem",fontWeight:800,letterSpacing:"2px",textTransform:"uppercase",color:"rgba(255,255,255,.22)",marginBottom:4}}>{item.l}</p>
                  {item.h
                    ? <a href={item.h} style={{color:"rgba(255,255,255,.58)",fontSize:".85rem",textDecoration:"none",wordBreak:"break-all"}}>{item.v}</a>
                    : <span style={{color:"rgba(255,255,255,.58)",fontSize:".85rem"}}>{item.v}</span>
                  }
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="fb" style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"20px 0",fontSize:".78rem",color:"rgba(255,255,255,.22)"}}>
          <span>© 2026 AdSwirll. All rights reserved.</span>
          <span>Made with <span style={{color:"var(--blue)"}}>♥</span> for growing businesses in India</span>
        </div>
      </div>
    </footer>
  );
}
