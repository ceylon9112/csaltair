type Props = {
  label: string
  checked: boolean
  onChange: (next: boolean) => void
  hint?: string
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function TapCheck({ label, checked, onChange, hint }: Props) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={`w-full rounded-2xl border px-4 py-3.5 text-left transition active:scale-[0.99] ${
        checked
          ? 'border-frase-blue-light/50 bg-frase-blue/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
          : 'border-white/15 bg-white/[0.04] hover:bg-white/[0.07]'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-2 ${
            checked ? 'border-frase-blue-light bg-frase-blue text-white' : 'border-white/25 bg-white/5 text-transparent'
          }`}
          aria-hidden
        >
          <CheckIcon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-base font-medium leading-snug text-white">{label}</div>
          {hint ? <p className="mt-1 text-sm leading-relaxed text-white/60">{hint}</p> : null}
        </div>
      </div>
    </button>
  )
}
