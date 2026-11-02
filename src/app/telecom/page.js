'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Lenis from 'lenis';

function SplitText({ children, className = '', center = false }) { const r = useRef(null); const [v, setV] = useState(false); useEffect(() => { const el = r.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.2 }); obs.observe(el); return () => obs.disconnect(); }, []); const w = String(children).split(' '); return (<span ref={r} className={`split-text ${center ? 'center' : ''} ${className}`}>{w.map((word, i) => (<span key={i} className={`split-word ${v ? 'visible' : ''}`} style={{ transitionDelay: `${i * 0.05}s` }}>{word}</span>))}</span>); }
function LineReveal({ children, delay = 0 }) { const r = useRef(null); const [v, setV] = useState(false); useEffect(() => { const el = r.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.3 }); obs.observe(el); return () => obs.disconnect(); }, []); return (<div className="line-mask" ref={r}><div className={`line-inner ${v ? 'visible' : ''}`} style={{ transitionDelay: `${delay}s` }}>{children}</div></div>); }
function StaggerChildren({ children, className = '' }) { const r = useRef(null); const [v, setV] = useState(false); useEffect(() => { const el = r.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.1 }); obs.observe(el); return () => obs.disconnect(); }, []); return (<div ref={r} className={className}>{Array.isArray(children) ? children.map((child, i) => (<div key={i} className={`stagger-item ${v ? 'visible' : ''}`} style={{ transitionDelay: `${i * 0.1}s` }}>{child}</div>)) : children}</div>); }
function TiltCard({ children }) { const c = useRef(null); const g = useRef(null); const hm = (e) => { const card = c.current; if (!card) return; const rect = card.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top; card.style.transform = `perspective(800px) rotateX(${((y - rect.height / 2) / (rect.height / 2)) * -6}deg) rotateY(${((x - rect.width / 2) / (rect.width / 2)) * 6}deg) scale(1.02)`; if (g.current) { g.current.style.left = `${x}px`; g.current.style.top = `${y}px`; } }; const hl = () => { if (c.current) c.current.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)'; }; return (<div className="tilt-wrapper" onMouseMove={hm} onMouseLeave={hl}><div ref={c} className="service-card"><div ref={g} className="service-card-glow" />{children}</div></div>); }

function CustomCursor() {
  const cursorRef = useRef(null); const dotRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 }); const target = useRef({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  useEffect(() => {
    const move = (e) => { target.current = { x: e.clientX, y: e.clientY }; };
    const animate = () => { pos.current.x += (target.current.x - pos.current.x) * 0.15; pos.current.y += (target.current.y - pos.current.y) * 0.15; if (cursorRef.current) { cursorRef.current.style.left = `${pos.current.x}px`; cursorRef.current.style.top = `${pos.current.y}px`; } if (dotRef.current) { dotRef.current.style.left = `${target.current.x}px`; dotRef.current.style.top = `${target.current.y}px`; } requestAnimationFrame(animate); };
    window.addEventListener('mousemove', move); requestAnimationFrame(animate);
    const addHover = () => { document.querySelectorAll('a, button, .service-card').forEach(el => { el.addEventListener('mouseenter', () => setHovering(true)); el.addEventListener('mouseleave', () => setHovering(false)); }); };
    addHover(); const observer = new MutationObserver(addHover); observer.observe(document.body, { childList: true, subtree: true });
    return () => { window.removeEventListener('mousemove', move); observer.disconnect(); };
  }, []);
  return (<><div ref={cursorRef} className={`custom-cursor ${hovering ? 'hovering' : ''}`} /><div ref={dotRef} className={`custom-cursor-dot ${hovering ? 'hovering' : ''}`} /></>);
}

function ContactForm({ t }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { setStatus('sent'); setForm({ name: '', email: '', message: '' }); setTimeout(() => setStatus('idle'), 4000); }
      else { setStatus('error'); setTimeout(() => setStatus('idle'), 3000); }
    } catch { setStatus('error'); setTimeout(() => setStatus('idle'), 3000); }
  };
  const btnText = status === 'sending' ? t.sending : status === 'sent' ? t.sent : status === 'error' ? t.error : t.send;
  return (
    <div className="contact-form">
      <div className="form-field"><input type="text" placeholder={t.name} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
      <div className="form-field"><input type="email" placeholder={t.email} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
      <div className="form-field"><textarea placeholder={t.message} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
      <button className={'submit-btn ' + (status === 'sent' ? 'sent' : '') + (status === 'error' ? 'error' : '')} onClick={handleSubmit} disabled={status === 'sending'} style={{ opacity: status === 'sending' ? 0.6 : 1 }}>{btnText}</button>
    </div>
  );
}

