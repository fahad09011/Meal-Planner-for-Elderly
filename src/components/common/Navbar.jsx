import { useEffect, useState } from "react";
import icon from '../../assets/icons/userIcon.png';
import logo from '../../assets/icons/logo.png';
import '../../assets/styles/navBar.css';
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    setNavOpen(false);
  }, [location.pathname]);

  const displayLabel =
    user?.user_metadata?.full_name?.trim() || user?.email || "";

  async function handleSignOut() {
    await signOut();
    navigate("/login");
  }

  return (
    <div>
        <nav className="navbar navbar-expand-lg navbar-light pt-0 pb-0">
  <div className="container-fluid">
    <NavLink className="navbar-brand" to="/home"><img src={logo} alt="MealCare logo" className="logo" /> MealCare</NavLink>
    <button
      className="navbar-toggler"
      type="button"
      onClick={() => setNavOpen((open) => !open)}
      aria-controls="navbarText"
      aria-expanded={navOpen}
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className={`collapse navbar-collapse${navOpen ? " show" : ""}`} id="navbarText">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <NavLink className="nav-link" to="/home">Home</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/mealPlan">Meal Plan</NavLink>
        </li>
        {/* Iteration 2 — Browse Meals not implemented yet
        <li className="nav-item">
          <NavLink className="nav-link" to="/browseMeals">Browse Meals </NavLink>
        </li>
        */}
        <li className="nav-item">
          <NavLink className="nav-link" to="/viewPlan">View Meal Plan </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/shopping">Shopping List</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/profile">Profile</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/login">
            {user ? "Account" : "Log in"}
          </NavLink>
        </li>
      </ul>
      <div className="infoContainer">
        <img src={icon} alt="" className="userIcon" />
        <span className="navbar-text" title={displayLabel || undefined}>
          {authLoading ? "…" : displayLabel || "Not signed in"}
        </span>
        {user ? (
          <button
            type="button"
            className="navSignOut"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        ) : null}
      </div>
     
    </div>
  </div>
</nav>
    </div>
  )
}

export default Navbar
