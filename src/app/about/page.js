'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Lenis from 'lenis';

function useReveal(threshold = 0.15) { const ref = useRef(null); const [visible, setVisible] = useState(false); useEffect(() => { const el = ref.current; if (!el) return; const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold }); obs.observe(el); return () => obs.disconnect(); }, [threshold]); return [ref, visible]; }
function SplitText({ children, className = '', center = false }) { const containerRef = useRef(null); const [visible, setVisible] = useState(false); useEffect(() => { const el = containerRef.current; if (!el) return; const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 }); obs.observe(el); return () => obs.disconnect(); }, []); const words = String(children).split(' '); return (<span ref={containerRef} className={`split-text ${center ? 'center' : ''} ${className}`}>{words.map((word, i) => (<span key={i} className={`split-word ${visible ? 'visible' : ''}`} style={{ transitionDelay: `${i * 0.05}s` }}>{word}</span>))}</span>); }
function LineReveal({ children, delay = 0 }) { const ref = useRef(null); const [visible, setVisible] = useState(false); useEffect(() => { const el = ref.current; if (!el) return; const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.3 }); obs.observe(el); return () => obs.disconnect(); }, []); return (<div className="line-mask" ref={ref}><div className={`line-inner ${visible ? 'visible' : ''}`} style={{ transitionDelay: `${delay}s` }}>{children}</div></div>); }
function StaggerChildren({ children, className = '' }) { const ref = useRef(null); const [visible, setVisible] = useState(false); useEffect(() => { const el = ref.current; if (!el) return; const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.1 }); obs.observe(el); return () => obs.disconnect(); }, []); return (<div ref={ref} className={className}>{Array.isArray(children) ? children.map((child, i) => (<div key={i} className={`stagger-item ${visible ? 'visible' : ''}`} style={{ transitionDelay: `${i * 0.12}s` }}>{child}</div>)) : children}</div>); }
function MagneticButton({ children, className, onClick, href }) { const btnRef = useRef(null); const [offset, setOffset] = useState({ x: 0, y: 0 }); const handleMove = (e) => { const rect = btnRef.current.getBoundingClientRect(); setOffset({ x: (e.clientX - rect.left - rect.width / 2) * 0.2, y: (e.clientY - rect.top - rect.height / 2) * 0.2 }); }; const style = { transform: `translate(${offset.x}px, ${offset.y}px)`, transition: 'transform 0.3s cubic-bezier(0.23,1,0.32,1)' }; if (href) { return (<Link href={href} ref={btnRef} className={className} onMouseMove={handleMove} onMouseLeave={() => setOffset({ x: 0, y: 0 })} style={style}>{children}</Link>); } return (<button ref={btnRef} className={className} onClick={onClick} onMouseMove={handleMove} onMouseLeave={() => setOffset({ x: 0, y: 0 })} style={style}>{children}</button>); }

