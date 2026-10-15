import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ChevronsDown, SkipForward } from 'lucide-react'
import { scrollState } from '../three/scrollState'

export default function Hero({ reduced, ready }) {
  const root = useRef(), tl = useRef()
  useLayoutEffect(() => {
    let timer
    const ctx = gsap.context(() => {
      // Paused so the hero text waits for the preloader to finish
      tl.current = gsap.timeline({ paused: true })
        .from('.boot-line', { scaleX: 0, transformOrigin: 'left', duration: 0.8, stagger: 0.12 })
        .from('.boot-label', { autoAlpha: 0, y: 6, stagger: 0.1, duration: 0.4 }, 0.1)
        .from('.mask-in', { yPercent: 110, duration: 0.9, stagger: 0.12, ease: 'power4.out' }, 0.9)
        .from('.hero-sub, .scroll-cue', { autoAlpha: 0, duration: 0.6, stagger: 0.1 }, '-=0.3')
      if (reduced) tl.current.progress(1)
    }, root)
    const replay = () => { clearTimeout(timer); timer = setTimeout(() => { scrollState.intro = 0; tl.current?.restart() }, 700) }
    addEventListener('pz:replay', replay)
    return () => { clearTimeout(timer); removeEventListener('pz:replay', replay); ctx.revert() }
  }, [reduced])

  // Start the hero animation once the preloader has wiped away
  useEffect(() => { if (ready && !reduced) tl.current?.play() }, [ready, reduced])

  const skip = () => { tl.current?.progress(1); scrollState.intro = 1 }
  return (
    <section id="hero" ref={root} className="hero">
      <div className="boot" aria-hidden="true">
        <span className="boot-label">SYS.BOOT // 0x00</span><i className="boot-line" />
        <span className="boot-label">LINK: STABLE</span><i className="boot-line" />
        <span className="boot-label">EMBLEM: ASSEMBLING</span><i className="boot-line" />
      </div>
      <div className="hero-copy">
        <h1 className="display"><span className="mask"><span className="mask-in">ENTER THE</span></span><span className="mask"><span className="mask-in red">PROTOCOL</span></span></h1>
        <p className="hero-sub">A NEW REALITY IS ONLINE</p>
      </div>
      <button className="skip" onClick={skip}><SkipForward size={14} /> Skip intro</button>
      <div className="scroll-cue" aria-hidden="true"><ChevronsDown size={18} /> Scroll</div>
    </section>
  )
}