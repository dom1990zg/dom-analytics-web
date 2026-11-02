'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Lenis from 'lenis';
import MatrixGame from './matrix-game';
 
const translations = {
  en: {
    nav: { services: 'Services', telecom: 'Telecom', tech: 'Technologies', about: 'About', projects: 'Projects', contact: 'Contact' },
    hero: { tagline: 'DATA AND TELECOM ADVISORY', headline: 'Data strategy and commercial advisory, from people who ran the numbers', sub: 'Fractional CDO, BI and data monetization for companies in telecom, tech and enterprise. 15+ years in the data layer, 14 A2P SMS and Voice monetization projects with operators across MENA and APAC.', cta: 'Talk to us', scroll: 'Scroll to explore' },
    services: { label: 'WHAT WE DO', title: 'Services', items: [
      { num: '01', title: 'Fractional CDO', desc: 'C-level data leadership on demand. We embed as your Chief Data Officer, defining data vision, building governance frameworks, aligning your data strategy with business outcomes. No full-time hire needed.', tags: ['Data Vision', 'CDO as a Service', 'Data Governance', 'Executive Advisory'] },
      { num: '02', title: 'Data Strategy & Enablement', desc: 'We audit your data landscape, eliminate silos, and build the infrastructure that makes data a true business asset. From raw data to decisions, we enable your team to extract maximum value at every step.', tags: ['Data Audit', 'Data Architecture', 'Data Enablement', 'ROI Optimization'] },
      { num: '03', title: 'AI & Machine Learning', desc: 'Custom AI models, predictive analytics, LLM integrations and intelligent automation built on clean, governed data. AI that holds up in production, because the data underneath it is solid.', tags: ['LLM Integration', 'Predictive Models', 'NLP', 'Automation'] },
      { num: '04', title: 'BI & Analytics', desc: 'Executive dashboards, KPI frameworks and real-time reporting that turn your data into decisions. We build BI your leadership team opens every Monday: clear, fast and tied to the numbers they are measured on.', tags: ['PowerBI', 'QlikSense', 'KPI Frameworks', 'Data Pipelines'] },
      { num: '05', title: 'Data Monetization', desc: 'We identify untapped revenue streams hidden in your data. From pricing optimization to new product discovery, we have delivered 300 to 1500% revenue growth on telecom routes by fixing the commercial model, not just the reporting.', tags: ['Revenue Growth', 'Data Products', 'Pricing Strategy', 'Monetization'] },
      { num: '06', title: 'Web & App Development', desc: 'Data-powered web applications and digital platforms built to scale. We build the interfaces that bring your data to life, from internal tools to customer-facing products.', tags: ['React / Next.js', 'Mobile Apps', 'Data Dashboards', 'API Design'] },
    ]},
    process: { label: 'HOW WE WORK', title: 'How an engagement runs', sub: 'Every engagement starts small and fixed-scope. You see the numbers before you commit to anything bigger.', steps: [
      { title: 'Diagnostic', desc: 'Two to three weeks inside your data and your commercial setup. We read what exists, talk to the people who own it, and name the gaps and the quick wins.' },
      { title: 'Written recommendation', desc: 'You get a document, not a deck: what to change, in what order, what it costs and what it should return. No build starts before you have agreed with it.' },
      { title: 'Build', desc: 'We do the work with your team in short cycles, with a demo every week. Pipelines, dashboards, models or a commercial model for a tender, depending on the engagement.' },
      { title: 'Handover', desc: 'We train the people who will run it and leave documentation they will use. The goal is that you do not need us for day-to-day operation.' },
      { title: 'Follow-up', desc: 'Monthly check-ins on the metrics we agreed at the start. We adjust when the business changes, and we say so when something is not working.' },
    ]},
    why: { label: 'WHY DOM ANALYTICS', title: 'Why work with us', items: [
      { title: 'We have sat in the chair', desc: '15+ years in data and telecom across 40+ countries. We have held the CDO seat, built BI departments from scratch and owned the revenue line, so advice comes from having done it, not from a framework.' },
      { title: 'Foundation before dashboards', desc: 'We clean, structure and govern the data before anyone builds on it. Reports and AI on bad data give you confident wrong answers.' },
      { title: 'Revenue you can trace', desc: 'A2P SMS monetization work delivered 400% revenue growth with a mobile operator in MENA and 1500% with a mobile operator in APAC, through partnership structure, commercial terms and pricing.' },
      { title: 'AI where it pays off', desc: 'We build AI on governed data and only where a model beats a simpler rule. No AI for the sake of the slide.' },
    ]},
    tech: { label: 'OUR STACK', title: 'Technologies', sub: 'The tools we work in day to day. We pick the stack to fit your team, not the other way round.' },
    contact: { label: 'GET IN TOUCH', title: 'Let\'s build\nsomething great', sub: 'Tell us where your data or your A2P revenue stands today. 20 minutes is enough to check the fit.', name: 'Your name', email: 'Email address', message: 'Tell us about your project', send: 'Send message', sending: 'Sending...', sent: 'Message sent!', error: 'Failed to send. Try again.', info: 'Or reach us directly' },
    footer: { desc: 'Fractional CDO services, data strategy, AI implementation and BI. Turning data into competitive advantage since 2023.', nav: 'Navigation', home: 'Home', servicesLink: 'Services', telecomLink: 'Telecom', techLink: 'Technologies', aboutLink: 'About', projectsLink: 'Projects', connect: 'Connect', rights: '\u00a9 2026 Dom Analytics', explore: 'Explore on your own', ctaTitle: 'Have a data or telecom question?', ctaSub: 'Send a note. If we are not the right fit, we will say so and point you somewhere.' },
  },
  hr: {
    nav: { services: 'Usluge', telecom: 'Telecom', tech: 'Tehnologije', about: 'O nama', projects: 'Projekti', contact: 'Kontakt' },
    hero: { tagline: 'DATA I TELEKOM SAVJETOVANJE', headline: 'Data strategija i komercijalno savjetovanje, od ljudi koji su vodili brojke', sub: 'Fractional CDO, BI i data monetizacija za tvrtke u telekomu, tehnologiji i enterprise sektoru. 15+ godina u podatkovnom sloju, 14 A2P SMS i Voice monetizacijskih projekata s operatorima u MENA i APAC regiji.', cta: 'Razgovarajmo', scroll: 'Skrolaj za vi\u0161e' },
    services: { label: '\u0160TO RADIMO', title: 'Usluge', items: [
      { num: '01', title: 'Fractional CDO', desc: 'C-level data leadership na zahtjev. Postajemo va\u0161 Chief Data Officer, definiramo data viziju, gradimo governance okvire i uskla\u0111ujemo data strategiju s poslovnim ciljevima. Bez punog zaposlenja.', tags: ['Data vizija', 'CDO kao usluga', 'Data Governance', 'Savjetovanje'] },
      { num: '02', title: 'Data strategija i enablement', desc: 'Auditiramo va\u0161u podatkovnu infrastrukturu, eliminiramo silose i gradimo temelje koji od podataka \u010dine pravi poslovni resurs. Od sirove date do odluka, pomažemo va\u0161em timu da izvuče maksimum.', tags: ['Data audit', 'Arhitektura podataka', 'Data enablement', 'ROI optimizacija'] },
      { num: '03', title: 'AI i strojno u\u010denje', desc: 'Prilagođeni AI modeli, prediktivna analitika, LLM integracije i inteligentna automatizacija izgrađeni na urednim, upravljanim podacima. AI koji izdrži u produkciji, jer su podaci ispod njega solidni.', tags: ['LLM integracija', 'Prediktivni modeli', 'NLP', 'Automatizacija'] },
      { num: '04', title: 'BI i analitika', desc: 'Dashboardi za upravu, KPI okviri i izvještavanje u realnom vremenu koji pretvaraju podatke u odluke. Gradimo BI koji vaše vodstvo otvara svaki ponedjeljak: jasan, brz i vezan uz brojke po kojima ih se mjeri.', tags: ['PowerBI', 'QlikSense', 'KPI okviri', 'Data Pipelines'] },
      { num: '05', title: 'Data monetizacija', desc: 'Identificiramo neiskorištene prihode skrivene u vašim podacima. Od optimizacije cijena do otkrivanja novih proizvoda, isporučili smo 300 do 1500% rast prihoda na telekom rutama popravljajući komercijalni model, ne samo izvještavanje.', tags: ['Rast prihoda', 'Data proizvodi', 'Strategija cijena', 'Monetizacija'] },
      { num: '06', title: 'Web i App razvoj', desc: 'Data-pokretane web aplikacije i digitalne platforme izgrađene za skaliranje. Gradimo su\u010delja koja va\u0161e podatke o\u017eivljavaju, od internih alata do proizvoda okrenutih klijentima.', tags: ['React / Next.js', 'Mobilne aplikacije', 'Data dashboardi', 'API dizajn'] },
    ]},
    process: { label: 'KAKO RADIMO', title: 'Kako izgleda suradnja', sub: 'Svaka suradnja počinje malo i s fiksnim opsegom. Brojke vidite prije nego se obvežete na išta veće.', steps: [
      { title: 'Dijagnostika', desc: 'Dva do tri tjedna u vašim podacima i komercijalnom setupu. Čitamo što postoji, razgovaramo s ljudima koji to vode i imenujemo praznine i brze pobjede.' },
      { title: 'Pisana preporuka', desc: 'Dobivate dokument, ne prezentaciju: što promijeniti, kojim redom, koliko košta i što bi trebalo vratiti. Nikakva izgradnja ne počinje dok se s tim ne složite.' },
      { title: 'Izgradnja', desc: 'Radimo s vašim timom u kratkim ciklusima, s demom svaki tjedan. Pipeline-ovi, dashboardi, modeli ili komercijalni model za natječaj, ovisno o projektu.' },
      { title: 'Primopredaja', desc: 'Obučimo ljude koji će to voditi i ostavimo dokumentaciju koju će koristiti. Cilj je da nas ne trebate za svakodnevni rad.' },
      { title: 'Praćenje', desc: 'Mjesečne provjere metrika koje smo dogovorili na početku. Prilagođavamo se kad se posao promijeni i kažemo kad nešto ne radi.' },
    ]},
    why: { label: 'ZA\u0160TO DOM ANALYTICS', title: 'Zašto raditi s nama', items: [
      { title: 'Sjedili smo u toj stolici', desc: 'Više od 15 godina u podacima i telekomu u 40+ zemalja. Držali smo CDO poziciju, gradili BI odjele od nule i odgovarali za liniju prihoda, pa savjet dolazi iz iskustva, ne iz frameworka.' },
      { title: 'Temelj prije dashboarda', desc: 'Čistimo, strukturiramo i upravljamo podacima prije nego itko na njima gradi. Izvještaji i AI na lošim podacima daju vam samouvjereno krive odgovore.' },
      { title: 'Prihod koji se može pratiti', desc: 'A2P SMS monetizacijski rad donio je 400% rast prihoda s mobilnim operatorom u MENA regiji i 1500% s mobilnim operatorom u APAC regiji, kroz strukturu partnerstva, komercijalne uvjete i cijene.' },
      { title: 'AI tamo gdje se isplati', desc: 'AI gradimo na upravljanim podacima i samo tamo gdje model pobjeđuje jednostavnije pravilo. Bez AI-a radi slajda.' },
    ]},
    tech: { label: 'NA\u0160 STACK', title: 'Tehnologije', sub: 'Alati u kojima radimo svaki dan. Stack biramo prema vašem timu, ne obrnuto.' },
    contact: { label: 'KONTAKTIRAJTE NAS', title: 'Izgradimo ne\u0161to\nveliko zajedno', sub: 'Recite nam gdje su danas vaši podaci ili A2P prihod. 20 minuta je dovoljno da provjerimo odgovaramo li si.', name: 'Va\u0161e ime', email: 'Email adresa', message: 'Opi\u0161ite nam svoj projekt', send: 'Po\u0161alji poruku', sending: '\u0160aljem...', sent: 'Poruka poslana!', error: 'Slanje neuspjelo. Poku\u0161ajte ponovo.', info: 'Ili nas kontaktirajte direktno' },
    footer: { desc: 'AI konzalting, analitika podataka i razvoj prilago\u0111enog softvera. Gradimo inteligentna rje\u0161enja od 2023.', nav: 'Navigacija', home: 'Po\u010detna', servicesLink: 'Usluge', telecomLink: 'Telecom', techLink: 'Tehnologije', aboutLink: 'O nama', projectsLink: 'Projekti', connect: 'Pove\u017ei se', rights: '\u00a9 2026 Dom Analytics', explore: 'Istra\u017ei sam', ctaTitle: 'Imate pitanje o podacima ili telekomu?', ctaSub: 'Pošaljite poruku. Ako nismo pravi izbor, reći ćemo vam to i uputiti vas dalje.' },
  },
};
 
