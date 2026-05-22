import { FieldHelp } from './FieldHelp'

export function Field({
  label,
  required,
  error,
  hint,
  helpText,
  children,
}: {
  label: string
  required?: boolean
  error?: string
  hint?: string
  helpText?: string
  children: React.ReactNode
}) {
  return (
    <label className="field">
      <span className="field-label-row">
        <span className="field-label">
          {label}
          {required && <span className="required">*</span>}
        </span>
        {helpText && <FieldHelp description={helpText} />}
      </span>
      {children}
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error">{error}</span>}
    </label>
  )
}

export function NumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix,
  suffix,
  disabled,
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  prefix?: string
  suffix?: string
  disabled?: boolean
}) {
  return (
    <div className="input-wrap">
      {prefix && <span className="input-affix">{prefix}</span>}
      <input
        type="number"
        value={Number.isFinite(value) ? value : ''}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {suffix && <span className="input-affix">{suffix}</span>}
    </div>
  )
}

export function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="text"
      className="text-input"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

export function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="section">
      <h2>{title}</h2>
      <div className="section-grid">{children}</div>
    </section>
  )
}