const content = {
  en: {
    nav: { services: 'Services', tech: 'Technologies', about: 'About', projects: 'Projects', contact: 'Contact' },
    hero: {
      label: 'ABOUT US',
      title: 'We are an AI-first company shaping the future of business',
      sub: 'Born from a passion for data and a vision for what AI can do, Dom Analytics helps organizations unlock their full potential through intelligent technology.',
    },
    mission: {
      label: 'OUR MISSION',
      title: 'Bridging the gap between data and decisions',
      text: 'We believe every business deserves access to <em>world-class AI and analytics</em>. Our mission is to democratize intelligent technology \u2014 making it accessible, practical, and transformative for organizations of all sizes. We don\'t just build solutions. We build <em>competitive advantages</em>.',
    },
    values: {
      label: 'OUR VALUES',
      title: 'What drives us',
      items: [
        { icon: '\u26a1', title: 'Innovation First', desc: 'We stay ahead of the curve, constantly exploring emerging AI technologies and methodologies to deliver cutting-edge solutions.' },
        { icon: '\ud83c\udfaf', title: 'Data-Driven', desc: 'Every decision, every strategy, every solution we build is rooted in data. We let the numbers guide us to the best outcomes.' },
        { icon: '\ud83e\udd1d', title: 'Partnership', desc: 'We embed ourselves in your team. Your challenges become our challenges, and your success is our ultimate measure of achievement.' },
        { icon: '\ud83d\ude80', title: 'Impact Over Hype', desc: 'We focus on delivering real, measurable business results \u2014 not just impressive demos. ROI is our north star.' },
        { icon: '\ud83c\udf0d', title: 'Global Perspective', desc: 'With experience spanning 40+ countries and multiple industries, we bring a diverse, global viewpoint to every project.' },
        { icon: '\ud83d\udee1\ufe0f', title: 'Transparency', desc: 'No black boxes. We explain our methods, share our reasoning, and ensure you understand every step of the journey.' },
      ],
    },
    numbers: {
      label: 'PROVEN RESULTS',
      title: 'Why businesses trust us',
      items: [
        { value: '15+', label: 'Years of experience in data & analytics' },
        { value: '100%', label: 'AI certified team members' },
        { value: '300%', label: 'Proven average revenue growth for clients' },
        { value: '40+', label: 'Countries with delivered solutions' },
      ],
    },
    story: {
      label: 'OUR STORY',
      title: 'From data analyst to AI company',
      col1: '<p>Dom Analytics was founded in 2023 with a clear vision: to bring <em>enterprise-grade AI and analytics capabilities</em> to businesses that need them most. What started as a consulting practice rooted in telecommunications has evolved into a full-spectrum technology partner.</p><p>Our journey began in the world of telecom data, where we spent over a decade mastering the art of turning massive, complex datasets into <em>actionable business strategies</em>. From optimizing network performance across Asia-Pacific to driving 300% revenue growth for global communications companies, we learned that the right data, paired with the right intelligence, can transform any business.</p>',
      col2: '<p>Today, we combine that deep industry expertise with <em>cutting-edge AI and machine learning</em> to serve clients across industries. Whether it\'s building custom LLM integrations, designing predictive analytics platforms, or developing modern web applications, we approach every project with the same data-driven rigor that has defined our career.</p><p>Based in Croatia with a global footprint, Dom Analytics is more than a technology company \u2014 we\'re a team of <em>problem solvers, strategists, and builders</em> who believe that intelligent technology should be accessible to everyone.</p>',
    },
    cta: {
      title: 'Ready to work together?',
      sub: 'Let\'s explore how AI and data can transform your business.',
      btn: 'Get in touch',
    },
    footer: {
      rights: '\u00a9 2026 Dom Analytics. All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
    },
  },
  hr: {
    nav: { services: 'Usluge', tech: 'Tehnologije', about: 'O nama', projects: 'Projekti', contact: 'Kontakt' },
    hero: {
      label: 'O NAMA',
      title: 'AI-first tvrtka koja oblikuje budu\u0107nost poslovanja',
      sub: 'Nastali iz strasti prema podacima i vizije \u0161to AI mo\u017ee u\u010diniti, Dom Analytics poma\u017ee organizacijama otklju\u010dati puni potencijal kroz inteligentnu tehnologiju.',
    },
    mission: {
      label: 'NA\u0160A MISIJA',
      title: 'Premostiti jaz izme\u0111u podataka i odluka',
      text: 'Vjerujemo da svaki posao zaslu\u017euje pristup <em>AI-u i analitici svjetske klase</em>. Na\u0161a misija je demokratizirati inteligentnu tehnologiju \u2014 u\u010diniti je dostupnom, prakti\u010dnom i transformativnom za organizacije svih veli\u010dina. Ne gradimo samo rje\u0161enja. Gradimo <em>konkurentske prednosti</em>.',
    },
    values: {
      label: 'NA\u0160E VRIJEDNOSTI',
      title: '\u0160to nas pokre\u0107e',
      items: [
        { icon: '\u26a1', title: 'Inovacija na prvom mjestu', desc: 'Ostajemo ispred krivulje, konstantno istra\u017euju\u0107i nove AI tehnologije i metodologije za najsuvremenija rje\u0161enja.' },
        { icon: '\ud83c\udfaf', title: 'Vo\u0111eni podacima', desc: 'Svaka odluka, svaka strategija, svako rje\u0161enje koje gradimo ukorijenjeno je u podacima i analizi.' },
        { icon: '\ud83e\udd1d', title: 'Partnerstvo', desc: 'Ugra\u0111ujemo se u va\u0161 tim. Va\u0161i izazovi postaju na\u0161i izazovi, a va\u0161 uspjeh je na\u0161a kona\u010dna mjera postignu\u0107a.' },
        { icon: '\ud83d\ude80', title: 'Utjecaj iznad hype-a', desc: 'Fokusiramo se na isporuku stvarnih, mjerljivih poslovnih rezultata \u2014 ne samo impresivnih demo-a.' },
        { icon: '\ud83c\udf0d', title: 'Globalna perspektiva', desc: 'S iskustvom u 40+ zemalja i vi\u0161e industrija, donosimo raznolik, globalni pogled na svaki projekt.' },
        { icon: '\ud83d\udee1\ufe0f', title: 'Transparentnost', desc: 'Bez crnih kutija. Obja\u0161njavamo metode, dijelimo razmi\u0161ljanja i osiguravamo da razumijete svaki korak.' },
      ],
    },
    numbers: {
      label: 'DOKAZANI REZULTATI',
      title: 'Za\u0161to nam tvrtke vjeruju',
      items: [
        { value: '15+', label: 'Godina iskustva u podacima i analitici' },
        { value: '100%', label: 'AI certificirani \u010dlanovi tima' },
        { value: '300%', label: 'Dokazan prosje\u010dan rast prihoda klijenata' },
        { value: '40+', label: 'Zemalja s isporu\u010denim rje\u0161enjima' },
      ],
    },
    story: {
      label: 'NA\u0160A PRI\u010cA',
      title: 'Od analiti\u010dara podataka do AI tvrtke',
      col1: '<p>Dom Analytics je osnovan 2023. s jasnom vizijom: donijeti <em>AI i analiti\u010dke sposobnosti enterprise razine</em> tvrtkama kojima su najpotrebnije. Ono \u0161to je po\u010delo kao konzultantska praksa ukorijenjena u telekomunikacijama, evoluiralo je u tehnolo\u0161kog partnera punog spektra.</p><p>Na\u0161 put je zapo\u010deo u svijetu telekom podataka, gdje smo proveli vi\u0161e od desetlje\u0107a usavr\u0161avaju\u0107i umjetnost pretvaranja masivnih, slo\u017eenih skupova podataka u <em>djelotvorne poslovne strategije</em>.</p>',
      col2: '<p>Danas kombiniramo duboku industrijsku ekspertizu s <em>najsuvremenijim AI-em i strojnim u\u010denjem</em> za klijente iz razli\u010ditih industrija. Bilo da se radi o izgradnji prilago\u0111enih LLM integracija, dizajniranju platformi za prediktivnu analitiku ili razvoju modernih web aplikacija, svakom projektu pristupamo s istom rigorozno\u0161\u0107u vo\u0111enom podacima.</p><p>Sa sjedi\u0161tem u Hrvatskoj i globalnim dometom, Dom Analytics je vi\u0161e od tehnolo\u0161ke tvrtke \u2014 mi smo tim <em>rje\u0161avatelja problema, stratega i graditelja</em>.</p>',
    },
    cta: {
      title: 'Spremni za suradnju?',
      sub: 'Istra\u017eimo kako AI i podaci mogu transformirati va\u0161e poslovanje.',
      btn: 'Kontaktirajte nas',
    },
    footer: {
      rights: '\u00a9 2026 Dom Analytics. Sva prava pridr\u017eana.',
      privacy: 'Pravila privatnosti',
      terms: 'Uvjeti kori\u0161tenja',
    },
  },
};

