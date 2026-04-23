import { useContext, useEffect, useState } from "react";
import icon from "../../assets/icons/userIcon.png";
import logo from "../../assets/icons/logo.png";
import "../../assets/styles/navBar.css";
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
    canActAsCaregiver
  } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setNavOpen(false));
  }, [location.pathname]);

  const displayLabel =
  user?.user_metadata?.full_name?.trim() || user?.email || "";

  async function handleSignOut() {
    await signOut();
    navigate("/login");
  }

  return (
    <nav className="navbar navbar-light app-navbar pt-0 pb-0" aria-label="Site header">
      <div className="container-fluid app-navbar__inner">
        <div className="app-navbar__row">
          <NavLink className="navbar-brand" to="/home">
            <img src={logo} alt="MealCare logo" className="logo" /> MealCare
          </NavLink>

          <button
            className="navbar-toggler d-lg-none"
            type="button"
            onClick={() => setNavOpen((open) => !open)}
            aria-controls="app-navbar-collapse"
            aria-expanded={navOpen}
            aria-label={navOpen ? "Close menu" : "Open menu"}>
            
            <span className="navbar-toggler-icon" />
          </button>

          <div
            id="app-navbar-collapse"
            className={`app-navbar__collapse${navOpen ? " app-navbar__collapse--open" : ""}`}>
            
            <ul className="navbar-nav app-navbar__nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/home">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/mealPlan">
                  Meal Plan
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/viewPlan">
                  View Plan
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/shopping">
                  Shopping
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/profile">
                  Profile
                </NavLink>
              </li>
              {user && canActAsCaregiver ?
              <li className="nav-item">
                  <NavLink className="nav-link" to="/caregiving">
                    Caregiving
                  </NavLink>
                </li> :
              null}
            </ul>

            <div className="infoContainer app-navbar__account">
              {user &&
              canActAsCaregiver &&
              careLinksLoaded &&
              careRecipients.length > 0 ?
              <>
                  <span className="navbar-user-avatar" title={displayLabel || undefined}>
                    <img src={icon} alt="" className="userIcon" width={36} height={36} />
                  </span>
                  <select
                  id="navbar-care-select"
                  name="viewingClientUserId"
                  className="navbar-care-select"
                  value={selectedClientUserId ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;
                    setSelectedClientUserId(value === "" ? null : value);
                  }}
                  title="Whose meal plan and shopping list to show"
                  aria-label="Whose meal plan and shopping list to show. Choose Myself or a linked care recipient.">
                  
                    <option value="">Myself</option>
                    {careRecipients.map((row) =>
                  <option key={row.id} value={row.elderly_user_id}>
                        {row.elderly_name?.trim() ?
                    row.elderly_name :
                    `Care recipient…${row.elderly_user_id.slice(0, 8)}`}
                      </option>
                  )}
                  </select>
                </> :

              <div className="navbar-userIdentity">
                  <img src={icon} alt="" className="userIcon" width={36} height={36} />
                  <span className="navbar-text" title={displayLabel || undefined}>
                    {authLoading ? "…" : displayLabel || "Not signed in"}
                  </span>
                </div>
              }
              {user ?
              <button type="button" className="navSignOut" onClick={handleSignOut}>
                  Sign out
                </button> :

              <NavLink className="navSignOut navSignOut--link" to="/login">
                  Log in
                </NavLink>
              }
            </div>
          </div>
        </div>
      </div>
    </nav>);

}

export default Navbar;