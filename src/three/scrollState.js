// Shared mutable state: written by ScrollTrigger, read inside useFrame (no React re-renders).
// s = continuous section position (0..6), cur = smoothed s, intro = emblem build-in 0..1
export const scrollState = { s: 0, cur: 0, intro: 0 }
