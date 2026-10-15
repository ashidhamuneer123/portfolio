import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import { profile, stats, projects, builds, services, timeline, skills, marquee } from './data.js'

const Scene = lazy(() => import('./Scene.jsx'))

/* If WebGL is missing or the 3D scene fails, keep the page and show a soft glow instead. */
class SceneBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.fallback : this.props.children }
}
const hasWebGL = (() => {
  try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))) }
  catch { return false }
})()

/* ---------- hooks ---------- */
function useTheme() {
  const root = document.documentElement
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const resolve = () => {
    const t = root.getAttribute('data-theme')
    return t ? t === 'dark' : media.matches
  }
  const [dark, setDark] = useState(resolve)
  useEffect(() => {
    const sync = () => setDark(resolve())
    media.addEventListener('change', sync)
    const mo = new MutationObserver(sync)
    mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    return () => { media.removeEventListener('change', sync); mo.disconnect() }
  }, [])
  const toggle = () => {
    const next = resolve() ? 'light' : 'dark'
    root.setAttribute('data-theme', next)
    try { localStorage.setItem('theme', next) } catch (e) {}
  }
  return [dark, toggle]
}

function useInView(opts = { threshold: 0.2 }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) { setSeen(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, opts)
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return [ref, seen]
}

/* ---------- small pieces ---------- */
function Counter({ n, suffix }) {
  const [ref, seen] = useInView()
  const [v, setV] = useState(n)
  useEffect(() => {
    if (!seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf, start
    const step = (t) => {
      start ??= t
      const p = Math.min(1, (t - start) / 1200)
      setV(Math.round(n * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    setV(0)
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [seen, n])
  return <b ref={ref}>{v}{suffix}</b>
}

function Reveal({ children, as: Tag = 'div', className = '', ...rest }) {
  const [ref, seen] = useInView({ threshold: 0.12 })
  return <Tag ref={ref} className={`reveal ${seen ? 'in' : ''} ${className}`} {...rest}>{children}</Tag>
}

function Tilt({ children, className = '', href }) {
  const ref = useRef(null)
  const move = (e) => {
    const el = ref.current; const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`)
    el.style.setProperty('--gx', `${(x + 0.5) * 100}%`)
    el.style.setProperty('--gy', `${(y + 0.5) * 100}%`)
  }
  const leave = () => { const el = ref.current; el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg') }
  return (
    <a ref={ref} className={`tilt ${className}`} href={href} target="_blank" rel="noopener noreferrer" onPointerMove={move} onPointerLeave={leave}>
      {children}
    </a>
  )
}

function Browser({ host, children }) {
  return (
    <div className="browser">
      <div className="bar"><i /><i /><i /><span className="url">{host}</span></div>
      <div className="screen">{children}</div>
    </div>
  )
}

function Spotlight({ children, className = '' }) {
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return <div className={`spot ${className}`} onPointerMove={move}>{children}</div>
}

const Arrow = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>

const ICONS = {
  building: <path d="M4 21V5l8-3v19M12 21h8V9l-8-2M8 8h.01M8 12h.01M8 16h.01M16 12h.01M16 16h.01" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></>,
  cart: <><path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6.2" /><circle cx="9" cy="20" r="1.4" /><circle cx="17" cy="20" r="1.4" /></>,
  grid: <><rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" /></>,
}

/* ---------- page ---------- */
export default function App() {
  const [dark, toggle] = useTheme()
  const [progress, setProgress] = useState(0)
  const [toast, setToast] = useState('')

  useEffect(() => {
    const on = () => {
      const h = document.documentElement
      setProgress(h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight))
    }
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); setToast(`Copied ${text}`) }
    catch { setToast(text) }
    clearTimeout(copy.t); copy.t = setTimeout(() => setToast(''), 1800)
  }

  const letters = (word, offset) =>
    [...word].map((ch, i) => <span key={i} className="ltr" style={{ animationDelay: `${(offset + i) * 45}ms` }}>{ch}</span>)

  return (
    <>
      <header className="nav">
        <div className="progress" style={{ transform: `scaleX(${progress})` }} />
        <div className="wrap">
          <a className="logo" href="#top" aria-label="Back to top">ashidha<span>.</span></a>
          <nav aria-label="Sections">
            <ul>
              <li><a href="#work">Work</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#experience">Experience</a></li>
              <li><a href="#skills">Skills</a></li>
            </ul>
          </nav>
          <div className="nav-right">
            <button className="theme-btn" onClick={toggle} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
              {dark
                ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
                : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>}
            </button>
            <a className="btn btn-primary nav-cta" href="#contact">Let's talk</a>
          </div>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="aura" aria-hidden="true" />
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <span className="status"><span className="dot" />Open for websites, portfolios &amp; roles · Dubai</span>
              <h1 aria-label={`${profile.first} ${profile.last}`}>
                <span className="line" aria-hidden="true">{letters(profile.first, 0)}</span>
                <span className="line grad" aria-hidden="true">{letters(profile.last, profile.first.length)}</span>
              </h1>
              <p className="role">
                <b>MERN stack developer</b> &amp; <b>project coordinator</b>. I build web apps for UAE businesses and see them through to launch.
              </p>
              <pre className="code" aria-label="Code summary"><span className="c">// whoami</span>{'\n'}<span className="k">const</span> ashidha = {'{'}{'\n'}  degree: <span className="s">"B.Tech IT"</span>,{'\n'}  stack:  [<span className="s">"React"</span>, <span className="s">"Node"</span>, <span className="s">"Mongo"</span>],{'\n'}  openFor: [<span className="s">"websites"</span>, <span className="s">"portfolios"</span>, <span className="s">"apps"</span>],{'\n'}{'}'};<span className="caret" /></pre>
              <div className="cta-row">
                <a className="btn btn-primary" href="#contact">Start a project</a>
                <a className="btn btn-ghost" href="#work">View my work</a>
              </div>
            </div>

            <div className="hero-visual">
              {hasWebGL ? (
                <SceneBoundary fallback={<div className="scene scene-fallback" />}>
                  <Suspense fallback={<div className="scene scene-fallback" />}>
                    <Scene dark={dark} />
                  </Suspense>
                </SceneBoundary>
              ) : <div className="scene scene-fallback" />}
              <figure className="portrait">
                <img src={profile.photo} alt="Ashidha Muneer" width="652" height="870" />
              </figure>
              <span className="chip c1"><i />React.js</span>
              <span className="chip c2"><i />Node + Express</span>
              <span className="chip c3"><i />MongoDB</span>
              <span className="chip c4"><i />Next.js</span>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="marquee" aria-hidden="true">
          <div className="track">
            {[...marquee, ...marquee].map((m, i) => <span key={i}>{m}<em>✦</em></span>)}
          </div>
        </div>

        {/* STATS */}
        <div className="wrap stats">
          {stats.map((s) => (
            <div className="stat" key={s.label}>{s.text ? <b>{s.text}</b> : <Counter n={s.n} suffix={s.suffix} />}<span>{s.label}</span></div>
          ))}
        </div>

        {/* WORK */}
        <section id="work">
          <div className="wrap">
            <Reveal className="sec-head">
              <div><span className="eyebrow">Selected work</span><h2>Live in <span className="grad">production</span></h2></div>
              <p>A selection of sites and apps that are online right now. Open any of them and click around.</p>
            </Reveal>

            <div className="projects">
              {projects.map((p, idx) => (
                <Reveal as="article" className={`proj ${idx % 2 ? 'flip' : ''}`} key={p.id}>
                  <Tilt href={p.url} className="proj-shot">
                    <Browser host={p.host}>
                      <img src={p.image} alt={`${p.title} homepage`} loading="lazy" />
                    </Browser>
                    <span className="glare" />
                  </Tilt>
                  <div className="proj-info">
                    <span className="num">0{idx + 1} · {p.meta}</span>
                    <h3>{p.title}</h3>
                    <span className="badge">{p.role}</span>
                    <p>{p.summary}</p>
                    <ul>{p.points.map((t) => <li key={t}>{t}</li>)}</ul>
                    <div className="tags">{p.stack.map((t) => <span key={t}>{t}</span>)}</div>
                    <a className="visit" href={p.url} target="_blank" rel="noopener noreferrer">Visit live site <Arrow /></a>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="builds">
              {builds.map((b) => (
                <Reveal className="build" key={b.title}>
                  <Browser host={b.tag}>
                    <div className="mock" aria-hidden="true">
                      <aside><b>{b.title.split(' ')[0]}</b>{b.side.map((s) => <span key={s}>{s}</span>)}</aside>
                      <div className="mock-main">
                        <div className="kpis">{b.kpis.map(([v, l]) => <div key={l}><b>{v}</b><span>{l}</span></div>)}</div>
                        <div className="rows"><i /><i /><i /><i /></div>
                      </div>
                    </div>
                  </Browser>
                  <h3>{b.title}</h3>
                  <p>{b.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="services-sec">
          <div className="wrap">
            <Reveal className="sec-head">
              <div><span className="eyebrow">Open for work</span><h2>What I can <span className="grad">build for you</span></h2></div>
              <p>Taking on freelance projects for companies and individuals, and open to full-time roles. I can also handle the domain, hosting and launch.</p>
            </Reveal>
            <div className="services">
              {services.map((sv) => (
                <Spotlight className="svc" key={sv.title}>
                  <span className="svc-ic" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{ICONS[sv.icon]}</svg>
                  </span>
                  <h3>{sv.title}</h3>
                  <p>{sv.text}</p>
                </Spotlight>
              ))}
            </div>
            <div className="svc-cta">
              <span>Need a website for your business or yourself?</span>
              <a className="btn btn-primary" href="#contact">Start a project</a>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about">
          <div className="wrap about">
            <Reveal>
              <span className="eyebrow">About</span>
              <h2>An IT engineer who writes the code <span className="grad">and lands the project.</span></h2>
              <p className="lead">I hold a B.Tech in Information Technology from AWH Engineering College, Calicut, and I build full-stack JavaScript apps with React, Node.js, Express and MongoDB.</p>
              <p>At Techbeee Technologies I coordinate web projects from the first requirements call to go-live: scoping, assigning developer tasks, tracking milestones and keeping clients in the loop. Having built systems myself, I can talk to developers in their language and explain progress to clients in theirs.</p>
            </Reveal>
            <Reveal as="dl" className="facts">
              <div><dt>Based in</dt><dd>Dubai, UAE</dd></div>
              <div><dt>Degree</dt><dd>B.Tech Information Technology</dd></div>
              <div><dt>College</dt><dd>AWH Engineering College, Calicut</dd></div>
              <div><dt>Focus</dt><dd>Full-stack JS · project delivery</dd></div>
              <div><dt>Deploys to</dt><dd>AWS EC2 · Vercel · Hostinger</dd></div>
              <div><dt>Languages</dt><dd>English · Malayalam · Hindi</dd></div>
            </Reveal>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience">
          <div className="wrap">
            <Reveal className="sec-head">
              <div><span className="eyebrow">Experience &amp; education</span><h2>The road <span className="grad">so far</span></h2></div>
              <p>Development, delivery and operations, on top of an engineering degree.</p>
            </Reveal>
            <ol className="timeline">
              {timeline.map((j) => (
                <Reveal as="li" className={`job ${j.kind === 'Current' ? 'now' : ''}`} key={j.title}>
                  <span className="when">{j.when}</span>
                  <div><h3>{j.title}</h3><div className="org">{j.org}</div><p>{j.text}</p></div>
                  <span className="kind">{j.kind}</span>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills">
          <div className="wrap">
            <Reveal className="sec-head">
              <div><span className="eyebrow">Toolkit</span><h2>What I <span className="grad">work with</span></h2></div>
            </Reveal>
            <div className="skills">
              {skills.map((s) => (
                <Spotlight className="sk" key={s.name}>
                  <h3>{s.name}<span>{s.code}</span></h3>
                  <ul>{s.items.map((i) => <li key={i}>{i}</li>)}</ul>
                </Spotlight>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact">
          <div className="wrap">
            <div className="contact">
              <div className="contact-glow" aria-hidden="true" />
              <div className="contact-copy">
                <span className="eyebrow">Contact</span>
                <h2>Have a project in mind? <span className="grad">Let's build it.</span></h2>
                <p>Freelance websites, web apps, or a role on your team. Tell me what you need and I'll reply within a day.</p>
                <div className="cta-row">
                  <a className="btn btn-primary" href={`mailto:${profile.email}?subject=Project%20enquiry`}>Email me</a>
                  <a className="btn btn-ghost" href={`https://wa.me/${profile.phoneRaw}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                </div>
              </div>
              <div className="links">
                <button className="lk" onClick={() => copy(profile.email)}><span className="v">{profile.email}</span><span className="hint">copy</span></button>
                <button className="lk" onClick={() => copy(profile.phone)}><span className="v">{profile.phone}</span><span className="hint">copy</span></button>
                <a className="lk" href={profile.linkedin} target="_blank" rel="noopener noreferrer"><span className="v">LinkedIn</span><Arrow /></a>
                <a className="lk" href={profile.github} target="_blank" rel="noopener noreferrer"><span className="v">GitHub · ashidhamuneer123</span><Arrow /></a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="wrap footer">
        <span>© {new Date().getFullYear()} Ashidha Muneer · Dubai</span>
        <span className="mono">Built with React &amp; Three.js</span>
      </footer>

      <div className={`toast ${toast ? 'show' : ''}`} role="status">{toast}</div>
    </>
  )
}
