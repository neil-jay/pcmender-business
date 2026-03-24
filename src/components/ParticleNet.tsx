import { useEffect, useRef } from 'react'

export default function ParticleNet() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrame = 0
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const cssArea = window.innerWidth * window.innerHeight
    const maxCount = 120
    const count = Math.min(maxCount, Math.max(48, Math.floor(cssArea / 24000)))
    const maxDist = Math.max(90, Math.min(140, Math.hypot(window.innerWidth, window.innerHeight) / 25))
    const speedScale = prefersReduced ? 0 : 0.22
    const driftAmp = prefersReduced ? 0 : 0.06

    const particles = new Array(count).fill(0).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speedScale,
      vy: (Math.random() - 0.5) * speedScale,
      phase: Math.random() * Math.PI * 2
    }))

    let t = 0
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < maxDist) {
            ctx.strokeStyle = `rgba(0,255,136,${(1 - d / maxDist) * 0.28})`
            ctx.lineWidth = 0.7
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
          }
        }
      }

      for (const p of particles) {
        ctx.fillStyle = '#00ff88'
        ctx.beginPath()
        ctx.arc(p.x, p.y, 1.3, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = 'rgba(0,255,136,0.10)'
        ctx.beginPath()
        ctx.arc(p.x, p.y, 3.6, 0, Math.PI * 2)
        ctx.fill()
        p.x += p.vx + Math.sin(p.phase + t * 0.0012) * driftAmp
        p.y += p.vy + Math.cos(p.phase + t * 0.0011) * driftAmp
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
      }

      t += 1
      animationFrame = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas"
      aria-hidden="true"
    />
  )
}
