
import icon from '../../assets/icons/userIcon.png';
import logo from '../../assets/icons/logo.png';
import '../../assets/styles/navbar.css';

function Navbar() {
  return (
    <div>
        <nav className="navbar navbar-expand-lg bg- pt-0 pb-0">
  <div className="container-fluid">
    <a className="navbar-brand" href="#"><img src={logo} alt="lopgo" className="logo" /> MealCare</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarText">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <a className="nav-link" href="#">Home</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Meal Plan</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Shopping List</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Setting</a>
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



      {/* <nav className="navbar navbar-expand-lg bg-light">
  <div className="container-fluid">
    <a className="navbar-brand" href="#">MealCare</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div className="navbar-nav">
        <a className="nav-link" aria-current="page" href="#">Home</a>
        <a className="nav-link" href="#">Meal Plan</a>
        <a className="nav-link" href="#">Shopping List</a>
        <a className="nav-link" href="#">Setting</a>
      </div>
    </div>
  </div>
</nav> */}
    </div>
  )
}

export default Navbar
