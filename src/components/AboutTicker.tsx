import { useEffect, useRef, useState } from 'react'

const LINES = [
  'PC Mender: on-site & remote support',
  'Fast diagnostics and clear reports',
  'Data backup and recovery best-practices',
  'Security-first: patching, hardening, WAF',
  'Network setup: routers, Wi‑Fi, VLAN basics',
  'Transparent pricing, no surprises',
  'Mission: keep your systems reliable'
]

function ts() {
  const d = new Date()
  return d.toLocaleTimeString()
}

export default function AboutTicker() {
  const [lines, setLines] = useState<string[]>([])
  const iRef = useRef(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const every = reduced ? 2200 : 1100

    const seedCount = Math.min(8, LINES.length)
    const seeded = new Array(seedCount).fill(0).map((_, idx) => `[${ts()}] ${LINES[idx]}`)
    setLines(seeded)
    iRef.current = seedCount

    const t = window.setInterval(() => {
      const i = iRef.current % LINES.length
      const msg = `[${ts()}] ${LINES[i]}`
      setLines(prev => [...prev.slice(-14), msg])
      iRef.current += 1
    }, every)
    return () => window.clearInterval(t)
  }, [])

  return (
    <div className="ticker-overlay-left">
      <div className="ticker-inner">
        {lines.map((l, i) => (
          <div className="ticker-line" key={i}>{l}</div>
        ))}
      </div>
    </div>
  )
}
