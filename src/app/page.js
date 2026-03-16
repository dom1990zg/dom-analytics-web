'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Lenis from 'lenis';
import MatrixGame from './matrix-game';
 
const translations = {
  en: {
    nav: { services: 'Services', tech: 'Technologies', about: 'About', projects: 'Projects', contact: 'Contact' },
    hero: { tagline: 'INNOVATE. ANALYZE. SUCCEED.', headline: 'We build intelligent solutions that transform your business', sub: 'AI-powered consulting, analytics & custom software development', cta: 'Start a project', scroll: 'Scroll to explore' },
    services: { label: 'WHAT WE DO', title: 'Services', items: [
      { num: '01', title: 'AI & Machine Learning', desc: 'Custom AI models, predictive analytics, NLP solutions, and intelligent automation that give your business a competitive edge.', tags: ['LLM Integration', 'Predictive Models', 'Computer Vision', 'NLP'] },
      { num: '02', title: 'Data Analytics & BI', desc: 'Transform raw data into actionable insights. Dashboard design, KPI tracking, and strategic reporting for data-driven decisions.', tags: ['Dashboards', 'Data Pipelines', 'KPI Tracking', 'Reporting'] },
      { num: '03', title: 'Web & App Development', desc: 'Modern, scalable web applications and mobile solutions built with cutting-edge frameworks and cloud-native architecture.', tags: ['React / Next.js', 'Mobile Apps', 'Cloud Native', 'API Design'] },
      { num: '04', title: 'IT Consulting', desc: 'Strategic technology advisory, digital transformation roadmaps, and telecom optimization backed by 15+ years of industry expertise.', tags: ['Digital Strategy', 'Telecom', 'Architecture', 'Optimization'] },
    ]},
    process: { label: 'HOW WE WORK', title: 'Our Process', sub: 'A proven methodology that turns complex challenges into measurable results.', steps: [
      { title: 'Discovery', desc: 'We deep-dive into your business, data landscape, and goals. Through stakeholder interviews and technical audits, we identify opportunities and define the project scope.', icon: '🔍' },
      { title: 'Strategy', desc: 'We design a tailored roadmap with clear milestones, KPIs, and deliverables. You get a transparent plan with timelines and expected ROI before any development begins.', icon: '🎯' },
      { title: 'Build', desc: 'Our team develops your solution using agile sprints with weekly demos. You stay involved at every stage with full visibility into progress and decision-making.', icon: '⚡' },
      { title: 'Launch', desc: 'Rigorous testing, deployment, and knowledge transfer. We ensure your team is equipped to leverage the solution from day one with comprehensive documentation.', icon: '🚀' },
      { title: 'Evolve', desc: 'Post-launch monitoring, optimization, and ongoing support. We track performance metrics and continuously improve your solution as your business grows.', icon: '📈' },
    ]},
    why: { label: 'WHY DOM ANALYTICS', title: 'What\'s in it for you', items: [
      { icon: '🧠', title: '15+ Years of Data Expertise', desc: 'Over 15 years of hands-on experience delivering data-driven growth across 40+ countries, with deep specialization in the telecommunications industry and enterprise analytics.' },
      { icon: '🤖', title: 'AI-First Approach', desc: 'Every solution we build leverages AI and machine learning. We don\'t just consult, we build intelligent systems that automate, predict, and optimize your operations at scale.' },
      { icon: '📊', title: 'Proven Revenue Impact', desc: 'Our track record includes 300% revenue growth on telecom monetization projects and 1500% revenue increase on network optimization initiatives across the APAC region.' },
      { icon: '🤝', title: 'End-to-End Partnership', desc: 'From strategy to deployment and beyond. One team, full accountability. No handoffs, no finger-pointing, just results delivered on time and within budget.' },
    ]},
    tech: { label: 'OUR STACK', title: 'Technologies', sub: 'We leverage best-in-class tools and frameworks to deliver robust, scalable solutions.' },
    contact: { label: 'GET IN TOUCH', title: 'Let\'s build\nsomething great', sub: 'Ready to transform your business with AI and data? Let\'s talk.', name: 'Your name', email: 'Email address', message: 'Tell us about your project', send: 'Send message', sending: 'Sending...', sent: 'Message sent!', error: 'Failed to send. Try again.', info: 'Or reach us directly' },
    footer: { desc: 'AI-powered consulting, data analytics, and custom software development. Building intelligent solutions since 2023.', nav: 'Navigation', home: 'Home', servicesLink: 'Services', techLink: 'Technologies', aboutLink: 'About', projectsLink: 'Projects', connect: 'Connect', rights: '\u00a9 2026 Dom Analytics', privacy: 'Privacy', terms: 'Terms' },
  },
  hr: {
    nav: { services: 'Usluge', tech: 'Tehnologije', about: 'O nama', projects: 'Projekti', contact: 'Kontakt' },
    hero: { tagline: 'INOVIRAJ. ANALIZIRAJ. USPIJ.', headline: 'Gradimo inteligentna rje\u0161enja koja transformiraju poslovanje', sub: 'AI konzalting, analitika i razvoj prilago\u0111enog softvera', cta: 'Zapo\u010dni projekt', scroll: 'Skrolaj za vi\u0161e' },
    services: { label: '\u0160TO RADIMO', title: 'Usluge', items: [
      { num: '01', title: 'AI i strojno u\u010denje', desc: 'Prilago\u0111eni AI modeli, prediktivna analitika, NLP rje\u0161enja i inteligentna automatizacija za konkurentsku prednost.', tags: ['LLM Integracija', 'Prediktivni modeli', 'Ra\u010dunalni vid', 'NLP'] },
      { num: '02', title: 'Analitika podataka i BI', desc: 'Pretvaramo sirove podatke u konkretne uvide. Dizajn dashboarda, pra\u0107enje KPI-eva i strate\u0161ko izvje\u0161tavanje.', tags: ['Dashboardi', 'Data Pipelines', 'KPI pra\u0107enje', 'Izvje\u0161taji'] },
      { num: '03', title: 'Web i App razvoj', desc: 'Moderne, skalabilne web aplikacije i mobilna rje\u0161enja izgra\u0111ena s najnovijim frameworcima i cloud arhitekturom.', tags: ['React / Next.js', 'Mobilne aplikacije', 'Cloud Native', 'API dizajn'] },
      { num: '04', title: 'IT konzalting', desc: 'Strate\u0161ko tehnolo\u0161ko savjetovanje, planovi digitalne transformacije i optimizacija telekoma s 15+ godina iskustva.', tags: ['Digitalna strategija', 'Telekom', 'Arhitektura', 'Optimizacija'] },
    ]},
    process: { label: 'KAKO RADIMO', title: 'Na\u0161 proces', sub: 'Dokazana metodologija koja pretvara slo\u017eene izazove u mjerljive rezultate.', steps: [
      { title: 'Otkrivanje', desc: 'Dubinski analiziramo va\u0161e poslovanje, podatkovnu infrastrukturu i ciljeve. Kroz intervjue i tehni\u010dke revizije identificiramo prilike i definiramo opseg projekta.', icon: '🔍' },
      { title: 'Strategija', desc: 'Dizajniramo prilagođeni plan s jasnim miljokazima, KPI-evima i isporukama. Dobivate transparentan plan s vremenskim okvirima i o\u010dekivanim ROI-em.', icon: '🎯' },
      { title: 'Izgradnja', desc: 'Na\u0161 tim razvija rje\u0161enje koriste\u0107i agilne sprintove s tjednim demo prikazima. Ostajete uklju\u010deni u svakoj fazi s punom vidljivo\u0161\u0107u napretka.', icon: '⚡' },
      { title: 'Lansiranje', desc: 'Rigorozno testiranje, implementacija i prijenos znanja. Osiguravamo da je va\u0161 tim opremljen za kori\u0161tenje rje\u0161enja od prvog dana.', icon: '🚀' },
      { title: 'Evolucija', desc: 'Pra\u0107enje nakon lansiranja, optimizacija i kontinuirana podr\u0161ka. Pratimo metrike performansi i neprestano pobolj\u0161avamo rje\u0161enje.', icon: '📈' },
    ]},
    why: { label: 'ZA\u0160TO DOM ANALYTICS', title: '\u0160to dobivate s nama', items: [
      { icon: '🧠', title: '15+ godina ekspertize', desc: 'Vi\u0161e od 15 godina prakti\u010dnog iskustva u isporuci rasta temeljenog na podacima u 40+ zemalja, s dubokom specijalizacijom u telekomunikacijskoj industriji i enterprise analitici.' },
      { icon: '🤖', title: 'AI-first pristup', desc: 'Svako rje\u0161enje koje gradimo koristi AI i strojno u\u010denje. Ne samo konzultiramo, gradimo inteligentne sustave koji automatiziraju, predvi\u0111aju i optimiziraju va\u0161e operacije.' },
      { icon: '📊', title: 'Dokazan utjecaj na prihod', desc: 'Na\u0161i rezultati uklju\u010duju 300% rast prihoda na projektima monetizacije u telekomu i 1500% rast prihoda na inicijativama optimizacije mre\u017ee u APAC regiji.' },
      { icon: '🤝', title: 'Partnerstvo od po\u010detka do kraja', desc: 'Od strategije do implementacije i dalje. Jedan tim, puna odgovornost. Bez prebacivanja, samo rezultati isporu\u010deni na vrijeme i unutar bud\u017eeta.' },
    ]},
    tech: { label: 'NA\u0160 STACK', title: 'Tehnologije', sub: 'Koristimo vrhunske alate i frameworke za isporuku robusnih, skalabilnih rje\u0161enja.' },
    contact: { label: 'KONTAKTIRAJTE NAS', title: 'Izgradimo ne\u0161to\nveliko zajedno', sub: 'Spremni za transformaciju poslovanja s AI-em i podacima? Razgovarajmo.', name: 'Va\u0161e ime', email: 'Email adresa', message: 'Opi\u0161ite nam svoj projekt', send: 'Po\u0161alji poruku', sending: '\u0160aljem...', sent: 'Poruka poslana!', error: 'Slanje neuspjelo. Poku\u0161ajte ponovo.', info: 'Ili nas kontaktirajte direktno' },
    footer: { desc: 'AI konzalting, analitika podataka i razvoj prilago\u0111enog softvera. Gradimo inteligentna rje\u0161enja od 2023.', nav: 'Navigacija', home: 'Po\u010detna', servicesLink: 'Usluge', techLink: 'Tehnologije', aboutLink: 'O nama', projectsLink: 'Projekti', connect: 'Pove\u017ei se', rights: '\u00a9 2026 Dom Analytics', privacy: 'Privatnost', terms: 'Uvjeti' },
  },
};
 
