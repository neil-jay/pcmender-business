import { useEffect, useRef } from 'react'

type Node = {
  x: number
  y: number
}

type Link = {
  a: number
  b: number
  phase: number
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export default function RoboticBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let w = 0
    let h = 0
    let t = 0

    let nodes: Node[] = []
    let links: Link[] = []

    const resize = () => {
      const cssW = canvas.clientWidth || window.innerWidth
      const cssH = canvas.clientHeight || window.innerHeight
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      w = cssW
      h = cssH
      canvas.width = Math.floor(cssW * dpr)
      canvas.height = Math.floor(cssH * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const step = clamp(Math.floor(Math.min(cssW, cssH) / 12), 60, 110)
      const cols = Math.max(6, Math.floor(cssW / step))
      const rows = Math.max(6, Math.floor(cssH / step))

      nodes = []
      for (let y = 0; y <= rows; y++) {
        for (let x = 0; x <= cols; x++) {
          const jitter = prefersReduced ? 0 : step * 0.12
          nodes.push({
            x: x * step + (Math.random() - 0.5) * jitter,
            y: y * step + (Math.random() - 0.5) * jitter
          })
        }
      }

      links = []
      const total = nodes.length
      const linkCount = Math.min(300, Math.floor((cols * rows) * 1.3))
      for (let i = 0; i < linkCount; i++) {
        const a = Math.floor(Math.random() * total)
        let b = Math.floor(Math.random() * total)
        if (b === a) b = (b + 1) % total
        links.push({ a, b, phase: Math.random() * Math.PI * 2 })
      }
    }

    const drawGrid = () => {
      const step = 48
      ctx.lineWidth = 1
      ctx.strokeStyle = 'rgba(0,255,136,0.060)'
      for (let x = 0; x <= w; x += step) {
        ctx.beginPath()
        ctx.moveTo(x + 0.5, 0)
        ctx.lineTo(x + 0.5, h)
        ctx.stroke()
      }
      for (let y = 0; y <= h; y += step) {
        ctx.beginPath()
        ctx.moveTo(0, y + 0.5)
        ctx.lineTo(w, y + 0.5)
        ctx.stroke()
      }
    }

    const drawCircuit = () => {
      ctx.lineWidth = 1
      for (const l of links) {
        const a = nodes[l.a]
        const b = nodes[l.b]
        if (!a || !b) continue

        const mx = a.x + (b.x - a.x) * 0.5
        const pulse = prefersReduced ? 0.5 : (Math.sin(t * 0.017 + l.phase) * 0.5 + 0.5)
        const alpha = 0.040 + pulse * 0.060
        ctx.strokeStyle = `rgba(0,255,136,${alpha})`

        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(mx, a.y)
        ctx.lineTo(mx, b.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()

        const dotA = 0.10 + pulse * 0.20
        ctx.fillStyle = `rgba(0,255,136,${dotA})`
        ctx.beginPath()
        ctx.arc(a.x, a.y, 1.4, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(b.x, b.y, 1.4, 0, Math.PI * 2)
        ctx.fill()

        if (!prefersReduced && pulse > 0.92) {
          const p = (pulse - 0.92) / 0.08
          const x = a.x + (b.x - a.x) * p
          const y = a.y + (b.y - a.y) * p
          ctx.fillStyle = `rgba(0,255,170,${0.16})`
          ctx.beginPath()
          ctx.arc(x, y, 1.9, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      drawGrid()
      drawCircuit()
      t += 1
      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="robotic-bg-canvas" aria-hidden="true" />
}
