'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Lenis from 'lenis';

function useReveal(th = 0.15) { const ref = useRef(null); const [v, setV] = useState(false); useEffect(() => { const el = ref.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: th }); obs.observe(el); return () => obs.disconnect(); }, [th]); return [ref, v]; }
function SplitText({ children, className = '' }) { const r = useRef(null); const [v, setV] = useState(false); useEffect(() => { const el = r.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.2 }); obs.observe(el); return () => obs.disconnect(); }, []); const w = String(children).split(' '); return (<span ref={r} className={`split-text ${className}`}>{w.map((word, i) => (<span key={i} className={`split-word ${v ? 'visible' : ''}`} style={{ transitionDelay: `${i * 0.05}s` }}>{word}</span>))}</span>); }
function LineReveal({ children, delay = 0 }) { const r = useRef(null); const [v, setV] = useState(false); useEffect(() => { const el = r.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.3 }); obs.observe(el); return () => obs.disconnect(); }, []); return (<div className="line-mask" ref={r}><div className={`line-inner ${v ? 'visible' : ''}`} style={{ transitionDelay: `${delay}s` }}>{children}</div></div>); }

function CustomCursor() {
  const cursorRef = useRef(null); const dotRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 }); const target = useRef({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  useEffect(() => {
    const move = (e) => { target.current = { x: e.clientX, y: e.clientY }; };
    const animate = () => { pos.current.x += (target.current.x - pos.current.x) * 0.15; pos.current.y += (target.current.y - pos.current.y) * 0.15; if (cursorRef.current) { cursorRef.current.style.left = `${pos.current.x}px`; cursorRef.current.style.top = `${pos.current.y}px`; } if (dotRef.current) { dotRef.current.style.left = `${target.current.x}px`; dotRef.current.style.top = `${target.current.y}px`; } requestAnimationFrame(animate); };
    window.addEventListener('mousemove', move); requestAnimationFrame(animate);
    const addHover = () => { document.querySelectorAll('a, button').forEach(el => { el.addEventListener('mouseenter', () => setHovering(true)); el.addEventListener('mouseleave', () => setHovering(false)); }); };
    addHover(); const observer = new MutationObserver(addHover); observer.observe(document.body, { childList: true, subtree: true });
    return () => { window.removeEventListener('mousemove', move); observer.disconnect(); };
  }, []);
  return (<><div ref={cursorRef} className={`custom-cursor ${hovering ? 'hovering' : ''}`} /><div ref={dotRef} className={`custom-cursor-dot ${hovering ? 'hovering' : ''}`} /></>);
}

const CASE_STUDIES = [
  {
    id: 'apac',
    region: 'APAC Region',
    industry: 'Telecommunications',
    color: '#00BCD4',
    icon: '📡',
    title: { en: 'Telecom Network Data Monetization', hr: 'Monetizacija podataka telekom mreže' },
    metrics: [
      { value: '1500%', label: { en: 'Revenue increase', hr: 'Rast prihoda' } },
      { value: '1150%', label: { en: 'Gross profit increase', hr: 'Rast bruto dobiti' } },
    ],
    challenge: {
      en: 'A major telecommunications network in the APAC region was sitting on enormous amounts of traffic and routing data but had no visibility into how that data could be used to drive revenue. Reporting was siloed, data quality was poor and the monetization strategy was non-existent. Revenue was flat despite high traffic volumes.',
      hr: 'Velika telekomunikacijska mreža u APAC regiji sjedila je na ogromnim količinama podataka o prometu i rutiranju, ali nije imala vidljivost kako te podatke iskoristiti za rast prihoda. Izvještavanje je bilo u silosima, kvaliteta podataka loša, a strategija monetizacije nepostojeća.',
    },
    approach: {
      en: 'We started with a full data audit, mapping every data source, identifying gaps and establishing a clear picture of what existed. We then cleaned and restructured the data architecture, built automated pipelines and created a real-time BI layer that gave the business visibility it had never had before. On top of that foundation, we designed and implemented a new data-driven monetization strategy.',
      hr: 'Počeli smo s punim data auditom, mapiranjem svakog izvora podataka i identificiranjem praznina. Zatim smo očistili i restrukturirali arhitekturu podataka, izgradili automatizirane pipeline-ove i kreirali BI sloj u realnom vremenu. Na toj osnovi dizajnirali smo i implementirali novu strategiju monetizacije temeljenu na podacima.',
    },
    results: {
      en: 'The engagement delivered a complete transformation of the network\'s revenue performance. Data that was previously invisible became the engine behind a 1500% revenue increase and 1150% gross profit increase. The new data infrastructure continues to generate value long after the initial engagement concluded.',
      hr: 'Projekt je isporučio potpunu transformaciju prihoda mreže. Podaci koji su prethodno bili nevidljivi postali su pokretač 1500% rasta prihoda i 1150% rasta bruto dobiti. Nova podatkovna infrastruktura nastavlja generirati vrijednost.',
    },
    tags: ['Data Audit', 'Data Enablement', 'BI Architecture', 'Monetization Strategy', 'Network Analytics', 'Revenue Growth'],
    services: ['Data Strategy & Enablement', 'BI & Analytics', 'Data Monetization'],
  },
  {
    id: 'mena',
    region: 'MENA Region',
    industry: 'Telecommunications',
    color: '#00BCD4',
    icon: '🌐',
    title: { en: 'Telecom Revenue & Data Architecture Overhaul', hr: 'Obnova podatkovne arhitekture i prihoda telekoma' },
    metrics: [
      { value: '400%', label: { en: 'Revenue increase', hr: 'Rast prihoda' } },
      { value: '250%', label: { en: 'Gross profit increase', hr: 'Rast bruto dobiti' } },
    ],
    challenge: {
      en: 'A telecommunications network in the MENA region had significant revenue potential locked inside fragmented, ungoverned data. Multiple systems were producing inconsistent reports, making it impossible to identify where revenue was being lost or where new opportunities existed. The business was operating blind.',
      hr: 'Telekomunikacijska mreža u MENA regiji imala je značajan potencijal prihoda zaključan u fragmentiranim, neupravljanim podacima. Više sustava produciralo je nekonzistentne izvještaje, što je onemogućavalo identifikaciju gubitaka prihoda ili novih prilika.',
    },
    approach: {
      en: 'We conducted a comprehensive data audit that uncovered hidden revenue streams that were simply invisible without proper data governance. We restructured the entire data architecture, eliminated reporting silos, established data quality standards and built a unified analytics layer. A new monetization strategy was then designed based on what the clean data revealed.',
      hr: 'Proveli smo sveobuhvatni data audit koji je otkrio skrivene tokove prihoda koji su bili nevidljivi bez odgovarajućeg upravljanja podacima. Restrukturirali smo cijelu arhitekturu podataka, eliminirali silose izvještavanja i izgradili jedinstveni analitički sloj.',
    },
    results: {
      en: 'The project delivered 400% revenue growth and 250% gross profit increase. Beyond the numbers, the business was left with a clean, governed data foundation it could continue to build on, and a monetization playbook it could apply across other markets.',
      hr: 'Projekt je isporučio 400% rasta prihoda i 250% rasta bruto dobiti. Osim brojeva, tvrtka je dobila čist, upravljan podatkovni temelj i strategiju monetizacije primjenjivu na drugim tržištima.',
    },
    tags: ['Data Audit', 'Revenue Strategy', 'Data Architecture', 'Silo Elimination', 'Data Governance', 'Monetization'],
    services: ['Data Strategy & Enablement', 'BI & Analytics', 'Data Monetization'],
  },
];

const UPCOMING = [
  {
    color: '#10b981', icon: '📊',
    title: { en: 'Enterprise BI Transformation', hr: 'Enterprise BI Transformacija' },
    desc: { en: 'End-to-end BI overhaul for a global enterprise — from data warehouse redesign to executive dashboard deployment across 14 markets.', hr: 'Potpuna BI obnova za globalnu kompaniju — od redizajna data warehouse-a do implementacije dashboarda u 14 tržišta.' },
    tags: ['PowerBI', 'Data Warehouse', 'KPI Frameworks', 'Global'],
  },
  {
    color: '#f59e0b', icon: '🤖',
    title: { en: 'AI-Powered SaaS Platform', hr: 'AI SaaS Platforma' },
    desc: { en: 'Custom LLM integration and predictive analytics engine built for a European tech startup operating in the B2B intelligence space.', hr: 'Prilagođena LLM integracija i prediktivni analitički engine za europski tech startup u B2B intelligence prostoru.' },
    tags: ['LLM', 'Next.js', 'Predictive Analytics', 'SaaS'],
  },
];

export default function Projects() {
  const [lang, setLang] = useState('en');
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -500, y: -500 });
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenisRef.current = lenis;
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    const h = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', h);
    return () => window.removeEventListener('mousemove', h);
  }, []);

  const nav_t = { en: { services: 'Services', tech: 'Technologies', about: 'About', projects: 'Projects', contact: 'Contact' }, hr: { services: 'Usluge', tech: 'Tehnologije', about: 'O nama', projects: 'Projekti', contact: 'Kontakt' } }[lang];

  return (
    <>
      <div className="noise" />
      <CustomCursor />
      <div className="cursor-glow" style={{ left: cursorPos.x, top: cursorPos.y }} />

      <nav className="nav">
        <Link href="/" className="nav-logo"><span className="nav-logo-text">Dom<span>Analytics</span></span></Link>
        <div className="nav-links">
          <Link href="/#services">{nav_t.services}</Link>
          <Link href="/#tech">{nav_t.tech}</Link>
          <Link href="/about">{nav_t.about}</Link>
          <Link href="/projects" className="active">{nav_t.projects}</Link>
          <Link href="/#contact">{nav_t.contact}</Link>
          <button className="lang-toggle" onClick={() => setLang(l => l === 'en' ? 'hr' : 'en')}>{lang === 'en' ? 'HR' : 'EN'}</button>
        </div>
        <button className="menu-btn" onClick={() => setMenuOpen(o => !o)}><span /><span /><span /></button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link href="/about" onClick={() => setMenuOpen(false)}>{nav_t.about}</Link>
        <Link href="/projects" onClick={() => setMenuOpen(false)}>{nav_t.projects}</Link>
        <Link href="/#contact" onClick={() => setMenuOpen(false)}>{nav_t.contact}</Link>
        <button className="lang-toggle" onClick={() => { setLang(l => l === 'en' ? 'hr' : 'en'); setMenuOpen(false); }}>{lang === 'en' ? 'HR' : 'EN'}</button>
        <a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); }} style={{ fontSize: 16, color: 'var(--text-dim)', marginTop: 20 }}>✕ Close</a>
      </div>

      {/* HERO */}
      <section className="page-hero">
        <div className="page-hero-mesh"><div className="page-hero-orb" /><div className="page-hero-orb" /></div>
        <div className="page-hero-content">
          <LineReveal><p className="page-hero-label">{lang === 'en' ? 'OUR WORK' : 'NAŠ RAD'}</p></LineReveal>
          <h1 className="page-hero-title"><SplitText>{lang === 'en' ? 'Projects & Case Studies' : 'Projekti i studije slučaja'}</SplitText></h1>
          <LineReveal delay={0.3}><p className="page-hero-sub">{lang === 'en' ? 'Real engagements. Real data. Real results. Every number you see here came from work done inside the data layer.' : 'Stvarni projekti. Stvarni podaci. Stvarni rezultati. Svaki broj ovdje došao je iz rada unutar podatkovnog sloja.'}</p></LineReveal>
        </div>
      </section>

      {/* CASE STUDIES */}
      <section className="section">
        <LineReveal><p className="section-label">{lang === 'en' ? 'CASE STUDIES' : 'STUDIJE SLUČAJA'}</p></LineReveal>
        <h2 className="section-title"><SplitText>{lang === 'en' ? 'Proven results' : 'Dokazani rezultati'}</SplitText></h2>
        <LineReveal delay={0.2}><p className="section-sub" style={{ marginBottom: 56 }}>{lang === 'en' ? 'These are not estimates or projections. These are outcomes delivered.' : 'Ovo nisu procjene ili projekcije. Ovo su isporučeni rezultati.'}</p></LineReveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {CASE_STUDIES.map((cs, i) => (
            <CaseStudyCard key={cs.id} cs={cs} lang={lang} index={i} />
          ))}
        </div>
      </section>

      {/* UPCOMING */}
      <section className="section" style={{ paddingTop: 0 }}>
        <LineReveal><p className="section-label">{lang === 'en' ? 'IN PROGRESS' : 'U TIJEKU'}</p></LineReveal>
        <h2 className="section-title"><SplitText>{lang === 'en' ? 'Coming soon' : 'Uskoro'}</SplitText></h2>
        <LineReveal delay={0.2}><p className="section-sub" style={{ marginBottom: 48 }}>{lang === 'en' ? 'Ongoing engagements. Details to follow.' : 'Trenutni projekti. Detalji uskoro.'}</p></LineReveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
          {UPCOMING.map((u, i) => (
            <div key={i} style={{ background: 'var(--bg2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, padding: '32px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${u.color}, transparent)` }} />
              <div style={{ fontSize: '2rem', marginBottom: 16 }}>{u.icon}</div>
              <div style={{ display: 'inline-block', background: `${u.color}18`, border: `1px solid ${u.color}35`, borderRadius: 100, padding: '3px 12px', fontSize: '0.6rem', color: u.color, letterSpacing: '0.15em', marginBottom: 14, fontFamily: 'monospace' }}>{lang === 'en' ? 'COMING SOON' : 'USKORO'}</div>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.15rem', color: '#e8edf5', marginBottom: 12 }}>{u.title[lang]}</h3>
              <p style={{ fontSize: '0.85rem', color: '#4a6080', lineHeight: 1.75, marginBottom: 20 }}>{u.desc[lang]}</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {u.tags.map(tag => (
                  <span key={tag} style={{ fontSize: '0.6rem', letterSpacing: '0.08em', color: u.color, border: `1px solid ${u.color}30`, padding: '3px 10px', borderRadius: 100 }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="page-hero-mesh"><div className="page-hero-orb" /><div className="page-hero-orb" /></div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 40px', position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(2.5rem, 6vw, 5rem)', color: '#e8edf5', lineHeight: 1.05, marginBottom: 24, textAlign: 'center' }}>
            {lang === 'en' ? 'Ready to be next?' : 'Spremni biti sljedeći?'}
          </h2>
          <p style={{ color: '#4a6080', fontSize: '1rem', marginBottom: 40, maxWidth: 520, textAlign: 'center', lineHeight: 1.7 }}>
            {lang === 'en' ? "Let's talk about your data and what it could be doing for your business." : 'Razgovarajmo o vašim podacima i što bi mogli raditi za vaše poslovanje.'}
          </p>
          <Link href="/#contact" className="cta-btn">{lang === 'en' ? 'Start the conversation' : 'Pokrenite razgovor'}</Link>
        </div>
      </section>

      <footer className="big-footer">
        <div className="big-footer-mesh"><div className="big-footer-orb" /><div className="big-footer-orb" /></div>
        <div className="big-footer-inner">
          <div className="big-footer-top">
            <div className="big-footer-brand"><div className="big-footer-logo">Dom<span>Analytics</span></div><p className="big-footer-desc">Fractional CDO services, data strategy, AI implementation and BI analytics.</p><div className="big-footer-social"><a href="https://linkedin.com/company/dom-analytics" target="_blank" rel="noopener noreferrer">in</a><a href="mailto:info@domanalytics.com">@</a></div></div>
            <div className="big-footer-col"><h4>Navigation</h4><Link href="/">Home</Link><Link href="/about">About</Link><Link href="/projects">Projects</Link></div>
            <div className="big-footer-col"><h4>Connect</h4><a href="mailto:info@domanalytics.com">Email</a><a href="https://linkedin.com/company/dom-analytics" target="_blank" rel="noopener noreferrer">LinkedIn</a></div>
            <div className="big-footer-col"><h4>Location</h4><a href="#">Poreč, Croatia</a><a href="#">Global Remote</a></div>
          </div>
          <div className="big-footer-bottom"><span>© 2026 Dom Analytics</span><div><a href="#">Privacy</a><a href="#">Terms</a></div></div>
        </div>
      </footer>
    </>
  );
}

function CaseStudyCard({ cs, lang, index }) {
  const [ref, vis] = useReveal(0.1);
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} className={`reveal ${vis ? 'visible' : ''}`}>
      <div style={{ background: 'var(--bg2)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.3s' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = `${cs.color}30`}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'}
      >
        {/* Top bar */}
        <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${cs.color}, transparent)` }} />

        {/* Header */}
        <div style={{ padding: '32px 40px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: '1.5rem' }}>{cs.icon}</span>
              <div>
                <span style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: cs.color, letterSpacing: '0.2em' }}>{cs.region.toUpperCase()}  ·  {cs.industry.toUpperCase()}</span>
              </div>
            </div>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.3rem, 3vw, 1.8rem)', color: '#e8edf5', lineHeight: 1.2 }}>{cs.title[lang]}</h3>
          </div>
          {/* Metrics */}
          <div style={{ display: 'flex', gap: 24 }}>
            {cs.metrics.map((m, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: cs.color, lineHeight: 1 }}>{m.value}</div>
                <div style={{ fontSize: '0.68rem', color: 'rgba(200,220,240,0.7)', fontWeight: 600, marginTop: 4, letterSpacing: '0.05em' }}>{m.label[lang]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 28 }}>
          {[
            { label: lang === 'en' ? '// THE CHALLENGE' : '// IZAZOV', text: cs.challenge[lang] },
            { label: lang === 'en' ? '// OUR APPROACH' : '// NAŠ PRISTUP', text: cs.approach[lang] },
            { label: lang === 'en' ? '// THE RESULT' : '// REZULTAT', text: cs.results[lang] },
          ].map((block, i) => (
            <div key={i}>
              <p style={{ fontFamily: 'monospace', fontSize: '0.6rem', color: cs.color, letterSpacing: '0.18em', marginBottom: 10 }}>{block.label}</p>
              <p style={{ fontSize: '0.85rem', color: '#4a6080', lineHeight: 1.8 }}>{block.text}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ padding: '0 40px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {cs.tags.map(tag => (
              <span key={tag} style={{ fontSize: '0.6rem', letterSpacing: '0.08em', color: cs.color, border: `1px solid ${cs.color}25`, padding: '3px 10px', borderRadius: 100 }}>{tag}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {cs.services.map(s => (
              <span key={s} style={{ fontSize: '0.6rem', letterSpacing: '0.08em', color: '#4a6080', background: 'rgba(255,255,255,0.04)', padding: '3px 10px', borderRadius: 100 }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
