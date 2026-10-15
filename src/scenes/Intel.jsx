import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { COUNTERS, ROUTES, SQUAD } from '../data/config'

export default function Intel({ reduced }) {
  const root = useRef()
  const [rid, setRid] = useState(ROUTES[0].id)
  const route = ROUTES.find((r) => r.id === rid)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      root.current.querySelectorAll('[data-count]').forEach((el) => {
        const end = +el.dataset.count, o = { v: reduced ? end : 0 }
        el.textContent = Math.round(o.v).toLocaleString()
        if (reduced) return
        gsap.to(o, { v: end, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true }, onUpdate: () => { el.textContent = Math.round(o.v).toLocaleString() } })
      })
    }, root)
    return () => ctx.revert()
  }, [reduced])
  return (
    <section id="intel" ref={root} className="intel">
      <h2 className="display">TACTICAL<br />INTELLIGENCE</h2>
      <p className="muted note">All figures are fictional and illustrative. No real player data.</p>
      <div className="intel-grid">
        <svg className="minimap" viewBox="0 0 300 240" role="img" aria-label="Route minimap">
          <defs><pattern id="g" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#20232C" /></pattern></defs>
          <rect width="300" height="240" fill="url(#g)" />
          {ROUTES.map((r) => <path key={r.id} d={r.d} className={r.id === rid ? 'route on' : 'route'} />)}
          <circle cx="40" cy="210" r="5" fill="#FF4655" />
        </svg>
        <div>
          <div className="route-pick" role="radiogroup" aria-label="Route">
            {ROUTES.map((r) => <button key={r.id} role="radio" aria-checked={r.id === rid} onClick={() => setRid(r.id)}>{r.name}</button>)}
          </div>
          <p className="muted">ETA {route.time} / Risk {route.risk}%</p>
          <div className="bar"><i style={{ width: `${route.progress}%` }} /></div>
          <p className="muted">Mission progress {route.progress}%</p>
          <ul className="squad">{SQUAD.map((s, n) => <li key={s}>{s}<span style={{ '--v': `${(route.risk + n * 11) % 100}%` }} /></li>)}</ul>
        </div>
      </div>
      <div className="counters">{COUNTERS.map(([l, v]) => <div key={l}><b className="display-s" data-count={v}>0</b><span className="muted">{l}</span></div>)}</div>
    </section>
  )
}
