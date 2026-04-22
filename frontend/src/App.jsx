import { NavLink, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Analytics from './pages/Analytics.jsx';
import SystemFlow from './pages/SystemFlow.jsx';
import MaintenanceLogs from './pages/MaintenanceLogs.jsx';

const navItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Analytics', to: '/analytics' },
  { label: 'System Flow', to: '/system-flow' },
  { label: 'Maintenance Logs', to: '/maintenance' }
];

export default function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="dot" />
          <div>
            <p className="brand-title">MoldSense IoT</p>
            <p className="brand-subtitle">Monitoring System</p>
          </div>
        </div>
        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p>Project Modules</p>
          <ul>
            <li>Inferential Statistics</li>
            <li>CNDC Architecture</li>
            <li>SQL Queries</li>
            <li>ER Diagram</li>
          </ul>
        </div>
      </aside>
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/system-flow" element={<SystemFlow />} />
          <Route path="/maintenance" element={<MaintenanceLogs />} />
        </Routes>
      </main>
    </div>
  );
}

