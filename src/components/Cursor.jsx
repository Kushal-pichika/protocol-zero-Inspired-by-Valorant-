import { useEffect, useRef } from 'react'
import gsap from 'gsap'
// Crosshair cursor, only on fine-pointer (desktop) devices.
export default function Cursor() {
  const ref = useRef()
  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches) return
    document.body.classList.add('has-cursor')
    const x = gsap.quickTo(ref.current, 'x', { duration: 0.12 }), y = gsap.quickTo(ref.current, 'y', { duration: 0.12 })
    const move = (e) => { x(e.clientX); y(e.clientY) }
    addEventListener('pointermove', move)
    return () => { removeEventListener('pointermove', move); document.body.classList.remove('has-cursor') }
  }, [])
  return <div ref={ref} className="cursor" aria-hidden="true"><i /><i /><i /><i /></div>
}
