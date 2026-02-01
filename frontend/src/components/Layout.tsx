import { NavLink } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="app-shell">
      <header className="app-header" role="banner">
        <nav className="app-nav" aria-label="Main navigation">
          <NavLink to="/tickets" className="nav-logo">
            <span className="nav-logo-text">Support Desk</span>
          </NavLink>

          <ul className="nav-links" role="list">
            <li>
              <NavLink
                to="/tickets"
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                aria-current={undefined}
              >
                Tickets
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tickets/new"
                className={({ isActive }) =>
                  `nav-link nav-link-cta ${isActive ? "active" : ""}`
                }
              >
                + New
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="app-main" id="main-content">
        {children}
      </main>
    </div>
  );
}
