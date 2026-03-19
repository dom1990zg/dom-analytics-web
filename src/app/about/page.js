'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Lenis from 'lenis';

function useReveal(th = 0.15) { const ref = useRef(null); const [v, setV] = useState(false); useEffect(() => { const el = ref.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: th }); obs.observe(el); return () => obs.disconnect(); }, [th]); return [ref, v]; }
function SplitText({ children, className = '', center = false }) { const r = useRef(null); const [v, setV] = useState(false); useEffect(() => { const el = r.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.2 }); obs.observe(el); return () => obs.disconnect(); }, []); const w = String(children).split(' '); return (<span ref={r} className={`split-text ${center ? 'center' : ''} ${className}`}>{w.map((word, i) => (<span key={i} className={`split-word ${v ? 'visible' : ''}`} style={{ transitionDelay: `${i * 0.05}s` }}>{word}</span>))}</span>); }
function LineReveal({ children, delay = 0 }) { const r = useRef(null); const [v, setV] = useState(false); useEffect(() => { const el = r.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.3 }); obs.observe(el); return () => obs.disconnect(); }, []); return (<div className="line-mask" ref={r}><div className={`line-inner ${v ? 'visible' : ''}`} style={{ transitionDelay: `${delay}s` }}>{children}</div></div>); }
function StaggerChildren({ children, className = '' }) { const r = useRef(null); const [v, setV] = useState(false); useEffect(() => { const el = r.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.1 }); obs.observe(el); return () => obs.disconnect(); }, []); return (<div ref={r} className={className}>{Array.isArray(children) ? children.map((child, i) => (<div key={i} className={`stagger-item ${v ? 'visible' : ''}`} style={{ transitionDelay: `${i * 0.12}s` }}>{child}</div>)) : children}</div>); }
function MagneticButton({ children, className, href }) { const b = useRef(null); const [o, setO] = useState({ x: 0, y: 0 }); const hm = (e) => { const rect = b.current.getBoundingClientRect(); setO({ x: (e.clientX - rect.left - rect.width / 2) * 0.2, y: (e.clientY - rect.top - rect.height / 2) * 0.2 }); }; const style = { transform: `translate(${o.x}px, ${o.y}px)`, transition: 'transform 0.3s cubic-bezier(0.23,1,0.32,1)' }; if (href) return (<Link href={href} ref={b} className={className} onMouseMove={hm} onMouseLeave={() => setO({ x: 0, y: 0 })} style={style}>{children}</Link>); return (<button ref={b} className={className} onMouseMove={hm} onMouseLeave={() => setO({ x: 0, y: 0 })} style={style}>{children}</button>); }

