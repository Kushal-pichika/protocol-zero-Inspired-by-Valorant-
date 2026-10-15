import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

const TEXT = 'HELLO PLAYER'
const GLYPHS = '!<>-_/[]{}=+*^?#01'

export default function Preloader({ onDone, reduced }) {
  const root = useRef(), slash = useRef(), count = useRef(), tl = useRef()

  useLayoutEffect(() => {
    document.body.style.overflow = 'hidden' // no scrolling while the intro plays
    const ctx = gsap.context(() => {
      const t = (tl.current = gsap.timeline({ onComplete: onDone }))
      if (reduced) { t.to(root.current, { autoAlpha: 0, duration: 0.3, delay: 1 }); return }

      const chars = gsap.utils.toArray('.pre-ch')
      const n = { v: 0 }
      gsap.set(chars, { autoAlpha: 0 })

      // Frame, labels, scan line, emblem draw
      t.from('.pre-b', { autoAlpha: 0, scale: 1.8, duration: 0.7, ease: 'power3.out', stagger: 0.06 }, 0)
        .from('.pre-label', { autoAlpha: 0, y: 8, stagger: 0.1, duration: 0.4 }, 0.2)
        .fromTo('.pre-scan', { y: '-5vh', autoAlpha: 1 }, { y: '105vh', duration: 1.5, ease: 'power1.inOut' }, 0.2)
        .to('.pre-scan', { autoAlpha: 0, duration: 0.2 }, 1.7)
        .from('.pre-hex', { strokeDashoffset: 1, duration: 1.1, ease: 'power2.inOut' }, 0.3)
        .from('.pre-core', { scale: 0, transformOrigin: '50% 50%', duration: 0.6, ease: 'back.out(2)' }, 1.0)
        // Counter + progress bar
        .to(n, { v: 100, duration: 2.0, ease: 'power2.inOut', onUpdate: () => { count.current.textContent = String(Math.round(n.v)).padStart(3, '0') } }, 0.3)
        .fromTo('.pre-fill', { scaleX: 0 }, { scaleX: 1, duration: 2.0, ease: 'power2.inOut' }, 0.3)

      // Decode effect: each letter cycles random glyphs, then locks in (red flash -> white)
      chars.forEach((el, i) => {
        const final = el.dataset.c
        const at = 0.6 + i * 0.07
        if (final === ' ') { t.set(el, { autoAlpha: 1 }, at); return }
        const o = { p: 0 }
        t.set(el, { autoAlpha: 1 }, at)
          .to(o, {
            p: 1, duration: 0.5, ease: 'none',
            onUpdate: () => { el.textContent = o.p < 1 ? GLYPHS[(Math.random() * GLYPHS.length) | 0] : final },
            onComplete: () => { el.textContent = final },
          }, at)
          .fromTo(el, { color: '#FF4655' }, { color: '#F4F4F2', duration: 0.4 }, at + 0.5)
      })

      // Exit: red slash sweeps across while the screen collapses behind it
      gsap.set(slash.current, { x: '-45vw' })
      t.from('.pre-sub', { autoAlpha: 0, letterSpacing: '0.9em', duration: 0.7 }, 1.7)
        .addLabel('exit', 2.4)
        .to(slash.current, { x: '115vw', duration: 0.9, ease: 'power3.inOut' }, 'exit')
        .to(root.current, { clipPath: 'polygon(100% 0,100% 0,100% 100%,100% 100%)', duration: 0.9, ease: 'power3.inOut' }, 'exit+=0.1')
    }, root)
    return () => { ctx.revert(); document.body.style.overflow = '' }
  }, [])

  // Skip: fast-forward to the exit wipe instead of cutting
  const skip = () => {
    const t = tl.current
    if (reduced) return t.progress(1)
    if (t.time() < t.labels.exit) { t.pause(); t.tweenTo('exit', { duration: 0.35, ease: 'power2.in', onComplete: () => t.play() }) }
  }

  return (
    <>
      <div ref={root} className="pre" role="status" aria-label="Loading">
        <div className="pre-grid" aria-hidden="true" />
        <i className="pre-b tl" /><i className="pre-b tr" /><i className="pre-b bl" /><i className="pre-b br" />
        <span className="pre-label pre-l1">SYS.BOOT // PLAYER_LINK</span>
        <span className="pre-label pre-l2">SECURE CHANNEL</span>
        <i className="pre-scan" />
        <svg className="pre-logo" viewBox="0 0 64 64" aria-hidden="true">
          <polygon className="pre-hex" pathLength="1" points="32,4 56,18 56,46 32,60 8,46 8,18" />
          <polygon className="pre-core" points="32,18 44,32 32,46 20,32" />
        </svg>
        <div className="display pre-title" role="img" aria-label="Hello player">
          {TEXT.split('').map((c, i) => (
            <span key={i} className="pre-ch" data-c={c}>{c === ' ' ? '\u00A0' : c}</span>
          ))}
        </div>
        <p className="pre-sub">INITIALIZING PROTOCOL</p>
        <div className="pre-meter"><span ref={count}>000</span><div className="pre-track"><i className="pre-fill" /></div></div>
        <button className="pre-skip" onClick={skip}>Skip</button>
      </div>
      <div ref={slash} className="pre-slash" aria-hidden="true" />
    </>
  )
}