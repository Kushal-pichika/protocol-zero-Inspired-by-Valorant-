import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const LABELS = ['Casing unlocked', 'Core charging', 'Detonation window open']
export default function Spike({ reduced }) {
  const root = useRef(), pct = useRef()
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (reduced) { gsap.set('.arm-fill', { scaleX: 1 }); pct.current.textContent = '100%'; return }
      const o = { v: 0 }
      // Pinned + scrubbed: scrolling back reverses every tween. Camera/model read scrollState separately.
      gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: root.current, start: 'top top', end: innerWidth < 700 ? '+=100%' : '+=150%', pin: true, scrub: true } })
        .fromTo('.arm-fill', { scaleX: 0 }, { scaleX: 1, duration: 1 }, 0)
        .to(o, { v: 100, duration: 1, onUpdate: () => { pct.current.textContent = `${Math.round(o.v)}%` } }, 0)
        .fromTo('.spike-label', { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, stagger: 0.25, duration: 0.2 }, 0.05)
    }, root)
    return () => ctx.revert()
  }, [reduced])
  return (
    <section id="spike" ref={root} className="spike">
      <div className="spike-hud">
        <h2 className="display">SPIKE<br />ACTIVATION</h2>
        <ul>{LABELS.map((l) => <li key={l} className="spike-label">{l}</li>)}</ul>
      </div>
      <div className="arm">
        <span>Arming</span><span ref={pct}>0%</span>
        <div className="arm-track"><div className="arm-fill" /></div>
      </div>
    </section>
  )
}
