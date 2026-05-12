import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import ServicesPage from "./ServicesPage";
import AboutPage from "./AboutPage";
import PortfolioPage from "./PortfolioPage";
import ContactPage from "./ContactPage";

/*
  DESIGN: Light Editorial Agency — colors matched to AdSwirll logo
  Primary  : #0069A5  (ocean blue  — dominant logo color)
  Secondary: #007896  (deep teal   — second logo color)
  Accent   : #005AB4  (deep blue   — logo dark variant)
  BG base  : #F7F9FC  (cool white)
  BG alt   : #EEF3F8  (blue-tinted light)
  Fonts    : Playfair Display (display serif) + Outfit (clean sans)
*/

const G = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700;1,900&family=Outfit:wght@300;400;500;600;700;800&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}

:root{
  --blue:    #0069A5;
  --blue-dk: #005280;
  --blue-lt: #E8F3FA;
  --blue-md: #C5DEED;
  --teal:    #007896;
  --teal-lt: #E6F4F7;
  --teal-dk: #005F78;
  --ink:     #0C1929;
  --ink2:    #1A2E42;
  --mid:     #4A6070;
  --light:   #8BA0B0;
  --bg:      #F7F9FC;
  --bg2:     #EEF3F8;
  --bg3:     #E4EDF5;
  --white:   #FFFFFF;
  --border:  #D8E4EE;
  --border2: #BDD0DF;
  --sh-sm:   0 2px 8px rgba(0,105,165,.08);
  --sh-md:   0 6px 24px rgba(0,105,165,.12);
  --sh-lg:   0 18px 56px rgba(0,105,165,.16);
  --sh-blue: 0 8px 28px rgba(0,105,165,.32);
  --r-sm: 10px; --r-md: 18px; --r-lg: 24px; --r-xl: 32px; --r-full: 999px;
}

body{
  font-family:'Outfit',sans-serif;
  background:var(--bg);
  color:var(--ink);
  -webkit-font-smoothing:antialiased;
  overflow-x:hidden;
}

::selection{background:rgba(0,105,165,.15)}
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-track{background:var(--bg2)}
::-webkit-scrollbar-thumb{background:var(--blue);border-radius:2px}

@keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes spinR{from{transform:rotate(360deg)}to{transform:none}}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes shimmer{0%{background-position:200% center}100%{background-position:-200% center}}

/* Typography */
.fd{font-family:'Playfair Display',serif;font-weight:900;line-height:1.0;letter-spacing:-1.5px;color:var(--ink)}
.fs{font-family:'Outfit',sans-serif}

/* Nav links */
.nl{position:relative;text-decoration:none;color:var(--mid);font-size:.875rem;font-weight:600;transition:color .2s}
.nl::after{content:'';position:absolute;bottom:-3px;left:0;width:0;height:2px;background:var(--blue);border-radius:2px;transition:width .28s ease}
.nl:hover,.nl.act{color:var(--ink)}
.nl:hover::after,.nl.act::after{width:100%}

/* Buttons */
.btn-blue{
  display:inline-flex;align-items:center;gap:8px;
  background:var(--blue);color:#fff;
  padding:13px 28px;border-radius:var(--r-full);
  font-family:'Outfit',sans-serif;font-weight:700;font-size:.9rem;
  text-decoration:none;border:none;cursor:pointer;
  transition:all .22s ease;box-shadow:var(--sh-blue);white-space:nowrap
}
.btn-blue:hover{background:var(--blue-dk);transform:translateY(-2px);box-shadow:0 12px 36px rgba(0,105,165,.42)}

.btn-teal{
  display:inline-flex;align-items:center;gap:8px;
  background:var(--teal);color:#fff;
  padding:13px 28px;border-radius:var(--r-full);
  font-family:'Outfit',sans-serif;font-weight:700;font-size:.9rem;
  text-decoration:none;border:none;cursor:pointer;
  transition:all .22s ease;white-space:nowrap
}
.btn-teal:hover{background:var(--teal-dk);transform:translateY(-2px);box-shadow:0 12px 36px rgba(0,120,150,.35)}

