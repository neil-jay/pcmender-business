import { useEffect, useRef, useState } from 'react'

const LINES = [
  'DHCP: renewing lease',
  'DNS: resolving api.pcmender.local',
  'ARP: discovering gateway',
  'ICMP: ping gateway',
  'TLS: handshake complete',
  'HTTP: 200 OK',
  'Firewall: rule allow :443',
  'NTP: time sync ok',
  'CDN: edge cache HIT',
  'Throughput: 94 Mbps',
  'Latency: 12 ms',
  'Packet loss: 0.2%',
  'Traceroute: hop 7 reached',
  'Port scan: 22 closed',
  'WAF: no anomalies',
  'DNSSEC: valid',
  'DoH: enabled',
  'IPv6: link-local active'
]

function stamp() {
  const d = new Date()
  const hh = d.getHours().toString().padStart(2, '0')
  const mm = d.getMinutes().toString().padStart(2, '0')
  const ss = d.getSeconds().toString().padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

export default function NetworkTicker() {
  const [lines, setLines] = useState<string[]>([])
  const iRef = useRef(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const every = reduced ? 2000 : 900
    const t = window.setInterval(() => {
      const i = iRef.current % LINES.length
      const msg = `[${stamp()}] ${LINES[i]}`
      setLines(prev => [...prev.slice(-18), msg])
      iRef.current += 1
    }, every)
    return () => window.clearInterval(t)
  }, [])

  return (
    <div className="ticker-overlay-corner">
      <div className="ticker-inner">
        {lines.map((l, idx) => (
          <div key={idx} className="ticker-line">{l}</div>
        ))}
      </div>
    </div>
  )
}
