import { useEffect, useRef, useState } from 'react'

const BASE_LINES = [
  'Starting diagnostics',
  'Checking disk health',
  'Scanning for malware',
  'Verifying backups',
  'Updating drivers',
  'Hardening firewall',
  'Optimizing startup',
  'Finalizing report'
]

function now() {
  return new Date().toLocaleTimeString()
}

export default function ProcessTicker() {
  const [lines, setLines] = useState<string[]>([])
  const idxRef = useRef(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const intervalMs = reduced ? 2000 : 900

    const iv = window.setInterval(() => {
      const i = idxRef.current % BASE_LINES.length
      const dots = '.'.repeat((idxRef.current % 3) + 1)
      const msg = `[${now()}] ${BASE_LINES[i]}${dots}`
      setLines((prev) => {
        const next = [...prev.slice(-8), msg]
        return next
      })
      idxRef.current += 1
    }, intervalMs)

    return () => window.clearInterval(iv)
  }, [])

  return (
    <div className="font-mono text-xs sm:text-sm">
      <ul className="space-y-1">
        {lines.map((l, i) => (
          <li key={i} className="opacity-80">{l}</li>
        ))}
      </ul>
    </div>
  )
}