const techCategories = [
  { name: 'Data & BI', items: ['SQL', 'Python', 'Pandas', 'Power BI', 'QlikSense', 'Data Modeling', 'ETL Pipelines'] },
  { name: 'AI', items: ['LLM APIs (Claude, OpenAI)', 'LangChain', 'Scikit-learn', 'Prompt and eval design', 'Retrieval (RAG)'] },
  { name: 'Web & Cloud', items: ['React / Next.js', 'TypeScript', 'Node.js', 'PostgreSQL / Supabase', 'Vercel', 'Stripe'] },
  { name: 'Commercial', items: ['A2P SMS pricing models', 'Routing and margin analytics', 'Operator RFP responses', 'Business cases', 'KPI frameworks', 'Salesforce / HubSpot'] },
];
 
const marqueeItems = ['Fractional CDO', 'Data Strategy', 'BI & Analytics', 'Data Monetization', 'A2P SMS Pricing', 'Operator Partnerships', 'SMS Firewall Economics', 'RFP Support', 'AI on Governed Data', 'Telecom Revenue'];
 
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
        <div className="big-footer-cta"><h3 className="big-footer-cta-title">{t.footer.ctaTitle}</h3><p className="big-footer-cta-sub">{t.footer.ctaSub}</p><Link href="/#contact" className="cta-btn">Get in touch</Link></div>
        <div className="big-footer-top">
          <div className="big-footer-brand"><div className="big-footer-logo">Dom<span>Analytics</span></div><p className="big-footer-desc">{t.footer.desc}</p><div className="big-footer-social"><a href="https://www.linkedin.com/company/dom-analytics" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45z"/></svg></a><a href="mailto:info@domanalytics.com" aria-label="Email"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg></a></div></div>
          <div className="big-footer-col"><h4>{t.footer.nav}</h4><Link href="/">{t.footer.home}</Link><Link href="/#services">{t.footer.servicesLink}</Link><Link href="/telecom">{t.footer.telecomLink}</Link><Link href="/about">{t.footer.aboutLink}</Link><Link href="/projects">{t.footer.projectsLink}</Link></div>
          <div className="big-footer-col"><h4>{t.footer.connect}</h4><a href="mailto:info@domanalytics.com">info@domanalytics.com</a><a href="https://www.linkedin.com/company/dom-analytics" target="_blank" rel="noopener noreferrer">LinkedIn</a></div>
          <div className="big-footer-col"><h4>Location</h4><span>Pore&#269;, Croatia</span><span>Zagreb, Croatia</span><span>Global Remote</span></div>
        </div>
        <div className="big-footer-bottom"><span>{t.footer.rights}</span><div><a href="/universe-game.html">{t.footer.explore}</a></div></div>
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
          <Link href="/telecom">{t.nav.telecom}</Link>
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
        <Link href="/telecom" onClick={() => setMenuOpen(false)}>{t.nav.telecom}</Link>
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
                <div className="process-card-num">{String(i + 1).padStart(2, '0')}</div>
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
              <div className="process-card-num">{String(i + 1).padStart(2, '0')}</div>
              <h3 className="why-card-title">{item.title}</h3>
              <p className="why-card-desc">{item.desc}</p>
            </div>
          ))}
        </StaggerChildren>
      </section>
 
      <div className="section-divider" />
 
      <div className="section-divider" />

      {/* ─── CASE STUDIES ─── */}
      <section id="results" className="section">
        <LineReveal><p className="section-label">{lang === 'hr' ? 'DOKAZANI REZULTATI' : 'PROVEN RESULTS'}</p></LineReveal>
        <h2 className="section-title"><SplitText>{lang === 'hr' ? 'Što data može napraviti' : 'What data can do'}</SplitText></h2>
        <LineReveal delay={0.2}><p className="section-sub">{lang === 'hr' ? 'Ovi rezultati nisu teorija. Svaki broj dolazi iz A2P SMS monetizacijskog rada s mobilnim operatorima: struktura partnerstva, komercijalni uvjeti, cijene i pregovori.' : 'These numbers are not theory. Every figure comes from A2P SMS monetization work with mobile operators: partnership structure, commercial terms, pricing and negotiation.'}</p></LineReveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '48px' }}>
          <div style={{ background: 'rgba(0,229,255,0.04)', border: '1px solid rgba(0,229,255,0.15)', borderRadius: '12px', padding: '36px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, #00e5ff, transparent)' }} />
            <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: '#00e5ff', marginBottom: '16px', fontFamily: 'monospace' }}>APAC REGION · TELECOMMUNICATIONS</p>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#00e5ff', lineHeight: 1, marginBottom: '8px' }}>1500%</div>
            <p style={{ fontSize: '0.85rem', color: 'rgba(200,220,240,0.9)', fontWeight: 600, marginBottom: '12px' }}>{lang === 'hr' ? 'Rast prihoda' : 'Revenue increase'}</p>
            <p style={{ fontSize: '0.8rem', color: '#4a6080', lineHeight: 1.7 }}>{lang === 'hr' ? 'A2P SMS monetizacijski projekt s mobilnim operatorom u APAC regiji, isporučen sa strane providera. Strukturirali smo operatorsko partnerstvo, pripremili komercijalne uvjete i ispregovarali A2P cijene. Rezultat: 1500% rast prihoda i 1150% rast bruto dobiti na operatorskoj ruti.' : 'A2P SMS monetization project with a mobile operator in the APAC region, delivered from the provider side. We structured the operator partnership, prepared the commercial terms and negotiated the A2P pricing. Result: 1500% revenue growth and 1150% gross profit increase on the operator route.'}</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '20px' }}>
              {['A2P SMS', 'Commercial Terms', 'Operator Partnership', 'A2P Pricing'].map(tag => (
                <span key={tag} style={{ fontSize: '0.6rem', letterSpacing: '0.08em', color: '#00e5ff', border: '1px solid rgba(0,229,255,0.2)', padding: '3px 10px', borderRadius: '100px' }}>{tag}</span>
              ))}
            </div>
          </div>
          <div style={{ background: 'rgba(0,229,255,0.04)', border: '1px solid rgba(0,229,255,0.15)', borderRadius: '12px', padding: '36px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, #00e5ff, transparent)' }} />
            <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: '#00e5ff', marginBottom: '16px', fontFamily: 'monospace' }}>MENA REGION · TELECOMMUNICATIONS</p>
            <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#00e5ff', lineHeight: 1, marginBottom: '8px' }}>400%</div>
            <p style={{ fontSize: '0.85rem', color: 'rgba(200,220,240,0.9)', fontWeight: 600, marginBottom: '12px' }}>{lang === 'hr' ? 'Rast prihoda' : 'Revenue increase'}</p>
            <p style={{ fontSize: '0.8rem', color: '#4a6080', lineHeight: 1.7 }}>{lang === 'hr' ? 'A2P SMS monetizacijski projekt s mobilnim operatorom u MENA regiji, isporučen sa strane providera. Pripremili smo i ispregovarali komercijalne uvjete operatorskog partnerstva, od ekskluzivnosti do A2P cijena. Rezultat: 400% rast prihoda i 250% rast bruto dobiti na operatorskoj ruti.' : 'A2P SMS monetization project with a mobile operator in the MENA region, delivered from the provider side. We prepared and negotiated the commercial terms of the operator partnership, from exclusivity to A2P pricing. Result: 400% revenue growth and 250% gross profit increase on the operator route.'}</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '20px' }}>
              {['A2P SMS', 'Commercial Terms', 'Operator Partnership', 'A2P Pricing'].map(tag => (
                <span key={tag} style={{ fontSize: '0.6rem', letterSpacing: '0.08em', color: '#00e5ff', border: '1px solid rgba(0,229,255,0.2)', padding: '3px 10px', borderRadius: '100px' }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 32 }}><Link href="/telecom" className="project-card-link">{lang === 'hr' ? 'Pogledajte naš telecom rad' : 'See our telecom work'} <span>&rarr;</span></Link></div>
      </section>

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