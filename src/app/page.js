'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Lenis from 'lenis';

const translations = {
  en: {
    nav: { services: 'Services', tech: 'Technologies', about: 'About', projects: 'Projects', contact: 'Contact' },
    hero: {
      tagline: 'INNOVATE. ANALYZE. SUCCEED.',
      headline: 'We build intelligent solutions that transform your business',
      sub: 'AI-powered consulting, analytics & custom software development',
      cta: 'Start a project',
      scroll: 'Scroll to explore',
    },
    services: {
      label: 'WHAT WE DO',
      title: 'Services',
      items: [
        { num: '01', title: 'AI & Machine Learning', desc: 'Custom AI models, predictive analytics, NLP solutions, and intelligent automation that give your business a competitive edge.', tags: ['LLM Integration', 'Predictive Models', 'Computer Vision', 'NLP'] },
        { num: '02', title: 'Data Analytics & BI', desc: 'Transform raw data into actionable insights. Dashboard design, KPI tracking, and strategic reporting for data-driven decisions.', tags: ['Dashboards', 'Data Pipelines', 'KPI Tracking', 'Reporting'] },
        { num: '03', title: 'Web & App Development', desc: 'Modern, scalable web applications and mobile solutions built with cutting-edge frameworks and cloud-native architecture.', tags: ['React / Next.js', 'Mobile Apps', 'Cloud Native', 'API Design'] },
        { num: '04', title: 'IT Consulting', desc: 'Strategic technology advisory, digital transformation roadmaps, and telecom optimization backed by 12+ years of industry expertise.', tags: ['Digital Strategy', 'Telecom', 'Architecture', 'Optimization'] },
      ],
    },
    tech: {
      label: 'OUR STACK',
      title: 'Technologies',
      sub: 'We leverage best-in-class tools and frameworks to deliver robust, scalable solutions.',
    },
    contact: {
      label: 'GET IN TOUCH',
      title: 'Let\'s build\nsomething great',
      sub: 'Ready to transform your business with AI and data? Let\'s talk.',
      name: 'Your name',
      email: 'Email address',
      message: 'Tell us about your project',
      send: 'Send message',
      info: 'Or reach us directly',
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
      tagline: 'INOVIRAJ. ANALIZIRAJ. USPIJ.',
      headline: 'Gradimo inteligentna rje\u0161enja koja transformiraju poslovanje',
      sub: 'AI konzalting, analitika i razvoj prilago\u0111enog softvera',
      cta: 'Zapo\u010dni projekt',
      scroll: 'Skrolaj za vi\u0161e',
    },
    services: {
      label: '\u0160TO RADIMO',
      title: 'Usluge',
      items: [
        { num: '01', title: 'AI i strojno u\u010denje', desc: 'Prilago\u0111eni AI modeli, prediktivna analitika, NLP rje\u0161enja i inteligentna automatizacija za konkurentsku prednost.', tags: ['LLM Integracija', 'Prediktivni modeli', 'Ra\u010dunalni vid', 'NLP'] },
        { num: '02', title: 'Analitika podataka i BI', desc: 'Pretvaramo sirove podatke u konkretne uvide. Dizajn dashboarda, pra\u0107enje KPI-eva i strate\u0161ko izvje\u0161tavanje.', tags: ['Dashboardi', 'Data Pipelines', 'KPI pra\u0107enje', 'Izvje\u0161taji'] },
        { num: '03', title: 'Web i App razvoj', desc: 'Moderne, skalabilne web aplikacije i mobilna rje\u0161enja izgra\u0111ena s najnovijim frameworcima i cloud arhitekturom.', tags: ['React / Next.js', 'Mobilne aplikacije', 'Cloud Native', 'API dizajn'] },
        { num: '04', title: 'IT konzalting', desc: 'Strate\u0161ko tehnolo\u0161ko savjetovanje, planovi digitalne transformacije i optimizacija telekoma s 12+ godina iskustva.', tags: ['Digitalna strategija', 'Telekom', 'Arhitektura', 'Optimizacija'] },
      ],
    },
    tech: {
      label: 'NA\u0160 STACK',
      title: 'Tehnologije',
      sub: 'Koristimo vrhunske alate i frameworke za isporuku robusnih, skalabilnih rje\u0161enja.',
    },
    contact: {
      label: 'KONTAKTIRAJTE NAS',
      title: 'Izgradimo ne\u0161to\nveliko zajedno',
      sub: 'Spremni za transformaciju poslovanja s AI-em i podacima? Razgovarajmo.',
      name: 'Va\u0161e ime',
      email: 'Email adresa',
      message: 'Opi\u0161ite nam svoj projekt',
      send: 'Po\u0161alji poruku',
      info: 'Ili nas kontaktirajte direktno',
    },
    footer: {
      rights: '\u00a9 2026 Dom Analytics. Sva prava pridr\u017eana.',
      privacy: 'Pravila privatnosti',
      terms: 'Uvjeti kori\u0161tenja',
    },
  },
};

