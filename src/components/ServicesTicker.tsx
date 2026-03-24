import { useEffect, useRef, useState } from 'react'

const LINES = [
  'Diagnostics: full hardware & software check',
  'Hardware repair: SSD/RAM/PSU replacements',
  'OS reinstall & optimization',
  'Virus & malware removal',
  'Data recovery & backup strategy',
  'Network setup: Wi‑Fi, cabling, printers',
  'Performance tuning & cleanup',
  'UPS & power health checks'
]

function ts() {
  const d = new Date()
  return d.toLocaleTimeString()
}

export default function ServicesTicker() {
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
    <div className="ticker-overlay-right">
      <div className="ticker-inner">
        {lines.map((l, i) => (
          <div className="ticker-line" key={i}>{l}</div>
        ))}
      </div>
    </div>
  )
}
