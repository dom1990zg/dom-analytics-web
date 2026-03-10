'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Lenis from 'lenis';

function useReveal(th = 0.15) { const ref = useRef(null); const [v, setV] = useState(false); useEffect(() => { const el = ref.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: th }); obs.observe(el); return () => obs.disconnect(); }, [th]); return [ref, v]; }
function SplitText({ children, className = '', center = false }) { const r = useRef(null); const [v, setV] = useState(false); useEffect(() => { const el = r.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.2 }); obs.observe(el); return () => obs.disconnect(); }, []); const w = String(children).split(' '); return (<span ref={r} className={`split-text ${center ? 'center' : ''} ${className}`}>{w.map((word, i) => (<span key={i} className={`split-word ${v ? 'visible' : ''}`} style={{ transitionDelay: `${i * 0.05}s` }}>{word}</span>))}</span>); }
function LineReveal({ children, delay = 0 }) { const r = useRef(null); const [v, setV] = useState(false); useEffect(() => { const el = r.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.3 }); obs.observe(el); return () => obs.disconnect(); }, []); return (<div className="line-mask" ref={r}><div className={`line-inner ${v ? 'visible' : ''}`} style={{ transitionDelay: `${delay}s` }}>{children}</div></div>); }
function StaggerChildren({ children, className = '' }) { const r = useRef(null); const [v, setV] = useState(false); useEffect(() => { const el = r.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.1 }); obs.observe(el); return () => obs.disconnect(); }, []); return (<div ref={r} className={className}>{Array.isArray(children) ? children.map((child, i) => (<div key={i} className={`stagger-item ${v ? 'visible' : ''}`} style={{ transitionDelay: `${i * 0.15}s` }}>{child}</div>)) : children}</div>); }

