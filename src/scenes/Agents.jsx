import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { AGENTS, ASSETS } from '../data/config'

// Portrait: renders layered art from ASSETS.agentPortraits[id], else a procedural SVG placeholder.
// Accepts a string, an array of strings, or an array of { src, depth } (back to front).
// Each layer shifts by the stage's --px/--py at its own depth, so layers separate on mouse move.
function Portrait({ agent }) {
  const [failed, setFailed] = useState(false)
  const raw = ASSETS.agentPortraits[agent.id]
  const layers = raw ? [].concat(raw).map((l, i, all) => (typeof l === 'string' ? { src: l, depth: (i + 1) / all.length } : l)) : []
  if (layers.length && !failed) {
    return (
      <div className="layers" role="img" aria-label={`${agent.name} portrait`}>
        {layers.map((l, i) => (
          <img key={l.src} src={l.src} alt="" draggable="false" style={{ '--d': l.depth }} loading={i === 0 ? 'eager' : 'lazy'} onError={() => setFailed(true)} />
        ))}
      </div>
    )
  }
  const pts = Array.from({ length: agent.sides }, (_, i) => { const a = (i / agent.sides) * 6.283 - 1.571; return `${100 + 80 * Math.cos(a)},${100 + 80 * Math.sin(a)}` }).join(' ')
  return (<svg viewBox="0 0 200 200" role="img" aria-label={`${agent.name} placeholder portrait`}>
    <polygon points={pts} fill="none" stroke={agent.accent} strokeWidth="2" /><polygon points={pts} fill={agent.accent} opacity=".12" transform="rotate(30 100 100)" />
    <text x="100" y="112" textAnchor="middle" fontSize="34" fill={agent.accent} fontFamily="Barlow Condensed" fontWeight="800">{agent.name[0]}</text></svg>)
}
const variants = { enter: (d) => ({ x: d * 90, opacity: 0 }), center: { x: 0, opacity: 1 }, exit: (d) => ({ x: d * -90, opacity: 0 }) }

export default function Agents() {
  const [[i, dir], setSel] = useState([0, 1])
  const [open, setOpen] = useState(false)
  const closeRef = useRef(), stage = useRef()
  const a = AGENTS[i]
  const pick = (n) => setSel([n, n > i ? 1 : -1])
  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const k = (e) => e.key === 'Escape' && setOpen(false)
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [open])
  const parallax = (e) => { const r = stage.current.getBoundingClientRect(); stage.current.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3)); stage.current.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3)) }
  const key = (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowDown') pick((i + 1) % AGENTS.length); if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') pick((i + AGENTS.length - 1) % AGENTS.length) }
  return (
    <section id="agents" className="agents" style={{ '--accent': a.accent }}>
      <h2 className="display">AGENT<br />SELECT</h2>
      <div className="agent-stage" ref={stage} onPointerMove={parallax}>
        <div className="agent-bg" aria-hidden="true">{a.name}</div>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div key={a.id} className="agent-main" custom={dir} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.28 }}>
            <div className="portrait"><Portrait agent={a} /></div>
            <div><p className="muted">{a.role}</p><h3 className="display-s">{a.name}</h3>
              <ul className="abilities">{a.abilities.map(([n, d]) => <li key={n}><b>{n}</b> {d}</li>)}</ul>
              <button className="btn" onClick={() => setOpen(true)}>View profile</button></div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="agent-list" role="tablist" aria-label="Agents" onKeyDown={key}>
        {AGENTS.map((g, n) => <button key={g.id} role="tab" aria-selected={n === i} tabIndex={n === i ? 0 : -1} onClick={() => pick(n)}>{g.name}<small>{g.role}</small></button>)}
      </div>
      {open && (
        <div className="modal" role="dialog" aria-modal="true" aria-label={`${a.name} profile`} onClick={() => setOpen(false)}>
          <div className="panel" onClick={(e) => e.stopPropagation()}>
            <button ref={closeRef} className="close" onClick={() => setOpen(false)} aria-label="Close profile"><X size={18} /></button>
            <h3 className="display-s">{a.name} <span className="muted">/ {a.role}</span></h3><p>{a.bio}</p>
            <p className="muted">Fictional placeholder agent for this fan project. Not an official VALORANT character.</p>
          </div>
        </div>
      )}
    </section>
  )
}