.btn-outline{
  display:inline-flex;align-items:center;gap:8px;
  background:transparent;color:var(--ink);
  padding:12px 26px;border-radius:var(--r-full);
  font-family:'Outfit',sans-serif;font-weight:700;font-size:.9rem;
  text-decoration:none;border:1.5px solid var(--border2);cursor:pointer;
  transition:all .22s ease;white-space:nowrap
}
.btn-outline:hover{background:var(--ink);color:#fff;border-color:var(--ink);transform:translateY(-2px)}

.btn-ghost-white{
  display:inline-flex;align-items:center;gap:8px;
  background:transparent;color:rgba(255,255,255,.8);
  padding:12px 26px;border-radius:var(--r-full);
  font-family:'Outfit',sans-serif;font-weight:700;font-size:.9rem;
  text-decoration:none;border:1.5px solid rgba(255,255,255,.25);cursor:pointer;
  transition:all .22s ease;white-space:nowrap
}
.btn-ghost-white:hover{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.5);color:#fff}

.btn-text{
  display:inline-flex;align-items:center;gap:6px;
  color:var(--blue);font-weight:700;font-size:.875rem;
  text-decoration:none;background:none;border:none;cursor:pointer;
  transition:gap .2s ease;padding:0
}
.btn-text:hover{gap:10px}

/* Cards */
.card{background:var(--white);border:1px solid var(--border);border-radius:var(--r-lg);transition:all .3s ease}
.card:hover{border-color:var(--blue-md);box-shadow:var(--sh-md);transform:translateY(-4px)}

/* Section tag */
.stag{
  display:inline-flex;align-items:center;gap:8px;
  font-size:.68rem;font-weight:800;letter-spacing:3px;text-transform:uppercase;
  color:var(--blue);margin-bottom:14px
}
.stag::before{content:'';display:block;width:16px;height:2px;background:var(--blue);border-radius:2px;flex-shrink:0}

/* Input */
.inp{
  padding:13px 16px;background:var(--bg);
  border:1.5px solid var(--border);border-radius:var(--r-sm);
  font-family:'Outfit',sans-serif;font-size:.9rem;color:var(--ink);
  width:100%;outline:none;transition:all .2s ease
}
.inp:focus{border-color:var(--blue);background:#fff;box-shadow:0 0 0 3px rgba(0,105,165,.1)}
.inp::placeholder{color:var(--light)}

/* Footer link */
.fl{color:rgba(255,255,255,.45);text-decoration:none;font-size:.875rem;font-weight:500;transition:color .2s}
.fl:hover{color:var(--teal)}

/* Dot texture */
.dots{
  background-image:radial-gradient(circle,rgba(0,105,165,.1) 1px,transparent 1px);
  background-size:26px 26px
}

/* Marquee */
.mq-inner{display:flex;width:max-content;animation:marquee 26s linear infinite}
.mq-inner:hover{animation-play-state:paused}

/* Gradient text */
.grad-text{
  background:linear-gradient(135deg,var(--blue),var(--teal));
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text
}
.grad-text-anim{
  background:linear-gradient(135deg,#0069A5 0%,#007896 50%,#0069A5 100%);
  background-size:200% auto;
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
  animation:shimmer 4s linear infinite
}

@media(max-width:768px){.hide-m{display:none!important}.show-m{display:flex!important}}
@media(min-width:769px){.show-m{display:none!important}}
`;

export default function App() {
  return (
    <>
      <style>{G}</style>
      <BrowserRouter>
        <Routes>
          <Route path="/"          element={<HomePage />} />
          <Route path="/services"  element={<ServicesPage />} />
          <Route path="/about"     element={<AboutPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/contact"   element={<ContactPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
