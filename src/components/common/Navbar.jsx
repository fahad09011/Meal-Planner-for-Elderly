import { useContext, useEffect, useState } from "react";
import icon from '../../assets/icons/userIcon.png';
import logo from '../../assets/icons/logo.png';
import '../../assets/styles/navBar.css';
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AppContext } from "../../hooks/AppContext";

function Navbar() {
  const { user, authLoading, signOut } = useAuth();
  const {
    careRecipients,
    careLinksLoaded,
    selectedClientUserId,
    setSelectedClientUserId,
    canActAsCaregiver,
  } = useContext(AppContext);
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
          <NavLink className="nav-link" to="/viewPlan">
            View meal plan
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/shopping">Shopping List</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/profile">Profile</NavLink>
        </li>
        {user && canActAsCaregiver ? (
          <li className="nav-item">
            <NavLink className="nav-link" to="/caregiving">Caregiving</NavLink>
          </li>
        ) : null}
        <li className="nav-item">
          <NavLink className="nav-link" to="/login">
            {user ? "Account" : "Log in"}
          </NavLink>
        </li>
      </ul>
      <div className="infoContainer">
        {user && canActAsCaregiver && careLinksLoaded && careRecipients.length > 0 ? (
          <div className="navbar-care-wrap">
            <label className="navbar-care-label" htmlFor="navbar-care-select">
              Viewing
            </label>
            <select
              id="navbar-care-select"
              className="navbar-care-select"
              value={selectedClientUserId ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setSelectedClientUserId(v === "" ? null : v);
              }}
              aria-label="Whose meal plan and lists to show"
            >
              <option value="">Myself</option>
              {careRecipients.map((row) => (
                <option key={row.id} value={row.elderly_user_id}>
                  Care recipient…{row.elderly_user_id.slice(0, 8)}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        <div className="navbar-userIdentity">
          <img src={icon} alt="" className="userIcon" width={36} height={36} />
          <span className="navbar-text" title={displayLabel || undefined}>
            {authLoading ? "…" : displayLabel || "Not signed in"}
          </span>
        </div>
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
