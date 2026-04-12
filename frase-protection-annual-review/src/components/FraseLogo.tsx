type Props = {
  /** Light panel behind logo so colors read correctly on dark UI */
  variant?: 'on-light-panel' | 'bare'
  /** Tighter banner for wizard / inline use */
  compact?: boolean
  className?: string
}

export function FraseLogo({ variant = 'on-light-panel', compact = false, className = '' }: Props) {
  const imgClasses = compact
    ? 'mx-auto h-8 w-auto max-h-8 max-w-[148px] object-contain object-center sm:max-w-[160px]'
    : 'mx-auto h-auto max-h-10 w-full max-w-[200px] object-contain object-center sm:max-h-11 sm:max-w-[220px]'

  const img = (
    <img
      src="/frase-logo.png"
      alt="Frase Protection — A Guardian Alarm Company"
      width={220}
      height={80}
      className={imgClasses}
      loading="eager"
      decoding="async"
    />
  )

  if (variant === 'bare') {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        {img}
      </div>
    )
  }

  const panel = compact
    ? 'rounded-lg border border-slate-200/80 bg-white px-2.5 py-1.5 shadow-sm shadow-slate-900/10'
    : 'rounded-xl border border-slate-200/80 bg-white px-3 py-2 shadow-md shadow-slate-900/10'

  return (
    <div
      className={`mx-auto flex w-fit max-w-full flex-col items-center justify-center text-center ${panel} ${className}`}
    >
      {img}
    </div>
  )
}
