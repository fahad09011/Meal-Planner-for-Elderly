
import icon from '../../assets/icons/userIcon.png';
import logo from '../../assets/icons/logo.png';
import '../../assets/styles/navbar.css';
import { NavLink, Link } from "react-router-dom";

function Navbar() {
  return (
    <div>
        <nav className="navbar navbar-expand-lg bg- pt-0 pb-0">
  <div className="container-fluid">
    <NavLink className="navbar-brand" to="/home"><img src={logo} alt="lopgo" className="logo" /> MealCare</NavLink>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarText">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <NavLink className="nav-link" to="/home">Home</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/mealPlan">Meal Plan</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/browseMeals">Browse Meals </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/shopping">Shopping List</NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/profile">Profile</NavLink>
        </li>
      </ul>
      <div className="infoContainer">
        <img src={icon} alt="icon" className="userIcon" />
 <span className="navbar-text">
        {`Muhamad Fahad`}
      </span>
      </div>
     
    </div>
  </div>
</nav>
    </div>
  )
}

export default Navbar