const NAV = {
  en: { services: 'Services', telecom: 'Telecom', tech: 'Technologies', about: 'About', projects: 'Projects', contact: 'Contact' },
  hr: { services: 'Usluge', telecom: 'Telecom', tech: 'Tehnologije', about: 'O nama', projects: 'Projekti', contact: 'Kontakt' },
};

const CONTACT = { name: 'Your name', email: 'Email address', message: 'Tell us about your A2P setup', send: 'Send message', sending: 'Sending...', sent: 'Message sent!', error: 'Failed to send. Try again.' };

const AUDIENCES = [
  { num: '1', title: 'Mobile operators', desc: 'Independent assessment of your A2P partner and firewall setup before you go to RFP. Fixed-scope diagnostic, two to three weeks, written recommendation on partner model, exclusivity terms and pricing.' },
  { num: '2', title: 'Firewall and anti-fraud vendors', desc: 'Deal desk and business case support for operator tenders. The technical proposal wins or loses on the commercial model attached to it; we build that model, per tender or on retainer.' },
  { num: '3', title: 'Messaging providers and consultancies', desc: 'Operator deal structuring, A2P business cases, RFP responses, routing and margin analytics. Available as a subcontractor, 10 to 15 hours a week.' },
];

const TOPICS = ['A2P SMS pricing', 'Operator exclusivity and preferred partnerships', 'SMS firewall economics', 'Aggregator competitive landscape', 'AIT fraud', 'RCS and OTT impact on A2P revenue', 'Operator RFP processes', 'Deal desk and business cases'];

const RESULTS = [
  { label: 'APAC · INDOSAT OOREDOO', value: '1500%', metric: 'Revenue increase', desc: 'A2P SMS monetization project delivered from the provider side. Commercial terms prepared and negotiated. Result: 1500% revenue and 1150% gross profit increase for the provider on the operator route.', tags: ['A2P SMS', 'Commercial Terms', 'Operator Route'] },
  { label: 'MENA · ETISALAT EGYPT', value: '400%', metric: 'Revenue increase', desc: 'A2P SMS monetization project delivered from the provider side. Commercial terms prepared and negotiated. Result: 400% revenue and 250% gross profit increase for the provider on the operator route.', tags: ['A2P SMS', 'Commercial Terms', 'Operator Route'] },
];

