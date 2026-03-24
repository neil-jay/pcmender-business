import { useEffect, useRef, useState } from 'react'

type Props = {
  text: string
  className?: string
  speed?: number
  trigger?: 'auto' | 'hover'
}

const CHARS = '█▓▒░01<>[]{}$#@*+-=;:.ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

export default function DecryptText({ text, className = '', speed = 35, trigger = 'auto' }: Props) {
  const [display, setDisplay] = useState(text)
  const timerRef = useRef<number | null>(null)

  const start = () => {
    if (timerRef.current) window.clearInterval(timerRef.current)
    let progress = 0
    const len = text.length
    timerRef.current = window.setInterval(() => {
      progress = Math.min(progress + 1, len)
      const next = Array.from(text)
        .map((c, i) => {
          if (c === ' ') return ' '
          return i < progress ? c : CHARS[Math.floor(Math.random() * CHARS.length)]
        })
        .join('')
      setDisplay(next)
      if (progress >= len && timerRef.current) {
        window.clearInterval(timerRef.current)
        timerRef.current = null
      }
    }, speed)
  }

  useEffect(() => {
    if (trigger === 'auto') start()
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [text, speed, trigger])

  return (
    <h2
      className={className}
      onMouseEnter={trigger === 'hover' ? start : undefined}
      onFocus={trigger === 'hover' ? start : undefined}
    >
      {display}
    </h2>
  )
}
