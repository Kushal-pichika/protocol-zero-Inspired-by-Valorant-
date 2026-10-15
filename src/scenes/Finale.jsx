import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { RotateCcw } from 'lucide-react'
import { goTo } from '../hooks/hooks'

export default function Finale({ reduced }) {
  const root = useRef()
  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      gsap.from('.ch', { yPercent: 120, autoAlpha: 0, stagger: 0.04, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 55%', toggleActions: 'play none none reverse' } })
    }, root)
    return () => ctx.revert()
  }, [reduced])
  const replay = () => { window.dispatchEvent(new Event('pz:replay')); window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }) }
  const split = (t) => t.split('').map((c, i) => <span key={i} className="mask ch-wrap"><span className="ch">{c === ' ' ? '\u00A0' : c}</span></span>)
  return (
    <section id="finale" ref={root} className="finale">
      <h2 className="display huge" aria-label="Match point">{split('MATCH POINT')}</h2>
      <div className="cta-row">
        <button className="btn primary" onClick={() => goTo('agents')}>Choose your agent</button>
        <button className="btn" onClick={replay}><RotateCcw size={14} /> Replay experience</button>
      </div>
      <footer className="foot">Unofficial fan-made project. Not affiliated with or endorsed by Riot Games. VALORANT is a trademark of Riot Games, Inc. All agents and data here are fictional.</footer>
    </section>
  )
}
