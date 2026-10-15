# PROTOCOL ZERO (unofficial fan project)
React + Vite + React Three Fiber + GSAP ScrollTrigger + Framer Motion. Plain CSS.

    npm install
    npm run dev      # http://localhost:5173
    npm run build

Structure: `src/{app,components,scenes,three,hooks,data,styles,assets}`.
One shared WebGL canvas (`three/ExperienceCanvas.jsx`) is driven by `three/scrollState.js`, which a single ScrollTrigger in `app/App.jsx` updates. Each DOM scene owns its own GSAP context.

## Simplified / not done
- Selective bloom + climax chromatic aberration (off on mobile and reduced motion); no audio controls.
- Spike and map are procedural geometry; agent portraits are SVG placeholders (agents are fictional).
- Not yet profiled: run Chrome DevTools Performance with CPU throttling before claiming any FPS target.
- Mobile keeps the 3D canvas with fewer particles and DPR 1; the Spike pin is shortened.
