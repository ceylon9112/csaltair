import type { ReactNode } from 'react'

type Props = {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

export function StepShell({ title, subtitle, children, footer }: Props) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="mb-5 shrink-0">
        <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h2>
        {subtitle ? <p className="mt-2 text-sm leading-relaxed text-white/70">{subtitle}</p> : null}
      </header>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pb-4">{children}</div>
      {footer ? <div className="mt-auto shrink-0 border-t border-white/10 pt-4">{footer}</div> : null}
    </div>
  )
}
