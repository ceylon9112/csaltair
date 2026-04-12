type Props = {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  rows?: number
}

export function Field({ label, value, onChange, placeholder, type = 'text', rows }: Props) {
  const base =
    'w-full rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-white placeholder:text-white/35 focus:border-frase-blue-light/60 focus:outline-none focus:ring-2 focus:ring-frase-blue/35'

  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-white/80">{label}</span>
      {rows ? (
        <textarea
          className={`${base} min-h-[88px] resize-y`}
          value={value}
          placeholder={placeholder}
          rows={rows}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          className={base}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  )
}
