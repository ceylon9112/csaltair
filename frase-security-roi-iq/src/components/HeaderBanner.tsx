import type { ReactNode } from 'react'

type Props = {
  compact?: boolean
  className?: string
}

export function FraseProtectionLogo({ compact = false, className = '' }: Props) {
  return (
    <div className={`header-logo-panel ${compact ? 'header-logo-panel-compact' : ''} ${className}`}>
      <img
        src="./frase-protection-logo.png"
        alt="Frase Protection — A Guardian Alarm Company"
        className={`header-logo ${compact ? 'header-logo-compact' : ''}`}
        width={220}
        height={80}
        loading="eager"
        decoding="async"
      />
    </div>
  )
}

export function HeaderBanner({
  title,
  subtitle,
  businessName,
  printOnlyEyebrow = false,
}: {
  title: string
  subtitle?: ReactNode
  businessName?: string
  printOnlyEyebrow?: boolean
}) {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-copy">
          {printOnlyEyebrow ? (
            <p className="eyebrow print-only">Frase Protection</p>
          ) : (
            <p className="eyebrow">Frase Protection</p>
          )}
          <h1>{title}</h1>
          {businessName && <p className="business-name print-only">{businessName}</p>}
          {subtitle}
        </div>
        <FraseProtectionLogo />
      </div>
    </header>
  )
}