const techCategories = [
  { name: 'AI & Data', items: ['Python', 'TensorFlow', 'PyTorch', 'OpenAI', 'LangChain', 'Pandas', 'Scikit-learn', 'Hugging Face'] },
  { name: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Three.js', 'Framer Motion'] },
  { name: 'Backend & Cloud', items: ['Node.js', 'PostgreSQL', 'AWS', 'Vercel', 'Docker', 'REST APIs', 'GraphQL'] },
  { name: 'BI & Analytics', items: ['QlikSense', 'Power BI', 'Tableau', 'Salesforce', 'HubSpot', 'Google Analytics'] },
];

function ParticleCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles;
    const resize = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    const init = () => {
      resize();
      const count = Math.min(Math.floor((w * h) / 10000), 90);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.3,
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const mx = mouseRef.current.x, my = mouseRef.current.y;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        const dM = Math.hypot(p.x - mx, p.y - my);
        const glow = dM < 180 ? 1 - dM / 180 : 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r + glow * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,194,203,${0.2 + glow * 0.8})`; ctx.fill();
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]; const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 120) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(0,194,203,${0.06 * (1 - d / 120)})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      animRef.current = requestAnimationFrame(draw);
    };
    init(); draw();
    window.addEventListener('resize', resize);
    const handleMouse = (e) => { const rect = canvas.getBoundingClientRect(); mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }; };
    canvas.addEventListener('mousemove', handleMouse);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize); canvas.removeEventListener('mousemove', handleMouse); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'auto', zIndex: 2 }} />;
}

function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function SplitText({ children, className = '', center = false }) {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  const words = String(children).split(' ');
  return (
    <span ref={containerRef} className={`split-text ${center ? 'center' : ''} ${className}`}>
      {words.map((word, i) => (
        <span key={i} className={`split-word ${visible ? 'visible' : ''}`} style={{ transitionDelay: `${i * 0.05}s` }}>{word}</span>
      ))}
    </span>
  );
}

function LineReveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div className="line-mask" ref={ref}>
      <div className={`line-inner ${visible ? 'visible' : ''}`} style={{ transitionDelay: `${delay}s` }}>{children}</div>
    </div>
  );
}

function StaggerChildren({ children, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}>
      {Array.isArray(children) ? children.map((child, i) => (
        <div key={i} className={`stagger-item ${visible ? 'visible' : ''}`} style={{ transitionDelay: `${i * 0.1}s` }}>{child}</div>
      )) : children}
    </div>
  );
}

function MagneticButton({ children, className, onClick }) {
  const btnRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const handleMove = (e) => { const rect = btnRef.current.getBoundingClientRect(); setOffset({ x: (e.clientX - rect.left - rect.width / 2) * 0.2, y: (e.clientY - rect.top - rect.height / 2) * 0.2 }); };
  return (
    <button ref={btnRef} className={className} onClick={onClick}
      onMouseMove={handleMove} onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)`, transition: 'transform 0.3s cubic-bezier(0.23,1,0.32,1)' }}>
      {children}
    </button>
  );
}

