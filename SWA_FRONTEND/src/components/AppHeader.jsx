import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function NavButton({ to, label, currentPath }) {
  const active = currentPath === to;
  return (
    <Link className={active ? "app-nav-link active" : "app-nav-link"} to={to}>
      {label}
    </Link>
  );
}

export default function AppHeader() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="app-header__brand" onClick={() => navigate("/")}>
        <div className="app-header__logo">SW</div>
        <div>
          <p className="app-header__kicker">Student Wellbeing Platform</p>
          <h1 className="app-header__title">Mental Health Support</h1>
        </div>
      </div>

      {user ? (
        <div className="app-header__actions">
          <nav className="app-nav">
            <NavButton to="/" label="Home" currentPath={location.pathname} />
            {user.role === "student" && (
              <>
                <NavButton to="/assessment" label="Assessment" currentPath={location.pathname} />
                <NavButton to="/appointments" label="Counselor" currentPath={location.pathname} />
                <NavButton to="/crisis" label="Crisis" currentPath={location.pathname} />
              </>
            )}
            {user.role === "counselor" && (
              <NavButton to="/counselor" label="Counselor Dashboard" currentPath={location.pathname} />
            )}
            {user.role === "admin" && (
              <NavButton to="/admin" label="Admin Dashboard" currentPath={location.pathname} />
            )}
          </nav>

          <div className="app-header__user">
            <span>{user.name}</span>
            <small>{user.role}</small>
          </div>

          <button
            className="app-header__logout"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="app-header__actions">
          <Link className="app-nav-link active" to="/login">
            Login
          </Link>
        </div>
      )}
    </header>
  );
}