const techCategories = [
  { name: 'AI & Data', items: ['Python', 'TensorFlow', 'PyTorch', 'OpenAI', 'LangChain', 'Scikit-learn', 'Hugging Face'] },
  { name: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Three.js', 'Framer Motion', 'HTML / CSS'] },
  { name: 'Backend & Cloud', items: ['Node.js', 'PostgreSQL', 'AWS', 'Vercel', 'Docker', 'REST APIs', 'GraphQL'] },
  { name: 'BI & Analytics', items: ['QlikSense', 'Power BI', 'Tableau', 'Google Analytics', 'Pandas', 'Data Modeling', 'ETL Pipelines'] },
  { name: 'Business', items: ['Business Analytics', 'Business Intelligence', 'Business Strategy', 'Salesforce', 'HubSpot', 'Market Research', 'KPI Frameworks'] },
];
 
const marqueeItems = ['Artificial Intelligence', 'Machine Learning', 'Data Analytics', 'Business Intelligence', 'Web Development', 'Cloud Solutions', 'Digital Strategy', 'Predictive Modeling', 'Natural Language Processing', 'Computer Vision', 'API Design', 'Telecom Optimization'];
 
// ─── CUSTOM CURSOR ───
function CustomCursor() {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  useEffect(() => {
    const onMove = (e) => { target.current = { x: e.clientX, y: e.clientY }; };
    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.15;
      pos.current.y += (target.current.y - pos.current.y) * 0.15;
      if (cursorRef.current) { cursorRef.current.style.left = pos.current.x + 'px'; cursorRef.current.style.top = pos.current.y + 'px'; }
      if (dotRef.current) { dotRef.current.style.left = target.current.x + 'px'; dotRef.current.style.top = target.current.y + 'px'; }
      requestAnimationFrame(animate);
    };
    window.addEventListener('mousemove', onMove); requestAnimationFrame(animate);
    const addHoverListeners = () => { document.querySelectorAll('a, button, .service-card, .tech-category, .project-card, .process-card, .why-card').forEach(el => { el.addEventListener('mouseenter', () => setHovering(true)); el.addEventListener('mouseleave', () => setHovering(false)); }); };
    addHoverListeners(); const observer = new MutationObserver(addHoverListeners); observer.observe(document.body, { childList: true, subtree: true });
    return () => { window.removeEventListener('mousemove', onMove); observer.disconnect(); };
  }, []);
  return (<><div ref={cursorRef} className={'custom-cursor' + (hovering ? ' hovering' : '')} /><div ref={dotRef} className={'custom-cursor-dot' + (hovering ? ' hovering' : '')} /></>);
}
 
