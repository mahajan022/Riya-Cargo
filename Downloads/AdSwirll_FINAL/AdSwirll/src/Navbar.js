import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
const LOGO = "logo.jpeg";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => setOpen(false), [loc]);

  const links = [
    { to: "/",          label: "Home" },
    { to: "/services",  label: "Services" },
    { to: "/about",     label: "About" },
    { to: "/portfolio", label: "Work" },
    { to: "/contact",   label: "Contact" },
  ];

  return (
    <>
      <style>{`
        @media(max-width:768px){.nd-l,.nd-c{display:none!important}.nd-h{display:flex!important}}
        @media(min-width:769px){.nd-h{display:none!important}.nd-mob{display:none!important}}
        .hb{display:block;width:21px;height:1.5px;background:var(--ink);border-radius:2px;transition:all .26s ease}
      `}</style>

      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:1000,
        padding: scrolled ? "13px 0" : "20px 0",
        background: scrolled||open ? "rgba(247,249,252,.97)" : "rgba(247,249,252,.85)",
        backdropFilter:"blur(20px)",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        transition:"all .3s ease",
      }}>
        <div style={{maxWidth:1180,margin:"0 auto",padding:"0 32px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>

          {/* Logo */}
          <Link to="/" style={{textDecoration:"none",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <div style={{width:36,height:36,borderRadius:9,overflow:"hidden",border:"2px solid var(--border)",flexShrink:0}}>
              <img src={LOGO} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="AdSwirll"/>
            </div>
            <span style={{fontFamily:"'Playfair Display',serif",fontWeight:900,fontSize:"1.18rem",color:"var(--ink)",letterSpacing:"-.5px"}}>
              Ads<span style={{color:"var(--blue)"}}>wirll</span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="nd-l" style={{display:"flex",gap:36,listStyle:"none"}}>
            {links.map(({to,label})=>(
              <li key={to}>
                <Link to={to} className={`nl${loc.pathname===to?" act":""}`}>{label}</Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <Link to="/contact" className="btn-blue nd-c" style={{padding:"10px 22px",fontSize:".83rem"}}>
            Let's Talk →
          </Link>

          {/* Hamburger */}
          <button className="nd-h" onClick={()=>setOpen(o=>!o)}
            style={{background:"transparent",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",gap:5,padding:6,alignItems:"center"}}
            aria-label="Menu">
            <span className="hb" style={{transform:open?"rotate(45deg) translate(4.5px,4.5px)":"none"}}/>
            <span className="hb" style={{opacity:open?0:1}}/>
            <span className="hb" style={{transform:open?"rotate(-45deg) translate(4.5px,-4.5px)":"none"}}/>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className="nd-mob" style={{
        position:"fixed",top:open?58:"-110%",left:0,right:0,zIndex:999,
        background:"rgba(247,249,252,.98)",backdropFilter:"blur(20px)",
        borderBottom:"1px solid var(--border)",
        padding:open?"16px 28px 24px":"0 28px",
        transition:"top .3s ease",display:"flex",flexDirection:"column",gap:2,
      }}>
        {links.map(({to,label})=>(
          <Link key={to} to={to} style={{
            textDecoration:"none",
            color:loc.pathname===to?"var(--blue)":"var(--mid)",
            fontWeight:600,fontSize:"1rem",
            padding:"13px 0",borderBottom:"1px solid var(--border)",
            transition:"color .2s",
          }}>{label}</Link>
        ))}
        <Link to="/contact" className="btn-blue" style={{marginTop:12,justifyContent:"center"}}>Let's Talk →</Link>
      </div>
    </>
  );
}