export default function Home() {
  const [lang, setLang] = useState('en');
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -500, y: -500 });
  const lenisRef = useRef(null);
  const t = translations[lang];
  const [servRef, servVis] = useReveal();
  const [techRef, techVis] = useReveal();
  const [contactRef, contactVis] = useReveal();

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenisRef.current = lenis;
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    const handler = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  const scrollTo = useCallback((id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el && lenisRef.current) lenisRef.current.scrollTo(el, { offset: -80 });
  }, []);

  return (
    <>
      <div className="noise" />
      <div className="cursor-glow" style={{ left: cursorPos.x, top: cursorPos.y }} />

      <nav className="nav">
        <Link href="/" className="nav-logo">
          <span className="nav-logo-text">Dom<span>Analytics</span></span>
        </Link>
        <div className="nav-links">
          <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services'); }}>{t.nav.services}</a>
          <a href="#tech" onClick={(e) => { e.preventDefault(); scrollTo('tech'); }}>{t.nav.tech}</a>
          <Link href="/about">{t.nav.about}</Link>
          <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>{t.nav.contact}</a>
          <button className="lang-toggle" onClick={() => setLang((l) => (l === 'en' ? 'hr' : 'en'))}>
            {lang === 'en' ? 'HR' : 'EN'}
          </button>
        </div>
        <button className="menu-btn" onClick={() => setMenuOpen((o) => !o)}>
          <span /><span /><span />
        </button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <a href="#" onClick={(e) => { e.preventDefault(); scrollTo('services'); }}>{t.nav.services}</a>
        <a href="#" onClick={(e) => { e.preventDefault(); scrollTo('tech'); }}>{t.nav.tech}</a>
        <Link href="/about" onClick={() => setMenuOpen(false)}>{t.nav.about}</Link>
        <a href="#" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>{t.nav.contact}</a>
        <button className="lang-toggle" onClick={() => { setLang((l) => (l === 'en' ? 'hr' : 'en')); setMenuOpen(false); }}>
          {lang === 'en' ? 'HR' : 'EN'}
        </button>
        <a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); }} style={{ fontSize: 16, color: 'var(--text-dim)', marginTop: 20 }}>{'\u2715'} Close</a>
      </div>

      <section className="hero">
        <div className="hero-mesh"><div className="hero-mesh-orb" /><div className="hero-mesh-orb" /><div className="hero-mesh-orb" /><div className="hero-mesh-orb" /><div className="hero-mesh-orb" /></div>
        <div className="hero-grid" />
        <div className="hero-ring" />
        <ParticleCanvas />
        <div className="hero-horizon" />
        <div style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <LineReveal><p className="hero-tagline">{t.hero.tagline}</p></LineReveal>
          <h1 className="hero-headline"><SplitText center>{t.hero.headline}</SplitText></h1>
          <LineReveal delay={0.4}><p className="hero-sub" style={{ textAlign: 'center' }}>{t.hero.sub}</p></LineReveal>
          <div className="hero-cta" style={{ opacity: 0, animation: 'fadeUp 1s 0.8s forwards' }}>
            <MagneticButton className="cta-btn" onClick={() => scrollTo('contact')}>{t.hero.cta}</MagneticButton>
          </div>
        </div>
        <div className="scroll-ind"><span>{t.hero.scroll}</span><div className="scroll-line" /></div>
      </section>

      <div className="section-divider" />

      <section id="services" className="section" ref={servRef}>
        <LineReveal><p className="section-label">{t.services.label}</p></LineReveal>
        <h2 className="section-title"><SplitText>{t.services.title}</SplitText></h2>
        <StaggerChildren className="services-grid">
          {t.services.items.map((s, i) => (
            <div key={i} className="service-card">
              <div className="service-num">{s.num}</div>
              <h3 className="service-title">{s.title}</h3>
              <p className="service-desc">{s.desc}</p>
              <div className="service-tags">{s.tags.map((tag, j) => <span key={j} className="service-tag">{tag}</span>)}</div>
            </div>
          ))}
        </StaggerChildren>
      </section>

      <div className="section-divider" />

      <section id="tech" className="section" ref={techRef}>
        <LineReveal><p className="section-label">{t.tech.label}</p></LineReveal>
        <h2 className="section-title"><SplitText>{t.tech.title}</SplitText></h2>
        <LineReveal delay={0.2}><p className="section-sub">{t.tech.sub}</p></LineReveal>
        <StaggerChildren className="tech-grid">
          {techCategories.map((cat, i) => (
            <div key={i} className="tech-category">
              <div className="tech-cat-name">{cat.name}</div>
              {cat.items.map((item, j) => <div key={j} className="tech-item">{item}</div>)}
            </div>
          ))}
        </StaggerChildren>
      </section>

      <section id="contact" className="contact-section" ref={contactRef}>
        <div className="section" style={{ paddingTop: 100, paddingBottom: 100 }}>
          <div className={`contact-layout reveal ${contactVis ? 'visible' : ''}`}>
            <div>
              <LineReveal><p className="section-label">{t.contact.label}</p></LineReveal>
              <h2 className="section-title contact-title"><SplitText>{t.contact.title}</SplitText></h2>
              <LineReveal delay={0.3}><p className="section-sub" style={{ marginTop: 16 }}>{t.contact.sub}</p></LineReveal>
              <div className="contact-info">
                <p>{t.contact.info}</p>
                <a href="mailto:dom.krusic@gmail.com">dom.krusic@gmail.com</a>
                <a href="tel:+385994385030">+385 99 438 5030</a>
              </div>
            </div>
            <div className="contact-form">
              <div className="form-field"><input type="text" placeholder={t.contact.name} /></div>
              <div className="form-field"><input type="email" placeholder={t.contact.email} /></div>
              <div className="form-field"><textarea placeholder={t.contact.message} /></div>
              <MagneticButton className="submit-btn">{t.contact.send}</MagneticButton>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-left">{t.footer.rights}</div>
        <div className="footer-links">
          <a href="#">{t.footer.privacy}</a>
          <a href="#">{t.footer.terms}</a>
          <a href="https://linkedin.com/in/domagojkrusic" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </footer>
    </>
  );
}