function CustomCursor() {
  const cursorRef = useRef(null); const dotRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 }); const target = useRef({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  useEffect(() => {
    const move = (e) => { target.current = { x: e.clientX, y: e.clientY }; };
    const animate = () => { pos.current.x += (target.current.x - pos.current.x) * 0.15; pos.current.y += (target.current.y - pos.current.y) * 0.15; if (cursorRef.current) { cursorRef.current.style.left = `${pos.current.x}px`; cursorRef.current.style.top = `${pos.current.y}px`; } if (dotRef.current) { dotRef.current.style.left = `${target.current.x}px`; dotRef.current.style.top = `${target.current.y}px`; } requestAnimationFrame(animate); };
    window.addEventListener('mousemove', move); requestAnimationFrame(animate);
    const addHover = () => { document.querySelectorAll('a, button, .value-card').forEach(el => { el.addEventListener('mouseenter', () => setHovering(true)); el.addEventListener('mouseleave', () => setHovering(false)); }); };
    addHover(); const observer = new MutationObserver(addHover); observer.observe(document.body, { childList: true, subtree: true });
    return () => { window.removeEventListener('mousemove', move); observer.disconnect(); };
  }, []);
  return (<><div ref={cursorRef} className={`custom-cursor ${hovering ? 'hovering' : ''}`} /><div ref={dotRef} className={`custom-cursor-dot ${hovering ? 'hovering' : ''}`} /></>);
}

function AnimatedCounter({ value, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0); const [started, setStarted] = useState(false); const ref = useRef(null);
  useEffect(() => { const el = ref.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.5 }); obs.observe(el); return () => obs.disconnect(); }, []);
  useEffect(() => { if (!started) return; const target = parseInt(value); if (isNaN(target)) { setCount(value); return; } const startTime = Date.now(); const timer = setInterval(() => { const elapsed = Date.now() - startTime; const progress = Math.min(elapsed / duration, 1); const eased = 1 - Math.pow(1 - progress, 3); setCount(Math.floor(eased * target)); if (progress >= 1) clearInterval(timer); }, 16); return () => clearInterval(timer); }, [started, value, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

const content = {
  en: {
    nav: { services: 'Services', tech: 'Technologies', about: 'About', projects: 'Projects', contact: 'Contact' },
    hero: { label: 'ABOUT US', title: 'We turn data into the engine behind business growth', sub: 'Dom Analytics is a data-first consulting firm. We clean, govern, analyze and monetize data for organizations that want to stop guessing and start winning.' },
    mission: { label: 'OUR MISSION', title: 'Data enablement is not a project. It is a competitive advantage.', text: 'Most businesses are sitting on enormous amounts of data they cannot fully use. It is siloed, inconsistent, ungoverned and untapped. Our mission is to change that. We go into the data layer, <em>clean what needs cleaning</em>, structure what is broken, build the pipelines that make data flow, and then turn that foundation into <em>dashboards, AI models and revenue strategies</em> that actually move the needle. We do not just consult. We enable.' },
    values: { label: 'HOW WE WORK', title: 'The Dom Analytics approach', items: [
      { icon: '\ud83d\udd0d', title: 'Audit First', desc: 'Before touching anything, we map the full data landscape. We identify what exists, what is broken, where the gaps are and what the quick wins look like.' },
      { icon: '\ud83e\uddf9', title: 'Clean and Govern', desc: 'We build the pipelines that clean, deduplicate and standardize your data. Without a clean foundation, analytics and AI produce noise, not signal.' },
      { icon: '\ud83d\udcca', title: 'Build the BI Layer', desc: 'Once the data is solid, we build the reporting layer. Executive dashboards, KPI frameworks, real-time monitoring. Information your leadership team can actually trust and use.' },
      { icon: '\ud83e\udd16', title: 'Layer AI on Top', desc: 'With clean, governed data in place, AI and machine learning deliver real results. Predictive models, LLM integrations and intelligent automation that are built to last.' },
      { icon: '\ud83d\udcb0', title: 'Monetize the Asset', desc: 'Data is a business asset. We identify untapped revenue streams, build pricing models and design monetization strategies that turn your data into measurable ROI.' },
      { icon: '\ud83c\udf0d', title: 'Global Delivery', desc: 'We have delivered data programs across 40 countries, in telecom, enterprise and technology sectors. We know how to operate in complex, multi-market environments.' },
    ]},
    numbers: { label: 'PROVEN RESULTS', title: 'What the data says about us', items: [
      { value: '15', suffix: '+', label: 'Years of hands-on data and analytics experience' },
      { value: '1500', suffix: '%', label: 'Peak revenue growth delivered on a single data project' },
      { value: '40', suffix: '+', label: 'Countries where we have delivered data programs' },
      { value: '300', suffix: '%', label: 'Average revenue growth across monetization engagements' },
    ]},
    story: { label: 'OUR STORY', title: 'Built from the data layer up', col1: '<p>Dom Analytics was founded in 2023 by people who had spent over a decade inside the data. Not consulting from the outside, but <em>doing the actual work</em>: building BI departments, running data audits, designing monetization strategies and sitting in the room when the numbers changed the direction of the business.</p><p>Our background is in telecommunications, one of the most data-intensive industries in the world. We learned how to work with <em>massive, complex, real-time datasets</em> and turn them into strategies that generated hundreds of percent in revenue growth for the networks we worked with.</p>', col2: '<p>The methodology we developed in telecom translates directly to any data-rich business. The principles are the same: <em>clean the foundation, govern the flow, build the intelligence layer, then monetize the asset</em>. That is the Dom Analytics approach and it works across industries.</p><p>Today we bring that same rigor to companies across sectors, helping them stop sitting on untapped data and start building the infrastructure that makes every decision smarter, every strategy sharper and every revenue stream more visible.</p>' },
    cta: { title: 'Ready to unlock your data?', sub: 'Tell us where your data is today and we will show you where it can take you.', btn: 'Start the conversation' },
  },
  hr: {
    nav: { services: 'Usluge', tech: 'Tehnologije', about: 'O nama', projects: 'Projekti', contact: 'Kontakt' },
    hero: { label: 'O NAMA', title: 'Pretvaramo podatke u pokreta\u010d poslovnog rasta', sub: 'Dom Analytics je data-first konzultantska tvrtka. \u010cistimo, upravljamo, analiziramo i monetiziramo podatke za organizacije koje \u017eele prestati pogadati i po\u010deti pobje\u0111ivati.' },
    mission: { label: 'NA\u0160A MISIJA', title: 'Data enablement nije projekt. To je konkurentska prednost.', text: 'Ve\u0107ina tvrtki sjedi na ogromnim koli\u010dinama podataka koje ne mo\u017ee u potpunosti koristiti. Silosi su, nekonzistentni, neupravljani i neizkori\u0161teni. Na\u0161a misija je to promijeniti. Ulazimo u podatkovni sloj, <em>\u010distimo ono \u0161to treba \u010distiti</em>, strukturiramo ono \u0161to je slomljeno, gradimo pipeline-ove koji omogu\u0107uju tok podataka, a zatim taj temelj pretvaramo u <em>dashboarde, AI modele i strategije prihoda</em> koje stvarno pomi\u010du iglu.' },
    values: { label: 'KAKO RADIMO', title: 'Dom Analytics pristup', items: [
      { icon: '\ud83d\udd0d', title: 'Audit na prvom mjestu', desc: 'Prije nego \u0161to di\u010dnemo i\u0161ta, mapiramo cijeli podatkovni krajolik. Identificiramo \u0161to postoji, \u0161to je slomljeno, gdje su praznine i kako izgledaju brze pobjede.' },
      { icon: '\ud83e\uddf9', title: '\u010ci\u0161\u0107enje i upravljanje', desc: 'Gradimo pipeline-ove koji \u010diste, deduplificiraju i standardiziraju va\u0161e podatke. Bez \u010distog temelja, analitika i AI proizvode \u0161um, a ne signal.' },
      { icon: '\ud83d\udcca', title: 'Izgradnja BI sloja', desc: 'Kad su podaci solidni, gradimo reporting sloj. Dashboardi za upravu, KPI okviri, praćenje u realnom vremenu. Informacije kojima va\u0161e vodstvo zaista vjeruje i koristi.' },
      { icon: '\ud83e\udd16', title: 'AI na vrhu', desc: 'S urednim, upravljanim podacima, AI i strojno u\u010denje daju stvarne rezultate. Prediktivni modeli, LLM integracije i inteligentna automatizacija izgradui\u0301jeni da traju.' },
      { icon: '\ud83d\udcb0', title: 'Monetizacija resursa', desc: 'Podaci su poslovni resurs. Identificiramo neizkori\u0161tene tokove prihoda, gradimo modele cijena i dizajniramo strategije monetizacije koje pretvaraju va\u0161e podatke u mjerljivi ROI.' },
      { icon: '\ud83c\udf0d', title: 'Globalna isporuka', desc: 'Isporu\u010dili smo data programe u 40 zemalja, u telekomunikacijskom, enterprise i tehnolo\u0161kom sektoru. Znamo raditi u slo\u017eenim vi\u0161etri\u017ei\u0161nim okru\u017eenjima.' },
    ]},
    numbers: { label: 'DOKAZANI REZULTATI', title: '\u0160to podaci govore o nama', items: [
      { value: '15', suffix: '+', label: 'Godina prakti\u010dnog iskustva u podacima i analitici' },
      { value: '1500', suffix: '%', label: 'Vrhunski rast prihoda isporu\u010den na jednom data projektu' },
      { value: '40', suffix: '+', label: 'Zemalja gdje smo isporu\u010dili data programe' },
      { value: '300', suffix: '%', label: 'Prosje\u010dan rast prihoda kroz monetizacijske projekte' },
    ]},
    story: { label: 'NA\u0160A PRI\u010cA', title: 'Izgra\u0111eni od podatkovnog sloja prema gore', col1: '<p>Dom Analytics je osnovan 2023. od strane ljudi koji su proveli vi\u0161e od desetlje\u0107a unutar podataka. Ne konzultiraju\u0107i izvana, ve\u0107 <em>radi\u010400610i stvarni posao</em>: gradili smo BI odjele, provodili data audite, dizajnirali strategije monetizacije i sjedili u sobi kada su brojevi promijenili smjer poslovanja.</p><p>Na\u0161a pozadina je u telekomunikacijama, jednoj od najintenzivnijih industrija po koli\u010dini podataka na svijetu. Nau\u010dili smo raditi s <em>masivnim, slo\u017eenim skupovima podataka u realnom vremenu</em> i pretvarati ih u strategije koje su generirao stotine posto rasta prihoda.</p>', col2: '<p>Metodologija koju smo razvili u telekomu izravno se primjenjuje na svaki posao bogat podacima. Principi su isti: <em>o\u010distiti temelj, upravljati tokom, izgraditi sloj inteligencije, zatim monetizirati resurs</em>. To je Dom Analytics pristup i funkcionira u svim industrijama.</p><p>Danas donosimo isti rigor tvrtkama iz razli\u010ditih sektora, pomazu\u0107i im da prestanu sjediti na neizkori\u0161tenim podacima i po\u010dnu graditi infrastrukturu koja svaku odluku \u010dini pametnijom i svaki tok prihoda vidljivijim.</p>' },
    cta: { title: 'Spremni otklju\u010dati va\u0161e podatke?', sub: 'Recite nam gdje su va\u0161i podaci danas i pokazat \u0107emo vam kamo vas mogu odvesti.', btn: 'Pokrenite razgovor' },
  },
};

export default function About() {
  const [lang, setLang] = useState('en'); const [menuOpen, setMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -500, y: -500 });
  const lenisRef = useRef(null); const t = content[lang];
  const [missionRef, missionVis] = useReveal(); const [storyRef, storyVis] = useReveal();

  useEffect(() => { const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true }); lenisRef.current = lenis; function raf(time) { lenis.raf(time); requestAnimationFrame(raf); } requestAnimationFrame(raf); return () => lenis.destroy(); }, []);
  useEffect(() => { const h = (e) => setCursorPos({ x: e.clientX, y: e.clientY }); window.addEventListener('mousemove', h); return () => window.removeEventListener('mousemove', h); }, []);

  return (
    <>
      <div className="noise" /><CustomCursor />
      <div className="cursor-glow" style={{ left: cursorPos.x, top: cursorPos.y }} />

      <nav className="nav">
        <Link href="/" className="nav-logo"><span className="nav-logo-text">Dom<span>Analytics</span></span></Link>
        <div className="nav-links">
          <Link href="/#services">{t.nav.services}</Link>
          <Link href="/#tech">{t.nav.tech}</Link>
          <Link href="/about" className="active">{t.nav.about}</Link>
          <Link href="/projects">{t.nav.projects}</Link>
          <Link href="/#contact">{t.nav.contact}</Link>
          <button className="lang-toggle" onClick={() => setLang((l) => (l === 'en' ? 'hr' : 'en'))}>{lang === 'en' ? 'HR' : 'EN'}</button>
        </div>
        <button className="menu-btn" onClick={() => setMenuOpen((o) => !o)}><span /><span /><span /></button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link href="/about" onClick={() => setMenuOpen(false)}>{t.nav.about}</Link>
        <Link href="/projects" onClick={() => setMenuOpen(false)}>{t.nav.projects}</Link>
        <Link href="/#contact" onClick={() => setMenuOpen(false)}>{t.nav.contact}</Link>
        <button className="lang-toggle" onClick={() => { setLang((l) => (l === 'en' ? 'hr' : 'en')); setMenuOpen(false); }}>{lang === 'en' ? 'HR' : 'EN'}</button>
        <a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); }} style={{ fontSize: 16, color: 'var(--text-dim)', marginTop: 20 }}>{'\u2715'} Close</a>
      </div>

      <section className="page-hero">
        <div className="page-hero-mesh"><div className="page-hero-orb" /><div className="page-hero-orb" /></div>
        <div className="page-hero-content">
          <LineReveal><p className="page-hero-label">{t.hero.label}</p></LineReveal>
          <h1 className="page-hero-title"><SplitText>{t.hero.title}</SplitText></h1>
          <LineReveal delay={0.3}><p className="page-hero-sub">{t.hero.sub}</p></LineReveal>
        </div>
      </section>

      <section className="about-mission" ref={missionRef}>
        <div className="about-mission-inner">
          <div><LineReveal><p className="section-label">{t.mission.label}</p></LineReveal><h2 className="section-title"><SplitText>{t.mission.title}</SplitText></h2></div>
          <div className={`reveal ${missionVis ? 'visible' : ''}`}><p className="about-mission-text" dangerouslySetInnerHTML={{ __html: t.mission.text }} /></div>
        </div>
      </section>

      <section className="about-values">
        <LineReveal><p className="section-label">{t.values.label}</p></LineReveal>
        <h2 className="section-title"><SplitText>{t.values.title}</SplitText></h2>
        <StaggerChildren className="values-grid">
          {t.values.items.map((v, i) => (<div key={i} className="value-card"><span className="value-icon">{v.icon}</span><h3 className="value-title">{v.title}</h3><p className="value-desc">{v.desc}</p></div>))}
        </StaggerChildren>
      </section>

      <section className="about-numbers">
        <div className="about-numbers-inner">
          <LineReveal><p className="section-label">{t.numbers.label}</p></LineReveal>
          <h2 className="section-title"><SplitText>{t.numbers.title}</SplitText></h2>
          <div className="numbers-grid" style={{ marginTop: 56 }}>
            {t.numbers.items.map((n, i) => (<div key={i} className="number-item"><div className="number-value"><AnimatedCounter value={n.value} suffix={n.suffix} duration={2000 + i * 300} /></div><div className="number-label">{n.label}</div></div>))}
          </div>
        </div>
      </section>

      <section className="about-story" ref={storyRef}>
        <LineReveal><p className="section-label">{t.story.label}</p></LineReveal>
        <h2 className="section-title"><SplitText>{t.story.title}</SplitText></h2>
        <div className={`about-story-content reveal ${storyVis ? 'visible' : ''}`}>
          <div className="about-story-col" dangerouslySetInnerHTML={{ __html: t.story.col1 }} />
          <div className="about-story-col" dangerouslySetInnerHTML={{ __html: t.story.col2 }} />
        </div>
      </section>

      <section className="about-cta">
        <div className="page-hero-mesh"><div className="page-hero-orb" /><div className="page-hero-orb" /></div>
        <div className="about-cta-inner">
          <h2 className="about-cta-title"><SplitText center>{t.cta.title}</SplitText></h2>
          <LineReveal delay={0.2}><p className="about-cta-sub">{t.cta.sub}</p></LineReveal>
          <MagneticButton href="/#contact" className="cta-btn">{t.cta.btn}</MagneticButton>
        </div>
      </section>

      <footer className="big-footer">
        <div className="big-footer-mesh"><div className="big-footer-orb" /><div className="big-footer-orb" /></div>
        <div className="big-footer-inner">
          <div className="big-footer-top">
            <div className="big-footer-brand"><div className="big-footer-logo">Dom<span>Analytics</span></div><p className="big-footer-desc">AI-powered consulting, data analytics, and custom software development.</p><div className="big-footer-social"><a href="https://linkedin.com/in/domagojkrusic" target="_blank" rel="noopener noreferrer">in</a><a href="mailto:info@domanalytics.com">@</a></div></div>
            <div className="big-footer-col"><h4>Navigation</h4><Link href="/">Home</Link><Link href="/about">About</Link><Link href="/projects">Projects</Link></div>
            <div className="big-footer-col"><h4>Connect</h4><a href="mailto:info@domanalytics.com">Email</a><a href="https://linkedin.com/in/domagojkrusic" target="_blank" rel="noopener noreferrer">LinkedIn</a></div>
            <div className="big-footer-col"><h4>Location</h4><a href="#">Pore&#269;, Croatia</a><a href="#">Zagreb, Croatia</a><a href="#">Global Remote</a></div>
          </div>
          <div className="big-footer-bottom"><span>&copy; 2026 Dom Analytics</span><div><a href="#">Privacy</a><a href="#">Terms</a></div></div>
        </div>
      </footer>
    </>
  );
}