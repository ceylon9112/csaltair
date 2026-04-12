import { useEffect, useRef } from 'react'

type Props = {
  label: string
  value: string
  onChange: (dataUrl: string) => void
}

export function SignaturePad({ label, value, onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const w = canvas.width
    const h = canvas.height
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, w, h)
    if (value) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, w, h)
      }
      img.src = value
    }
  }, [value])

  function pos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!
    const r = canvas.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    return {
      x: ((clientX - r.left) / r.width) * canvas.width,
      y: ((clientY - r.top) / r.height) * canvas.height,
    }
  }

  function start(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault()
    drawing.current = true
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return
    ctx.strokeStyle = '#0c1929'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    const { x, y } = pos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  function move(e: React.MouseEvent | React.TouchEvent) {
    if (!drawing.current) return
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return
    const { x, y } = pos(e)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  function end() {
    if (!drawing.current) return
    drawing.current = false
    const canvas = canvasRef.current
    if (canvas) onChange(canvas.toDataURL('image/png'))
  }

  function clear() {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    onChange('')
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-white/90">{label}</p>
        <button
          type="button"
          onClick={clear}
          className="text-sm text-frase-blue-light underline-offset-2 hover:underline"
        >
          Clear
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={560}
        height={160}
        className="w-full max-w-full touch-none rounded-xl border border-white/20 bg-white"
        onMouseDown={start}
        onMouseMove={move}
        onMouseUp={end}
        onMouseLeave={end}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
      />
    </div>
  )
}