export default function Telecom() {
  const [lang, setLang] = useState('en'); const [menuOpen, setMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -500, y: -500 });
  const lenisRef = useRef(null); const nav = NAV[lang];

  useEffect(() => { const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true }); lenisRef.current = lenis; function raf(time) { lenis.raf(time); requestAnimationFrame(raf); } requestAnimationFrame(raf); return () => lenis.destroy(); }, []);
  useEffect(() => { const h = (e) => setCursorPos({ x: e.clientX, y: e.clientY }); window.addEventListener('mousemove', h); return () => window.removeEventListener('mousemove', h); }, []);
  useEffect(() => { if (menuOpen) { document.body.style.overflow = 'hidden'; } else { document.body.style.overflow = ''; } return () => { document.body.style.overflow = ''; }; }, [menuOpen]);

  return (
    <>
      <div className="noise" /><CustomCursor />
      <div className="cursor-glow" style={{ left: cursorPos.x, top: cursorPos.y }} />

      <nav className="nav">
        <Link href="/" className="nav-logo"><span className="nav-logo-text">Dom<span>Analytics</span></span></Link>
        <div className="nav-links">
          <Link href="/#services">{nav.services}</Link>
          <Link href="/telecom" className="active">{nav.telecom}</Link>
          <Link href="/#tech">{nav.tech}</Link>
          <Link href="/about">{nav.about}</Link>
          <Link href="/projects">{nav.projects}</Link>
          <Link href="/#contact">{nav.contact}</Link>
          <button className="lang-toggle" onClick={() => setLang((l) => (l === 'en' ? 'hr' : 'en'))}>{lang === 'en' ? 'HR' : 'EN'}</button>
        </div>
        <button className={`menu-btn ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen((o) => !o)}><span /><span /><span /></button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link href="/telecom" onClick={() => setMenuOpen(false)}>{nav.telecom}</Link>
        <Link href="/about" onClick={() => setMenuOpen(false)}>{nav.about}</Link>
        <Link href="/projects" onClick={() => setMenuOpen(false)}>{nav.projects}</Link>
        <Link href="/#contact" onClick={() => setMenuOpen(false)}>{nav.contact}</Link>
        <button className="lang-toggle" onClick={() => { setLang((l) => (l === 'en' ? 'hr' : 'en')); setMenuOpen(false); }}>{lang === 'en' ? 'HR' : 'EN'}</button>
        <a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); }} style={{ fontSize: 16, color: 'var(--text-dim)', marginTop: 20 }}>{'✕'} Close</a>
      </div>

      <section className="page-hero">
        <div className="page-hero-mesh"><div className="page-hero-orb" /><div className="page-hero-orb" /></div>
        <div className="page-hero-content">
          <LineReveal><p className="page-hero-label">TELECOM REVENUE &amp; MONETIZATION</p></LineReveal>
          <h1 className="page-hero-title"><SplitText>Commercial advisory for A2P SMS, from the side that has closed the deals</SplitText></h1>
          <LineReveal delay={0.3}><p className="page-hero-sub" style={{ maxWidth: 720 }}>We advise mobile operators and messaging providers on the commercial side of A2P SMS: who holds which exclusivity, what it is worth, how to price it, and how AIT fraud, RCS and OTT change the revenue line. 14 A2P SMS and Voice monetization projects delivered with operators across MENA and APAC.</p></LineReveal>
        </div>
      </section>

      <section id="who" className="section" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <LineReveal><p className="section-label">CLIENTS</p></LineReveal>
        <h2 className="section-title"><SplitText>Who we work with</SplitText></h2>
        <StaggerChildren className="services-grid services-grid-three">
          {AUDIENCES.map((a) => (
            <TiltCard key={a.num}>
              <div className="service-num">{a.num}</div>
              <h3 className="service-title">{a.title}</h3>
              <p className="service-desc">{a.desc}</p>
            </TiltCard>
          ))}
        </StaggerChildren>
      </section>

      <section id="topics" className="section" style={{ paddingTop: 0, paddingBottom: 80 }}>
        <LineReveal><p className="section-label">TOPICS</p></LineReveal>
        <div className="service-tags" style={{ maxWidth: 820 }}>
          {TOPICS.map((topic) => <span key={topic} className="service-tag">{topic}</span>)}
        </div>
      </section>

      <div className="section-divider" />

      <section id="results" className="section" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <LineReveal><p className="section-label">PROVEN RESULTS</p></LineReveal>
        <h2 className="section-title"><SplitText>Results</SplitText></h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '48px' }}>
          {RESULTS.map((r) => (
            <div key={r.label} style={{ background: 'rgba(0,229,255,0.04)', border: '1px solid rgba(0,229,255,0.15)', borderRadius: '12px', padding: '36px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, #00e5ff, transparent)' }} />
              <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: '#00e5ff', marginBottom: '16px', fontFamily: 'monospace' }}>{r.label}</p>
              <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#00e5ff', lineHeight: 1, marginBottom: '8px' }}>{r.value}</div>
              <p style={{ fontSize: '0.85rem', color: 'rgba(200,220,240,0.9)', fontWeight: 600, marginBottom: '12px' }}>{r.metric}</p>
              <p style={{ fontSize: '0.8rem', color: '#4a6080', lineHeight: 1.7 }}>{r.desc}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '20px' }}>
                {r.tags.map(tag => (
                  <span key={tag} style={{ fontSize: '0.6rem', letterSpacing: '0.08em', color: '#00e5ff', border: '1px solid rgba(0,229,255,0.2)', padding: '3px 10px', borderRadius: '100px' }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.7, marginTop: 24 }}>Results delivered in previous roles at a global CPaaS provider and a wholesale messaging provider.</p>
      </section>

      <section id="background" className="section" style={{ paddingTop: 0, paddingBottom: 100 }}>
        <LineReveal><p className="section-label">BACKGROUND</p></LineReveal>
        <LineReveal delay={0.2}><p className="section-sub" style={{ maxWidth: 720 }}>Domagoj Krušić, CEO of Dom Analytics. Former VP of Business Intelligence &amp; Strategy at a wholesale messaging provider and Business Growth Team Leader at a global CPaaS provider (APAC). 15+ years in data and telecom. Currently external commercial consultant to a global CPaaS provider on operator partnerships and A2P monetization.</p></LineReveal>
      </section>

      <section id="contact" className="contact-section">
        <div className="section" style={{ paddingTop: 100, paddingBottom: 100 }}>
          <div className="contact-layout">
            <div>
              <LineReveal><p className="section-label">GET IN TOUCH</p></LineReveal>
              <h2 className="section-title contact-title"><SplitText>Reviewing your A2P partner or firewall setup in 2027?</SplitText></h2>
              <LineReveal delay={0.3}><p className="section-sub" style={{ marginTop: 16 }}>Send a note, 20 minutes is enough to check the fit.</p></LineReveal>
              <div className="contact-info"><p>Or reach us directly</p><a href="mailto:info@domanalytics.com">info@domanalytics.com</a></div>
            </div>
            <ContactForm t={CONTACT} />
          </div>
        </div>
      </section>

      <footer className="big-footer">
        <div className="big-footer-mesh"><div className="big-footer-orb" /><div className="big-footer-orb" /></div>
        <div className="big-footer-inner">
          <div className="big-footer-top">
            <div className="big-footer-brand"><div className="big-footer-logo">Dom<span>Analytics</span></div><p className="big-footer-desc">Fractional CDO services, data strategy, AI implementation and BI analytics.</p><div className="big-footer-social"><a href="https://linkedin.com/company/dom-analytics" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45z"/></svg></a><a href="mailto:info@domanalytics.com" aria-label="Email"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></a></div></div>
            <div className="big-footer-col"><h4>Navigation</h4><Link href="/">Home</Link><Link href="/#services">Services</Link><Link href="/telecom">Telecom</Link><Link href="/about">About</Link><Link href="/projects">Projects</Link></div>
            <div className="big-footer-col"><h4>Connect</h4><a href="mailto:info@domanalytics.com">Email</a><a href="https://linkedin.com/company/dom-analytics" target="_blank" rel="noopener noreferrer">LinkedIn</a></div>
            <div className="big-footer-col"><h4>Location</h4><span>Pore&#269;, Croatia</span><span>Global Remote</span></div>
          </div>
          <div className="big-footer-bottom"><span>&copy; 2026 Dom Analytics</span><div><a href="/universe-game.html">Explore on your own</a></div></div>
        </div>
      </footer>
    </>
  );
}
