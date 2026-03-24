type Props = {
  text: string
  className?: string
}

export default function GlitchText({ text, className = '' }: Props) {
  return (
    <h1 className={`glitch ${className}`} data-text={text}>
      {text}
    </h1>
  )
}
