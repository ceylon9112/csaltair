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
    <>
      <Outlet />
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
    </>
  );
}
