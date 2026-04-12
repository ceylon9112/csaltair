import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  as?: 'div' | 'section'
}

export function GlassCard({ children, className = '', as: Tag = 'div' }: Props) {
  return (
    <Tag className={`glass-panel rounded-3xl p-5 ${className}`}>{children}</Tag>
  )
}
