import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home', icon: '⌂' },
  { to: '/lineup', label: 'Lineup', icon: '♪' },
  { to: '/map', label: 'Map', icon: '▦' },
  { to: '/schedule', label: 'Schedule', icon: '▣' },
  { to: '/info', label: 'Info', icon: 'ⓘ' },
] as const;

export function AppShell() {
  return (
    <div className="fest-shell">
      <div className="fest-bg" aria-hidden>
        <span className="fest-orb fest-orb--a" />
        <span className="fest-orb fest-orb--b" />
        <span className="fest-orb fest-orb--c" />
      </div>
      <main className="fest-main">
        <Outlet />
      </main>
      <nav className="tabs" aria-label="Main">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => (isActive ? 'active' : undefined)}>
            <span aria-hidden>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
