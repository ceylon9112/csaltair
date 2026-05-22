import { useEffect, useId, useRef, useState } from 'react'

export function FieldHelp({ description }: { description: string }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLSpanElement>(null)
  const popupId = useId()

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  return (
    <span className="field-help" ref={rootRef}>
      <button
        type="button"
        className="field-help-trigger"
        aria-label="Show field explanation"
        aria-expanded={open}
        aria-controls={popupId}
        onClick={() => setOpen((prev) => !prev)}
      >
        <svg
          className="field-help-icon"
          viewBox="0 0 20 20"
          width="16"
          height="16"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="10" cy="10" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <text x="10" y="14" textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor">
            ?
          </text>
        </svg>
      </button>
      {open && (
        <span id={popupId} role="tooltip" className="field-help-popup">
          {description}
        </span>
      )}
    </span>
  )
}
