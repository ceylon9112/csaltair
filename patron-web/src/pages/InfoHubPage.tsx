import { Link } from 'react-router-dom';

const rows = [
  { to: '/info/section/info_dates', label: 'Dates & gate hours' },
  { to: '/info/section/info_health', label: 'Health & safety' },
  { to: '/info/section/info_parking', label: 'Parking' },
  { to: '/info/section/info_faq', label: 'FAQ — re-entry' },
  { to: '/info/settings', label: 'Settings' },
] as const;

export function InfoHubPage() {
  return (
    <div className="page">
      <h1 className="title">Info</h1>
      <p className="muted">Guest mode — works offline after first load (Vite build).</p>
      <div className="stack" style={{ marginTop: 16 }}>
        {rows.map((r) => (
          <Link key={r.to} to={r.to} className="card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span className="subtitle">{r.label}</span>
            <span className="caption" style={{ float: 'right' }}>
              ›
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