// ─── SCROLL PROGRESS ───
function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => { const u = () => { const s = window.scrollY; const d = document.documentElement.scrollHeight - window.innerHeight; setP(d > 0 ? (s / d) * 100 : 0); }; window.addEventListener('scroll', u, { passive: true }); return () => window.removeEventListener('scroll', u); }, []);
  return <div className="scroll-progress" style={{ width: p + '%' }} />;
}
 
// ─── CONTACT FORM ───
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
  const btnText = status === 'sending' ? t.contact.sending : status === 'sent' ? t.contact.sent : status === 'error' ? t.contact.error : t.contact.send;
  return (
    <div className="contact-form">
      <div className="form-field"><input type="text" placeholder={t.contact.name} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
      <div className="form-field"><input type="email" placeholder={t.contact.email} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
      <div className="form-field"><textarea placeholder={t.contact.message} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
      <button className={'submit-btn ' + (status === 'sent' ? 'sent' : '') + (status === 'error' ? 'error' : '')} onClick={handleSubmit} disabled={status === 'sending'} style={{ opacity: status === 'sending' ? 0.6 : 1 }}>{btnText}</button>
    </div>
  );
}
 
// ─── EXISTING COMPONENTS ───
function ParticleCanvas() {
  const cv = useRef(null); const an = useRef(null); const ms = useRef({ x: -1000, y: -1000 });
  useEffect(() => {
    const canvas = cv.current; if (!canvas) return; const ctx = canvas.getContext('2d'); let w, h, pts;
    const rs = () => { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; };
    const init = () => { rs(); const cnt = Math.min(Math.floor((w * h) / 10000), 90); pts = Array.from({ length: cnt }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, r: Math.random() * 1.5 + 0.3 })); };
    const dr = () => { ctx.clearRect(0, 0, w, h); const mx = ms.current.x, my = ms.current.y; for (let i = 0; i < pts.length; i++) { const p = pts[i]; p.x += p.vx; p.y += p.vy; if (p.x < 0) p.x = w; if (p.x > w) p.x = 0; if (p.y < 0) p.y = h; if (p.y > h) p.y = 0; const dM = Math.hypot(p.x - mx, p.y - my); const gl = dM < 180 ? 1 - dM / 180 : 0; ctx.beginPath(); ctx.arc(p.x, p.y, p.r + gl * 2.5, 0, Math.PI * 2); ctx.fillStyle = `rgba(0,194,203,${0.2 + gl * 0.8})`; ctx.fill(); for (let j = i + 1; j < pts.length; j++) { const q = pts[j]; const d = Math.hypot(p.x - q.x, p.y - q.y); if (d < 120) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.strokeStyle = `rgba(0,194,203,${0.06 * (1 - d / 120)})`; ctx.lineWidth = 0.5; ctx.stroke(); } } } an.current = requestAnimationFrame(dr); };
    init(); dr(); window.addEventListener('resize', rs);
    const hm = (e) => { const rect = canvas.getBoundingClientRect(); ms.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }; };
    canvas.addEventListener('mousemove', hm);
    return () => { cancelAnimationFrame(an.current); window.removeEventListener('resize', rs); canvas.removeEventListener('mousemove', hm); };
  }, []);
  return <canvas ref={cv} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'auto', zIndex: 2 }} />;
}
 