function CustomCursor() {
  const cursorRef = useRef(null); const dotRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 }); const target = useRef({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  useEffect(() => {
    const move = (e) => { target.current = { x: e.clientX, y: e.clientY }; };
    const animate = () => { pos.current.x += (target.current.x - pos.current.x) * 0.15; pos.current.y += (target.current.y - pos.current.y) * 0.15; if (cursorRef.current) { cursorRef.current.style.left = `${pos.current.x}px`; cursorRef.current.style.top = `${pos.current.y}px`; } if (dotRef.current) { dotRef.current.style.left = `${target.current.x}px`; dotRef.current.style.top = `${target.current.y}px`; } requestAnimationFrame(animate); };
    window.addEventListener('mousemove', move); requestAnimationFrame(animate);
    const addHover = () => { document.querySelectorAll('a, button, .project-card').forEach(el => { el.addEventListener('mouseenter', () => setHovering(true)); el.addEventListener('mouseleave', () => setHovering(false)); }); };
    addHover(); const observer = new MutationObserver(addHover); observer.observe(document.body, { childList: true, subtree: true });
    return () => { window.removeEventListener('mousemove', move); observer.disconnect(); };
  }, []);
  return (<><div ref={cursorRef} className={`custom-cursor ${hovering ? 'hovering' : ''}`} /><div ref={dotRef} className={`custom-cursor-dot ${hovering ? 'hovering' : ''}`} /></>);
}

const projects = {
  en: [
    { icon: '\ud83d\udce1', title: 'Telecom Revenue Optimization', desc: 'AI-driven analytics platform that increased revenue by 300% and gross profit by 1150% for a major APAC telecom operator through intelligent routing and pricing optimization.', tags: ['AI', 'Telecom', 'Revenue Growth', 'Data Analytics'], soon: false },
    { icon: '\ud83e\udde0', title: 'Predictive Business Intelligence', desc: 'End-to-end BI solution with real-time dashboards, predictive models, and automated KPI tracking for a global communications company spanning 14 markets.', tags: ['Power BI', 'Predictive Models', 'KPI Tracking'], soon: false },
    { icon: '\ud83c\udf10', title: 'AI-Powered Web Platform', desc: 'Modern web application with integrated AI chatbot, automated analytics reporting, and intelligent content management for a European tech startup.', tags: ['Next.js', 'OpenAI', 'Full Stack', 'Cloud'], soon: true },
    { icon: '\ud83d\udcca', title: 'Data Warehouse & ETL Pipeline', desc: 'Scalable cloud data infrastructure with automated ETL pipelines, real-time data processing, and advanced analytics capabilities for cross-market insights.', tags: ['AWS', 'PostgreSQL', 'ETL', 'Data Modeling'], soon: true },
  ],
  hr: [
    { icon: '\ud83d\udce1', title: 'Optimizacija prihoda telekoma', desc: 'AI analiti\u010dka platforma koja je pove\u0107ala prihod za 300% i bruto dobit za 1150% za velikog APAC telekom operatera kroz inteligentno rutiranje i optimizaciju cijena.', tags: ['AI', 'Telekom', 'Rast prihoda', 'Analitika'], soon: false },
    { icon: '\ud83e\udde0', title: 'Prediktivna poslovna inteligencija', desc: 'End-to-end BI rje\u0161enje s real-time dashboardima, prediktivnim modelima i automatiziranim KPI pra\u0107enjem za globalnu komunikacijsku tvrtku u 14 tr\u017ei\u0161ta.', tags: ['Power BI', 'Prediktivni modeli', 'KPI pra\u0107enje'], soon: false },
    { icon: '\ud83c\udf10', title: 'AI web platforma', desc: 'Moderna web aplikacija s integriranim AI chatbotom, automatiziranim analiti\u010dkim izvje\u0161tavanjem i inteligentnim upravljanjem sadr\u017eajem za europski tech startup.', tags: ['Next.js', 'OpenAI', 'Full Stack', 'Cloud'], soon: true },
    { icon: '\ud83d\udcca', title: 'Data Warehouse i ETL Pipeline', desc: 'Skalabilna cloud podatkovna infrastruktura s automatiziranim ETL pipelineima, real-time obradom podataka i naprednom analitikom za me\u0111utr\u017ei\u0161ne uvide.', tags: ['AWS', 'PostgreSQL', 'ETL', 'Modeliranje'], soon: true },
  ],
};

const nav = { en: { services: 'Services', tech: 'Technologies', about: 'About', projects: 'Projects', contact: 'Contact' }, hr: { services: 'Usluge', tech: 'Tehnologije', about: 'O nama', projects: 'Projekti', contact: 'Kontakt' } };
const pageContent = { en: { label: 'OUR WORK', title: 'Projects & case studies', sub: 'A selection of projects that showcase our expertise in AI, data analytics, and software development.' }, hr: { label: 'NA\u0160 RAD', title: 'Projekti i studije slu\u010daja', sub: 'Izbor projekata koji prikazuju na\u0161u ekspertizu u AI-u, analitici podataka i razvoju softvera.' } };

export default function Projects() {
  const [lang, setLang] = useState('en'); const [menuOpen, setMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -500, y: -500 });
  const lenisRef = useRef(null);
  const t = nav[lang]; const p = pageContent[lang]; const proj = projects[lang];

  useEffect(() => { const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true }); lenisRef.current = lenis; function raf(time) { lenis.raf(time); requestAnimationFrame(raf); } requestAnimationFrame(raf); return () => lenis.destroy(); }, []);
  useEffect(() => { const h = (e) => setCursorPos({ x: e.clientX, y: e.clientY }); window.addEventListener('mousemove', h); return () => window.removeEventListener('mousemove', h); }, []);

  return (
    <>
      <div className="noise" />
      <CustomCursor />
      <div className="cursor-glow" style={{ left: cursorPos.x, top: cursorPos.y }} />

      <nav className="nav">
        <Link href="/" className="nav-logo"><span className="nav-logo-text">Dom<span>Analytics</span></span></Link>
        <div className="nav-links">
          <Link href="/#services">{t.services}</Link>
          <Link href="/#tech">{t.tech}</Link>
          <Link href="/about">{t.about}</Link>
          <Link href="/projects" className="active">{t.projects}</Link>
          <Link href="/#contact">{t.contact}</Link>
          <button className="lang-toggle" onClick={() => setLang((l) => (l === 'en' ? 'hr' : 'en'))}>{lang === 'en' ? 'HR' : 'EN'}</button>
        </div>
        <button className="menu-btn" onClick={() => setMenuOpen((o) => !o)}><span /><span /><span /></button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link href="/about" onClick={() => setMenuOpen(false)}>{t.about}</Link>
        <Link href="/projects" onClick={() => setMenuOpen(false)}>{t.projects}</Link>
        <Link href="/#contact" onClick={() => setMenuOpen(false)}>{t.contact}</Link>
        <button className="lang-toggle" onClick={() => { setLang((l) => (l === 'en' ? 'hr' : 'en')); setMenuOpen(false); }}>{lang === 'en' ? 'HR' : 'EN'}</button>
        <a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); }} style={{ fontSize: 16, color: 'var(--text-dim)', marginTop: 20 }}>{'\u2715'} Close</a>
      </div>

      <section className="page-hero">
        <div className="page-hero-mesh"><div className="page-hero-orb" /><div className="page-hero-orb" /></div>
        <div className="page-hero-content">
          <LineReveal><p className="page-hero-label">{p.label}</p></LineReveal>
          <h1 className="page-hero-title"><SplitText>{p.title}</SplitText></h1>
          <LineReveal delay={0.3}><p className="page-hero-sub">{p.sub}</p></LineReveal>
        </div>
      </section>

      <section className="section">
        <StaggerChildren className="projects-grid">
          {proj.map((project, i) => (
            <div key={i} className="project-card" data-cursor-label="View">
              {project.soon && <span className="project-card-soon">Coming Soon</span>}
              <div className="project-card-image">
                <div className="project-card-image-gradient" />
                <div className="project-card-image-pattern" />
                <span className="project-card-icon">{project.icon}</span>
                <div className="project-card-overlay" />
              </div>
              <div className="project-card-content">
                <div className="project-card-tags">{project.tags.map((tag, j) => <span key={j} className="project-card-tag">{tag}</span>)}</div>
                <h3 className="project-card-title">{project.title}</h3>
                <p className="project-card-desc">{project.desc}</p>
                <span className="project-card-link">{project.soon ? 'Details coming soon' : 'View case study'} &rarr;</span>
              </div>
            </div>
          ))}
        </StaggerChildren>
      </section>

      <footer className="big-footer">
        <div className="big-footer-mesh"><div className="big-footer-orb" /><div className="big-footer-orb" /></div>
        <div className="big-footer-inner">
          <div className="big-footer-top">
            <div className="big-footer-brand">
              <div className="big-footer-logo">Dom<span>Analytics</span></div>
              <p className="big-footer-desc">AI-powered consulting, data analytics, and custom software development.</p>
              <div className="big-footer-social">
                <a href="https://linkedin.com/in/domagojkrusic" target="_blank" rel="noopener noreferrer">in</a>
                <a href="mailto:dom.krusic@gmail.com">@</a>
              </div>
            </div>
            <div className="big-footer-col"><h4>Navigation</h4><Link href="/">Home</Link><Link href="/about">About</Link><Link href="/projects">Projects</Link></div>
            <div className="big-footer-col"><h4>Connect</h4><a href="mailto:dom.krusic@gmail.com">Email</a><a href="tel:+385994385030">Phone</a><a href="https://linkedin.com/in/domagojkrusic" target="_blank" rel="noopener noreferrer">LinkedIn</a></div>
            <div className="big-footer-col"><h4>Location</h4><a href="#">Pore\u010d, Croatia</a><a href="#">Zagreb, Croatia</a><a href="#">Global Remote</a></div>
          </div>
          <div className="big-footer-bottom"><span>&copy; 2026 Dom Analytics</span><div><a href="#">Privacy</a><a href="#">Terms</a></div></div>
        </div>
      </footer>
    </>
  );
}