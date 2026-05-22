import type { OutcomeLabel } from '../types'

const OUTCOME_CLASS: Record<OutcomeLabel, string> = {
  'Strong ROI Case': 'outcome-strong',
  'Moderate ROI Case': 'outcome-moderate',
  'Weak ROI Case': 'outcome-weak',
  'Inconclusive — Insufficient Data': 'outcome-inconclusive',
}

export function OutcomeBadge({
  outcome,
  text,
}: {
  outcome: OutcomeLabel
  text: string
}) {
  const showCallout =
    outcome === 'Weak ROI Case' || outcome === 'Inconclusive — Insufficient Data'

  return (
    <div className={`outcome-block ${OUTCOME_CLASS[outcome]}`}>
      <div className="outcome-badge">{outcome}</div>
      <p className="outcome-text">{text}</p>
      {showCallout && (
        <div className="outcome-callout">
          The numbers as entered do not support a strong ROI case. Review the assumptions or
          consider whether this system configuration is the right fit.
        </div>
      )}
    </div>
  )
}