function ParallaxHero({ children }) {
  const hr = useRef(null); const cr = useRef(null); const mr = useRef(null);
  useEffect(() => { const hs = () => { const s = window.scrollY; const hh = hr.current?.offsetHeight || 1; if (s > hh) return; const r = s / hh; if (cr.current) { cr.current.style.transform = `translateY(${s * 0.3}px)`; cr.current.style.opacity = `${1 - r * 1.2}`; } if (mr.current) { mr.current.style.transform = `translateY(${s * -0.15}px) scale(${1 + r * 0.1})`; } }; window.addEventListener('scroll', hs, { passive: true }); return () => window.removeEventListener('scroll', hs); }, []);
  return (<section className="hero" ref={hr}><div className="hero-mesh" ref={mr}><div className="hero-mesh-orb" /><div className="hero-mesh-orb" /><div className="hero-mesh-orb" /><div className="hero-mesh-orb" /><div className="hero-mesh-orb" /></div><div className="hero-grid" /><div className="hero-ring" /><ParticleCanvas /><div className="hero-horizon" /><div ref={cr} style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>{children}</div></section>);
}
 
function useReveal(th = 0.15) { const ref = useRef(null); const [v, setV] = useState(false); useEffect(() => { const el = ref.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: th }); obs.observe(el); return () => obs.disconnect(); }, [th]); return [ref, v]; }
function SplitText({ children, className = '', center = false }) { const r = useRef(null); const [v, setV] = useState(false); useEffect(() => { const el = r.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.2 }); obs.observe(el); return () => obs.disconnect(); }, []); const w = String(children).split(' '); return (<span ref={r} className={`split-text ${center ? 'center' : ''} ${className}`}>{w.map((word, i) => (<span key={i} className={`split-word ${v ? 'visible' : ''}`} style={{ transitionDelay: `${i * 0.05}s` }}>{word}</span>))}</span>); }
function LineReveal({ children, delay = 0 }) { const r = useRef(null); const [v, setV] = useState(false); useEffect(() => { const el = r.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.3 }); obs.observe(el); return () => obs.disconnect(); }, []); return (<div className="line-mask" ref={r}><div className={`line-inner ${v ? 'visible' : ''}`} style={{ transitionDelay: `${delay}s` }}>{children}</div></div>); }
function StaggerChildren({ children, className = '' }) { const r = useRef(null); const [v, setV] = useState(false); useEffect(() => { const el = r.current; if (!el) return; const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.1 }); obs.observe(el); return () => obs.disconnect(); }, []); return (<div ref={r} className={className}>{Array.isArray(children) ? children.map((child, i) => (<div key={i} className={`stagger-item ${v ? 'visible' : ''}`} style={{ transitionDelay: `${i * 0.1}s` }}>{child}</div>)) : children}</div>); }
function MagneticButton({ children, className, onClick, disabled }) { const b = useRef(null); const [o, setO] = useState({ x: 0, y: 0 }); const hm = (e) => { const rect = b.current.getBoundingClientRect(); setO({ x: (e.clientX - rect.left - rect.width / 2) * 0.2, y: (e.clientY - rect.top - rect.height / 2) * 0.2 }); }; return (<button ref={b} className={className} onClick={onClick} disabled={disabled} onMouseMove={hm} onMouseLeave={() => setO({ x: 0, y: 0 })} style={{ transform: `translate(${o.x}px, ${o.y}px)`, transition: 'transform 0.3s cubic-bezier(0.23,1,0.32,1)', opacity: disabled ? 0.6 : 1 }}>{children}</button>); }
function TiltCard({ children }) { const c = useRef(null); const g = useRef(null); const hm = (e) => { const card = c.current; if (!card) return; const rect = card.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top; card.style.transform = `perspective(800px) rotateX(${((y - rect.height / 2) / (rect.height / 2)) * -6}deg) rotateY(${((x - rect.width / 2) / (rect.width / 2)) * 6}deg) scale(1.02)`; if (g.current) { g.current.style.left = `${x}px`; g.current.style.top = `${y}px`; } }; const hl = () => { if (c.current) c.current.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)'; }; return (<div className="tilt-wrapper" onMouseMove={hm} onMouseLeave={hl}><div ref={c} className="service-card"><div ref={g} className="service-card-glow" />{children}</div></div>); }
function Marquee() { const d = [...marqueeItems, ...marqueeItems]; return (<div className="marquee-section"><div className="marquee-track">{d.map((item, i) => (<span key={i} className="marquee-item"><span className="marquee-dot" />{item}</span>))}</div></div>); }
 
function BigFooter({ t }) {
  return (
    <footer className="big-footer">
      <div className="big-footer-mesh"><div className="big-footer-orb" /><div className="big-footer-orb" /></div>
      <div className="big-footer-inner">
        <div className="big-footer-cta"><h3 className="big-footer-cta-title">Ready to transform your business?</h3><p className="big-footer-cta-sub">Let&apos;s discuss how AI and data can accelerate your growth.</p><Link href="/#contact" className="cta-btn">Get in touch</Link></div>
        <div className="big-footer-top">
          <div className="big-footer-brand"><div className="big-footer-logo">Dom<span>Analytics</span></div><p className="big-footer-desc">{t.footer.desc}</p><div className="big-footer-social"><a href="https://www.linkedin.com/company/dom-analytics" target="_blank" rel="noopener noreferrer">in</a><a href="mailto:info@domanalytics.com">@</a></div></div>
          <div className="big-footer-col"><h4>{t.footer.nav}</h4><Link href="/">{t.footer.home}</Link><Link href="/#services">{t.footer.servicesLink}</Link><Link href="/about">{t.footer.aboutLink}</Link><Link href="/projects">{t.footer.projectsLink}</Link></div>
          <div className="big-footer-col"><h4>{t.footer.connect}</h4><a href="mailto:info@domanalytics.com">info@domanalytics.com</a><a href="https://www.linkedin.com/company/dom-analytics" target="_blank" rel="noopener noreferrer">LinkedIn</a></div>
          <div className="big-footer-col"><h4>Location</h4><a href="#">Pore&#269;, Croatia</a><a href="#">Zagreb, Croatia</a><a href="#">Global Remote</a></div>
        </div>
        <div className="big-footer-bottom"><span>{t.footer.rights}</span><div><a href="#">{t.footer.privacy}</a><a href="#">{t.footer.terms}</a></div></div>
      </div>
    </footer>
  );
}
 
// ─── MAIN ───
export default function Home() {
  const [lang, setLang] = useState('en');
  const [menuOpen, setMenuOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -500, y: -500 });
  const [scrolled, setScrolled] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const lenisRef = useRef(null);
  const t = translations[lang];
  const [servRef, servVis] = useReveal();
  const [processRef, processVis] = useReveal();
  const [whyRef, whyVis] = useReveal();
  const [techRef, techVis] = useReveal();
  const [contactRef, contactVis] = useReveal();
 
  useEffect(() => { const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true }); lenisRef.current = lenis; function raf(time) { lenis.raf(time); requestAnimationFrame(raf); } requestAnimationFrame(raf); return () => lenis.destroy(); }, []);
  useEffect(() => { const h = (e) => setCursorPos({ x: e.clientX, y: e.clientY }); window.addEventListener('mousemove', h); return () => window.removeEventListener('mousemove', h); }, []);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 60); window.addEventListener('scroll', h, { passive: true }); return () => window.removeEventListener('scroll', h); }, []);
  useEffect(() => { if (menuOpen) { document.body.style.overflow = 'hidden'; } else { document.body.style.overflow = ''; } return () => { document.body.style.overflow = ''; }; }, [menuOpen]);
  useEffect(() => { const h = (e) => { if (e.key === 'Escape' && showEasterEgg) setShowEasterEgg(false); }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, [showEasterEgg]);
  const scrollTo = useCallback((id) => { setMenuOpen(false); const el = document.getElementById(id); if (el && lenisRef.current) lenisRef.current.scrollTo(el, { offset: -80 }); }, []);
 
  return (
    <>
      <div className="noise" />
      {showEasterEgg && <MatrixGame onClose={() => setShowEasterEgg(false)} />}
      <ScrollProgress />
      <CustomCursor />
      <div className="cursor-glow" style={{ left: cursorPos.x, top: cursorPos.y }} />
 
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
        <a href="/" className="nav-logo" onClick={(e) => { e.preventDefault(); const n = logoClicks + 1; setLogoClicks(n); if (n >= 5) { setShowEasterEgg(true); setLogoClicks(0); } }}><span className="nav-logo-text">Dom<span>Analytics</span></span></a>
        <div className="nav-links">
          <a href="#services" onClick={(e) => { e.preventDefault(); scrollTo('services'); }}>{t.nav.services}</a>
          <a href="#tech" onClick={(e) => { e.preventDefault(); scrollTo('tech'); }}>{t.nav.tech}</a>
          <Link href="/about">{t.nav.about}</Link>
          <Link href="/projects">{t.nav.projects}</Link>
          <a href="#contact" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>{t.nav.contact}</a>
          <button className="lang-toggle" onClick={() => setLang((l) => (l === 'en' ? 'hr' : 'en'))}>{lang === 'en' ? 'HR' : 'EN'}</button>
        </div>
        <button className={`menu-btn ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen((o) => !o)}><span /><span /><span /></button>
      </nav>
 
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <a href="#" onClick={(e) => { e.preventDefault(); scrollTo('services'); }}>{t.nav.services}</a>
        <a href="#" onClick={(e) => { e.preventDefault(); scrollTo('tech'); }}>{t.nav.tech}</a>
        <Link href="/about" onClick={() => setMenuOpen(false)}>{t.nav.about}</Link>
        <Link href="/projects" onClick={() => setMenuOpen(false)}>{t.nav.projects}</Link>
        <a href="#" onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>{t.nav.contact}</a>
        <button className="lang-toggle" onClick={() => { setLang((l) => (l === 'en' ? 'hr' : 'en')); setMenuOpen(false); }}>{lang === 'en' ? 'HR' : 'EN'}</button>
        <a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); }} style={{ fontSize: 16, color: 'var(--text-dim)', marginTop: 20 }}>{'\u2715'} Close</a>
      </div>
 
      <ParallaxHero>
        <LineReveal><p className="hero-tagline">{t.hero.tagline}</p></LineReveal>
        <h1 className="hero-headline"><SplitText center>{t.hero.headline}</SplitText></h1>
        <LineReveal delay={0.4}><p className="hero-sub" style={{ textAlign: 'center' }}>{t.hero.sub}</p></LineReveal>
        <div className="hero-cta" style={{ opacity: 0, animation: 'fadeUp 1s 0.8s forwards' }}><MagneticButton className="cta-btn" onClick={() => scrollTo('contact')}>{t.hero.cta}</MagneticButton></div>
        <div className="scroll-ind"><span>{t.hero.scroll}</span><div className="scroll-line" /></div>
      </ParallaxHero>
 
      <Marquee />
 
      {/* ─── SERVICES ─── */}
      <section id="services" className="section" ref={servRef}>
        <LineReveal><p className="section-label">{t.services.label}</p></LineReveal>
        <h2 className="section-title"><SplitText>{t.services.title}</SplitText></h2>
        <StaggerChildren className="services-grid">
          {t.services.items.map((s, i) => (
            <TiltCard key={i}>
              <div className="service-num">{s.num}</div>
              <h3 className="service-title">{s.title}</h3>
              <p className="service-desc">{s.desc}</p>
              <div className="service-tags">{s.tags.map((tag, j) => <span key={j} className="service-tag">{tag}</span>)}</div>
            </TiltCard>
          ))}
        </StaggerChildren>
      </section>
 
      <div className="section-divider" />
 
      {/* ─── HOW WE WORK ─── */}
      <section id="process" className="process-section" ref={processRef}>
        <div className="section">
          <LineReveal><p className="section-label">{t.process.label}</p></LineReveal>
          <h2 className="section-title"><SplitText>{t.process.title}</SplitText></h2>
          <LineReveal delay={0.2}><p className="section-sub">{t.process.sub}</p></LineReveal>
          <StaggerChildren className="process-grid">
            {t.process.steps.map((step, i) => (
              <div key={i} className="process-card">
                <div className="process-card-icon">{step.icon}</div>
                <h3 className="process-card-title">{step.title}</h3>
                <p className="process-card-desc">{step.desc}</p>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>
 
      <div className="section-divider" />
 
      {/* ─── WHY DOM ANALYTICS ─── */}
      <section id="why" className="section" ref={whyRef}>
        <LineReveal><p className="section-label">{t.why.label}</p></LineReveal>
        <h2 className="section-title"><SplitText>{t.why.title}</SplitText></h2>
        <StaggerChildren className="why-grid">
          {t.why.items.map((item, i) => (
            <div key={i} className="why-card">
              <div className="why-card-icon">{item.icon}</div>
              <h3 className="why-card-title">{item.title}</h3>
              <p className="why-card-desc">{item.desc}</p>
            </div>
          ))}
        </StaggerChildren>
      </section>
 
      <div className="section-divider" />
 
      {/* ─── TECHNOLOGIES ─── */}
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
 
      {/* ─── CONTACT ─── */}
      <section id="contact" className="contact-section" ref={contactRef}>
        <div className="section" style={{ paddingTop: 100, paddingBottom: 100 }}>
          <div className={`contact-layout reveal ${contactVis ? 'visible' : ''}`}>
            <div>
              <LineReveal><p className="section-label">{t.contact.label}</p></LineReveal>
              <h2 className="section-title contact-title"><SplitText>{t.contact.title}</SplitText></h2>
              <LineReveal delay={0.3}><p className="section-sub" style={{ marginTop: 16 }}>{t.contact.sub}</p></LineReveal>
              <div className="contact-info"><p>{t.contact.info}</p><a href="mailto:info@domanalytics.com">info@domanalytics.com</a></div>
            </div>
            <ContactForm t={t} />
          </div>
        </div>
      </section>
 
      <BigFooter t={t} />
    </>
  );
}