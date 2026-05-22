import { Link } from 'react-router-dom'
import { HeaderBanner } from '../components/HeaderBanner'
import { VERTICAL_LABELS } from '../data/verticals'
import { verticalPath } from '../lib/routes'
import type { VerticalId } from '../types'

const VERTICALS = Object.keys(VERTICAL_LABELS) as VerticalId[]

export function VerticalPickerPage() {
  return (
    <div className="app">
      <HeaderBanner
        title="Security ROI Calculator"
        subtitle={
          <p className="subtitle">
            Select a business vertical to load tailored defaults. Employee hourly cost and ROI
            thresholds can be adjusted before each calculation.
          </p>
        }
      />
      <section className="section vertical-picker">
        <h2>Select Business Vertical</h2>
        <div className="vertical-grid">
          {VERTICALS.map((id) => (
            <Link key={id} to={verticalPath(id)} className="vertical-card vertical-card-link">
              <strong>{VERTICAL_LABELS[id]}</strong>
              <span>Load {VERTICAL_LABELS[id]} defaults</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
