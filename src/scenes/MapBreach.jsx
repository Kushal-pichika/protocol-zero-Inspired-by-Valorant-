import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { SITES } from '../data/config'

export default function MapBreach({ reduced }) {
  const root = useRef(), wipe = useRef()
  const [site, setSite] = useState(SITES[0])
  useLayoutEffect(() => {
    if (reduced) return
    const ctx = gsap.context(() => {
      // Diagonal geometric wipe that hides the camera cut from the Spike scene into the map.
      gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: root.current, start: 'top 85%', end: 'top 15%', scrub: true } })
        .fromTo(wipe.current, { clipPath: 'polygon(0% 0%,0% 0%,-20% 100%,-20% 100%)' }, { clipPath: 'polygon(0% 0%,120% 0%,100% 100%,-20% 100%)' })
        .to(wipe.current, { clipPath: 'polygon(120% 0%,120% 0%,100% 100%,100% 100%)' })
    }, root)
    return () => ctx.revert()
  }, [reduced])
  return (
    <section id="map" ref={root} className="map">
      <div ref={wipe} className="wipe" aria-hidden="true" />
      <div className="map-sticky">
        <h2 className="display">MAP<br />BREACH</h2>
        <p className="coords">SECTOR 07 // {site.coord}</p>
        {SITES.map((s) => (
          <button key={s.id} className="marker" style={{ left: `${s.x}%`, top: `${s.y}%` }} aria-pressed={site.id === s.id} onClick={() => setSite(s)} aria-label={`Site ${s.id}: ${s.name}`}>{s.id}</button>
        ))}
        <aside className="panel site-info" aria-live="polite">
          <h3>Site {site.id} / {site.name}</h3><p>{site.info}</p><p className="muted">{site.coord}</p>
        </aside>
      </div>
    </section>
  )
}
