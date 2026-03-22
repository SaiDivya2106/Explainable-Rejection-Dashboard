import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg custom-navbar px-4">

      {/* Logo */}
      <span className="navbar-brand fw-bold text-white">
        🧠 Interview Insights AI
      </span>

      {/* Center Links */}
      <div className="mx-auto nav-links">

        <Link 
          className={`nav-item ${location.pathname === "/" ? "active-link" : ""}`} 
          to="/"
        >
          Dashboard
        </Link>

        <Link 
          className={`nav-item ${location.pathname === "/transcript" ? "active-link" : ""}`} 
          to="/transcript"
        >
          Transcript Analysis
        </Link>

        <Link 
          className={`nav-item ${location.pathname === "/competency" ? "active-link" : ""}`} 
          to="/competency"
        >
          Competency Report
        </Link>

        <Link 
          className={`nav-item ${location.pathname === "/bias" ? "active-link" : ""}`} 
          to="/bias"
        >
          Bias & Fairness
        </Link>

        <Link 
          className={`nav-item ${location.pathname === "/insights" ? "active-link" : ""}`} 
          to="/insights"
        >
          Insights
        </Link>

      </div>

      {/* ✅ RIGHT SIDE FIXED */}
      <Link
        to="/candidate"
        className={`text-white fw-semibold text-decoration-none ${
          location.pathname === "/candidate" ? "active-link" : ""
        }`}
      >
        👤 Candidate View
      </Link>

    </nav>
  );
}

export default Navbar;