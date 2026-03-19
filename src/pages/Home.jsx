import React from "react";
import homeImage from "../assets/images/homeScreenMainImage.png";
import "../assets/styles/home.css";
import HomeButton from "../components/common/HomeButton";
import mealButtonIcon     from "../assets/images/mealButtonIcon.png";
import careButtonIcon     from "../assets/images/careButtonIcon.png";
import profileButtonIcon  from "../assets/images/profileButtonIcon.png";
import shoppingButtonIcon from "../assets/images/shoppingButtonIcon.png";
import { NavLink } from "react-router-dom";

const NAV_BUTTONS = [
  { to: "/mealPlan",     icon: mealButtonIcon,     title: "Create Meal Plan", cls: "div1" },
  { to: "/profile",      icon: profileButtonIcon,  title: "My Profile",       cls: "div2" },
  { to: "/shoppingList", icon: shoppingButtonIcon, title: "Shopping List",    cls: "div3" },
  { to: "/caregiver",    icon: careButtonIcon,      title: "Care Giver",      cls: "div4" },
];

function Home() {
  return (
    <main
      className="homeMainContainer"
      style={{ backgroundImage: `url(${homeImage})` }}
    >
      <div className="homeButtonContainer">
        {NAV_BUTTONS.map(({ to, icon, title, cls }) => (
          <NavLink key={to} to={to} className={`homeNavLink ${cls}`}>
            <HomeButton icon={icon} title={title} />
          </NavLink>
        ))}
      </div>
    </main>
  );
}

export default Home;