export default function About() {
  const [lang, setLang] = useState('en');
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -500, y: -500 });
  const lenisRef = useRef(null);
  const t = content[lang];
  const [missionRef, missionVis] = useReveal();
  const [numbersRef, numbersVis] = useReveal();
  const [storyRef, storyVis] = useReveal();

  useEffect(() => { const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true }); lenisRef.current = lenis; function raf(time) { lenis.raf(time); requestAnimationFrame(raf); } requestAnimationFrame(raf); return () => lenis.destroy(); }, []);
  useEffect(() => { const handler = (e) => setCursorPos({ x: e.clientX, y: e.clientY }); window.addEventListener('mousemove', handler); return () => window.removeEventListener('mousemove', handler); }, []);

  return (
    <>
      <div className="noise" />
      <div className="cursor-glow" style={{ left: cursorPos.x, top: cursorPos.y }} />

      <nav className="nav">
        <Link href="/" className="nav-logo"><span className="nav-logo-text">Dom<span>Analytics</span></span></Link>
        <div className="nav-links">
          <Link href="/#services">{t.nav.services}</Link>
          <Link href="/#tech">{t.nav.tech}</Link>
          <Link href="/about" className="active">{t.nav.about}</Link>
          <Link href="/#contact">{t.nav.contact}</Link>
          <button className="lang-toggle" onClick={() => setLang((l) => (l === 'en' ? 'hr' : 'en'))}>{lang === 'en' ? 'HR' : 'EN'}</button>
        </div>
        <button className="menu-btn" onClick={() => setMenuOpen((o) => !o)}><span /><span /><span /></button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
        <Link href="/about" onClick={() => setMenuOpen(false)}>{t.nav.about}</Link>
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
          <div>
            <LineReveal><p className="section-label">{t.mission.label}</p></LineReveal>
            <h2 className="section-title"><SplitText>{t.mission.title}</SplitText></h2>
          </div>
          <div className={`reveal ${missionVis ? 'visible' : ''}`}>
            <p className="about-mission-text" dangerouslySetInnerHTML={{ __html: t.mission.text }} />
          </div>
        </div>
      </section>

      <section className="about-values">
        <LineReveal><p className="section-label">{t.values.label}</p></LineReveal>
        <h2 className="section-title"><SplitText>{t.values.title}</SplitText></h2>
        <StaggerChildren className="values-grid">
          {t.values.items.map((v, i) => (
            <div key={i} className="value-card">
              <span className="value-icon">{v.icon}</span>
              <h3 className="value-title">{v.title}</h3>
              <p className="value-desc">{v.desc}</p>
            </div>
          ))}
        </StaggerChildren>
      </section>

      <section className="about-numbers" ref={numbersRef}>
        <div className="about-numbers-inner">
          <LineReveal><p className="section-label">{t.numbers.label}</p></LineReveal>
          <h2 className="section-title"><SplitText>{t.numbers.title}</SplitText></h2>
          <StaggerChildren className="numbers-grid">
            {t.numbers.items.map((n, i) => (
              <div key={i} className="number-item">
                <div className="number-value">{n.value}</div>
                <div className="number-label">{n.label}</div>
              </div>
            ))}
          </StaggerChildren>
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

      <footer className="footer">
        <div className="footer-left">{t.footer.rights}</div>
        <div className="footer-links"><a href="#">{t.footer.privacy}</a><a href="#">{t.footer.terms}</a><a href="https://linkedin.com/in/domagojkrusic" target="_blank" rel="noopener noreferrer">LinkedIn</a></div>
      </footer>
    </>
  );
}